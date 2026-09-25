import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
const base=process.env.MOBILE_TEST_URL || 'http://127.0.0.1:3001';
const local=['localhost','127.0.0.1'].includes(new URL(base).hostname);
const browser=await chromium.launch({channel:process.env.MOBILE_TEST_CHANNEL || 'msedge',headless:true});
await mkdir('work/mobile-verification',{recursive:true});
const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
const page=await context.newPage();page.setDefaultTimeout(20000);
const errors=[];page.on('pageerror',e=>errors.push(e.message));
page.on('dialog',d=>d.accept());
if(local) await page.route('**/api/reader/books/**',async route=>{
 const url='https://electrical-installation-mastery.vercel.app'+new URL(route.request().url()).pathname;
 const response=await route.fetch({url,headers:{range:route.request().headers().range || 'bytes=0-1048575'}});
 await route.fulfill({response});
});
const button=name=>page.getByRole('button',{name,exact:true});
async function fit(label){assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),label+': no page overflow');}
async function open(view){await page.goto('about:blank');await page.goto(base+'/#'+view,{waitUntil:'networkidle'});await page.locator(view==='books'?'.book-shelf':view==='learn'?'.lesson-canvas':'.course-overview-page').waitFor();}
async function reachable(locator,label){const box=await locator.boundingBox();assert.ok(box&&box.width>=43&&box.height>=43,label+': touch size');const hit=await locator.evaluate(e=>{const r=e.getBoundingClientRect();return e.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});assert.ok(hit,label+': no overlay intercepts taps');}
try{
 for(const [width,height] of [[320,740],[390,844],[430,932],[768,1024],[844,390]]){
  await page.setViewportSize({width,height});
  await open('home');await fit('Home '+width);
  await reachable(button('Search video lessons'),'Search');
  await reachable(button('Playback settings'),'Playback settings');
  await button('Playback settings').click();await button('Close settings').waitFor();
  await reachable(button('Close settings'),'Close settings');await fit('Settings');await button('Close settings').click();
  await button('Search video lessons').click();await page.getByRole('textbox',{name:'Search video lessons'}).fill('voltage');
  assert.ok(await page.getByRole('textbox',{name:'Search video lessons'}).evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  await fit('Search');assert.ok(await page.locator('.search-dialog').evaluate(e=>e.getBoundingClientRect().bottom<=innerHeight+1));
  await button('Close search').click();
  await button('Sign in').click();await button('Close sign in').waitFor();await fit('Sign-in invitation');await button('Close sign in').click();
  await open('learn');await fit('Learn '+width);
  const frame=await page.locator('.video-frame').first().boundingBox();assert.ok(Math.abs(frame.width/frame.height-16/9)<.03,'Video aspect ratio');
  await button('Open course map').first().click();await page.locator('.course-map.drawer-open').waitFor();
  await fit('Course drawer');assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).overflow),'hidden');
  await page.locator('.course-map').getByRole('button',{name:'Close course map',exact:true}).click();
  await page.waitForFunction(()=>getComputedStyle(document.querySelector('.course-map')).visibility==='hidden');
  if(width===390)await page.screenshot({path:'work/mobile-verification/lesson.png'});
  await open('books');await fit('Books '+width);
  await button('Open book').first().click();await button('Next page').waitFor();
  await reachable(button('Next page'),'Next PDF page '+width);await reachable(button('Go'),'Go to PDF page');
  await button('Book contents, saved pages and figures').click();await page.getByRole('textbox',{name:'Search chapter titles'}).fill('circuit');await fit('Book contents');
  await button('Book contents, saved pages and figures').click();
  await button('Next page').tap();assert.equal(await page.getByRole('spinbutton',{name:'PDF page number'}).inputValue(),'2');
  assert.equal(await page.getByRole('tooltip').count(),0,'Touch navigation does not leave a floating tooltip');
  if(width===390){await page.locator('.pdf-stage[aria-busy="false"]').waitFor();assert.equal(await page.locator('.pdf-error').count(),0);await page.screenshot({path:'work/mobile-verification/book.png'});}
  await page.goto(base+'/practice',{waitUntil:'networkidle'});await fit('Practice centre '+width);
  assert.ok(await page.getByRole('textbox',{name:'Search topic questions'}).evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  await page.locator('.epra-collection').first().click();await page.getByRole('button',{name:/^Reveal Answer/}).click();
  await fit('Practice answer');await reachable(button('Next question'),'Practice next');
  if(width===390){await page.emulateMedia({colorScheme:'dark'});await page.screenshot({path:'work/mobile-verification/practice-dark.png'});await page.emulateMedia({colorScheme:'light'});}
  console.log('PASS mobile viewport',width,height);
 }
 assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>localStorage.length),0);
 console.log('PASS: guest home, lessons, maps, search, settings, sign-in invitation, real PDF controls/rendering, practice and touch reachability at 320/390/430/768/844px.');
} catch(e){await page.screenshot({path:'work/mobile-verification/failure.png',fullPage:true});throw e;}finally{await browser.close();}
