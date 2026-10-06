import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model, origin } from './personal-course-browser-fixture.mjs';
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
const previous = JSON.parse(readFileSync('scripts/fixtures/surge-protection-previous.json','utf8'));
const additions = JSON.parse(readFileSync('scripts/fixtures/surge-protection-additions.json','utf8'));
const snapshot = model.personalCourseSnapshot(model.parsePersonalCourse(previous));
const sourceId = 'module-05-section-5', destinationId = 'module-05-arc-fault', arcFaultId = 'course-lIit5k8QVj8';
const note = 'My existing arc-fault lesson notes stay with this video.';
const guestOnly = process.argv.includes('--guest-only');
const learner = {...initialLearnerState,activeLessonId:arcFaultId,autoNextEnabled:false,completedLessonIds:['p05-spd',arcFaultId,'p05-l14'],bookmarkedLessonIds:[arcFaultId],notes:{[arcFaultId]:note},videoPositions:{lIit5k8QVj8:81},updatedAt:'2026-10-02T10:00:00Z'};
async function openMap(page) {
  if (await page.evaluate(()=>matchMedia('(max-width:1180px)').matches) && !await page.locator('.course-map.drawer-open').count()) {
    await page.getByRole('button',{name:'Open course map',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.course-map').getBoundingClientRect().left>=-1);
  }
}
async function closeMap(page) {
  if (await page.locator('.course-map.drawer-open').count()) await page.locator('.course-map').getByRole('button',{name:'Close course map',exact:true}).click();
}
async function visit(page,id) {
  await page.goto(origin+'/#learn/'+id);
  await page.reload();
  await page.locator('.lesson-canvas h1').filter({hasText:snapshot.byId.get(id).title}).waitFor();
}
async function progress(page,watched) {
  await openMap(page);
  await page.waitForFunction(({watched,total})=>document.querySelector('.course-summary .overall-progress strong')?.textContent===watched+'/'+total,{watched,total:snapshot.allRows.length});
}
try {
  for (const mobile of guestOnly ? [] : [false,true]) {
    const f=await fixture({mobile,state:previous,learner}),{page}=f;
    if (mobile) await page.setViewportSize({width:320,height:740});
    await visit(page,arcFaultId);
    await progress(page,3);
    const courseModule = page.locator('.module-accordion').filter({hasText:'Fault Protection, Earthing and Protective Devices'}).first();
    assert.deepEqual(await courseModule.locator('.section-title').allTextContents(),snapshot.sectionsByModule['module-05'].map(section=>section.title));
    for (const sectionId of [sourceId,destinationId,'module-05-section-6']) {
      assert.deepEqual(await page.locator('[data-course-section="'+sectionId+'"]').locator('[data-course-row]').evaluateAll(rows=>rows.map(row=>row.dataset.courseRow)),snapshot.rows[sectionId].map(row=>row.id));
    }
    assert.equal(f.writes.length,0,'Opening the revised course does not overwrite the saved arrangement');
    assert.equal(f.state().curriculumRevision,3);
    await closeMap(page);
    await page.locator('.lesson-canvas').getByText('Your lesson notes',{exact:true}).click();
    assert.equal(await page.getByLabel('Your lesson notes',{exact:true}).inputValue(),note);
    assert.ok(f.learner().bookmarkedLessonIds.includes(arcFaultId));
    assert.ok(f.learner().videoPositions.lIit5k8QVj8>=81);
    for (const video of additions) {
      await visit(page,video.id);
      assert.equal(new URL(await page.locator('.video-frame iframe').getAttribute('src')).pathname,'/embed/'+video.videoId);
      await closeMap(page);
      assert.ok((await page.locator('.lesson-canvas').textContent()).includes('John Ward'));
      assert.ok(await page.locator('.lesson-canvas [data-video-actions="'+video.id+'"]').count());
    }
    await page.locator('.lesson-canvas').getByRole('button',{name:'Mark video watched',exact:true}).click();
    await progress(page,4);
    assert.ok(f.learner().completedLessonIds.includes(additions.at(-1).id));
    await visit(page,arcFaultId);await closeMap(page);
    await page.locator('.lesson-canvas [data-video-actions="'+arcFaultId+'"]').click();
    await page.getByRole('menuitem',{name:'Move to…',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:'Move video',exact:true});
    await dialog.getByLabel('Find a destination section').fill('Surge protection devices');
    await dialog.locator('.editor-section-results button').first().click();
    await dialog.getByRole('radio',{name:'At the beginning',exact:true}).check();
    await dialog.getByRole('button',{name:'Move video',exact:true}).click();
    await dialog.waitFor({state:'hidden'});
    assert.equal(f.state().curriculumRevision, 6);
    assert.equal(model.personalCourseSnapshot(f.state()).byId.get(arcFaultId).sectionId,sourceId);
    await page.locator('.personal-course-notice').getByRole('button',{name:'Undo',exact:true}).click();
    await page.getByText('Change undone.',{exact:true}).waitFor();
    assert.equal(model.personalCourseSnapshot(f.state()).byId.get(arcFaultId).sectionId,destinationId);
    for (const [sectionId,ids] of Object.entries(previous.groups)) {
      if (sectionId===sourceId) continue;
      assert.deepEqual(f.state().groups[sectionId],ids,'Existing unrelated group survives the edit and Undo: '+sectionId);
    }
    await page.reload();await progress(page,4);
    assert.equal(f.learner().notes[arcFaultId],note);
    assert.ok(f.learner().bookmarkedLessonIds.includes(arcFaultId));
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.addStyleTag({content:'nextjs-portal{display:none;}'});
    await page.locator('[data-course-section="'+destinationId+'"]').scrollIntoViewIfNeeded();
    await page.screenshot({path:'work/editor-preview/surge-protection-'+(mobile?'mobile':'desktop')+'.png'});
    assert.deepEqual(f.errors,[]);
    await f.context.close();
    console.log('PASS '+(mobile?'320px mobile':'desktop')+': separate SPD/AFDD sections, all six embeds, saved notes/bookmarks/resume/progress, existing move/Undo/reload and unrelated placements.');
  }
  for (const mobile of [false,true]) {
    const f=await fixture({guest:true,mobile}),{page}=f;
    if (mobile) await page.setViewportSize({width:320,height:740});
    for (const video of additions) {
      await visit(page,video.id);
      assert.equal(new URL(await page.locator('.video-frame iframe').getAttribute('src')).pathname,'/embed/'+video.videoId);
      await closeMap(page);
      assert.ok((await page.locator('.lesson-canvas').textContent()).includes('John Ward'));
    }
    await visit(page,arcFaultId);await openMap(page);
    const courseModule=page.locator('.module-accordion').filter({hasText:'Fault Protection, Earthing and Protective Devices'}).first();
    assert.deepEqual(await courseModule.locator('.section-title').allTextContents(),snapshot.sectionsByModule['module-05'].map(section=>section.title));
    for (const sectionId of [sourceId,destinationId,'module-05-section-6']) {
      const section=page.locator('[data-course-section="'+sectionId+'"]');
      assert.deepEqual(await section.locator('[data-course-row]').evaluateAll(rows=>rows.map(row=>row.dataset.courseRow)),snapshot.rows[sectionId].map(row=>row.id));
      const number=snapshot.sectionsByModule['module-05'].find(section=>section.id===sectionId).number;
      assert.equal(await section.locator('.section-eyebrow').textContent(),'Section '+String(number).padStart(2,'0'));
    }
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await page.addStyleTag({content:'nextjs-portal{display:none;}'});
    await page.locator('[data-course-section="'+destinationId+'"]').scrollIntoViewIfNeeded();
    await page.screenshot({path:'work/editor-preview/surge-protection-guest-'+(mobile?'mobile':'desktop')+'.png'});
    assert.equal(f.writes.length,0);
    assert.deepEqual(f.errors,[]);
    await f.context.close();
    console.log('PASS guest '+(mobile?'320px mobile':'desktop')+': all six new embeds, credited creator, Section 08 SPD/09 AFDD/10 selectivity, complete ordered membership and no horizontal overflow.');
  }
} finally { await browser.close(); }
