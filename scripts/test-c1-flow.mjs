import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
await build({entryPoints:['app/personal-course-model.ts','app/course-curriculum.ts'],outdir:'work/c1-flow-tests',bundle:true,platform:'node',format:'esm'});
const {publishedPersonalCourse:base,parsePersonalCourse:parse,personalCourseSnapshot:snapshot,applyCourseEdit:apply,migratePersonalCourse}=await import('../work/c1-flow-tests/personal-course-model.js');
const {isRequiredStudyVideo:required}=await import('../work/c1-flow-tests/course-curriculum.js');
const prior=read('scripts/fixtures/c1-flow-previous.json'),original=structuredClone(prior),update=read('app/c1-flow-update.json'),catalog=read('app/video-catalog.json'),sections=read('app/learning-sections.json'),evidence=read('docs/c1-flow-video-review.json');
const applications=read('app/c1-application-update.json');
const newIds=new Set(update.addedLessonIds),destinations=new Map(Object.entries(update.current).flatMap(([sectionId,ids])=>ids.map(id=>[id,sectionId])));
const core=new Map(catalog.modules.flatMap(m=>m.lessons).map(l=>[l.id,l])),c1Modules=new Set(catalog.modules.filter(m=>m.path==='C1').map(m=>m.id));
const upgraded=parse(prior),view=snapshot(upgraded);
assert.equal(prior.curriculumRevision,9);assert.equal(upgraded.curriculumRevision, 11);
assert.deepEqual(upgraded.groups,base.groups,'Actual revision-9 published state receives the exact revised sequence');
assert.deepEqual(prior,original);assert.deepEqual(parse(upgraded),upgraded);
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id=>!newIds.has(id)&&!applications.addedLessonIds.includes(id)).sort(),Object.values(prior.groups).flat().sort(),'Every previous occurrence survives once');
for(const [id,ids] of Object.entries(prior.groups).filter(([id])=>!Object.hasOwn(update.previous,id)&&!Object.hasOwn(applications.previous,id)))assert.deepEqual(upgraded.groups[id],ids,'Other groups stay unchanged: '+id);
for(const [id,ids] of Object.entries(update.current))assert.deepEqual(upgraded.groups[id],ids,'Explicit revised section: '+id);
assert.equal(view.allRows.filter(r=>c1Modules.has(r.moduleId)).length,138);
assert.equal(sections.filter(s=>c1Modules.has(s.moduleId)).length,84);
assert.equal(update.addedLessonIds.length,14);assert.equal(update.repeats.length,8);
for(const r of update.repeats){assert.equal(core.get(r.id).videoId,core.get(r.sourceLessonId).videoId);assert.ok(view.byId.has(r.sourceLessonId));}
const order=view.allRows.filter(r=>c1Modules.has(r.moduleId)).map(r=>r.id);
const before=(a,b)=>assert.ok(order.indexOf(a)>=0&&order.indexOf(a)<order.indexOf(b),a+' must precede '+b);
for(const [a,b] of [
 ['c1-rms-peak','c1-ac-load-types'],['c1-ac-load-types','c1-capacitor-energy'],['c1-capacitor-energy','c1-inductor-energy'],
 ['c1-inductor-energy','c1-current-voltage-waveforms'],['c1-current-voltage-waveforms','c1-ac-phasors'],['c1-ac-phasors','p02-l03'],
 ['c1-reactance-frequency','c1-reactance-inductance'],['c1-reactance-inductance','c1-reactance-capacitance'],
 ['c1-voltage-vector-demonstration','c1-voltage-phasor-drawing'],['c1-voltage-phasor-drawing','c1-voltage-triangle'],
 ['c1-voltage-triangle','c1-impedance-foundation'],['c1-impedance-foundation','c1-reactive-energy-foundation'],['c1-reactive-energy-foundation','c1-power-triangle-foundation'],
 ['c1-transformer-foundation','c1-transformer-ratio-calculations'],['c1-transformer-efficiency-example','c1-ct-ratios'],['c1-ct-ratios','c1-wattmeter-foundation'],
 ['c1-pfc-target-foundation','c1-pfc-unity-bank'],['c1-pfc-unity-bank','c1-complex-number-foundation'],['c1-complex-number-foundation','c1-complex-conjugate-foundation'],['c1-complex-conjugate-foundation','c1-shunt-pfc-examples'],
 ['c1-slip-rotor-frequency','c1-torque-speed-foundation'],['c1-torque-speed-foundation','c1-torque-slip-operating-point'],
 ['c1-lightning-strike-path','c1-surge-foundation'],['c1-surge-foundation','c1-lightning-protection-principles']
])before(a,b);
for(const id of [...update.reclassifiedLessonIds,'c1-complex-number-foundation','c1-complex-conjugate-foundation'])assert.equal(required(id),false,id+' is visibly optional depth');
for(const id of newIds)if(!id.startsWith('c1-complex-'))assert.equal(required(id),true,id+' is required introductory teaching');
for(const s of sections.filter(s=>c1Modules.has(s.moduleId)))assert.equal(s.intro,undefined,'No introductory prose added');
assert.match(sections.find(s=>s.id==='c1-switchgear-construction').title,/Medium-voltage/);
assert.match(sections.find(s=>s.id==='c1-motor-torque-curves').title,/Torque/);
assert.match(sections.find(s=>s.id==='c1-testing-outlets').title,/industrial outlets/);
assert.match(sections.find(s=>s.id==='c1-resistance-measurement').title,/Wheatstone/);
const custom=structuredClone(prior);custom.revision=63;
const privateVideo=(id,anchorId,archived=false)=>({id,anchorId,videoId:(id+'12345678901').slice(0,11),title:'My '+id,instructor:'My teacher',moduleId:'c1-fundamentals',position:'after',archived,placementRevision:9,updatedAt:'2026-10-15T18:00:00Z'});
const parent=privateVideo('flow-private-root','c1-ac-phasors',true),child=privateVideo('flow-private-child',parent.id),pin=privateVideo('flow-private-pin','c1-ac-phasors');
custom.videos.push(parent,child,pin);custom.groups['c1-ac-values-phasors'].push(parent.id,child.id,pin.id);custom.itemRevisions[pin.id]=63;
custom.groups['c1-ac-power-foundations'].reverse();
custom.groups['c1-motor-slip']=custom.groups['c1-motor-slip'].filter(id=>id!=='c1-torque-slip-operating-point');custom.groups['module-01-section-1'].push('c1-torque-slip-operating-point');custom.itemRevisions['c1-torque-slip-operating-point']=63;
const copy={...privateVideo('flow-private-copy','module-01-section-1'),videoId:'NgwXkUt3XxQ',moduleId:'module-01'};
custom.videos.push(copy);custom.groups['module-01-section-1'].push(copy.id);
custom.deletedIds=['c1-lightning-protection-principles','c1-voltage-triangle'];custom.archivedLessonIds=['c1-rms-peak','c1-inductor-energy'];
custom.receipts=[{id:'pre-flow-move',revision:63,affected:['c1-torque-slip-operating-point'],inverse:{positions:[{id:'c1-torque-slip-operating-point',sectionId:'c1-motor-slip',beforeId:null,afterId:'c1-slip-rotor-frequency'}],videos:[],archiveIds:[]}}];
const kept=parse(custom),keptView=snapshot(kept);
assert.equal(keptView.byId.get('c1-ac-phasors').sectionId,'c1-ac-wave-diagrams');
assert.ok(kept.groups['c1-ac-wave-diagrams'].includes(parent.id));assert.equal(keptView.byId.get(child.id).sectionId,'c1-ac-wave-diagrams','Nested supporting lessons follow their moved root through an archived parent');
assert.equal(keptView.byId.get(pin.id).sectionId,'c1-ac-values-phasors','Explicit supporting placement is preserved');
assert.deepEqual(kept.groups['c1-ac-power-foundations'],custom.groups['c1-ac-power-foundations'],'Custom relative order is preserved');
assert.equal(keptView.byId.get('c1-torque-slip-operating-point').sectionId,'module-01-section-1','Explicit personal destination wins');
assert.deepEqual(kept.videos.find(v=>v.id===copy.id),copy,'Private copy of a newly canonical video is retained');
assert.deepEqual(kept.itemRevisions,custom.itemRevisions);assert.deepEqual(kept.receipts,custom.receipts);assert.equal(kept.revision,63);
for(const id of [...custom.deletedIds,...custom.archivedLessonIds])assert.ok(!keptView.byId.has(id),'Removed entry remains removed: '+id);
assert.deepEqual(parse(kept),kept);
const undone=apply(kept,{operationId:crypto.randomUUID(),revision:kept.revision,edit:{type:'undo',targetOperationId:'pre-flow-move'}});
assert.equal(snapshot(undone).byId.get('c1-torque-slip-operating-point').sectionId,'c1-motor-slip','Historical Undo destination remains valid');
const pinned=structuredClone(prior);pinned.itemRevisions['c1-ac-phasors']=12;
assert.equal(snapshot(parse(pinned)).byId.get('c1-ac-phasors').sectionId,'c1-ac-values-phasors','An explicitly positioned video stays in its former published group');
const later=apply(upgraded,{operationId:crypto.randomUUID(),revision:upgraded.revision,edit:{type:'move',id:'c1-ac-phasors',sectionId:'c1-ac-values-phasors',beforeId:null}});
assert.equal(snapshot(parse(later)).byId.get('c1-ac-phasors').sectionId,'c1-ac-values-phasors','Later moves never replay the curriculum migration');
const canonicalIds=new Set(core.keys()),legacy={version:1,revision:4,curriculumRevision:9,groups:Object.fromEntries(Object.entries(prior.groups).map(([id,ids])=>[id,ids.filter(id=>canonicalIds.has(id))]))};
assert.deepEqual(migratePersonalCourse(legacy,{version:1,revision:4,videos:prior.videos}).groups,base.groups,'Legacy split documents get the same sequence');
assert.deepEqual(evidence.videos.map(v=>v.lessonId).sort(),[...newIds].sort());
for(const r of evidence.videos){
 assert.equal(r.videoId,core.get(r.lessonId).videoId);assert.equal(r.url,'https://www.youtube.com/watch?v='+r.videoId);
 assert.match(r.transcript.sha256,/^[a-f0-9]{64}$/);assert.ok(r.transcript.captionEndSeconds>0&&r.transcript.captionEndSeconds<2000);
 assert.equal(r.transcript.reviewedRanges[0].endSeconds,r.transcript.captionEndSeconds);
 assert.equal(destinations.get(r.lessonId),r.sectionId);
 if(r.transcript.language.some(l=>!/^en(?:-|$)/.test(l)))assert.match(r.transcript.reviewQualification,/translated/);
}
assert.equal(evidence.videos.filter(v=>v.transcript.language.some(l=>!/^en(?:-|$)/.test(l))).length,3);
const near=(a,b,t)=>assert.ok(Math.abs(a-b)<t);
near(Math.hypot(195,125),231.624696,.000001);near(2*Math.PI*50*.2,62.8318531,.000001);near(1/(2*Math.PI*50*1e-6),3183.0988618,.000001);
assert.equal(7**2+5**2,74);
console.log('PASS C1 flow: exact revision-9 migration, all old identities/C2 originals, prerequisite chains, visible optional depth, precise headings, supporting descendants, private copies, custom order/moves, archives/deletions, Undo, legacy state, caption qualifications and independent arithmetic.');
