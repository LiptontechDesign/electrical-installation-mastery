import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { assertC2Reorganization } from './assert-c2-reorganization.mjs';
await build({ entryPoints: ['app/course-curriculum.ts', 'app/learning-sections.ts'], outdir: 'work/curriculum-tests', bundle: true, platform: 'node', format: 'esm' });
const { default: course } = await import('../work/curriculum-tests/course-curriculum.js');
const { sectionsByModule } = await import('../work/curriculum-tests/learning-sections.js');
const lessons = course.modules.flatMap(courseModule => courseModule.lessons);
assert.equal(course.modules.length, 25);
assert.equal(lessons.length, 296);
assert.equal(new Set(lessons.map(lesson => lesson.id)).size, lessons.length);
assert.equal(new Set(lessons.map(lesson => lesson.videoId)).size, lessons.length);
assertC2Reorganization(course);
for (const courseModule of course.modules) {
  assert.deepEqual(sectionsByModule[courseModule.id].flatMap(section => section.lessonIds), courseModule.lessons.map(lesson => lesson.id));
  assert.equal(courseModule.durationSeconds, courseModule.lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0));
}
assert.equal(course.durationSeconds, course.modules.reduce((sum, courseModule) => sum + courseModule.durationSeconds, 0));
console.log('PASS: 296 videos, 25 modules, unique video identities and complete course-section coverage.');
