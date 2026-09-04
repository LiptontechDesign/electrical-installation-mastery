import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, create } from 'react-test-renderer';
import { renderToString } from 'katex';

await mkdir('work/curriculum-tests', { recursive: true });
await build({ entryPoints: ['app/course-curriculum.ts','app/course-extension-data.ts','app/lesson-guides.ts','app/assessment-data.ts','app/connection-models.ts','app/lesson-connections-data.ts','app/lesson-connection.tsx'], outdir: 'work/curriculum-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { default: course } = await import('../work/curriculum-tests/course-curriculum.js');
const { default: extension } = await import('../work/curriculum-tests/course-extension-data.js');
const { lessonGuides } = await import('../work/curriculum-tests/lesson-guides.js');
const { buildAssessmentBank } = await import('../work/curriculum-tests/assessment-data.js');
const { powerFactorExample, motorSpeedExample } = await import('../work/curriculum-tests/connection-models.js');
const { lessonConnections } = await import('../work/curriculum-tests/lesson-connections-data.js');
const { default: Connection } = await import('../work/curriculum-tests/lesson-connection.js');
const original = JSON.parse(await readFile('app/course-data.json','utf8'));
const oldModules = [...original.modules, ...extension.modules];
const lessons = course.modules.flatMap(module => module.lessons);
const lookup = new Map(lessons.map(lesson => [lesson.id,lesson]));
assert.equal(course.modules.length, 16);
assert.equal(lessons.length, 246);
assert.equal(new Set(lessons.map(lesson => lesson.videoId)).size, lessons.length, 'No repeated video');
const bank = buildAssessmentBank(course.modules, lessonGuides);
assert.equal(bank.allFlashcards.filter(card => card.front === 'How would you explain this lesson point in your own words?').length, 0, 'Every recall prompt names a specific concept');
const oldBank = buildAssessmentBank(oldModules, lessonGuides);
for (const courseModule of oldModules) for (const lesson of courseModule.lessons) {
  assert.equal(lookup.get(lesson.id)?.videoId, lesson.videoId, 'Original lesson identity retained');
  for (const card of oldBank.lessons[lesson.id].flashcards) assert.ok(bank.lessons[lesson.id].flashcards.some(item => item.id === card.id && item.front === card.front && item.back === card.back), `Saved card ${card.id} is preserved`);
}
const before = (first, second) => assert.ok(lessons.findIndex(lesson => lesson.id === first) < lessons.findIndex(lesson => lesson.id === second), `${first} must precede ${second}`);
for (const pair of [['p01-l23','p01-transformers'],['p01-pf-visual','p01-l26'],['p03-l14','p01-l28'],['p03-l13','p03-l12'],['p07-l02','p06-l13'],['p07-l03','p06-l13'],['p08-l01','p04-l19'],['p07-induction','p04-l19'],['p04-l19','p04-l20'],['p04-l20','p07-star-delta'],['p07-star-delta','p07-vfd'],['p08-l16','p08-l06'],['p08-l06','p02-l09'],['p08-periodic','p16-l09'],['p16-l04','p10-l03'],['p16-l05','p10-l01'],['p14-v2-l09','p14-v2-l06'],['p12-v2-l02','p07-l10']]) before(...pair);
for (const courseModule of course.modules) {
  assert.equal(courseModule.durationSeconds, courseModule.lessons.reduce((sum,lesson) => sum + lesson.durationSeconds,0));
  courseModule.lessons.forEach((lesson,index) => { assert.equal(lesson.number,index+1); assert.ok(bank.lessons[lesson.id].questions.length >= 5); });
}
assert.equal(course.durationSeconds, course.modules.reduce((sum,module) => sum+module.durationSeconds,0));
const originalIds = new Set(oldModules.flatMap(module => module.lessons.map(lesson => lesson.id)));
for (const lesson of lessons.filter(lesson => !originalIds.has(lesson.id))) assert.ok(lesson.durationSeconds >= 300, 'New video meets quality duration floor');

const pf = powerFactorExample(5,230,.75,.95);
assert.ok(Math.abs(pf.beforeCurrent - 28.98550724637681) < 1e-10);
assert.ok(Math.abs(pf.afterCurrent - 22.88329519450801) < 1e-10);
assert.ok(Math.abs(pf.compensation - (5*Math.sqrt(1-.75**2)/.75 - 5*Math.sqrt(1-.95**2)/.95)) < 1e-10);
assert.equal(powerFactorExample(5,230,.75,.75).compensation,0);
assert.equal(powerFactorExample(5,230,.75,1).afterReactive,0);
for (const args of [[5,0,.75,.95],[5,230,0,.95],[5,230,.75,.5],[5,230,.75,1.1],[NaN,230,.75,.95]]) assert.throws(()=>powerFactorExample(...args),RangeError);
assert.deepEqual(motorSpeedExample(50,4,100/30),{ synchronous:1500,rotor:1450,slip:1/30 });
assert.equal(motorSpeedExample(50,8,0).synchronous,750);
for (const args of [[50,3,3],[50,0,3],[50,4,100],[50,4,-1],[Infinity,4,3]]) assert.throws(()=>motorSpeedExample(...args),RangeError);
for (const [id,connection] of Object.entries(lessonConnections)) {
  assert.ok(lookup.has(id));
  for (const tex of connection.equations ?? []) assert.ok(renderToString(tex,{strict:'error',throwOnError:true}).includes('katex'));
  const html = renderToStaticMarkup(h(Connection,{connection}));
  assert.ok(html.includes('<details class="lesson-connection">'), 'Connection starts collapsed');
  assert.ok(!html.includes('katex-error'));
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let tree;
await act(async()=>{ tree=create(h(Connection,{connection:lessonConnections['p01-l26']})); });
await act(async()=>tree.root.findByType('input').props.onChange({target:{value:'1'}}));
assert.ok(JSON.stringify(tree.toJSON()).includes('21.74'), 'PF slider updates the supply current');
await act(async()=>{ tree.unmount(); tree=create(h(Connection,{connection:lessonConnections['p07-induction']})); });
await act(async()=>tree.root.findByType('select').props.onChange({target:{value:'8'}}));
assert.ok(JSON.stringify(tree.toJSON()).includes('725'), 'Pole count updates rotor speed');
await act(async()=>{ tree.unmount(); tree=create(h(Connection,{connection:lessonConnections['p08-l07']})); });
await act(async()=>tree.root.findByType('button').props.onClick());
assert.equal(tree.root.findByType('button').props['aria-pressed'],true);
assert.ok(JSON.stringify(tree.toJSON()).includes('reversed'));
await act(async()=>tree.unmount());
for (const [moduleId,lessonId] of [['module-01','p01-l26'],['module-06','p06-l13'],['module-07','p07-induction'],['module-08','p08-l07']]) assert.ok(bank.modules[moduleId].questions.some(question=>question.lessonId===lessonId && question.id.includes('-connection-')), 'Module assessment includes the new application check');
console.log(`PASS: ${lessons.length} unique lessons; 239 original lesson/card identities; prerequisites; 16 module totals; ${bank.totalLessonQuestions} questions; formulas and three interactive exercises.`);
