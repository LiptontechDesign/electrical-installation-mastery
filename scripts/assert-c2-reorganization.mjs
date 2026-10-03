import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const json = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
export const c2StageOrder = json('./fixtures/c2-stage-order.json');
const professionalStageOrder = json('./fixtures/professional-stage-order.json');
export const earthElectrodeAdditions = json('./fixtures/earth-electrode-additions.json');
export const jpelectricAdditions = json('./fixtures/jpelectric-additions.json');
export const surgeProtectionAdditions = json('./fixtures/surge-protection-additions.json');
const baseline = json('./course-baseline.json');

export function assertC2Reorganization(course) {
  const source = new Map(baseline.flatMap(module => module.lessons).map(lesson => [lesson.id, lesson]));
  for (const lesson of [...earthElectrodeAdditions, ...jpelectricAdditions, ...surgeProtectionAdditions]) {
    assert.ok(!source.has(lesson.id), 'New lessons must not replace an original identity');
    source.set(lesson.id, lesson);
  }
  const approvedOrder = { ...c2StageOrder, ...professionalStageOrder };
  const expected = baseline.filter(module => module.path !== 'C1').map(module => ({ ...module, lessons: approvedOrder[module.id]
    ? approvedOrder[module.id].flatMap(section => section.lessonIds).map(id => source.get(id)) : module.lessons }));
  const actual = course.modules.filter(module => module.path !== 'C1').map(module => ({ id: module.id, path: module.path,
    lessons: module.lessons.map(({ id, videoId, title, durationSeconds }) => ({ id, videoId, title, durationSeconds })) }));
  assert.deepEqual(actual, expected, 'Preserve the reviewed C2 and Professional topic order');
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
