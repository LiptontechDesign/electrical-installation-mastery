import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';

await mkdir('work/competency-audit', { recursive: true });
await build({
  entryPoints: ['app/overview-data.ts'],
  outdir: 'work/competency-audit',
  bundle: true,
  platform: 'node',
  format: 'esm',
});

const { overviewData } = await import('../work/competency-audit/overview-data.js');
const source = id => overviewData.sources.find(item => item.id === id);
const term = id => overviewData.terms.find(item => item.id === id);
const stage = id => overviewData.sections.find(item => item.stageId === id);
const pageText = (section, page) => JSON.stringify(section.pages[page]);

// Primary Kenyan competency and legal anchors.
for (const id of ['epra-c2-competencies','epra-c1-competencies','kenya-energy-act-2019','kenya-building-code-2024-electrical']) {
  assert.ok(source(id), `${id} exists`);
  assert.equal(source(id).status, 'verified', `${id} is verified`);
  assert.equal(source(id).kenyaStatus, 'kenya-verified', `${id} is Kenya verified`);
}
assert.equal(source('kenya-energy-act-2019').sourceType, 'kenya-law');
assert.equal(source('kenya-building-code-2024-electrical').sourceType, 'kenya-law');

// Licensing boundaries must be explicit and regression-proof.
const c2Scope = term('c2-licence-scope');
assert.ok(c2Scope.standardsMeaning.includes('single-phase'));
assert.ok(c2Scope.standardsMeaning.includes('two storeys'));
assert.ok(c2Scope.standardsMeaning.includes('factories'));
assert.ok(c2Scope.standardsMeaning.includes('public entertainment'));
assert.equal(c2Scope.kenyaStatus, 'kenya-verified');

const c1Scope = term('c1-licence-scope');
assert.ok(c1Scope.standardsMeaning.includes('every Class C2 competency'));
assert.ok(c1Scope.standardsMeaning.includes('three-phase'));
assert.ok(c1Scope.standardsMeaning.includes('four storeys'));
assert.ok(c1Scope.standardsMeaning.includes('factories'));
assert.ok(c1Scope.standardsMeaning.includes('public entertainment'));
assert.equal(c1Scope.kenyaStatus, 'kenya-verified');

// National regulations/codes/standards must be taught rather than only cited as an EPRA bullet.
const framework = term('kenya-electrical-installation-framework');
assert.equal(framework.kenyaStatus, 'kenya-verified');
assert.ok(framework.sourceIds.includes('kenya-energy-act-2019'));
assert.ok(framework.sourceIds.includes('kenya-building-code-2024-electrical'));
for (const id of ['C2-02','C1-01']) {
  const section = stage(id);
  assert.ok(section.termIds.includes('kenya-electrical-installation-framework'), `${id} teaches Kenyan authority framework`);
  assert.ok(section.sourceIds.includes('kenya-energy-act-2019'), `${id} includes Energy Act`);
  assert.ok(section.sourceIds.includes('kenya-building-code-2024-electrical'), `${id} includes Building Code`);
}

// EPRA colour-coding competence must have a canonical teaching item, while not overstating Kenyan table verification.
const identification = term('conductor-identification');
assert.equal(identification.kenyaStatus, 'bs7671-technical-baseline');
assert.notEqual(identification.kenyaStatus, 'kenya-verified');
for (const value of ['brown','blue','green-and-yellow']) assert.ok(identification.standardsMeaning.toLowerCase().includes(value));
const c203 = stage('C2-03');
assert.ok(c203.termIds.includes('conductor-identification'));
assert.ok(c203.coverage.some(item => item.competency.toLowerCase().includes('colour coding')));
assert.ok(pageText(c203, 'definitions').includes('Brown'));
assert.ok(pageText(c203, 'definitions').includes('Blue'));
assert.ok(pageText(c203, 'definitions').includes('Green-and-yellow'));
assert.ok(pageText(c203, 'sources').includes('KS 662'));

// C1 carries the C2 framework and conductor-identification foundation forward.
const c101 = stage('C1-01');
for (const id of ['c1-licence-scope','kenya-electrical-installation-framework','conductor-identification']) assert.ok(c101.termIds.includes(id));
for (const value of ['Brown','Black','Grey','Blue','Green-and-yellow']) assert.ok(pageText(c101, 'engineering-rules').includes(value));

// Building Code product/assembly bridge must appear at the board and motor-control stages.
for (const id of ['C2-07','C1-08']) {
  const section = stage(id);
  assert.ok(section.sourceIds.includes('kenya-building-code-2024-electrical'), `${id} includes Building Code product standards bridge`);
  assert.ok(pageText(section, 'engineering-rules').includes('60947') || pageText(section, 'engineering-rules').includes('61439'));
}

// Testing/periodic legal duty is anchored without inventing GN3 detail.
assert.ok(stage('C2-08').sourceIds.includes('kenya-energy-act-2019'));
assert.ok(stage('C1-09').sourceIds.includes('kenya-energy-act-2019'));
assert.ok(pageText(stage('C1-09'), 'engineering-rules').includes('periodically'));
assert.ok(pageText(stage('C1-09'), 'sources').includes('not yet been integrated'));

// All licensing stages remain authored and mapped to at least one competency statement.
for (const id of [...Array.from({length: 9}, (_, i) => `C2-${String(i + 1).padStart(2, '0')}`), ...Array.from({length: 10}, (_, i) => `C1-${String(i + 1).padStart(2, '0')}`)]) {
  const section = stage(id);
  assert.ok(section, `${id} exists`);
  assert.ok(section.coverage.length > 0, `${id} has competency coverage`);
  assert.ok(section.sourceIds.length > 0, `${id} has source provenance`);
}

// Explicit known source gaps stay visible rather than being silently promoted to verified authority.
assert.equal(source('iet-gn3-periodic').status, 'needs-verification');
assert.equal(source('iet-conductor-identification-baseline').status, 'historical');
for (const id of ['osg-demand-diversity','osg-current-capacity-voltage-drop','osg-zs-appendix']) {
  assert.equal(source(id).status, 'needs-verification', `${id} remains source-limited`);
}
const auditDocument = await import('node:fs/promises').then(fs => fs.readFile('docs/C2_C1_COMPETENCY_SOURCE_COUNTER_AUDIT.md', 'utf8'));
assert.ok(auditDocument.includes('supplied current OSG asset has 258 PDF pages'));
assert.ok(!/OSG asset truncates|file appears to stop|missing OSG appendix material/.test(auditDocument));

console.log('C2/C1 competency and source counter-audit checks passed.');
