export type EvidenceDimension = 'application' | 'standards' | 'diagnosis';
export type LearningEvidence = {
  id: string; lessonId: string; conceptId: string; activityId: string;
  dimension: EvidenceDimension; correct: boolean; assisted: boolean;
  at: string; misconception?: string;
};
export type EvidenceInput = Omit<LearningEvidence, 'id' | 'at'>;
export const dimensionLabels: Record<EvidenceDimension, string> = {
  application: 'Calculation reasoning', standards: 'Standards reasoning', diagnosis: 'Fault diagnosis',
};
export function validEvidence(value: unknown, lessonIds: Set<string>): LearningEvidence[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  return value.filter((item): item is LearningEvidence => {
    if (!item || typeof item !== 'object' || typeof item.id !== 'string' || seen.has(item.id)
      || !lessonIds.has(item.lessonId) || typeof item.conceptId !== 'string' || !item.conceptId
      || typeof item.activityId !== 'string' || !Object.hasOwn(dimensionLabels, item.dimension)
      || typeof item.correct !== 'boolean' || typeof item.assisted !== 'boolean'
      || typeof item.at !== 'string' || !Number.isFinite(Date.parse(item.at))
      || Date.parse(item.at) > Date.now() + 86400000) return false;
    seen.add(item.id); return true;
  }).slice(-4000).map(item => ({ ...item, misconception: typeof item.misconception === 'string' ? item.misconception.slice(0, 300) : undefined }));
}
export function appendEvidence(events: LearningEvidence[], input: EvidenceInput, at = new Date().toISOString()): LearningEvidence[] {
  const repeatedToday = events.some(event => event.lessonId === input.lessonId && event.activityId === input.activityId && calendarDay(new Date(event.at)) === calendarDay(new Date(at)));
  return [...events, { ...input, assisted: input.assisted || repeatedToday, at, id: `${at}-${events.length}-${input.activityId}` }].slice(-4000);
}
export function calendarDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function isProgressBackup(value: unknown, lessonIds: Set<string>): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const input = value as Record<string, unknown>;
  return Array.isArray(input.completedLessonIds) && typeof input.activeLessonId === 'string'
    && lessonIds.has(input.activeLessonId) && (input.schemaVersion === undefined || (typeof input.schemaVersion === 'number' && Number.isInteger(input.schemaVersion) && input.schemaVersion >= 1 && input.schemaVersion <= 7));
}
