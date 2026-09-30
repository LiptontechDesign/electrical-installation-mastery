import assert from 'node:assert/strict';
import { build } from 'esbuild';
await build({ entryPoints: ['app/personal-course-model.ts', 'app/course-drop-model.ts', 'app/course-order-model.ts'], outdir: 'work/personal-course-tests', bundle: true, platform: 'node', format: 'esm' });
const { migratePersonalCourse, personalCourseSnapshot: snapshot, applyCourseEdit: apply, parsePersonalCourse, normalisePersonalCourse, savedPlacement, validateEditRequest } = await import('../work/personal-course-tests/personal-course-model.js');
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
  assert.equal(additions.length, 12);
  const old = structuredClone(change(base, { type: 'move', id: first, sectionId: destination, beforeId: null }));
  delete old.groups[sectionId];
  const upgraded = normalisePersonalCourse(old);
  assert.deepEqual(upgraded.groups[sectionId], additions);
  for (const [id, videos] of Object.entries(old.groups)) assert.deepEqual(upgraded.groups[id], videos);
  assert.deepEqual(upgraded.receipts, old.receipts);
  assert.equal(upgraded.revision, old.revision);
  integrity(upgraded);
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
test('invalid requests, missing destinations and self placement are rejected', () => {
  for (const value of [null, {}, { revision: 0, operationId: 'x', edit: { type: 'add' } }, { revision: 0, operationId: 'operation-123456789', edit: { type: 'move' } }]) assert.throws(() => validateEditRequest(value));
  assert.throws(() => change(base, { type: 'move', id: first, sectionId: source, beforeId: first }));
  assert.throws(() => change(base, { type: 'move', id: first, sectionId: 'missing', beforeId: null }));
  assert.throws(() => change(base, { type: 'add', url: 'https://example.com/watch?v=abcdefghijk', title: 'Bad URL', instructor: '', sectionId: source, beforeId: null }));
  assert.throws(() => change(base, { type: 'archive', id: first }));
});
console.log(`PASS: ${checks} personal course migration, placement and recovery groups.`);
