'use client';

import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';

export default function SectionWatchedDialog({ title, number, videoCount, disabled, onConfirm, onClose }: {
  title: string;
  number: number;
  videoCount: number;
  disabled: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const cancel = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const element = dialog.current!;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    cancel.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);

  return <dialog ref={dialog} className="personal-course-dialog section-watched-dialog" aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header className="course-editor-heading"><div><span>Section {String(number).padStart(2, '0')}</span><h2 id={titleId}>Mark section as watched?</h2></div><button type="button" className="editor-close" aria-label="Close confirmation" onClick={onClose}><X size={19}/></button></header>
    <div className="editor-moving-title"><strong>{title}</strong></div>
    <p id={descriptionId} className="section-watch-question">Are you sure you want to mark {videoCount === 1 ? 'the video' : `all ${videoCount} videos`} in this section as watched?</p>
    <footer className="editor-footer"><button ref={cancel} type="button" className="editor-secondary" onClick={onClose}>Cancel</button><button type="button" className="editor-primary" disabled={disabled} onClick={onConfirm}>Mark as watched</button></footer>
  </dialog>;
}
