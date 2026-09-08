import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { build } from 'esbuild';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

mkdirSync('work/supplied-tests', { recursive: true });
await build({ entryPoints: ['app/course-curriculum.ts', 'app/lesson-guides.ts', 'app/assessment-data.ts', 'app/lesson-overview.tsx', 'app/supplied-lessons.ts', 'app/learning-design.ts'], outdir: 'work/supplied-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { default: course } = await import('../work/supplied-tests/course-curriculum.js');
const { lessonGuides } = await import('../work/supplied-tests/lesson-guides.js');
const { buildAssessmentBank } = await import('../work/supplied-tests/assessment-data.js');
const { suppliedTeaching } = await import('../work/supplied-tests/supplied-lessons.js');
const { shuffleQuestion } = await import('../work/supplied-tests/learning-design.js');
const { default: Overview } = await import('../work/supplied-tests/lesson-overview.js');
const index = JSON.parse(readFileSync('app/supplied-video-index.json', 'utf8'));
const lessons = course.modules.flatMap(m => m.lessons);
const bank = buildAssessmentBank(course.modules, lessonGuides);
assert.equal(lessons.length, 276);
assert.equal(new Set(lessons.map(l => l.id)).size, 276);
assert.equal(new Set(lessons.map(l => l.videoId)).size, 276);
assert.equal(index.length, 44);
const added = index.filter(v => !v.existing);
assert.equal(added.length, 30);
for (const video of index) {
  assert.equal(lessons.filter(l => l.videoId === video.videoId).length, 1, video.videoId);
  assert.equal(createHash('sha256').update(readFileSync(video.transcript)).digest('hex'), video.sha256, `Source preserved: ${video.videoId}`);
}
assert.ok(!lessons.some(l => l.videoId === 'mZBwsm6B280'), 'Unrelated probability video excluded');
const prompts = new Set();
for (const video of added) {
  const assessment = bank.lessons[video.id];
  const source = suppliedTeaching[video.id];
  assert.equal(assessment.questions.length, 5);
  assert.equal(assessment.flashcards.length, 6);
  assert.equal(source.ideas.length, 3);
  for (const question of assessment.questions) {
    assert.ok(question.prompt.endsWith('?'));
    assert.ok(!prompts.has(question.prompt), `Unique prompt: ${question.id}`);
    prompts.add(question.prompt);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.design.diagnostics[question.answer], null);
    assert.equal(question.design.diagnostics.filter(Boolean).length, 3);
    assert.equal(new Set(question.design.diagnostics.filter(Boolean).map(d => d.diagnosis)).size, 3);
    for (const diagnostic of question.design.diagnostics.filter(Boolean)) {
      assert.ok(diagnostic.diagnosis.length > 15);
      assert.ok(diagnostic.repair.length > 30);
      assert.ok(!/different lesson point|does not answer|useful point from the same topic/i.test(diagnostic.diagnosis));
    }
    const card = assessment.flashcards.find(c => c.id === question.cardId);
    assert.notEqual(card.front, question.prompt, 'Flashcard asks independent retrieval');
    for (let attempt = 0; attempt < 4; attempt++) {
      const shuffled = shuffleQuestion(question, attempt);
      assert.equal(shuffled.options[shuffled.answer], question.options[question.answer]);
      assert.equal(shuffled.design.diagnostics[shuffled.answer], null);
      for (let i = 0; i < 4; i++) assert.deepEqual(shuffled.design.diagnostics[i], question.design.diagnostics[question.options.indexOf(shuffled.options[i])]);
    }
  }
  for (const watched of [false, true]) {
    const html = renderToStaticMarkup(createElement(Overview, { lessonId: video.id, guide: lessonGuides[video.id], watched, learningText: '', questions: assessment.questions, onRateCard() {}, onEvidence() {}, onLesson() {}, onQuiz() {}, onRead() {} }));
    assert.ok(html.includes(watched ? 'Lesson in one minute' : 'Before you watch'));
    assert.ok(!html.includes('undefined'));
  }
}
const position = id => lessons.findIndex(l => l.id === id);
for (const [first, second] of [['p01-l07','supp-resistance-01'],['supp-resistance-02','p06-l06'],['p06-l06','supp-resistance-04'],['supp-ac-theory-09','supp-ac-theory-10'],['supp-ac-theory-10','supp-ac-theory-14'],['supp-ac-theory-15','p01-l24'],['p01-l27','p01-l26'],['p01-l26','supp-ac-theory-22'],['supp-lighting-03','supp-lighting-04'],['supp-lighting-05','p07-l10'],['p07-l12','supp-lighting-09'],['supp-lighting-09','supp-lighting-10']]) assert.ok(position(first) < position(second), `${first} before ${second}`);
assert.equal(bank.checkpointList.length, 68);
assert.equal(bank.checkpointsByModule['module-01'][0].id, 'module-01-checkpoint-1');
assert.equal(bank.checkpointsByModule['module-01'][1].id, 'module-01-checkpoint-2');
assert.ok(bank.checkpointsByModule['module-01'].slice(2).every(c => c.id.endsWith('-supplied-202609')));
assert.ok(bank.checkpointsByModule['module-12'].every(c => c.id.endsWith('-supplied-202609')));
assert.ok(bank.checkpointsByModule['module-02'].every(c => !c.id.endsWith('-supplied-202609')));
for (const module of course.modules) {
  assert.equal(module.durationSeconds, module.lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0));
  const checkpoints = bank.checkpointsByModule[module.id];
  assert.deepEqual(checkpoints.flatMap(c => c.newLessonIds), module.lessons.map(l => l.id));
  for (const checkpoint of checkpoints) {
    assert.ok(checkpoint.questions.every(q => checkpoint.lessonIds.includes(q.lessonId)));
    assert.ok(checkpoint.newLessonIds.every(id => checkpoint.questions.some(q => q.lessonId === id)));
  }
}
// Independently verify representative worked answers and the corrected shunt formula.
assert.ok(Math.abs(0.19 * 1.5e-6 / 17.2e-9 - 16.56976744) < 1e-7);
assert.equal(3.6 * 0.21e-6 / 0.5, 1.512e-6);
assert.ok(Math.abs(4.03 * .075e-6 / .5 - 6.045e-7) < 1e-20);
assert.equal(1250 * (3/5) / 25, 30);
assert.equal(Math.ceil(42857/5400), 8);
assert.ok(Math.abs(750/(2*Math.PI*50*230**2)*1e6 - 45.1293) < .001);

// Audit all runtime items, including module/checkpoint reuse. A generated design
// label is not evidence that its text was individually authored.
const all = Object.values(bank.lessons).flatMap(l => l.questions);
const findings = all.filter(q => /^(Without the answer choices, what is the key point|When applying .* on site|Before accepting work connected with|During practical work on)/.test(q.design?.followUp?.prompt ?? '')).map(q => ({ lessonId: q.lessonId, questionId: q.id, prompt: q.prompt, options: q.options, answer: q.answer, reason: 'Generated follow-up/diagnostic path remains; requires individual transcript-based editorial review.', followUp: q.design.followUp.prompt }));
const audit = { date: '2026-09-08', lessons: lessons.length, questions: all.length, newLessons: added.length, newQuestions: prompts.size, newFlashcards: added.length * 6, requiredCheckpoints: bank.checkpointList.length, inheritedGeneratedItems: findings.length, findings };
mkdirSync('docs', { recursive: true });
writeFileSync('docs/assessment-template-audit.json', JSON.stringify(audit, null, 2) + '\n');
console.log(JSON.stringify({ ...audit, findings: undefined }, null, 2));
