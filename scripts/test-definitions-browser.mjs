import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.EPRA_TEST_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch({ channel: process.env.EPRA_BROWSER || 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));

try {
  await page.goto(`${base}/practice`, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Definitions', exact: true }).click();
  assert.equal(await page.locator('.epra-definition-row').count(), 138);
  assert.equal(await page.locator('.epra-definition-group').count(), 6);
  assert.equal(await page.locator('.epra-definition-group[open]').count(), 0, 'Learning areas start compact');
  await page.locator('.epra-definition-group > summary').nth(0).click();
  await page.locator('.epra-definition-group > summary').nth(1).click();
  assert.equal(await page.locator('.epra-definition-group[open]').count(), 1, 'Only one learning area stays open');

  const search = page.getByRole('textbox', { name: 'Search definitions' });
  await search.fill('cpc');
  const cpc = page.getByRole('button', { name: /Circuit protective conductor \(cpc\)/ });
  await cpc.click();
  assert.match(await page.getByRole('region', { name: 'Circuit protective conductor (cpc) definition' }).textContent(), /connecting exposed-conductive-parts of equipment to the main earthing terminal/);
  assert.equal(await page.locator('.epra-definition-source').count(), 0);
  assert.match(await page.getByRole('region', { name: 'Circuit protective conductor (cpc) definition' }).textContent(), /CPC — circuit protective conductor/);

  await search.fill('earthing conductor');
  await page.locator('.epra-definition-trigger').filter({ hasText: /^Earthing conductor/ }).click();
  assert.match(await page.getByRole('region', { name: 'Earthing conductor definition' }).textContent(), /main earthing terminal of an installation to an earth electrode/);

  await search.fill('TN-C-S');
  await page.locator('.epra-definition-trigger').filter({ hasText: /^TN-C-S system/ }).click();
  assert.match(await page.getByRole('region', { name: 'TN-C-S system definition' }).textContent(), /neutral and protective functions are combined/);

  await search.fill('Zs');
  await page.locator('.epra-definition-trigger').filter({ hasText: /^Earth fault loop impedance/ }).click();
  assert.ok(await page.getByRole('region', { name: 'Earth fault loop impedance definition' }).locator('.katex').count() > 0, 'Subscript is rendered');

  await search.fill('triplen');
  await page.locator('.epra-definition-trigger').filter({ hasText: /^Triplen harmonics/ }).click();
  assert.ok(await page.getByRole('region', { name: 'Triplen harmonics definition' }).locator('.katex').count() > 0, 'Superscripts are rendered');

  await search.fill('');
  await page.getByLabel('Learning area').selectOption('Earthing, bonding and shock protection');
  assert.ok(await page.locator('.epra-definition-row').count() < 138);
  await page.getByRole('button', { name: 'Topic practice' }).click();
  assert.equal(await page.locator('.epra-collection').count(), 7);
  const topicSearch = page.getByRole('textbox', { name: 'Search topic questions' });
  await topicSearch.fill('RCD');
  assert.ok(await page.locator('.epra-definition-result').count() > 0, 'Definitions are surfaced outside the Definitions tab');
  await page.locator('.epra-definition-result').filter({ hasText: 'Residual current device (RCD)' }).first().click();
  assert.equal(await page.getByRole('button', { name: 'Definitions', exact: true }).getAttribute('aria-pressed'), 'true');
  assert.match(await page.getByRole('region', { name: 'Residual current device (RCD) definition' }).textContent(), /RCCB = residual-current protection/);

  await page.goto(`${base}/practice?definition=definition-50`, { waitUntil: 'networkidle' });
  assert.match(await page.getByRole('region', { name: 'Circuit protective conductor (cpc) definition' }).textContent(), /CPC — circuit protective conductor/);

  await page.getByRole('button', { name: 'Definitions', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'Mobile viewport has no horizontal overflow');
  assert.deepEqual(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length })), { local: 0, session: 0 });
  assert.deepEqual(errors, []);
  console.log('Definitions browser: live search, exact entries, groups, tab return, mobile width and guest storage pass.');
} finally {
  await browser.close();
}
