import { cp, mkdir } from 'node:fs/promises';
const base = new URL('../', import.meta.url);
const target = new URL('public/pdfjs/', base);
await mkdir(target, { recursive: true });
for (const file of ['build/pdf.worker.min.mjs', 'cmaps', 'standard_fonts', 'wasm', 'LICENSE']) {
  await cp(new URL(`node_modules/pdfjs-dist/${file}`, base), new URL(file.startsWith('build/') ? 'pdf.worker.min.mjs' : file, target), { recursive: true });
}
console.log('PDF reader assets prepared.');
