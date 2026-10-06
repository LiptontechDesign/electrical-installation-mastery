import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { connectedProcessAdditions } from './assert-c2-reorganization.mjs';
await build({ entryPoints: ['app/personal-course-model.ts', 'app/course-order-model.ts', 'app/course-progress-model.ts'], outdir: 'work/process-tests', bundle: true, platform: 'node', format: 'esm' });
const { publishedPersonalCourse: base, parsePersonalCourse: parse, personalCourseSnapshot: snapshot, applyCourseEdit: apply } = await import('../work/process-tests/personal-course-model.js');
const { orderedSections } = await import('../work/process-tests/course-order-model.js');
const { progressForVideos } = await import('../work/process-tests/course-progress-model.js');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const before = read('scripts/fixtures/connected-process-previous.json'), original = structuredClone(before);
const update = read('app/connected-process-update.json'), sections = read('app/learning-sections.json');
const newIds = new Set(connectedProcessAdditions.map(lesson => lesson.id));
const upgraded = parse(before), view = snapshot(upgraded);
const lessons = new Map(view.course.modules.flatMap(module => module.lessons).map(lesson => [lesson.id, lesson]));
assert.equal(before.curriculumRevision, 5);
assert.equal(upgraded.curriculumRevision, update.revision);
assert.equal(upgraded.revision, before.revision, 'Reading does not consume a personal edit revision');
assert.deepEqual(before, original, 'The saved input is unchanged');
assert.deepEqual(parse(upgraded), upgraded, 'The additive upgrade is idempotent');
assert.deepEqual(upgraded.groups, base.groups, 'A revision-5 saved course receives the published sequence');
for (const [id, ids] of Object.entries(before.groups)) assert.deepEqual(upgraded.groups[id], ids, 'Every existing section retains its exact order: ' + id);
assert.deepEqual(upgraded.videos, before.videos, 'Existing supporting-video details remain unchanged');
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id => !newIds.has(id)), Object.values(before.groups).flat(), 'Every previous occurrence retains its place in the overall sequence');
assert.equal(view.course.lessonCount, 355);
assert.equal(view.allRows.length, 387);
assert.equal(sections.length, 125);
assert.deepEqual(update.overviewLessonIds, connectedProcessAdditions.map(lesson => lesson.id));
const expected = [
  ['c2-boards', ['62lEhAuzeAI', 'dlkxzIQFvrk']],
  ['module-08', ['Sc0tJGl4Oas', 'AZenZfLQQgw', 'BKyK0-_v5xc', 'CsXUuuV4_sw', 'X5VEtGTSrwg', 'G9CjydiUkAI', '79rT9SrWXrY', 'zIPgYcLdQZE', 'ZaAUg75BR5Y']],
  ['module-09', ['RY5YLgJjmd8', 'IN5wIHoMtAo', 'Alz8iTv951k']],
];
for (const [moduleId, videoIds] of expected) {
  const opening = sections.find(section => section.moduleId === moduleId);
  assert.equal(opening.number, 1);
  assert.ok(update.sectionIds.includes(opening.id));
  assert.deepEqual(view.rows[opening.id].map(row => lessons.get(row.id).videoId), videoIds);
  const rows = view.allRows.filter(row => row.moduleId === moduleId);
  assert.deepEqual(rows.map(row => row.displayNumber), rows.map((_, index) => index + 1));
}
assert.match(view.byId.get('c2-verification-overview-08').title, /Current BS 7671/);
assert.match(view.byId.get('c2-verification-overview-09').title, /Earlier Test Sequence/);
assert.deepEqual(view.rows[update.sectionIds[1]].filter(row => row.id !== 'c2-verification-overview-08').map(row => lessons.get(row.id).instructor), Array(8).fill('John Ward'));
const marked = new Set(['p03-l12', 'p08-l14', 'p09-l01']);
const oldProgress = progressForVideos(Object.values(before.groups).flat(), marked);
const newProgress = progressForVideos(view.allRows.map(row => row.id), marked);
assert.equal(newProgress.watched, oldProgress.watched);
assert.equal(newProgress.total, oldProgress.total + 14);
assert.equal(progressForVideos(update.overviewLessonIds, marked).watched, 0, 'Repeated videos have independent watched occurrences');

// Personal copies must survive when their YouTube videos become canonical.
const custom = structuredClone(before), destination = 'module-09-section-1';
const copies = connectedProcessAdditions.map((lesson, index) => ({ id: 'private-process-' + index, videoId: lesson.videoId,
  title: 'My lesson ' + index, instructor: 'My saved teacher', moduleId: 'module-09', anchorId: destination,
  position: 'after', archived: index === 3, placementRevision: 5, updatedAt: '2026-10-05T10:00:00Z', durationSeconds: lesson.durationSeconds }));
custom.videos.push(...copies); custom.groups[destination].push(...copies.map(video => video.id));
custom.groups['c2-boards-assembly'] = [];
custom.groups[destination].push('p03-l12'); custom.itemRevisions['p03-l12'] = 22;
custom.revision = 22;
custom.receipts = [{ id: 'previous-consumer-unit-move', revision: 22, affected: ['p03-l12'], inverse: { positions: [{ id: 'p03-l12', sectionId: 'c2-boards-assembly', beforeId: null, afterId: null }], videos: [], archiveIds: [] } }];
custom.archivedLessonIds = ['p08-l03']; custom.deletedIds = ['p09-l01'];
const kept = parse(custom), keptView = snapshot(kept);
assert.deepEqual(kept.videos.filter(video => video.id.startsWith('private-process-')), copies, 'Personal copies retain IDs, details, position and archive status');
for (const [id, ids] of Object.entries(custom.groups)) assert.deepEqual(kept.groups[id], ids.filter(id => !custom.deletedIds.includes(id)), 'Personal group order is preserved: ' + id);
assert.deepEqual(kept.itemRevisions, custom.itemRevisions); assert.deepEqual(kept.receipts, custom.receipts);
assert.equal(kept.revision, 22); assert.deepEqual(parse(kept), kept);
assert.equal(keptView.byId.get('p03-l12').sectionId, destination);
assert.ok(!keptView.byId.has('p08-l03')); assert.ok(!keptView.byId.has('p09-l01'));
assert.ok(!keptView.byId.has(copies[3].id));
assert.equal(keptView.byId.get('c2-assembly-overview-01').sectionId, update.sectionIds[0], 'A personally moved original does not move the new overview');
const undone = apply(kept, { revision: kept.revision, operationId: crypto.randomUUID(), edit: { type: 'undo', targetOperationId: 'previous-consumer-unit-move' } });
assert.equal(snapshot(undone).byId.get('p03-l12').sectionId, 'c2-boards-assembly', 'Historical Undo destinations remain valid');
const legacy = { version: 1, revision: 12, curriculumRevision: 5, groups: Object.fromEntries(Object.entries(before.groups).map(([id, ids]) => [id, ids.filter(id => !before.videos.some(video => video.id === id))])) };
assert.deepEqual(orderedSections(legacy).filter(section => !update.sectionIds.includes(section.id)).map(section => section.lessonIds), sections.filter(section => !update.sectionIds.includes(section.id)).map(section => section.lessonIds), 'Legacy core ordering receives only additive sections');
console.log('PASS: three opening sequences, current-before-earlier RCD guidance, saved/legacy upgrades, all personal copies, preserved order/archives/Undo, independent watched marks and continuous numbering.');
