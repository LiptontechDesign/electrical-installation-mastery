import sections from './learning-sections.json';
import course from './course-curriculum';

export type LearningSection = { id: string; moduleId: string; number: number; title: string; lessonIds: string[] };
// Stable video groups preserve saved course ordering.
export const learningSections: LearningSection[] = sections;
export const sectionsByModule: Record<string, LearningSection[]> = Object.fromEntries(
  course.modules.map(module => [module.id, learningSections.filter(section => section.moduleId === module.id)]),
);
