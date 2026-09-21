import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { build } from 'esbuild';
await build({ entryPoints: ['app/course-order-model.ts', 'app/supplementary-defaults.ts'], outdir: 'work/course-drag-browser', bundle: true, platform: 'node', format: 'esm' });
const { defaultOrder, orderedSections, moveLesson } = await import('../work/course-drag-browser/course-order-model.js');
const { withSupplementaryDefaults } = await import('../work/course-drag-browser/supplementary-defaults.js');
const section = orderedSections(defaultOrder)[0];
const [first, second, third] = section.lessonIds;
const browser = process.env.COURSE_TEST_CDP ? await chromium.connectOverCDP(process.env.COURSE_TEST_CDP) : await chromium.launch({ headless: true, ...(process.env.COURSE_TEST_CHANNEL ? { channel: process.env.COURSE_TEST_CHANNEL } : {}) });
const origin = process.env.COURSE_TEST_URL ?? 'http://localhost:3000';
const failures = [];
const activeContexts = new Set();
async function fixture(options = {}) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, ...options });
  activeContexts.add(context);
  const page = await context.newPage();
  await page.bringToFront();
  page.setDefaultTimeout(10000);
  let order = structuredClone(defaultOrder);
  let supplementary = withSupplementaryDefaults({ version: 1, revision: 0, videos: [{ id: 'drag-test-support', videoId: 'abcdefghijk', title: 'Drag test supporting video', instructor: 'Test instructor', moduleId: section.moduleId, anchorId: first, position: 'after', archived: false, updatedAt: '' }] });
  const writes = [];
  const errors = [];
  let reject = false;
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/api/course-order', async route => {
    if (route.request().method() === 'POST') {
      const data = route.request().postDataJSON(); writes.push({ api: 'core', data });
      if (reject) {
        order = moveLesson(order, { lessonId: second, sectionId: section.id, beforeId: null });
        return route.fulfill({ status: 409, json: { error: 'The course changed. Review the latest order.', order } });
      }
      order = moveLesson(order, data);
    }
    await route.fulfill({ json: order });
  });
  await page.route('**/api/supplementary', async route => {
    if (route.request().method() === 'POST') {
      const data = route.request().postDataJSON(); writes.push({ api: 'supplementary', data });
      if (reject) return route.fulfill({ status: 503, json: { error: 'Test storage failure. Nothing saved.' } });
      supplementary = { ...supplementary, revision: supplementary.revision + 1, videos: supplementary.videos.map(v => v.id === data.id ? { ...v, moduleId: data.moduleId, anchorId: data.anchorId, position: data.position } : v) };
    }
    await route.fulfill({ json: supplementary });
  });
  await page.route('**/*youtube*/*', route => route.abort());
  await page.goto(origin);
  await page.getByRole('button', { name: 'Start the course', exact: true }).click();
  if (options.isMobile) await page.getByRole('button', { name: 'Open course map', exact: true }).click();
  await page.locator(`[data-drag-handle="${first}"]`).waitFor();
  await page.waitForFunction(id => !document.querySelector(`[data-drag-handle="${id}"]`)?.disabled, first);
  return { page, context, writes, errors, reject: () => { reject = true; }, order: () => order };
}
async function drag(page, id, targetId) {
  const handle = page.locator(`[data-drag-handle="${id}"]`);
  await handle.scrollIntoViewIfNeeded();
  const start = await handle.boundingBox();
  await page.mouse.move(start.x + start.width / 2, start.y + 20);
  await page.mouse.down();
  await page.mouse.move(start.x + start.width / 2 + 8, start.y + 20, { steps: 3 });
  await page.locator('.course-drag-overlay').waitFor();
  await page.locator(`[data-course-row="${targetId}"]`).evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const target = await page.locator(`[data-course-row="${targetId}"]`).boundingBox();
  await page.mouse.move(target.x + target.width * .7, target.y + target.height * .8, { steps: 12 });
  await page.mouse.up();
}
async function test(name, run) {
  if (process.env.COURSE_TEST_FILTER && !name.includes(process.env.COURSE_TEST_FILTER)) return;
  try { await run(); console.log(`PASS ${name}`); }
  catch (error) { failures.push(name); console.error(`FAIL ${name}: ${error.stack}`); }
  finally { for (const context of activeContexts) await context.close(); activeContexts.clear(); }
}
try {
  await test('mouse preview, safe focus, cancellation and no video click', async () => {
    const f = await fixture();
    const title = await f.page.locator('.lesson-canvas h1').textContent();
    await drag(f.page, first, third);
    const dialog = f.page.getByRole('dialog', { name: 'Move this video?' });
    await dialog.waitFor();
    assert.equal(f.writes.length, 0);
    assert.equal(await f.page.evaluate(() => document.activeElement.textContent), 'Cancel');
    assert.equal(await f.page.locator('.lesson-canvas h1').textContent(), title);
    await f.page.screenshot({ path: 'work/course-drag-review.png' });
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.equal(f.writes.length, 0);
    assert.equal(await f.page.locator('.course-draggable-row').first().getAttribute('data-course-row'), first);
    assert.deepEqual(f.errors, []);
    await f.context.close();
  });
  await test('confirmed core move matches frozen visual preview', async () => {
    const f = await fixture();
    await drag(f.page, first, third);
    const dialog = f.page.getByRole('dialog', { name: 'Move this video?' }); await dialog.waitFor();
    const preview = await f.page.locator('.course-draggable-row.core').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow));
    await dialog.getByRole('button', { name: 'Confirm move', exact: true }).click();
    await dialog.waitFor({ state: 'detached' });
    assert.equal(f.writes.length, 1); assert.equal(f.writes[0].data.lessonId, first);
    assert.deepEqual(await f.page.locator('.course-draggable-row.core').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow)), preview);
    await f.context.close();
  });
  await test('keyboard pickup, movement, review and Escape cancellation', async () => {
    const f = await fixture();
    await f.page.locator(`[data-drag-handle="${first}"]`).focus();
    await f.page.keyboard.press('Space');
    await f.page.locator('.course-drag-overlay').waitFor();
    await f.page.waitForTimeout(100);
    await f.page.keyboard.press('ArrowDown'); await f.page.keyboard.press('ArrowDown');
    await f.page.keyboard.press('Escape');
    await f.page.locator('.course-drag-overlay').waitFor({ state: 'detached' });
    assert.equal(f.writes.length, 0);
    assert.equal(await f.page.locator('.course-draggable-row').first().getAttribute('data-course-row'), first);
    await f.page.keyboard.press('Space');
    await f.page.waitForTimeout(100);
    for (let i = 0; i < 3; i++) { await f.page.keyboard.press('ArrowDown'); await f.page.waitForTimeout(200); }
    await f.page.keyboard.press('Space');
    await f.page.getByRole('dialog', { name: 'Move this video?' }).waitFor();
    await f.page.keyboard.press('Escape');
    assert.equal(f.writes.length, 0);
    await f.context.close();
  });
  await test('revision conflict reconciles without losing or duplicating a lesson', async () => {
    const f = await fixture(); f.reject();
    await drag(f.page, first, third);
    const dialog = f.page.getByRole('dialog', { name: 'Move this video?' }); await dialog.waitFor();
    await dialog.getByRole('button', { name: 'Confirm move' }).click(); await dialog.waitFor({ state: 'detached' });
    const actual = await f.page.locator('.course-draggable-row.core').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow));
    assert.deepEqual(actual, orderedSections(f.order()).filter(s => s.moduleId === section.moduleId).flatMap(s => s.lessonIds));
    assert.equal(new Set(actual).size, actual.length); assert.equal(f.writes.length, 1);
    assert.match(await f.page.locator('.course-drag-error').textContent(), /course changed/);
    await f.context.close();
  });
  await test('supplementary confirmation supplies server guard and preserves metadata', async () => {
    const f = await fixture();
    await drag(f.page, 'drag-test-support', third);
    const dialog = f.page.getByRole('dialog', { name: 'Move this video?' }); await dialog.waitFor();
    assert.equal(f.writes.length, 0);
    const preview = await f.page.locator('.course-draggable-row').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow));
    await dialog.getByRole('button', { name: 'Confirm move' }).click(); await dialog.waitFor({ state: 'detached' });
    assert.equal(f.writes.length, 1); assert.equal(f.writes[0].data.confirmation, 'EDIT VIDEO');
    assert.equal(f.writes[0].data.title, 'Drag test supporting video'); assert.equal(f.writes[0].data.instructor, 'Test instructor');
    assert.deepEqual(await f.page.locator('.course-draggable-row').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow)), preview);
    await f.context.close();
  });
  await test('supplementary failure restores the original list', async () => {
    const f = await fixture(); f.reject();
    const original = await f.page.locator('.course-draggable-row').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow));
    await drag(f.page, 'drag-test-support', third);
    const dialog = f.page.getByRole('dialog', { name: 'Move this video?' }); await dialog.waitFor();
    await dialog.getByRole('button', { name: 'Confirm move' }).click(); await dialog.waitFor({ state: 'detached' });
    assert.deepEqual(await f.page.locator('.course-draggable-row').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow)), original);
    await f.context.close();
  });
  await test('cross-module hover expansion and exact confirmed destination', async () => {
    const f = await fixture();
    const handle = f.page.locator(`[data-drag-handle="${first}"]`); await handle.scrollIntoViewIfNeeded();
    const start = await handle.boundingBox();
    await f.page.mouse.move(start.x + 15, start.y + 20); await f.page.mouse.down(); await f.page.mouse.move(start.x + 24, start.y + 20);
    await f.page.locator('.course-drag-overlay').waitFor();
    const targetSection = orderedSections(defaultOrder).find(s => s.moduleId !== section.moduleId);
    const targetModule = f.page.locator(`[data-course-module="${targetSection.moduleId}"]`);
    await targetModule.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const moduleRect = await targetModule.boundingBox();
    await f.page.mouse.move(moduleRect.x + 90, moduleRect.y + 25);
    await f.page.waitForFunction(id => document.querySelector(`[data-course-module="${id}"] .module-accordion`)?.classList.contains('open'), targetSection.moduleId);
    const group = f.page.locator(`[data-course-section="${targetSection.id}"]`); await group.scrollIntoViewIfNeeded();
    const groupRect = await group.boundingBox();
    await f.page.mouse.move(groupRect.x + 70, groupRect.y + 25);
    await f.page.waitForFunction(id => document.querySelector(`[data-course-section="${id}"] details`)?.open, targetSection.id);
    await f.page.mouse.move(groupRect.x + 75, groupRect.y + 28);
    await f.page.mouse.up();
    const dialog = f.page.getByRole('dialog', { name: 'Move this video?' }); await dialog.waitFor();
    assert.equal(f.writes.length, 0);
    assert.ok(await f.page.locator(`[data-course-section="${targetSection.id}"] [data-course-row="${first}"]`).count());
    await dialog.getByRole('button', { name: 'Confirm move' }).click(); await dialog.waitFor({ state: 'detached' });
    assert.equal(f.writes[0].data.sectionId, targetSection.id);
    await f.context.close();
  });
  await test('invalid outside drop and reduced-motion cancellation are safe', async () => {
    const f = await fixture({ reducedMotion: 'reduce' });
    const handle = f.page.locator(`[data-drag-handle="${first}"]`); await handle.scrollIntoViewIfNeeded();
    const start = await handle.boundingBox();
    await f.page.mouse.move(start.x + 15, start.y + 20); await f.page.mouse.down(); await f.page.mouse.move(start.x + 25, start.y + 20);
    await f.page.locator('.course-drag-overlay').waitFor();
    await f.page.mouse.move(1200, 200); await f.page.mouse.up();
    assert.equal(f.writes.length, 0); assert.equal(await f.page.locator('.course-drag-dialog').count(), 0);
    assert.equal(await f.page.locator('.course-draggable-row').first().getAttribute('data-course-row'), first);
    await f.context.close();
  });
  await test('mobile long press, drawer protection, confirmation and cancellation', async () => {
    const f = await fixture({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const cdp = await f.context.newCDPSession(f.page);
    const handle = f.page.locator(`[data-drag-handle="${first}"]`); await handle.scrollIntoViewIfNeeded();
    const start = await handle.boundingBox(); const x = start.x + 20, y = start.y + 20;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    await f.page.waitForTimeout(350);
    await f.page.locator('.course-drag-overlay').waitFor();
    await f.page.locator(`[data-course-row="${second}"]`).evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
    const target = await f.page.locator(`[data-course-row="${second}"]`).boundingBox();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: target.x + 80, y: target.y + target.height * .7 }] });
    await f.page.waitForTimeout(100);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    const dialog = f.page.getByRole('dialog', { name: 'Move this video?' }); await dialog.waitFor();
    assert.equal(f.writes.length, 0); assert.ok(await f.page.locator('.course-map.drawer-open').count());
    await f.page.screenshot({ path: 'work/course-drag-mobile.png' });
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).tap();
    assert.equal(f.writes.length, 0); assert.ok(await f.page.locator('.course-map.drawer-open').count());
    await f.context.close();
  });
  await test('mobile scrolling before the hold threshold does not start dragging', async () => {
    const f = await fixture({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    const cdp = await f.context.newCDPSession(f.page);
    const handle = f.page.locator(`[data-drag-handle="${first}"]`); await handle.scrollIntoViewIfNeeded();
    const r = await handle.boundingBox();
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x + 20, y: r.y + 20 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: r.x + 20, y: r.y - 40 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await f.page.waitForTimeout(300);
    assert.equal(await f.page.locator('.course-drag-overlay').count(), 0); assert.equal(f.writes.length, 0);
    await f.context.close();
  });
  await test('edge auto-scroll starts near the edge and stops when leaving it', async () => {
    const f = await fixture();
    const handle = f.page.locator(`[data-drag-handle="${first}"]`); await handle.scrollIntoViewIfNeeded();
    const start = await handle.boundingBox();
    await f.page.mouse.move(start.x + 15, start.y + 20); await f.page.mouse.down(); await f.page.mouse.move(start.x + 24, start.y + 20);
    await f.page.locator('.course-drag-overlay').waitFor();
    const map = f.page.locator('.course-map'); const rect = await map.boundingBox();
    const before = await map.evaluate(node => node.scrollTop);
    await f.page.mouse.move(rect.x + 110, rect.y + rect.height - 12);
    await f.page.waitForFunction(value => document.querySelector('.course-map').scrollTop > value + 25, before);
    await f.page.mouse.move(rect.x + 110, rect.y + rect.height / 2);
    await f.page.waitForTimeout(120);
    const stopped = await map.evaluate(node => node.scrollTop);
    await f.page.waitForTimeout(200);
    assert.ok(Math.abs(await map.evaluate(node => node.scrollTop) - stopped) < 3);
    await f.page.keyboard.press('Escape'); await f.page.mouse.up(); assert.equal(f.writes.length, 0);
    await f.context.close();
  });
} finally { await browser.close(); }
assert.deepEqual(failures, [], 'Browser scenarios must all pass');
