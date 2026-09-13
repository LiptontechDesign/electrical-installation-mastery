import choiceBankJson from './assessment-choice-bank.json';

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
  options: AssessmentChoice[];
};

export type AssessmentChoiceBank = {
  schemaVersion: number;
  questions: AssessmentChoiceSet[];
};

export const assessmentChoiceBank = choiceBankJson as AssessmentChoiceBank;
export const assessmentChoiceById = new Map(assessmentChoiceBank.questions.map(question => [question.questionId, question]));
