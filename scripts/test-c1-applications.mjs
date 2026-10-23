import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const cableDesign=read('scripts/fixtures/c1-cable-design-additions.json'), laterAdditionIds=new Set([...cableDesign,...read('scripts/fixtures/c1-rashid-additions.json'), ...read('scripts/fixtures/c1-protection-additions.json'), ...read('app/c1-motor-gap-update.json').addedLessonIds.map(id=>({id})), ...read('scripts/fixtures/c1-wound-rotor-additions.json')].map(v=>v.id));
await build({entryPoints:['app/personal-course-model.ts','app/course-curriculum.ts'],outdir:'work/c1-application-tests',bundle:true,platform:'node',format:'esm'});
const {publishedPersonalCourse:base,parsePersonalCourse:parse,personalCourseSnapshot:snapshot,applyCourseEdit:apply,migratePersonalCourse}=await import('../work/c1-application-tests/personal-course-model.js');
const {isRequiredStudyVideo:required,studyNoteFor:note}=await import('../work/c1-application-tests/course-curriculum.js');
const prior=read('scripts/fixtures/c1-application-previous.json'),original=structuredClone(prior),update=read('app/c1-application-update.json'),catalog=read('app/video-catalog.json'),sections=read('app/learning-sections.json'),evidence=read('docs/c1-application-video-review.json');
const newIds=new Set(update.addedLessonIds),core=new Map(catalog.modules.flatMap(m=>m.lessons).map(l=>[l.id,l]));
const c1Modules=new Set(catalog.modules.filter(m=>m.path==='C1').map(m=>m.id));
const generators=read('app/c1-generator-update.json');
const upgraded=parse(prior),view=snapshot(upgraded),c1=view.allRows.filter(r=>c1Modules.has(r.moduleId));
assert.equal(prior.curriculumRevision,10);assert.equal(upgraded.curriculumRevision,13);
assert.equal(Object.values(prior.groups).flat().length,464,'Fixture is the actual published revision-10 state');
assert.deepEqual(upgraded.groups,base.groups,'Existing accounts receive the exact revision-11 sequence');
assert.deepEqual(prior,original);assert.deepEqual(parse(upgraded),upgraded);
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id=>!newIds.has(id)&&!generators.addedLessonIds.includes(id)&&!laterAdditionIds.has(id)).sort(),Object.values(prior.groups).flat().sort(),'Every existing occurrence survives once');
for(const [id,ids] of Object.entries(prior.groups).filter(([id])=>!Object.hasOwn(update.previous,id)&&!Object.hasOwn(generators.previous,id)))assert.deepEqual(upgraded.groups[id],ids,'Untouched groups retain their exact order: '+id);
for(const [id,ids] of Object.entries(update.current))assert.deepEqual(upgraded.groups[id],ids,'Published placement: '+id);
assert.equal(c1.length, 183);assert.equal(view.allRows.length, 517);assert.equal(sections.length, 214);
assert.equal(sections.filter(s=>c1Modules.has(s.moduleId)).length, 109);
for(const id of newIds){assert.ok(view.byId.has(id));assert.equal(required(id),true);}
assert.equal(required('c1-wheatstone-bridge'),true);assert.equal(required('c1-lorenz-demonstration'),false);
assert.match(core.get('c1-lorenz-demonstration').studyRole,/historical/);
assert.match(sections.find(s=>s.id==='c1-resistance-measurement').title,/Wheatstone/);
for(const s of sections.filter(s=>c1Modules.has(s.moduleId)))assert.equal(s.intro,undefined,'No section-introduction prose');
const order=c1.map(r=>r.id),before=(a,b)=>assert.ok(order.indexOf(a)>=0&&order.indexOf(a)<order.indexOf(b),a+' precedes '+b);
for(const pair of [
 ['c1-ct-ratios','c1-wattmeter-foundation'],['c1-wattmeter-methods','c1-analyser-setup'],['c1-analyser-setup','c1-analyser-power-readings'],
 ['c1-wheatstone-bridge','c1-lorenz-demonstration'],['c1-generator-power-limits','c1-lorenz-demonstration'],
 ['c1-building-design-plan','c1-utilization-foundation'],['c1-building-design-plan','p10-l10'],['c1-rating-factors-foundation','c1-cable-design'],
 ['c1-pfc-unity-bank','c1-synchronous-condenser-overview'],['c1-synchronous-condenser-overview','c1-complex-number-foundation'],['p07-vfd','c1-capacitor-placement'],
 ['c1-continuity-foundation','c1-test-results-resistance'],['c1-certification-foundation','c1-test-results-resistance'],['c1-test-results-resistance','c1-periodic-reporting'],
 ['c1-fire-response-principles','c1-incident-evidence'],['c1-incident-evidence','c1-incident-causes-actions']
])before(...pair);
for(const id of ['p07-l08','p10-l06','p10-l07','p07-l09']){
 for(const prerequisite of ['c1-cable-design','c1-three-phase-voltage-drop','c1-cpc-size-foundation','c1-surge-foundation'])before(prerequisite,id);
 assert.equal(view.byId.get(id).moduleId,'c1-installation','Dedicated installation module follows design/protection');
}
before('p07-l06','c1-building-design-plan');before('p08-l01','p07-l08');
before('p07-l08','p10-l06');before('p10-l07','p07-l09');before('c1-surge-foundation','c1-lightning-protection-principles');
assert.match(note('c1-capacitor-placement'),/induction generation/);
// The only moved existing row carries untouched supporting descendants;
// explicit placements, copies, removals and edit history remain authoritative.
const custom=structuredClone(prior);custom.revision=72;
const privateVideo=(id,anchorId,archived=false)=>({id,anchorId,videoId:(id+'12345678901').slice(0,11),title:'My '+id,instructor:'My teacher',moduleId:'c1-power',position:'after',archived,placementRevision:10,updatedAt:'2026-10-16T09:00:00Z'});
const parent=privateVideo('app-private-root','c1-lorenz-demonstration',true),child=privateVideo('app-private-child',parent.id),pin=privateVideo('app-private-pin','c1-lorenz-demonstration');
custom.videos.push(parent,child,pin);custom.groups['c1-resistance-measurement'].push(parent.id,child.id,pin.id);custom.itemRevisions[pin.id]=72;
const copies=evidence.videos.map((v,i)=>({...privateVideo('app-private-copy-'+i,'module-01-section-1',i===0),videoId:v.videoId,moduleId:'module-01'}));
custom.videos.push(...copies);custom.groups['module-01-section-1'].push(...copies.map(v=>v.id));
custom.groups['c1-wattmeter-measurement'].reverse();
custom.groups['c1-ct-metering']=[];custom.groups['module-01-section-1'].push('c1-ct-ratios');custom.itemRevisions['c1-ct-ratios']=72;
custom.deletedIds=['c1-generator-power-limits','c1-analyser-setup'];custom.archivedLessonIds=['c1-wheatstone-bridge','c1-synchronous-condenser-overview'];
custom.receipts=[{id:'pre-applications-move',revision:72,affected:['c1-ct-ratios'],inverse:{positions:[{id:'c1-ct-ratios',sectionId:'c1-ct-metering',beforeId:null,afterId:null}],videos:[],archiveIds:[]}}];
const kept=parse(custom),keptView=snapshot(kept);
assert.equal(keptView.byId.get('c1-lorenz-demonstration').sectionId,'c1-historical-resistance');
assert.ok(kept.groups['c1-historical-resistance'].includes(parent.id));assert.equal(keptView.byId.get(child.id).sectionId,'c1-historical-resistance');
assert.equal(keptView.byId.get(pin.id).sectionId,'c1-resistance-measurement');
assert.deepEqual(kept.groups['c1-wattmeter-measurement'],custom.groups['c1-wattmeter-measurement']);
assert.equal(keptView.byId.get('c1-ct-ratios').sectionId,'module-01-section-1');
assert.deepEqual(kept.videos.filter(v=>v.id.startsWith('app-private-copy-')),copies,'Private copies of every added YouTube ID survive');
assert.deepEqual(kept.itemRevisions,custom.itemRevisions);assert.deepEqual(kept.receipts,custom.receipts);assert.equal(kept.revision,72);
for(const id of [...custom.deletedIds,...custom.archivedLessonIds])assert.ok(!keptView.byId.has(id),'Removed entry remains removed: '+id);
assert.deepEqual(parse(kept),kept);
const undone=apply(kept,{operationId:crypto.randomUUID(),revision:kept.revision,edit:{type:'undo',targetOperationId:'pre-applications-move'}});
assert.equal(snapshot(undone).byId.get('c1-ct-ratios').sectionId,'c1-ct-metering');
for(const destination of ['c1-resistance-measurement','module-01-section-1']){
 const pinned=structuredClone(prior);pinned.itemRevisions['c1-lorenz-demonstration']=72;
 if(destination!=='c1-resistance-measurement'){pinned.groups['c1-resistance-measurement'].pop();pinned.groups[destination].push('c1-lorenz-demonstration');}
 assert.equal(snapshot(parse(pinned)).byId.get('c1-lorenz-demonstration').sectionId,destination,'Explicit destination survives the published move');
}
const removed=structuredClone(prior);removed.deletedIds=['c1-lorenz-demonstration'];
assert.ok(!snapshot(parse(removed)).byId.has('c1-lorenz-demonstration'));
const later=apply(upgraded,{operationId:crypto.randomUUID(),revision:upgraded.revision,edit:{type:'move',id:'c1-incident-evidence',sectionId:'c1-fire-response',beforeId:null}});
assert.equal(snapshot(parse(later)).byId.get('c1-incident-evidence').sectionId,'c1-fire-response','Later moves never replay the curriculum migration');
const legacy={version:1,revision:4,curriculumRevision:10,groups:Object.fromEntries(Object.entries(prior.groups).map(([id,ids])=>[id,ids.filter(id=>core.has(id))]))};
assert.deepEqual(migratePersonalCourse(legacy,{version:1,revision:4,videos:prior.videos}).groups,base.groups,'Legacy split documents receive the same sequence');
assert.deepEqual(evidence.videos.map(v=>v.lessonId).sort(),[...newIds].sort());
for(const v of evidence.videos){
 assert.equal(v.videoId,core.get(v.lessonId).videoId);assert.equal(v.url,'https://www.youtube.com/watch?v='+v.videoId);
 assert.deepEqual(v.transcript.language,['en']);assert.match(v.transcript.sha256,/^[a-f0-9]{64}$/);
 assert.deepEqual(v.transcript.reviewedRanges,[{startSeconds:0,endSeconds:v.transcript.captionEndSeconds}]);
 assert.ok(v.transcript.captionEndSeconds>0&&v.transcript.captionEndSeconds<=v.durationSeconds);
 assert.equal(view.byId.get(v.lessonId).sectionId,v.sectionId);
 if(v.transcript.rawExportSha256)assert.match(v.transcript.reviewQualification,/last exported cue/);
}
const near=(a,b)=>assert.ok(Math.abs(a-b)<.00001);
near(.766*.567/(.766+.567),.325820);near(.667*.666/(.667+.666),.3332498);near(.333+.06+.1,.493);
console.log('PASS C1 applications: actual revision-10 migration, complete old identities, focused prerequisites, optional history, protected moves/descendants/private copies/removals/Undo, English transcript evidence and independent resistance checks.');
