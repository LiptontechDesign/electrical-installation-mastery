import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { build } from 'esbuild';
const retired = /(?:assessment-(?:bank|choice|workspace|markdown|diagram|types)|lesson-overview|overview-(?:data|reader)|module-recap|practice-(?:data|workspace)|book-simulations|learning-experiment|simulation-activities|knowledge-graph|standards-(?:data|terms)|tutor-panels)/;
const files = await readdir('app');
for (const file of files) assert.ok(!retired.test(file), 'Retired content file remains: ' + file);
for (const file of ['app/course-app.tsx', 'app/course-overview.tsx', 'app/learning-home.tsx', 'app/book-reader.tsx']) {
  const source = await readFile(file, 'utf8');
  assert.ok(!/Lesson guide|Standards companion|Module recap book|Exam prep|Mock papers|Flashcards|Simulations/.test(source), 'Retired interface remains: ' + file);
}
const bundle = await build({ entryPoints: ['app/course-app.tsx'], outdir: 'work/architecture-test', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic', write: false, metafile: true });
for (const file of Object.keys(bundle.metafile.inputs)) assert.ok(!retired.test(file), 'Retired content is still bundled: ' + file);
console.log('PASS: video course and books contain no retired lesson, assessment or simulation interfaces or bundles.');
const catalog = JSON.parse(await readFile('app/video-catalog.json', 'utf8'));
for (const lesson of catalog.modules.flatMap(group => group.lessons)) {
  for (const field of ['guide', 'rationale', 'prerequisite', 'checkYourself', 'keyConcepts']) {
    assert.ok(!(field in lesson), 'Retired authored content in video catalogue: ' + field);
  }
}
assert.ok(!JSON.parse(await readFile('package.json', 'utf8')).dependencies.katex, 'Unused formula renderer must stay removed');
