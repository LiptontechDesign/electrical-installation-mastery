import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.PWA_TEST_URL || 'http://127.0.0.1:3002';
const context = await chromium.launchPersistentContext('', { channel: 'msedge', headless: true, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('work/pwa-verification', { recursive: true });
try {
  await page.goto(base + '/install', { waitUntil: 'networkidle' });
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  const manifest = await (await context.request.get(base + '/manifest.webmanifest')).json();
  assert.equal(manifest.display, 'standalone');
  assert.equal(manifest.scope, '/');
  assert.equal(manifest.icons.length, 3);
  for (const icon of manifest.icons) {
    const response = await context.request.get(base + icon.src);
    assert.equal(response.status(), 200);
    const png = await response.body();
    const size = Number(icon.sizes.split('x')[0]);
    assert.equal(png.readUInt32BE(16), size); assert.equal(png.readUInt32BE(20), size);
  }
  const worker = await context.request.get(base + '/sw.js');
  assert.match(worker.headers()['cache-control'], /no-store/);
  assert.match(worker.headers()['content-type'], /javascript/);
  const cdp = await context.newCDPSession(page);
  const installability = await cdp.send('Page.getInstallabilityErrors');
  assert.deepEqual(installability.installabilityErrors, [], JSON.stringify(installability));
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Install page fits ' + width);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: 'work/pwa-verification/install-mobile.png', fullPage: true });
  // Exercise prompt states without actually installing software on the test machine.
  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', { cancelable: true });
    event.prompt = async () => {};
    event.userChoice = Promise.resolve({ outcome: 'dismissed' });
    dispatchEvent(event);
  });
  await page.getByRole('button', { name: 'Install Electrical Mastery', exact: true }).click();
  await page.getByRole('status').filter({ hasText: 'Installation cancelled' }).waitFor();
  await page.evaluate(() => dispatchEvent(new Event('appinstalled')));
  await page.locator('.pwa-installed').waitFor();
  await context.setOffline(true);
  await page.goto(base + '/practice', { waitUntil: 'domcontentloaded' });
  await page.getByRole('heading', { name: 'Let’s get you connected.' }).waitFor();
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({ path: 'work/pwa-verification/offline-mobile.png', fullPage: true });
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Try again' }).click();
  await page.waitForLoadState('networkidle');
  assert.equal(await page.getByRole('heading', { name: 'Let’s get you connected.' }).count(), 0);
  assert.match(await page.title(), /Electrical|Practice/i);
  await page.goto(base + '/', { waitUntil: 'networkidle' });
  const stored = await page.evaluate(async () => {
    await fetch('/api/account');
    const names = await caches.keys();
    return { names, urls: await Promise.all(names.map(async name => (await (await caches.open(name)).keys()).map(request => new URL(request.url).pathname))), local: localStorage.length };
  });
  assert.deepEqual(stored.names, ['electrical-offline-v1']);
  assert.deepEqual(stored.urls, [['/offline.html']]);
  assert.equal(stored.local, 0);
  assert.deepEqual(errors, []);
  console.log('PWA browser: Chromium installability, icons, prompt states, responsive layout, real offline/reconnect and public-only cache passed: ' + base);
} finally { await context.close(); }
