import type { LessonGuide } from './lesson-guides';
import { connectionChecks } from './connection-assessments';

export type Flashcard = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  front: string;
  back: string;
  kind: 'Core idea' | 'Application' | 'Safety check' | 'Kenya check';
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
  kind: 'Recall' | 'Application' | 'Safety check' | 'Kenya check';
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
    represents: 'represent', scales: 'scale', finds: 'find', lets: 'let', manages: 'manage',
    links: 'link', passes: 'pass', works: 'work', follows: 'follow', removes: 'remove',
    measures: 'measure', converts: 'convert', induces: 'induce', causes: 'cause', reverses: 'reverse',
    determines: 'determine', describes: 'describe', counts: 'count', uses: 'use', gives: 'give',
    carries: 'carry', supplies: 'supply', keeps: 'keep', shows: 'show', identifies: 'identify',
    combines: 'combine', compares: 'compare', minimizes: 'minimize', makes: 'make', matters: 'matter',
    isolates: 'isolate', affects: 'affect', divides: 'divide', surrounds: 'surround', terminates: 'terminate',
    reaches: 'reach', differs: 'differ', cancels: 'cancel', relies: 'rely', replaces: 'replace',
    opens: 'open', disconnects: 'disconnect', establishes: 'establish', detects: 'detect',
    covers: 'cover', influences: 'influence', prevents: 'prevent', catches: 'catch', returns: 'return',
    maintains: 'maintain', changes: 'change', governs: 'govern', transfers: 'transfer',
    accommodates: 'accommodate', softens: 'soften', seats: 'seat', preserves: 'preserve',
    improves: 'improve', seals: 'seal', completes: 'complete', ensures: 'ensure', avoids: 'avoid',
    holds: 'hold', sets: 'set', switches: 'switch', interrupts: 'interrupt', operates: 'operate',
    includes: 'include', excludes: 'exclude',
    tolerates: 'tolerate', demands: 'demand', exceeds: 'exceed', takes: 'take', flows: 'flow',
    melts: 'melt', checks: 'check', defines: 'define', shapes: 'shape', modifies: 'modify', leaves: 'leave',
    releases: 'release', estimates: 'estimate', assumes: 'assume', delivers: 'deliver', shifts: 'shift',
    distributes: 'distribute', explains: 'explain', emphasises: 'emphasise', emphasizes: 'emphasize',
    simplifies: 'simplify', reveals: 'reveal', confirms: 'confirm', indicates: 'indicate',
    permits: 'permit', overrides: 'override', proves: 'prove',
    informs: 'inform', distinguishes: 'distinguish', narrows: 'narrow', communicates: 'communicate',
    reflects: 'reflect', constrains: 'constrain', addresses: 'address', enables: 'enable', offers: 'offer',
    solves: 'solve', serves: 'serve', begins: 'begin', belongs: 'belong', points: 'point',
    coordinates: 'coordinate', decides: 'decide',
  };
  return forms[value.toLocaleLowerCase()] ?? value.toLocaleLowerCase();
}

function subjectUsesDo(subject: string) {
  return /\band\b/i.test(subject) || (/s$/i.test(subject) && !/(ss|us)$/i.test(subject));
}

function directConceptQuestion(concept: string, topic: string) {
  const sentence = cleanSentence(concept);
  if (/^Protons are positive, neutrons are neutral/i.test(sentence)) {
    return {
      prompt: 'What charge does each subatomic particle carry?',
      answer: 'Protons are positive, neutrons are neutral and electrons are negative',
      statement: sentence,
    };
  }

  if (/^Protons and neutrons are in the nucleus/i.test(sentence)) {
    return {
      prompt: 'Where are protons, neutrons and electrons found in an atom?',
      answer: 'Protons and neutrons are in the nucleus; electrons move around the outside',
      statement: sentence,
    };
  }

  if (/^Electrons are the particles most directly involved/i.test(sentence)) {
    return {
      prompt: 'Which particles are most directly involved in ordinary electrical conduction?',
      answer: 'Electrons',
      statement: sentence,
    };
  }

  if (/^Copper atoms contribute mobile outer electrons/i.test(sentence)) {
    return {
      prompt: 'Why is copper a good electrical conductor?',
      answer: 'Its outer electrons can move through the copper structure',
      statement: sentence,
    };
  }

  if (/^Electron drift is slow/i.test(sentence)) {
    return {
      prompt: 'Do individual electrons move through a cable as quickly as the electrical effect?',
      answer: 'No. Electron drift is slow, while the electrical effect travels through the circuit quickly',
      statement: sentence,
    };
  }

  if (/^Conventional current direction is opposite/i.test(sentence)) {
    return {
      prompt: 'How does conventional current direction compare with electron movement?',
      answer: 'It is opposite to the average direction in which electrons drift',
      statement: sentence,
    };
  }
  let match = sentence.match(/^(.+?)\s+before\s+(.+)$/i);
  if (match) return { prompt: `Before ${match[2].toLocaleLowerCase()}, what must be done?`, answer: cleanSentence(match[1]), statement: sentence };

  match = sentence.match(/^(.+?)\s+(contain|contains)\s+(.+)$/i);
  if (match) return { prompt: `What ${match[2].toLocaleLowerCase() === 'contains' ? 'does' : 'do'} ${match[1].toLocaleLowerCase()} contain?`, answer: cleanSentence(match[3]), statement: sentence };

  match = sentence.match(/^(.+?)(?:\s+(strongly|directly|mainly|largely))?\s+(influences|determines|affects)\s+(whether\s+.+)$/i);
  if (match) return { prompt: `What ${match[3].toLocaleLowerCase()} ${match[4].toLocaleLowerCase()}?`, answer: cleanSentence(match[1]), statement: sentence };

  match = sentence.match(/^(.+?)\s+depends\s+on\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} depend on?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+depend\s+on\s+(.+)$/i);
  if (match) return { prompt: `What do ${match[1].toLocaleLowerCase()} depend on?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+is\s+opposite\s+to\s+(.+)$/i);
  if (match) return { prompt: `How is ${match[1].toLocaleLowerCase()} related to ${match[2].toLocaleLowerCase()}?`, answer: `It is opposite to ${cleanSentence(match[2])}`, statement: sentence };

  match = sentence.match(/^(.+?)\s+(increases|decreases|rises|falls)\s+(.+)$/i);
  if (match) return { prompt: `How does ${match[1].toLocaleLowerCase()} change ${match[3].toLocaleLowerCase()}?`, answer: `${match[2]} ${cleanSentence(match[3])}`, statement: sentence };

  match = sentence.match(/^(.+?)\s+equals\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} equal?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+can\s+(.+)$/i);
  if (match) return { prompt: `What can ${match[1].toLocaleLowerCase()} do?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+cannot\s+([a-z]+)\s+(.+)$/i);
  if (match) return { prompt: `What can ${match[1].toLocaleLowerCase()} not ${baseVerb(match[2])}?`, answer: cleanSentence(match[3]), statement: sentence };

  match = sentence.match(/^(.+?)\s+(may|could)\s+(.+)$/i);
  if (match) return { prompt: `What ${match[2].toLocaleLowerCase()} ${match[1].toLocaleLowerCase()} do?`, answer: cleanSentence(match[3]), statement: sentence };

  match = sentence.match(/^(.+?)\s+follows\s+from\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} depend on?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+works\s+(.+)$/i);
  if (match) return { prompt: `When does ${match[1].toLocaleLowerCase()} work?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+lets\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} allow?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+(does|do)\s+not\s+([a-z]+)\s+(.+)$/i);
  if (match) {
    return {
      prompt: `What ${match[2].toLocaleLowerCase()} ${match[1].toLocaleLowerCase()} not ${baseVerb(match[3])}?`,
      answer: cleanSentence(match[4]),
      statement: sentence,
    };
  }

  match = sentence.match(/^(.+?)\s+(has|have)\s+(.+)$/i);
  if (match) {
    const auxiliary = subjectUsesDo(match[1]) ? 'do' : 'does';
    return { prompt: `What ${auxiliary} ${match[1].toLocaleLowerCase()} have?`, answer: cleanSentence(match[3]), statement: sentence };
  }

  match = sentence.match(/^(.+?)\s+needs?\s+(.+)$/i);
  if (match) {
    const auxiliary = subjectUsesDo(match[1]) ? 'do' : 'does';
    return { prompt: `What ${auxiliary} ${match[1].toLocaleLowerCase()} need?`, answer: cleanSentence(match[2]), statement: sentence };
  }

  match = sentence.match(/^(.+?)\s+(remains?|stays?)\s+(.+)$/i);
  if (match) return { prompt: `How must ${match[1].toLocaleLowerCase()} ${baseVerb(match[2])}?`, answer: cleanSentence(match[3]), statement: sentence };

  match = sentence.match(/^(.+?)\s+(comes?|sits?)\s+(from|in|on|between|at|within)\s+(.+)$/i);
  if (match) {
    const auxiliary = subjectUsesDo(match[1]) ? 'do' : 'does';
    return { prompt: `Where ${auxiliary} ${match[1].toLocaleLowerCase()} ${baseVerb(match[2])}?`, answer: `${match[3].toLocaleLowerCase()} ${cleanSentence(match[4])}`, statement: sentence };
  }

  match = sentence.match(/^(.+?)\s+belongs?\s+(to|in|on|with)\s+(.+)$/i);
  if (match) {
    const auxiliary = subjectUsesDo(match[1]) ? 'do' : 'does';
    return { prompt: `Where ${auxiliary} ${match[1].toLocaleLowerCase()} belong?`, answer: `${match[2].toLocaleLowerCase()} ${cleanSentence(match[3])}`, statement: sentence };
  }

  match = sentence.match(/^(.+?)\s+begins?\s+with\s+(.+)$/i);
  if (match) return { prompt: `What should ${match[1].toLocaleLowerCase()} begin with?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+points?\s+to\s+(.+)$/i);
  if (match) return { prompt: `What can ${match[1].toLocaleLowerCase()} point to?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+matter$/i);
  if (match) return { prompt: 'Which factors matter here?', answer: cleanSentence(match[1]), statement: sentence };

  match = sentence.match(/^(.+?)\s+are\s+prerequisites?\s+for\s+(.+)$/i);
  if (match) return { prompt: `What is required for ${match[2].toLocaleLowerCase()}?`, answer: cleanSentence(match[1]), statement: sentence };

  match = sentence.match(/^(.+?)\s+(?:is|are)\s+part\s+of\s+(.+)$/i);
  if (match) return { prompt: `What forms part of ${match[2].toLocaleLowerCase()}?`, answer: cleanSentence(match[1]), statement: sentence };

  match = sentence.match(/^(.+?)\s+stops?\s+when\s+(.+)$/i);
  if (match) return { prompt: `When must ${match[1].toLocaleLowerCase()} stop?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+helps?\s+(.+)$/i);
  if (match) {
    const auxiliary = subjectUsesDo(match[1]) ? 'do' : 'does';
    return { prompt: `How ${auxiliary} ${match[1].toLocaleLowerCase()} help?`, answer: cleanSentence(match[2]), statement: sentence };
  }

  match = sentence.match(/^(.+?)\s+differs?\s+from\s+(.+)$/i);
  if (match) return { prompt: `How does ${match[1].toLocaleLowerCase()} differ from ${match[2].toLocaleLowerCase()}?`, answer: sentence, statement: sentence };

  match = sentence.match(/^(.+?)\s+rel(?:y|ies)\s+on\s+(.+)$/i);
  if (match) {
    const auxiliary = subjectUsesDo(match[1]) ? 'do' : 'does';
    return { prompt: `What ${auxiliary} ${match[1].toLocaleLowerCase()} rely on?`, answer: cleanSentence(match[2]), statement: sentence };
  }

  match = sentence.match(/^(.+?)\s+matters?\s+(.+)$/i);
  if (match) return { prompt: `When does ${match[1].toLocaleLowerCase()} matter?`, answer: cleanSentence(match[2]), statement: sentence };

  match = sentence.match(/^(.+?)\s+(represent|represents|scale|scales|find|finds|manage|manages|link|links|pass|passes|remove|removes|measure|measures|convert|converts|induce|induces|cause|causes|reverse|reverses|determine|determines|describe|describes|count|counts|use|uses|give|gives|carry|carries|supply|supplies|keep|keeps|show|shows|identify|identifies|add|adds|increase|increases|equal|equals|combine|combines|compare|compares|minimize|minimizes|make|makes|isolate|isolates|affect|affects|divide|divides|surround|surrounds|terminate|terminates|reach|reaches|cancel|cancels|replace|replaces|open|opens|disconnect|disconnects|establish|establishes|detect|detects|limit|limits|share|shares|protect|protects|control|controls|respond|responds|create|creates|produce|produces|form|forms|store|stores|oppose|opposes|guide|guides|allow|allows|require|requires|provide|provides|support|supports|reduce|reduces|connect|connects|contribute|contributes|cover|covers|influence|influences|prevent|prevents|catch|catches|return|returns|maintain|maintains|change|changes|govern|governs|transfer|transfers|accommodate|accommodates|soften|softens|seat|seats|preserve|preserves|improve|improves|seal|seals|complete|completes|ensure|ensures|avoid|avoids|hold|holds|set|sets|switch|switches|interrupt|interrupts|operate|operates|include|includes|exclude|excludes|tolerate|tolerates|demand|demands|exceed|exceeds|take|takes|flow|flows|melt|melts|check|checks|define|defines|shape|shapes|modify|modifies|leave|leaves|release|releases|estimate|estimates|assume|assumes|deliver|delivers|shift|shifts|distribute|distributes|explain|explains|emphasise|emphasises|emphasize|emphasizes|simplify|simplifies|reveal|reveals|confirm|confirms|indicate|indicates|permit|permits|override|overrides|prove|proves|inform|informs|distinguish|distinguishes|narrow|narrows|communicate|communicates|reflect|reflects|constrain|constrains|address|addresses|enable|enables|offer|offers|solve|solves|serve|serves|follow|follows|coordinate|coordinates|decide|decides)\s+(.+)$/i);
  if (match) {
    const subject = cleanSentence(match[1]);
    const verb = baseVerb(match[2]);
    const auxiliary = subjectUsesDo(subject) ? 'do' : 'does';
    return {
      prompt: `What ${auxiliary} ${subject.toLocaleLowerCase()} ${verb}?`,
      answer: cleanSentence(match[3]),
      statement: sentence,
    };
  }

  match = sentence.match(/^(.+?)\s+(creates|produces|forms|stores|shares|adds|opposes|guides|intensifies)\s+(.+)$/i);
  if (match) return { prompt: `What does ${match[1].toLocaleLowerCase()} ${baseVerb(match[2])}?`, answer: cleanSentence(match[3]), statement: sentence };

  const action = sentence.match(/^(Choose|Select|Check|Test|Confirm|Verify|Read|Record|Scan|Keep|Plan|Allow|Restore|Coordinate|Place|Use|Compare|Distinguish|Separate|Establish|Terminate|Apply|Understand|Provide|Inspect|Match|Start|Layer|Light|Assess|Reserve|Trace|Locate|Evaluate|Maintain|Preserve|Follow|Relate|Size|Map|Commission|Fit)\b/i)?.[1]?.toLocaleLowerCase();
  if (action === 'choose' || action === 'select') {
    const object = sentence.replace(/^(Choose|Select)\s+/i, '').split(/\s+(?:for|from|according to|based on)\s+/i)[0];
    return { prompt: `What must be considered when ${action === 'choose' ? 'choosing' : 'selecting'} ${object.toLocaleLowerCase()}?`, answer: sentence, statement: sentence };
  }
  const actionPrompts: Record<string, string> = {
    check: `What must be checked in “${topic}”?`,
    test: `What must be tested in “${topic}”?`,
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
    terminate: 'What is required for a correct termination?',
    apply: 'What should be applied in this situation?',
    understand: 'What should you understand from this lesson?',
    provide: 'What must be provided?',
    inspect: 'What should be inspected?',
    match: 'What must be correctly matched?',
    start: 'What should you start with?',
    layer: 'How should the lighting be arranged?',
    light: 'What should the lighting illuminate?',
    assess: 'What must be assessed?',
    reserve: 'What space or capacity should be reserved?',
    trace: 'Which path should you trace?',
    locate: 'What must be located?',
    evaluate: 'What conditions must be evaluated?',
    maintain: 'What must be maintained?',
    preserve: 'What must be preserved?',
    follow: 'Which path or sequence should be followed?',
    relate: 'What relationship should be understood?',
    size: 'What must be considered when sizing the system?',
    map: 'What parts of the system should be mapped?',
    commission: 'What must be commissioned and verified?',
    fit: 'What must be fitted correctly?',
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
  if (match && match[1].split(/\s+/).length <= 16 && !/\b(?:while|but)\b|,/.test(match[1])) {
    return { prompt: `${match[2].toLocaleLowerCase() === 'are' ? 'What are' : 'What is'} ${match[1].toLocaleLowerCase()}?`, answer: cleanSentence(match[3]), statement: sentence };
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
    prompt: 'How would you explain this lesson point in your own words?',
    answer: sentence,
    statement: sentence,
  };
}

function reasoningDistractors(topic: string) {
  return [
    `It has no effect on ${topic.toLocaleLowerCase()}.`,
    'The opposite relationship always applies.',
    'Appearance alone gives the answer.',
  ];
}

function unsafeDistractors(_topic: string) {
  return [
    'Copy the demonstration without checking the actual conditions.',
    'Judge the work only by its appearance.',
    'Assume it is safe because it operates.',
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
      const conceptQuestions = guide.keyConcepts.map((concept) => directConceptQuestion(concept, lessonFocus));
      const flashcards: Flashcard[] = [
        ...guide.keyConcepts.map((concept, conceptIndex) => {
          const conceptQuestion = conceptQuestions[conceptIndex];
          return {
            id: `${lesson.id}-concept-${conceptIndex + 1}`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
            kind: 'Core idea' as const,
            front: conceptQuestion.prompt,
            back: conceptQuestion.answer,
          };
        }),
        {
          id: `${lesson.id}-remember`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Safety check',
          front: 'What is the most important rule to remember?',
          back: guide.remember,
        },
        {
          id: `${lesson.id}-practice`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Application',
          front: 'How could you apply or demonstrate this lesson?',
          back: firstSentence(guide.practicalConnection),
        },
      ];

      if (lesson.regulationSensitive) {
        flashcards.push({
          id: `${lesson.id}-kenya`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Kenya check',
          front: 'What must you verify before using this method in Kenya?',
          back: firstSentence(lesson.regulationStatus || kenyaGuardrail),
        });
      }

      const questions: AssessmentQuestion[] = [];

      guide.keyConcepts.forEach((concept, conceptIndex) => {
        const conceptQuestion = conceptQuestions[conceptIndex];
        const relatedAnswers = conceptQuestions.filter((_, index) => index !== conceptIndex).map((item) => item.answer);
        const choice = rotateCorrectOption(conceptQuestion.answer, [...relatedAnswers, ...reasoningDistractors(lesson.title)], lessonIndex + conceptIndex + 1);
        questions.push({
          id: `${lesson.id}-q-concept-${conceptIndex + 1}`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          cardId: `${lesson.id}-concept-${conceptIndex + 1}`,
          prompt: conceptQuestion.prompt,
          kind: 'Recall',
          ...choice,
          explanation: conceptQuestion.statement,
        });

      });

      const rememberChoice = rotateCorrectOption(guide.remember, unsafeDistractors(lesson.title), lessonIndex + 5);
      questions.push({
        id: `${lesson.id}-q-remember`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-remember`,
        prompt: 'Which rule from this lesson should you remember?',
        kind: 'Safety check',
        ...rememberChoice,
        explanation: guide.remember,
      });

      const practicalAnswer = firstSentence(guide.practicalConnection);
      const practiceChoice = rotateCorrectOption(practicalAnswer, unsafeDistractors(lesson.title), lessonIndex + 6);
      questions.push({
        id: `${lesson.id}-q-practice`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: 'Which activity best applies what this lesson taught?',
        kind: 'Application',
        ...practiceChoice,
        explanation: practicalAnswer,
      });

      if (lesson.regulationSensitive) {
        const correct = lesson.regulationStatus || kenyaGuardrail;
        const choice = rotateCorrectOption(firstSentence(correct), [
          'A method used elsewhere automatically proves compliance in Kenya without further checks.',
          'Anyone may carry out specialised electrical work after seeing one demonstration.',
          'Only the equipment colour and appearance need to be checked before installation.',
        ], lessonIndex + 7);
        questions.push({
          id: `${lesson.id}-q-kenya`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-kenya`,
          prompt: 'Before using this method in Kenya, what must be verified?',
          kind: 'Kenya check',
          ...choice,
          explanation: firstSentence(correct),
        });
      }

      for (const check of connectionChecks[lesson.id] ?? []) {
        const cardId = `${lesson.id}-connection-${check.id}`;
        flashcards.push({ id: cardId, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, front: check.prompt, back: check.explanation, kind: 'Application' });
        questions.push({ id: `${cardId}-question`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId, prompt: check.prompt, ...rotateCorrectOption(check.correct, check.distractors, lessonIndex + 8), explanation: check.explanation, kind: 'Application' });
      }
      lessons[lesson.id] = { lessonId: lesson.id, moduleId: module.id, flashcards, questions };

      if (flashcards.length < 5 || questions.length < 5) {
        throw new Error(`Lesson ${lesson.id} does not contain enough retrieval practice.`);
      }
      questions.forEach((question) => {
        if (question.options.length !== 4 || unique(question.options).length !== 4) {
          throw new Error(`Question ${question.id} must have four distinct answer choices.`);
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
      flashcards: groupedLessonSelection(lessonAssessments.map((assessment) => [...assessment.flashcards.filter(card => card.id.includes('-connection-')), ...assessment.flashcards.filter(card => !card.id.includes('-connection-'))]), 40),
      questions: groupedLessonSelection(lessonAssessments.map((assessment) => [...assessment.questions.filter(question => question.id.includes('-connection-')), ...assessment.questions.filter(question => !question.id.includes('-connection-'))]), 50),
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
