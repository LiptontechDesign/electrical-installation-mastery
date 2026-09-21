'use client';
import { useEffect, useRef } from 'react';
import { ArrowDown, GripVertical } from 'lucide-react';
import type { DropProposal } from './course-drop-model';

export function MoveConfirmationDialog({ proposal, busy, onCancel, onConfirm }: {
  proposal: DropProposal; busy: boolean; onCancel: () => void; onConfirm: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  useEffect(() => { dialog.current?.showModal(); cancel.current?.focus(); }, []);
  return <dialog ref={dialog} className="move-lesson-dialog course-drag-dialog" aria-labelledby="drag-confirm-title"
    aria-describedby="drag-confirm-impact" onCancel={event => { event.preventDefault(); if (!busy) onCancel(); }}
    onKeyDown={event => event.stopPropagation()}>
    <span className="eyebrow">Review your move</span><h2 id="drag-confirm-title">Move this video?</h2>
    <p className="course-drag-title"><GripVertical size={20} /><strong>{proposal.item.title}</strong></p>
    <div className="course-drag-route"><small>FROM</small><p>{proposal.source}</p><ArrowDown size={18} aria-hidden="true" /><small>TO</small><p>{proposal.destination}</p><strong>{proposal.placement}</strong></div>
    {proposal.movingIds.length > 1 && <p className="move-help">Attached supporting videos follow this item.</p>}
    <p id="drag-confirm-impact">This changes the shared course order for everyone.</p>
    <div className="move-dialog-actions"><button ref={cancel} type="button" disabled={busy} onClick={onCancel}>Cancel</button><button type="button" className="primary-button" disabled={busy} onClick={onConfirm}>{busy ? 'Saving…' : 'Confirm move'}</button></div>
  </dialog>;
}
