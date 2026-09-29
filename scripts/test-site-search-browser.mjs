import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.EPRA_TEST_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('work/search-verification', { recursive: true });
const trigger = () => page.getByRole('button', { name: 'Search lessons and definitions', exact: true });
const search = () => page.getByRole('textbox', { name: 'Search lessons and definitions' });

try {
  for (const route of ['/', '/#learn', '/#books', '/practice', '/privacy', '/terms', '/install']) {
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    assert.ok(await trigger().isVisible(), `Search is available at ${route}`);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    assert.ok((await trigger().boundingBox()).y < 150, `Search stays at the top at ${route}`);
    await trigger().click();
    await search().fill('cpc');
    assert.match(await page.locator('.site-search-result').first().textContent(), /Circuit protective conductor/);
    await search().press('ArrowDown');
    await page.keyboard.press('Enter');
    const reading = page.locator('.site-search-reading');
    await reading.waitFor();
    assert.match(await reading.textContent(), /CPC — circuit protective conductor/);
    assert.equal(new URL(page.url()).pathname, new URL(`${base}${route}`).pathname, 'Reading a definition does not leave the page');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('dialog[open]').count(), 0);
    assert.ok(await trigger().evaluate(element => element === document.activeElement), 'Focus returns to search');
  }

  await page.goto(`${base}/practice`, { waitUntil: 'networkidle' });
  await page.locator('.epra-collection').first().click();
  const textarea = page.locator('textarea').first();
  await textarea.fill('Keep my practice working while I look up a term.');
  await trigger().click();
  await search().fill('earthing conductor');
  await page.locator('.site-search-result').first().click();
  await page.getByRole('button', { name: 'Close search', exact: true }).click();
  assert.equal(await textarea.inputValue(), 'Keep my practice working while I look up a term.');
  await textarea.fill('');

  await page.goto(`${base}/practice?definition=definition-50`, { waitUntil: 'networkidle' });
  const detail = page.locator('.epra-definition-detail');
  assert.equal(await detail.evaluate(element => getComputedStyle(element).display), 'grid', 'Wide definitions use the available width');
  assert.equal(await page.locator('.epra-hero').count(), 0, 'Definitions start at the reference workspace');
  await page.screenshot({ path: 'work/search-verification/definitions-desktop.png', fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ colorScheme: 'dark' });
  assert.notEqual(await detail.evaluate(element => getComputedStyle(element).display), 'grid');
  await trigger().click();
  await search().fill('RCD');
  await page.screenshot({ path: 'work/search-verification/search-mobile.png' });
  await page.locator('.site-search-result').first().click();
  await page.screenshot({ path: 'work/search-verification/reading-mobile.png' });
  assert.ok(await page.locator('.site-search-dialog').evaluate(element => element.scrollWidth <= element.clientWidth + 1), 'Mobile search has no horizontal overflow');
  await page.keyboard.press('Escape');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
  assert.deepEqual(errors, []);
  console.log('Global search: every page, sticky placement, keyboard, inline reading, practice preservation and responsive definition layout pass.');
} finally {
  await browser.close();
}
