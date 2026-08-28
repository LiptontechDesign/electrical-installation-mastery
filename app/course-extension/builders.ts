export type LessonGuide = {
  summary: string;
  keyConcepts: string[];
  remember: string;
  practicalConnection: string;
  checkYourself: string;
};

export type SourceKind =
  | 'UK educator'
  | 'UK professional body'
  | 'UK manufacturer or trade specialist'
  | 'Official international manufacturer exception';

export type LessonSeed = {
  id: string;
  title: string;
  videoId: string;
  instructor: string;
  durationSeconds: number;
  topic: string;
  layer: string;
  sourceKind: SourceKind;
  guide: LessonGuide;
  regulationSensitive?: boolean;
  regulationStatus?: string;
};

export type ExtensionLesson = Omit<LessonSeed, 'guide'> & {
  number: number;
  url: string;
  duration: string;
  prerequisite: string;
  rationale: string;
  regulationSensitive: boolean;
  regulationStatus: string;
  guide: LessonGuide;
};

export type ExtensionModule = {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  checkpoint: string;
  lessons: ExtensionLesson[];
};

export function G(
  summary: string,
  keyConcepts: string[],
  remember: string,
  practicalConnection: string,
  checkYourself: string,
): LessonGuide {
  return { summary, keyConcepts, remember, practicalConnection, checkYourself };
}

export function L(
  id: string,
  title: string,
  videoId: string,
  instructor: string,
  durationSeconds: number,
  topic: string,
  layer: string,
  sourceKind: SourceKind,
  guide: LessonGuide,
  options: Pick<LessonSeed, 'regulationSensitive' | 'regulationStatus'> = {},
): LessonSeed {
  return { id, title, videoId, instructor, durationSeconds, topic, layer, sourceKind, guide, ...options };
}

export function formatVideoDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatStudyDuration(totalSeconds: number) {
  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours ? `${hours} h ${String(minutes).padStart(2, '0')} min` : `${minutes} min`;
}

export function M(
  number: number,
  title: string,
  description: string,
  checkpoint: string,
  entryPrerequisite: string,
  defaultRegulationStatus: string,
  seeds: LessonSeed[],
): ExtensionModule {
  const lessons = seeds.map((seed, index) => ({
    ...seed,
    number: index + 1,
    url: `https://www.youtube.com/watch?v=${seed.videoId}`,
    duration: formatVideoDuration(seed.durationSeconds),
    prerequisite: index === 0
      ? entryPrerequisite
      : `Complete the previous lesson, “${seeds[index - 1].title}”; this lesson builds on that decision or method.`,
    rationale: seed.guide.summary,
    regulationSensitive: seed.regulationSensitive ?? true,
    regulationStatus: seed.regulationStatus ?? defaultRegulationStatus,
  }));
  const durationSeconds = lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0);

  return {
    id: `module-${String(number).padStart(2, '0')}`,
    number,
    title,
    description,
    duration: formatStudyDuration(durationSeconds),
    durationSeconds,
    checkpoint,
    lessons,
  };
}

export function createCourseExtension(modules: ExtensionModule[]) {
  const lessons = modules.flatMap((module) => module.lessons);
  const rejectedVideoIds = new Set([
    'h8_Kz4KmM6E', 'J2IIH1xVrJM', 'pyhy_yNW2IE', 'BtkIiGDBESw',
    'os71K5mmGLI', 'A6v64PYrx5E', 'i6x0GD_Us1k', 'm0QVBLIqQso',
    'FI8uw3B01cA', '6idadtpqSrg', 'r7Eju2gpbtg', 'Ic-dkOs8fGw', 'obkUNBH1xnY',
  ]);
  const lessonIds = new Set<string>();
  const videoIds = new Set<string>();

  for (const lesson of lessons) {
    if (lesson.durationSeconds < 300) {
      throw new Error(`Extension lesson ${lesson.id} is shorter than the five-minute quality floor.`);
    }
    if (lesson.guide.keyConcepts.length < 4) {
      throw new Error(`Extension lesson ${lesson.id} needs at least four key concepts.`);
    }
    if (rejectedVideoIds.has(lesson.videoId)) {
      throw new Error(`Extension lesson ${lesson.id} uses a video rejected by the 2026 quality audit.`);
    }
    if (lessonIds.has(lesson.id) || videoIds.has(lesson.videoId)) {
      throw new Error(`Duplicate extension lesson or video detected at ${lesson.id}.`);
    }
    lessonIds.add(lesson.id);
    videoIds.add(lesson.videoId);
  }

  const durationSeconds = modules.reduce((sum, module) => sum + module.durationSeconds, 0);
  return {
    lessonCount: lessons.length,
    duration: formatStudyDuration(durationSeconds),
    durationSeconds,
    modules,
  };
}

export function guidesFromModules(modules: ExtensionModule[]) {
  return Object.fromEntries(
    modules.flatMap((module) => module.lessons.map((lesson) => [lesson.id, lesson.guide] as const)),
  );
}
