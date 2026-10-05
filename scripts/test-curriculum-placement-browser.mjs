import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { browser, fixture, model, origin } from './personal-course-browser-fixture.mjs';
const { initialLearnerState }=await import('../work/editor-browser/learner-state.js');
const previous=JSON.parse(readFileSync('scripts/fixtures/curriculum-review-previous.json','utf8'));
const upgraded=model.parsePersonalCourse(previous),snapshot=model.personalCourseSnapshot(upgraded);
const coreMarks=['p10-l04','p08-l13','p15-v2-l04'];
const notes='My RCD diagnosis notes remain attached to this video.';
const learner={...initialLearnerState,activeLessonId:'p08-l13',autoNextEnabled:false,completedLessonIds:coreMarks,bookmarkedLessonIds:['p08-l13'],notes:{'p08-l13':notes},videoPositions:{Mxv3OVVjANs:81},updatedAt:'2026-10-01T10:00:00Z'};
async function openMap(page){
  if(await page.evaluate(()=>matchMedia('(max-width:1180px)').matches)&&!await page.locator('.course-map.drawer-open').count()){
    await page.getByRole('button',{name:'Open course map',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('.course-map').getBoundingClientRect().left>=-1);
  }
}
async function closeMap(page){
  if(await page.locator('.course-map.drawer-open').count())await page.locator('.course-map').getByRole('button',{name:'Close course map',exact:true}).click();
}
async function progress(page,watched,total){
  await openMap(page);
  await page.waitForFunction(({watched,total})=>document.querySelector('.course-summary .overall-progress strong')?.textContent===watched+'/'+total,{watched,total});
}
async function visit(page,id){
  await page.goto(origin+'/#learn/'+id);
  await page.reload();
  await page.locator('.lesson-canvas h1').filter({hasText:snapshot.byId.get(id).title}).waitFor();
}
async function undo(page){
  await closeMap(page);
  await page.locator('.personal-course-notice').getByRole('button',{name:'Undo',exact:true}).click();
  await page.getByText('Change undone.',{exact:true}).waitFor();
}
async function selectMethod(page){
  await openMap(page);
  const faultModule=page.locator('.module-accordion').filter({hasText:'Systematic Fault Diagnosis'}).first();
  if(!(await faultModule.getAttribute('class')).split(' ').includes('open'))await faultModule.locator(':scope > button').click();
  const section=page.locator('[data-course-section="module-09-section-1"]');
  if(await section.locator('details').getAttribute('open')===null)await section.locator('summary').click();
  await page.locator('[data-course-row="c2-troubleshooting-method"] button:not(.course-drag-handle):not(.video-actions-button)').first().click();
  await page.locator('.supp-lesson h1').filter({hasText:'A Systematic Electrical Troubleshooting Method'}).waitFor();
}
try{
  for(const mobile of [false,true]){
    const f=await fixture({mobile,state:previous,learner,supplementaryProgress:['eWHQRcO071E','QVMpVIYm594']}),{page}=f;
    if(mobile)await page.setViewportSize({width:320,height:740});
    await progress(page,5,snapshot.allRows.length);
    let path='C2';
    for(const courseModule of snapshot.course.modules){
      const nextPath=courseModule.path==='Professional'?'Advanced':courseModule.path;
      if(path!==nextPath){await page.locator('.course-map').getByRole('button',{name:nextPath,exact:true}).click();path=nextPath;await openMap(page);}
      const accordion=page.locator('.module-accordion').filter({hasText:courseModule.title}).first();
      if(!(await accordion.getAttribute('class')).split(' ').includes('open'))await accordion.locator(':scope > button').click();
      const expected=snapshot.allRows.filter(row=>row.moduleId===courseModule.id);
      assert.deepEqual(await accordion.locator('[data-course-row]').evaluateAll(rows=>rows.map(row=>row.dataset.courseRow)),expected.map(row=>row.id),courseModule.title+' has the actual reviewed video sequence');
      assert.deepEqual(await accordion.locator('.section-title').allTextContents(),snapshot.sectionsByModule[courseModule.id].map(s=>s.title));
      assert.equal(await accordion.locator('[data-video-actions]').count(),expected.length,'The existing three-dot actions remain on every row');
    }
    assert.equal(f.writes.length,0,'Merely reading the new groups does not save or overwrite a personal course');
    assert.equal(f.state().curriculumRevision,2);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);

    await visit(page,'p08-l13');await closeMap(page);
    await page.locator('.lesson-canvas').getByText('Your lesson notes',{exact:true}).click();
    assert.equal(await page.getByLabel('Your lesson notes',{exact:true}).inputValue(),notes);
    assert.ok(f.learner().bookmarkedLessonIds.includes('p08-l13'));
    assert.ok(f.learner().videoPositions.Mxv3OVVjANs>=81);
    await page.locator('.lesson-canvas [data-video-actions="p08-l13"]').click();
    await page.getByRole('menuitem',{name:'Move to…',exact:true}).click();
    const dialog=page.getByRole('dialog',{name:'Move video',exact:true});
    await dialog.getByLabel('Find a destination section').fill('Planning kitchen sockets');
    await dialog.locator('.editor-section-results button').first().click();
    await dialog.getByRole('radio',{name:'At the beginning',exact:true}).check();
    await dialog.getByRole('button',{name:'Move video',exact:true}).click();
    await dialog.waitFor({state:'hidden'});
    assert.equal(f.state().curriculumRevision, 5);
    assert.equal(model.personalCourseSnapshot(f.state()).byId.get('p08-l13').sectionId,'module-03-section-5');
    await progress(page,5,snapshot.allRows.length);
    await undo(page);
    assert.equal(model.personalCourseSnapshot(f.state()).byId.get('p08-l13').sectionId,'module-09-rcd-leakage');
    await page.reload();await progress(page,5,snapshot.allRows.length);

    const method='c2-troubleshooting-method';
    const section=page.locator('[data-course-section="module-09-section-1"]');
    await selectMethod(page);
    await closeMap(page);
    await page.locator('.supp-lesson').getByRole('button',{name:'Mark video watched',exact:true}).click();
    await progress(page,6,snapshot.allRows.length);
    assert.equal(await section.locator('[role="progressbar"]').getAttribute('aria-valuenow'),'1');
    assert.equal(await section.locator('[role="progressbar"]').getAttribute('aria-valuemax'),'1');
    await closeMap(page);
    await page.locator('.lesson-canvas [data-video-actions="'+method+'"]').click();
    await page.getByRole('menuitem',{name:'Archive video',exact:true}).click();
    await page.getByText('Video archived. Your notes and progress are kept.',{exact:true}).waitFor();
    await progress(page,5,snapshot.allRows.length-1);
    await undo(page);await progress(page,6,snapshot.allRows.length);
    await selectMethod(page);
    await closeMap(page);
    await page.locator('.lesson-canvas [data-video-actions="'+method+'"]').click();
    await page.getByRole('menuitem',{name:'Delete permanently…',exact:true}).click();
    await page.getByRole('dialog',{name:'Delete video permanently?',exact:true}).getByRole('button',{name:'Delete permanently',exact:true}).click();
    await page.getByText('Video permanently removed from your course.',{exact:true}).waitFor();
    await progress(page,5,snapshot.allRows.length-1);
    await page.reload();await progress(page,5,snapshot.allRows.length-1);
    assert.ok(f.state().deletedIds.includes(method));
    assert.ok(!model.personalCourseSnapshot(f.state()).byId.has(method),'Default merging does not resurrect the removed section-root video');
    assert.equal(f.learner().notes['p08-l13'],notes);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    assert.deepEqual(f.errors,[]);
    await f.context.close();
    console.log('PASS '+(mobile?'320px mobile':'desktop')+': all 25 modules and 122 section placements, preserved menus/notes/resume, move/Undo/reload, supplementary-only watched/archive/delete totals.');
  }
}finally{await browser.close();}
