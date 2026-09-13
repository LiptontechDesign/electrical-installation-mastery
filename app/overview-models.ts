import type { BookId } from './books-data';

export type LearningSection = {
  id: string; moduleId: string; number: number; title: string;
  throughLessonId: string; lessonIds: string[]; recapKey: string; authoredRecap: boolean;
};

export type SourceAuthority = 'primary-current' | 'current-technical' | 'supporting-explanation' | 'historical-context';
export type KenyaStatus = 'kenya-verified' | 'bs7671-technical-baseline' | 'check-kenyan-requirement';
export type SourceReference = {
  id: string;
  sourceType: 'kenya-law' | 'epra' | 'kebs' | 'bs7671' | 'on-site-guide' | 'eca-guide' | 'manufacturer' | 'specialist' | 'video-transcript' | 'course';
  title: string; organisation?: string; edition?: string; section?: string;
  authority: SourceAuthority;
  status: 'verified' | 'needs-verification' | 'historical' | 'draft';
  kenyaStatus: KenyaStatus;
  url?: string; bookId?: BookId;
  /** Bibliographic label, including Roman numerals or ranges. Never a reader offset. */
  printedPage?: string;
  /** One-based page in the exact supplied reader asset. No inferred offsets. */
  pdfPage?: number;
  mapping?: { status: 'exact'; evidence: string; verifiedAt: string };
  verification?: { evidence: string; verifiedAt: string };
};

export type CanonicalTerm = {
  id: string; term: string; aliases: string[];
  authority: 'formal-definition-verified' | 'current-standards-meaning' | 'explanatory-definition' | 'historical-explanation';
  editorialStatus: 'preserved' | 'reviewed';
  standardsMeaning: string; plainMeaning: string; practicalExample?: string;
  notTheSameAs: { termId: string; distinction: string }[];
  relatedTermIds: string[]; sourceIds: string[]; formulaIds: string[];
  stageIds: string[]; sectionIds: string[]; lessonIds: string[];
  kenyaStatus: KenyaStatus;
  explainAloud?: string;
  formalDefinitionEvidence?: { sourceId: string; section: string; verifiedAt: string };
};

export const overviewPages = ['system-model', 'definitions', 'relationships', 'engineering-rules', 'application', 'verification', 'common-confusions', 'sources'] as const;
export type OverviewPageId = typeof overviewPages[number];
export type OverviewBlock =
  | { kind: 'prose'; title: string; paragraphs: string[]; sourceIds: string[] }
  | { kind: 'table'; title: string; columns: string[]; rows: string[][]; sourceIds: string[] }
  | { kind: 'flow'; title: string; steps: string[]; sourceIds: string[] }
  | { kind: 'formula'; formulaId: string }
  | { kind: 'verification'; title: string; purpose: string; safeState: string; instrument: string; method: string[]; expected: string; abnormal: string; nextAction: string; sourceIds: string[] };
export type OverviewFormula = {
  id: string; expression: string; assumptions: string[];
  variables: { symbol: string; meaning: string; unit: string; termId?: string }[];
  sourceIds: string[];
};
/** Extends, rather than replaces, the stable course learning-section grouping. */
export type OverviewSection = {
  id: string; stageId: string; moduleId: string; learningSectionIds: string[];
  title: string; status: 'fixture' | 'reviewed'; lessonIds: string[];
  termIds: string[]; sourceIds: string[];
  relatedSectionIds: string[]; prerequisiteSectionIds: string[];
  pages: Record<OverviewPageId, OverviewBlock[]>;
  coverage: { competency: string; referenceIds: string[]; teachingPage: OverviewPageId }[];
};
export type OverviewDataset = {
  sources: SourceReference[]; terms: CanonicalTerm[];
  formulas: OverviewFormula[]; sections: OverviewSection[];
};
