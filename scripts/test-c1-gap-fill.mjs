import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cableDesign=read('scripts/fixtures/c1-cable-design-additions.json'), laterAdditionIds=new Set([...cableDesign,...read('scripts/fixtures/c1-rashid-additions.json')].map(v=>v.id));
await build({entryPoints:['app/personal-course-model.ts','app/course-curriculum.ts'],outdir:'work/c1-gap-tests',bundle:true,platform:'node',format:'esm'});
const {publishedPersonalCourse:base,parsePersonalCourse:parse,personalCourseSnapshot:snapshot,applyCourseEdit:apply}=await import('../work/c1-gap-tests/personal-course-model.js');
const catalog=read('app/video-catalog.json'),sections=read('app/learning-sections.json'),update=read('app/c1-gap-fill-update.json'),evidence=read('docs/c1-gap-fill-review.json');
const previous=read('scripts/fixtures/c1-gap-fill-previous.json'), original=structuredClone(previous), flow=read('app/c1-flow-update.json');
const applications=read('app/c1-application-update.json'), generators=read('app/c1-generator-update.json');
const ids=new Set(update.addedLessonIds), core=new Map(catalog.modules.flatMap(m=>m.lessons).map(l=>[l.id,l])), c1Modules=new Set(catalog.modules.filter(m=>m.path==='C1').map(m=>m.id));
const upgraded=parse(previous),view=snapshot(upgraded);
assert.equal(previous.curriculumRevision,8);assert.equal(upgraded.curriculumRevision, 13);
assert.deepEqual(upgraded.groups,base.groups,'Actual revision-8 published snapshot upgrades to the exact new sequence');
assert.deepEqual(previous,original,'Stored snapshot is not mutated');
assert.deepEqual(parse(upgraded),upgraded,'Current normalisation is idempotent');
for(const [sectionId,old] of Object.entries(previous.groups))assert.deepEqual(upgraded.groups[sectionId].filter(id=>!ids.has(id)),old,'Every old section keeps its relative order: '+sectionId);
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id=>!ids.has(id)&&!flow.addedLessonIds.includes(id)&&!applications.addedLessonIds.includes(id)&&!generators.addedLessonIds.includes(id)&&!laterAdditionIds.has(id)).sort(),Object.values(previous.groups).flat().sort(),'Every existing occurrence survives exactly once');
// One existing MV section/video is now optional Advanced scope.
assert.equal(sections.filter(s=>c1Modules.has(s.moduleId)).length,40+update.sections.length+flow.sections.length+applications.sections.length+generators.sections.length+1-1+3);
assert.equal(view.allRows.filter(r=>c1Modules.has(r.moduleId)).length,64+ids.size+flow.addedLessonIds.length+applications.addedLessonIds.length+generators.addedLessonIds.length+cableDesign.length-1+3);
for(const sectionId of update.sections){
 const s=sections.find(s=>s.id===sectionId);
 if(sectionId==='c1-switchgear-construction')assert.equal(s.moduleId,'professional-cables');else assert.ok(c1Modules.has(s.moduleId));
 assert.equal(s.intro,undefined,'No section-introduction prose');
 assert.deepEqual(upgraded.groups[sectionId],s.lessonIds,'Additions use standard published rows');
}
assert.equal(update.repeats.length,20);
for(const repeat of update.repeats){
 const source=core.get(repeat.sourceLessonId)??previous.videos.find(v=>v.id===repeat.sourceLessonId);
 assert.equal(core.get(repeat.id).videoId,source.videoId);
 assert.ok(snapshot(upgraded).byId.has(repeat.sourceLessonId),'The C2 original remains present: '+repeat.sourceLessonId);
 assert.ok(view.byId.has(repeat.id),'The C1 copy has its own identity');
 assert.equal(view.byId.get(repeat.id).moduleId.startsWith('c1-'),true);
}
const order=view.allRows.filter(r=>c1Modules.has(r.moduleId)).map(r=>r.id);
const precedes=(a,b)=>assert.ok(order.indexOf(a)>=0&&order.indexOf(a)<order.indexOf(b),a+' must precede '+b);
for(const [a,b] of [
 ['c1-ac-generation','c1-ac-sine-wave'],['c1-ac-frequency','c1-rms-peak'],['c1-ac-phasors','p07-l01'],
 ['p07-l03','c1-clamp-current'],['c1-clamp-current','p07-l04'],
 ['c1-impedance-foundation','c1-power-triangle-foundation'],['c1-reactive-energy-foundation','p06-l14'],
 ['c1-transformer-foundation','c1-transformer-ratio-calculations'],['c1-transformer-emf-equation','c1-transformer-flux-example'],
 ['c1-transformer-losses','c1-transformer-efficiency-example'],['c1-utilization-foundation','c1-load-factor-example'],['c1-wattmeter-foundation','c1-wattmeter-methods'],['c1-load-factor-example','p10-l10'],
 ['c1-rating-factors-foundation','p06-l05'],['c1-rcd-foundation','p05-l13'],['p05-l12','c1-cpc-size-foundation'],
 ['c1-surge-foundation','c1-lightning-protection-principles'],['c1-pfc-target-foundation','c1-shunt-pfc-examples'],
 ['c1-pfc-unity-bank','c1-shunt-pfc-examples'],['course-XbL0R_9KLD4','c1-slip-rotor-frequency'],
 ['c1-slip-rotor-frequency','c1-torque-slip-operating-point'],['c1-single-phase-motor-principles','c1-single-phase-reversing-switch'],
 ['c1-dc-motor-commutation','c1-dc-winding-reversal'],['p07-star-delta','c1-autotransformer-starter'],
 ['c1-autotransformer-starter','course-_tGyaE78WTA'],['p07-vfd','c1-regenerative-drive-principles'],
 ['c1-continuity-foundation','c1-three-phase-ir-sequence'],['c1-rcd-testing-foundation','c1-certification-foundation'],
 ['c1-fluorescent-operation','c1-stroboscopic-demonstration']
])precedes(a,b);
// Personal order, moves, private copies, archives, deletion and Undo survive this additive update.
const custom=structuredClone(previous);custom.revision=51;
custom.groups['c1-fundamentals-section-1'].reverse();
custom.groups['c1-testing-section-1']=custom.groups['c1-testing-section-1'].filter(id=>id!=='c1-phase-sequence-theory');
custom.groups['module-01-section-1'].push('c1-phase-sequence-theory');custom.itemRevisions['c1-phase-sequence-theory']=51;
custom.archivedLessonIds=['p07-l02','c1-rms-peak'];custom.deletedIds=['p07-l16','c1-servo-motor-feedback'];
const copy={id:'private-gap-copy',videoId:'H0SaAq7sMN0',title:'My motor example',instructor:'My teacher',moduleId:'module-01',anchorId:'module-01-section-1',position:'after',archived:false,placementRevision:8,updatedAt:'2026-10-15T12:00:00Z'};
custom.videos.push(copy);custom.groups['module-01-section-1'].push(copy.id);
custom.receipts=[{id:'before-revision-nine',revision:51,affected:['c1-phase-sequence-theory'],inverse:{positions:[{id:'c1-phase-sequence-theory',sectionId:'c1-testing-section-1',beforeId:'course-igi8F6UAvh0',afterId:'p08-l07'}],videos:[],archiveIds:[]}}];
const kept=parse(custom),keptView=snapshot(kept);
assert.deepEqual(kept.groups['c1-fundamentals-section-1'],custom.groups['c1-fundamentals-section-1']);
assert.equal(keptView.byId.get('c1-phase-sequence-theory').sectionId,'module-01-section-1');
assert.deepEqual(kept.videos.find(v=>v.id===copy.id),copy,'A private copy of new media is preserved');
assert.deepEqual(kept.receipts,custom.receipts);assert.deepEqual(kept.itemRevisions,custom.itemRevisions);
assert.equal(kept.revision,51);assert.deepEqual(parse(kept),kept);
for(const id of [...custom.archivedLessonIds,...custom.deletedIds])assert.ok(!keptView.byId.has(id),'Removed entry stays removed: '+id);
assert.ok(keptView.byId.has('c1-ac-generation'));
const undone=apply(kept,{operationId:crypto.randomUUID(),revision:51,edit:{type:'undo',targetOperationId:'before-revision-nine'}});
assert.equal(snapshot(undone).byId.get('c1-phase-sequence-theory').sectionId,'c1-testing-section-1');
const moved=apply(upgraded,{operationId:crypto.randomUUID(),revision:upgraded.revision,edit:{type:'move',id:'c1-rms-peak',sectionId:'c1-ct-metering',beforeId:null}});
assert.equal(snapshot(parse(moved)).byId.get('c1-rms-peak').sectionId,'c1-ct-metering','New additions can be personally moved without remigration');
assert.deepEqual(evidence.videos.map(v=>v.lessonId).sort(),[...ids].sort());
for(const r of evidence.videos){
 assert.match(r.transcript.sha256,/^[a-f0-9]{64}$/);assert.ok(r.transcript.captionEndSeconds>0);
 assert.equal(r.transcript.reviewedRanges[0].endSeconds,r.transcript.captionEndSeconds);
 assert.equal(r.videoId,core.get(r.lessonId).videoId);assert.equal(r.url,'https://www.youtube.com/watch?v='+r.videoId);
 const destination=Object.entries(generators.current).find(([,ids])=>ids.includes(r.lessonId))?.[0]??Object.entries(applications.current).find(([,ids])=>ids.includes(r.lessonId))?.[0]??Object.entries(flow.current).find(([,ids])=>ids.includes(r.lessonId))?.[0]??r.sectionId;
 assert.ok(sections.find(s=>s.id===destination).lessonIds.includes(r.lessonId),'Historical review location receives its explicit later move');
 if(r.transcript.language.some(l=>!/^en(?:-|$)/.test(l)))assert.match(r.transcript.reviewQualification,/translated/);
}
assert.match(core.get('c1-certification-foundation').studyNote,/Older UK form/);
assert.match(core.get('c1-ct-ratios').studyNote,/Never open/);
assert.match(core.get('c1-servo-motor-feedback').studyNote,/does not stop/);
assert.equal(core.get('c1-lorenz-demonstration').required,false);
assert.match(evidence.videos.find(v=>v.lessonId==='c1-lorenz-demonstration').transcript.reviewQualification,/uncaptained/);
const near=(a,b,t)=>assert.ok(Math.abs(a-b)<t,a+' ≠ '+b);
near(1200/5*4.13,991.2,1e-8);
near(3000*80/200,1200,1e-8);near(200/(4.44*50*80),.01126126,1e-8);
near((200/(4.44*50*80))/(150e-4),.75075075,1e-8);
near(Math.sqrt(450/850)*40,29.104275,.000001);
near(32000/(32000+450+850)*100,96.096096,.000001);
near(85/140,.607142857,.000001);near(85/185,.459459459,.000001);near(140/185,.756756757,.000001);
near(50*(Math.tan(Math.acos(.78))-Math.tan(Math.acos(.96))),25.530738,.000001);
near(960/(2*Math.PI*50*240**2)*1e6,53.0516477,.000001);
near((1500-1455)/1500*100,3,1e-8);near(.03*50,1.5,1e-8);
near(.8**2,.64,1e-8);
console.log('PASS C1 gap fill: exact revision-8 upgrade; additive order; original C2 occurrences; prerequisite flow; saved moves, archives/deletions, private copies and Undo; caption qualifications; worked arithmetic.');
