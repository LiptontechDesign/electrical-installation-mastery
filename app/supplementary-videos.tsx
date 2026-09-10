'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { PlayCircle, Plus, Archive, X, CheckCircle2 } from 'lucide-react';
import course from './course-curriculum';
import { withSupplementaryDefaults } from './supplementary-defaults';
import { ElectricalShockContext } from './licensing-ui';
import { useDialogFocus } from './use-dialog-focus';
import { confirmationPhrase, youtubeId, type SupplementaryAction, type SupplementaryState, type SupplementaryVideo } from './supplementary-model';

type Editor = { action: SupplementaryAction; revision: number; id?: string; moduleId: string; anchorId: string; position: 'before' | 'after'; url: string; title: string; instructor: string };
type Context = { videos: SupplementaryVideo[]; watched: string[]; open: (video: SupplementaryVideo) => void; add: (moduleId: string, anchorId?: string) => void; archive: (moduleId: string) => void };
const SupplementaryContext = createContext<Context | null>(null);
const empty: SupplementaryState = withSupplementaryDefaults({ version: 1, revision: 0, videos: [] });
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
  const [watched, setWatched] = useState<string[]>([]);
  const [progressReady, setProgressReady] = useState(false);
  const [progressError, setProgressError] = useState('');
  useEffect(() => {
    try {
      const value: unknown = JSON.parse(localStorage.getItem('electrical-supplementary-watched-v1') ?? '[]');
      if (!Array.isArray(value) || value.some(id => typeof id !== 'string')) throw new Error();
      setWatched([...new Set(value as string[])]); setProgressReady(true);
    } catch { setProgressError('Supplementary watched marks could not be loaded. Existing saved data has not been changed.'); }
  }, []);
  useEffect(() => {
    if (!progressReady) return;
    try { localStorage.setItem('electrical-supplementary-watched-v1', JSON.stringify(watched)); setProgressError(''); }
    catch { setProgressError('This browser could not save supplementary watched marks. They will last only for this session.'); }
  }, [watched, progressReady]);
  const markWatched = useCallback((id: string) => {
    setWatched(current => current.includes(id) ? current : [...current, id]);
  }, []);
  const [metadataStatus, setMetadataStatus] = useState('');
  const [lookupAttempt, setLookupAttempt] = useState(0);
  const editedFields = useRef({ title: false, instructor: false });
  const editorUrl = editor?.url ?? '';
  const editorAction = editor?.action;
  useEffect(() => {
    const id = youtubeId(editorUrl);
    if (!id || !['add', 'edit'].includes(editorAction ?? '')) { setMetadataStatus(''); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setMetadataStatus('Fetching title and instructor…');
      try {
        const response = await fetch(`/api/supplementary/metadata?url=${encodeURIComponent(editorUrl)}`, { signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (controller.signal.aborted) return;
        setConfirmation('');
        setEditor(current => current && current.url === editorUrl ? { ...current,
          title: editedFields.current.title ? current.title : data.title,
          instructor: editedFields.current.instructor ? current.instructor : data.instructor,
        } : current);
        setMetadataStatus('Details fetched. You can edit the title and instructor.');
      } catch (e) {
        if (!controller.signal.aborted) setMetadataStatus(e instanceof Error ? e.message : 'Enter the details manually.');
      }
    }, 450);
    return () => { window.clearTimeout(timer); controller.abort(); };
  }, [editorUrl, editorAction, lookupAttempt]);
  const dialog = useRef<HTMLElement>(null);
  const isOpen = Boolean(editor || selected || archiveModule);
  useDialogFocus(dialog, isOpen);
  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/supplementary', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const merged = withSupplementaryDefaults(data as SupplementaryState);
      setState(current => merged.revision >= current.revision ? merged : current); setReady(true); setError('');
      return merged;
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
    editedFields.current = { title: true, instructor: true };
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
  const module = course.modules.find(m => m.id === editor?.moduleId);
  return <SupplementaryContext.Provider value={{ videos: state.videos, watched, open: video => { setSelected(video); setNotice(''); window.dispatchEvent(new Event('supplementary-video-open')); }, add: (moduleId, anchorId) => {
    const last = course.modules.find(m => m.id === moduleId)!.lessons.at(-1)!.id;
    editedFields.current = { title: false, instructor: false };
    setEditor({ action: 'add', revision: state.revision, moduleId, anchorId: anchorId ?? last, position: 'after', url: '', title: '', instructor: '' }); setConfirmation(''); setNotice('');
  }, archive: moduleId => { setArchiveModule(moduleId); setNotice(''); } }}>
    {children}
    {error && <div className="supp-status" role="status">{error} <button type="button" onClick={() => void refresh()}>Retry shared videos</button></div>}
    {isOpen && <div className="supp-overlay"><section ref={dialog} className="supp-dialog" role="dialog" aria-modal="true" aria-labelledby="supp-title" onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}>
      <header><div><span className="eyebrow">Supplementary videos</span><h2 id="supp-title">{editor ? editor.action === 'add' ? 'Add a course video' : editor.action === 'edit' ? 'Rename or move video' : `${editor.action === 'archive' ? 'Archive' : 'Restore'} video?` : selected ? selected.title : 'Archived videos'}</h2></div><button type="button" disabled={busy} aria-label="Close supplementary videos" onClick={close}><X /></button></header>
      {editor ? <form onSubmit={e => { e.preventDefault(); void save(); }}>
        <fieldset disabled={busy}>
          {['add', 'edit'].includes(editor.action) ? <>
            <label>YouTube link<input type="url" required value={editor.url} onChange={e => {
              editedFields.current = { title: false, instructor: false };
              setEditor({ ...editor, url: e.target.value.trim(), title: '', instructor: '' }); setConfirmation('');
            }} placeholder="Paste a YouTube link — details fill automatically" /></label>
            <div className="supp-metadata"><span role="status">{metadataStatus || 'Paste a video link to fetch its title and instructor automatically.'}</span><button type="button" disabled={!youtubeId(editor.url)} onClick={() => setLookupAttempt(value => value + 1)}>Retry lookup</button></div>
            <label>Video title<input required maxLength={240} value={editor.title} onChange={e => { editedFields.current.title = true; setEditor({ ...editor, title: e.target.value }); setConfirmation(''); }} /></label>
            <label>Instructor / channel<input maxLength={160} value={editor.instructor} onChange={e => { editedFields.current.instructor = true; setEditor({ ...editor, instructor: e.target.value }); setConfirmation(''); }} /></label>
            <div className="supp-fields"><label>Module<select value={editor.moduleId} onChange={e => { const m = course.modules.find(m => m.id === e.target.value)!; setEditor({ ...editor, moduleId: m.id, anchorId: m.lessons[0].id }); setConfirmation(''); }}>{course.modules.map(m => <option key={m.id} value={m.id}>{m.number}. {m.title}</option>)}</select></label>
            <label>Position<select value={editor.position} onChange={e => { setEditor({ ...editor, position: e.target.value as 'before' | 'after' }); setConfirmation(''); }}><option value="before">Before this lesson</option><option value="after">After this lesson</option></select></label></div>
            <label>Lesson (also selects its subsection)<select value={editor.anchorId} onChange={e => { setEditor({ ...editor, anchorId: e.target.value }); setConfirmation(''); }}>{module?.lessons.map(l => <option key={l.id} value={l.id}>L{l.number} · {l.title}</option>)}</select></label>
          </> : <p><strong>{editor.title}</strong><br />{editor.action === 'archive' ? 'Hide this video from the course for everyone. It stays in the archive and can be restored.' : 'Return this video to its saved course position for everyone.'}</p>}
          <div className="supp-confirm"><strong>Are you sure? This changes the course for every visitor.</strong><p>Original lessons and assessments will not change. No video is permanently deleted.</p><label>Type <strong>{confirmationPhrase(editor.action)}</strong> to confirm<input autoComplete="off" spellCheck={false} value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label></div>
          <button className="primary-button" type="submit" disabled={!ready || confirmation !== confirmationPhrase(editor.action)}>{busy ? 'Saving…' : 'Confirm shared change'}</button>
        </fieldset>
      </form> : selected ? <>
        <p>{selected.instructor} · Optional supporting lesson</p>
        {['TsJ49Np3HS0','UFvL7wTFzl0'].includes(selected.videoId)&&<ElectricalShockContext/>}
        <SupplementaryPlayer key={selected.id} video={selected} onWatched={markWatched} />
        <button type="button" className={watched.includes(selected.videoId) ? 'complete-button completed' : 'complete-button'} aria-pressed={watched.includes(selected.videoId)} onClick={() => watched.includes(selected.videoId) ? setWatched(current => current.filter(id => id !== selected.videoId)) : markWatched(selected.videoId)}>{watched.includes(selected.videoId) ? 'Watched · Undo' : 'Mark video watched'}</button>
        <p>Watched status is personal to this browser and is kept in both browsing modes.</p>
        {progressError && <p role="alert">{progressError}</p>}
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
export function SupplementaryControls({ moduleId, anchorId, compact = false, label = 'Add video here' }: { moduleId: string; anchorId?: string; compact?: boolean; label?: string }) {
  const context = useContext(SupplementaryContext);
  if (!context) return null;
  return <div className="supp-controls"><button type="button" title={label} aria-label={label} onClick={() => context.add(moduleId, anchorId)}><Plus size={16} /></button>{!compact && <button type="button" title="Archived videos in this module" aria-label="Archived videos in this module" onClick={() => context.archive(moduleId)}><Archive size={16} /></button>}</div>;
}
export function SupplementaryRows({ anchorId, position }: { anchorId: string; position: 'before' | 'after' }) {
  const context = useContext(SupplementaryContext);
  return <>{context?.videos.filter(v => !v.archived && v.anchorId === anchorId && v.position === position).map(v => <button className="supp-video-row" type="button" key={v.id} onClick={() => context.open(v)}>{context.watched.includes(v.videoId) ? <CheckCircle2 size={17} /> : <PlayCircle size={17} />}<span><strong>{v.title}</strong><small>Supplementary · {context.watched.includes(v.videoId) ? 'Watched' : 'Not watched'} · {v.instructor || 'YouTube'}</small></span></button>)}</>;
}

function SupplementaryPlayer({ video, onWatched }: { video: SupplementaryVideo; onWatched: (id: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    let player: { destroy: () => void } | undefined;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
    iframe.title = video.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    const bind = () => {
      if (disposed || player || !window.YT?.Player) return;
      const api = window.YT;
      player = new api.Player(iframe, { events: { onStateChange: event => {
        if (!disposed && event.data === api.PlayerState.ENDED) onWatched(video.videoId);
      } } });
    };
    iframe.addEventListener('load', bind);
    container.appendChild(iframe);
    // The course loads the shared YouTube API; handle it arriving after the frame.
    let attempts = 0;
    const timer = window.setInterval(() => { bind(); if (player || ++attempts >= 80) window.clearInterval(timer); }, 250);
    return () => {
      disposed = true; window.clearInterval(timer); iframe.removeEventListener('load', bind);
      try { player?.destroy(); } catch { /* The frame may already have closed. */ }
      iframe.remove();
    };
  }, [video.id, video.videoId, video.title, onWatched]);
  return <div className="video-frame" ref={host} />;
}
