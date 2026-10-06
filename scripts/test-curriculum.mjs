import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { assertC2Reorganization, earthElectrodeAdditions, jpelectricAdditions, surgeProtectionAdditions, designLearningAdditions, connectedProcessAdditions, overviewIds } from './assert-c2-reorganization.mjs';
await build({ entryPoints: ['app/course-curriculum.ts', 'app/learning-sections.ts'], outdir: 'work/curriculum-tests', bundle: true, platform: 'node', format: 'esm' });
const { default: course } = await import('../work/curriculum-tests/course-curriculum.js');
const { sectionsByModule } = await import('../work/curriculum-tests/learning-sections.js');
const lessons = course.modules.flatMap(courseModule => courseModule.lessons);
assert.equal(course.modules.length, 25);
assert.equal(lessons.length, 296 + earthElectrodeAdditions.length + jpelectricAdditions.length + surgeProtectionAdditions.length + designLearningAdditions.length + connectedProcessAdditions.length);
assert.equal(course.lessonCount, lessons.length);
assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length);
const focusedLessons = lessons.filter(lesson => !overviewIds.has(lesson.id));
assert.equal(new Set(focusedLessons.map(lesson => lesson.videoId)).size, focusedLessons.length);
assertC2Reorganization(course);
for (const courseModule of course.modules) {
  assert.deepEqual(sectionsByModule[courseModule.id].flatMap(section => section.lessonIds), courseModule.lessons.map(lesson => lesson.id));
  assert.equal(courseModule.durationSeconds, courseModule.lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0));
}
assert.equal(course.durationSeconds, course.modules.reduce((sum, courseModule) => sum + courseModule.durationSeconds, 0));
const electrodeSection = sectionsByModule['module-05'][6];
assert.equal(electrodeSection.id, 'module-05-earth-electrodes');
assert.deepEqual(electrodeSection.lessonIds, earthElectrodeAdditions.map(lesson => lesson.id));
assert.equal(earthElectrodeAdditions.length, 6);
assert.deepEqual(earthElectrodeAdditions.map(lesson => lesson.videoId), ['FSG77GwrEds', '_BkN8fRLYXw', 'K0P5wGSjxLE', 'moGlwuTYq8o', 'VKJ3gwFnxEw', 'tYcXE9W2AKQ']);
assert.equal(jpelectricAdditions.length, 22);
const excludedVideos = ['fBl-ni9UNkI', '_sgmiwTZkTc', 'QA_1yUr5sRo', 'wu8-mEfwVuk', 'KcF222vgYz0'];
const retiredVideos = ['gwL5bfLou9Y', 'EQ5qbWporuQ', '5r8_r4aqhn4', 'GUVLaJz94bQ', 'TYVGndneEXE', 'wXbtvJF-zyA', 'q1vb4LREJyI', '3lG9Q8IK4PQ', 'kSDjRiMhS7g'];
for (const videoId of [...excludedVideos, ...retiredVideos]) assert.ok(!lessons.some(lesson => lesson.videoId === videoId), `Omit unselected or replaced video: ${videoId}`);
assert.deepEqual(course.modules.filter(module => module.path === 'C2').map(module => module.title), [
  'Electrical Principles and Single-Phase Calculations',
  'Safety, Supply Architecture, Drawings and Instruments',
  'Cables, Conductors and Final Circuits',
  'Containment, Routing and Cable Installation',
  'Fault Protection, Earthing and Protective Devices',
  'Load Assessment and Single-Phase Circuit Design',
  'Consumer Units: Assembly and Pre-Commissioning',
  'Initial Verification, Commissioning and Installation Capstones',
  'Systematic Fault Diagnosis',
]);
assert.equal(sectionsByModule['module-05'][3].id, 'module-05-section-4');
console.log(`PASS: ${lessons.length} lesson entries, 25 modules, approved overview repetitions and complete course-section coverage.`);
