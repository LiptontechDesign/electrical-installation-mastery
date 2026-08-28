'use client';

import type { ChangeEvent, CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import {
  AlertTriangle, ArrowRight, Award, BarChart3, BookOpen, Bookmark, Calculator,
  Cable, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle,
  CirclePlay, Clock3, Database, Download, ExternalLink, FileUp, FlaskConical,
  Gauge, Home, Info, Lightbulb, ListChecks, LockKeyhole, Menu, NotebookPen,
  PlayCircle, RotateCcw, Search, Settings, ShieldCheck, SkipForward, Sparkles, Target,
  Upload, Wrench, X, Zap,
} from 'lucide-react';
import baseCourse from './course-data.json';
import courseExtension from './course-extension-data';
import { bookCompanions, glossary, practiceLabs } from './learning-data';
import { lessonGuides } from './lesson-guides';
import AssessmentPanel from './assessment-panel';
import { buildAssessmentBank } from './assessment-data';

const baseDurationSeconds = baseCourse.modules.reduce((sum, module) => sum + module.durationSeconds, 0);
const combinedDurationSeconds = baseDurationSeconds + courseExtension.durationSeconds;
const combinedDurationMinutes = Math.floor(combinedDurationSeconds / 60);
const combinedDuration = `${Math.floor(combinedDurationMinutes / 60)} h ${String(combinedDurationMinutes % 60).padStart(2, '0')} min`;

const course = {
  ...baseCourse,
  description: `${baseCourse.lessonCount + courseExtension.lessonCount} carefully sequenced lessons covering electrical foundations, residential first-fix, client specification, modern lighting, smart and security systems, backup power, solar, EV readiness, building services and professional handover.`,
  lessonCount: baseCourse.lessonCount + courseExtension.lessonCount,
  duration: combinedDuration,
  modules: [...baseCourse.modules, ...courseExtension.modules],
};

type CourseModule = (typeof course.modules)[number];
type View = 'home' | 'learn' | 'library' | 'practice' | 'toolkit' | 'progress';
type LessonTab = 'watch' | 'study' | 'practice' | 'notes';
type CalculatorMode = 'ohm' | 'power' | 'three-phase';
type AutoNextState = {
  seconds: number;
  fromLessonId: string;
  nextLessonId: string;
  waitingForFullscreenExit: boolean;
} | null;

type FlashcardLearningState = Record<string, { streak: number; dueAt: string }>;

type YouTubePlayerInstance = { destroy: () => void };
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

type LearnerState = {
  schemaVersion: 3;
  activeLessonId: string;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  notes: Record<string, string>;
  completedReadingIds: string[];
  completedLabIds: string[];
  confidence: Record<string, 1 | 2 | 3>;
  studyMinutesByDate: Record<string, number>;
  weeklyGoalMinutes: number;
  autoNextEnabled: boolean;
  reviewBeforeNext: boolean;
  flashcardProgress: FlashcardLearningState;
  lessonQuizBestScores: Record<string, number>;
  moduleQuizBestScores: Record<string, number>;
  completedLessonAssessmentIds: string[];
  completedModuleAssessmentIds: string[];
  updatedAt: string | null;
};

const STORAGE_KEY = 'electrical-mastery-progress-v1';
const allLessons = course.modules.flatMap((module) => module.lessons);
const lessonLookup = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
const lessonLocation = new Map(
  course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => [lesson.id, { module, moduleIndex, lessonIndex }] as const),
  ),
);
const allReading = bookCompanions.flatMap((book) => book.guides.map((guide) => ({ book, guide })));
const validReadingIds = new Set(allReading.map(({ guide }) => guide.id));
const validLabIds = new Set(practiceLabs.map((lab) => lab.id));
const assessmentBank = buildAssessmentBank(course.modules, lessonGuides);
const validFlashcardIds = new Set(assessmentBank.allFlashcards.map((card) => card.id));
const validModuleIds = new Set(course.modules.map((module) => module.id));

const initialLearnerState: LearnerState = {
  schemaVersion: 3,
  activeLessonId: allLessons[0].id,
  completedLessonIds: [],
  bookmarkedLessonIds: [],
  notes: {},
  completedReadingIds: [],
  completedLabIds: [],
  confidence: {},
  studyMinutesByDate: {},
  weeklyGoalMinutes: 180,
  autoNextEnabled: true,
  reviewBeforeNext: true,
  flashcardProgress: {},
  lessonQuizBestScores: {},
  moduleQuizBestScores: {},
  completedLessonAssessmentIds: [],
  completedModuleAssessmentIds: [],
  updatedAt: null,
};

function uniqueValidIds(value: unknown, validIds: Set<string>) {
  return Array.isArray(value)
    ? [...new Set(value.filter((id): id is string => typeof id === 'string' && validIds.has(id)))]
    : [];
}

function clampState(value: unknown): LearnerState {
  if (!value || typeof value !== 'object') return initialLearnerState;
  const input = value as Partial<LearnerState>;
  const lessonIds = new Set(allLessons.map((lesson) => lesson.id));
  const activeLessonId = typeof input.activeLessonId === 'string' && lessonIds.has(input.activeLessonId)
    ? input.activeLessonId
    : allLessons[0].id;
  const notes = input.notes && typeof input.notes === 'object'
    ? Object.fromEntries(Object.entries(input.notes).filter(([id, note]) => lessonIds.has(id) && typeof note === 'string'))
    : {};
  const confidence = input.confidence && typeof input.confidence === 'object'
    ? Object.fromEntries(Object.entries(input.confidence).filter(
      ([id, rating]) => lessonIds.has(id) && (rating === 1 || rating === 2 || rating === 3),
    )) as Record<string, 1 | 2 | 3>
    : {};
  const studyMinutesByDate = input.studyMinutesByDate && typeof input.studyMinutesByDate === 'object'
    ? Object.fromEntries(Object.entries(input.studyMinutesByDate).filter(
      ([date, minutes]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && typeof minutes === 'number' && minutes >= 0,
    ))
    : {};
  const flashcardProgress = input.flashcardProgress && typeof input.flashcardProgress === 'object'
    ? Object.fromEntries(Object.entries(input.flashcardProgress).filter(([id, item]) => {
      if (!validFlashcardIds.has(id) || !item || typeof item !== 'object') return false;
      const record = item as { streak?: unknown; dueAt?: unknown };
      return typeof record.streak === 'number' && record.streak >= 0 && record.streak <= 5
        && typeof record.dueAt === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(record.dueAt);
    })) as FlashcardLearningState
    : {};
  const lessonQuizBestScores = input.lessonQuizBestScores && typeof input.lessonQuizBestScores === 'object'
    ? Object.fromEntries(Object.entries(input.lessonQuizBestScores).filter(([id, score]) => lessonIds.has(id) && typeof score === 'number' && score >= 0))
    : {};
  const moduleQuizBestScores = input.moduleQuizBestScores && typeof input.moduleQuizBestScores === 'object'
    ? Object.fromEntries(Object.entries(input.moduleQuizBestScores).filter(([id, score]) => validModuleIds.has(id) && typeof score === 'number' && score >= 0))
    : {};

  return {
    schemaVersion: 3,
    activeLessonId,
    completedLessonIds: uniqueValidIds(input.completedLessonIds, lessonIds),
    bookmarkedLessonIds: uniqueValidIds(input.bookmarkedLessonIds, lessonIds),
    notes,
    completedReadingIds: uniqueValidIds(input.completedReadingIds, validReadingIds),
    completedLabIds: uniqueValidIds(input.completedLabIds, validLabIds),
    confidence,
    studyMinutesByDate,
    weeklyGoalMinutes: typeof input.weeklyGoalMinutes === 'number'
      ? Math.max(30, Math.min(1200, Math.round(input.weeklyGoalMinutes))) : 180,
    autoNextEnabled: typeof input.autoNextEnabled === 'boolean' ? input.autoNextEnabled : true,
    reviewBeforeNext: typeof input.reviewBeforeNext === 'boolean' ? input.reviewBeforeNext : true,
    flashcardProgress,
    lessonQuizBestScores,
    moduleQuizBestScores,
    completedLessonAssessmentIds: uniqueValidIds(input.completedLessonAssessmentIds, lessonIds),
    completedModuleAssessmentIds: uniqueValidIds(input.completedModuleAssessmentIds, validModuleIds),
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null,
  };
}

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function dateAfterDays(days: number) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
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

function parseDurationMinutes(duration: string) {
  const value = Number.parseInt(duration, 10);
  return Number.isFinite(value) ? value : 20;
}

const navigation = [
  { id: 'home' as const, label: 'Home', icon: Home },
  { id: 'learn' as const, label: 'Learn', icon: PlayCircle },
  { id: 'library' as const, label: 'Library', icon: BookOpen },
  { id: 'practice' as const, label: 'Practice', icon: FlaskConical },
  { id: 'toolkit' as const, label: 'Toolkit', icon: Calculator },
  { id: 'progress' as const, label: 'Progress', icon: BarChart3 },
];

export default function CourseApp() {
  const [learner, setLearner] = useState<LearnerState>(initialLearnerState);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>('home');
  const [lessonTab, setLessonTab] = useState<LessonTab>('watch');
  const [openModuleId, setOpenModuleId] = useState(course.modules[0].id);
  const [moduleDrawerOpen, setModuleDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedBookId, setSelectedBookId] = useState(bookCompanions[0].id);
  const [selectedGuideId, setSelectedGuideId] = useState(bookCompanions[0].guides[0].id);
  const [libraryQuery, setLibraryQuery] = useState('');
  const [selectedLabId, setSelectedLabId] = useState(practiceLabs[0].id);
  const [practiceFilter, setPracticeFilter] = useState('All');
  const [selectedMasteryModuleId, setSelectedMasteryModuleId] = useState(course.modules[0].id);
  const [reviewQueueOpen, setReviewQueueOpen] = useState(false);
  const [toolQuery, setToolQuery] = useState('');
  const [calculatorMode, setCalculatorMode] = useState<CalculatorMode>('ohm');
  const [calculatorValues, setCalculatorValues] = useState({ voltage: '', current: '', resistance: '', powerFactor: '0.8' });
  const [youtubeApiReady, setYouTubeApiReady] = useState(false);
  const [autoPlayLessonId, setAutoPlayLessonId] = useState<string | null>(null);
  const [autoNextState, setAutoNextState] = useState<AutoNextState>(null);
  const importInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
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

  const location = lessonLocation.get(learner.activeLessonId) ?? lessonLocation.get(allLessons[0].id)!;
  const activeLesson = location.module.lessons[location.lessonIndex];
  const completed = useMemo(() => new Set(learner.completedLessonIds), [learner.completedLessonIds]);
  const bookmarked = useMemo(() => new Set(learner.bookmarkedLessonIds), [learner.bookmarkedLessonIds]);
  const completedReading = useMemo(() => new Set(learner.completedReadingIds), [learner.completedReadingIds]);
  const completedLabs = useMemo(() => new Set(learner.completedLabIds), [learner.completedLabIds]);
  const overallPercent = percent(completed.size, allLessons.length);
  const weekMinutes = getRecentStudyMinutes(7, learner.studyMinutesByDate);
  const weekPercent = Math.min(100, percent(weekMinutes, learner.weeklyGoalMinutes));
  const completedSeconds = useMemo(
    () => allLessons.filter((lesson) => completed.has(lesson.id)).reduce((sum, lesson) => sum + lesson.durationSeconds, 0),
    [completed],
  );
  const selectedBook = bookCompanions.find((book) => book.id === selectedBookId) ?? bookCompanions[0];
  const selectedGuide = selectedBook.guides.find((guide) => guide.id === selectedGuideId) ?? selectedBook.guides[0];
  const selectedLab = practiceLabs.find((lab) => lab.id === selectedLabId) ?? practiceLabs[0];
  const contextualReading = allReading.filter(({ guide }) => guide.linkedModules.includes(location.module.number)).slice(0, 2);
  const deeperReading = allReading.filter(({ guide }) => guide.linkedModules.includes(location.module.number)).slice(2, 5);
  const contextualLab = practiceLabs.find((lab) => lab.linkedModules.includes(location.module.number)) ?? practiceLabs[0];
  const activeGuide = lessonGuides[activeLesson.id] ?? {
    summary: `This lesson develops ${activeLesson.topic.toLocaleLowerCase()} and connects the idea to safe electrical installation work. Use the video for the instructor’s exact examples and sequence.`,
    keyConcepts: [`Understand the purpose of ${activeLesson.topic.toLocaleLowerCase()}.`, 'Connect the principle to the complete circuit or installation.', 'Verify safety and current requirements before practical application.'],
    remember: 'Understand the reason behind a method before trying to remember its steps.',
    practicalConnection: 'Look for this principle in a circuit drawing, safe training board or supervised installation.',
    checkYourself: `Can you explain ${activeLesson.topic.toLocaleLowerCase()} clearly without repeating the video title?`,
  };
  const queuedNextLesson = autoNextState ? lessonLookup.get(autoNextState.nextLessonId) : undefined;
  const activeAssessment = assessmentBank.lessons[activeLesson.id];
  const selectedMasteryModule = course.modules.find((module) => module.id === selectedMasteryModuleId) ?? course.modules[0];
  const selectedMasteryAssessment = assessmentBank.modules[selectedMasteryModule.id];
  const today = todayKey();
  const { dueFlashcards, dueReviewCards, dueReviewQuestions } = useMemo(() => {
    const due = assessmentBank.allFlashcards.filter((card) => {
      const progress = learner.flashcardProgress[card.id];
      return Boolean(progress && progress.dueAt <= today);
    });
    const cards = due.slice(0, 30);
    const cardIds = new Set(cards.map((card) => card.id));
    const questions = Object.values(assessmentBank.lessons)
      .flatMap((assessment) => assessment.questions)
      .filter((question) => cardIds.has(question.cardId))
      .slice(0, 30);
    return { dueFlashcards: due, dueReviewCards: cards, dueReviewQuestions: questions };
  }, [learner.flashcardProgress, today]);
  const playerOrigin = hydrated && typeof window !== 'undefined' ? window.location.origin : '';
  const playerSrc = playerOrigin
    ? `https://www.youtube.com/embed/${activeLesson.videoId}?enablejsapi=1&origin=${encodeURIComponent(playerOrigin)}&rel=0&playsinline=1&autoplay=${autoPlayLessonId === activeLesson.id ? 1 : 0}`
    : '';

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
    setLessonTab('watch');
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
      if (saved) nextState = clampState(JSON.parse(saved));
    } catch {
      readError = true;
    }
    const [hashView, hashId] = window.location.hash.replace(/^#/, '').split('/');
    if (hashView === 'learn' && hashId && lessonLookup.has(hashId)) {
      nextState = { ...nextState, activeLessonId: hashId };
    }
    const timer = window.setTimeout(() => {
      if (readError) setToast('Saved progress could not be read, so a fresh local record is active.');
      if (navigation.some((item) => item.id === hashView)) setView(hashView as View);
      if (hashView === 'learn' && hashId && lessonLookup.has(hashId)) {
        setOpenModuleId(lessonLocation.get(hashId)?.module.id ?? course.modules[0].id);
      }
      setLearner(nextState);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(learner));
  }, [hydrated, learner]);

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
            if (current.completedLessonIds.includes(lessonId)) return current;
            return withStudyMinutes({
              ...current,
              completedLessonIds: [...current.completedLessonIds, lessonId],
              updatedAt: new Date().toISOString(),
            }, durationMinutes);
          });

          if (!nextLesson) {
            setToast('Course complete. This final lesson has been marked finished.');
            return;
          }

          if (!autoNextEnabledRef.current) {
            setToast('Video finished and this lesson was marked complete. Auto-next is off.');
            return;
          }

          if (reviewBeforeNextRef.current) {
            setLessonTab('practice');
            setToast('Video complete. Review the flashcards and quiz before moving to the next lesson.');
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
        return {
          kind: 'Video lesson' as const,
          id: lesson.id,
          parentId: '',
          title: lesson.title,
          subtitle: `${lesson.topic} · ${lesson.instructor}`,
          searchable: `${lesson.title} ${lesson.topic} ${lesson.instructor} ${lesson.layer} ${guide?.summary ?? ''} ${guide?.keyConcepts.join(' ') ?? ''}`,
        };
      }),
      ...allReading.map(({ book, guide }) => ({ kind: 'Reading guide' as const, id: guide.id, parentId: book.id, title: guide.title, subtitle: `${book.shortTitle} · printed pages ${guide.pages}`, searchable: `${guide.title} ${guide.summary} ${guide.keyConcepts.join(' ')} ${book.title}` })),
      ...practiceLabs.map((lab) => ({ kind: 'Practice lab' as const, id: lab.id, parentId: '', title: lab.title, subtitle: `${lab.category} · ${lab.duration}`, searchable: `${lab.title} ${lab.description} ${lab.category} ${lab.steps.join(' ')}` })),
      ...glossary.map((item) => ({ kind: 'Glossary term' as const, id: item.term, parentId: '', title: item.term, subtitle: item.definition, searchable: `${item.term} ${item.definition} ${item.category}` })),
    ];
    return results.filter((result) => !query || result.searchable.toLocaleLowerCase().includes(query)).slice(0, 36);
  }, [searchQuery]);

  const filteredGuides = selectedBook.guides.filter((guide) => {
    const query = libraryQuery.trim().toLocaleLowerCase();
    return !query || `${guide.title} ${guide.summary} ${guide.keyConcepts.join(' ')}`.toLocaleLowerCase().includes(query);
  });
  const practiceCategories = ['All', ...new Set(practiceLabs.map((lab) => lab.category))];
  const filteredLabs = practiceLabs.filter((lab) => practiceFilter === 'All' || lab.category === practiceFilter);
  const filteredGlossary = glossary.filter((entry) => {
    const query = toolQuery.trim().toLocaleLowerCase();
    return !query || `${entry.term} ${entry.definition} ${entry.category}`.toLocaleLowerCase().includes(query);
  });

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

  const chooseLesson = (lessonId: string) => {
    const nextLocation = lessonLocation.get(lessonId);
    if (!nextLocation) return;
    cancelAutoNext(false);
    setAutoPlayLessonId(null);
    setLearner((current) => ({ ...current, activeLessonId: lessonId, updatedAt: new Date().toISOString() }));
    setOpenModuleId(nextLocation.module.id);
    setLessonTab('watch');
    setView('learn');
    setSearchOpen(false);
    setModuleDrawerOpen(false);
    window.history.replaceState(null, '', `#learn/${lessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const chooseModule = (module: CourseModule) => {
    chooseLesson((module.lessons.find((lesson) => !completed.has(lesson.id)) ?? module.lessons[0]).id);
  };

  const goRelative = (direction: -1 | 1) => {
    const index = allLessons.findIndex((lesson) => lesson.id === activeLesson.id);
    const next = allLessons[index + direction];
    if (next) chooseLesson(next.id);
  };

  const toggleComplete = (advance = false) => {
    const isComplete = completed.has(activeLesson.id);
    setLearner((current) => {
      const next = { ...current, completedLessonIds: isComplete ? current.completedLessonIds.filter((id) => id !== activeLesson.id) : [...current.completedLessonIds, activeLesson.id], updatedAt: new Date().toISOString() };
      return isComplete ? next : withStudyMinutes(next, Math.ceil(activeLesson.durationSeconds / 60));
    });
    setToast(isComplete ? 'Lesson returned to your learning queue.' : 'Lesson completed. Excellent work.');
    if (advance && !isComplete) {
      const next = allLessons[allLessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1];
      if (next) window.setTimeout(() => chooseLesson(next.id), 240);
    }
  };

  const toggleBookmark = () => {
    const isSaved = bookmarked.has(activeLesson.id);
    setLearner((current) => ({ ...current, bookmarkedLessonIds: isSaved ? current.bookmarkedLessonIds.filter((id) => id !== activeLesson.id) : [...current.bookmarkedLessonIds, activeLesson.id], updatedAt: new Date().toISOString() }));
    setToast(isSaved ? 'Bookmark removed.' : 'Lesson saved to your notebook.');
  };

  const setConfidence = (rating: 1 | 2 | 3) => {
    setLearner((current) => ({ ...current, confidence: { ...current.confidence, [activeLesson.id]: rating }, updatedAt: new Date().toISOString() }));
    setToast('Confidence check saved on this device.');
  };

  const rateFlashcard = (cardId: string, knew: boolean) => {
    setLearner((current) => {
      const previous = current.flashcardProgress[cardId];
      const streak = knew ? Math.min(5, (previous?.streak ?? 0) + 1) : 0;
      const intervals = [1, 3, 7, 14, 30];
      const dueAt = knew ? dateAfterDays(intervals[Math.max(0, streak - 1)]) : todayKey();
      return {
        ...current,
        flashcardProgress: { ...current.flashcardProgress, [cardId]: { streak, dueAt } },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const completeLessonQuiz = (score: number, total: number) => {
    const passed = score >= Math.ceil(total * 0.8);
    setLearner((current) => ({
      ...withStudyMinutes(current, Math.max(5, Math.ceil(total / 2))),
      lessonQuizBestScores: { ...current.lessonQuizBestScores, [activeLesson.id]: Math.max(current.lessonQuizBestScores[activeLesson.id] ?? 0, score) },
      completedLessonAssessmentIds: passed && !current.completedLessonAssessmentIds.includes(activeLesson.id)
        ? [...current.completedLessonAssessmentIds, activeLesson.id]
        : current.completedLessonAssessmentIds,
      updatedAt: new Date().toISOString(),
    }));
    setToast(passed ? `Lesson mastery earned: ${score} of ${total}.` : `You scored ${score} of ${total}. Review the cards and try again.`);
  };

  const completeModuleQuiz = (score: number, total: number) => {
    const passed = score >= Math.ceil(total * 0.8);
    setLearner((current) => ({
      ...withStudyMinutes(current, Math.max(12, Math.ceil(total / 2))),
      moduleQuizBestScores: { ...current.moduleQuizBestScores, [selectedMasteryModule.id]: Math.max(current.moduleQuizBestScores[selectedMasteryModule.id] ?? 0, score) },
      completedModuleAssessmentIds: passed && !current.completedModuleAssessmentIds.includes(selectedMasteryModule.id)
        ? [...current.completedModuleAssessmentIds, selectedMasteryModule.id]
        : current.completedModuleAssessmentIds,
      updatedAt: new Date().toISOString(),
    }));
    setToast(passed ? `Module ${selectedMasteryModule.number} mastery earned.` : 'This attempt is saved. Review weak cards and try the module quiz again.');
  };

  const completeReviewQuiz = (score: number, total: number) => {
    setLearner((current) => withStudyMinutes(current, Math.max(8, Math.ceil(total / 2))));
    setToast(`Spaced review complete: ${score} of ${total}. Cards you missed stay in today's queue.`);
  };

  const continueAfterLessonAssessment = () => {
    const next = allLessons[allLessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1];
    if (next) chooseLesson(next.id);
    else setToast('You completed the final lesson assessment. The full course is complete.');
  };

  const toggleReading = (guideId: string) => {
    const isDone = completedReading.has(guideId);
    setLearner((current) => {
      const next = { ...current, completedReadingIds: isDone ? current.completedReadingIds.filter((id) => id !== guideId) : [...current.completedReadingIds, guideId], updatedAt: new Date().toISOString() };
      return isDone ? next : withStudyMinutes(next, 20);
    });
    setToast(isDone ? 'Guide returned to your reading list.' : 'Reading guide completed.');
  };

  const toggleLab = (labId: string) => {
    const lab = practiceLabs.find((item) => item.id === labId);
    const isDone = completedLabs.has(labId);
    setLearner((current) => {
      const next = { ...current, completedLabIds: isDone ? current.completedLabIds.filter((id) => id !== labId) : [...current.completedLabIds, labId], updatedAt: new Date().toISOString() };
      return isDone ? next : withStudyMinutes(next, parseDurationMinutes(lab?.duration ?? '20'));
    });
    setToast(isDone ? 'Practice lab reopened.' : 'Practice evidence marked complete.');
  };

  const chooseSearchResult = (result: (typeof searchResults)[number]) => {
    if (result.kind === 'Video lesson') chooseLesson(result.id);
    if (result.kind === 'Reading guide') {
      setSelectedBookId(result.parentId); setSelectedGuideId(result.id); setSearchOpen(false); navigate('library');
    }
    if (result.kind === 'Practice lab') {
      setSelectedLabId(result.id); setSearchOpen(false); navigate('practice');
    }
    if (result.kind === 'Glossary term') {
      setToolQuery(result.title); setSearchOpen(false); navigate('toolkit');
    }
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
      setLearner(clampState(parsed.progress ?? parsed)); setToast('Progress backup restored.'); setSettingsOpen(false);
    } catch { setToast('That file is not a valid course progress backup.'); }
  };

  const openLocalPdf = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.toLocaleLowerCase().endsWith('.pdf')) { setToast('Please choose a PDF book file.'); return; }
    const url = URL.createObjectURL(file);
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    setToast(opened ? 'Opened locally. The PDF was not uploaded.' : 'Your browser blocked the new PDF tab. Allow pop-ups and try again.');
    window.setTimeout(() => URL.revokeObjectURL(url), 120000);
  };

  const resetProgress = () => { setLearner(initialLearnerState); setConfirmReset(false); setSettingsOpen(false); navigate('home'); setToast('Local learning progress has been reset.'); };
  const moduleCompletedCount = (module: CourseModule) => module.lessons.filter((lesson) => completed.has(lesson.id)).length;

  const voltage = Number(calculatorValues.voltage);
  const current = Number(calculatorValues.current);
  const resistance = Number(calculatorValues.resistance);
  const powerFactor = Number(calculatorValues.powerFactor);
  let calculatorResult = 'Enter the known values to see a result.';
  let calculatorFormula = 'V = I × R';
  if (calculatorMode === 'ohm') {
    if (voltage > 0 && current > 0) calculatorResult = `Resistance = ${(voltage / current).toFixed(2)} Ω`;
    else if (current > 0 && resistance > 0) calculatorResult = `Voltage = ${(current * resistance).toFixed(2)} V`;
    else if (voltage > 0 && resistance > 0) calculatorResult = `Current = ${(voltage / resistance).toFixed(2)} A`;
  } else if (calculatorMode === 'power') {
    calculatorFormula = 'P = V × I';
    if (voltage > 0 && current > 0) calculatorResult = `Power = ${(voltage * current).toFixed(2)} W`;
  } else {
    calculatorFormula = 'P = √3 × V × I × PF';
    if (voltage > 0 && current > 0 && powerFactor > 0 && powerFactor <= 1) calculatorResult = `Three-phase power = ${((Math.sqrt(3) * voltage * current * powerFactor) / 1000).toFixed(2)} kW`;
  }

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
            return <button key={item.id} type="button" className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon size={19} /><span>{item.label}</span>{item.id === 'learn' && <small>{overallPercent}%</small>}</button>;
          })}
        </nav>
        <div className="sidebar-safety"><ShieldCheck size={22} /><strong>Safety before speed</strong><p>Training guidance only. Verify current Kenyan rules and use qualified supervision.</p></div>
        <button className="sidebar-settings" type="button" onClick={() => setSettingsOpen(true)}><Settings size={19} /><span>Data & settings</span></button>
      </aside>

      <div className="app-frame">
        <header className="app-header">
          <button className="mobile-brand" type="button" onClick={() => navigate('home')} aria-label="Go home"><span className="brand-symbol"><Zap size={18} /></span><span>Electrical Mastery</span></button>
          <button className="search-trigger" type="button" onClick={() => { setSearchOpen(true); window.setTimeout(() => searchInputRef.current?.focus(), 0); }}><Search size={19} /><span>Search lessons, guides, labs and terms</span><kbd>/</kbd></button>
          <div className="header-actions">
            <button className="header-progress" type="button" onClick={() => navigate('progress')} aria-label={`${overallPercent}% of video course complete`}><span className="mini-progress"><i style={{ width: `${overallPercent}%` }} /></span><b>{overallPercent}%</b></button>
            <button className="icon-button" type="button" onClick={() => setSettingsOpen(true)} aria-label="Open data and settings"><Settings size={20} /></button>
          </div>
        </header>

        <main id="main-content" className="app-content">
          {view === 'home' && (
            <div className="page home-page">
              <section className="home-hero">
                <div className="hero-glow" aria-hidden="true" />
                <div className="hero-copy">
                  <span className="eyebrow"><Sparkles size={16} /> Your personal electrical workshop</span>
                  <h1>Learn the craft.<br /><em>Understand the system.</em></h1>
                  <p>A complete path through electrical science, installation practice, design thinking, testing and professional handover.</p>
                  <div className="button-row">
                    <button className="primary-button" type="button" onClick={() => chooseLesson(activeLesson.id)}><CirclePlay size={19} /> {completed.size ? 'Continue learning' : 'Start the course'} <ArrowRight size={18} /></button>
                    <button className="ghost-button on-dark" type="button" onClick={() => navigate('library')}><BookOpen size={18} /> Open book companions</button>
                  </div>
                  <div className="hero-trust"><ShieldCheck size={18} /><span>Safety-led learning · Original study guides · Progress stays on this device</span></div>
                </div>
                <div className="hero-session-card">
                  <div className="session-label"><span>Up next</span><span>{activeLesson.duration}</span></div>
                  <div className="session-index">M{pad(location.module.number)} · L{pad(activeLesson.number)}</div>
                  <h2>{activeLesson.title}</h2><p>{location.module.title}</p>
                  <div className="session-meter"><span style={{ width: `${percent(location.lessonIndex, location.module.lessons.length)}%` }} /></div>
                  <button type="button" onClick={() => chooseLesson(activeLesson.id)}>Resume this lesson <ArrowRight size={17} /></button>
                </div>
              </section>

              <section className="stat-grid" aria-label="Learning overview">
                <article><span className="stat-icon copper"><PlayCircle size={21} /></span><div><b>{completed.size}<small> / {allLessons.length}</small></b><p>Video lessons completed</p></div></article>
                <article><span className="stat-icon cyan"><BookOpen size={21} /></span><div><b>{completedReading.size}<small> / {allReading.length}</small></b><p>Reading guides completed</p></div></article>
                <article><span className="stat-icon green"><FlaskConical size={21} /></span><div><b>{completedLabs.size}<small> / {practiceLabs.length}</small></b><p>Practice labs completed</p></div></article>
                <article><span className="stat-icon amber"><Target size={21} /></span><div><b>{weekMinutes}<small> / {learner.weeklyGoalMinutes} min</small></b><p>This week’s study goal</p></div></article>
              </section>

              <section className="home-grid">
                <div className="home-primary-column">
                  <div className="section-heading"><div><span className="eyebrow neutral">The learning path</span><h2>Watch, understand, practise, apply.</h2></div><button className="text-button" type="button" onClick={() => navigate('learn')}>Explore all modules <ArrowRight size={17} /></button></div>
                  <div className="learning-path-grid">
                    <button type="button" onClick={() => navigate('learn')}><span>01</span><PlayCircle size={24} /><h3>Watch</h3><p>{allLessons.length} expert-led videos in a clear sequence.</p><small>{overallPercent}% complete</small></button>
                    <button type="button" onClick={() => navigate('library')}><span>02</span><BookOpen size={24} /><h3>Understand</h3><p>Every video has a plain-language summary, supported by original guided reading.</p><small>{allLessons.length} summaries · {allReading.length} reading guides</small></button>
                    <button type="button" onClick={() => navigate('practice')}><span>03</span><FlaskConical size={24} /><h3>Practise</h3><p>Safe simulations, design tasks and knowledge checks.</p><small>{practiceLabs.length} evidence-based labs</small></button>
                    <button type="button" onClick={() => navigate('progress')}><span>04</span><Award size={24} /><h3>Master</h3><p>Track confidence, review gaps and build a portfolio.</p><small>{learner.completedLessonAssessmentIds.length} lesson recaps · {learner.completedModuleAssessmentIds.length} modules mastered</small></button>
                  </div>

                  <div className="section-heading compact"><div><span className="eyebrow neutral">Course map</span><h2>{course.modules.length} connected modules</h2></div></div>
                  <div className="module-card-grid">
                    {course.modules.map((module) => {
                      const done = moduleCompletedCount(module);
                      const modulePercent = percent(done, module.lessons.length);
                      return <button type="button" className="module-card" key={module.id} onClick={() => chooseModule(module)}><div className="module-card-head"><span>{pad(module.number)}</span><small>{module.duration}</small></div><h3>{module.title}</h3><p>{module.description}</p><div className="progress-line"><span style={{ width: `${modulePercent}%` }} /></div><footer><span>{done} of {module.lessons.length} lessons</span><b>{modulePercent}%</b></footer></button>;
                    })}
                  </div>
                </div>

                <aside className="home-side-column">
                  <section className="weekly-card"><div className="weekly-ring" style={{ '--progress': `${weekPercent * 3.6}deg` } as CSSProperties}><span><b>{weekPercent}%</b><small>weekly goal</small></span></div><div><span className="eyebrow neutral">Your rhythm</span><h3>{weekMinutes ? 'Momentum is building.' : 'Begin with one focused lesson.'}</h3><p>{weekMinutes} of {learner.weeklyGoalMinutes} minutes studied during the last seven days.</p></div></section>
                  <section className="safety-card"><div className="safety-card-icon"><ShieldCheck size={25} /></div><span className="eyebrow">Non-negotiable</span><h3>Safety passport</h3><p>Before any practical task: identify every source, isolate, lock off, prove your tester, test, and prove again.</p><button type="button" onClick={() => { setSelectedLabId('lab-safe-isolation'); navigate('practice'); }}>Open safety briefing <ArrowRight size={17} /></button></section>
                  <section className="local-data-card"><Database size={21} /><div><strong>Private by design</strong><p>Your progress is stored in this browser. Use backup before changing device or clearing browser data.</p></div></section>
                </aside>
              </section>
            </div>
          )}
          {view === 'learn' && (
            <div className="learn-page">
              <aside className={`course-map ${moduleDrawerOpen ? 'drawer-open' : ''}`} aria-label="Course modules">
                <div className="drawer-heading"><div><span className="eyebrow neutral">Video course</span><h2>Course map</h2></div><button type="button" onClick={() => setModuleDrawerOpen(false)} aria-label="Close course map"><X size={21} /></button></div>
                <div className="course-summary"><span>{completed.size}/{allLessons.length} complete</span><b>{overallPercent}%</b><div className="progress-line"><span style={{ width: `${overallPercent}%` }} /></div></div>
                <nav>
                  {course.modules.map((module) => {
                    const isOpen = openModuleId === module.id;
                    const done = moduleCompletedCount(module);
                    return (
                      <section className={`module-accordion ${isOpen ? 'open' : ''}`} key={module.id}>
                        <button type="button" className={location.module.id === module.id ? 'active' : ''} onClick={() => setOpenModuleId(isOpen ? '' : module.id)} aria-expanded={isOpen}>
                          <span className="module-index">{pad(module.number)}</span><span><strong>{module.title}</strong><small>{done}/{module.lessons.length} lessons</small></span><ChevronDown size={18} />
                        </button>
                        {isOpen && <div className="accordion-lessons">{module.lessons.map((lesson) => <button type="button" key={lesson.id} className={activeLesson.id === lesson.id ? 'active' : ''} onClick={() => chooseLesson(lesson.id)}>{completed.has(lesson.id) ? <CheckCircle2 size={17} /> : <Circle size={17} />}<span><strong>{lesson.title}</strong><small>{lesson.duration} · {lesson.instructor}</small></span>{bookmarked.has(lesson.id) && <Bookmark size={14} fill="currentColor" />}</button>)}</div>}
                      </section>
                    );
                  })}
                </nav>
              </aside>
              {moduleDrawerOpen && <button className="drawer-scrim" type="button" aria-label="Close course map" onClick={() => setModuleDrawerOpen(false)} />}

              <article className="lesson-canvas">
                <div className="lesson-topline">
                  <button className="mobile-module-button" type="button" onClick={() => setModuleDrawerOpen(true)}><Menu size={19} /> Course map</button>
                  <div className="breadcrumbs"><span>Module {pad(location.module.number)}</span><ChevronRight size={15} /><span>Lesson {pad(activeLesson.number)}</span></div>
                  <div className="lesson-stepper"><button type="button" onClick={() => goRelative(-1)} disabled={activeLesson.id === allLessons[0].id} aria-label="Previous lesson"><ChevronLeft size={20} /></button><span>{allLessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1} / {allLessons.length}</span><button type="button" onClick={() => goRelative(1)} disabled={activeLesson.id === allLessons.at(-1)?.id} aria-label="Next lesson"><ChevronRight size={20} /></button></div>
                </div>
                <div className="lesson-title-block"><div><span className="topic-pill">{activeLesson.layer}</span><span className="topic-pill quiet">{activeLesson.topic}</span>{'sourceKind' in activeLesson && typeof activeLesson.sourceKind === 'string' && <span className="topic-pill quiet">{activeLesson.sourceKind}</span>}</div><h1>{activeLesson.title}</h1><p>{activeLesson.instructor} <span>·</span> {activeLesson.duration} <span>·</span> {location.module.title}</p></div>
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
                  <div><button className={`bookmark-button ${bookmarked.has(activeLesson.id) ? 'active' : ''}`} type="button" onClick={toggleBookmark}><Bookmark size={18} fill={bookmarked.has(activeLesson.id) ? 'currentColor' : 'none'} /> {bookmarked.has(activeLesson.id) ? 'Saved' : 'Save lesson'}</button><button className={`auto-next-toggle ${learner.autoNextEnabled ? 'active' : ''}`} type="button" role="switch" aria-checked={learner.autoNextEnabled} onClick={toggleAutoNextPreference}><SkipForward size={18} /> Auto-next <span>{learner.autoNextEnabled ? 'On' : 'Off'}</span></button><a className="transcript-link" href={activeLesson.url} target="_blank" rel="noreferrer">Open on YouTube <ExternalLink size={15} /></a></div>
                  <button className={completed.has(activeLesson.id) ? 'complete-button completed' : 'complete-button'} type="button" onClick={() => toggleComplete(!completed.has(activeLesson.id))}>{completed.has(activeLesson.id) ? <Check size={19} /> : <Circle size={19} />}{completed.has(activeLesson.id) ? 'Lesson completed' : 'Complete & continue'} {!completed.has(activeLesson.id) && <ArrowRight size={18} />}</button>
                </div>
                <nav className="lesson-tabs" aria-label="Lesson sections">{([['watch', 'Overview', CirclePlay], ['study', 'Summary', BookOpen], ['practice', 'Practice', ListChecks], ['notes', 'My notes', NotebookPen]] as const).map(([id, label, Icon]) => <button key={id} type="button" className={lessonTab === id ? 'active' : ''} onClick={() => setLessonTab(id)}><Icon size={18} />{label}</button>)}</nav>

                <div className="lesson-tab-content">
                  {lessonTab === 'watch' && <div className="lesson-reading-layout">
                    <section className="lesson-main-card"><span className="eyebrow neutral">Why this lesson matters</span><h2>{activeLesson.topic}</h2><p className="reading-lead">{activeLesson.rationale}</p><div className="before-card"><Lightbulb size={20} /><div><strong>Before you begin</strong><p>{activeLesson.prerequisite}</p></div></div>{activeLesson.regulationSensitive && <div className="regulation-notice"><AlertTriangle size={21} /><div><strong>Verify current requirements</strong><p>{activeLesson.regulationStatus}. Confirm current KS 662, EPRA requirements, utility rules and manufacturer instructions.</p></div></div>}</section>
                    <aside className="lesson-context-card"><span className="eyebrow neutral">Learning outcome</span><h3>By the end, you should be able to:</h3><ul><li><Check size={16} />Explain {activeLesson.topic.toLocaleLowerCase()} in your own words.</li><li><Check size={16} />Connect the concept to a complete installation.</li><li><Check size={16} />Identify what must be verified before real work.</li></ul></aside>
                  </div>}

                  {lessonTab === 'study' && <div className="lesson-study-stack">
                    <section className="lesson-summary-card">
                      <div className="summary-card-heading"><div><span className="eyebrow"><BookOpen size={16} /> Lesson concept companion</span><h2>Understand this video in plain language.</h2></div><span className="summary-lesson-code">M{pad(location.module.number)} · L{pad(activeLesson.number)}</span></div>
                      <div className="summary-source-note"><Info size={18} /><p>This is an original learning aid based on the lesson title, course topic and established electrical principles. It is not a transcript; watch the video for the instructor’s exact demonstration and examples.</p></div>
                      <div className="plain-summary"><span className="eyebrow neutral">Clear summary</span><p>{activeGuide.summary}</p></div>
                      <div className="summary-learning-grid">
                        <article className="key-concepts-card"><span className="eyebrow neutral">Key concepts to understand</span><ol>{activeGuide.keyConcepts.map((concept, index) => <li key={concept}><span>{index + 1}</span><p>{concept}</p></li>)}</ol></article>
                        <aside className="summary-side-stack"><section className="practical-connection"><Wrench size={20} /><div><span className="eyebrow neutral">Where this connects</span><p>{activeGuide.practicalConnection}</p></div></section><section className="remember-card"><Lightbulb size={21} /><div><span className="eyebrow">Remember this</span><strong>{activeGuide.remember}</strong></div></section></aside>
                      </div>
                      <div className="self-check-card"><span><ListChecks size={21} /></span><div><span className="eyebrow neutral">Check yourself</span><h3>{activeGuide.checkYourself}</h3><p>Try answering aloud without looking back. If it is difficult, replay the key section and update your notes.</p></div></div>
                      {activeLesson.regulationSensitive && <div className="regulation-notice"><AlertTriangle size={21} /><div><strong>Concept first—current rules second</strong><p>This summary explains the principle only. Verify current KS 662, EPRA requirements, utility rules and manufacturer instructions before applying regulation-sensitive details.</p></div></div>}
                    </section>
                    <div className="study-guide-layout">
                      <section className="lesson-main-card"><span className="eyebrow neutral">Read alongside this module</span><h2>Book companion</h2><p className="reading-lead">These are newly written learning guides. Printed page numbers help you find the chapter in your own copy; the books themselves stay on your computer.</p><div className="context-reading-list">{contextualReading.map(({ book, guide }) => <button type="button" key={guide.id} onClick={() => { setSelectedBookId(book.id); setSelectedGuideId(guide.id); navigate('library'); }}><span className={`book-dot ${book.accent}`}><BookOpen size={18} /></span><span><small>Start here · {book.shortTitle} · printed pages {guide.pages}</small><strong>{guide.title}</strong><p>{guide.summary}</p></span><ChevronRight size={19} /></button>)}</div>{deeperReading.length > 0 && <details className="go-deeper"><summary>Go deeper ({deeperReading.length})</summary>{deeperReading.map(({ book, guide }) => <button type="button" key={guide.id} onClick={() => { setSelectedBookId(book.id); setSelectedGuideId(guide.id); navigate('library'); }}>{guide.title}<span>{book.shortTitle} · pp. {guide.pages}</span></button>)}</details>}</section>
                      <aside className="lesson-context-card confidence-card"><span className="eyebrow neutral">Quick reflection</span><h3>How confident do you feel?</h3><p>This is private and helps you spot topics to revisit.</p><div className="confidence-options">{([1, 2, 3] as const).map((rating) => <button key={rating} className={learner.confidence[activeLesson.id] === rating ? 'active' : ''} type="button" onClick={() => setConfidence(rating)}><span>{rating}</span>{rating === 1 ? 'Review' : rating === 2 ? 'Getting it' : 'Can explain'}</button>)}</div></aside>
                    </div>
                  </div>}

                  {lessonTab === 'practice' && <div className="lesson-assessment-stack">
                    <AssessmentPanel
                      key={activeLesson.id}
                      eyebrow={`M${pad(location.module.number)} · L${pad(activeLesson.number)} lesson recap`}
                      title={activeLesson.title}
                      description={activeGuide.summary}
                      connectedLessonFlow
                      flashcards={activeAssessment.flashcards}
                      questions={activeAssessment.questions}
                      progress={learner.flashcardProgress}
                      bestScore={learner.lessonQuizBestScores[activeLesson.id] ?? 0}
                      completed={learner.completedLessonAssessmentIds.includes(activeLesson.id)}
                      onRateCard={rateFlashcard}
                      onCompleteQuiz={completeLessonQuiz}
                      onContinue={continueAfterLessonAssessment}
                      continueLabel={activeLesson.id === allLessons.at(-1)?.id ? 'Finish course' : 'Continue to next lesson'}
                    />
                    <section className="assessment-practical-link"><div><span className="eyebrow neutral">Apply it safely</span><h2>{contextualLab.title}</h2><p>{contextualLab.description}</p></div><div className="safety-inline"><ShieldCheck size={19} /><span>{contextualLab.safety}</span></div><button className="secondary-button" type="button" onClick={() => { setSelectedLabId(contextualLab.id); navigate('practice'); }}>Open practical lab <ArrowRight size={17} /></button></section>
                  </div>}

                  {lessonTab === 'notes' && <section className="notes-card"><div><span className="eyebrow neutral">Private notebook</span><h2>Notes for this lesson</h2><p>Saved automatically in this browser.</p></div><textarea value={learner.notes[activeLesson.id] ?? ''} onChange={(event) => setLearner((current) => ({ ...current, notes: { ...current.notes, [activeLesson.id]: event.target.value }, updatedAt: new Date().toISOString() }))} placeholder="Write what clicked, what needs review, and how this connects to work you know…" aria-label="Lesson notes" /><div className="autosave"><Check size={15} /> Local autosave</div></section>}
                </div>
                <footer className="lesson-next-card"><div><span>Next lesson</span><h3>{allLessons[allLessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1]?.title ?? 'Course complete'}</h3></div><button type="button" onClick={() => goRelative(1)} disabled={activeLesson.id === allLessons.at(-1)?.id}>Continue <ArrowRight size={18} /></button></footer>
              </article>
            </div>
          )}
          {view === 'library' && (
            <div className="page library-page">
              <section className="page-hero light-hero">
                <div><span className="eyebrow neutral"><BookOpen size={16} /> Guided reading</span><h1>Your book companion library.</h1><p>Original summaries, safe learning activities and chapter page guides built around the two books already on your computer.</p></div>
                <div className="pdf-open-card"><FileUp size={24} /><div><strong>Open your own PDF</strong><p>Choose a book from your PC. It opens locally in a new tab and is never uploaded.</p></div><button type="button" onClick={() => pdfInputRef.current?.click()}>Choose PDF <ExternalLink size={16} /></button><input ref={pdfInputRef} type="file" accept="application/pdf,.pdf" onChange={openLocalPdf} hidden /></div>
              </section>
              <div className="book-selector">
                {bookCompanions.map((book) => {
                  const done = book.guides.filter((guide) => completedReading.has(guide.id)).length;
                  return <button type="button" key={book.id} className={`${selectedBook.id === book.id ? 'active' : ''} ${book.accent}`} onClick={() => { setSelectedBookId(book.id); setSelectedGuideId(book.guides[0].id); }}><span className="book-cover"><Cable size={28} /><small>{book.edition}</small></span><span><small>{book.authors}</small><strong>{book.title}</strong><p>{book.description}</p><span className="book-progress">{done}/{book.guides.length} complete</span></span></button>;
                })}
              </div>
              <section className="library-workspace">
                <aside className="chapter-index">
                  <div className="chapter-search"><Search size={18} /><input value={libraryQuery} onChange={(event) => setLibraryQuery(event.target.value)} placeholder="Search this companion" aria-label="Search this book companion" /></div><p>{filteredGuides.length} guided chapters</p>
                  <nav>{filteredGuides.map((guide) => <button type="button" key={guide.id} className={selectedGuide.id === guide.id ? 'active' : ''} onClick={() => setSelectedGuideId(guide.id)}><span>{completedReading.has(guide.id) ? <CheckCircle2 size={18} /> : pad(guide.number)}</span><span><strong>{guide.title}</strong><small>Printed pages {guide.pages}</small></span><ChevronRight size={17} /></button>)}</nav>
                </aside>
                <article className="reading-guide">
                  <div className="reading-guide-head"><div><span className="eyebrow neutral">Chapter {pad(selectedGuide.number)} · printed pages {selectedGuide.pages}</span><h2>{selectedGuide.title}</h2><p>{selectedBook.title} companion</p></div><button className={completedReading.has(selectedGuide.id) ? 'complete-button completed' : 'complete-button'} type="button" onClick={() => toggleReading(selectedGuide.id)}>{completedReading.has(selectedGuide.id) ? <Check size={18} /> : <Circle size={18} />}{completedReading.has(selectedGuide.id) ? 'Guide completed' : 'Mark guide complete'}</button></div>
                  {selectedGuide.regulationSensitive && <div className="edition-banner"><AlertTriangle size={20} /><div><strong>Historical edition · Kenya verification required</strong><p>{selectedBook.notice} Training guidance—not installation approval.</p></div></div>}
                  <section><span className="eyebrow neutral">The big idea</span><p className="guide-summary">{selectedGuide.summary}</p></section>
                  <section><span className="eyebrow neutral">Concepts to notice</span><div className="concept-chip-list">{selectedGuide.keyConcepts.map((concept) => <span key={concept}>{concept}</span>)}</div></section>
                  <section className="try-card"><span className="try-icon"><Wrench size={21} /></span><div><span className="eyebrow neutral">Try it safely</span><h3>Turn reading into evidence</h3><p>{selectedGuide.activity}</p></div></section>
                  <section className="knowledge-prompt"><span><Lightbulb size={21} /></span><div><span className="eyebrow neutral">Check your understanding</span><h3>{selectedGuide.knowledgeCheck}</h3><p>Explain the answer in your own words or add it to the notes of a related video lesson.</p></div></section>
                  <section><span className="eyebrow neutral">Connected video modules</span><div className="linked-modules">{selectedGuide.linkedModules.map((moduleNumber) => { const linkedModule = course.modules[moduleNumber - 1]; return <button key={moduleNumber} type="button" onClick={() => chooseModule(linkedModule)}><span>M{pad(moduleNumber)}</span>{linkedModule.title}<ArrowRight size={15} /></button>; })}</div></section>
                </article>
              </section>
            </div>
          )}
          {view === 'practice' && (
            <div className="page practice-page">
              <section className="page-hero practice-hero"><div><span className="eyebrow"><FlaskConical size={16} /> Practice studio</span><h1>Think like an installer.<br />Act like a professional.</h1><p>Safe simulations and design exercises that turn passive learning into evidence you can explain.</p></div><div className="practice-hero-stat"><b>{completedLabs.size}</b><span>of {practiceLabs.length} labs completed</span><div className="progress-line"><span style={{ width: `${percent(completedLabs.size, practiceLabs.length)}%` }} /></div></div></section>
              <section className="safety-ribbon"><ShieldCheck size={22} /><div><strong>Safe practice boundary</strong><p>Never use these exercises as authorization for live work. Use paper, simulation, extra-low-voltage trainers or approved de-energized equipment unless a competent supervisor directs otherwise.</p></div></section>
              <div className="section-heading"><div><span className="eyebrow neutral">Evidence-based activities</span><h2>Practice labs</h2></div><p>Choose a focused exercise or build toward the complete design portfolio.</p></div>
              <div className="filter-row" aria-label="Filter practice labs">{practiceCategories.map((category) => <button key={category} type="button" className={practiceFilter === category ? 'active' : ''} onClick={() => setPracticeFilter(category)}>{category}</button>)}</div>
              <div className="practice-layout">
                <div className="lab-grid">{filteredLabs.map((lab) => <button type="button" key={lab.id} className={selectedLab.id === lab.id ? 'lab-card active' : 'lab-card'} onClick={() => setSelectedLabId(lab.id)}><div className="lab-card-head"><span>{lab.category}</span>{completedLabs.has(lab.id) ? <CheckCircle2 size={20} /> : <FlaskConical size={20} />}</div><h3>{lab.title}</h3><p>{lab.description}</p><footer><span><Clock3 size={15} /> {lab.duration}</span><span>{lab.level}</span></footer></button>)}</div>
                <aside className="lab-detail"><div className="lab-detail-head"><span className="lab-badge">{selectedLab.category}</span><span>{selectedLab.level} · {selectedLab.duration}</span></div><h2>{selectedLab.title}</h2><p className="reading-lead">{selectedLab.description}</p><span className="eyebrow neutral">Your method</span><ol className="step-list">{selectedLab.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol><div className="evidence-card"><Award size={20} /><div><strong>Evidence to produce</strong><p>{selectedLab.evidence}</p></div></div><div className="safety-inline"><ShieldCheck size={19} /><span>{selectedLab.safety}</span></div><button className={completedLabs.has(selectedLab.id) ? 'complete-button completed full' : 'complete-button full'} type="button" onClick={() => toggleLab(selectedLab.id)}>{completedLabs.has(selectedLab.id) ? <Check size={18} /> : <Circle size={18} />}{completedLabs.has(selectedLab.id) ? 'Evidence completed' : 'Mark evidence complete'}</button></aside>
              </div>
              <section className="mastery-centre">
                <div className="section-heading"><div><span className="eyebrow neutral"><Award size={16} /> Module mastery centre</span><h2>Deep review for every module</h2></div><p>Choose a module, review up to 40 lesson-linked cards and complete up to 50 questions. Every item names its source lesson, and wrong answers return to spaced review.</p></div>
                <section className="review-queue-banner"><span className="review-queue-icon"><RotateCcw size={25} /></span><div><span className="eyebrow neutral">Spaced repetition queue</span><h3>{dueFlashcards.length ? `${dueFlashcards.length} cards are ready for recall` : 'You are caught up for today'}</h3><p>{dueFlashcards.length ? 'Work through a focused set of up to 30 due cards. Correct answers move to longer intervals; missed ideas return sooner.' : 'Review a lesson or module to schedule more cards. Your next due cards will appear here automatically.'}</p></div><button type="button" disabled={!dueReviewCards.length} onClick={() => setReviewQueueOpen((current) => !current)}>{reviewQueueOpen ? 'Close review' : 'Start due review'} <ArrowRight size={17} /></button></section>
                {reviewQueueOpen && dueReviewCards.length > 0 && <div className="due-review-panel"><AssessmentPanel
                  key={`due-${today}`}
                  eyebrow="Today’s recall session"
                  title="Review what is due—not what is easy."
                  description="This queue mixes lessons across the course so you must retrieve the idea without relying on the order in which you learned it."
                  flashcards={dueReviewCards}
                  questions={dueReviewQuestions}
                  progress={learner.flashcardProgress}
                  bestScore={0}
                  completed={false}
                  onRateCard={rateFlashcard}
                  onCompleteQuiz={completeReviewQuiz}
                  onContinue={() => setReviewQueueOpen(false)}
                  continueLabel="Finish today’s review"
                /></div>}
                <div className="mastery-module-strip" aria-label="Choose a module assessment">{course.modules.map((module) => {
                  const assessment = assessmentBank.modules[module.id];
                  const mastered = learner.completedModuleAssessmentIds.includes(module.id);
                  return <button type="button" key={module.id} className={selectedMasteryModule.id === module.id ? 'active' : ''} onClick={() => setSelectedMasteryModuleId(module.id)}><span>{pad(module.number)}</span><strong>{module.title}</strong><small>{assessment.flashcards.length} cards · {assessment.questions.length} questions</small>{mastered && <CheckCircle2 size={18} />}</button>;
                })}</div>
                <AssessmentPanel
                  key={selectedMasteryModule.id}
                  eyebrow={`Module ${pad(selectedMasteryModule.number)} mastery`}
                  title={selectedMasteryModule.title}
                  description="This balanced review draws from lessons across the module. Reach 80%, then return when the spaced cards become due."
                  flashcards={selectedMasteryAssessment.flashcards}
                  questions={selectedMasteryAssessment.questions}
                  progress={learner.flashcardProgress}
                  bestScore={learner.moduleQuizBestScores[selectedMasteryModule.id] ?? 0}
                  completed={learner.completedModuleAssessmentIds.includes(selectedMasteryModule.id)}
                  onRateCard={rateFlashcard}
                  onCompleteQuiz={completeModuleQuiz}
                  onContinue={() => {
                    const nextModule = course.modules[selectedMasteryModule.number];
                    if (nextModule) setSelectedMasteryModuleId(nextModule.id);
                    else navigate('progress');
                  }}
                  continueLabel={selectedMasteryModule.number === course.modules.length ? 'View progress' : 'Next module review'}
                />
              </section>
            </div>
          )}
          {view === 'toolkit' && (
            <div className="page toolkit-page">
              <section className="page-hero light-hero"><div><span className="eyebrow neutral"><Calculator size={16} /> Learning toolkit</span><h1>Calculate with meaning.</h1><p>Formula practice and plain-language definitions designed to reveal the reasoning—not hide it behind a result.</p></div><div className="toolkit-badge"><Gauge size={28} /><div><strong>Training calculators</strong><p>Educational relationships only. They do not approve cable, device or installation design.</p></div></div></section>
              <section className="calculator-workspace">
                <div className="calculator-panel"><div className="section-heading compact"><div><span className="eyebrow neutral">Formula lab</span><h2>Choose a relationship</h2></div></div><div className="calculator-tabs">{([['ohm', 'Ohm’s law'], ['power', 'Power'], ['three-phase', 'Three-phase']] as [CalculatorMode, string][]).map(([id, label]) => <button type="button" key={id} className={calculatorMode === id ? 'active' : ''} onClick={() => setCalculatorMode(id)}>{label}</button>)}</div><div className="formula-display"><small>Relationship</small><strong>{calculatorFormula}</strong><p>{calculatorMode === 'ohm' ? 'Enter any two known positive values. The missing quantity is calculated.' : calculatorMode === 'power' ? 'Electrical power is voltage multiplied by current for this simple relationship.' : 'Balanced three-phase real power includes the phase relationship and power factor.'}</p></div><div className="calculator-inputs"><label><span>Voltage</span><div><input inputMode="decimal" value={calculatorValues.voltage} onChange={(event) => setCalculatorValues((values) => ({ ...values, voltage: event.target.value }))} placeholder="0" /><b>V</b></div></label><label><span>Current</span><div><input inputMode="decimal" value={calculatorValues.current} onChange={(event) => setCalculatorValues((values) => ({ ...values, current: event.target.value }))} placeholder="0" /><b>A</b></div></label>{calculatorMode === 'ohm' && <label><span>Resistance</span><div><input inputMode="decimal" value={calculatorValues.resistance} onChange={(event) => setCalculatorValues((values) => ({ ...values, resistance: event.target.value }))} placeholder="0" /><b>Ω</b></div></label>}{calculatorMode === 'three-phase' && <label><span>Power factor</span><div><input inputMode="decimal" value={calculatorValues.powerFactor} onChange={(event) => setCalculatorValues((values) => ({ ...values, powerFactor: event.target.value }))} placeholder="0.8" /><b>PF</b></div></label>}</div><div className="calculator-result"><Zap size={25} /><div><small>Calculated result</small><strong>{calculatorResult}</strong></div></div><div className="training-warning"><Info size={18} /><span>Use values from an approved learning exercise. Real installation design requires current standards, verified supply data and competent review.</span></div></div>
                <aside className="formula-reference"><span className="eyebrow neutral">Quick reference</span><h2>Core relationships</h2>{[['Ohm’s law', 'V = I × R', 'Voltage, current and resistance'], ['Power', 'P = V × I', 'Rate of electrical energy transfer'], ['Energy', 'E = P × t', 'Power used over time'], ['Series resistance', 'Rᵀ = R₁ + R₂ + …', 'Resistances add in one path'], ['Three-phase power', 'P = √3 × V × I × PF', 'Balanced real power relationship']].map(([name, formula, description]) => <div className="formula-row" key={name}><span><strong>{name}</strong><small>{description}</small></span><b>{formula}</b></div>)}</aside>
              </section>
              <section className="glossary-section"><div className="section-heading"><div><span className="eyebrow neutral">Plain-language reference</span><h2>Electrical glossary</h2></div><div className="glossary-search"><Search size={18} /><input value={toolQuery} onChange={(event) => setToolQuery(event.target.value)} placeholder="Search a term" aria-label="Search electrical glossary" /></div></div><div className="glossary-grid">{filteredGlossary.map((entry) => <article key={entry.term}><span>{entry.category}</span><h3>{entry.term}</h3><p>{entry.definition}</p></article>)}</div>{!filteredGlossary.length && <div className="empty-state"><Search size={24} /><h3>No glossary match</h3><p>Try a broader term such as current, protection, circuit or testing.</p></div>}</section>
            </div>
          )}
          {view === 'progress' && (
            <div className="page progress-page">
              <section className="progress-hero"><div><span className="eyebrow"><BarChart3 size={16} /> Your learning record</span><h1>Progress you can understand.</h1><p>Completion is only one signal. Combine lessons, reading, practice, confidence and reflection to build real mastery.</p></div><div className="overall-ring" style={{ '--progress': `${overallPercent * 3.6}deg` } as CSSProperties}><span><b>{overallPercent}%</b><small>video course</small></span></div></section>
              <section className="stat-grid progress-stats"><article><span className="stat-icon copper"><CirclePlay size={21} /></span><div><b>{Math.floor(completedSeconds / 3600)}h {Math.round((completedSeconds % 3600) / 60)}m</b><p>Video time completed</p></div></article><article><span className="stat-icon cyan"><BookOpen size={21} /></span><div><b>{learner.completedLessonAssessmentIds.length}<small> / {allLessons.length}</small></b><p>Lesson recaps mastered</p></div></article><article><span className="stat-icon green"><RotateCcw size={21} /></span><div><b>{dueFlashcards.length}</b><p>Flashcards due for review</p></div></article><article><span className="stat-icon amber"><Award size={21} /></span><div><b>{learner.completedModuleAssessmentIds.length}<small> / {course.modules.length}</small></b><p>Modules mastered</p></div></article></section>
              <div className="progress-layout">
                <section className="module-progress-panel"><div className="section-heading compact"><div><span className="eyebrow neutral">Video pathway</span><h2>Module progress</h2></div></div><div className="module-progress-list">{course.modules.map((module) => { const done = moduleCompletedCount(module); const modulePercent = percent(done, module.lessons.length); return <button type="button" key={module.id} onClick={() => chooseModule(module)}><span className="module-index">{pad(module.number)}</span><span className="module-progress-copy"><strong>{module.title}</strong><small>{done} of {module.lessons.length} lessons</small><span className="progress-line"><i style={{ width: `${modulePercent}%` }} /></span></span><b>{modulePercent}%</b><ChevronRight size={18} /></button>; })}</div></section>
                <aside className="progress-side"><section className="goal-card"><div className="goal-card-head"><Target size={22} /><span>Weekly study goal</span></div><b>{weekMinutes}<small> / {learner.weeklyGoalMinutes} minutes</small></b><div className="progress-line"><span style={{ width: `${weekPercent}%` }} /></div><label><span>Set a weekly goal</span><input type="number" min="30" max="1200" step="30" value={learner.weeklyGoalMinutes} onChange={(event) => setLearner((current) => ({ ...current, weeklyGoalMinutes: Math.max(30, Math.min(1200, Number(event.target.value) || 30)), updatedAt: new Date().toISOString() }))} /><small>minutes</small></label></section><section className="mastery-card"><span className="eyebrow neutral">Confidence snapshot</span><h3>{Object.values(learner.confidence).filter((value) => value === 3).length} lessons you can explain</h3><p>{Object.values(learner.confidence).filter((value) => value === 1).length} marked for review · {learner.bookmarkedLessonIds.length} saved · {Object.values(learner.notes).filter(Boolean).length} with notes.</p><button type="button" onClick={() => navigate('learn')}>Continue building mastery <ArrowRight size={17} /></button></section><section className="backup-card"><Database size={22} /><div><strong>Keep your progress safe</strong><p>Progress is device-local. Download a backup before changing browser or computer.</p></div><button type="button" onClick={exportProgress}><Download size={17} /> Download backup</button></section></aside>
              </div>
            </div>
          )}
        </main>
        <nav className="mobile-navigation" aria-label="Mobile navigation">{navigation.slice(0, 5).map((item) => { const Icon = item.icon; return <button key={item.id} type="button" className={view === item.id ? 'active' : ''} onClick={() => navigate(item.id)}><Icon size={20} /><span>{item.label}</span></button>; })}</nav>
      </div>

      {searchOpen && (
        <div className="modal-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSearchOpen(false); }}>
          <section className="search-dialog" role="dialog" aria-modal="true" aria-labelledby="search-title">
            <div className="dialog-title"><div><span className="eyebrow neutral">Global search</span><h2 id="search-title">Find anything in your workshop</h2></div><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={22} /></button></div>
            <label className="search-field"><Search size={21} /><input ref={searchInputRef} value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Try “earthing”, “safe isolation” or “voltage drop”…" autoComplete="off" /><kbd>esc</kbd></label>
            <div className="search-results">{searchResults.map((result) => <button type="button" key={`${result.kind}-${result.id}`} onClick={() => chooseSearchResult(result)}><span className="result-icon">{result.kind === 'Video lesson' ? <PlayCircle size={19} /> : result.kind === 'Reading guide' ? <BookOpen size={19} /> : result.kind === 'Practice lab' ? <FlaskConical size={19} /> : <BookOpen size={19} />}</span><span><small>{result.kind}</small><strong>{result.title}</strong><p>{result.subtitle}</p></span><ChevronRight size={18} /></button>)}</div>
            {!searchResults.length && <div className="empty-state"><Search size={25} /><h3>No results yet</h3><p>Try a shorter topic or search one word.</p></div>}
          </section>
        </div>
      )}
      {settingsOpen && (
        <div className="modal-layer align-right" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
          <section className="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="settings-title">
            <div className="dialog-title"><div><span className="eyebrow neutral">Device & data</span><h2 id="settings-title">Settings</h2></div><button type="button" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={22} /></button></div>
            <div className="privacy-panel"><LockKeyhole size={23} /><div><strong>Progress stays in this browser</strong><p>No account is required. Your course record and notes are stored locally on this device—not sent to the site host.</p></div></div>
            <section className="settings-section playback-settings"><span className="eyebrow neutral">Playback & recall</span><button className="settings-switch" type="button" role="switch" aria-checked={learner.autoNextEnabled} onClick={toggleAutoNextPreference}><SkipForward size={19} /><span><strong>Auto-next after a finished lesson</strong><small>Continue automatically when the required recap is complete</small></span><span className={`switch-track ${learner.autoNextEnabled ? 'on' : ''}`} aria-hidden="true"><i /></span></button><button className="settings-switch" type="button" role="switch" aria-checked={learner.reviewBeforeNext} onClick={() => { const enabled = !learner.reviewBeforeNext; setLearner((current) => ({ ...current, reviewBeforeNext: enabled, updatedAt: new Date().toISOString() })); setToast(enabled ? 'Lesson recap is now required before auto-next.' : 'Auto-next will use the five-second countdown without opening the recap.'); }}><ListChecks size={19} /><span><strong>Review before next</strong><small>Open flashcards and quiz when a video finishes</small></span><span className={`switch-track ${learner.reviewBeforeNext ? 'on' : ''}`} aria-hidden="true"><i /></span></button><p>Recommended: keep both settings on. In fullscreen, the app waits for you to exit safely before changing the lesson.</p></section>
            <section className="settings-section"><span className="eyebrow neutral">Backup & restore</span><button type="button" onClick={exportProgress}><Download size={19} /><span><strong>Download progress backup</strong><small>Save lessons, reading, labs, quiz and notes</small></span><ChevronRight size={18} /></button><button type="button" onClick={() => importInputRef.current?.click()}><Upload size={19} /><span><strong>Restore from backup</strong><small>Choose a previous JSON backup file</small></span><ChevronRight size={18} /></button><input ref={importInputRef} type="file" accept="application/json,.json" onChange={importProgress} hidden /></section>
            <section className="settings-section"><span className="eyebrow neutral">Learning record</span><div className="settings-summary"><div><b>{completed.size}</b><span>lessons</span></div><div><b>{completedReading.size}</b><span>guides</span></div><div><b>{completedLabs.size}</b><span>labs</span></div></div>{confirmReset ? <div className="reset-confirm"><AlertTriangle size={21} /><p>This permanently clears progress from this browser. Download a backup first if you may want it later.</p><div><button type="button" onClick={() => setConfirmReset(false)}>Cancel</button><button className="danger" type="button" onClick={resetProgress}>Clear local progress</button></div></div> : <button className="reset-button" type="button" onClick={() => setConfirmReset(true)}><RotateCcw size={19} /><span><strong>Reset local progress</strong><small>Clear this browser’s learning record</small></span></button>}</section>
            <div className="settings-footnote"><Info size={18} /><p>Videos stream from YouTube and need internet access. The source PDFs are not part of this website; choosing one in Library opens your own local copy only.</p></div>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={19} /><span>{toast}</span></div>}
    </div>
  );
}
