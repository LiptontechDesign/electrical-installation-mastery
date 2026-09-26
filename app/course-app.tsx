'use client';

import type { ChangeEvent, CSSProperties } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {
  AlertTriangle, ArrowRight, BookOpen, Bookmark,
  Check, CheckCircle2, ClipboardList, ChevronDown, ChevronRight, Circle,
  Download,
  Home, Info, LockKeyhole, Menu,
  PlayCircle, RotateCcw, Search, Settings, SkipForward,
  Upload, X, Zap,
} from 'lucide-react';
import course, { isRequiredLesson, lessonStudyRole } from './course-curriculum';
import { MoveLessonButton, useCourseOrder } from './course-order';
import { importPromotedWatched } from './integrated-progress';
import { markVideoGroupWatched, recordVideoCompletion } from './flexible-progress';
import LessonProgress from './lesson-progress';
import { initialLearnerState, clampState, isProgressBackup, calendarDay, type LearnerState } from './learner-state';
import { VideoStudyContext, VideoStudyTools, VideoLessonStepper, NextVideoCard, trackVideoPosition, type StudyPlayer } from './video-study-tools';
import { courseMapSnapshot } from './course-drop-model';
import { moduleTone, matchesLessonFilter, type LessonFilter } from './course-ui-model';
import { CourseProgressSummary } from './course-progress-summary';
import { supplementaryDescendants } from './supplementary-model';
import { SupplementaryControls, useSupplementary } from './supplementary-videos';
import { CourseDragProvider, CourseDragModule, CourseDragSection, CourseDragPath, CourseSectionRows } from './course-drag-context';
import { useDialogFocus } from './use-dialog-focus';
import AccountPanel from './account-panel';
import { AccountControl, useCourseAccount } from './course-account';
import CourseOverview from './course-overview';
import LearningHome from './learning-home';
import type { CourseUser } from './server/auth';

const BookWorkspace = dynamic(() => import('./book-reader').then(module => module.BookWorkspace), { ssr: false });

type CourseModule = (typeof course.modules)[number];
type View = 'home' | 'learn' | 'books';

type AutoNextState = {
  seconds: number;
  fromLessonId: string;
  nextLessonId: string;
  waitingForFullscreenExit: boolean;
} | null;

type YouTubePlayerInstance = StudyPlayer & { destroy: () => void };
type YouTubeApi = {
  Player: new (element: HTMLIFrameElement, options: {
    events: {
      onReady?: (event: { target: YouTubePlayerInstance }) => void;
      onStateChange: (event: { data: number }) => void;
      onAutoplayBlocked?: () => void;
    };
  }) => YouTubePlayerInstance;
  PlayerState: { ENDED: number; PLAYING: number };
};

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

const STORAGE_KEY = 'electrical-mastery-progress-v1';

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function todayKey() {
  return calendarDay();
}

function withStudyMinutes(current: LearnerState, minutes: number): LearnerState {
  const date = todayKey();
  return {
    ...current,
    studyMinutesByDate: {
      ...current.studyMinutesByDate,
      [date]: (current.studyMinutesByDate[date] ?? 0) + Math.max(1, Math.round(minutes)),
    },
    updatedAt: new Date().toISOString(),
  };
}

function getRecentStudyMinutes(days: number, entries: Record<string, number>) {
  const threshold = new Date();
  threshold.setHours(0, 0, 0, 0);
  threshold.setDate(threshold.getDate() - (days - 1));
  return Object.entries(entries).reduce((total, [date, minutes]) => {
    const parsed = new Date(`${date}T00:00:00`);
    return parsed >= threshold ? total + minutes : total;
  }, 0);
}

const navigation = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'learn' as const, label: 'Learn', icon: PlayCircle },
  { id: 'books' as const, label: 'Books', icon: BookOpen },
];

export default function CourseApp({ user }: { user: CourseUser | null }) {
  const { requestSignIn } = useCourseAccount();
  const [showOverview, setShowOverview] = useState(false);
  const { course, sectionsByModule, order } = useCourseOrder();
  const supplementary = useSupplementary();
  const supplementaryId = supplementary?.selected?.id;
  const allLessons = useMemo(() => course.modules.flatMap(m => m.lessons), [course]);
  const lessonLookup = useMemo(() => new Map(allLessons.map(l => [l.id, l])), [allLessons]);
  const lessonLocation = useMemo(() => new Map(course.modules.flatMap((module, moduleIndex) => module.lessons.map((lesson, lessonIndex) => [lesson.id, { module, moduleIndex, lessonIndex }] as const))), [course]);
  const [learner, setLearner] = useState<LearnerState>(initialLearnerState);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>('home');

  const [openModuleId, setOpenModuleId] = useState(course.modules[0].id);
  const [mapPath, setMapPath] = useState<CourseModule['path']>(course.modules[0].path);
  const [courseMapCollapsed, setCourseMapCollapsed] = useState(false);
  const [dragOpenModuleIds, setDragOpenModuleIds] = useState<string[]>([]);
  const [moduleDrawerOpen, setModuleDrawerOpen] = useState(false);
  const [organizing, setOrganizing] = useState(false);
  const [lessonFilter, setLessonFilter] = useState<LessonFilter>('all');
  const [collapseCompleted, setCollapseCompleted] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState('');

  const [storageBlocked, setStorageBlocked] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const hydrationStartedRef = useRef(false);
  const legacyProgressRef = useRef(false);

  const learnerRef = useRef(learner);
  const pendingPositions = useRef<Record<string, number>>({});
  const replacingProgress = useRef(false);
  useEffect(() => { learnerRef.current = learner; }, [learner]);
  const saveVideoPosition = useCallback((id: string, seconds: number) => {
    if (!user || !hydrated || storageBlocked || replacingProgress.current || !Number.isFinite(seconds)) return;
    pendingPositions.current[id] = Math.max(0, Math.min(86400, Math.floor(seconds)));
    setLearner(current => {
      const value = Math.max(0, Math.min(86400, Math.floor(seconds)));
      if (current.videoPositions[id] === value) return current;
      return { ...current, videoPositions: { ...current.videoPositions, [id]: value }, updatedAt: new Date().toISOString() };
    });
  }, [user, hydrated, storageBlocked]);
  useEffect(() => {
    if (!user || !hydrated || storageBlocked) return;
    const flush = () => {
      const snapshot = { ...learnerRef.current, videoPositions: { ...learnerRef.current.videoPositions, ...pendingPositions.current } };
      try { window.localStorage.setItem(`${STORAGE_KEY}:${user.id}`, JSON.stringify(snapshot)); } catch { /* Existing save warning handles local failures. */ }
      const body = JSON.stringify({ payload: snapshot });
      void fetch('/api/user-data/learner-state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body, keepalive: new Blob([body]).size < 60000 }).catch(() => {});
    };
    const onHide = () => { queueMicrotask(flush); };
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, [user, hydrated, storageBlocked]);
  const [youtubeApiReady, setYouTubeApiReady] = useState(false);
  const [autoPlayLessonId, setAutoPlayLessonId] = useState<string | null>(null);
  const [autoNextState, setAutoNextState] = useState<AutoNextState>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDialogRef = useRef<HTMLElement>(null);
  const settingsDialogRef = useRef<HTMLElement>(null);
  const courseDrawerRef = useRef<HTMLElement>(null);
  const activeLessonRowRef = useRef<HTMLButtonElement>(null);
  useDialogFocus(searchDialogRef, searchOpen);
  useDialogFocus(settingsDialogRef, settingsOpen);
  useDialogFocus(courseDrawerRef, moduleDrawerOpen);
  const playerHostRef = useRef<HTMLDivElement>(null);
  const playerIframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerBindingRef = useRef<{
    iframe: HTMLIFrameElement;
    player: YouTubePlayerInstance;
    deactivate: () => void;
  } | null>(null);
  const autoNextTimerRef = useRef<number | null>(null);
  const lastEndedLessonRef = useRef<string | null>(null);
  const autoNextEnabledRef = useRef(learner.autoNextEnabled);
  const autoNextStateRef = useRef<AutoNextState>(autoNextState);
  const autoAdvanceRef = useRef<(fromLessonId: string, nextLessonId: string) => void>(() => undefined);
  const startAutoNextCountdownRef = useRef<(fromLessonId: string, nextLessonId: string) => void>(() => undefined);
  const pendingAutoNextRef = useRef<{ fromLessonId: string; nextLessonId: string } | null>(null);

  useEffect(() => {
    const pauseForSupplementary = () => {
      playerBindingRef.current?.player.pauseVideo?.();
      if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
      pendingAutoNextRef.current = null;
      autoNextStateRef.current = null;
      setAutoNextState(null);
      setModuleDrawerOpen(false);
      setView('learn');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('supplementary-video-open', pauseForSupplementary);
    return () => window.removeEventListener('supplementary-video-open', pauseForSupplementary);
  }, []);

  const location = lessonLocation.get(learner.activeLessonId) ?? lessonLocation.get(allLessons[0].id)!;
  const activeLesson = location.module.lessons[location.lessonIndex];
  const completed = useMemo(() => new Set(learner.completedLessonIds), [learner.completedLessonIds]);
  const bookmarked = useMemo(() => new Set(learner.bookmarkedLessonIds), [learner.bookmarkedLessonIds]);
  const mapRows = courseMapSnapshot(order, supplementary?.videos ?? []).rows;
  const watchedRows = new Set([...completed, ...(supplementary?.videos.filter(video => supplementary.watched.includes(video.videoId)).map(video => video.id) ?? [])]);
  const allCourseRows = Object.values(mapRows).flat();
  const savedRows = new Set([...bookmarked, ...(supplementary?.videos.filter(video => learner.videoBookmarks.includes(video.videoId)).map(video => video.id) ?? [])]);
  const pathRows = allCourseRows.filter(row => course.modules.find(module => module.id === row.moduleId)?.path === mapPath);
  const visibleRows = new Set(pathRows.filter(row => matchesLessonFilter(row, organizing ? 'all' : lessonFilter, watchedRows, savedRows)).map(row => row.id));
  const filterCounts = { all: pathRows.length, unwatched: pathRows.filter(row => !watchedRows.has(row.id)).length, saved: pathRows.filter(row => savedRows.has(row.id)).length };
  const requiredModules = course.modules.filter(module => module.path !== 'Professional');
  const requiredLessons = requiredModules.flatMap(module => module.lessons).filter(lesson => isRequiredLesson(lesson.id));
  const courseRequiredTotal = requiredLessons.length;
  const courseRequiredComplete = requiredLessons.filter(lesson => completed.has(lesson.id)).length;
  const coursePercent = percent(courseRequiredComplete, courseRequiredTotal);
  const groupProgress = (ids: string[]) => {
    const core = ids.filter(isRequiredLesson);
    const extra = ids.filter(id => !isRequiredLesson(id));
    const supporting = supplementaryDescendants(supplementary?.videos ?? [], ids);
    const optionalTotal = extra.length + supporting.length;
    const optionalWatched = extra.filter(id => completed.has(id)).length + supporting.filter(video => supplementary?.watched.includes(video.videoId)).length;
    return core.length ? { total: core.length, watched: core.filter(id => completed.has(id)).length, optionalTotal, optionalRemaining: optionalTotal - optionalWatched, optionalOnly: false }
      : { total: optionalTotal, watched: optionalWatched, optionalTotal: 0, optionalRemaining: 0, optionalOnly: true };
  };
  const nextRequiredItem = (() => {
    for (const courseModule of course.modules.filter(module => module.path !== 'Professional')) {
      const lesson = courseModule.lessons.find(lesson => isRequiredLesson(lesson.id) && !completed.has(lesson.id));
      if (lesson) return { module: courseModule, lesson };
    }
  })();
  const weekMinutes = getRecentStudyMinutes(7, learner.studyMinutesByDate);
  const queuedNextLesson = autoNextState ? lessonLookup.get(autoNextState.nextLessonId) : undefined;

  const selectedRowIndex = allCourseRows.findIndex(row => row.id === (supplementaryId ?? activeLesson.id));
  const previousRow = allCourseRows[selectedRowIndex - 1];
  const nextRow = allCourseRows[selectedRowIndex + 1];
  const selectedModule = course.modules.find(module => module.id === (supplementary?.selected?.moduleId ?? location.module.id)) ?? location.module;
  const nextCore = nextRow?.kind === 'core' ? lessonLookup.get(nextRow.id) : undefined;
  const playerOrigin = hydrated && typeof window !== 'undefined' ? window.location.origin : '';
  const playerSrc = playerOrigin
    ? `https://www.youtube.com/embed/${activeLesson.videoId}?enablejsapi=1&origin=${encodeURIComponent(playerOrigin)}&rel=0&playsinline=1&autoplay=${autoPlayLessonId === activeLesson.id ? 1 : 0}`
    : '';

  useEffect(() => {
  autoNextEnabledRef.current = learner.autoNextEnabled;
  autoNextStateRef.current = autoNextState;
  autoAdvanceRef.current = (fromLessonId, nextLessonId) => {
    if (learner.activeLessonId !== fromLessonId) return;
    const nextLocation = lessonLocation.get(nextLessonId);
    if (!nextLocation) return;
    if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    pendingAutoNextRef.current = null;
    autoNextStateRef.current = null;
    setAutoNextState(null);
    setAutoPlayLessonId(nextLessonId);

    setLearner((current) => ({ ...current, activeLessonId: nextLessonId, updatedAt: new Date().toISOString() }));
    setOpenModuleId(nextLocation.module.id);

    setView('learn');
    window.history.replaceState(null, '', `#learn/${nextLessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setToast('Next lesson loaded automatically.');
  };
  startAutoNextCountdownRef.current = (fromLessonId, nextLessonId) => {
    if (learner.activeLessonId !== fromLessonId || !autoNextEnabledRef.current) return;
    if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    pendingAutoNextRef.current = null;

    if (document.hidden || document.fullscreenElement) {
      pendingAutoNextRef.current = { fromLessonId, nextLessonId };
      if (document.fullscreenElement) {
        const waitingState = { seconds: 5, fromLessonId, nextLessonId, waitingForFullscreenExit: true };
        autoNextStateRef.current = waitingState;
        setAutoNextState(waitingState);
        setToast('Video finished in fullscreen. Exit fullscreen when you are ready for the next lesson.');
      } else {
        autoNextStateRef.current = null;
        setAutoNextState(null);
        setToast('Auto-next is paused while this tab is hidden. Return here to continue.');
      }
      return;
    }

    const deadline = Date.now() + 5000;
    const countdownState = { seconds: 5, fromLessonId, nextLessonId, waitingForFullscreenExit: false };
    autoNextStateRef.current = countdownState;
    setAutoNextState(countdownState);
    setToast('Video ended. The next lesson loads in five seconds. Cancel to stay here.');
    autoNextTimerRef.current = window.setInterval(() => {
      const seconds = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      if (seconds <= 0) {
        if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
        autoNextTimerRef.current = null;
        if (!autoNextEnabledRef.current) {
          autoNextStateRef.current = null;
          setAutoNextState(null);
          return;
        }
        if (document.hidden || document.fullscreenElement) {
          startAutoNextCountdownRef.current(fromLessonId, nextLessonId);
          return;
        }
        autoAdvanceRef.current(fromLessonId, nextLessonId);
        return;
      }
      setAutoNextState((current) => {
        const nextState = current && current.fromLessonId === fromLessonId && current.seconds !== seconds
          ? { ...current, seconds }
          : current;
        autoNextStateRef.current = nextState;
        return nextState;
      });
    }, 250);
  };

  }, [learner.activeLessonId, learner.autoNextEnabled, autoNextState, lessonLocation]);

  const handleYouTubeScriptReady = () => {
    if (window.YT?.Player) {
      setYouTubeApiReady(true);
      return;
    }
    const previousReadyHandler = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReadyHandler?.();
      setYouTubeApiReady(true);
    };
  };

  useEffect(() => {
    if (hydrationStartedRef.current) return;
    hydrationStartedRef.current = true;
    let active = true;
    let hydrationFinished = false;
    void (async () => {
      if (!user) {
        const [guestView, guestLessonId] = window.location.hash.replace(/^#/, '').split('/');
        if (navigation.some(item => item.id === guestView)) setView(guestView as View);
        if (guestView === 'learn' && lessonLookup.has(guestLessonId)) {
          const location = lessonLocation.get(guestLessonId)!;
          setLearner({ ...initialLearnerState, activeLessonId: guestLessonId });
          setOpenModuleId(location.module.id); setMapPath(location.module.path);
        }
        hydrationFinished = true;
        setHydrated(true);
        return;
      }
      let nextState = initialLearnerState;
      let localState: LearnerState | null = null;
      let readError = false;
      try {
        const personalKey = `${STORAGE_KEY}:${user.id}`;
        const personal = window.localStorage.getItem(personalKey);
        const legacy = window.localStorage.getItem(STORAGE_KEY);
        legacyProgressRef.current = !personal && Boolean(legacy);
        const saved = personal ?? legacy;
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (!isProgressBackup(parsed, new Set(lessonLookup.keys()))) throw new Error('Unreadable or newer progress format');
          localState = clampState(parsed);
        }
      } catch { readError = true; }
      try {
        const response = await fetch('/api/user-data/learner-state', { cache: 'no-store' });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        nextState = data.exists ? clampState(data.payload) : localState ?? initialLearnerState;
      } catch (value) {
        nextState = localState ?? initialLearnerState;
        if (active) setToast(value instanceof Error ? value.message : 'Cloud progress could not be loaded.');
      }
      try {
        const watched: unknown = JSON.parse(window.localStorage.getItem(`electrical-supplementary-watched-v1:${user.id}`) ?? window.localStorage.getItem('electrical-supplementary-watched-v1') ?? '[]');
        nextState = importPromotedWatched(nextState, watched);
      } catch { /* Preserve an unreadable supplementary record; do not block core progress. */ }
      const [hashView, hashId] = window.location.hash.replace(/^#/, '').split('/');
      if (hashView === 'learn' && hashId && lessonLookup.has(hashId)) nextState = { ...nextState, activeLessonId: hashId };
      if (!active) return;
      if (readError && !localState) { setStorageBlocked(true); setToast('A browser copy could not be read. Your cloud record was not changed.'); }
      if (hashView === 'library' || hashView === 'practice' || hashView === 'exam') {
        setView('learn');
        const restoredModule = lessonLocation.get(nextState.activeLessonId)?.module ?? course.modules[0];
        setOpenModuleId(restoredModule.id); setMapPath(restoredModule.path);
        window.history.replaceState(null, '', `#learn/${nextState.activeLessonId}`);
      } else if (navigation.some(item => item.id === hashView)) setView(hashView as View);
      if (hashView === 'learn' && hashId && lessonLookup.has(hashId)) {
        const restoredModule = lessonLocation.get(nextState.activeLessonId)?.module ?? course.modules[0];
        setOpenModuleId(restoredModule.id); setMapPath(restoredModule.path);
      }
      setLearner(nextState);
      hydrationFinished = true;
      setHydrated(true);
    })();
    return () => { active = false; if (!hydrationFinished) hydrationStartedRef.current = false; };
  }, [course.modules, lessonLocation, lessonLookup, user]);

  useEffect(() => {
    if (view !== 'learn') return;
    activeLessonRowRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [activeLesson.id, moduleDrawerOpen, openModuleId, view]);

  useEffect(() => {
    if (!user || !hydrated || storageBlocked) return;
    const timer = window.setTimeout(async () => {
      try {
        window.localStorage.setItem(`${STORAGE_KEY}:${user.id}`, JSON.stringify(learner));
        const response = await fetch('/api/user-data/learner-state', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payload: learner }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        if (legacyProgressRef.current) { window.localStorage.removeItem(STORAGE_KEY); legacyProgressRef.current = false; }
        setSaveError(false);
      } catch { setSaveError(true); }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [hydrated, learner, storageBlocked, user]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 3600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement | null;
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(element?.tagName ?? '');
      if (event.key === '/' && !typing) {
        event.preventDefault();
        setSearchOpen(true);
        window.setTimeout(() => searchInputRef.current?.focus(), 0);
      }
      if (event.key === 'Escape') {
        if (event.defaultPrevented || document.querySelector('.course-drag-shell[data-moving="true"]')) return;
        setSearchOpen(false);
        setSettingsOpen(false);
        setConfirmReset(false);
        setModuleDrawerOpen(false);
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden && autoNextTimerRef.current !== null) {
        const activeCountdown = autoNextStateRef.current;
        window.clearInterval(autoNextTimerRef.current);
        autoNextTimerRef.current = null;
        if (activeCountdown) {
          startAutoNextCountdownRef.current(activeCountdown.fromLessonId, activeCountdown.nextLessonId);
        } else {
          setAutoNextState(null);
        }
        return;
      }
      if (document.hidden || document.fullscreenElement) return;
      const pending = pendingAutoNextRef.current;
      if (!pending) return;
      pendingAutoNextRef.current = null;
      startAutoNextCountdownRef.current(pending.fromLessonId, pending.nextLessonId);
    };
    const onFullscreenChange = () => {
      if (document.hidden) return;
      if (document.fullscreenElement) {
        const activeCountdown = autoNextStateRef.current;
        if (!activeCountdown || activeCountdown.waitingForFullscreenExit) return;
        if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
        autoNextTimerRef.current = null;
        startAutoNextCountdownRef.current(activeCountdown.fromLessonId, activeCountdown.nextLessonId);
        return;
      }
      const pending = pendingAutoNextRef.current;
      if (!pending) return;
      pendingAutoNextRef.current = null;
      startAutoNextCountdownRef.current(pending.fromLessonId, pending.nextLessonId);
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('visibilitychange', onVisibilityChange);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
      autoNextTimerRef.current = null;
      pendingAutoNextRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (view !== 'learn') return;
    const host = playerHostRef.current;
    if (!host || !playerSrc) return;

    const iframe = document.createElement('iframe');
    iframe.id = `youtube-player-${activeLesson.id}`;
    iframe.src = playerSrc + (user ? '&start=' + (learnerRef.current.videoPositions[activeLesson.videoId] ?? 0) : '');
    iframe.title = activeLesson.title;
    iframe.allow = 'autoplay';
    iframe.allowFullscreen = true;
    host.replaceChildren(iframe);
    playerIframeRef.current = iframe;

    return () => {
      const binding = playerBindingRef.current;
      if (binding?.iframe === iframe) {
        binding.deactivate();
        try {
          binding.player.destroy();
        } catch {
          iframe.remove();
        }
        playerBindingRef.current = null;
      }
      if (playerIframeRef.current === iframe) playerIframeRef.current = null;
      if (iframe.parentNode === host) host.removeChild(iframe);
    };
  }, [view, playerSrc, activeLesson.id, activeLesson.title, activeLesson.videoId, user, supplementaryId]);

  useEffect(() => {
    if (view !== 'learn') return;
    const iframe = playerIframeRef.current;
    const youTube = window.YT;
    if (!youtubeApiReady || !iframe || !youTube?.Player || playerBindingRef.current?.iframe === iframe) return;

    const lessonId = activeLesson.id;
    const durationMinutes = Math.ceil(activeLesson.durationSeconds / 60);
    const lessonIndex = allLessons.findIndex((lesson) => lesson.id === lessonId);
    const nextLesson = allLessons[lessonIndex + 1];
    let destroyed = false;
    lastEndedLessonRef.current = null;

    let stopTracking = Object.assign(() => {}, { capture: () => {} });
    const player = new youTube.Player(iframe, {
      events: {
        onReady: event => { if (!destroyed && user) stopTracking = trackVideoPosition(event.target, seconds => saveVideoPosition(activeLesson.videoId, seconds)); },
        onStateChange: (event) => {
          if (destroyed) return;
          stopTracking.capture();
          if (event.data === youTube.PlayerState.PLAYING) lastEndedLessonRef.current = null;
          if (
            event.data !== youTube.PlayerState.ENDED ||
            lastEndedLessonRef.current === lessonId
          ) return;

          lastEndedLessonRef.current = lessonId;
          saveVideoPosition(activeLesson.videoId, 0);
          if (user) setLearner((current) => {
            return withStudyMinutes({
              ...current,
              ...recordVideoCompletion(current,lessonId),
              updatedAt: new Date().toISOString(),
            }, durationMinutes);
          });


          if (!nextLesson) {
            setToast('Final video watched. Return to the course or open your books.');
            return;
          }

          if (!autoNextEnabledRef.current) {
            setToast('Video watched. Choose another lesson when you are ready.');
            return;
          }

          startAutoNextCountdownRef.current(lessonId, nextLesson.id);
        },
        onAutoplayBlocked: () => {
          if (!destroyed && autoPlayLessonId === lessonId) {
            setToast('The next lesson is ready. Your browser blocked automatic playback, so press Play to begin.');
          }
        },
      },
    });
    playerBindingRef.current = { iframe, player, deactivate: () => { stopTracking(); destroyed = true; } };
  }, [view, youtubeApiReady, playerSrc, activeLesson.id, activeLesson.durationSeconds, autoPlayLessonId, allLessons, user, supplementaryId, activeLesson.videoId, saveVideoPosition]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    const results = [
      ...allLessons.map((lesson) => {
        const lessonPosition=lessonLocation.get(lesson.id)!;
        return {
          kind: 'Video lesson' as const,
          id: lesson.id,
          parentId: '',
          title: lesson.title,
          subtitle: `M${pad(lessonPosition.module.number)} · L${pad(lesson.number)} · ${lesson.topic} · ${lesson.instructor}`,
          searchable: `${lesson.title} ${lesson.topic} ${lesson.instructor} ${lesson.layer}`,
        };
      }),
    ];
    return results.filter((result) => !query || result.searchable.toLocaleLowerCase().includes(query))
      .sort((a,b) => Number(b.title.toLowerCase() === query) - Number(a.title.toLowerCase() === query)).slice(0, 36);
  }, [searchQuery, allLessons, lessonLocation]);

  const cancelAutoNext = (announce = false) => {
    if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    pendingAutoNextRef.current = null;
    autoNextStateRef.current = null;
    setAutoNextState(null);
    if (announce) setToast('Auto-next cancelled. You can stay on this lesson.');
  };

  const toggleAutoNextPreference = () => {
    const enabled = !learner.autoNextEnabled;
    if (!enabled) cancelAutoNext(false);
    setLearner((current) => ({ ...current, autoNextEnabled: enabled, updatedAt: new Date().toISOString() }));
    setToast(enabled ? 'Auto-next is on. Finished videos will move to the next lesson after five seconds.' : 'Auto-next is off. Choose the next lesson when you are ready.');
  };

  const playQueuedLessonNow = () => {
    if (!autoNextState) return;
    if (autoNextState.waitingForFullscreenExit && document.fullscreenElement) {
      setToast('Exit fullscreen first so the current player can close safely.');
      return;
    }
    const { fromLessonId, nextLessonId } = autoNextState;
    if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    setAutoNextState(null);
    autoAdvanceRef.current(fromLessonId, nextLessonId);
  };

  const navigate = (nextView: View) => {
    supplementary?.clearSelection();
    if (nextView !== 'learn') {
      cancelAutoNext(false);
      setAutoPlayLessonId(null);

    }
    setView(nextView);
    const suffix = nextView === 'learn' ? `/${learner.activeLessonId}` : '';
    window.history.replaceState(null, '', `#${nextView}${suffix}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadLesson = (lessonId: string) => {
    const nextLocation = lessonLocation.get(lessonId);
    if (!nextLocation) return;
    supplementary?.clearSelection();
    cancelAutoNext(false);
    setAutoPlayLessonId(null);

    setLearner((current) => ({ ...current, activeLessonId: lessonId, updatedAt: new Date().toISOString() }));
    setOpenModuleId(nextLocation.module.id);
    setMapPath(nextLocation.module.path);

    setView('learn');
    setSearchOpen(false);
    setModuleDrawerOpen(false);
    window.history.replaceState(null, '', `#learn/${lessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseLesson = (lessonId: string) => loadLesson(lessonId);

  const openCourseMap = () => {
    setCourseMapCollapsed(false);
    const currentModule = course.modules.find(module => module.id === (supplementary?.selected?.moduleId ?? location.module.id));
    if (currentModule) { setMapPath(currentModule.path); setOpenModuleId(currentModule.id); }
    if (window.matchMedia('(max-width: 1180px)').matches) setModuleDrawerOpen(true);
  };

  const closeCourseMap = () => {
    if (document.querySelector('.course-drag-shell[data-moving="true"]')) return;
    setModuleDrawerOpen(false);
    if (!window.matchMedia('(max-width: 1180px)').matches) setCourseMapCollapsed(true);
  };

  const chooseMapPath = (path: CourseModule['path']) => {
    setMapPath(path);
    const currentPathModule = location.module.path === path ? location.module : course.modules.find(module => module.path === path);
    if (currentPathModule) setOpenModuleId(currentPathModule.id);
  };

  const chooseModule = (module: CourseModule) => {
    if (!module.lessons.length) { setToast('This module is empty. Move a lesson here from another module.'); return; }
    loadLesson(module.lessons.find(lesson=>!completed.has(lesson.id))?.id??module.lessons[0].id);
  };

  const selectCourseRow = (row: (typeof allCourseRows)[number]) => {
    if (row.kind === 'core') { chooseLesson(row.id); return; }
    const video = supplementary?.videos.find(video => video.id === row.id);
    if (!video) return;
    const targetModule = course.modules.find(module => module.id === row.moduleId)!;
    setMapPath(targetModule.path); setOpenModuleId(targetModule.id); supplementary?.open(video);
  };

  const toggleComplete = () => {
    if (!user) { requestSignIn(); return; }
    const isComplete = completed.has(activeLesson.id);
    setLearner((current) => {
      return { ...current, ...(current.completedLessonIds.includes(activeLesson.id) ? {completedLessonIds:current.completedLessonIds.filter(id=>id!==activeLesson.id)} : recordVideoCompletion(current,activeLesson.id)), updatedAt: new Date().toISOString() };
    });
    setToast(isComplete ? 'Watched mark removed.' : 'Video marked as watched.');
  };

  const markGroupWatched = (lessonIds: string[], moduleId: string, label: string) => {
    if (!user) { requestSignIn(); return; }
    setLearner((current) => ({ ...markVideoGroupWatched(current, lessonIds), updatedAt: new Date().toISOString() }));
    window.dispatchEvent(new CustomEvent('supplementary-bulk-watch', { detail: { moduleId, lessonIds } }));
    setToast(`${label} marked as watched.`);
  };

  const toggleBookmark = () => {
    if (!user) { requestSignIn(); return; }
    const isSaved = bookmarked.has(activeLesson.id);
    setLearner((current) => ({ ...current, bookmarkedLessonIds: isSaved ? current.bookmarkedLessonIds.filter((id) => id !== activeLesson.id) : [...current.bookmarkedLessonIds, activeLesson.id], updatedAt: new Date().toISOString() }));
    setToast(isSaved ? 'Bookmark removed.' : 'Lesson saved to your notebook.');
  };

  const chooseSearchResult = (result: (typeof searchResults)[number]) => {
    if (result.kind === 'Video lesson') chooseLesson(result.id);
  };

  const exportProgress = () => {
    const payload = JSON.stringify({ app: 'Electrical Installation Mastery', exportedAt: new Date().toISOString(), progress: learner }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `electrical-mastery-progress-${todayKey()}.json`; anchor.click();
    URL.revokeObjectURL(url); setToast('Progress backup downloaded.');
  };

  const importProgress = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const record = parsed.progress ?? parsed;
      if (!isProgressBackup(record, new Set(lessonLookup.keys()))) throw new Error('Invalid backup');
      replacingProgress.current = true; pendingPositions.current = {}; setLearner(clampState(record)); window.setTimeout(() => { replacingProgress.current = false; }, 0); setStorageBlocked(false); setToast('Progress backup restored.'); setSettingsOpen(false);
    } catch { setToast('That file is not a valid course progress backup.'); }
  };

  const resetProgress = () => { replacingProgress.current = true; pendingPositions.current = {}; window.setTimeout(() => { replacingProgress.current = false; }, 0); setLearner({...initialLearnerState,promotedVideoProgressImported:true}); setStorageBlocked(false); setConfirmReset(false); setSettingsOpen(false); navigate('home'); setToast('Your learning progress has been reset and will sync to your account.'); };
  const browsingControls = (
    <section className="browsing-controls flexible-navigation" aria-label="Learning navigation">
      <p><strong>Learn in any order</strong>Open any lesson. Unfinished work stays visible.</p>
      {nextRequiredItem && <button type="button" className="resume-unfinished" onClick={() => chooseLesson(nextRequiredItem.lesson.id)}><ArrowRight size={16}/> Suggested next step</button>}
    </section>
  );

  return (
    <VideoStudyContext.Provider value={{ enabled: Boolean(user && hydrated),
      savedVideos: learner.videoBookmarks, videoNotes: learner.videoNotes,
      toggleSaved: id => { if (user) setLearner(current => ({ ...current, videoBookmarks: current.videoBookmarks.includes(id) ? current.videoBookmarks.filter(value => value !== id) : [...current.videoBookmarks, id], updatedAt: new Date().toISOString() })); },
      setNote: (id, text) => { if (user) setLearner(current => ({ ...current, videoNotes: { ...current.videoNotes, [id]: text }, updatedAt: new Date().toISOString() })); },
      openCourseMap,
      navigation: { position: allCourseRows[selectedRowIndex]?.displayNumber ?? 1, total: allCourseRows.filter(row => row.moduleId === selectedModule.id).length, path: selectedModule.path, moduleTitle: selectedModule.title,
        previous: previousRow ? { title: previousRow.title, select: () => selectCourseRow(previousRow) } : undefined,
        next: nextRow ? { title: nextRow.title, duration: nextCore?.duration, optional: !nextCore || !isRequiredLesson(nextCore.id), select: () => selectCourseRow(nextRow) } : undefined },
      positions: learner.videoPositions, notes: learner.timestampNotes, position: saveVideoPosition,
      addNote: (id, seconds, text) => { if (user) setLearner(current => ({ ...current, timestampNotes: { ...current.timestampNotes, [id]: [...(current.timestampNotes[id] ?? []), { id: crypto.randomUUID(), seconds: Math.floor(seconds), text }].slice(0, 100) }, updatedAt: new Date().toISOString() })); },
      removeNote: (id, noteId) => { if (user) setLearner(current => ({ ...current, timestampNotes: { ...current.timestampNotes, [id]: (current.timestampNotes[id] ?? []).filter(note => note.id !== noteId) }, updatedAt: new Date().toISOString() })); }
    }}><div data-view={view} data-organizing={organizing} className={user ? 'app-shell studio-shell signed-in-course' : 'app-shell studio-shell guest-course'}>
      <Script
        id="youtube-iframe-api"
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
        onReady={handleYouTubeScriptReady}
        onError={() => setToast('Auto-next could not connect. Videos still play normally.')}
      />
      <a className="skip-link" href="#main-content">Skip to course content</a>

      <div className="app-frame">
        <header className="app-header studio-header" aria-label="Application toolbar">
          <button className="studio-brand" type="button" onClick={() => navigate('home')} aria-label="Electrical Installation Mastery home"><span className="studio-monogram"><Zap size={22}/></span><span><strong>Electrical</strong><small>INSTALLATION MASTERY</small></span></button>
          <nav className="studio-navigation" aria-label="Primary navigation">{navigation.map(item => <button key={item.id} type="button" className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}>{item.id === 'home' ? user ? 'My learning' : 'The course' : item.label}</button>)}<Link href="/practice" className="studio-practice-link">Practice</Link></nav>
          <div className="header-actions">
            <button className="studio-search" type="button" aria-label="Search video lessons" onClick={() => { setSearchOpen(true); window.setTimeout(() => searchInputRef.current?.focus(), 0); }}><Search size={20}/><span>Find a lesson</span><kbd>/</kbd></button>
            {user ? <button className="course-progress-chip" onClick={() => { setShowOverview(false); navigate('home'); }} aria-label={`${coursePercent}% of the required course path complete`}><span className="progress-chip-ring" style={{ '--course-progress': `${coursePercent * 3.6}deg` } as CSSProperties}/><span><strong>{coursePercent}%</strong><small>Course progress</small></span></button> : <button className="studio-settings" onClick={() => setSettingsOpen(true)} aria-label="Playback settings"><Settings size={19}/></button>}
            <AccountControl onSettings={() => setSettingsOpen(true)}/>
          </div>
        </header>
        {view === 'learn' && <div className="studio-lesson-navigation"><button type="button" onClick={moduleDrawerOpen ? closeCourseMap : openCourseMap} aria-expanded={moduleDrawerOpen} aria-label={moduleDrawerOpen ? 'Close course map' : 'Open course map'}><Menu size={17}/> Course content</button><span>{selectedModule.title}</span><button type="button" onClick={() => { setShowOverview(true); navigate('home'); }}>Course overview <ArrowRight size={15}/></button></div>}

        <main id="main-content" className="app-content">
          {!user && view !== 'home' && <div className="guest-learning-bar"><span>Guest mode <span>· Progress is not saved</span></span><button onClick={requestSignIn}>Sign in to save your learning <ArrowRight size={15}/></button></div>}
          {user && view === 'home' && <div className="home-view-switch"><button aria-pressed={!showOverview} onClick={() => setShowOverview(false)}>My learning</button><button aria-pressed={showOverview} onClick={() => setShowOverview(true)}>About this course</button></div>}
          {(storageBlocked || saveError) && <div className="storage-warning" role="alert"><strong>{storageBlocked ? 'The unreadable browser copy is being preserved.' : 'Your latest changes could not be synced to your account.'}</strong><p>Download a backup of this session and retry when your connection is available.</p><button type="button" onClick={exportProgress}>Download this session</button></div>}
          {view === 'home' && (!user || showOverview) && <CourseOverview onLesson={chooseLesson} onBooks={() => navigate('books')}/>}
          {view === 'home' && user && !showOverview && (
            <div className="page home-page">
              <LearningHome user={user} learner={learner} percent={coursePercent} weekMinutes={weekMinutes} onLesson={chooseLesson} onBooks={() => navigate('books')}/>
              <section className="home-course">
                <div className="home-primary-column">
                  <div className="section-heading compact"><div><h2>Course modules</h2></div></div>
                  {browsingControls}
                  <div className="module-card-grid">
                    {course.modules.map((module) => {
                      const progress=groupProgress(module.lessons.map(lesson => lesson.id));
                      return <button type="button" className="module-card" data-module-tone={moduleTone(module.id)} data-pathway={module.path} data-complete={progress.total > 0 && progress.watched === progress.total} key={module.id} onClick={() => chooseModule(module)}><div className="module-card-head"><span>{pad(module.number)}</span><small>{module.path === 'Professional' ? 'Advanced' : module.path} · {module.duration}</small></div><h3>{module.title}</h3><CourseProgressSummary {...progress} label={module.title + ' progress'}/></button>;
                    })}
                  </div>
                </div>

              </section>
            </div>
          )}
          {view === 'learn' && (
            <div className={`learn-page ${courseMapCollapsed ? 'course-map-collapsed' : ''}`}>
              <CourseDragProvider organizing={organizing} onLocate={moduleId => { setMapPath(course.modules.find(m => m.id === moduleId)!.path); setOpenModuleId(moduleId); }}><aside ref={courseDrawerRef} className={`course-map ${moduleDrawerOpen ? 'drawer-open' : ''}`} role={moduleDrawerOpen?'dialog':undefined} aria-modal={moduleDrawerOpen?true:undefined} aria-label="Course modules">
                <div className="drawer-heading"><div><span className="eyebrow neutral">Video course</span><h2>Course map</h2></div><button type="button" onClick={closeCourseMap} aria-label="Close course map"><X size={21} /></button></div>
                <div className="course-path-switcher" role="group" aria-label="Choose learning pathway">
                  {(['C2','C1','Professional'] as const).map(path=><CourseDragPath key={path} id={path} selected={mapPath===path} onSelect={()=>chooseMapPath(path)}>{path==='Professional'?'Advanced':path}</CourseDragPath>)}
                </div>
                <div className="map-guidance"><span>Explore at your own pace</span>{nextRequiredItem && <button type="button" onClick={() => chooseLesson(nextRequiredItem.lesson.id)}>Next unwatched <ArrowRight size={14}/></button>}</div>
                {user && <div className="course-summary"><span>{courseRequiredComplete}/{courseRequiredTotal} required videos watched</span><b>{coursePercent}%</b><div className="progress-line"><span style={{ width: `${coursePercent}%` }} /></div></div>}
                {user && <div className="course-map-tools">
                  <button type="button" className="organise-toggle" aria-pressed={organizing} onClick={() => { if (document.querySelector('.course-drag-shell[data-moving="true"]')) return; setOrganizing(value => !value); setLessonFilter('all'); }}>{organizing ? 'Done organising' : 'Organise course'}</button>
                  {!organizing && <><div className="lesson-filters" role="group" aria-label="Filter lessons">{(['all', 'unwatched', 'saved'] as const).map(filter => <button key={filter} type="button" aria-pressed={lessonFilter === filter} onClick={() => setLessonFilter(filter)}>{filter === 'all' ? 'All' : filter === 'saved' ? 'Saved' : 'Unwatched'} <span>{filterCounts[filter]}</span></button>)}</div>
                  <label className="collapse-completed"><input type="checkbox" checked={collapseCompleted} onChange={event => setCollapseCompleted(event.target.checked)}/>Collapse completed sections</label>
                  {lessonFilter !== 'all' && <p className="filter-notice">{visibleRows.size} matching {lessonFilter === 'saved' ? 'saved lessons' : 'videos'} in this pathway. <button type="button" onClick={() => setLessonFilter('all')}>Clear filter</button></p>}</>}
                  {organizing && <p className="filter-notice">Drag to reorder, or use Move lesson. Changes are reviewed before saving.</p>}
                </div>}
                {!organizing && lessonFilter !== 'all' && visibleRows.size === 0 && <p className="map-empty" role="status">{lessonFilter === 'saved' ? 'No saved lessons in this pathway yet. Use Save lesson below a video.' : 'You have watched every video in this pathway.'}</p>}
                <nav aria-label="Course module and lesson navigation">
                  {course.modules.filter(module=>module.path===mapPath && (organizing || lessonFilter === 'all' || sectionsByModule[module.id].some(group => mapRows[group.id]?.some(row => visibleRows.has(row.id))))).map((module) => {
                    const isOpen = (!organizing && lessonFilter !== 'all') || openModuleId === module.id || dragOpenModuleIds.includes(module.id);
                    const progress = groupProgress(module.lessons.map(lesson => lesson.id));
                    return (
                      <CourseDragModule key={module.id} id={module.id} expanded={isOpen} onExpand={() => setDragOpenModuleIds(ids => [...new Set([...ids, module.id])])}><section data-current={(supplementary?.selected?.moduleId ?? location.module.id) === module.id} data-module-tone={moduleTone(module.id)} data-pathway={module.path} data-complete={Boolean(user) && progress.total > 0 && progress.watched === progress.total} className={`module-accordion ${isOpen ? 'open' : ''}`}>
                        <button type="button" className={location.module.id === module.id ? 'active' : ''} onClick={() => { setDragOpenModuleIds([]); setOpenModuleId(isOpen ? '' : module.id); }} aria-expanded={isOpen}>
                          <span className="module-index">{user && progress.total > 0 && progress.watched === progress.total ? <Check size={18} aria-label="Completed"/> : pad(module.number)}</span><span><span className="module-eyebrow">Module {pad(module.number)}{(supplementary?.selected?.moduleId ?? location.module.id) === module.id && <span> · Current</span>}</span><strong>{module.title}</strong><small>{module.path === 'Professional' ? 'Advanced' : module.path} · {module.lessons.length} lessons · {module.duration}</small>{user && <CourseProgressSummary {...progress} label={module.title + ' progress'}/>}</span><ChevronDown size={18} />
                        </button>
                        <div className="module-actions">
                          <SupplementaryControls moduleId={module.id} label={`Add video to module ${module.number}: ${module.title}`} />
                          {isOpen&&<button type="button" className="bulk-watch-action" aria-label={`Mark every video in module ${pad(module.number)} as watched`} data-tooltip={`Mark every video in module ${pad(module.number)} as watched`} onClick={()=>markGroupWatched(module.lessons.map(lesson=>lesson.id),module.id,`Module ${pad(module.number)}`)}><CheckCircle2 size={17}/></button>}
                        </div>
                        {isOpen && <div className="accordion-lessons">{sectionsByModule[module.id].filter(group => organizing || lessonFilter === 'all' || mapRows[group.id]?.some(row => visibleRows.has(row.id))).map(group=>{const progress = groupProgress(group.lessonIds); return <CourseDragSection key={group.id} id={group.id}><details className="course-topic-group" data-complete={Boolean(user) && progress.total > 0 && progress.watched === progress.total} key={String(collapseCompleted) + lessonFilter} open={(!organizing && lessonFilter !== 'all') || (!supplementaryId && group.lessonIds.includes(activeLesson.id)) || supplementaryDescendants(supplementary?.videos ?? [], group.lessonIds).some(video => video.id === supplementaryId) || (user && !collapseCompleted && progress.total > 0 && progress.watched === progress.total) || undefined}><summary><span className="section-eyebrow">Section {String(group.number).padStart(2, '0')}</span><span className="section-title">{group.title}</span>{user ? <CourseProgressSummary {...progress} label={group.title + ' progress'}/> : <small>{group.lessonIds.length} core videos</small>}</summary><div className="course-topic-actions"><button type="button" className="bulk-watch-action" aria-label={`Mark every video in section ${group.number} as watched`} data-tooltip={`Mark every video in section ${group.number} as watched`} onClick={()=>markGroupWatched(group.lessonIds,module.id,`Section ${group.number}`)}><CheckCircle2 size={17}/></button>{group.lessonIds.length > 0 && <SupplementaryControls moduleId={module.id} anchorId={group.lessonIds.at(-1)} compact label={`Add video to section ${group.number}: ${group.title}`} />}</div><CourseSectionRows visibleIds={organizing || lessonFilter === 'all' ? undefined : visibleRows} sectionId={group.id} renderCore={(lessonId, displayNumber) => {
                          const lesson=lessonLookup.get(lessonId)!;
                          const isActiveLesson=!supplementaryId&&activeLesson.id===lesson.id;
                          return <button ref={isActiveLesson?activeLessonRowRef:undefined} type="button" className={isActiveLesson?'active':''} aria-current={isActiveLesson?'page':undefined} onClick={()=>chooseLesson(lesson.id)}>{completed.has(lesson.id)?<CheckCircle2 size={17}/>:<Circle size={17}/>}<span><strong>L{pad(displayNumber)} · {lesson.title}</strong><small>{lessonStudyRole(lesson.id)} · {lesson.duration}</small><small className="lesson-row-progress">{isActiveLesson&&<b>Watching now</b>}{completed.has(lesson.id)?'Watched':isActiveLesson?'':'Not watched'}{(learner.videoCompletionCounts[lesson.id]??0)>1?` · ${learner.videoCompletionCounts[lesson.id]} completions`:''}</small></span>{bookmarked.has(lesson.id)&&<div className="lesson-row-state">{bookmarked.has(lesson.id)&&<Bookmark size={14} fill="currentColor"/>}</div>}</button>;
                        }} /></details></CourseDragSection>;})}</div>}
                      </section></CourseDragModule>
                    );
                  })}
                </nav>
              </aside></CourseDragProvider>
              {moduleDrawerOpen && <button className="drawer-scrim" type="button" aria-label="Close course map" onClick={closeCourseMap} />}

{supplementaryId ? supplementary?.playback : <article className="lesson-canvas" data-module-tone={moduleTone(location.module.id)}>
                <div className="lesson-topline">
                  {organizing && <MoveLessonButton key={activeLesson.id} lessonId={activeLesson.id} onMoved={moduleId => { setOpenModuleId(moduleId); setMapPath(course.modules.find(m => m.id === moduleId)!.path); }} />}
                  <SupplementaryControls moduleId={location.module.id} anchorId={activeLesson.id} compact label="Add a supporting video after this lesson" />
                  <button className="mobile-module-button" type="button" onClick={openCourseMap} aria-expanded={moduleDrawerOpen}><Menu size={19} /> Course map</button>
                  <div className="breadcrumbs"><span>{location.module.path}</span><ChevronRight size={15} /><span>{location.module.title}</span></div>
                  <VideoLessonStepper/>
                </div>
                <div className="lesson-title-block"><p className="lesson-kicker"><strong>{location.module.path}.{String(location.module.stageNumber).padStart(2,'0')}</strong><span>·</span>{lessonStudyRole(activeLesson.id)}<span>·</span>{activeLesson.topic}</p><h1>{activeLesson.title}</h1><p>{activeLesson.instructor} <span>·</span> {activeLesson.duration}</p></div>
                <div className="video-shell">
                  <div className="video-frame">
                    {playerSrc
                      ? <div ref={playerHostRef} className="youtube-player player-loading" role="group" aria-label={`${activeLesson.title} video player`} />
                      : <div className="youtube-player player-loading" role="status" aria-label={`Loading ${activeLesson.title}`} />}
                  </div>
                  {autoNextState && queuedNextLesson && (
                    <section className="auto-next-card" aria-labelledby="auto-next-title">
                      <div className={`countdown-ring ${autoNextState.waitingForFullscreenExit ? 'paused' : ''}`} style={{ '--countdown': `${autoNextState.seconds * 72}deg` } as CSSProperties}><span><b>{autoNextState.seconds}</b><small>{autoNextState.waitingForFullscreenExit ? 'after exit' : 'seconds'}</small></span></div>
                      <div className="auto-next-copy"><span className="eyebrow">{autoNextState.waitingForFullscreenExit ? 'Ready after fullscreen' : 'Up next automatically'}</span><h2 id="auto-next-title">{queuedNextLesson.title}</h2><p>{autoNextState.waitingForFullscreenExit ? 'Exit fullscreen to begin the five-second countdown. The current player stays safely in place until then.' : 'This lesson is complete. Continue now or cancel to stay here.'}</p></div>
                      <div className="auto-next-actions"><button type="button" onClick={() => cancelAutoNext(true)}>Cancel</button><button type="button" onClick={playQueuedLessonNow}><SkipForward size={18} /> Next now</button></div>
                    </section>
                  )}
                </div>
                <div className="lesson-control-row">
                  <div><button className={`bookmark-button ${bookmarked.has(activeLesson.id) ? 'active' : ''}`} type="button" onClick={toggleBookmark}><Bookmark size={18} fill={bookmarked.has(activeLesson.id) ? 'currentColor' : 'none'} /> {bookmarked.has(activeLesson.id) ? 'Saved' : 'Save lesson'}</button><button className={`auto-next-toggle ${learner.autoNextEnabled ? 'active' : ''}`} type="button" role="switch" aria-checked={learner.autoNextEnabled} onClick={toggleAutoNextPreference}><SkipForward size={18} /> Auto-next <span>{learner.autoNextEnabled ? 'On' : 'Off'}</span></button></div>
                  <button className={completed.has(activeLesson.id) ? 'complete-button completed' : 'complete-button'} type="button" aria-pressed={completed.has(activeLesson.id)} onClick={toggleComplete}>{completed.has(activeLesson.id) ? <Check size={19} /> : <Circle size={19} />}{completed.has(activeLesson.id) ? 'Watched · Undo' : 'Mark video watched'}</button>
                </div>
                <VideoStudyTools key={activeLesson.videoId} videoId={activeLesson.videoId} getPlayer={() => playerBindingRef.current?.player ?? null}/>
                {user && <LessonProgress watched={completed.has(activeLesson.id)} completions={learner.videoCompletionCounts[activeLesson.id]??0}/>}
                <section className="lesson-personal-notes" aria-label="Personal lesson notes">
                  <details className="lesson-notes-disclosure"><summary>Your lesson notes</summary>{user ? <label className="lesson-notes"><span>Write a private note for this lesson</span><textarea aria-label="Your lesson notes" value={learner.notes[activeLesson.id]??''} onChange={event=>setLearner(current=>({...current,notes:{...current.notes,[activeLesson.id]:event.target.value},updatedAt:new Date().toISOString()}))} placeholder="Write your own notes…"/></label> : <div className="guest-notes"><p>Save your notes with this video.</p><button className="account-sign-in" onClick={requestSignIn}>Sign in to keep notes</button></div>}</details>
                </section>
                <NextVideoCard/>
              </article>}
            </div>
          )}
          {view === 'books' && <BookWorkspace />}
        </main>
        <nav className="mobile-navigation" aria-label="Mobile navigation">{navigation.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" className={view === item.id ? 'active' : ''} aria-current={view === item.id ? 'page' : undefined} onClick={() => navigate(item.id)}><Icon size={20} /><span>{item.label}</span></button>; })}<Link href="/practice" className="mobile-practice-link"><ClipboardList size={20}/><span>Practice</span></Link></nav>
      </div>

      {searchOpen && (
        <div className="modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
          <section ref={searchDialogRef} className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
            <div className="dialog-title"><div><span className="eyebrow neutral">Global search</span><h2 id="search-title">Search the course</h2></div><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={22} /></button></div>
            <label className="search-field"><Search size={21} /><input ref={searchInputRef} aria-label="Search video lessons" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search video titles, topics or instructors…" autoComplete="off" /><kbd>esc</kbd></label>
            <div className="search-results">{searchResults.map((result) => <button type="button" key={`${result.kind}-${result.id}`} onClick={() => chooseSearchResult(result)}><span className="result-icon">{result.kind === 'Video lesson' ? <PlayCircle size={19} /> : <BookOpen size={19} />}</span><span><small>{result.kind}</small><strong>{result.title}</strong><p>{result.subtitle}</p></span><ChevronRight size={18} /></button>)}</div>
            {!searchResults.length && <div className="empty-state"><Search size={25} /><h3>No results yet</h3><p>Try a shorter topic or search one word.</p></div>}
          </section>
        </div>
      )}
      {settingsOpen && (
        <div className="modal-layer align-right" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
          <section ref={settingsDialogRef} className="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="dialog-title"><div><span className="eyebrow neutral">Account & data</span><h2 id="settings-title">Settings</h2></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={22} /></button></div>
            <div className="privacy-panel"><LockKeyhole size={23} /><div><strong>{user ? 'Your private learning data' : 'You’re exploring as a guest'}</strong><p>{user ? 'Video marks, notes, bookmarks, course changes and reading records are saved only under your Google account and sync across devices.' : 'Enjoy the course freely. Your learning activity is not saved. Sign in when you want to keep progress, notes and bookmarks.'}</p>{!user && <button className="account-sign-in" onClick={() => { setSettingsOpen(false); requestSignIn(); }}>Sign in with Google</button>}</div></div>
            {user && <AccountPanel user={user} />}
            <section className="settings-section playback-settings"><span className="eyebrow neutral">Video playback</span><button className="settings-switch" type="button" role="switch" aria-checked={learner.autoNextEnabled} onClick={toggleAutoNextPreference}><SkipForward size={19} /><span><strong>Auto-next after a finished video</strong><small>Optional five-second countdown to the next video</small></span><span className={`switch-track ${learner.autoNextEnabled ? 'on' : ''}`} aria-hidden="true"><i /></span></button><p>In fullscreen, the next video waits until you exit before the countdown begins.</p></section>
            {user && <section className="settings-section"><span className="eyebrow neutral">Backup & restore</span><button type="button" onClick={exportProgress}><Download size={19} /><span><strong>Download progress backup</strong><small>Save video marks, notes and bookmarks</small></span><ChevronRight size={18} /></button><button type="button" onClick={() => importInputRef.current?.click()}><Upload size={19} /><span><strong>Restore from backup</strong><small>Choose a previous JSON backup file</small></span><ChevronRight size={18} /></button><input ref={importInputRef} type="file" accept="application/json,.json" onChange={importProgress} hidden /></section>}
            {user && <section className="settings-section"><span className="eyebrow neutral">Learning record</span><div className="settings-summary"><div><b>{completed.size}</b><span>videos watched</span></div><div><b>{coursePercent}%</b><span>required videos watched</span></div><div><b>{weekMinutes}</b><span>study minutes this week</span></div></div>{confirmReset ? <div className="reset-confirm"><AlertTriangle size={21} /><p>This clears progress from your account on every device. Download a backup first if you may want it later.</p><div><button type="button" onClick={() => setConfirmReset(false)}>Cancel</button><button className="danger" type="button" onClick={resetProgress}>Reset account progress</button></div></div> : <button className="reset-button" type="button" onClick={() => setConfirmReset(true)}><RotateCcw size={19} /><span><strong>Reset learning progress</strong><small>Clear your synced learning record</small></span></button>}</section>}
            <section className="settings-section"><Link className="pwa-install-link" href="/install"><Download size={19}/> Install on your phone <ArrowRight size={16}/></Link><p>Open Electrical Mastery from your home screen.</p></section><div className="settings-footnote"><Info size={18} /><p>Videos stream from YouTube and need internet access.</p></div>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={19} /><span>{toast}</span></div>}
    </div></VideoStudyContext.Provider>
  );
}
