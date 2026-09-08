'use client';

import type { ChangeEvent, CSSProperties } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import dynamic from 'next/dynamic';
import {
  AlertTriangle, ArrowRight, BarChart3, BookOpen, Bookmark, Calculator,
  Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, Circle,
  CirclePlay, Database, Download,
  Home, Info, ListChecks, LockKeyhole, Menu,
  PlayCircle, RotateCcw, Search, Settings, ShieldCheck, SkipForward, Sparkles, Target,
  Upload, X, Zap,
} from 'lucide-react';
import course from './course-curriculum';
import { bookCompanions, practiceLabs } from './learning-data';
import { lessonGuides } from './lesson-guides';
import AssessmentPanel from './assessment-panel';
import { buildAssessmentBank, type CheckpointAssessment } from './assessment-data';
import CheckpointWorkspace from './checkpoint-workspace';
import LessonOverview from './lesson-overview';
import type { Reading } from './books-data';
import { appendEvidence, validEvidence, isProgressBackup, scheduleRecall, calendarDay, nextLearningAction, recordQuizAttempt, validQuizRecords, type LearningEvidence, type EvidenceInput, type QuizRecord } from './tutor-model';
import { electricalTerms, matchingTerms } from './knowledge-graph';
import { standardsTopics, standardSources } from './standards-data';
import { practiceForLesson } from './practice-data';
import { EvidenceOverview } from './tutor-panels';
import { useDialogFocus } from './use-dialog-focus';

const PracticeWorkspace = dynamic(() => import('./practice-workspace'), { loading: () => <p role="status">Preparing your practice…</p> });
const ModuleRecap = dynamic(() => import('./module-recap'), { loading: () => <p role="status" className="recap-loading">Opening module recap…</p> });

const BookReader = dynamic(() => import('./book-reader'), { ssr: false });
const LearningToolkit = dynamic(() => import('./learning-toolkit'), {
  loading: () => <div className="page" role="status">Loading toolkit…</div>,
});

type CourseModule = (typeof course.modules)[number];
type View = 'home' | 'learn' | 'toolkit' | 'progress';
type LessonTab = 'overview' | 'quiz';
type AutoNextState = {
  seconds: number;
  fromLessonId: string;
  nextLessonId: string;
  waitingForFullscreenExit: boolean;
} | null;

type FlashcardLearningState = Record<string, { streak: number; dueAt: string; lastReviewedAt?: string }>;

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

type LearnerState = {
  schemaVersion: 6;
  evidence: LearningEvidence[];
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
  freeBrowseEnabled: boolean;
  reviewBeforeNext: boolean;
  flashcardProgress: FlashcardLearningState;
  lessonQuizBestScores: Record<string, number>;
  moduleQuizBestScores: Record<string, number>;
  checkpointQuizBestScores: Record<string, number>;
  completedLessonAssessmentIds: string[];
  completedModuleAssessmentIds: string[];
  completedCheckpointIds: string[];
  quizRecords: Record<string,QuizRecord>;
  updatedAt: string | null;
};

const STORAGE_KEY = 'electrical-mastery-progress-v1';
const allLessons = course.modules.flatMap((module) => module.lessons);
type QuizRecordKind = 'lesson'|'checkpoint'|'module';
const quizRecordId = (kind: QuizRecordKind,id: string) => `${kind}:${id}`;
const lessonLookup = new Map(allLessons.map((lesson) => [lesson.id, lesson]));
const lessonLocation = new Map(
  course.modules.flatMap((module, moduleIndex) =>
    module.lessons.map((lesson, lessonIndex) => [lesson.id, { module, moduleIndex, lessonIndex }] as const),
  ),
);
// Retain retired reading/lab IDs so older progress backups remain lossless.
const allReading = bookCompanions.flatMap((book) => book.guides.map((guide) => ({ book, guide })));
const validReadingIds = new Set(allReading.map(({ guide }) => guide.id));
const validLabIds = new Set(practiceLabs.map((lab) => lab.id));
const assessmentBank = buildAssessmentBank(course.modules, lessonGuides);
const validFlashcardIds = new Set(assessmentBank.allFlashcards.map((card) => card.id));
const validModuleIds = new Set(course.modules.map((module) => module.id));
const validCheckpointIds = new Set(assessmentBank.checkpointList.map((checkpoint) => checkpoint.id));
const validQuizRecordIds = new Set([
  ...allLessons.map((lesson)=>quizRecordId('lesson',lesson.id)),
  ...assessmentBank.checkpointList.map((checkpoint)=>quizRecordId('checkpoint',checkpoint.id)),
  ...course.modules.map((module)=>quizRecordId('module',module.id)),
]);
const checkpointAfterLesson = new Map(assessmentBank.checkpointList.map((checkpoint) => [checkpoint.throughLessonId, checkpoint]));
const globalLessonIndex = new Map(allLessons.map((lesson,index)=>[lesson.id,index]));

const initialLearnerState: LearnerState = {
  schemaVersion: 6,
  evidence: [],
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
  freeBrowseEnabled: false,
  reviewBeforeNext: true,
  flashcardProgress: {},
  lessonQuizBestScores: {},
  moduleQuizBestScores: {},
  checkpointQuizBestScores: {},
  completedLessonAssessmentIds: [],
  completedModuleAssessmentIds: [],
  completedCheckpointIds: [],
  quizRecords: {},
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
  const checkpointQuizBestScores = input.checkpointQuizBestScores && typeof input.checkpointQuizBestScores === 'object'
    ? Object.fromEntries(Object.entries(input.checkpointQuizBestScores).filter(([id, score]) => validCheckpointIds.has(id) && typeof score === 'number' && score >= 0))
    : {};
  const quizRecords=validQuizRecords(input.quizRecords,validQuizRecordIds);

  return {
    schemaVersion: 6,
    evidence: validEvidence(input.evidence, lessonIds),
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
    freeBrowseEnabled: input.freeBrowseEnabled === true,
    reviewBeforeNext: typeof input.reviewBeforeNext === 'boolean' ? input.reviewBeforeNext : true,
    flashcardProgress,
    lessonQuizBestScores,
    moduleQuizBestScores,
    checkpointQuizBestScores,
    completedLessonAssessmentIds: uniqueValidIds(input.completedLessonAssessmentIds, lessonIds),
    completedModuleAssessmentIds: uniqueValidIds(input.completedModuleAssessmentIds, validModuleIds),
    completedCheckpointIds: uniqueValidIds(input.completedCheckpointIds, validCheckpointIds),
    quizRecords,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null,
  };
}

function percent(value: number, total: number) {
  return total ? Math.round((value / total) * 100) : 0;
}

function quizPercentage(record: QuizRecord | undefined) {
  return record ? percent(record.latestScore,record.latestTotal) : undefined;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function checkpointBeforeLesson(lessonId: string, completedCheckpointIds: string[]) {
  const targetIndex = globalLessonIndex.get(lessonId);
  if (targetIndex === undefined) return undefined;
  const passed = new Set(completedCheckpointIds);
  return assessmentBank.checkpointList.find((checkpoint) =>
    (globalLessonIndex.get(checkpoint.throughLessonId) ?? Number.MAX_SAFE_INTEGER) < targetIndex
    && !passed.has(checkpoint.id));
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
  { id: 'toolkit' as const, label: 'Toolkit', icon: Calculator },
  { id: 'progress' as const, label: 'Progress', icon: BarChart3 },
];

export default function CourseApp() {
  const [learner, setLearner] = useState<LearnerState>(initialLearnerState);
  const [hydrated, setHydrated] = useState(false);
  const [view, setView] = useState<View>('home');
  const [lessonTab, setLessonTab] = useState<LessonTab>('overview');
  const [assessmentMode,setAssessmentMode]=useState<'quiz'|'cards'>('quiz');
  const [activeCheckpointId,setActiveCheckpointId]=useState<string|null>(null);
  const [practiceOpen,setPracticeOpen]=useState(false);
  const [returnLesson, setReturnLesson] = useState<{id:string;tab:LessonTab}|null>(null);
  const [openModuleId, setOpenModuleId] = useState(course.modules[0].id);
  const [moduleDrawerOpen, setModuleDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookReader, setBookReader] = useState<{ reading?: Reading } | null>(null);
  const [recapModuleId,setRecapModuleId] = useState<string|null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedMasteryModuleId, setSelectedMasteryModuleId] = useState(course.modules[0].id);
  const [reviewQueueOpen, setReviewQueueOpen] = useState(false);
  const [reviewSession, setReviewSession] = useState<string[]>([]);
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [toolQuery, setToolQuery] = useState('');
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

  const location = lessonLocation.get(learner.activeLessonId) ?? lessonLocation.get(allLessons[0].id)!;
  const activeLesson = location.module.lessons[location.lessonIndex];
  const completed = useMemo(() => new Set(learner.completedLessonIds), [learner.completedLessonIds]);
  const bookmarked = useMemo(() => new Set(learner.bookmarkedLessonIds), [learner.bookmarkedLessonIds]);
  const passedCheckpoints = useMemo(()=>new Set(learner.completedCheckpointIds),[learner.completedCheckpointIds]);
  const courseRequiredTotal=allLessons.length+assessmentBank.checkpointList.length;
  const courseRequiredComplete=completed.size+passedCheckpoints.size;
  const coursePercent = percent(courseRequiredComplete,courseRequiredTotal);
  const moduleTracking = (module: CourseModule) => {
    const videos=module.lessons.filter((lesson)=>completed.has(lesson.id)).length;
    const checkpoints=assessmentBank.checkpointsByModule[module.id];
    const completedCheckpoints=checkpoints.filter((checkpoint)=>passedCheckpoints.has(checkpoint.id)).length;
    const quizzes=module.lessons.filter((lesson)=>learner.completedLessonAssessmentIds.includes(lesson.id)).length;
    return {videos,checkpoints,completedCheckpoints,quizzes,requiredPercent:percent(videos+completedCheckpoints,module.lessons.length+checkpoints.length)};
  };
  const attemptedLessonQuizRecords=allLessons.map((lesson)=>learner.quizRecords[quizRecordId('lesson',lesson.id)]).filter((record):record is QuizRecord=>Boolean(record));
  const currentLessonQuizPasses=attemptedLessonQuizRecords.filter((record)=>record.latestScore/record.latestTotal>=.8).length;
  const currentLessonQuizReviews=attemptedLessonQuizRecords.length-currentLessonQuizPasses;
  const nextRequiredItem=useMemo(()=>{
    for(const courseModule of course.modules){
      for(const lesson of courseModule.lessons){
        if(!completed.has(lesson.id))return {kind:'lesson' as const,module:courseModule,lesson};
        const checkpoint=checkpointAfterLesson.get(lesson.id);
        if(checkpoint&&!passedCheckpoints.has(checkpoint.id))return {kind:'checkpoint' as const,module:courseModule,checkpoint};
      }
    }
    return undefined;
  },[completed,passedCheckpoints]);
  const weekMinutes = getRecentStudyMinutes(7, learner.studyMinutesByDate);
  const weekPercent = Math.min(100, percent(weekMinutes, learner.weeklyGoalMinutes));
  const completedSeconds = useMemo(
    () => allLessons.filter((lesson) => completed.has(lesson.id)).reduce((sum, lesson) => sum + lesson.durationSeconds, 0),
    [completed],
  );
  const activeGuide = lessonGuides[activeLesson.id] ?? {
    summary: `This lesson develops ${activeLesson.topic.toLocaleLowerCase()} and connects the idea to safe electrical installation work. Use the video for the instructor’s exact examples and sequence.`,
    keyConcepts: [`Understand the purpose of ${activeLesson.topic.toLocaleLowerCase()}.`, 'Connect the principle to the complete circuit or installation.', 'Verify safety and current requirements before practical application.'],
    remember: 'Understand the reason behind a method before trying to remember its steps.',
    practicalConnection: 'Look for this principle in a circuit drawing, safe training board or supervised installation.',
    checkYourself: `Can you explain ${activeLesson.topic.toLocaleLowerCase()} clearly without repeating the video title?`,
  };
  const queuedNextLesson = autoNextState ? lessonLookup.get(autoNextState.nextLessonId) : undefined;
  const activeAssessment = assessmentBank.lessons[activeLesson.id];
  const activeNextLesson=allLessons[(globalLessonIndex.get(activeLesson.id)??-1)+1];
  const activeCheckpoint = activeCheckpointId ? assessmentBank.checkpoints[activeCheckpointId] : undefined;
  const activeCheckpointModule = activeCheckpoint ? course.modules.find((module)=>module.id===activeCheckpoint.moduleId) : undefined;
  const checkpointNextLesson = activeCheckpoint ? allLessons[(globalLessonIndex.get(activeCheckpoint.throughLessonId)??-1)+1] : undefined;
  const activeBoundaryCheckpoint = checkpointAfterLesson.get(activeLesson.id);
  const activeLearningText = `${activeLesson.title} ${activeGuide.summary}`;
  const activePractice = practiceForLesson(activeLearningText);
  const nextAction = nextLearningAction(learner.evidence, Object.values(learner.flashcardProgress).filter(item => item.dueAt <= todayKey()).length, activeLesson.id);
  const selectedMasteryModule = course.modules.find((module) => module.id === selectedMasteryModuleId) ?? course.modules[0];
  const selectedMasteryAssessment = assessmentBank.modules[selectedMasteryModule.id];
  const today = todayKey();
  const { dueFlashcards, dueReviewCards, dueReviewQuestions } = useMemo(() => {
    const due = assessmentBank.allFlashcards.filter((card) => {
      const progress = learner.flashcardProgress[card.id];
      return Boolean(progress && progress.dueAt <= today);
    });
    const cards = reviewSession.length ? reviewSession.map(id => assessmentBank.flashcardLookup.get(id)).filter((card): card is NonNullable<typeof card> => Boolean(card)) : due.slice(0, 5);
    const cardIds = new Set(cards.map((card) => card.id));
    const questions = Object.values(assessmentBank.lessons)
      .flatMap((assessment) => assessment.questions)
      .filter((question) => cardIds.has(question.cardId))
      .slice(0, 30);
    return { dueFlashcards: due, dueReviewCards: cards, dueReviewQuestions: questions };
  }, [learner.flashcardProgress, today, reviewSession]);
  const playerOrigin = hydrated && typeof window !== 'undefined' ? window.location.origin : '';
  const playerSrc = playerOrigin
    ? `https://www.youtube.com/embed/${activeLesson.videoId}?enablejsapi=1&origin=${encodeURIComponent(playerOrigin)}&rel=0&playsinline=1&autoplay=${autoPlayLessonId === activeLesson.id ? 1 : 0}`
    : '';

  autoNextEnabledRef.current = learner.autoNextEnabled;
  reviewBeforeNextRef.current = learner.reviewBeforeNext;
  autoNextStateRef.current = autoNextState;
  autoAdvanceRef.current = (fromLessonId, nextLessonId) => {
    if (learner.activeLessonId !== fromLessonId) return;
    const checkpoint = checkpointAfterLesson.get(fromLessonId);
    if (!learner.freeBrowseEnabled && checkpoint && !learner.completedCheckpointIds.includes(checkpoint.id)) {
      pendingAutoNextRef.current=null;
      autoNextStateRef.current=null;
      setAutoNextState(null);
      const missingLessonId = checkpoint.lessonIds.find((lessonId)=>lessonId!==fromLessonId&&!completed.has(lessonId));
      if (missingLessonId) {
        const missingLocation=lessonLocation.get(missingLessonId);
        if(!missingLocation)return;
        setAutoPlayLessonId(null);
        setLearner((current)=>({...current,activeLessonId:missingLessonId,updatedAt:new Date().toISOString()}));
        setOpenModuleId(missingLocation.module.id);
        setLessonTab('overview');
        setView('learn');
        window.history.replaceState(null,'',`#learn/${missingLessonId}`);
        window.scrollTo({top:0,behavior:'smooth'});
        setToast('Complete the remaining lesson before the required checkpoint.');
        return;
      }
      setAutoPlayLessonId(null);
      setActiveCheckpointId(checkpoint.id);
      setOpenModuleId(checkpoint.moduleId);
      setView('learn');
      window.scrollTo({top:0,behavior:'smooth'});
      setToast(`Checkpoint ${checkpoint.number} is required before the next lesson group.`);
      return;
    }
    const nextLocation = lessonLocation.get(nextLessonId);
    if (!nextLocation) return;
    if (autoNextTimerRef.current !== null) window.clearInterval(autoNextTimerRef.current);
    autoNextTimerRef.current = null;
    pendingAutoNextRef.current = null;
    autoNextStateRef.current = null;
    setAutoNextState(null);
    setAutoPlayLessonId(nextLessonId);
    setActiveCheckpointId(null);
    setLearner((current) => ({ ...current, activeLessonId: nextLessonId, updatedAt: new Date().toISOString() }));
    setOpenModuleId(nextLocation.module.id);
    setLessonTab('overview');
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
    let checkpointToOpen: CheckpointAssessment | undefined;
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
    const [hashView, hashId] = window.location.hash.replace(/^#/, '').split('/');
    if (hashView === 'learn' && hashId && lessonLookup.has(hashId)) {
      nextState = { ...nextState, activeLessonId: hashId };
    }
    const blocker = nextState.freeBrowseEnabled ? undefined : checkpointBeforeLesson(nextState.activeLessonId,nextState.completedCheckpointIds);
    if(blocker){
      const watched=new Set(nextState.completedLessonIds);
      const missingLessonId=blocker.lessonIds.find((lessonId)=>!watched.has(lessonId));
      nextState={...nextState,activeLessonId:missingLessonId??blocker.throughLessonId};
      if(!missingLessonId)checkpointToOpen=blocker;
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
      if(checkpointToOpen)setActiveCheckpointId(checkpointToOpen.id);
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

          setLessonTab('overview');
          if (!nextLesson) {
            setToast('Final video watched. Reconstruct the idea, then review your learning evidence.');
            return;
          }

          if (!autoNextEnabledRef.current) {
            setToast('Video watched. Explain the key idea before choosing your next activity.');
            return;
          }

          if (reviewBeforeNextRef.current) {
            setLessonTab('overview');
            setToast('Video watched. Start with the short recall prompt in Overview.');
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
      setActiveCheckpointId(null);
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
    setActiveCheckpointId(null);
    setLearner((current) => ({ ...current, activeLessonId: lessonId, updatedAt: new Date().toISOString() }));
    setOpenModuleId(nextLocation.module.id);
    setLessonTab('overview');
    setAssessmentMode('quiz'); setPracticeOpen(false);
    setView('learn');
    setSearchOpen(false);
    setModuleDrawerOpen(false);
    window.history.replaceState(null, '', `#learn/${lessonId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCheckpoint = (checkpoint: CheckpointAssessment) => {
    cancelAutoNext(false);
    setAutoPlayLessonId(null);
    setLearner((current)=>({...current,activeLessonId:checkpoint.throughLessonId,updatedAt:new Date().toISOString()}));
    setActiveCheckpointId(checkpoint.id);
    setOpenModuleId(checkpoint.moduleId);
    setView('learn');
    setSearchOpen(false);
    setModuleDrawerOpen(false);
    window.history.replaceState(null,'',`#learn/${checkpoint.throughLessonId}`);
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const resolveCheckpoint = (checkpoint: CheckpointAssessment) => {
    const missingLessonId=checkpoint.lessonIds.find((lessonId)=>!completed.has(lessonId));
    if(missingLessonId){
      loadLesson(missingLessonId);
      setToast('Finish this lesson group before taking its checkpoint.');
      return;
    }
    openCheckpoint(checkpoint);
  };

  const startCheckpoint = (checkpointId: string) => {
    const targetIndex=assessmentBank.checkpointList.findIndex((checkpoint)=>checkpoint.id===checkpointId);
    if(targetIndex<0)return;
    if(learner.freeBrowseEnabled){resolveCheckpoint(assessmentBank.checkpointList[targetIndex]);return;}
    const passed=new Set(learner.completedCheckpointIds);
    const required=assessmentBank.checkpointList.slice(0,targetIndex+1).find((checkpoint)=>!passed.has(checkpoint.id));
    resolveCheckpoint(required??assessmentBank.checkpointList[targetIndex]);
  };

  const chooseLesson = (lessonId: string) => {
    const blocker=learner.freeBrowseEnabled ? undefined : checkpointBeforeLesson(lessonId,learner.completedCheckpointIds);
    if(blocker){
      resolveCheckpoint(blocker);
      if(blocker.lessonIds.every((id)=>completed.has(id)))setToast(`Pass “${blocker.title}” to unlock the next lesson group.`);
      return;
    }
    loadLesson(lessonId);
  };

  const chooseModule = (module: CourseModule) => {
    if(learner.freeBrowseEnabled){loadLesson(module.lessons.find((lesson)=>!completed.has(lesson.id))?.id??module.lessons[0].id);return;}
    for(const lesson of module.lessons){
      if(!completed.has(lesson.id)){chooseLesson(lesson.id);return;}
      const checkpoint=checkpointAfterLesson.get(lesson.id);
      if(checkpoint&&!passedCheckpoints.has(checkpoint.id)){startCheckpoint(checkpoint.id);return;}
    }
    chooseLesson(module.lessons.at(-1)?.id??module.lessons[0].id);
  };
  const revisitFoundation = (lessonId: string) => {
    if (lessonId === activeLesson.id) return;
    setReturnLesson({id: activeLesson.id, tab: lessonTab});
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
      return { ...current, completedLessonIds: isComplete ? current.completedLessonIds.filter((id) => id !== activeLesson.id) : [...current.completedLessonIds, activeLesson.id], updatedAt: new Date().toISOString() };
    });
    setToast(isComplete ? 'Watched mark removed.' : 'Video marked as watched.');
    if (advance && !isComplete) {
      setLessonTab('overview');
      window.setTimeout(() => document.querySelector('.lesson-compass')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }), 100);
    }
  };

  const toggleBookmark = () => {
    const isSaved = bookmarked.has(activeLesson.id);
    setLearner((current) => ({ ...current, bookmarkedLessonIds: isSaved ? current.bookmarkedLessonIds.filter((id) => id !== activeLesson.id) : [...current.bookmarkedLessonIds, activeLesson.id], updatedAt: new Date().toISOString() }));
    setToast(isSaved ? 'Bookmark removed.' : 'Lesson saved to your notebook.');
  };

  const rateFlashcard = (cardId: string, knew: boolean) => {
    setLearner((current) => {
      const previous = current.flashcardProgress[cardId];
      const next = scheduleRecall(previous, knew);
      return {
        ...current,
        flashcardProgress: { ...current.flashcardProgress, [cardId]: next },
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const recordEvidence = (input: EvidenceInput) => {
    setLearner(current => ({...current,evidence:appendEvidence(current.evidence,input),updatedAt:new Date().toISOString()}));
  };
  const startReview = () => {
    setReviewSession(dueFlashcards.slice(0,5).map(card=>card.id)); setReviewQueueOpen(true); navigate('progress');
  };
  const revealPractice = () => { setLessonTab('quiz');setPracticeOpen(true);window.setTimeout(()=>document.querySelector('.lesson-practice-reveal')?.scrollIntoView({block:'start',behavior:'auto'}),100); };
  const openPractice = (lessonId: string) => { chooseLesson(lessonId); revealPractice(); };
  const followRecommendation = () => {
    if(nextAction.kind==='review')startReview();
    else if(nextAction.kind==='repair') {
      chooseLesson(nextAction.lessonId);
      setLessonTab(nextAction.dimension==='recall'||nextAction.dimension==='standards'?'overview':'quiz');
      if(nextAction.dimension==='application'||nextAction.dimension==='diagnosis')revealPractice();
    } else chooseLesson(nextAction.lessonId);
  };

  const completeLessonQuiz = (score: number, total: number) => {
    const passed = score >= Math.ceil(total * 0.8);
    setLearner((current) => {
      const at=new Date().toISOString(),recordId=quizRecordId('lesson',activeLesson.id);
      return {
        ...withStudyMinutes(current, Math.max(5, Math.ceil(total / 2))),
        lessonQuizBestScores: { ...current.lessonQuizBestScores, [activeLesson.id]: Math.max(current.lessonQuizBestScores[activeLesson.id] ?? 0, score) },
        quizRecords:{...current.quizRecords,[recordId]:recordQuizAttempt(current.quizRecords[recordId],score,total,at)},
        confidence: { ...current.confidence, [activeLesson.id]: passed ? 3 : 1 },
        completedLessonAssessmentIds: passed && !current.completedLessonAssessmentIds.includes(activeLesson.id)
          ? [...current.completedLessonAssessmentIds, activeLesson.id]
          : current.completedLessonAssessmentIds,
        updatedAt: at,
      };
    });
    setToast(passed ? `Lesson quiz passed: ${score} of ${total}.` : `You scored ${score} of ${total}. Review the missed ideas before retrying.`);
  };

  const completeCheckpointQuiz = (score: number, total: number) => {
    if(!activeCheckpoint)return;
    const passed=score>=Math.ceil(total*.8);
    setLearner((current)=>{
      const at=new Date().toISOString(),recordId=quizRecordId('checkpoint',activeCheckpoint.id);
      return {
        ...withStudyMinutes(current,Math.max(10,Math.ceil(total/2))),
        checkpointQuizBestScores:{...current.checkpointQuizBestScores,[activeCheckpoint.id]:Math.max(current.checkpointQuizBestScores[activeCheckpoint.id]??0,score)},
        quizRecords:{...current.quizRecords,[recordId]:recordQuizAttempt(current.quizRecords[recordId],score,total,at)},
        completedCheckpointIds:passed&&!current.completedCheckpointIds.includes(activeCheckpoint.id)?[...current.completedCheckpointIds,activeCheckpoint.id]:current.completedCheckpointIds,
        updatedAt:at,
      };
    });
    setToast(passed?`Checkpoint ${activeCheckpoint.number} passed. The next lesson group is unlocked.`:`You scored ${score} of ${total}. Reach 80% to continue.`);
  };

  const completeModuleQuiz = (score: number, total: number) => {
    const passed = score >= Math.ceil(total * 0.8);
    setLearner((current) => {
      const at=new Date().toISOString(),recordId=quizRecordId('module',selectedMasteryModule.id);
      return {
        ...withStudyMinutes(current, Math.max(12, Math.ceil(total / 2))),
        moduleQuizBestScores: { ...current.moduleQuizBestScores, [selectedMasteryModule.id]: Math.max(current.moduleQuizBestScores[selectedMasteryModule.id] ?? 0, score) },
        quizRecords:{...current.quizRecords,[recordId]:recordQuizAttempt(current.quizRecords[recordId],score,total,at)},
        completedModuleAssessmentIds: passed && !current.completedModuleAssessmentIds.includes(selectedMasteryModule.id)
          ? [...current.completedModuleAssessmentIds, selectedMasteryModule.id]
          : current.completedModuleAssessmentIds,
        updatedAt: at,
      };
    });
    setToast(passed ? `Module ${selectedMasteryModule.number} check passed.` : 'This attempt is saved. Review weak cards and try the module quiz again.');
  };

  const completeReviewQuiz = (score: number, total: number) => {
    setLearner((current) => withStudyMinutes(current, Math.max(8, Math.ceil(total / 2))));
    setToast(`Spaced review complete: ${score} of ${total}. Cards you missed stay in today's queue.`);
  };

  const continueAfterLessonAssessment = () => {
    if(!learner.freeBrowseEnabled&&activeBoundaryCheckpoint&&!learner.completedCheckpointIds.includes(activeBoundaryCheckpoint.id)){
      startCheckpoint(activeBoundaryCheckpoint.id);
      return;
    }
    const next = allLessons[allLessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1];
    if (next) chooseLesson(next.id);
    else navigate('progress');
  };

  const continueAfterCheckpoint = () => {
    if(!activeCheckpoint)return;
    const next=allLessons[(globalLessonIndex.get(activeCheckpoint.throughLessonId)??-1)+1];
    setActiveCheckpointId(null);
    if(next)chooseLesson(next.id);
    else navigate('progress');
  };

  const chooseSearchResult = (result: (typeof searchResults)[number]) => {
    if (result.kind === 'Video lesson') chooseLesson(result.id);
    if (result.kind === 'Glossary term') {
      setToolQuery(result.title); setSearchOpen(false); navigate('toolkit');
    }
    if(result.kind==='Practice'||result.kind==='Your learning') openPractice(result.parentId);
    if(result.kind==='Standards') { chooseLesson(result.parentId); setLessonTab('overview'); }
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

  const resetProgress = () => { setLearner(initialLearnerState); setActiveCheckpointId(null); setStorageBlocked(false); setReviewSession([]); setConfirmReset(false); setSettingsOpen(false); navigate('home'); setToast('Local learning progress has been reset.'); };
  const moduleCompletedCount = (module: CourseModule) => module.lessons.filter((lesson) => completed.has(lesson.id)).length;
  const openModuleRecap = (moduleId:string) => {
    cancelAutoNext(false);
    playerBindingRef.current?.player.pauseVideo?.();
    setAutoPlayLessonId(null);
    setModuleDrawerOpen(false);
    setRecapModuleId(moduleId);
  };

  const browsingControls = (
    <section className="browsing-controls" aria-label="Learning navigation">
      <button type="button" className="settings-switch" role="switch" aria-checked={learner.freeBrowseEnabled} onClick={() => {
        cancelAutoNext(false);
        setLearner((current) => ({...current, freeBrowseEnabled: !current.freeBrowseEnabled, updatedAt: new Date().toISOString()}));
        setToast(learner.freeBrowseEnabled ? 'Guided sequence restored. Your progress is unchanged.' : 'Browse any video. Skipped work stays incomplete.');
      }}>
        <SkipForward size={19}/><span><strong>Browse freely</strong><small>{learner.freeBrowseEnabled ? 'On · Open any module or video' : 'Off · Follow the guided sequence'}</small></span>
        <span className={`switch-track ${learner.freeBrowseEnabled ? 'on' : ''}`} aria-hidden="true"><i/></span>
      </button>
      <p>Opening a lesson never marks it complete. Checkpoints still require their own lesson group and a passing score.</p>
      {nextRequiredItem && <button type="button" className="resume-unfinished" onClick={() => nextRequiredItem.kind === 'lesson' ? chooseLesson(nextRequiredItem.lesson.id) : startCheckpoint(nextRequiredItem.checkpoint.id)}><RotateCcw size={16}/> Resume unfinished work</button>}
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
            <button className="my-books-button" type="button" aria-label="Open My books" onClick={() => setBookReader({})}><BookOpen size={19} /><span>My books</span></button>
            <button className="header-progress" type="button" onClick={() => navigate('progress')} aria-label={`${coursePercent}% of the required course path complete`}><span className="mini-progress"><i style={{ width: `${coursePercent}%` }} /></span><b>{coursePercent}%</b></button>
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
                  <p>{nextAction.reason}</p>
                  <div className="button-row">
                    <button className="primary-button" type="button" onClick={followRecommendation}><CirclePlay size={19} /> {learner.evidence.length || completed.size || nextAction.kind !== 'continue' ? nextAction.title : 'Start the course'} <ArrowRight size={18} /></button>
                  </div>
                </div>
                <div className="hero-session-card">
                  <div className="session-label"><span>{nextRequiredItem?'Up next':'Required path complete'}</span><span>{nextRequiredItem?.kind==='lesson'?nextRequiredItem.lesson.duration:nextRequiredItem?.kind==='checkpoint'?`${nextRequiredItem.checkpoint.questions.length} questions`:'100%'}</span></div>
                  <div className="session-index">{nextRequiredItem?.kind==='lesson'?`M${pad(nextRequiredItem.module.number)} · L${pad(nextRequiredItem.lesson.number)}`:nextRequiredItem?.kind==='checkpoint'?`M${pad(nextRequiredItem.module.number)} · CHECKPOINT ${pad(nextRequiredItem.checkpoint.number)}`:'COURSE COMPLETE'}</div>
                  <h2>{nextRequiredItem?.kind==='lesson'?nextRequiredItem.lesson.title:nextRequiredItem?.kind==='checkpoint'?nextRequiredItem.checkpoint.title:'All required learning complete'}</h2><p>{nextRequiredItem?.module.title??'Keep your knowledge fresh with quiz retries and flashcards.'}</p>
                  <div className="session-meter"><span style={{ width: `${nextRequiredItem?moduleTracking(nextRequiredItem.module).requiredPercent:100}%` }} /></div>
                  {nextRequiredItem?.kind==='lesson'?<button type="button" onClick={() => chooseLesson(nextRequiredItem.lesson.id)}>Open lesson <ArrowRight size={17} /></button>:nextRequiredItem?.kind==='checkpoint'?<button type="button" onClick={() => startCheckpoint(nextRequiredItem.checkpoint.id)}>Start checkpoint <ArrowRight size={17} /></button>:<button type="button" onClick={() => navigate('progress')}>Review your progress <ArrowRight size={17} /></button>}
                </div>
              </section>

              <section className="learning-next-strip" aria-label="Choose your next learning action"><button type="button" onClick={startReview} disabled={!dueFlashcards.length}><RotateCcw size={19}/><span><strong>{dueFlashcards.length} ideas due for recall</strong><small>A focused session of up to five cards</small></span><ArrowRight size={17}/></button><button type="button" onClick={()=>openPractice(activeLesson.id)}><Calculator size={19}/><span><strong>Apply your current lesson</strong><small>Worked examples and practical reasoning</small></span><ArrowRight size={17}/></button></section>

              <section className="stat-grid home-stats" aria-label="Learning overview">
                <article><span className="stat-icon copper"><PlayCircle size={21} /></span><div><b>{completed.size}<small> / {allLessons.length}</small></b><p>Video lessons completed</p></div></article>
                <article><span className="stat-icon amber"><Target size={21} /></span><div><b>{weekMinutes}<small> / {learner.weeklyGoalMinutes} min</small></b><p>This week’s study goal</p></div></article>
              </section>

              <section className="home-course">
                <div className="home-primary-column">
                  <div className="section-heading compact"><div><h2>Course modules</h2></div></div>
                  {browsingControls}
                  <div className="module-card-grid">
                    {course.modules.map((module) => {
                      const tracking=moduleTracking(module);
                      return <button type="button" className="module-card" key={module.id} onClick={() => chooseModule(module)}><div className="module-card-head"><span>{pad(module.number)}</span><small>{module.duration}</small></div><h3>{module.title}</h3><div className="progress-line"><span style={{ width: `${tracking.requiredPercent}%` }} /></div><footer><span>{tracking.videos}/{module.lessons.length} videos · {tracking.completedCheckpoints}/{tracking.checkpoints.length} checkpoints</span><b>{tracking.requiredPercent}%</b></footer></button>;
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
                <div className="course-summary"><span>{courseRequiredComplete}/{courseRequiredTotal} required items</span><b>{coursePercent}%</b><div className="progress-line"><span style={{ width: `${coursePercent}%` }} /></div></div>
                <nav>
                  {course.modules.map((module) => {
                    const isOpen = openModuleId === module.id;
                    const done = moduleCompletedCount(module);
                    return (
                      <section className={`module-accordion ${isOpen ? 'open' : ''}`} key={module.id}>
                        <button type="button" className={location.module.id === module.id ? 'active' : ''} onClick={() => setOpenModuleId(isOpen ? '' : module.id)} aria-expanded={isOpen}>
                          <span className="module-index">{pad(module.number)}</span><span><strong>{module.title}</strong><small>{done}/{module.lessons.length} videos · {assessmentBank.checkpointsByModule[module.id].filter((checkpoint)=>passedCheckpoints.has(checkpoint.id)).length}/{assessmentBank.checkpointsByModule[module.id].length} checkpoints</small></span><ChevronDown size={18} />
                        </button>
                        {isOpen && <div className="accordion-lessons">{assessmentBank.checkpointsByModule[module.id].map(group=><details className="course-topic-group" key={group.id} open={group.newLessonIds.includes(activeLesson.id)||activeCheckpoint?.id===group.id||undefined}><summary><span>{group.number}. {group.title}</span><small>{group.newLessonIds.filter(id=>completed.has(id)).length}/{group.newLessonIds.length} watched</small></summary>{group.newLessonIds.flatMap((lessonId) => {
                          const lesson=lessonLookup.get(lessonId)!;
                          const checkpoint=checkpointAfterLesson.get(lesson.id);
                          const lessonLocked=!learner.freeBrowseEnabled&&Boolean(checkpointBeforeLesson(lesson.id,learner.completedCheckpointIds));
                          const lessonRecord=learner.quizRecords[quizRecordId('lesson',lesson.id)];
                          const latestLessonScore=quizPercentage(lessonRecord);
                          const rows=[<button type="button" key={lesson.id} className={`${activeLesson.id===lesson.id&&!activeCheckpoint?'active ':''}${lessonLocked?'locked':''}`} onClick={()=>chooseLesson(lesson.id)}>{lessonLocked?<LockKeyhole size={16}/>:completed.has(lesson.id)?<CheckCircle2 size={17}/>:<Circle size={17}/>}<span><strong>L{pad(lesson.number)} · {lesson.title}</strong><small>{lesson.duration} · {lesson.instructor}</small></span>{(bookmarked.has(lesson.id)||latestLessonScore!==undefined)&&<div className="lesson-row-state">{latestLessonScore!==undefined&&<span className={`quiz-score-chip ${latestLessonScore>=80?'passed':'review'}`}>Q {latestLessonScore}%</span>}{bookmarked.has(lesson.id)&&<Bookmark size={14} fill="currentColor"/>}</div>}</button>];
                          if(checkpoint){const passed=passedCheckpoints.has(checkpoint.id);const ready=checkpoint.lessonIds.every((id)=>completed.has(id));const latest=quizPercentage(learner.quizRecords[quizRecordId('checkpoint',checkpoint.id)]);rows.push(<button type="button" key={checkpoint.id} className={`checkpoint-map-row ${activeCheckpoint?.id===checkpoint.id?'active ':''}${passed?'passed':ready?'ready':'locked'}`} onClick={()=>startCheckpoint(checkpoint.id)}>{passed?<CheckCircle2 size={17}/>:ready?<ListChecks size={17}/>:<LockKeyhole size={16}/>}<span><strong>Checkpoint {checkpoint.number}: {checkpoint.title}</strong><small>{checkpoint.questions.length} questions · {passed?'Passed':ready?'Ready':'Complete the lesson group'}{latest!==undefined?` · Latest ${latest}%`:''}</small></span><ChevronRight size={15}/></button>);}
                          return rows;
                        })}</details>)}<button type="button" className="module-recap-link" onClick={()=>openModuleRecap(module.id)}><BookOpen size={19}/><span><strong>Module recap book</strong><small>Key ideas · relationships · source videos</small></span><ChevronRight size={17}/></button></div>}
                      </section>
                    );
                  })}
                </nav>
              </aside>
              {moduleDrawerOpen && <button className="drawer-scrim" type="button" aria-label="Close course map" onClick={() => setModuleDrawerOpen(false)} />}

              {activeCheckpoint&&activeCheckpointModule?<CheckpointWorkspace
                checkpoint={activeCheckpoint}
                moduleNumber={activeCheckpointModule.number}
                moduleTitle={activeCheckpointModule.title}
                checkpointTotal={assessmentBank.checkpointsByModule[activeCheckpoint.moduleId].length}
                progress={learner.flashcardProgress}
                bestScore={learner.checkpointQuizBestScores[activeCheckpoint.id]??0}
                quizRecord={learner.quizRecords[quizRecordId('checkpoint',activeCheckpoint.id)]}
                completed={learner.completedCheckpointIds.includes(activeCheckpoint.id)}
                onRateCard={rateFlashcard}
                onEvidence={recordEvidence}
                onOpenLesson={loadLesson}
                onComplete={completeCheckpointQuiz}
                onContinue={continueAfterCheckpoint}
                onRecap={activeCheckpoint.throughLessonId===activeCheckpointModule.lessons.at(-1)?.id?()=>openModuleRecap(activeCheckpoint.moduleId):undefined}
                onBack={()=>loadLesson(activeCheckpoint.throughLessonId)}
                continueLabel={checkpointNextLesson?'Continue to next lesson group':'View progress'}
              />:<article className="lesson-canvas">
                {returnLesson && returnLesson.id !== activeLesson.id && <button type="button" className="secondary-button foundation-return" onClick={()=>{chooseLesson(returnLesson.id);setLessonTab(returnLesson.tab);setReturnLesson(null);}}><ChevronLeft size={18}/> Return to {lessonLookup.get(returnLesson.id)?.title}</button>}
                <div className="lesson-topline">
                  <button className="mobile-module-button" type="button" onClick={() => setModuleDrawerOpen(true)}><Menu size={19} /> Course map</button>
                  <div className="breadcrumbs"><span>Module {pad(location.module.number)}</span><ChevronRight size={15} /><span>Lesson {pad(activeLesson.number)}</span></div>
                  <div className="lesson-stepper"><button type="button" onClick={() => goRelative(-1)} disabled={activeLesson.id === allLessons[0].id} aria-label="Previous lesson"><ChevronLeft size={20} /></button><span>{allLessons.findIndex((lesson) => lesson.id === activeLesson.id) + 1} / {allLessons.length}</span><button type="button" onClick={() => goRelative(1)} disabled={activeLesson.id === allLessons.at(-1)?.id} aria-label="Next lesson"><ChevronRight size={20} /></button></div>
                </div>
                <div className="lesson-title-block"><div><span className="topic-pill lesson-sequence">Lesson {pad(activeLesson.number)} of {location.module.lessons.length}</span><span className="topic-pill">{activeLesson.layer}</span><span className="topic-pill quiet">{activeLesson.topic}</span>{'sourceKind' in activeLesson && typeof activeLesson.sourceKind === 'string' && <span className="topic-pill quiet">{activeLesson.sourceKind}</span>}</div><h1>{activeLesson.title}</h1><p>{activeLesson.instructor} <span>·</span> {activeLesson.duration} <span>·</span> {location.module.title}</p></div>
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
                <nav className="lesson-tabs" role="tablist" aria-label="Lesson sections" onKeyDown={(event) => {
                  const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
                  const index = tabs.indexOf(event.target as HTMLButtonElement);
                  const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
                  if (next >= 0) { event.preventDefault(); tabs[next].focus(); tabs[next].click(); }
                }}>{([['overview', 'Overview', BookOpen], ['quiz', 'Quiz', ListChecks]] as const).map(([id, label, Icon]) => <button key={id} id={`lesson-tab-${id}`} type="button" role="tab" aria-selected={lessonTab === id} aria-controls={id === 'quiz' ? 'lesson-assessment' : `lesson-${id}`} tabIndex={lessonTab === id ? 0 : -1} className={lessonTab === id ? 'active' : ''} onClick={() => setLessonTab(id)}><Icon size={18} />{label}</button>)}</nav>

                <div className="lesson-tab-content">
                  <section id="lesson-overview" role="tabpanel" aria-labelledby="lesson-tab-overview" hidden={lessonTab !== 'overview'} className="lesson-overview">
                    <LessonOverview
                      key={activeLesson.id}
                      lessonId={activeLesson.id}
                      guide={activeGuide}
                      watched={completed.has(activeLesson.id)}
                      learningText={activeLearningText}
                      questions={activeAssessment.questions}
                      onRateCard={rateFlashcard}
                      onEvidence={recordEvidence}
                      onLesson={revisitFoundation}
                      onQuiz={()=>{setAssessmentMode('quiz');setLessonTab('quiz');}}
                      onRead={reading=>setBookReader({reading})}
                    />
                  </section>

                  <div id="lesson-assessment" role="tabpanel" aria-labelledby="lesson-tab-quiz" hidden={lessonTab !== 'quiz'}>
                    <div className="review-mode-actions"><button type="button" className="secondary-button" onClick={()=>setAssessmentMode(value=>value==='quiz'?'cards':'quiz')}>{assessmentMode==='quiz'?'Review with flashcards':'Return to the quiz'}</button></div>
                    <AssessmentPanel
                      key={activeLesson.id}
                      eyebrow={`M${pad(location.module.number)} · L${pad(activeLesson.number)} lesson recap`}
                      title={activeLesson.title}
                      description="Review the flashcards, then take the quiz."
                      connectedLessonFlow
                      mode={assessmentMode}
                      onModeChange={setAssessmentMode}
                      assessmentLabel="Lesson quiz"
                      flashcards={activeAssessment.flashcards}
                      questions={activeAssessment.questions}
                      progress={learner.flashcardProgress}
                      bestScore={learner.lessonQuizBestScores[activeLesson.id] ?? 0}
                      quizRecord={learner.quizRecords[quizRecordId('lesson',activeLesson.id)]}
                      completed={learner.completedLessonAssessmentIds.includes(activeLesson.id)}
                      onRateCard={rateFlashcard}
                      onEvidence={recordEvidence}
                      onOpenLesson={revisitFoundation}
                      onPractice={revealPractice}
                      onCompleteQuiz={completeLessonQuiz}
                      onContinue={continueAfterLessonAssessment}
                      continueLabel={activeBoundaryCheckpoint&&!learner.completedCheckpointIds.includes(activeBoundaryCheckpoint.id)?'Take required checkpoint':activeLesson.id===allLessons.at(-1)?.id?'Review progress':'Continue to next lesson'}
                    />
                    <details className="lesson-practice-reveal" open={practiceOpen} onToggle={event=>setPracticeOpen(event.currentTarget.open)}><summary>Worked examples and investigations</summary>{lessonTab==='quiz'&&practiceOpen&&<PracticeWorkspace key={activeLesson.id} lessonId={activeLesson.id} calculation={activePractice.calculation} cases={activePractice.cases} onEvidence={recordEvidence} evidence={learner.evidence}/>}</details>
                  </div>


                </div>
                {activeLesson.id===location.module.lessons.at(-1)?.id&&<section className="module-recap-end"><BookOpen size={28}/><div><span>Module {pad(location.module.number)} · Keep the essentials</span><h2>Your module recap book</h2><p>Turn through the key ideas, relationships and practical distinctions from this module’s videos.</p></div><button type="button" onClick={()=>openModuleRecap(location.module.id)}>Open recap <ArrowRight size={18}/></button></section>}
                {activeBoundaryCheckpoint&&!learner.completedCheckpointIds.includes(activeBoundaryCheckpoint.id)&&<footer className="lesson-next-card checkpoint-next"><div><span>{learner.freeBrowseEnabled?'Checkpoint still unfinished':'Required next'}</span><h3>Checkpoint {activeBoundaryCheckpoint.number}: {activeBoundaryCheckpoint.title}</h3><small>{activeBoundaryCheckpoint.questions.length} cumulative questions · 80% to pass</small></div><button type="button" onClick={()=>startCheckpoint(activeBoundaryCheckpoint.id)}>Start checkpoint <ArrowRight size={18}/></button></footer>}
                {(learner.freeBrowseEnabled||!activeBoundaryCheckpoint||learner.completedCheckpointIds.includes(activeBoundaryCheckpoint.id))&&<footer className="lesson-next-card"><div><span>{activeNextLesson?`Next · Lesson ${pad(activeNextLesson.number)}`:'End of video sequence'}</span><h3>{activeNextLesson?.title??'Check your progress for unfinished work'}</h3></div><button type="button" onClick={()=>activeNextLesson?goRelative(1):navigate('progress')}>{activeNextLesson?'Continue':'View progress'} <ArrowRight size={18}/></button></footer>}
              </article>}
            </div>
          )}
          {view === 'toolkit' && <LearningToolkit query={toolQuery} onQueryChange={setToolQuery} onLesson={chooseLesson} onPractice={openPractice} />}
          {view === 'progress' && (
            <div className="page progress-page">
              <EvidenceOverview events={learner.evidence} onLesson={openPractice}/>
              <section className="progress-hero"><div><span className="eyebrow"><BarChart3 size={16} /> Your learning record</span><h1>Your progress.</h1><p>Track completed videos, required checkpoints, quiz results and study time.</p></div><div className="overall-ring" style={{ '--progress': `${coursePercent * 3.6}deg` } as CSSProperties}><span><b>{coursePercent}%</b><small>required path</small></span></div></section>
              <section className="stat-grid progress-stats"><article><span className="stat-icon copper"><CirclePlay size={21} /></span><div><b>{Math.floor(completedSeconds / 3600)}h {Math.round((completedSeconds % 3600) / 60)}m</b><p>Video time completed</p></div></article><article><span className="stat-icon cyan"><BookOpen size={21} /></span><div><b>{learner.completedLessonAssessmentIds.length}<small> / {allLessons.length}</small></b><p>Lesson quizzes passed once</p></div></article><article><span className="stat-icon green"><RotateCcw size={21} /></span><div><b>{dueFlashcards.length}</b><p>Flashcards due for review</p></div></article><article><span className="stat-icon amber"><LockKeyhole size={21} /></span><div><b>{learner.completedCheckpointIds.length}<small> / {assessmentBank.checkpointList.length}</small></b><p>Required checkpoints passed</p></div></article></section>
              <details className="mastery-centre" open={reviewQueueOpen || undefined}>
                <summary>Module quizzes &amp; flashcard review</summary>
                <section className="review-queue-banner"><span className="review-queue-icon"><RotateCcw size={25} /></span><div><span className="eyebrow neutral">Flashcards</span><h3>{dueFlashcards.length ? `${dueFlashcards.length} cards due` : 'No cards due today'}</h3><p>{dueFlashcards.length ? 'Retrieve up to five ideas in this focused session.' : 'Review a lesson to add cards.'}</p></div><button type="button" disabled={!dueReviewCards.length} onClick={() => { if(reviewQueueOpen){setReviewQueueOpen(false);setReviewSession([]);}else startReview(); }}>{reviewQueueOpen ? 'Close review' : 'Start due review'} <ArrowRight size={17} /></button></section>
                {reviewQueueOpen && dueReviewCards.length > 0 && <div className="due-review-panel"><AssessmentPanel
                  key={`due-${today}-${reviewSession.join('-')}`}
                  eyebrow="Today’s recall session"
                  title="Due flashcards"
                  description="Recall each answer, then check it."
                  flashcards={dueReviewCards}
                  questions={dueReviewQuestions}
                  progress={learner.flashcardProgress}
                  bestScore={0}
                  completed={false}
                  onRateCard={rateFlashcard}
                  onEvidence={recordEvidence}
                  onOpenLesson={chooseLesson}
                  onCompleteQuiz={completeReviewQuiz}
                  onContinue={() => {setReviewQueueOpen(false);setReviewSession([]);}}
                  continueLabel="Finish today’s review"
                /></div>}
                <div className="mastery-module-strip" aria-label="Choose a module assessment">{course.modules.map((module) => {
                  const assessment = assessmentBank.modules[module.id];
                  const mastered = learner.completedModuleAssessmentIds.includes(module.id);
                  const record=learner.quizRecords[quizRecordId('module',module.id)];
                  return <button type="button" key={module.id} className={selectedMasteryModule.id === module.id ? 'active' : ''} onClick={() => setSelectedMasteryModuleId(module.id)}><span>{pad(module.number)}</span><strong>{module.title}</strong><small>{assessment.questions.length} questions{record?` · Latest ${quizPercentage(record)}%`:''}</small>{mastered && <CheckCircle2 size={18} />}</button>;
                })}</div>
                <AssessmentPanel
                  key={selectedMasteryModule.id}
                  eyebrow={`Module ${pad(selectedMasteryModule.number)} mastery`}
                  title={selectedMasteryModule.title}
                  description="Review this module. Score 80% to pass."
                  flashcards={selectedMasteryAssessment.flashcards}
                  questions={selectedMasteryAssessment.questions}
                  progress={learner.flashcardProgress}
                  bestScore={learner.moduleQuizBestScores[selectedMasteryModule.id] ?? 0}
                  quizRecord={learner.quizRecords[quizRecordId('module',selectedMasteryModule.id)]}
                  completed={learner.completedModuleAssessmentIds.includes(selectedMasteryModule.id)}
                  onRateCard={rateFlashcard}
                  onEvidence={recordEvidence}
                  onOpenLesson={chooseLesson}
                  onCompleteQuiz={completeModuleQuiz}
                  onContinue={() => {
                    const nextModule = course.modules[selectedMasteryModule.number];
                    if (nextModule) setSelectedMasteryModuleId(nextModule.id);
                    else navigate('progress');
                  }}
                  continueLabel={selectedMasteryModule.number === course.modules.length ? 'View progress' : 'Next module review'}
                />
              </details>
              <div className="progress-layout">
                <section className="module-progress-panel"><div className="section-heading compact"><div><span className="eyebrow neutral">Required pathway</span><h2>Module progress</h2></div></div><div className="module-progress-list">{course.modules.map((module) => { const tracking=moduleTracking(module); return <button type="button" key={module.id} onClick={() => chooseModule(module)}><span className="module-index">{pad(module.number)}</span><span className="module-progress-copy"><strong>{module.title}</strong><small>{tracking.videos}/{module.lessons.length} videos watched · {tracking.quizzes}/{module.lessons.length} lesson quizzes passed · {tracking.completedCheckpoints}/{tracking.checkpoints.length} checkpoints passed</small><span className="progress-line"><i style={{ width: `${tracking.requiredPercent}%` }} /></span></span><b>{tracking.requiredPercent}%</b><ChevronRight size={18} /></button>; })}</div></section>
                <aside className="progress-side"><section className="goal-card"><div className="goal-card-head"><Target size={22} /><span>Weekly study goal</span></div><b>{weekMinutes}<small> / {learner.weeklyGoalMinutes} minutes</small></b><div className="progress-line"><span style={{ width: `${weekPercent}%` }} /></div><label><span>Set a weekly goal</span><input type="range" min="30" max="1200" step="30" value={learner.weeklyGoalMinutes} onChange={(event) => setLearner((current) => ({ ...current, weeklyGoalMinutes: Math.max(30, Math.min(1200, Number(event.target.value) || 30)), updatedAt: new Date().toISOString() }))} /><small>minutes</small></label></section><section className="mastery-card"><span className="eyebrow neutral">Latest quiz results</span><h3>{attemptedLessonQuizRecords.length?`${currentLessonQuizPasses} of ${attemptedLessonQuizRecords.length} at 80% or above`:'No completed lesson quizzes yet'}</h3><p>{currentLessonQuizReviews} latest results need review · {learner.completedLessonAssessmentIds.length} passed at least once.</p><button type="button" onClick={() => navigate('learn')}>Continue building mastery <ArrowRight size={17} /></button></section><section className="backup-card"><Database size={22} /><div><strong>Keep your progress safe</strong><p>Progress is device-local. Download a backup before changing browser or computer.</p></div><button type="button" onClick={exportProgress}><Download size={17} /> Download backup</button></section></aside>
              </div>
            </div>
          )}
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
            <div className="privacy-panel"><LockKeyhole size={23} /><div><strong>Your learning data</strong><p>Video marks, quiz attempts, bookmarks and learning evidence stay in this browser. My books keeps its shared reading record.</p></div></div>
            <section className="settings-section playback-settings"><span className="eyebrow neutral">Playback & recall</span><button className="settings-switch" type="button" role="switch" aria-checked={learner.autoNextEnabled} onClick={toggleAutoNextPreference}><SkipForward size={19} /><span><strong>Auto-next after a finished lesson</strong><small>Optional next-video countdown when reflection is switched off</small></span><span className={`switch-track ${learner.autoNextEnabled ? 'on' : ''}`} aria-hidden="true"><i /></span></button><button className="settings-switch" type="button" role="switch" aria-checked={learner.reviewBeforeNext} onClick={() => { const enabled = !learner.reviewBeforeNext; setLearner((current) => ({ ...current, reviewBeforeNext: enabled, updatedAt: new Date().toISOString() })); setToast(enabled ? 'Lesson recap is now required before auto-next.' : 'Auto-next will use the five-second countdown without opening the recap.'); }}><ListChecks size={19} /><span><strong>Review before next</strong><small>Open synthesis and recall when a video finishes</small></span><span className={`switch-track ${learner.reviewBeforeNext ? 'on' : ''}`} aria-hidden="true"><i /></span></button><p>Recommended: keep reflection on. Choose your next learning action after the video. In fullscreen, the app waits for you to exit safely before changing the lesson.</p></section>
            <section className="settings-section"><span className="eyebrow neutral">Backup & restore</span><button type="button" onClick={exportProgress}><Download size={19} /><span><strong>Download progress backup</strong><small>Save video marks, quiz attempts and bookmarks</small></span><ChevronRight size={18} /></button><button type="button" onClick={() => importInputRef.current?.click()}><Upload size={19} /><span><strong>Restore from backup</strong><small>Choose a previous JSON backup file</small></span><ChevronRight size={18} /></button><input ref={importInputRef} type="file" accept="application/json,.json" onChange={importProgress} hidden /></section>
            <section className="settings-section"><span className="eyebrow neutral">Learning record</span><div className="settings-summary"><div><b>{completed.size}</b><span>videos watched</span></div><div><b>{learner.completedLessonAssessmentIds.length}</b><span>lesson quizzes passed</span></div><div><b>{learner.completedCheckpointIds.length}</b><span>checkpoints passed</span></div></div>{confirmReset ? <div className="reset-confirm"><AlertTriangle size={21} /><p>This permanently clears progress from this browser. Download a backup first if you may want it later.</p><div><button type="button" onClick={() => setConfirmReset(false)}>Cancel</button><button className="danger" type="button" onClick={resetProgress}>Clear local progress</button></div></div> : <button className="reset-button" type="button" onClick={() => setConfirmReset(true)}><RotateCcw size={19} /><span><strong>Reset local progress</strong><small>Clear this browser’s learning record</small></span></button>}</section>
            <div className="settings-footnote"><Info size={18} /><p>Videos stream from YouTube and need internet access.</p></div>
          </section>
        </div>
      )}
      {toast && <div className="toast" role="status" aria-live="polite"><CheckCircle2 size={19} /><span>{toast}</span></div>}
      {bookReader && <BookReader initialReading={bookReader.reading} onClose={() => setBookReader(null)} />}
      {recapModuleId&&<ModuleRecap key={recapModuleId} moduleId={recapModuleId} completedLessonIds={learner.completedLessonIds} onClose={()=>setRecapModuleId(null)}/>}
    </div>
  );
}
