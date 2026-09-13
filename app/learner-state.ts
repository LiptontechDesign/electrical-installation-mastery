import course from './course-curriculum';
import { bookCompanions, practiceLabs } from './learning-data';
import { validVideoCompletionCounts } from './flexible-progress';
import { validEvidence, type LearningEvidence } from './tutor-model';
export type LearnerState = {
  promotedVideoProgressImported?: boolean;
  schemaVersion: 7;
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
  videoCompletionCounts: Record<string,number>;
  reviewBeforeNext: boolean;

  updatedAt: string | null;
};

const allLessons = course.modules.flatMap((module) => module.lessons);
// Retain retired reading/lab IDs so older progress backups remain lossless.
const allReading = bookCompanions.flatMap((book) => book.guides.map((guide) => ({ book, guide })));
const validReadingIds = new Set(allReading.map(({ guide }) => guide.id));
const validLabIds = new Set(practiceLabs.map((lab) => lab.id));

export const initialLearnerState: LearnerState = {
  schemaVersion: 7,
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
  videoCompletionCounts: {},
  reviewBeforeNext: true,

  updatedAt: null,
};

function uniqueValidIds(value: unknown, validIds: Set<string>) {
  return Array.isArray(value)
    ? [...new Set(value.filter((id): id is string => typeof id === 'string' && validIds.has(id)))]
    : [];
}

export function clampState(value: unknown): LearnerState {
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
      ([date, minutes]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && typeof minutes === 'number' && Number.isFinite(minutes) && minutes >= 0,
    ))
    : {};
  return {
    schemaVersion: 7,
    promotedVideoProgressImported: input.promotedVideoProgressImported === true,
    evidence: validEvidence(input.evidence, lessonIds).filter(item => /^(calc(?:-choice)?:|case:)/.test(item.activityId)),
    activeLessonId,
    completedLessonIds: uniqueValidIds(input.completedLessonIds, lessonIds),
    bookmarkedLessonIds: uniqueValidIds(input.bookmarkedLessonIds, lessonIds),
    notes,
    completedReadingIds: uniqueValidIds(input.completedReadingIds, validReadingIds),
    completedLabIds: uniqueValidIds(input.completedLabIds, validLabIds),
    confidence,
    studyMinutesByDate,
    weeklyGoalMinutes: typeof input.weeklyGoalMinutes === 'number' && Number.isFinite(input.weeklyGoalMinutes)
      ? Math.max(30, Math.min(1200, Math.round(input.weeklyGoalMinutes))) : 180,
    autoNextEnabled: typeof input.autoNextEnabled === 'boolean' ? input.autoNextEnabled : true,
    videoCompletionCounts: validVideoCompletionCounts(input.videoCompletionCounts,lessonIds),
    reviewBeforeNext: typeof input.reviewBeforeNext === 'boolean' ? input.reviewBeforeNext : true,
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null,
  };
}
