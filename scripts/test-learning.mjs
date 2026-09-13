import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { renderToString } from 'katex';

await mkdir('work/learning-tests', { recursive: true });
await build({ entryPoints: ['app/toolkit-math.ts'], outdir: 'work/learning-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
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
console.log('PASS: preserved formula models, valid LaTeX, boundary values and invalid inputs.');
