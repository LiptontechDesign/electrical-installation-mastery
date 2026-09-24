'use client';
import { Fragment, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { VideoStudyContext, VideoStudyTools, VideoLessonStepper, NextVideoCard, timestamp, trackVideoPosition, type StudyPlayer } from './video-study-tools';
import LessonProgress from './lesson-progress';
import { moduleTone } from './course-ui-model';
import { PlayCircle, Plus, Archive, X, CheckCircle2, Bookmark, Check, Circle, Menu, ChevronRight } from 'lucide-react';
import { useCourseAccount } from './course-account';
import { useCourseOrder } from './course-order';
import { relocateSupportingVideos } from './course-order-model';
import { courseMapSnapshot, type SupplementaryMove } from './course-drop-model';
import { withSupplementaryDefaults } from './supplementary-defaults';
import { useDialogFocus } from './use-dialog-focus';
import { confirmationPhrase, supplementaryDescendants, supplementaryPlacementCreatesCycle, youtubeId, type SupplementaryAction, type SupplementaryState, type SupplementaryVideo } from './supplementary-model';

type Editor = { action: SupplementaryAction; revision: number; id?: string; moduleId: string; anchorId: string; position: 'before' | 'after'; url: string; title: string; instructor: string };
type Context = { selected: SupplementaryVideo | null; playback: ReactNode; clearSelection: () => void; videos: SupplementaryVideo[]; watched: string[]; displayNumberById: ReadonlyMap<string, number>; ready: boolean; error: string; move: (move: SupplementaryMove) => Promise<boolean>; open: (video: SupplementaryVideo) => void; add: (moduleId: string, anchorId?: string) => void; archive: (moduleId: string) => void };
type BulkWatchDetail = { moduleId: string; lessonIds: string[] };
const SupplementaryContext = createContext<Context | null>(null);
export const useSupplementary = () => useContext(SupplementaryContext);
const courseVideoLabel = (number: number | undefined) => number === undefined ? 'Video' : `L${String(number).padStart(2, '0')}`;
const empty: SupplementaryState = withSupplementaryDefaults({ version: 1, revision: 0, videos: [] });
export function SupplementaryProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const { requestSignIn } = useCourseAccount();
  const { course, order } = useCourseOrder();
  const [storedState, setState] = useState(empty);
  const state = useMemo(() => ({ ...storedState, videos: relocateSupportingVideos(storedState.videos, course) }), [storedState, course]);
  const displayNumberById = useMemo(() => new Map(Object.values(courseMapSnapshot(order, state.videos).rows).flat()
    .map(row => [row.id, row.displayNumber])), [order, state.videos]);
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
  const legacyProgress = useRef(false);
  useEffect(() => {
    if (!userId) return;
    let active = true;
    void (async () => {
      let local: string[] = [];
      try {
        const personal = localStorage.getItem(`electrical-supplementary-watched-v1:${userId}`);
        const legacy = localStorage.getItem('electrical-supplementary-watched-v1');
        legacyProgress.current = !personal && Boolean(legacy);
        const value: unknown = JSON.parse(personal ?? legacy ?? '[]');
        if (!Array.isArray(value) || value.some(id => typeof id !== 'string')) throw new Error();
        local = [...new Set(value as string[])];
      } catch { if (active) setProgressError('Saved supplementary marks could not be read. The cloud record was not changed.'); }
      try {
        const response = await fetch('/api/user-data/supplementary-progress', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (!active) return;
        setWatched(data.exists ? data.payload : local);
        setProgressReady(true);
      } catch (value) {
        if (active) { setWatched(local); setProgressReady(true); setProgressError(value instanceof Error ? value.message : 'Cloud progress could not be loaded.'); }
      }
    })();
    return () => { active = false; };
  }, [userId]);
  useEffect(() => {
    if (!userId || !progressReady) return;
    const timer = window.setTimeout(async () => {
      try {
        localStorage.setItem(`electrical-supplementary-watched-v1:${userId}`, JSON.stringify(watched));
        const response = await fetch('/api/user-data/supplementary-progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payload: watched }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (legacyProgress.current) { localStorage.removeItem('electrical-supplementary-watched-v1'); legacyProgress.current = false; }
        setProgressError('');
      } catch (value) { setProgressError(value instanceof Error ? value.message : 'Supplementary marks could not be saved to your account.'); }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [watched, progressReady, userId]);
  const markWatched = useCallback((id: string) => {
    if (!userId) return;
    setWatched(current => current.includes(id) ? current : [...current, id]);
  }, [userId]);
  useEffect(() => {
    const bulkMarkWatched = (event: Event) => {
      if (!userId) return;
      const detail = (event as CustomEvent<BulkWatchDetail>).detail;
      if (!detail?.moduleId || !Array.isArray(detail.lessonIds)) return;
      const videoIds = supplementaryDescendants(state.videos, detail.lessonIds)
        .filter(video => video.moduleId === detail.moduleId)
        .map(video => video.videoId);
      if (!videoIds.length) return;
      setWatched(current => [...new Set([...current, ...videoIds])]);
    };
    window.addEventListener('supplementary-bulk-watch', bulkMarkWatched);
    return () => window.removeEventListener('supplementary-bulk-watch', bulkMarkWatched);
  }, [state.videos, userId]);
  const [metadataStatus, setMetadataStatus] = useState('');
  const [lookupAttempt, setLookupAttempt] = useState(0);
  const editedFields = useRef({ title: false, instructor: false });
  const editorUrl = editor?.url ?? '';
  const editorAction = editor?.action;
  useEffect(() => {
    const id = youtubeId(editorUrl);
    if (!id || !['add', 'edit'].includes(editorAction ?? '')) { const clear = window.setTimeout(() => setMetadataStatus(''), 0); return () => window.clearTimeout(clear); }
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
  const isOpen = Boolean(editor || archiveModule);
  useDialogFocus(dialog, isOpen);
  const refresh = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch('/api/supplementary', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const merged = withSupplementaryDefaults(data as SupplementaryState);
      setState(current => merged.revision >= current.revision ? merged : current); setReady(true); setError('');
      return merged;
    } catch (e) { setError(e instanceof Error ? e.message : 'Shared videos could not be loaded.'); }
  }, [userId]);
  // refresh updates state only after the external fetch resolves.
  // eslint-disable-next-line react-hooks/set-state-in-effect
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
      setNotice('Saved in your course.');
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Could not save.'); }
    finally { setBusy(false); }
  }
  async function move(placement: SupplementaryMove) {
    const video = state.videos.find(v => v.id === placement.id);
    if (!ready || busy || !video) return false;
    setBusy(true);
    try {
      const response = await fetch('/api/supplementary', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...video, ...placement, action: 'edit', revision: state.revision,
          url: `https://www.youtube.com/watch?v=${video.videoId}`, confirmation: confirmationPhrase('edit') }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setState(data); setError(''); return true;
    } catch (e) {
      // Reload after failure, including an ambiguous network failure after a write.
      await refresh();
      setError(e instanceof Error ? e.message : 'The video could not be moved.'); return false;
    } finally { setBusy(false); }
  }
  const courseModule = course.modules.find(m => m.id === editor?.moduleId);
  const supplementaryTargets = editor ? state.videos.filter(video =>
    video.moduleId === editor.moduleId &&
    video.id !== editor.id &&
    (!video.archived || video.id === editor.anchorId) &&
    !supplementaryPlacementCreatesCycle(state.videos, editor.id, video.id)
  ) : [];
  const anchorIsSupplementary = supplementaryTargets.some(video => video.id === editor?.anchorId);
  const playback = selected ? <SupplementaryLesson key={selected.id} video={selected} watched={watched.includes(selected.videoId)} progressError={progressError} onWatched={markWatched}
    onBack={() => setSelected(null)} onEdit={action => edit(selected, action)}
    onToggle={() => !userId ? requestSignIn() : watched.includes(selected.videoId) ? setWatched(current => current.filter(id => id !== selected.videoId)) : markWatched(selected.videoId)}/> : null;
  return <SupplementaryContext.Provider value={{ selected, playback, clearSelection: () => setSelected(null), videos: state.videos, watched, displayNumberById, ready: ready && !busy, error, move, open: video => { setSelected(video); setEditor(null); setArchiveModule(null); setNotice(''); window.dispatchEvent(new Event('supplementary-video-open')); }, add: (moduleId, anchorId) => {
    const last = course.modules.find(m => m.id === moduleId)?.lessons.at(-1)?.id;
    if (!last) return;
    editedFields.current = { title: false, instructor: false };
    setEditor({ action: 'add', revision: state.revision, moduleId, anchorId: anchorId ?? last, position: 'after', url: '', title: '', instructor: '' }); setConfirmation(''); setNotice('');
  }, archive: moduleId => { setArchiveModule(moduleId); setNotice(''); } }}>
    {children}
    {error && <div className="supp-status" role="status">{error} <button type="button" onClick={() => void refresh()}>Retry your videos</button></div>}
    {isOpen && <div className="supp-overlay"><section ref={dialog} className="supp-dialog" role="dialog" aria-modal="true" aria-labelledby="supp-title" onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } }}>
      <div className="supp-dialog-header"><div><span className="eyebrow">Supplementary videos</span><h2 id="supp-title">{editor ? editor.action === 'add' ? 'Add a course video' : editor.action === 'edit' ? 'Rename or move video' : `${editor.action === 'archive' ? 'Archive' : 'Restore'} video?` : selected ? `${courseVideoLabel(displayNumberById.get(selected.id))} · ${selected.title}` : 'Archived videos'}</h2></div><button type="button" disabled={busy} aria-label="Close supplementary videos" onClick={close}><X /></button></div>
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
            <label>Position<select value={editor.position} onChange={e => { setEditor({ ...editor, position: e.target.value as 'before' | 'after' }); setConfirmation(''); }}><option value="before">Before this {anchorIsSupplementary ? 'video' : 'lesson'}</option><option value="after">After this {anchorIsSupplementary ? 'video' : 'lesson'}</option></select></label></div>
            <label>Place next to<select value={editor.anchorId} onChange={e => { setEditor({ ...editor, anchorId: e.target.value }); setConfirmation(''); }}>
              <optgroup label="Core lessons">{courseModule?.lessons.map(l => <option key={l.id} value={l.id}>{courseVideoLabel(displayNumberById.get(l.id))} · {l.title}</option>)}</optgroup>
              {supplementaryTargets.length > 0 && <optgroup label="Supplementary videos already here">{supplementaryTargets.map(video => <option key={video.id} value={video.id}>{video.archived ? 'Archived placement' : courseVideoLabel(displayNumberById.get(video.id))} · {video.title}</option>)}</optgroup>}
            </select><small className="supp-placement-help">Choose a core lesson or an existing supplementary video. Your video will appear immediately before or after that item.</small></label>
          </> : <p><strong>{editor.title}</strong><br />{editor.action === 'archive' ? 'Hide this video from your course. It stays in your archive and can be restored.' : 'Return this video to its saved position in your course.'}</p>}
          <div className="supp-confirm"><strong>Are you sure? This changes only your course.</strong><p>Original videos will not change. No video is permanently deleted.</p><label>Type <strong>{confirmationPhrase(editor.action)}</strong> to confirm<input autoComplete="off" spellCheck={false} value={confirmation} onChange={e => setConfirmation(e.target.value)} /></label></div>
          <button className="primary-button" type="submit" disabled={!ready || confirmation !== confirmationPhrase(editor.action)}>{busy ? 'Saving…' : 'Confirm my change'}</button>
        </fieldset>
      </form> : <>
        <p>Archived videos remain saved. Restore them to make them visible in your course again.</p>
        {state.videos.filter(v => v.archived && v.moduleId === archiveModule).map(v => <div className="supp-archive-row" key={v.id}><span>{v.title}</span><button className="secondary-button" onClick={() => edit(v, 'restore')}>Restore</button><button className="secondary-button" onClick={() => edit(v, 'edit')}>Rename or move</button></div>)}
        {!state.videos.some(v => v.archived && v.moduleId === archiveModule) && <p>No archived videos in this module.</p>}
      </>}
      {notice && <p role="status">{notice}</p>}
      {userId && <footer><button type="button" disabled={busy} onClick={async () => {
        setConfirmation('');
        const latest = await refresh();
        if (latest) {
          setEditor(null); setSelected(null); setArchiveModule(archiveModule ?? editor?.moduleId ?? selected?.moduleId ?? course.modules[0].id);
          setNotice('Shared list refreshed. Reopen the video from the course map to review its latest details before editing.');
        }
      }}>Refresh my list</button><small>Private to your account</small></footer>}
    </section></div>}
  </SupplementaryContext.Provider>;
}
function SupplementaryLesson({ video, watched, progressError, onWatched, onBack, onEdit, onToggle }: {
  video: SupplementaryVideo; watched: boolean; progressError: string; onWatched: (id: string) => void; onBack: () => void; onEdit: (action: SupplementaryAction) => void; onToggle: () => void;
}) {
  const { user, requestSignIn } = useCourseAccount();
  const study = useContext(VideoStudyContext);
  const player = useRef<StudyPlayer | null>(null);
  const [duration, setDuration] = useState(0);
  const onPlayer = useCallback((value: StudyPlayer | null) => {
    player.current = value;
    const seconds = value?.getDuration?.();
    if (typeof seconds === 'number' && Number.isFinite(seconds) && seconds > 0) setDuration(seconds);
  }, []);
  const saved = study.savedVideos.includes(video.videoId);
  return <article className="lesson-canvas supp-lesson" data-module-tone={moduleTone(video.moduleId)}>
    <div className="lesson-topline"><button className="mobile-module-button" type="button" onClick={study.openCourseMap}><Menu size={19}/> Course map</button><div className="breadcrumbs"><span>{study.navigation.path}</span><ChevronRight size={15}/><span>{study.navigation.moduleTitle}</span></div><VideoLessonStepper/></div>
    <div className="lesson-title-block"><p className="lesson-kicker"><strong>Video {study.navigation.position}</strong><span>·</span>Optional lesson</p><h1>{video.title}</h1><p>{video.instructor || 'YouTube'}{duration > 0 && <> <span>·</span> {timestamp(duration)}</>}</p></div>
    <div className="video-shell"><SupplementaryPlayer video={video} onWatched={onWatched} onPlayer={onPlayer}/></div>
    <div className="lesson-control-row"><div><button className={saved ? 'bookmark-button active' : 'bookmark-button'} type="button" onClick={() => user ? study.toggleSaved(video.videoId) : requestSignIn()}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Saved' : 'Save lesson'}</button><button className="bookmark-button" type="button" onClick={onBack}>Back to core lesson</button></div><button className={watched ? 'complete-button completed' : 'complete-button'} type="button" aria-pressed={watched} onClick={onToggle}>{watched ? <Check size={19}/> : <Circle size={19}/>} {watched ? 'Watched · Undo' : 'Mark video watched'}</button></div>
    <VideoStudyTools videoId={video.videoId} getPlayer={() => player.current}/>
    {user && <LessonProgress watched={watched} completions={0} optional/>}
    <section className="lesson-personal-notes" aria-label="Personal lesson notes"><details className="lesson-notes-disclosure"><summary>Your lesson notes</summary>{user ? <label className="lesson-notes"><span>Write a private note for this lesson</span><textarea aria-label="Your lesson notes" maxLength={10000} value={study.videoNotes[video.videoId] ?? ''} onChange={event => study.setNote(video.videoId, event.target.value)} placeholder="Write your own notes…"/></label> : <div className="guest-notes"><p>Save your notes with this video.</p><button className="account-sign-in" onClick={requestSignIn}>Sign in to keep notes</button></div>}</details></section>
    {progressError && <p role="alert">{progressError}</p>}
    <details className="video-playback-help"><summary>Playback help</summary><p><a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">Open on YouTube if playback is unavailable</a></p></details>
    {user && <div className="supp-actions"><button className="secondary-button" onClick={() => onEdit('edit')}>Rename or move</button><button className="secondary-button" onClick={() => onEdit('archive')}>Archive video</button></div>}
    <NextVideoCard/>
  </article>;
}

export function SupplementaryControls({ moduleId, anchorId, compact = false, label = 'Add video here' }: { moduleId: string; anchorId?: string; compact?: boolean; label?: string }) {
  const { user } = useCourseAccount();
  const context = useContext(SupplementaryContext);
  if (!context || !user) return null;
  return <div className="supp-controls"><button type="button" data-tooltip={label} aria-label={label} onClick={() => context.add(moduleId, anchorId)}><Plus size={16} /></button>{!compact && <button type="button" data-tooltip="View archived videos in this module" aria-label="View archived videos in this module" onClick={() => context.archive(moduleId)}><Archive size={16} /></button>}</div>;
}
export function SupplementaryRows({ anchorId, position }: { anchorId: string; position: 'before' | 'after' }) {
  const context = useContext(SupplementaryContext);
  return context ? <SupplementaryBranch context={context} anchorId={anchorId} position={position} trail={[]} /> : null;
}

function SupplementaryBranch({ context, anchorId, position, trail }: { context: Context; anchorId: string; position: 'before' | 'after'; trail: string[] }) {
  return <>{context.videos.filter(video => video.anchorId === anchorId && video.position === position).map(video => {
    if (trail.includes(video.id)) return null;
    const nextTrail = [...trail, video.id];
    return <Fragment key={video.id}>
      <SupplementaryBranch context={context} anchorId={video.id} position="before" trail={nextTrail} />
      {!video.archived && <button className="supp-video-row" type="button" onClick={() => context.open(video)}>{context.watched.includes(video.videoId) ? <CheckCircle2 size={17} /> : <PlayCircle size={17} />}<span><strong>{courseVideoLabel(context.displayNumberById.get(video.id))} · {video.title}</strong><small>Supplementary · {context.watched.includes(video.videoId) ? 'Watched' : 'Not watched'} · {video.instructor || 'YouTube'}</small></span></button>}
      <SupplementaryBranch context={context} anchorId={video.id} position="after" trail={nextTrail} />
    </Fragment>;
  })}</>;
}

function SupplementaryPlayer({ video, onWatched, onPlayer }: { video: SupplementaryVideo; onWatched: (id: string) => void; onPlayer: (player: StudyPlayer | null) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const study = useContext(VideoStudyContext);
  const studyRef = useRef(study);
  const playerRef = useRef<StudyPlayer | null>(null);
  useEffect(() => { studyRef.current = study; }, [study]);
  useEffect(() => {
    const container = host.current;
    if (!container) return;
    let disposed = false;
    let stopTracking = Object.assign(() => {}, { capture: () => {} });
    let player: { destroy: () => void } | undefined;
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
    if (studyRef.current.enabled) iframe.src += '&start=' + (studyRef.current.positions[video.videoId] ?? 0);
    iframe.title = video.title;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    const bind = () => {
      if (disposed || player || !window.YT?.Player) return;
      const api = window.YT;
      player = new api.Player(iframe, { events: { onReady: event => { if (disposed) return; playerRef.current = event.target; onPlayer(event.target); if (studyRef.current.enabled) stopTracking = trackVideoPosition(event.target, seconds => { if (studyRef.current.enabled) studyRef.current.position(video.videoId, seconds); }); }, onStateChange: event => {
        if (!disposed) { stopTracking.capture(); onPlayer(playerRef.current); }
        if (!disposed && event.data === api.PlayerState.ENDED) { onWatched(video.videoId); studyRef.current.position(video.videoId, 0); }
      } } });
    };
    iframe.addEventListener('load', bind);
    container.appendChild(iframe);
    // The course loads the shared YouTube API; handle it arriving after the frame.
    let attempts = 0;
    const timer = window.setInterval(() => { bind(); if (player || ++attempts >= 80) window.clearInterval(timer); }, 250);
    return () => {
      stopTracking(); playerRef.current = null; onPlayer(null); disposed = true; window.clearInterval(timer); iframe.removeEventListener('load', bind);
      try { player?.destroy(); } catch { /* The frame may already have closed. */ }
      iframe.remove();
    };
  }, [video.id, video.videoId, video.title, onWatched, study.enabled, onPlayer]);
  return <div className="video-frame" ref={host} />;
}
