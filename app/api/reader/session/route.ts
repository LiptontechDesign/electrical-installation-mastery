import { privateHeaders, readerAuthenticated, readerConfigured, sameOrigin } from '../../../server/reader-auth';

export const runtime = 'nodejs';
export async function GET() {
  return Response.json({ configured: readerConfigured(), authenticated: await readerAuthenticated(), automatic: true }, { headers: privateHeaders });
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403, headers: privateHeaders });
  if (!readerConfigured()) return Response.json({ error: 'Book storage is not connected yet.' }, { status: 503, headers: privateHeaders });
  if (!await readerAuthenticated()) return Response.json({ error: 'Sign in to open your books.' }, { status: 401, headers: privateHeaders });
  return Response.json({ configured: true, authenticated: true, automatic: true }, { headers: privateHeaders });
}
