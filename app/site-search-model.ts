import course from './course-curriculum';
import definitions from './practice/definitions.json';
import { definitionLearningNotes, guideReferences } from './practice/definition-learning-notes';
import { termsInDefinition } from './practice/definition-explanations';

export type SearchLesson = { id: string; kind: 'Video lesson' | 'Supplementary video'; title: string; subtitle: string; searchable: string };
export type SearchEntry = Omit<SearchLesson, 'kind'> & { kind: SearchLesson['kind'] | 'Definition'; aliases?: string[] };
export const publicSearchLessons: SearchLesson[] = course.modules.flatMap(module => module.lessons.map(lesson => ({
  id: lesson.id, kind: 'Video lesson', title: lesson.title,
  subtitle: `Module ${String(module.number).padStart(2, '0')} · ${module.title} · Lesson ${String(lesson.number).padStart(2, '0')}`,
  searchable: `${lesson.title} ${lesson.topic} ${lesson.instructor} ${module.title}`,
})));

export const searchDefinitions: SearchEntry[] = definitions.map(entry => {
  const learning = definitionLearningNotes[entry.id];
  const guide = learning?.guide ? guideReferences[learning.guide] : null;
  const body = [entry.definition, learning?.meaning, learning?.remember, learning?.guideDetail, guide?.summary].filter(Boolean).join(' ');
  return { id: entry.id, kind: 'Definition', title: entry.term.replace(/, \{\d+\}$/, ''), subtitle: entry.category, aliases: entry.aliases,
    searchable: [entry.term, ...entry.aliases, entry.category, body, ...termsInDefinition(entry.term, body).map(item => item.label)].join(' ') };
});

export function normalizeSearch(value: string) {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[–—]/g, '-').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

export function findSearchResults(entries: SearchEntry[], query: string) {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  const words = normalized.split(/\s+/);
  return entries.map(entry => {
    const title = normalizeSearch(entry.title);
    const aliases = (entry.aliases ?? []).map(normalizeSearch);
    const matches = words.every(word => normalizeSearch(entry.searchable).includes(word));
    const score = title === normalized || aliases.includes(normalized) ? 0 : title.startsWith(normalized) ? 1 : words.every(word => title.includes(word)) ? 2 : 3;
    return { entry, matches, score };
  }).filter(item => item.matches).sort((a, b) => a.score - b.score || a.entry.title.localeCompare(b.entry.title)).map(item => item.entry);
}
