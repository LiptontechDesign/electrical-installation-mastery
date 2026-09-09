export type SupplementaryVideo = {
  id: string; videoId: string; title: string; instructor: string;
  moduleId: string; anchorId: string; position: 'before' | 'after';
  archived: boolean; updatedAt: string;
};
export type SupplementaryState = { version: 1; revision: number; videos: SupplementaryVideo[] };
export type SupplementaryAction = 'add' | 'edit' | 'archive' | 'restore';
export const confirmationPhrase = (action: SupplementaryAction) => `${action.toUpperCase()} VIDEO`;
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
