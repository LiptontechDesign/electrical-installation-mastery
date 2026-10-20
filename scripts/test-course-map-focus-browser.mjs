import assert from 'node:assert/strict';
import { browser, fixture, model } from './personal-course-browser-fixture.mjs';

const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const published = model.personalCourseSnapshot(model.publishedPersonalCourse);
const modules = published.course.modules.filter(module => module.path === 'C2').slice(0, 5);
const coreRows = modules.map(module => published.allRows.find(row => row.kind === 'core' && row.moduleId === module.id));
assert.ok(coreRows.every(Boolean), 'The focus fixture needs five genuine C2 modules');
let state = structuredClone(model.publishedPersonalCourse);
state.archivedLessonIds = published.allRows.filter(row => row.kind === 'core' && !coreRows.some(kept => kept.id === row.id)).map(row => row.id);
state.videos = state.videos.map(video => ({ ...video, archived: true }));
const videoId = 'focusTest01';
state = model.applyCourseEdit(state, { operationId: crypto.randomUUID(), revision: state.revision, edit: { type: 'add', url: 'https://youtu.be/' + videoId, title: 'Personal safety revision', instructor: 'Focus fixture', sectionId: coreRows[1].sectionId, beforeId: null } });
const added = state.videos.find(video => video.videoId === videoId);
assert.ok(added);
const snapshot = model.personalCourseSnapshot(state);
const learner = { ...initialLearnerState, autoNextEnabled: false, activeLessonId: coreRows[0].id, completedLessonIds: coreRows.slice(0, 3).map(row => row.id), bookmarkedLessonIds: [coreRows[1].id], notes: { [coreRows[0].id]: 'Keep this private revision note' }, updatedAt: '2026-10-20T08:00:00Z' };
const groupSelector = 'details.completed-module-group';
const header = (page, moduleId) => page.locator('[data-course-module="' + moduleId + '"] .module-accordion > button');

async function openMap(page) {
  const mobile = await page.evaluate(() => matchMedia('(max-width: 1180px)').matches);
  if (mobile ? !await page.locator('.course-map.drawer-open').count() : !await page.locator('.course-map').isVisible()) {
    await page.getByRole('button', { name: 'Open course map', exact: true }).click();
  }
  await page.locator('.course-map').waitFor();
}
async function waitGroups(page, ids) {
  try {
    await page.waitForFunction(({ selector, ids }) => JSON.stringify([...document.querySelectorAll(selector)].map(node => node.dataset.completedModules?.split(' '))) === JSON.stringify(ids), { selector: groupSelector, ids });
  } catch (error) {
    console.error({ expectedGroups: ids, groups: await page.locator(groupSelector).evaluateAll(nodes => nodes.map(node => node.outerHTML)), courseMap: await page.locator('.course-map').innerText() });
    await page.screenshot({ path: 'work/editor-preview/course-map-focus-failure.png' });
    throw error;
  }
}
async function revealModule(page, moduleId) {
  await openMap(page);
  const group = page.locator(groupSelector).filter({ has: page.locator('[data-course-module="' + moduleId + '"]') });
  if (await group.count() && !await group.evaluate(node => node.open)) await group.locator(':scope > summary').click();
  const button = header(page, moduleId);
  if (await button.getAttribute('aria-expanded') !== 'true') await button.click();
}
async function select(page, row) {
  await revealModule(page, row.moduleId);
  const section = page.locator('[data-course-section="' + row.sectionId + '"] .course-topic-group');
  if (!await section.evaluate(node => node.open)) await section.locator(':scope > summary').click();
  await page.locator('[data-course-row="' + row.id + '"] button:not(.course-drag-handle):not(.video-actions-button)').first().click();
  await page.locator('.lesson-canvas h1').filter({ hasText: row.title }).waitFor();
}
async function currentPlayer(page) {
  await page.waitForFunction(() => Boolean(window.testPlayer?.options && !window.testPlayer.destroyed));
  await page.evaluate(() => { window.focusTestPlayer = window.testPlayer; window.testPlayer.time = 137; });
}
async function assertPlayerPreserved(page, row) {
  assert.equal(await page.evaluate(() => window.testPlayer === window.focusTestPlayer && !window.focusTestPlayer.destroyed && window.testPlayer.time === 137), true, 'Map navigation preserves the playing instance and playback position');
  assert.ok(new URL(page.url()).hash.endsWith(row.id), 'Map navigation keeps the selected video');
}
async function returnToLesson(page, row) {
  const button = page.locator('.course-current-locator').getByRole('button', { name: 'Return to lesson', exact: true });
  await button.click();
  await page.waitForFunction(id => document.querySelector('[data-course-row="' + id + '"] [aria-current="page"]') === document.activeElement, row.id);
  assert.equal(await header(page, row.moduleId).getAttribute('aria-expanded'), 'true');
  await assertPlayerPreserved(page, row);
}
async function courseTools(page) {
  const button = page.getByRole('button', { name: 'Course tools', exact: true });
  if (await button.count() && await button.getAttribute('aria-expanded') !== 'true') await button.click();
}
async function filter(page, name) {
  await page.locator('.lesson-filters').getByRole('button', { name: new RegExp('^' + name + '\\b') }).click();
}
async function captureFocusPreview(page, label) {
  await page.locator('.toast').waitFor({ state: 'hidden' });
  for (const group of await page.locator(groupSelector).all()) {
    if (await group.evaluate(node => node.open)) await group.locator(':scope > summary').click();
  }
  for (const colorScheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme });
    await page.locator('.course-map, .course-map-body').evaluateAll(nodes => nodes.forEach(node => node.scrollTo({ top: 0, behavior: 'instant' })));
    await page.screenshot({ path: 'work/editor-preview/course-map-focus-' + label + '-' + colorScheme + '.png' });
    await page.locator(groupSelector).first().screenshot({ path: 'work/editor-preview/course-map-focus-' + label + '-summary-' + colorScheme + '.png' });
  }
}
async function assertRenderedContrast(page, colorScheme) {
  await page.emulateMedia({ colorScheme });
  const results = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    const rgba = color => {
      context.clearRect(0, 0, 1, 1);
      context.fillStyle = color;
      context.fillRect(0, 0, 1, 1);
      return [...context.getImageData(0, 0, 1, 1).data].map((value, index) => index === 3 ? value / 255 : value);
    };
    const composite = (front, back) => {
      const alpha = front[3] + back[3] * (1 - front[3]);
      return [...front.slice(0, 3).map((value, index) => (value * front[3] + back[index] * back[3] * (1 - front[3])) / alpha), alpha];
    };
    const luminance = color => color.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((total, value, index) => total + value * [.2126, .7152, .0722][index], 0);
    const targets = [
      ['.completed-module-label > strong', 4.5],
      ['.completed-module-label > small', 4.5],
      ['.completed-module-count', 4.5],
      ['.completed-module-icon', 3],
      ['.course-current-locator > div > span', 4.5],
      ['.course-current-locator strong', 4.5],
      ['.course-current-locator > button', 4.5],
      ['.module-accordion > button > span:nth-child(2) > strong', 4.5],
      ['.module-accordion > button > span:nth-child(2) > small', 4.5],
      ['.module-accordion > button .module-eyebrow', 4.5],
      ['.module-accordion > button .module-eyebrow > span', 4.5],
      ['.module-accordion > button .module-index', 4.5],
    ];
    return targets.flatMap(([selector, required]) => [...document.querySelectorAll(selector)].filter(element => element.getClientRects().length).map(element => {
      const ancestors = [];
      for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) ancestors.unshift(ancestor);
      const background = ancestors.reduce((color, ancestor) => composite(rgba(getComputedStyle(ancestor).backgroundColor), color), [255, 255, 255, 1]);
      const foreground = composite(rgba(getComputedStyle(element).color), background);
      const light = luminance(foreground), dark = luminance(background);
      return { selector, text: element.textContent.trim().slice(0, 80), required, ratio: (Math.max(light, dark) + .05) / (Math.min(light, dark) + .05) };
    }));
  });
  assert.ok(results.some(result => result.selector === '.course-current-locator > button'), 'The locator is rendered during contrast verification');
  assert.ok(results.some(result => result.selector === '.completed-module-label > strong'), 'A completed summary is rendered during contrast verification');
  const failures = results.filter(result => result.ratio < result.required);
  assert.deepEqual(failures, [], colorScheme + ' rendered text and status icon meet WCAG AA contrast');
  return Math.min(...results.filter(result => result.required === 4.5).map(result => result.ratio));
}

try {
  const f = await fixture({ state, learner, supplementaryProgress: [videoId] });
  const { page } = f;
  await waitGroups(page, [[modules[1].id, modules[2].id]]);
  assert.equal(await header(page, modules[0].id).getAttribute('aria-expanded'), 'true', 'A completed playing module stays open');
  const initialGroup = page.locator(groupSelector);
  assert.equal(await initialGroup.evaluate(node => node.open), false, 'Completed history starts compact');
  assert.equal(await header(page, modules[1].id).isVisible(), false);
  await initialGroup.locator(':scope > summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await initialGroup.evaluate(node => node.open), true, 'Native completed disclosures support keyboard expansion');
  await header(page, modules[1].id).click();
  assert.equal(await header(page, modules[1].id).getAttribute('aria-expanded'), 'true');
  assert.equal(await header(page, modules[0].id).getAttribute('aria-expanded'), 'true', 'Revision does not close the playing module');
  await waitGroups(page, [[modules[1].id, modules[2].id]]);

  await select(page, coreRows[3]);
  await waitGroups(page, [[modules[0].id, modules[1].id, modules[2].id]]);
  await page.locator('.lesson-canvas').getByRole('button', { name: 'Mark video watched', exact: true }).click();
  await waitGroups(page, [[modules[0].id, modules[1].id, modules[2].id]]);
  assert.equal(await header(page, modules[3].id).getAttribute('aria-expanded'), 'true', 'Finishing the current module leaves the final video and module open');
  await select(page, coreRows[4]);
  await waitGroups(page, [[modules[0].id, modules[1].id, modules[2].id, modules[3].id]]);

  // Opening several historical modules keeps their place and the current lesson.
  await revealModule(page, modules[0].id);
  await revealModule(page, modules[1].id);
  assert.equal(await header(page, modules[0].id).getAttribute('aria-expanded'), 'true');
  assert.equal(await header(page, modules[1].id).getAttribute('aria-expanded'), 'true');
  assert.equal(await header(page, modules[4].id).getAttribute('aria-expanded'), 'true');
  await waitGroups(page, [[modules[0].id, modules[1].id, modules[2].id, modules[3].id]]);
  await currentPlayer(page);
  await header(page, modules[4].id).click();
  assert.equal(await header(page, modules[4].id).getAttribute('aria-expanded'), 'false');
  const contrast = {};
  for (const scheme of ['light', 'dark']) contrast[scheme] = (await assertRenderedContrast(page, scheme)).toFixed(2);
  console.log('PASS: rendered group, module-label and lesson-locator text contrast; lowest text ratios ' + JSON.stringify(contrast));
  await returnToLesson(page, coreRows[4]);
  await page.locator('.course-path-switcher').getByRole('button', { name: 'C1', exact: true }).click();
  await returnToLesson(page, coreRows[4]);

  await filter(page, 'Saved');
  await waitGroups(page, []);
  await returnToLesson(page, coreRows[4]);
  await waitGroups(page, [[modules[0].id, modules[1].id, modules[2].id, modules[3].id]]);
  await filter(page, 'Unwatched');
  await waitGroups(page, []);
  assert.equal(await page.locator('[data-course-row]').count(), 1, 'Unwatched filtering bypasses historical groups');
  await filter(page, 'All');
  await courseTools(page);
  await page.getByRole('button', { name: 'Organise', exact: true }).click();
  await waitGroups(page, []);
  assert.equal(await page.locator('[data-course-module]').count(), published.course.modules.filter(module => module.path === 'C2').length, 'Organise exposes every module as a direct drop destination');
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await waitGroups(page, [[modules[0].id, modules[1].id, modules[2].id, modules[3].id]]);
  await assertPlayerPreserved(page, coreRows[4]);
  await captureFocusPreview(page, 'desktop');

  // Personal video playback has the same current-module protection.
  await select(page, snapshot.byId.get(added.id));
  await waitGroups(page, [[modules[0].id], [modules[2].id, modules[3].id]]);
  assert.equal(await header(page, modules[1].id).getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('.supp-lesson .complete-button').getAttribute('aria-pressed'), 'true');
  assert.equal(f.writes.length, 0, 'Browsing and completed-group expansion never edit the personal course');
  assert.equal(f.learner().notes[coreRows[0].id], learner.notes[coreRows[0].id]);
  assert.deepEqual(f.errors, []);
  await f.context.close();
  console.log('PASS: compact completed groups, keyboard revision, stable multiple open modules, current completion, core/personal playback protection, filters, Organise and playback-preserving lesson locator.');

  // Progress must be complete before deciding a module can be tucked away.
  const delayed = await fixture({ state, learner, supplementaryProgress: [], supplementaryReadDelay: 5000 });
  assert.equal(delayed.supplementaryLoaded(), false, 'The fixture supplementary read is still pending');
  assert.equal(await delayed.page.locator(groupSelector).count(), 0, 'No grouping before supplementary progress hydration');
  await delayed.page.waitForFunction(() => Boolean(document.querySelector('details.completed-module-group')));
  await waitGroups(delayed.page, [[modules[2].id]]);
  assert.equal(await header(delayed.page, modules[1].id).isVisible(), true, 'An unwatched personal addition keeps its module out of completed history');
  assert.deepEqual(delayed.errors, []);
  await delayed.context.close();
  console.log('PASS: pending mixed-video progress cannot prematurely hide modules, and an unfinished personal addition remains visible.');

  const mobile = await fixture({ mobile: true, state, learner, supplementaryProgress: [videoId] });
  const mp = mobile.page;
  await mp.addStyleTag({ content: 'nextjs-portal { display: none; }' });
  await waitGroups(mp, [[modules[1].id, modules[2].id]]);
  for (const width of [390, 320]) {
    await mp.setViewportSize({ width, height: 844 });
    for (const colorScheme of ['light', 'dark']) {
      await mp.emulateMedia({ colorScheme });
      await mp.locator(groupSelector).locator(':scope > summary').focus();
      assert.equal(await mp.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, width + 'px ' + colorScheme + ' layout has no horizontal overflow');
      const bounds = await mp.locator(groupSelector).boundingBox();
      assert.ok(bounds.width > 0 && bounds.x >= 0 && bounds.x + bounds.width <= width + 1, 'Completed row fits the mobile drawer');
    }
  }
  await select(mp, coreRows[3]);
  await openMap(mp);
  await waitGroups(mp, [[modules[0].id, modules[1].id, modules[2].id]]);
  await currentPlayer(mp);
  await header(mp, modules[3].id).click();
  await returnToLesson(mp, coreRows[3]);
  await mp.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
  await mp.locator('.lesson-canvas').getByRole('button', { name: 'Mark video watched', exact: true }).click();
  await select(mp, coreRows[4]);
  await openMap(mp);
  await waitGroups(mp, [[modules[0].id, modules[1].id, modules[2].id, modules[3].id]]);
  assert.equal(await mp.locator(groupSelector).evaluate(node => node.open), false, 'A finished module folds into compact history after moving to the next video');
  assert.deepEqual(mobile.errors, []);
  await mp.setViewportSize({ width: 390, height: 844 });
  await captureFocusPreview(mp, 'mobile');
  await mobile.context.close();
  console.log('PASS: completed history and return-to-lesson on narrow phones in light/dark themes without overflow.');

  const guest = await fixture({ guest: true });
  assert.equal(await guest.page.locator(groupSelector).count(), 0, 'Guests keep the public course outline');
  assert.equal(guest.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0, 'Guest grouping introduces no personal data reads');
  assert.deepEqual(guest.errors, []);
  await guest.context.close();
  console.log('PASS: guest outline and no-tracking boundaries remain intact.');
} finally {
  await browser.close();
}
