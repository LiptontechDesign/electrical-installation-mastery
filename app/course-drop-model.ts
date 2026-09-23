import { courseForOrder, moveLesson, orderedSections, relocateSupportingVideos, type CourseOrder, type LessonMove } from './course-order-model';
import { supplementaryPlacementCreatesCycle, type SupplementaryVideo } from './supplementary-model';

export type SupplementaryMove = Pick<SupplementaryVideo, 'id' | 'moduleId' | 'anchorId' | 'position'>;
export type MapRow = { id: string; title: string; kind: 'core' | 'supplementary'; sectionId: string; moduleId: string; displayNumber: number };
export type MapSnapshot = ReturnType<typeof courseMapSnapshot>;
export type DropProposal = {
  item: MapRow; source: string; destination: string; sectionId: string;
  beforeRowId: string | null; index: number; placement: string; unchanged: boolean;
  core?: LessonMove; supplementary?: SupplementaryMove;
  rows: Record<string, MapRow[]>; movingIds: string[];
};

// This is the same depth-first order as SupplementaryBranch, including children
// of archived anchors. The persisted models remain separate.
export function courseMapSnapshot(order: CourseOrder, input: SupplementaryVideo[]) {
  const { course } = courseForOrder(order);
  const sections = orderedSections(order);
  const videos = relocateSupportingVideos(input, course);
  const lessons = new Map(course.modules.flatMap(m => m.lessons).map(l => [l.id, l]));
  const children = new Map<string, SupplementaryVideo[]>();
  for (const video of videos) children.set(video.anchorId, [...(children.get(video.anchorId) ?? []), video]);
  const rows: Record<string, MapRow[]> = {};
  const videoCounts = new Map<string, number>();
  for (const section of sections) {
    const result: MapRow[] = [];
    const nextDisplayNumber = () => {
      const displayNumber = (videoCounts.get(section.moduleId) ?? 0) + 1;
      videoCounts.set(section.moduleId, displayNumber);
      return displayNumber;
    };
    const visit = (anchorId: string, position: 'before' | 'after', trail: Set<string>) => {
      for (const video of children.get(anchorId) ?? []) {
        if (video.position !== position || trail.has(video.id)) continue;
        const next = new Set([...trail, video.id]);
        visit(video.id, 'before', next);
        if (!video.archived) {
          result.push({ id: video.id, title: video.title, kind: 'supplementary', sectionId: section.id, moduleId: section.moduleId, displayNumber: nextDisplayNumber() });
        }
        visit(video.id, 'after', next);
      }
    };
    for (const id of section.lessonIds) {
      visit(id, 'before', new Set());
      result.push({ id, title: lessons.get(id)!.title, kind: 'core', sectionId: section.id, moduleId: section.moduleId, displayNumber: nextDisplayNumber() });
      visit(id, 'after', new Set());
    }
    rows[section.id] = result;
  }
  const byId = new Map(Object.values(rows).flat().map(row => [row.id, row]));
  const label = (id: string) => {
    const section = sections.find(s => s.id === id)!;
    const courseModule = course.modules.find(m => m.id === section.moduleId)!;
    return `Module ${String(courseModule.number).padStart(2, '0')} · Section ${section.number} · ${section.title}`;
  };
  return { order, videos, sections, rows, byId, label };
}

export function movingSequence(snapshot: MapSnapshot, id: string) {
  const ids = new Set([id]);
  // Include hidden placement anchors when walking the attachment tree.
  let added = true;
  while (added) {
    added = false;
    for (const v of snapshot.videos) if (ids.has(v.anchorId) && !ids.has(v.id)) { ids.add(v.id); added = true; }
  }
  return ids;
}

export function dropCandidates(snapshot: MapSnapshot, movingId: string, sectionId: string): DropProposal[] {
  const item = snapshot.byId.get(movingId);
  const section = snapshot.sections.find(s => s.id === sectionId);
  if (!item || !section) return [];
  const moving = movingSequence(snapshot, movingId);
  const candidates: { core?: LessonMove; supplementary?: SupplementaryMove }[] = [];
  if (item.kind === 'core') {
    for (const beforeId of [...section.lessonIds.filter(id => id !== movingId), null]) {
      candidates.push({ core: { lessonId: movingId, sectionId, beforeId } });
    }
  } else {
    // No anchor means no supplementary destination: empty sections accept core only.
    for (const anchor of snapshot.rows[sectionId]) {
      if (moving.has(anchor.id) || supplementaryPlacementCreatesCycle(snapshot.videos, movingId, anchor.id)) continue;
      for (const position of ['before', 'after'] as const) candidates.push({ supplementary: { id: movingId, moduleId: section.moduleId, anchorId: anchor.id, position } });
    }
  }
  const remaining = snapshot.rows[sectionId].filter(row => !moving.has(row.id));
  return candidates.map(candidate => {
    const next = courseMapSnapshot(candidate.core ? moveLesson(snapshot.order, candidate.core) : snapshot.order,
      candidate.supplementary ? snapshot.videos.map(v => v.id === movingId ? { ...v, ...candidate.supplementary } : v) : snapshot.videos);
    const index = next.rows[sectionId].findIndex(row => moving.has(row.id));
    const before = remaining[index];
    const previous = remaining[index - 1];
    return { ...candidate, item, source: snapshot.label(item.sectionId), destination: snapshot.label(sectionId), sectionId,
      beforeRowId: before?.id ?? null, index,
      placement: before ? `Before “${before.title}”` : previous ? `After “${previous.title}” · end of section` : 'First lesson in this empty section',
      unchanged: Object.keys(snapshot.rows).every(id => snapshot.rows[id].map(r => r.id).join('|') === next.rows[id].map(r => r.id).join('|')),
      rows: next.rows, movingIds: [...moving] };
  });
}

export function closestDrop(candidates: DropProposal[], boundary: number) {
  return candidates.reduce<DropProposal | null>((best, candidate) => !best || Math.abs(candidate.index - boundary) < Math.abs(best.index - boundary) ? candidate : best, null);
}

// An explicit state machine makes a drop incapable of issuing a write.
export type MoveSession = { phase: 'idle' } | { phase: 'dragging'; id: string } | { phase: 'review' | 'saving'; proposal: DropProposal };
export type MoveEvent = { type: 'pick'; id: string } | { type: 'drop'; proposal: DropProposal | null } | { type: 'cancel' | 'confirm' | 'finish' };
export function moveSession(state: MoveSession, event: MoveEvent): MoveSession {
  if (event.type === 'pick' && state.phase === 'idle') return { phase: 'dragging', id: event.id };
  if (event.type === 'drop' && state.phase === 'dragging') return event.proposal && !event.proposal.unchanged ? { phase: 'review', proposal: event.proposal } : { phase: 'idle' };
  if (event.type === 'confirm' && state.phase === 'review') return { phase: 'saving', proposal: state.proposal };
  if (event.type === 'finish' || (event.type === 'cancel' && state.phase !== 'saving')) return { phase: 'idle' };
  return state;
}

export async function persistConfirmedMove(state: MoveSession, saveCore: (move: LessonMove) => Promise<boolean>, saveSupplementary: (move: SupplementaryMove) => Promise<boolean>) {
  if (state.phase !== 'saving') return false;
  return state.proposal.core ? saveCore(state.proposal.core) : saveSupplementary(state.proposal.supplementary!);
}
