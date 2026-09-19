export type SupplementaryVideo = {
  id: string; videoId: string; title: string; instructor: string;
  moduleId: string; anchorId: string; position: 'before' | 'after';
  archived: boolean; updatedAt: string;
  placementRevision?: number;
};
export type SupplementaryState = { version: 1; revision: number; videos: SupplementaryVideo[] };
export type SupplementaryAction = 'add' | 'edit' | 'archive' | 'restore';
export const confirmationPhrase = (action: SupplementaryAction) => `${action.toUpperCase()} VIDEO`;

export function supplementaryPlacementCreatesCycle(videos: SupplementaryVideo[], movingId: string | undefined, anchorId: string): boolean {
  if (!movingId) return false;
  const byId = new Map(videos.map(video => [video.id, video]));
  const visited = new Set<string>();
  let current = anchorId;
  while (current && !visited.has(current)) {
    if (current === movingId) return true;
    visited.add(current);
    current = byId.get(current)?.anchorId ?? '';
  }
  return false;
}

export function supplementaryDescendants(videos: SupplementaryVideo[], rootAnchorIds: Iterable<string>): SupplementaryVideo[] {
  const children = new Map<string, SupplementaryVideo[]>();
  for (const video of videos) children.set(video.anchorId, [...(children.get(video.anchorId) ?? []), video]);
  const pending = [...rootAnchorIds];
  const visited = new Set<string>();
  const result: SupplementaryVideo[] = [];
  while (pending.length) {
    const anchorId = pending.shift()!;
    for (const video of children.get(anchorId) ?? []) {
      if (visited.has(video.id)) continue;
      visited.add(video.id);
      if (!video.archived) result.push(video);
      pending.push(video.id);
    }
  }
  return result;
}

export function youtubeId(value: string): string | null {
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return null;
    const host = url.hostname.toLowerCase();
    const parts = url.pathname.split('/').filter(Boolean);
    const id = host === 'youtu.be' ? parts[0] :
      ['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'www.youtube-nocookie.com'].includes(host)
        ? url.pathname === '/watch' ? url.searchParams.get('v') : ['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : null : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
