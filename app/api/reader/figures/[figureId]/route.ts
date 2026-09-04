import { get } from '@vercel/blob';
import figures from '../../../../book-figures.json';
import { privateHeaders, readerAuthenticated } from '../../../../server/reader-auth';

export const runtime = 'nodejs';
export async function GET(request: Request, context: { params: Promise<{ figureId: string }> }) {
  if (!await readerAuthenticated()) return new Response(null, { status: 401, headers: privateHeaders });
  const { figureId } = await context.params;
  const figure = figures.find(item => item.id === figureId);
  if (!figure) return new Response(null, { status: 404, headers: privateHeaders });
  try {
    const result = await get(`figures/${figure.id}.png`, { access: 'private', abortSignal: request.signal });
    if (!result || result.statusCode !== 200) return new Response(null, { status: 404, headers: privateHeaders });
    return new Response(result.stream, { headers: { ...privateHeaders, 'Content-Type': 'image/png', 'Cross-Origin-Resource-Policy': 'same-origin' } });
  } catch { return new Response(null, { status: 503, headers: privateHeaders }); }
}
