export type VideoProgress = { total: number; watched: number; percent: number };

// Count active course entries, never retained history from archived/deleted rows.
export function progressForVideos(ids: Iterable<string>, watchedIds: ReadonlySet<string>): VideoProgress {
  const active = new Set(ids);
  const watched = [...active].filter(id => watchedIds.has(id)).length;
  const total = active.size;
  return { total, watched, percent: total ? Math.round(watched / total * 100) : 0 };
}
