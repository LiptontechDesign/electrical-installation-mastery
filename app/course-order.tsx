'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { ArrowRightLeft, X } from 'lucide-react';
import { useCourseAccount } from './course-account';
import { courseForOrder, defaultOrder, moveLesson, orderedSections, parseOrder, type LessonMove } from './course-order-model';

const initial = courseForOrder(defaultOrder);
type CourseOrderContextValue = typeof initial & { order: typeof defaultOrder; ready: boolean; error: string;
  refresh: () => Promise<void>; save: (move: LessonMove) => Promise<boolean> };
const CourseOrderContext = createContext<CourseOrderContextValue>({ ...initial, order: defaultOrder, ready: false, error: '',
  refresh: async () => {}, save: async () => false });
export const useCourseOrder = () => useContext(CourseOrderContext);
export function CourseOrderProvider({ children }: { children: ReactNode }) {
  const { user } = useCourseAccount();
  const [order, setOrder] = useState(defaultOrder);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    if (!user) return;
    const requestId = ++sequence.current;
    setReady(false);
    try {
      const response = await fetch('/api/course-order', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      if (requestId !== sequence.current) return;
      setOrder(parseOrder(data)); setReady(true); setError('');
    } catch { if (requestId === sequence.current) { setReady(false); setError('Your course order could not be loaded. Retry before moving a lesson.'); } }
  }, [user]);
  useEffect(() => {
    const initialRequest = window.setTimeout(() => { void refresh(); }, 0);
    const onFocus = () => { void refresh(); };
    window.addEventListener('focus', onFocus);
    return () => { window.clearTimeout(initialRequest); window.removeEventListener('focus', onFocus); };
  }, [refresh]);
  async function save(move: LessonMove) {
    if (!user) return false;
    ++sequence.current;
    let reconciled = false;
    try {
      const response = await fetch('/api/course-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...move, revision: order.revision }) });
      const data = await response.json();
      if (!response.ok) { if (data.order) { setOrder(parseOrder(data.order)); reconciled = true; } throw new Error(data.error); }
      setOrder(parseOrder(data)); setError(''); return true;
    } catch (error) { if (!reconciled) await refresh(); setError(error instanceof Error ? error.message : 'The move could not be saved.'); return false; }
  }
  const resolved = useMemo(() => courseForOrder(order), [order]);
  return <CourseOrderContext.Provider value={{ ...resolved, order, ready, error, refresh, save }}>{children}</CourseOrderContext.Provider>;
}

export function MoveLessonButton({ lessonId, onMoved }: { lessonId: string; onMoved?: (moduleId: string) => void }) {
  const { user } = useCourseAccount();
  const { course, order, sectionsByModule, ready, error, refresh, save } = useCourseOrder();
  const [open, setOpen] = useState(false);
  const [sectionId, setSectionId] = useState('');
  const [beforeId, setBeforeId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [undo, setUndo] = useState<LessonMove | null>(null);
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const groups = orderedSections(order);
  const source = groups.find(s => s.lessonIds.includes(lessonId))!;
  const destination = groups.find(s => s.id === sectionId) ?? source;
  const targetModule = course.modules.find(m => m.id === destination.moduleId)!;
  const lessons = new Map(course.modules.flatMap(m => m.lessons).map(l => [l.id, l]));
  const lesson = lessons.get(lessonId)!;
  const candidates = destination.lessonIds.filter(id => id !== lessonId);
  const validBefore = beforeId === null || candidates.includes(beforeId);
  const preview = validBefore ? orderedSections(moveLesson(order, { lessonId, sectionId: destination.id, beforeId })).find(s => s.id === destination.id)!.lessonIds : [];
  const unchanged = source.id === destination.id && JSON.stringify(preview) === JSON.stringify(source.lessonIds);
  const previewIndex = preview.indexOf(lessonId);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  function begin() {
    setSectionId(source.id); setBeforeId(source.lessonIds[source.lessonIds.indexOf(lessonId) + 1] ?? null);
    setNotice(''); setUndo(null); setOpen(true);
  }
  async function submit(isUndo = false) {
    const previous: LessonMove = { lessonId, sectionId: source.id, beforeId: source.lessonIds[source.lessonIds.indexOf(lessonId) + 1] ?? null };
    setBusy(true);
    const move = isUndo && undo ? undo : { lessonId, sectionId: destination.id, beforeId };
    if (await save(move)) {
      const group = groups.find(s => s.id === move.sectionId)!;
      setUndo(isUndo ? null : previous); setNotice(isUndo ? 'Move undone.' : 'Lesson moved in your course.');
      setSectionId(move.sectionId); setBeforeId(move.beforeId); onMoved?.(group.moduleId);
    }
    setBusy(false);
  }
  if (!user) return null;
  return <>
    <button ref={trigger} type="button" className="move-lesson-button" onClick={begin} data-tooltip="Move this lesson to another module, section or position"><ArrowRightLeft size={16} /> Move lesson</button>
    <dialog ref={dialog} className="move-lesson-dialog" aria-labelledby="move-lesson-title" onCancel={event => { if (busy) event.preventDefault(); }} onClose={() => { setOpen(false); trigger.current?.focus(); }}>
      <div className="move-dialog-heading"><div><span className="eyebrow">Your course editor</span><h2 id="move-lesson-title">Move lesson</h2></div><button type="button" disabled={busy} aria-label="Close move lesson" onClick={() => setOpen(false)}><X size={20} /></button></div>
      <p className="move-lesson-name">{lesson.title}</p><p>Updates only your course. Watched progress, notes and bookmarks stay with this lesson. Supporting videos attached to it follow along.</p>
      <form onSubmit={event => { event.preventDefault(); void submit(); }}>
        <fieldset disabled={busy || !ready}>
          <label>Destination module<select value={destination.moduleId} onChange={event => { setSectionId(sectionsByModule[event.target.value][0].id); setBeforeId(null); setNotice(''); }}>{course.modules.map(m => <option key={m.id} value={m.id}>{m.path} · {m.stageNumber}. {m.title}</option>)}</select></label>
          <label>Section<select value={destination.id} onChange={event => { setSectionId(event.target.value); setBeforeId(null); setNotice(''); }}>{sectionsByModule[destination.moduleId].map(s => <option key={s.id} value={s.id}>{s.number}. {s.title}{s.lessonIds.length === 0 ? ' (empty)' : ''}</option>)}</select></label>
          <label>Position<select value={beforeId ?? ''} onChange={event => { setBeforeId(event.target.value || null); setNotice(''); }}>
            {!validBefore && <option value={beforeId!}>Position changed — choose again</option>}
            {candidates.map((id, i) => <option key={id} value={id}>{i === 0 ? 'At the beginning, before' : 'Before'} {lessons.get(id)!.title}</option>)}
            <option value="">{candidates.length ? 'At the end of this section' : 'First lesson in this section'}</option>
          </select></label>
        </fieldset>
        <div className="move-preview" aria-live="polite"><strong>Preview · {targetModule.path} · Section {destination.number}</strong>{validBefore ? <ol>{preview.slice(Math.max(0, previewIndex - 1), previewIndex + 2).map(id => <li key={id} className={id === lessonId ? 'moving' : ''}>{id === lessonId && <span>Moving here · </span>}{lessons.get(id)!.title}</li>)}</ol> : <p>Choose a new position to preview your move.</p>}</div>
        {source.moduleId !== destination.moduleId && <p className="move-help">This changes module membership and watched totals. Teaching references and exam topics keep their authored subject scope.</p>}
        {error && <div role="alert" className="move-error">{error} <button disabled={busy} type="button" onClick={() => void refresh()}>Refresh order</button></div>}
        {!ready && !error && <p role="status">Loading shared course order…</p>}
        {notice && <p role="status">{notice} {undo && <button type="button" disabled={busy} onClick={() => void submit(true)}>Undo move</button>}</p>}
        <div className="move-dialog-actions"><button type="button" disabled={busy} onClick={() => setOpen(false)}>{notice ? 'Done' : 'Cancel'}</button><button className="primary-button" disabled={busy || !ready || !validBefore || unchanged} type="submit">{busy ? 'Saving…' : 'Move in my course'}</button></div>
      </form>
    </dialog>
  </>;
}
