import sections from './learning-sections.json';
import course from './course-curriculum';

import type { LearningSection } from './overview-models';
export type { LearningSection } from './overview-models';
// Stable study groups with recap provenance, without scores or completion gates.
export const learningSections: LearningSection[] = sections;
export const sectionsByModule: Record<string, LearningSection[]> = Object.fromEntries(
  course.modules.map(module => [module.id, learningSections.filter(section => section.moduleId === module.id)]),
);
