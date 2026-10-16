import type { MapRow } from './course-drop-model';
export type LessonFilter = 'all' | 'unwatched' | 'saved';
export const moduleTone = (id: string) => {
  let hash = 0;
  for (const char of id) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return ['blue', 'violet', 'teal', 'amber'][hash % 4];
};
export function matchesLessonFilter(row: MapRow, filter: LessonFilter, watched: ReadonlySet<string>, saved: ReadonlySet<string>) {
  return filter === 'all' || (filter === 'unwatched' ? !watched.has(row.id) : saved.has(row.id));
}

// Use the current mixed order, including personal and optional videos.
export function homeContinueDestination<T extends { id: string }>(rows: readonly T[], watched: ReadonlySet<string>, recentId?: string): T | undefined {
  return rows.find(row => row.id === recentId && !watched.has(row.id))
    ?? rows.find(row => !watched.has(row.id))
    ?? rows.find(row => row.id === recentId)
    ?? rows[0];
}
