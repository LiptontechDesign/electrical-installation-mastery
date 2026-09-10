import index from './supplied-video-index.json';
import { resistanceContent } from './supplied-resistance-content';
import { lightingContent } from './supplied-lighting-content';
import { acFoundations } from './supplied-ac-foundations';
import { acPhasors } from './supplied-ac-phasors';
import { acApplications } from './supplied-ac-applications';
import type { SuppliedTeaching } from './supplied-content-types';
import type { LessonSeed } from './course-extension/builders';
import { integratedTeaching } from './integrated-content';

const content: Record<string, SuppliedTeaching> = { ...resistanceContent, ...lightingContent, ...acFoundations, ...acPhasors, ...acApplications };
export const suppliedTeaching: Record<string, SuppliedTeaching> = {...integratedTeaching};
export const suppliedLessons: LessonSeed[] = index.filter(video => !video.existing).map(video => {
  const teaching = content[video.videoId];
  if (!teaching) throw new Error(`Missing transcript-authored content: ${video.videoId}`);
  suppliedTeaching[video.id] = teaching;
  return {
    id: video.id, title: video.title, videoId: video.videoId, instructor: video.instructor,
    durationSeconds: video.durationSeconds, topic: video.group === 'lighting' ? 'Lighting calculations' : video.group === 'resistance' ? 'Resistance and resistivity' : 'AC, impedance and power factor',
    layer: 'WHY', sourceKind: 'Educator', regulationSensitive: false, regulationStatus: '',
    guide: { summary: teaching.model, keyConcepts: teaching.ideas, remember: teaching.ideas[2], practicalConnection: teaching.practice, checkYourself: teaching.retrieval.prompt },
  };
});
export const suppliedGuides = Object.fromEntries(suppliedLessons.map(lesson => [lesson.id, lesson.guide]));

export const sourceClarifications: Record<string, string> = {
  ...Object.fromEntries(Object.entries(integratedTeaching).filter(([,t])=>t.note).map(([id,t])=>[id,t.note!])),
  'supp-resistance-02': 'Copper resistance rises as it warms, but it is not directly proportional to Celsius temperature. Doubling a Celsius reading does not imply twice the resistance.',
  'supp-lighting-02': 'The distance relationship is inverse-square, not exponential: tripling distance gives one ninth of the direct illuminance under the stated model.',
  'supp-ac-theory-13': 'Lower supply current at unchanged voltage means lower apparent power. It does not by itself mean that the lamp uses less real power; useful load power and cable losses are separate.',
  'supp-ac-theory-22': 'Keep the capacitor connection explicit. Matching XL and XC describes series-reactance cancellation. A parallel power-factor capacitor must instead offset reactive power at the supply voltage; use the shunt calculation below.',
};
