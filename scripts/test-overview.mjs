import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

await mkdir('work/overview-tests', { recursive: true });
await build({
  entryPoints: ['app/overview-data.ts','app/overview-integrity.ts','app/source-references.ts','app/course-curriculum.ts','app/learning-sections.ts','app/knowledge-graph.ts','app/overview-navigation.ts'],
  outdir: 'work/overview-tests', bundle: true, platform: 'node', format: 'esm',
});
const { overviewData } = await import('../work/overview-tests/overview-data.js');
const { validateOverview, buildOverviewBacklinks } = await import('../work/overview-tests/overview-integrity.js');
const { resolveSourceLink } = await import('../work/overview-tests/source-references.js');
const { default: course } = await import('../work/overview-tests/course-curriculum.js');
const { learningSections } = await import('../work/overview-tests/learning-sections.js');
const { electricalTerms, matchingTerms, lessonKnowledge, prerequisiteIdsByLesson } = await import('../work/overview-tests/knowledge-graph.js');
const { overviewPages, overviewPageLabels, authorityLabels, kenyaStatusLabels, moveSelection } = await import('../work/overview-tests/overview-navigation.js');

const context = {
  modules: course.modules.map(module => ({ id: module.id, lessonIds: module.lessons.map(lesson => lesson.id) })),
  learningSections,
  stageIds: [...Array.from({length:9}, (_, i) => `C2-${String(i+1).padStart(2,'0')}`), ...Array.from({length:10}, (_, i) => `C1-${String(i+1).padStart(2,'0')}`)],
};
assert.deepEqual(validateOverview(overviewData, context), []);
assert.deepEqual(validateOverview(JSON.parse(JSON.stringify(overviewData)), context), [], 'JSON transport preserves validity');
assert.equal(electricalTerms.length, overviewData.terms.length);

const baseline = execFileSync('git', ['show','4b92f3691781d7738ef48e415fb9b8efeb23539f:app/knowledge-graph.ts'], {encoding:'utf8'});
const oldBuild = await build({stdin:{contents:baseline,resolveDir:resolve('app'),loader:'ts'},bundle:true,platform:'node',format:'esm',write:false});
const old = await import(`data:text/javascript;base64,${Buffer.from(oldBuild.outputFiles[0].text).toString('base64')}`);
assert.ok(electricalTerms.length >= old.electricalTerms.length, 'Canonical vocabulary may grow but must not shrink');
const stableLegacyKeys = ['id','term','aliases','category','contrast','unit','formula','formulaTex','formulaNote'];
for (const record of old.electricalTerms) {
  const preserved = electricalTerms.find(item => item.term === record.term);
  assert.ok(preserved, `Preserve vocabulary term ${record.term}`);
  for (const key of stableLegacyKeys) if (key in record) assert.deepEqual(preserved[key], record[key], `Preserve ${record.term}.${key}`);
}
for (const term of overviewData.terms) {
  assert.equal(term.definition, term.standardsMeaning, `${term.id} compatibility definition tracks canonical standardsMeaning`);
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

const published = [
  {
    id:'c2-01-electrical-foundations', stage:'C2-01', module:'module-01', count:14, prerequisite:null,
    terms:['glossary-voltage','glossary-current','glossary-resistance','glossary-power','energy','direct-current','alternating-current','frequency','power-factor','connected-load','glossary-maximum-demand','glossary-diversity','utilization-factor','coincidence-factor','ib'],
    formulas:['ohms-law','electrical-power','energy-from-power','frequency-period','single-phase-ac-power','single-phase-design-current','coincidence-diversity'],
  },
  {
    id:'c2-02-installation-architecture-drawings-safety', stage:'C2-02', module:'module-02', count:3, prerequisite:'c2-01-electrical-foundations',
    terms:['service-cut-out','electricity-meter','main-switch','consumer-unit','final-circuit','glossary-single-line-diagram-sld','riser-diagram','block-diagram','glossary-circuit-schedule','glossary-isolation','functional-switching','emergency-switching','switching-for-mechanical-maintenance','safe-isolation','lock-off','voltage-indicator','cpr','aed','concealed-services','cable-detector','cat-and-genny'], formulas:[],
  },
  {
    id:'c2-03-single-phase-wiring-accessories', stage:'C2-03', module:'module-03', count:6, prerequisite:'c2-02-installation-architecture-drawings-safety',
    terms:['conductor-preparation','termination','cpc','polarity','one-way-switching','two-way-switching','intermediate-switching','switched-line','radial-circuit','ring-final-circuit','spur','ring-integrity','socket-outlet','fused-connection-unit','first-fix','second-fix','luminaire','led','ip-and-ik-ratings'], formulas:[],
  },
  {
    id:'c2-04-cable-systems-containment-installation-methods', stage:'C2-04', module:'module-04', count:4, prerequisite:'c2-03-single-phase-wiring-accessories',
    terms:['cable-system','insulation','outer-sheath','armour','swa','swa-gland','conduit','trunking','cable-tray','installation-method','iz','correction-factor','ambient-temperature-factor','grouping-factor','thermal-insulation-factor','bend-radius','cable-support','segregation','fire-stopping','voltage-drop'], formulas:['corrected-current-capacity'],
  },
  {
    id:'c2-05-faults-protective-devices-earthing-ads', stage:'C2-05', module:'module-05', count:6, prerequisite:'c2-04-cable-systems-containment-installation-methods',
    terms:['overload-current','short-circuit','earth-fault','fuse','mcb','mccb','glossary-breaking-capacity','rcd','rccb','rcbo','rcd-types','basic-protection','fault-protection','additional-protection','ads','cpc','earthing-conductor','protective-bonding-conductor','met','exposed-conductive-part','extraneous-conductive-part','earth-electrode','tn-s','tn-c-s','tt','it-earthing','zs','ze','r1-r2','selectivity','transient-overvoltage','spd','afdd'], formulas:['earth-fault-loop','earth-fault-current'],
  },
  {
    id:'c2-06-single-phase-circuit-design', stage:'C2-06', module:'module-06', count:4, prerequisite:'c2-05-faults-protective-devices-earthing-ads',
    terms:['connected-load','glossary-maximum-demand','glossary-diversity','power-factor','design-assumptions','ib','in','iz','tabulated-current-capacity','installation-method','correction-factor','voltage-drop','fault-thermal-withstand','cpc','ads','zs','pfc','glossary-breaking-capacity','selectivity','design-evidence'],
    formulas:['overload-coordination','required-tabulated-capacity','single-phase-voltage-drop','voltage-drop-percent','adiabatic-cpc'],
  },
];
for (const spec of published) {
  const section = overviewData.sections.find(item => item.id === spec.id);
  assert.ok(section, `${spec.stage} Overview exists`);
  assert.equal(section.status, 'reviewed');
  assert.equal(section.stageId, spec.stage);
  assert.equal(section.moduleId, spec.module);
  assert.deepEqual(section.learningSectionIds, learningSections.filter(item => item.moduleId === spec.module).map(item => item.id));
  assert.equal(section.learningSectionIds.length, spec.count, `${spec.stage} covers every neutral ${spec.module} learning section`);
  assert.deepEqual(section.prerequisiteSectionIds, spec.prerequisite ? [spec.prerequisite] : []);
  for (const page of overviewPages) assert.ok(section.pages[page].length > 0, `${spec.stage} page ${page} is authored`);
  for (const id of spec.terms) assert.ok(section.termIds.includes(id), `${spec.stage} includes ${id}`);
  for (const id of spec.formulas) assert.ok(overviewData.formulas.some(formula => formula.id === id), `${spec.stage} includes formula ${id}`);
}

const c206 = overviewData.sections.find(item => item.id === 'c2-06-single-phase-circuit-design');
assert.ok(c206.coverage.some(item => item.competency.includes('single-phase design current')));
assert.ok(c206.coverage.some(item => item.competency.includes('maximum demand')));
assert.ok(c206.coverage.some(item => item.competency.includes('voltage-drop')));

const epra = overviewData.sources.find(source => source.id === 'epra-c2-competencies');
assert.equal(resolveSourceLink(epra).kind, 'external');
assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === 'st-john-cpr')).kind, 'external');
assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === 'st-john-aed')).kind, 'external');
const bibliographyOnly = [
  'osg-demand-diversity','osg-electrical-supply','osg-isolation-switching','osg-safe-working','osg-identification-notices','osg-final-circuits','osg-bath-shower',
  'osg-cable-types','osg-cable-supports','osg-conduit-trunking','osg-current-capacity-voltage-drop','osg-protection','osg-earthing-bonding','osg-rcd-operation','osg-zs-appendix',
];
for (const id of bibliographyOnly) assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === id)).kind, 'unavailable', `${id} remains bibliography-only until exact reader mapping is verified`);
const mapped = overviewData.sources.find(source => source.id === 'osg-safe-testing');
assert.equal(resolveSourceLink(mapped).reading.pdf, 125);
assert.equal(resolveSourceLink(mapped).reading.printed, '123');
assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, mapping: undefined}).kind, 'unavailable');
assert.equal(resolveSourceLink({...mapped, mapping: undefined}).kind, 'unavailable');
for (const pdfPage of [0, -1, 1.5, 259, NaN, Infinity, '125']) assert.notEqual(resolveSourceLink({...mapped, pdfPage}).kind, 'reader');
for (const url of ['javascript:alert(1)', 'data:text/html,x', 'file:///tmp/a', 'https://user:password@example.com']) assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, url}).kind, 'unavailable');

const fixture = structuredClone(overviewData);
fixture.sections.push({
  id: 'foundation-fixture', stageId: 'C2-01', moduleId: 'module-01', learningSectionIds: ['module-01-section-1'],
  title: 'Foundation fixture', status: 'fixture', lessonIds: ['p01-l01'], termIds: ['safe-isolation','continuity'], sourceIds: ['osg-safe-testing'],
  relatedSectionIds: [], prerequisiteSectionIds: [], coverage: [], pages: Object.fromEntries(overviewPages.map(id => [id, []])),
});
fixture.terms.find(term => term.id === 'safe-isolation').relatedTermIds = ['continuity'];
assert.deepEqual(validateOverview(fixture, context), []);
assert.deepEqual(buildOverviewBacklinks(fixture).terms.continuity, {termIds:['safe-isolation'],sectionIds:['foundation-fixture']});
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
rejects(data => delete data.sections[0].pages.sources, /missing page sources/);
rejects(data => data.sections.find(section => section.id === 'foundation-fixture').prerequisiteSectionIds = ['foundation-fixture'], /cyclic prerequisite/);
rejects(data => { const source = data.sources.find(item => item.id === 'osg-safe-testing'); source.mapping = undefined; }, /unverified PDF mapping/);
rejects(data => data.sources[0].url = 'javascript:alert(1)', /unsafe source URL/);
console.log(`Overview verified: ${overviewData.terms.length} canonical records, C2-01 through C2-06 complete, canonical definition sync, prerequisites and source mapping discipline.`);
