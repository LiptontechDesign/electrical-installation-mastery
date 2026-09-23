import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const database = await readFile('app/server/database.ts', 'utf8');
const auth = await readFile('app/server/auth.ts', 'utf8');
const orderApi = await readFile('app/api/course-order/route.ts', 'utf8');
const supplementaryApi = await readFile('app/api/supplementary/route.ts', 'utf8');
const readerApi = await readFile('app/api/reader/state/route.ts', 'utf8');
const learnerApi = await readFile('app/api/user-data/[document]/route.ts', 'utf8');
const courseApp = await readFile('app/course-app.tsx', 'utf8');

assert.match(database, /PRIMARY KEY \(user_id, document_type\)/, 'documents must be uniquely scoped by user and type');
assert.match(database, /WHERE user_id = \$\{userId\} AND document_type = \$\{type\}/, 'reads must filter by the authenticated user');
assert.match(database, /REFERENCES course_users\(id\) ON DELETE CASCADE/, 'account deletion must remove owned records');

for (const [name, source] of [['course order', orderApi], ['supplementary', supplementaryApi], ['reader', readerApi], ['learner data', learnerApi]]) {
  assert.match(source, /requireCourseUser\(\)/, `${name} API must authenticate on the server`);
  assert.match(source, /user\.id/, `${name} API must pass the authenticated ID to storage`);
}

assert.match(auth, /stateCookie/, 'OAuth must use an anti-forgery state cookie');
assert.match(auth, /nonceCookie/, 'OpenID Connect must verify a nonce');
assert.match(auth, /code_challenge_method.*S256/, 'OAuth must use PKCE S256');
assert.match(auth, /email_verified !== true/, 'only verified Google email identities may sign in');
assert.doesNotMatch(auth, /refresh_token/, 'Google refresh tokens must not be stored');

assert.match(courseApp, /`\$\{STORAGE_KEY\}:\$\{user\.id\}`/, 'offline caches must be account-scoped');
assert.match(courseApp, /removeItem\(STORAGE_KEY\)/, 'the unscoped legacy cache must be removed after migration');

console.log('PASS: Google auth and all learner-owned records are isolated by authenticated user ID.');
