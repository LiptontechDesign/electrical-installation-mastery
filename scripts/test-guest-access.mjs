import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { act, create } from 'react-test-renderer';

await build({
  stdin: { contents: "export { defaultOrder } from './app/course-order-model'; export { initialLearnerState } from './app/learner-state'; export { default as App } from './app/course-app'; export { CourseAccountProvider } from './app/course-account'; export { CourseOrderProvider } from './app/course-order'; export { SupplementaryProvider, useSupplementary } from './app/supplementary-videos';", resolveDir: process.cwd(), loader: 'tsx' },
  outfile: 'work/guest-tests/app.mjs', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
  plugins: [{ name: 'external-view-stubs', setup(builder) {
    builder.onResolve({ filter: /^react-dom$/ }, () => ({ path: 'react-dom', namespace: 'portal-stub' }));
    builder.onLoad({ filter: /.*/, namespace: 'portal-stub' }, () => ({ contents: 'export const createPortal = children => children;', loader: 'js', resolveDir: process.cwd() }));
    builder.onResolve({ filter: /^next\/(script|dynamic|image|link)$/ }, args => ({ path: args.path, namespace: 'stub' }));
    builder.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'next/link' ? 'import {createElement} from \"react\"; export default ({children,...props}) => createElement(\"a\",props,children)' : args.path === 'next/dynamic' ? 'export default () => () => null' : 'export default () => null', loader: 'js', resolveDir: process.cwd() }));
  } }],
});
const { App, CourseAccountProvider, CourseOrderProvider, SupplementaryProvider, useSupplementary, defaultOrder, initialLearnerState } = await import('../work/guest-tests/app.mjs');
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const requests = [], storage = [];
const timers = new Map(); let timerId = 0;
globalThis.document = { body: { style: {} }, hidden: false, fullscreenElement: null, addEventListener() {}, removeEventListener() {}, querySelector() { return null; } };
globalThis.window = {
  location: { hash: '', origin: 'http://localhost:3001' },
  localStorage: { getItem(key) { storage.push(['read', key]); return null; }, setItem(key) { storage.push(['write', key]); } },
  history: { replaceState(_, __, hash) { window.location.hash = hash; } }, scrollTo() {}, addEventListener() {}, removeEventListener() {},
  setTimeout(fn, delay) { const id = ++timerId; if ((delay ?? 0) <= 600) timers.set(id, fn); return id; }, clearTimeout(id) { timers.delete(id); },
  setInterval() { return 1; }, clearInterval() {}, matchMedia() { return { matches: false }; },
};
globalThis.localStorage = window.localStorage;
globalThis.fetch = async (url, options) => { requests.push({ url, method: options?.method ?? 'GET' }); throw new Error('Guest must not access personal APIs'); };
const flush = async () => { for (let i = 0; i < 8 && timers.size; i++) await act(async () => { const pending = [...timers.values()]; timers.clear(); await Promise.all(pending.map(fn => fn())); }); };
const text = node => typeof node === 'string' ? node : Array.isArray(node) ? node.map(text).join('') : node?.children ? text(node.children) : '';
let tree, supplementary;
function SupplementaryProbe() { supplementary = useSupplementary(); return null; }
const mount = async () => {
  await act(async () => { tree = create(h(CourseAccountProvider, { user: null }, h(CourseOrderProvider, null, h(SupplementaryProvider, null, h(SupplementaryProbe), h(App, { user: null }))))); });
  await flush();
};
const button = label => tree.root.findAllByType('button').find(node => text(node).trim() === label.trim());
const click = async node => { assert.ok(node); await act(async () => node.props.onClick()); await flush(); };
await mount();
assert.ok(text(tree.toJSON()).includes('Understand every connection.'));
await click(button('Start learning '));
assert.equal(tree.root.findAllByProps({ 'aria-label': 'Your record for this lesson' }).length, 0);
window.dispatchEvent = () => true;
await act(async () => supplementary.open(supplementary.videos.find(video => !video.archived)));
await flush();
assert.equal(tree.root.findAllByProps({ className: 'lesson-canvas supp-lesson' }).length, 1, 'Supplementary playback uses the lesson canvas');
assert.equal(tree.root.findAllByProps({ 'aria-labelledby': 'supp-title' }).length, 0, 'Watching does not open a supplementary dialog');
assert.notEqual(document.body.style.overflow, 'hidden', 'Inline playback does not lock page scrolling');
await click(button('Back to core lesson'));
assert.equal(tree.root.findAllByProps({ className: 'lesson-canvas supp-lesson' }).length, 0, 'Core playback returns after leaving a supplementary video');
await click(button('Mark video watched'));
assert.equal(tree.root.findAllByProps({ 'aria-labelledby': 'account-invitation-title' }).length, 1, 'Saving prompts for optional sign-in');
await click(button('Keep exploring without an account'));
await click(button('Save lesson'));
assert.equal(tree.root.findAllByProps({ 'aria-labelledby': 'account-invitation-title' }).length, 1);
await click(button('Keep exploring without an account'));
assert.deepEqual(requests, [], 'Guests make no requests to private course or progress APIs');
assert.deepEqual(storage, [], 'Guests never read another account cache or save browser learning records');
await act(async () => tree.unmount());
window.location.hash = '#learn/p01-l01';
await mount();
assert.ok(tree.root.findAll(node => typeof node.props['aria-label'] === 'string' && node.props['aria-label'].endsWith('video player')).length, 'Guest lesson deep links work after reload');
assert.deepEqual(requests, []);
assert.deepEqual(storage, []);
await act(async () => tree.unmount());
console.log('PASS: open guest course, lesson deep links, optional sign-in, no personal API requests or browser storage access.');

// A faster course-order response must not cancel the slower cloud-progress hydration.
const testUser = { id: 'design-test-user', name: 'Sample Learner', email: 'sample@example.test', picture: null, isAdmin: false };
const cloudState = { ...initialLearnerState, completedLessonIds: ['p01-l01'], notes: { 'p01-l01': 'Preserved cloud note' }, updatedAt: '2026-09-23T10:00:00Z' };
const writes = [];
globalThis.fetch = async (url, options) => {
  if (options?.method === 'PUT') {
    writes.push({ url, payload: JSON.parse(options.body).payload });
    return { ok: true, json: async () => ({}) };
  }
  if (url === '/api/user-data/learner-state') {
    await new Promise(resolve => setTimeout(resolve, 20));
    return { ok: true, json: async () => ({ exists: true, payload: cloudState }) };
  }
  return { ok: true, json: async () => url === '/api/course-order' ? defaultOrder : url === '/api/supplementary' ? { version: 1, revision: 0, videos: [] } : { exists: true, payload: [] } };
};
window.location.hash = '';
await act(async () => { tree = create(h(CourseAccountProvider, { user: testUser }, h(CourseOrderProvider, null, h(SupplementaryProvider, { userId: testUser.id }, h(App, { user: testUser }))))); });
await flush();
await act(async () => { await new Promise(resolve => setTimeout(resolve, 60)); });
await flush();
assert.ok(text(tree.toJSON()).includes('Welcome back, Sample.'));
const personalWrites = writes.filter(item => item.url === '/api/user-data/learner-state');
assert.ok(personalWrites.length, 'Signed-in cloud progress finishes hydration and can sync');
assert.ok(personalWrites.every(item => item.payload.notes['p01-l01'] === 'Preserved cloud note'), 'Course loading never replaces cloud progress with an empty record');
await click(tree.root.findByProps({ 'aria-label': 'Your account: Sample Learner' }));
assert.ok(text(tree.toJSON()).includes('SL'), 'Signed-in avatar uses initials');
assert.ok(tree.root.findByProps({ action: '/api/auth/logout' }), 'Sign out is available in the account menu');
await act(async () => tree.unmount());
console.log('PASS: signed-in header, account menu and delayed cloud hydration preserve personal learning data.');
