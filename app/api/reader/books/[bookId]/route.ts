import { get } from '@vercel/blob';
import { getBook } from '../../../../books-data';
import { parseByteRange } from '../../../../reader-state';
import { privateHeaders, readerAuthenticated } from '../../../../server/reader-auth';
import { bookFiles } from '../../../../server/reader-storage';

export const runtime = 'nodejs';
export const maxDuration = 60;
export async function GET(request: Request, context: { params: Promise<{ bookId: string }> }) {
  if (!await readerAuthenticated()) return Response.json({ error: 'Open My books to start a reading session.' }, { status: 401, headers: privateHeaders });
  const book = getBook((await context.params).bookId);
  if (!book) return new Response(null, { status: 404, headers: privateHeaders });
  const file = bookFiles[book.id];
  const range = parseByteRange(request.headers.get('range'), file.size);
  if (range === 'invalid') return new Response(null, { status: 416, headers: { ...privateHeaders, 'Content-Range': `bytes */${file.size}` } });
  try {
    const options = { access: 'private' as const, abortSignal: request.signal, ...(range ? { headers: { Range: `bytes=${range.start}-${range.end}` } } : {}) };
    let result = await get(file.pathname, options);
    const expectedRange = range ? `bytes ${range.start}-${range.end}/${file.size}` : null;
    // A partial response must describe the original PDF, never a cached partial body.
    // Retry against origin storage if the upstream CDN reports an inconsistent range.
    if (range && result?.statusCode === 200 && result.headers.get('content-range') !== expectedRange) {
      console.warn('Reader PDF range retry', { book: book.id, expected: expectedRange, received: result.headers.get('content-range') });
      await result.stream.cancel();
      result = await get(file.pathname, { ...options, useCache: false });
    }
    if (!result || result.statusCode !== 200) return Response.json({ error: 'This book has not been uploaded yet.' }, { status: 404, headers: privateHeaders });
    if (range && result.headers.get('content-range') !== expectedRange) {
      console.warn('Reader PDF range unavailable', { book: book.id, expected: expectedRange, received: result.headers.get('content-range') });
      await result.stream.cancel();
      return Response.json({ error: 'Could not load this page range. Please retry.' }, { status: 503, headers: privateHeaders });
    }
    const contentRange = result.headers.get('content-range');
    const headers = new Headers({ ...privateHeaders, 'Content-Type': 'application/pdf', 'Accept-Ranges': 'bytes', 'Content-Disposition': `inline; filename="${book.id}.pdf"`, 'Cross-Origin-Resource-Policy': 'same-origin' });
    const length = result.headers.get('content-length');
    if (length) headers.set('Content-Length', length);
    if (contentRange) headers.set('Content-Range', contentRange);
    return new Response(result.stream, { status: contentRange ? 206 : 200, headers });
  } catch (error) { if (!request.signal.aborted) console.warn('Reader PDF unavailable', { book: book.id, type: error instanceof Error ? error.name : 'unknown' }); return Response.json({ error: 'The book could not be loaded. Please retry.' }, { status: 503, headers: privateHeaders }); }
}
