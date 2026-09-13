import { canonicalTerms, type PreservedCanonicalTerm } from './standards-terms';
import { sourceReferences } from './source-references';
import { c201AdditionalTerms, c201Formulas, c201Sections, c201TermPatches } from './c2-01-overview';
import type { OverviewDataset } from './overview-models';

const patchEntries = new Map(Object.entries(c201TermPatches));
export const overviewTerms: PreservedCanonicalTerm[] = [
  ...canonicalTerms.map(term => ({ ...term, ...(patchEntries.get(term.id) ?? {}) })),
  ...c201AdditionalTerms,
];

export const overviewData: OverviewDataset = {
  sources: sourceReferences,
  terms: overviewTerms,
  formulas: c201Formulas,
  sections: c201Sections,
};

export const overviewSectionById = new Map(overviewData.sections.map(section => [section.id, section]));
export function overviewSectionForLesson(lessonId: string) {
  return overviewData.sections.find(section => section.lessonIds.includes(lessonId));
}
