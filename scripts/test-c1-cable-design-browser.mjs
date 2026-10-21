import assert from 'node:assert/strict';
import fs from 'node:fs';
import { browser, fixture, model, origin, revealCourseModule } from './personal-course-browser-fixture.mjs';
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const additions = JSON.parse(fs.readFileSync('scripts/fixtures/c1-cable-design-additions.json','utf8'));
const previous = JSON.parse(fs.readFileSync('scripts/fixtures/c1-cable-design-previous.json','utf8'));
const sectionId='c1-cable-design-process';
const title='Seven-Step Cable Design: From Load Current to Fault Checks';
const learner={...initialLearnerState,activeLessonId:additions[0].id,completedLessonIds:['p06-l05'],bookmarkedLessonIds:['p06-l05'],notes:{'p06-l05':'My existing cable-design working'},autoNextEnabled:false};
async function visit(page, lesson) {
  await page.goto(origin+'/#learn/'+lesson.id);
  await page.reload();
  await page.locator('.lesson-canvas h1').filter({hasText:lesson.title}).waitFor();
  assert.ok((await page.locator('.lesson-canvas iframe').getAttribute('src')).includes('/embed/'+lesson.videoId));
}
try {
  for(const mobile of [false,true]) {
    const f=await fixture({mobile,state:previous,learner}),{page}=f;
    if(mobile)await page.setViewportSize({width:390,height:844});
    await visit(page,additions[0]);
    if(mobile && !await page.locator('.course-map.drawer-open').count())await page.getByRole('button',{name:'Open course map',exact:true}).click();
    await revealCourseModule(page,'c1-design');
    const section=page.locator(`[data-course-section="${sectionId}"]`);
    await section.locator('summary').waitFor();
    if(!await section.locator('details.course-topic-group').evaluate(node=>node.open))await section.locator('summary').click();
    assert.ok((await section.locator('summary').textContent()).includes(title));
    assert.deepEqual(await section.locator('[data-course-row]').evaluateAll(rows=>rows.map(row=>row.dataset.courseRow)),additions.map(v=>v.id));
    assert.equal(await section.locator('.course-section-description').count(),0);
    assert.equal(await page.getByText(/Follow the same lighting and socket circuits/).count(),0);
    const displayedSections=await page.locator('[data-course-module="c1-design"] [data-course-section]').evaluateAll(rows=>rows.map(row=>row.dataset.courseSection));
    assert.ok(displayedSections.indexOf('c1-cable-factors-foundation')<displayedSections.indexOf(sectionId));
    assert.ok(displayedSections.indexOf(sectionId)<displayedSections.indexOf('c1-design-section-2'));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await section.locator('summary').scrollIntoViewIfNeeded();
    await page.screenshot({path:`work/editor-preview/c1-cable-design-${mobile?'mobile':'desktop'}.png`,fullPage:true});
    if(mobile)await page.locator('.course-map').getByRole('button',{name:'Close course map',exact:true}).click();
    for(const lesson of additions)await visit(page,lesson);
    assert.ok(f.learner().completedLessonIds.includes('p06-l05'));
    assert.ok(f.learner().bookmarkedLessonIds.includes('p06-l05'));
    assert.equal(f.learner().notes['p06-l05'],'My existing cable-design working');
    assert.equal(f.writes.length,0,'Browsing never writes the saved personal course');
    assert.deepEqual(f.errors,[]);
    await f.context.close();
    console.log(`PASS ${mobile?'phone':'desktop'}: seven ordered lessons, section placement, matching players, responsive layout and saved notes/progress.`);
  }
  const guest=await fixture({guest:true});
  await visit(guest.page,additions[0]);
  await revealCourseModule(guest.page,'c1-design');
  const guestSection=guest.page.locator(`[data-course-section="${sectionId}"]`);
  if(!await guestSection.locator('details.course-topic-group').evaluate(node=>node.open))await guestSection.locator('summary').click();
  assert.equal(await guestSection.locator('[data-course-row]').count(),7);
  assert.equal(guest.reads.filter(p=>/personal-course|learner-state/.test(p)).length,0);
  assert.deepEqual(guest.errors,[]);
  assert.equal(model.personalCourseSnapshot(model.parsePersonalCourse(previous)).rows[sectionId].length,7);
  await guest.context.close();
  console.log('PASS guest: connected design series available without personal account requests.');
}finally{await browser.close();}
