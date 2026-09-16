import choiceBankJson from './assessment-choice-bank.json';
import assessmentBankJson from './assessment-bank.json';

export type AssessmentChoice = {
  id: string;
  text: string;
  feedback: string;
  isCorrect: boolean;
};

export type AssessmentChoiceSet = {
  questionId: string;
  correctOption: string;
  objective: string;
  foundation: string;
  workedMethod?: string;
  directAnswer?: string;
  reasoning?: string;
  options: AssessmentChoice[];
};

export type AssessmentChoiceBank = {
  schemaVersion: number;
  questions: AssessmentChoiceSet[];
};

type AssessmentEvidence = {
  id: string;
  pathway: 'C2' | 'C1';
  title: string;
  prompt: string;
  answer: string;
  markingPoints: { criterion: string; marks: number }[];
  sourceLessonIds?: string[];
};

const assessmentEvidenceById = new Map(
  (assessmentBankJson.questions as AssessmentEvidence[]).map(question => [question.id, question]),
);

const clean = (value = '') => value
  .replace(/\*\*/g, '')
  .replace(/`/g, '')
  .replace(/^#{1,6}\s+/gm, '')
  .replace(/^[-*]\s+/gm, '')
  .replace(/\s+/g, ' ')
  .trim();

const sentences = (value = '') => clean(value)
  .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
  .map(item => item.trim())
  .filter(Boolean);

const normalized = (value = '') => clean(value)
  .toLocaleLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

function concise(value: string, max = 420) {
  const text = clean(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

function evidenceReason(question: AssessmentEvidence) {
  const criteria = question.markingPoints
    .map(point => concise(point.criterion, 220))
    .filter(Boolean);
  if (criteria.length >= 2) {
    return `The decisive points are ${criteria[0].replace(/[.;:,]+$/, '')}; then ${criteria[1].replace(/[.;:,]+$/, '')}.`;
  }
  if (criteria.length === 1) {
    return `The deciding point is ${criteria[0].replace(/[.;:,]+$/, '')}.`;
  }
  const lead = sentences(question.answer)[0];
  return lead ? concise(lead, 320) : `Apply the electrical condition stated in “${question.title}” directly.`;
}

function nonRepeatedFeedback(feedback: string, foundation: string, answer: string) {
  const blocked = [...sentences(foundation), ...sentences(answer)].map(normalized).filter(Boolean);
  const kept = sentences(feedback).filter(line => {
    const key = normalized(line);
    if (!key) return false;
    return !blocked.some(block => block === key || (block.length > 80 && (block.includes(key) || key.includes(block))));
  });
  return concise(kept.slice(0, 2).join(' '), 420);
}

function refineC1ChoiceSet(choiceSet: AssessmentChoiceSet): AssessmentChoiceSet {
  const question = assessmentEvidenceById.get(choiceSet.questionId);
  if (!question || question.pathway !== 'C1') return choiceSet;

  const correctChoice = choiceSet.options.find(option => option.id === choiceSet.correctOption)
    ?? choiceSet.options.find(option => option.isCorrect);
  if (!correctChoice) return choiceSet;

  const directAnswer = `Correct answer: ${correctChoice.id} — ${clean(correctChoice.text)}`;
  const reasoning = evidenceReason(question);
  const options = choiceSet.options.map(option => {
    if (option.isCorrect) {
      return {
        ...option,
        feedback: `This option gives the complete response required by “${question.title}”.`,
      };
    }

    const misconception = nonRepeatedFeedback(option.feedback, choiceSet.foundation, question.answer)
      || `This option does not satisfy the electrical condition tested in “${question.title}”.`;
    return { ...option, feedback: misconception };
  });

  return {
    ...choiceSet,
    directAnswer,
    reasoning,
    options,
  };
}

const rawChoiceBank = choiceBankJson as AssessmentChoiceBank;

export const assessmentChoiceBank: AssessmentChoiceBank = {
  ...rawChoiceBank,
  questions: rawChoiceBank.questions.map(refineC1ChoiceSet),
};

export const assessmentChoiceById = new Map(
  assessmentChoiceBank.questions.map(question => [question.questionId, question]),
);
