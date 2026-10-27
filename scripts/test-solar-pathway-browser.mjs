import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model, origin, revealCourseModule, openCourseTools } from './personal-course-browser-fixture.mjs';
const update = JSON.parse(readFileSync('app/solar-pathway-update.json', 'utf8'));
const prior = JSON.parse(readFileSync('scripts/fixtures/solar-pathway-previous.json', 'utf8'));
const catalog = model.personalCourseSnapshot(model.publishedPersonalCourse).course;
const lessons = catalog.modules.filter(m => m.path === 'Solar').flatMap(m => m.lessons);
try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, guest: true }), { page } = f;
    if (mobile) await page.setViewportSize({ width: 320, height: 740 });
    if (mobile) await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
    await page.getByRole('button', { name: 'Course overview', exact: true }).click();
    await page.getByRole('group', { name: 'Filter course pathway' }).getByRole('button', { name: 'Solar · T1–T3', exact: true }).click();
    assert.equal(await page.locator('.curriculum-modules > details').count(), 3);
    await page.getByRole('button', { name: 'Expand all', exact: true }).click();
    assert.equal(await page.locator('.curriculum-lessons button:visible').count(), 26);
    await page.locator('.curriculum-lessons button').first().click();
    await page.locator('.lesson-canvas h1').filter({ hasText: lessons[0].title }).waitFor();
    assert.equal(await page.locator('.course-path-select select').inputValue(), 'Solar');
    for (const [index, lesson] of lessons.entries()) {
      await page.locator('.lesson-canvas h1').filter({ hasText: lesson.title }).waitFor();
      assert.match(await page.locator('.lesson-canvas iframe').getAttribute('src'), new RegExp('/embed/' + lesson.videoId));
      assert.equal(await page.locator('.lesson-section-introduction').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (index === 0) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: 'work/editor-preview/solar-' + (mobile ? 'mobile' : 'desktop') + '-player.png' });
      }
      if (index < lessons.length - 1) await page.locator('.lesson-canvas .inline-player-controls').getByRole('button', { name: 'Next lesson', exact: true }).click();
    }
    if (mobile) await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    await revealCourseModule(page, 'solar-t3');
    if (mobile) await page.waitForFunction(() => document.querySelector('.course-map').getBoundingClientRect().left >= -1);
    const t3 = page.locator('[data-course-module="solar-t3"]');
    assert.equal(await t3.locator('[data-course-section]').count(), 3);
    assert.deepEqual(await t3.locator('[data-course-section="solar-t3-spirit-project"] [data-course-row]').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow)), update.current['solar-t3-spirit-project']);
    await page.screenshot({ path: 'work/editor-preview/solar-' + (mobile ? 'mobile' : 'desktop') + '-map.png' });
    assert.equal(f.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0);
    assert.equal(f.writes.length, 0); assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log('PASS ' + (mobile ? '320px phone' : 'desktop') + ': public Solar filter, 26 embeds and continuous stage navigation, project order, no notes, overflow or guest tracking.');
  }
  const f = await fixture({ state: prior });
  await f.page.goto(origin + '/#learn/' + lessons[0].id);
  await f.page.reload();
  await f.page.locator('.lesson-canvas h1').filter({ hasText: lessons[0].title }).waitFor();
  await f.page.locator('.course-editor-toolbar').waitFor({ state: 'attached' });
  await revealCourseModule(f.page, 'solar-t1');
  assert.deepEqual(await f.page.locator('[data-course-module="solar-t1"] [data-course-row]').evaluateAll(nodes => nodes.map(n => n.dataset.courseRow)), lessons.slice(0, 3).map(l => l.id));
  await f.page.locator('.lesson-canvas').getByRole('button', { name: 'Actions for ' + lessons[0].title, exact: true }).click();
  await f.page.getByRole('menuitem', { name: 'Move to…', exact: true }).click();
  const dialog = f.page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Browse pathways and modules', exact: true }).click();
  await dialog.locator('.editor-browse-filters select').nth(0).selectOption('Solar');
  assert.equal(await dialog.locator('.editor-section-results button').count(), 9);
  assert.match(await dialog.locator('.editor-browse-filters select').nth(1).innerText(), /Module 01 — T1/);
  await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
  await openCourseTools(f.page);
  await f.page.getByRole('button', { name: 'Organise', exact: true }).click();
  assert.deepEqual(await f.page.locator('[data-course-path]').evaluateAll(nodes => nodes.map(n => n.dataset.coursePath)), ['C2', 'C1', 'Solar', 'Professional']);
  await f.page.setViewportSize({ width: 320, height: 740 });
  if (!await f.page.locator('.course-map.drawer-open').count()) await f.page.getByRole('button', { name: 'Open course map', exact: true }).click();
  assert.equal(await f.page.locator('.course-path-switcher').evaluate(node => getComputedStyle(node).gridTemplateColumns.split(' ').length), 2);
  assert.equal(await f.page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(f.state(), prior); assert.equal(f.writes.length, 0); assert.deepEqual(f.errors, []);
  await f.context.close();
  console.log('PASS saved revision-14 account: Solar appears, all nine editor destinations and four Organise pathways are available, phone controls fit, and the stored course arrangement stays unchanged.');
} finally { await browser.close(); }
