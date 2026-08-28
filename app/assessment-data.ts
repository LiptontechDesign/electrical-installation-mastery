import type { LessonGuide } from './lesson-guides';

export type Flashcard = {
  id: string;
  lessonId: string;
  moduleId: string;
  front: string;
  back: string;
  whyItMatters: string;
  kenyaNote?: string;
};

export type AssessmentQuestion = {
  id: string;
  lessonId: string;
  moduleId: string;
  cardId: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type LessonAssessment = {
  lessonId: string;
  moduleId: string;
  flashcards: Flashcard[];
  questions: AssessmentQuestion[];
};

export type ModuleAssessment = {
  moduleId: string;
  title: string;
  flashcards: Flashcard[];
  questions: AssessmentQuestion[];
};

type CourseLesson = {
  id: string;
  title: string;
  topic: string;
  regulationSensitive?: boolean;
  regulationStatus?: string;
};

type CourseModule = {
  id: string;
  title: string;
  lessons: readonly CourseLesson[];
};

const kenyaGuardrail = 'Apply the principle only after checking current Kenyan law, EPRA and utility requirements, applicable KS/IEC standards, the project specification and the equipment manufacturer’s instructions.';

function fallbackGuide(lesson: CourseLesson): LessonGuide {
  return {
    summary: `This lesson develops ${lesson.topic.toLocaleLowerCase()} and connects it to safe, complete electrical installation work.`,
    keyConcepts: [
      `Understand the purpose of ${lesson.topic.toLocaleLowerCase()}.`,
      'Relate the component or method to the complete circuit.',
      'Check the installation environment before selecting equipment.',
      'Verify safety and current requirements before practical application.',
    ],
    remember: 'Understand the reason behind the method before memorising its steps.',
    practicalConnection: 'Find the principle on a drawing, safe training board or supervised installation and explain what changes if it is omitted.',
    checkYourself: `Can you explain ${lesson.topic.toLocaleLowerCase()} without repeating the video title?`,
  };
}

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function rotateCorrectOption(correct: string, distractors: string[], seed: number) {
  const alternatives = unique(distractors).filter((option) => option !== correct).slice(0, 3);
  while (alternatives.length < 3) {
    alternatives.push([
      'Choose the method only from habit, without checking the circuit or environment.',
      'Treat the video example as automatic legal approval for every installation.',
      'Continue practical work even when the supply, protection or competence is uncertain.',
    ][alternatives.length]);
  }
  const answer = seed % 4;
  const options = [...alternatives];
  options.splice(answer, 0, correct);
  return { options, answer };
}

function balancedSelection<T>(groups: T[][], limit: number) {
  const selected: T[] = [];
  let round = 0;
  while (selected.length < limit && groups.some((group) => round < group.length)) {
    groups.forEach((group, groupIndex) => {
      if (selected.length >= limit || !group.length) return;
      const item = group[(round + groupIndex) % group.length];
      if (item && !selected.includes(item)) selected.push(item);
    });
    round += 1;
  }
  return selected;
}

export function buildAssessmentBank(modules: readonly CourseModule[], guides: Record<string, LessonGuide>) {
  const lessons: Record<string, LessonAssessment> = {};
  const moduleAssessments: Record<string, ModuleAssessment> = {};

  modules.forEach((module) => {
    const moduleGuides = module.lessons.map((lesson) => guides[lesson.id] ?? fallbackGuide(lesson));
    const moduleConceptPool = unique(moduleGuides.flatMap((guide) => guide.keyConcepts));
    const moduleSummaryPool = unique(moduleGuides.map((guide) => guide.summary));
    const moduleRememberPool = unique(moduleGuides.map((guide) => guide.remember));
    const modulePracticePool = unique(moduleGuides.map((guide) => guide.practicalConnection));

    module.lessons.forEach((lesson, lessonIndex) => {
      const guide = guides[lesson.id] ?? fallbackGuide(lesson);
      const flashcards: Flashcard[] = [
        {
          id: `${lesson.id}-summary`, lessonId: lesson.id, moduleId: module.id,
          front: `What is the central purpose of “${lesson.title}”?`,
          back: guide.summary,
          whyItMatters: `A clear overview helps you connect ${lesson.topic.toLocaleLowerCase()} to the rest of the installation instead of memorising an isolated step.`,
        },
        ...guide.keyConcepts.map((concept, conceptIndex) => ({
          id: `${lesson.id}-concept-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
          front: `Explain key idea ${conceptIndex + 1} for ${lesson.topic.toLocaleLowerCase()}.`,
          back: concept,
          whyItMatters: 'This is one of the decisions or principles you should be able to explain before applying the lesson in practice.',
        })),
        {
          id: `${lesson.id}-remember`, lessonId: lesson.id, moduleId: module.id,
          front: `What is the most important point to remember from “${lesson.title}”?`,
          back: guide.remember,
          whyItMatters: 'This is the compact mental check to recall when planning, installing, testing or explaining the work.',
        },
        {
          id: `${lesson.id}-practice`, lessonId: lesson.id, moduleId: module.id,
          front: `Where does this lesson connect to real installation work?`,
          back: guide.practicalConnection,
          whyItMatters: 'Knowledge becomes durable when you can recognise where it changes a real drawing, method, test or client decision.',
        },
      ];

      if (lesson.regulationSensitive) {
        flashcards.push({
          id: `${lesson.id}-kenya`, lessonId: lesson.id, moduleId: module.id,
          front: 'What must be checked before applying this lesson on a Kenyan installation?',
          back: lesson.regulationStatus || kenyaGuardrail,
          whyItMatters: 'Technical principles transfer across countries, but legal duties, values, certificates, permitted methods and licence scope can change.',
          kenyaNote: kenyaGuardrail,
        });
      }

      const questions: AssessmentQuestion[] = [];
      const summaryChoice = rotateCorrectOption(guide.summary, moduleSummaryPool, lessonIndex);
      questions.push({
        id: `${lesson.id}-q-summary`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-summary`,
        prompt: `Which statement best summarises “${lesson.title}”?`,
        ...summaryChoice,
        explanation: `The lesson’s central purpose is: ${guide.summary}`,
      });

      guide.keyConcepts.forEach((concept, conceptIndex) => {
        const choice = rotateCorrectOption(concept, moduleConceptPool, lessonIndex + conceptIndex + 1);
        questions.push({
          id: `${lesson.id}-q-concept-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
          cardId: `${lesson.id}-concept-${conceptIndex + 1}`,
          prompt: `Which statement is a sound principle for ${lesson.topic.toLocaleLowerCase()}?`,
          ...choice,
          explanation: `${concept} This matters because the lesson should change how you decide or verify the work—not only what words you remember.`,
        });
      });

      const rememberChoice = rotateCorrectOption(guide.remember, moduleRememberPool, lessonIndex + 5);
      questions.push({
        id: `${lesson.id}-q-remember`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-remember`,
        prompt: 'Which reminder should guide your decision after this lesson?',
        ...rememberChoice,
        explanation: guide.remember,
      });

      const practiceChoice = rotateCorrectOption(guide.practicalConnection, modulePracticePool, lessonIndex + 6);
      questions.push({
        id: `${lesson.id}-q-practice`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: 'Which practical connection best applies this lesson?',
        ...practiceChoice,
        explanation: guide.practicalConnection,
      });

      if (lesson.regulationSensitive) {
        const correct = lesson.regulationStatus || kenyaGuardrail;
        const choice = rotateCorrectOption(correct, [
          'The UK video automatically proves compliance in Kenya without further checks.',
          'A learner may carry out any specialised installation after watching the lesson.',
          'Only the equipment colour and appearance need to be checked before installation.',
        ], lessonIndex + 7);
        questions.push({
          id: `${lesson.id}-q-kenya`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-kenya`,
          prompt: 'What is the correct compliance approach before using this lesson on a Kenyan project?',
          ...choice,
          explanation: `${correct} ${kenyaGuardrail}`,
        });
      }

      lessons[lesson.id] = { lessonId: lesson.id, moduleId: module.id, flashcards, questions };
    });

    const lessonAssessments = module.lessons.map((lesson) => lessons[lesson.id]);
    moduleAssessments[module.id] = {
      moduleId: module.id,
      title: module.title,
      flashcards: balancedSelection(lessonAssessments.map((assessment) => assessment.flashcards), 30),
      questions: balancedSelection(lessonAssessments.map((assessment) => assessment.questions), 30),
    };
  });

  const allFlashcards = Object.values(lessons).flatMap((assessment) => assessment.flashcards);
  return {
    lessons,
    modules: moduleAssessments,
    allFlashcards,
    flashcardLookup: new Map(allFlashcards.map((card) => [card.id, card])),
    totalLessonQuestions: Object.values(lessons).reduce((total, assessment) => total + assessment.questions.length, 0),
  };
}
