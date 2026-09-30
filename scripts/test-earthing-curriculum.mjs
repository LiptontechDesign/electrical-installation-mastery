import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { build } from 'esbuild';
import { incompleteEarthingCourse, firstEightEarthingIds, obsoleteEarthingIds } from './fixtures/earthing-incomplete-course.mjs';
await build({ entryPoints: ['app/personal-course-model.ts', 'app/course-order-model.ts', 'app/course-progress-model.ts'], outdir: 'work/earthing-regroup-tests', bundle: true, platform: 'node', format: 'esm' });
const { publishedPersonalCourse: base, parsePersonalCourse: parse, personalCourseSnapshot: snapshot, applyCourseEdit: apply, migratePersonalCourse } = await import('../work/earthing-regroup-tests/personal-course-model.js');
const { orderedSections, moveLesson } = await import('../work/earthing-regroup-tests/course-order-model.js');
const { progressForVideos } = await import('../work/earthing-regroup-tests/course-progress-model.js');
const previous = JSON.parse(readFileSync('scripts/fixtures/earthing-regroup-previous.json', 'utf8'));
const newSections = ['module-05-ads', 'module-05-fault-loop', 'module-06-cpc-sizing'];
const oldState = () => {
  const state = structuredClone(base);
  Object.assign(state.groups, structuredClone(previous));
  for (const id of newSections) delete state.groups[id];
  delete state.curriculumRevision;
  state.revision = 12;
  return state;
};
const change = (state, edit) => apply(state, { revision: state.revision, operationId: crypto.randomUUID(), edit });
const before = oldState(), upgraded = parse(before), rows = snapshot(upgraded);
assert.deepEqual(upgraded.groups, base.groups, 'An untouched saved course receives the complete new teaching order');
assert.deepEqual([...Object.values(before.groups).flat()].sort(), [...Object.values(upgraded.groups).flat()].sort(), 'No video is lost, added or duplicated');
assert.equal(upgraded.revision, 12);
assert.equal(upgraded.curriculumRevision, 2);
assert.deepEqual(parse(upgraded), upgraded, 'Reading an upgraded course is idempotent');
assert.equal(before.curriculumRevision, undefined, 'Normalising does not mutate the stored input');
assert.equal(rows.byId.get('p05-l10').sectionId, 'module-06-cpc-sizing');
assert.equal(rows.byId.get('course-TFt3d77LujQ').sectionId, 'module-08-section-2');
assert.equal(rows.byId.get('p05-l06').sectionId, 'module-05-ads');
assert.deepEqual(upgraded.groups['module-05-fault-loop'], ['p05-l07', 'p05-l11', 'p05-l15', 'course-8-GmwF090JU']);

const customised = oldState();
customised.groups['module-05-section-3'] = customised.groups['module-05-section-3'].filter(id => id !== 'p05-l10');
customised.groups['module-06-section-2'].push('p05-l10');
customised.itemRevisions['p05-l10'] = 12;
customised.itemRevisions['p05-l07'] = 11; // A touched row still in the obsolete combined group must move.
customised.receipts = [{ id: 'retained-earthing-move', revision: 12, affected: ['p05-l10'], inverse: { positions: [{ id: 'p05-l10', sectionId: 'module-05-section-3', beforeId: 'p05-l11', afterId: 'course-TFt3d77LujQ' }], videos: [], archiveIds: [] } }];
customised.archivedLessonIds = ['course-8-GmwF090JU'];
customised.deletedIds = ['p05-l11'];
const personal = parse(customised);
assert.equal(snapshot(personal).byId.get('p05-l10').sectionId, 'module-06-section-2');
assert.equal(snapshot(personal).byId.get('p05-l07').sectionId, 'module-05-fault-loop');
assert.deepEqual(personal.receipts, customised.receipts);
assert.deepEqual(personal.itemRevisions, customised.itemRevisions);
assert.deepEqual(personal.archivedLessonIds, customised.archivedLessonIds);
assert.deepEqual(personal.deletedIds, customised.deletedIds);
assert.ok(!snapshot(personal).byId.has('p05-l11'));
assert.ok(!snapshot(personal).byId.has('course-8-GmwF090JU'));
const undone = change(personal, { type: 'undo', targetOperationId: 'retained-earthing-move' });
assert.equal(snapshot(undone).byId.get('p05-l10').sectionId, 'module-05-section-3', 'An earlier personal move can still be undone');

const mixed = oldState();
const extra = { id: 'private-earthing-overview', videoId: 'abc123def45', title: 'My personal earthing explanation', instructor: 'Personal teacher', moduleId: 'module-05', anchorId: '', position: 'after', archived: false, placementRevision: 2, updatedAt: '' };
const attached = { ...extra, id: 'legacy-loop-extra', videoId: 'abc123def46', title: 'Legacy loop reinforcement', anchorId: 'p05-l07', placementRevision: 1, archived: true };
const child = { ...extra, id: 'legacy-loop-child', videoId: 'abc123def47', title: 'Visible attachment after hidden parent', anchorId: attached.id, placementRevision: 1 };
mixed.videos.push(extra, attached, child);
mixed.groups['module-05-section-3'].unshift(extra.id);
mixed.groups['module-05-section-3'].splice(mixed.groups['module-05-section-3'].indexOf('p05-l07') + 1, 0, attached.id, child.id);
const upgradedMixed = parse(mixed);
assert.equal(upgradedMixed.groups['module-05-section-3'][0], extra.id);
assert.equal(snapshot(upgradedMixed).byId.get(child.id).sectionId, 'module-05-fault-loop');
assert.ok(upgradedMixed.videos.find(video => video.id === attached.id).archived);
assert.equal(upgradedMixed.groups['module-05-fault-loop'][1], attached.id);
assert.equal(upgradedMixed.groups['module-05-fault-loop'][2], child.id);

const marked = new Set(['p05-l06', 'p05-l10', 'course-TFt3d77LujQ', 'p05-l15']);
const oldProgress = progressForVideos(Object.values(before.groups).flat(), marked);
assert.deepEqual(progressForVideos(rows.allRows.map(row => row.id), marked), oldProgress, 'Moving lessons keeps overall watched totals unchanged');
for (const [id, destination] of [['p05-l06', 'module-05-ads'], ['p05-l10', 'module-06-cpc-sizing'], ['course-TFt3d77LujQ', 'module-08-section-2']]) {
  assert.equal(progressForVideos(rows.rows[destination].map(row => row.id), marked).watched, 1, id + ' keeps its watched mark at its destination');
}
for (const moduleId of new Set(rows.allRows.map(row => row.moduleId))) {
  const numbers = rows.allRows.filter(row => row.moduleId === moduleId).map(row => row.displayNumber);
  assert.deepEqual(numbers, numbers.map((_, index) => index + 1));
}

const legacy = { version: 1, revision: 4, groups: Object.fromEntries(Object.entries(before.groups).map(([id, ids]) => [id, ids.filter(id => rows.course.modules.some(module => module.lessons.some(lesson => lesson.id === id)))])) };
const legacyUpgrade = migratePersonalCourse(legacy);
assert.deepEqual(legacyUpgrade.groups, base.groups);
const legacyCustom = structuredClone(legacy);
legacyCustom.groups['module-05-section-3'].reverse();
assert.deepEqual(orderedSections(legacyCustom).find(section => section.id === 'module-05-section-3').lessonIds, legacyCustom.groups['module-05-section-3'].filter(id => base.groups['module-05-section-3'].includes(id)), 'Custom introductory order remains intact while known misplaced subjects move');
const moveAfterUpgrade = moveLesson(legacy, { lessonId: 'p05-l06', sectionId: 'module-05-section-3', beforeId: null });
assert.ok(orderedSections(moveAfterUpgrade).find(section => section.id === 'module-05-section-3').lessonIds.includes('p05-l06'), 'Later personal moves are not remigrated');
assert.throws(() => parse({ ...base, curriculumRevision: -1 }));

for (const revision of [0, 1]) {
  const incomplete = incompleteEarthingCourse(base, revision), original = structuredClone(incomplete);
  const repaired = parse(incomplete), repairedRows = snapshot(repaired);
  assert.deepEqual(repaired.groups['module-05-section-3'], firstEightEarthingIds, 'Keep exactly the first eight earthing/bonding videos in the reported order');
  assert.equal(repairedRows.rows['module-05-section-3'].length, 8);
  assert.deepEqual(repaired.groups['module-05-ads'], ['p05-l06'], 'Previously empty Section 5 receives ADS');
  assert.deepEqual(repaired.groups['module-05-fault-loop'], base.groups['module-05-fault-loop']);
  assert.deepEqual(repaired.groups['module-06-cpc-sizing'], ['p05-l10']);
  assert.equal(repaired.groups['module-08-section-2'][0], 'course-TFt3d77LujQ');
  for (const id of obsoleteEarthingIds) assert.ok(!repaired.groups['module-05-section-3'].includes(id));
  assert.deepEqual(Object.values(repaired.groups).flat().sort(), Object.values(incomplete.groups).flat().sort(), 'Relocation does not lose or duplicate any video');
  assert.deepEqual(repaired.videos, incomplete.videos);
  assert.deepEqual(repaired.receipts, incomplete.receipts);
  assert.deepEqual(repaired.itemRevisions, incomplete.itemRevisions);
  assert.equal(repaired.revision, incomplete.revision);
  assert.equal(repaired.curriculumRevision, 2);
  assert.deepEqual(parse(repaired), repaired);
  assert.deepEqual(incomplete, original);
  assert.deepEqual(progressForVideos(repairedRows.allRows.map(row => row.id), marked), progressForVideos(Object.values(incomplete.groups).flat(), marked));
  const later = change(repaired, { type: 'move', id: 'p05-l06', sectionId: 'module-05-section-3', beforeId: null });
  assert.equal(snapshot(parse(later)).byId.get('p05-l06').sectionId, 'module-05-section-3', 'A new personal move after revision 2 stays authoritative');
}

const course = JSON.parse(readFileSync('app/video-catalog.json', 'utf8'));
for (const courseModule of course.modules.filter(module => module.path === 'C2')) {
  const file = readdirSync('C2 YouTube Links').find(name => name.startsWith('C2 Module ' + String(courseModule.number).padStart(2, '0') + ' - '));
  assert.deepEqual(readFileSync('C2 YouTube Links/' + file, 'utf8').trim().split(/\r?\n/), courseModule.lessons.map(lesson => lesson.url), 'Copyable URLs follow the new module order');
}
console.log('PASS: earthing regrouping, saved/legacy courses, explicit moves/Undo, private additions, attachments, removals, watched totals, numbering and all C2 URL exports.');
