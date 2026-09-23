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
assert.equal(learningSections.length,86);
assert.equal(new Set(learningSections.map(s=>s.id)).size,86);
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
assert.deepEqual(ids('c1-power-section-1'),['p06-l13','c1-balanced-three-phase-power','c1-three-phase-power-factor','c1-three-phase-line-current']);
assert.deepEqual(ids('c1-design-section-2'),['p06-l05','c1-cable-design','c1-three-phase-voltage-drop']);
assert.deepEqual(ids('c1-pfc-section-1'),['course-NIrKOVZrqnU','p06-l14','c1-capacitor-sizing','c1-capacitor-placement']);
assert.deepEqual(ids('c1-motors-section-1'),['p07-induction','course-XbL0R_9KLD4','c1-motor-terminals']);
assert.deepEqual(ids('module-07-section-1'),['p04-l21','course-HFkTPmY7N7w','p15-v2-l01','course-wQwGZMcDGXk','c1-motor-protection-sizing','p04-l19','p04-l20','c1-phase-failure-relay']);
assert.deepEqual(ids('c1-faults-section-1'),['c1-lost-neutral','c1-trace-three-phase','p10-l08','c1-motor-phase-loss','p16-l06']);
assert.equal(ids('c1-testing-section-1')[0],'course-igi8F6UAvh0');
console.log('PASS: course paths, section coverage, supplementary placement and promoted-video progress migration.');
