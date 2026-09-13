import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
await build({entryPoints:['app/course-curriculum.ts','app/licensing-ui.tsx','app/learning-sections.ts','app/integrated-progress.ts','app/supplementary-defaults.ts'],outdir:'work/licensing-check',bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic'});
const {default:course}=await import('../work/licensing-check/course-curriculum.js');
const {LicensingOverview,LicensingStageGuide}=await import('../work/licensing-check/licensing-ui.js');
const {sectionsByModule,learningSections}=await import('../work/licensing-check/learning-sections.js');
const {importPromotedWatched}=await import('../work/licensing-check/integrated-progress.js');
const {withSupplementaryDefaults}=await import('../work/licensing-check/supplementary-defaults.js');
assert.deepEqual(course.modules.map(m=>m.path),[...Array(9).fill('C2'),...Array(10).fill('C1'),...Array(6).fill('Professional')]);
assert.equal(learningSections.length,82);
assert.equal(new Set(learningSections.map(s=>s.id)).size,82);
for(const stage of course.modules){
 const sections=sectionsByModule[stage.id];
 assert.deepEqual(sections.flatMap(s=>s.lessonIds),stage.lessons.map(l=>l.id));
 sections.forEach((section,i)=>{assert.equal(section.number,i+1);assert.equal(section.throughLessonId,section.lessonIds.at(-1));assert.ok(!('questions' in section));});
 assert.ok(renderToStaticMarkup(h(LicensingStageGuide,{moduleId:stage.id})).includes(stage.title.replaceAll('&','&amp;')));
}
for(const initialPath of ['C2','C1',null]){
 const html=renderToStaticMarkup(h(LicensingOverview,{initialPath,completed:[],onLesson(){}}));
 assert.ok(!/checkpoint|written practice|80%|Start.*timer/i.test(html));
 if(initialPath)assert.ok(html.includes('Oral and practical preparation'));
}
const all=course.modules.flatMap(m=>m.lessons.map(l=>l.id));
const complete=renderToStaticMarkup(h(LicensingOverview,{completed:all,onLesson(){}}));
assert.ok(complete.includes('C2 core videos watched')&&complete.includes('C1 core videos watched'));
const initial={completedLessonIds:[]};
const promoted=importPromotedWatched(initial,['UFvL7wTFzl0']);
assert.ok(promoted.completedLessonIds.includes('course-UFvL7wTFzl0'));
assert.deepEqual(importPromotedWatched(promoted,[]),promoted);
assert.equal(withSupplementaryDefaults({version:1,revision:0,videos:[]}).videos.length,0);
console.log('PASS: licensing paths, neutral section coverage, oral preparation, watched-only milestones and promoted-video migration.');
