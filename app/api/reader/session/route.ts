import { privateHeaders, readerAuthenticated, readerConfigured, sameOrigin, signInReader } from '../../../server/reader-auth';

export const runtime = 'nodejs';
export async function GET() {
  return Response.json({ configured: readerConfigured(), authenticated: await readerAuthenticated(), automatic: true }, { headers: privateHeaders });
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403, headers: privateHeaders });
  if (!readerConfigured()) return Response.json({ error: 'Book storage is not connected yet.' }, { status: 503, headers: privateHeaders });
  try {
    // The site owner chose automatic access to the shared reader. The signed
    // session keeps Blob credentials server-side; it is not an identity check.
    await signInReader();
    return Response.json({ configured: true, authenticated: true, automatic: true }, { headers: privateHeaders });
  } catch { return Response.json({ error: 'Could not open the reader. Please retry.' }, { status: 503, headers: privateHeaders }); }
}
