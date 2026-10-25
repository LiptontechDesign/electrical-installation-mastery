import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model, origin } from './personal-course-browser-fixture.mjs';

const update = JSON.parse(readFileSync('app/motor-control-update.json', 'utf8'));
const prior = JSON.parse(readFileSync('scripts/fixtures/motor-control-previous.json', 'utf8'));
const published = model.personalCourseSnapshot(model.publishedPersonalCourse);
const core = new Map(published.course.modules.flatMap(module => module.lessons).map(lesson => [lesson.id, lesson]));
const sectionId = update.sectionIds[0], ids = update.addedLessonIds;
async function visit(page, id) {
  await page.goto(origin + '/#learn/' + id);
  await page.reload();
  await page.locator('.lesson-canvas h1').filter({ hasText: core.get(id).title }).waitFor();
}
try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, guest: true }), { page } = f;
    if (mobile) await page.setViewportSize({ width: 320, height: 740 });
    await visit(page, ids[0]);
    if (mobile && !await page.locator('.course-map.drawer-open').count()) await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    const motorModule = page.locator('[data-course-module="module-07"]');
    assert.equal((await motorModule.locator('[data-course-section]').evaluateAll(elements => elements.map(element => element.dataset.courseSection)))[0], sectionId);
    const section = motorModule.locator('[data-course-section="' + sectionId + '"]');
    assert.deepEqual(await section.locator('[data-course-row]').evaluateAll(elements => elements.map(element => element.dataset.courseRow)), ids);
    assert.match(await section.locator('summary').innerText(), /Motor control/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await section.locator('summary').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'work/editor-preview/motor-control-' + (mobile ? 'mobile' : 'desktop') + '-map.png' });
    if (mobile) await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
    for (const id of ids) {
      await page.locator('.lesson-canvas h1').filter({ hasText: core.get(id).title }).waitFor();
      assert.match(await page.locator('.lesson-canvas iframe').getAttribute('src'), new RegExp('/embed/' + core.get(id).videoId));
      assert.equal(await page.locator('.lesson-section-introduction').count(), 0, 'No new notes or explanatory text');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.locator('.lesson-canvas .inline-player-controls').getByRole('button', { name: 'Next lesson', exact: true }).click();
    }
    await page.locator('.lesson-canvas h1').filter({ hasText: core.get('p04-l21').title }).waitFor();
    await page.locator('.lesson-canvas .inline-player-controls').getByRole('button', { name: 'Previous lesson', exact: true }).click();
    await page.locator('.lesson-canvas h1').filter({ hasText: core.get(ids.at(-1)).title }).waitFor();
    await page.screenshot({ path: 'work/editor-preview/motor-control-' + (mobile ? 'mobile' : 'desktop') + '-player.png' });
    assert.equal(f.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0);
    assert.equal(f.writes.length, 0);
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log('PASS ' + (mobile ? '320px mobile' : 'desktop') + ': all 24 embeds in sequence, series/topic boundary and Previous, first section, no added notes, no overflow or guest tracking.');
  }
  const f = await fixture({ state: prior });
  await visit(f.page, ids[0]);
  const rows = await f.page.locator('[data-course-section="' + sectionId + '"] [data-course-row]').evaluateAll(elements => elements.map(element => element.dataset.courseRow));
  assert.deepEqual(rows, ids, 'A saved revision-13 account sees the complete opening section');
  assert.deepEqual(f.state().groups['c1-controls-three-phase-dol'], prior.groups['c1-controls-three-phase-dol']);
  assert.equal(f.writes.length, 0, 'Viewing the new section does not submit a course edit');
  assert.deepEqual(f.errors, []);
  await f.context.close();
  console.log('PASS saved account: revision-13 arrangement gets the new sequence without changing old groups or submitting a course edit.');
} finally {
  await browser.close();
}
