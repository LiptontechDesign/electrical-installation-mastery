'use client';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, DragOverlay, KeyboardSensor, MeasuringStrategy, MouseSensor, TouchSensor, rectIntersection,
  useDraggable, useDroppable, useSensor, useSensors, type DragMoveEvent, type KeyboardCoordinateGetter, type CollisionDetection } from '@dnd-kit/core';
import { VideoStudyContext } from './video-study-tools';
import { CheckCircle2, GripVertical, PlayCircle, Bookmark } from 'lucide-react';
import { useCourseOrder } from './course-order';
import { useSupplementary } from './supplementary-videos';
import { useCourseAccount } from './course-account';
import { VideoActions } from './course-editor-actions';
import { previewMove, type Placement } from './personal-course-model';
import type { MapRow } from './course-drop-model';

type Proposal = Placement & { rows: Record<string, MapRow[]>; movingIds: string[] };
type DragState = { rows: Record<string, MapRow[]>; activeId: string | null; movingIds: Set<string>; proposal: Proposal | null; enabled: boolean; busy: boolean };
const DragContext = createContext<DragState>({ rows: {}, activeId: null, movingIds: new Set(), proposal: null, enabled: false, busy: false });
const keyboardCoordinates: KeyboardCoordinateGetter = (event, { currentCoordinates, context }) => {
  if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.code)) return;
  event.preventDefault();
  const targets = [...context.droppableContainers.getEnabled()].filter(target => {
    const node = target.node.current;
    return node && node.getClientRects().length && !node.closest('[data-drag-placeholder="true"]') && !node.closest('details:not([open])');
  }).sort((a, b) => a.node.current!.getBoundingClientRect().top - b.node.current!.getBoundingClientRect().top);
  const sectionsOnly = event.code === 'ArrowLeft' || event.code === 'ArrowRight';
  const filtered = sectionsOnly ? targets.filter(t => t.data.current?.type !== 'row') : targets;
  const direction = event.code === 'ArrowDown' || event.code === 'ArrowRight' ? 1 : -1;
  const current = context.over?.id;
  const currentY = context.collisionRect ? context.collisionRect.top + context.collisionRect.height / 2 : currentCoordinates.y;
  const index = filtered.findIndex(t => t.id === current);
  const target = index >= 0 ? filtered[index + direction] : (direction > 0 ? filtered.find(t => t.node.current!.getBoundingClientRect().top > currentY + 1) : filtered.findLast(t => t.node.current!.getBoundingClientRect().bottom < currentY - 1));
  const rect = target?.node.current?.getBoundingClientRect();
  if (!rect || !context.collisionRect) return;
  return { x: currentCoordinates.x + rect.left + rect.width / 2 - (context.collisionRect.left + context.collisionRect.width / 2),
    y: currentCoordinates.y + rect.top + rect.height * (direction > 0 ? .75 : .25) - currentY };
};

const collision: CollisionDetection = args => {
  if (args.pointerCoordinates) {
    // Hit-test the painted hierarchy, not stale pre-scroll rectangles. This also
    // excludes rows hidden inside closed details, which still have mounted refs.
    const element = document.elementFromPoint(args.pointerCoordinates.x, args.pointerCoordinates.y);
    const row = element?.closest<HTMLElement>('[data-course-row]');
    const end = element?.closest<HTMLElement>('[data-course-end]');
    const section = element?.closest<HTMLElement>('[data-course-section]');
    const path = element?.closest<HTMLElement>('[data-course-path]');
    const courseModule = element?.closest<HTMLElement>('[data-course-module]');
    const id = row ? `row:${row.dataset.courseRow}` : end ? `end:${end.dataset.courseEnd}` : section ? `section:${section.dataset.courseSection}` : path ? `path:${path.dataset.coursePath}` : courseModule ? `module:${courseModule.dataset.courseModule}` : null;
    const container = args.droppableContainers.find(c => c.id === id);
    return container ? [{ id: container.id, data: { droppableContainer: container, value: 1 } }] : [];
  }
  const visible = args.droppableContainers.filter(c => c.node.current?.getClientRects().length && !c.node.current.closest('details:not([open])'));
  const hits = rectIntersection({ ...args, droppableContainers: visible });
  // Prefer a precise row or section target to its containing module.
  const rank = (id: string | number) => ({ row: 0, end: 0, section: 1, module: 2, path: 2 })[args.droppableContainers.find(c => c.id === id)?.data.current?.type as 'row'] ?? 3;
  return hits.sort((a, b) => rank(a.id) - rank(b.id));
};

export function CourseDragProvider({ children, onLocate, organizing = false }: { children: ReactNode; organizing?: boolean; onLocate: (moduleId: string) => void }) {
  const editor = useCourseOrder();
  const { user } = useCourseAccount();
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const proposalRef = useRef<Proposal | null>(null);
  const original = useRef(editor.state);
  const [notice, setNotice] = useState('');
  const busy = Boolean(activeId) || editor.busy;
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 260, tolerance: 7 } }),
    useSensor(KeyboardSensor, { coordinateGetter: keyboardCoordinates, scrollBehavior: 'auto' }));
  const setPreview = (next: Proposal | null) => { proposalRef.current = next; setProposal(next); };
  function destination(event: DragMoveEvent) {
    const id = activeRef.current;
    const target = event.over?.data.current;
    if (!id || !target || ['module', 'path'].includes(target.type) || (target.type === 'section' && !target.isExpanded())) { setPreview(null); return; }
    if (target.rowId === id) return;
    const sectionId = target.sectionId as string;
    const rows = (proposalRef.current?.rows ?? editor.rows)[sectionId]?.filter(row => row.id !== id) ?? [];
    let boundary = target.type === 'end' ? rows.length : 0;
    if (target.type === 'row') {
      const index = rows.findIndex(row => row.id === target.rowId);
      const eventStart = event.activatorEvent;
      const startY = 'touches' in eventStart ? (eventStart as TouchEvent).touches[0]?.clientY : 'clientY' in eventStart ? (eventStart as MouseEvent).clientY : undefined;
      const y = startY === undefined ? (event.active.rect.current.translated?.top ?? 0) + (event.active.rect.current.translated?.height ?? 0) / 2 : startY + event.delta.y;
      boundary = Math.max(0, index) + Number(y > event.over!.rect.top + event.over!.rect.height / 2);
    }
    const beforeId = rows[boundary]?.id ?? null;
    if (proposalRef.current?.sectionId === sectionId && proposalRef.current.beforeId === beforeId) return;
    try {
      const next = previewMove(original.current, id, { sectionId, beforeId });
      setPreview({ sectionId, beforeId, rows: next.rows, movingIds: [id] });
      setNotice('Place in ' + next.label(sectionId) + (beforeId ? ' before ' + next.byId.get(beforeId)?.title : ' at the end') + '. Release to save.');
    } catch { setPreview(null); }
  }
  const item = activeId ? editor.byId.get(activeId) : null;
  return <DragContext.Provider value={{ rows: proposal?.rows ?? editor.rows, activeId, movingIds: new Set(activeId ? [activeId] : []), proposal, enabled: Boolean(user) && organizing && editor.ready && !editor.busy, busy }}>
    <DndContext sensors={sensors} collisionDetection={collision} measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      autoScroll={{ threshold: { x: 0, y: .16 }, acceleration: 8, canScroll: element => element.classList.contains('course-map') }}
      accessibility={{ restoreFocus: false, screenReaderInstructions: { draggable: 'Press Space to pick up, arrow keys to choose a position, Space to move, or Escape to cancel. You can also use the video actions menu and Move to.' }, announcements: { onDragStart: ({ active }) => 'Picked up ' + editor.byId.get(String(active.id))?.title, onDragOver: () => '', onDragEnd: () => 'Checking the new position.', onDragCancel: () => 'Move cancelled.' } }}
      onDragStart={({ active }) => { original.current = editor.state; activeRef.current = String(active.id); setActiveId(String(active.id)); setPreview(null); setNotice('Choose a position. Escape cancels.'); }}
      onDragMove={destination} onDragOver={destination}
      onDragCancel={() => { const id = activeRef.current; activeRef.current = null; setActiveId(null); setPreview(null); setNotice('Move cancelled.'); requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('[data-drag-handle="' + id + '"]')?.focus()); }}
      onDragEnd={({ over }) => {
        const id = activeRef.current;
        const next = over && !['module', 'path'].includes(over.data.current?.type) ? proposalRef.current : null;
        activeRef.current = null; setActiveId(null); setPreview(null); setNotice('');
        if (!id || !next) return;
        if (original.current.revision !== editor.state.revision) { editor.openEditor({ type: 'move', id }); return; }
        if (Object.keys(editor.rows).every(key => editor.rows[key].map(row => row.id).join() === next.rows[key].map(row => row.id).join())) return;
        void editor.commit({ type: 'move', id, sectionId: next.sectionId, beforeId: next.beforeId }).then(result => {
          if (!result.ok) { editor.openEditor({ type: 'move', id, destination: { sectionId: next.sectionId, beforeId: next.beforeId } }); return; }
          const moved = next.rows[next.sectionId].find(row => row.id === id);
          if (moved) onLocate(moved.moduleId);
        });
      }}>
      <div className="course-drag-shell" data-moving={busy} onClickCapture={event => { if (activeId) { event.preventDefault(); event.stopPropagation(); } }}>{children}<span className="editor-sr-only" role="status" aria-live="polite">{notice}</span></div>
      {typeof document !== 'undefined' && document.body && createPortal(<DragOverlay style={{ pointerEvents: 'none' }} dropAnimation={null}>{item ? <div className="course-drag-overlay"><GripVertical size={17}/><span><strong>{item.title}</strong><small>Release to move · Undo available</small></span></div> : null}</DragOverlay>, document.body)}
    </DndContext>
  </DragContext.Provider>;
}

export function CourseDragModule({ id, expanded, onExpand, children }: { id: string; expanded: boolean; onExpand: () => void; children: ReactNode }) {
  const { busy } = useContext(DragContext);
  const { setNodeRef, isOver } = useDroppable({ id: `module:${id}`, data: { type: 'module' }, disabled: !busy || expanded });
  useEffect(() => {
    if (!isOver || expanded) return;
    const timer = window.setTimeout(onExpand, 650);
    return () => window.clearTimeout(timer);
  }, [isOver, expanded, onExpand]);
  return <div ref={setNodeRef} data-course-module={id} className={isOver ? 'course-drag-module target' : 'course-drag-module'}>{children}</div>;
}

export function CourseDragSection({ id, children }: { id: string; children: ReactNode }) {
  const { busy, proposal } = useContext(DragContext);
  const host = useRef<HTMLDivElement | null>(null);
  const { setNodeRef, isOver } = useDroppable({ id: `section:${id}`, data: { type: 'section', sectionId: id, isExpanded: () => Boolean(host.current?.querySelector('details')?.open) }, disabled: !busy });
  useEffect(() => {
    const details = host.current?.querySelector('details');
    if (!isOver || !details || details.open) return;
    const timer = window.setTimeout(() => { details.open = true; }, 650);
    return () => window.clearTimeout(timer);
  }, [isOver]);
  return <div ref={node => { host.current = node; setNodeRef(node); }} data-course-section={id} className={`course-drag-section ${proposal?.sectionId === id || isOver ? 'target' : ''}`}>{children}</div>;
}

export function CourseDragPath({ id, selected, onSelect, children }: { id: string; selected: boolean; onSelect: () => void; children: ReactNode }) {
  const { busy } = useContext(DragContext);
  const { setNodeRef, isOver } = useDroppable({ id: `path:${id}`, data: { type: 'path' }, disabled: !busy || selected });
  useEffect(() => {
    if (!isOver || selected) return;
    const timer = window.setTimeout(onSelect, 650);
    return () => window.clearTimeout(timer);
  }, [isOver, selected, onSelect]);
  return <button ref={setNodeRef} type="button" data-course-path={id} className={selected ? 'active' : isOver ? 'course-path-target' : ''} aria-pressed={selected} onClick={onSelect}>{children}</button>;
}

export function CourseSectionRows({ sectionId, renderCore, visibleIds }: { visibleIds?: ReadonlySet<string>; sectionId: string; renderCore: (id: string, displayNumber: number) => ReactNode }) {
  const { user } = useCourseAccount();
  const { rows, busy } = useContext(DragContext);
  const study = useContext(VideoStudyContext);
  const supplementary = useSupplementary();
  const { setNodeRef } = useDroppable({ id: `end:${sectionId}`, data: { type: 'end', sectionId }, disabled: !busy });
  return <>{(rows[sectionId] ?? []).filter(row => !visibleIds || visibleIds.has(row.id)).map(row => {
    const video = supplementary?.videos.find(v => v.id === row.id);
    const watched = Boolean(video && supplementary?.watched.includes(video.videoId));
    return <CourseDraggableRow key={row.id} row={row}>
    {row.kind === 'core' ? renderCore(row.id, row.displayNumber) : <button className={supplementary?.selected?.id === row.id ? "supp-video-row active" : "supp-video-row"} aria-current={supplementary?.selected?.id === row.id ? "page" : undefined} type="button" onClick={() => {
      if (video) supplementary?.open(video);
    }}>{watched ? <CheckCircle2 size={17} /> : <PlayCircle size={17} />}<span><strong>L{String(row.displayNumber).padStart(2, '0')} · {row.title}</strong><small className="lesson-row-progress">{supplementary?.selected?.id === row.id && <b>Watching now</b>}Supplementary · {user ? (watched ? 'Watched · ' : 'Not watched · ') : ''}{video?.instructor || 'YouTube'}</small></span>{video && study.savedVideos.includes(video.videoId) && <span className="lesson-row-state"><Bookmark size={14} fill="currentColor" aria-label="Saved"/></span>}</button>}
  </CourseDraggableRow>;
  })}<div ref={setNodeRef} data-course-end={sectionId} className="course-section-drop-end">{busy ? (rows[sectionId]?.length ? 'End of section' : 'Place as the first video') : null}</div></>;
}

function CourseDraggableRow({ row, children }: { row: MapRow; children: ReactNode }) {
  const { activeId, movingIds, enabled, busy, proposal } = useContext(DragContext);
  const moving = movingIds.has(row.id);
  const { attributes, listeners, setNodeRef, setActivatorNodeRef } = useDraggable({ id: row.id, disabled: !enabled || (busy && activeId !== row.id) });
  const drop = useDroppable({ id: `row:${row.id}`, data: { type: 'row', rowId: row.id, sectionId: row.sectionId }, disabled: !busy });
  const firstMoving = proposal && proposal.rows[proposal.sectionId].find(r => proposal.movingIds.includes(r.id))?.id === row.id;
  return <div ref={node => { setNodeRef(node); drop.setNodeRef(node); }} data-course-row={row.id} data-drag-placeholder={moving}
    className={`course-draggable-row ${row.kind} ${moving ? 'is-moving' : ''}`}>
    {firstMoving && <span className="course-insertion-line" aria-hidden="true"><span>Place here</span></span>}
    <button ref={setActivatorNodeRef} {...attributes} {...listeners} type="button" className="course-drag-handle" data-drag-handle={row.id}
      aria-label={`Move ${row.title}`} disabled={!enabled || (busy && activeId !== row.id)} onClick={event => { event.preventDefault(); event.stopPropagation(); }}><GripVertical size={18} /></button>
    {children}<VideoActions id={row.id}/>
  </div>;
}
