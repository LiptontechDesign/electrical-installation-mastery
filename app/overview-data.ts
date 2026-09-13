import { canonicalTerms, type PreservedCanonicalTerm } from './standards-terms';
import { sourceReferences } from './source-references';
import { c201AdditionalTerms, c201Formulas, c201Sections, c201TermPatches } from './c2-01-overview';
import { c202AdditionalTerms, c202Formulas, c202Sections, c202TermPatches } from './c2-02-overview';
import { c203AdditionalTerms, c203Formulas, c203Sections, c203TermPatches } from './c2-03-overview';
import { c204AdditionalTerms, c204Formulas, c204Sections, c204TermPatches } from './c2-04-overview';
import { c204SourceReferences } from './c2-04-sources';
import { c205AdditionalTerms, c205Formulas, c205Sections, c205TermPatches } from './c2-05-overview';
import { c205SourceReferences } from './c2-05-sources';
import { c206AdditionalTerms, c206Formulas, c206Sections, c206TermPatches } from './c2-06-overview';
import { c206SourceReferences } from './c2-06-sources';
import { c207AdditionalTerms, c207Formulas, c207Sections, c207TermPatches } from './c2-07-overview';
import { c207SourceReferences } from './c2-07-sources';
import { c208AdditionalTerms, c208Formulas, c208Sections, c208TermPatches } from './c2-08-overview';
import { c208SourceReferences } from './c2-08-sources';
import { c209AdditionalTerms, c209Formulas, c209Sections, c209TermPatches } from './c2-09-overview';
import { c209SourceReferences } from './c2-09-sources';
import type { OverviewDataset } from './overview-models';

const patchEntries = new Map([
  ...Object.entries(c201TermPatches),
  ...Object.entries(c202TermPatches),
  ...Object.entries(c203TermPatches),
  ...Object.entries(c204TermPatches),
  ...Object.entries(c205TermPatches),
  ...Object.entries(c206TermPatches),
  ...Object.entries(c207TermPatches),
  ...Object.entries(c208TermPatches),
  ...Object.entries(c209TermPatches),
]);
export const overviewTerms: PreservedCanonicalTerm[] = [
  ...canonicalTerms.map(term => {
    const composed = { ...term, ...(patchEntries.get(term.id) ?? {}) };
    return { ...composed, definition: composed.standardsMeaning };
  }),
  ...c201AdditionalTerms,
  ...c202AdditionalTerms,
  ...c203AdditionalTerms,
  ...c204AdditionalTerms,
  ...c205AdditionalTerms,
  ...c206AdditionalTerms,
  ...c207AdditionalTerms,
  ...c208AdditionalTerms,
  ...c209AdditionalTerms,
];

export const overviewData: OverviewDataset = {
  sources: [...sourceReferences, ...c204SourceReferences, ...c205SourceReferences, ...c206SourceReferences, ...c207SourceReferences, ...c208SourceReferences, ...c209SourceReferences],
  terms: overviewTerms,
  formulas: [...c201Formulas, ...c202Formulas, ...c203Formulas, ...c204Formulas, ...c205Formulas, ...c206Formulas, ...c207Formulas, ...c208Formulas, ...c209Formulas],
  sections: [...c201Sections, ...c202Sections, ...c203Sections, ...c204Sections, ...c205Sections, ...c206Sections, ...c207Sections, ...c208Sections, ...c209Sections],
};

export const overviewSectionById = new Map(overviewData.sections.map(section => [section.id, section]));
export function overviewSectionForLesson(lessonId: string) {
  return overviewData.sections.find(section => section.lessonIds.includes(lessonId));
}
