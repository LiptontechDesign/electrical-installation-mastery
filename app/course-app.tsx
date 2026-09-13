'use client';

import type { ChangeEvent, CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import {
  AlertTriangle, ArrowRight, BookOpen, Bookmark, Calculator,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle,
  CirclePlay, Download,
  Home, Info, ListChecks, LockKeyhole, Menu,
  PlayCircle, RotateCcw, Search, Settings, ShieldCheck, SkipForward, Sparkles, Target,
  Upload, X, Zap,
} from 'lucide-react';
import course, { lessonStudyRole } from './course-curriculum';
import { pathLabels } from './licensing-curriculum';
import { sectionsByModule } from './learning-sections';
import { ElectricalShockContext, LicensingOverview, LicensingStageGuide } from './licensing-ui';
import { importPromotedWatched } from './integrated-progress';
import CourseBridge from './course-bridge';
import { sourceClarifications } from './supplied-lessons';
import { recordVideoCompletion } from './flexible-progress';
import LessonProgress from './lesson-progress';
import { initialLearnerState, clampState, type LearnerState } from './learner-state';
import { lessonGuides } from './lesson-guides';

import LessonOverview from './lesson-overview';
import { SupplementaryControls, SupplementaryRows } from './supplementary-videos';
import type { Reading } from './books-data';
import { appendEvidence, isProgressBackup, calendarDay, type EvidenceInput } from './tutor-model';
import { electricalTerms, matchingTerms } from './knowledge-graph';
import { standardsTopics, standardSources } from './standards-data';
import { practiceForLesson } from './practice-data';

import { useDialogFocus } from './use-dialog-focus';

const PracticeWorkspace = dynamic(() => import('./practice-workspace'), { loading: () => <p role="status">Preparing your practice…</p> });
const ModuleRecap = dynamic(() => import('./module-recap'), { loading: () => <p role="status" className="recap-loading">Opening module recap…</p> });

const BookReader = dynamic(() => import('./book-reader'), { ssr: false });
const BookWorkspace = dynamic(() => import('./book-reader').then(module => module.BookWorkspace), { ssr: false });

type CourseModule = (typeof course.modules)[number];
type View = 'home' | 'learn' | 'books';

type AutoNextState = {
  seconds: number;
  fromLessonId: string;
  nextLessonId: string;
  waitingForFullscreenExit: boolean;
} | null;

type YouTubePlayerInstance = { destroy: () => void; pauseVideo?: () => void };
type YouTubeApi = {
  Player: new (element: HTMLIFrameElement, options: {
    events: {
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
const allLessons = course.modules.flatMap((module) => module.lessons);
const lessonLookup = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
const lessonLocation = new Map(
  course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => [lesson.id, { module, moduleIndex, lessonIndex }] as const),
  ),
);
const globalLessonIndex = new Map(allLessons.map((lesson,index)=>[lesson.id,index]));

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

export default function CourseApp() {
  const [learner, setLearner] = useState<LearnerState>(initialLearnerState);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>('home');

  const [practiceOpen,setPracticeOpen]=useState(false);
  const [returnLesson, setReturnLesson] = useState<{id:string}|null>(null);
  const [openModuleId, setOpenModuleId] = useState(course.modules[0].id);
  const [moduleDrawerOpen, setModuleDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const termDialogRef = useRef<HTMLElement>(null);
  useDialogFocus(termDialogRef, selectedTerm !== null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookReader, setBookReader] = useState<{ reading?: Reading } | null>(null);
  const [recapModuleId,setRecapModuleId] = useState<string|null>(null);
  const [preparationPath,setPreparationPath] = useState<'C2'|'C1'|null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState('');

  const [storageBlocked, setStorageBlocked] = useState(false);
  const [saveError, setSaveError] = useState(false);

  const [youtubeApiReady, setYouTubeApiReady] = useState(false);
  const [autoPlayLessonId, setAutoPlayLessonId] = useState<string | null>(null);
  const [autoNextState, setAutoNextState] = useState<AutoNextState>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDialogRef = useRef<HTMLElement>(null);
  const settingsDialogRef = useRef<HTMLElement>(null);
  const courseDrawerRef = useRef<HTMLElement>(null);
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
  const reviewBeforeNextRef = useRef(learner.reviewBeforeNext);
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
    };
    window.addEventListener('supplementary-video-open', pauseForSupplementary);
    return () => window.removeEventListener('supplementary-video-open', pauseForSupplementary);
  }, []);

  const location = lessonLocation.get(learner.activeLessonId) ?? lessonLocation.get(allLessons[0].id)!;
  const activeLesson = location.module.lessons[location.lessonIndex];
  const completed = useMemo(() => new Set(learner.completedLessonIds), [learner.completedLessonIds]);
  const bookmarked = useMemo(() => new Set(learner.bookmarkedLessonIds), [learner.bookmarkedLessonIds]);
  const requiredModules = course.modules.filter(module => module.path !== 'Professional');
  const requiredLessons = requiredModules.flatMap(module => module.lessons);
  const courseRequiredTotal = requiredLessons.length;
  const courseRequiredComplete = requiredLessons.filter(lesson => completed.has(lesson.id)).length;
  const coursePercent = percent(courseRequiredComplete, courseRequiredTotal);
  const moduleTracking = (module: CourseModule) => {
    const videos = module.lessons.filter(lesson => completed.has(lesson.id)).length;
    return { videos, requiredPercent: percent(videos, module.lessons.length) };
  };
  const nextRequiredItem = (() => {
    for (const courseModule of course.modules.filter(module => module.path !== 'Professional')) {
      const lesson = courseModule.lessons.find(lesson => !completed.has(lesson.id));
      if (lesson) return { module: courseModule, lesson };
    }
  })();
  const weekMinutes = getRecentStudyMinutes(7, learner.studyMinutesByDate);
  const activeGuide = lessonGuides[activeLesson.id] ?? {
    summary: `This lesson develops ${activeLesson.topic.toLocaleLowerCase()} and connects the idea to safe electrical installation work. Use the video for the instructor’s exact examples and sequence.`,
    keyConcepts: [`Understand the purpose of ${activeLesson.topic.toLocaleLowerCase()}.`, 'Connect the principle to the complete circuit or installation.', 'Verify safety and current requirements before practical application.'],
    remember: 'Understand the reason behind a method before trying to remember its steps.',
    practicalConnection: 'Look for this principle in a circuit drawing, safe training board or supervised installation.',
    checkYourself: `Can you explain ${activeLesson.topic.toLocaleLowerCase()} clearly without repeating the video title?`,
  };
  const queuedNextLesson = autoNextState ? lessonLookup.get(autoNextState.nextLessonId) : undefined;

  const activeNextLesson=allLessons[(globalLessonIndex.get(activeLesson.id)??-1)+1];
  const pathEnd=location.module.path!=='Professional'&&course.modules.filter(m=>m.path===location.module.path).at(-1)?.lessons.at(-1)?.id===activeLesson.id;
  const activeLearningText = `${activeLesson.title} ${activeGuide.summary}`;
  const activePractice = practiceForLesson(activeLearningText);
  const playerOrigin = hydrated && typeof window !== 'undefined' ? window.location.origin : '';
  const playerSrc = playerOrigin
    ? `https://www.youtube.com/embed/${activeLesson.videoId}?enablejsapi=1&origin=${encodeURIComponent(playerOrigin)}&rel=0&playsinline=1&autoplay=${autoPlayLessonId === activeLesson.id ? 1 : 0}`
    : '';

  useEffect(() => {
  autoNextEnabledRef.current = learner.autoNextEnabled;
  reviewBeforeNextRef.current = learner.reviewBeforeNext;
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

  }, [learner.activeLessonId, learner.autoNextEnabled, learner.reviewBeforeNext, autoNextState]);

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
    let nextState = initialLearnerState;
    let readError = false;

    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!isProgressBackup(parsed, new Set(lessonLookup.keys()))) throw new Error('Unreadable or newer progress format');
        nextState = clampState(parsed);
      }
    } catch {
      readError = true;
    }
    try {
      const watched:unknown=JSON.parse(window.localStorage.getItem('electrical-supplementary-watched-v1')??'[]');
      nextState=importPromotedWatched(nextState,watched);
    } catch { /* Preserve an unreadable supplementary record; do not block core progress. */ }
    const [hashView, hashId] = window.location.hash.replace(/^#/, '').split('/');
    if (hashView === 'learn' && hashId && lessonLookup.has(hashId)) {
      nextState = { ...nextState, activeLessonId: hashId };
    }
    const timer = window.setTimeout(() => {

      if (readError) { setStorageBlocked(true); setToast('Saved progress could not be read. The original record is preserved; export this session before restoring a valid backup.'); }
      if (hashView === 'library' || hashView === 'practice') {
        setView('learn');
        setOpenModuleId(lessonLocation.get(nextState.activeLessonId)?.module.id ?? course.modules[0].id);
        window.history.replaceState(null, '', `#learn/${nextState.activeLessonId}`);
      } else if (navigation.some((item) => item.id === hashView)) {
        setView(hashView as View);
      }
      if (hashView === 'learn' && hashId && lessonLookup.has(hashId)) {
        setOpenModuleId(lessonLocation.get(nextState.activeLessonId)?.module.id ?? course.modules[0].id);
        if(nextState.activeLessonId!==hashId)window.history.replaceState(null,'',`#learn/${nextState.activeLessonId}`);
      }

      setLearner(nextState);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated || storageBlocked) return;
    const timer = window.setTimeout(() => {
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(learner)); setSaveError(false); }
      catch { setSaveError(true); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [hydrated, learner, storageBlocked]);

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
        setSearchOpen(false); setSelectedTerm(null);
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
    iframe.src = playerSrc;
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
  }, [view, playerSrc, activeLesson.id, activeLesson.title]);

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

    const player = new youTube.Player(iframe, {
      events: {
        onStateChange: (event) => {
          if (destroyed) return;
          if (event.data === youTube.PlayerState.PLAYING) lastEndedLessonRef.current = null;
          if (
            event.data !== youTube.PlayerState.ENDED ||
            lastEndedLessonRef.current === lessonId
          ) return;

          lastEndedLessonRef.current = lessonId;
          setLearner((current) => {
            return withStudyMinutes({
              ...current,
              ...recordVideoCompletion(current,lessonId),
              updatedAt: new Date().toISOString(),
            }, durationMinutes);
          });


          if (!nextLesson) {
            setToast('Final video watched. Review the Overview or open your books.');
            return;
          }

          if (!autoNextEnabledRef.current) {
            setToast('Video watched. Explain the key idea before choosing your next activity.');
            return;
          }

          if (reviewBeforeNextRef.current) {

            setToast('Video watched. Review the Overview, then continue when ready.');
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
    playerBindingRef.current = { iframe, player, deactivate: () => { destroyed = true; } };
  }, [view, youtubeApiReady, playerSrc, activeLesson.id, activeLesson.durationSeconds, autoPlayLessonId]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();
    const results = [
      ...allLessons.map((lesson) => {
        const guide = lessonGuides[lesson.id];
        const lessonPosition=lessonLocation.get(lesson.id)!;
        return {
          kind: 'Video lesson' as const,
          id: lesson.id,
          parentId: '',
          title: lesson.title,
          subtitle: `M${pad(lessonPosition.module.number)} · L${pad(lesson.number)} · ${lesson.topic} · ${lesson.instructor}`,
          searchable: `${lesson.title} ${lesson.topic} ${lesson.instructor} ${lesson.layer} ${guide?.summary ?? ''} ${guide?.keyConcepts.join(' ') ?? ''}`,
        };
      }),
      ...electricalTerms.map((item) => ({ kind: 'Glossary term' as const, id: item.term, parentId: '', title: item.term, subtitle: item.definition, searchable: `${item.term} ${item.aliases.join(' ')} ${item.definition} ${item.category}` })),
      ...standardsTopics.map(topic => ({ kind: 'Standards' as const, id: topic.id, parentId: allLessons.find(lesson => topic.match.test(`${lesson.title} ${lessonGuides[lesson.id].summary}`))?.id ?? allLessons[0].id, title: topic.title, subtitle: topic.principle, searchable: `${topic.title} ${topic.principle} ${topic.verify} ${topic.sources.map(id => { const source = standardSources.find(item => item.id === id); return `${source?.identifier} ${source?.organisation}`; }).join(' ')}` })),
      ...allLessons.flatMap(lesson => {
        const guide = lessonGuides[lesson.id];
        const practice = practiceForLesson(`${lesson.title} ${guide.summary}`);
        return [...(practice.calculation ? [{ title: practice.calculation.title, text: practice.calculation.concept }] : []), ...practice.cases.map(item => ({ title: item.title, text: `${item.concept} ${item.observation}` }))].map(item => ({kind:'Practice' as const,id:`${lesson.id}:${item.title}`,parentId:lesson.id,title:item.title,subtitle:lesson.title,searchable:`${item.title} ${item.text} ${lesson.title}`}));
      }),
      ...learner.evidence.filter(item => !item.correct).slice(-20).map(item => ({kind:'Your learning' as const,id:item.id,parentId:item.lessonId,title:item.misconception ?? 'Revisit this idea',subtitle:lessonLookup.get(item.lessonId)?.title ?? '',searchable:`${item.conceptId} ${item.misconception ?? ''} ${lessonLookup.get(item.lessonId)?.title ?? ''}`})),
    ];
    const aliases = matchingTerms(query).filter(item => item.term.toLowerCase() === query).flatMap(item => item.aliases);
    return results.filter((result) => !query || [query,...aliases].some(value => result.searchable.toLocaleLowerCase().includes(value)))
      .sort((a,b) => Number(b.title.toLowerCase() === query) - Number(a.title.toLowerCase() === query)).slice(0, 36);
  }, [searchQuery, learner.evidence]);

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
    setToast(enabled
      ? learner.reviewBeforeNext
        ? 'Auto-next is on. Finish the lesson recap, then continue to the next lesson.'
        : 'Auto-next is on. Finished videos will move to the next lesson after five seconds.'
      : 'Auto-next is off. Use Complete & continue when you are ready.');
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
    cancelAutoNext(false);
    setAutoPlayLessonId(null);

    setLearner((current) => ({ ...current, activeLessonId: lessonId, updatedAt: new Date().toISOString() }));
    setOpenModuleId(nextLocation.module.id);

    setPracticeOpen(false);
    setView('learn');
    setSearchOpen(false);
    setModuleDrawerOpen(false);
    window.history.replaceState(null, '', `#learn/${lessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseLesson = (lessonId: string) => loadLesson(lessonId);

  const chooseModule = (module: CourseModule) => {
    loadLesson(module.lessons.find(lesson=>!completed.has(lesson.id))?.id??module.lessons[0].id);
  };

  const revisitFoundation = (lessonId: string) => {
    if (lessonId === activeLesson.id) return;
    setReturnLesson({id: activeLesson.id});
    chooseLesson(lessonId);
  };

  const goRelative = (direction: -1 | 1) => {
    const index = allLessons.findIndex((lesson) => lesson.id === activeLesson.id);
    const next = allLessons[index + direction];
    if (next) chooseLesson(next.id);
  };

  const toggleComplete = (advance = false) => {
    const isComplete = completed.has(activeLesson.id);
    setLearner((current) => {
      return { ...current, ...(current.completedLessonIds.includes(activeLesson.id) ? {completedLessonIds:current.completedLessonIds.filter(id=>id!==activeLesson.id)} : recordVideoCompletion(current,activeLesson.id)), updatedAt: new Date().toISOString() };
    });
    setToast(isComplete ? 'Watched mark removed.' : 'Video marked as watched.');
    if (advance && !isComplete) {

      window.setTimeout(() => document.querySelector('.lesson-compass')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }), 100);
    }
  };

  const toggleBookmark = () => {
    const isSaved = bookmarked.has(activeLesson.id);
    setLearner((current) => ({ ...current, bookmarkedLessonIds: isSaved ? current.bookmarkedLessonIds.filter((id) => id !== activeLesson.id) : [...current.bookmarkedLessonIds, activeLesson.id], updatedAt: new Date().toISOString() }));
    setToast(isSaved ? 'Bookmark removed.' : 'Lesson saved to your notebook.');
  };

  const recordEvidence = (input: EvidenceInput) => {
    setLearner(current => ({...current,evidence:appendEvidence(current.evidence,input),updatedAt:new Date().toISOString()}));
  };
  const revealPractice = () => { setPracticeOpen(true); window.setTimeout(() => document.querySelector('.lesson-practice-reveal')?.scrollIntoView({block:'start',behavior:'auto'}),100); };
  const openPractice = (lessonId: string) => { chooseLesson(lessonId); revealPractice(); };

  const chooseSearchResult = (result: (typeof searchResults)[number]) => {
    if (result.kind === 'Video lesson') chooseLesson(result.id);
    if (result.kind === 'Glossary term') {
      setSelectedTerm(result.id); setSearchOpen(false);
    }
    if(result.kind==='Practice'||result.kind==='Your learning') openPractice(result.parentId);
    if(result.kind==='Standards') { chooseLesson(result.parentId);  }
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
      setLearner(clampState(record)); setStorageBlocked(false); setToast('Progress backup restored.'); setSettingsOpen(false);
    } catch { setToast('That file is not a valid course progress backup.'); }
  };

  const resetProgress = () => { setLearner({...initialLearnerState,promotedVideoProgressImported:true}); setStorageBlocked(false); setConfirmReset(false); setSettingsOpen(false); navigate('home'); setToast('Local learning progress has been reset.'); };
  const moduleCompletedCount = (module: CourseModule) => module.lessons.filter((lesson) => completed.has(lesson.id)).length;
  const openModuleRecap = (moduleId:string) => {
    cancelAutoNext(false);
    playerBindingRef.current?.player.pauseVideo?.();
    setAutoPlayLessonId(null);
    setModuleDrawerOpen(false);
    setRecapModuleId(moduleId);
  };

  const browsingControls = (
    <section className="browsing-controls flexible-navigation" aria-label="Learning navigation">
      <p><strong>Learn in any order</strong>Open any lesson. Unfinished work stays visible.</p>
      {nextRequiredItem && <button type="button" className="resume-unfinished" onClick={() => chooseLesson(nextRequiredItem.lesson.id)}><ArrowRight size={16}/> Suggested next step</button>}
    </section>
  );

  return (
    <div className="app-shell">
      <Script
        id="youtube-iframe-api"
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
        onReady={handleYouTubeScriptReady}
        onError={() => setToast('Auto-next could not connect. Videos still work with the normal Complete & continue button.')}
      />
      <a className="skip-link" href="#main-content">Skip to course content</a>

      <aside className="app-sidebar" aria-label="Main navigation">
        <button className="brand" type="button" onClick={() => navigate('home')} aria-label="Electrical Installation Mastery home">
          <span className="brand-symbol" aria-hidden="true"><Zap size={20} /></span>
          <span className="brand-copy"><strong>Electrical</strong><small>Installation Mastery</small></span>
        </button>
        <nav className="side-navigation">
          <span className="nav-label">Workshop</span>
          {navigation.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} type="button" className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon size={19} /><span>{item.label}</span>{item.id === 'learn' && <small>{coursePercent}%</small>}</button>;
          })}
        </nav>
        <div className="sidebar-safety"><ShieldCheck size={22} /><strong>Safety before speed</strong><p>Learn the principle, then practise safely with qualified supervision.</p></div>
        <button className="sidebar-settings" type="button" onClick={() => setSettingsOpen(true)}><Settings size={19} /><span>Data & settings</span></button>
      </aside>

      <div className="app-frame">
        <header className="app-header">
          <button className="mobile-brand" type="button" onClick={() => navigate('home')} aria-label="Go home"><span className="brand-symbol"><Zap size={18} /></span><span>Electrical Mastery</span></button>
          <button className="search-trigger" type="button" aria-label="Search lessons, concepts and practice" onClick={() => { setSearchOpen(true); window.setTimeout(() => searchInputRef.current?.focus(), 0); }}><Search size={19} /><span>Search your learning</span><kbd>/</kbd></button>
          <div className="header-actions">
            <button className="my-books-button" type="button" aria-label="Open My books" onClick={() => navigate('books')}><BookOpen size={19} /><span>My books</span></button>
            <button className="header-progress" type="button" onClick={() => navigate('home')} aria-label={`${coursePercent}% of the required course path complete`}><span className="mini-progress"><i style={{ width: `${coursePercent}%` }} /></span><b>{coursePercent}%</b></button>
            <button className="icon-button" type="button" onClick={() => setSettingsOpen(true)} aria-label="Open data and settings"><Settings size={20} /></button>
          </div>
        </header>

        <main id="main-content" className="app-content">
          {(storageBlocked || saveError) && <div className="storage-warning" role="alert"><strong>{storageBlocked ? 'The existing saved record is being preserved.' : 'This session could not be saved to the browser.'}</strong><p>Download a backup of this session before leaving. Restore a valid backup in Settings to resume normal saving.</p><button type="button" onClick={exportProgress}>Download this session</button></div>}
          {view === 'home' && (
            <div className="page home-page">
              <section className="home-hero">
                <div className="hero-glow" aria-hidden="true" />
                <div className="hero-copy">
                  <span className="eyebrow"><Sparkles size={16} /> Electrical Installation Mastery</span>
                  <h1>{learner.evidence.length ? 'Build on what you know.' : 'Understand it. Put it to work.'}</h1>
                  <p>Continue with a video, explore its Overview, or open your reference books.</p>
                  <div className="button-row">
                    <button className="primary-button" type="button" onClick={() => chooseLesson(learner.activeLessonId)}><CirclePlay size={19} /> {completed.size ? 'Continue learning' : 'Start the course'} <ArrowRight size={18} /></button>
                  </div>
                </div>
                <div className="hero-session-card">
                  <div className="session-label"><span>{nextRequiredItem ? 'Suggested next' : 'Core videos complete'}</span><span>{nextRequiredItem?.lesson.duration ?? '100%'}</span></div>
                  <div className="session-index">{nextRequiredItem ? 'M'+pad(nextRequiredItem.module.number)+' · L'+pad(nextRequiredItem.lesson.number) : 'CORE VIDEOS COMPLETE'}</div>
                  <h2>{nextRequiredItem?.lesson.title ?? 'All required videos watched'}</h2><p>{nextRequiredItem?.module.title ?? 'Revisit an Overview or explore the reference books.'}</p>
                  <div className="session-meter"><span style={{ width: (nextRequiredItem ? moduleTracking(nextRequiredItem.module).requiredPercent : 100)+'%' }} /></div>
                  <button type="button" onClick={() => nextRequiredItem ? chooseLesson(nextRequiredItem.lesson.id) : navigate('books')}>{nextRequiredItem ? 'Open lesson' : 'Open books'} <ArrowRight size={17}/></button>
                </div>
              </section>

              <section className="learning-next-strip" aria-label="Learning resources"><button type="button" onClick={() => navigate('books')}><BookOpen size={19}/><span><strong>Open your books</strong><small>Reference pages and saved reading</small></span><ArrowRight size={17}/></button><button type="button" onClick={() => openPractice(activeLesson.id)}><Calculator size={19}/><span><strong>Apply your current lesson</strong><small>Worked examples and practical reasoning</small></span><ArrowRight size={17}/></button></section>

              <section className="stat-grid home-stats" aria-label="Learning overview">
                <article><span className="stat-icon copper"><PlayCircle size={21} /></span><div><b>{completed.size}<small> / {allLessons.length}</small></b><p>Video lessons completed</p></div></article>
                <article><span className="stat-icon amber"><Target size={21} /></span><div><b>{weekMinutes}<small> / {learner.weeklyGoalMinutes} min</small></b><p>This week’s study goal</p></div></article>
              </section>

              <LicensingOverview initialPath={preparationPath} completed={learner.completedLessonIds} onLesson={chooseLesson}/>
              <section className="home-course">
                <div className="home-primary-column">
                  <div className="section-heading compact"><div><h2>Course modules</h2></div></div>
                  {browsingControls}
                  <div className="module-card-grid">
                    {course.modules.map((module) => {
                      const tracking=moduleTracking(module);
                      return <button type="button" className="module-card" key={module.id} onClick={() => chooseModule(module)}><div className="module-card-head"><span>{pad(module.number)}</span><small>{module.duration}</small></div><h3>{module.title}</h3><div className="progress-line"><span style={{ width: `${tracking.requiredPercent}%` }} /></div><footer><span>{tracking.videos}/{module.lessons.length} videos watched</span><b>{tracking.requiredPercent}%</b></footer></button>;
                    })}
                  </div>
                </div>

              </section>
            </div>
          )}
          {view === 'learn' && (
            <div className="learn-page">
              <aside ref={courseDrawerRef} className={`course-map ${moduleDrawerOpen ? 'drawer-open' : ''}`} role={moduleDrawerOpen?'dialog':undefined} aria-modal={moduleDrawerOpen?true:undefined} aria-label="Course modules">
                <div className="drawer-heading"><div><span className="eyebrow neutral">Video course</span><h2>Course map</h2></div><button type="button" onClick={() => setModuleDrawerOpen(false)} aria-label="Close course map"><X size={21} /></button></div>
                {browsingControls}
                <div className="course-summary"><span>{courseRequiredComplete}/{courseRequiredTotal} required videos watched</span><b>{coursePercent}%</b><div className="progress-line"><span style={{ width: `${coursePercent}%` }} /></div></div>
                <nav>
                  {course.modules.map((module) => {
                    const isOpen = openModuleId === module.id;
                    const done = moduleCompletedCount(module);
                    return (
                      <section className={`module-accordion ${isOpen ? 'open' : ''}`} key={module.id}>
                        {module.stageNumber===1&&<h3 className="licensing-map-heading">{pathLabels[module.path]}</h3>}
                        <button type="button" className={location.module.id === module.id ? 'active' : ''} onClick={() => setOpenModuleId(isOpen ? '' : module.id)} aria-expanded={isOpen}>
                          <span className="module-index">{pad(module.number)}</span><span><strong>{module.title}</strong><small>{done}/{module.lessons.length} videos watched</small></span><ChevronDown size={18} />
                        </button>
                        <SupplementaryControls moduleId={module.id} label={`Add video to module ${module.number}: ${module.title}`} />
                        {isOpen && <div className="accordion-lessons">{['module-01','module-12'].includes(module.id)&&<p className="course-section-guide">Study one section at a time. Core lessons introduce ideas; worked reinforcement applies them; deep practice gives extra problems. Open any section whenever you need it; studying out of order does not mark skipped work complete.</p>}{sectionsByModule[module.id].map(group=><details className="course-topic-group" key={group.id} open={group.lessonIds.includes(activeLesson.id)||undefined}><summary><span>Section {group.number} · {group.title}</span><small>{group.lessonIds.filter(id=>completed.has(id)).length}/{group.lessonIds.length} watched</small></summary>{group.lessonIds.flatMap((lessonId) => {
                          const lesson=lessonLookup.get(lessonId)!;
                          const rows=[<button type="button" key={lesson.id} className={activeLesson.id===lesson.id?'active':''} onClick={()=>chooseLesson(lesson.id)}>{completed.has(lesson.id)?<CheckCircle2 size={17}/>:<Circle size={17}/>}<span><strong>L{pad(lesson.number)} · {lesson.title}</strong><small>{lessonStudyRole(lesson.id)} · {lesson.duration} · {lesson.instructor}</small><small className="lesson-row-progress">{completed.has(lesson.id)?'Watched':'Not watched'}{(learner.videoCompletionCounts[lesson.id]??0)>1?` · ${learner.videoCompletionCounts[lesson.id]} completions`:''}</small></span>{bookmarked.has(lesson.id)&&<div className="lesson-row-state">{bookmarked.has(lesson.id)&&<Bookmark size={14} fill="currentColor"/>}</div>}</button>];
                          if (lesson.id === group.lessonIds[0]) rows.splice(0, 0, <SupplementaryControls key={`${group.id}-add`} moduleId={module.id} anchorId={group.lessonIds.at(-1)} compact label={`Add video to section ${group.number}: ${group.title}`} />);
                          const coreIndex = rows.findIndex(row => row.key === lesson.id);
                          rows.splice(coreIndex, 0, <SupplementaryRows key={`${lesson.id}-supp-before`} anchorId={lesson.id} position="before" />);
                          rows.splice(coreIndex + 2, 0, <SupplementaryRows key={`${lesson.id}-supp-after`} anchorId={lesson.id} position="after" />);
                          return rows;
                        })}</details>)}<button type="button" className="module-recap-link" onClick={()=>openModuleRecap(module.id)}><BookOpen size={19}/><span><strong>Module recap book</strong><small>Key ideas · relationships · source videos</small></span><ChevronRight size={17}/></button></div>}
                      </section>
                    );
                  })}
                </nav>
              </aside>
              {moduleDrawerOpen && <button className="drawer-scrim" type="button" aria-label="Close course map" onClick={() => setModuleDrawerOpen(false)} />}

<article className="lesson-canvas">
                {returnLesson && returnLesson.id !== activeLesson.id && <button type="button" className="secondary-button foundation-return" onClick={()=>{chooseLesson(returnLesson.id);setReturnLesson(null);}}><ChevronLeft size={18}/> Return to {lessonLookup.get(returnLesson.id)?.title}</button>}
                <div className="lesson-topline">
                  <SupplementaryControls moduleId={location.module.id} anchorId={activeLesson.id} compact label="Add a supporting video after this lesson" />
                  <button className="mobile-module-button" type="button" onClick={() => setModuleDrawerOpen(true)}><Menu size={19} /> Course map</button>
                  <div className="breadcrumbs"><span>Module {pad(location.module.number)}</span><ChevronRight size={15} /><span>Lesson {pad(activeLesson.number)}</span></div>
                  <div className="lesson-stepper"><button type="button" onClick={() => goRelative(-1)} disabled={activeLesson.id === allLessons[0].id} aria-label="Previous lesson"><ChevronLeft size={20} /></button><span>{allLessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1} / {allLessons.length}</span><button type="button" onClick={() => goRelative(1)} disabled={activeLesson.id === allLessons.at(-1)?.id} aria-label="Next lesson"><ChevronRight size={20} /></button></div>
                </div>
                <div className="lesson-title-block"><div><span className="topic-pill lesson-sequence">Lesson {pad(activeLesson.number)} of {location.module.lessons.length}</span><span className="topic-pill">{lessonStudyRole(activeLesson.id)}</span><span className="topic-pill">{activeLesson.layer}</span><span className="topic-pill quiet">{activeLesson.topic}</span>{'sourceKind' in activeLesson && typeof activeLesson.sourceKind === 'string' && <span className="topic-pill quiet">{activeLesson.sourceKind}</span>}</div><h1>{activeLesson.title}</h1><p>{activeLesson.instructor} <span>·</span> {activeLesson.duration} <span>·</span> {location.module.title}</p></div>
                <p className="licensing-breadcrumb">{pathLabels[location.module.path]} · Stage {location.module.stageNumber} · {location.module.classification}</p>
                {location.lessonIndex===0&&<LicensingStageGuide moduleId={location.module.id}/>}
                {['course-TsJ49Np3HS0','course-UFvL7wTFzl0'].includes(activeLesson.id)&&<ElectricalShockContext/>}
                <CourseBridge key={activeLesson.id} lessonId={activeLesson.id}/>
                {activeLesson.id.startsWith('course-')&&sourceClarifications[activeLesson.id]&&<aside className="course-source-context"><strong>Source context</strong><p>{sourceClarifications[activeLesson.id]}</p></aside>}
                <div className="video-shell">
                  <div className="video-frame">
                    {playerSrc
                      ? <div ref={playerHostRef} className="youtube-player player-loading" aria-label={`${activeLesson.title} video player`} />
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
                  <button className={completed.has(activeLesson.id) ? 'complete-button completed' : 'complete-button'} type="button" aria-pressed={completed.has(activeLesson.id)} onClick={() => toggleComplete(!completed.has(activeLesson.id))}>{completed.has(activeLesson.id) ? <Check size={19} /> : <Circle size={19} />}{completed.has(activeLesson.id) ? 'Watched · Undo' : 'Mark video watched'}</button>
                </div>
                <LessonProgress watched={completed.has(activeLesson.id)} completions={learner.videoCompletionCounts[activeLesson.id]??0}/>
                <section id="lesson-overview" className="lesson-overview" aria-label="Lesson Overview">
                  <LessonOverview key={activeLesson.id} lessonId={activeLesson.id} guide={activeGuide} watched={completed.has(activeLesson.id)} learningText={activeLearningText} onLesson={revisitFoundation} onRead={reading=>setBookReader({reading})}/>
                  <details className="lesson-practice-reveal" open={practiceOpen} onToggle={event=>setPracticeOpen(event.currentTarget.open)}><summary>Worked examples and investigations</summary>{practiceOpen&&<PracticeWorkspace key={activeLesson.id} lessonId={activeLesson.id} calculation={activePractice.calculation} cases={activePractice.cases} onEvidence={recordEvidence} evidence={learner.evidence}/>}</details>
                  <label className="lesson-notes"><strong>Your lesson notes</strong><textarea aria-label="Your lesson notes" value={learner.notes[activeLesson.id]??''} onChange={event=>setLearner(current=>({...current,notes:{...current.notes,[activeLesson.id]:event.target.value},updatedAt:new Date().toISOString()}))} placeholder="Record an explanation, observation or question…"/></label>
                </section>
                {activeLesson.id===location.module.lessons.at(-1)?.id&&<section className="module-recap-end"><BookOpen size={28}/><div><span>Module {pad(location.module.number)} · Keep the essentials</span><h2>Your module recap book</h2><p>Turn through the key ideas, relationships and practical distinctions from this module’s videos.</p></div><button type="button" onClick={()=>openModuleRecap(location.module.id)}>Open recap <ArrowRight size={18}/></button></section>}
                {pathEnd&&<footer className="lesson-next-card"><div><span>Complete your pathway review</span><h3>{location.module.path} oral and practical preparation</h3></div><button type="button" onClick={()=>{setPreparationPath(location.module.path as 'C2'|'C1');navigate('home');}}>Open preparation <ArrowRight size={18}/></button></footer>}
                {<footer className="lesson-next-card"><div><span>{activeNextLesson?`Next · Lesson ${pad(activeNextLesson.number)}`:'End of video sequence'}</span><h3>{activeNextLesson?.title??'Return Home for unfinished lessons'}</h3></div><button type="button" onClick={()=>activeNextLesson?goRelative(1):navigate('home')}>{activeNextLesson?'Continue':'Go Home'} <ArrowRight size={18}/></button></footer>}
              </article>
            </div>
          )}
          {view === 'books' && <BookWorkspace />}
        </main>
        <nav className="mobile-navigation" aria-label="Mobile navigation">{navigation.map((item) => { const Icon = item.icon; return <button key={item.id} type="button" className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon size={20} /><span>{item.label}</span></button>; })}</nav>
      </div>

      {searchOpen && (
        <div className="modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
          <section ref={searchDialogRef} className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
            <div className="dialog-title"><div><span className="eyebrow neutral">Global search</span><h2 id="search-title">Search the course</h2></div><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={22} /></button></div>
            <label className="search-field"><Search size={21} /><input ref={searchInputRef} aria-label="Search lessons, concepts and practice" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Try “earthing”, “safe isolation” or “voltage drop”…" autoComplete="off" /><kbd>esc</kbd></label>
            <div className="search-results">{searchResults.map((result) => <button type="button" key={`${result.kind}-${result.id}`} onClick={() => chooseSearchResult(result)}><span className="result-icon">{result.kind === 'Video lesson' ? <PlayCircle size={19} /> : <BookOpen size={19} />}</span><span><small>{result.kind}</small><strong>{result.title}</strong><p>{result.subtitle}</p></span><ChevronRight size={18} /></button>)}</div>
            {!searchResults.length && <div className="empty-state"><Search size={25} /><h3>No results yet</h3><p>Try a shorter topic or search one word.</p></div>}
          </section>
        </div>
      )}
      {settingsOpen && (
        <div className="modal-layer align-right" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
          <section ref={settingsDialogRef} className="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="dialog-title"><div><span className="eyebrow neutral">Device & data</span><h2 id="settings-title">Settings</h2></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={22} /></button></div>
            <div className="privacy-panel"><LockKeyhole size={23} /><div><strong>Your learning data</strong><p>Video marks, notes, bookmarks and practical learning records stay in this browser. My books keeps its shared reading record.</p></div></div>
            <section className="settings-section playback-settings"><span className="eyebrow neutral">Playback & review</span><button className="settings-switch" type="button" role="switch" aria-checked={learner.autoNextEnabled} onClick={toggleAutoNextPreference}><SkipForward size={19} /><span><strong>Auto-next after a finished lesson</strong><small>Optional next-video countdown when reflection is switched off</small></span><span className={`switch-track ${learner.autoNextEnabled ? 'on' : ''}`} aria-hidden="true"><i /></span></button><button className="settings-switch" type="button" role="switch" aria-checked={learner.reviewBeforeNext} onClick={() => { const enabled = !learner.reviewBeforeNext; setLearner((current) => ({ ...current, reviewBeforeNext: enabled, updatedAt: new Date().toISOString() })); setToast(enabled ? 'Lesson recap is now required before auto-next.' : 'Auto-next will use the five-second countdown without opening the recap.'); }}><ListChecks size={19} /><span><strong>Review before next</strong><small>Open the lesson Overview when a video finishes</small></span><span className={`switch-track ${learner.reviewBeforeNext ? 'on' : ''}`} aria-hidden="true"><i /></span></button><p>Recommended: keep reflection on. Choose your next learning action after the video. In fullscreen, the app waits for you to exit safely before changing the lesson.</p></section>
            <section className="settings-section"><span className="eyebrow neutral">Backup & restore</span><button type="button" onClick={exportProgress}><Download size={19} /><span><strong>Download progress backup</strong><small>Save video marks, notes and bookmarks</small></span><ChevronRight size={18} /></button><button type="button" onClick={() => importInputRef.current?.click()}><Upload size={19} /><span><strong>Restore from backup</strong><small>Choose a previous JSON backup file</small></span><ChevronRight size={18} /></button><input ref={importInputRef} type="file" accept="application/json,.json" onChange={importProgress} hidden /></section>
            <section className="settings-section"><span className="eyebrow neutral">Learning record</span><div className="settings-summary"><div><b>{completed.size}</b><span>videos watched</span></div><div><b>{coursePercent}%</b><span>required videos watched</span></div><div><b>{weekMinutes}</b><span>study minutes this week</span></div></div>{confirmReset ? <div className="reset-confirm"><AlertTriangle size={21} /><p>This permanently clears progress from this browser. Download a backup first if you may want it later.</p><div><button type="button" onClick={() => setConfirmReset(false)}>Cancel</button><button className="danger" type="button" onClick={resetProgress}>Clear local progress</button></div></div> : <button className="reset-button" type="button" onClick={() => setConfirmReset(true)}><RotateCcw size={19} /><span><strong>Reset local progress</strong><small>Clear this browser’s learning record</small></span></button>}</section>
            <div className="settings-footnote"><Info size={18} /><p>Videos stream from YouTube and need internet access.</p></div>
          </section>
        </div>
      )}
      {selectedTerm && <div className="modal-layer" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedTerm(null);}}><section ref={termDialogRef} className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="term-title"><div className="dialog-title"><h2 id="term-title">{selectedTerm}</h2><button type="button" aria-label="Close term" onClick={()=>setSelectedTerm(null)}><X size={22}/></button></div><p>{electricalTerms.find(term=>term.term===selectedTerm)?.definition}</p><p>{electricalTerms.find(term=>term.term===selectedTerm)?.aliases.join(' · ')}</p></section></div>}
      {toast && <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={19} /><span>{toast}</span></div>}
      {bookReader && <BookReader initialReading={bookReader.reading} onClose={() => setBookReader(null)} />}
      {recapModuleId&&<ModuleRecap key={recapModuleId} moduleId={recapModuleId} completedLessonIds={learner.completedLessonIds} onClose={()=>setRecapModuleId(null)}/>}
    </div>
  );
}
