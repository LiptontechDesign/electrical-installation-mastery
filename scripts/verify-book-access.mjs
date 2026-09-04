import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { get, put } from '@vercel/blob';

const origin = new URL(process.argv[2] || 'http://127.0.0.1:3001').origin;
const keyFile = await readFile('outputs/book-integration/PRIVATE-READER-KEY.txt', 'utf8');
const key = keyFile.split(/\r?\n/).find(line => /^[A-Za-z0-9_-]{43}$/.test(line));
assert.ok(key, 'A local private reader key is required.');
const call = (path, session = '', options = {}) => fetch(`${origin}${path}`, { ...options, headers: { Origin: origin, ...(session ? { Cookie: session } : {}), ...options.headers } });
const jsonOptions = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const login = async () => {
  const response = await call('/api/reader/session', '', jsonOptions('POST', { key }));
  assert.equal(response.status, 200, await response.text());
  const cookie = response.headers.get('set-cookie');
  assert.ok(cookie?.includes('HttpOnly') && cookie.includes('SameSite=strict'), 'Private session cookie');
  return cookie.split(';')[0];
};
assert.equal((await call('/api/reader/books/installation-designs')).status, 401);
assert.equal((await call('/api/reader/figures/designs-rcd-healthy')).status, 401);
assert.equal((await call('/api/reader/state')).status, 401);
assert.equal((await call('/api/reader/session','',jsonOptions('POST',{key:'incorrect'.repeat(8)}))).status,401);
assert.equal((await call('/api/reader/session','',{...jsonOptions('POST',{key}),headers:{'Content-Type':'application/json',Origin:'https://untrusted.example'}})).status,403);
const [sessionA, sessionB] = await Promise.all([login(), login()]);
const assets = JSON.parse(await readFile('app/book-assets.json','utf8'));
for (const [id,{ reader: { size } }] of Object.entries(assets)) {
  const response = await call(`/api/reader/books/${id}`,sessionA,{headers:{Range:'bytes=0-1023'}});
  assert.equal(response.status,206,`${id}: ${await response.clone().text()}`.slice(0,160));
  assert.equal(response.headers.get('content-range'),`bytes 0-1023/${size}`);
  assert.equal(response.headers.get('cache-control'),'private, no-store');
  const data = Buffer.from(await response.arrayBuffer());
  assert.equal(data.length,1024);
  assert.equal(data.subarray(0,5).toString(),'%PDF-');
  const last = await call(`/api/reader/books/${id}`,sessionB,{headers:{Range:'bytes=-1024'}});
  assert.equal(last.status,206);
  assert.equal(last.headers.get('content-range'),`bytes ${size-1024}-${size-1}/${size}`);
  assert.ok((await last.text()).includes('%%EOF'),`${id}: end of PDF`);
}
assert.equal((await call('/api/reader/books/unknown',sessionA)).status,404);
assert.equal((await call('/api/reader/books/installation-designs',sessionA,{headers:{Range:`bytes=${assets['installation-designs'].reader.size}-`}})).status,416);
const image = await call('/api/reader/figures/designs-rcd-healthy',sessionB);
assert.equal(image.status,200);
assert.equal(Buffer.from(await image.arrayBuffer()).subarray(1,4).toString(),'PNG');
const manifest = JSON.parse(await readFile('work/book-integration/upload-manifest.json','utf8'));
const unauthorized = await fetch(manifest[0].url,{headers:{Range:'bytes=0-15'}});
assert.ok([401,403,404].includes(unauthorized.status), 'Direct private Blob URL denies unauthenticated access');
await unauthorized.body?.cancel();
console.log('PASS: private access, secure sessions, cross-origin rejection, both PDF byte ranges and extracted figure.');

// Test-only mutations are opt-in. The routine production check above is read-only after sign-in.
if (process.argv.includes('--test-saving')) {
  const statePath='reader/owner-state-v1.json';
  const previous=await get(statePath,{access:'private',useCache:false});
  const original=previous ? await new Response(previous.stream).json() : {version:1,books:{}};
  if(Object.keys(original.books).length) throw new Error('Save test requires an unused store; refusing to change existing reading progress.');
  let lastState;
  const save=async(session,command)=>{
    const response=await call('/api/reader/state',session,jsonOptions('PATCH',command));
    const data=await response.json();
    assert.equal(response.status,200,JSON.stringify(data));
    return data;
  };
  try {
    await save(sessionA,{action:'position',bookId:'installation-designs',page:237});
    let response=await call('/api/reader/state',sessionB);
    assert.equal((await response.json()).books['installation-designs'].page,237,'Second session reads first session progress');
    await Promise.all([
      save(sessionA,{action:'bookmark',bookId:'installation-designs',page:237,saved:true,note:'Temporary verification note'}),
      save(sessionB,{action:'position',bookId:'modern-wiring',page:149}),
    ]);
    response=await call('/api/reader/state',sessionA);
    lastState=await response.json();
    assert.equal(lastState.books['modern-wiring'].page,149);
    assert.equal(lastState.books['installation-designs'].bookmarks[0].note,'Temporary verification note','Concurrent write keeps the bookmark');
    await save(sessionB,{action:'bookmark',bookId:'installation-designs',page:237,saved:false});
    console.log('PASS: two independent sessions share positions and bookmarks; concurrent updates preserve both books.');
  } finally {
    const latest=await get(statePath,{access:'private',useCache:false});
    if(latest?.statusCode===200) {
      const current=await new Response(latest.stream).json();
      const expectedIds=Object.keys(current.books).every(id=>['installation-designs','modern-wiring'].includes(id));
      const onlyTestPages=Object.values(current.books).every(book=>[1,149,237].includes(book.page)&&book.bookmarks.every(mark=>mark.page===237&&mark.note==='Temporary verification note'));
      if(!expectedIds||!onlyTestPages) throw new Error('Unexpected concurrent change; test progress was not reset.');
      await put(statePath,JSON.stringify(original),{access:'private',addRandomSuffix:false,allowOverwrite:true,ifMatch:latest.blob.etag,contentType:'application/json',cacheControlMaxAge:0});
      console.log('Temporary test progress reset; no test notes remain.');
    }
  }
}
await call('/api/reader/session',sessionA,{method:'DELETE'});
console.log(`Private reader verified at ${origin}.`);
