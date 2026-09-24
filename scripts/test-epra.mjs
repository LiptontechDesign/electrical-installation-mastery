import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { buildStudyPack } from './import-epra.mjs';

const pack = JSON.parse(await readFile('app/practice/study-pack.json', 'utf8'));
assert.deepEqual(pack, await buildStudyPack(), 'Generated content must match the source import exactly');
const ids = new Set();
for (const c of pack) {
  const bytes = await readFile(`content/epra/${c.file}`);
  const source = bytes.toString('utf8');
  assert.equal(c.hash, createHash('sha256').update(bytes).digest('hex'));
  const expected = c.kind === 'mock' ? 5 : [...source.matchAll(/^## Question /gm)].length;
  assert.equal(c.questions.length, expected, `${c.id}: every source question imported`);
  for (const q of c.questions) {
    assert.ok(!ids.has(q.id), `Duplicate ID: ${q.id}`); ids.add(q.id);
    assert.equal(q.question, source.slice(...q.questionRange));
    assert.equal(q.answer, source.slice(...q.answerRange));
    assert.ok(q.question.trim() && q.answer.trim(), `Empty question/answer: ${q.id}`);
  }
}
assert.equal(pack.find(c => c.id === 'recall').questions.length, 110);
assert.equal(pack.filter(c => c.kind === 'topic').reduce((sum,c) => sum+c.questions.length,0), 568);
assert.deepEqual(pack.find(c => c.id === 'step-6').paths, ['C1']);
assert.deepEqual(pack.find(c => c.id === 'mock-c1').paths, ['C1']);
assert.deepEqual(pack.find(c => c.id === 'mock-c2').paths, ['C2']);
await mkdir('work/epra-test', { recursive: true });
await build({ entryPoints: ['app/practice/study-model.ts','app/practice/study-markdown.tsx'], outdir: 'work/epra-test', bundle: true, packages: 'external', platform: 'node', format: 'esm', jsx: 'automatic', outExtension: { '.js': '.mjs' } });
const { default: Markdown } = await import('../work/epra-test/study-markdown.mjs');
const { sampleQuestions, mathMarkdown, displayAnswer, prerequisiteIds, prerequisiteQuestions, questionParts, multipleChoiceItems } = await import('../work/epra-test/study-model.mjs');
const omissions = JSON.parse(await readFile('app/practice/presentation-omissions.json', 'utf8'));
assert.equal(Object.keys(omissions).length, 8, 'Only explicitly reviewed editorial asides are omitted');
for (const c of pack) for (const q of c.questions) {
  let expectedAnswer = q.answer;
  for (const passage of omissions[q.id] ?? []) {
    assert.equal(expectedAnswer.split(passage).length, 2, `${q.id}: omission must match exactly once`);
    expectedAnswer = expectedAnswer.replace(passage, '');
  }
  assert.equal(displayAnswer(q), expectedAnswer, `${q.id}: all remaining wording is unchanged`);
}
assert.ok(displayAnswer(pack[0].questions[0]).trimStart().startsWith('Electric current is the **rate'));
const sample = sampleQuestions(pack[0].questions, 10, () => 0.5);
assert.equal(new Set(sample.map(q => q.id)).size, 10);
assert.equal(pack[0].questions[0].id, 'step-1-q1', 'Sampling never mutates the source');
assert.equal(mathMarkdown('Current \\(I\\).'), 'Current $I$.');
const failures = [];
let formulas = 0;
for (const c of pack) {
  for (const [id, text] of [[`${c.id}-notes`, c.notes], ...c.questions.flatMap(q => [[`${q.id}-question`, q.question], [q.id, displayAnswer(q)]])]) {
    const html = renderToStaticMarkup(createElement(Markdown, null, text));
    if (html.includes('katex-error')) failures.push(id);
    formulas += (html.match(/class="katex"/g) ?? []).length;
  }
}
assert.deepEqual(failures, [], 'Every supplied formula must render without KaTeX errors');
console.log(`PASS: ${ids.size} complete source question/answer pairs, exact hashes, 8 authorized editorial omissions only, pathway separation, unique quiz sampling, ${formulas} rendered formulas.`);

for (const collection of pack) {
  for (const q of collection.questions) {
    for (const id of prerequisiteIds(q)) assert.ok(collection.questions.some(item => item.id === id), `${q.id}: prerequisite exists`);
    const parsed = questionParts(q);
    assert.equal(parsed.intro + parsed.parts.map(part => part.text).join(''), q.question, `${q.id}: multipart presentation preserves every source character`);
    if (parsed.parts.length) assert.equal(parsed.parts.reduce((sum, part) => sum + part.marks, 0), 20, `${q.id}: supplied part allocations total 20`);
  }
  const independent = sampleQuestions(collection.questions, collection.questions.length);
  assert.ok(independent.every(q => !prerequisiteIds(q).length), 'No dependent exercise is sampled independently');
}
const cables = pack.find(c => c.id === 'step-2');
assert.deepEqual(prerequisiteQuestions(cables.questions.find(q => q.id === 'step-2-q33'), cables.questions).map(q => q.id), ['step-2-q30', 'step-2-q31', 'step-2-q32']);
const mcq = multipleChoiceItems(pack.find(c => c.id === 'mock-c1').questions[0]);
assert.equal(mcq.length, 20);
assert.ok(mcq.every(item => item.choices.length === 4 && item.choices.some(choice => choice.value === item.correct)));
const outline = renderToStaticMarkup(createElement(Markdown, { outline: true, prefix: 'nested' }, '# Main\n## Part\n### Method\n### Check'));
assert.match(outline, /<h3 id="nested-0">Main/);
assert.match(outline, /<h4 id="nested-1">Part/);
assert.match(outline, /<h5 id="nested-2">Method/);
assert.match(outline, /<ol>.*<ol>.*<ol>/);
console.log('PASS: linked exercise chains, independent sampling, exact multipart slices, all mock mark allocations, 20 MCQ choices/keys and nested heading structure.');
