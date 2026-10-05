import update from './design-learning-update.json';

const previous: Record<string, string[]> = update.previous;
const current: Record<string, string[]> = update.current;
const destinations = new Map(Object.entries(current).flatMap(([sectionId, ids]) => ids.map(id => [id, sectionId] as const)));
type SupportingVideo = { id: string; anchorId: string };

// Split only the former published design/assembly groups. Personal moves,
// supporting-video edits and later curriculum arrangements remain authoritative.
export function upgradeDesignLearningGroups(input: Record<string, string[]>, revision = 0, protectedIds = new Set<string>(), supporting: SupportingVideo[] = []) {
  if (revision >= update.revision) return input;
  const groups = Object.fromEntries(Object.entries(input).map(([id, ids]) => [id, [...ids]]));
  for (const sectionId of Object.keys(current)) groups[sectionId] ??= [];
  const sortable = new Set<string>();
  for (const [sourceId, priorIds] of Object.entries(previous)) {
    const original = input[sourceId] ?? [];
    const published = original.filter(id => priorIds.includes(id));
    const untouchedOrder = published.join('|') === priorIds.filter(id => original.includes(id)).join('|');
    const lastMoved = new Map<string, string>();
    for (const id of published) {
      const destinationId = destinations.get(id);
      if (!destinationId || protectedIds.has(id)) continue;
      if (untouchedOrder) sortable.add(id);
      if (destinationId === sourceId || !groups[sourceId].includes(id)) continue;
      const moving = new Set([id]);
      let expanded = true;
      while (expanded) {
        expanded = false;
        for (const video of supporting) {
          const authoredDestination = destinations.get(video.id);
          if (moving.has(video.anchorId) && groups[sourceId].includes(video.id) && !moving.has(video.id) &&
            !protectedIds.has(video.id) && (!authoredDestination || authoredDestination === destinationId)) {
            moving.add(video.id); expanded = true;
          }
        }
      }
      const block = groups[sourceId].filter(value => moving.has(value));
      groups[sourceId] = groups[sourceId].filter(value => !moving.has(value));
      const destination = groups[destinationId], authored = current[destinationId];
      const next = authored.slice(authored.indexOf(id) + 1).find(value => destination.includes(value));
      const prior = !untouchedOrder && lastMoved.get(destinationId);
      const index = prior && destination.includes(prior) ? destination.indexOf(prior) + 1 : next ? destination.indexOf(next) : destination.length;
      destination.splice(index, 0, ...block);
      lastMoved.set(destinationId, block[block.length - 1]);
    }
  }
  const videoById = new Map(supporting.map(video => [video.id, video]));
  for (const [sectionId, authored] of Object.entries(current)) {
    const ids = groups[sectionId];
    const roots = new Set(authored.filter(id => sortable.has(id) && ids.includes(id)));
    const rootFor = (id: string): string | undefined => {
      const seen = new Set<string>();
      let ancestor = id;
      while (!seen.has(ancestor)) {
        if (roots.has(ancestor)) return ancestor;
        if (destinations.has(ancestor) || protectedIds.has(ancestor) || !ids.includes(ancestor)) return;
        seen.add(ancestor);
        const video = videoById.get(ancestor);
        if (!video) return;
        ancestor = video.anchorId;
      }
    };
    const blocks = new Map<string, string[]>();
    for (const id of ids) {
      const root = rootFor(id);
      if (root) blocks.set(root, [...(blocks.get(root) ?? []), id]);
    }
    const ordered = authored.filter(id => blocks.has(id)).map(id => blocks.get(id)!);
    const emitted = new Set<string>();
    let index = 0;
    groups[sectionId] = ids.flatMap(id => {
      const root = rootFor(id);
      if (!root) return [id];
      if (emitted.has(root)) return [];
      emitted.add(root);
      return ordered[index++];
    });
  }
  return groups;
}
