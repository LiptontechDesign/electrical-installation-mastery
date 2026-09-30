import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { build } from 'esbuild';
import { chromium } from 'playwright';

// Render the actual course components with simulated accounts. This local UI
// harness needs no auth credentials and never connects to account storage.
// test-personal-course-api.mjs exercises authentication and account isolation.
await build({ entryPoints: ['app/personal-course-model.ts', 'app/learner-state.ts'], outdir: 'work/removal-browser/model', bundle: true, platform: 'node', format: 'esm' });
const model = await import('../work/removal-browser/model/personal-course-model.js');
const { initialLearnerState } = await import('../work/removal-browser/model/learner-state.js');
const styles = [...readFileSync('app/layout.tsx', 'utf8').matchAll(/import '(\.\/[^']+\.css)'/g)].map(match => `import './app/${match[1].slice(2)}';`).join('\n');
await build({ stdin: { resolveDir: process.cwd(), loader: 'tsx', contents: `${styles}
  import {createRoot} from 'react-dom/client';
  import CourseApp from './app/course-app';
  import {CourseAccountProvider} from './app/course-account';
  import {CourseOrderProvider} from './app/course-order';
  import {SupplementaryProvider} from './app/supplementary-videos';
  const account=new URLSearchParams(location.search).get('account')||'alice';
  const user=account==='guest'?null:{id:account,email:account+'@example.test',name:account+' Learner'};
  createRoot(document.getElementById('root')).render(<CourseAccountProvider user={user}><CourseOrderProvider key={account}><SupplementaryProvider userId={user?.id}><CourseApp user={user}/></SupplementaryProvider></CourseOrderProvider></CourseAccountProvider>);
` }, outfile: 'work/removal-browser/ui.js', bundle: true, platform: 'browser', format: 'esm', jsx: 'automatic', define: { 'process.env': '{}', 'process.env.NODE_ENV': '"development"' }, plugins: [{ name: 'framework-harness', setup(builder) {
  builder.onResolve({ filter: /^next\/(link|script|dynamic)$/ }, args => ({ path: args.path, namespace: 'harness' }));
  builder.onLoad({ filter: /.*/, namespace: 'harness' }, args => ({ contents: args.path === 'next/link' ? 'import {createElement} from "react";export default ({children,...props})=>createElement("a",props,children);' : args.path === 'next/script' ? 'import {useEffect} from "react";export default function Script({onReady}){useEffect(()=>{onReady?.();},[onReady]);return null;}' : 'export default ()=>()=>null;', loader: 'js', resolveDir: process.cwd() }));
} }] });
const server = createServer((request, response) => {
  const path = new URL(request.url, 'http://localhost').pathname;
  if (path === '/ui.js' || path === '/ui.css') { response.setHeader('Content-Type', path.endsWith('.css') ? 'text/css' : 'application/javascript'); response.end(readFileSync(`work/removal-browser${path}`)); }
  else { response.setHeader('Content-Type', 'text/html'); response.end('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/ui.css"></head><body><div id="root"></div><script type="module" src="/ui.js"></script></body></html>'); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ headless: true, channel: process.env.COURSE_TEST_CHANNEL ?? 'msedge' });
const accounts = new Map();
async function fixture(account, { mobile = false, seed } = {}) {
  if (!accounts.has(account)) accounts.set(account, { course: structuredClone(seed ?? model.publishedPersonalCourse), learner: { ...structuredClone(initialLearnerState), notes: { 'p01-l01': 'Keep my saved note' }, completedLessonIds: ['p01-l01'] } });
  const saved = accounts.get(account);
  const context = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 1000 } });
  await context.addInitScript(() => {
    window.YT = { PlayerState: { ENDED: 0, PLAYING: 1 }, Player: class {
      constructor(frame, options) { this.options = options; setTimeout(() => options.events.onReady?.({ target: this }), 0); }
      getCurrentTime() { return 0; } getDuration() { return 500; } getPlayerState() { return -1; } pauseVideo() {} destroy() {}
    } };
  });
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  const errors = [], writes = [], reads = []; let fail = false;
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/api/**', async route => {
    const request = route.request(), path = new URL(request.url()).pathname;
    if (request.method() === 'GET') reads.push(path); else writes.push(path);
    if (account === 'guest') return route.fulfill({ status: 401, json: { error: 'Sign in first.' } });
    if (path === '/api/personal-course') {
      if (request.method() === 'POST') {
        if (fail) { fail = false; return route.fulfill({ status: 503, json: { error: 'Test save interruption. Please retry.' } }); }
        try { saved.course = model.applyCourseEdit(saved.course, request.postDataJSON()); }
        catch (error) { return route.fulfill({ status: error.status ?? 400, json: { error: error.message, state: saved.course } }); }
      }
      return route.fulfill({ json: saved.course });
    }
    if (path.endsWith('/learner-state')) {
      if (request.method() === 'PUT') saved.learner = request.postDataJSON().payload;
      return route.fulfill({ json: { exists: true, payload: saved.learner } });
    }
    return route.fulfill({ json: { exists: false, payload: [] } });
  });
  await page.route('**/*youtube*/*', route => route.fulfill({ contentType: 'text/html', body: '<html><body>Simulated player</body></html>' }));
  await page.goto(`${origin}/?account=${account}#learn/p01-l01`);
  try { await page.locator('.lesson-canvas h1').waitFor(); }
  catch (error) { console.error({ errors, content: (await page.locator('body').innerText()).slice(0, 600) }); throw error; }
  if (account !== 'guest' && !mobile) await page.getByRole('button', { name: 'Add video', exact: true }).waitFor();
  return { page, context, errors, writes, reads, saved, failNext: () => { fail = true; } };
}
async function actions(page, id) {
  const button = page.locator(`.lesson-canvas [data-video-actions="${id}"]`);
  await button.click();
}
async function archived(page) {
  if (!await page.locator('.course-tools-more summary').isVisible()) {
    await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    await page.waitForTimeout(350);
  }
  await page.locator('.course-tools-more summary').click();
  await page.getByRole('button', { name: 'Archived videos', exact: true }).click();
  return page.getByRole('dialog', { name: 'Archived videos', exact: true });
}
try {
  const f = await fixture('alice'), { page } = f;
  const first = 'p01-l01', title = model.personalCourseSnapshot(f.saved.course).byId.get(first).title;
  await actions(page, first);
  await page.getByRole('menuitem', { name: 'Delete permanently…', exact: true }).click();
  let dialog = page.getByRole('dialog', { name: 'Delete video permanently?', exact: true });
  await dialog.getByText(title, { exact: true }).waitFor();
  assert.equal(await dialog.getByRole('button', { name: 'Cancel', exact: true }).evaluate(el => document.activeElement === el), true);
  await page.screenshot({ path: 'work/removal-browser/delete-desktop.png' });
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  assert.equal(f.saved.course.revision, 0, 'Cancel performs no removal');
  await actions(page, first);
  await page.getByRole('menuitem', { name: 'Archive video', exact: true }).click();
  await page.getByText('Video archived. Your notes and progress are kept.', { exact: true }).waitFor();
  assert.ok(!model.personalCourseSnapshot(f.saved.course).byId.has(first));
  assert.notEqual(new URL(page.url()).hash, `#learn/${first}`, 'Archiving the playing lesson selects a remaining video');
  dialog = await archived(page);
  await dialog.getByLabel('Search archived videos').fill(title);
  await dialog.getByRole('button', { name: 'Restore…', exact: true }).click();
  await page.getByRole('dialog', { name: 'Restore video', exact: true }).getByText(title, { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Restore video', exact: true }).click();
  await page.waitForFunction(() => !document.querySelector('dialog[open]'));
  assert.ok(model.personalCourseSnapshot(f.saved.course).byId.has(first));
  await page.goto(`${origin}/?account=alice#learn/${first}`); await page.reload();
  await page.locator('.lesson-canvas h1').filter({ hasText: title }).waitFor();
  await actions(page, first);
  await page.getByRole('menuitem', { name: 'Delete permanently…', exact: true }).click();
  dialog = page.getByRole('dialog', { name: 'Delete video permanently?', exact: true });
  f.failNext();
  await dialog.getByRole('button', { name: 'Delete permanently', exact: true }).click();
  await dialog.getByRole('alert').filter({ hasText: 'interruption' }).waitFor();
  assert.ok(model.personalCourseSnapshot(f.saved.course).byId.has(first), 'A failed removal keeps the video');
  await dialog.getByRole('button', { name: 'Delete permanently', exact: true }).click();
  await page.getByText('Video permanently removed from your course.', { exact: true }).waitFor();
  assert.equal(await page.locator('.personal-course-notice').getByRole('button', { name: 'Undo', exact: true }).count(), 0);
  await page.reload();
  await page.locator('.lesson-canvas h1').waitFor();
  assert.equal(await page.locator(`[data-course-row="${first}"]`).count(), 0);
  assert.equal(f.saved.learner.notes[first], 'Keep my saved note');
  assert.ok(f.saved.learner.completedLessonIds.includes(first));
  dialog = await archived(page);
  await dialog.getByLabel('Search archived videos').fill(title);
  await dialog.getByText('No archived videos match your search.', { exact: true }).waitFor();
  assert.deepEqual(f.errors, []);
  await f.context.close();
  const bob = await fixture('bob');
  await bob.page.locator('.lesson-canvas h1').filter({ hasText: title }).waitFor();
  assert.ok(model.personalCourseSnapshot(bob.saved.course).byId.has(first));
  assert.equal(bob.saved.course.revision, 0);
  assert.deepEqual(bob.errors, []); await bob.context.close();
  console.log('PASS: desktop cancel, core archive/restore, current-player navigation, retained confirmation on failure, permanent removal/reload, preserved study data and another learner unchanged.');

  const mobile = await fixture('mobile', { mobile: true });
  await actions(mobile.page, first);
  await mobile.page.getByRole('menuitem', { name: 'Delete permanently…', exact: true }).click();
  dialog = mobile.page.getByRole('dialog', { name: 'Delete video permanently?', exact: true });
  const bounds = await dialog.boundingBox();
  assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= 390 && bounds.y >= 0 && bounds.y + bounds.height <= 844);
  assert.equal(await mobile.page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await mobile.page.screenshot({ path: 'work/removal-browser/delete-mobile.png' });
  await mobile.page.keyboard.press('Escape');
  assert.equal(mobile.saved.course.revision, 0);
  await actions(mobile.page, first);
  await mobile.page.getByRole('menuitem', { name: 'Archive video', exact: true }).click();
  await mobile.page.getByText('Video archived. Your notes and progress are kept.', { exact: true }).waitFor();
  dialog = await archived(mobile.page);
  await dialog.getByRole('button', { name: `Delete permanently: ${title}`, exact: true }).click();
  await mobile.page.getByRole('button', { name: 'Delete permanently', exact: true }).click();
  await mobile.page.getByText('Video permanently removed from your course.', { exact: true }).waitFor();
  assert.ok(mobile.saved.course.deletedIds.includes(first));
  assert.deepEqual(mobile.errors, []); await mobile.context.close();

  const coreIds = model.personalCourseSnapshot(model.publishedPersonalCourse).course.modules.flatMap(m => m.lessons.map(l => l.id));
  const empty = await fixture('empty', { seed: { ...model.publishedPersonalCourse, archivedLessonIds: coreIds, videos: model.publishedPersonalCourse.videos.map(v => ({ ...v, archived: true })) } });
  await empty.page.getByRole('heading', { name: 'No active videos', exact: true }).waitFor();
  assert.equal(await empty.page.locator('.video-frame iframe').count(), 0);
  await empty.page.getByRole('button', { name: 'My learning', exact: true }).click();
  await empty.page.getByRole('heading', { name: 'No active videos', exact: true }).waitFor();
  assert.deepEqual(empty.errors, []); await empty.context.close();

  const guest = await fixture('guest');
  assert.equal(await guest.page.locator('[data-video-actions]').count(), 0);
  assert.equal(await guest.page.getByRole('button', { name: 'Archived videos', exact: true }).count(), 0);
  assert.equal(guest.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0);
  assert.equal(guest.writes.length, 0);
  assert.deepEqual(guest.errors, []); await guest.context.close();
  console.log('PASS: mobile confirmation/Escape/archive deletion, empty courses on Learn/Home, and guest isolation. Real components and styles; simulated accounts, storage and video playback.');
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
