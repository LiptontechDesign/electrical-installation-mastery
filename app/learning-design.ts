import type { AssessmentQuestion } from './assessment-data';

export type Retrieval = { prompt: string; answer: string; why: string; distinction?: string; workingTex?: string };
export type Misconception = { diagnosis: string; partlyRight?: string; repair: string };
export type QuestionDesign = {
  objective: string;
  principle: string;
  why: string;
  distinction?: string;
  keyIdea: string;
  practice: string;
  workingTex?: string;
  followUp?: Retrieval;
  diagnostics: (Misconception | null)[];
  authorNote: string;
};

/** Reorder the option and its diagnosis together; never infer feedback from a letter. */
export function reorderQuestion(question: AssessmentQuestion, order: number[]): AssessmentQuestion {
  if (order.length !== question.options.length || new Set(order).size !== order.length || order.some(index => index < 0 || index >= order.length)) throw new Error('Invalid answer order');
  return {
    ...question,
    options: order.map(index => question.options[index]),
    answer: order.indexOf(question.answer),
    feedback: question.feedback && order.map(index => question.feedback![index]),
    design: question.design && { ...question.design, diagnostics: order.map(index => question.design!.diagnostics[index]) },
  };
}

export function shuffleQuestion(question: AssessmentQuestion, attempt = 0): AssessmentQuestion {
  // Stable server/client output; each attempt gets a different permutation.
  let seed = 2166136261;
  for (const char of `${question.id}:${attempt}`) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619);
  const random = () => {
    seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
    return (seed >>> 0) / 4294967296;
  };
  const order = question.options.map((_, index) => index);
  for (let index = order.length - 1; index > 0; index--) {
    const selected = Math.floor(random() * (index + 1));
    [order[index], order[selected]] = [order[selected], order[index]];
  }
  return reorderQuestion(question, order);
}
