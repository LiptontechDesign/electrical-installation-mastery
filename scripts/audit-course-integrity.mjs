import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
await build({entryPoints:['app/course-curriculum.ts','app/learning-sections.ts','app/lesson-guides.ts','app/module-recaps.ts'],outdir:'work/integrity-audit',bundle:true,platform:'node',format:'esm'});
const {default:course}=await import('../work/integrity-audit/course-curriculum.js');
const {sectionsByModule}=await import('../work/integrity-audit/learning-sections.js');
const {lessonGuides}=await import('../work/integrity-audit/lesson-guides.js');
const {recapBooks}=await import('../work/integrity-audit/module-recaps.js');
const baseline=JSON.parse(await readFile('scripts/course-baseline.json','utf8'));
const actual=course.modules.map(m=>({id:m.id,path:m.path,lessons:m.lessons.map(l=>({id:l.id,videoId:l.videoId,title:l.title,durationSeconds:l.durationSeconds}))}));
assert.deepEqual(actual,baseline,'Curriculum is unchanged by the assessment reset');
const lessons=course.modules.flatMap(m=>m.lessons);
assert.equal(new Set(lessons.map(l=>l.id)).size,lessons.length);
assert.equal(new Set(lessons.map(l=>l.videoId)).size,lessons.length);
for(const stage of course.modules){
 assert.deepEqual(sectionsByModule[stage.id].flatMap(s=>s.lessonIds),stage.lessons.map(l=>l.id));
 assert.deepEqual(recapBooks.find(b=>b.id===stage.id).chapters.flatMap(c=>c.lessons.map(l=>l.id)),stage.lessons.map(l=>l.id));
 stage.lessons.forEach(l=>assert.ok(lessonGuides[l.id]));
}
console.log('PASS: 296 unique lessons and videos, unchanged curriculum, complete section/recap coverage.');
