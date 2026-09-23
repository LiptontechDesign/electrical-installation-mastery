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
  modules: course.modules.map(courseModule => ({ id: courseModule.id, lessonIds: courseModule.lessons.map(lesson => lesson.id) })),
  learningSections,
  stageIds: [...Array.from({length:9}, (_, i) => `C2-${String(i+1).padStart(2,'0')}`), ...Array.from({length:10}, (_, i) => `C1-${String(i+1).padStart(2,'0')}`)],
};
assert.deepEqual(validateOverview(overviewData, context), []);
assert.deepEqual(validateOverview(JSON.parse(JSON.stringify(overviewData)), context), [], 'JSON transport preserves validity');
assert.equal(electricalTerms.length, overviewData.terms.length);
for (const [termId, lessonIds] of Object.entries({
  afdd: ['course-lIit5k8QVj8'],
  selectivity: ['p05-l14', 'course-V6WR_TBf1AU'],
  'glossary-discrimination-selectivity': ['p05-l14', 'course-V6WR_TBf1AU'],
  'voltage-drop': ['p06-l07', 'p06-l08', 'p06-l09'],
})) {
  const term = overviewData.terms.find(item => item.id === termId);
  for (const lessonId of lessonIds) assert.ok(term?.lessonIds.includes(lessonId), `${termId} provenance includes ${lessonId}`);
}

// Preserve pre-refactor vocabulary identity while allowing canonical meanings to improve.
const baseline = execFileSync('git', ['show','4b92f3691781d7738ef48e415fb9b8efeb23539f:app/knowledge-graph.ts'], {encoding:'utf8'});
const oldBuild = await build({stdin:{contents:baseline,resolveDir:resolve('app'),loader:'ts'},bundle:true,platform:'node',format:'esm',write:false});
const old = await import(`data:text/javascript;base64,${Buffer.from(oldBuild.outputFiles[0].text).toString('base64')}`);
assert.ok(electricalTerms.length >= old.electricalTerms.length, 'Canonical vocabulary may grow but must not shrink');
for (const record of old.electricalTerms) {
  const preserved = electricalTerms.find(item => item.term === record.term);
  assert.ok(preserved, `Preserve ${record.term}`);
  for (const key of ['id','term','aliases','category','contrast','unit','formula','formulaTex','formulaNote']) if (key in record) assert.deepEqual(preserved[key], record[key]);
}
for (const term of overviewData.terms) {
  assert.equal(term.definition, term.standardsMeaning, `${term.id} compatibility definition follows canonical standardsMeaning`);
  assert.equal(electricalTerms.find(item => item.id === term.id).definition, term.standardsMeaning);
  assert.ok(matchingTerms(term.term).some(item => item.id === term.id));
}

// Structural lesson prerequisites remain ID-based, never reconstructed from learner prose.
for (const courseModule of course.modules) {
  for (const [index, lesson] of courseModule.lessons.entries()) {
    const expected = index > 0 ? [courseModule.lessons[index - 1].id] : [];
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

const published = [
  ['c2-01-electrical-foundations','C2-01','module-01',12,null],
  ['c2-02-installation-architecture-drawings-safety','C2-02','module-02',6,'c2-01-electrical-foundations'],
  ['c2-03-single-phase-wiring-accessories','C2-03','module-03',7,'c2-02-installation-architecture-drawings-safety'],
  ['c2-04-cable-systems-containment-installation-methods','C2-04','module-04',3,'c2-03-single-phase-wiring-accessories'],
  ['c2-05-faults-protective-devices-earthing-ads','C2-05','module-05',6,'c2-04-cable-systems-containment-installation-methods'],
  ['c2-06-single-phase-circuit-design','C2-06','module-06',4,'c2-05-faults-protective-devices-earthing-ads'],
  ['c2-07-consumer-units-complete-installation','C2-07','c2-boards',1,'c2-06-single-phase-circuit-design'],
  ['c2-08-inspection-testing-commissioning','C2-08','module-08',6,'c2-07-consumer-units-complete-installation'],
  ['c2-09-fault-finding','C2-09','module-09',3,'c2-08-inspection-testing-commissioning'],
  ['c1-01-three-phase-fundamentals','C1-01','c1-fundamentals',3,'c2-09-fault-finding'],
  ['c1-02-three-phase-power','C1-02','c1-power',1,'c1-01-three-phase-fundamentals'],
  ['c1-03-three-phase-distribution','C1-03','c1-distribution',2,'c1-02-three-phase-power'],
  ['c1-04-three-phase-design','C1-04','c1-design',2,'c1-03-three-phase-distribution'],
  ['c1-05-small-commercial-earthing','C1-05','c1-earthing',2,'c1-04-three-phase-design'],
  ['c1-06-power-factor-correction','C1-06','c1-pfc',1,'c1-05-small-commercial-earthing'],
  ['c1-07-motor-principles-nameplates','C1-07','c1-motors',1,'c1-06-power-factor-correction'],
  ['c1-08-motor-starting-control-protection','C1-08','module-07',2,'c1-07-motor-principles-nameplates'],
  ['c1-09-three-phase-testing-periodic','C1-09','c1-testing',2,'c1-08-motor-starting-control-protection'],
  ['c1-10-three-phase-fault-diagnosis','C1-10','c1-faults',1,'c1-09-three-phase-testing-periodic'],
];
for (const [id, stageId, moduleId, count, prerequisite] of published) {
  const section = overviewData.sections.find(item => item.id === id);
  assert.ok(section, `${stageId} exists`);
  assert.equal(section.status, 'reviewed');
  assert.equal(section.stageId, stageId);
  assert.equal(section.moduleId, moduleId);
  assert.deepEqual(section.learningSectionIds, learningSections.filter(item => item.moduleId === moduleId).map(item => item.id));
  assert.equal(section.learningSectionIds.length, count, `${stageId} covers every neutral learning section`);
  assert.deepEqual(section.prerequisiteSectionIds, prerequisite ? [prerequisite] : []);
  for (const page of overviewPages) assert.ok(section.pages[page].length > 0, `${stageId} page ${page} is authored`);
}

const stageChecks = {
  'C1-01': {
    terms: ['three-phase-system','phase-sequence','star-connection','delta-connection','balanced-three-phase-load','unbalanced-three-phase-load','neutral-current','triplen-harmonics','line-and-phase-values'],
    formulas: ['star-line-phase','delta-line-phase'],
  },
  'C1-02': {
    terms: ['real-power','reactive-power','apparent-power','power-factor','power-triangle','ib'],
    formulas: ['three-phase-apparent-power','three-phase-real-power','three-phase-reactive-power','three-phase-design-current'],
  },
  'C1-03': {
    terms: ['three-phase-distribution-board','submain','feeder','phase-allocation','neutral-loading','three-phase-isolation','selectivity','swa'], formulas: [],
  },
  'C1-04': {
    terms: ['ib','in','iz','neutral-loading','voltage-drop','pfc','glossary-breaking-capacity','selectivity','three-phase-design-evidence'],
    formulas: ['three-phase-design-current','overload-coordination','required-tabulated-capacity','three-phase-tabulated-voltage-drop'],
  },
  'C1-05': {
    terms: ['submain-cpc','armour-as-cpc','parallel-earth-path','cpc','ads','zs','fault-thermal-withstand'],
    formulas: ['earth-fault-loop','earth-fault-current','adiabatic-cpc'],
  },
  'C1-06': {
    terms: ['power-factor-correction','capacitor-bank','automatic-pfc','detuned-reactor','real-power','reactive-power','apparent-power'],
    formulas: ['pfc-kvar','three-phase-capacitor-current'],
  },
  'C1-07': {
    terms: ['induction-motor','synchronous-speed','slip','motor-nameplate','motor-overload-protection','phase-sequence'],
    formulas: ['motor-synchronous-speed','motor-slip','three-phase-motor-input-current'],
  },
  'C1-08': {
    terms: ['direct-on-line-starting','star-delta-starting','soft-starter','variable-frequency-drive','contactor','interlock','control-circuit','phase-loss'], formulas: [],
  },
  'C1-09': {
    terms: ['phase-rotation-test','periodic-inspection','phase-imbalance','initial-verification','zs','pfc','commissioning-record'], formulas: [],
  },
  'C1-10': {
    terms: ['distribution-fault','phase-imbalance','phase-loss','motor-fault-diagnosis','control-circuit-fault','thermal-imaging','fault-finding'], formulas: [],
  },
};
for (const [stageId, checks] of Object.entries(stageChecks)) {
  const section = overviewData.sections.find(item => item.stageId === stageId);
  for (const id of checks.terms) assert.ok(section.termIds.includes(id), `${stageId} includes term ${id}`);
  for (const id of checks.formulas) assert.ok(overviewData.formulas.some(item => item.id === id), `${stageId} includes formula ${id}`);
}

assert.ok(overviewData.sections.find(item => item.stageId === 'C1-01').pages['system-model'].some(block => block.kind === 'prose' && block.paragraphs.join(' ').includes('240/415 V')));
assert.ok(overviewData.sections.find(item => item.stageId === 'C1-02').pages['engineering-rules'].some(block => block.kind === 'prose' && block.paragraphs.join(' ').includes('52.2 A')));
assert.ok(overviewData.sections.find(item => item.stageId === 'C1-06').coverage.some(item => item.competency.includes('kvar')));
assert.ok(overviewData.sections.find(item => item.stageId === 'C1-09').pages.sources.some(block => block.kind === 'prose' && block.paragraphs.join(' ').includes('avoids inventing periodic codes')));
assert.ok(overviewData.sections.find(item => item.stageId === 'C1-10').coverage.some(item => item.competency.includes('motor non-start')));

// Source authority and page-mapping discipline.
assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === 'epra-c2-competencies')).kind, 'external');
assert.equal(resolveSourceLink(overviewData.sources.find(source => source.id === 'epra-c1-competencies')).kind, 'external');
for (const id of ['osg-demand-diversity','osg-electrical-supply','osg-isolation-switching','osg-safe-working','osg-identification-notices','osg-final-circuits','osg-bath-shower','osg-cable-types','osg-cable-supports','osg-conduit-trunking','osg-current-capacity-voltage-drop','osg-protection','osg-earthing-bonding','osg-rcd-operation','osg-zs-appendix','osg-initial-verification','iet-gn3-periodic']) {
  const source = overviewData.sources.find(item => item.id === id);
  if (source) assert.equal(resolveSourceLink(source).kind, source.url ? 'external' : 'unavailable', `${id} has no guessed reader jump`);
}
const mapped = overviewData.sources.find(source => source.id === 'osg-safe-testing');
assert.equal(resolveSourceLink(mapped).reading.pdf, 125);
assert.equal(resolveSourceLink(mapped).reading.printed, '123');
assert.equal(resolveSourceLink({...mapped, pdfPage: undefined, mapping: undefined}).kind, 'unavailable');
for (const pdfPage of [0, -1, 1.5, 259, NaN, Infinity, '125']) assert.notEqual(resolveSourceLink({...mapped, pdfPage}).kind, 'reader');

// Backlinks and deliberate failure cases remain covered.
const fixture = structuredClone(overviewData);
fixture.sections.push({
  id: 'foundation-fixture', stageId: 'C2-01', moduleId: 'module-01', learningSectionIds: ['module-01-section-1'],
  title: 'Foundation fixture', status: 'fixture', lessonIds: ['p01-l01'], termIds: ['safe-isolation','continuity'], sourceIds: ['osg-safe-testing'],
  relatedSectionIds: [], prerequisiteSectionIds: [], coverage: [], pages: Object.fromEntries(overviewPages.map(id => [id, []])),
});
fixture.terms.find(term => term.id === 'safe-isolation').relatedTermIds = ['continuity'];
assert.deepEqual(validateOverview(fixture, context), []);
const continuityBacklinks = buildOverviewBacklinks(fixture).terms.continuity;
assert.ok(continuityBacklinks.termIds.includes('safe-isolation'));
assert.ok(continuityBacklinks.sectionIds.includes('foundation-fixture'));
assert.equal(new Set(continuityBacklinks.termIds).size, continuityBacklinks.termIds.length);
assert.equal(new Set(continuityBacklinks.sectionIds).size, continuityBacklinks.sectionIds.length);
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

console.log(`Overview verified: ${overviewData.terms.length} canonical records, complete C2-01..C2-09 and C1-01..C1-10 knowledge path, source/prerequisite integrity preserved.`);
