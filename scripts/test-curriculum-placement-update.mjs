import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { surgeProtectionAdditions, designLearningAdditions, connectedProcessAdditions, overviewIds } from './assert-c2-reorganization.mjs';
const surgeIds = new Set([...surgeProtectionAdditions, ...designLearningAdditions, ...connectedProcessAdditions].map(lesson => lesson.id));
await build({entryPoints:['app/personal-course-model.ts','app/course-order-model.ts','app/course-progress-model.ts'],outdir:'work/placement-tests',bundle:true,platform:'node',format:'esm'});
const model=await import('../work/placement-tests/personal-course-model.js');
const { orderedSections, moveLesson }=await import('../work/placement-tests/course-order-model.js');
const { progressForVideos }=await import('../work/placement-tests/course-progress-model.js');
const {publishedPersonalCourse:base,parsePersonalCourse:parse,personalCourseSnapshot:snapshot,applyCourseEdit:apply,migratePersonalCourse}=model;
const before=JSON.parse(readFileSync('scripts/fixtures/curriculum-review-previous.json','utf8'));
const catalog=JSON.parse(readFileSync('app/video-catalog.json','utf8'));
const sections=JSON.parse(readFileSync('app/learning-sections.json','utf8'));
const original=structuredClone(before);
const upgraded=parse(before);
const view=snapshot(upgraded);
const idFor=videoId=>catalog.modules.flatMap(m=>m.lessons).find(v=>v.videoId===videoId&&!overviewIds.has(v.id))?.id??base.videos.find(v=>v.videoId===videoId&&!overviewIds.has(v.id))?.id;
const change=(state,edit)=>apply(state,{revision:state.revision,operationId:crypto.randomUUID(),edit});
assert.deepEqual(upgraded.groups,base.groups,'An actual revision-2 saved course receives the complete public teaching order');
assert.deepEqual(before,original,'Reading never mutates the saved input');
assert.deepEqual(parse(upgraded),upgraded,'The update is idempotent');
assert.equal(upgraded.curriculumRevision, 6);
assert.equal(upgraded.revision,before.revision,'A read does not consume an edit revision');
assert.equal(view.allRows.length, 387);
assert.equal(Object.keys(view.rows).length, 125);
assert.equal(sections.length, 125);
assert.ok(Object.values(view.rows).every(rows=>rows.length),'All published sections contain videos, including supplementary-only sections');
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id=>!surgeIds.has(id)).sort(),Object.values(before.groups).flat().sort(),'No old video is lost or duplicated');
assert.ok(Object.keys(before.groups).every(id=>Object.hasOwn(upgraded.groups,id)),'Every previous section remains a valid edit/Undo destination');
assert.equal(catalog.modules.length,25);

const expectedHomes={
  zVg40FUj3Ts:'module-04-conduit-lighting',
  '0D_EGvEqElE':'module-04-routing-first-fix',
  a0emBNu6Aoo:'module-04-routing-first-fix',
  eWHQRcO071E:'module-03-equipment-ratings',
  bvUZ2L7eHSE:'module-03-equipment-ratings',
  QVMpVIYm594:'module-06-section-1',
  DRxoEzWzZVs:'module-06-ring-design',
  '105Zv2Oplx0':'module-06-ring-design',
  Mxv3OVVjANs:'module-09-rcd-leakage',
  zIPgYcLdQZE:'module-08-section-4',
  TFt3d77LujQ:'module-08-section-2',
  dMtxkhL6c8I:'module-08-cpc-continuity',
  zXi35z_WHSY:'module-08-ring-continuity',
  q4UTihwOloA:'module-08-insulation-resistance',
  '5gArjikCqSE':'module-08-section-3',
  zwuByd7PwMY:'module-08-external-loop-pfc',
  eOW2ohFXULE:'module-08-circuit-loop',
  JIdARijhacs:'module-08-section-6',
  UJZLP8ttrd4:'module-09-section-1',
  Onf6P_bA0XU:'module-09-lighting-faults',
  'AtlXd1xA-CU':'c1-faults-motor-phase-loss',
  KceE8zdk35g:'c1-faults-thermal-diagnosis',
  yiuZkfuwzPs:'module-14-pv-verification',
  UPfUn5ki7OM:'module-14-section-2',
  '0NVSpbYT3D8':'module-12-section-8',
};
for(const [videoId,sectionId]of Object.entries(expectedHomes))assert.equal(view.byId.get(idFor(videoId))?.sectionId,sectionId,videoId+' has its reviewed topic home');
assert.deepEqual(Object.values(view.rows).filter(rows=>rows[0]?.moduleId==='module-08').map(rows=>rows.length),[9,2,4,2,3,5,1,4,2,2,2,4]);
assert.deepEqual(Object.values(view.rows).filter(rows=>rows[0]?.moduleId==='module-09').map(rows=>rows.length),[3,1,3,6,2,5,2]);
assert.equal(view.byId.get(idFor('tURG2VZd56w')).displayNumber+1,view.byId.get(idFor('zVg40FUj3Ts')).displayNumber,'Conduit explanation precedes the second-fix demonstration');
assert.ok(view.byId.get(idFor('UPfUn5ki7OM')).displayNumber<view.byId.get(idFor('LLfU47Zs3Qc')).displayNumber,'Inverter principle precedes installation');
assert.ok(view.byId.get(idFor('LLfU47Zs3Qc')).displayNumber<view.byId.get(idFor('yiuZkfuwzPs')).displayNumber,'PV verification follows installation');
assert.equal(view.rows['c1-testing-section-1'][0].id,'p08-l07');
for(const id of ['p07-l16','p12-v2-l22']){
  const lesson=catalog.modules.flatMap(m=>m.lessons).find(l=>l.id===id);
  assert.equal(lesson.required,false);assert.equal(lesson.studyRole,'Optional extension');
}
assert.match(catalog.modules.find(m=>m.id==='c1-earthing').description,/Part 1 in Module 5, Section 6/);

const marked=new Set(Object.keys(expectedHomes).map(idFor).slice(0,16));
assert.deepEqual(progressForVideos(view.allRows.filter(row=>!surgeIds.has(row.id)).map(row=>row.id),marked),progressForVideos(Object.values(before.groups).flat(),marked),'Overall watched totals survive all moves');
for(const row of view.allRows.filter(row=>marked.has(row.id)))assert.ok(progressForVideos(view.rows[row.sectionId].map(r=>r.id),marked).watched>0);
for(const moduleId of new Set(view.allRows.map(row=>row.moduleId))){
  const rows=view.allRows.filter(row=>row.moduleId===moduleId);
  assert.deepEqual(rows.map(row=>row.displayNumber),rows.map((_,i)=>i+1));
}

const custom=structuredClone(before);
const moved='p10-l04',destination='professional-cables-section-1';
custom.groups['module-03-section-5']=custom.groups['module-03-section-5'].filter(id=>id!==moved);
custom.groups[destination].push(moved);
custom.itemRevisions[moved]=12;
custom.receipts=[{id:'previous-personal-move',revision:12,affected:[moved],inverse:{positions:[{id:moved,sectionId:'module-03-section-5',beforeId:null,afterId:'p10-l03'}],videos:[],archiveIds:[]}}];
const preserved=parse(custom);
assert.equal(snapshot(preserved).byId.get(moved).sectionId,destination,'An explicit destination elsewhere is preserved');
assert.deepEqual(preserved.receipts,custom.receipts);
assert.deepEqual(preserved.itemRevisions,custom.itemRevisions);
const undone=change(preserved,{type:'undo',targetOperationId:'previous-personal-move'});
assert.equal(snapshot(parse(undone)).byId.get(moved).sectionId,'module-03-section-5','Old section identities keep Undo working');
const later=change(upgraded,{type:'move',id:idFor('Mxv3OVVjANs'),sectionId:'module-08-section-4',beforeId:null});
assert.equal(snapshot(parse(later)).byId.get(idFor('Mxv3OVVjANs')).sectionId,'module-08-section-4','A subsequent revision-3 personal move is not reapplied');

const reversed=structuredClone(before);
reversed.groups['module-06-section-2'].reverse();
assert.deepEqual(parse(reversed).groups['module-06-ring-design'],idsFor('105Zv2Oplx0','DRxoEzWzZVs'),'Custom relative order survives splitting into a new section');
function idsFor(...videos){return videos.map(idFor);}

const removed=structuredClone(before);
removed.archivedLessonIds=[idFor('Mxv3OVVjANs')];
removed.deletedIds=[moved,'c2-socket-planning-design'];
removed.videos.find(v=>v.id==='c2-equipment-protection-classes').archived=true;
removed.groups['module-03-section-5']=removed.groups['module-03-section-5'].filter(id=>id!==moved);
removed.groups['module-06-section-4']=removed.groups['module-06-section-4'].filter(id=>id!=='c2-socket-planning-design');
removed.videos=removed.videos.filter(v=>v.id!=='c2-socket-planning-design');
const removedUp=parse(removed),removedView=snapshot(removedUp);
assert.deepEqual(removedUp.archivedLessonIds,removed.archivedLessonIds);
assert.deepEqual(removedUp.deletedIds,removed.deletedIds);
assert.equal(removedView.allRows.length,view.allRows.length-4);
for(const id of [...removed.deletedIds,...removed.archivedLessonIds,'c2-equipment-protection-classes'])assert.ok(!removedView.byId.has(id),'Removed or archived row stays inactive: '+id);
const restored=change(removedUp,{type:'restore',id:idFor('Mxv3OVVjANs'),sectionId:'module-09-rcd-leakage',beforeId:null});
assert.equal(snapshot(restored).allRows.length,view.allRows.length-3);
assert.ok(!snapshot(parse(restored)).byId.has(moved),'Restoring another video does not revive deletions');

const attached=structuredClone(before),ramp=idFor('Mxv3OVVjANs');
const extra=(id,anchorId,archived=false)=>({id,videoId:(id+'12345678901').slice(0,11),title:id,instructor:'My teacher',moduleId:'module-08',anchorId,position:'after',archived,placementRevision:2,updatedAt:'2026-09-30T12:00:00Z'});
const standalone=extra('private-overview',''),parent=extra('private-parent',ramp,true),child=extra('private-child',parent.id),protectedChild=extra('private-moved',ramp);
attached.videos.push(standalone,parent,child,protectedChild);
attached.groups['module-08-section-4'].unshift(standalone.id);
attached.groups['module-08-section-4'].splice(attached.groups['module-08-section-4'].indexOf(ramp)+1,0,parent.id,child.id,protectedChild.id);
attached.itemRevisions[protectedChild.id]=12;
const attachedUp=parse(attached),attachedView=snapshot(attachedUp);
assert.equal(attachedView.byId.get(standalone.id).sectionId,'module-08-section-4','Standalone private additions stay in their chosen section');
assert.equal(attachedView.byId.get(child.id).sectionId,'module-09-rcd-leakage','Legacy nested support follows its moved topic even through an archived parent');
assert.equal(attachedView.byId.get(protectedChild.id).sectionId,'module-08-section-4','An explicitly edited private position is preserved');
assert.ok(attachedUp.videos.find(v=>v.id===parent.id).archived);
const details=videos=>videos.filter(v=>v.id.startsWith('private-')).map(video=>Object.fromEntries(Object.entries(video).filter(([key])=>key!=='moduleId')));
assert.deepEqual(details(attachedUp.videos),details(attached.videos),'Private video identity, title, teacher, attachment, archive status and timestamps remain unchanged');
assert.equal(attachedUp.videos.find(v=>v.id===protectedChild.id).moduleId,'module-08','Stored metadata follows the explicit personal destination');
assert.equal(attachedUp.videos.find(v=>v.id===child.id).moduleId,'module-09','Nested support metadata follows its relocated group');
assert.deepEqual(parse(attachedUp),attachedUp);
assert.deepEqual(Object.values(attachedUp.groups).flat().filter(id=>!surgeIds.has(id)).sort(),Object.values(attached.groups).flat().sort());

const legacy={version:1,revision:5,groups:Object.fromEntries(Object.entries(before.groups).map(([sectionId,ids])=>[sectionId,ids.filter(id=>catalog.modules.some(m=>m.lessons.some(l=>l.id===id)))])),curriculumRevision:2};
assert.deepEqual(migratePersonalCourse(legacy,{version:1,revision:5,videos:before.videos}).groups,base.groups,'Legacy separate order/supplement documents also receive the new sequence');
const movedLegacy=moveLesson(legacy,{lessonId:moved,sectionId:'module-03-section-5',beforeId:null});
assert.ok(orderedSections(movedLegacy).find(s=>s.id==='module-03-section-5').lessonIds.includes(moved),'A later legacy personal move is also retained');
assert.throws(()=>parse({...base,curriculumRevision:-1}));
console.log('PASS: full reviewed placements, populated sections, saved/legacy upgrades, private attachments, personal order/Undo, archive/delete/restore, watched totals and numbering.');
