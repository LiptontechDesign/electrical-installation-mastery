import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';

await build({ entryPoints: ['app/personal-course-model.ts', 'app/course-curriculum.ts'], outdir: 'work/c1-cable-design-tests', bundle: true, platform: 'node', format: 'esm' });
const { publishedPersonalCourse: base, parsePersonalCourse: parse, personalCourseSnapshot: snapshot, applyCourseEdit: apply } = await import('../work/c1-cable-design-tests/personal-course-model.js');
const { isRequiredStudyVideo: required } = await import('../work/c1-cable-design-tests/course-curriculum.js');
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const prior = read('scripts/fixtures/c1-cable-design-previous.json'), original = structuredClone(prior);
const additions = read('scripts/fixtures/c1-cable-design-additions.json'), addedIds = new Set(additions.map(v => v.id));
const laterIds = new Set([...read('scripts/fixtures/c1-rashid-additions.json'), ...read('scripts/fixtures/c1-protection-additions.json')].map(v => v.id));
const sections = read('app/learning-sections.json'), catalog = read('app/video-catalog.json');
const evidence = read('docs/c1-cable-design-video-review.json');
const section = sections.find(s => s.id === 'c1-cable-design-process');
const upgraded = parse(prior), view = snapshot(upgraded);
assert.equal(prior.curriculumRevision, 13);
assert.equal(Object.values(prior.groups).flat().length, 478, 'Fixture is the actual published course before this addition');
assert.deepEqual(prior, original, 'Reading preserves the stored account document');
assert.deepEqual(upgraded.groups, base.groups, 'Existing revision-13 accounts receive the same series as a fresh course');
assert.deepEqual(parse(upgraded), upgraded, 'Repeated reads never duplicate or reorder the series');
assert.deepEqual(upgraded.videos, prior.videos);
assert.deepEqual(upgraded.itemRevisions, prior.itemRevisions);
assert.deepEqual(upgraded.receipts, prior.receipts);
assert.equal(upgraded.revision, prior.revision);
for (const [id, ids] of Object.entries(prior.groups)) assert.deepEqual(upgraded.groups[id], ids, 'Every previous section retains its exact row order: ' + id);
assert.deepEqual(Object.values(upgraded.groups).flat().filter(id => !addedIds.has(id) && !laterIds.has(id)).sort(), Object.values(prior.groups).flat().sort(), 'Every original video occurrence survives once');
assert.equal(view.allRows.length, 503);
assert.equal(view.allRows.filter(r => view.course.modules.find(m => m.id === r.moduleId).path === 'C1').length, 169);
assert.deepEqual(section.lessonIds, additions.map(v => v.id));
assert.equal(section.number, 5);
assert.equal(sections.find(s => s.id === 'c1-design-section-2').number, 6);
assert.equal(sections.find(s => s.id === 'c1-design-voltage-drop').number, 7);
assert.equal(sections.find(s => s.id === 'c1-design-extension').number, 8);
assert.deepEqual(sections.filter(s => s.moduleId === 'c1-design').map(s => s.number), [1,2,3,4,5,6,7,8]);
assert.deepEqual(additions.map(v => v.videoId), ['bAdNXOLSwJg','OoJvApVqZh4','0CT-mT2Gm5s','Ip2QJBOdalo','vSKzLpKJMLE','-wi6pJPBW30','tRF0Y2MaQ5g']);
assert.equal(additions.reduce((n, v) => n + v.durationSeconds, 0), 3403);
const order = view.allRows.map(r => r.id);
const chain = ['c1-rating-factors-foundation', ...section.lessonIds, 'p06-l05', 'c1-cable-design', 'c1-three-phase-voltage-drop', 'c1-cpc-size-foundation', 'p07-l08'];
for (let i = 1; i < chain.length; i++) assert.ok(order.indexOf(chain[i-1]) >= 0 && order.indexOf(chain[i-1]) < order.indexOf(chain[i]), chain[i-1] + ' precedes ' + chain[i]);
for (const video of additions) {
  const lesson = catalog.modules.flatMap(m => m.lessons).find(l => l.id === video.id);
  assert.equal(lesson.videoId, video.videoId); assert.equal(lesson.instructor, 'EccElectric');
  assert.equal(required(video.id), true);
  assert.equal(view.byId.get(video.id).sectionId, section.id);
}
assert.equal(evidence.videos.length, 7);
for (const video of evidence.videos) {
  assert.deepEqual(video.transcript.language, ['en']);
  assert.match(video.transcript.sha256, /^[a-f0-9]{64}$/);
  assert.deepEqual(video.transcript.reviewedRanges, [{ startSeconds: 0, endSeconds: video.transcript.captionEndSeconds }]);
  assert.ok(video.transcript.captionSegments > 100 && video.transcript.captionEndSeconds <= video.durationSeconds + 3);
  assert.equal(video.availability.oembedAvailable, true);
}
const byId = new Map(catalog.modules.flatMap(m => m.lessons).map(l => [l.id,l]));
assert.match(byId.get('c1-cable-process-03').studyNote, /required tabulated capacity \(It\)/);
assert.match(byId.get('c1-cable-process-07').studyNote, /verified external loop impedance/);
const near = (a,b) => assert.ok(Math.abs(a-b) < 1e-9);
near(240/230, 1.0434782608695652);
near(20/0.94, 21.27659574468085); near(23*0.94, 21.62); near(13*0.87,11.31);
near(44*45*(240/230)/1000, 2.066086956521739); near(18*20*16/1000,5.76);
near(19.51*20*1.2/1000,0.46824); near(36.2*45*1.2/1000,1.9548);
near(0.35+0.46824,0.81824); near(0.8+1.9548,2.7548);

// Personal moves, nested private videos, existing copies, removals and Undo
// must remain authoritative when new canonical rows are discovered.
const custom = structuredClone(prior); custom.revision = 79;
custom.groups['c1-design-section-2'] = [];
custom.groups['module-01-section-1'].push('p06-l05'); custom.itemRevisions['p06-l05'] = 79;
const privateVideo = (id, anchorId, videoId) => ({ id, anchorId, videoId, title: 'My design lesson', instructor: 'My teacher', moduleId: 'module-01', position: 'after', archived: false, placementRevision: 13, updatedAt: '2026-10-21T09:00:00Z' });
const privateRows = [privateVideo('design-private-parent','p06-l05','abcdefghijk'), privateVideo('design-private-child','design-private-parent','lmnopqrstuv'), privateVideo('design-private-copy','p06-l05','bAdNXOLSwJg')];
custom.videos.push(...privateRows); custom.groups['module-01-section-1'].push(...privateRows.map(v => v.id));
custom.archivedLessonIds = ['p10-l10']; custom.deletedIds = ['p07-l16'];
custom.receipts = [{ id: 'before-design-series', revision: 79, affected: ['p06-l05'], inverse: { positions: [{ id: 'p06-l05', sectionId: 'c1-design-section-2', beforeId: null, afterId: null }], videos: [], archiveIds: [] } }];
const kept = parse(custom), keptView = snapshot(kept);
assert.equal(keptView.byId.get('p06-l05').sectionId, 'module-01-section-1');
for (const video of privateRows) assert.equal(keptView.byId.get(video.id).sectionId,'module-01-section-1');
assert.deepEqual(kept.videos.filter(v => v.id.startsWith('design-private-')), privateRows);
assert.deepEqual(kept.receipts, custom.receipts); assert.deepEqual(kept.itemRevisions, custom.itemRevisions);
assert.deepEqual(kept.archivedLessonIds,custom.archivedLessonIds); assert.deepEqual(kept.deletedIds,custom.deletedIds);
assert.ok(!keptView.byId.has('p10-l10') && !keptView.byId.has('p07-l16'));
assert.deepEqual(parse(kept),kept);
const edit = (state, edit) => apply(state, { operationId: crypto.randomUUID(), revision: state.revision, edit });
const undone = edit(kept, { type: 'undo', targetOperationId: 'before-design-series' });
assert.equal(snapshot(undone).byId.get('p06-l05').sectionId,'c1-design-section-2','Historical section identity still resolves after renumbering');
const moved = edit(upgraded, { type: 'move', id: additions[0].id, sectionId: 'module-01-section-1', beforeId: null });
assert.equal(snapshot(parse(moved)).byId.get(additions[0].id).sectionId,'module-01-section-1');
const deleted = edit(moved, { type: 'delete', id: additions[1].id });
assert.ok(!snapshot(parse(deleted)).byId.has(additions[1].id),'A removed series lesson is not reinserted by normalisation');
console.log('PASS C1 cable design: exact seven-part order, preserved published and personal arrangements, duplicates/removals/Undo, source evidence, capacity terminology and independent arithmetic.');
