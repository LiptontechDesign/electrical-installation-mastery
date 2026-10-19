import assert from 'node:assert/strict';
import fs from 'node:fs';
import {build} from 'esbuild';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
await build({entryPoints:['app/personal-course-model.ts','app/course-curriculum.ts'],outdir:'work/c1-generator-tests',bundle:true,platform:'node',format:'esm'});
const {publishedPersonalCourse:base,parsePersonalCourse:parse,personalCourseSnapshot:snapshot,applyCourseEdit:apply,migratePersonalCourse}=await import('../work/c1-generator-tests/personal-course-model.js');
const {isRequiredStudyVideo:required}=await import('../work/c1-generator-tests/course-curriculum.js');
const prior=read('scripts/fixtures/c1-generator-previous.json'),original=structuredClone(prior),update=read('app/c1-generator-update.json'),evidence=read('docs/c1-generator-video-review.json');
const catalog=read('app/video-catalog.json'),sections=read('app/learning-sections.json'),newIds=new Set(update.addedLessonIds);
const core=new Map(catalog.modules.flatMap(m=>m.lessons).map(l=>[l.id,l]));
const upgraded=parse(prior),view=snapshot(upgraded),order=view.allRows.map(r=>r.id);
assert.equal(prior.curriculumRevision,11);assert.equal(Object.values(prior.groups).flat().length,471,'Fixture is the actual published pre-generator course');
assert.equal(upgraded.curriculumRevision,12);assert.deepEqual(upgraded.groups,base.groups);assert.deepEqual(prior,original);assert.deepEqual(parse(upgraded),upgraded);
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id=>!newIds.has(id)).sort(),Object.values(prior.groups).flat().sort(),'Every original occurrence survives exactly once');
for(const [id,ids] of Object.entries(prior.groups))if(!Object.hasOwn(update.previous,id))assert.deepEqual(upgraded.groups[id],ids,'Other saved groups remain unchanged: '+id);
for(const [id,ids] of Object.entries(update.current))assert.deepEqual(upgraded.groups[id],ids);
assert.equal(view.allRows.length,478);assert.equal(view.allRows.filter(r=>view.course.modules.find(m=>m.id===r.moduleId).path==='C1').length,145);assert.equal(sections.length,190);
const before=(a,b)=>assert.ok(order.indexOf(a)>=0&&order.indexOf(a)<order.indexOf(b),a+' must precede '+b);
for(const [a,b] of [
 ['c1-ac-generation','c1-generator-set-overview'],['p07-l03','c1-generator-set-overview'],['c1-power-triangle-foundation','c1-generator-set-overview'],
 ['c1-motor-input-efficiency','c1-generator-set-overview'],['c1-generator-set-overview','c1-generator-operating-principles'],
 ['c1-generator-operating-principles','c1-generator-power-limits'],['c1-generator-power-limits','c1-generator-governor'],['c1-generator-governor','c1-generator-excitation'],
 ['c1-cable-design','c1-generator-transfer-operation'],['c1-cpc-size-foundation','c1-generator-transfer-operation'],['p07-star-delta','c1-generator-transfer-operation'],
 ['c1-certification-foundation','c1-generator-site-planning'],['p02-l11','c1-generator-site-planning'],['c1-rcd-testing-foundation','c1-generator-site-planning'],
 ['c1-generator-site-planning','c1-generator-neutral-transfer'],['c1-generator-neutral-transfer','c1-generator-three-phase-changeover'],
 ['c1-generator-three-phase-changeover','c1-generator-prestart-checks'],['c1-generator-prestart-checks','c1-generator-transfer-operation']
])before(a,b);
for(const id of newIds){assert.equal(required(id),true);assert.ok(core.get(id).durationSeconds<=(id==='c1-generator-neutral-transfer'?900:600),'Short core lessons with one justified UK earthing explanation below fifteen minutes');}
for(const id of update.reclassifiedLessonIds){assert.equal(required(id),false);assert.equal(view.byId.get(id).sectionId,'c1-generator-further-controls');}
assert.ok(sections.find(s=>s.id==='c1-generator-further-controls').title.startsWith('Further study:'));
assert.equal(['c1-generator-set-overview','c1-generator-operating-principles','c1-generator-power-limits',...update.current['c1-generator-building-integration']].reduce((n,id)=>n+core.get(id).durationSeconds,0),2798,'Core generator video time is 46 minutes 38 seconds');
assert.deepEqual(evidence.videos.map(v=>v.lessonId).sort(),[...newIds].sort());
for(const v of evidence.videos){
 assert.equal(v.videoId,core.get(v.lessonId).videoId);assert.equal(v.url,'https://www.youtube.com/watch?v='+v.videoId);assert.equal(view.byId.get(v.lessonId).sectionId,v.sectionId);
 assert.ok(v.transcript.language.every(l=>/^en(?:-|$)/.test(l)));assert.match(v.transcript.sha256,/^[a-f0-9]{64}$/);
 assert.deepEqual(v.transcript.reviewedRanges,[{startSeconds:0,endSeconds:v.transcript.captionEndSeconds}]);
 assert.ok(v.transcript.captionSegments>0&&v.transcript.captionEndSeconds<=v.durationSeconds+3);assert.equal(v.availability.playableInEmbed,true);
}
assert.deepEqual(update.current['c1-generator-building-integration'].map(id=>core.get(id).videoId),['uexkXQ_I7iE','mzCGE5wnWos','MfR2Y34U7Ww','cwBzqfZRn3I','jwBI-rd3-I4']);
assert.match(core.get('c1-generator-neutral-transfer').studyNote,/Neutral is a live conductor/);
assert.match(core.get('c1-generator-prestart-checks').studyNote,/AC\/DC sources isolated/);
assert.match(core.get('c1-generator-transfer-operation').studyNote,/not a wiring or commissioning procedure/);
assert.match(evidence.coverage.remainingPracticalGap,/does not show every/);
assert.match(core.get('c1-generator-power-limits').studyNote,/not wasted power/);
// An existing learner's own placements, nested private lessons, removed rows,
// new-media private copies and historical Undo must survive this restructuring.
const custom=structuredClone(prior);custom.revision=91;custom.groups['c1-generator-control'].reverse();
const personal=(id,anchorId,archived=false)=>({id,anchorId,videoId:(id+'12345678901').slice(0,11),title:'My '+id,instructor:'My teacher',moduleId:'c1-power',position:'after',archived,placementRevision:11,updatedAt:'2026-10-19T08:00:00Z'});
const parent=personal('gen-private-root','c1-generator-governor',true),child=personal('gen-private-child',parent.id),pin=personal('gen-private-pin','c1-generator-governor');
custom.videos.push(parent,child,pin);custom.groups['c1-generator-control'].push(parent.id,child.id,pin.id);custom.itemRevisions[pin.id]=91;
const copies=evidence.videos.map((v,i)=>({...personal('gen-private-copy-'+i,'module-01-section-1',i===0),videoId:v.videoId,moduleId:'module-01'}));
custom.videos.push(...copies);custom.groups['module-01-section-1'].push(...copies.map(v=>v.id));
custom.deletedIds=['c1-generator-power-limits'];custom.archivedLessonIds=['c1-generator-excitation'];
custom.itemRevisions['c1-ct-ratios']=91;
custom.receipts=[{id:'before-generators',revision:91,affected:['c1-ct-ratios'],inverse:{positions:[{id:'c1-ct-ratios',sectionId:'c1-generator-control',beforeId:null,afterId:null}],videos:[],archiveIds:[]}}];
const kept=parse(custom),keptView=snapshot(kept);
assert.equal(keptView.byId.get(child.id).sectionId,'c1-generator-further-controls','A private child follows its moved root through an archived parent');
assert.equal(keptView.byId.get(pin.id).sectionId,'c1-generator-control','An explicit private placement remains authoritative');
assert.deepEqual(kept.groups['c1-generator-further-controls'].filter(id=>update.reclassifiedLessonIds.includes(id)),['c1-generator-excitation','c1-generator-governor'],'Custom relative order survives the split');
assert.deepEqual(kept.videos.filter(v=>v.id.startsWith('gen-private-copy-')),copies,'Private copies of every new video survive canonical insertion');
assert.deepEqual(kept.itemRevisions,custom.itemRevisions);assert.deepEqual(kept.receipts,custom.receipts);assert.equal(kept.revision,91);assert.deepEqual(parse(kept),kept);
for(const id of [...custom.deletedIds,...custom.archivedLessonIds])assert.ok(!keptView.byId.has(id));
const undone=apply(kept,{operationId:crypto.randomUUID(),revision:kept.revision,edit:{type:'undo',targetOperationId:'before-generators'}});
assert.equal(snapshot(undone).byId.get('c1-ct-ratios').sectionId,'c1-generator-control','Historical Undo can still target the original generator section');
for(const target of ['c1-generator-control','module-01-section-1']){
 const pinned=structuredClone(prior);pinned.itemRevisions['c1-generator-governor']=91;
 if(target!=='c1-generator-control'){pinned.groups['c1-generator-control'].shift();pinned.groups[target].push('c1-generator-governor');}
 assert.equal(snapshot(parse(pinned)).byId.get('c1-generator-governor').sectionId,target,'Explicit existing destinations survive');
}
const later=apply(upgraded,{operationId:crypto.randomUUID(),revision:upgraded.revision,edit:{type:'move',id:'c1-generator-set-overview',sectionId:'c1-ac-waveforms',beforeId:null}});
assert.equal(snapshot(parse(later)).byId.get('c1-generator-set-overview').sectionId,'c1-ac-waveforms','Later personal moves do not replay the migration');
const legacy={version:1,revision:4,curriculumRevision:11,groups:Object.fromEntries(Object.entries(prior.groups).map(([id,ids])=>[id,ids.filter(id=>core.has(id))]))};
assert.deepEqual(migratePersonalCourse(legacy,{version:1,revision:4,videos:prior.videos}).groups,base.groups);
assert.ok(Math.abs(100000/(Math.sqrt(3)*415)-139.12054679)<1e-7);assert.equal(120*50/4,1500);assert.equal(100*.8,80);
console.log('PASS C1 generators: complete English transcript evidence, bounded core time, foundations before controls, application after design/protection/motors/testing, exact revision-11 upgrade and preservation of every identity, private copy, placement, removal, descendant and Undo.');
