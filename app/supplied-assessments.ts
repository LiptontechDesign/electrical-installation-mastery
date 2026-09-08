import type { AssessmentQuestion, Flashcard, LessonAssessment } from './assessment-data';
import { suppliedTeaching } from './supplied-lessons';
import { shuffleQuestion } from './learning-design';

export function suppliedAssessment(lesson: { id: string; title: string }, moduleId: string): LessonAssessment | undefined {
  const source = suppliedTeaching[lesson.id];
  if (!source) return undefined;
  const identity = { lessonId: lesson.id, lessonTitle: lesson.title, moduleId };
  const questions: AssessmentQuestion[] = source.questions.map((item, i) => {
    const id = `${lesson.id}-q-concept-${i + 1}`;
    return shuffleQuestion({
      ...identity, id, cardId: `${lesson.id}-concept-${i + 1}`, prompt: item.prompt,
      options: [item.correct, ...item.wrong], answer: 0, kind: i < 2 ? 'Recall' : 'Application',
      explanation: item.correct, feedback: [item.why, ...item.errors],
      teaching: { reasoning: item.why, application: source.practice },
      design: {
        objective: item.prompt, principle: item.correct, why: item.why, keyIdea: item.recall.answer,
        practice: source.practice, followUp: { ...item.recall, why: item.why },
        diagnostics: [null, ...item.errors.map(diagnosis => ({ diagnosis, repair: item.why }))],
        authorNote: 'Question-level teaching design authored from the supplied transcript: distinct misconception choices and an independent retrieval prompt. ' + (source.note ?? ''),
      },
    });
  });
  const flashcards: Flashcard[] = source.questions.map((item, i) => ({
    ...identity, id: `${lesson.id}-concept-${i + 1}`, kind: i < 2 ? 'Core idea' : 'Application',
    // These are independent retrieval items. Do not attach the MCQ's working:
    // its numbers or direction of reasoning may differ from this card's.
    front: item.recall.prompt, back: item.recall.answer,
  }));
  flashcards.push({ ...identity, id: `${lesson.id}-overview-retrieval`, kind: 'Application', front: source.retrieval.prompt, back: source.retrieval.answer });
  return { lessonId: lesson.id, moduleId, questions, flashcards };
}
