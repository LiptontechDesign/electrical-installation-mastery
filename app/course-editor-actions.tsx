'use client';
import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Archive, ArrowRightLeft, MoreHorizontal, MoreVertical, Pencil, Plus, Trash2, Undo2 } from 'lucide-react';
import { useCourseOrder } from './course-order';
import { useCourseAccount } from './course-account';
import { savedPlacement } from './personal-course-model';

export function VideoActions({ id }: { id: string }) {
  const { user } = useCourseAccount();
  const editor = useCourseOrder();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const row = editor.byId.get(id);
  const video = editor.videos.find(v => v.id === id);
  const title = row?.title ?? video?.title ?? 'video';
  const close = (focus = true) => { setOpen(false); if (focus) trigger.current?.focus(); };
  useEffect(() => {
    if (!open) return;
    menu.current?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    const outside = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node) && !trigger.current?.contains(event.target as Node)) setOpen(false); };
    const scroll = (event: Event) => {
      if (menu.current?.contains(event.target as Node)) return;
      const rect = trigger.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({ left: Math.max(8, Math.min(window.innerWidth - 220, rect.right - 212)), top: rect.bottom + 220 > window.innerHeight ? Math.max(8, rect.top - 208) : Math.max(8, rect.bottom + 4) });
    };
    document.addEventListener('pointerdown', outside);
    window.addEventListener('resize', scroll);
    window.addEventListener('scroll', scroll, true);
    return () => { document.removeEventListener('pointerdown', outside); window.removeEventListener('resize', scroll); window.removeEventListener('scroll', scroll, true); };
  }, [open]);
  if (!user || (!row && !video)) return null;
  function show() {
    if (open) { close(); return; }
    const rect = trigger.current!.getBoundingClientRect();
    setPosition({ left: Math.max(8, Math.min(window.innerWidth - 220, rect.right - 212)), top: rect.bottom + 220 > window.innerHeight ? Math.max(8, rect.top - 208) : rect.bottom + 4 });
    setOpen(true);
  }
  return <>
    <button ref={trigger} type="button" className="video-actions-button" data-video-actions={id} aria-label={`Actions for ${title}`} aria-haspopup="menu" aria-controls={open ? menuId : undefined} aria-expanded={open} disabled={editor.busy} onClick={event => { event.stopPropagation(); show(); }}><MoreVertical size={17}/></button>
    {open && createPortal(<div ref={menu} id={menuId} role="menu" aria-label={`Actions for ${title}`} className="course-action-menu" style={position}
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) close(false); }}
      onKeyDown={event => {
        const buttons = Array.from(menu.current!.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'));
        const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
        if (event.key === 'Escape') { event.preventDefault(); close(); }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) { event.preventDefault(); buttons[event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length]?.focus(); }
      }}>
      <button role="menuitem" type="button" onClick={() => { close(); editor.openEditor({ type: video?.archived ? 'restore' : 'move', id }); }}><ArrowRightLeft size={15}/>{video?.archived ? 'Restore video…' : 'Move to…'}</button>
      {row && <button role="menuitem" type="button" onClick={() => { close(); editor.openEditor({ type: 'add', ...savedPlacement(editor.state, id) }); }}><Plus size={15}/>Add video after this</button>}
      {video && <button role="menuitem" type="button" onClick={() => { close(); editor.openEditor({ type: 'edit', id }); }}><Pencil size={15}/>Edit details</button>}
      {(row || video && !video.archived) && <button role="menuitem" type="button" onClick={() => { close(); void editor.commit({ type: 'archive', id }); }}><Archive size={15}/>Archive video</button>}
      <button role="menuitem" type="button" className="editor-delete-action" onClick={() => { close(); editor.openEditor({ type: 'delete', id }); }}><Trash2 size={15}/>Delete permanently…</button>
    </div>, document.body)}
  </>;
}

export function AddVideoButton({ sectionId, afterId, label = 'Add video', compact = false }: { sectionId: string; afterId?: string; label?: string; compact?: boolean }) {
  const { user } = useCourseAccount();
  const editor = useCourseOrder();
  if (!user) return null;
  return <button type="button" className={compact ? 'course-add-icon' : 'course-tool-action'} aria-label={label} data-tooltip={compact ? label : undefined} disabled={editor.busy} onClick={() => editor.openEditor({ type: 'add', ...(afterId ? savedPlacement(editor.state, afterId) : { sectionId, beforeId: null }) })}><Plus size={16}/>{!compact && <span>{label}</span>}</button>;
}

export function CourseEditorTools({ sectionId, organizing, onOrganise }: { sectionId: string; organizing: boolean; onOrganise: () => void }) {
  const editor = useCourseOrder();
  return <div className="course-editor-toolbar"><AddVideoButton sectionId={sectionId}/><button type="button" className="course-tool-action organise-toggle" aria-pressed={organizing} onClick={onOrganise}>{organizing ? 'Done' : 'Organise'}</button>
    <details className="course-tools-more"><summary aria-label="More course tools"><MoreHorizontal size={17}/></summary><div><button type="button" disabled={!editor.canUndo || editor.busy} onClick={() => void editor.undo()}><Undo2 size={15}/>Undo last change</button><button type="button" onClick={event => { event.currentTarget.closest('details')!.open = false; editor.openEditor({ type: 'archive' }); }}><Archive size={15}/>Archived videos</button></div></details>
  </div>;
}
