import type { LessonGuide } from './lesson-guides';

export type Flashcard = {
  id: string;
  lessonId: string;
  moduleId: string;
  front: string;
  back: string;
  whyItMatters: string;
  kind: 'Big picture' | 'Core idea' | 'Concept connection' | 'Site decision' | 'Teach it back' | 'Safety check' | 'Kenya standards';
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
  kind: 'Understanding' | 'Concept connection' | 'Job scenario' | 'Reasoning' | 'Teach-back' | 'Safety & standards';
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

function cleanSentence(value: string) {
  return value.trim().replace(/[.?!]+$/, '');
}

function directConceptQuestion(concept: string, topic: string) {
  const sentence = cleanSentence(concept);
  let match = sentence.match(/^(.+?)\s+before\s+(.+)$/i);
  if (match) return { prompt: `What must be done before ${match[2].toLocaleLowerCase()}?`, answer: match[1] };

  match = sentence.match(/^(.+?)\s+(contain|contains)\s+(.+)$/i);
  if (match) return { prompt: `What ${match[2].toLocaleLowerCase() === 'contains' ? 'does' : 'do'} ${match[1].toLocaleLowerCase()} contain?`, answer: match[3] };

  match = sentence.match(/^(.+?)\s+(influences|determines|affects)\s+(whether\s+.+)$/i);
  if (match) return { prompt: `What ${match[2].toLocaleLowerCase()} ${match[3].toLocaleLowerCase()}?`, answer: match[1] };

  match = sentence.match(/^(.+?)\s+depends\s+on\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} depend on?`, answer: match[2] };

  match = sentence.match(/^(.+?)\s+is\s+opposite\s+to\s+(.+)$/i);
  if (match) return { prompt: `How is ${match[1].toLocaleLowerCase()} related to ${match[2].toLocaleLowerCase()}?`, answer: 'They are in opposite directions.' };

  const action = sentence.match(/^(Choose|Select|Check|Confirm|Verify|Read|Record|Scan|Keep|Plan|Allow|Restore|Coordinate|Place|Use|Compare|Distinguish|Separate|Establish)\b/i)?.[1]?.toLocaleLowerCase();
  if (action === 'choose' || action === 'select') {
    const object = sentence.replace(/^(Choose|Select)\s+/i, '').split(/\s+(?:for|from|according to|based on)\s+/i)[0];
    return { prompt: `What must be considered when ${action === 'choose' ? 'choosing' : 'selecting'} ${object.toLocaleLowerCase()}?`, answer: sentence };
  }
  const actionPrompts: Record<string, string> = {
    check: `What must be checked for ${topic.toLocaleLowerCase()}?`,
    confirm: `What must be confirmed for ${topic.toLocaleLowerCase()}?`,
    verify: `What must be verified for ${topic.toLocaleLowerCase()}?`,
    read: `What information must be read before working with ${topic.toLocaleLowerCase()}?`,
    record: `What must be recorded for ${topic.toLocaleLowerCase()}?`,
    scan: `What must be checked before work starts on ${topic.toLocaleLowerCase()}?`,
    keep: `What must be kept correctly controlled in ${topic.toLocaleLowerCase()}?`,
    plan: `What must be planned for ${topic.toLocaleLowerCase()}?`,
    allow: `What allowances are needed for ${topic.toLocaleLowerCase()}?`,
    restore: `What must be restored before the work is complete?`,
    coordinate: `What must be coordinated for ${topic.toLocaleLowerCase()}?`,
    place: `What must be considered when positioning equipment for ${topic.toLocaleLowerCase()}?`,
    use: `What should be used for ${topic.toLocaleLowerCase()}?`,
    compare: `What must be compared for ${topic.toLocaleLowerCase()}?`,
    distinguish: `What must be distinguished in ${topic.toLocaleLowerCase()}?`,
    separate: `What must be kept separate in ${topic.toLocaleLowerCase()}?`,
    establish: 'What must be established before work starts?',
  };
  if (action && actionPrompts[action]) return { prompt: actionPrompts[action], answer: sentence };

  match = sentence.match(/^(.+?)\s+(?:is|are|means|allows|requires|provides|supports|protects|controls|limits|reduces|increases|connects|contributes|responds|remains|stays)\b/i);
  if (match && match[1].split(/\s+/).length <= 7) return { prompt: `What is correct about ${match[1].toLocaleLowerCase()}?`, answer: sentence };

  return { prompt: `What is the correct technical point about ${topic.toLocaleLowerCase()}?`, answer: sentence };
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
      const isFoundationTheory = module.id === 'module-01';
      const conceptQuestions = guide.keyConcepts.map((concept) => directConceptQuestion(concept, lesson.topic));
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
          const conceptQuestion = conceptQuestions[conceptIndex];
          return [
            {
              id: `${lesson.id}-concept-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
              kind: 'Core idea' as const,
              front: conceptQuestion.prompt,
              back: conceptQuestion.answer,
              answerPoints: [
                `State the principle accurately: ${concept}`,
                `Connect it to the main point: ${guide.remember}`,
              ],
              whyItMatters: `This is core idea ${conceptIndex + 1} of ${guide.keyConcepts.length}. Keep it connected to the ideas before and after it.`,
            },
            {
              id: `${lesson.id}-decision-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
              kind: isFoundationTheory ? 'Concept connection' as const : 'Site decision' as const,
              front: isFoundationTheory
                ? `This principle is important: “${concept}” What does it help explain?`
                : `Apply this requirement: “${concept}” What should it change on the job?`,
              back: isFoundationTheory ? `It helps explain ${topic}: ${concept}` : fieldAction(concept, lesson.topic),
              answerPoints: isFoundationTheory
                ? [concept, `Connect this fact to the wider topic: ${guide.summary}`]
                : [concept, 'Explain what could be wrong, unsafe or incomplete if this point is ignored.'],
              whyItMatters: isFoundationTheory
                ? 'This connects the scientific idea to circuit behaviour and to the practical topics that follow later in the course.'
                : 'This connects the core idea to what should be inspected, selected, installed, tested or explained on a real job.',
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
        const conceptQuestion = conceptQuestions[conceptIndex];
        const relatedAnswers = conceptQuestions.filter((_, index) => index !== conceptIndex).map((item) => item.answer);
        const choice = rotateCorrectOption(conceptQuestion.answer, [...relatedAnswers, ...reasoningDistractors(lesson.topic)], lessonIndex + conceptIndex + 1);
        questions.push({
          id: `${lesson.id}-q-concept-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
          cardId: `${lesson.id}-concept-${conceptIndex + 1}`,
          prompt: conceptQuestion.prompt,
          kind: 'Understanding',
          ...choice,
          explanation: `Correct answer: ${conceptQuestion.answer}. In context: ${concept}`,
        });

        const action = isFoundationTheory
          ? `It helps explain ${topic}: ${concept}`
          : fieldAction(concept, lesson.topic);
        const scenarioChoice = rotateCorrectOption(action, isFoundationTheory ? reasoningDistractors(lesson.topic) : unsafeDistractors(lesson.topic), lessonIndex + conceptIndex + 11);
        questions.push({
          id: `${lesson.id}-q-scenario-${conceptIndex + 1}`, lessonId: lesson.id, moduleId: module.id,
          cardId: `${lesson.id}-decision-${conceptIndex + 1}`,
          prompt: isFoundationTheory
            ? `The principle is “${concept}” What does it help explain?`
            : `The requirement is “${concept}” Which option applies it correctly?`,
          kind: isFoundationTheory ? 'Concept connection' : 'Job scenario',
          ...scenarioChoice,
          explanation: isFoundationTheory
            ? `${action} This connects the individual fact to the wider electrical idea.`
            : `${action} Check the drawing, circuit conditions, equipment information and the required verification before accepting the work.`,
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
