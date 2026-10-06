import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model, origin } from './personal-course-browser-fixture.mjs';
const sections = JSON.parse(readFileSync('app/learning-sections.json', 'utf8'));
const update = JSON.parse(readFileSync('app/connected-process-update.json', 'utf8'));
const view = model.personalCourseSnapshot(model.publishedPersonalCourse);
async function visit(page, id) {
  await page.goto(origin + '/#learn/' + id); await page.reload();
  await page.locator('.lesson-canvas h1').filter({ hasText: view.byId.get(id).title }).waitFor();
}
async function openMap(page) {
  if (await page.evaluate(() => matchMedia('(max-width:1180px)').matches) && !await page.locator('.course-map.drawer-open').count()) {
    await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.course-map').getBoundingClientRect().left >= -1);
  }
}
// Public rendering is checked here. Saved-account order, notes and watched marks
// are covered by test-connected-process and test-personal-course-api.
try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, guest: true }), { page } = f;
    if (mobile) await page.setViewportSize({ width: 320, height: 740 });
    for (const [index, number] of [7, 8, 9].entries()) {
      const section = sections.find(section => section.id === update.sectionIds[index]);
      const firstId = section.lessonIds[0];
      await visit(page, firstId); await openMap(page);
      const courseModule = page.locator('.module-accordion').filter({ has: page.locator(`[data-course-section="${section.id}"]`) });
      const actualSections = await courseModule.locator('[data-course-section]').evaluateAll(elements => elements.map(element => element.dataset.courseSection));
      assert.equal(actualSections[0], section.id, 'The connected sequence opens its module');
      assert.deepEqual(await courseModule.locator(`[data-course-section="${section.id}"] [data-course-row]`).evaluateAll(rows => rows.map(row => row.dataset.courseRow)), section.lessonIds);
      assert.deepEqual(await courseModule.locator('[data-course-row]').evaluateAll(rows => rows.map(row => row.dataset.courseRow)), view.allRows.filter(row => row.moduleId === section.moduleId).map(row => row.id), 'Existing sections follow in their saved order');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      assert.equal(await page.locator('.lesson-section-introduction').textContent(), section.description);
      await courseModule.locator(`[data-course-section="${section.id}"] summary`).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `work/editor-preview/process-module-${number}-${mobile ? 'mobile' : 'desktop'}.png` });
      if (mobile) {
        await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
        await page.screenshot({ path: `work/editor-preview/process-module-${number}-mobile-video.png` });
      }
    }
    for (const [id, videoId] of [['c2-verification-overview-08', 'zIPgYcLdQZE'], ['c2-verification-overview-09', 'ZaAUg75BR5Y'], ['c2-assembly-overview-02', 'dlkxzIQFvrk'], ['c2-fault-tracing-overview-03', 'Alz8iTv951k']]) {
      await visit(page, id);
      assert.match(await page.locator('.lesson-canvas iframe').getAttribute('src'), new RegExp('/embed/' + videoId));
    }
    assert.equal(f.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0, 'Guest viewing does not request learning records');
    assert.equal(f.writes.length, 0);
    assert.deepEqual(f.errors, []); await f.context.close();
    console.log(`PASS ${mobile ? '320px mobile' : 'desktop'}: three opening sections, exact sequence and players, concise introductions, no overflow and no guest tracking.`);
  }
} finally { await browser.close(); }
