import type { PaperPath } from './sources';
export type KeyTerm = { term: string; meaning: string; definitionId?: string };
export type PaperOccurrence = { paperId: string; reference: string };
export type PaperQuestion = {
  id: string; paths: PaperPath[]; topic: string; title: string; prompt: string;
  breakdown: string[]; terms: KeyTerm[]; answer: string; check: string[];
  referenceIds: string[]; occurrences: PaperOccurrence[]; diagram?: string;
};
export function question(id: string, paths: PaperPath[], topic: string, title: string, prompt: string, breakdown: string[], terms: string[], answer: string, check: string[], referenceIds: string[] = [], diagram?: string): PaperQuestion {
  return { id, paths, topic, title, prompt, breakdown, terms: terms.map(value => { const [term, meaning, definitionId] = value.split('|'); return { term, meaning, ...(definitionId ? { definitionId } : {}) }; }), answer, check, referenceIds, occurrences: [], ...(diagram ? { diagram } : {}) };
}
