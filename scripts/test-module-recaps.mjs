import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {createElement as h} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {act,create} from 'react-test-renderer';

await build({entryPoints:['app/module-recaps.ts','app/module-recap.tsx','app/course-curriculum.ts','app/assessment-data.ts','app/lesson-guides.ts','app/course-editorial-revisions.ts','app/lesson-terminology.ts'],outdir:'work/recap-tests',bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic'});
const {recapBooks}=await import('../work/recap-tests/module-recaps.js');
const {default:ModuleRecap}=await import('../work/recap-tests/module-recap.js');
const {default:course}=await import('../work/recap-tests/course-curriculum.js');
const {buildAssessmentBank}=await import('../work/recap-tests/assessment-data.js');
const {lessonGuides}=await import('../work/recap-tests/lesson-guides.js');
const {courseEditorialRevisions}=await import('../work/recap-tests/course-editorial-revisions.js');
const {terminologyForLesson}=await import('../work/recap-tests/lesson-terminology.js');
const bank=buildAssessmentBank(course.modules,lessonGuides);
assert.equal(recapBooks.length,16);
const chapters=recapBooks.flatMap(b=>b.chapters),sources=chapters.flatMap(c=>c.lessons);
assert.equal(chapters.length,68);
assert.equal(sources.length,276);
assert.equal(new Set(sources.map(s=>s.id)).size,276,'Each lesson belongs to exactly one recap chapter');
assert.equal(sources.filter(s=>s.transcript).length,275);
assert.deepEqual(sources.filter(s=>!s.transcript).map(s=>s.id),['p04-l03']);
for(const source of sources.filter(s=>s.transcript)){
  const text=readFileSync('course-transcripts/'+source.file,'utf8').replaceAll('\r\n','\n');
  assert.equal(createHash('sha256').update(text).digest('hex'),source.sha256,source.id+': source fingerprint');
}
for(const book of recapBooks){
  const module=course.modules.find(m=>m.id===book.id);
  assert.deepEqual(book.chapters.flatMap(c=>c.lessons.map(l=>l.id)),module.lessons.map(l=>l.id),'Original order preserved');
  assert.deepEqual(book.chapters.map(c=>c.lessons.map(l=>l.id)),bank.checkpointsByModule[book.id].map(c=>c.newLessonIds),'Navigation groups and recap chapters agree');
  const html=renderToStaticMarkup(h(ModuleRecap,{moduleId:book.id,onClose(){},completedLessonIds:[]}));
  assert.ok(html.includes('Print / Save PDF'));
  assert.ok(html.includes('Reading this recap does not mark videos or quizzes complete.'));
  for(const chapter of book.chapters){
    assert.equal(chapter.notes.length,3);
    assert.ok(chapter.lead.length>60);
    assert.ok(chapter.visual.lines.length>=2);
    for(const lesson of chapter.lessons)assert.ok(html.includes(lesson.url.replaceAll('&','&amp;')),'Print includes every source URL');
  }
}
for(const [id,revision] of Object.entries(courseEditorialRevisions)){
  const question=Object.values(bank.lessons).flatMap(l=>l.questions).find(q=>q.id===id);
  assert.ok(question,id+' exists');
  assert.equal(question.prompt,revision.prompt);
  assert.equal(question.options[question.answer],revision.correct);
  assert.equal(new Set(question.options).size,4);
  const card=bank.lessons[question.lessonId].flashcards.find(c=>c.id===question.cardId);
  assert.equal(card.front,revision.prompt);
  assert.equal(card.back,revision.correct);
}
assert.ok(terminologyForLesson('Real power performs work.')[0].term.includes('True power'));
assert.ok(terminologyForLesson('Resistivity depends on material.')[0].term.includes('versus resistance'));
assert.deepEqual(terminologyForLesson('No relevant vocabulary here.'),[]);

globalThis.IS_REACT_ACT_ENVIRONMENT=true;
globalThis.document={body:{style:{overflow:'auto'}},activeElement:null};
let printed=0,closed=0,tree;
globalThis.window={print(){printed++;}};
const completed=Object.freeze(['p01-l01']);
const text=node=>typeof node==='string'?node:Array.isArray(node)?node.map(text).join(''):node?.children?text(node.children):'';
const button=label=>tree.root.findAllByType('button').find(n=>text(n)===label||n.props['aria-label']===label);
const click=async label=>{const control=button(label);assert.ok(control,label);await act(async()=>control.props.onClick());};
const status=()=>text(tree.root.findByProps({role:'status'}));
await act(async()=>{tree=create(h(ModuleRecap,{moduleId:recapBooks[0].id,onClose(){closed++;},completedLessonIds:completed}));});
assert.equal(document.body.style.overflow,'hidden');
assert.equal(button('Previous').props.disabled,true);
assert.equal(status(),`Chapter 1 of ${recapBooks[0].chapters.length}`);
await click('Next');
assert.equal(status(),`Chapter 2 of ${recapBooks[0].chapters.length}`);
await click('Previous');
await click('Contents');
const nav=tree.root.findByProps({'aria-label':'Recap chapters'});
await act(async()=>nav.findAllByType('button').at(-1).props.onClick());
assert.equal(status(),`Chapter ${recapBooks[0].chapters.length} of ${recapBooks[0].chapters.length}`);
assert.equal(tree.root.findAllByProps({'aria-label':'Recap chapters'}).length,0);
assert.ok(button('Return to course'));
const key=async(key,tagName='DIV')=>act(async()=>tree.root.findByProps({role:'dialog'}).props.onKeyDown({key,target:{tagName},preventDefault(){},stopPropagation(){}}));
await key('ArrowRight');
assert.ok(button('Return to course'),'Arrow cannot move beyond final chapter');
await key('ArrowLeft','BUTTON');
assert.ok(button('Return to course'),'Arrow on interactive controls does not hijack their keys');
await key('ArrowLeft');
assert.ok(button('Next'));
await click('Print / Save PDF');assert.equal(printed,1);
await key('Escape');assert.equal(closed,1);
assert.deepEqual(completed,['p01-l01'],'Recap does not mutate learner completion');
await act(async()=>tree.unmount());
assert.equal(document.body.style.overflow,'auto','Closing restores scroll');
console.log('Recaps: 16 books, 68 chapters, 276 unique lesson sources, 275 transcript fingerprints; print content, navigation, bounds, keyboard, unchanged completion and 11 editorial revisions passed.');
