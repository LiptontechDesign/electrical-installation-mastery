import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const cookieName = process.env.NODE_ENV === 'production' ? '__Host-electrical-reader' : 'electrical-reader';
const duration = 60 * 60 * 24 * 30;
const issuer = 'electrical-installation-mastery';
const audience = 'private-book-reader';
export const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Vary': 'Cookie' };
export function readerConfigured() {
  return Boolean((process.env.READER_SESSION_SECRET?.length ?? 0) >= 32 && (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID));
}
function secret() { return new TextEncoder().encode(process.env.READER_SESSION_SECRET); }
export async function readerAuthenticated() {
  if (!readerConfigured()) return false;
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'], issuer, audience });
    return payload.sub === 'owner';
  } catch { return false; }
}
export async function signInReader() {
  const token = await new SignJWT({}).setProtectedHeader({ alg: 'HS256' }).setSubject('owner').setIssuer(issuer).setAudience(audience).setIssuedAt().setExpirationTime(`${duration}s`).sign(secret());
  (await cookies()).set(cookieName, token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/', maxAge: duration });
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  // Next may normalise request.url to localhost behind its production server.
  // The browser's Host header identifies the public origin; do not accept forwarded hosts.
  const expected = new URL(request.url);
  const host = request.headers.get('host');
  if (host) expected.host = host;
  if (request.headers.get('x-forwarded-proto') === 'https') expected.protocol = 'https:';
  return origin !== null && origin === expected.origin;
}
export async function limitedJson(request: Request): Promise<unknown> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('BAD_BODY');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('BAD_BODY');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 8192) { await reader.cancel(); throw new Error('BAD_BODY'); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
