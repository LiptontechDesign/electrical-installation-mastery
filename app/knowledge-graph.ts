import course from './course-curriculum';
import { lessonGuides } from './lesson-guides';
import { canonicalTerms } from './standards-terms';
export type { KnowledgeTerm } from './standards-terms';
// Compatibility view: glossary/search/lesson consumers share the canonical records.
export const electricalTerms = canonicalTerms;

const normalize = (value: string) => value.toLowerCase().replace(/[–—−]/g, '-');
function containsTerm(text: string, value: string) {
  // The protective-device symbol In must not match the ordinary word “in”.
  if (value === 'In') return /(^|[^a-zA-Z0-9])In([^a-zA-Z0-9]|$)/.test(text);
  const escaped = normalize(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^a-z0-9])${escaped}([^a-z0-9]|$)`, 'i').test(normalize(text));
}
export const lessons = course.modules.flatMap(module => module.lessons);
export const lessonById = new Map(lessons.map(lesson => [lesson.id, lesson]));
export const lessonKnowledge = Object.fromEntries(lessons.map(lesson => {
  const guide = lessonGuides[lesson.id];
  const content = `${lesson.title} ${guide.summary} ${guide.keyConcepts.join(' ')}`;
  const terms = electricalTerms.filter(item => [item.term,...item.aliases].some(alias => containsTerm(content, alias)));
  const prerequisites = [...new Set((lesson.prerequisite.match(/p\d{2}-(?:v\d+-l\d{2}|l\d{2}|[a-z]+(?:-[a-z]+)*)/gi) ?? []).map(id => id.toLowerCase()))].filter(id => id !== lesson.id && lessonById.has(id));
  return [lesson.id, { terms, prerequisites, concepts: guide.keyConcepts.map((statement, index) => ({ id: `${lesson.id}-concept-${index + 1}`, statement })), source: 'Existing lesson guide' }];
}));
export const lessonsForTerm = (name: string) => lessons.filter(lesson => lessonKnowledge[lesson.id].terms.some(item => item.term === name));
export function matchingTerms(query: string) {
  const value = normalize(query).trim();
  return electricalTerms.filter(item => normalize(`${item.term} ${item.aliases.join(' ')} ${item.definition}`).includes(value))
    .sort((a,b) => Number(normalize(b.term) === value) - Number(normalize(a.term) === value));
}
