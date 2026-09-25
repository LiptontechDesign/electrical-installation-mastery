import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { SignJWT } from 'jose';
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
await build({entryPoints:['app/learner-state.ts','app/course-order-model.ts','app/course-curriculum.ts'],outdir:'work/experience-tests',bundle:true,platform:'node',format:'esm'});
const { initialLearnerState }=await import('../work/experience-tests/learner-state.js');
const { defaultOrder }=await import('../work/experience-tests/course-order-model.js');
const { default:course }=await import('../work/experience-tests/course-curriculum.js');
const origin=process.env.COURSE_TEST_URL ?? 'http://127.0.0.1:3001';
assert.ok(new URL(origin).hostname==='127.0.0.1' || new URL(origin).hostname==='localhost','Use a local test server with fixture auth settings');
const browser=await chromium.launch({headless:true,channel:process.env.COURSE_TEST_CHANNEL ?? 'msedge'});
try {
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 const token=await new SignJWT({email:'preview@example.test',name:'Preview Learner'}).setProtectedHeader({alg:'HS256'}).setSubject('preview').setIssuer('electrical-installation-mastery').setAudience('electrical-course').setExpirationTime('1h').sign(new TextEncoder().encode('local-preview-only-0000000000000000000000'));
 await context.addCookies([{name:'electrical-session',value:token,url:origin}]);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const first=course.modules[0].lessons[0],second=course.modules[0].lessons[1];
 let state={...initialLearnerState,autoNextEnabled:false,bookmarkedLessonIds:[second.id],completedLessonIds:[first.id],videoPositions:{[first.videoId]:72,abcdefghijk:32}};
 const writes=[];
 let additions=[{id:'test-support',videoId:'abcdefghijk',moduleId:course.modules[0].id,anchorId:first.id,position:'after',title:'Test supporting video',instructor:'Test channel',archived:false}];
 await page.route('**/api/**',async route=>{const url=route.request().url(); if(url.endsWith('/learner-state')&&route.request().method()==='PUT'){state=route.request().postDataJSON().payload;writes.push(state);}
 if(url.includes('/supplementary/metadata')) return route.fulfill({json:{title:'Newly added lesson',instructor:'New channel'}});
 if(url.endsWith('/supplementary') && route.request().method()==='POST'){const body=route.request().postDataJSON(); additions.push({...body,id:'new-support',videoId:'newvideo123',archived:false});}
 await route.fulfill({json:url.endsWith('/course-order')?defaultOrder:url.endsWith('/supplementary')?{version:1,revision:0,videos:additions}:url.endsWith('/learner-state')?{exists:true,payload:state}:{exists:true,payload:[]}});});
 await page.route('**/*youtube*/*',async route=>{
  if(route.request().url().includes('/iframe_api')) return route.fulfill({contentType:'application/javascript',body:`window.YT={PlayerState:{ENDED:0,PLAYING:1},Player:class {constructor(frame,options){this.time=Number(new URL(frame.src).searchParams.get('start')||0);this.state=-1;this.options=options;window.testPlayer=this;setTimeout(()=>options.events.onReady?.({target:this}),0);}getCurrentTime(){return this.time;}getDuration(){return 500;}getPlayerState(){return this.state;}seekTo(time){this.time=time;this.state=2;this.options.events.onStateChange({data:2});}pauseVideo(){this.state=2;this.options.events.onStateChange({data:2});}destroy(){this.destroyed=true;}}};window.onYouTubeIframeAPIReady?.();`});
  await route.fulfill({contentType:'text/html',body:'<html><body style="background:#0c1c2e;color:white;font:18px sans-serif;padding:24px">Playback test fixture</body></html>'});
 });

 for (const width of [320,390,768]) {
  await page.setViewportSize({width,height:844});
  await page.goto('about:blank');await page.goto(origin+'/#home',{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Your account: Preview Learner',exact:true}).click();
  await page.getByRole('button',{name:'Account & settings',exact:true}).click();
  await page.getByRole('heading',{name:'Settings',exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Account settings fit');
  await page.getByRole('button',{name:'Close settings',exact:true}).click();
  await page.goto('about:blank');await page.goto(origin+'/#learn/'+first.id,{waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Open course map',exact:true}).click();
  await page.getByRole('button',{name:'Organise course',exact:true}).click();
  await page.getByRole('button',{name:/Add video to module 1:/}).click();
  await page.getByLabel('YouTube link',{exact:true}).fill('https://www.youtube.com/watch?v=newvideo123');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Supplementary form fits');
  assert.ok(await page.getByLabel('YouTube link',{exact:true}).evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  await page.keyboard.press('Escape');
  await page.keyboard.press('Escape');
  await page.getByRole('button',{name:'Open course map',exact:true}).click();
  await page.getByRole('button',{name:'Done organising',exact:true}).click();
  await page.locator('[data-course-row="test-support"] button').last().click();
  await page.locator('.supp-lesson h1').filter({hasText:'Test supporting video'}).waitFor();
  await page.locator('.supp-lesson').getByText('Your lesson notes',{exact:true}).click();
  await page.getByLabel('Your lesson notes',{exact:true}).fill('Mobile notes');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Supplementary lesson fits');
  assert.ok(await page.getByLabel('Your lesson notes',{exact:true}).evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  mkdirSync('work/mobile-verification',{recursive:true});
  if(width===390) await page.screenshot({path:'work/mobile-verification/signed-in-supplementary.png'});
  console.log('PASS signed-in mobile',width);
 }
 assert.deepEqual(errors,[]);
 console.log('PASS: signed-in home, account/settings, organising, supplementary form, embedded supplementary lesson and notes.');
} finally {await browser.close();}
