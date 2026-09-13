export type LearningExplanation = { prompt: string; answer: string; why: string; distinction?: string; workingTex?: string };
export type SuppliedTeaching = {
  model: string; ideas: string[]; practice: string; retrieval: LearningExplanation;
  explanations: { principle: string; reasoning: string }[]; note?: string;
};
