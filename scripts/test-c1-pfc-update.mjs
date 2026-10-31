import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
await build({entryPoints:['app/personal-course-model.ts','app/supplementary-defaults.ts'],outdir:'work/pfc-tests',bundle:true,platform:'node',format:'esm'});
const {parsePersonalCourse:parse,personalCourseSnapshot:snapshot}=await import('../work/pfc-tests/personal-course-model.js');
const {withSupplementaryDefaults}=await import('../work/pfc-tests/supplementary-defaults.js');
const previous=read('scripts/fixtures/c1-pfc-previous.json'),update=read('app/c1-pfc-update.json'),catalog=read('app/video-catalog.json'),sections=read('app/learning-sections.json');
const original=structuredClone(previous),state=parse(previous),view=snapshot(state), c1=catalog.modules.filter(m=>m.path==='C1');
assert.deepEqual(previous,original);assert.equal(state.curriculumRevision,14);assert.deepEqual(parse(state),state);
for(const [id,rows] of Object.entries(previous.groups))assert.deepEqual(state.groups[id],rows,`Prior section unchanged: ${id}`);
for(const k of ['revision','videos','itemRevisions','receipts','archivedLessonIds','deletedIds'])assert.deepEqual(state[k],previous[k]);
assert.deepEqual(c1.map(m=>m.id),update.moduleOrder);assert.equal(c1[11].id,'module-07');assert.equal(c1[12].id,'c1-pfc');
const pfcModule=c1[12], pfSections=sections.filter(s=>s.moduleId===pfcModule.id),lessons=pfcModule.lessons;
assert.deepEqual(pfSections.flatMap(s=>s.lessonIds),lessons.map(l=>l.id));
assert.deepEqual(lessons.filter(l=>update.addedLessonIds.includes(l.id)).map(l=>l.videoId),['-kyppHRdwX4','-7yilF7U6i4','5084gua6bzY','pyW7vbB3rP0']);
assert.equal(pfcModule.durationSeconds,lessons.reduce((n,l)=>n+l.durationSeconds,0));
assert.equal(view.allRows.length,576);
for(const id of update.addedLessonIds){const lesson=lessons.find(l=>l.id===id);assert.ok(lesson);assert.equal(lesson.studyNote,undefined);assert.ok(view.byId.has(id));}
for(const id of update.addedSectionIds){let section=pfSections.find(s=>s.id===id);assert.deepEqual(section.lessonIds,update.current[id]);assert.equal(section.description,undefined);}
assert.ok(!catalog.modules.flatMap(m=>m.lessons).some(l=>['61m2l-moltc','UbhEL_yG57k','q2LHmZ6NbEY'].includes(l.videoId)));
const custom=structuredClone(previous);custom.revision=92;custom.archivedLessonIds=['c1-pfc-unity-bank'];custom.deletedIds=['c1-pfc-target-foundation'];
const kept=parse(custom);assert.equal(kept.revision,92);assert.deepEqual(kept.archivedLessonIds,custom.archivedLessonIds);assert.deepEqual(kept.deletedIds,custom.deletedIds);assert.ok(!snapshot(kept).byId.has('c1-pfc-target-foundation'));
const copy={id:'personal-pfc-copy',videoId:'5084gua6bzY',title:'My panel lesson',instructor:'My teacher',anchorId:'p01-l01',position:'after',moduleId:'module-01',archived:false,updatedAt:'2026-10-30T00:00:00.000Z'};
const result=withSupplementaryDefaults({version:1,revision:1,videos:[copy]});assert.ok(result.videos.some(v=>v.id===copy.id),'Prior personal copy is preserved');
console.log('PASS power-factor order, four lessons, old memberships and state, English-only selection and existing personal copy');
