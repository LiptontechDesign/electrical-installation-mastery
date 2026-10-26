import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model, origin, revealCourseModule } from './personal-course-browser-fixture.mjs';

const update = JSON.parse(readFileSync('app/c1-motor-practical-update.json', 'utf8'));
const prior = JSON.parse(readFileSync('scripts/fixtures/c1-motor-practical-previous.json', 'utf8'));
const published = model.personalCourseSnapshot(model.publishedPersonalCourse);
const core = new Map(published.course.modules.flatMap(m => m.lessons).map(l => [l.id, l]));
async function visit(page, id) {
  await page.goto(origin + '/#learn/' + id);
  await page.reload();
  await page.locator('.lesson-canvas h1').filter({ hasText: core.get(id).title }).waitFor();
}
try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, guest: true }), { page } = f;
    if (mobile) await page.setViewportSize({ width: 320, height: 740 });
    for (const id of update.addedLessonIds) {
      await visit(page, id);
      assert.match(await page.locator('.lesson-canvas iframe').getAttribute('src'), new RegExp('/embed/' + core.get(id).videoId));
      assert.equal(await page.locator('.lesson-section-introduction').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    }
    await visit(page, update.addedLessonIds[0]);
    if (mobile && !await page.locator('.course-map.drawer-open').count()) await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    await revealCourseModule(page, 'module-07');
    for (const sectionId of update.addedSectionIds) {
      const section = page.locator('[data-course-section="' + sectionId + '"]');
      assert.deepEqual(await section.locator('[data-course-row]').evaluateAll(elements => elements.map(e => e.dataset.courseRow)), update.current[sectionId]);
    }
    if (mobile) await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
    for (const id of update.addedLessonIds.slice(0, 3)) {
      await page.locator('.lesson-canvas h1').filter({ hasText: core.get(id).title }).waitFor();
      await page.locator('.lesson-canvas .inline-player-controls').getByRole('button', { name: 'Next lesson', exact: true }).click();
    }
    await page.locator('.lesson-canvas h1').filter({ hasText: core.get('c1-autotransformer-starter').title }).waitFor();
    await visit(page, 'c1-vfd-soft-starter-selection');
    await page.locator('.lesson-canvas .inline-player-controls').getByRole('button', { name: 'Next lesson', exact: true }).click();
    await page.locator('.lesson-canvas h1').filter({ hasText: core.get('p07-vfd').title }).waitFor();
    await page.screenshot({ path: 'work/editor-preview/motor-practical-' + (mobile ? 'mobile' : 'desktop') + '.png' });
    assert.equal(f.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0);
    assert.equal(f.writes.length, 0);
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log('PASS ' + (mobile ? '320px phone' : 'desktop') + ': five embeds, three sections, cross-section Next, no new notes, no overflow or guest tracking.');
  }
  const f = await fixture({ state: prior });
  await visit(f.page, update.addedLessonIds[0]);
  await revealCourseModule(f.page, 'module-07');
  for (const [id, ids] of Object.entries(update.current)) {
    const rows = await f.page.locator('[data-course-section="' + id + '"] [data-course-row]').evaluateAll(elements => elements.map(element => element.dataset.courseRow));
    assert.deepEqual(rows, ids, 'The saved account sees each new section in the rendered course');
  }
  assert.deepEqual(f.state(), prior, 'Viewing additions leaves the stored account snapshot unchanged');
  assert.equal(f.writes.length, 0);
  assert.deepEqual(f.errors, []);
  await f.context.close();
  console.log('PASS saved revision-14 account: additions appear without edits to existing groups or account writes.');
} finally {
  await browser.close();
}
