import originalCourse from './course-curriculum';
import { learningSections } from './learning-sections';
import { formatStudyDuration } from './course-duration';
import type { SupplementaryVideo } from './supplementary-model';
import { curriculumRevision, upgradePublishedGroups } from './curriculum-placement-update';

export function relocateSupportingVideos(videos: SupplementaryVideo[], course: typeof originalCourse) {
  const locations = new Map([...learningSections.map(s => [s.id, s.moduleId] as const), ...course.modules.flatMap(m => m.lessons.map(l => [l.id, m.id] as const))]);
  const lookup = new Map(videos.map(v => [v.id, v]));
  return videos.map(video => {
    let anchor = video.anchorId;
    const seen = new Set<string>();
    while (!locations.has(anchor) && lookup.has(anchor) && !seen.has(anchor)) {
      seen.add(anchor); anchor = lookup.get(anchor)!.anchorId;
    }
    return { ...video, moduleId: locations.get(anchor) ?? video.moduleId };
  });
}

export type CourseOrder = { version: 1; revision: number; groups: Record<string, string[]>; excludedLessonIds?: string[]; curriculumRevision?: number };
export type LessonMove = { lessonId: string; sectionId: string; beforeId: string | null };
export const defaultOrder: CourseOrder = { version: 1, revision: 0, groups: {}, curriculumRevision };
const lessonIds = new Set(originalCourse.modules.flatMap(m => m.lessons.map(l => l.id)));

// Keep empty sections available as destinations. Newly published lessons join
// before their next authored neighbour; existing saved placements always win.
export function orderedSections(order: CourseOrder) {
  const upgraded = upgradePublishedGroups(order.groups, order.curriculumRevision);
  const excluded = new Set(order.excludedLessonIds ?? []);
  const seen = new Set<string>();
  const groups = learningSections.map(section => ({ ...section, lessonIds: (upgraded[section.id] ?? [])
    .filter(id => { if (!lessonIds.has(id) || excluded.has(id) || seen.has(id)) return false; seen.add(id); return true; }) }));
  for (const section of learningSections) {
    const group = groups.find(g => g.id === section.id)!;
    section.lessonIds.forEach((id, index) => {
      if (excluded.has(id) || seen.has(id)) return;
      const nextId = section.lessonIds.slice(index + 1).find(next => group.lessonIds.includes(next));
      group.lessonIds.splice(nextId ? group.lessonIds.indexOf(nextId) : group.lessonIds.length, 0, id);
      seen.add(id);
    });
  }
  return groups;
}

export function parseOrder(value: unknown): CourseOrder {
  if (!value || typeof value !== 'object') throw new Error('Invalid course order');
  const order = value as CourseOrder;
  if (order.version !== 1 || !Number.isSafeInteger(order.revision) || order.revision < 0 || !order.groups || typeof order.groups !== 'object' || Array.isArray(order.groups)) throw new Error('Invalid course order');
  if (order.curriculumRevision !== undefined && (!Number.isSafeInteger(order.curriculumRevision) || order.curriculumRevision < 0)) throw new Error('Invalid curriculum revision');
  const ids = Object.values(order.groups).flat();
  if (order.excludedLessonIds !== undefined && (!Array.isArray(order.excludedLessonIds) || !order.excludedLessonIds.every(id => typeof id === 'string'))) throw new Error('Invalid course order');
  if (!Object.values(order.groups).every(ids => Array.isArray(ids) && ids.every(id => typeof id === 'string')) || new Set(ids).size !== ids.length) throw new Error('Invalid course order');
  return order;
}

export function moveLesson(order: CourseOrder, move: LessonMove): CourseOrder {
  if (!lessonIds.has(move.lessonId)) throw new Error('This lesson no longer exists. Refresh the course.');
  const sections = orderedSections(order);
  const destination = sections.find(s => s.id === move.sectionId);
  if (!destination) throw new Error('Choose a destination section.');
  for (const group of sections) group.lessonIds = group.lessonIds.filter(id => id !== move.lessonId);
  const index = move.beforeId === null ? destination.lessonIds.length : destination.lessonIds.indexOf(move.beforeId);
  if (index < 0) throw new Error('The destination changed. Choose the position again.');
  destination.lessonIds.splice(index, 0, move.lessonId);
  return { version: 1, revision: order.revision + 1, groups: Object.fromEntries(sections.map(s => [s.id, s.lessonIds])), curriculumRevision };
}

export function courseForOrder(order: CourseOrder) {
  const groups = orderedSections(order);
  const lookup = new Map(originalCourse.modules.flatMap(m => m.lessons).map(l => [l.id, l]));
  const modules = originalCourse.modules.map(m => {
    const lessons = groups.filter(s => s.moduleId === m.id).flatMap(s => s.lessonIds).map((id, i) => ({ ...lookup.get(id)!, number: i + 1 }));
    const durationSeconds = lessons.reduce((sum, l) => sum + l.durationSeconds, 0);
    return { ...m, lessons, durationSeconds, duration: formatStudyDuration(durationSeconds) };
  });
  const durationSeconds = modules.reduce((sum, m) => sum + m.durationSeconds, 0);
  return { course: { ...originalCourse, modules, lessonCount: modules.reduce((sum, m) => sum + m.lessons.length, 0), durationSeconds, duration: formatStudyDuration(durationSeconds) }, sectionsByModule: Object.fromEntries(modules.map(m => [m.id, groups.filter(s => s.moduleId === m.id)])) };
}
