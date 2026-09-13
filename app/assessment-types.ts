import bankJson from './assessment-bank.json';

export type AssessmentPath = 'C2' | 'C1';
export type AssessmentFormat = 'mcq' | 'definition' | 'short-answer' | 'comparison' | 'calculation' | 'diagram' | 'procedure' | 'fault-scenario' | 'design-scenario' | 'structured' | 'oral';
export type AssessmentCollection = 'stage' | 'specialist' | 'review' | 'mock' | 'diagram' | 'rapid' | 'oral';
export type MarkingPoint = { marks: number; criterion: string };
export type AssessmentQuestion = {
  id: string;
  pathway: AssessmentPath;
  sectionId: string;
  sectionTitle: string;
  collection: AssessmentCollection;
  format: AssessmentFormat;
  title: string;
  commandVerb: string;
  marks: number;
  expectedMinutes: number;
  prompt: string;
  options?: { id: string; text: string }[];
  correctOption?: string;
  answer: string;
  markingPoints: MarkingPoint[];
  competencyIds: string[];
  conceptIds: string[];
  sourceLessonIds: string[];
  prerequisiteIds: string[];
  moduleIds: string[];
  standardsRefs: string[];
  kenyaStatus: 'kenya-verified' | 'bs7671-technical-baseline' | 'check-kenyan-requirement';
  misconceptionTags: string[];
  sourceFile: string;
};
export type AssessmentBank = {
  schemaVersion: number;
  generatedAt: string;
  counts: Record<AssessmentPath, number>;
  sources: { pathway: AssessmentPath; fileName: string; sha256: string }[];
  questions: AssessmentQuestion[];
};

export const assessmentBank = bankJson as AssessmentBank;
export const assessmentQuestions = assessmentBank.questions;
