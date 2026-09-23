import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { act, create } from 'react-test-renderer';

await build({
  stdin: { contents: "export { default as App } from './app/course-app'; export { CourseAccountProvider } from './app/course-account'; export { CourseOrderProvider } from './app/course-order'; export { SupplementaryProvider } from './app/supplementary-videos';", resolveDir: process.cwd(), loader: 'tsx' },
  outfile: 'work/guest-tests/app.mjs', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
  plugins: [{ name: 'external-view-stubs', setup(builder) {
    builder.onResolve({ filter: /^react-dom$/ }, () => ({ path: 'react-dom', namespace: 'portal-stub' }));
    builder.onLoad({ filter: /.*/, namespace: 'portal-stub' }, () => ({ contents: 'export const createPortal = children => children;', loader: 'js' }));
    builder.onResolve({ filter: /^(next\/(script|dynamic|image)|\.\/lesson-overview)$/ }, args => ({ path: args.path, namespace: 'stub' }));
    builder.onLoad({ filter: /.*/, namespace: 'stub' }, args => ({ contents: args.path === 'next/dynamic' ? 'export default () => () => null' : 'export default () => null', loader: 'js' }));
  } }],
});
const { App, CourseAccountProvider, CourseOrderProvider, SupplementaryProvider } = await import('../work/guest-tests/app.mjs');
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
let tree;
const mount = async () => {
  await act(async () => { tree = create(h(CourseAccountProvider, { user: null }, h(CourseOrderProvider, null, h(SupplementaryProvider, null, h(App, { user: null }))))); });
  await flush();
};
const button = label => tree.root.findAllByType('button').find(node => text(node).trim() === label.trim());
const click = async node => { assert.ok(node); await act(async () => node.props.onClick()); await flush(); };
await mount();
assert.ok(text(tree.toJSON()).includes('Understand every connection.'));
await click(button('Start learning '));
assert.equal(tree.root.findAllByProps({ 'aria-label': 'Your record for this lesson' }).length, 0);
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
assert.ok(tree.root.findAllByProps({ 'aria-label': 'Lesson Overview' }).length, 'Guest lesson deep links work after reload');
assert.deepEqual(requests, []);
assert.deepEqual(storage, []);
await act(async () => tree.unmount());
console.log('PASS: open guest course, lesson deep links, optional sign-in, no personal API requests or browser storage access.');
