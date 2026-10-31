import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {browser,fixture,model} from './personal-course-browser-fixture.mjs';
const update=JSON.parse(readFileSync('app/c1-pfc-update.json','utf8'));
const catalog=model.personalCourseSnapshot(model.publishedPersonalCourse).course;
const lessons=catalog.modules.find(m=>m.id==='c1-pfc').lessons.filter(l=>update.addedLessonIds.includes(l.id));
try {
 for(const mobile of [false,true]) {
  const f=await fixture({mobile,guest:true}),{page}=f;
  if(mobile){await page.setViewportSize({width:320,height:740});await page.locator('.course-map').getByRole('button',{name:'Close course map',exact:true}).click();}
  await page.getByRole('button',{name:'Course overview',exact:true}).click();
  await page.getByRole('group',{name:'Filter course pathway'}).getByRole('button',{name:'C1 · Three-phase',exact:true}).click();
  const cards=page.locator('.curriculum-modules > details');assert.equal(await cards.count(),17);
  const titles=await cards.locator('summary').allTextContents();assert.match(titles[11],/Motor Starting/);assert.match(titles[12],/Power-Factor Correction/);
  await page.getByRole('button',{name:'Expand all',exact:true}).click();
  for(const lesson of lessons){await page.locator('.curriculum-lessons button').filter({hasText:lesson.title}).first().click();await page.locator('.lesson-canvas h1').filter({hasText:lesson.title}).waitFor();assert.match(await page.locator('.lesson-canvas iframe').getAttribute('src'),new RegExp('/embed/'+lesson.videoId));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.getByRole('button',{name:'Course overview',exact:true}).click();await page.getByRole('group',{name:'Filter course pathway'}).getByRole('button',{name:'C1 · Three-phase',exact:true}).click();await page.getByRole('button',{name:'Expand all',exact:true}).click();}
  assert.deepEqual(f.errors,[]);assert.equal(f.writes.length,0);await f.context.close();console.log('PASS '+(mobile?'320px':'desktop')+' module order and four lesson embeds');
 }
} finally {await browser.close();}
