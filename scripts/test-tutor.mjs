import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, create } from 'react-test-renderer';

await mkdir('work/tutor-tests', { recursive: true });
await build({ entryPoints: ['app/tutor-model.ts', 'app/practice-data.ts', 'app/knowledge-graph.ts', 'app/standards-data.ts', 'app/standards-checks.ts', 'app/tutor-panels.tsx', 'app/lesson-guides.ts', 'app/assessment-data.ts', 'app/course-curriculum.ts', 'app/loop-visual.tsx', 'app/practice-workspace.tsx'], outdir: 'work/tutor-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const model = await import('../work/tutor-tests/tutor-model.js');
const practice = await import('../work/tutor-tests/practice-data.js');
const graph = await import('../work/tutor-tests/knowledge-graph.js');
const standards = await import('../work/tutor-tests/standards-data.js');
const { loopModel } = await import('../work/tutor-tests/loop-visual.js');
const { default: Workspace } = await import('../work/tutor-tests/practice-workspace.js');
const panels = await import('../work/tutor-tests/tutor-panels.js');
const { lessonGuides } = await import('../work/tutor-tests/lesson-guides.js');
const { standardsChecks } = await import('../work/tutor-tests/standards-checks.js');
const { default: course } = await import('../work/tutor-tests/course-curriculum.js');
const { buildAssessmentBank } = await import('../work/tutor-tests/assessment-data.js');

const day = new Date(2026, 8, 5, 12);
const first = model.scheduleRecall(undefined, true, day);
assert.equal(first.streak, 1);
assert.equal(first.dueAt, '2026-09-06');
assert.deepEqual(model.scheduleRecall(first, true, day), first, 'Same-day clicking cannot increase retention interval');
const failed = model.scheduleRecall(first, false, day);
assert.equal(failed.streak, 0);
assert.equal(failed.dueAt, '2026-09-05');
assert.deepEqual(model.scheduleRecall(failed, true, day), failed);
assert.equal(model.scheduleRecall(first, true, new Date(2026, 8, 6, 12)).dueAt, '2026-09-09');

const input = { lessonId: 'p05-l07', conceptId: 'Zs', activityId: 'calc:loop:1', dimension: 'application', correct: true, assisted: false };
let events = model.appendEvidence([], input, '2026-08-01T09:00:00Z');
events = model.appendEvidence(events, { ...input, correct: false }, '2026-08-02T09:00:00Z');
assert.equal(model.learningSnapshot(events).dimensions.find(item => item.dimension === 'application').successful, 0, 'Later errors supersede an earlier success');
assert.equal(model.nextLearningAction(events, 0, 'p01-l01').lessonId, 'p05-l07');
events = model.appendEvidence(events, { ...input, activityId: 'calc:loop:2' }, '2026-08-02T10:00:00Z');
assert.equal(model.learningSnapshot(events).weaknesses.length, 0, 'A fresh independent variant resolves calculation-family difficulty');
events = model.appendEvidence(events, { ...input, activityId: 'calc:loop:2' }, '2026-08-02T10:01:00Z');
assert.equal(events.at(-1).assisted, true, 'Remounting an activity cannot manufacture independent evidence');
const recall = { ...input, dimension: 'recall', activityId: 'synthesis' };
const recalled = [model.appendEvidence([], recall, '2026-08-01T09:00:00Z')[0], model.appendEvidence([], recall, '2026-08-08T09:00:00Z')[0]];
assert.equal(model.learningSnapshot(recalled).retained, 1);
assert.equal(model.learningSnapshot(recalled.slice(0, 1)).retained, 0);
assert.equal(model.nextLearningAction([], 9, 'p01-l01').title, 'Retrieve 5 due ideas');

const ids = new Set(graph.lessonById.keys());
assert.equal(model.isProgressBackup({ activeLessonId: 'p01-l01', completedLessonIds: [] }, ids), true, 'Legacy unversioned progress supported');
assert.equal(model.isProgressBackup({ schemaVersion: 4, activeLessonId: 'p01-l01', completedLessonIds: [] }, ids), true);
assert.equal(model.isProgressBackup({ schemaVersion: 5, activeLessonId: 'p01-l01', completedLessonIds: [] }, ids), true);
assert.equal(model.isProgressBackup({ schemaVersion: 6, activeLessonId: 'p01-l01', completedLessonIds: [] }, ids), true);
for (const bad of [null, [], {}, { schemaVersion: 7, activeLessonId: 'p01-l01', completedLessonIds: [] }, { activeLessonId: 'missing', completedLessonIds: [] }]) assert.equal(model.isProgressBackup(bad, ids), false);
assert.equal(model.validEvidence([events[0], events[0], { ...events[0], id: 'bad', lessonId: 'missing' }], ids).length, 1);

let quizRecord=model.recordQuizAttempt(undefined,8,10,'2026-09-01T10:00:00Z');
quizRecord=model.recordQuizAttempt(quizRecord,6,10,'2026-09-02T10:00:00Z');
assert.deepEqual({best:[quizRecord.bestScore,quizRecord.bestTotal],latest:[quizRecord.latestScore,quizRecord.latestTotal],attempts:quizRecord.attempts},{best:[8,10],latest:[6,10],attempts:2},'A lower retry becomes latest without erasing the best result');
quizRecord=model.recordQuizAttempt(quizRecord,17,20,'2026-09-03T10:00:00Z');
assert.deepEqual([quizRecord.bestScore,quizRecord.bestTotal,quizRecord.attempts],[17,20,3],'Best attempts are compared by percentage');
assert.deepEqual(Object.keys(model.validQuizRecords({'lesson:p01-l01':quizRecord,bad:quizRecord},new Set(['lesson:p01-l01']))),['lesson:p01-l01']);
for(const values of [[-1,10],[11,10],[1,0],[1.5,10]])assert.throws(()=>model.recordQuizAttempt(undefined,...values),RangeError);

for (const spec of practice.calculations) {
  for (let variant = 0; variant < 4; variant++) {
    const problem = practice.calculationProblem(spec.id, variant);
    assert.ok(Number.isFinite(problem.answer) && problem.answer > 0, spec.id);
    assert.equal(practice.checkCalculation(problem, String(problem.answer), problem.unit).correct, true, spec.id);
    const {choices,answer} = practice.calculationChoices(problem,variant);
    assert.equal(choices.length,4);
    assert.equal(new Set(choices.map(choice=>`${choice.value}/${choice.unit}`)).size,4);
    choices.forEach((choice,index)=>assert.equal(practice.checkCalculation(problem,choice.value,choice.unit).correct,index===answer,'Exactly one numerical choice must be accepted'));
    assert.equal(practice.checkCalculation(problem, String(problem.answer * 2), problem.unit).correct, false, spec.id);
    assert.equal(practice.checkCalculation(problem, String(problem.answer), 'wrong').correct, false, spec.id);
    for (const bad of ['', ' ', 'Infinity', '-1', 'hello']) assert.equal(practice.checkCalculation(problem, bad, problem.unit).valid, false, `${spec.id}/${bad}`);
  }
}
assert.equal(practice.checkCalculation(practice.calculationProblem('loop'), '.3', 'Ω').feedback.includes('external'), true);
assert.equal(loopModel(.3, .5, false).current, 287.5);
assert.ok(loopModel(.3, 1, false).current < loopModel(.3, .5, false).current);
assert.equal(loopModel(.3, .5, true).current, 0);
assert.throws(() => loopModel(0, 0, false), RangeError);
assert.throws(() => loopModel(.3, NaN, false), RangeError);
for (const scenario of practice.faultCases) for (const step of scenario.steps) {
  assert.equal(step.options.length, step.feedback.length);
  assert.ok(step.answer >= 0 && step.answer < step.options.length);
}
for (const [id, item] of Object.entries(graph.lessonKnowledge)) {
  assert.ok(item.concepts.length, `Lesson ${id} needs teaching concepts`);
  for (const prerequisite of item.prerequisites) assert.ok(ids.has(prerequisite), `${id}/${prerequisite}`);
}
assert.ok(graph.matchingTerms('Zs').some(term => term.term === 'Zs'));
assert.ok(!graph.matchingTerms('battery').some(term => term.term === 'TT'), 'Short aliases must use word boundaries');
assert.equal(standards.standardSources[0].identifier, 'BS 7671:2018+A4:2026');
assert.equal(standards.topicsForLesson('Atomic structure')[0].id,'basic-protection','Foundational lessons include a concrete related standard principle');
assert.equal(standards.topicsForLesson('Planning kitchen socket positions')[0].id,'kitchen-placement');
assert.equal(standards.topicsForLesson('Bathroom shaver sockets')[0].id,'bathroom-sockets');
assert.equal(standards.topicsForLesson('Choose the correct cable size')[0].id,'cable-design');
for (const topic of standards.standardsTopics) for (const source of topic.sources) assert.ok(standards.standardSources.some(item => item.id === source));
for (const check of Object.values(standardsChecks)) {
  assert.equal(check.options.length,4,'Every standards decision is multiple choice');
  assert.equal(check.options.length,check.feedback.length);
}
const bank=buildAssessmentBank(course.modules,lessonGuides);
assert.ok(bank.lessons['p11-v2-l06'].questions.some(question => question.prompt.includes('kitchen sink')),'Kitchen placement rule is included in the lesson quiz');
assert.ok(bank.lessons['p11-v2-l09'].questions.some(question => question.prompt.includes('bathroom')),'Bathroom socket rule is included in the lesson quiz');
for(const lesson of graph.lessonById.values()) {
  const guide=lessonGuides[lesson.id];
  const teaching=renderToStaticMarkup(h(panels.LessonCompass,{lessonId:lesson.id,guide,watched:false,onEvidence(){},onLesson(){},onPractice(){}}))
    +renderToStaticMarkup(h(panels.StandardsLearning,{lessonId:lesson.id,text:`${lesson.title} ${guide.summary}`,onEvidence(){}}))
    +renderToStaticMarkup(h(Workspace,{lessonId:lesson.id,...practice.practiceForLesson(`${lesson.title} ${guide.summary}`),evidence:[],onEvidence(){}}));
  assert.ok(!/<textarea|type="(?:text|number)"/.test(teaching),`${lesson.id}: learning requires no typing`);
  assert.ok(!/href="https?:/.test(teaching),`${lesson.id}: explanations remain in app`);
  assert.ok(!/\bKenyan?\b|\bEPRA\b|\bKEBS\b/i.test(teaching),`${lesson.id}: focused BS teaching`);
  for(const question of bank.lessons[lesson.id].questions) assert.ok(!/\bKenyan?\b|\bEPRA\b|\bKEBS\b/i.test([question.prompt,...question.options,question.explanation].join(' ')),question.id);
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const text = node => typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : node?.children ? text(node.children) : '';
let tree;
const recorded = [];
const scenario = practice.faultCases.find(item => item.id === 'open-cpc');
const props = { lessonId: 'p05-l07', cases: [scenario], evidence: [], onEvidence: item => recorded.push(item) };
await act(async () => { tree = create(h(Workspace, props)); });
const button = label => tree.root.findAllByType('button').find(node => text(node).trim() === label);
assert.equal(button('Continue investigation').props.disabled, true, 'Cannot skip safe conditions');
await act(async () => button(`A${scenario.steps[0].options[0]}`).props.onClick());
assert.equal(button('Continue investigation').props.disabled, true, 'An unsafe answer must not unlock the next step');
await act(async () => button(`B${scenario.steps[0].options[1]}`).props.onClick());
assert.equal(button('Continue investigation').props.disabled, false);
assert.equal(recorded.at(-1).assisted, true, 'Correction after feedback remains supported');
await act(async () => button('Continue investigation').props.onClick());
assert.ok(text(tree.toJSON()).includes(scenario.steps[1].prompt));
await act(async () => tree.unmount());

const lessons = [...graph.lessonById.values()];
const withTerms = Object.values(graph.lessonKnowledge).filter(item => item.terms.length).length;
console.log(`PASS: evidence regression, delayed recall, legacy formats, 52 multiple-choice calculation variants, loop limits, scenario safety gates, ${lessons.length} lessons without typed answers or external teaching links, ${withTerms} lessons with linked terms, BS standards summaries and assessment text.`);
