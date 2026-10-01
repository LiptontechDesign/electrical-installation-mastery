import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model } from './personal-course-browser-fixture.mjs';
import { progressFixture } from './course-progress-fixture.mjs';
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const seed = progressFixture(model);
const snapshot = model.personalCourseSnapshot(seed.state);
const moduleTitle = snapshot.course.modules.find(module => module.id === 'module-05').title;
const sectionTitle = snapshot.sectionsByModule['module-05'].find(section => section.id === seed.sectionId).title;
const learner = { ...initialLearnerState, autoNextEnabled: false, activeLessonId: seed.coreIds[0], completedLessonIds: [seed.coreIds[0], 'p01-l01'], notes: { 'p01-l01': 'Archived notes stay private' }, updatedAt: '2026-09-30T10:00:00Z' };
const percent = (watched, total) => total ? Math.round(watched / total * 100) : 0;
const waitText = async (page, selector, value) => {
  try { await page.waitForFunction(({ selector, value }) => document.querySelector(selector)?.textContent.trim() === value, { selector, value }); }
  catch (error) {
    console.error({ selector, expected: value, actual: await page.locator(selector).allTextContents(), hash: new URL(page.url()).hash, content: (await page.locator('main').innerText()).slice(0, 900) });
    await page.screenshot({ path: 'work/editor-preview/progress-failure.png' });
    throw error;
  }
};

async function openMap(page) {
  const narrow = await page.evaluate(() => matchMedia('(max-width: 1180px)').matches);
  if (narrow ? !await page.locator('.course-map.drawer-open').count() : !await page.locator('.course-summary').isVisible()) {
    await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    await page.locator('.course-summary').waitFor();
  }
}
async function checkMap(page, watched, total, groupWatched = watched, groupTotal = total) {
  await openMap(page);
  await waitText(page, '.course-summary .overall-progress strong', watched + '/' + total);
  await waitText(page, '.course-summary .pathway-progress-count', watched + '/' + total + ' videos watched');
  assert.equal(await page.locator('.pathway-progress-heading > b').textContent(), percent(watched, total) + '%');
  assert.equal(await page.locator('.course-progress-chip').getAttribute('aria-label'), 'C2 progress: ' + watched + ' of ' + total + ' videos watched, ' + percent(watched, total) + '%');
  for (const name of [moduleTitle + ' progress', sectionTitle + ' progress']) {
    const bar = page.getByRole('progressbar', { name, exact: true, includeHidden: true });
    try {
      assert.equal(await bar.getAttribute('aria-valuenow'), String(groupWatched));
      assert.equal(await bar.getAttribute('aria-valuemax'), String(groupTotal));
    } catch (error) {
      console.error({ name, hash: new URL(page.url()).hash, progressbars: await page.locator('[role="progressbar"]').evaluateAll(elements => elements.map(element => element.outerHTML)), content: await page.locator('.course-map').innerText() });
      throw error;
    }
  }
  const section = page.locator('[data-course-section="' + seed.sectionId + '"] .course-topic-group');
  assert.equal(await section.getAttribute('data-complete'), String(groupTotal > 0 && groupWatched === groupTotal));
}
async function settings(page) {
  await page.getByRole('button', { name: 'Your account: Preview Learner', exact: true }).click();
  await page.getByRole('button', { name: 'Account & settings', exact: true }).click();
  return page.getByRole('dialog', { name: 'Settings', exact: true });
}
async function checkHomeAndOverview(page, watched, total, groupWatched = watched, groupTotal = total) {
  const activeTitle = await page.locator('.lesson-canvas h1').textContent();
  const home = page.locator('.studio-navigation').getByRole('button', { name: 'My learning', exact: true });
  if (await home.isVisible()) await home.click();
  else await page.locator('.mobile-navigation').getByRole('button', { name: 'Home', exact: true }).click();
  await page.locator('.home-view-switch').getByRole('button', { name: 'My learning', exact: true }).click();
  await waitText(page, '.learning-progress-panel .overall-progress strong', watched + '/' + total);
  assert.equal(await page.locator('.learning-progress-panel .overall-progress b').textContent(), percent(watched, total) + '%');
  const card = page.locator('.module-card').filter({ has: page.getByRole('heading', { name: moduleTitle, exact: true }) });
  assert.equal(await card.locator('.course-progress-count').getAttribute('aria-label'), groupWatched + ' of ' + groupTotal + ' videos watched');
  const dialog = await settings(page);
  assert.equal(await dialog.locator('.settings-summary > div:first-child b').textContent(), String(watched));
  assert.equal(await dialog.locator('.settings-summary > div:nth-child(2) b').textContent(), percent(watched, total) + '%');
  await dialog.getByRole('button', { name: 'Close settings', exact: true }).click();
  await page.locator('.home-view-switch').getByRole('button', { name: 'About this course', exact: true }).click();
  await page.locator('.course-facts').getByText(total + ' videos', { exact: true }).waitFor();
  const moduleDetails = page.locator('.curriculum-modules details').filter({ has: page.locator('summary strong', { hasText: moduleTitle }) });
  assert.ok((await moduleDetails.locator('summary small').textContent()).startsWith(groupTotal + ' videos'));
  await page.getByRole('button', { name: 'Expand all', exact: true }).click();
  assert.equal(await page.locator('.curriculum-lessons > button').count(), total, 'Overview uses the same mixed personal arrangement');
  const previous = page.locator('.curriculum-lessons > button').filter({ hasText: activeTitle });
  if (await previous.count()) await previous.click();
  else await page.locator('.studio-navigation').getByRole('button', { name: 'Learn', exact: true }).click();
  await page.locator('.lesson-canvas h1').waitFor();
}
async function select(page, id) {
  await openMap(page);
  const row = page.locator('[data-course-row="' + id + '"] button:not(.course-drag-handle):not(.video-actions-button)').first();
  await row.click();
  await page.locator('.lesson-canvas h1').filter({ hasText: model.personalCourseSnapshot(seed.state).byId.get(id)?.title ?? '' }).waitFor();
}
async function actions(page, id) {
  if (await page.locator('.course-map.drawer-open').count()) await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
  await page.locator('.lesson-canvas [data-video-actions="' + id + '"]').click();
}
async function archive(page, id) {
  await actions(page, id);
  await page.getByRole('menuitem', { name: 'Archive video', exact: true }).click();
  await page.getByText('Video archived. Your notes and progress are kept.', { exact: true }).waitFor();
}
async function restore(page, title) {
  await openMap(page);
  await page.locator('.course-tools-more summary').click();
  await page.getByRole('button', { name: 'Archived videos', exact: true }).click();
  let dialog = page.getByRole('dialog', { name: 'Archived videos', exact: true });
  await dialog.getByLabel('Search archived videos').fill(title);
  await dialog.getByRole('button', { name: 'Restore…', exact: true }).click();
  dialog = page.getByRole('dialog', { name: 'Restore video', exact: true });
  await dialog.getByRole('button', { name: 'Restore video', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
}
async function permanentlyDelete(page, id) {
  await actions(page, id);
  await page.getByRole('menuitem', { name: 'Delete permanently…', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Delete video permanently?', exact: true });
  await dialog.getByRole('button', { name: 'Delete permanently', exact: true }).click();
  await page.getByText('Video permanently removed from your course.', { exact: true }).waitFor();
}

try {
  const f = await fixture({ state: seed.state, learner }), { page } = f;
  await checkMap(page, 1, 5);
  await checkHomeAndOverview(page, 1, 5);
  await select(page, seed.added[0].id);
  await page.locator('.supp-lesson').getByRole('button', { name: 'Mark video watched', exact: true }).click();
  await checkMap(page, 2, 5);
  await checkHomeAndOverview(page, 2, 5);
  await page.locator('.supp-lesson').getByRole('button', { name: 'Watched · Undo', exact: true }).click();
  await checkMap(page, 1, 5);
  await page.locator('.supp-lesson').getByRole('button', { name: 'Mark video watched', exact: true }).click();
  await select(page, seed.coreIds[2]);
  await page.locator('.lesson-canvas').getByRole('button', { name: 'Mark video watched', exact: true }).click();
  await checkMap(page, 3, 5);
  await page.getByRole('button', { name: 'Unwatched 2', exact: true }).click();
  assert.equal(await page.locator('[data-course-row]').count(), 2);
  await checkMap(page, 3, 5);
  await page.getByRole('button', { name: 'All 5', exact: true }).click();
  await select(page, seed.added[0].id);
  await archive(page, seed.added[0].id);
  await checkMap(page, 2, 4);
  await checkHomeAndOverview(page, 2, 4);
  await restore(page, seed.added[0].title);
  await checkMap(page, 3, 5);
  await select(page, seed.added[0].id);
  assert.equal(await page.locator('.supp-lesson .complete-button').getAttribute('aria-pressed'), 'true', 'Restore recovers watched status');
  await select(page, seed.coreIds[1]);
  await archive(page, seed.coreIds[1]);
  await checkMap(page, 3, 4);
  await restore(page, snapshot.byId.get(seed.coreIds[1]).title);
  await checkMap(page, 3, 5);
  await select(page, seed.coreIds[0]);
  await permanentlyDelete(page, seed.coreIds[0]);
  await checkMap(page, 2, 4);
  await checkHomeAndOverview(page, 2, 4);
  await select(page, seed.added[1].id);
  await permanentlyDelete(page, seed.added[1].id);
  await checkMap(page, 2, 3);
  await checkHomeAndOverview(page, 2, 3);
  await page.reload();
  await page.locator('.lesson-canvas h1').waitFor();
  await checkMap(page, 2, 3);
  assert.ok(f.learner().completedLessonIds.includes(seed.coreIds[0]), 'Deletion keeps private watched history');
  assert.equal(f.learner().notes['p01-l01'], 'Archived notes stay private');

  // A new addition changes every denominator without changing watched history.
  await page.getByRole('button', { name: 'Add video', exact: true }).click();
  let dialog = page.getByRole('dialog', { name: 'Add a video', exact: true });
  await dialog.getByLabel('YouTube link', { exact: true }).fill('https://youtu.be/progTest003');
  await page.waitForFunction(() => !document.querySelector('.editor-primary')?.disabled);
  await dialog.getByRole('button', { name: 'Add to my course', exact: true }).click();
  await page.getByRole('dialog', { name: 'Video added', exact: true }).getByRole('button', { name: 'Watch now', exact: true }).click();
  await checkMap(page, 2, 4);
  await checkHomeAndOverview(page, 2, 4);
  await page.getByRole('button', { name: 'Next unwatched', exact: true }).click();
  assert.ok(new URL(page.url()).hash.endsWith(seed.coreIds[1]), 'Suggested next follows the active mixed course');
  await page.getByRole('button', { name: 'Organise', exact: true }).click();
  await page.getByRole('button', { name: 'Mark every video in section 3 as watched', exact: true }).click();
  await checkMap(page, 4, 4);
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await checkHomeAndOverview(page, 4, 4);
  await page.screenshot({ path: 'work/editor-preview/progress-desktop.png' });

  // Reset and backup/import must include supplementary progress too.
  dialog = await settings(page);
  const downloadPromise = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /Download progress backup/ }).click();
  const download = await downloadPromise;
  const backupPath = await download.path();
  const backup = JSON.parse(readFileSync(backupPath, 'utf8'));
  assert.ok(backup.supplementaryProgress.includes(seed.added[0].videoId));
  await dialog.getByRole('button', { name: /Reset learning progress/ }).click();
  await dialog.getByRole('button', { name: 'Reset account progress', exact: true }).click();
  await page.locator('.home-view-switch').getByRole('button', { name: 'My learning', exact: true }).click();
  await waitText(page, '.progress-panel-number', '0%');
  await page.waitForTimeout(650);
  assert.deepEqual(f.supplementaryProgress(), [], 'Reset syncs an empty supplementary watched record');
  assert.deepEqual(f.learner().completedLessonIds, []);
  dialog = await settings(page);
  await dialog.locator('input[type="file"]').setInputFiles(backupPath);
  await dialog.waitFor({ state: 'hidden' });
  await waitText(page, '.progress-panel-number', '100%');
  await page.waitForTimeout(650);
  assert.ok(f.supplementaryProgress().includes(seed.added[0].videoId));
  // Older backups remain accepted and preserve existing supplementary marks.
  delete backup.supplementaryProgress;
  dialog = await settings(page);
  await dialog.locator('input[type="file"]').setInputFiles({ name: 'old-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await dialog.waitFor({ state: 'hidden' });
  await waitText(page, '.progress-panel-number', '100%');
  dialog = await settings(page);
  await dialog.locator('input[type="file"]').setInputFiles({ name: 'invalid-backup.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ ...backup, supplementaryProgress: 'invalid' })) });
  await page.getByText('That file is not a valid course progress backup.', { exact: true }).waitFor();
  await dialog.getByRole('button', { name: 'Close settings', exact: true }).click();
  await waitText(page, '.progress-panel-number', '100%');
  assert.deepEqual(f.errors, []);
  await f.context.close();
  console.log('PASS: live mixed counters across sections, modules, Home, overview, header, filters and Settings; watch/undo, archive/restore, delete, reload, add, bulk mark, reset and backup compatibility.');

  // Mobile counts and moves use the same source; a fresh account is unaffected.
  const mobile = await fixture({ mobile: true, state: seed.state, learner }), mp = mobile.page;
  // Framework development chrome is absent from production and covers Home at 320px.
  await mp.addStyleTag({ content: 'nextjs-portal { display: none; }' });
  await checkMap(mp, 1, 5);
  await select(mp, seed.added[0].id);
  await mp.locator('.supp-lesson').getByRole('button', { name: 'Mark video watched', exact: true }).click();
  await checkMap(mp, 2, 5);
  await mp.setViewportSize({ width: 320, height: 740 });
  await mp.emulateMedia({ colorScheme: 'dark' });
  await mp.locator('[data-course-section="' + seed.sectionId + '"]').scrollIntoViewIfNeeded();
  await mp.screenshot({ path: 'work/editor-preview/progress-mobile.png' });
  assert.equal(await mp.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await actions(mp, seed.added[0].id);
  await mp.getByRole('menuitem', { name: 'Move to…', exact: true }).click();
  dialog = mp.getByRole('dialog', { name: 'Move video', exact: true });
  await dialog.getByLabel('Find a destination section').fill('three-phase');
  await dialog.locator('.editor-section-results button').first().click();
  await dialog.getByRole('button', { name: 'Move video', exact: true }).click();
  await dialog.waitFor({ state: 'hidden' });
  await openMap(mp);
  await waitText(mp, '.course-summary .overall-progress strong', '2/5');
  await waitText(mp, '.pathway-progress-count', '1/1 videos watched');
  assert.equal(await mp.locator('.pathway-progress-heading strong').textContent(), 'C1 progress');
  const moved = model.personalCourseSnapshot(mobile.state()).byId.get(seed.added[0].id);
  assert.notEqual(moved.moduleId, 'module-05');
  await mp.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
  await checkHomeAndOverview(mp, 2, 5, 1, 4);
  assert.deepEqual(mobile.errors, []);
  await mobile.context.close();
  console.log('PASS: narrow mobile counts, no horizontal overflow, cross-module movement, updated overview and independent fresh-account progress.');

  const onlySupplementary = structuredClone(seed.state);
  onlySupplementary.archivedLessonIds.push(...seed.coreIds);
  const only = await fixture({ state: onlySupplementary, learner, supplementaryProgress: [seed.added[0].videoId] }), op = only.page;
  await waitText(op, '.course-summary > span', '1/2 videos watched');
  await op.locator('.studio-navigation').getByRole('button', { name: 'My learning', exact: true }).click();
  await waitText(op, '.progress-panel-number', '50%');
  assert.ok((await op.locator('.resume-bottom').textContent()).includes('1 of 2 videos watched'));
  await op.locator('.home-view-switch').getByRole('button', { name: 'About this course', exact: true }).click();
  await op.getByRole('button', { name: 'Start learning', exact: true }).click();
  await op.locator('.supp-lesson h1').waitFor();
  await permanentlyDelete(op, seed.added[0].id);
  await waitText(op, '.course-summary > span', '0/1 videos watched');
  await permanentlyDelete(op, seed.added[1].id);
  await waitText(op, '.course-summary > span', '0/0 videos watched');
  await op.locator('.module-accordion.open > button').click();
  await op.getByRole('button', { name: 'Add video', exact: true }).waitFor();
  await op.locator('.studio-navigation').getByRole('button', { name: 'My learning', exact: true }).click();
  await op.locator('.home-view-switch').getByRole('button', { name: 'My learning', exact: true }).click();
  await op.getByRole('heading', { name: 'No active videos', exact: true }).waitFor();
  await op.locator('.home-view-switch').getByRole('button', { name: 'About this course', exact: true }).click();
  assert.equal(await op.getByRole('button', { name: 'Start learning', exact: true }).isDisabled(), true);
  assert.equal(await op.locator('.course-progress-chip').getAttribute('aria-label'), 'C2 progress: 0 of 0 videos watched, 0%');
  assert.deepEqual(only.errors, []);
  await only.context.close();
  console.log('PASS: supplementary-only Home/resume and empty-course counters with no stale completion or crash.');

  const delayed = await fixture({ state: seed.state, learner, supplementaryProgress: [seed.added[0].videoId], supplementaryReadDelay: 5000 });
  const dp = delayed.page;
  dialog = await settings(dp);
  assert.equal(delayed.supplementaryLoaded(), false, 'The test cloud read is still pending');
  await dialog.getByRole('button', { name: /Reset learning progress/ }).click();
  await dialog.getByRole('button', { name: 'Reset account progress', exact: true }).click();
  await dp.waitForResponse(response => response.url().endsWith('/supplementary-progress') && response.request().method() === 'GET');
  await dp.waitForTimeout(650);
  assert.deepEqual(delayed.supplementaryProgress(), [], 'A late cloud read cannot restore reset marks');
  assert.equal(await dp.locator('.course-progress-chip').getAttribute('aria-label'), 'C2 progress: 0 of 5 videos watched, 0%');
  assert.deepEqual(delayed.errors, []);
  await delayed.context.close();
  console.log('PASS: an explicit reset wins over a pending supplementary cloud read.');

  const guest = await fixture({ guest: true }), gp = guest.page;
  const guestSection = gp.locator('.course-topic-group').filter({ has: gp.locator('.section-title', { hasText: sectionTitle }) });
  const guestTotal = model.personalCourseSnapshot(model.publishedPersonalCourse).rows[seed.sectionId].length;
  await gp.locator('.module-accordion > button').filter({ hasText: moduleTitle }).click();
  assert.equal(await guestSection.locator('summary > small').textContent(), guestTotal + ' videos');
  assert.equal(await guestSection.locator('summary > small').isVisible(), true);
  assert.equal(guest.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0);
  assert.equal(await gp.locator('[data-video-actions]').count(), 0);
  assert.deepEqual(guest.errors, []);
  await guest.context.close();
  console.log('PASS: guests see full section video totals without personal tracking or editor controls.');
} finally { await browser.close(); }
