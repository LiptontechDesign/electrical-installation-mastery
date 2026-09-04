import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const transcriptRoot = resolve(projectRoot, '..', 'course-transcripts');
const manifest = JSON.parse(readFileSync(join(transcriptRoot, 'manifest.json'), 'utf8'));

function filesBelow(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesBelow(path) : [path];
  });
}

const stopWords = new Set([
  'about', 'after', 'against', 'also', 'and', 'are', 'because', 'before', 'being', 'between',
  'can', 'correct', 'does', 'each', 'for', 'from', 'have', 'into', 'its', 'must', 'not', 'only',
  'other', 'rather', 'should', 'than', 'that', 'the', 'their', 'then', 'there', 'these', 'they',
  'this', 'through', 'under', 'use', 'using', 'when', 'where', 'which', 'while', 'with', 'without',
]);

function words(value) {
  return [...new Set(value.toLocaleLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !stopWords.has(word)))];
}

const transcriptFiles = filesBelow(transcriptRoot)
  .filter((path) => path.endsWith('.txt'));

const vite = await createServer({
  root: projectRoot,
  configFile: false,
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true },
});

try {
  const { lessonGuides } = await vite.ssrLoadModule('/app/lesson-guides.ts');
  const { buildAssessmentBank } = await vite.ssrLoadModule('/app/assessment-data.ts');
  const { default: course } = await vite.ssrLoadModule('/app/course-curriculum.ts');
  const { gapLessons } = await vite.ssrLoadModule('/app/course-gap-data.ts');
  const assessmentBank = buildAssessmentBank(course.modules, lessonGuides);
  const failures = [];
  const liveLessons = course.modules.flatMap(module => module.lessons);
  for (const lesson of liveLessons) {
    if (!manifest.videos.some(video => video.lessonId === lesson.id && video.videoId === lesson.videoId)) failures.push({ lessonId: lesson.id, reason: 'live lesson absent from transcript manifest' });
  }
  if (manifest.videos.length !== liveLessons.length) failures.push({ reason: 'manifest and live curriculum counts differ' });
  // Explicit partial audit for a checkout without the historical local archive.
  // The default remains a strict audit of every live lesson.
  const newOnly = process.argv.includes('--new-only');
  const newIds = new Set(gapLessons.map(lesson => lesson.id));
  const videosToAudit = newOnly ? manifest.videos.filter(video => newIds.has(video.lessonId)) : manifest.videos;
  let visualOnly = 0;

  for (const video of videosToAudit) {
    const marker = ` - ${video.lessonId} - `;
    const transcriptPath = transcriptFiles.find((path) => path.includes(marker));
    const guide = lessonGuides[video.lessonId];

    if (!transcriptPath || !guide) {
      failures.push({ lessonId: video.lessonId, reason: transcriptPath ? 'missing guide' : 'missing transcript' });
      continue;
    }

    const transcript = readFileSync(transcriptPath, 'utf8');
    if (/No intelligible spoken narration was detected/i.test(transcript)) {
      visualOnly += 1;
      continue;
    }

    const transcriptWords = new Set(words(transcript));
    const teachingWords = words([guide.summary, ...guide.keyConcepts, guide.remember].join(' '));
    const evidenceWords = teachingWords.filter((word) => transcriptWords.has(word));

    if (evidenceWords.length < 2) {
      failures.push({
        lessonId: video.lessonId,
        reason: 'teaching guide has insufficient transcript vocabulary overlap',
        transcript: relative(transcriptRoot, transcriptPath),
      });
    }
  }

  if (failures.length) {
    console.error(JSON.stringify({ scope: newOnly ? 'new lessons only' : 'all lessons', checked: videosToAudit.length, failures }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({
      scope: newOnly ? 'new lessons only' : 'all lessons',
      checked: videosToAudit.length,
      notAudited: liveLessons.length - videosToAudit.length,
      transcriptGrounded: videosToAudit.length - visualOnly,
      visualOnly,
      missing: 0,
      flashcards: assessmentBank.allFlashcards.length,
      quizQuestions: assessmentBank.totalLessonQuestions,
      genericRecallPrompts: assessmentBank.allFlashcards.filter((card) => card.front === 'How would you explain this lesson point in your own words?').length,
      longCardQuestions: assessmentBank.allFlashcards.filter((card) => card.front.length > 150).length,
      longCardAnswers: assessmentBank.allFlashcards.filter((card) => card.back.length > 260).length,
    }, null, 2));
    if (process.argv.includes('--sample')) {
      const genericCards = assessmentBank.allFlashcards
        .filter((card) => card.front === 'How would you explain this lesson point in your own words?')
        .slice(0, 30);
      console.log(JSON.stringify({
        'p01-l01': assessmentBank.lessons['p01-l01'].flashcards,
        'p01-l02': assessmentBank.lessons['p01-l02'].flashcards,
        genericCards,
      }, null, 2));
    }
  }
} finally {
  await vite.close();
}
