const surgeProtectionRevision = 4;
const sourceId = 'module-05-section-5';
const destinationId = 'module-05-arc-fault';
const arcFaultId = 'course-lIit5k8QVj8';

// Split the former combined topic once. Only its published AFDD lesson and
// untouched supporting descendants move; other personal destinations survive.
export function upgradeSurgeProtectionGroups(input: Record<string, string[]>, revision = 0, protectedIds = new Set<string>(), supporting: { id: string; anchorId: string }[] = []) {
  if (revision >= surgeProtectionRevision || !input[sourceId]?.includes(arcFaultId)) return input;
  const groups = Object.fromEntries(Object.entries(input).map(([id, ids]) => [id, [...ids]]));
  groups[destinationId] ??= [];
  const moving = new Set([arcFaultId]);
  let expanded = true;
  while (expanded) {
    expanded = false;
    for (const video of supporting) {
      if (moving.has(video.anchorId) && groups[sourceId].includes(video.id) && !moving.has(video.id) && !protectedIds.has(video.id)) {
        moving.add(video.id); expanded = true;
      }
    }
  }
  const block = groups[sourceId].filter(id => moving.has(id));
  groups[sourceId] = groups[sourceId].filter(id => !moving.has(id));
  groups[destinationId].unshift(...block);
  return groups;
}
