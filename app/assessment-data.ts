import type { LessonGuide } from './lesson-guides';

export type Flashcard = {
  id: string;
  lessonId: string;
  moduleId: string;
  front: string;
  back: string;
  whyItMatters: string;
  kind: 'Big picture' | 'Explain it' | 'Site decision' | 'Teach it back' | 'Safety check' | 'Kenya standards';
  answerPoints?: string[];
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
  kind: 'Understanding' | 'Job scenario' | 'Reasoning' | 'Teach-back' | 'Safety & standards';
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
    summary: `${lesson.topic} connects directly to safe, complete electrical installation work.`,
    keyConcepts: [
      `Understand the purpose of ${lesson.topic.toLocaleLowerCase()}.`,
      'Relate the component or method to the complete circuit.',
      'Check the installation environment before selecting equipment.',
      'Verify safety and current requirements before practical application.',
    ],
    remember: 'Understand the reason behind the method before memorising its steps.',
    practicalConnection: 'Find the principle on a drawing, safe training board or supervised installation and explain what changes if it is omitted.',
    checkYourself: `What is ${lesson.topic.toLocaleLowerCase()}, and how is it used in electrical work?`,
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
      'Treat one example as automatic legal approval for every installation.',
      'Continue practical work even when the supply, protection or competence is uncertain.',
    ][alternatives.length]);
  }
  const answer = seed % 4;
  const options = [...alternatives];
  options.splice(answer, 0, correct);
  return { options, answer };
}

function lowerFirst(value: string) {
  return value ? `${value.charAt(0).toLocaleLowerCase()}${value.slice(1)}` : value;
}

function conceptFocus(concept: string, fallback: string) {
  const cleaned = concept.replace(/[.?!]+$/, '').trim();
  const subject = cleaned.split(/\b(?:is|are|means|contains|include|includes|allows|requires|must|should|can|may|will|helps|protects|provides|uses|depends|occurs|responds|remain|stays|supports|influences)\b/i)[0]?.trim();
  if (!subject || subject.split(/\s+/).length > 8 || /^(choose|check|confirm|keep|record|read|select|separate|distinguish|establish|scan|plan|allow|restore|coordinate|verify|understand|treat|compare)\b/i.test(subject)) return fallback;
  return subject;
}

function whyQuestion(focus: string, topic: string) {
  if (focus.toLocaleLowerCase() === topic.toLocaleLowerCase()) return `Why is ${topic.toLocaleLowerCase()} important?`;
  return `Why does ${lowerFirst(focus)} matter when working with ${topic.toLocaleLowerCase()}?`;
}

function fieldAction(concept: string, topic: string) {
  if (/^(choose|check|confirm|keep|record|read|select|separate|distinguish|establish|scan|plan|allow|restore|coordinate|verify|understand|compare|place|use)\b/i.test(concept)) {
    return concept;
  }
  return `Use this principle when explaining, selecting or checking ${topic.toLocaleLowerCase()}: ${concept}`;
}

function reasoningDistractors(topic: string) {
  const subject = topic.toLocaleLowerCase();
  return [
    `The principle has no effect on how ${subject} behaves or how the result is checked.`,
    `Use the same approach for ${subject} in every situation without checking the actual conditions.`,
    `Judge ${subject} mainly by appearance; the reason behind the decision does not need to be verified.`,
  ];
}

function unsafeDistractors(topic: string) {
  const subject = topic.toLocaleLowerCase();
  return [
    `Begin the work on ${subject} and decide what should have been checked only if a problem appears.`,
    'Copy the demonstrated arrangement exactly without checking the drawing, equipment data or installation environment.',
    'Accept operation as proof that the design, workmanship, protection and required verification are all correct.',
  ];
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
    const moduleSummaryPool = unique(moduleGuides.map((guide) => guide.summary));
    const moduleRememberPool = unique(moduleGuides.map((guide) => guide.remember));
    const modulePracticePool = unique(moduleGuides.map((guide) => guide.practicalConnection));

    module.lessons.forEach((lesson, lessonIndex) => {
      const guide = guides[lesson.id] ?? fallbackGuide(lesson);
      const topic = lesson.topic.toLocaleLowerCase();
      const flashcards: Flashcard[] = [
        {
          id: `${lesson.id}-summary`, lessonId: lesson.id, moduleId: module.id,
          kind: 'Big picture',
          front: `What is the main idea behind ${topic}?`,
          back: guide.summary,
          answerPoints: guide.keyConcepts.slice(0, 3),
          whyItMatters: `A competent electrician can connect ${topic} to the complete circuit or installation—not only repeat a definition.`,
        },
        ...guide.keyConcepts.flatMap((concept, conceptIndex) => {
          const focus = conceptFocus(concept, lesson.topic);
          return [
            {
              id: `${lesson.id}-concept-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
              kind: 'Explain it' as const,
              front: `What should you understand about ${lowerFirst(focus)}?`,
              back: concept,
              answerPoints: [
                `State the principle accurately: ${concept}`,
                `Explain why it matters: ${guide.remember}`,
              ],
              whyItMatters: `This tests whether you can explain the reason behind ${topic}, which is necessary before making or defending a technical decision.`,
            },
            {
              id: `${lesson.id}-decision-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
              kind: 'Site decision' as const,
              front: `How should ${lowerFirst(focus)} affect the way you work?`,
              back: fieldAction(concept, lesson.topic),
              answerPoints: [concept, 'Explain what could be wrong, unsafe or incomplete if this point is ignored.'],
              whyItMatters: `Understanding becomes useful when it changes what you inspect, select, install, test or explain on a real job.`,
            },
          ];
        }),
        {
          id: `${lesson.id}-remember`, lessonId: lesson.id, moduleId: module.id,
          kind: 'Safety check',
          front: `What is the most important rule to remember about ${topic}?`,
          back: guide.remember,
          answerPoints: [guide.remember, 'Use the check before proceeding, not only after a defect appears.'],
          whyItMatters: 'A short, accurate mental check helps prevent a familiar task from becoming an automatic—and possibly unsafe—routine.',
        },
        {
          id: `${lesson.id}-practice`, lessonId: lesson.id, moduleId: module.id,
          kind: 'Site decision',
          front: `How is ${topic} applied on a real job?`,
          back: guide.practicalConnection,
          answerPoints: [guide.practicalConnection, 'Name the evidence that would show the work has been carried out and checked correctly.'],
          whyItMatters: 'Practical evidence connects theory to a drawing, installation method, test result or clear client decision.',
        },
        {
          id: `${lesson.id}-teach-back`, lessonId: lesson.id, moduleId: module.id,
          kind: 'Teach it back',
          front: guide.checkYourself,
          back: `A strong answer should explain the principle, the reason it matters and its practical consequence—not merely repeat a definition.`,
          answerPoints: [...guide.keyConcepts, `Practical connection: ${guide.practicalConnection}`],
          whyItMatters: 'If you can teach the idea clearly and answer a follow-up question, you are more likely to understand it well enough to use it.',
        },
      ];

      if (lesson.regulationSensitive) {
        flashcards.push({
          id: `${lesson.id}-kenya`, lessonId: lesson.id, moduleId: module.id,
          kind: 'Kenya standards',
          front: `Before applying ${topic} in Kenya, what must be confirmed?`,
          back: lesson.regulationStatus || kenyaGuardrail,
          answerPoints: ['Separate the transferable technical principle from the rule or value that must be verified locally.', 'Confirm competence, project requirements, product instructions and the required inspection or testing evidence.'],
          whyItMatters: 'Technical principles transfer across countries, but legal duties, values, certificates, permitted methods and licence scope can change.',
          kenyaNote: kenyaGuardrail,
        });
      }

      const questions: AssessmentQuestion[] = [];
      const summaryChoice = rotateCorrectOption(guide.summary, moduleSummaryPool, lessonIndex);
      questions.push({
        id: `${lesson.id}-q-summary`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-summary`,
        prompt: `What is the main purpose of ${topic}?`,
        kind: 'Understanding',
        ...summaryChoice,
        explanation: guide.summary,
      });

      guide.keyConcepts.forEach((concept, conceptIndex) => {
        const choice = rotateCorrectOption(concept, reasoningDistractors(lesson.topic), lessonIndex + conceptIndex + 1);
        questions.push({
          id: `${lesson.id}-q-concept-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
          cardId: `${lesson.id}-concept-${conceptIndex + 1}`,
          prompt: `Which statement correctly explains ${lowerFirst(conceptFocus(concept, lesson.topic))}?`,
          kind: 'Understanding',
          ...choice,
          explanation: `${concept} This is the principle to use when explaining the circuit, making the installation decision or checking the result.`,
        });

        const action = fieldAction(concept, lesson.topic);
        const scenarioChoice = rotateCorrectOption(action, unsafeDistractors(lesson.topic), lessonIndex + conceptIndex + 11);
        questions.push({
          id: `${lesson.id}-q-scenario-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
          cardId: `${lesson.id}-decision-${conceptIndex + 1}`,
          prompt: `You are working with ${topic}. Which action is correct?`,
          kind: 'Job scenario',
          ...scenarioChoice,
          explanation: `${action} Check the drawing, circuit conditions, equipment information and the required verification before accepting the work.`,
        });

        const reasoningAnswer = `It changes a real technical decision: ${concept}`;
        const reasoningChoice = rotateCorrectOption(reasoningAnswer, reasoningDistractors(lesson.topic), lessonIndex + conceptIndex + 21);
        questions.push({
          id: `${lesson.id}-q-reasoning-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
          cardId: `${lesson.id}-concept-${conceptIndex + 1}`,
          prompt: whyQuestion(conceptFocus(concept, lesson.topic), lesson.topic),
          kind: 'Reasoning',
          ...reasoningChoice,
          explanation: `${concept} It affects planning, selection, workmanship, testing or the way the result is explained.`,
        });
      });

      const rememberChoice = rotateCorrectOption(guide.remember, moduleRememberPool, lessonIndex + 5);
      questions.push({
        id: `${lesson.id}-q-remember`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-remember`,
        prompt: `Which rule is most important when working with ${topic}?`,
        kind: 'Safety & standards',
        ...rememberChoice,
        explanation: guide.remember,
      });

      const practiceChoice = rotateCorrectOption(guide.practicalConnection, modulePracticePool, lessonIndex + 6);
      questions.push({
        id: `${lesson.id}-q-practice`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: `Which example shows ${topic} being applied correctly?`,
        kind: 'Job scenario',
        ...practiceChoice,
        explanation: guide.practicalConnection,
      });

      const teachBackAnswer = `Explain these connected points: ${guide.keyConcepts.join(' ')}`;
      const teachBackChoice = rotateCorrectOption(teachBackAnswer, reasoningDistractors(lesson.topic), lessonIndex + 31);
      questions.push({
        id: `${lesson.id}-q-teach-back`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-teach-back`,
        prompt: guide.checkYourself,
        kind: 'Teach-back',
        ...teachBackChoice,
        explanation: `A complete answer connects these points: ${guide.keyConcepts.join(' ')}`,
      });

      const completionAnswer = `Explain the principle, apply it to the work, and identify the evidence or check that would confirm the result.`;
      const completionChoice = rotateCorrectOption(completionAnswer, unsafeDistractors(lesson.topic), lessonIndex + 41);
      questions.push({
        id: `${lesson.id}-q-completion`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: `Which result best shows that ${topic} has been applied correctly?`,
        kind: 'Reasoning',
        ...completionChoice,
        explanation: `${completionAnswer} Practical example: ${guide.practicalConnection}`,
      });

      if (lesson.regulationSensitive) {
        const correct = lesson.regulationStatus || kenyaGuardrail;
        const choice = rotateCorrectOption(correct, [
          'A method used elsewhere automatically proves compliance in Kenya without further checks.',
          'Anyone may carry out specialised electrical work after seeing one demonstration.',
          'Only the equipment colour and appearance need to be checked before installation.',
        ], lessonIndex + 7);
        questions.push({
          id: `${lesson.id}-q-kenya`, lessonId: lesson.id, moduleId: module.id, cardId: `${lesson.id}-kenya`,
          prompt: `Before using this method on a Kenyan project, what must be done?`,
          kind: 'Safety & standards',
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
      flashcards: balancedSelection(lessonAssessments.map((assessment) => assessment.flashcards), 40),
      questions: balancedSelection(lessonAssessments.map((assessment) => assessment.questions), 50),
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
