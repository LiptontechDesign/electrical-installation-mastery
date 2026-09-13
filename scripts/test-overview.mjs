import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

await mkdir('work/overview-tests', { recursive: true });
await build({ entryPoints: ['app/overview-data.ts','app/overview-integrity.ts','app/source-references.ts','app/course-curriculum.ts','app/learning-sections.ts','app/knowledge-graph.ts'], outdir: 'work/overview-tests', bundle: true, platform: 'node', format: 'esm' });
const { overviewData } = await import('../work/overview-tests/overview-data.js');
const { validateOverview, buildOverviewBacklinks } = await import('../work/overview-tests/overview-integrity.js');
const { resolveSourceLink } = await import('../work/overview-tests/source-references.js');
const { default: course } = await import('../work/overview-tests/course-curriculum.js');
const { learningSections } = await import('../work/overview-tests/learning-sections.js');
const { electricalTerms, matchingTerms, lessonKnowledge, prerequisiteIdsByLesson } = await import('../work/overview-tests/knowledge-graph.js');
const context = {
  modules: course.modules.map(module => ({ id: module.id, lessonIds: module.lessons.map(lesson => lesson.id) })),
  learningSections, stageIds: [...Array.from({length:9}, (_, i) => `C2-${String(i+1).padStart(2,'0')}`), ...Array.from({length:10}, (_, i) => `C1-${String(i+1).padStart(2,'0')}`)],
};
assert.deepEqual(validateOverview(overviewData, context), []);
assert.deepEqual(validateOverview(JSON.parse(JSON.stringify(overviewData)), context), [], 'JSON transport preserves validity');
assert.equal(electricalTerms.length, overviewData.terms.length);
const baseline = execFileSync('git', ['show','4b92f3691781d7738ef48e415fb9b8efeb23539f:app/knowledge-graph.ts'], {encoding:'utf8'});
const oldBuild = await build({stdin:{contents:baseline,resolveDir:resolve('app'),loader:'ts'},bundle:true,platform:'node',format:'esm',write:false});
const old = await import(`data:text/javascript;base64,${Buffer.from(oldBuild.outputFiles[0].text).toString('base64')}`);
assert.equal(electricalTerms.length, old.electricalTerms.length, 'No vocabulary lost');
for (const [index, record] of old.electricalTerms.entries()) {
  for (const key of Object.keys(record)) assert.deepEqual(electricalTerms[index][key], record[key], `Preserve ${record.term}.${key}`);
}
for (const term of overviewData.terms) {
  assert.equal(electricalTerms.find(item => item.id === term.id).definition, term.standardsMeaning);
  assert.ok(matchingTerms(term.term).some(item => item.id === term.id));
}
// Structural prerequisites must follow the canonical licensing order, not learner-facing prose.
for (const module of course.modules) {
  for (const [index, lesson] of module.lessons.entries()) {
    const expected = index > 0 ? [module.lessons[index - 1].id] : [];
    assert.deepEqual(prerequisiteIdsByLesson.get(lesson.id), expected, `${lesson.id} structural prerequisite IDs`);
    assert.deepEqual(lessonKnowledge[lesson.id].prerequisites, expected, `${lesson.id} knowledge prerequisite IDs`);
  }
}
const mapped = overviewData.sources.find(source => source.id === 'osg-safe-testing');
assert.equal(resolveSourceLink(mapped).reading.pdf, 125);
assert.equal(resolveSourceLink(mapped).reading.printed, '123');
assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, mapping: undefined}).kind, 'unavailable');
assert.equal(resolveSourceLink({...mapped, mapping: undefined}).kind, 'unavailable');
for (const pdfPage of [0, -1, 1.5, 259, NaN, Infinity, '125']) assert.notEqual(resolveSourceLink({...mapped, pdfPage}).kind, 'reader');
for (const url of ['javascript:alert(1)', 'data:text/html,x', 'file:///tmp/a', 'https://user:password@example.com']) assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, url}).kind, 'unavailable');
assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, url:'https://electrical.theiet.org/'}).kind, 'external');

// Representative fixture exercises relationships and all page slots without publishing stage content.
const fixture = structuredClone(overviewData);
fixture.sections.push({
  id: 'foundation-fixture', stageId: 'C2-01', moduleId: 'module-01',
  learningSectionIds: ['module-01-section-1'], title: 'Foundation fixture', status: 'fixture',
  lessonIds: ['p01-l01'], termIds: ['safe-isolation', 'continuity'], sourceIds: ['osg-safe-testing'],
  relatedSectionIds: [], prerequisiteSectionIds: [], coverage: [],
  pages: Object.fromEntries(['system-model','definitions','relationships','engineering-rules','application','verification','common-confusions','sources'].map(id => [id, []])),
});
fixture.terms.find(term => term.id === 'safe-isolation').relatedTermIds = ['continuity'];
assert.deepEqual(validateOverview(fixture, context), []);
assert.deepEqual(buildOverviewBacklinks(fixture).terms.continuity, {termIds:['safe-isolation'],sectionIds:['foundation-fixture']});
assert.deepEqual(buildOverviewBacklinks(fixture).sources['osg-safe-testing'].sectionIds, ['foundation-fixture']);
const rejects = (change, pattern) => {
  const bad = structuredClone(fixture); change(bad);
  assert.match(validateOverview(bad, context).join('\n'), pattern);
};
rejects(data => data.terms.push(data.terms[0]), /duplicate ID/);
rejects(data => data.terms[0].sourceIds = ['missing'], /unknown source/);
rejects(data => data.terms[0].relatedTermIds = ['missing'], /unknown term/);
rejects(data => data.terms[0].formulaIds = ['missing'], /unknown formula/);
rejects(data => data.terms[0].authority = 'formal-definition-verified', /unsupported formal definition/);
rejects(data => data.terms[0].kenyaStatus = 'kenya-verified', /missing Kenyan authority/);
rejects(data => data.sections[0].lessonIds = ['missing'], /unknown lesson/);
rejects(data => data.sections[0].stageId = 'C2-99', /unknown stage/);
rejects(data => data.sections[0].learningSectionIds = ['module-02-section-1'], /wrong module/);
rejects(data => delete data.sections[0].pages.sources, /missing page sources/);
rejects(data => data.sections[0].prerequisiteSectionIds = ['foundation-fixture'], /cyclic prerequisite/);
rejects(data => data.sources[1].mapping = undefined, /unverified PDF mapping/);
rejects(data => data.sources[1].pdfPage = 999, /unverified PDF mapping/);
rejects(data => data.sources[0].url = 'javascript:alert(1)', /unsafe source URL/);
console.log(`Overview foundation verified: ${overviewData.terms.length} canonical records, structural lesson prerequisites, exact/unknown source mapping, backlinks and negative integrity fixtures.`);
