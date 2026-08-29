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
  const { default: courseExtension } = await vite.ssrLoadModule('/app/course-extension-data.ts');
  const courseData = JSON.parse(readFileSync(join(projectRoot, 'app', 'course-data.json'), 'utf8'));
  const assessmentBank = buildAssessmentBank([...courseData.modules, ...courseExtension.modules], lessonGuides);
  const failures = [];
  let visualOnly = 0;

  for (const video of manifest.videos) {
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
    console.error(JSON.stringify({ checked: manifest.totalVideos, failures }, null, 2));
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({
      checked: manifest.totalVideos,
      transcriptGrounded: manifest.totalVideos - visualOnly,
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
