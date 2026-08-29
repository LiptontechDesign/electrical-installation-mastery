import type { LessonGuide } from './lesson-guides';

export type Flashcard = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  front: string;
  back: string;
  explanation: string;
  application: string;
  misconception: string;
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
  takeaway: string;
  jobConnection: string;
  optionFeedback: string[];
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

function buildChoice(correct: string, distractors: string[], seed: number, focus: string) {
  const choice = rotateCorrectOption(correct, distractors, seed);
  return {
    ...choice,
    optionFeedback: choice.options.map((option, index) => index === choice.answer
      ? `This is the only option that directly answers ${focus}.`
      : `“${option}” does not answer ${focus} accurately or completely.`),
  };
}

function cleanSentence(value: string) {
  return value.trim().replace(/[.?!]+$/, '');
}

function firstSentence(value: string) {
  return value.trim().split(/(?<=[.!?])\s+/)[0];
}

function baseVerb(value: string) {
  const forms: Record<string, string> = {
    creates: 'create', produces: 'produce', forms: 'form', stores: 'store', shares: 'share',
    adds: 'add', opposes: 'oppose', guides: 'guide', intensifies: 'intensify', allows: 'allow',
    requires: 'require', provides: 'provide', supports: 'support', protects: 'protect',
    controls: 'control', limits: 'limit', reduces: 'reduce', increases: 'increase',
    connects: 'connect', contributes: 'contribute', responds: 'respond', remains: 'remain', stays: 'stay',
  };
  return forms[value.toLocaleLowerCase()] ?? value.toLocaleLowerCase();
}

function directConceptQuestion(concept: string, topic: string) {
  const sentence = cleanSentence(concept);
  let match = sentence.match(/^(.+?)\s+before\s+(.+)$/i);
  if (match) return { prompt: `Before ${match[2].toLocaleLowerCase()}, what must be done?`, answer: cleanSentence(match[1]), statement: sentence };

  match = sentence.match(/^(.+?)\s+(contain|contains)\s+(.+)$/i);
  if (match) return { prompt: `What ${match[2].toLocaleLowerCase() === 'contains' ? 'does' : 'do'} ${match[1].toLocaleLowerCase()} contain?`, answer: cleanSentence(match[3]), statement: sentence };

  match = sentence.match(/^(.+?)(?:\s+(strongly|directly|mainly|largely))?\s+(influences|determines|affects)\s+(whether\s+.+)$/i);
  if (match) return { prompt: `What ${match[3].toLocaleLowerCase()} ${match[4].toLocaleLowerCase()}?`, answer: cleanSentence(match[1]), statement: sentence };

  match = sentence.match(/^(.+?)\s+depends\s+on\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} depend on?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+is\s+opposite\s+to\s+(.+)$/i);
  if (match) return { prompt: `How is ${match[1].toLocaleLowerCase()} related to ${match[2].toLocaleLowerCase()}?`, answer: `It is opposite to ${cleanSentence(match[2])}`, statement: sentence };

  match = sentence.match(/^(.+?)\s+(increases|decreases|rises|falls)\s+(.+)$/i);
  if (match) return { prompt: `How does ${match[1].toLocaleLowerCase()} change ${match[3].toLocaleLowerCase()}?`, answer: `${match[2]} ${cleanSentence(match[3])}`, statement: sentence };

  match = sentence.match(/^(.+?)\s+equals\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} equal?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+can\s+(.+)$/i);
  if (match) return { prompt: `What can ${match[1].toLocaleLowerCase()} do?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+(creates|produces|forms|stores|shares|adds|opposes|guides|intensifies)\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} ${baseVerb(match[2])}?`, answer: cleanSentence(match[3]), statement: sentence };

  const action = sentence.match(/^(Choose|Select|Check|Confirm|Verify|Read|Record|Scan|Keep|Plan|Allow|Restore|Coordinate|Place|Use|Compare|Distinguish|Separate|Establish)\b/i)?.[1]?.toLocaleLowerCase();
  if (action === 'choose' || action === 'select') {
    const object = sentence.replace(/^(Choose|Select)\s+/i, '').split(/\s+(?:for|from|according to|based on)\s+/i)[0];
    return { prompt: `What must be considered when ${action === 'choose' ? 'choosing' : 'selecting'} ${object.toLocaleLowerCase()}?`, answer: sentence, statement: sentence };
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
  if (action && actionPrompts[action]) return { prompt: actionPrompts[action], answer: sentence, statement: sentence };

  match = sentence.match(/^(.+?)\s+(must|should|needs? to|has to)\s+(.+)$/i);
  if (match && match[1].split(/\s+/).length <= 10) {
    return {
      prompt: `What is required of ${match[1].toLocaleLowerCase()}?`,
      answer: `${match[2]} ${cleanSentence(match[3])}`,
      statement: sentence,
    };
  }

  match = sentence.match(/^(.+?)\s+(is|are|means)\s+(.+)$/i);
  if (match && match[1].split(/\s+/).length <= 7 && !/\b(?:while|but|and)\b|,/.test(match[1])) {
    return { prompt: `How does this lesson define or describe ${match[1].toLocaleLowerCase()}?`, answer: cleanSentence(match[3]), statement: sentence };
  }

  match = sentence.match(/^(.+?)\s+(allows|requires|provides|supports|protects|controls|limits|reduces|increases|connects|contributes|responds|remains|stays)\s+(.+)$/i);
  if (match && match[1].split(/\s+/).length <= 7 && !/\b(?:while|but|and)\b|,/.test(match[1])) {
    const verb = baseVerb(match[2]);
    const prompt = ['respond', 'remain', 'stay'].includes(verb)
      ? `What does the lesson state about how ${match[1].toLocaleLowerCase()} ${verb}s?`
      : `What does ${match[1].toLocaleLowerCase()} ${verb}?`;
    return { prompt, answer: `${verb}s ${cleanSentence(match[3])}`, statement: sentence };
  }

  return {
    prompt: `What precise principle about “${topic}” should you be able to explain?`,
    answer: sentence,
    statement: sentence,
  };
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
      const guide = guides[lesson.id];
      if (!guide) throw new Error(`Lesson ${lesson.id} cannot build an assessment without a video-specific teaching guide.`);
      if (guide.keyConcepts.length < 3) throw new Error(`Lesson ${lesson.id} needs at least three specific key concepts.`);
      const lessonFocus = lesson.title;
      const isFoundationTheory = module.id === 'module-01';
      const conceptQuestions = guide.keyConcepts.map((concept) => directConceptQuestion(concept, lessonFocus));
      const flashcards: Flashcard[] = [
        {
          id: `${lesson.id}-summary`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Big picture',
          front: `What does “${lesson.title}” explain?`,
          back: firstSentence(guide.summary),
          explanation: guide.summary,
          application: guide.practicalConnection,
          misconception: 'Recognising the lesson title is not the same as being able to explain the principle and use it in a real decision.',
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
            explanation: conceptQuestion.statement,
            application: guide.practicalConnection,
            misconception: `Do not memorise this fact in isolation. Connect it to the lesson rule: ${guide.remember}`,
            answerPoints: [
              concept,
              guide.remember,
            ],
            whyItMatters: `This is core idea ${conceptIndex + 1} of ${guide.keyConcepts.length}. It builds the knowledge needed for the lesson's final safety rule and practical application.`,
          };
        }),
        {
          id: `${lesson.id}-remember`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Safety check',
          front: `What is the key rule to remember from “${lesson.title}”?`,
          back: guide.remember,
          explanation: guide.summary,
          application: guide.practicalConnection,
          misconception: 'Do not wait for a defect or incident before applying the rule; use it while planning and before work begins.',
          answerPoints: [guide.remember, 'Use the check before proceeding, not only after a defect appears.'],
          whyItMatters: 'A short, accurate mental check helps prevent a familiar task from becoming an automatic—and possibly unsafe—routine.',
        },
        {
          id: `${lesson.id}-practice`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: isFoundationTheory ? 'Concept connection' : 'Site decision',
          front: `How can the main idea from “${lesson.title}” be applied or demonstrated?`,
          back: guide.practicalConnection,
          explanation: `The activity must demonstrate this rule: ${guide.remember}`,
          application: guide.practicalConnection,
          misconception: 'Completing an activity is not enough; the learner must also explain the result, the checks made and the evidence produced.',
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
          explanation: 'The video teaches a transferable technical principle, but approval, values, documents, permitted methods and competence requirements must be confirmed locally.',
          application: 'Record the applicable Kenyan requirement, project specification, product instruction and required inspection or test evidence before approving the method.',
          misconception: 'A correct UK demonstration is useful technical teaching, but it is not automatic proof of legal or regulatory compliance in Kenya.',
          answerPoints: ['Separate the transferable technical principle from the rule or value that must be verified locally.', 'Confirm competence, project requirements, product instructions and the required inspection or testing evidence.'],
          whyItMatters: 'Technical principles transfer across countries, but legal duties, values, certificates, permitted methods and licence scope can change.',
          kenyaNote: kenyaGuardrail,
        });
      }

      const questions: AssessmentQuestion[] = [];
      const summaryAnswer = firstSentence(guide.summary);
      const nearbyLessonSummaries = module.lessons
        .map((candidate, candidateIndex) => ({ candidate, distance: Math.abs(candidateIndex - lessonIndex) }))
        .filter(({ candidate }) => candidate.id !== lesson.id)
        .sort((a, b) => a.distance - b.distance)
        .map(({ candidate }) => guides[candidate.id] ? firstSentence(guides[candidate.id].summary) : '')
        .filter(Boolean);
      const summaryChoice = buildChoice(summaryAnswer, [...nearbyLessonSummaries, ...summaryDistractors(lesson.title)], lessonIndex, `the main purpose of “${lesson.title}”`);
      questions.push({
        id: `${lesson.id}-q-summary`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-summary`,
        prompt: `Which statement best explains the main purpose of “${lesson.title}”?`,
        kind: 'Understanding',
        ...summaryChoice,
        explanation: guide.summary,
        takeaway: guide.remember,
        jobConnection: guide.practicalConnection,
      });

      guide.keyConcepts.forEach((concept, conceptIndex) => {
        const conceptQuestion = conceptQuestions[conceptIndex];
        const relatedAnswers = conceptQuestions.filter((_, index) => index !== conceptIndex).map((item) => item.answer);
        const choice = buildChoice(conceptQuestion.answer, [...relatedAnswers, ...reasoningDistractors(lesson.title)], lessonIndex + conceptIndex + 1, `the question “${conceptQuestion.prompt}”`);
        questions.push({
          id: `${lesson.id}-q-concept-${conceptIndex + 1}`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          cardId: `${lesson.id}-concept-${conceptIndex + 1}`,
          prompt: conceptQuestion.prompt,
          kind: 'Understanding',
          ...choice,
          explanation: conceptQuestion.statement,
          takeaway: guide.remember,
          jobConnection: guide.practicalConnection,
        });

      });

      const rememberChoice = buildChoice(guide.remember, unsafeDistractors(lesson.title), lessonIndex + 5, `the rule that should guide work after “${lesson.title}”`);
      questions.push({
        id: `${lesson.id}-q-remember`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-remember`,
        prompt: `You are about to use the method from “${lesson.title}”. Which rule should guide your decision before work begins?`,
        kind: 'Safety & standards',
        ...rememberChoice,
        explanation: `${guide.remember} This rule must shape planning and checking, not be remembered only after a problem occurs.`,
        takeaway: guide.remember,
        jobConnection: guide.practicalConnection,
      });

      const practiceChoice = buildChoice(guide.practicalConnection, unsafeDistractors(lesson.title), lessonIndex + 6, `a valid practical demonstration of “${lesson.title}”`);
      questions.push({
        id: `${lesson.id}-q-practice`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: `Which supervised activity would best demonstrate that you can apply “${lesson.title}”, not merely repeat its words?`,
        kind: 'Job scenario',
        ...practiceChoice,
        explanation: `The activity is valid because it turns the lesson into observable evidence: ${guide.practicalConnection}`,
        takeaway: guide.remember,
        jobConnection: guide.practicalConnection,
      });

      const integrationAnswer = `${guide.remember} Practical application: ${guide.practicalConnection}`;
      const integrationChoice = buildChoice(integrationAnswer, unsafeDistractors(lesson.title), lessonIndex + 41, `both the governing rule and its practical use in “${lesson.title}”`);
      questions.push({
        id: `${lesson.id}-q-integration`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: `A learner can recall the facts from “${lesson.title}” but cannot use them on a job. Which response correctly joins the governing rule to a practical action?`,
        kind: 'Reasoning',
        ...integrationChoice,
        explanation: `Key rule: ${guide.remember} Practical application: ${guide.practicalConnection}`,
        takeaway: guide.remember,
        jobConnection: guide.practicalConnection,
      });

      if (lesson.regulationSensitive) {
        const correct = lesson.regulationStatus || kenyaGuardrail;
        const choice = buildChoice(correct, [
          'A method used elsewhere automatically proves compliance in Kenya without further checks.',
          'Anyone may carry out specialised electrical work after seeing one demonstration.',
          'Only the equipment colour and appearance need to be checked before installation.',
        ], lessonIndex + 7, `what must be verified before this UK-taught method is used on a Kenyan project`);
        questions.push({
          id: `${lesson.id}-q-kenya`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-kenya`,
          prompt: `The video demonstrates UK practice. Before using its method on a Kenyan project, which verification is required?`,
          kind: 'Safety & standards',
          ...choice,
          explanation: `${correct} ${kenyaGuardrail}`,
          takeaway: 'Transfer the technical principle, then verify the Kenyan requirement and project evidence separately.',
          jobConnection: 'Document the applicable requirement, competent responsibility, equipment instructions and inspection or testing evidence before work is approved.',
        });
      }

      lessons[lesson.id] = { lessonId: lesson.id, moduleId: module.id, flashcards, questions };

      if (flashcards.length < 6 || questions.length < 7) {
        throw new Error(`Lesson ${lesson.id} does not contain enough retrieval practice.`);
      }
      questions.forEach((question) => {
        if (question.options.length !== 4 || unique(question.options).length !== 4) {
          throw new Error(`Question ${question.id} must have four distinct answer choices.`);
        }
        if (question.optionFeedback.length !== question.options.length) {
          throw new Error(`Question ${question.id} needs feedback for every answer choice.`);
        }
        if (!question.prompt.trim().endsWith('?')) {
          throw new Error(`Question ${question.id} must be written as a clear question.`);
        }
      });
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
  const expectedLessonCount = modules.reduce((total, module) => total + module.lessons.length, 0);
  if (Object.keys(lessons).length !== expectedLessonCount) {
    throw new Error(`Assessment coverage mismatch: expected ${expectedLessonCount} lessons and built ${Object.keys(lessons).length}.`);
  }
  return {
    lessons,
    modules: moduleAssessments,
    allFlashcards,
    flashcardLookup: new Map(allFlashcards.map((card) => [card.id, card])),
    totalLessonQuestions: Object.values(lessons).reduce((total, assessment) => total + assessment.questions.length, 0),
  };
}
