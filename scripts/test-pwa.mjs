import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const listeners = {};
const buckets = new Map();
let claimed = false;
let network = async () => new Response('Public reconnect screen', { headers: { 'content-type': 'text/html' } });
const caches = {
  async open(name) {
    if (!buckets.has(name)) buckets.set(name, new Map());
    const bucket = buckets.get(name);
    return { put: async (key, value) => bucket.set(key, value), match: async key => bucket.get(key)?.clone() };
  },
  keys: async () => [...buckets.keys()],
  delete: async name => buckets.delete(name),
};
vm.runInNewContext(await readFile('public/sw.js', 'utf8'), {
  self: { location: { origin: 'https://course.test' }, addEventListener: (type, fn) => { listeners[type] = fn; }, clients: { claim: async () => { claimed = true; } } },
  caches, fetch: (...args) => network(...args), URL, Response,
});
async function lifecycle(type) { let work; listeners[type]({ waitUntil: promise => { work = promise; } }); await work; }
function request(path, options = {}) {
  let work;
  listeners.fetch({ request: { url: new URL(path, 'https://course.test').href, method: 'GET', mode: 'navigate', ...options }, respondWith: promise => { work = promise; } });
  return work;
}
await lifecycle('install');
assert.deepEqual([...buckets.get('electrical-offline-v1').keys()], ['/offline.html']);
await caches.open('electrical-offline-old'); await caches.open('unrelated-cache');
await lifecycle('activate');
assert.equal(claimed, true);
assert.deepEqual(await caches.keys(), ['electrical-offline-v1', 'unrelated-cache']);
for (const path of ['/api', '/api/account', '/api/auth/google/callback', '/api/reader/books/book', '/_next/static/chunk.js', 'https://youtube.com/embed/video']) assert.equal(request(path), undefined, path);
assert.equal(request('/practice', { method: 'POST' }), undefined);
assert.equal(request('/practice?_rsc=123', { mode: 'cors' }), undefined);
assert.equal(request('/book.pdf', { mode: 'same-origin', headers: { range: 'bytes=0-100' } }), undefined);
network = async () => new Response('Private learner data');
assert.equal(await (await request('/')).text(), 'Private learner data');
assert.deepEqual([...buckets.get('electrical-offline-v1').keys()], ['/offline.html']);
network = async () => new Response('Unauthorized', { status: 401 });
assert.equal((await request('/')).status, 401);
network = async () => { throw new TypeError('Offline'); };
assert.equal(await (await request('/practice')).text(), 'Public reconnect screen');
await assert.rejects(lifecycle('install'), /Offline/);
buckets.get('electrical-offline-v1').clear();
assert.equal((await request('/practice')).status, 503);
console.log('PWA worker: public fallback only, private/API/media bypass, safe lifecycle and recovery passed.');
