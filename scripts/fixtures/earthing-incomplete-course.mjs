import { readFileSync } from 'node:fs';

const previous = JSON.parse(readFileSync(new URL('./earthing-regroup-previous.json', import.meta.url), 'utf8'));
// Reproduce the reported first-eight arrangement with simulated private IDs
// and videos; this fixture contains no live account data or credentials.
export const firstEightEarthingIds = [
  'private-earthing-systems', 'private-outbuilding-earthing',
  'course-9xNy5ne2YPI', 'p02-l04', 'p05-l08', 'private-pnb-pme',
  'p02-l05', 'course-l7df_UZxT0E',
];
export const obsoleteEarthingIds = [
  'p05-l07', 'p05-l06', 'course-TFt3d77LujQ', 'p05-l10', 'p05-l11', 'course-8-GmwF090JU',
];

export function incompleteEarthingCourse(base, curriculumRevision = 1) {
  const state = structuredClone(base);
  // Remove the copied legacy rows from any newer split destinations first.
  // A persisted course contains each video once, even across later curricula.
  const previousIds = new Set(Object.values(previous).flat());
  state.groups = Object.fromEntries(Object.entries(state.groups).map(([sectionId, ids]) => [sectionId, ids.filter(id => !previousIds.has(id))]));
  Object.assign(state.groups, structuredClone(previous));
  for (const id of ['module-05-ads', 'module-05-fault-loop', 'module-06-cpc-sizing']) state.groups[id] = [];
  state.groups['module-05-section-3'] = [...firstEightEarthingIds, ...obsoleteEarthingIds];
  const introductions = [
    ['private-earthing-systems', 'earthing001', 'Earthing Systems Explained: TT, TN-S, TN-C, TN-C-S & IT (Complete Guide)', 'Gaurav J - TheElectricalGuy', 'course-9xNy5ne2YPI', 'before'],
    ['private-outbuilding-earthing', 'earthing002', 'EARTHING a SHED or OUTBUILDING – TT – TNS – TNCS – IMPROVED AUDIO', 'LEARN ELECTRICS', 'private-earthing-systems', 'after'],
    ['private-pnb-pme', 'earthing003', 'PNB & PME DIFFERENCES – EARTHING SYSTEMS', 'LEARN ELECTRICS', 'p05-l07', 'before'],
  ];
  state.videos.push(...introductions.map(([id, videoId, title, instructor, anchorId, position]) => ({
    id, videoId, title, instructor, anchorId, position, moduleId: 'module-05',
    archived: false, placementRevision: 2, updatedAt: '2026-09-30T10:00:00Z',
  })));
  state.revision = 42;
  state.curriculumRevision = curriculumRevision;
  // A historical personal reorder touched these rows. The old migration
  // deliberately skipped them, even though the new sections had been created.
  state.itemRevisions = Object.fromEntries(obsoleteEarthingIds.map(id => [id, 42]));
  state.receipts = [{ id: 'retained-original-earthing-edit', revision: 42, affected: ['p05-l06'], inverse: {
    positions: [{ id: 'p05-l06', sectionId: 'module-05-section-3', beforeId: 'course-TFt3d77LujQ', afterId: 'p05-l07' }],
    videos: [], archiveIds: [],
  } }];
  return state;
}
