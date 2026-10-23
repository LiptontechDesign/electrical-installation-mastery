import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
await build({entryPoints:['app/personal-course-model.ts','app/course-progress-model.ts','app/course-curriculum.ts'],outdir:'work/c1-motor-gap-tests',bundle:true,platform:'node',format:'esm'});
const {publishedPersonalCourse:base,parsePersonalCourse:parse,personalCourseSnapshot:snapshot,applyCourseEdit:apply}=await import('../work/c1-motor-gap-tests/personal-course-model.js');
const {progressForVideos}=await import('../work/c1-motor-gap-tests/course-progress-model.js');
const {isRequiredStudyVideo:required}=await import('../work/c1-motor-gap-tests/course-curriculum.js');
const prior=read('scripts/fixtures/c1-motor-gap-previous.json'),untouched=structuredClone(prior);
const update=read('app/c1-motor-gap-update.json'),evidence=read('docs/c1-motor-gap-video-review.json');
const catalog=read('app/video-catalog.json'),sections=read('app/learning-sections.json');
const core=new Map(catalog.modules.flatMap(m=>m.lessons).map(l=>[l.id,l]));
const upgraded=parse(prior),view=snapshot(upgraded),oldIds=Object.values(prior.groups).flat(),oldSet=new Set(oldIds),newIds=new Set(update.addedLessonIds);
assert.equal(oldIds.length,503,'Actual published baseline, including all bundled occurrences');
assert.deepEqual(prior,untouched);assert.deepEqual(upgraded.groups,base.groups);assert.deepEqual(parse(upgraded),upgraded);
assert.equal(upgraded.curriculumRevision,13,'Additions do not replay historical placement migrations');
assert.equal(view.allRows.length,517);assert.equal(catalog.lessonCount,485);assert.equal(sections.length,214);
assert.equal(view.course.modules.filter(m=>m.path==='C1').length,17);
assert.equal(view.allRows.filter(r=>view.course.modules.find(m=>m.id===r.moduleId).path==='C1').length,183);
assert.deepEqual(view.allRows.filter(r=>oldSet.has(r.id)).map(r=>r.id),oldIds,'All previous mixed occurrences keep exact relative order');
for(const [id,order] of Object.entries(prior.groups))assert.deepEqual(upgraded.groups[id],order,'No original section membership changes: '+id);
for(const key of ['revision','videos','itemRevisions','receipts','archivedLessonIds','deletedIds'])assert.deepEqual(upgraded[key],prior[key]);
assert.equal(newIds.size,12);assert.equal(new Set(evidence.videos.map(v=>v.videoId)).size,12);assert.equal(update.addedSectionIds.length,10);
assert.deepEqual(evidence.videos.map(v=>v.lessonId),update.addedLessonIds);
for(const v of evidence.videos){
 const l=core.get(v.lessonId);assert.equal(l.videoId,v.videoId);assert.equal(l.studyNote,v.qualification);assert.equal(required(l.id),!read('app/c1-wound-rotor-update.json').optionalLessonIds.includes(l.id));
 assert.equal(view.byId.get(l.id).sectionId,v.sectionId);assert.equal(v.availability.oembedAvailable,true);
 assert.ok(v.transcript.language.every(lang=>/^en(?:-|$)/.test(lang)));
 assert.match(v.transcript.sha256,/^[a-f0-9]{64}$/);assert.ok(v.transcript.captionSegments>0);
 assert.deepEqual(v.transcript.reviewedRanges,[{startSeconds:0,endSeconds:v.transcript.captionEndSeconds}]);
 assert.ok(v.transcript.captionEndSeconds<=l.durationSeconds+3);assert.ok(v.teaches&&v.flowRationale&&v.limits);
}
assert.equal(evidence.totalDurationSeconds,10624);
const hunting=evidence.videos.find(v=>v.lessonId==='c1-synchronous-hunting');
assert.match(hunting.region,/fallback/);assert.ok(hunting.transcript.audioEvidence.some(t=>t.audioIsDefault&&!t.isAutoDubbed&&/^en/.test(t.id)),'Exception is original English, not a Hindi-original dub');
const order=view.allRows.map(r=>r.id),before=(a,b)=>assert.ok(order.indexOf(a)>=0&&order.indexOf(a)<order.indexOf(b),a+' precedes '+b);
for(const [a,b] of [
 ['c1-torque-speed-foundation','c1-wound-rotor-starting'],['c1-single-phase-reversing-switch','c1-single-phase-type-comparison'],
 ['c1-single-phase-type-comparison','c1-shaded-pole-principle'],['c1-synchronous-motor-foundation','c1-synchronous-hunting'],
 ['p04-l20','c1-dol-no-voltage-release'],['p07-star-delta','c1-star-delta-control-manual'],['c1-star-delta-control-manual','c1-star-delta-timer-control']
])before(a,b);
for(const id of update.reclassifiedLessonIds)assert.equal(required(id),true);
assert.ok(!sections.find(s=>s.id==='c1-precision-motors').title.startsWith('Further study:'));
assert.match(core.get('course-HFkTPmY7N7w').studyNote,/not a universal 5 kW/);
assert.match(core.get('course-wQwGZMcDGXk').studyNote,/not a 40 A instantaneous trip/);
assert.match(core.get('p07-star-delta').studyNote,/one-third/);
// Same stored watch keys retain their meaning; new lessons are never silently watched.
const watched=new Set(oldIds.filter((_,i)=>i%3===0));
assert.deepEqual(progressForVideos(view.allRows.filter(r=>oldSet.has(r.id)).map(r=>r.id),watched),progressForVideos(oldIds,watched));
assert.equal(progressForVideos(newIds,watched).watched,0);
// A real previous course with personal moves, private copies, nested/archived
// children, removal choices and receipt history survives additive normalisation.
const custom=structuredClone(prior);custom.revision=91;
custom.groups['c1-motor-slip'].splice(custom.groups['c1-motor-slip'].indexOf('c1-slip-rotor-frequency'),1);
custom.groups['module-01-section-1'].push('c1-slip-rotor-frequency');custom.itemRevisions['c1-slip-rotor-frequency']=91;
custom.archivedLessonIds=['c1-stepper-motor-principles'];custom.deletedIds=['p07-star-delta'];
const personal=(id,anchorId,archived=false,videoId='abcdefghijk')=>({id,anchorId,videoId,title:id,instructor:'My teacher',moduleId:'c1-motors',position:'after',archived,placementRevision:13,updatedAt:'2026-10-21T08:00:00Z'});
const privateRows=[personal('motor-private-root','c1-slip-rotor-frequency',true),personal('motor-private-child','motor-private-root'),...evidence.videos.map((v,i)=>personal('motor-private-copy-'+i,'c1-motor-slip',false,v.videoId))];
custom.videos.push(...privateRows);custom.groups['c1-motor-slip'].push(...privateRows.map(v=>v.id));
custom.receipts=[{id:'before-motor-additions',revision:91,affected:['c1-slip-rotor-frequency'],inverse:{positions:[{id:'c1-slip-rotor-frequency',sectionId:'c1-motor-slip',beforeId:null,afterId:null}],videos:[],archiveIds:[]}}];
const kept=parse(custom),keptView=snapshot(kept);
for(const key of ['revision','itemRevisions','receipts','archivedLessonIds','deletedIds'])assert.deepEqual(kept[key],custom[key]);
for(const [id,ids] of Object.entries(custom.groups))assert.deepEqual(kept.groups[id],ids.filter(id=>!custom.deletedIds.includes(id)),'Saved placements win: '+id);
assert.deepEqual(kept.videos.filter(v=>v.id.startsWith('motor-private-')),privateRows);
assert.equal(keptView.byId.get('c1-slip-rotor-frequency').sectionId,'module-01-section-1');
for(const id of [...custom.deletedIds,...custom.archivedLessonIds])assert.ok(!keptView.byId.has(id));
assert.deepEqual(parse(kept),kept);
const undone=apply(kept,{operationId:crypto.randomUUID(),revision:kept.revision,edit:{type:'undo',targetOperationId:'before-motor-additions'}});
assert.equal(snapshot(undone).byId.get('c1-slip-rotor-frequency').sectionId,'c1-motor-slip');
// Independent target-PF calculation checks prevent copying bad caption arithmetic.
function correction(v,f,i,pf,target){const p=v*i*pf,qc=p*(Math.tan(Math.acos(pf))-Math.tan(Math.acos(target)));return{uf:qc/(2*Math.PI*f*v*v)*1e6,current:p/(v*target)};}
assert.ok(Math.abs(correction(120,60,12,.7,1).uf-189.43)<.02);
assert.ok(Math.abs(correction(120,60,20,.4,.91).uf-324.62)<.02);
assert.ok(Math.abs(correction(120,60,20,.4,.91).current-8.7912)<.001);
console.log('PASS C1 motor additions: English evidence, original-English fallback, teaching order, independent calculations, exact 503-row baseline preservation, private copies/children, progress, removals and historical Undo.');
