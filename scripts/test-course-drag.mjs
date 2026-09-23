import assert from 'node:assert/strict';
import { build } from 'esbuild';
await build({ entryPoints: ['app/course-drop-model.ts', 'app/course-order-model.ts'], outdir: 'work/course-drag-tests', bundle: true, platform: 'node', format: 'esm' });
const { courseMapSnapshot, dropCandidates, closestDrop, movingSequence, moveSession, persistConfirmedMove } = await import('../work/course-drag-tests/course-drop-model.js');
const { defaultOrder, moveLesson, courseForOrder, orderedSections } = await import('../work/course-drag-tests/course-order-model.js');
const sections = orderedSections(defaultOrder);
const source = sections.find(s => s.lessonIds.length >= 3);
const otherSection = sections.find(s => s.moduleId === source.moduleId && s.id !== source.id);
const otherModule = sections.find(s => s.moduleId !== source.moduleId);
const [a, b, c] = source.lessonIds;
const video = (id, anchorId, position = 'after', archived = false) => ({ id, anchorId, position, archived, moduleId: source.moduleId, videoId: `${id}12345678901`.slice(0, 11), title: id, instructor: 'Teacher', updatedAt: '' });
const videos = [video('first', a), video('second', a), video('child', 'first'), video('hidden', 'second', 'before', true), video('leaf', 'hidden'), video('before', b, 'before')];
const snapshot = courseMapSnapshot(defaultOrder, videos);
const allIds = Object.values(snapshot.rows).flat().map(r => r.id).sort();
let count = 0;
function check(name, fn) { fn(); count++; console.log(`PASS ${name}`); }
check('all visible videos share one continuous module sequence', () => {
  const moduleRows = Object.values(snapshot.rows).flat().filter(row => row.moduleId === source.moduleId);
  const supplementaryRows = moduleRows.filter(row => row.kind === 'supplementary');
  assert.deepEqual(moduleRows.map(row => row.displayNumber), moduleRows.map((_, index) => index + 1));
  assert.deepEqual(supplementaryRows.map(row => row.id), ['first', 'child', 'leaf', 'second', 'before']);
});
for (const [name, section] of [['same section', source], ['different section', otherSection], ['different module', otherModule]]) {
  check(`core moves to ${name}`, () => {
    const p = dropCandidates(snapshot, a, section.id).find(p => p.core.beforeId === null);
    assert.equal(p.rows[section.id].filter(r => r.kind === 'core').at(-1).id, a);
    assert.equal(p.item.id, a);
    assert.deepEqual(Object.values(p.rows).flat().map(r => r.id).sort(), allIds);
    assert.equal(p.rows[section.id].find(r => r.id === 'child').moduleId, section.moduleId);
  });
}
for (const position of ['before', 'after']) check(`supplementary ${position} core`, () => {
  const p = dropCandidates(snapshot, 'first', source.id).find(p => p.supplementary.anchorId === c && p.supplementary.position === position);
  const ids = p.rows[source.id].map(r => r.id);
  assert.equal(ids.indexOf('first') < ids.indexOf(c), position === 'before');
  assert.equal(ids.indexOf('child'), ids.indexOf('first') + 1);
});
check('supplementary relative to another supplementary and across modules', () => {
  assert.ok(dropCandidates(snapshot, 'first', source.id).some(p => p.supplementary.anchorId === 'second'));
  const p = dropCandidates(snapshot, 'first', otherModule.id)[0];
  assert.equal(p.supplementary.moduleId, otherModule.moduleId);
  assert.equal(p.rows[otherModule.id].find(r => r.id === 'child').moduleId, otherModule.moduleId);
  const destinationRows = Object.values(p.rows).flat().filter(r => r.moduleId === otherModule.moduleId);
  assert.deepEqual(destinationRows.map(r => r.displayNumber), destinationRows.map((_, index) => index + 1));
});
check('self and descendant cycles excluded including archived anchors', () => {
  assert.ok(!dropCandidates(snapshot, 'first', source.id).some(p => ['first', 'child'].includes(p.supplementary.anchorId)));
  assert.ok(!dropCandidates(snapshot, 'second', source.id).some(p => ['second', 'hidden', 'leaf'].includes(p.supplementary.anchorId)));
  assert.ok(movingSequence(snapshot, 'second').has('leaf'));
});
check('every indicator and confirmation describes the exact persisted sequence', () => {
  for (const id of [a, 'first', 'second', 'leaf']) for (const section of [source, otherSection, otherModule]) {
    for (const p of dropCandidates(snapshot, id, section.id)) {
      const saved = courseMapSnapshot(p.core ? moveLesson(defaultOrder, p.core) : defaultOrder, p.supplementary ? videos.map(v => v.id === id ? { ...v, ...p.supplementary } : v) : videos);
      assert.deepEqual(saved.rows, p.rows);
      const remaining = saved.rows[section.id].filter(r => !p.movingIds.includes(r.id));
      assert.equal(remaining[p.index]?.id ?? null, p.beforeRowId);
      assert.equal(saved.rows[section.id].findIndex(r => p.movingIds.includes(r.id)), p.index);
      assert.deepEqual(Object.values(saved.rows).flat().map(r => r.id).sort(), allIds, 'each visible item exists exactly once');
    }
  }
});
check('core normalization never splits another lesson’s attached sequence', () => {
  const choices = dropCandidates(snapshot, c, source.id);
  const p = closestDrop(choices, snapshot.rows[source.id].findIndex(r => r.id === 'child'));
  const ids = p.rows[source.id].map(r => r.id);
  assert.deepEqual(ids.slice(ids.indexOf(a), ids.indexOf('second') + 1), [a, 'first', 'child', 'leaf', 'second']);
});
check('empty sections accept core but require an anchor for supplementary', () => {
  let order = defaultOrder;
  for (const id of source.lessonIds) order = moveLesson(order, { lessonId: id, sectionId: otherSection.id, beforeId: null });
  const empty = courseMapSnapshot(order, videos);
  assert.equal(empty.rows[source.id].length, 0);
  assert.equal(dropCandidates(empty, 'first', source.id).length, 0);
  assert.equal(dropCandidates(empty, a, source.id).length, 1);
});
check('IDs, titles, URLs and ID-keyed learner data survive moves', () => {
  const originalLesson = courseForOrder(defaultOrder).course.modules.flatMap(m => m.lessons).find(l => l.id === a);
  const learner = { watched: [a], notes: { [a]: 'My note' }, bookmarks: [a] };
  const next = courseForOrder(moveLesson(defaultOrder, { lessonId: a, sectionId: otherModule.id, beforeId: null })).course.modules.flatMap(m => m.lessons).find(l => l.id === a);
  assert.equal(next.id, originalLesson.id); assert.equal(next.title, originalLesson.title); assert.equal(next.url, originalLesson.url);
  assert.equal(learner.notes[next.id], 'My note'); assert.ok(learner.watched.includes(next.id)); assert.ok(learner.bookmarks.includes(next.id));
});
const proposal = dropCandidates(snapshot, a, otherModule.id)[0];
let calls = 0;
const save = async move => { calls++; assert.deepEqual(move, proposal.core); return true; };
let session = moveSession({ phase: 'idle' }, { type: 'pick', id: a });
await persistConfirmedMove(session, save, save); assert.equal(calls, 0);
session = moveSession(session, { type: 'drop', proposal });
await persistConfirmedMove(session, save, save); assert.equal(calls, 0);
const cancelled = moveSession(session, { type: 'cancel' });
await persistConfirmedMove(cancelled, save, save); assert.equal(calls, 0);
session = moveSession(session, { type: 'confirm' });
assert.equal(await persistConfirmedMove(session, save, save), true); assert.equal(calls, 1);
check('cancelled, invalid and unchanged drops never enter saving', () => {
  for (const p of [null, { ...proposal, unchanged: true }]) {
    const s = moveSession({ phase: 'dragging', id: a }, { type: 'drop', proposal: p });
    assert.equal(s.phase, 'idle'); assert.equal(moveSession(s, { type: 'confirm' }).phase, 'idle');
  }
  assert.equal(moveSession({ phase: 'dragging', id: a }, { type: 'cancel' }).phase, 'idle');
});
console.log(`PASS ${count} placement/integrity groups plus confirmation-only persistence checks.`);
