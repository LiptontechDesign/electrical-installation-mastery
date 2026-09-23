import catalog from './video-catalog.json';

const lessonById = new Map(catalog.modules.flatMap(module => module.lessons.map(lesson => [lesson.id, lesson] as const)));
export function lessonStudyRole(id: string) {
  return lessonById.get(id)?.studyRole ?? 'Core lesson';
}
export function isRequiredLesson(id: string) {
  return lessonById.get(id)?.required ?? true;
}
export default catalog;
