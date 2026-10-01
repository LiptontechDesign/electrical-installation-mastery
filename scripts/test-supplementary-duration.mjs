import assert from 'node:assert/strict';
import { build } from 'esbuild';
await build({ entryPoints: { model: 'app/personal-course-model.ts', duration: 'app/server/youtube-duration.ts', api: 'app/api/supplementary/metadata/route.ts' }, outdir: 'work/duration-tests', bundle: true, platform: 'node', format: 'esm', plugins: [{ name: 'auth-fixture', setup(builder) {
  builder.onResolve({ filter: /server-only$/ }, () => ({ path: 'empty', namespace: 'fixture' }));
  builder.onResolve({ filter: /(?:server\/auth|\.\/auth)$/ }, () => ({ path: 'auth', namespace: 'fixture' }));
  builder.onLoad({ filter: /.*/, namespace: 'fixture' }, args => ({ contents: args.path === 'auth' ? `export async function requireCourseUser(){if(!globalThis.durationTestUser)throw Error('UNAUTHENTICATED');return {id:globalThis.durationTestUser};} export const getCourseUser=requireCourseUser;` : '', loader: 'js' }));
} }] });
const model = await import('../work/duration-tests/model.js');
const duration = await import('../work/duration-tests/duration.js');
const api = await import('../work/duration-tests/api.js');
const state = model.publishedPersonalCourse;
assert.equal(state.videos.length, 32);
assert.ok(state.videos.every(video => Number.isSafeInteger(video.durationSeconds) && video.durationSeconds > 0), 'Every built-in supplementary video has verified duration metadata');
assert.equal(state.videos.find(video => video.videoId === 'nVi5Idyt-jE').durationSeconds, 526);
const legacy = structuredClone(state);
legacy.videos.forEach(video => delete video.durationSeconds);
const updated = model.parsePersonalCourse(legacy);
assert.deepEqual(updated.groups, legacy.groups);
assert.equal(updated.revision, legacy.revision);
assert.equal(updated.videos.find(video => video.videoId === 'nVi5Idyt-jE').durationSeconds, 526, 'Saved defaults gain duration without changing their placement or edit revision');
let personal = model.applyCourseEdit(state, { operationId: crypto.randomUUID(), revision: state.revision, edit: { type: 'add', url: 'https://youtu.be/duration001', title: 'A personal video', instructor: '', durationSeconds: 1234, sectionId: 'module-05-section-4', beforeId: null } });
const added = personal.videos.find(video => video.videoId === 'duration001');
assert.equal(model.parsePersonalCourse(JSON.parse(JSON.stringify(personal))).videos.find(video => video.id === added.id).durationSeconds, 1234);
personal = model.applyCourseEdit(personal, { operationId: crypto.randomUUID(), revision: personal.revision, edit: { type: 'archive', id: added.id } });
assert.equal(personal.videos.find(video => video.id === added.id).durationSeconds, 1234);
for (const value of [-1, 0, 2.5, 90000, '645', null]) assert.throws(() => model.applyCourseEdit(state, { operationId: crypto.randomUUID(), revision: state.revision, edit: { type: 'add', url: 'https://youtu.be/duration001', title: 'Invalid', instructor: '', durationSeconds: value, sectionId: 'module-05-section-4', beforeId: null } }));

const id = 'duration001';
const page = details => '<script>var ytInitialPlayerResponse = ' + JSON.stringify({ videoDetails: { videoId: id, title: 'Braces } { and quote " in a title', lengthSeconds: '645', ...details } }) + ';</script>';
assert.equal(duration.durationFromYoutubePage(page(), id), 645);
for (const details of [{ videoId: 'wrongid0001' }, { lengthSeconds: 'NaN' }, { lengthSeconds: '0' }, { lengthSeconds: '-2' }, { lengthSeconds: '12.2' }, { isLive: true }]) assert.equal(duration.durationFromYoutubePage(page(details), id), undefined);
assert.equal(duration.durationFromYoutubePage('<script>var ytInitialPlayerResponse = {broken};</script>', id), undefined);
const calls = [], originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => {
  calls.push(String(url));
  assert.equal(new URL(url).hostname, 'www.youtube.com');
  assert.equal(options.redirect, 'error');
  return String(url).includes('/oembed?') ? Response.json({ title: 'Video title', author_name: 'Instructor' }) : new Response(page());
};
try {
  const request = extra => new Request('https://course.example/api/supplementary/metadata?url=' + encodeURIComponent('https://youtu.be/' + id) + (extra ?? ''));
  assert.equal((await api.GET(request())).status, 401);
  assert.equal(calls.length, 0, 'Guest metadata requests do not contact YouTube');
  globalThis.durationTestUser = 'alice';
  const invalid = await api.GET(new Request('https://course.example/api/supplementary/metadata?url=https://evil.example/watch'));
  assert.equal(invalid.status, 400); assert.equal(calls.length, 0);
  assert.deepEqual(await (await api.GET(request())).json(), { title: 'Video title', instructor: 'Instructor', durationSeconds: 645 });
  calls.length = 0;
  assert.deepEqual(await (await api.GET(request('&durationOnly=1'))).json(), { durationSeconds: 645 });
  assert.equal(calls.length, 1, 'Existing videos only request their missing duration');
  globalThis.fetch = async () => { throw Error('Video details unavailable'); };
  assert.deepEqual(await (await api.GET(request('&durationOnly=1'))).json(), {}, 'Unavailable durations are never invented');
} finally { globalThis.fetch = originalFetch; }
console.log('PASS supplementary durations: all 32 defaults, legacy enrichment without edits, personal persistence, invalid values, fixed-host authenticated lookup, parser identity/escaping and unavailable-video fallback.');
