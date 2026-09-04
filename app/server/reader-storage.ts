import 'server-only';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { applyReaderCommand, emptyReaderState, type ReaderState, type ReaderCommand } from '../reader-state';
import type { BookId } from '../books-data';
import bookAssets from '../book-assets.json';

export const bookFiles: Record<BookId, { pathname: string; size: number }> = {
  'installation-designs': bookAssets['installation-designs'].reader,
  'modern-wiring': bookAssets['modern-wiring'].reader,
};
const statePath = 'reader/owner-state-v1.json';
export async function readReaderState(): Promise<{ state: ReaderState; etag?: string }> {
  const result = await get(statePath, { access: 'private', useCache: false });
  if (!result) return { state: emptyReaderState() };
  if (result.statusCode !== 200) throw new Error('STATE_UNAVAILABLE');
  const state: ReaderState = await new Response(result.stream).json();
  if (state.version !== 1 || !state.books || typeof state.books !== 'object') throw new Error('STATE_FORMAT');
  return { state, etag: result.blob.etag };
}
export async function updateReaderState(command: ReaderCommand): Promise<ReaderState> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const { state, etag } = await readReaderState();
    const next = applyReaderCommand(state, command);
    try {
      await put(statePath, JSON.stringify(next), { access: 'private', addRandomSuffix: false, contentType: 'application/json', cacheControlMaxAge: 0, ...(etag ? { ifMatch: etag, allowOverwrite: true } : { allowOverwrite: false }) });
      return next;
    } catch (error) {
      const conflict = error instanceof BlobPreconditionFailedError || (error instanceof Error && /already exists/i.test(error.message));
      if (!conflict || attempt === 3) throw error;
    }
  }
  throw new Error('STATE_CONFLICT');
}
