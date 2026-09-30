import { learningSections } from './learning-sections';

export const earthingCurriculumRevision = 1;
const previousSections: Record<string, string[]> = {
  'module-05-section-3': ['course-9xNy5ne2YPI', 'p02-l04', 'p02-l05', 'course-l7df_UZxT0E', 'p05-l08', 'p05-l07', 'p05-l06', 'course-TFt3d77LujQ', 'p05-l10', 'p05-l11', 'course-8-GmwF090JU'],
  'module-05-section-4': ['p02-l07', 'p05-l04', 'course-TUno2IT-KZY', 'p02-l08', 'p05-l15'],
};
const destinations = new Map(learningSections.flatMap(section => section.lessonIds.map(id => [id, section.id] as const)));

// Upgrade original teaching groups once. Explicit personal edits and a legacy
// group with a custom core order remain authoritative. Private entries retain
// their relative order; untouched legacy attachments follow their anchor.
export function upgradeEarthingGroups(input: Record<string, string[]>, revision = 0, protectedIds = new Set<string>(), supporting: { id: string; anchorId: string }[] = []) {
  if (revision >= earthingCurriculumRevision) return input;
  const groups = Object.fromEntries(Object.entries(input).map(([id, ids]) => [id, [...ids]]));
  for (const section of learningSections) groups[section.id] ??= [];
  for (const [sourceId, previous] of Object.entries(previousSections)) {
    const original = input[sourceId] ?? [];
    const existing = original.filter(id => previous.includes(id));
    if (existing.join('|') !== previous.filter(id => original.includes(id)).join('|')) continue;
    for (const id of existing) {
      const destinationId = destinations.get(id);
      if (!destinationId || destinationId === sourceId || protectedIds.has(id)) continue;
      const moving = new Set([id]);
      let expanded = true;
      while (expanded) {
        expanded = false;
        for (const video of supporting) if (moving.has(video.anchorId) && original.includes(video.id) && !protectedIds.has(video.id) && !moving.has(video.id)) {
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
    // Reorder only untouched foundation slots. Private additions and edited
    // catalogue rows keep their places among the surviving foundation lessons.
    const authored = learningSections.find(section => section.id === sourceId)!.lessonIds;
    const sortable = new Set(existing.filter(id => destinations.get(id) === sourceId && !protectedIds.has(id)));
    const ordered = authored.filter(id => sortable.has(id));
    let index = 0;
    groups[sourceId] = groups[sourceId].map(id => sortable.has(id) ? ordered[index++] : id);
  }
  return groups;
}
