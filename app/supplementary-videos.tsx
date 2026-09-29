'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { VideoStudyContext, VideoStudyTools, VideoLessonStepper, NextVideoCard, timestamp, trackVideoPosition, type StudyPlayer } from './video-study-tools';
import LessonProgress from './lesson-progress';
import { moduleTone } from './course-ui-model';
import { Bookmark, Check, Circle, Menu, ChevronRight, SkipForward } from 'lucide-react';
import { useCourseAccount } from './course-account';
import { useCourseOrder } from './course-order';
import { VideoActions } from './course-editor-actions';
import type { SupplementaryVideo } from './supplementary-model';

type Context = { selected: SupplementaryVideo | null; playback: ReactNode; clearSelection: () => void; videos: SupplementaryVideo[]; watched: string[]; ready: boolean; error: string; open: (video: SupplementaryVideo) => void };
type BulkWatchDetail = { moduleId: string; lessonIds: string[] };
const SupplementaryContext = createContext<Context | null>(null);
export const useSupplementary = () => useContext(SupplementaryContext);
export function SupplementaryProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const { requestSignIn } = useCourseAccount();
  const { videos, ready, error } = useCourseOrder();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = videos.find(v => v.id === selectedId && !v.archived) ?? null;
  useEffect(() => {
    const hashId = window.location.hash.split('/')[1];
    if (selectedId || !hashId) return;
    const video = videos.find(v => v.id === hashId && !v.archived);
    if (!video) return;
    const timer = window.setTimeout(() => { setSelectedId(video.id); window.dispatchEvent(new CustomEvent('supplementary-video-open', { detail: { id: video.id } })); }, 0);
    return () => window.clearTimeout(timer);
  }, [videos, selectedId]);
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
        if (active) { setWatched(local); setProgressReady(false); setProgressError(value instanceof Error ? value.message : 'Cloud progress could not be loaded.'); }
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
      const videoIds = videos.filter(video => detail.lessonIds.includes(video.id))
        .filter(video => video.moduleId === detail.moduleId)
        .map(video => video.videoId);
      if (!videoIds.length) return;
      setWatched(current => [...new Set([...current, ...videoIds])]);
    };
    window.addEventListener('supplementary-bulk-watch', bulkMarkWatched);
    return () => window.removeEventListener('supplementary-bulk-watch', bulkMarkWatched);
  }, [videos, userId]);
  const playback = selected ? <SupplementaryLesson key={selected.id} video={selected} watched={watched.includes(selected.videoId)} progressError={progressError} onWatched={markWatched}
    onBack={() => { window.history.replaceState(null, '', '#learn'); setSelectedId(null); }} onToggle={() => !userId ? requestSignIn() : watched.includes(selected.videoId) ? setWatched(current => current.filter(id => id !== selected.videoId)) : markWatched(selected.videoId)}/> : null;
  return <SupplementaryContext.Provider value={{ selected, playback, clearSelection: () => setSelectedId(null), videos, watched, ready, error,
    open: video => { setSelectedId(video.id); window.history.replaceState(null, '', `#learn/${video.id}`); window.dispatchEvent(new CustomEvent('supplementary-video-open', { detail: { id: video.id } })); } }}>{children}</SupplementaryContext.Provider>;
}

function SupplementaryLesson({ video, watched, progressError, onWatched, onBack, onToggle }: {
  video: SupplementaryVideo; watched: boolean; progressError: string; onWatched: (id: string) => void; onBack: () => void; onToggle: () => void;
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
    <div className="lesson-topline"><button className="mobile-module-button" type="button" onClick={study.openCourseMap}><Menu size={19}/> Course map</button><div className="breadcrumbs"><span>{study.navigation.path}</span><ChevronRight size={15}/><span>{study.navigation.moduleTitle}</span></div><VideoActions id={video.id}/><VideoLessonStepper/></div>
    <div className="lesson-title-block"><p className="lesson-kicker"><strong>Video {study.navigation.position}</strong><span>·</span>Optional lesson</p><h1>{video.title}</h1><p>{video.instructor || 'YouTube'}{duration > 0 && <> <span>·</span> {timestamp(duration)}</>}</p></div>
    <div className="video-shell"><SupplementaryPlayer video={video} onWatched={onWatched} onPlayer={onPlayer}/>{study.autoNextControls}</div>
    <div className="lesson-control-row"><div><button className={saved ? 'bookmark-button active' : 'bookmark-button'} type="button" onClick={() => user ? study.toggleSaved(video.videoId) : requestSignIn()}><Bookmark size={18} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Saved' : 'Save lesson'}</button><button className="bookmark-button" type="button" onClick={onBack}>Back to core lesson</button><button className={`auto-next-toggle ${study.autoNextEnabled ? 'active' : ''}`} type="button" role="switch" aria-checked={study.autoNextEnabled} onClick={study.toggleAutoNext}><SkipForward size={18}/> Auto-next <span>{study.autoNextEnabled ? 'On' : 'Off'}</span></button></div><button className={watched ? 'complete-button completed' : 'complete-button'} type="button" aria-pressed={watched} onClick={onToggle}>{watched ? <Check size={19}/> : <Circle size={19}/>} {watched ? 'Watched · Undo' : 'Mark video watched'}</button></div>
    <VideoStudyTools videoId={video.videoId} getPlayer={() => player.current}/>
    {user && <LessonProgress watched={watched} completions={0} optional/>}
    <section className="lesson-personal-notes" aria-label="Personal lesson notes"><details className="lesson-notes-disclosure"><summary>Your lesson notes</summary>{user ? <label className="lesson-notes"><span>Write a private note for this lesson</span><textarea aria-label="Your lesson notes" maxLength={10000} value={study.videoNotes[video.videoId] ?? ''} onChange={event => study.setNote(video.videoId, event.target.value)} placeholder="Write your own notes…"/></label> : <div className="guest-notes"><p>Save your notes with this video.</p><button className="account-sign-in" onClick={requestSignIn}>Sign in to keep notes</button></div>}</details></section>
    {progressError && <p role="alert">{progressError}</p>}
    <details className="video-playback-help"><summary>Playback help</summary><p><a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">Open on YouTube if playback is unavailable</a></p></details>
    <NextVideoCard/>
  </article>;
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
    if (studyRef.current.autoPlayId === video.id) iframe.src += '&autoplay=1';
    if (studyRef.current.enabled) iframe.src += '&start=' + (studyRef.current.positions[video.videoId] ?? 0);
    iframe.title = 'Supplementary course video';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    const bind = () => {
      if (disposed || player || !window.YT?.Player) return;
      const api = window.YT;
      player = new api.Player(iframe, { events: { onReady: event => { if (disposed) return; playerRef.current = event.target; onPlayer(event.target); if (studyRef.current.enabled) stopTracking = trackVideoPosition(event.target, seconds => { if (studyRef.current.enabled) studyRef.current.position(video.videoId, seconds); }); }, onStateChange: event => {
        if (!disposed) { stopTracking.capture(); onPlayer(playerRef.current); }
        if (!disposed && event.data === api.PlayerState.ENDED) { onWatched(video.videoId); studyRef.current.position(video.videoId, 0); studyRef.current.onEnded(video.id); }
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
  }, [video.id, video.videoId, onWatched, study.enabled, onPlayer]);
  return <div className="video-frame" ref={host} />;
}
