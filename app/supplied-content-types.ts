import type { Retrieval } from './learning-design';

export type AuthoredItem = {
  prompt: string;
  correct: string;
  wrong: string[];
  errors: string[];
  why: string;
  recall: { prompt: string; answer: string };
};
export type SuppliedTeaching = {
  model: string;
  ideas: string[];
  practice: string;
  retrieval: Retrieval;
  questions: AuthoredItem[];
  note?: string;
};

// Serialization helpers only: every stem, choice, diagnostic and retrieval
// answer below is explicitly authored, never inferred from a lesson sentence.
export function Q(prompt: string, choices: string, errors: string, why: string, front: string, back: string): AuthoredItem {
  const [correct, ...wrong] = choices.split('|');
  const diagnoses = errors.split('|');
  if (wrong.length !== 3 || diagnoses.length !== 3) throw new Error(`Incomplete authored item: ${prompt}`);
  return { prompt, correct, wrong, errors: diagnoses, why, recall: { prompt: front, answer: back } };
}
export function S(model: string, ideas: string[], practice: string, prompt: string, answer: string, why: string, questions: AuthoredItem[], note?: string): SuppliedTeaching {
  if (ideas.length !== 3 || questions.length !== 5) throw new Error(`Incomplete teaching: ${model}`);
  return { model, ideas, practice, retrieval: { prompt, answer, why }, questions, note };
}
