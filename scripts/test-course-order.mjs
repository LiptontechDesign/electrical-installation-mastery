import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { earthElectrodeAdditions, jpelectricAdditions } from './assert-c2-reorganization.mjs';
await mkdir('work/course-order-tests', { recursive: true });
await build({ entryPoints: ['app/course-order-model.ts'], outfile: 'work/course-order-tests/model.js', bundle: true, platform: 'node', format: 'esm' });
const { courseForOrder, defaultOrder, moveLesson, orderedSections, parseOrder, relocateSupportingVideos } = await import('../work/course-order-tests/model.js');
const initial = courseForOrder(defaultOrder);
const identity = initial.course.modules.flatMap(m => m.lessons.map(l => l.id));

// Replay a saved arrangement from before the selected playlist lessons existed.
const newIds = new Set([...jpelectricAdditions, ...earthElectrodeAdditions.slice(3)].map(lesson => lesson.id));
const authoredSections = orderedSections(defaultOrder);
const previous = { version: 1, revision: 8, groups: Object.fromEntries(authoredSections.map(section => [section.id, section.lessonIds.filter(id => !newIds.has(id))])) };
previous.groups['module-05-earth-electrodes'].splice(1, 0, 'p05-earth-plates');
assert.deepEqual(orderedSections(previous), authoredSections, 'New explanations precede existing practical lessons in saved arrangements');
const customPrevious = moveLesson(previous, { lessonId: 'p08-l03', sectionId: 'module-06-section-2', beforeId: 'p06-l10' });
customPrevious.excludedLessonIds = ['course-q4UTihwOloA'];
const upgradedCustom = orderedSections(customPrevious);
assert.ok(upgradedCustom.find(section => section.id === 'module-06-section-2').lessonIds.includes('p08-l03'), 'Existing personal moves remain in their destination');
assert.ok(!upgradedCustom.flatMap(section => section.lessonIds).includes('course-q4UTihwOloA'), 'Excluded new lessons do not return');
assert.equal(previous.revision, 8, 'Reading the new catalogue does not modify the saved revision');

let order = moveLesson(defaultOrder, { lessonId: 'p05-l01', sectionId: 'module-05-section-1', beforeId: null });
assert.equal(orderedSections(order).find(s => s.id === 'module-05-section-1').lessonIds.at(-1), 'p05-l01', 'Move within section');
order = moveLesson(order, { lessonId: 'p05-l01', sectionId: 'module-06-section-2', beforeId: 'p06-l10' });
const moved = courseForOrder(order);
assert.deepEqual(moved.sectionsByModule['module-06'].find(s => s.id === 'module-06-section-2').lessonIds.slice(0, 3), ['p06-l04', 'p05-l01', 'p06-l10']);
assert.ok(!moved.course.modules.find(m => m.id === 'module-05').lessons.some(l => l.id === 'p05-l01'));
assert.equal(moved.course.modules.find(m => m.id === 'module-06').lessons.filter(l => l.id === 'p05-l01').length, 1);
const after = moved.course.modules.flatMap(m => m.lessons.map(l => l.id));
assert.deepEqual([...after].sort(), [...identity].sort(), 'Moving preserves every canonical lesson exactly once');
assert.equal(new Set(after).size, after.length);
assert.throws(() => parseOrder({ version: 1, revision: 1, groups: { a: ['p05-l01'], b: ['p05-l01'] } }));
assert.throws(() => moveLesson(order, { lessonId: 'p05-l01', sectionId: 'missing', beforeId: null }));
const supporting = relocateSupportingVideos([{ id: 'support', videoId: 'abc123def45', title: 'Support', instructor: '', moduleId: 'module-05', anchorId: 'p05-l01', position: 'after', archived: false, updatedAt: '' }], moved.course);
assert.equal(supporting[0].moduleId, 'module-06', 'Supporting videos follow their core lesson');
console.log('PASS: shared course moves preserve lesson identity, ordering and supporting-video placement.');
