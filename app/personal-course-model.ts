import catalog from './course-curriculum';
import { learningSections } from './learning-sections';
import { courseMapSnapshot, type MapRow } from './course-drop-model';
import { courseForOrder, defaultOrder, type CourseOrder } from './course-order-model';
import { withSupplementaryDefaults } from './supplementary-defaults';
import { supplementaryDescendants, youtubeId, type SupplementaryState, type SupplementaryVideo } from './supplementary-model';

export type Placement = { sectionId: string; beforeId: string | null };
type SavedPosition = Placement & { id: string; afterId: string | null };
type UndoPatch = { positions: SavedPosition[]; videos: SupplementaryVideo[]; archiveIds: string[] };
export type EditReceipt = { id: string; revision: number; affected: string[]; inverse: UndoPatch; undone?: boolean };
export type PersonalCourse = {
  version: 2; revision: number; groups: Record<string, string[]>;
  videos: SupplementaryVideo[]; itemRevisions: Record<string, number>; receipts: EditReceipt[];
};
export type CourseEdit =
  | ({ type: 'move'; id: string; withSupporting?: boolean } & Placement)
  | ({ type: 'add'; url: string; title: string; instructor: string } & Placement)
  | { type: 'edit'; id: string; title: string; instructor: string }
  | { type: 'archive'; id: string }
  | ({ type: 'restore'; id: string } & Placement)
  | { type: 'undo'; targetOperationId: string };
export type EditRequest = { operationId: string; revision: number; edit: CourseEdit };

const core = new Map(catalog.modules.flatMap(m => m.lessons).map(l => [l.id, l]));
const sectionById = new Map(learningSections.map(s => [s.id, s]));
const maxVideos = 500;
export class CourseEditError extends Error {
  constructor(message: string, public status = 400, public existingId?: string) { super(message); }
}

// Migration uses the exact legacy rendering order, including archived anchors.
// Neither legacy document is modified; it remains available for recovery/export.
export function migratePersonalCourse(order: CourseOrder = defaultOrder, supplementary: SupplementaryState = { version: 1, revision: 0, videos: [] }): PersonalCourse {
  const videos = withSupplementaryDefaults(supplementary).videos;
  const snapshot = courseMapSnapshot(order, videos.map(v => ({ ...v, archived: false })));
  const groups = Object.fromEntries(Object.entries(snapshot.rows).map(([id, rows]) => [id, rows.map(row => row.id)]));
  // Recover orphaned legacy entries into a valid section instead of losing them.
  const placed = new Set(Object.values(groups).flat());
  for (const video of videos) if (!placed.has(video.id)) {
    const section = learningSections.find(s => s.moduleId === video.moduleId) ?? learningSections[0];
    groups[section.id].push(video.id);
  }
  return { version: 2, revision: 0, groups, videos, itemRevisions: {}, receipts: [] };
}

export const publishedPersonalCourse = migratePersonalCourse();

export function parsePersonalCourse(value: unknown): PersonalCourse {
  if (!value || typeof value !== 'object') throw new Error('Your course arrangement could not be read.');
  const state = value as PersonalCourse;
  if (state.version !== 2 || !Number.isSafeInteger(state.revision) || state.revision < 0 ||
    !state.groups || typeof state.groups !== 'object' || Array.isArray(state.groups) ||
    !Object.values(state.groups).every(ids => Array.isArray(ids) && ids.every(id => typeof id === 'string')) ||
    !Array.isArray(state.videos) || !Array.isArray(state.receipts) || !state.itemRevisions || typeof state.itemRevisions !== 'object') throw new Error('Your course arrangement could not be read.');
  if (state.videos.some(v => !v || typeof v.id !== 'string' || typeof v.videoId !== 'string' || typeof v.title !== 'string' || typeof v.archived !== 'boolean')) throw new Error('Your video library could not be read.');
  return normalisePersonalCourse(state);
}

// New published lessons/defaults join their original section. Existing placements,
// including empty sections and archives, always win over default placement.
export function normalisePersonalCourse(state: PersonalCourse): PersonalCourse {
  const videos = withSupplementaryDefaults({ version: 1, revision: state.revision, videos: state.videos }).videos;
  const known = new Set([...core.keys(), ...videos.map(v => v.id)]);
  const seen = new Set<string>();
  const groups = Object.fromEntries(learningSections.map(s => [s.id, (state.groups[s.id] ?? []).filter(id => {
    if (!known.has(id) || seen.has(id)) return false;
    seen.add(id); return true;
  })]));
  const legacyOrder: CourseOrder = { version: 1, revision: 0, groups: Object.fromEntries(Object.entries(groups).map(([id, ids]) => [id, ids.filter(id => core.has(id))])) };
  const fallback = migratePersonalCourse(legacyOrder, { version: 1, revision: 0, videos });
  for (const [sectionId, ids] of Object.entries(fallback.groups)) {
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      if (seen.has(id)) continue;
      const nextId = ids.slice(index + 1).find(next => groups[sectionId].includes(next));
      groups[sectionId].splice(nextId ? groups[sectionId].indexOf(nextId) : groups[sectionId].length, 0, id);
      seen.add(id);
    }
  }
  return { ...state, groups, videos };
}

export function personalCourseSnapshot(state: PersonalCourse) {
  const videoById = new Map(state.videos.map(v => [v.id, v]));
  const rows: Record<string, MapRow[]> = {};
  const counts = new Map<string, number>();
  const locations = new Map<string, string>();
  for (const section of learningSections) {
    rows[section.id] = [];
    for (const id of state.groups[section.id] ?? []) {
      locations.set(id, section.moduleId);
      const video = videoById.get(id);
      if (video?.archived || (!core.has(id) && !video)) continue;
      const displayNumber = (counts.get(section.moduleId) ?? 0) + 1;
      counts.set(section.moduleId, displayNumber);
      rows[section.id].push({ id, title: core.get(id)?.title ?? video!.title, kind: core.has(id) ? 'core' : 'supplementary', moduleId: section.moduleId, sectionId: section.id, displayNumber });
    }
  }
  const order: CourseOrder = { version: 1, revision: state.revision, groups: Object.fromEntries(Object.entries(state.groups).map(([id, ids]) => [id, ids.filter(id => core.has(id))])) };
  const resolved = courseForOrder(order);
  const allRows = Object.values(rows).flat();
  const byId = new Map(allRows.map(row => [row.id, row]));
  const videos = state.videos.map(v => ({ ...v, moduleId: locations.get(v.id) ?? v.moduleId }));
  const label = (sectionId: string) => {
    const section = sectionById.get(sectionId)!;
    const courseModule = catalog.modules.find(m => m.id === section.moduleId)!;
    return `${courseModule.path === 'Professional' ? 'Advanced' : courseModule.path} · ${courseModule.title} · ${section.title}`;
  };
  return { ...resolved, order, rows, allRows, byId, videos, label };
}

export function relatedVideoIds(state: PersonalCourse, id: string): string[] {
  return supplementaryDescendants(state.videos, [id]).map(v => v.id).filter(child => child !== id);
}

function positionOf(state: PersonalCourse, id: string): SavedPosition {
  const entry = Object.entries(state.groups).find(([, ids]) => ids.includes(id));
  if (!entry) throw new CourseEditError('This video is no longer in your course. Refresh and try again.', 409);
  const [sectionId, ids] = entry, index = ids.indexOf(id);
  return { id, sectionId, beforeId: ids[index + 1] ?? null, afterId: ids[index - 1] ?? null };
}

export function placeVideos(state: PersonalCourse, ids: string[], placement: Placement): PersonalCourse {
  if (!sectionById.has(placement.sectionId)) throw new CourseEditError('Choose a destination section.');
  if (placement.beforeId !== null && (ids.includes(placement.beforeId) || !state.groups[placement.sectionId]?.includes(placement.beforeId))) throw new CourseEditError('The destination changed. Choose a position again.', 409);
  const moving = new Set(ids);
  const groups = Object.fromEntries(Object.entries(state.groups).map(([key, group]) => [key, group.filter(id => !moving.has(id))]));
  const destination = groups[placement.sectionId];
  destination.splice(placement.beforeId === null ? destination.length : destination.indexOf(placement.beforeId), 0, ...ids);
  return { ...state, groups };
}

function validateDetails(title: unknown, instructor: unknown) {
  if (typeof title !== 'string' || !title.trim() || title.trim().length > 240 || typeof instructor !== 'string' || instructor.trim().length > 160) throw new CourseEditError('Enter a video title (up to 240 characters) and a channel (up to 160 characters).');
  return { title: title.trim(), instructor: instructor.trim() };
}

export function validateEditRequest(value: unknown): EditRequest {
  if (!value || typeof value !== 'object') throw new CourseEditError('Invalid change.');
  const request = value as EditRequest;
  if (typeof request.operationId !== 'string' || !/^[a-zA-Z0-9-]{16,80}$/.test(request.operationId) || !Number.isSafeInteger(request.revision) || request.revision < 0 || !request.edit || typeof request.edit !== 'object') throw new CourseEditError('Invalid change. Refresh your course and try again.');
  const edit = request.edit;
  if (!['add', 'move', 'edit', 'archive', 'restore', 'undo'].includes(edit.type)) throw new CourseEditError('Unknown course action.');
  if ('id' in edit && (typeof edit.id !== 'string' || edit.id.length > 100)) throw new CourseEditError('Invalid video.');
  if (['move', 'edit', 'archive', 'restore'].includes(edit.type) && !('id' in edit)) throw new CourseEditError('Choose a video.');
  if (edit.type === 'add' || edit.type === 'move' || edit.type === 'restore') {
    if (typeof edit.sectionId !== 'string' || !(edit.beforeId === null || typeof edit.beforeId === 'string')) throw new CourseEditError('Choose a destination and position.');
  }
  if (edit.type === 'move' && edit.withSupporting !== undefined && typeof edit.withSupporting !== 'boolean') throw new CourseEditError('Invalid move.');
  if (edit.type === 'add' || edit.type === 'edit') validateDetails(edit.title, edit.instructor);
  if (edit.type === 'add' && (typeof edit.url !== 'string' || !youtubeId(edit.url))) throw new CourseEditError('Paste a valid YouTube video link.');
  if (edit.type === 'undo' && typeof edit.targetOperationId !== 'string') throw new CourseEditError('Choose a change to undo.');
  return request;
}

export function applyCourseEdit(input: PersonalCourse, request: EditRequest, now = new Date().toISOString()): PersonalCourse {
  validateEditRequest(request);
  const state = normalisePersonalCourse(input);
  if (state.receipts.some(r => r.id === request.operationId)) return state;
  if (request.revision !== state.revision) throw new CourseEditError('Your course changed in another tab or device. Review the latest arrangement and try again.', 409);
  const edit = request.edit;
  const inverse: UndoPatch = { positions: [], videos: [], archiveIds: [] };
  let next = state;
  let affected: string[] = [];
  const existing = 'id' in edit ? state.videos.find(v => v.id === edit.id) : undefined;
  if ('id' in edit && !existing && !core.has(edit.id)) throw new CourseEditError('This video is no longer available.', 404);
  if (['archive', 'restore', 'edit'].includes(edit.type) && !existing) throw new CourseEditError('Published lesson details cannot be changed. You can move the lesson in your course.');
  if (edit.type === 'move') {
    if (existing?.archived) throw new CourseEditError('Restore this video before moving it.');
    const selected = new Set([edit.id, ...(edit.withSupporting ? relatedVideoIds(state, edit.id) : [])]);
    affected = Object.values(state.groups).flat().filter(id => selected.has(id));
    inverse.positions = affected.map(id => positionOf(state, id));
    next = placeVideos(state, affected, edit);
  } else if (edit.type === 'add') {
    const videoId = youtubeId(edit.url)!;
    const duplicate = state.videos.find(v => v.videoId === videoId);
    const coreDuplicate = [...core.values()].find(l => l.videoId === videoId);
    if (duplicate || coreDuplicate) throw new CourseEditError('This video is already in your course. Open, move, or restore its existing entry.', 409, duplicate?.id ?? coreDuplicate!.id);
    if (state.videos.length >= maxVideos) throw new CourseEditError('Your library has reached its 500-video limit.');
    const id = `personal-${request.operationId}`;
    if (state.videos.some(v => v.id === id)) throw new CourseEditError('This addition was already saved. Refresh your course.', 409, id);
    const section = sectionById.get(edit.sectionId);
    if (!section) throw new CourseEditError('Choose a destination section.');
    const video: SupplementaryVideo = { id, videoId, ...validateDetails(edit.title, edit.instructor), moduleId: section.moduleId, anchorId: '', position: 'after', archived: false, placementRevision: 2, updatedAt: now };
    affected = [id]; inverse.archiveIds = [id];
    next = placeVideos({ ...state, videos: [...state.videos, video] }, [id], edit);
  } else if (edit.type === 'edit' || edit.type === 'archive' || edit.type === 'restore') {
    affected = [existing!.id]; inverse.videos = [existing!];
    next = { ...state, videos: state.videos.map(v => v.id !== existing!.id ? v : { ...v, ...(edit.type === 'edit' ? validateDetails(edit.title, edit.instructor) : { archived: edit.type === 'archive' }), updatedAt: now }) };
    if (edit.type === 'restore') {
      inverse.positions = [positionOf(state, edit.id)];
      next = placeVideos(next, [edit.id], edit);
    }
  } else if (edit.type === 'undo') {
    const receipt = state.receipts.find(r => r.id === edit.targetOperationId);
    if (!receipt || receipt.undone) throw new CourseEditError('This change is no longer available to undo.', 409);
    if (receipt.affected.some(id => state.itemRevisions[id] !== receipt.revision)) throw new CourseEditError('This video changed again. Move it to your preferred position instead of undoing an older change.', 409);
    affected = receipt.affected;
    const old = new Map(receipt.inverse.videos.map(v => [v.id, v]));
    next = { ...state, videos: state.videos.map(v => old.get(v.id) ?? (receipt.inverse.archiveIds.includes(v.id) ? { ...v, archived: true, updatedAt: now } : v)) };
    // Restore in reverse order so consecutive moved entries find their neighbour.
    for (const position of [...receipt.inverse.positions].reverse()) {
      const destination = next.groups[position.sectionId].filter(id => id !== position.id);
      const beforeId = position.beforeId && destination.includes(position.beforeId) ? position.beforeId : position.afterId && destination.includes(position.afterId) ? destination[destination.indexOf(position.afterId) + 1] ?? null : null;
      next = placeVideos(next, [position.id], { sectionId: position.sectionId, beforeId });
    }
    next = { ...next, receipts: next.receipts.map(r => r.id === receipt.id ? { ...r, undone: true } : r) };
  }
  const revision = state.revision + 1;
  return { ...next, revision, itemRevisions: { ...state.itemRevisions, ...Object.fromEntries(affected.map(id => [id, revision])) }, receipts: [...next.receipts, { id: request.operationId, revision, affected, inverse, ...(edit.type === 'undo' ? { undone: true } : {}) }].slice(-50) };
}

export function previewMove(state: PersonalCourse, id: string, placement: Placement, withSupporting = false) {
  const selected = new Set([id, ...(withSupporting ? relatedVideoIds(state, id) : [])]);
  const ids = Object.values(state.groups).flat().filter(value => selected.has(value));
  return personalCourseSnapshot(placeVideos(state, ids, placement));
}

export function existingVideoId(state: PersonalCourse, url: string) {
  const id = youtubeId(url);
  return state.videos.find(v => v.videoId === id)?.id ?? [...core.values()].find(l => l.videoId === id)?.id;
}

export function savedPlacement(state: PersonalCourse, id: string): Placement {
  const position = positionOf(state, id);
  const visible = new Set(personalCourseSnapshot(state).allRows.map(r => r.id));
  const ids = state.groups[position.sectionId];
  return { sectionId: position.sectionId, beforeId: ids.slice(ids.indexOf(id) + 1).find(next => visible.has(next)) ?? null };
}
