import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { act, create } from 'react-test-renderer';

await mkdir('work/book-tests', { recursive: true });
await build({ entryPoints: ['app/books-data.ts','app/reader-state.ts','app/experiment-models.ts','app/learning-experiment.tsx','app/book-simulations.tsx','app/pdf-layout.ts','app/course-extension-data.ts','app/pdf-range.ts'], outdir: 'work/book-tests', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { courseBooks, readingTopics, printedPage, simulationForPage } = await import('../work/book-tests/books-data.js');
const { applyReaderCommand, emptyReaderState, parseReaderCommand, parseByteRange } = await import('../work/book-tests/reader-state.js');
const { motorTransition, initialMotor, cableExample, residualExample } = await import('../work/book-tests/experiment-models.js');
const { default: Experiment } = await import('../work/book-tests/learning-experiment.js');
const { default: extension } = await import('../work/book-tests/course-extension-data.js');
const { PdfRangeQueue } = await import('../work/book-tests/pdf-range.js');
const { pdfRenderSize } = await import('../work/book-tests/pdf-layout.js');
const { default: BookSimulations } = await import('../work/book-tests/book-simulations.js');
const base = JSON.parse(await readFile('app/course-data.json','utf8'));
const lessons = [...base.modules,...extension.modules].flatMap(module => module.lessons);
const ids = new Set(lessons.map(lesson => lesson.id));
for (const topic of readingTopics) {
  for (const id of topic.lessonIds) assert.ok(ids.has(id), `${topic.id}: unknown lesson ${id}`);
  for (const reading of topic.readings) {
    const book = courseBooks.find(book => book.id === reading.bookId);
    assert.ok(reading.pdf <= reading.end && reading.end <= book.pages && reading.pdf > 0);
  }
}
for (const book of courseBooks) for (const chapter of book.chapters) assert.equal(printedPage(book, chapter.pdf), `p. ${chapter.printed}`);
assert.equal(printedPage(courseBooks[0], 259), 'p. 237');
assert.equal(printedPage(courseBooks[0], 260), 'p. 239');
assert.equal(printedPage(courseBooks[1], 149), 'p. 134');
assert.equal(simulationForPage('installation-designs', 237).id, 'rcd');
assert.equal(simulationForPage('installation-designs', 255).id, 'voltage-drop', 'A specific page takes priority over a broader reading range');
assert.equal(simulationForPage('modern-wiring', 149).id, 'motor');
assert.equal(simulationForPage('modern-wiring', 1), undefined);
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
let motor = motorTransition(initialMotor,'start');
motor = motorTransition(motor,'release');
assert.equal(motor.running,true,'Holding contact maintains the healthy coil');
motor = motorTransition(motor,'trip');
assert.equal(motor.running,false);
motor = motorTransition(motor,'reset');
assert.equal(motor.running,false,'Reset does not restart');
motor = motorTransition(motorTransition(motor,'start'),'supply');
motor = motorTransition(motor,'supply');
assert.equal(motor.running,false,'Supply restoration does not restart');
motor = motorTransition(motor,'holding-fault');
motor = motorTransition(motor,'start');
assert.equal(motor.running,true,'Start temporarily bypasses the failed holding contact');
assert.equal(motorTransition(motor,'release').running,false);
assert.equal(cableExample(27,31,.6).capacityMet,false);
assert.equal(cableExample(27,31,.8).capacityMet,true);
assert.equal(cableExample(33,31,1).capacityMet,false);
assert.ok(Math.abs(cableExample(27,31,1).drop - 3.6828)<1e-8);
assert.equal(cableExample(NaN,31,1),null);
assert.equal(residualExample(true).residualMilliamps,40);
for (const leakage of [0, 5, 30, 60]) {
  const current = residualExample(true, leakage);
  assert.ok(Math.abs(current.line - current.neutral - current.protective) < 1e-10, 'Current is conserved for every slider setting');
  assert.equal(current.residualMilliamps, leakage);
  assert.equal(residualExample(false, leakage).residualMilliamps, 0);
}
assert.equal(cableExample(27, 60, 1).drop, 2 * cableExample(27, 30, 1).drop);
for (const viewport of [280, 320, 375, 390, 430, 600, 768, 1280]) {
  for (const zoom of [1, 2, 3]) {
    const size = pdfRenderSize(viewport - 24, 595, 842, zoom, 3);
    if (zoom === 1) assert.ok(size.width + 24 <= viewport + .001, `Page fits ${viewport}px screen`);
    assert.ok(size.pixelsWide * size.pixelsHigh <= 4_000_000, 'Rendered canvas stays within the phone pixel budget');
    assert.ok(Math.max(size.pixelsWide, size.pixelsHigh) <= 4096);
  }
}
for (const kind of ['rcd','cable','motor']) assert.ok(renderToStaticMarkup(h(Experiment,{kind})).includes('experiment'));
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let ui;
await act(async()=>{ ui=create(h(Experiment,{kind:'cable'})); });
await act(async()=>{ ui.root.findByType('select').props.onChange({target:{value:'2'}}); });
assert.ok(JSON.stringify(ui.toJSON()).includes('not met'));
assert.ok(JSON.stringify(ui.toJSON()).includes('&gt;') || JSON.stringify(ui.toJSON()).includes('>'));
await act(async()=>ui.unmount());
await act(async()=>{ ui=create(h(Experiment,{kind:'rcd'})); });
const buttonText = node => node.children.filter(value => typeof value === 'string').join('');
await act(async()=>ui.root.findAllByType('button').find(node => buttonText(node) === 'Earth fault').props.onClick());
await act(async()=>ui.root.findByType('input').props.onChange({target:{value:'60'}}));
assert.ok(JSON.stringify(ui.toJSON()).includes('2.060'), 'Moving leakage changes the displayed line current');
await act(async()=>ui.root.findAllByType('button').find(node => buttonText(node) === 'Healthy circuit').props.onClick());
assert.equal(ui.root.findAllByType('input').length, 0);
await act(async()=>ui.unmount());
let source;
await act(async()=>{ ui=create(h(BookSimulations,{onRead: reading => { source = reading; }})); });
for (const [label, id, correct] of [['Current balance','rcd',0],['Cable capacity','cable',1],['Voltage drop','voltage-drop',1],['Motor starter','motor',1]]) {
  await act(async()=>ui.root.findAllByType('button').find(node => buttonText(node) === label).props.onClick());
  const check = ui.root.findByType('fieldset');
  assert.equal(check.findAllByProps({role:'status'}).length,0,'Changing the activity clears the previous answer');
  await act(async()=>check.findAllByType('button')[correct].props.onClick());
  assert.equal(check.findByProps({role:'status'}).props.className,'answer-correct');
  const sources = ui.root.findByProps({className:'simulation-sources'}).findAllByType('button');
  const topic = readingTopics.find(item => item.id === id);
  for (let index=0; index<sources.length; index++) {
    await act(async()=>sources[index].props.onClick());
    assert.deepEqual(source,topic.readings[index],`${id}: book link preserves exact source page`);
  }
}
await act(async()=>ui.unmount());
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
console.log(`Book checks passed: ${courseBooks.length} books, ${readingTopics.length} reading topics, ${readingTopics.reduce((sum,topic)=>sum+topic.lessonIds.length,0)} lesson links; state merge, ranges, motor interlocks and cable calculations.`);
