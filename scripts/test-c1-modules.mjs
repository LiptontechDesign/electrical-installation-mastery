import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';

await build({ entryPoints: ['app/personal-course-model.ts', 'app/course-curriculum.ts', 'app/course-progress-model.ts'], outdir: 'work/c1-module-tests', bundle: true, platform: 'node', format: 'esm' });
const { publishedPersonalCourse: base, parsePersonalCourse: parse, personalCourseSnapshot: snapshot, applyCourseEdit: apply, migratePersonalCourse } = await import('../work/c1-module-tests/personal-course-model.js');
const { isRequiredStudyVideo: required } = await import('../work/c1-module-tests/course-curriculum.js');
const { progressForVideos } = await import('../work/c1-module-tests/course-progress-model.js');
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const laterAdditionIds = new Set([...read('scripts/fixtures/c1-cable-design-additions.json'), ...read('scripts/fixtures/c1-rashid-additions.json'), ...read('scripts/fixtures/c1-protection-additions.json')].map(v => v.id));
const prior = read('scripts/fixtures/c1-modules-previous.json'), untouched = structuredClone(prior);
const update = read('app/c1-module-update.json'), upgraded = parse(prior), view = snapshot(upgraded);
const modules = view.course.modules.filter(m => m.path === 'C1');
assert.equal(prior.curriculumRevision, 12);
assert.equal(upgraded.curriculumRevision, 13);
assert.deepEqual(prior, untouched, 'Reading the new curriculum never mutates the stored document');
assert.deepEqual(upgraded.groups, base.groups);
for (const [id, ids] of Object.entries(prior.groups)) assert.deepEqual(upgraded.groups[id], ids, 'Every stable section retains its exact mixed row order: ' + id);
assert.deepEqual(parse(upgraded), upgraded, 'Reloading the new revision is idempotent');
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id => !laterAdditionIds.has(id)).sort(), Object.values(prior.groups).flat().sort(), 'Every previous video occurrence survives exactly once');
assert.equal(view.allRows.length, 503);
assert.equal(modules.length, 17);
assert.deepEqual(modules.map(m => m.id), read('app/c1-protection-update.json').moduleOrder);
assert.deepEqual(modules.map(m => m.title), [
 'AC and Three-Phase Foundations', 'AC Power and Calculations', 'Generator Principles and Controls', 'Transformers', 'Electrical Measurements', 'Power-Factor Correction',
 'Three-Phase Distribution', 'Load Assessment and Cable Design', 'Earthing and Fault Protection', 'Protective Devices and Coordination', 'Submains and Board Installation',
 'Motor Principles and Connections', 'Motor Starting, Protection and Speed Control', 'Initial Verification and Commissioning',
 'Periodic Inspection', 'Standby Generators: Connections and Operation', 'Fault Diagnosis',
]);
assert.deepEqual(modules.map(m => m.stageNumber), Array.from({ length: 17 }, (_, i) => i + 1));
assert.deepEqual(view.course.modules.map(m => m.number), Array.from({ length: 32 }, (_, i) => i + 1));
for (const m of modules) {
 assert.ok(view.sectionsByModule[m.id].length > 0 && view.allRows.some(r => r.moduleId === m.id), 'Each real module has sections and videos');
 assert.equal(m.durationSeconds, m.lessons.reduce((n, l) => n + l.durationSeconds, 0));
}
const order = view.allRows.map(r => r.id);
const before = (a, b) => assert.ok(order.indexOf(a) >= 0 && order.indexOf(a) < order.indexOf(b), a + ' must be taught before ' + b);
for (const pair of [
 ['c1-ac-generation', 'p02-l03'], ['p07-l03', 'p06-l14'], ['p06-l14', 'c1-generator-set-overview'],
 ['c1-generator-set-overview', 'c1-generator-operating-principles'], ['c1-generator-operating-principles', 'c1-generator-power-limits'],
 ['c1-transformer-foundation', 'c1-ct-ratios'], ['c1-ct-ratios', 'c1-wattmeter-foundation'], ['c1-wattmeter-methods', 'c1-analyser-setup'],
 ['c1-cable-design', 'p07-l08'], ['c1-three-phase-voltage-drop', 'p07-l08'], ['c1-cpc-size-foundation', 'p07-l08'],
 ['p07-induction', 'course-XbL0R_9KLD4'], ['course-XbL0R_9KLD4', 'c1-three-phase-power-factor'],
 ['c1-three-phase-line-current', 'c1-motor-input-efficiency'], ['c1-motor-input-efficiency', 'c1-motor-terminals'],
 ['c1-motor-terminals', 'p04-l19'], ['p04-l19', 'p04-l20'], ['p04-l20', 'p07-star-delta'],
 ['c1-transformer-ratio-calculations', 'c1-autotransformer-starter'], ['p07-star-delta', 'c1-autotransformer-starter'],
 ['p07-vfd', 'c1-capacitor-placement'], ['c1-pfc-target-foundation', 'c1-pfc-unity-bank'],
 ['c1-verification-order-foundation', 'c1-three-phase-ir-practical'], ['c1-rcd-testing-foundation', 'c1-periodic-reporting'],
 ['c1-certification-foundation', 'c1-generator-site-planning'], ['c1-generator-neutral-transfer', 'c1-generator-three-phase-changeover'],
 ['c1-generator-prestart-checks', 'c1-generator-transfer-operation'], ['c1-generator-transfer-operation', 'c1-motor-winding-tests'],
]) before(...pair);
for (const id of ['c1-stepper-motor-principles', 'c1-servo-motor-feedback', 'c1-switchgear-compartments']) assert.equal(required(id), false);
assert.equal(view.byId.get('c1-switchgear-compartments').moduleId, 'professional-cables', 'MV equipment stays outside the C1 LV route');
for (const id of ['p07-l08', 'p10-l06', 'p10-l07', 'p07-l09']) assert.equal(view.byId.get(id).moduleId, 'c1-installation');
assert.equal(view.byId.get('c1-periodic-reporting').moduleId, 'c1-periodic');
assert.equal(view.byId.get('c1-generator-transfer-operation').moduleId, 'c1-standby');
assert.equal(view.byId.get('c1-capacitor-placement').moduleId, 'module-07', 'Drive-specific precautions follow the drive foundations');
assert.match(view.label('c1-ac-waveforms'), /^C1 · Module 01 /);
assert.match(view.label('c1-generator-building-integration'), /^C1 · Module 16 /);
for (const video of upgraded.videos) assert.equal(video.moduleId, view.byId.get(video.id)?.moduleId, 'Bundled video metadata follows its actual section');
const watched = new Set(Object.values(prior.groups).flat().filter((_, i) => i % 7 === 0));
assert.deepEqual(progressForVideos(view.allRows.filter(r => !laterAdditionIds.has(r.id)).map(r => r.id), watched), progressForVideos(Object.values(prior.groups).flat(), watched), 'Existing videos retain their watched/total counts after the additive series');

// Exercise saved custom order, nested private videos, archives, removals,
// explicit destinations and an Undo receipt created before the module split.
const custom = structuredClone(prior); custom.revision = 104;
for (const ids of Object.values(custom.groups)) ids.reverse();
for (const [i, move] of update.sectionMoves.entries()) {
 const id = 'module-private-' + i, childId = id + '-child';
 const video = { id, videoId: 'z' + String(i).padStart(10, '0'), title: 'Private training', instructor: 'My instructor', moduleId: move.fromModuleId, anchorId: move.sectionId, position: 'after', archived: i % 2 === 0, placementRevision: 12, updatedAt: '2026-10-19T09:00:00Z' };
 custom.videos.push(video, { ...video, id: childId, videoId: 'y' + String(i).padStart(10, '0'), anchorId: id, archived: false });
 custom.groups[move.sectionId].push(id, childId);
}
custom.groups['c1-ct-metering'] = custom.groups['c1-ct-metering'].filter(id => id !== 'c1-ct-ratios');
custom.groups['module-01-section-1'].push('c1-ct-ratios'); custom.itemRevisions['c1-ct-ratios'] = 104;
custom.archivedLessonIds = ['c1-generator-operating-principles', 'c1-stepper-motor-principles'];
custom.deletedIds = ['c1-transformer-flux-example'];
custom.receipts = [{ id: 'before-subject-modules', revision: 104, affected: ['c1-ct-ratios'], inverse: { positions: [{ id: 'c1-ct-ratios', sectionId: 'c1-ct-metering', beforeId: null, afterId: null }], videos: [], archiveIds: [] } }];
const kept = parse(custom), keptView = snapshot(kept);
assert.equal(kept.revision, 104);
assert.deepEqual(kept.itemRevisions, custom.itemRevisions); assert.deepEqual(kept.receipts, custom.receipts);
assert.deepEqual(kept.archivedLessonIds, custom.archivedLessonIds); assert.deepEqual(kept.deletedIds, custom.deletedIds);
for (const [id, ids] of Object.entries(custom.groups)) assert.deepEqual(kept.groups[id], ids.filter(id => !custom.deletedIds.includes(id)));
for (const v of custom.videos) {
 const current = kept.videos.find(x => x.id === v.id);
 assert.deepEqual({ ...current, moduleId: v.moduleId }, v, 'Only resolved module metadata changes for existing private content');
}
for (const [i, move] of update.sectionMoves.entries()) {
 assert.equal(kept.videos.find(v => v.id === 'module-private-' + i).moduleId, move.toModuleId);
 assert.equal(keptView.byId.get('module-private-' + i + '-child').moduleId, move.toModuleId, 'Visible child survives an archived parent in a reassigned section');
}
for (const id of [...custom.archivedLessonIds, ...custom.deletedIds]) assert.ok(!keptView.byId.has(id));
assert.equal(keptView.byId.get('c1-ct-ratios').sectionId, 'module-01-section-1', 'A personal move across pathways remains authoritative');
assert.deepEqual(parse(kept), kept);
const undone = apply(kept, { operationId: crypto.randomUUID(), revision: kept.revision, edit: { type: 'undo', targetOperationId: 'before-subject-modules' } });
assert.equal(snapshot(undone).byId.get('c1-ct-ratios').moduleId, 'c1-measurements', 'Historical Undo resolves the original stable section in its new module');
const legacy = { version: 1, revision: 5, curriculumRevision: 12, groups: Object.fromEntries(Object.entries(prior.groups).map(([id, ids]) => [id, ids.filter(id => view.course.modules.some(m => m.lessons.some(l => l.id === id)))])) };
assert.deepEqual(migratePersonalCourse(legacy, { version: 1, revision: 5, videos: prior.videos }).groups, base.groups, 'Legacy order plus supplementary storage resolves to the same published sequence');
console.log('PASS C1 focused modules: 17 subjects, prerequisite order, stable IDs, exact revision-12 groups, mixed progress, private descendants, explicit moves, archives/deletions, legacy migration and historical Undo.');
