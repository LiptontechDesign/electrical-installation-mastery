import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import course from '../../course-curriculum';
import { withSupplementaryDefaults } from '../../supplementary-defaults';
import { limitedJson, sameOrigin, privateHeaders } from '../../server/reader-auth';
import { confirmationPhrase, youtubeId, type SupplementaryAction, type SupplementaryState, type SupplementaryVideo } from '../../supplementary-model';

export const runtime = 'nodejs';
const pathname = 'course/supplementary-videos-v1.json';
const coreVideos = new Set(course.modules.flatMap(m => m.lessons.map(l => youtubeId(l.url))));
async function read() {
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result) return { state: withSupplementaryDefaults({ version: 1, revision: 0, videos: [] }), etag: undefined };
  if (result.statusCode !== 200) throw new Error('Storage unavailable');
  const state: SupplementaryState = await new Response(result.stream).json();
  if (state.version !== 1 || !Array.isArray(state.videos) || !Number.isSafeInteger(state.revision)) throw new Error('Invalid storage');
  return { state: withSupplementaryDefaults(state), etag: result.blob.etag };
}
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: privateHeaders });
export async function GET() {
  try { return reply((await read()).state); }
  catch { return reply({ error: 'Shared videos could not be loaded. Please retry; existing course lessons are unaffected.' }, 503); }
}
export async function POST(request: Request) {
  // Intentionally collaborative: no identity gate. Confirmation is an accident
  // guard, not authentication. Credentials and canonical lessons stay server-only.
  if (!sameOrigin(request)) return reply({ error: 'Request not allowed.' }, 403);
  let body: Record<string, unknown>;
  try {
    const value = await limitedJson(request);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    body = value as Record<string, unknown>;
  } catch { return reply({ error: 'Invalid request.' }, 400); }
  const action = body.action as SupplementaryAction;
  if (!['add', 'edit', 'archive', 'restore'].includes(action) || body.confirmation !== confirmationPhrase(action)) return reply({ error: 'Type the confirmation phrase exactly.' }, 400);
  try {
    const { state, etag } = await read();
    if (body.revision !== state.revision) return reply({ error: 'Someone changed the shared list. Refresh it, review your changes and confirm again.' }, 409);
    const existing = state.videos.find(v => v.id === body.id);
    if (action !== 'add' && !existing) return reply({ error: 'Video not found.' }, 404);
    let video: SupplementaryVideo;
    if (action === 'add' || action === 'edit') {
      const videoId = typeof body.url === 'string' ? youtubeId(body.url) : null;
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const instructor = typeof body.instructor === 'string' ? body.instructor.trim() : '';
      const module = course.modules.find(m => m.id === body.moduleId);
      if (!videoId || !title || title.length > 240 || instructor.length > 160 || !module?.lessons.some(l => l.id === body.anchorId) || !['before', 'after'].includes(String(body.position))) return reply({ error: 'Check the YouTube link, title and lesson position.' }, 400);
      if (coreVideos.has(videoId) || state.videos.some(v => v.videoId === videoId && v.id !== existing?.id)) return reply({ error: 'This video is already in the course or archive. Move or restore its existing entry instead.' }, 409);
      if (action === 'add' && state.videos.length >= 500) return reply({ error: 'The shared library has reached its 500-video limit.' }, 400);
      video = { id: existing?.id ?? crypto.randomUUID(), videoId, title, instructor, moduleId: module.id, anchorId: String(body.anchorId), position: body.position as 'before' | 'after', archived: existing?.archived ?? false, updatedAt: new Date().toISOString() };
    } else video = { ...existing!, archived: action === 'archive', updatedAt: new Date().toISOString() };
    const next: SupplementaryState = { version: 1, revision: state.revision + 1, videos: existing ? state.videos.map(v => v.id === video.id ? video : v) : [...state.videos, video] };
    await put(pathname, JSON.stringify(next), { access: 'private', addRandomSuffix: false, contentType: 'application/json', cacheControlMaxAge: 0, ...(etag ? { ifMatch: etag, allowOverwrite: true } : { allowOverwrite: false }) });
    return reply(next);
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError || (error instanceof Error && /already exists/i.test(error.message))) return reply({ error: 'Another visitor saved first. Refresh and confirm again.' }, 409);
    return reply({ error: 'Changes were not saved. Please retry. Your form has been kept.' }, 503);
  }
}
