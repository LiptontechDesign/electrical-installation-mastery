import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
await build({ entryPoints: ['app/personal-course-model.ts'], outfile: 'work/design-tests/model.js', bundle: true, platform: 'node', format: 'esm' });
const { parsePersonalCourse: parse, personalCourseSnapshot: snapshot, publishedPersonalCourse: base, applyCourseEdit: apply } = await import('../work/design-tests/model.js');
const read = path => JSON.parse(readFileSync(path, 'utf8'));
const before = read('scripts/fixtures/design-learning-previous.json'), original = structuredClone(before);
const sections = read('app/learning-sections.json'), catalog = read('app/video-catalog.json');
const additions = [...read('scripts/fixtures/design-learning-additions.json'), ...read('scripts/fixtures/connected-process-additions.json')], newIds = new Set(additions.map(l => l.id));
const upgraded = parse(before), view = snapshot(upgraded);
assert.deepEqual(upgraded.groups, base.groups, 'A saved revision-4 course receives the authored sequence');
assert.deepEqual(before, original, 'Reading does not mutate input');
assert.deepEqual(parse(upgraded), upgraded, 'Migration runs once');
assert.equal(upgraded.revision, before.revision, 'Reading does not consume an edit revision');
assert.equal(upgraded.curriculumRevision, 6);
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id => !newIds.has(id)).sort(), Object.values(before.groups).flat().sort(), 'All original occurrences survive exactly once');
for (const section of sections.filter(s => Object.hasOwn(before.groups, s.id) && !['module-06', 'c2-boards'].includes(s.moduleId))) {
  assert.deepEqual(upgraded.groups[section.id], before.groups[section.id], 'Other modules remain unchanged: ' + section.id);
}
const overview = sections.find(s => s.id === 'module-06-efixx-overview');
const lessons = new Map(catalog.modules.flatMap(m => m.lessons).map(l => [l.id, l]));
assert.deepEqual(overview.lessonIds.map(id => lessons.get(id).videoId), ['42qk0TSwbAs', 'GyQkZnvc9jg', 'y5mQPAHajQI', '4seJf2Ql_0E', 'uxowSpL-cKM', 'CP6noiQp79I', 'q3rSnVEJ7kA', 'GKdW9H_5NA4', '2ClZKN1Qxaw', 'QUC17Kju4ug']);
assert.match(overview.description, /Watch Parts 1 & 2, then explore each design step/);
assert.deepEqual(sections.filter(s => s.moduleId === 'module-06').map(s => view.rows[s.id].length), [10, 3, 2, 3, 2, 2, 4, 2, 4, 1, 1]);
assert.deepEqual(sections.filter(s => s.moduleId === 'c2-boards').map(s => view.rows[s.id].map(r => r.id)), [['c2-assembly-overview-01', 'c2-assembly-overview-02'], ['course-BeoujaqN-68', 'p02-l10'], ['p03-l13'], ['p03-l12']]);
const custom = structuredClone(before);
const personal = { id: 'personal-design-afdd', videoId: 'QUC17Kju4ug', title: 'My AFDD lesson', instructor: 'eFIXX', moduleId: 'module-05', anchorId: 'course-lIit5k8QVj8', position: 'after', archived: false, placementRevision: 3, updatedAt: '2026-10-02T00:00:00Z', durationSeconds: 369 };
custom.videos.push(personal); custom.groups['module-05-arc-fault'].push(personal.id);
custom.itemRevisions['p06-l02'] = 8; // Explicit placement within the former group.
custom.receipts = [{ id: 'previous-operation', revision: 8, affected: ['p06-l02'], inverse: { positions: [], videos: [], archiveIds: [] } }];
const kept = parse(custom);
assert.deepEqual(kept.videos.find(v => v.id === personal.id), personal, 'A personal copy is retained when its video joins the overview');
assert.equal(snapshot(kept).byId.get(personal.id).sectionId, 'module-05-arc-fault');
assert.equal(snapshot(kept).byId.get('p06-l02').sectionId, 'module-06-section-1', 'Explicit personal placement is respected');
assert.deepEqual(kept.receipts, custom.receipts); assert.deepEqual(kept.itemRevisions, custom.itemRevisions);
const edited = apply(upgraded, { operationId: crypto.randomUUID(), revision: upgraded.revision, edit: { type: 'move', id: 'p06-l02', sectionId: 'module-06-section-1', beforeId: null } });
assert.equal(snapshot(parse(edited)).byId.get('p06-l02').sectionId, 'module-06-section-1', 'Later moves are not reapplied');
const removed = structuredClone(before);
removed.deletedIds = ['p06-l03']; removed.archivedLessonIds = ['p06-l02'];
const removedView = snapshot(parse(removed));
assert.ok(!removedView.byId.has('p06-l03')); assert.ok(!removedView.byId.has('p06-l02'));
assert.ok(removedView.byId.has('c2-design-overview-02'), 'The overview is a separate occurrence');
for (const moduleId of ['module-06', 'c2-boards']) {
  const rows = view.allRows.filter(row => row.moduleId === moduleId);
  assert.deepEqual(rows.map(row => row.displayNumber), rows.map((_, i) => i + 1));
}
console.log('PASS: exact ten-video sequence, all 15 design/assembly sections, original identities, personal repetitions, protected moves, Undo records, removals and continuous numbering.');
