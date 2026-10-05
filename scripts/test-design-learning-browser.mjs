import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model, origin } from './personal-course-browser-fixture.mjs';
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const previous = JSON.parse(readFileSync('scripts/fixtures/design-learning-previous.json', 'utf8'));
const state = structuredClone(previous);
const personal = { id: 'personal-design-afdd', videoId: 'QUC17Kju4ug', title: 'My AFDD lesson', instructor: 'eFIXX', moduleId: 'module-05', anchorId: 'course-lIit5k8QVj8', position: 'after', archived: false, placementRevision: 3, updatedAt: '2026-10-02T00:00:00Z', durationSeconds: 369 };
state.videos.push(personal); state.groups['module-05-arc-fault'].push(personal.id);
const view = model.personalCourseSnapshot(model.parsePersonalCourse(state));
const overviewId = 'module-06-efixx-overview';
const learner = { ...initialLearnerState, activeLessonId: 'c2-design-overview-01', completedLessonIds: ['p06-l02'], bookmarkedLessonIds: ['p06-l02'], notes: { 'p06-l02': 'My original design-current notes' }, autoNextEnabled: false };
async function openMap(page) {
  if (await page.evaluate(() => matchMedia('(max-width:1180px)').matches) && !await page.locator('.course-map.drawer-open').count()) {
    await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.course-map').getBoundingClientRect().left >= -1);
  }
}
async function visit(page, id) {
  await page.goto(origin + '/#learn/' + id); await page.reload();
  await page.locator('.lesson-canvas h1').filter({ hasText: view.byId.get(id).title }).waitFor();
}
try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, state, learner, supplementaryProgress: ['QUC17Kju4ug'] }), { page } = f;
    if (mobile) await page.setViewportSize({ width: 320, height: 740 });
    await visit(page, 'c2-design-overview-01'); await openMap(page);
    const module6 = page.locator('.module-accordion').filter({ hasText: 'Load Assessment and Single-Phase Circuit Design' }).first();
    await module6.locator('[data-course-row="c2-design-overview-10"]').waitFor();
    assert.deepEqual(await module6.locator('[data-course-row]').evaluateAll(rows => rows.map(row => row.dataset.courseRow)), view.allRows.filter(r => r.moduleId === 'module-06').map(r => r.id));
    assert.equal(await module6.locator('.section-title').count(), 11);
    const overview = page.locator(`[data-course-section="${overviewId}"]`);
    assert.equal(await overview.locator('[data-course-row]').count(), 10);
    assert.match(await overview.locator('.course-section-description').textContent(), /Watch Parts 1 and 2 in order/);
    assert.match(await page.locator('.lesson-section-introduction').textContent(), /Watch Parts 1 and 2 in order/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (mobile) await overview.locator('summary').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `work/editor-preview/design-learning-${mobile ? 'mobile' : 'desktop'}.png`, fullPage: true });
    if (mobile) {
      await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
      await page.screenshot({ path: 'work/editor-preview/design-learning-mobile-video.png', fullPage: true });
    }
    for (const [id, videoId] of [['c2-design-overview-01', '42qk0TSwbAs'], ['c2-design-overview-07', 'q3rSnVEJ7kA'], ['c2-design-overview-08', 'GKdW9H_5NA4'], ['c2-design-overview-10', 'QUC17Kju4ug']]) {
      await visit(page, id);
      assert.match(await page.locator('.lesson-canvas iframe').getAttribute('src'), new RegExp('/embed/' + videoId));
    }
    await visit(page, 'p06-l02');
    assert.ok(f.learner().completedLessonIds.includes('p06-l02'));
    assert.ok(f.learner().bookmarkedLessonIds.includes('p06-l02'));
    assert.equal(f.learner().notes['p06-l02'], 'My original design-current notes');
    assert.ok(!f.learner().completedLessonIds.includes('c2-design-overview-02'), 'The repeat has independent watched progress');
    await visit(page, 'p03-l12'); await openMap(page);
    const module7 = page.locator('.module-accordion').filter({ hasText: 'Consumer Units: Assembly and Pre-Commissioning' }).first();
    assert.equal(await module7.locator('.section-title').count(), 3);
    assert.deepEqual(await module7.locator('[data-course-row]').evaluateAll(rows => rows.map(row => row.dataset.courseRow)), ['course-BeoujaqN-68', 'p02-l10', 'p03-l13', 'p03-l12']);
    assert.ok(view.byId.has(personal.id));
    assert.equal(f.writes.length, 0, 'Reading and navigation do not write the personal course');
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log(`PASS ${mobile ? '320px mobile' : 'desktop'}: 34 Module 6 videos, ten-video overview, three Module 7 sections, correct players, notes/progress preservation and no course writes.`);
  }
  const guest = await fixture({ guest: true });
  await visit(guest.page, 'c2-design-overview-01');
  assert.equal(await guest.page.locator('[data-course-section="module-06-efixx-overview"] [data-course-row]').count(), 10);
  assert.equal(guest.reads.filter(p => /personal-course|learner-state/.test(p)).length, 0);
  assert.deepEqual(guest.errors, []); await guest.context.close();
  console.log('PASS guest: full overview available without account requests.');
} finally { await browser.close(); }
