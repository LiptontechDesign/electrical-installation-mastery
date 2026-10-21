import assert from 'node:assert/strict';
import { browser, fixture, model, origin, openCourseTools, revealCourseModule } from './personal-course-browser-fixture.mjs';
import { progressFixture } from './course-progress-fixture.mjs';
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const published = model.personalCourseSnapshot(model.publishedPersonalCourse);
const seed = progressFixture(model);
const outside = published.allRows.find(row => row.kind === 'core' && row.moduleId === 'module-05' && row.sectionId !== seed.sectionId);
seed.state.archivedLessonIds = seed.state.archivedLessonIds.filter(id => id !== outside.id);
const sectionTitle = published.sectionsByModule['module-05'].find(s => s.id === seed.sectionId).title;
const learner = { ...initialLearnerState, autoNextEnabled: false, activeLessonId: seed.coreIds[0], completedLessonIds: [seed.coreIds[0], 'p01-l01'], videoCompletionCounts: { [seed.coreIds[0]]: 3 }, bookmarkedLessonIds: [seed.coreIds[1]], notes: { [seed.coreIds[0]]: 'Keep my original section notes' } };
const dialogFor = page => page.getByRole('dialog', { name: 'Mark section as watched?', exact: true });
async function reveal(page, moduleId, sectionId) {
  if (await page.evaluate(() => matchMedia('(max-width:1180px)').matches) && !await page.locator('.course-map.drawer-open').count()) await page.getByRole('button', { name: 'Open course map', exact: true }).click();
  await revealCourseModule(page, moduleId);
  const section = page.locator(`[data-course-section="${sectionId}"]`);
  if (!await section.locator('details.course-topic-group').evaluate(node => node.open)) await section.locator('summary').click();
  return section;
}
async function visit(page, id) {
  await page.goto(origin + '/#learn/' + id); await page.reload();
  await page.locator('.lesson-canvas h1').waitFor();
}
const waitForCoreSave = (page, ids) => page.waitForResponse(response => response.url().endsWith('/api/user-data/learner-state') && response.request().method() === 'PUT' && ids.every(id => response.request().postDataJSON().payload.completedLessonIds.includes(id)));
try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, state: seed.state, learner, supplementaryProgress: ['otherMark01'] }), { page } = f;
    if (mobile) await page.setViewportSize({ width: 320, height: 740 });
    await page.emulateMedia({ colorScheme: mobile ? 'dark' : 'light' });
    await visit(page, seed.coreIds[0]);
    const section = await reveal(page, 'module-05', seed.sectionId);
    const action = section.getByRole('button', { name: 'Mark section 3 as watched', exact: true });
    await action.waitFor({ state: 'visible' });
    await page.waitForFunction(() => !document.querySelector('[data-course-section="module-05-section-3"] .section-watch-action').disabled);
    assert.equal(await page.getByRole('button', { name: /Mark.*module.*watched/i }).count(), 0);
    assert.equal(await section.getByRole('progressbar', { name: sectionTitle + ' progress', exact: true }).getAttribute('aria-valuenow'), '1');
    const originalMarks = [...f.learner().completedLessonIds], originalSupplementary = [...f.supplementaryProgress()];
    await action.click();
    let dialog = dialogFor(page);
    await dialog.waitFor();
    assert.ok((await dialog.textContent()).includes('all 5 videos'));
    assert.ok((await dialog.textContent()).includes(sectionTitle));
    assert.equal(await dialog.getByRole('button', { name: 'Cancel', exact: true }).evaluate(node => node === document.activeElement), true, 'Cancel receives initial focus');
    assert.deepEqual(f.learner().completedLessonIds, originalMarks, 'Opening the confirmation does not mark videos');
    assert.deepEqual(f.supplementaryProgress(), originalSupplementary);
    await page.screenshot({ path: `work/editor-preview/section-watched-confirm-${mobile ? 'mobile-dark' : 'desktop-light'}.png`, fullPage: true });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(await dialog.evaluate(node => node.scrollWidth > node.clientWidth), false);
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(await action.evaluate(node => node === document.activeElement), true, 'Closing returns focus to the section action');
    assert.deepEqual(f.learner().completedLessonIds, originalMarks);

    // A lesson filter changes visible rows, while the action still targets the
    // complete selected section, including personal and optional videos.
    await page.getByRole('button', { name: 'Saved 1', exact: true }).click();
    assert.equal(await section.locator('[data-course-row]').count(), 1);
    const hash = new URL(page.url()).hash;
    await action.click();
    dialog = dialogFor(page);
    await dialog.getByRole('button', { name: 'Cancel', exact: true }).click();
    await dialog.waitFor({ state: 'hidden' });
    assert.deepEqual(f.learner().completedLessonIds, originalMarks, 'Cancel preserves every watched mark');
    assert.deepEqual(f.supplementaryProgress(), originalSupplementary);
    await action.click();
    dialog = dialogFor(page);
    const coreSaved = waitForCoreSave(page, seed.coreIds);
    const supplementarySaved = page.waitForResponse(response => response.url().endsWith('/api/user-data/supplementary-progress') && response.request().method() === 'PUT' && seed.added.every(video => response.request().postDataJSON().payload.includes(video.videoId)));
    await dialog.getByRole('button', { name: 'Mark as watched', exact: true }).click();
    await Promise.all([coreSaved, supplementarySaved]);
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).hash, hash, 'Bulk marking does not switch the playing lesson');
    assert.ok(seed.coreIds.every(id => f.learner().completedLessonIds.includes(id)));
    assert.ok(seed.added.every(video => f.supplementaryProgress().includes(video.videoId)));
    assert.ok(f.supplementaryProgress().includes('otherMark01'), 'Unrelated supplementary watched history survives');
    assert.ok(!f.learner().completedLessonIds.includes(outside.id), 'Another section in the same module remains unwatched');
    assert.equal(f.learner().videoCompletionCounts[seed.coreIds[0]], 3, 'Existing repeat-completion count is unchanged');
    for (const id of seed.coreIds.slice(1)) assert.equal(f.learner().videoCompletionCounts[id], 1);
    assert.equal(f.learner().notes[seed.coreIds[0]], 'Keep my original section notes');
    assert.deepEqual(f.learner().bookmarkedLessonIds, learner.bookmarkedLessonIds);
    assert.equal(await action.isDisabled(), true);
    assert.ok((await action.textContent()).includes('Section watched'));
    assert.equal(await section.getByRole('progressbar', { name: sectionTitle + ' progress', exact: true, includeHidden: true }).getAttribute('aria-valuenow'), '5');
    await openCourseTools(page);
    await page.getByRole('button', { name: 'Organise', exact: true }).click();
    assert.equal(await page.getByRole('button', { name: /Mark.*module.*watched/i }).count(), 0, 'Organise mode also has no whole-module action');
    await page.getByRole('button', { name: 'Done', exact: true }).click();
    await page.reload(); await page.locator('.lesson-canvas h1').waitFor();
    const reloaded = await reveal(page, 'module-05', seed.sectionId);
    assert.equal(await reloaded.getByRole('button', { name: 'Mark section 3 as watched', exact: true }).isDisabled(), true, 'Section completion survives reload');
    assert.equal(f.writes.length, 0, 'Progress updates do not edit the personal course arrangement');
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log(`PASS ${mobile ? '320px dark phone' : 'light desktop'}: normal-study action, confirmation/Cancel/Escape/focus, all mixed section rows through filters, exact section scope, idempotence and saved progress.`);
  }

  const c1 = await fixture({ learner: { ...initialLearnerState, activeLessonId: 'c1-cable-process-01', autoNextEnabled: false } });
  await visit(c1.page, 'c1-cable-process-01');
  const cableSection = await reveal(c1.page, 'c1-design', 'c1-cable-design-process');
  assert.equal(await cableSection.locator('.course-section-description').count(), 0);
  assert.equal(await c1.page.getByText(/Follow the same lighting and socket circuits/).count(), 0);
  await cableSection.getByRole('button', { name: 'Mark section 5 as watched', exact: true }).click();
  const cableIds = published.rows['c1-cable-design-process'].map(row => row.id);
  const saved = waitForCoreSave(c1.page, cableIds);
  await dialogFor(c1.page).getByRole('button', { name: 'Mark as watched', exact: true }).click();
  await saved;
  assert.deepEqual([...c1.learner().completedLessonIds].sort(), [...cableIds].sort(), 'Exactly the seven design lessons are marked');
  assert.ok(!c1.learner().completedLessonIds.includes('p06-l05'));
  assert.deepEqual(c1.errors, []); await c1.context.close();

  const guest = await fixture({ guest: true });
  await visit(guest.page, 'c1-cable-process-01');
  await reveal(guest.page, 'c1-design', 'c1-cable-design-process');
  assert.equal(await guest.page.locator('.section-watch-action').count(), 0);
  assert.equal(guest.reads.filter(path => /personal-course|learner-state/.test(path)).length, 0);
  assert.deepEqual(guest.errors, []); await guest.context.close();
  console.log('PASS C1: all seven design lessons only; removed description; guests have no tracked completion controls.');
} finally { await browser.close(); }
