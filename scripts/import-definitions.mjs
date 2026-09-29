import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

const source = new URL('../docs/bs7671-17th-edition-epra-definitions.md', import.meta.url);
const target = new URL('../app/practice/definitions.json', import.meta.url);
const learningNotesSource = new URL('../app/practice/definition-learning-notes.ts', import.meta.url);
const markdown = await readFile(source, 'utf8');
const learningNotes = await readFile(learningNotesSource, 'utf8');
const body = markdown.split('## Terms to source separately')[0];
const sections = [...body.matchAll(/^## [1-6]\. (.+)$/gm)];
const definitions = [];

for (let index = 0; index < sections.length; index += 1) {
  const section = sections[index];
  const next = sections[index + 1];
  const category = section[1];
  const content = body.slice(section.index + section[0].length, next?.index ?? body.length);
  const entries = [...content.matchAll(/^### (.+)$/gm)];

  for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
    const entry = entries[entryIndex];
    const nextEntry = entries[entryIndex + 1];
    const detail = content.slice(entry.index + entry[0].length, nextEntry?.index ?? content.length);
    const sourceLine = detail.match(/^\*\*Source:\*\* Part 2, printed pp?\. ([\d–]+) \(PDF pp?\. ([\d–]+)\)\.$/m);
    const aliases = detail.match(/^\*\*Search aliases:\*\* (.+)\.$/m)?.[1].split(';').map(value => value.trim()) ?? [];
    const quote = detail.split('\n').filter(line => line.startsWith('>')).map(line => line.replace(/^> ?/, '')).join('\n').trim();
    assert.ok(sourceLine, `Missing page citation: ${entry[1]}`);
    assert.ok(quote, `Missing definition: ${entry[1]}`);
    definitions.push({
      id: `definition-${definitions.length + 1}`,
      term: entry[1],
      category,
      aliases,
      printedPage: sourceLine[1],
      pdfPage: sourceLine[2],
      definition: quote,
    });
  }
}

assert.equal(sections.length, 6, 'Expected six learning areas');
assert.equal(definitions.length, 138, 'Glossary count changed; review the source before updating this check');
assert.equal(new Set(definitions.map(entry => entry.term)).size, definitions.length, 'Duplicate glossary term');
const learningIds = [...learningNotes.matchAll(/^  '(definition-\\d+)': \\{/gm)].map(match => match[1]);
assert.equal(learningIds.length, definitions.length, 'Every definition must have one expanded learning note');
assert.deepEqual(new Set(learningIds), new Set(definitions.map(entry => entry.id)), 'Expanded learning note IDs must match the glossary exactly');
for (const term of ['Circuit protective conductor (cpc)', 'Earthing conductor', 'Protective conductor (PE)', 'Protective bonding conductor']) {
  assert.ok(definitions.some(entry => entry.term === term), `Missing essential term: ${term}`);
}

const generated = `${JSON.stringify(definitions, null, 2)}\n`;
if (process.argv.includes('--check')) {
  assert.equal(await readFile(target, 'utf8'), generated, 'Definitions JSON is out of date; run npm run import:definitions');
  console.log(`Verified ${definitions.length} definitions against the Markdown source.`);
} else {
  await writeFile(target, generated);
  console.log(`Imported ${definitions.length} definitions from the Markdown source.`);
}
