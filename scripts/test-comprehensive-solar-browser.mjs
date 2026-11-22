import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model, origin, openCourseTools } from './personal-course-browser-fixture.mjs';

const previous = JSON.parse(readFileSync('scripts/fixtures/solar-pathway-previous.json', 'utf8'));
const priorComprehensive = JSON.parse(readFileSync('scripts/fixtures/comprehensive-solar-revision-14.json', 'utf8'));
const course = model.personalCourseSnapshot(model.publishedPersonalCourse).course;
const lessons = course.modules.filter(module => module.path === 'Solar Comprehensive').flatMap(module => module.lessons);
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');

try {
  for (const mobile of [false, true]) {
    const f = await fixture({ mobile, guest: true }), { page } = f;
    if (mobile) {
      await page.setViewportSize({ width: 320, height: 740 });
      await page.locator('.course-map').getByRole('button', { name: 'Close course map', exact: true }).click();
    }
    await page.getByRole('button', { name: 'Course overview', exact: true }).click();
    const filter = page.getByRole('group', { name: 'Filter course pathway' });
    await filter.getByRole('button', { name: 'Comprehensive Solar Installation Training · T1–T3', exact: true }).click();
    assert.equal(await page.locator('.curriculum-modules > details').count(), 13);
    await page.getByRole('button', { name: 'Expand all', exact: true }).click();
    assert.equal(await page.locator('.curriculum-lessons button:visible').count(), 72);
    await page.locator('.curriculum-lessons button').first().click();
    await page.locator('.lesson-canvas h1').filter({ hasText: lessons[0].title }).waitFor();
    assert.equal(await page.locator('.course-path-select select').inputValue(), 'Solar Comprehensive');
    assert.equal(await page.locator('.course-path-select select option:checked').textContent(), 'Solar Training T1–T3');

    // Desktop walks the complete published order; the phone checks the same
    // first/last destinations and responsive controls at a narrow viewport.
    const count = mobile ? 2 : lessons.length;
    for (let i = 0; i < count; i++) {
      const lesson = lessons[i];
      await page.locator('.lesson-canvas h1').filter({ hasText: lesson.title }).waitFor();
      assert.match(await page.locator('.lesson-canvas iframe').getAttribute('src'), new RegExp('/embed/' + lesson.videoId));
      assert.equal(await page.locator('.lesson-section-introduction').count(), 0);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      if (i < count - 1) await page.locator('.lesson-canvas .inline-player-controls').getByRole('button', { name: 'Next lesson', exact: true }).click();
    }
    if (mobile) {
      await page.goto(origin + '/#learn/' + lessons.at(-1).id);
      await page.reload();
      await page.locator('.lesson-canvas h1').filter({ hasText: lessons.at(-1).title }).waitFor();
      await page.getByRole('button', { name: 'Open course map', exact: true }).click();
      await page.waitForFunction(() => document.querySelector('.course-map').getBoundingClientRect().left >= -1);
      assert.equal(await page.locator('.course-path-select select').evaluate(select => {
        const style = getComputedStyle(select), canvas = document.createElement('canvas'), context = canvas.getContext('2d');
        context.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        return context.measureText(select.selectedOptions[0].textContent).width <= select.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      }), true, 'The full pathway label fits in the phone selector');
    }
    await page.screenshot({ path: 'work/editor-preview/comprehensive-solar-' + (mobile ? 'mobile' : 'desktop') + '.png' });
    assert.equal(f.reads.filter(path => /personal-course|learner-state|supplementary-progress/.test(path)).length, 0);
    assert.equal(f.writes.length, 0);
    assert.deepEqual(f.errors, []);
    await f.context.close();
    console.log('PASS ' + (mobile ? '320px phone' : 'desktop') + ': comprehensive pathway filter, 13 modules, 72 videos, playback navigation and guest privacy.');
  }

  const f = await fixture({ state: previous });
  await f.page.goto(origin + '/#learn/' + lessons[0].id);
  await f.page.reload();
  await f.page.locator('.lesson-canvas h1').filter({ hasText: lessons[0].title }).waitFor();
  await f.page.locator('.pathway-progress-count').filter({ hasText: '0/72 videos watched' }).waitFor();
  assert.equal(await f.page.locator('.course-path-select select').inputValue(), 'Solar Comprehensive');
  await openCourseTools(f.page);
  await f.page.getByRole('button', { name: 'Organise', exact: true }).click();
  assert.deepEqual(await f.page.locator('[data-course-path]').evaluateAll(nodes => nodes.map(node => node.dataset.coursePath)), ['C2', 'C1', 'Solar', 'Solar Comprehensive', 'PV3x', 'EPRA T3', 'Professional']);
  await f.page.setViewportSize({ width: 320, height: 740 });
  if (!await f.page.locator('.course-map.drawer-open').count()) await f.page.getByRole('button', { name: 'Open course map', exact: true }).click();
  assert.equal(await f.page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.deepEqual(f.state(), previous, 'Viewing an older saved course does not overwrite it');
  assert.equal(f.writes.length, 0);
  assert.deepEqual(f.errors, []);
  await f.context.close();
  console.log('PASS saved account: new pathway appears with separate 0/72 progress, existing arrangement remains stored and phone controls fit.');

  const saved = await fixture({
    state: priorComprehensive,
    learner: { ...initialLearnerState, activeLessonId: lessons[0].id, autoNextEnabled: false, completedLessonIds: ['solar-comprehensive-video-25', 'solar-comprehensive-video-55'] },
  });
  await saved.page.goto(origin + '/#learn/' + lessons[0].id);
  await saved.page.reload();
  await saved.page.locator('.lesson-canvas h1').filter({ hasText: 'Plan an Off-Grid Solar System: Six Design Steps' }).waitFor();
  await saved.page.locator('.pathway-progress-count').filter({ hasText: '2/72 videos watched' }).waitFor();
  assert.equal(await saved.page.locator('.course-path-select select').inputValue(), 'Solar Comprehensive');
  assert.deepEqual(saved.state(), priorComprehensive, 'Opening the new order does not overwrite the saved revision-14 course');
  assert.equal(saved.writes.length, 0);
  assert.deepEqual(saved.errors, []);
  await saved.context.close();
  console.log('PASS saved comprehensive course: moved lessons keep their watched marks and the prior stored arrangement is not overwritten on viewing.');
} finally {
  await browser.close();
}
