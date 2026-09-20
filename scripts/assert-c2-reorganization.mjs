import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const json = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
export const c2StageOrder = json('./fixtures/c2-stage-order.json');
const baseline = json('./course-baseline.json');
const relocated = ['course-lIit5k8QVj8', 'course-V6WR_TBf1AU'];

export function assertC2Reorganization(course) {
  const source = new Map(baseline.flatMap(module => module.lessons).map(lesson => [lesson.id, lesson]));
  const expected = baseline.map(module => ({ ...module, lessons: c2StageOrder[module.id]
    ? c2StageOrder[module.id].flatMap(section => section.lessonIds).map(id => source.get(id))
    : module.id === 'module-15' ? module.lessons.filter(lesson => !relocated.includes(lesson.id)) : module.lessons }));
  const actual = course.modules.map(module => ({ id: module.id, path: module.path,
    lessons: module.lessons.map(({ id, videoId, title, durationSeconds }) => ({ id, videoId, title, durationSeconds })) }));
  assert.deepEqual(actual, expected, 'Only the specified C2 order and two Professional relocations may change');
  const lessons = course.modules.flatMap(module => module.lessons);
  // Captured before this reorganization: all canonical lesson properties except
  // presentation number and automatically generated predecessor description.
  const identities = lessons.map(lesson => Object.fromEntries(Object.entries(lesson)
    .filter(([key]) => !['number', 'prerequisite'].includes(key)))).sort((a, b) => a.id.localeCompare(b.id));
  assert.equal(createHash('sha256').update(JSON.stringify(identities)).digest('hex'),
    'e0b84cdf82e688f8a90586184ce50161a2cb62c0fdc3e81a7e4cc61044c6d876',
    'Preserve every canonical lesson, URL, source property and learner-state identity');
  for (const key of ['id', 'videoId', 'title']) {
    const values = lessons.map(lesson => key === 'title' ? lesson.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim() : lesson[key]);
    assert.equal(new Set(values).size, lessons.length, `No canonical duplicate ${key}`);
  }
  const anchors = { 'course-TqdQRgf3uGs': 'course-Me_adh09CdY', 'course-lIit5k8QVj8': 'p05-spd',
    'course-V6WR_TBf1AU': 'p05-l14', 'course-8Z255dd78H4': 'p06-l10' };
  const index = json('../app/integrated-video-index.json');
  for (const [id, anchor] of Object.entries(anchors)) {
    const video = index.find(item => item.id === id);
    assert.equal(video.anchor, anchor); assert.equal(video.position, 'after');
  }
  for (const video of index) {
    const courseModule = course.modules.find(item => item.lessons.some(lesson => lesson.id === video.id));
    assert.ok(courseModule?.lessons.some(lesson => lesson.id === video.anchor), `Integrated anchor resolves in same module: ${video.id}`);
  }
}
