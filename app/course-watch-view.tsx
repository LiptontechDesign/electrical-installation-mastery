'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Maximize, Minimize, SkipForward } from 'lucide-react';
import { VideoStudyContext } from './video-study-tools';
import { useDialogFocus } from './use-dialog-focus';

type WatchDocument = Document & { webkitFullscreenElement?: Element | null; webkitExitFullscreen?: () => void | Promise<void> };
type WatchElement = HTMLDivElement & { webkitRequestFullscreen?: () => void | Promise<void> };
type LockableOrientation = ScreenOrientation & { lock?: (orientation: 'landscape') => Promise<void> };
type VideoDestination = { title: string; select: () => void };
type WatchContext = {
  expanded: boolean; native: boolean; title: string;
  previous?: VideoDestination; next?: VideoDestination;
  enter: () => Promise<void>; exit: () => Promise<void>;
};
const WatchContext = createContext<WatchContext | null>(null);

export function currentFullscreenElement() {
  const doc = document as WatchDocument;
  return doc.fullscreenElement ?? doc.webkitFullscreenElement ?? null;
}

// Only the course-owned container survives both core and supporting-video changes.
// An independently fullscreen YouTube iframe still needs its existing exit guard.
export function fullscreenBlocksCourseNavigation() {
  const element = currentFullscreenElement();
  return Boolean(element && !element.hasAttribute('data-course-watch-screen'));
}

async function exitNativeFullscreen() {
  const doc = document as WatchDocument;
  if (doc.fullscreenElement && doc.exitFullscreen) await doc.exitFullscreen();
  else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
  else await doc.exitFullscreen?.();
}

export default function CourseWatchView({ collapsed, title, previous, next, children }: {
  collapsed: boolean; title: string; previous?: VideoDestination; next?: VideoDestination; children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [native, setNative] = useState(false);
  const nativeRef = useRef(false);
  const wanted = useRef(false);
  const hasEntered = useRef(false);
  const session = useRef(0);
  const orientationAttempt = useRef<{ orientation: LockableOrientation; session: number } | null>(null);
  useDialogFocus(root, expanded);

  const releaseOrientation = useCallback(() => {
    const attempt = orientationAttempt.current;
    orientationAttempt.current = null;
    try { attempt?.orientation.unlock(); } catch { /* Optional device capability. */ }
  }, []);

  const invalidateRequest = useCallback(() => {
    ++session.current;
    wanted.current = false;
  }, []);

  const exit = useCallback(async () => {
    invalidateRequest();
    releaseOrientation();
    const element = currentFullscreenElement();
    if (element && root.current?.contains(element)) {
      try { await exitNativeFullscreen(); }
      catch { if (currentFullscreenElement()) { wanted.current = true; return; } }
    }
    nativeRef.current = false;
    setNative(false);
    setExpanded(false);
  }, [releaseOrientation, invalidateRequest]);

  const enter = useCallback(async () => {
    const element = root.current as WatchElement | null;
    if (!element) return;
    const request = ++session.current;
    hasEntered.current = true;
    wanted.current = true;
    setExpanded(true);
    setNative(false);
    try {
      if (element.requestFullscreen) await element.requestFullscreen({ navigationUI: 'hide' });
      else if (element.webkitRequestFullscreen) await element.webkitRequestFullscreen();
      else return;
      if (request !== session.current) {
        if (!wanted.current && currentFullscreenElement() === element) await exitNativeFullscreen().catch(() => {});
        return;
      }
      nativeRef.current = currentFullscreenElement() === element;
      setNative(nativeRef.current);
      const orientation = window.screen?.orientation as LockableOrientation | undefined;
      if (!nativeRef.current || !orientation?.lock || !window.matchMedia('(pointer: coarse)').matches) return;
      const attempt = { orientation, session: request };
      orientationAttempt.current = attempt;
      try { await orientation.lock('landscape'); }
      catch { if (orientationAttempt.current === attempt) orientationAttempt.current = null; }
    } catch {
      // Expanded view keeps the same controls when native fullscreen is unavailable.
      if (request === session.current) { nativeRef.current = false; setNative(false); }
    }
  }, []);

  useEffect(() => {
    const element = root.current;
    const changed = () => {
      const current = currentFullscreenElement();
      if (current && element?.contains(current)) {
        if (!wanted.current) { void exitNativeFullscreen().catch(() => {}); return; }
        nativeRef.current = true; setNative(true); setExpanded(true);
      } else if (nativeRef.current) {
        invalidateRequest(); nativeRef.current = false;
        releaseOrientation(); setNative(false); setExpanded(false);
      }
    };
    document.addEventListener('fullscreenchange', changed);
    document.addEventListener('webkitfullscreenchange', changed);
    return () => {
      invalidateRequest();
      document.removeEventListener('fullscreenchange', changed);
      document.removeEventListener('webkitfullscreenchange', changed);
      releaseOrientation();
      const current = currentFullscreenElement();
      if (current && element?.contains(current)) void exitNativeFullscreen().catch(() => {});
    };
  }, [releaseOrientation, invalidateRequest]);

  useEffect(() => {
    if (!expanded) return;
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) void exit();
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [expanded, exit]);

  useEffect(() => {
    if (expanded || !hasEntered.current) return;
    const frame = window.requestAnimationFrame(() => {
      const element = root.current;
      if (element && (document.activeElement === element || !element.contains(document.activeElement))) element.querySelector<HTMLButtonElement>('.inline-player-controls .player-expand')?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [expanded]);

  return <WatchContext.Provider value={{ expanded, native, title, previous, next, enter, exit }}>
    <div ref={root} className={`learn-page ${collapsed ? 'course-map-collapsed' : ''}`} data-course-watch-screen data-watch-expanded={expanded} role={expanded ? 'dialog' : undefined} aria-modal={expanded || undefined} aria-label={expanded ? 'Course video player' : undefined}>
      {children}
      {expanded && <CoursePlayerControls fullscreen/>}
    </div>
  </WatchContext.Provider>;
}

export function CoursePlayerControls({ fullscreen = false }: { fullscreen?: boolean }) {
  const watch = useContext(WatchContext);
  const study = useContext(VideoStudyContext);
  if (!watch) return null;
  return <div className={`course-player-controls lesson-stepper ${fullscreen ? 'fullscreen-player-controls' : 'inline-player-controls'}`} role="group" aria-label="Video navigation">
    <button type="button" disabled={!watch.previous} onClick={watch.previous?.select} aria-label="Previous lesson" title={watch.previous?.title ?? 'First video'}><ChevronLeft size={20}/><span className="player-previous-label">Previous</span></button>
    <span className="course-player-label">{fullscreen && <strong>{watch.title}</strong>}<small>Video {study.navigation.position} of {study.navigation.total}{fullscreen && !watch.native && ' · Expanded view'}</small></span>
    <button type="button" disabled={!watch.next} onClick={watch.next?.select} aria-label="Next lesson" title={watch.next?.title ?? 'Last video'}><span>Next</span><ChevronRight size={20}/></button>
    {fullscreen && <button type="button" className="player-auto-next" role="switch" aria-checked={study.autoNextEnabled} aria-label={`Auto-next ${study.autoNextEnabled ? 'On' : 'Off'}`} onClick={study.toggleAutoNext}><SkipForward size={18}/><span className="player-auto-next-label">Auto-next {study.autoNextEnabled ? 'On' : 'Off'}</span><span className="player-auto-next-state">{study.autoNextEnabled ? 'On' : 'Off'}</span></button>}
    <button type="button" className="player-expand" onClick={() => void (watch.expanded ? watch.exit() : watch.enter())} aria-label={watch.expanded ? (watch.native ? 'Exit fullscreen' : 'Exit expanded view') : 'Fullscreen lesson'} title={watch.expanded ? (watch.native ? 'Exit fullscreen' : 'Exit expanded view') : 'Fullscreen lesson'}>{watch.expanded ? <Minimize size={20}/> : <Maximize size={20}/>}<span>{watch.expanded ? 'Exit' : 'Fullscreen'}</span></button>
  </div>;
}
