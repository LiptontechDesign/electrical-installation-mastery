'use client';
import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DndContext, DragOverlay, KeyboardSensor, MeasuringStrategy, MouseSensor, TouchSensor, rectIntersection,
  useDraggable, useDroppable, useSensor, useSensors, type DragMoveEvent, type KeyboardCoordinateGetter, type CollisionDetection } from '@dnd-kit/core';
import { CheckCircle2, GripVertical, PlayCircle } from 'lucide-react';
import { useCourseOrder } from './course-order';
import { useSupplementary } from './supplementary-videos';
import { closestDrop, courseMapSnapshot, dropCandidates, moveSession, movingSequence, persistConfirmedMove,
  type DropProposal, type MapRow, type MoveSession } from './course-drop-model';
import { MoveConfirmationDialog } from './move-confirmation-dialog';

type DragState = { rows: Record<string, MapRow[]>; activeId: string | null; movingIds: Set<string>; proposal: DropProposal | null; enabled: boolean; busy: boolean };
const DragContext = createContext<DragState>({ rows: {}, activeId: null, movingIds: new Set(), proposal: null, enabled: false, busy: false });
const proposalKey = (p: DropProposal | null) => p ? JSON.stringify(p.core ?? p.supplementary) : '';

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

export function CourseDragProvider({ children, onLocate }: { children: ReactNode; onLocate: (moduleId: string) => void }) {
  const core = useCourseOrder();
  const supplementary = useSupplementary();
  const videos = supplementary?.videos;
  const snapshot = useMemo(() => courseMapSnapshot(core.order, videos ?? []), [core.order, videos]);
  const [session, setSession] = useState<MoveSession>({ phase: 'idle' });
  const sessionRef = useRef(session);
  const [proposal, setProposal] = useState<DropProposal | null>(null);
  const proposalRef = useRef<DropProposal | null>(null);
  const [notice, setNotice] = useState('');
  const original = useRef(snapshot);
  const candidates = useRef(new Map<string, DropProposal[]>());
  const positions = useRef(new Map<string, DOMRect>());
  const shell = useRef<HTMLDivElement>(null);
  const pickup = useRef<HTMLElement | null>(null);
  const activeId = session.phase === 'dragging' ? session.id : session.phase === 'idle' ? null : session.proposal.item.id;
  const movingIds = useMemo(() => activeId ? movingSequence(snapshot, activeId) : new Set<string>(), [snapshot, activeId]);
  const busy = session.phase !== 'idle';
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 260, tolerance: 7 } }),
    useSensor(KeyboardSensor, { coordinateGetter: keyboardCoordinates, scrollBehavior: 'auto' }));

  function transition(next: MoveSession) { sessionRef.current = next; setSession(next); }
  function rememberPositions() {
    positions.current = new Map(Array.from(shell.current?.querySelectorAll<HTMLElement>('[data-course-row]') ?? []).map(node => [node.dataset.courseRow!, node.getBoundingClientRect()]));
  }
  function preview(next: DropProposal | null) {
    if (proposalKey(next) === proposalKey(proposalRef.current)) return;
    rememberPositions(); proposalRef.current = next; setProposal(next);
  }
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    for (const node of shell.current?.querySelectorAll<HTMLElement>('[data-course-row]') ?? []) {
      const before = positions.current.get(node.dataset.courseRow!);
      const after = node.getBoundingClientRect();
      if (!before || Math.abs(before.top - after.top) < 1) continue;
      node.getAnimations().forEach(animation => animation.cancel());
      node.animate([{ transform: `translateY(${before.top - after.top}px)` }, { transform: 'translateY(0)' }], { duration: 180, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }
    positions.current.clear();
  }, [proposal]);
  function restoreFocus(id: string | null = activeId) {
    const current = proposalRef.current?.rows ? Object.values(proposalRef.current.rows).flat().find(row => row.id === id) : snapshot.byId.get(id ?? '');
    if (current) onLocate(current.moduleId);
    requestAnimationFrame(() => {
      const handle = Array.from(shell.current?.querySelectorAll<HTMLButtonElement>('[data-drag-handle]') ?? []).find(node => node.dataset.dragHandle === id);
      const details = handle?.closest('details'); if (details) details.open = true;
      (handle ?? pickup.current)?.focus({ preventScroll: true });
      handle?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    });
  }
  function cancel() { preview(null); transition(moveSession(sessionRef.current, { type: 'cancel' })); setNotice('Move cancelled. Course order unchanged.'); restoreFocus(); }

  function destination(event: DragMoveEvent) {
    if (sessionRef.current.phase !== 'dragging') return;
    const target = event.over?.data.current;
    if (!target || target.type === 'module' || target.type === 'path') { preview(null); return; }
    if (target.type === 'section' && !target.isExpanded()) { preview(null); return; }
    const id = sessionRef.current.id;
    const moving = movingSequence(original.current, id);
    if (target.type === 'row' && moving.has(target.rowId)) return;
    const sectionId = target.sectionId as string;
    let choices = candidates.current.get(sectionId);
    if (!choices) { choices = dropCandidates(original.current, id, sectionId); candidates.current.set(sectionId, choices); }
    const rows = (proposalRef.current?.rows ?? original.current.rows)[sectionId]?.filter(row => !moving.has(row.id)) ?? [];
    let boundary = target.type === 'end' ? rows.length : 0;
    if (target.type === 'row') {
      const index = rows.findIndex(row => row.id === target.rowId);
      const activator = event.activatorEvent;
      const startY = 'touches' in activator ? (activator as TouchEvent).touches[0]?.clientY : 'clientY' in activator ? (activator as MouseEvent).clientY : undefined;
      const y = startY === undefined ? (event.active.rect.current.translated?.top ?? 0) + (event.active.rect.current.translated?.height ?? 0) / 2 : startY + event.delta.y;
      boundary = Math.max(0, index) + Number(y > event.over!.rect.top + event.over!.rect.height / 2);
    }
    const next = closestDrop(choices, boundary);
    preview(next);
    if (!next) setNotice('This section needs a core lesson before a supplementary video can be placed here.');
    else setNotice(`${next.destination}. ${next.placement}${next.item.kind === 'core' ? '. Core lessons move at lesson boundaries with their supporting videos.' : ''}`);
  }

  async function confirm() {
    if (sessionRef.current.phase !== 'review') return;
    if (original.current.order !== snapshot.order || original.current.videos.map(v => JSON.stringify(v)).join() !== snapshot.videos.map(v => JSON.stringify(v)).join()) {
      preview(null); transition({ phase: 'idle' }); setNotice('The shared course changed while you were reviewing. Review a new move using the latest order.'); restoreFocus(); return;
    }
    const saving = moveSession(sessionRef.current, { type: 'confirm' });
    transition(saving);
    const ok = await persistConfirmedMove(saving, core.save, move => supplementary!.move(move));
    if (ok) restoreFocus();
    preview(null); transition({ phase: 'idle' });
    setNotice(ok ? 'Video moved. The shared course has been updated.' : 'Move could not be confirmed. The latest available shared order is shown. Review the error and try again.');
    if (!ok) restoreFocus();
  }

  const item = activeId ? snapshot.byId.get(activeId) ?? proposal?.item : null;
  return <DragContext.Provider value={{ rows: proposal?.rows ?? snapshot.rows, activeId, movingIds, proposal, enabled: core.ready && Boolean(supplementary?.ready), busy }}>
    <DndContext sensors={sensors} collisionDetection={collision} measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      autoScroll={{ threshold: { x: 0, y: .16 }, acceleration: 8, canScroll: element => element.classList.contains('course-map') }}
      accessibility={{ restoreFocus: false, screenReaderInstructions: { draggable: 'Press Space to pick up. Use Up and Down for positions, Left and Right for sections or modules. Space opens a move review. Escape cancels. Only Confirm move saves.' },
        announcements: { onDragStart: ({ active }) => `Picked up ${snapshot.byId.get(String(active.id))?.title}. Use arrows to choose a destination.`, onDragOver: () => '', onDragEnd: () => 'Drag finished. Review the proposed move or cancel.', onDragCancel: () => 'Move cancelled. Course unchanged.' } }}
      onDragStart={({ active }) => {
        original.current = snapshot; candidates.current.clear(); pickup.current = document.activeElement as HTMLElement;
        transition(moveSession(sessionRef.current, { type: 'pick', id: String(active.id) })); setNotice('Choose a destination. Release to review; Escape cancels.');
      }} onDragMove={destination} onDragOver={destination} onDragCancel={cancel}
      onDragEnd={({ over }) => {
        const next = over && !['module', 'path'].includes(over.data.current?.type) ? proposalRef.current : null;
        const state = moveSession(sessionRef.current, { type: 'drop', proposal: next });
        transition(state);
        if (state.phase === 'idle') { preview(null); setNotice('No move applied. Course order unchanged.'); restoreFocus(); }
      }}>
      <div ref={shell} className="course-drag-shell" data-moving={busy} onClickCapture={event => {
        if (busy && !(event.target as HTMLElement).closest('.course-drag-dialog')) { event.preventDefault(); event.stopPropagation(); }
      }}>{children}
        <div className="course-drag-notice" role="status" aria-live="polite" aria-atomic="true">{notice}</div>
        {(core.error || supplementary?.error) && <div className="course-drag-error" role="alert">{core.error || supplementary?.error}</div>}
        {(session.phase === 'review' || session.phase === 'saving') && <MoveConfirmationDialog proposal={session.proposal} busy={session.phase === 'saving'} onCancel={cancel} onConfirm={() => void confirm()} />}
      </div>
      {typeof document !== 'undefined' && document.body && createPortal(<DragOverlay style={{ pointerEvents: 'none' }} dropAnimation={null}>{session.phase === 'dragging' && item ? <div className={`course-drag-overlay ${item.kind}`}><GripVertical size={20} /><span><strong>{item.title}</strong><small>{item.kind === 'core' ? 'Core lesson' : 'Supplementary video'} · Release to review</small></span></div> : null}</DragOverlay>, document.body)}
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

export function CourseSectionRows({ sectionId, renderCore }: { sectionId: string; renderCore: (id: string) => ReactNode }) {
  const { rows, busy } = useContext(DragContext);
  const supplementary = useSupplementary();
  const { setNodeRef } = useDroppable({ id: `end:${sectionId}`, data: { type: 'end', sectionId }, disabled: !busy });
  return <>{(rows[sectionId] ?? []).map(row => {
    const video = supplementary?.videos.find(v => v.id === row.id);
    const watched = Boolean(video && supplementary?.watched.includes(video.videoId));
    return <CourseDraggableRow key={row.id} row={row}>
    {row.kind === 'core' ? renderCore(row.id) : <button className="supp-video-row" type="button" onClick={() => {
      if (video) supplementary?.open(video);
    }}>{watched ? <CheckCircle2 size={17} /> : <PlayCircle size={17} />}<span><strong>{row.title}</strong><small>Supplementary · {watched ? 'Watched' : 'Not watched'} · {video?.instructor || 'YouTube'}</small></span></button>}
  </CourseDraggableRow>;
  })}<div ref={setNodeRef} data-course-end={sectionId} className="course-section-drop-end">{busy ? (rows[sectionId]?.length ? 'End of section' : 'Empty section · core lessons only') : null}</div></>;
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
    {children}
  </div>;
}
