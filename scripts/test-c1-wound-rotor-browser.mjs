import assert from 'node:assert/strict';
import fs from 'node:fs';
import {browser,fixture,origin,revealCourseModule} from './personal-course-browser-fixture.mjs';
const {initialLearnerState}=await import('../work/editor-browser/learner-state.js');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const additions=read('scripts/fixtures/c1-wound-rotor-additions.json'),previous=read('scripts/fixtures/c1-wound-rotor-previous.json');
const sections=read('app/learning-sections.json'),catalog=read('app/video-catalog.json');
const learner={...initialLearnerState,activeLessonId:'p06-l05',completedLessonIds:['p06-l05'],bookmarkedLessonIds:['p06-l05'],notes:{'p06-l05':'My existing design working'},autoNextEnabled:false};
async function visit(page,lesson){
 await page.goto(origin+'/#learn/'+lesson.id);await page.reload();
 await page.locator('.lesson-canvas h1').filter({hasText:lesson.title}).waitFor();
 assert.ok((await page.locator('.lesson-canvas iframe').getAttribute('src')).includes('/embed/'+lesson.videoId));
 const note=catalog.modules.flatMap(m=>m.lessons).find(l=>l.id===lesson.id).studyNote;
 assert.ok((await page.locator('.lesson-section-introduction').textContent()).includes(note));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
}
try{
 for(const mobile of [false,true]){
  const f=await fixture({mobile,state:previous,learner}),{page}=f;
  if(mobile)await page.setViewportSize({width:390,height:844});
  for(const lesson of additions){
   await visit(page,lesson);
   if(mobile&&!await page.locator('.course-map.drawer-open').count())await page.getByRole('button',{name:'Open course map',exact:true}).click();
   const section=sections.find(s=>s.lessonIds.includes(lesson.id));await revealCourseModule(page,section.moduleId);
   const group=page.locator(`[data-course-section="${section.id}"]`);
   if(!await group.locator('details.course-topic-group').evaluate(node=>node.open))await group.locator('summary').click();
   assert.ok((await group.locator('summary').textContent()).includes(section.title));
   assert.equal(await group.locator('[data-course-row]').count(),section.lessonIds.length);
   assert.equal(await group.locator('.course-section-description').count(),0);
   const ids=await page.locator(`[data-course-module="${section.moduleId}"] [data-course-section]`).evaluateAll(nodes=>nodes.map(n=>n.dataset.courseSection));
   assert.deepEqual(ids,sections.filter(s=>s.moduleId===section.moduleId).map(s=>s.id));
   if(mobile)await page.locator('.course-map').getByRole('button',{name:'Close course map',exact:true}).click();
  }
  await visit(page,additions.find(l=>l.id==='c1-wound-rotor-resistance-torque'));
  await page.screenshot({path:`work/editor-preview/c1-wound-rotor-${mobile?'mobile':'desktop'}.png`,fullPage:true});
  assert.ok(f.learner().completedLessonIds.includes('p06-l05'));assert.ok(f.learner().bookmarkedLessonIds.includes('p06-l05'));
  assert.equal(f.learner().notes['p06-l05'],'My existing design working');assert.equal(f.writes.length,0);assert.deepEqual(f.errors,[]);
  await f.context.close();console.log(`PASS ${mobile?'phone':'desktop'}: 2 matching embeds, prerequisite section order, concise notes, responsive layout and saved progress.`);
 }
 const guest=await fixture({guest:true});for(const lesson of additions)await visit(guest.page,lesson);
 assert.equal(guest.reads.filter(p=>/personal-course|learner-state/.test(p)).length,0);assert.deepEqual(guest.errors,[]);
 await guest.context.close();console.log('PASS guest: both additions available without account tracking requests.');
}finally{await browser.close();}
