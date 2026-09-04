import { checkAccessKey, limitedJson, privateHeaders, readerAuthenticated, readerConfigured, sameOrigin, signInReader, signOutReader } from '../../../server/reader-auth';

export const runtime = 'nodejs';
export async function GET() {
  return Response.json({ configured: readerConfigured(), authenticated: await readerAuthenticated() }, { headers: privateHeaders });
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403, headers: privateHeaders });
  if (!readerConfigured()) return Response.json({ error: 'Private book storage is not connected yet.' }, { status: 503, headers: privateHeaders });
  try {
    const data = await limitedJson(request) as { key?: unknown };
    if (typeof data?.key !== 'string' || !checkAccessKey(data.key.trim())) return Response.json({ error: 'That reader key was not recognised.' }, { status: 401, headers: privateHeaders });
    await signInReader();
    return Response.json({ authenticated: true }, { headers: privateHeaders });
  } catch { return Response.json({ error: 'Could not unlock the reader.' }, { status: 400, headers: privateHeaders }); }
}
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403, headers: privateHeaders });
  await signOutReader();
  return Response.json({ authenticated: false }, { headers: privateHeaders });
}
