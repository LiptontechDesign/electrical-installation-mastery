import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';

await build({entryPoints:['app/personal-course-model.ts','app/course-curriculum.ts','app/course-progress-model.ts'],outdir:'work/c1-rashid-tests',bundle:true,platform:'node',format:'esm'});
const {publishedPersonalCourse:base,parsePersonalCourse:parse,personalCourseSnapshot:snapshot,applyCourseEdit:apply}=await import('../work/c1-rashid-tests/personal-course-model.js');
const {isRequiredStudyVideo:required}=await import('../work/c1-rashid-tests/course-curriculum.js');
const {progressForVideos}=await import('../work/c1-rashid-tests/course-progress-model.js');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const prior=read('scripts/fixtures/c1-rashid-previous.json'),untouched=structuredClone(prior);
const additions=read('scripts/fixtures/c1-rashid-additions.json'),addedIds=new Set(additions.map(v=>v.id));
const catalog=read('app/video-catalog.json'),sections=read('app/learning-sections.json'),evidence=read('docs/c1-rashid-video-review.json');
const laterIds=new Set(read('scripts/fixtures/c1-protection-additions.json').map(v=>v.id));
const upgraded=parse(prior),view=snapshot(upgraded),core=new Map(catalog.modules.flatMap(m=>m.lessons).map(l=>[l.id,l]));
assert.equal(Object.values(prior.groups).flat().length,485,'Actual pre-addition published snapshot');
assert.equal(prior.curriculumRevision,13);assert.equal(upgraded.curriculumRevision,13);
assert.deepEqual(prior,untouched);assert.deepEqual(upgraded.groups,base.groups);assert.deepEqual(parse(upgraded),upgraded);
for(const [id,ids] of Object.entries(prior.groups))assert.deepEqual(upgraded.groups[id],ids,'Existing section order remains intact: '+id);
for(const key of ['revision','videos','itemRevisions','receipts','archivedLessonIds','deletedIds'])assert.deepEqual(upgraded[key],prior[key]);
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id=>!addedIds.has(id)&&!laterIds.has(id)).sort(),Object.values(prior.groups).flat().sort());
assert.equal(view.allRows.length,503);assert.equal(sections.length,203);
assert.equal(view.allRows.filter(r=>view.course.modules.find(m=>m.id===r.moduleId).path==='C1').length,169);
const placement=[['c1-rashid-capacitor-bank','c1-pfc-bank-protection','c1-pfc',4],['c1-rashid-building-design','c1-building-design-capstone','c1-installation',1],['c1-rashid-mdb-transfer','c1-standby-mdb-transfer','c1-standby',2]];
for(const [id,sectionId,moduleId,number] of placement){
 assert.equal(view.byId.get(id).sectionId,sectionId);assert.equal(view.byId.get(id).moduleId,moduleId);
 const section=sections.find(s=>s.id===sectionId);assert.equal(section.number,number);assert.deepEqual(section.lessonIds,[id]);
 assert.equal(required(id),false);assert.equal(core.get(id).instructor,'Rashid iqubal');assert.equal(core.get(id).regulationSensitive,true);
 assert.ok(!section.description,'Keep the course free of additional section preambles');
}
const order=view.allRows.map(r=>r.id),before=(a,b)=>assert.ok(order.indexOf(a)>=0&&order.indexOf(a)<order.indexOf(b),a+' precedes '+b);
for(const pair of [['c1-pfc-unity-bank','c1-rashid-capacitor-bank'],['c1-rashid-capacitor-bank','c1-complex-number-foundation'],['c1-cpc-size-foundation','c1-rashid-building-design'],['c1-rashid-building-design','p07-l08'],['c1-generator-neutral-transfer','c1-rashid-mdb-transfer'],['c1-generator-transfer-operation','c1-rashid-mdb-transfer']])before(...pair);
const watched=new Set(['p06-l05','c1-pfc-unity-bank','c1-generator-transfer-operation']);
assert.deepEqual(progressForVideos(view.allRows.filter(r=>!addedIds.has(r.id)&&!laterIds.has(r.id)).map(r=>r.id),watched),progressForVideos(Object.values(prior.groups).flat(),watched));
assert.equal(evidence.selectedCount,3);assert.equal(evidence.videos.length,6);assert.equal(evidence.totalAddedDurationSeconds,3010);
for(const v of evidence.videos){
 assert.ok([v.transcript.language].flat().every(l=>/^en(?:-|$)/.test(l)));
 assert.match(v.transcript.sha256,/^[a-f0-9]{64}$/);assert.match(v.transcript.rawExportSha256,/^[a-f0-9]{64}$/);
 assert.deepEqual(v.transcript.reviewedRanges,[{startSeconds:0,endSeconds:v.transcript.captionEndSeconds}]);
 if(v.lessonId){assert.equal(core.get(v.lessonId).videoId,v.videoId);assert.equal(core.get(v.lessonId).durationSeconds,v.durationSeconds);assert.equal(v.availability.oembedAvailable,true);assert.ok(v.transcript.captionEndSeconds<=v.durationSeconds+3);}
 else assert.ok(![...core.values()].some(l=>l.videoId===v.videoId),'Do not publish rejected videos');
}
for(const v of evidence.unreviewedCandidates)assert.ok(![...core.values()].some(l=>l.videoId===v.videoId));
assert.match(core.get('c1-rashid-building-design').studyNote,/does not establish selectivity/);
assert.match(core.get('c1-rashid-building-design').studyNote,/784 A/);
assert.match(core.get('c1-rashid-capacitor-bank').studyNote,/125 kVAr bank \(about 174 A/);
assert.match(core.get('c1-rashid-mdb-transfer').studyNote,/interrupts supply/);

// Existing personal copies and their descendants must survive discovery of
// the same media in the published course, including archived copies.
const custom=structuredClone(prior);custom.revision=67;
custom.groups['c1-pfc-calculation'].reverse();
const personal=(id,videoId,anchorId,archived=false)=>({id,videoId,anchorId,title:'My calculation',instructor:'My teacher',moduleId:'module-01',position:'after',archived,placementRevision:13,updatedAt:'2026-10-21T09:00:00Z'});
const copies=additions.map((v,i)=>personal('rashid-private-copy-'+i,v.videoId,'p01-l01',i===0));
const child=personal('rashid-private-child','abcdefghijk',copies[0].id);
custom.videos.push(...copies,child);custom.groups['module-01-section-1'].push(...copies.map(v=>v.id),child.id);
custom.itemRevisions[child.id]=67;custom.itemRevisions['p06-l05']=67;custom.deletedIds=['p07-l16'];custom.archivedLessonIds=['p10-l10'];
custom.receipts=[{id:'before-rashid',revision:67,affected:['p06-l05'],inverse:{positions:[{id:'p06-l05',sectionId:'c1-design-section-2',beforeId:null,afterId:null}],videos:[],archiveIds:[]}}];
custom.groups['c1-design-section-2']=[];custom.groups['module-01-section-1'].push('p06-l05','c1-cable-design');
const kept=parse(custom),keptView=snapshot(kept);
assert.deepEqual(kept.videos.filter(v=>v.id.startsWith('rashid-private-')),[...copies,child]);
for(const [id,ids] of Object.entries(custom.groups))assert.deepEqual(kept.groups[id],ids.filter(id=>!custom.deletedIds.includes(id)),'Preserve custom mixed order: '+id);
assert.equal(keptView.byId.get(child.id).sectionId,'module-01-section-1');
assert.ok(!keptView.byId.has(copies[0].id));
for(const key of ['revision','receipts','itemRevisions','archivedLessonIds','deletedIds'])assert.deepEqual(kept[key],custom[key]);
assert.deepEqual(parse(kept),kept);
const edit=(state,edit)=>apply(state,{operationId:crypto.randomUUID(),revision:state.revision,edit});
assert.equal(snapshot(edit(kept,{type:'undo',targetOperationId:'before-rashid'})).byId.get('p06-l05').sectionId,'c1-design-section-2');
const moved=edit(upgraded,{type:'move',id:'c1-rashid-building-design',sectionId:'module-01-section-1',beforeId:null});
assert.equal(snapshot(parse(moved)).byId.get('c1-rashid-building-design').sectionId,'module-01-section-1');
const deleted=edit(moved,{type:'delete',id:'c1-rashid-mdb-transfer'});
assert.ok(!snapshot(parse(deleted)).byId.has('c1-rashid-mdb-transfer'));
console.log('PASS C1 Rashid additions: reviewed English content, prerequisite placement, technical qualifications, saved course preservation, private copies, archive/delete and historical Undo.');
