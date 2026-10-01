import assert from 'node:assert/strict';
import { browser, fixture, model } from './personal-course-browser-fixture.mjs';
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const published = model.personalCourseSnapshot(model.publishedPersonalCourse);
const c1Module = published.course.modules.find(module => module.path === 'C1');
const advancedModule = published.course.modules.find(module => module.path === 'Professional');
const c1Id = c1Module.lessons[0].id, advancedId = advancedModule.lessons[0].id;
const keptCore = ['p01-l01', 'p01-l02', c1Id, advancedId];
const bundledId = 'c2-protection-mcb-rcd-rcbo';
let state = structuredClone(model.publishedPersonalCourse);
state.archivedLessonIds = published.allRows.filter(row => row.kind === 'core' && !keptCore.includes(row.id)).map(row => row.id);
state.videos = state.videos.map(video => ({ ...video, archived: video.id !== bundledId }));
state = model.applyCourseEdit(state, { operationId: crypto.randomUUID(), revision: state.revision, edit: { type: 'add', url: 'https://youtu.be/ownDur00001', title: 'Older personal supplementary video', instructor: 'Private channel', sectionId: 'module-05-section-4', beforeId: null } });
const personalId = state.videos.find(video => video.videoId === 'ownDur00001').id;
const learner = { ...initialLearnerState, activeLessonId: 'p01-l01', autoNextEnabled: false, completedLessonIds: ['p01-l01', c1Id], updatedAt: '2026-10-01T10:00:00Z' };

async function openMap(page) {
  if (await page.evaluate(() => matchMedia('(max-width:1180px)').matches) && !await page.locator('.course-map.drawer-open').count()) {
    await page.getByRole('button', { name: 'Open course map', exact: true }).click();
    await page.waitForFunction(() => document.querySelector('.course-map').getBoundingClientRect().left >= -1);
  }
}
async function closeMap(page) {
  if (await page.locator('.course-map.drawer-open').count()) await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
}
async function check(page, path, watched, total, overallWatched = 3, overallTotal = 6) {
  await openMap(page);
  try { await page.waitForFunction(({ watched, total }) => document.querySelector('.pathway-progress-count')?.textContent === watched + '/' + total + ' videos watched', { watched, total }); }
  catch (error) { console.error({ expected: { path, watched, total }, actual: await page.locator('.course-summary').textContent(), breadcrumb: await page.locator('.breadcrumbs').textContent(), hash: new URL(page.url()).hash }); throw error; }
  assert.equal(await page.locator('.pathway-progress-heading strong').textContent(), path + ' progress');
  assert.equal(await page.locator('.pathway-progress-heading b').textContent(), Math.round((total ? watched / total : 0) * 100) + '%');
  assert.equal(await page.locator('.course-summary .overall-progress strong').textContent(), overallWatched + '/' + overallTotal);
  const bar = page.locator('.course-summary [role="progressbar"]');
  assert.equal(await bar.getAttribute('aria-valuenow'), String(watched));
  assert.equal(await bar.getAttribute('aria-valuemax'), String(total));
  assert.equal(await page.locator('.course-progress-chip small').textContent(), path + ' progress');
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
}
async function choosePath(page, label) {
  await openMap(page);
  await page.locator('.course-path-switcher').getByRole('button', { name: label, exact: true }).click();
}
async function openEarthingModule(page) {
  const accordion = page.locator('.module-accordion').filter({ hasText: 'Fault Protection, Earthing and Protective Devices' });
  if (!(await accordion.getAttribute('class')).split(' ').includes('open')) await accordion.locator(':scope > button').click();
  const section = page.locator('[data-course-section="module-05-section-4"]');
  if (await section.locator('details').getAttribute('open') === null) await section.locator('summary').click();
}
async function select(page, id) {
  await page.locator('[data-course-row="' + id + '"] button:not(.course-drag-handle):not(.video-actions-button)').first().click();
  await page.locator('.supp-lesson h1').waitFor();
}
async function actions(page, id) {
  await closeMap(page);
  await page.locator('.lesson-canvas [data-video-actions="' + id + '"]').click();
}

try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, state, learner, supplementaryProgress: ['nVi5Idyt-jE'] }), { page } = f;
    if (mobile) await page.setViewportSize({ width: 320, height: 740 });
    await page.emulateMedia({ colorScheme: mobile ? 'dark' : 'light' });
    await check(page, 'C2', 2, 4);
    await page.locator('.course-summary').screenshot({ path: 'work/editor-preview/pathway-progress-' + (mobile ? 'mobile' : 'desktop') + '.png' });
    await openEarthingModule(page);
    const row = page.locator('[data-course-row="' + bundledId + '"]');
    assert.equal(await row.locator('.lesson-row-duration').textContent(), '· 8:46', 'The screenshot video has a duration before playback');
    await page.locator('[data-course-row="' + personalId + '"] .lesson-row-duration').filter({ hasText: '10:45' }).waitFor();
    const timing = await row.locator('.lesson-row-duration').boundingBox();
    const dots = await row.locator('[data-video-actions]').boundingBox();
    assert.ok(timing.x + timing.width <= dots.x, 'Running time does not overlap the menu');
    await page.locator('[data-course-section="module-05-section-4"] details').screenshot({ path: 'work/editor-preview/supplementary-duration-' + (mobile ? 'mobile' : 'desktop') + '.png' });
    assert.equal(f.writes.length, 0, 'Looking up duration does not edit the personal course');

    await choosePath(page, 'C1'); await check(page, 'C1', 1, 1);
    assert.equal(await page.locator('.map-guidance').getByRole('button', { name: 'Next unwatched' }).count(), 0, 'A completed pathway never suggests another pathway');
    await choosePath(page, 'Advanced'); await check(page, 'Advanced', 0, 1);
    await page.locator('.map-guidance').getByRole('button', { name: 'Next unwatched' }).click();
    await closeMap(page);
    assert.ok((await page.locator('.breadcrumbs').textContent()).includes('Professional'));
    await page.locator('.lesson-canvas').getByRole('button', { name: 'Mark video watched', exact: true }).click();
    await check(page, 'Advanced', 1, 1, 4, 6);
    await closeMap(page);
    await page.locator('.lesson-canvas').getByRole('button', { name: 'Watched · Undo', exact: true }).click();
    await check(page, 'Advanced', 0, 1);

    await choosePath(page, 'C2'); await openEarthingModule(page); await select(page, bundledId); await closeMap(page);
    assert.ok((await page.locator('.supp-lesson .lesson-title-block > p:last-child').textContent()).includes('8:46'));
    await page.locator('.supp-lesson').getByRole('button', { name: 'Watched · Undo', exact: true }).click();
    await check(page, 'C2', 1, 4, 2, 6); await closeMap(page);
    await page.locator('.supp-lesson').getByRole('button', { name: 'Mark video watched', exact: true }).click();
    await check(page, 'C2', 2, 4);
    await actions(page, bundledId);
    await page.getByRole('menuitem', { name: 'Archive video', exact: true }).click();
    await check(page, 'C2', 1, 3, 2, 5); await closeMap(page);
    await page.locator('.personal-course-notice').getByRole('button', { name: 'Undo', exact: true }).click();
    await check(page, 'C2', 2, 4);
    await openEarthingModule(page); await select(page, bundledId); await actions(page, bundledId);
    await page.getByRole('menuitem', { name: 'Move to…', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: 'Move video', exact: true });
    const destination = published.sectionsByModule[c1Module.id][0];
    await dialog.getByLabel('Find a destination section').fill(destination.title);
    await dialog.locator('.editor-section-results button').first().click();
    await dialog.getByRole('button', { name: 'Move video', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    await check(page, 'C1', 2, 2);
    await closeMap(page);
    const home = page.locator('.studio-navigation').getByRole('button', { name: 'My learning', exact: true });
    if (await home.isVisible()) await home.click(); else await page.locator('.mobile-navigation').getByRole('button', { name: 'Home', exact: true }).click();
    await page.locator('.learning-progress-panel').waitFor();
    assert.equal(await page.locator('.progress-panel-heading > span').textContent(), 'C1 PROGRESS');
    assert.equal(await page.locator('.progress-panel-number').textContent(), '100%');
    assert.equal(await page.locator('.learning-progress-panel .overall-progress strong').textContent(), '3/6');
    await page.locator('.home-view-switch').getByRole('button', { name: 'About this course', exact: true }).click();
    await page.getByRole('button', { name: 'Expand all', exact: true }).click();
    const overviewVideo = page.locator('.curriculum-lessons > button').filter({ hasText: state.videos.find(video => video.id === bundledId).title });
    assert.equal(await overviewVideo.locator(':scope > small').textContent(), '8:46');
    await overviewVideo.click();
    await page.reload(); await page.locator('.supp-lesson h1').waitFor();
    await check(page, 'C1', 2, 2);
    await choosePath(page, 'C2'); await check(page, 'C2', 1, 3);
    await choosePath(page, 'C1'); await actions(page, bundledId);
    await page.getByRole('menuitem', { name: 'Delete permanently…', exact: true }).click();
    await page.getByRole('dialog', { name: 'Delete video permanently?', exact: true }).getByRole('button', { name: 'Delete permanently', exact: true }).click();
    await page.getByText('Video permanently removed from your course.', { exact: true }).waitFor();
    await choosePath(page, 'C1');
    await check(page, 'C1', 1, 1, 2, 5);
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log('PASS ' + (mobile ? '320px mobile' : 'desktop') + ': C2/C1/Advanced scope, overall totals, next unwatched, watch/Undo, archive/Undo, cross-path move, delete/reload, Home/header, verified and legacy supplementary durations, menu spacing.');
  }
  const supplementaryOnly = structuredClone(state);
  supplementaryOnly.archivedLessonIds = published.allRows.filter(row => row.kind === 'core').map(row => row.id);
  supplementaryOnly.videos = supplementaryOnly.videos.map(video => ({ ...video, archived: video.id !== bundledId }));
  const f = await fixture({ state: supplementaryOnly, learner });
  await f.page.locator('.studio-navigation').getByRole('button', { name: 'My learning', exact: true }).click();
  assert.ok((await f.page.locator('.resume-label').textContent()).includes('8:46'), 'The supplementary Home resume card shows duration');
  await f.context.close();
  const additions = await fixture({ state, learner }), page = additions.page;
  await page.route('**/api/supplementary/metadata?**', async route => {
    const link = new URL(route.request().url()).searchParams.get('url');
    if (link?.endsWith('newDur00002')) return route.fulfill({ status: 422, json: { error: 'Video details unavailable in this fixture.' } });
    return route.fallback();
  });
  await page.getByRole('button', { name: 'Add video', exact: true }).click();
  const addDialog = page.getByRole('dialog', { name: 'Add a video', exact: true });
  await addDialog.getByLabel('YouTube link').fill('https://youtu.be/newDur00001');
  await addDialog.getByText('Details found. You can edit them below.', { exact: true }).waitFor();
  await addDialog.getByRole('button', { name: 'Add to my course', exact: true }).click();
  await page.getByRole('dialog', { name: 'Video added', exact: true }).getByRole('button', { name: 'Add another', exact: true }).waitFor();
  assert.equal(additions.state().videos.find(video => video.videoId === 'newDur00001').durationSeconds, 645, 'Automatic duration is saved with the new addition');
  await page.getByRole('dialog', { name: 'Video added', exact: true }).getByRole('button', { name: 'Add another', exact: true }).click();
  await addDialog.getByLabel('YouTube link').fill('https://youtu.be/newDur00001');
  await addDialog.getByText('Details found. You can edit them below.', { exact: true }).waitFor();
  await addDialog.getByLabel('YouTube link').fill('https://youtu.be/newDur00002');
  await addDialog.getByText('Video details unavailable in this fixture.', { exact: true }).waitFor();
  await addDialog.getByLabel('Video title').fill('Manually entered unavailable video');
  await addDialog.getByRole('button', { name: 'Add to my course', exact: true }).click();
  await page.getByRole('dialog', { name: 'Video added', exact: true }).getByRole('button', { name: 'Add another', exact: true }).waitFor();
  assert.equal(additions.state().videos.find(video => video.videoId === 'newDur00002').durationSeconds, undefined, 'Changing the URL cannot carry over another video\'s running time');
  assert.deepEqual(additions.errors, []);
  await additions.context.close();
  console.log('PASS additions: verified duration persists; URL changes with failed lookup never save stale timing.');
} finally { await browser.close(); }
