import course from './course-curriculum';
import { validVideoCompletionCounts } from './flexible-progress';

export type LearnerState = {
  schemaVersion: 10;
  promotedVideoProgressImported?: boolean;
  activeLessonId: string;
  completedLessonIds: string[];
  bookmarkedLessonIds: string[];
  notes: Record<string, string>;
  studyMinutesByDate: Record<string, number>;
  autoNextEnabled: boolean;
  videoCompletionCounts: Record<string, number>;
  updatedAt: string | null;
};

const lessonIds = new Set(course.modules.flatMap(module => module.lessons.map(lesson => lesson.id)));
const firstLessonId = course.modules[0].lessons[0].id;

export const initialLearnerState: LearnerState = {
  schemaVersion: 10,
  activeLessonId: firstLessonId,
  completedLessonIds: [],
  bookmarkedLessonIds: [],
  notes: {},
  studyMinutesByDate: {},
  autoNextEnabled: true,
  videoCompletionCounts: {},
  updatedAt: null,
};

function uniqueLessonIds(value: unknown) {
  return Array.isArray(value)
    ? [...new Set(value.filter((id): id is string => typeof id === 'string' && lessonIds.has(id)))]
    : [];
}

export function clampState(value: unknown): LearnerState {
  if (!value || typeof value !== 'object') return initialLearnerState;
  const input = value as Partial<LearnerState>;
  const notes = input.notes && typeof input.notes === 'object'
    ? Object.fromEntries(Object.entries(input.notes).filter(([id, note]) => lessonIds.has(id) && typeof note === 'string'))
    : {};
  const studyMinutesByDate = input.studyMinutesByDate && typeof input.studyMinutesByDate === 'object'
    ? Object.fromEntries(Object.entries(input.studyMinutesByDate).filter(
      ([date, minutes]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && typeof minutes === 'number' && Number.isFinite(minutes) && minutes >= 0,
    ))
    : {};
  return {
    schemaVersion: 10,
    promotedVideoProgressImported: input.promotedVideoProgressImported === true,
    activeLessonId: typeof input.activeLessonId === 'string' && lessonIds.has(input.activeLessonId) ? input.activeLessonId : firstLessonId,
    completedLessonIds: uniqueLessonIds(input.completedLessonIds),
    bookmarkedLessonIds: uniqueLessonIds(input.bookmarkedLessonIds),
    notes,
    studyMinutesByDate,
    autoNextEnabled: typeof input.autoNextEnabled === 'boolean' ? input.autoNextEnabled : true,
    videoCompletionCounts: validVideoCompletionCounts(input.videoCompletionCounts, lessonIds),
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null,
  };
}

export function calendarDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function isProgressBackup(value: unknown, validLessonIds: Set<string>): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const input = value as Record<string, unknown>;
  return Array.isArray(input.completedLessonIds) && typeof input.activeLessonId === 'string'
    && validLessonIds.has(input.activeLessonId)
    && (input.schemaVersion === undefined || (typeof input.schemaVersion === 'number' && Number.isInteger(input.schemaVersion) && input.schemaVersion >= 1 && input.schemaVersion <= 10));
}
