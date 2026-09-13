import { canonicalTerms, type PreservedCanonicalTerm } from './standards-terms';
import { sourceReferences } from './source-references';
import { c201AdditionalTerms, c201Formulas, c201Sections, c201TermPatches } from './c2-01-overview';
import { c202AdditionalTerms, c202Formulas, c202Sections, c202TermPatches } from './c2-02-overview';
import type { OverviewDataset } from './overview-models';

const patchEntries = new Map([
  ...Object.entries(c201TermPatches),
  ...Object.entries(c202TermPatches),
]);
export const overviewTerms: PreservedCanonicalTerm[] = [
  ...canonicalTerms.map(term => ({ ...term, ...(patchEntries.get(term.id) ?? {}) })),
  ...c201AdditionalTerms,
  ...c202AdditionalTerms,
];

export const overviewData: OverviewDataset = {
  sources: sourceReferences,
  terms: overviewTerms,
  formulas: [...c201Formulas, ...c202Formulas],
  sections: [...c201Sections, ...c202Sections],
};

export const overviewSectionById = new Map(overviewData.sections.map(section => [section.id, section]));
export function overviewSectionForLesson(lessonId: string) {
  return overviewData.sections.find(section => section.lessonIds.includes(lessonId));
}
