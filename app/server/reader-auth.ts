import 'server-only';
import { authConfigured, getCourseUser } from './auth';
export const privateHeaders = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Vary': 'Cookie' };
export function readerConfigured() {
  return Boolean(authConfigured() && (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID));
}
export async function readerAuthenticated() {
  return readerConfigured() && Boolean(await getCourseUser());
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
export async function limitedJson(request: Request, maxBytes = 8192): Promise<unknown> {
  if (!request.headers.get('content-type')?.startsWith('application/json')) throw new Error('BAD_BODY');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('BAD_BODY');
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > maxBytes) { await reader.cancel(); throw new Error('BAD_BODY'); }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}
