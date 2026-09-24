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
  videoBookmarks: string[];
  videoNotes: Record<string, string>;
  videoPositions: Record<string, number>;
  timestampNotes: Record<string, { id: string; seconds: number; text: string }[]>;
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
  videoBookmarks: [],
  videoNotes: {},
  videoPositions: {},
  timestampNotes: {},
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
    videoBookmarks: Array.isArray(input.videoBookmarks) ? [...new Set(input.videoBookmarks.filter(id => typeof id === 'string' && /^[\w-]{11}$/.test(id)))].slice(0, 2000) : [],
    videoNotes: input.videoNotes && typeof input.videoNotes === 'object' && !Array.isArray(input.videoNotes) ? Object.fromEntries(Object.entries(input.videoNotes).filter(([id, text]) => /^[\w-]{11}$/.test(id) && typeof text === 'string').slice(0, 2000).map(([id, text]) => [id, text.slice(0, 10000)])) : {},
    videoPositions: validVideoPositions(input.videoPositions),
    timestampNotes: validTimestampNotes(input.timestampNotes),
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

export function validVideoPositions(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([id, seconds]) => /^[\w-]{11}$/.test(id) && typeof seconds === 'number' && Number.isFinite(seconds) && seconds >= 0 && seconds <= 86400).slice(0, 2000).map(([id, seconds]) => [id, Math.floor(seconds as number)]));
}
export function validTimestampNotes(value: unknown): LearnerState['timestampNotes'] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  let remaining = 1000;
  return Object.fromEntries(Object.entries(value).filter(([id, notes]) => /^[\w-]{11}$/.test(id) && Array.isArray(notes)).slice(0, 2000).map(([id, notes]) => {
    const valid = (notes as unknown[]).filter((note): note is LearnerState['timestampNotes'][string][number] => {
      if (!note || typeof note !== 'object') return false;
      const n = note as Record<string, unknown>;
      return typeof n.id === 'string' && n.id.length <= 80 && typeof n.seconds === 'number' && Number.isFinite(n.seconds) && n.seconds >= 0 && n.seconds <= 86400 && typeof n.text === 'string' && n.text.trim().length > 0;
    }).slice(0, Math.min(100, remaining)).map(n => ({ id: n.id, seconds: Math.floor(n.seconds), text: n.text.slice(0, 2000) }));
    remaining -= valid.length;
    return [id, valid];
  }));
}
