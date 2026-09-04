import { getBook, type BookId } from './books-data';

export type PageBookmark = { page: number; note: string; updatedAt: string };
export type BookProgress = { page: number; updatedAt: string; bookmarks: PageBookmark[] };
export type ReaderState = { version: 1; books: Partial<Record<BookId, BookProgress>> };
export type ReaderCommand = { bookId: BookId; page: number } & (
  | { action: 'position' }
  | { action: 'bookmark'; saved: boolean; note?: string }
);
export const emptyReaderState = (): ReaderState => ({ version: 1, books: {} });

export function parseReaderCommand(value: unknown): ReaderCommand | null {
  if (!value || typeof value !== 'object') return null;
  const data = value as Record<string, unknown>;
  const book = typeof data.bookId === 'string' && getBook(data.bookId);
  if (!book || !Number.isInteger(data.page) || Number(data.page) < 1 || Number(data.page) > book.pages) return null;
  const base = { bookId: book.id, page: Number(data.page) };
  if (data.action === 'position') return { ...base, action: 'position' };
  if (data.action === 'bookmark' && typeof data.saved === 'boolean' && (data.note === undefined || typeof data.note === 'string' && data.note.length <= 2000)) {
    return { ...base, action: 'bookmark', saved: data.saved, ...(typeof data.note === 'string' ? { note: data.note } : {}) };
  }
  return null;
}

// Apply a small operation to the latest server copy, never replace another device's whole state.
export function applyReaderCommand(state: ReaderState, command: ReaderCommand, now = new Date().toISOString()): ReaderState {
  const previous = state.books[command.bookId] ?? { page: 1, updatedAt: now, bookmarks: [] };
  let next: BookProgress;
  if (command.action === 'position') next = { ...previous, page: command.page, updatedAt: now };
  else {
    const existing = previous.bookmarks.find(mark => mark.page === command.page);
    const bookmarks = previous.bookmarks.filter(mark => mark.page !== command.page);
    if (command.saved) {
      if (bookmarks.length >= 200) throw new Error('BOOKMARK_LIMIT');
      bookmarks.push({ page: command.page, note: command.note ?? existing?.note ?? '', updatedAt: now });
    }
    next = { ...previous, bookmarks: bookmarks.sort((a,b) => a.page - b.page) };
  }
  return { version: 1, books: { ...state.books, [command.bookId]: next } };
}

export function parseByteRange(header: string | null, size: number): { start: number; end: number } | null | 'invalid' {
  if (!header) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(header);
  if (!match || (!match[1] && !match[2])) return 'invalid';
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] ? Math.min(size - 1, match[2] ? Number(match[2]) : size - 1) : size - 1;
  return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start >= 0 && start <= end && start < size ? { start, end } : 'invalid';
}
