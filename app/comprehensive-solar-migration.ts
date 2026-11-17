type SupportingVideo = { id: string; anchorId: string };

const revision = 15;
const moves = [
  {
    id: 'solar-comprehensive-video-25',
    source: 'solar-comprehensive-05-section-02',
    destination: 'solar-comprehensive-01-preview',
    previous: ['solar-comprehensive-video-25', 'solar-comprehensive-video-26', 'solar-comprehensive-video-27'],
  },
  {
    id: 'solar-comprehensive-video-55',
    source: 'solar-comprehensive-11-section-01',
    destination: 'solar-comprehensive-01-preview',
    previous: ['solar-comprehensive-video-54', 'solar-comprehensive-video-55', 'solar-comprehensive-video-56'],
  },
  {
    id: 'solar-comprehensive-video-47',
    source: 'solar-comprehensive-10-section-01',
    destination: 'solar-comprehensive-09-self-consumption',
    previous: ['solar-comprehensive-video-47', 'solar-comprehensive-video-48', 'solar-comprehensive-video-49'],
  },
  {
    id: 'solar-comprehensive-video-48',
    source: 'solar-comprehensive-10-section-01',
    destination: 'solar-comprehensive-09-self-consumption',
    previous: ['solar-comprehensive-video-47', 'solar-comprehensive-video-48', 'solar-comprehensive-video-49'],
  },
];

// Move only untouched published placements. Explicit personal moves and a
// reordered legacy section remain authoritative. Supporting descendants move
// with their anchor unless the learner has explicitly placed them elsewhere.
export function upgradeComprehensiveSolarGroups(input: Record<string, string[]>, fromRevision = 0, protectedIds = new Set<string>(), supporting: SupportingVideo[] = []) {
  if (fromRevision >= revision) return input;
  const groups = Object.fromEntries(Object.entries(input).map(([id, ids]) => [id, [...ids]]));
  for (const move of moves) {
    const source = groups[move.source] ?? [];
    if (!source.includes(move.id) || protectedIds.has(move.id)) continue;
    const published = source.filter(id => move.previous.includes(id));
    if (published.join('|') !== move.previous.filter(id => source.includes(id)).join('|')) continue;

    const moving = new Set([move.id]);
    let expanded = true;
    while (expanded) {
      expanded = false;
      for (const video of supporting) {
        if (moving.has(video.anchorId) && source.includes(video.id) && !moving.has(video.id) && !protectedIds.has(video.id)) {
          moving.add(video.id);
          expanded = true;
        }
      }
    }
    const block = source.filter(id => moving.has(id));
    groups[move.source] = source.filter(id => !moving.has(id));
    const target = groups[move.destination] ??= [];
    const authored = moves.filter(item => item.destination === move.destination).map(item => item.id);
    const next = authored.slice(authored.indexOf(move.id) + 1).find(id => target.includes(id));
    target.splice(next ? target.indexOf(next) : target.length, 0, ...block);
  }
  return groups;
}
