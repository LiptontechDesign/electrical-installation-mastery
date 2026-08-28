import guides01to03 from './lesson-guides-01-03.json';
import guides04to06 from './lesson-guides-04-06.json';
import guides07to10 from './lesson-guides-07-10.json';
import { extensionGuides } from './course-extension-data';

export type LessonGuide = {
  summary: string;
  keyConcepts: string[];
  remember: string;
  practicalConnection: string;
  checkYourself: string;
};

export const lessonGuides: Record<string, LessonGuide> = {
  ...guides01to03,
  ...guides04to06,
  ...guides07to10,
  ...extensionGuides,
};
