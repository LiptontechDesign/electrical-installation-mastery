import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { put, head, BlobNotFoundError } from '@vercel/blob';

if (process.argv.length < 4) throw new Error('Usage: node --env-file=.env.local scripts/upload-books.mjs <designs.pdf> <wiring.pdf> [extracted-figures-directory] [prepared-reading-copies-directory]');
const inputs = [
  { file: process.argv[2], pathname: 'books/installation-designs-fourth-edition.pdf', expected: 12753340, contentType: 'application/pdf' },
  { file: process.argv[3], pathname: 'books/modern-wiring-practice-fourteenth-edition.pdf', expected: 67489354, contentType: 'application/pdf' },
];
if (process.argv[4]) {
  const figures = JSON.parse(await readFile('app/book-figures.json', 'utf8'));
  inputs.push(...figures.map(figure => ({ file: resolve(process.argv[4], `${figure.id}.png`), pathname: `figures/${figure.id}.png`, contentType: 'image/png' })));
}
if (process.argv[5]) {
  const assets = JSON.parse(await readFile('app/book-assets.json', 'utf8'));
  for (const [id, files] of Object.entries(assets)) inputs.push({ file: resolve(process.argv[5], `${id}-reader.pdf`), pathname: files.reader.pathname, expected: files.reader.size, contentType: 'application/pdf' });
}
await mkdir('work/book-integration', { recursive: true });
const uploaded = [];
for (const input of inputs) {
  const data = await readFile(input.file);
  if (input.expected && (data.length !== input.expected || data.subarray(0,5).toString() !== '%PDF-')) throw new Error(`Unexpected PDF: ${input.pathname}`);
  const sha256 = createHash('sha256').update(data).digest('hex');
  let existing;
  try { existing = await head(input.pathname); } catch (error) { if (!(error instanceof BlobNotFoundError)) throw error; }
  if (existing && existing.size !== data.length) throw new Error(`Existing file has a different size: ${input.pathname}. Inspect it before replacing it.`);
  const blob = existing ?? await put(input.pathname, data, { access: 'private', addRandomSuffix: false, allowOverwrite: false, multipart: data.length > 5_000_000, contentType: input.contentType });
  const verified = await head(blob.url);
  if (verified.size !== data.length) throw new Error(`Upload verification failed: ${input.pathname}`);
  uploaded.push({ pathname: input.pathname, size: data.length, sha256, url: blob.url });
  await writeFile('work/book-integration/upload-manifest.json', JSON.stringify(uploaded, null, 2));
  console.log(`${existing ? 'Verified existing' : 'Uploaded private'}: ${input.pathname} (${data.length} bytes)`);
}
console.log(`Verified ${uploaded.length} private files.`);
