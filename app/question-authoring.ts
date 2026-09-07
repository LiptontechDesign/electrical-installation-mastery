import type { AssessmentQuestion } from './assessment-data';
import type { LessonGuide } from './lesson-guides';
import type { Misconception, QuestionDesign, Retrieval } from './learning-design';
import { electricalTerms } from './knowledge-graph';
import { recallDistractors } from './recall-distractors';

const sentence = (value: string) => value.trim().replace(/\s+/g, ' ').replace(/[.?!]+$/, '');
const withPeriod = (value: string) => `${sentence(value)}.`;

function termNamedByDefinition(definition: string) {
  const clean = sentence(definition).replace(/[“”"]/g, '').toLocaleLowerCase();
  return electricalTerms.find((term) => sentence(term.definition).replace(/[“”"]/g, '').toLocaleLowerCase() === clean)?.term;
}

function targetTerm(question: AssessmentQuestion) {
  return question.id.match(/-q-term-\d+$/)?.[0]
    ? question.prompt.match(/^What does (.+) mean\?$/)?.[1]
    : undefined;
}

function strengthenedPrompt(question: AssessmentQuestion) {
  const answer = sentence(question.options[question.answer]);
  const notBe = question.prompt.match(/^What can (.+) not be\?$/i);
  if (notBe) return `Why should ${notBe[1].toLocaleLowerCase()} not be ${answer.toLocaleLowerCase()}?`;

  const mustBe = question.prompt.match(/^What must (.+) be\?$/i);
  if (mustBe && answer.length < 120) return `What must ${mustBe[1].toLocaleLowerCase()} be to meet this requirement?`;

  if (/^Which statement best explains this lesson point\?$/i.test(question.prompt)) {
    return `Which statement correctly explains the key decision in ${question.lessonTitle}?`;
  }
  return question.prompt;
}

function conceptMistake(question: AssessmentQuestion, option: string, index: number): Pick<Misconception, 'diagnosis' | 'partlyRight'> {
  const lessonMisconceptions = recallDistractors[question.lessonId];
  const statedMistake = question.id.match(/-q-concept-(\d+)$/)?.[1];
  const expectedMistake = statedMistake ? lessonMisconceptions?.[Number(statedMistake) - 1] : undefined;
  const choice = sentence(option);

  if (expectedMistake && sentence(expectedMistake).toLocaleLowerCase() === choice.toLocaleLowerCase()) {
    return { diagnosis: `This changes the relationship being tested. ${withPeriod(choice)} It conflicts with the stated condition in the question.` };
  }

  const namedTerm = termNamedByDefinition(choice);
  if (namedTerm) {
    return { diagnosis: `This defines ${namedTerm}. It is a real electrical idea, but it is not the principle this question asks you to identify.`, partlyRight: `You have recognised a related electrical term, but its meaning belongs to a different question.` };
  }

  const focus = sentence(question.prompt).replace(/^what |^which |^how |^why |^where |^when /i, '').toLocaleLowerCase();
  return {
    diagnosis: `This statement describes a different lesson point: ${withPeriod(choice)} It does not answer ${focus}.`,
    partlyRight: 'This is a useful point from the same topic, but it applies to a different condition, function or decision.',
  };
}

function termMistake(target: string, option: string): Pick<Misconception, 'diagnosis' | 'partlyRight'> {
  const namedTerm = termNamedByDefinition(option);
  if (namedTerm) return {
    diagnosis: `This is the meaning of ${namedTerm}, not ${target}. Similar electrical terms describe different quantities, functions or protective measures.`,
    partlyRight: `${namedTerm} is a valid term; it simply does not name the target idea.`,
  };
  return { diagnosis: `This is not the meaning of ${target}. Match the term to its own quantity, function or installation role rather than to a related idea.` };
}

function practicalMistake(question: AssessmentQuestion, option: string, index: number): Pick<Misconception, 'diagnosis' | 'partlyRight'> {
  const choice = sentence(option);
  if (/\b(looks|appearance|operates|works|function)\b/i.test(choice)) {
    return { diagnosis: 'This treats appearance or normal operation as sufficient evidence. The stated task needs the relevant inspection, calculation or test result.' };
  }
  if (/\b(always|never|every|any|regardless|automatically)\b/i.test(choice)) {
    return { diagnosis: 'This turns a conditional decision into a universal rule. Installation decisions depend on the actual circuit, environment and specified requirements.' };
  }
  const focus = sentence(question.prompt).replace(/^what |^which |^how |^why |^where |^when /i, '').toLocaleLowerCase();
  return { diagnosis: `This response concerns a different task or stage: ${withPeriod(choice)} It does not establish ${focus}.` };
}

function diagnosisFor(question: AssessmentQuestion, option: string, index: number, target?: string): Pick<Misconception, 'diagnosis' | 'partlyRight'> {
  const existing = sentence(question.feedback?.[index] ?? '');
  if (question.kind === 'Standards check' && existing && !/^Correct\b/i.test(existing)) return { diagnosis: withPeriod(existing) };
  if (target) return termMistake(target, option);
  if (question.id.includes('-q-concept-')) return conceptMistake(question, option, index);
  return practicalMistake(question, option, index);
}

function distinctionFor(question: AssessmentQuestion, target?: string) {
  if (target) {
    const related = question.options
      .filter((_, index) => index !== question.answer)
      .map(termNamedByDefinition)
      .find((term): term is string => Boolean(term));
    return related
      ? `${target} must be distinguished from ${related}; they do not name the same electrical quantity or function.`
      : `${target} has a specific meaning in electrical work; a related term cannot be substituted for it.`;
  }

  if (question.kind === 'Standards check') {
    return 'A required condition is one part of a coordinated installation decision; function, protection and verification still need their own evidence.';
  }
  if (question.kind === 'Safety check') {
    return 'Stopping equipment, normal operation and evidence of safe isolation are different conditions and must not be confused.';
  }
  if (question.kind === 'Application') {
    return 'A practical action is justified by the circuit condition and intended evidence, not by a familiar sequence alone.';
  }
  return `Keep the exact principle in view: each answer choice must address ${sentence(question.prompt).toLocaleLowerCase()}.`;
}

function followUpFor(question: AssessmentQuestion, guide: LessonGuide): Retrieval {
  const answer = withPeriod(question.options[question.answer]);
  if (question.kind === 'Standards check') {
    return {
      prompt: `Before accepting work connected with ${question.lessonTitle}, what evidence must support the decision?`,
      answer,
      why: `${sentence(question.explanation)}. The required condition must be assessed with the actual circuit and installation conditions.`,
    };
  }
  if (question.kind === 'Safety check') {
    return {
      prompt: `During practical work on ${question.lessonTitle}, what is the key safety decision to recall?`,
      answer,
      why: `${sentence(question.explanation)}. ${sentence(guide.remember)}.`,
    };
  }
  if (question.kind === 'Application') {
    return {
      prompt: `When applying ${question.lessonTitle} on site, what should guide the next decision?`,
      answer,
      why: `${sentence(question.explanation)}. ${sentence(guide.practicalConnection)}`,
    };
  }
  return {
    prompt: `Without the answer choices, what is the key point to recall about ${question.lessonTitle}?`,
    answer,
    why: `${sentence(question.explanation)}. ${sentence(guide.practicalConnection)}`,
  };
}

/**
 * Gives each retained source item the same learner-facing structure as the
 * hand-authored foundation items: a precise target, a diagnosis for each wrong
 * choice, a repair, an explicit distinction and a second retrieval opportunity.
 */
export function authorQuestion(question: AssessmentQuestion, guide: LessonGuide): AssessmentQuestion {
  if (question.design?.authorNote.startsWith('Replaces sentence recognition')) return question;

  const prompt = strengthenedPrompt(question);
  const target = targetTerm({ ...question, prompt });
  const why = sentence(question.kind === 'Application' ? question.explanation : question.teaching?.reasoning ?? question.explanation);
  const practice = sentence(question.teaching?.application ?? guide.practicalConnection);
  const diagnostics: QuestionDesign['diagnostics'] = question.options.map((option, index): Misconception | null => {
    if (index === question.answer) return null;
    const misconception = diagnosisFor({ ...question, prompt }, option, index, target);
    return {
      ...misconception,
      repair: withPeriod(why),
    };
  });

  return {
    ...question,
    prompt,
    explanation: withPeriod(question.explanation),
    design: {
      objective: prompt,
      principle: withPeriod(question.options[question.answer]),
      why: withPeriod(why),
      distinction: distinctionFor({ ...question, prompt }, target),
      keyIdea: withPeriod(question.explanation),
      practice: withPeriod(practice),
      followUp: followUpFor({ ...question, prompt }, guide),
      diagnostics,
      authorNote: 'Question-level teaching design: this item has its own target, alternatives, misconception diagnosis, repair, practical connection and follow-up retrieval.',
    },
  };
}
