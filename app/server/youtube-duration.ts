import { validVideoDuration } from '../video-duration';

// Read only the public player JSON for the requested video. Scan balanced JSON
// rather than evaluating scripts or assuming that braces inside strings close it.
export function durationFromYoutubePage(html: string, videoId: string): number | undefined {
  const assignment = /(?:var\s+)?ytInitialPlayerResponse\s*=\s*/.exec(html);
  if (!assignment) return;
  const start = assignment.index + assignment[0].length;
  if (html[start] !== '{') return;
  let depth = 0, quoted = false, escaped = false;
  for (let index = start; index < html.length; index++) {
    const char = html[index];
    if (quoted) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) {
      try {
        const details = JSON.parse(html.slice(start, index + 1)).videoDetails;
        if (details?.videoId !== videoId || details.isLive === true) return;
        return validVideoDuration(Number(details.lengthSeconds));
      } catch { return; }
    }
  }
}

export async function fetchYoutubeDuration(videoId: string): Promise<number | undefined> {
  if (!/^[\w-]{11}$/.test(videoId)) return;
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { 'User-Agent': 'Mozilla/5.0' }, redirect: 'error',
      signal: AbortSignal.timeout(8000), next: { revalidate: 86400 },
    });
    if (!response.ok) return;
    const html = await response.text();
    if (html.length > 4_000_000) return;
    return durationFromYoutubePage(html, videoId);
  } catch { return; }
}
