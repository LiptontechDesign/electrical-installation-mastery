import type { LessonGuide } from './lesson-guides';

export type Flashcard = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  front: string;
  back: string;
  whyItMatters: string;
  kind: 'Big picture' | 'Core idea' | 'Concept connection' | 'Site decision' | 'Safety check' | 'Kenya standards';
  answerPoints?: string[];
  kenyaNote?: string;
};

export type AssessmentQuestion = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  cardId: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
  kind: 'Understanding' | 'Concept connection' | 'Job scenario' | 'Reasoning' | 'Safety & standards';
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

function firstSentence(value: string) {
  return value.trim().split(/(?<=[.!?])\s+/)[0];
}

function directConceptQuestion(concept: string, topic: string) {
  const sentence = cleanSentence(concept);
  let match = sentence.match(/^(.+?)\s+before\s+(.+)$/i);
  if (match) return { prompt: `What must be done before ${match[2].toLocaleLowerCase()}?`, answer: sentence };

  match = sentence.match(/^(.+?)\s+(contain|contains)\s+(.+)$/i);
  if (match) return { prompt: `What ${match[2].toLocaleLowerCase() === 'contains' ? 'does' : 'do'} ${match[1].toLocaleLowerCase()} contain?`, answer: sentence };

  match = sentence.match(/^(.+?)(?:\s+(strongly|directly|mainly|largely))?\s+(influences|determines|affects)\s+(whether\s+.+)$/i);
  if (match) return { prompt: `What ${match[3].toLocaleLowerCase()} ${match[4].toLocaleLowerCase()}?`, answer: sentence };

  match = sentence.match(/^(.+?)\s+depends\s+on\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} depend on?`, answer: sentence };

  match = sentence.match(/^(.+?)\s+is\s+opposite\s+to\s+(.+)$/i);
  if (match) return { prompt: `How is ${match[1].toLocaleLowerCase()} related to ${match[2].toLocaleLowerCase()}?`, answer: sentence };

  match = sentence.match(/^(.+?)\s+(increases|decreases|rises|falls)\s+(.+)$/i);
  if (match) return { prompt: `How does ${match[1].toLocaleLowerCase()} change ${match[3].toLocaleLowerCase()}?`, answer: sentence };

  match = sentence.match(/^(.+?)\s+equals\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} equal?`, answer: sentence };

  match = sentence.match(/^(.+?)\s+can\s+(.+)$/i);
  if (match) return { prompt: `What can ${match[1].toLocaleLowerCase()} do?`, answer: sentence };

  match = sentence.match(/^(.+?)\s+(creates|produces|forms|stores|shares|adds|opposes|guides|intensifies)\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} ${match[2].toLocaleLowerCase()}?`, answer: sentence };

  const action = sentence.match(/^(Choose|Select|Check|Confirm|Verify|Read|Record|Scan|Keep|Plan|Allow|Restore|Coordinate|Place|Use|Compare|Distinguish|Separate|Establish)\b/i)?.[1]?.toLocaleLowerCase();
  if (action === 'choose' || action === 'select') {
    const object = sentence.replace(/^(Choose|Select)\s+/i, '').split(/\s+(?:for|from|according to|based on)\s+/i)[0];
    return { prompt: `What must be considered when ${action === 'choose' ? 'choosing' : 'selecting'} ${object.toLocaleLowerCase()}?`, answer: sentence };
  }
  const actionPrompts: Record<string, string> = {
    check: `What must be checked in “${topic}”?`,
    confirm: `What must be confirmed in “${topic}”?`,
    verify: `What must be verified in “${topic}”?`,
    read: `What information must be read before applying “${topic}”?`,
    record: `What must be recorded when applying “${topic}”?`,
    scan: `What must be checked before the work in “${topic}” starts?`,
    keep: `What must be kept correctly controlled in “${topic}”?`,
    plan: `What must be planned in “${topic}”?`,
    allow: `What allowances are required in “${topic}”?`,
    restore: `What must be restored before the work is complete?`,
    coordinate: `What must be coordinated in “${topic}”?`,
    place: `What must be considered when positioning equipment in “${topic}”?`,
    use: `What should be used in “${topic}”?`,
    compare: `What must be compared in “${topic}”?`,
    distinguish: `What must be distinguished in “${topic}”?`,
    separate: `What must be kept separate in “${topic}”?`,
    establish: 'What must be established before work starts?',
  };
  if (action && actionPrompts[action]) return { prompt: actionPrompts[action], answer: sentence };

  match = sentence.match(/^(.+?)\s+(is|are|means)\s+(.+)$/i);
  if (match && match[1].split(/\s+/).length <= 7 && !/\b(?:while|but|and)\b|,/.test(match[1])) {
    return { prompt: `How does this lesson describe ${match[1].toLocaleLowerCase()}?`, answer: sentence };
  }

  match = sentence.match(/^(.+?)\s+(allows|requires|provides|supports|protects|controls|limits|reduces|increases|connects|contributes|responds|remains|stays)\s+(.+)$/i);
  if (match && match[1].split(/\s+/).length <= 7 && !/\b(?:while|but|and)\b|,/.test(match[1])) {
    return { prompt: `What does the lesson explain about ${match[1].toLocaleLowerCase()}?`, answer: sentence };
  }

  return { prompt: `Which statement accurately explains this point from “${topic}”?`, answer: sentence };
}

function reasoningDistractors(topic: string) {
  return [
    `The principle has no connection to the electrical behaviour explained in “${topic}”.`,
    `Use the same conclusion from “${topic}” in every situation without checking the actual conditions.`,
    'Judge the result mainly by appearance; the reason behind it does not need to be explained or verified.',
  ];
}

function unsafeDistractors(topic: string) {
  return [
    `Begin the work covered in “${topic}” and decide what should have been checked only if a problem appears.`,
    'Copy the demonstrated arrangement exactly without checking the drawing, equipment data or installation environment.',
    'Accept operation as proof that the design, workmanship, protection and required verification are all correct.',
  ];
}

function summaryDistractors(title: string) {
  return [
    `It deals only with the appearance of equipment and does not explain the electrical principle in “${title}”.`,
    'It assumes one arrangement can be copied into every installation without checking the circuit or environment.',
    'It treats successful operation as complete proof that the design, protection and workmanship are correct.',
  ];
}

function groupedLessonSelection<T>(groups: T[][], limit: number) {
  const availableGroups = groups.filter((group) => group.length > 0);
  if (!availableGroups.length) return [];
  const base = Math.floor(limit / availableGroups.length);
  const remainder = limit % availableGroups.length;
  return availableGroups.flatMap((group, groupIndex) => {
    const count = Math.min(group.length, base + (groupIndex < remainder ? 1 : 0));
    // Each lesson assessment is ordered as overview, core concepts, then application.
    // Preserve that teaching sequence when composing a module review instead of
    // jumping from an overview to an unrelated final card from the same lesson.
    return group.slice(0, count);
  }).slice(0, limit);
}

export function buildAssessmentBank(modules: readonly CourseModule[], guides: Record<string, LessonGuide>) {
  const lessons: Record<string, LessonAssessment> = {};
  const moduleAssessments: Record<string, ModuleAssessment> = {};

  modules.forEach((module) => {
    module.lessons.forEach((lesson, lessonIndex) => {
      const guide = guides[lesson.id] ?? fallbackGuide(lesson);
      const lessonFocus = lesson.title;
      const isFoundationTheory = module.id === 'module-01';
      const conceptQuestions = guide.keyConcepts.map((concept) => directConceptQuestion(concept, lessonFocus));
      const flashcards: Flashcard[] = [
        {
          id: `${lesson.id}-summary`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Big picture',
          front: `What does “${lesson.title}” explain?`,
          back: guide.summary,
          answerPoints: guide.keyConcepts.slice(0, 3),
          whyItMatters: 'This overview gives the context needed before studying the individual facts and their practical use.',
        },
        ...guide.keyConcepts.map((concept, conceptIndex) => {
          const conceptQuestion = conceptQuestions[conceptIndex];
          return {
            id: `${lesson.id}-concept-${conceptIndex + 1}`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
            kind: 'Core idea' as const,
            front: conceptQuestion.prompt,
            back: conceptQuestion.answer,
            answerPoints: [
              `State the principle accurately: ${concept}`,
              `Connect it to the main point: ${guide.remember}`,
            ],
            whyItMatters: `This is core idea ${conceptIndex + 1} of ${guide.keyConcepts.length}. It builds the knowledge needed for the lesson's final safety rule and practical application.`,
          };
        }),
        {
          id: `${lesson.id}-remember`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Safety check',
          front: `What is the key rule to remember from “${lesson.title}”?`,
          back: guide.remember,
          answerPoints: [guide.remember, 'Use the check before proceeding, not only after a defect appears.'],
          whyItMatters: 'A short, accurate mental check helps prevent a familiar task from becoming an automatic—and possibly unsafe—routine.',
        },
        {
          id: `${lesson.id}-practice`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: isFoundationTheory ? 'Concept connection' : 'Site decision',
          front: `How can the main idea from “${lesson.title}” be applied or demonstrated?`,
          back: guide.practicalConnection,
          answerPoints: [guide.practicalConnection, 'Name the evidence that would show the work has been carried out and checked correctly.'],
          whyItMatters: 'Practical evidence connects theory to a drawing, installation method, test result or clear client decision.',
        },
      ];

      if (lesson.regulationSensitive) {
        flashcards.push({
          id: `${lesson.id}-kenya`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Kenya standards',
          front: `Before applying the method in “${lesson.title}” in Kenya, what must be confirmed?`,
          back: lesson.regulationStatus || kenyaGuardrail,
          answerPoints: ['Separate the transferable technical principle from the rule or value that must be verified locally.', 'Confirm competence, project requirements, product instructions and the required inspection or testing evidence.'],
          whyItMatters: 'Technical principles transfer across countries, but legal duties, values, certificates, permitted methods and licence scope can change.',
          kenyaNote: kenyaGuardrail,
        });
      }

      const questions: AssessmentQuestion[] = [];
      const summaryAnswer = firstSentence(guide.summary);
      const summaryChoice = rotateCorrectOption(summaryAnswer, summaryDistractors(lesson.title), lessonIndex);
      questions.push({
        id: `${lesson.id}-q-summary`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-summary`,
        prompt: `Which statement best explains the main purpose of “${lesson.title}”?`,
        kind: 'Understanding',
        ...summaryChoice,
        explanation: `Direct answer: ${summaryAnswer} Full context: ${guide.summary}`,
      });

      guide.keyConcepts.forEach((concept, conceptIndex) => {
        const conceptQuestion = conceptQuestions[conceptIndex];
        const relatedAnswers = conceptQuestions.filter((_, index) => index !== conceptIndex).map((item) => item.answer);
        const choice = rotateCorrectOption(conceptQuestion.answer, [...relatedAnswers, ...reasoningDistractors(lesson.title)], lessonIndex + conceptIndex + 1);
        questions.push({
          id: `${lesson.id}-q-concept-${conceptIndex + 1}`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          cardId: `${lesson.id}-concept-${conceptIndex + 1}`,
          prompt: conceptQuestion.prompt,
          kind: 'Understanding',
          ...choice,
          explanation: `${concept} This point supports the lesson's main takeaway: ${guide.remember}`,
        });

      });

      const rememberChoice = rotateCorrectOption(guide.remember, unsafeDistractors(lesson.title), lessonIndex + 5);
      questions.push({
        id: `${lesson.id}-q-remember`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-remember`,
        prompt: `Which statement is the correct rule to remember from “${lesson.title}”?`,
        kind: 'Safety & standards',
        ...rememberChoice,
        explanation: guide.remember,
      });

      const practiceChoice = rotateCorrectOption(guide.practicalConnection, unsafeDistractors(lesson.title), lessonIndex + 6);
      questions.push({
        id: `${lesson.id}-q-practice`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: `Which activity correctly applies the main idea from “${lesson.title}”?`,
        kind: 'Job scenario',
        ...practiceChoice,
        explanation: guide.practicalConnection,
      });

      const integrationAnswer = `${guide.remember} Practical application: ${guide.practicalConnection}`;
      const integrationChoice = rotateCorrectOption(integrationAnswer, unsafeDistractors(lesson.title), lessonIndex + 41);
      questions.push({
        id: `${lesson.id}-q-integration`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: `Which answer correctly connects the key rule in “${lesson.title}” to its practical use?`,
        kind: 'Reasoning',
        ...integrationChoice,
        explanation: `Key rule: ${guide.remember} Practical application: ${guide.practicalConnection}`,
      });

      if (lesson.regulationSensitive) {
        const correct = lesson.regulationStatus || kenyaGuardrail;
        const choice = rotateCorrectOption(correct, [
          'A method used elsewhere automatically proves compliance in Kenya without further checks.',
          'Anyone may carry out specialised electrical work after seeing one demonstration.',
          'Only the equipment colour and appearance need to be checked before installation.',
        ], lessonIndex + 7);
        questions.push({
          id: `${lesson.id}-q-kenya`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-kenya`,
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
      flashcards: groupedLessonSelection(lessonAssessments.map((assessment) => assessment.flashcards), 40),
      questions: groupedLessonSelection(lessonAssessments.map((assessment) => assessment.questions), 50),
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
