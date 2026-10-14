import catalog from './video-catalog.json';
import roles from './c1-study-roles.json';

const supportingRoles: Record<string, { required: boolean; studyRole: string; studyNote: string }> = roles;

const lessonById = new Map(catalog.modules.flatMap(module => module.lessons.map(lesson => [lesson.id, lesson] as const)));
export function lessonStudyRole(id: string) {
  return lessonById.get(id)?.studyRole ?? 'Core lesson';
}
export function isRequiredLesson(id: string) {
  return lessonById.get(id)?.required ?? true;
}
// Essential bundled resources retain supplementary IDs and progress storage.
// Unrecognised personal additions remain optional.
export function isRequiredStudyVideo(id: string) {
  return lessonById.has(id) ? isRequiredLesson(id) : supportingRoles[id]?.required ?? false;
}
export function studyVideoRole(id: string) {
  return lessonById.has(id) ? lessonStudyRole(id) : supportingRoles[id]?.studyRole ?? 'Supplementary';
}
export function studyNoteFor(id: string) {
  const lesson = lessonById.get(id) as { studyNote?: string } | undefined;
  return lesson?.studyNote ?? supportingRoles[id]?.studyNote;
}
export default catalog;
