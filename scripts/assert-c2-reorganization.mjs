import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const json = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
export const c2StageOrder = json('./fixtures/c2-stage-order.json');
const baseline = json('./course-baseline.json');
const relocatedFromProfessional = new Map([
  ['module-12', ['p12-v2-l14']],
  ['module-15', ['course-lIit5k8QVj8', 'course-V6WR_TBf1AU']],
]);

export function assertC2Reorganization(course) {
  const source = new Map(baseline.flatMap(module => module.lessons).map(lesson => [lesson.id, lesson]));
  const expected = baseline.filter(module => module.path !== 'C1').map(module => ({ ...module, lessons: c2StageOrder[module.id]
    ? c2StageOrder[module.id].flatMap(section => section.lessonIds).map(id => source.get(id))
    : relocatedFromProfessional.has(module.id) ? module.lessons.filter(lesson => !relocatedFromProfessional.get(module.id).includes(lesson.id)) : module.lessons }));
  const actual = course.modules.filter(module => module.path !== 'C1').map(module => ({ id: module.id, path: module.path,
    lessons: module.lessons.map(({ id, videoId, title, durationSeconds }) => ({ id, videoId, title, durationSeconds })) }));
  assert.deepEqual(actual, expected, 'C2 and Professional order remains unchanged while C1 is reorganized');
  const lessons = course.modules.flatMap(module => module.lessons);
  const identities = lessons.map(({ id, videoId, title, durationSeconds }) => ({ id, videoId, title, durationSeconds })).sort((a, b) => a.id.localeCompare(b.id));
  assert.deepEqual(identities, [...source.values()].sort((a, b) => a.id.localeCompare(b.id)), 'Preserve every original video and stable learner-state identity');
  for (const lesson of lessons) assert.equal(lesson.url, `https://www.youtube.com/watch?v=${lesson.videoId}`);
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
