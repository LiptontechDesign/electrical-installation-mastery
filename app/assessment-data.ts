import type { LessonGuide } from './lesson-guides';
import { hasCuratedStandard, topicsForLesson } from './standards-data';
import { standardsChecks, type StandardsCheck } from './standards-checks';
import { connectionChecks } from './connection-assessments';
import { conceptDistractors } from './concept-distractors';
import { electricalTerms, lessonKnowledge, type KnowledgeTerm } from './knowledge-graph';
import { checkpointPlan } from './checkpoint-plan';
import { standaloneCheckpointQuestion } from './checkpoint-questions';
import { recallExtras } from './recall-extras';
import { teachingForQuestion, type AnswerTeaching } from './answer-teaching';
import { overviewAnswers, overviewWorking, overviewPrompts } from './overview-answers';
import type { QuestionDesign } from './learning-design';
import { applyQuestionRevision } from './question-revisions';

export type Flashcard = {
  id: string;
  lessonId: string;
  lessonTitle: string;
  moduleId: string;
  front: string;
  back: string;
  design?: QuestionDesign;
  kind: 'Core idea' | 'Application' | 'Safety check' | 'Standards check';
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
  feedback?: string[];
  teaching?: AnswerTeaching;
  design?: QuestionDesign;
  kind: 'Recall' | 'Application' | 'Safety check' | 'Standards check';
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

export type CheckpointAssessment = {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  throughLessonId: string;
  lessonIds: string[];
  newLessonIds: string[];
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

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function feedbackForAlternative(question: AssessmentQuestion, option: string, index: number) {
  const existing = question.feedback?.[index]?.trim();
  if (existing && index !== question.answer) return existing;
  const lower = option.toLowerCase();
  const correction = question.kind === 'Standards check'
    ? 'The relevant requirement must be checked against the actual installation and its stated conditions.'
    : question.kind === 'Safety check'
      ? 'Normal operation or a single observation cannot replace the required safe method and evidence.'
      : question.kind === 'Application'
        ? 'The practical decision must follow the governing relationship and the actual circuit conditions.'
        : 'The electrical relationship must match the quantity or condition in the question.';
  if (/\b(always|never|only|every|any|regardless|automatically)\b/.test(lower)) return `This treats one condition as a universal rule. ${correction}`;
  if (/\b(appearance|colour|color|looks|works|operates|function)\b/.test(lower)) return `Appearance or normal operation does not establish the condition being tested. ${correction}`;
  if (/\b(same|equal|average|sum|add|subtract|multiply|divide|reciprocal)\b/.test(lower)) return `This uses the wrong relationship or combination rule for the stated quantities. ${correction}`;
  if (/\b(volts?|amperes?|ohms?|watts?|joules?|coulombs?|hertz|seconds?|metres?|milliamperes?)\b/.test(lower)) return `This mixes a quantity, unit, or relationship with the one required here. ${correction}`;
  return `This does not provide the model needed for the question. ${correction}`;
}

/** Every learner choice must have a direct repair path. */
function completeQuestionDesign(question: AssessmentQuestion): AssessmentQuestion {
  const existing = question.design;
  if (existing?.diagnostics.length === question.options.length
    && existing.diagnostics.every((item, index) => index === question.answer ? item === null : Boolean(item?.diagnosis && item?.repair))) return question;
  const why = existing?.why ?? (question.kind === 'Application' ? question.explanation : question.teaching?.reasoning ?? question.explanation);
  const diagnostics = question.options.map((option, index) => index === question.answer ? null : {
    diagnosis: feedbackForAlternative(question, option, index),
    repair: why,
  });
  return {
    ...question,
    design: {
      objective: existing?.objective ?? question.prompt,
      principle: existing?.principle ?? question.options[question.answer],
      why,
      distinction: existing?.distinction,
      keyIdea: existing?.keyIdea ?? question.explanation,
      practice: existing?.practice ?? question.teaching?.application ?? question.explanation,
      workingTex: existing?.workingTex,
      followUp: existing?.followUp,
      diagnostics,
      authorNote: existing?.authorNote ?? 'Learner choices are checked for a relationship, unit, evidence, safety, or standards misconception; the selected error receives a repair explanation.',
    },
  };
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

function rotateStandardsCheck(check: StandardsCheck, seed: number) {
  const correct = { option: check.options[check.answer], feedback: check.feedback[check.answer] };
  const alternatives = check.options
    .map((option, index) => ({ option, feedback: check.feedback[index], index }))
    .filter((item) => item.index !== check.answer)
    .map(({ option, feedback }) => ({ option, feedback }));
  const answer = seed % 4;
  const ordered = [...alternatives];
  ordered.splice(answer, 0, correct);
  return {
    options: ordered.map((item) => item.option),
    feedback: ordered.map((item) => item.feedback),
    answer,
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

const actionPrompts: Record<string, string> = {
  check: 'What must be checked in this lesson?',
  test: 'What must be tested in this lesson?',
  confirm: 'What must be confirmed in this lesson?',
  verify: 'What must be verified in this lesson?',
  read: 'What information must be read before applying this lesson?',
  record: 'What must be recorded when applying this lesson?',
  scan: 'What must be checked before the work starts?',
  keep: 'What must be kept correctly controlled?',
  plan: 'What must be planned?',
  allow: 'What allowances are required?',
  restore: 'What must be restored before the work is complete?',
  coordinate: 'What must be coordinated?',
  place: 'What must be considered when positioning equipment?',
  position: 'What must be considered when positioning equipment?',
  use: 'What should be used?',
  compare: 'What must be compared?',
  distinguish: 'What must be distinguished?',
  separate: 'What must be kept separate?',
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
  group: 'What should be grouped together?',
  configure: 'What must be configured?',
  identify: 'What must be identified?',
};

function imperativeQuestion(sentence: string, topic: string) {
  const action = sentence.match(/^(Choose|Select|Check|Test|Confirm|Verify|Read|Record|Scan|Keep|Plan|Allow|Restore|Coordinate|Place|Position|Use|Compare|Distinguish|Separate|Establish|Terminate|Apply|Understand|Provide|Inspect|Match|Start|Layer|Light|Assess|Reserve|Trace|Locate|Evaluate|Maintain|Preserve|Follow|Relate|Size|Map|Commission|Fit|Group|Configure|Identify)\b/i)?.[1]?.toLocaleLowerCase();
  if (!action) return undefined;
  if (action === 'choose' || action === 'select') {
    const object = sentence.replace(/^(Choose|Select)\s+/i, '').split(/\s+(?:for|from|according to|based on)\s+/i)[0];
    return { prompt: `What must be considered when ${action === 'choose' ? 'choosing' : 'selecting'} ${object.toLocaleLowerCase()}?`, answer: sentence, statement: sentence };
  }
  const prompt = actionPrompts[action]?.replace('this lesson', `“${topic}”`);
  return prompt ? { prompt, answer: sentence, statement: sentence } : undefined;
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
  const imperative = imperativeQuestion(sentence, topic);
  if (imperative) return imperative;

  const qualifiedModal = sentence.match(/^(.+?)\s+(must|should)\s+(not\s+)?((?:safely|correctly)\s+)?([a-z]+)\s+(.+)$/i);
  if (qualifiedModal && (qualifiedModal[3] || qualifiedModal[4])) {
    const object = cleanSentence(qualifiedModal[6]);
    const prepositionalObject = object.match(/^(on|with|to|from|for|against|within|at|through|between|under|over|into|by)\s+(.+)$/i);
    return {
      prompt: `What ${qualifiedModal[2].toLocaleLowerCase()} ${qualifiedModal[1].toLocaleLowerCase()} ${qualifiedModal[3] ?? ''}${qualifiedModal[4] ?? ''}${baseVerb(qualifiedModal[5])}${prepositionalObject ? ` ${prepositionalObject[1].toLocaleLowerCase()}` : ''}?`,
      answer: prepositionalObject ? cleanSentence(prepositionalObject[2]) : object,
      statement: sentence,
    };
  }

  const reason = sentence.match(/^(.+?)\s+(is|are)\s+(.+?)\s+because\s+(.+)$/i);
  if (reason) return { prompt: `Why ${reason[2]} ${reason[1].toLocaleLowerCase()} ${reason[3]}?`, answer: cleanSentence(reason[4]), statement: sentence };
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

  match = sentence.match(/^(.+?)\s+(must|should|needs? to|has to)\s+(.+)$/i);
  if (match && match[1].split(/\s+/).length <= 10) {
    const modal = /^(must|should)$/i.test(match[2]) ? match[2].toLocaleLowerCase() : undefined;
    return {
      prompt: modal && !/^be\b/i.test(match[3])
        ? `What ${modal} ${match[1].toLocaleLowerCase()} do?`
        : `What is required of ${match[1].toLocaleLowerCase()}?`,
      answer: modal && !/^be\b/i.test(match[3]) ? cleanSentence(match[3]) : `${match[2]} ${cleanSentence(match[3])}`,
      statement: sentence,
    };
  }

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
    prompt: 'Which statement best explains this lesson point?',
    answer: sentence,
    statement: sentence,
  };
}

function reasoningDistractors() {
  return [
    'The result stays the same regardless of the circuit conditions.',
    'The opposite relationship always applies.',
    'Appearance alone gives the answer.',
  ];
}

function unsafeDistractors() {
  return [
    'Copy the demonstration without checking the actual conditions.',
    'Judge the work only by its appearance.',
    'Assume it is safe because it operates.',
  ];
}

function contextualDistractors(pool: string[], correct: string, seed: number) {
  const alternatives = unique(pool).filter((item) => item !== correct);
  if (!alternatives.length) return unsafeDistractors();
  return Array.from({ length: Math.min(3, alternatives.length) }, (_, index) => alternatives[(seed + index) % alternatives.length]);
}

function lessonTerms(lessonId: string) {
  const linkedNames = new Set((lessonKnowledge[lessonId]?.terms ?? []).map((item) => item.term));
  return electricalTerms.filter((item) => linkedNames.has(item.term)).slice(0, 2);
}

function termDefinitionDistractors(selected: KnowledgeTerm) {
  return unique([
    ...electricalTerms.filter((item) => item.category === selected.category && item.term !== selected.term).map((item) => item.definition),
    ...electricalTerms.filter((item) => item.category !== selected.category).map((item) => item.definition),
  ]).filter((definition) => definition !== selected.definition).slice(0, 3);
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

function roundRobinQuestions(groups: AssessmentQuestion[][], limit: number, kind?: AssessmentQuestion['kind']) {
  const priority = kind === 'Application'
    ? groups.flatMap((group) => group.filter((question) => question.kind === kind && question.id.includes('-connection-'))).slice(0, limit)
    : [];
  const priorityIds = new Set(priority.map((question) => question.id));
  const queues = groups.map((group) => group.filter((question) => (!kind || question.kind === kind) && !priorityIds.has(question.id)));
  const selected: AssessmentQuestion[] = [...priority];
  let depth = 0;
  while (selected.length < limit && queues.some((queue) => depth < queue.length)) {
    for (const queue of queues) {
      const question = queue[depth];
      if (question) selected.push(question);
      if (selected.length === limit) break;
    }
    depth += 1;
  }
  return selected;
}

function balancedModuleQuestions(groups: AssessmentQuestion[][], limit: number) {
  const total = groups.reduce((count, group) => count + group.length, 0);
  const target = Math.min(limit, total);
  const quotas: Record<AssessmentQuestion['kind'], number> = {
    Recall: Math.floor(target * 0.5),
    Application: Math.floor(target * 0.2),
    'Safety check': Math.floor(target * 0.15),
    'Standards check': target - Math.floor(target * 0.5) - Math.floor(target * 0.2) - Math.floor(target * 0.15),
  };
  const kindOrder: AssessmentQuestion['kind'][] = ['Recall', 'Application', 'Safety check', 'Standards check'];
  const buckets = Object.fromEntries(kindOrder.map((kind) => [kind, roundRobinQuestions(groups, quotas[kind], kind)])) as Record<AssessmentQuestion['kind'], AssessmentQuestion[]>;
  const selected: AssessmentQuestion[] = [];
  const selectedIds = new Set<string>();
  let depth = 0;
  while (selected.length < target && kindOrder.some((kind) => depth < buckets[kind].length)) {
    for (const kind of kindOrder) {
      const question = buckets[kind][depth];
      if (question) {
        selected.push(question);
        selectedIds.add(question.id);
      }
    }
    depth += 1;
  }
  if (selected.length < target) {
    for (const question of roundRobinQuestions(groups.map((group) => group.filter((item) => !selectedIds.has(item.id))), target - selected.length)) {
      selected.push(question);
      selectedIds.add(question.id);
    }
  }
  return selected.slice(0, target);
}

function checkpointQuestions(groups: AssessmentQuestion[][], checkpointNumber: number, newGroupSize: number) {
  groups = groups.map(group => group.filter(question => !/-q-(remember|practice)$/.test(question.id)));
  const target = Math.min(30, Math.max(10, groups.length * 2));
  const preferredKinds: AssessmentQuestion['kind'][] = ['Recall', 'Application', 'Safety check', 'Standards check'];
  const newGroupStart = Math.max(0,groups.length-newGroupSize);
  const coverageIndices = groups.length<=target
    ? groups.map((_,index)=>index)
    : [
      ...Array.from({length:Math.max(0,target-newGroupSize)},(_,index)=>Math.floor(index*newGroupStart/Math.max(1,target-newGroupSize))),
      ...Array.from({length:newGroupSize},(_,index)=>newGroupStart+index),
    ];
  const coverage = coverageIndices.map((groupIndex) => {
    const group=groups[groupIndex];
    const preferred = preferredKinds[(groupIndex + checkpointNumber - 1) % preferredKinds.length];
    return group.find((question) => question.kind === preferred)
      ?? group.find((question) => question.kind === 'Application')
      ?? group[0];
  }).filter((question): question is AssessmentQuestion => Boolean(question));
  const selectedIds = new Set(coverage.map((question) => question.id));
  const remaining = groups.map((group) => group.filter((question) => !selectedIds.has(question.id)));
  const fill = balancedModuleQuestions(remaining, Math.max(0, target - coverage.length));
  return [...coverage, ...fill].slice(0, target);
}

export function buildAssessmentBank(modules: readonly CourseModule[], guides: Record<string, LessonGuide>, options: { includeCheckpoints?: boolean } = {}) {
  const lessons: Record<string, LessonAssessment> = {};
  const moduleAssessments: Record<string, ModuleAssessment> = {};
  const checkpoints: Record<string, CheckpointAssessment> = {};
  const checkpointsByModule: Record<string, CheckpointAssessment[]> = {};

  modules.forEach((module) => {
    const moduleRememberPool = module.lessons.map((item)=>guides[item.id]?.remember).filter((item):item is string=>Boolean(item));
    const modulePracticePool = module.lessons.map((item)=>guides[item.id]?.practicalConnection).filter((item):item is string=>Boolean(item)).map(firstSentence);
    module.lessons.forEach((lesson, lessonIndex) => {
      const guide = guides[lesson.id];
      if (!guide) throw new Error(`Lesson ${lesson.id} cannot build an assessment without a video-specific teaching guide.`);
      if (guide.keyConcepts.length < 3) throw new Error(`Lesson ${lesson.id} needs at least three specific key concepts.`);
      const lessonFocus = lesson.title;
      const conceptQuestions = guide.keyConcepts.map((concept) => directConceptQuestion(concept, lessonFocus));
      const primaryTerms = lessonTerms(lesson.id);
      const standardTopic = lesson.regulationSensitive || hasCuratedStandard(lesson.id)
        ? topicsForLesson(`${lesson.title} ${guide.summary}`, lesson.id).find((topic) => topic.id !== 'basic-protection')
        : undefined;
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

      primaryTerms.forEach((term,termIndex)=>flashcards.push({
        id: `${lesson.id}-term-${termIndex+1}`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
        kind: 'Core idea',
        front: `What does “${term.term}” mean in this lesson?`,
        back: term.definition,
      }));

      if (standardTopic) {
        const standardCheck = standardsChecks[standardTopic.id];
        flashcards.push({
          id: `${lesson.id}-standard`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          kind: 'Standards check',
          front: standardCheck?.prompt ?? 'Which installation principle connects to this lesson?',
          back: standardCheck?.options[standardCheck.answer] ?? standardTopic.principle,
        });
      }

      const questions: AssessmentQuestion[] = [];

      guide.keyConcepts.forEach((concept, conceptIndex) => {
        const conceptQuestion = conceptQuestions[conceptIndex];
        const relatedAnswers = conceptQuestions.filter((_, index) => index !== conceptIndex).map((item) => item.statement);
        const authored = conceptQuestion.prompt === 'What should you start with?' && !/detector/i.test(lesson.title) ? undefined : conceptDistractors[conceptQuestion.prompt];
        const choice = rotateCorrectOption(conceptQuestion.answer, authored ?? [...relatedAnswers, ...reasoningDistractors()], lessonIndex + conceptIndex + 1);
        questions.push({
          id: `${lesson.id}-q-concept-${conceptIndex + 1}`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          cardId: `${lesson.id}-concept-${conceptIndex + 1}`,
          prompt: conceptQuestion.prompt,
          kind: 'Recall',
          ...choice,
          explanation: conceptQuestion.statement,
        });

      });

      primaryTerms.forEach((term,termIndex)=>{
        const choice = rotateCorrectOption(term.definition, termDefinitionDistractors(term), lessonIndex + termIndex + 4);
        questions.push({
          id: `${lesson.id}-q-term-${termIndex+1}`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id,
          cardId: `${lesson.id}-term-${termIndex+1}`,
          prompt: `Which definition best matches “${term.term}”?`,
          kind: 'Recall',
          ...choice,
          explanation: `${term.term}: ${term.definition}${term.contrast?` ${term.contrast}`:''}`,
        });
      });

      const rememberChoice = rotateCorrectOption(guide.remember, contextualDistractors(moduleRememberPool,guide.remember,lessonIndex), lessonIndex + 5);
      questions.push({
        id: `${lesson.id}-q-remember`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-remember`,
        prompt: `Which statement is the key safety or reliability priority in “${lesson.title}”?`,
        kind: 'Safety check',
        ...rememberChoice,
        explanation: guide.remember,
      });

      const practicalAnswer = firstSentence(guide.practicalConnection);
      const practiceChoice = rotateCorrectOption(practicalAnswer, contextualDistractors(modulePracticePool,practicalAnswer,lessonIndex+1), lessonIndex + 6);
      questions.push({
        id: `${lesson.id}-q-practice`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-practice`,
        prompt: `Which activity best applies “${lesson.title}”?`,
        kind: 'Application',
        ...practiceChoice,
        explanation: practicalAnswer,
      });

      if (standardTopic) {
        const standardCheck = standardsChecks[standardTopic.id];
        const correct = standardCheck?.options[standardCheck.answer] ?? firstSentence(standardTopic.principle);
        const distractors = standardCheck?.options.filter((_, index) => index !== standardCheck.answer) ?? [
          'A successful functional test establishes every protective requirement.',
          'Anyone may carry out specialised electrical work after seeing one demonstration.',
          'Only the equipment colour and appearance need to be checked before installation.',
        ];
        const choice = standardCheck
          ? rotateStandardsCheck(standardCheck, lessonIndex + 7)
          : rotateCorrectOption(correct, distractors, lessonIndex + 7);
        questions.push({
          id: `${lesson.id}-q-standard`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId: `${lesson.id}-standard`,
          prompt: standardCheck?.prompt ?? 'Which installation principle connects to this lesson?',
          kind: 'Standards check',
          ...choice,
          explanation: standardCheck ? `${standardCheck.feedback[standardCheck.answer]} ${standardTopic.principle}` : firstSentence(correct),
        });
      }

      for (const check of connectionChecks[lesson.id] ?? []) {
        const cardId = `${lesson.id}-connection-${check.id}`;
        flashcards.push({ id: cardId, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, front: check.prompt, back: check.explanation, kind: 'Application' });
        questions.push({ id: `${cardId}-question`, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, cardId, prompt: check.prompt, ...rotateCorrectOption(check.correct, check.distractors, lessonIndex + 8), explanation: check.explanation, kind: 'Application' });
      }
      const extra = recallExtras[lesson.id];
      if (extra) {
        const cardId = `${lesson.id}-transfer-recall`;
        flashcards.push({ id: cardId, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, front: extra.prompt, back: extra.explanation, kind: 'Application' });
        questions.push({ id: `${cardId}-question`, cardId, lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, prompt: extra.prompt, explanation: extra.explanation, kind: 'Application', ...rotateCorrectOption(extra.correct, extra.distractors, lessonIndex + 9) });
      }
      const clearQuestions = questions
        .filter(question => !/-q-(remember|practice)$/.test(question.id))
        .map(standaloneCheckpointQuestion)
        .map(question => ({ ...question,
          explanation: (question.id.includes('-q-term-') ? question.options[question.answer] : question.explanation).replace(/^Correct\.\s*/, ''),
          teaching: teachingForQuestion(question),
        })).map(applyQuestionRevision).map(completeQuestionDesign);
      const clearCards = flashcards.filter(card => !/-(remember|practice)$/.test(card.id)).map(card => {
        const question = clearQuestions.find(item => item.cardId === card.id);
        return question ? { ...card, front: question.prompt, back: question.options[question.answer], design: question.design ?? {
          objective: question.prompt, principle: question.options[question.answer], why: question.kind === 'Application' ? question.explanation : question.teaching!.reasoning,
          keyIdea: question.explanation, practice: question.teaching!.application, diagnostics: [],
          authorNote: 'Existing item; reasoning and practical example separated from the answer.',
        } } : card;
      });
      if (!overviewAnswers[lesson.id]) throw new Error('Missing exact overview answer: ' + lesson.id);
      clearCards.push({ id: lesson.id + '-overview-retrieval', lessonId: lesson.id, lessonTitle: lesson.title, moduleId: module.id, kind: 'Application',
        front: overviewPrompts[lesson.id] ?? guide.checkYourself, back: overviewAnswers[lesson.id],
        design: { objective: overviewPrompts[lesson.id] ?? guide.checkYourself, principle: overviewAnswers[lesson.id], why: clearQuestions[0].teaching!.reasoning, keyIdea: guide.remember, practice: clearQuestions[0].teaching!.application, workingTex: overviewWorking[lesson.id], diagnostics: [], authorNote: 'Independent retrieval prompt with an authored answer; self-rating schedules this exact card.' },
      });
      lessons[lesson.id] = { lessonId: lesson.id, moduleId: module.id, flashcards: clearCards, questions: clearQuestions };

      if (clearCards.length < 5 || clearQuestions.length < 5) {
        throw new Error(`Lesson ${lesson.id} does not contain enough retrieval practice.`);
      }
      clearQuestions.forEach((question) => {
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
      questions: balancedModuleQuestions(lessonAssessments.map((assessment) => [
        ...assessment.questions.filter((question) => question.id.includes('-connection-')),
        ...assessment.questions.filter((question) => !question.id.includes('-connection-')),
      ]), 50),
    };

    if(options.includeCheckpoints===false){
      checkpointsByModule[module.id]=[];
      return;
    }
    const planned = checkpointPlan[module.id];
    if (!planned?.length) throw new Error(`Module ${module.id} needs at least one required checkpoint.`);
    let previousBoundary = -1;
    checkpointsByModule[module.id] = planned.map((item, checkpointIndex) => {
      const boundary = module.lessons.findIndex((lesson) => lesson.id === item.throughLessonId);
      if (boundary <= previousBoundary) throw new Error(`Checkpoint ${checkpointIndex + 1} in ${module.id} has an invalid lesson boundary.`);
      const cumulativeLessons = module.lessons.slice(0, boundary + 1);
      const newLessons = module.lessons.slice(previousBoundary + 1, boundary + 1);
      previousBoundary = boundary;
      const id = `${module.id}-checkpoint-${checkpointIndex + 1}`;
      const assessment: CheckpointAssessment = {
        id,
        moduleId: module.id,
        number: checkpointIndex + 1,
        title: item.title,
        throughLessonId: item.throughLessonId,
        lessonIds: cumulativeLessons.map((lesson) => lesson.id),
        newLessonIds: newLessons.map((lesson) => lesson.id),
        flashcards: cumulativeLessons.flatMap((lesson) => lessons[lesson.id].flashcards),
        questions: checkpointQuestions(cumulativeLessons.map((lesson) => lessons[lesson.id].questions), checkpointIndex + 1, newLessons.length),
      };
      checkpoints[id] = assessment;
      return assessment;
    });
    if (previousBoundary !== module.lessons.length - 1) throw new Error(`The final checkpoint in ${module.id} must close the module.`);
  });

  const allFlashcards = Object.values(lessons).flatMap((assessment) => assessment.flashcards);
  const expectedLessonCount = modules.reduce((total, module) => total + module.lessons.length, 0);
  if (Object.keys(lessons).length !== expectedLessonCount) {
    throw new Error(`Assessment coverage mismatch: expected ${expectedLessonCount} lessons and built ${Object.keys(lessons).length}.`);
  }
  return {
    lessons,
    modules: moduleAssessments,
    checkpoints,
    checkpointsByModule,
    checkpointList: modules.flatMap((module) => checkpointsByModule[module.id]),
    allFlashcards,
    flashcardLookup: new Map(allFlashcards.map((card) => [card.id, card])),
    totalLessonQuestions: Object.values(lessons).reduce((total, assessment) => total + assessment.questions.length, 0),
  };
}
