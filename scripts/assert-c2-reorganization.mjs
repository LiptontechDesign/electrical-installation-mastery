import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const json = path => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
export const c2StageOrder = json('./fixtures/c2-stage-order.json');
const professionalStageOrder = json('./fixtures/professional-stage-order.json');
const professionalScopeAdditions = json('../app/c1-module-update.json').professionalScopeAdditions;
export const earthElectrodeAdditions = json('./fixtures/earth-electrode-additions.json');
export const jpelectricAdditions = json('./fixtures/jpelectric-additions.json');
export const surgeProtectionAdditions = json('./fixtures/surge-protection-additions.json');
export const designLearningAdditions = json('./fixtures/design-learning-additions.json');
export const connectedProcessAdditions = json('./fixtures/connected-process-additions.json');
export const c1LearningAdditions = json('./fixtures/c1-learning-additions.json');
export const c1GapFillAdditions = json('./fixtures/c1-gap-fill-additions.json');
export const c1FlowAdditions = json('./fixtures/c1-flow-additions.json');
export const c1ApplicationAdditions = json('./fixtures/c1-application-additions.json');
export const c1GeneratorAdditions = json('./fixtures/c1-generator-additions.json');
export const c1WoundRotorAdditions = json('./fixtures/c1-wound-rotor-additions.json');
export const motorControlAdditions = json('./fixtures/motor-control-additions.json');
export const motorPracticalAdditions = json('./fixtures/c1-motor-practical-additions.json');
export const solarAdditions = json('./fixtures/solar-pathway-additions.json');
export const c1MotorGapAdditions = json('./fixtures/c1-motor-gap-additions.json');
export const c1ProtectionAdditions = json('./fixtures/c1-protection-additions.json');
export const c1RashidAdditions = json('./fixtures/c1-rashid-additions.json');
export const c1CableDesignAdditions = json('./fixtures/c1-cable-design-additions.json');
export const c1FlowRepeatIds = json('../app/c1-flow-update.json').repeats.map(lesson => lesson.id);
export const c1FoundationIds = json('../app/c1-gap-fill-update.json').repeats.map(lesson => lesson.id);
export const designOverviewIds = new Set(json('../app/design-learning-update.json').overviewLessonIds);
export const processOverviewIds = new Set(json('../app/connected-process-update.json').overviewLessonIds);
export const overviewIds = new Set([...designOverviewIds, ...processOverviewIds, ...c1FoundationIds, ...c1FlowRepeatIds, ...motorControlAdditions.map(v => v.id), 'c1-demand-example', ...json('../app/c1-protection-update.json').repeats.map(v => v.id), ...json('../app/solar-pathway-update.json').repeatedMediaLessonIds]);
const baseline = json('./course-baseline.json');

export function assertC2Reorganization(course) {
  const source = new Map(baseline.flatMap(module => module.lessons).map(lesson => [lesson.id, lesson]));
  for (const lesson of [...earthElectrodeAdditions, ...jpelectricAdditions, ...surgeProtectionAdditions, ...designLearningAdditions, ...connectedProcessAdditions, ...c1LearningAdditions, ...c1GapFillAdditions, ...c1FlowAdditions, ...c1ApplicationAdditions, ...c1GeneratorAdditions, ...c1CableDesignAdditions, ...c1RashidAdditions, ...c1ProtectionAdditions, ...c1MotorGapAdditions, ...c1WoundRotorAdditions, ...motorControlAdditions, ...motorPracticalAdditions, ...solarAdditions]) {
    assert.ok(!source.has(lesson.id), 'New lessons must not replace an original identity');
    source.set(lesson.id, lesson);
  }
  // Explicit presentation correction; original media identity/duration remain frozen.
  for (const [id,title] of Object.entries(json('../app/c1-motor-gap-update.json').titleUpdates)) source.set(id,{...source.get(id),title});
  const approvedOrder = { ...c2StageOrder, ...professionalStageOrder };
  const expected = baseline.filter(module => module.path !== 'C1').map(module => ({ ...module, lessons: approvedOrder[module.id]
    ? [...approvedOrder[module.id].flatMap(section => section.lessonIds), ...(professionalScopeAdditions[module.id] ?? [])].map(id => source.get(id)) : module.lessons }));
  const actual = course.modules.filter(module => ['C2', 'Professional'].includes(module.path)).map(module => ({ id: module.id, path: module.path,
    lessons: module.lessons.map(({ id, videoId, title, durationSeconds }) => ({ id, videoId, title, durationSeconds })) }));
  assert.deepEqual(actual, expected, 'Preserve the reviewed C2 and Professional topic order');
  const lessons = course.modules.flatMap(module => module.lessons);
  const identities = lessons.map(({ id, videoId, title, durationSeconds }) => ({ id, videoId, title, durationSeconds })).sort((a, b) => a.id.localeCompare(b.id));
  assert.deepEqual(identities, [...source.values()].sort((a, b) => a.id.localeCompare(b.id)), 'Preserve every original video and stable learner-state identity');
  for (const lesson of lessons) assert.equal(lesson.url, `https://www.youtube.com/watch?v=${lesson.videoId}`);
  for (const key of ['id', 'videoId', 'title']) {
    const entries = key === 'videoId' ? lessons.filter(lesson => !overviewIds.has(lesson.id)) : lessons;
    const values = entries.map(lesson => key === 'title' ? lesson.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim() : lesson[key]);
    assert.equal(new Set(values).size, entries.length, `No unapproved canonical duplicate ${key}`);
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
