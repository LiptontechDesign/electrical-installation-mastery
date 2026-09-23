import assert from 'node:assert/strict';
import { build } from 'esbuild';
await build({ entryPoints: ['app/books-data.ts', 'app/reader-state.ts', 'app/pdf-layout.ts', 'app/pdf-range.ts'], outdir: 'work/book-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external' });
const { courseBooks, printedPage } = await import('../work/book-tests/books-data.js');
const { applyReaderCommand, emptyReaderState, parseReaderCommand, parseByteRange } = await import('../work/book-tests/reader-state.js');
const { PdfRangeQueue } = await import('../work/book-tests/pdf-range.js');
const { pdfRenderSize } = await import('../work/book-tests/pdf-layout.js');
for (const book of courseBooks) for (const chapter of book.chapters) assert.equal(printedPage(book, chapter.pdf), `p. ${chapter.printed}`);
assert.equal(printedPage(courseBooks[0], 259), 'p. 237');
assert.equal(printedPage(courseBooks[0], 260), 'p. 239');
assert.equal(printedPage(courseBooks[1], 149), 'p. 134');
assert.equal(parseReaderCommand({bookId:'../secret',action:'position',page:1}),null);
for (const page of [0,265,1.5,NaN,'10']) assert.equal(parseReaderCommand({bookId:'installation-designs',action:'position',page}),null);
assert.equal(parseReaderCommand({bookId:'modern-wiring',action:'bookmark',page:1,saved:true,note:'x'.repeat(2001)}),null);
let state = emptyReaderState();
state = applyReaderCommand(state,{bookId:'installation-designs',action:'bookmark',page:237,saved:true,note:'Follow both return paths.'},'2026-09-04T10:00:00Z');
state = applyReaderCommand(state,{bookId:'modern-wiring',action:'position',page:149},'2026-09-04T10:01:00Z');
state = applyReaderCommand(state,{bookId:'installation-designs',action:'position',page:238},'2026-09-04T10:02:00Z');
assert.equal(state.books['modern-wiring'].page,149);
assert.equal(state.books['installation-designs'].bookmarks[0].note,'Follow both return paths.');
state = applyReaderCommand(state,{bookId:'installation-designs',action:'bookmark',page:237,saved:true});
assert.equal(state.books['installation-designs'].bookmarks[0].note,'Follow both return paths.');
state = applyReaderCommand(state,{bookId:'installation-designs',action:'bookmark',page:237,saved:false});
assert.equal(state.books['installation-designs'].bookmarks.length,0);
assert.equal(state.books['installation-designs'].page,238);
assert.deepEqual(parseByteRange('bytes=0-1023',12753340),{start:0,end:1023});
assert.deepEqual(parseByteRange('bytes=-64',100),{start:36,end:99});
assert.deepEqual(parseByteRange('bytes=80-',100),{start:80,end:99});
for (const header of ['bytes=100-101','bytes=3-2','bytes=-0','bytes=0-1,3-4','bytes=-','items=0-3']) assert.equal(parseByteRange(header,100),'invalid');
for (const viewport of [280, 320, 375, 390, 430, 600, 768, 1280]) {
  for (const zoom of [1, 2, 3]) {
    const size = pdfRenderSize(viewport - 24, 595, 842, zoom, 3);
    if (zoom === 1) assert.ok(size.width + 24 <= viewport + .001, `Page fits ${viewport}px screen`);
    assert.ok(size.pixelsWide * size.pixelsHigh <= 4_000_000, 'Rendered canvas stays within the phone pixel budget');
    assert.ok(Math.max(size.pixelsWide, size.pixelsHigh) <= 4096);
  }
}
const nativeFetch = globalThis.fetch;
try {
  const waiting = [];
  const received = [];
  let failure;
  globalThis.fetch = async (_url, options) => new Promise(resolve => waiting.push({ resolve, range: options.headers.Range }));
  const queue = new PdfRangeQueue('/private-test', (begin, data) => received.push({ begin, length: data.length }), error => { failure = error; });
  queue.request(0,4); queue.request(4,8); queue.request(8,12);
  assert.equal(waiting.length,2,'Only two PDF sections download simultaneously');
  waiting[0].resolve(new Response(new Uint8Array([1,2,3,4]), {status:206}));
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(waiting.length,3,'Next queued section starts after a download completes');
  waiting[1].resolve(new Response(new Uint8Array([5,6,7,8]), {status:206}));
  waiting[2].resolve(new Response(new Uint8Array([9,10,11,12]), {status:206}));
  await new Promise(resolve=>setImmediate(resolve));
  assert.deepEqual(received.map(part=>part.begin).sort((a,b)=>a-b),[0,4,8]);
  assert.equal(failure,undefined);
  let calls = 0;
  globalThis.fetch = async () => { calls++; return new Response(null,{status:401}); };
  const locked = new PdfRangeQueue('/private-test',()=>assert.fail('Unauthenticated bytes must not reach the reader'),error=>{failure=error;});
  locked.request(0,4);
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(calls,1,'An authentication failure is not retried');
  assert.match(failure.message,/Reopen My books/);
  locked.request(4,8);
  assert.equal(calls,1,'A failed queue stops additional downloads');
} finally { globalThis.fetch = nativeFetch; }
for(const book of courseBooks){
 assert.ok(parseReaderCommand({bookId:book.id,action:'position',page:book.pages}));
 assert.equal(parseReaderCommand({bookId:book.id,action:'position',page:book.pages+1}),null);
 const marked=applyReaderCommand(emptyReaderState(),{bookId:book.id,action:'bookmark',page:book.pages,saved:true,note:'Remember this page'});
 assert.equal(marked.books[book.id].bookmarks[0].note,'Remember this page');
}
assert.equal(courseBooks.length,4);
console.log('PASS: four reference books, chapter pages, saved notes, range downloads and phone canvas limits.');
