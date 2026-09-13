import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, create } from 'react-test-renderer';

await mkdir('work/tutor-tests', { recursive: true });
await build({ entryPoints: ['app/lesson-overview.tsx', 'app/tutor-model.ts', 'app/practice-data.ts', 'app/knowledge-graph.ts', 'app/standards-data.ts', 'app/tutor-panels.tsx', 'app/lesson-guides.ts', 'app/course-curriculum.ts', 'app/loop-visual.tsx', 'app/practice-workspace.tsx'], outdir: 'work/tutor-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic', plugins:[{name:'dynamic',setup(b){b.onResolve({filter:/^next\/dynamic$/},()=>({path:'dynamic',namespace:'stub'}));b.onLoad({filter:/.*/,namespace:'stub'},()=>({contents:'export default () => () => null',loader:'js'}));}}] });
const model = await import('../work/tutor-tests/tutor-model.js');
const practice = await import('../work/tutor-tests/practice-data.js');
const graph = await import('../work/tutor-tests/knowledge-graph.js');
const standards = await import('../work/tutor-tests/standards-data.js');
const { loopModel } = await import('../work/tutor-tests/loop-visual.js');
const { default: Workspace } = await import('../work/tutor-tests/practice-workspace.js');
const {default: Overview} = await import('../work/tutor-tests/lesson-overview.js');
const { lessonGuides } = await import('../work/tutor-tests/lesson-guides.js');
const { default: course } = await import('../work/tutor-tests/course-curriculum.js');

const ids=new Set(course.modules.flatMap(m=>m.lessons.map(l=>l.id)));
assert.ok(model.isProgressBackup({schemaVersion:6,activeLessonId:'p01-l01',completedLessonIds:[]},ids));
assert.ok(model.isProgressBackup({schemaVersion:7,activeLessonId:'p01-l01',completedLessonIds:[]},ids));
assert.ok(!model.isProgressBackup({schemaVersion:99,activeLessonId:'p01-l01',completedLessonIds:[]},ids));
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
for(const lesson of graph.lessonById.values())for(const watched of [false,true]) {
 const html=renderToStaticMarkup(h(Overview,{lessonId:lesson.id,guide:lessonGuides[lesson.id],watched,learningText:lesson.title,onLesson(){},onRead(){}}));
 assert.ok(html.includes('Why this matters'),lesson.id);
 assert.ok(!/lesson quiz|Start the lesson quiz|Before the quiz/.test(html));
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

console.log('PASS: all lesson Overviews render, practical calculations and safety gates, glossary and standards retained.');
