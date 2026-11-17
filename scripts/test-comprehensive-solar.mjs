import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const additions = read('scripts/fixtures/comprehensive-solar-additions.json');
const titleUpdates = read('scripts/fixtures/comprehensive-solar-title-updates.json');
const priorPublished = read('scripts/fixtures/comprehensive-solar-revision-14.json');
const previousSolar = read('scripts/fixtures/comprehensive-solar-previous.json');
const catalog = read('app/video-catalog.json');
const sections = read('app/learning-sections.json');
const modules = catalog.modules.filter(module => module.path === 'Solar Comprehensive');
const lessons = modules.flatMap(module => module.lessons);
const groups = sections.filter(section => modules.some(module => module.id === section.moduleId));

await build({ entryPoints: ['app/personal-course-model.ts', 'app/course-progress-model.ts', 'app/course-pathways.ts'], outdir: 'work/comprehensive-solar-tests', bundle: true, platform: 'node', format: 'esm' });
const { publishedPersonalCourse, parsePersonalCourse, personalCourseSnapshot: snapshot, applyCourseEdit } = await import('../work/comprehensive-solar-tests/personal-course-model.js');
const { progressForVideos } = await import('../work/comprehensive-solar-tests/course-progress-model.js');
const { coursePathways } = await import('../work/comprehensive-solar-tests/course-pathways.js');

assert.equal(coursePathways.findIndex(path => path.id === 'Solar Comprehensive'), coursePathways.findIndex(path => path.id === 'Solar') + 1);
assert.deepEqual(catalog.modules.filter(module => module.path === 'Solar'), previousSolar.modules, 'The original Solar modules are unchanged');
assert.deepEqual(sections.filter(section => previousSolar.modules.some(module => module.id === section.moduleId)), previousSolar.sections, 'The original Solar sections are unchanged');
assert.equal(modules.length, 13);
assert.equal(groups.length, 31);
assert.equal(lessons.length, 72);
assert.deepEqual(modules.map(module => module.stageNumber), Array.from({ length: 13 }, (_, index) => index + 1));
const expectedNumbers = [25, 55, ...Array.from({ length: 44 }, (_, index) => index + 1).filter(number => number !== 25), 47, 48, 45, 46, ...Array.from({ length: 24 }, (_, index) => index + 49).filter(number => number !== 55)];
const expectedOrder = expectedNumbers.map(number => additions[number - 1]).map(lesson => ({ ...lesson, title: titleUpdates[lesson.id] }));
assert.deepEqual(lessons.map(({ id, videoId, title, durationSeconds }) => ({ id, videoId, title, durationSeconds })), expectedOrder, 'Only the four intended lessons move; all media identities and durations are preserved');
assert.equal(new Set(lessons.map(lesson => lesson.videoId)).size, 72);
assert.equal(lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0), 49757);
for (const courseModule of modules) {
  assert.deepEqual(groups.filter(section => section.moduleId === courseModule.id).flatMap(section => section.lessonIds), courseModule.lessons.map(lesson => lesson.id));
  assert.equal(courseModule.durationSeconds, courseModule.lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0));
  for (const lesson of courseModule.lessons) {
    assert.equal(lesson.url, `https://www.youtube.com/watch?v=${lesson.videoId}`);
    assert.ok(lesson.instructor && lesson.durationSeconds > 0);
    assert.equal(lesson.studyNote, undefined);
  }
}
assert.deepEqual(lessons.slice(0, 2).map(lesson => lesson.videoId), ['CHYVhNdlYM4', 'uobUwjCLfok'], 'A design overview and physical system come first');
assert.deepEqual(modules[8].lessons.map(lesson => lesson.id), ['solar-comprehensive-video-47', 'solar-comprehensive-video-48', 'solar-comprehensive-video-45', 'solar-comprehensive-video-46'], 'Grid and self-consumption concepts precede the battery gateway walkthrough');
const worked = lessons.findIndex(lesson => lesson.id === 'solar-comprehensive-video-26');
assert.deepEqual(lessons.slice(worked, worked + 5).map(lesson => lesson.videoId), ['vdly8OhsdmI', '7ROjd6eLANo', 'pJNWjtwE3XA', 'D0PMQX-wHjY', 'I0X2YDfDaQU'], 'The five worked design steps stay together');
const victron = lessons.findIndex(lesson => lesson.id === 'solar-comprehensive-video-57');
assert.deepEqual(lessons.slice(victron, victron + 2).map(lesson => lesson.videoId), ['YRn9xabVIQM', 'T5aVFo7EUi8'], 'The UK installation overview comes before the wiring walkthrough');
assert.ok(lessons.filter(lesson => ['solar-comprehensive-video-71', 'solar-comprehensive-video-72'].includes(lesson.id)).every(lesson => lesson.required === false), 'UK export tariffs are optional background');

// A real saved publication from revision 14 migrates just four untouched
// rows and leaves every other section, watched identity and saved field intact.
assert.equal(priorPublished.curriculumRevision, 14);
const priorCopy = structuredClone(priorPublished);
const upgradedPublished = parsePersonalCourse(priorPublished);
const preview = 'solar-comprehensive-01-preview';
assert.equal(upgradedPublished.curriculumRevision, 15);
assert.deepEqual(upgradedPublished.groups[preview], ['solar-comprehensive-video-25', 'solar-comprehensive-video-55']);
assert.deepEqual(upgradedPublished.groups['solar-comprehensive-09-self-consumption'], ['solar-comprehensive-video-47', 'solar-comprehensive-video-48']);
for (const [id, rows] of Object.entries(priorPublished.groups)) {
  const expected = rows.filter(row => !['solar-comprehensive-video-25', 'solar-comprehensive-video-55', 'solar-comprehensive-video-47', 'solar-comprehensive-video-48'].includes(row));
  assert.deepEqual(upgradedPublished.groups[id], expected, `Only the intended lessons move from ${id}`);
}
assert.deepEqual(priorPublished, priorCopy);
assert.deepEqual(parsePersonalCourse(upgradedPublished), upgradedPublished);
assert.deepEqual(progressForVideos(lessons.map(lesson => lesson.id), new Set(['solar-comprehensive-video-25', 'solar-comprehensive-video-55'])), { watched: 2, total: 72, percent: 3 }, 'Watched state follows stable lesson identities');

// Explicitly moved lessons, reordered legacy groups, archives and deletions are
// not replaced by a new published location on reload.
const customised = structuredClone(priorPublished);
const source25 = 'solar-comprehensive-05-section-02';
const source55 = 'solar-comprehensive-11-section-01';
const customTarget = 'solar-comprehensive-03-section-01';
customised.groups[source25] = customised.groups[source25].filter(id => id !== 'solar-comprehensive-video-25');
customised.groups[customTarget].unshift('solar-comprehensive-video-25');
customised.itemRevisions['solar-comprehensive-video-25'] = 8;
customised.groups[source55] = [...customised.groups[source55]].reverse();
customised.groups['solar-comprehensive-10-section-01'] = [...customised.groups['solar-comprehensive-10-section-01']].reverse();
customised.archivedLessonIds = ['solar-comprehensive-video-55'];
customised.deletedIds = ['solar-comprehensive-video-26'];
customised.revision = 12;
const keptCustom = parsePersonalCourse(customised);
assert.equal(keptCustom.groups[customTarget][0], 'solar-comprehensive-video-25');
assert.deepEqual(keptCustom.groups[source55], customised.groups[source55], 'A reordered legacy section stays in the learner’s order');
assert.deepEqual(keptCustom.groups['solar-comprehensive-10-section-01'], customised.groups['solar-comprehensive-10-section-01'], 'A reordered grid section stays in the learner’s order');
assert.deepEqual(keptCustom.archivedLessonIds, customised.archivedLessonIds);
assert.deepEqual(keptCustom.deletedIds, customised.deletedIds);
assert.ok(!snapshot(keptCustom).byId.has('solar-comprehensive-video-55'));
assert.ok(!snapshot(keptCustom).byId.has('solar-comprehensive-video-26'));
assert.equal(keptCustom.revision, 12);

const withChild = structuredClone(priorPublished);
const child = { id: 'solar-overview-private-child', videoId: 'abcde123456', title: 'My prior overview note', instructor: 'Private', moduleId: 'solar-comprehensive-05', anchorId: 'solar-comprehensive-video-25', position: 'after', archived: false, updatedAt: '2026-11-17T00:00:00.000Z' };
withChild.videos.push(child);
withChild.groups[source25].splice(1, 0, child.id);
assert.deepEqual(parsePersonalCourse(withChild).groups[preview].slice(0, 2), ['solar-comprehensive-video-25', child.id], 'Unmoved supporting videos follow their anchor');
withChild.itemRevisions[child.id] = 3;
assert.ok(parsePersonalCourse(withChild).groups[source25].includes(child.id), 'A personally positioned supporting video stays in place');

// Simulate a revision-14 account saved before this additive pathway existed.
// Existing moves, archives, deletions, order and private video records must survive.
const prior = structuredClone(publishedPersonalCourse);
for (const section of groups) delete prior.groups[section.id];
const movedId = 'solar-t1-pv-principles';
const oldSource = Object.keys(prior.groups).find(id => prior.groups[id].includes(movedId));
const oldDestination = 'solar-t3-domestic-planning';
prior.groups[oldSource] = prior.groups[oldSource].filter(id => id !== movedId);
prior.groups[oldDestination].unshift(movedId);
prior.archivedLessonIds = ['solar-t2-pv-checks'];
prior.deletedIds = ['solar-t3-array-design'];
prior.revision = 42;
const original = structuredClone(prior);
const upgraded = parsePersonalCourse(prior);
assert.deepEqual(prior, original, 'Reading does not mutate the saved input');
assert.deepEqual(parsePersonalCourse(upgraded), upgraded, 'Migration is idempotent');
assert.equal(upgraded.curriculumRevision, prior.curriculumRevision);
for (const [id, rows] of Object.entries(prior.groups)) assert.deepEqual(upgraded.groups[id], rows.filter(row => !prior.deletedIds.includes(row)), `Saved section ${id} remains in order`);
for (const key of ['revision', 'videos', 'itemRevisions', 'receipts', 'archivedLessonIds', 'deletedIds']) assert.deepEqual(upgraded[key], prior[key], `Preserve ${key}`);
for (const section of groups) assert.deepEqual(upgraded.groups[section.id], section.lessonIds, 'New sections appear in published order');
const view = snapshot(upgraded);
assert.equal(view.byId.get(movedId).sectionId, oldDestination);
assert.ok(!view.byId.has('solar-t2-pv-checks'));
assert.ok(!view.byId.has('solar-t3-array-design'));
assert.deepEqual(view.allRows.filter(row => row.id.startsWith('solar-comprehensive-video-')).map(row => row.id), lessons.map(lesson => lesson.id));
assert.deepEqual(progressForVideos(lessons.map(lesson => lesson.id), new Set(['solar-t2-pv-checks'])), { watched: 0, total: 72, percent: 0 }, 'Repeated YouTube media has a separate lesson progress identity');

const moved = applyCourseEdit(upgraded, { operationId: 'comprehensive-solar-move-01', revision: upgraded.revision, edit: { type: 'move', id: lessons[0].id, sectionId: oldDestination, beforeId: null } });
assert.equal(snapshot(moved).byId.get(lessons[0].id).sectionId, oldDestination);
const undone = applyCourseEdit(moved, { operationId: 'comprehensive-solar-undo-01', revision: moved.revision, edit: { type: 'undo', targetOperationId: 'comprehensive-solar-move-01' } });
assert.equal(snapshot(undone).byId.get(lessons[0].id).sectionId, groups[0].id);
console.log('PASS comprehensive Solar: 72 unchanged videos in 13 modules and 31 sections, clear titles, earlier overviews and hybrid concepts, original Solar intact, saved placements and watched identities preserved.');
