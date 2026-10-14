import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { assertC2Reorganization, c2StageOrder } from './assert-c2-reorganization.mjs';
await build({entryPoints:['app/course-curriculum.ts','app/learning-sections.ts','app/integrated-progress.ts','app/supplementary-defaults.ts','app/course-drop-model.ts'],outdir:'work/licensing-check',bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic'});
const {default:course}=await import('../work/licensing-check/course-curriculum.js');
const {sectionsByModule,learningSections}=await import('../work/licensing-check/learning-sections.js');
const {importPromotedWatched}=await import('../work/licensing-check/integrated-progress.js');
const {withSupplementaryDefaults}=await import('../work/licensing-check/supplementary-defaults.js');
const {courseMapSnapshot}=await import('../work/licensing-check/course-drop-model.js');
assert.deepEqual(course.modules.map(m=>m.path),[...Array(9).fill('C2'),...Array(10).fill('C1'),...Array(6).fill('Professional')]);
assertC2Reorganization(course);
assert.equal(learningSections.length, 144);
assert.equal(new Set(learningSections.map(s=>s.id)).size, 144);
for(const [moduleId,expected] of Object.entries(c2StageOrder)) {
 assert.deepEqual(sectionsByModule[moduleId].map(({title,lessonIds})=>({title,lessonIds})),expected);
}
for(const stage of course.modules){
 const sections=sectionsByModule[stage.id];
 assert.deepEqual(sections.flatMap(s=>s.lessonIds),stage.lessons.map(l=>l.id));
 sections.forEach((section,i)=>assert.equal(section.number,i+1));
}
const initial={completedLessonIds:[]};
const promoted=importPromotedWatched(initial,['UFvL7wTFzl0']);
assert.ok(promoted.completedLessonIds.includes('course-UFvL7wTFzl0'));
assert.deepEqual(importPromotedWatched(promoted,[]),promoted);
const supplements=withSupplementaryDefaults({version:1,revision:0,videos:[]}).videos;
assert.equal(supplements.length,32);
const addedC2=['o8pcBZSGa6s','wAcqKNBxy-w','xxsB91hzSeY','OwpTVeJ231A','RBXeU_9UUbo','nVi5Idyt-jE','yMgyWxzGN-U','2_Bi49tWK_I','QVMpVIYm594'];
for(const id of addedC2)assert.ok(supplements.some(video=>video.videoId===id&&course.modules.find(module=>module.id===video.moduleId)?.path==='C2'),`C2 supplementary placement: ${id}`);
const addedC1=['bSjh8AakqXM','T2eO6hOT-EA','TPsHULaNc7s','ChC_94Zmf4I','RCHw0TUEAes','u9m8vgz4aJs','oaIRQ1Xm7OQ','p2hDLMeFJqs','DWUuKNjMf3E','-OCfG8inGSY','0MVNJUstzCY','CDW_SKOgYSY','AtlXd1xA-CU'];
for(const id of addedC1)assert.ok(supplements.some(video=>video.videoId===id&&course.modules.find(module=>module.id===video.moduleId)?.path==='C1'),`C1 supplementary placement: ${id}`);
const rows=courseMapSnapshot({version:1,revision:0,groups:{}},supplements).rows;
const ids=sectionId=>rows[sectionId].map(row=>row.id);
const c1Plan = JSON.parse(await (await import('node:fs/promises')).readFile('app/c1-learning-update.json','utf8'));
for(const [sectionId, expected] of Object.entries(c1Plan.current)) assert.deepEqual(ids(sectionId), expected);
console.log('PASS: course paths, section coverage, supplementary placement and promoted-video progress migration.');
