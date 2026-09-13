import assert from 'node:assert/strict';
import bank from '../app/assessment-bank.json' with { type: 'json' };

assert.equal(bank.schemaVersion, 1);
assert.equal(bank.sources.length, 2);
assert.ok(bank.sources.every(source => /^[a-f0-9]{64}$/.test(source.sha256)));
assert.equal(bank.questions.length, bank.counts.C2 + bank.counts.C1);
assert.equal(new Set(bank.questions.map(question => question.id)).size, bank.questions.length);
for (const question of bank.questions) {
  assert.ok(question.prompt && question.answer, question.id);
  assert.ok(question.marks > 0 && question.expectedMinutes > 0, question.id);
  assert.ok(question.markingPoints.length, question.id);
  assert.ok(question.competencyIds.length && question.conceptIds.length, question.id);
  assert.ok(question.sourceLessonIds.length, question.id);
  assert.ok(['kenya-verified','bs7671-technical-baseline','check-kenyan-requirement'].includes(question.kenyaStatus), question.id);
  if (question.format === 'mcq') {
    assert.equal(question.options.length, 4, question.id);
    assert.ok(question.options.some(option => option.id === question.correctOption), question.id);
  }
}
const count = (predicate) => bank.questions.filter(predicate).length;
assert.equal(count(question => question.pathway === 'C2' && question.sectionId.match(/^C2-\d{2}$/) && question.format === 'mcq'), 90);
assert.equal(count(question => question.pathway === 'C2' && question.sectionId.match(/^C2-\d{2}$/) && question.id.includes('-S')), 18);
assert.equal(count(question => question.pathway === 'C2' && question.sectionId === 'C2-ORAL'), 60);
assert.equal(count(question => question.pathway === 'C2' && question.sectionId === 'C2-DIAGRAM'), 12);
assert.equal(count(question => question.pathway === 'C2' && question.sectionId === 'C2-RAPID'), 20);
assert.equal(count(question => question.pathway === 'C1' && question.sectionId.match(/^C1-\d{2}$/) && question.format === 'mcq'), 100);
assert.equal(count(question => question.pathway === 'C1' && question.sectionId.match(/^C1-\d{2}$/) && question.id.includes('-S')), 20);
assert.equal(count(question => question.pathway === 'C1' && question.sectionId === 'C1-R'), 35);
assert.equal(count(question => question.pathway === 'C1' && question.sectionId === 'C1-ORAL'), 50);
console.log(`PASS: ${bank.questions.length} canonical C2/C1 questions, answers, marks and source fingerprints validated.`);
