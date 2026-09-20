import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {assertC2Reorganization} from './assert-c2-reorganization.mjs';
await build({entryPoints:['app/course-curriculum.ts','app/learning-sections.ts','app/lesson-guides.ts','app/module-recaps.ts'],outdir:'work/integrity-audit',bundle:true,platform:'node',format:'esm'});
const {default:course}=await import('../work/integrity-audit/course-curriculum.js');
const {sectionsByModule}=await import('../work/integrity-audit/learning-sections.js');
const {lessonGuides}=await import('../work/integrity-audit/lesson-guides.js');
const {recapBooks}=await import('../work/integrity-audit/module-recaps.js');
assertC2Reorganization(course);
const lessons=course.modules.flatMap(m=>m.lessons);
assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
assert.equal(new Set(lessons.map(l=>l.videoId)).size,lessons.length);
for(const stage of course.modules){
 assert.deepEqual(sectionsByModule[stage.id].flatMap(s=>s.lessonIds),stage.lessons.map(l=>l.id));
 assert.deepEqual(recapBooks.find(b=>b.id===stage.id).chapters.flatMap(c=>c.lessons.map(l=>l.id)),stage.lessons.map(l=>l.id));
 stage.lessons.forEach(l=>assert.ok(lessonGuides[l.id]));
}
console.log('PASS: 296 preserved lessons; zero duplicate IDs, video IDs or normalized titles; exact C2 reorganization and complete section/recap coverage.');
