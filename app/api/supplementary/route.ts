import { get, head, put, BlobPreconditionFailedError } from '@vercel/blob';
import course from '../../course-curriculum';
import { withSupplementaryDefaults } from '../../supplementary-defaults';
import { limitedJson, sameOrigin, privateHeaders } from '../../server/reader-auth';
import { confirmationPhrase, youtubeId, type SupplementaryAction, type SupplementaryState, type SupplementaryVideo } from '../../supplementary-model';

export const runtime = 'nodejs';
const pathname = 'course/supplementary-videos-v1.json';
const maxSaveAttempts = 3;
const coreVideos = new Set(course.modules.flatMap(m => m.lessons.map(l => youtubeId(l.url))));

type ReadResult = {
  state: SupplementaryState;
  promoted: SupplementaryVideo[];
  etag?: string;
};

async function read(): Promise<ReadResult> {
  // Private Blob consistent reads bypass the CDN. Verify the data-plane ETag
  // against control-plane metadata before using it for a conditional write.
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const result = await get(pathname, { access: 'private', useCache: false });
    if (!result) return { state: withSupplementaryDefaults({ version: 1, revision: 0, videos: [] }), promoted: [], etag: undefined };
    if (result.statusCode !== 200) throw new Error('Storage unavailable');

    const stored: SupplementaryState = await new Response(result.stream).json();
    if (stored.version !== 1 || !Array.isArray(stored.videos) || !Number.isSafeInteger(stored.revision)) throw new Error('Invalid storage');

    const metadata = await head(pathname);
    if (metadata.etag !== result.blob.etag) continue;

    return {
      state: withSupplementaryDefaults(stored),
      promoted: stored.videos.filter(v => coreVideos.has(v.videoId)),
      etag: metadata.etag,
    };
  }
  throw new Error('Storage changed while being read');
}

const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: privateHeaders });

function writeConflict(error: unknown) {
  return error instanceof BlobPreconditionFailedError || (error instanceof Error && /already exists/i.test(error.message));
}

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
  if (typeof body.revision !== 'number' || !Number.isSafeInteger(body.revision)) return reply({ error: 'Refresh the shared list before saving.' }, 409);

  const requestedRevision = body.revision;
  // Existing edit/archive/restore forms include the record's updatedAt value
  // because the editor is created by spreading the selected video. Treat it
  // as the record-level concurrency token so unrelated catalogue changes can
  // be rebased without overwriting a newer edit to this same video.
  const baseUpdatedAt = typeof body.updatedAt === 'string' ? body.updatedAt : undefined;
  let sawRevisionChange = false;
  let previousRevision: number | undefined;

  for (let attempt = 1; attempt <= maxSaveAttempts; attempt += 1) {
    try {
      const { state, promoted, etag } = await read();
      if (previousRevision !== undefined && state.revision !== previousRevision) sawRevisionChange = true;
      previousRevision = state.revision;

      // Additions and edits to different records can be safely rebased onto a
      // newer catalogue. For an existing record, its timestamp is the record's
      // optimistic-concurrency token; never silently overwrite a newer edit.
      if (action !== 'add' && requestedRevision !== state.revision && !baseUpdatedAt) {
        return reply({ error: 'Someone changed the shared list. Refresh it, review your changes and confirm again.' }, 409);
      }

      const existing = state.videos.find(v => v.id === body.id);
      if (action !== 'add' && !existing) return reply({ error: 'Video not found.' }, 404);
      if (action !== 'add' && baseUpdatedAt && existing!.updatedAt !== baseUpdatedAt) {
        return reply({ error: 'This video changed since you opened it. Refresh the shared list, review the latest version and confirm again.' }, 409);
      }

      let video: SupplementaryVideo;
      if (action === 'add' || action === 'edit') {
        const videoId = typeof body.url === 'string' ? youtubeId(body.url) : null;
        const title = typeof body.title === 'string' ? body.title.trim() : '';
        const instructor = typeof body.instructor === 'string' ? body.instructor.trim() : '';
        const module = course.modules.find(m => m.id === body.moduleId);
        if (!videoId || !title || title.length > 240 || instructor.length > 160 || !module?.lessons.some(l => l.id === body.anchorId) || !['before', 'after'].includes(String(body.position))) return reply({ error: 'Check the YouTube link, title and lesson position.' }, 400);
        if (coreVideos.has(videoId) || state.videos.some(v => v.videoId === videoId && v.id !== existing?.id)) return reply({ error: 'This video is already in the course or archive. Move or restore its existing entry instead.' }, 409);
        if (action === 'add' && state.videos.length >= 500) return reply({ error: 'The shared library has reached its 500-video limit.' }, 400);
        video = { id: existing?.id ?? crypto.randomUUID(), videoId, title, instructor, moduleId: module.id, anchorId: String(body.anchorId), position: body.position as 'before' | 'after', archived: existing?.archived ?? false, placementRevision: 1, updatedAt: new Date().toISOString() };
      } else {
        video = { ...existing!, archived: action === 'archive', updatedAt: new Date().toISOString() };
      }

      const next: SupplementaryState = {
        version: 1,
        revision: state.revision + 1,
        videos: existing ? state.videos.map(v => v.id === video.id ? video : v) : [...state.videos, video],
      };

      try {
        // Preserve historical visitor entries when another shared video is edited.
        // They are excluded from the public list because the video is now canonical.
        await put(pathname, JSON.stringify({ ...next, videos: [...next.videos, ...promoted] }), {
          access: 'private',
          addRandomSuffix: false,
          contentType: 'application/json',
          // Vercel Blob's supported minimum. Reads that must be current use
          // get(..., { useCache: false }) above.
          cacheControlMaxAge: 60,
          ...(etag ? { ifMatch: etag, allowOverwrite: true } : { allowOverwrite: false }),
        });
        return reply(next);
      } catch (error) {
        if (!writeConflict(error)) throw error;
        console.warn('Supplementary catalogue conditional write conflicted', {
          action,
          attempt,
          requestedRevision,
          observedRevision: state.revision,
          ...safeError(error),
        });
        if (attempt === maxSaveAttempts) {
          if (sawRevisionChange || state.revision !== requestedRevision) {
            return reply({ error: 'The shared list kept changing while this save was being applied. Refresh it, review the latest version and confirm again.' }, 409);
          }
          return reply({ error: 'The shared catalogue storage rejected the save. Please retry shortly; your form has been kept.' }, 503);
        }
      }
    } catch (error) {
      console.error('Supplementary catalogue save failed', { action, attempt, ...safeError(error) });
      return reply({ error: 'Changes were not saved. Please retry. Your form has been kept.' }, 503);
    }
  }

  return reply({ error: 'Changes were not saved. Please retry. Your form has been kept.' }, 503);
}
