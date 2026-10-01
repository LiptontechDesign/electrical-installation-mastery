import assert from 'node:assert/strict';
import { browser, fixture, model, origin } from './personal-course-browser-fixture.mjs';
import { incompleteEarthingCourse, firstEightEarthingIds } from './fixtures/earthing-incomplete-course.mjs';
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const incomplete = incompleteEarthingCourse(model.publishedPersonalCourse);
const repaired = model.parsePersonalCourse(incomplete);
const snapshot = model.personalCourseSnapshot(repaired);
const coreMarks = [...firstEightEarthingIds.filter(id => !id.startsWith('private-')), 'p05-l06', 'p05-l15', 'p05-l10', 'course-TFt3d77LujQ'];
const privateMarks = incomplete.videos.filter(video => firstEightEarthingIds.includes(video.id)).map(video => video.videoId);
const note = 'My saved CPC calculation note stays attached to its lesson.';
const learner = { ...initialLearnerState, activeLessonId: 'p05-l06', autoNextEnabled: false,
  completedLessonIds: coreMarks, bookmarkedLessonIds: ['p05-l10'], notes: { 'p05-l10': note },
  videoPositions: { GKdW9H_5NA4: 81 }, updatedAt: '2026-09-30T10:00:00Z' };

async function openMap(page) {
  if (await page.evaluate(() => matchMedia('(max-width:1180px)').matches) && !await page.locator('.course-map.drawer-open').count()) {
    await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.course-map').getBoundingClientRect().left >= -1);
  }
}
async function closeMap(page) {
  if (await page.locator('.course-map.drawer-open').count()) await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
}
async function visit(page, id) {
  await page.goto(origin + '/#learn/' + id); await page.reload();
  await page.locator('.lesson-canvas h1').filter({ hasText: snapshot.byId.get(id).title }).waitFor();
  await openMap(page);
  await page.locator('[data-course-row="' + id + '"] button.active').waitFor();
}
async function progress(page, watched) {
  await openMap(page);
  try {
    await page.waitForFunction(({ watched, total }) => document.querySelector('.course-summary > span')?.textContent === watched + '/' + total + ' videos watched',
      { watched, total: snapshot.allRows.length });
  } catch (error) {
    console.error({ expected: watched + '/' + snapshot.allRows.length, actual: await page.locator('.course-summary > span').textContent(), hash: new URL(page.url()).hash });
    throw error;
  }
}
const rowIds = async (page, sectionId) => page.locator('[data-course-section="' + sectionId + '"] [data-course-row]').evaluateAll(rows => rows.map(row => row.dataset.courseRow));

try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, state: incomplete, learner, supplementaryProgress: privateMarks });
    const { page } = f;
    if (mobile) await page.setViewportSize({ width: 320, height: 740 });
    await visit(page, 'p05-l06');
    await progress(page, 12);
    assert.deepEqual(await rowIds(page, 'module-05-section-3'), firstEightEarthingIds);
    const earthing = page.locator('[data-course-section="module-05-section-3"]');
    assert.equal(await earthing.locator('[role="progressbar"]').getAttribute('aria-valuenow'), '8');
    assert.equal(await earthing.locator('[role="progressbar"]').getAttribute('aria-valuemax'), '8');
    const ads = page.locator('[data-course-section="module-05-ads"]');
    assert.deepEqual(await rowIds(page, 'module-05-ads'), ['p05-l06']);
    assert.equal(await ads.locator('[role="progressbar"]').getAttribute('aria-valuemax'), '1');
    assert.deepEqual(await rowIds(page, 'module-05-fault-loop'), ['p05-l07', 'p05-l11', 'p05-l15', 'course-8-GmwF090JU']);
    assert.equal((await rowIds(page, 'module-05-earth-electrodes')).length, 6);
    assert.equal(f.state().curriculumRevision, 1, 'A read leaves the storage fixture intact');
    await closeMap(page);
    await page.locator('.lesson-canvas').getByRole('button', { name: /Watched.*Undo/ }).click();
    await progress(page, 11);
    assert.equal(await ads.locator('[role="progressbar"]').getAttribute('aria-valuenow'), '0');
    await closeMap(page);
    // Hard reloads below must follow the debounced account save. The local
    // route fixture does not model a keepalive request after page teardown.
    const restoredMark = page.waitForResponse(response => response.url().endsWith('/learner-state') && response.request().method() === 'PUT' && response.request().postDataJSON()?.payload?.completedLessonIds?.includes('p05-l06'));
    await page.getByRole('button', { name: 'Mark video watched', exact: true }).click();
    await progress(page, 12);
    await restoredMark;
    await visit(page, 'course-TFt3d77LujQ');
    assert.equal((await rowIds(page, 'module-08-section-2'))[0], 'course-TFt3d77LujQ');
    await visit(page, 'p05-l10');
    assert.deepEqual(await rowIds(page, 'module-06-cpc-sizing'), ['p05-l10']);
    await closeMap(page);
    const canvas = page.locator('.lesson-canvas');
    await canvas.getByText('Your lesson notes', { exact: true }).click();
    assert.equal(await page.getByLabel('Your lesson notes', { exact: true }).inputValue(), note);
    assert.ok(f.learner().bookmarkedLessonIds.includes('p05-l10'));
    assert.ok(f.learner().videoPositions.GKdW9H_5NA4 >= 81);
    await canvas.locator('[data-video-actions="p05-l10"]').click();
    await page.getByRole('menuitem', { name: 'Move to…', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Move video', exact: true });
    await dialog.getByLabel('Find a destination section').fill('Automatic disconnection of supply');
    await dialog.locator('.editor-section-results button').first().click();
    await dialog.getByRole('radio', { name: 'At the beginning', exact: true }).check();
    await dialog.getByRole('button', { name: 'Move video', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(f.state().curriculumRevision, 3);
    assert.deepEqual(f.state().groups['module-05-section-3'], firstEightEarthingIds);
    await page.locator('.personal-course-notice').getByRole('button', { name: 'Undo', exact: true }).click();
    await page.getByText('Change undone.', { exact: true }).waitFor();
    assert.equal(model.personalCourseSnapshot(f.state()).byId.get('p05-l10').sectionId, 'module-06-cpc-sizing');
    await visit(page, 'course-9xNy5ne2YPI'); await progress(page, 12);
    assert.deepEqual(await rowIds(page, 'module-05-section-3'), firstEightEarthingIds);
    assert.deepEqual(await rowIds(page, 'module-05-ads'), ['p05-l06']);
    assert.equal(await earthing.locator('.lesson-row-meta').first().evaluate(element => getComputedStyle(element).fontSize), '11px');
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    await page.addStyleTag({ content: 'nextjs-portal{display:none;}' });
    await earthing.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'work/editor-preview/earthing-repaired-' + (mobile ? 'mobile' : 'desktop') + '.png' });
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log('PASS ' + (mobile ? '320px mobile' : 'desktop') + ': customised saved course keeps exactly eight introductory videos, fills ADS, relocates all remaining subjects, preserves mixed progress/notes/bookmarks/resume, and supports menu move/Undo/reload.');
  }
} finally { await browser.close(); }
