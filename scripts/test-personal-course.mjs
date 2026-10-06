import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { earthElectrodeAdditions, jpelectricAdditions } from './assert-c2-reorganization.mjs';
await build({ entryPoints: ['app/personal-course-model.ts', 'app/course-drop-model.ts', 'app/course-order-model.ts'], outdir: 'work/personal-course-tests', bundle: true, platform: 'node', format: 'esm' });
const { migratePersonalCourse, personalCourseSnapshot: snapshot, applyCourseEdit: apply, parsePersonalCourse, normalisePersonalCourse, savedPlacement, validateEditRequest, existingVideoId } = await import('../work/personal-course-tests/personal-course-model.js');
const { courseMapSnapshot } = await import('../work/personal-course-tests/course-drop-model.js');
const { defaultOrder, moveLesson } = await import('../work/personal-course-tests/course-order-model.js');
const base = migratePersonalCourse();
const sections = Object.keys(base.groups);
const [source, destination] = sections;
const first = base.groups[source][0];
const second = base.groups[source][1];
let serial = 0;
const request = (state, edit) => ({ revision: state.revision, operationId: `test-operation-${String(++serial).padStart(8, '0')}`, edit });
const change = (state, edit) => apply(state, request(state, edit), '2026-09-29T00:00:00.000Z');
let checks = 0;
function test(name, run) { run(); checks++; console.log('PASS', name); }
function integrity(state) {
  const rows = snapshot(state).allRows;
  assert.equal(rows.length, new Set(rows.map(r => r.id)).size);
  assert.equal(Object.values(state.groups).flat().length, new Set(Object.values(state.groups).flat()).size);
  for (const moduleId of new Set(rows.map(r => r.moduleId))) assert.deepEqual(rows.filter(r => r.moduleId === moduleId).map(r => r.displayNumber), rows.filter(r => r.moduleId === moduleId).map((_, i) => i + 1));
  assert.deepEqual(parsePersonalCourse(JSON.parse(JSON.stringify(state))), normalisePersonalCourse(state));
}
test('published and saved legacy ordering migrate exactly, with archives retained', () => {
  const legacy = moveLesson(defaultOrder, { lessonId: first, sectionId: destination, beforeId: null });
  const videos = [{ id: 'extra', videoId: 'abcdefghijk', title: 'Extra', instructor: '', moduleId: 'module-01', anchorId: first, position: 'after', archived: false, updatedAt: '', placementRevision: 1 }, { id: 'hidden', videoId: 'lmnopqrstuv', title: 'Hidden', instructor: '', moduleId: 'module-01', anchorId: 'extra', position: 'after', archived: true, updatedAt: '', placementRevision: 1 }, { id: 'child', videoId: 'zyxwvutsrqp', title: 'Child', instructor: '', moduleId: 'module-01', anchorId: 'hidden', position: 'after', archived: false, updatedAt: '', placementRevision: 1 }];
  const migrated = migratePersonalCourse(legacy, { version: 1, revision: 7, videos });
  assert.deepEqual(snapshot(migrated).rows, courseMapSnapshot(legacy, migrated.videos).rows);
  assert.ok(migrated.groups[destination].includes('hidden'));
  integrity(migrated);
});
test('the new electrode section joins an existing saved course without moving old videos', () => {
  const sectionId = 'module-05-earth-electrodes';
  const additions = base.groups[sectionId];
  assert.equal(additions.length, 6);
  const old = structuredClone(change(base, { type: 'move', id: first, sectionId: destination, beforeId: null }));
  delete old.groups[sectionId];
  const upgraded = normalisePersonalCourse(old);
  assert.deepEqual(upgraded.groups[sectionId], additions);
  for (const [id, videos] of Object.entries(old.groups)) assert.deepEqual(upgraded.groups[id], videos);
  assert.deepEqual(upgraded.receipts, old.receipts);
  assert.equal(upgraded.revision, old.revision);
  integrity(upgraded);
});

test('new playlist lessons join saved sections in teaching order while personal moves and removals survive', () => {
  const newIds = new Set([
    ...jpelectricAdditions.map(lesson => lesson.id),
    ...earthElectrodeAdditions.slice(3).map(lesson => lesson.id),
  ]);
  const old = structuredClone(base);
  old.groups = Object.fromEntries(Object.entries(old.groups).map(([id, ids]) => [id, ids.filter(id => !newIds.has(id))]));
  old.groups['module-05-earth-electrodes'].splice(1, 0, 'p05-earth-plates', 'p05-earth-wenner');
  old.revision = 12;
  const upgraded = normalisePersonalCourse(old);
  const coreIds = new Set(snapshot(base).course.modules.flatMap(module => module.lessons.map(lesson => lesson.id)));
  for (const sectionId of Object.keys(base.groups)) {
    assert.deepEqual(upgraded.groups[sectionId].filter(id => coreIds.has(id)), base.groups[sectionId].filter(id => coreIds.has(id)), 'New explanations precede their practical neighbours, not the end of the section');
  }
  const upgradedRows = snapshot(upgraded).allRows.map(row => row.id);
  assert.ok(upgradedRows.indexOf('c2-troubleshooting-method') < upgradedRows.indexOf('course-Onf6P_bA0XU'), 'The saved diagnostic framework stays before the new lighting cases');
  assert.equal(upgraded.revision, 12);
  assert.deepEqual(upgraded.receipts, old.receipts);

  const customised = structuredClone(old);
  const movedId = 'p08-l03';
  customised.groups = Object.fromEntries(Object.entries(customised.groups).map(([sectionId, ids]) => [sectionId, ids.filter(id => id !== movedId)]));
  customised.groups[destination].push(movedId);
  customised.archivedLessonIds = ['p05-earth-components'];
  customised.deletedIds = ['p08-l04', 'course-q4UTihwOloA'];
  const preserved = normalisePersonalCourse(customised);
  assert.equal(snapshot(preserved).byId.get(movedId).sectionId, destination);
  assert.deepEqual(preserved.archivedLessonIds, customised.archivedLessonIds);
  assert.deepEqual(preserved.deletedIds, customised.deletedIds);
  for (const [sectionId, ids] of Object.entries(customised.groups)) {
    const original = ids.filter(id => !['p05-earth-plates', 'p05-earth-wenner', ...customised.deletedIds].includes(id));
    assert.deepEqual(preserved.groups[sectionId].filter(id => !newIds.has(id)), original, 'Existing personal relative order remains intact');
  }
  assert.ok(!snapshot(preserved).byId.has('p05-earth-components'));
  assert.ok(!snapshot(preserved).byId.has('p08-l04'));
  assert.ok(!snapshot(preserved).byId.has('course-q4UTihwOloA'));
  assert.equal(preserved.revision, 12);
  integrity(preserved);
});

test('adding to an empty section embeds a separate entry with continuous numbering', () => {
  let state = base;
  for (const id of [...state.groups[source]]) state = change(state, { type: 'move', id, sectionId: destination, beforeId: null });
  assert.equal(snapshot(state).rows[source].length, 0);
  state = change(state, { type: 'add', url: 'https://youtu.be/abcdefghijk', title: 'My gap-filling video', instructor: 'A teacher', sectionId: source, beforeId: null });
  assert.equal(snapshot(state).rows[source][0].title, 'My gap-filling video');
  assert.equal(snapshot(state).rows[source][0].displayNumber, 1);
  integrity(state);
});
test('every video moves independently within and across sections/modules/pathways', () => {
  let state = change(base, { type: 'add', url: 'https://youtu.be/abcdefghijk', title: 'Extra', instructor: '', sectionId: source, beforeId: second });
  const id = state.receipts.at(-1).affected[0];
  const supportPosition = savedPlacement(state, id);
  state = change(state, { type: 'move', id: first, sectionId: sections.at(-1), beforeId: null });
  assert.equal(snapshot(state).byId.get(id).sectionId, supportPosition.sectionId);
  state = change(state, { type: 'move', id, sectionId: sections.at(-1), beforeId: first });
  const rows = snapshot(state).rows[sections.at(-1)];
  assert.equal(rows.findIndex(r => r.id === id) + 1, rows.findIndex(r => r.id === first));
  integrity(state);
});
test('explicit legacy supporting groups move together and undo to their original positions', () => {
  const support = base.videos.find(v => snapshot(base).byId.has(v.anchorId));
  const originalRows = snapshot(base).rows;
  let state = change(base, { type: 'move', id: support.anchorId, withSupporting: true, sectionId: sections.at(-1), beforeId: null });
  assert.equal(snapshot(state).byId.get(support.id).sectionId, sections.at(-1));
  state = change(state, { type: 'undo', targetOperationId: state.receipts.at(-1).id });
  assert.deepEqual(snapshot(state).rows, originalRows);
});
test('undo preserves unrelated later edits but rejects a subsequently changed item', () => {
  let state = change(base, { type: 'move', id: first, sectionId: destination, beforeId: null });
  const targetOperationId = state.receipts.at(-1).id;
  state = change(state, { type: 'move', id: second, sectionId: sections.at(-1), beforeId: null });
  state = change(state, { type: 'undo', targetOperationId });
  assert.equal(snapshot(state).byId.get(first).sectionId, source);
  assert.equal(snapshot(state).byId.get(second).sectionId, sections.at(-1));
  const moved = change(base, { type: 'move', id: first, sectionId: destination, beforeId: null });
  const changedAgain = change(moved, { type: 'move', id: first, sectionId: sections.at(-1), beforeId: null });
  assert.throws(() => change(changedAgain, { type: 'undo', targetOperationId: moved.receipts.at(-1).id }), /changed again/);
  integrity(state);
});
test('archive, restore, edit and undo preserve stable identities and placement', () => {
  const video = base.videos[0];
  let state = change(base, { type: 'archive', id: video.id });
  assert.ok(!snapshot(state).byId.has(video.id));
  assert.ok(Object.values(state.groups).flat().includes(video.id));
  state = change(state, { type: 'restore', id: video.id, sectionId: source, beforeId: first });
  assert.equal(snapshot(state).byId.get(video.id).sectionId, source);
  state = change(state, { type: 'edit', id: video.id, title: 'Updated title', instructor: 'Teacher' });
  assert.equal(snapshot(state).videos.find(v => v.id === video.id).videoId, video.videoId);
  state = change(state, { type: 'undo', targetOperationId: state.receipts.at(-1).id });
  assert.equal(snapshot(state).byId.get(video.id).title, video.title);
  integrity(state);
});
test('retries are idempotent and stale writes never replace the current arrangement', () => {
  const command = request(base, { type: 'add', url: 'https://youtu.be/abcdefghijk', title: 'Extra', instructor: '', sectionId: source, beforeId: null });
  const state = apply(base, command);
  assert.deepEqual(apply(state, command), normalisePersonalCourse(state));
  assert.throws(() => apply(state, request(base, { type: 'move', id: first, sectionId: destination, beforeId: null })), /another tab or device/);
  assert.throws(() => change(state, { ...command.edit }), /already in your course/);
  const undone = change(state, { type: 'undo', targetOperationId: command.operationId });
  assert.ok(undone.videos.find(v => v.id === `personal-${command.operationId}`).archived);
});
test('published lessons archive, restore and undo without losing their identity', () => {
  let state = change(base, { type: 'archive', id: first });
  assert.ok(!snapshot(state).byId.has(first));
  assert.ok(!snapshot(state).course.modules.flatMap(m => m.lessons).some(l => l.id === first));
  assert.ok(snapshot(state).archivedVideos.some(v => v.id === first));
  assert.ok(state.groups[source].includes(first));
  const archivedOperation = state.receipts.at(-1).id;
  state = change(state, { type: 'archive', id: second });
  state = change(state, { type: 'undo', targetOperationId: archivedOperation });
  assert.ok(snapshot(state).byId.has(first));
  assert.ok(!snapshot(state).byId.has(second), 'Undo preserves an unrelated later archive');
  state = change(state, { type: 'restore', id: second, sectionId: destination, beforeId: null });
  assert.equal(snapshot(state).byId.get(second).sectionId, destination);
  assert.throws(() => change(change(base, { type: 'archive', id: first }), { type: 'move', id: first, sectionId: destination, beforeId: null }), /Restore/);
  integrity(state);
});
test('permanent removal survives default merging, reload, subsequent edits and retries', () => {
  const seed = base.videos[0];
  let state = change(base, { type: 'archive', id: first });
  const archiveOperation = state.receipts.at(-1).id;
  const deletion = request(state, { type: 'delete', id: first });
  state = apply(state, deletion);
  assert.ok(!snapshot(state).byId.has(first));
  assert.ok(!snapshot(state).archivedVideos.some(v => v.id === first));
  assert.ok(state.deletedIds.includes(first));
  assert.deepEqual(apply(state, deletion), state, 'Deletion retry is idempotent');
  assert.throws(() => change(state, { type: 'undo', targetOperationId: archiveOperation }), /no longer available/);
  assert.throws(() => change(state, { type: 'undo', targetOperationId: deletion.operationId }), /no longer available/);
  assert.throws(() => change(state, { type: 'restore', id: first, sectionId: source, beforeId: null }), /no longer available/);
  state = change(state, { type: 'delete', id: seed.id });
  state = parsePersonalCourse(JSON.parse(JSON.stringify(state)));
  state = change(state, { type: 'move', id: second, sectionId: destination, beforeId: null });
  assert.ok(!state.videos.some(v => v.id === seed.id), 'A deleted bundled entry never rejoins through default merging');
  assert.ok(!snapshot(state).course.modules.flatMap(m => m.lessons).some(l => l.id === first));
  assert.ok(!state.receipts.some(r => r.inverse.videos.some(v => v.id === seed.id)));
  assert.equal(snapshot(state).course.lessonCount, snapshot(base).course.lessonCount - 1);
  assert.equal(snapshot(base).course.lessonCount, 355, 'The shared published course is unchanged by a personal removal');
  integrity(state);
});
test('removed links can be added deliberately, without automatic restoration', () => {
  const original = snapshot(base).course.modules.flatMap(m => m.lessons).find(l => l.id === first);
  let state = change(base, { type: 'delete', id: first });
  assert.equal(existingVideoId(state, original.url), undefined);
  state = change(state, { type: 'add', url: original.url, title: original.title, instructor: original.instructor, sectionId: destination, beforeId: null });
  assert.equal(snapshot(state).byId.get(first).sectionId, destination);
  assert.ok(!state.deletedIds.includes(first));
  state = change(state, { type: 'undo', targetOperationId: state.receipts.at(-1).id });
  assert.ok(snapshot(state).archivedVideos.some(v => v.id === first));
  const seed = base.videos[0];
  state = change(base, { type: 'delete', id: seed.id });
  state = change(state, { type: 'add', url: `https://youtu.be/${seed.videoId}`, title: seed.title, instructor: seed.instructor, sectionId: source, beforeId: null });
  state = parsePersonalCourse(JSON.parse(JSON.stringify(state)));
  assert.equal(state.videos.filter(v => v.videoId === seed.videoId).length, 1);
  assert.ok(!state.videos.some(v => v.id === seed.id));
  integrity(state);
});
test('a bundled video saved under a legacy custom ID stays permanently removed', () => {
  const seed = base.videos[0];
  const legacy = migratePersonalCourse(defaultOrder, { version: 1, revision: 1, videos: [{ ...seed, id: 'legacy-custom-entry' }] });
  assert.ok(!legacy.videos.some(v => v.id === seed.id));
  const removed = normalisePersonalCourse(change(legacy, { type: 'delete', id: 'legacy-custom-entry' }));
  assert.ok(!removed.videos.some(v => v.videoId === seed.videoId), 'The seed ID cannot bypass permanent removal of the custom ID');
  assert.ok(removed.deletedIds.includes(seed.id));
  integrity(removed);
});
test('empty personal courses retain destinations and never restore removed lessons', () => {
  const coreIds = snapshot(base).course.modules.flatMap(m => m.lessons.map(l => l.id));
  const state = normalisePersonalCourse({ ...base, archivedLessonIds: coreIds, videos: base.videos.map(v => ({ ...v, archived: true })) });
  assert.equal(snapshot(state).allRows.length, 0);
  assert.equal(snapshot(state).course.lessonCount, 0);
  assert.equal(Object.keys(snapshot(state).rows).length, 125);
  integrity(state);
});
test('invalid requests, missing destinations and self placement are rejected', () => {
  for (const value of [null, {}, { revision: 0, operationId: 'x', edit: { type: 'add' } }, { revision: 0, operationId: 'operation-123456789', edit: { type: 'move' } }]) assert.throws(() => validateEditRequest(value));
  assert.throws(() => change(base, { type: 'move', id: first, sectionId: source, beforeId: first }));
  assert.throws(() => change(base, { type: 'move', id: first, sectionId: 'missing', beforeId: null }));
  assert.throws(() => change(base, { type: 'add', url: 'https://example.com/watch?v=abcdefghijk', title: 'Bad URL', instructor: '', sectionId: source, beforeId: null }));
  assert.throws(() => change(base, { type: 'delete', id: 'someone-elses-video' }));
  assert.throws(() => parsePersonalCourse({ ...base, deletedIds: [null] }));
});
console.log(`PASS: ${checks} personal course migration, placement and recovery groups.`);
