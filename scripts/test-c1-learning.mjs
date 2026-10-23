import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { assertC2Reorganization, c1LearningAdditions, c1GapFillAdditions, c1FlowAdditions, c1ApplicationAdditions, c1GeneratorAdditions, c1CableDesignAdditions, c1RashidAdditions, c1ProtectionAdditions, c1MotorGapAdditions, c1WoundRotorAdditions } from './assert-c2-reorganization.mjs';
const read = p => JSON.parse(readFileSync(p, 'utf8'));
await build({ entryPoints: ['app/personal-course-model.ts', 'app/course-order-model.ts', 'app/course-curriculum.ts'], outdir: 'work/c1-tests', bundle: true, platform: 'node', format: 'esm' });
const { publishedPersonalCourse: base, parsePersonalCourse: parse, personalCourseSnapshot: snapshot, applyCourseEdit: apply, migratePersonalCourse } = await import('../work/c1-tests/personal-course-model.js');
const { isRequiredStudyVideo: required, studyVideoRole: role, studyNoteFor: note } = await import('../work/c1-tests/course-curriculum.js');
const before = read('scripts/fixtures/c1-learning-previous.json'), original = structuredClone(before), update = read('app/c1-learning-update.json');
const sections = read('app/learning-sections.json'), catalog = read('app/video-catalog.json'), evidence = read('docs/c1-video-review.json');
const newIds = new Set([...c1LearningAdditions, ...c1GapFillAdditions, ...c1FlowAdditions, ...c1ApplicationAdditions, ...c1GeneratorAdditions, ...c1CableDesignAdditions, ...c1RashidAdditions, ...c1ProtectionAdditions, ...c1MotorGapAdditions, ...c1WoundRotorAdditions].map(l=>l.id)), oldIds = Object.values(before.groups).flat();
const upgraded = parse(before), view = snapshot(upgraded);
assert.equal(before.curriculumRevision, 6);
assert.equal(upgraded.curriculumRevision, 13);
assert.deepEqual(upgraded.groups, base.groups, 'An actual revision-6 saved course receives the exact authored sequence');
assert.deepEqual(before, original, 'Migration does not mutate the stored snapshot');
assert.deepEqual(parse(upgraded), upgraded, 'Revision 7 is idempotent');
// Revision 8 adds two lessons without replaying the revision-7 moves.
const previousSeven = read('scripts/fixtures/c1-testing-gap-previous.json');
assert.equal(previousSeven.curriculumRevision, 7);
assert.deepEqual(parse(previousSeven).groups, base.groups, 'Published revision 7 receives the exact additive testing sequence');
const gapIds = new Set(['c1-three-phase-ir-practical', 'c1-periodic-reporting']);
for (const [id, ids] of Object.entries(previousSeven.groups)) {
  assert.deepEqual(parse(previousSeven).groups[id].filter(value => !gapIds.has(value)), ids, 'Existing revision-7 order survives: ' + id);
}
const personalSeven = structuredClone(previousSeven);
personalSeven.revision = 42;
personalSeven.groups['c1-testing-section-1'].reverse();
personalSeven.groups['c1-testing-dead-tests'] = personalSeven.groups['c1-testing-dead-tests'].filter(id => id !== 'c1-three-phase-ir-sequence');
personalSeven.groups['module-01-section-1'].push('c1-three-phase-ir-sequence');
personalSeven.itemRevisions['c1-three-phase-ir-sequence'] = 42;
personalSeven.deletedIds = ['c1-three-phase-ir-practical'];
personalSeven.archivedLessonIds = ['c1-periodic-reporting'];
const personalEight = parse(personalSeven);
assert.equal(personalEight.curriculumRevision, 13);
assert.equal(personalEight.revision, 42);
assert.deepEqual(personalEight.groups['c1-testing-section-1'], personalSeven.groups['c1-testing-section-1']);
assert.ok(personalEight.groups['module-01-section-1'].includes('c1-three-phase-ir-sequence'));
assert.ok(!Object.values(personalEight.groups).flat().includes('c1-three-phase-ir-practical'));
assert.ok(personalEight.archivedLessonIds.includes('c1-periodic-reporting'));
assert.deepEqual(parse(personalEight), personalEight, 'Additive update is idempotent with personal edits');
assert.equal(upgraded.revision, before.revision);
assert.deepEqual(upgraded.receipts, before.receipts); assert.deepEqual(upgraded.itemRevisions, before.itemRevisions);
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id=>!newIds.has(id)).sort(), [...oldIds].sort(), 'Every old occurrence survives exactly once');
assertC2Reorganization(catalog);
for (const [sectionId, expected] of Object.entries(update.current)) assert.deepEqual(view.rows[sectionId].map(r=>r.id), expected, sectionId);
for (const id of Object.keys(update.previous)) assert.ok(Object.hasOwn(upgraded.groups,id),'Historical section/Undo identity survives: '+id);
for (const [id,ids] of Object.entries(before.groups).filter(([id])=>!Object.hasOwn(update.previous,id))) assert.deepEqual(upgraded.groups[id],ids,'Other pathways remain untouched: '+id);
assert.equal(sections.filter(s=>Object.hasOwn(update.current,s.id)).length,40);
// The medium-voltage switchgear occurrence now belongs to Advanced.
assert.equal(view.allRows.filter(r=>catalog.modules.find(m=>m.id===r.moduleId).path==='C1').length,64+c1GapFillAdditions.length+c1FlowAdditions.length+c1ApplicationAdditions.length + c1GeneratorAdditions.length + c1CableDesignAdditions.length + c1RashidAdditions.length + c1ProtectionAdditions.length + c1MotorGapAdditions.length + c1WoundRotorAdditions.length-1);
assert.ok(Object.values(view.rows).every(rows=>rows.length),'Published sections are populated, including supporting-only topics');
assert.equal(view.byId.get('p06-l14').sectionId,'c1-power-triangle');
assert.equal(view.byId.get('p10-l06').sectionId,'c1-distribution-installation');
assert.equal(view.byId.get('c1-trace-three-phase').sectionId,'c1-testing-dead-tests');
for(const m of catalog.modules){const rows=view.allRows.filter(r=>r.moduleId===m.id);assert.deepEqual(rows.map(r=>r.displayNumber),rows.map((_,i)=>i+1));}

assert.equal(required('c1-three-phase-power-factor'),true);
assert.equal(required('c1-three-phase-voltage-drop'),true);
assert.equal(required('c1-phase-failure-relay'),false);
assert.equal(required('c1-motor-protection-sizing'),false);
assert.equal(required('c1-capacitor-sizing'),false);
assert.equal(required('c1-balanced-three-phase-power'),false);
assert.equal(required('private-video'),false);
assert.match(role('c1-three-phase-power-factor'),/Core/);
assert.match(note('c1-phase-failure-relay'),/Start is held/);
assert.match(note('c1-motor-input-efficiency'),/Pshaft\/η/);
assert.match(note('p08-periodic'),/domestic EICR/);

const custom = structuredClone(before);
// Protect a move both inside the old section and to another pathway.
custom.revision=17; custom.itemRevisions['p06-l14']=17; custom.itemRevisions['c1-motor-terminals']=17;
custom.groups['c1-motors-section-1']=custom.groups['c1-motors-section-1'].filter(id=>id!=='c1-motor-terminals');
custom.groups['module-01-section-1'].push('c1-motor-terminals');
const privateVideo=(id,anchorId,archived=false)=>({id,videoId:(id+'12345678901').slice(0,11),title:'My '+id,instructor:'My teacher',moduleId:'c1-earthing',anchorId,position:'after',archived,placementRevision:6,updatedAt:'2026-10-10T12:00:00Z'});
const parent=privateVideo('private-root','p10-l06',true),child=privateVideo('private-child',parent.id),pinned=privateVideo('private-pin','p10-l06');
custom.videos.push(parent,child,pinned);
custom.groups['c1-earthing-section-2'].splice(custom.groups['c1-earthing-section-2'].indexOf('p10-l06')+1,0,parent.id,child.id,pinned.id);
custom.itemRevisions[pinned.id]=15;
const copies=c1LearningAdditions.map((l,i)=>({...privateVideo('private-copy-'+i,'module-01-section-1',i===2),videoId:l.videoId,moduleId:'module-01'}));
custom.videos.push(...copies);custom.groups['module-01-section-1'].push(...copies.map(v=>v.id));
custom.deletedIds=['p07-l16','c1-three-phase-power-factor'];
custom.archivedLessonIds=['p10-l07'];
custom.videos.find(v=>v.id==='c1-motor-phase-loss').archived=true;
custom.receipts=[{id:'historical-c1-move',revision:17,affected:['c1-motor-terminals'],inverse:{positions:[{id:'c1-motor-terminals',sectionId:'c1-motors-section-1',beforeId:null,afterId:'course-XbL0R_9KLD4'}],videos:[],archiveIds:[]}}];
const kept=parse(custom), keptView=snapshot(kept);
assert.equal(keptView.byId.get('p06-l14').sectionId,'c1-pfc-section-1','An explicitly edited ID in its former published section is respected');
assert.equal(keptView.byId.get('c1-motor-terminals').sectionId,'module-01-section-1');
assert.equal(keptView.byId.get(child.id).sectionId,'c1-distribution-installation','Nested support follows its root, even through an archived parent');
assert.equal(keptView.byId.get(pinned.id).sectionId,'c1-earthing-section-2','Explicit support placement wins');
assert.deepEqual(kept.videos.filter(v=>v.id.startsWith('private-copy-')),copies,'Private copies of all newly canonical videos survive');
assert.deepEqual(kept.receipts,custom.receipts);assert.deepEqual(kept.itemRevisions,custom.itemRevisions);
for(const id of ['p07-l16','c1-three-phase-power-factor','p10-l07','c1-motor-phase-loss',parent.id])assert.ok(!keptView.byId.has(id));
assert.deepEqual(parse(kept),kept);
const undone=apply(kept,{operationId:crypto.randomUUID(),revision:kept.revision,edit:{type:'undo',targetOperationId:'historical-c1-move'}});
assert.equal(snapshot(undone).byId.get('c1-motor-terminals').sectionId,'c1-motors-section-1','Historical Undo retains a valid old section');
const later=apply(upgraded,{operationId:crypto.randomUUID(),revision:upgraded.revision,edit:{type:'move',id:'p06-l14',sectionId:'c1-pfc-section-1',beforeId:null}});
assert.equal(snapshot(parse(later)).byId.get('p06-l14').sectionId,'c1-pfc-section-1','Later personal moves do not remigrate');
const reversed=structuredClone(before);reversed.groups['c1-earthing-section-2'].reverse();
assert.deepEqual(parse(reversed).groups['c1-distribution-installation'],['p10-l07','p10-l06','p07-l09'],'Custom relative order survives a split');
const canonicalIds=new Set(catalog.modules.flatMap(m=>m.lessons.map(l=>l.id)));
const legacy={version:1,revision:4,curriculumRevision:6,groups:Object.fromEntries(Object.entries(before.groups).map(([id,ids])=>[id,ids.filter(id=>canonicalIds.has(id))]))};
assert.deepEqual(migratePersonalCourse(legacy,{version:1,revision:4,videos:before.videos}).groups,base.groups,'Legacy split documents receive the same sequence');

assert.equal(evidence.videos.length,10);
for(const review of evidence.videos){assert.deepEqual(review.captionLanguage,['en']);assert.match(review.captionSha256,/^[a-f0-9]{64}$/);assert.equal(review.url,`https://www.youtube.com/watch?v=${review.videoId}`);assert.ok(review.captionSegments>50);assert.equal(review.reviewedRanges[0].endSeconds,review.captionEndSeconds);}
// Independently close the project arithmetic, including units and neutral vector sum.
const near=(a,b,tolerance)=>assert.ok(Math.abs(a-b)<tolerance,`${a} ≠ ${b}`);
const Uo=400/Math.sqrt(3),P=48+7.5/.9,Q=.75*P,Ib=P*1000/(Math.sqrt(3)*400*.8),Qc=P*(.75-Math.tan(Math.acos(.95)));
near(Ib,101.64,.01);near(Qc,23.734,.001);near(P/.95,59.298,.001);near(Qc*1000/(3*2*Math.PI*50*400**2)*1e6,157.39,.01);
near(Q-Qc,18.516,.001);
near(Math.sqrt(18**2+16**2+14**2-18*16-16*14-14*18)*1000/(.8*Uo),18.75,.001);
near(125/(.94*.8),166.22,.01);assert.ok(160*.94*.8<125);assert.ok(200*.94*.8>125);
near(.12+1.2*.16,.312,.0001);near(Math.sqrt(1600000)/115,11,.01);
const voltagePercent=(.9*Ib*40/1000)/400*100+(29*6*20/1000)/Uo*100;near(voltagePercent,2.42,.01);
const project=readFileSync('public/c1-worked-project.md','utf8');for(const value of ['23.734','18.516','472.18','157.39','101.64','166.22','18.75'])assert.ok(project.includes(value));
console.log('PASS C1: current sequence including historical 40-section/64-row core; original identities; C2 unchanged and approved MV extension in Advanced; saved/legacy upgrades; protected order and descendants; private copies; archives/deletions/Undo; required labels; caption provenance; project arithmetic.');
