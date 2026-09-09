import { youtubeId } from '../../../supplementary-model';
export const runtime = 'nodejs';
export async function GET(request: Request) {
  const id = youtubeId(new URL(request.url).searchParams.get('url') ?? '');
  if (!id) return Response.json({ error: 'Paste a valid YouTube video link.' }, { status: 400 });
  try {
    // Fixed destination and validated ID: never fetch a user-selected host or HTML.
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`, { redirect: 'error', signal: AbortSignal.timeout(8000), next: { revalidate: 86400 } });
    if (!response.ok) throw new Error();
    const data = await response.json();
    return Response.json({ title: String(data.title ?? '').slice(0, 240), instructor: String(data.author_name ?? '').slice(0, 160) });
  } catch { return Response.json({ error: 'Automatic details are unavailable. You can enter the title yourself; check that the video allows embedding.' }, { status: 422 }); }
}
