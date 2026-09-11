import { get, put } from '@vercel/blob';
import course from '../../course-curriculum';
import { withSupplementaryDefaults } from '../../supplementary-defaults';
import { limitedJson, sameOrigin, privateHeaders } from '../../server/reader-auth';
import { confirmationPhrase, youtubeId, type SupplementaryAction, type SupplementaryState, type SupplementaryVideo } from '../../supplementary-model';

export const runtime = 'nodejs';
const pathname = 'course/supplementary-videos-v1.json';
const coreVideos = new Set(course.modules.flatMap(m => m.lessons.map(l => youtubeId(l.url))));

type ReadResult = {
  state: SupplementaryState;
  promoted: SupplementaryVideo[];
};

async function read(): Promise<ReadResult> {
  // Always read the current private Blob directly from origin. This catalogue is
  // intentionally collaborative and uses last-write-wins semantics, so there is
  // no ETag/head precondition that can block ordinary visitor edits.
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result) return { state: withSupplementaryDefaults({ version: 1, revision: 0, videos: [] }), promoted: [] };
  if (result.statusCode !== 200) throw new Error('Storage unavailable');

  const stored: SupplementaryState = await new Response(result.stream).json();
  if (stored.version !== 1 || !Array.isArray(stored.videos) || !Number.isSafeInteger(stored.revision)) throw new Error('Invalid storage');

  return {
    state: withSupplementaryDefaults(stored),
    promoted: stored.videos.filter(v => coreVideos.has(v.videoId)),
  };
}

const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: privateHeaders });

function safeError(error: unknown) {
  return error instanceof Error ? { name: error.name, message: error.message } : { name: 'UnknownError', message: String(error) };
}

export async function GET() {
  try { return reply((await read()).state); }
  catch (error) {
    console.error('Supplementary catalogue read failed', safeError(error));
    return reply({ error: 'Shared videos could not be loaded. Please retry; existing course lessons are unaffected.' }, 503);
  }
}

export async function POST(request: Request) {
  // Intentionally collaborative: no identity gate. Any visitor using the app
  // may add, edit, archive or restore supplementary videos. Confirmation is an
  // accident guard, not authentication.
  if (!sameOrigin(request)) return reply({ error: 'Request not allowed.' }, 403);

  let body: Record<string, unknown>;
  try {
    const value = await limitedJson(request);
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error();
    body = value as Record<string, unknown>;
  } catch { return reply({ error: 'Invalid request.' }, 400); }

  const action = body.action as SupplementaryAction;
  if (!['add', 'edit', 'archive', 'restore'].includes(action) || body.confirmation !== confirmationPhrase(action)) {
    return reply({ error: 'Type the confirmation phrase exactly.' }, 400);
  }

  try {
    // Re-read immediately before every change. We intentionally do not reject a
    // stale client revision: edits are applied to the latest catalogue and the
    // most recent successful save wins.
    const { state, promoted } = await read();
    const existing = state.videos.find(v => v.id === body.id);
    if (action !== 'add' && !existing) return reply({ error: 'Video not found. Refresh the shared list and try again.' }, 404);

    let video: SupplementaryVideo;
    if (action === 'add' || action === 'edit') {
      const videoId = typeof body.url === 'string' ? youtubeId(body.url) : null;
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      const instructor = typeof body.instructor === 'string' ? body.instructor.trim() : '';
      const module = course.modules.find(m => m.id === body.moduleId);

      if (!videoId || !title || title.length > 240 || instructor.length > 160 || !module?.lessons.some(l => l.id === body.anchorId) || !['before', 'after'].includes(String(body.position))) {
        return reply({ error: 'Check the YouTube link, title and lesson position.' }, 400);
      }
      if (coreVideos.has(videoId) || state.videos.some(v => v.videoId === videoId && v.id !== existing?.id)) {
        return reply({ error: 'This video is already in the course or archive. Move or restore its existing entry instead.' }, 409);
      }
      if (action === 'add' && state.videos.length >= 500) {
        return reply({ error: 'The shared library has reached its 500-video limit.' }, 400);
      }

      video = {
        id: existing?.id ?? crypto.randomUUID(),
        videoId,
        title,
        instructor,
        moduleId: module.id,
        anchorId: String(body.anchorId),
        position: body.position as 'before' | 'after',
        archived: existing?.archived ?? false,
        placementRevision: 1,
        updatedAt: new Date().toISOString(),
      };
    } else {
      video = { ...existing!, archived: action === 'archive', updatedAt: new Date().toISOString() };
    }

    const next: SupplementaryState = {
      version: 1,
      revision: state.revision + 1,
      videos: existing ? state.videos.map(v => v.id === video.id ? video : v) : [...state.videos, video],
    };

    // Deliberately use unconditional overwrite for this open collaborative list.
    // This avoids the storage-level ETag/precondition failures that were blocking
    // normal saves. The latest successful visitor save is authoritative.
    await put(pathname, JSON.stringify({ ...next, videos: [...next.videos, ...promoted] }), {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      cacheControlMaxAge: 60,
    });

    return reply(next);
  } catch (error) {
    console.error('Supplementary catalogue save failed', { action, ...safeError(error) });
    return reply({ error: 'Changes were not saved because shared storage is unavailable. Please retry shortly; your form has been kept.' }, 503);
  }
}
