import { canonicalTerms, type PreservedCanonicalTerm } from './standards-terms';
import { sourceReferences } from './source-references';
import { c201AdditionalTerms, c201Formulas, c201Sections, c201TermPatches } from './c2-01-overview';
import { c202AdditionalTerms, c202Formulas, c202Sections, c202TermPatches } from './c2-02-overview';
import { c203AdditionalTerms, c203Formulas, c203Sections, c203TermPatches } from './c2-03-overview';
import { c204AdditionalTerms, c204Formulas, c204Sections, c204TermPatches } from './c2-04-overview';
import { c204SourceReferences } from './c2-04-sources';
import { c205AdditionalTerms, c205Formulas, c205Sections, c205TermPatches } from './c2-05-overview';
import { c205SourceReferences } from './c2-05-sources';
import type { OverviewDataset } from './overview-models';

const patchEntries = new Map([
  ...Object.entries(c201TermPatches),
  ...Object.entries(c202TermPatches),
  ...Object.entries(c203TermPatches),
  ...Object.entries(c204TermPatches),
  ...Object.entries(c205TermPatches),
]);
export const overviewTerms: PreservedCanonicalTerm[] = [
  ...canonicalTerms.map(term => {
    const composed = { ...term, ...(patchEntries.get(term.id) ?? {}) };
    // `definition` is the compatibility field used by legacy glossary/search consumers.
    // Keep it synchronized with the canonical standardsMeaning after editorial patches.
    return { ...composed, definition: composed.standardsMeaning };
  }),
  ...c201AdditionalTerms,
  ...c202AdditionalTerms,
  ...c203AdditionalTerms,
  ...c204AdditionalTerms,
  ...c205AdditionalTerms,
];

export const overviewData: OverviewDataset = {
  sources: [...sourceReferences, ...c204SourceReferences, ...c205SourceReferences],
  terms: overviewTerms,
  formulas: [...c201Formulas, ...c202Formulas, ...c203Formulas, ...c204Formulas, ...c205Formulas],
  sections: [...c201Sections, ...c202Sections, ...c203Sections, ...c204Sections, ...c205Sections],
};

export const overviewSectionById = new Map(overviewData.sections.map(section => [section.id, section]));
export function overviewSectionForLesson(lessonId: string) {
  return overviewData.sections.find(section => section.lessonIds.includes(lessonId));
}
