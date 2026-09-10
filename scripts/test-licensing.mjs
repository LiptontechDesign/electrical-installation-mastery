import assert from 'node:assert/strict';
import {build} from 'esbuild';
await build({entryPoints:['app/course-curriculum.ts','app/checkpoint-plan.ts','app/assessment-data.ts','app/lesson-guides.ts','app/module-recaps.ts','app/supplementary-defaults.ts'],outdir:'work/licensing-check',bundle:true,platform:'node',format:'esm'});
const {default:course,legacyModules}=await import('../work/licensing-check/course-curriculum.js');
const {checkpointPlan,legacyScopes}=await import('../work/licensing-check/checkpoint-plan.js');
const {buildAssessmentBank}=await import('../work/licensing-check/assessment-data.js');
const {lessonGuides}=await import('../work/licensing-check/lesson-guides.js');
const {recapBooks}=await import('../work/licensing-check/module-recaps.js');
const {withSupplementaryDefaults}=await import('../work/licensing-check/supplementary-defaults.js');
const old=legacyModules.flatMap(m=>m.lessons),lessons=course.modules.flatMap(m=>m.lessons);
assert.equal(lessons.length,276);
assert.deepEqual(lessons.map(l=>l.id).sort(),old.map(l=>l.id).sort());
assert.equal(new Set(lessons.map(l=>l.videoId)).size,276);
for(const lesson of lessons){
 const before=old.find(l=>l.id===lesson.id);
 for(const key of ['videoId','url','title','durationSeconds'])assert.equal(lesson[key],before[key],lesson.id+' '+key);
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
assert.equal(state.videos.length,16);
assert.equal(new Set(state.videos.map(v=>v.videoId)).size,16);
for(const video of state.videos){
 assert.ok(!lessons.some(l=>l.videoId===video.videoId));
 assert.ok(course.modules.find(m=>m.id===video.moduleId).lessons.some(l=>l.id===video.anchorId));
}
const archived={...state.videos[0],archived:true,placementRevision:undefined};
assert.equal(withSupplementaryDefaults({...empty,videos:[archived]}).videos.find(v=>v.id===archived.id).archived,true);
const moved={...state.videos[0],anchorId:'p07-induction',moduleId:'c1-motors',placementRevision:1};
assert.equal(withSupplementaryDefaults({...empty,videos:[moved]}).videos.find(v=>v.id===moved.id).anchorId,moved.anchorId);
assert.deepEqual(withSupplementaryDefaults(state),state);
console.log(JSON.stringify({status:'passed',coreLessons:lessons.length,stages:course.modules.length,checkpoints:bank.checkpointList.length,supplementary:state.videos.length,paths:course.modules.reduce((out,m)=>({...out,[m.path]:(out[m.path]??0)+m.lessons.length}),{})},null,2));
