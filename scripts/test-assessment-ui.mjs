import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import bank from '../app/assessment-bank.json' with { type: 'json' };
import choices from '../app/assessment-choice-bank.json' with { type: 'json' };

await mkdir('work/assessment-tests', { recursive: true });
await build({ entryPoints: ['app/assessment-markdown.tsx','app/assessment-workspace.tsx','app/assessment-diagram.tsx','app/assessment-choice-types.ts'], outdir: 'work/assessment-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { default: Markdown } = await import('../work/assessment-tests/assessment-markdown.js');
const { default: Workspace } = await import('../work/assessment-tests/assessment-workspace.js');
const { default: Diagram } = await import('../work/assessment-tests/assessment-diagram.js');
const { assessmentChoiceBank: runtimeChoices } = await import('../work/assessment-tests/assessment-choice-types.js');

for (const question of bank.questions) {
  assert.doesNotThrow(() => renderToStaticMarkup(h(Markdown,{text:question.prompt})), `${question.id} prompt typesets`);
  assert.doesNotThrow(() => renderToStaticMarkup(h(Markdown,{text:question.answer})), `${question.id} answer typesets`);
  for (const option of question.options ?? []) assert.doesNotThrow(() => renderToStaticMarkup(h(Markdown,{text:option.text})), `${question.id} option ${option.id} typesets`);
}
const sourceIds=new Set(bank.questions.map(question=>question.id));
assert.equal(choices.questions.length,bank.questions.length,'C2 and C1 both have completed choice sets');
for(const item of choices.questions){
  assert.ok(sourceIds.has(item.questionId),item.questionId);
  assert.equal(item.options.length,4,item.questionId);
  assert.equal(item.options.filter(option=>option.isCorrect).length,1,item.questionId);
  assert.equal(item.options.find(option=>option.isCorrect).id,item.correctOption,item.questionId);
  assert.equal(new Set(item.options.map(option=>option.text.trim().toLocaleLowerCase())).size,4,`${item.questionId} has four distinct choices`);
  assert.ok(item.foundation.length>150,`${item.questionId} starts from a substantive electrical principle`);
  for(const option of item.options){
    assert.ok(option.text.length>1,`${item.questionId} ${option.id} text`);
    assert.ok(option.feedback.length>80,`${item.questionId} ${option.id} teaches`);
    assert.doesNotMatch(option.feedback,/accept the result without|remaining stated checks|plausible numerical distractor|only response that preserves every required relationship|full solution below defines/i,`${item.questionId} ${option.id} avoids generic template feedback`);
    assert.doesNotMatch(option.text,/decorative|CPR chart|immediate return to work|ignore the supply|operate as a dimmer|meter seal|lifting eyes|voltage becomes DC|changes AC to DC|lamp colou?r temperature|earth-electrode driving|motor slip|PF controller|sets lamp colou?r|determines room area|circuit name is short|enclosure is white|label is printed clearly|a new label|a larger earth bar|turn AC into DC|transparent|no switches/i,`${item.questionId} ${option.id} is a credible electrical distractor`);
    assert.doesNotThrow(()=>renderToStaticMarkup(h(Markdown,{text:option.text})),`${item.questionId} ${option.id} typesets`);
  }
}

const questionById=new Map(bank.questions.map(question=>[question.id,question]));
const runtimeById=new Map(runtimeChoices.questions.map(question=>[question.questionId,question]));
const c1Questions=bank.questions.filter(question=>question.pathway==='C1');
assert.ok(c1Questions.length>0,'C1 questions exist');
for(const question of c1Questions){
  const item=runtimeById.get(question.id);
  assert.ok(item,`${question.id} has a runtime choice set`);
  assert.ok(item.directAnswer?.startsWith(`Correct answer: ${item.correctOption} — `),`${question.id} states the full correct answer first`);
  const correct=item.options.find(option=>option.id===item.correctOption);
  assert.ok(correct,`${question.id} has its correct option`);
  assert.ok(item.directAnswer.includes(correct.text.replace(/\*\*/g,'').replace(/`/g,'')),`${question.id} names the correct option text, not only its letter`);
  assert.ok(item.reasoning?.length>25,`${question.id} has question-specific reasoning`);
  assert.ok(question.answer.length>20,`${question.id} keeps an exam-ready model answer`);
  assert.ok(question.markingPoints.length>0,`${question.id} has full-credit evidence`);
  for(const option of item.options){
    assert.doesNotMatch(option.feedback,/This response applies the complete answer plan|The stated answer applies that principle correctly|full solution below|plausible numerical distractor/i,`${question.id} ${option.id} removes generator-template feedback`);
    assert.ok(option.feedback.length>20,`${question.id} ${option.id} has a specific rationale`);
  }
}
const normalizedReason=value=>value.toLocaleLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const reasonGroups=new Map();
for(const question of c1Questions){
  const key=normalizedReason(runtimeById.get(question.id).reasoning);
  const ids=reasonGroups.get(key)??[]; ids.push(question.id); reasonGroups.set(key,ids);
}
const duplicateReasonGroups=[...reasonGroups.values()].filter(ids=>ids.length>1);
assert.deepEqual(duplicateReasonGroups,[],`C1 reasoning must be question-specific; duplicates: ${JSON.stringify(duplicateReasonGroups)}`);

for(const question of bank.questions.filter(question=>question.format==='diagram'&&/\bdraw\b|\bdiagram\b/i.test(question.prompt))){
  const diagram=renderToStaticMarkup(h(Diagram,{question}));
  assert.ok(diagram.includes('Completed answer diagram'),`${question.id} supplies a drawn answer`);
}
const assessment={activeQuestionId:'C2-01-M01',bookmarkedQuestionIds:[],reviews:{}};
const html=renderToStaticMarkup(h(Workspace,{assessment,onSelect(){},onReview(){},onBookmark(){},onLesson(){}}));
for(const label of ['EPRA exam preparation','Study bank','Mock papers','Oral practice','Drawing practice','Choose the response','Select the strongest answer']) assert.ok(html.includes(label),label);
assert.ok(!html.includes('<textarea'),'Learners are never required to type an assessment answer');
const revealed=renderToStaticMarkup(h(Workspace,{assessment:{...assessment,reviews:{'C2-01-M01':{selectedOptionId:'B',isCorrect:true,confidence:null,updatedAt:'2026-09-13T00:00:00Z'}}},onSelect(){},onReview(){},onBookmark(){},onLesson(){}}));
for(const label of ['Full worked solution','Underlying principle','Why every option is right or wrong','Full-credit evidence']) assert.ok(revealed.includes(label),label);

const c1Question=c1Questions[0];
const c1Choice=runtimeById.get(c1Question.id);
const c1Selected=c1Choice.options.find(option=>!option.isCorrect)??c1Choice.options[0];
const c1Html=renderToStaticMarkup(h(Workspace,{assessment:{activeQuestionId:c1Question.id,bookmarkedQuestionIds:[],reviews:{[c1Question.id]:{selectedOptionId:c1Selected.id,isCorrect:c1Selected.isCorrect,confidence:null,updatedAt:'2026-09-16T00:00:00Z'}}},onSelect(){},onReview(){},onBookmark(){},onLesson(){}}));
assert.ok(c1Html.includes(c1Choice.directAnswer),`${c1Question.id} reveals the complete answer immediately`);
assert.ok(c1Html.includes('Exam-ready model answer'),`${c1Question.id} labels the reproducible exam answer`);
if(!c1Selected.isCorrect){
  const escaped=c1Selected.feedback.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  assert.equal((c1Html.match(new RegExp(escaped,'g'))??[]).length,1,`${c1Question.id} selected misconception feedback is not repeated`);
}

console.log(`PASS: all ${bank.questions.length} C2/C1 questions render; ${c1Questions.length} C1 questions have answer-first, question-specific, non-duplicated learning feedback.`);
