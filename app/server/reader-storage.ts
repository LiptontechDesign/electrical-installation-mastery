import 'server-only';
import { applyReaderCommand, emptyReaderState, type ReaderState, type ReaderCommand } from '../reader-state';
import type { BookId } from '../books-data';
import bookAssets from '../book-assets.json';
import { readUserDocument, writeUserDocument } from './database';

export const bookFiles: Record<BookId, { pathname: string; size: number }> = {
  'installation-designs': bookAssets['installation-designs'].reader,
  'modern-wiring': bookAssets['modern-wiring'].reader,
  'iet-wiring-guide': bookAssets['iet-wiring-guide'].reader,
  'on-site-guide': bookAssets['on-site-guide'].reader,
};
export async function readReaderState(userId: string): Promise<ReaderState> {
  const result = await readUserDocument<ReaderState>(userId, 'reader-state');
  if (!result) return emptyReaderState();
  const state = result.payload;
  if (state.version !== 1 || !state.books || typeof state.books !== 'object') throw new Error('STATE_FORMAT');
  return state;
}
export async function updateReaderState(userId: string, command: ReaderCommand): Promise<ReaderState> {
  const next = applyReaderCommand(await readReaderState(userId), command);
  await writeUserDocument(userId, 'reader-state', next);
  return next;
}
