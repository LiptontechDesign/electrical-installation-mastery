import { learningSections } from './learning-sections';

export const earthingCurriculumRevision = 2;
const previousSections: Record<string, string[]> = {
  'module-05-section-3': ['course-9xNy5ne2YPI', 'p02-l04', 'p02-l05', 'course-l7df_UZxT0E', 'p05-l08', 'p05-l07', 'p05-l06', 'course-TFt3d77LujQ', 'p05-l10', 'p05-l11', 'course-8-GmwF090JU'],
  'module-05-section-4': ['p02-l07', 'p05-l04', 'course-TUno2IT-KZY', 'p02-l08', 'p05-l15'],
};
const destinations = new Map(learningSections.flatMap(section => section.lessonIds.map(id => [id, section.id] as const)));

// Repair the obsolete combined groups once, including customised groups that
// revision 1 skipped. Only known lessons still in an obsolete source move:
// placements elsewhere and subsequent revision-2 personal edits remain intact.
export function upgradeEarthingGroups(input: Record<string, string[]>, revision = 0, protectedIds = new Set<string>(), supporting: { id: string; anchorId: string }[] = []) {
  if (revision >= earthingCurriculumRevision) return input;
  const groups = Object.fromEntries(Object.entries(input).map(([id, ids]) => [id, [...ids]]));
  for (const section of learningSections) groups[section.id] ??= [];
  for (const [sourceId, previous] of Object.entries(previousSections)) {
    const original = input[sourceId] ?? [];
    const existing = original.filter(id => previous.includes(id));
    const originalCoreOrder = existing.join('|') === previous.filter(id => original.includes(id)).join('|');
    const firstRelocatedIndex = original.findIndex(id => previous.includes(id) && destinations.get(id) !== sourceId);
    for (const id of existing) {
      const destinationId = destinations.get(id);
      if (!destinationId || destinationId === sourceId) continue;
      const moving = new Set([id]);
      let expanded = true;
      while (expanded) {
        expanded = false;
        for (const video of supporting) if (moving.has(video.anchorId) && original.includes(video.id) && !protectedIds.has(video.id) && !moving.has(video.id) &&
          !(sourceId === 'module-05-section-3' && original.indexOf(video.id) < firstRelocatedIndex)) {
          moving.add(video.id); expanded = true;
        }
      }
      const block = groups[sourceId].filter(value => moving.has(value));
      groups[sourceId] = groups[sourceId].filter(value => !moving.has(value));
      const destination = groups[destinationId];
      const authored = learningSections.find(section => section.id === destinationId)!.lessonIds;
      const next = authored.slice(authored.indexOf(id) + 1).find(value => destination.includes(value));
      destination.splice(next ? destination.indexOf(next) : destination.length, 0, ...block);
    }
    // The correction keeps the existing introductory order, including the
    // learner's first eight mixed rows. Only a previously untouched revision-0
    // core sequence receives the originally published foundation reordering.
    if (revision >= 1 || !originalCoreOrder) continue;
    const authored = learningSections.find(section => section.id === sourceId)!.lessonIds;
    const sortable = new Set(existing.filter(id => destinations.get(id) === sourceId && !protectedIds.has(id)));
    const ordered = authored.filter(id => sortable.has(id));
    let index = 0;
    groups[sourceId] = groups[sourceId].map(id => sortable.has(id) ? ordered[index++] : id);
  }
  return groups;
}
