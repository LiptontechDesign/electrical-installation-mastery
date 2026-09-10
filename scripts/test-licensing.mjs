import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';
import {renderToString} from 'katex';
await build({entryPoints:['app/course-curriculum.ts','app/checkpoint-plan.ts','app/assessment-data.ts','app/lesson-guides.ts','app/module-recaps.ts','app/supplementary-defaults.ts','app/integrated-content.ts','app/integrated-progress.ts','app/course-bridge-data.ts','app/overview-answers.ts'],outdir:'work/licensing-check',bundle:true,platform:'node',format:'esm'});
const {default:course,legacyModules}=await import('../work/licensing-check/course-curriculum.js');
const {checkpointPlan,legacyScopes}=await import('../work/licensing-check/checkpoint-plan.js');
const {buildAssessmentBank}=await import('../work/licensing-check/assessment-data.js');
const {lessonGuides}=await import('../work/licensing-check/lesson-guides.js');
const {recapBooks}=await import('../work/licensing-check/module-recaps.js');
const {withSupplementaryDefaults}=await import('../work/licensing-check/supplementary-defaults.js');
const old=legacyModules.flatMap(m=>m.lessons),lessons=course.modules.flatMap(m=>m.lessons);
const additions=JSON.parse(readFileSync('app/integrated-video-index.json','utf8'));
assert.equal(lessons.length,296);
assert.deepEqual(lessons.map(l=>l.id).sort(),[...old,...additions].map(l=>l.id).sort());
assert.equal(new Set(lessons.map(l=>l.videoId)).size,296);
for(const lesson of lessons){
 const before=old.find(l=>l.id===lesson.id);
 if(before)for(const key of ['videoId','url','title','durationSeconds'])assert.equal(lesson[key],before[key],lesson.id+' '+key);
 assert.ok(lessonGuides[lesson.id]);
}
assert.deepEqual(course.modules.map(m=>m.path),[...Array(9).fill('C2'),...Array(10).fill('C1'),...Array(6).fill('Professional')]);
const bank=buildAssessmentBank(course.modules,lessonGuides);
for(const module of course.modules){
 const book=recapBooks.find(b=>b.id===module.id);
 assert.deepEqual(book.chapters.flatMap(c=>c.lessons.map(l=>l.id)),module.lessons.map(l=>l.id));
 const checks=bank.checkpointsByModule[module.id];
 assert.deepEqual(checks.at(-1).lessonIds,module.lessons.map(l=>l.id));
 assert.ok(bank.modules[module.id].questions.length);
 for(const item of checkpointPlan[module.id]){
  if(!item.legacyId)continue;
  const scope=legacyScopes.find(s=>s.id===item.legacyId);
  const end=module.lessons.findIndex(l=>l.id===item.throughLessonId);
  assert.deepEqual(scope.lessonIds,module.lessons.slice(0,end+1).map(l=>l.id));
 }
}
const index=id=>lessons.findIndex(l=>l.id===id);
for(const [before,after] of [['p03-l14','p03-l01'],['p05-l01','p05-l03'],['p05-l07','p05-l06'],['p06-l01','p03-l12'],['p08-l03','p08-l08'],['p07-l01','p06-l05'],['p07-induction','p04-l19']])assert.ok(index(before)<index(after),before+' before '+after);
const empty={version:1,revision:0,videos:[]},state=withSupplementaryDefaults(empty);
assert.equal(state.videos.length,0);
assert.equal(new Set(state.videos.map(v=>v.videoId)).size,0);
for(const video of state.videos){
 assert.ok(!lessons.some(l=>l.videoId===video.videoId));
 assert.ok(course.modules.find(m=>m.id===video.moduleId).lessons.some(l=>l.id===video.anchorId));
}
const sample={id:'fixture',videoId:'abcdefghijk',moduleId:'module-01',anchorId:'p01-l01',position:'after',title:'Fixture',instructor:'Fixture',updatedAt:'2026-09-10T00:00:00Z'};
const archived={...sample,archived:true,placementRevision:undefined};
assert.equal(withSupplementaryDefaults({...empty,videos:[archived]}).videos.find(v=>v.id===archived.id).archived,true);
const moved={...sample,archived:false,anchorId:'p07-induction',moduleId:'c1-motors',placementRevision:1};
assert.equal(withSupplementaryDefaults({...empty,videos:[moved]}).videos.find(v=>v.id===moved.id).anchorId,moved.anchorId);
assert.deepEqual(withSupplementaryDefaults(state),state);
assert.equal(withSupplementaryDefaults({...empty,videos:additions.map(v=>({...sample,id:v.id,videoId:v.videoId}))}).videos.length,0);
const {integratedTeaching}=await import('../work/licensing-check/integrated-content.js');
const {importPromotedWatched}=await import('../work/licensing-check/integrated-progress.js');
const {courseBridges}=await import('../work/licensing-check/course-bridge-data.js');
const {overviewFormulas}=await import('../work/licensing-check/overview-answers.js');
const stems=new Set(),fronts=new Set();
for(const video of additions){
 const lesson=lessons.find(l=>l.id===video.id),teaching=integratedTeaching[video.id],assessment=bank.lessons[video.id];
 assert.equal(lesson.videoId,video.videoId);
 assert.ok(teaching.questions.length>=3);
 assert.equal(assessment.questions.length,teaching.questions.length);
 assert.equal(assessment.flashcards.length,teaching.questions.length+1);
 const module=course.modules.find(m=>m.lessons.some(l=>l.id===video.id));
 assert.ok(module.lessons.some(l=>l.id===video.anchor));
 assert.equal(index(video.id)>index(video.anchor),video.position==='after');
 for(const q of teaching.questions){
  assert.ok(!stems.has(q.prompt),'Unique authored question: '+q.prompt);stems.add(q.prompt);
  assert.equal(new Set([q.correct,...q.wrong]).size,4);
  assert.equal(q.errors.length,3);
  assert.ok(q.errors.every(e=>e.length>20));
  assert.ok(q.why.length>40);
  assert.ok(!fronts.has(q.recall.prompt),'Unique flashcard');fronts.add(q.recall.prompt);
 }
 if(teaching.retrieval.workingTex)renderToString(teaching.retrieval.workingTex,{throwOnError:true,strict:'error'});
 if(overviewFormulas[video.id])renderToString(overviewFormulas[video.id],{throwOnError:true,strict:'error'});
}
for(const [id,bridge] of Object.entries(courseBridges)){
 assert.ok(lessons.some(l=>l.id===id),'Bridge anchor '+id);
 assert.ok(bridge.sources.length&&bridge.rows.length&&bridge.prompt&&bridge.answer);
 if(bridge.formula)renderToString(bridge.formula,{throwOnError:true,strict:'error'});
}
const migrated=importPromotedWatched({completedLessonIds:['p01-l01'],completedLessonAssessmentIds:[]},[additions[0].videoId]);
assert.deepEqual(migrated.completedLessonIds,['p01-l01',additions[0].id]);
assert.deepEqual(migrated.completedLessonAssessmentIds,[]);
assert.deepEqual(importPromotedWatched({...migrated,completedLessonIds:[]},[additions[0].videoId]).completedLessonIds,[]);
assert.deepEqual(importPromotedWatched({completedLessonIds:[]},{invalid:true}),{completedLessonIds:[]});
console.log('Transcript additions: '+additions.length+' lessons, '+stems.size+' distinct questions, '+(fronts.size+additions.length)+' flashcards; '+Object.keys(courseBridges).length+' written bridges.');
console.log(JSON.stringify({status:'passed',coreLessons:lessons.length,stages:course.modules.length,checkpoints:bank.checkpointList.length,supplementary:state.videos.length,paths:course.modules.reduce((out,m)=>({...out,[m.path]:(out[m.path]??0)+m.lessons.length}),{})},null,2));
