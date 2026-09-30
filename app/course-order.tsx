'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useCourseAccount } from './course-account';
import { parsePersonalCourse, personalCourseSnapshot, publishedPersonalCourse, type CourseEdit, type EditRequest, type PersonalCourse, type Placement } from './personal-course-model';

export type EditorIntent = ({ type: 'add' } & Placement) | { type: 'move' | 'edit' | 'restore'; id: string; destination?: Placement } | { type: 'delete'; id: string } | { type: 'archive' };
export type EditResult = { ok: boolean; state?: PersonalCourse; operationId?: string; error?: string; existingId?: string };
const initial = personalCourseSnapshot(publishedPersonalCourse);
type CourseOrderContextValue = typeof initial & {
  state: PersonalCourse; ready: boolean; busy: boolean; error: string;
  intent: EditorIntent | null; openEditor: (intent: EditorIntent | null) => void;
  refresh: () => Promise<PersonalCourse | null>;
  commit: (edit: CourseEdit) => Promise<EditResult>;
  undo: () => Promise<EditResult>; canUndo: boolean;
  notice: string; dismissNotice: () => void;
};
const CourseOrderContext = createContext<CourseOrderContextValue>({ ...initial, state: publishedPersonalCourse, ready: false, busy: false, error: '', intent: null,
  openEditor: () => {}, refresh: async () => null, commit: async () => ({ ok: false }), undo: async () => ({ ok: false }), canUndo: false, notice: '', dismissNotice: () => {} });
export const useCourseOrder = () => useContext(CourseOrderContext);
export function CourseOrderProvider({ children }: { children: ReactNode }) {
  const { user } = useCourseAccount();
  const [state, setState] = useState(publishedPersonalCourse);
  const stateRef = useRef(state);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [intent, setIntent] = useState<EditorIntent | null>(null);
  const [undoIds, setUndoIds] = useState<string[]>([]);
  const pending = useRef<{ fingerprint: string; request: EditRequest } | null>(null);
  const sequence = useRef(0);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const accept = useCallback((next: PersonalCourse) => {
    if (!mounted.current || next.revision < stateRef.current.revision) return;
    if (next.revision !== stateRef.current.revision) window.dispatchEvent(new Event('personal-course-changed'));
    stateRef.current = next; setState(next); setReady(true);
  }, []);
  const refresh = useCallback(async () => {
    if (!user || saving.current) return null;
    const requestId = ++sequence.current;
    try {
      const response = await fetch('/api/personal-course', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const next = parsePersonalCourse(data);
      if (requestId !== sequence.current || !mounted.current) return null;
      accept(next); setError(''); return next;
    } catch (value) {
      if (requestId === sequence.current && mounted.current) setError(value instanceof Error ? value.message : 'Your course could not be loaded. Please retry.');
      return null;
    }
  }, [user, accept]);
  useEffect(() => {
    const timer = window.setTimeout(() => { void refresh(); }, 0);
    const onFocus = () => { void refresh(); };
    window.addEventListener('focus', onFocus);
    return () => { window.clearTimeout(timer); window.removeEventListener('focus', onFocus); };
  }, [refresh]);
  const resolved = useMemo(() => personalCourseSnapshot(state), [state]);
  const commit = useCallback(async (edit: CourseEdit): Promise<EditResult> => {
    if (!user || !ready || saving.current) return { ok: false, error: 'Wait for your course to finish loading or saving.' };
    saving.current = true; setBusy(true); setError(''); ++sequence.current;
    const fingerprint = JSON.stringify(edit);
    const request = pending.current?.fingerprint === fingerprint ? pending.current.request : { operationId: crypto.randomUUID(), revision: stateRef.current.revision, edit };
    pending.current = { fingerprint, request };
    const success = (next: PersonalCourse): EditResult => {
      accept(next); pending.current = null; setError('');
      if (edit.type === 'undo') setUndoIds(ids => ids.filter(id => id !== edit.targetOperationId));
      else if (edit.type === 'delete') setUndoIds([]);
      else setUndoIds(ids => [...ids.filter(id => id !== request.operationId), request.operationId].slice(-50));
      const receipt = next.receipts.find(r => r.id === request.operationId);
      const snapshot = personalCourseSnapshot(next);
      const row = snapshot.byId.get(receipt?.affected[0] ?? '');
      setNotice(edit.type === 'undo' ? 'Change undone.' : edit.type === 'delete' ? 'Video permanently removed from your course.' : edit.type === 'archive' ? 'Video archived. Your notes and progress are kept.' : edit.type === 'edit' ? 'Video details saved.' : `${edit.type === 'add' ? 'Video added' : edit.type === 'restore' ? 'Video restored' : 'Video moved'}${row ? ` to ${snapshot.label(row.sectionId)}` : ''}.`);
      if (edit.type === 'archive' || edit.type === 'delete') window.dispatchEvent(new CustomEvent('personal-course-removed', { detail: { id: edit.id } }));
      if (row && edit.type !== 'edit') window.dispatchEvent(new CustomEvent('personal-course-locate', { detail: { id: row.id, moduleId: row.moduleId, sectionId: row.sectionId } }));
      window.dispatchEvent(new Event('personal-course-changed'));
      return { ok: true, state: next, operationId: request.operationId };
    };
    try {
      const response = await fetch('/api/personal-course', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request) });
      const data = await response.json();
      if (!mounted.current) return { ok: false };
      if (!response.ok) {
        const latest = data.state ? parsePersonalCourse(data.state) : undefined;
        if (latest) accept(latest);
        if (response.status < 500) pending.current = null;
        const message = data.error || 'The change could not be saved. Try again.';
        setError(message); return { ok: false, state: latest, error: message, existingId: data.existingId };
      }
      return success(parsePersonalCourse(data));
    } catch {
      // A disconnected response may follow a successful commit. Receipts make
      // the read-back and an explicit retry safe, without duplicating additions.
      try {
        const response = await fetch('/api/personal-course', { cache: 'no-store' });
        if (response.ok) {
          const next = parsePersonalCourse(await response.json());
          if (mounted.current) accept(next);
          if (mounted.current && next.receipts.some(r => r.id === request.operationId)) return success(next);
        }
      } catch { /* Keep the operation ID for an explicit retry. */ }
      const message = 'The change could not be confirmed. Check your connection and retry; your details have been kept.';
      if (mounted.current) setError(message);
      return { ok: false, error: message };
    } finally { saving.current = false; if (mounted.current) setBusy(false); }
  }, [user, ready, accept]);
  const undoId = [...undoIds].reverse().find(id => state.receipts.some(r => r.id === id && !r.undone && r.affected.every(item => state.itemRevisions[item] === r.revision)));
  return <CourseOrderContext.Provider value={{ ...resolved, state, ready, busy, error, refresh, commit, intent,
    openEditor: next => { if (!saving.current) setIntent(next); },
    canUndo: Boolean(undoId), undo: () => undoId ? commit({ type: 'undo', targetOperationId: undoId }) : Promise.resolve({ ok: false }),
    notice, dismissNotice: () => setNotice('') }}>{children}</CourseOrderContext.Provider>;
}
