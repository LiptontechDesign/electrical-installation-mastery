import originalCourse from './course-curriculum';
import { learningSections } from './learning-sections';
import { formatStudyDuration } from './course-extension/builders';
import type { SupplementaryVideo } from './supplementary-model';

export function relocateSupportingVideos(videos: SupplementaryVideo[], course: typeof originalCourse) {
  const locations = new Map(course.modules.flatMap(m => m.lessons.map(l => [l.id, m.id] as const)));
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

export type CourseOrder = { version: 1; revision: number; groups: Record<string, string[]> };
export type LessonMove = { lessonId: string; sectionId: string; beforeId: string | null };
export const defaultOrder: CourseOrder = { version: 1, revision: 0, groups: {} };
const lessonIds = new Set(originalCourse.modules.flatMap(m => m.lessons.map(l => l.id)));

// Keep empty sections available as destinations. Newly published lessons join
// their authored section; saved moves always retain the original lesson IDs.
export function orderedSections(order: CourseOrder) {
  const seen = new Set<string>();
  const groups = learningSections.map(section => ({ ...section, lessonIds: (order.groups[section.id] ?? [])
    .filter(id => { if (!lessonIds.has(id) || seen.has(id)) return false; seen.add(id); return true; }) }));
  for (const section of learningSections) {
    const group = groups.find(g => g.id === section.id)!;
    for (const id of section.lessonIds) if (!seen.has(id)) { group.lessonIds.push(id); seen.add(id); }
  }
  return groups.map(group => ({ ...group, throughLessonId: group.lessonIds.at(-1) ?? '',
    authoredRecap: group.authoredRecap && JSON.stringify(group.lessonIds) === JSON.stringify(learningSections.find(s => s.id === group.id)!.lessonIds) }));
}

export function parseOrder(value: unknown): CourseOrder {
  if (!value || typeof value !== 'object') throw new Error('Invalid course order');
  const order = value as CourseOrder;
  if (order.version !== 1 || !Number.isSafeInteger(order.revision) || order.revision < 0 || !order.groups || typeof order.groups !== 'object' || Array.isArray(order.groups)) throw new Error('Invalid course order');
  const ids = Object.values(order.groups).flat();
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
  return { version: 1, revision: order.revision + 1, groups: Object.fromEntries(sections.map(s => [s.id, s.lessonIds])) };
}

export function courseForOrder(order: CourseOrder) {
  const groups = orderedSections(order);
  const lookup = new Map(originalCourse.modules.flatMap(m => m.lessons).map(l => [l.id, l]));
  const modules = originalCourse.modules.map(m => {
    const lessons = groups.filter(s => s.moduleId === m.id).flatMap(s => s.lessonIds).map((id, i) => ({ ...lookup.get(id)!, number: i + 1 }));
    const durationSeconds = lessons.reduce((sum, l) => sum + l.durationSeconds, 0);
    return { ...m, lessons, durationSeconds, duration: formatStudyDuration(durationSeconds) };
  });
  return { course: { ...originalCourse, modules }, sectionsByModule: Object.fromEntries(modules.map(m => [m.id, groups.filter(s => s.moduleId === m.id)])) };
}
