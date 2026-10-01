import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { SignJWT } from 'jose';
import { build } from 'esbuild';
import { mkdirSync } from 'node:fs';
await build({ entryPoints: ['app/personal-course-model.ts', 'app/learner-state.ts'], outdir: 'work/editor-browser', bundle: true, platform: 'node', format: 'esm' });
export const model = await import('../work/editor-browser/personal-course-model.js');
const { initialLearnerState } = await import('../work/editor-browser/learner-state.js');
export const origin = process.env.COURSE_TEST_URL ?? 'http://127.0.0.1:3001';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(origin).hostname), 'Fixture tests must use a local server.');
export const browser = await chromium.launch({ headless: true, channel: process.env.COURSE_TEST_CHANNEL ?? 'msedge' });
mkdirSync('work/editor-preview', { recursive: true });
export async function fixture({ mobile = false, guest = false, state: seed, learner: seedLearner, supplementaryProgress: seedProgress = [], supplementaryReadDelay = 0 } = {}) {
  const context = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 1000 } });
  if (!guest) {
    const token = await new SignJWT({ email: 'preview@example.test', name: 'Preview Learner' }).setProtectedHeader({ alg: 'HS256' }).setSubject('preview').setIssuer('electrical-installation-mastery').setAudience('electrical-course').setExpirationTime('1h').sign(new TextEncoder().encode('local-preview-only-0000000000000000000000'));
    // This fixture is restricted to loopback above. Supply the development and
    // production cookie names so the same checks can use a production build.
    await context.addCookies([
      { name: 'electrical-session', value: token, url: origin },
      { name: '__Host-electrical-session', value: token, url: origin.replace(/^http:/, 'https:'), secure: true },
    ]);
  }
  const page = await context.newPage(); page.setDefaultTimeout(15000);
  let state = structuredClone(seed ?? model.publishedPersonalCourse);
  const first = model.personalCourseSnapshot(state).allRows.find(r => r.kind === 'core') ?? model.personalCourseSnapshot(state).allRows[0];
  let learner = structuredClone(seedLearner ?? { ...initialLearnerState, autoNextEnabled: false, activeLessonId: first.id, notes: { [first.id]: 'Existing note stays with the lesson' }, completedLessonIds: [first.id], bookmarkedLessonIds: [first.id] });
  let supplementaryProgress = [...seedProgress];
  let supplementaryLoaded = false;
  const errors = [], writes = [], reads = [];
  let rejectNext = false, loseResponse = false;
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/api/**', async route => {
    const request = route.request(), url = new URL(request.url());
    if (request.method() === 'GET') reads.push(url.pathname);
    if (url.pathname === '/api/personal-course') {
      if (request.method() === 'POST') {
        const body = request.postDataJSON(); writes.push(body);
        if (rejectNext) { rejectNext = false; return route.fulfill({ status: 503, json: { error: 'Test connection interruption. Your details are kept.' } }); }
        try { state = model.applyCourseEdit(state, body); }
        catch (error) { return route.fulfill({ status: error.status ?? 400, json: { error: error.message, state, existingId: error.existingId } }); }
        if (loseResponse) { loseResponse = false; return route.abort('connectionreset'); }
      }
      return route.fulfill({ json: state });
    }
    if (url.pathname.endsWith('/supplementary/metadata')) return route.fulfill({ json: { title: 'Understanding a missing concept', instructor: 'Test electrical channel' } });
    if (url.pathname.endsWith('/learner-state')) {
      if (request.method() === 'PUT') learner = request.postDataJSON().payload;
      return route.fulfill({ json: { exists: true, payload: learner } });
    }
    if (url.pathname.endsWith('/supplementary-progress')) {
      if (request.method() === 'GET') { if (supplementaryReadDelay) await new Promise(resolve => setTimeout(resolve, supplementaryReadDelay)); supplementaryLoaded = true; }
      if (request.method() === 'PUT') supplementaryProgress = request.postDataJSON().payload;
      return route.fulfill({ json: { exists: true, payload: supplementaryProgress } });
    }
    return route.fulfill({ json: { exists: false, payload: null } });
  });
  await page.route('**/*youtube*/*', async route => {
    if (route.request().url().includes('/iframe_api')) return route.fulfill({ contentType: 'application/javascript', body: `window.YT={PlayerState:{ENDED:0,PLAYING:1},Player:class {constructor(frame,options){this.time=Number(new URL(frame.src).searchParams.get('start')||0);this.state=-1;this.options=options;window.testPlayer=this;setTimeout(()=>options.events.onReady?.({target:this}),0);}getCurrentTime(){return this.time;}getDuration(){return 500;}getPlayerState(){return this.state;}seekTo(time){this.time=time;this.state=2;this.options.events.onStateChange({data:2});}pauseVideo(){this.state=2;this.options.events.onStateChange({data:2});}destroy(){this.destroyed=true;}}};window.onYouTubeIframeAPIReady?.();` });
    return route.fulfill({ contentType: 'text/html', body: '<html><body style="background:#0c1c2e;color:white;font:18px sans-serif;padding:24px">Course video preview</body></html>' });
  });
  await page.goto(origin + '/#learn/' + first.id);
  await page.locator('.lesson-canvas h1').waitFor();
  if (mobile) { await page.getByRole('button', { name: 'Open course map', exact: true }).click(); await page.waitForTimeout(350); }
  if (!guest) await page.getByRole('button', { name: 'Add video', exact: true }).waitFor();
  return { page, context, first, errors, writes, reads, state: () => state, learner: () => learner, supplementaryProgress: () => supplementaryProgress, supplementaryLoaded: () => supplementaryLoaded, external: edit => { state = model.applyCourseEdit(state, { operationId: crypto.randomUUID(), revision: state.revision, edit }); }, failNext: () => { rejectNext = true; }, loseNextResponse: () => { loseResponse = true; } };
}
