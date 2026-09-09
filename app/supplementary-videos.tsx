'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { PlayCircle, Plus, Archive, X } from 'lucide-react';
import course from './course-curriculum';
import { useDialogFocus } from './use-dialog-focus';
import { confirmationPhrase, youtubeId, type SupplementaryAction, type SupplementaryState, type SupplementaryVideo } from './supplementary-model';

type Editor = { action: SupplementaryAction; revision: number; id?: string; moduleId: string; anchorId: string; position: 'before' | 'after'; url: string; title: string; instructor: string };
type Context = { videos: SupplementaryVideo[]; open: (video: SupplementaryVideo) => void; add: (moduleId: string, anchorId?: string) => void; archive: (moduleId: string) => void };
const SupplementaryContext = createContext<Context | null>(null);
const empty: SupplementaryState = { version: 1, revision: 0, videos: [] };
export function SupplementaryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(empty);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [selected, setSelected] = useState<SupplementaryVideo | null>(null);
  const [archiveModule, setArchiveModule] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState('');
  const [notice, setNotice] = useState('');
  const dialog = useRef<HTMLElement>(null);
  const isOpen = Boolean(editor || selected || archiveModule);
  useDialogFocus(dialog, isOpen);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/supplementary', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setState(current => data.revision >= current.revision ? data : current); setReady(true); setError('');
      return data as SupplementaryState;
    } catch (e) { setError(e instanceof Error ? e.message : 'Shared videos could not be loaded.'); }
  }, []);
  useEffect(() => { void refresh(); const focus = () => { void refresh(); }; window.addEventListener('focus', focus); return () => window.removeEventListener('focus', focus); }, [refresh]);
  useEffect(() => {
    if (!isOpen) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [isOpen]);
  function close() { if (busy) return; setEditor(null); setSelected(null); setArchiveModule(null); setConfirmation(''); setNotice(''); }
  function edit(video: SupplementaryVideo, action: SupplementaryAction) {
    setEditor({ ...video, action, revision: state.revision, url: `https://www.youtube.com/watch?v=${video.videoId}` }); setSelected(null); setConfirmation(''); setNotice('');
  }
  async function save() {
    if (!editor || busy || !ready) return;
    setBusy(true); setNotice('');
    try {
      const response = await fetch('/api/supplementary', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...editor, confirmation }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setState(data); setEditor(null); setConfirmation('');
      const saved = (data as SupplementaryState).videos.find(v => editor.id ? v.id === editor.id : v.videoId === youtubeId(editor.url));
      if (saved && !saved.archived) {
        setSelected(saved); setArchiveModule(null);
        window.dispatchEvent(new Event('supplementary-video-open'));
      } else setArchiveModule(editor.moduleId);
      setNotice('Saved for everyone. Close this window to continue the course.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Could not save.'); }
    finally { setBusy(false); }
  }
  async function lookup() {
    if (!editor || busy) return;
    const draft = editor;
    setBusy(true); setNotice('Looking up video details…');
    try {
      const response = await fetch(`/api/supplementary/metadata?url=${encodeURIComponent(draft.url)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setEditor(current => current && current.url === draft.url ? { ...current, title: data.title, instructor: data.instructor } : current);
      setNotice('Details filled in. You can rename them before publishing.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Enter the title manually.'); }
    finally { setBusy(false); }
  }
  const module = course.modules.find(m => m.id === editor?.moduleId);
  return <SupplementaryContext.Provider value={{ videos: state.videos, open: video => { setSelected(video); setNotice(''); window.dispatchEvent(new Event('supplementary-video-open')); }, add: (moduleId, anchorId) => {
    const first = course.modules.find(m => m.id === moduleId)!.lessons[0].id;
    setEditor({ action: 'add', revision: state.revision, moduleId, anchorId: anchorId ?? first, position: 'after', url: '', title: '', instructor: '' }); setConfirmation(''); setNotice('');
  }, archive: moduleId => { setArchiveModule(moduleId); setNotice(''); } }}>
    {children}
    {error && <div className="supp-status" role="status">{error} <button type="button" onClick={() => void refresh()}>Retry shared videos</button></div>}
    {isOpen && <div className="supp-overlay"><section ref={dialog} className="supp-dialog" role="dialog" aria-modal="true" aria-labelledby="supp-title" onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}>
      <header><div><span className="eyebrow">Supplementary videos</span><h2 id="supp-title">{editor ? editor.action === 'add' ? 'Add a course video' : editor.action === 'edit' ? 'Rename or move video' : `${editor.action === 'archive' ? 'Archive' : 'Restore'} video?` : selected ? selected.title : 'Archived videos'}</h2></div><button type="button" disabled={busy} aria-label="Close supplementary videos" onClick={close}><X /></button></header>
      {editor ? <form onSubmit={e => { e.preventDefault(); void save(); }}>
        <fieldset disabled={busy}>
          {['add', 'edit'].includes(editor.action) ? <>
            <label>YouTube link<input type="url" required value={editor.url} onChange={e => { setEditor({ ...editor, url: e.target.value }); setConfirmation(''); }} placeholder="https://www.youtube.com/watch?v=…" /></label>
            <button type="button" className="secondary-button" disabled={!youtubeId(editor.url)} onClick={() => void lookup()}>Fill title and instructor from YouTube</button>
            <label>Video title<input required maxLength={240} value={editor.title} onChange={e => { setEditor({ ...editor, title: e.target.value }); setConfirmation(''); }} /></label>
            <label>Instructor / channel<input maxLength={160} value={editor.instructor} onChange={e => { setEditor({ ...editor, instructor: e.target.value }); setConfirmation(''); }} /></label>
            <div className="supp-fields"><label>Module<select value={editor.moduleId} onChange={e => { const m = course.modules.find(m => m.id === e.target.value)!; setEditor({ ...editor, moduleId: m.id, anchorId: m.lessons[0].id }); setConfirmation(''); }}>{course.modules.map(m => <option key={m.id} value={m.id}>{m.number}. {m.title}</option>)}</select></label>
            <label>Position<select value={editor.position} onChange={e => { setEditor({ ...editor, position: e.target.value as 'before' | 'after' }); setConfirmation(''); }}><option value="before">Before this lesson</option><option value="after">After this lesson</option></select></label></div>
            <label>Lesson (also selects its subsection)<select value={editor.anchorId} onChange={e => { setEditor({ ...editor, anchorId: e.target.value }); setConfirmation(''); }}>{module?.lessons.map(l => <option key={l.id} value={l.id}>L{l.number} · {l.title}</option>)}</select></label>
          </> : <p><strong>{editor.title}</strong><br />{editor.action === 'archive' ? 'Hide this video from the course for everyone. It stays in the archive and can be restored.' : 'Return this video to its saved course position for everyone.'}</p>}
          <div className="supp-confirm"><strong>Are you sure? This changes the course for every visitor.</strong><p>Original lessons and assessments will not change. No video is permanently deleted.</p><label>Type <strong>{confirmationPhrase(editor.action)}</strong> to confirm<input autoComplete="off" spellCheck={false} value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label></div>
          <button className="primary-button" type="submit" disabled={!ready || confirmation !== confirmationPhrase(editor.action)}>{busy ? 'Saving…' : 'Confirm shared change'}</button>
        </fieldset>
      </form> : selected ? <>
        <p>{selected.instructor} · Optional supporting lesson</p>
        <div className="video-frame"><iframe src={`https://www.youtube-nocookie.com/embed/${selected.videoId}?rel=0`} title={selected.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>
        <p><a href={`https://www.youtube.com/watch?v=${selected.videoId}`} target="_blank" rel="noopener noreferrer">Open on YouTube if playback is unavailable</a></p>
        <p>This optional video has no quiz or overview and does not change required course completion.</p>
        <div className="supp-actions"><button className="secondary-button" onClick={() => edit(selected, 'edit')}>Rename or move</button><button className="secondary-button" onClick={() => edit(selected, 'archive')}>Archive video</button></div>
      </> : <>
        <p>Archived videos remain saved. Restore them to make them visible to everyone again.</p>
        {state.videos.filter(v => v.archived && v.moduleId === archiveModule).map(v => <div className="supp-archive-row" key={v.id}><span>{v.title}</span><button className="secondary-button" onClick={() => edit(v, 'restore')}>Restore</button><button className="secondary-button" onClick={() => edit(v, 'edit')}>Rename or move</button></div>)}
        {!state.videos.some(v => v.archived && v.moduleId === archiveModule) && <p>No archived videos in this module.</p>}
      </>}
      {notice && <p role="status">{notice}</p>}
      <footer><button type="button" disabled={busy} onClick={async () => {
        setConfirmation('');
        const latest = await refresh();
        if (latest) {
          setEditor(null); setSelected(null); setArchiveModule(archiveModule ?? editor?.moduleId ?? selected?.moduleId ?? course.modules[0].id);
          setNotice('Shared list refreshed. Reopen the video from the course map to review its latest details before editing.');
        }
      }}>Refresh shared list</button><small>Open collaboration · No sign-in required</small></footer>
    </section></div>}
  </SupplementaryContext.Provider>;
}
export function SupplementaryControls({ moduleId, anchorId }: { moduleId: string; anchorId?: string }) {
  const context = useContext(SupplementaryContext);
  if (!context) return null;
  return <div className="supp-controls"><button type="button" onClick={() => context.add(moduleId, anchorId)}><Plus size={17} /><span>Add supporting video</span></button><button type="button" onClick={() => context.archive(moduleId)}><Archive size={17} /><span>Archived videos</span></button></div>;
}
export function SupplementaryRows({ anchorId, position }: { anchorId: string; position: 'before' | 'after' }) {
  const context = useContext(SupplementaryContext);
  return <>{context?.videos.filter(v => !v.archived && v.anchorId === anchorId && v.position === position).map(v => <button className="supp-video-row" type="button" key={v.id} onClick={() => context.open(v)}><PlayCircle size={17} /><span><strong>{v.title}</strong><small>Supplementary · {v.instructor || 'YouTube'}</small></span></button>)}</>;
}
