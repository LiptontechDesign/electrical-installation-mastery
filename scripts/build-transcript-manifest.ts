import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import baseCourse from '../app/course-data.json';
import courseExtension from '../app/course-extension-data';

const outputDirectory = path.resolve(process.cwd(), '..', 'course-transcripts');
const modules = [...baseCourse.modules, ...courseExtension.modules];
const videos = modules.flatMap((module, moduleIndex) =>
  module.lessons.map((lesson, lessonIndex) => ({
    sequence: videosBeforeModule(moduleIndex) + lessonIndex + 1,
    moduleId: module.id,
    moduleTitle: module.title,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    videoId: lesson.videoId,
    url: lesson.url,
  })),
);

function videosBeforeModule(moduleIndex: number) {
  return modules.slice(0, moduleIndex).reduce((total, module) => total + module.lessons.length, 0);
}

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, 'manifest.json'),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), totalVideos: videos.length, videos }, null, 2)}\n`,
  'utf8',
);

console.log(`Prepared ${videos.length} course videos in ${outputDirectory}`);
