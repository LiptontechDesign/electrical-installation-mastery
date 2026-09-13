import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import bank from '../app/assessment-bank.json' with { type: 'json' };
import choices from '../app/assessment-choice-bank.json' with { type: 'json' };

await mkdir('work/assessment-tests', { recursive: true });
await build({ entryPoints: ['app/assessment-markdown.tsx','app/assessment-workspace.tsx','app/assessment-diagram.tsx'], outdir: 'work/assessment-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { default: Markdown } = await import('../work/assessment-tests/assessment-markdown.js');
const { default: Workspace } = await import('../work/assessment-tests/assessment-workspace.js');
const { default: Diagram } = await import('../work/assessment-tests/assessment-diagram.js');

for (const question of bank.questions) {
  assert.doesNotThrow(() => renderToStaticMarkup(h(Markdown,{text:question.prompt})), `${question.id} prompt typesets`);
  assert.doesNotThrow(() => renderToStaticMarkup(h(Markdown,{text:question.answer})), `${question.id} answer typesets`);
  for (const option of question.options ?? []) assert.doesNotThrow(() => renderToStaticMarkup(h(Markdown,{text:option.text})), `${question.id} option ${option.id} typesets`);
}
const sourceIds=new Set(bank.questions.map(question=>question.id));
assert.equal(choices.questions.length,bank.counts.C2,'C2 is the completed pathway in this verified section');
for(const item of choices.questions){
  assert.ok(sourceIds.has(item.questionId),item.questionId);
  assert.equal(item.options.length,4,item.questionId);
  assert.equal(item.options.filter(option=>option.isCorrect).length,1,item.questionId);
  assert.equal(item.options.find(option=>option.isCorrect).id,item.correctOption,item.questionId);
  for(const option of item.options){
    assert.ok(option.text.length>1,`${item.questionId} ${option.id} text`);
    assert.ok(option.feedback.length>35,`${item.questionId} ${option.id} teaches`);
    assert.doesNotThrow(()=>renderToStaticMarkup(h(Markdown,{text:option.text})),`${item.questionId} ${option.id} typesets`);
  }
}
for(const question of bank.questions.filter(question=>question.pathway==='C2'&&question.format==='diagram'&&/\bdraw\b|\bdiagram\b/i.test(question.prompt))){
  const diagram=renderToStaticMarkup(h(Diagram,{question}));
  assert.ok(diagram.includes('Completed answer diagram'),`${question.id} supplies a drawn answer`);
}
const assessment={activeQuestionId:'C2-01-M01',bookmarkedQuestionIds:[],reviews:{}};
const html=renderToStaticMarkup(h(Workspace,{assessment,onSelect(){},onReview(){},onBookmark(){},onLesson(){}}));
for(const label of ['EPRA exam preparation','Study bank','Mock papers','Oral practice','Drawing practice','Choose the response','Select the strongest answer']) assert.ok(html.includes(label),label);
assert.ok(!html.includes('<textarea'),'Learners are never required to type an assessment answer');
const revealed=renderToStaticMarkup(h(Workspace,{assessment:{...assessment,reviews:{'C2-01-M01':{selectedOptionId:'B',isCorrect:true,confidence:null,updatedAt:'2026-09-13T00:00:00Z'}}},onSelect(){},onReview(){},onBookmark(){},onLesson(){}}));
for(const label of ['Full worked solution','Why every option is right or wrong','Full-credit evidence']) assert.ok(revealed.includes(label),label);
console.log(`PASS: all ${bank.questions.length} prompts and solutions typeset; ${choices.questions.length} C2 questions have four choices, individual feedback and selection-gated solutions.`);
