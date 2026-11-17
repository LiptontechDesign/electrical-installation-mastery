import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const additions = read('scripts/fixtures/comprehensive-solar-additions.json');
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
assert.equal(groups.length, 29);
assert.equal(lessons.length, 72);
assert.deepEqual(modules.map(module => module.stageNumber), Array.from({ length: 13 }, (_, index) => index + 1));
assert.deepEqual(lessons.map(({ id, videoId, title, durationSeconds }) => ({ id, videoId, title, durationSeconds })), additions, 'All videos retain the approved teaching order');
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
assert.deepEqual(lessons.slice(24, 30).map(lesson => lesson.videoId), ['CHYVhNdlYM4', 'vdly8OhsdmI', '7ROjd6eLANo', 'pJNWjtwE3XA', 'D0PMQX-wHjY', 'I0X2YDfDaQU'], 'The worked design series stays together');
assert.deepEqual(lessons.slice(56, 58).map(lesson => lesson.videoId), ['YRn9xabVIQM', 'T5aVFo7EUi8'], 'The UK installation overview comes before the wiring walkthrough');

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
console.log('PASS comprehensive Solar: 72 videos in 13 modules and 29 sections, original Solar intact, saved moves/archives/deletions preserved, separate progress and cross-path move/Undo.');
