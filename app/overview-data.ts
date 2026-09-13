import { canonicalTerms, type PreservedCanonicalTerm } from './standards-terms';
import { sourceReferences } from './source-references';
import { c201AdditionalTerms, c201Formulas, c201Sections, c201TermPatches } from './c2-01-overview';
import { c202AdditionalTerms, c202Formulas, c202Sections, c202TermPatches } from './c2-02-overview';
import { c203AdditionalTerms, c203Formulas, c203Sections, c203TermPatches } from './c2-03-overview';
import type { OverviewDataset } from './overview-models';

const patchEntries = new Map([
  ...Object.entries(c201TermPatches),
  ...Object.entries(c202TermPatches),
  ...Object.entries(c203TermPatches),
]);
export const overviewTerms: PreservedCanonicalTerm[] = [
  ...canonicalTerms.map(term => ({ ...term, ...(patchEntries.get(term.id) ?? {}) })),
  ...c201AdditionalTerms,
  ...c202AdditionalTerms,
  ...c203AdditionalTerms,
];

export const overviewData: OverviewDataset = {
  sources: sourceReferences,
  terms: overviewTerms,
  formulas: [...c201Formulas, ...c202Formulas, ...c203Formulas],
  sections: [...c201Sections, ...c202Sections, ...c203Sections],
};

export const overviewSectionById = new Map(overviewData.sections.map(section => [section.id, section]));
export function overviewSectionForLesson(lessonId: string) {
  return overviewData.sections.find(section => section.lessonIds.includes(lessonId));
}
