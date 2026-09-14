import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

await mkdir('work/math-tests', { recursive: true });
await build({
  entryPoints: ['app/learning-text.tsx', 'app/engineering-value.tsx', 'app/engineering-notation.ts', 'app/practice-data.ts'],
  outdir: 'work/math-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
});

const { default: LearningText } = await import('../work/math-tests/learning-text.js');
const { default: EngineeringValue } = await import('../work/math-tests/engineering-value.js');
const { engineeringToTex } = await import('../work/math-tests/engineering-notation.js');
const { calculations, calculationProblem, calculationChoices } = await import('../work/math-tests/practice-data.js');

const mixed = renderToStaticMarkup(h(LearningText, { text: 'Use $I_b\\leq I_n\\leq I_z$ and `230 V`.' }));
assert.equal((mixed.match(/<math/g) ?? []).length, 2, 'TeX and constrained engineering notation both render as accessible mathematics');

for (const unit of ['A', 'mA', 'V', 'W', 'kW', 'Wh', 'kWh', 'C', 'J', 'Ω', 'kΩ', 'mΩ', 'Hz', 'r/min', '%', 'h', 'm', 'lm', 'lx', 'kVAr']) {
  const html = renderToStaticMarkup(h(EngineeringValue, { value: '12.5', unit }));
  assert.ok(html.includes('<math'), `Engineering value renders ${unit} with MathML`);
  assert.ok(!html.includes('katex-error'), `Engineering value has valid KaTeX for ${unit}`);
}
assert.equal(engineeringToTex('2.5 mm²'), '2.5\\,\\mathrm{mm^2}');
assert.equal(engineeringToTex('0.30 Ω'), '0.30\\,\\Omega');
assert.equal(engineeringToTex('12 kΩ'), '12\\,\\mathrm{k\\Omega}');

for (const spec of calculations) {
  for (let variant = 0; variant < 4; variant += 1) {
    const problem = calculationProblem(spec.id, variant);
    const prompt = renderToStaticMarkup(h(LearningText, { text: problem.prompt }));
    assert.ok(prompt.includes('<math'), `${spec.id}/${variant}: prompt quantities are typeset`);
    const { choices } = calculationChoices(problem, variant);
    for (const choice of choices) {
      const html = renderToStaticMarkup(h(EngineeringValue, choice));
      assert.ok(html.includes('<math') && !html.includes('katex-error'), `${spec.id}/${variant}: answer value and unit are valid`);
    }
  }
}

const experiment = readFileSync('app/learning-experiment.tsx', 'utf8');
const licensing = readFileSync('app/licensing-ui.tsx', 'utf8');
const tutor = readFileSync('app/tutor-panels.tsx', 'utf8');
assert.ok(experiment.includes('EngineeringValue'), 'Dynamic experiment quantities use the shared value renderer');
assert.ok(licensing.includes('EngineeringValue'), 'Dynamic power-factor result uses the shared value renderer');
assert.ok(tutor.includes('engineeringToTex(item.formula)'), 'Legacy contextual formulas route through KaTeX');

console.log('PASS: shared KaTeX rendering covers authored prose math, practice prompts and choices, dynamic engineering values, and contextual formulas.');
