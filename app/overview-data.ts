import { canonicalTerms } from './standards-terms';
import { sourceReferences } from './source-references';
import type { OverviewDataset } from './overview-models';

// Section 1 intentionally has no authored stage content. A fixture belongs in tests,
// not in the learner's curriculum. Later stages add reviewed sections here.
export const overviewData: OverviewDataset = {
  sources: sourceReferences, terms: canonicalTerms, formulas: [], sections: [],
};

export const overviewSectionById = new Map(overviewData.sections.map(section => [section.id, section]));
export function overviewSectionForLesson(lessonId: string) {
  return overviewData.sections.find(section => section.lessonIds.includes(lessonId));
}
