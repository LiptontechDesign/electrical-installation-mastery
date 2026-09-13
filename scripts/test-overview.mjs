import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

await mkdir('work/overview-tests', { recursive: true });
await build({ entryPoints: ['app/overview-data.ts','app/overview-integrity.ts','app/source-references.ts','app/course-curriculum.ts','app/learning-sections.ts','app/knowledge-graph.ts','app/overview-navigation.ts'], outdir: 'work/overview-tests', bundle: true, platform: 'node', format: 'esm' });
const { overviewData } = await import('../work/overview-tests/overview-data.js');
const { validateOverview, buildOverviewBacklinks } = await import('../work/overview-tests/overview-integrity.js');
const { resolveSourceLink } = await import('../work/overview-tests/source-references.js');
const { default: course } = await import('../work/overview-tests/course-curriculum.js');
const { learningSections } = await import('../work/overview-tests/learning-sections.js');
const { electricalTerms, matchingTerms, lessonKnowledge, prerequisiteIdsByLesson } = await import('../work/overview-tests/knowledge-graph.js');
const { overviewPages, overviewPageLabels, authorityLabels, kenyaStatusLabels, moveSelection } = await import('../work/overview-tests/overview-navigation.js');
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
assert.ok(electricalTerms.length >= old.electricalTerms.length, 'Canonical vocabulary may grow but must not shrink');
for (const record of old.electricalTerms) {
  const preserved = electricalTerms.find(item => item.term === record.term);
  assert.ok(preserved, `Preserve vocabulary term ${record.term}`);
  for (const key of Object.keys(record)) assert.deepEqual(preserved[key], record[key], `Preserve ${record.term}.${key}`);
}
for (const term of overviewData.terms) {
  assert.equal(electricalTerms.find(item => item.id === term.id).definition, term.standardsMeaning);
  assert.ok(matchingTerms(term.term).some(item => item.id === term.id));
}
for (const module of course.modules) {
  for (const [index, lesson] of module.lessons.entries()) {
    const expected = index > 0 ? [module.lessons[index - 1].id] : [];
    assert.deepEqual(prerequisiteIdsByLesson.get(lesson.id), expected, `${lesson.id} structural prerequisite IDs`);
    assert.deepEqual(lessonKnowledge[lesson.id].prerequisites, expected, `${lesson.id} knowledge prerequisite IDs`);
  }
}
assert.deepEqual(overviewPages, ['system-model','definitions','relationships','engineering-rules','application','verification','common-confusions','sources']);
assert.equal(overviewPageLabels['system-model'], 'System Model');
assert.equal(overviewPageLabels['engineering-rules'], 'Engineering Rules');
assert.equal(overviewPageLabels['common-confusions'], 'Common Confusions');
assert.equal(authorityLabels['formal-definition-verified'], 'FORMAL DEFINITION — VERIFIED');
assert.equal(authorityLabels['current-standards-meaning'], 'CURRENT STANDARDS MEANING');
assert.equal(kenyaStatusLabels['kenya-verified'], 'KENYA VERIFIED');
assert.equal(kenyaStatusLabels['bs7671-technical-baseline'], 'CURRENT BS 7671 TECHNICAL BASELINE');
assert.equal(moveSelection(0, 8, 'previous'), 0);
assert.equal(moveSelection(0, 8, 'next'), 1);
assert.equal(moveSelection(7, 8, 'next'), 7);
assert.equal(moveSelection(3, 8, 'first'), 0);
assert.equal(moveSelection(3, 8, 'last'), 7);

const c201 = overviewData.sections.find(section => section.id === 'c2-01-electrical-foundations');
assert.ok(c201, 'C2-01 Overview exists');
assert.equal(c201.status, 'reviewed');
assert.equal(c201.stageId, 'C2-01');
assert.equal(c201.moduleId, 'module-01');
assert.equal(c201.learningSectionIds.length, 14, 'C2-01 covers every neutral Module 01 learning section');
assert.deepEqual(c201.learningSectionIds, learningSections.filter(section => section.moduleId === 'module-01').map(section => section.id));
for (const page of overviewPages) assert.ok(c201.pages[page].length > 0, `C2-01 page ${page} is authored`);
for (const requiredTerm of ['glossary-voltage','glossary-current','glossary-resistance','glossary-power','energy','direct-current','alternating-current','frequency','power-factor','connected-load','glossary-maximum-demand','glossary-diversity','utilization-factor','coincidence-factor','ib']) {
  assert.ok(c201.termIds.includes(requiredTerm), `C2-01 includes ${requiredTerm}`);
}
for (const requiredFormula of ['ohms-law','electrical-power','energy-from-power','frequency-period','single-phase-ac-power','single-phase-design-current','coincidence-diversity']) {
  assert.ok(overviewData.formulas.some(formula => formula.id === requiredFormula), `C2-01 includes ${requiredFormula}`);
}
assert.ok(c201.coverage.some(item => item.competency.includes('AC, DC')));
assert.ok(c201.coverage.some(item => item.competency.includes('diversity factor')));
assert.ok(c201.coverage.some(item => item.competency.includes('power, current and voltage')));
const epra = overviewData.sources.find(source => source.id === 'epra-c2-competencies');
assert.equal(resolveSourceLink(epra).kind, 'external');
const demandAppendix = overviewData.sources.find(source => source.id === 'osg-demand-diversity');
assert.equal(resolveSourceLink(demandAppendix).kind, 'unavailable', 'Unverified Appendix A reader mapping stays bibliography-only');

const c202 = overviewData.sections.find(section => section.id === 'c2-02-installation-architecture-drawings-safety');
assert.ok(c202, 'C2-02 Overview exists');
assert.equal(c202.status, 'reviewed');
assert.equal(c202.stageId, 'C2-02');
assert.equal(c202.moduleId, 'module-02');
assert.deepEqual(c202.learningSectionIds, learningSections.filter(section => section.moduleId === 'module-02').map(section => section.id));
assert.equal(c202.learningSectionIds.length, 3, 'C2-02 covers all three neutral Module 02 learning sections');
assert.deepEqual(c202.prerequisiteSectionIds, ['c2-01-electrical-foundations']);
for (const page of overviewPages) assert.ok(c202.pages[page].length > 0, `C2-02 page ${page} is authored`);
for (const requiredTerm of ['service-cut-out','electricity-meter','main-switch','consumer-unit','final-circuit','glossary-single-line-diagram-sld','riser-diagram','block-diagram','glossary-circuit-schedule','glossary-isolation','functional-switching','emergency-switching','switching-for-mechanical-maintenance','safe-isolation','lock-off','voltage-indicator','cpr','aed','concealed-services','cable-detector','cat-and-genny']) {
  assert.ok(c202.termIds.includes(requiredTerm), `C2-02 includes ${requiredTerm}`);
}
assert.ok(c202.coverage.some(item => item.competency.includes('safe isolation')));
assert.ok(c202.coverage.some(item => item.competency.includes('first aid')));
for (const id of ['osg-electrical-supply','osg-isolation-switching','osg-safe-working']) {
  assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === id)).kind, 'unavailable', `${id} remains bibliography-only until exact reader mapping is verified`);
}
assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === 'st-john-cpr')).kind, 'external');
assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === 'st-john-aed')).kind, 'external');

const c203 = overviewData.sections.find(section => section.id === 'c2-03-single-phase-wiring-accessories');
assert.ok(c203, 'C2-03 Overview exists');
assert.equal(c203.status, 'reviewed');
assert.equal(c203.stageId, 'C2-03');
assert.equal(c203.moduleId, 'module-03');
assert.deepEqual(c203.learningSectionIds, learningSections.filter(section => section.moduleId === 'module-03').map(section => section.id));
assert.equal(c203.learningSectionIds.length, 6, 'C2-03 covers all six neutral Module 03 learning sections');
assert.deepEqual(c203.prerequisiteSectionIds, ['c2-02-installation-architecture-drawings-safety']);
for (const page of overviewPages) assert.ok(c203.pages[page].length > 0, `C2-03 page ${page} is authored`);
for (const requiredTerm of ['conductor-preparation','termination','cpc','polarity','one-way-switching','two-way-switching','intermediate-switching','switched-line','radial-circuit','ring-final-circuit','spur','ring-integrity','socket-outlet','fused-connection-unit','first-fix','second-fix','luminaire','led','ip-and-ik-ratings']) {
  assert.ok(c203.termIds.includes(requiredTerm), `C2-03 includes ${requiredTerm}`);
}
assert.ok(c203.coverage.some(item => item.competency.includes('One-way, two-way and intermediate')));
assert.ok(c203.coverage.some(item => item.competency.includes('Radial and ring')));
for (const id of ['osg-identification-notices','osg-final-circuits','osg-bath-shower']) {
  assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === id)).kind, 'unavailable', `${id} remains bibliography-only until exact reader mapping is verified`);
}

const mapped = overviewData.sources.find(source => source.id === 'osg-safe-testing');
assert.equal(resolveSourceLink(mapped).reading.pdf, 125);
assert.equal(resolveSourceLink(mapped).reading.printed, '123');
assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, mapping: undefined}).kind, 'unavailable');
assert.equal(resolveSourceLink({...mapped, mapping: undefined}).kind, 'unavailable');
for (const pdfPage of [0, -1, 1.5, 259, NaN, Infinity, '125']) assert.notEqual(resolveSourceLink({...mapped, pdfPage}).kind, 'reader');
for (const url of ['javascript:alert(1)', 'data:text/html,x', 'file:///tmp/a', 'https://user:password@example.com']) assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, url}).kind, 'unavailable');
assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, url:'https://electrical.theiet.org/'}).kind, 'external');

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
assert.deepEqual(new Set(buildOverviewBacklinks(fixture).sources['osg-safe-testing'].sectionIds), new Set(['c2-01-electrical-foundations','foundation-fixture']));
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
rejects(data => data.sections.find(section => section.id === 'foundation-fixture').prerequisiteSectionIds = ['foundation-fixture'], /cyclic prerequisite/);
rejects(data => { const source = data.sources.find(item => item.id === 'osg-safe-testing'); source.mapping = undefined; }, /unverified PDF mapping/);
rejects(data => { const source = data.sources.find(item => item.id === 'osg-safe-testing'); source.pdfPage = 999; }, /unverified PDF mapping/);
rejects(data => data.sources[0].url = 'javascript:alert(1)', /unsafe source URL/);
console.log(`Overview verified: ${overviewData.terms.length} canonical records, C2-01 through C2-03 complete, structural prerequisites, source mapping discipline and negative integrity fixtures.`);
