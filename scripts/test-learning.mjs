import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, create } from 'react-test-renderer';
import { renderToString } from 'katex';

await mkdir('work/learning-tests', { recursive: true });
await build({ entryPoints: ['app/assessment-panel.tsx', 'app/toolkit-math.ts', 'app/learning-toolkit.tsx'], outdir: 'work/learning-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { default: AssessmentPanel } = await import('../work/learning-tests/assessment-panel.js');
const { default: LearningToolkit } = await import('../work/learning-tests/learning-toolkit.js');
const { formulas, calculate, ohmExpressions } = await import('../work/learning-tests/toolkit-math.js');

const expected = { ohm: 0.5, power: 48, energy: 0.3, series: 60, 'three-phase': Math.sqrt(3) * 400 * 10 * 0.8 / 1000 };
for (const spec of formulas) {
  const { result, error } = calculate(spec, spec.defaults, 'current');
  assert.equal(error, undefined);
  assert.ok(Math.abs(result.value - expected[spec.id]) < 1e-10, spec.title);
  for (const tex of [spec.tex, result.tex]) {
    const html = renderToString(tex, { strict: 'error', trust: false, output: 'htmlAndMathml' });
    assert.ok(html.includes('<math'), `${spec.id}: accessible MathML`);
    assert.ok(!html.includes('katex-error'));
  }
  for (const field of spec.fields.filter((field) => spec.id !== 'ohm' || field.key !== 'current')) {
    for (const invalid of ['', '-1', 'Infinity', 'not-a-number', '1e12']) {
      assert.ok(calculate(spec, { ...spec.defaults, [field.key]: invalid }, 'current').error, `${spec.id}/${field.key}/${invalid}`);
    }
  }
}
const ohm = formulas[0];
for (const [target, answer] of [['current', .5], ['voltage', 12], ['resistance', 24]]) {
  assert.equal(calculate(ohm, ohm.defaults, target).result.value, answer);
  renderToString(ohmExpressions[target], { strict: 'error' });
}
assert.ok(calculate(ohm, { ...ohm.defaults, resistance: '0' }, 'current').error);
assert.ok(calculate(ohm, { ...ohm.defaults, current: '0' }, 'resistance').error);
assert.equal(calculate(ohm, { ...ohm.defaults, voltage: '0' }, 'current').result.value, 0);
const phase = formulas.find((item) => item.id === 'three-phase');
assert.ok(calculate(phase, { ...phase.defaults, pf: '1.01' }, 'current').error);
assert.equal(calculate(phase, { ...phase.defaults, pf: '0' }, 'current').result.value, 0);
for (const values of [{ voltage: '0.0000001', resistance: '1000000000' }, { voltage: '1000000000', resistance: '0.000001' }]) {
  const result = calculate(ohm, values, 'current').result;
  assert.ok(Number.isFinite(result.value));
  renderToString(result.tex, { strict: 'error' });
}
const toolkitHtml = renderToStaticMarkup(h(LearningToolkit, { query: '', onQueryChange() {} }));
assert.ok(toolkitHtml.includes('katex-mathml'));
assert.ok(toolkitHtml.includes('A simple DC circuit'));
assert.ok(toolkitHtml.includes('Adjust voltage'));

// Test React state directly: switching the top-level mode must preserve an in-progress quiz.
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.window = { requestAnimationFrame: (callback) => callback() };
const cards = [1, 2].map((i) => ({ id: `c${i}`, lessonId: 'p01-l01', lessonTitle: 'Atomic particles', moduleId: 'm1', front: i === 1 ? 'What charge does a proton carry?' : 'What charge does an electron carry?', back: i === 1 ? 'Positive' : 'Negative', kind: 'Core idea' }));
const questions = cards.map((card, i) => ({ id: `q${i}`, lessonId: card.lessonId, lessonTitle: card.lessonTitle, moduleId: 'm1', cardId: card.id, prompt: card.front, options: ['Positive', 'Negative'], answer: i, explanation: card.back, kind: 'Recall' }));
const recorded = [], attempts = [], changes = [];
const props = { title: 'Atomic particles', eyebrow: 'Lesson recap', description: '', flashcards: cards, questions, progress: {}, bestScore: 0, completed: false, connectedLessonFlow: true, onRateCard: (...args) => recorded.push(args), onCompleteQuiz: (...args) => attempts.push(args), onModeChange: (mode) => changes.push(mode) };
let tree;
await act(async () => { tree = create(h(AssessmentPanel, { ...props, mode: 'quiz' })); });
const text = (node) => typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : node?.children ? text(node.children) : '';
const button = (label) => tree.root.findAllByType('button').find((node) => text(node).replace(/\s+/g, ' ').trim() === label);
assert.equal(tree.root.findAll((node) => node.type === 'nav').length, 0, 'No nested tabs for lesson assessments');
await act(async () => button('BNegative').props.onClick());
assert.deepEqual(recorded, [['c1', false]], 'Wrong answers are queued for review');
await act(async () => tree.update(h(AssessmentPanel, { ...props, mode: 'cards' })));
await act(async () => tree.root.findByProps({ 'aria-label': 'Reveal answer' }).props.onClick());
assert.ok(text(tree.toJSON()).includes('Positive'));
await act(async () => tree.update(h(AssessmentPanel, { ...props, mode: 'quiz' })));
assert.equal(button('BNegative').props.disabled, true, 'Previously answered question remains answered');
await act(async () => button('Next question').props.onClick());
assert.ok(text(tree.toJSON()).includes('Question 2'));
await act(async () => button('BNegative').props.onClick());
await act(async () => button('See results').props.onClick());
assert.deepEqual(attempts, [[1, 2]], 'Complete quiz records the correct score once');
await act(async () => tree.update(h(AssessmentPanel, { ...props, mode: 'cards' })));
assert.ok(text(tree.toJSON()).includes('Positive'), 'Revealed flashcard survives mode switching');
await act(async () => button('Got it').props.onClick());
await act(async () => tree.root.findByProps({ 'aria-label': 'Reveal answer' }).props.onClick());
await act(async () => button('Got it').props.onClick());
assert.equal(changes.at(-1), 'quiz', 'Last flashcard requests the top-level Quiz tab');
assert.deepEqual(recorded.slice(-2), [['c1', true], ['c2', true]]);
await act(async () => tree.unmount());
console.log('PASS: formulas, worked LaTeX, invalid inputs, accessible math, quiz scoring, review scheduling and tab-switch state.');
