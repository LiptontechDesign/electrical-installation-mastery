import assert from 'node:assert/strict';
import { browser, fixture, model, openCourseTools, chooseCoursePath, revealCourseModule } from './personal-course-browser-fixture.mjs';

const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const published = model.personalCourseSnapshot(model.publishedPersonalCourse);
const modules = published.course.modules.filter(item => item.path === 'C2');
const kept = modules.slice(0, 5).map(item => published.allRows.find(row => row.kind === 'core' && row.moduleId === item.id));
const state = structuredClone(model.publishedPersonalCourse);
state.archivedLessonIds = published.allRows.filter(row => row.kind === 'core' && !kept.some(item => item.id === row.id)).map(row => row.id);
state.videos = state.videos.map(video => ({ ...video, archived: true }));
const learner = { ...initialLearnerState, autoNextEnabled: false, activeLessonId: kept[0].id, completedLessonIds: [kept[0].id], bookmarkedLessonIds: [], notes: { [kept[0].id]: 'Private note stays intact' } };
const header = (page, id) => page.locator('[data-course-module="' + id + '"] .module-accordion > button');
const scrollTop = page => page.locator('.course-map-body').evaluate(node => node.scrollTo({ top: 0, behavior: 'instant' }));
async function toolsClosed(page) {
  const button = page.getByRole('button', { name: 'Course tools', exact: true });
  if (await button.getAttribute('aria-expanded') === 'true') await button.click();
}
async function assertLayout(page, width, theme) {
  await page.setViewportSize({ width, height: 940 });
  await page.emulateMedia({ colorScheme: theme });
  await scrollTop(page);
  const sizes = await page.locator('.course-map').evaluate(map => {
    const top = map.getBoundingClientRect().top;
    const first = map.querySelector('nav[aria-label="Course module and lesson navigation"]').getBoundingClientRect();
    const controls = [...map.querySelectorAll('.course-map-toolbar button, .course-map-toolbar select, .lesson-filters button')].map(node => ({ label: node.getAttribute('aria-label') ?? node.textContent.trim(), height: node.getBoundingClientRect().height }));
    return { beforeModules: first.top - top, overflow: document.documentElement.scrollWidth > innerWidth, controls };
  });
  assert.ok(sizes.beforeModules <= 180, width + 'px ' + theme + ': modules begin after ' + sizes.beforeModules + 'px');
  assert.equal(sizes.overflow, false);
  assert.ok(sizes.controls.every(item => item.height >= 44), 'All primary controls retain 44px targets');
  assert.equal(await page.getByRole('button', { name: 'Add video', exact: true }).isVisible(), false, 'Editing stays behind Tools');
  assert.equal(await page.locator('.course-summary .overall-progress').isVisible(), false, 'Overall statistics stay behind a disclosure');
  await page.locator('.course-map').screenshot({ path: 'work/editor-preview/course-map-header-' + width + '-' + theme + '.png' });
  return sizes.beforeModules;
}
try {
  const f = await fixture({ state, learner });
  const { page } = f;
  await page.locator('.following-module-group').waitFor();
  await page.waitForFunction(() => Boolean(window.testPlayer?.options));
  await page.evaluate(() => { window.headerTestPlayer = window.testPlayer; window.testPlayer.time = 123; });
  await toolsClosed(page);
  const desktop = [];
  for (const scheme of ['light', 'dark']) desktop.push(await assertLayout(page, 1440, scheme));
  await page.locator('.course-progress-details > summary').click();
  assert.equal(await page.locator('.course-summary .overall-progress').isVisible(), true);
  const progressBar = page.getByRole('progressbar', { name: 'C2 pathway progress', exact: true });
  assert.equal(await progressBar.count(), 1, 'Selected-pathway progress remains accessible');
  assert.ok((await progressBar.boundingBox()).y < (await page.locator('.course-summary .overall-progress').boundingBox()).y, 'The selected-pathway bar stays with its own count above overall statistics');
  await page.keyboard.press('Space');
  assert.equal(await page.locator('.course-summary .overall-progress').isVisible(), false, 'Progress disclosure supports keyboard controls');

  await chooseCoursePath(page, 'C1');
  assert.equal(await page.getByRole('combobox', { name: 'Choose learning pathway' }).inputValue(), 'C1');
  assert.ok((await page.locator('.course-current-locator').innerText()).includes('C2'), 'Browsing C1 keeps the playing C2 context explicit');
  await page.locator('.course-current-locator button').click();
  assert.equal(await page.getByRole('combobox', { name: 'Choose learning pathway' }).inputValue(), 'C2');
  assert.equal(await page.evaluate(() => window.testPlayer === window.headerTestPlayer && window.testPlayer.time === 123 && !window.testPlayer.destroyed), true);

  await openCourseTools(page);
  await page.getByRole('button', { name: 'Expand all modules', exact: true }).click();
  assert.equal(await page.locator('.module-accordion > button[aria-expanded="true"]').count(), modules.length);
  assert.equal(await page.locator('.course-topic-group:not([open])').count(), 0, 'Expand all exposes every section and video');
  await header(page, modules[1].id).click();
  assert.equal(await header(page, modules[1].id).getAttribute('aria-expanded'), 'false', 'Individual modules can close after Expand all');
  const currentSection = page.locator('[data-course-section="' + kept[0].sectionId + '"] > details');
  await currentSection.locator(':scope > summary').click();
  assert.equal(await currentSection.evaluate(node => node.open), false);
  await page.getByRole('button', { name: 'Expand all modules', exact: true }).click();
  assert.equal(await header(page, modules[1].id).getAttribute('aria-expanded'), 'true');
  assert.equal(await currentSection.evaluate(node => node.open), true, 'Repeated Expand all reopens manually closed sections');
  await page.getByRole('button', { name: 'Focus current module', exact: true }).click();
  assert.equal(await page.locator('.module-accordion > button[aria-expanded="true"]').count(), 1);
  assert.equal(await page.locator('.module-collection[open]').count(), 0);
  assert.equal(await page.getByRole('button', { name: 'Course tools', exact: true }).getAttribute('aria-expanded'), 'false');

  await revealCourseModule(page, modules[1].id);
  await page.locator('.following-module-group').getByRole('button', { name: 'Expand all in this group', exact: true }).click();
  assert.equal(await page.locator('.module-accordion > button[aria-expanded="true"]').count(), modules.length);
  await openCourseTools(page);
  await page.getByRole('button', { name: 'Focus current module', exact: true }).click();
  assert.equal(f.writes.length, 0);
  assert.equal(f.learner().notes[kept[0].id], learner.notes[kept[0].id]);
  assert.equal(await page.evaluate(() => window.testPlayer === window.headerTestPlayer && window.testPlayer.time === 123), true);
  assert.deepEqual(f.errors, []);
  await f.context.close();

  const mobile = await fixture({ mobile: true, state, learner });
  const mp = mobile.page;
  await mp.locator('.following-module-group').waitFor();
  const heights = [];
  for (const width of [320, 390, 768]) for (const scheme of ['light', 'dark']) heights.push({ width, scheme, height: await assertLayout(mp, width, scheme) });
  await chooseCoursePath(mp, 'C1');
  await openCourseTools(mp);
  await mp.getByRole('button', { name: 'Expand all modules', exact: true }).click();
  await mp.getByRole('button', { name: 'Collapse all modules', exact: true }).click();
  assert.equal(await mp.locator('.module-accordion > button[aria-expanded="true"]').count(), 0);
  await mp.locator('.course-current-locator button').click();
  await revealCourseModule(mp, modules[1].id);
  await mp.locator('.course-map-body').evaluate(node => { node.scrollTop = 210; });
  const remembered = await mp.locator('.course-map-body').evaluate(node => node.scrollTop);
  await mp.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
  await mp.getByRole('button', { name: 'Open course map', exact: true }).click();
  assert.equal(await header(mp, modules[1].id).getAttribute('aria-expanded'), 'true');
  assert.ok(Math.abs(await mp.locator('.course-map-body').evaluate(node => node.scrollTop) - remembered) < 2, 'Reopening preserves deliberate browsing');
  assert.deepEqual(mobile.errors, []);
  await mobile.context.close();

  const guest = await fixture({ guest: true });
  assert.equal(await guest.page.locator('.course-summary').count(), 0);
  await openCourseTools(guest.page);
  await guest.page.getByRole('button', { name: 'Expand all modules', exact: true }).click();
  assert.equal(await guest.page.locator('.module-accordion > button[aria-expanded="true"]').count(), modules.length, 'Guests also control how much of the outline to see');
  assert.equal(await guest.page.getByRole('button', { name: 'Add video', exact: true }).count(), 0);
  await chooseCoursePath(guest.page, 'C1');
  assert.ok((await guest.page.locator('.course-map-guest-count').innerText()).includes('videos'));
  await chooseCoursePath(guest.page, 'C2');
  await guest.page.locator('.course-map-body').evaluate(node => { node.scrollTop = node.scrollHeight; });
  await guest.page.locator('.lesson-canvas').getByRole('button', { name: 'Next lesson', exact: true }).click();
  await guest.page.waitForFunction(() => {
    const map = document.querySelector('.course-map-body');
    const row = map?.querySelector('[aria-current="page"]');
    if (!map || !row) return false;
    const bounds = row.getBoundingClientRect(), viewport = map.getBoundingClientRect();
    return bounds.top >= viewport.top && bounds.bottom <= viewport.bottom;
  });
  assert.equal(guest.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0);
  assert.deepEqual(guest.errors, []);
  await guest.context.close();
  console.log('PASS: compact header geometry, 44px controls, progress disclosure, pathway scope, individual/group/all expansion, repeated reopening, focus reset, browsing memory, playback and guest isolation.');
  console.log(JSON.stringify({ desktop, mobile: heights }));
} finally { await browser.close(); }
