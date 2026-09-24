'use client';
import { createContext, useContext, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LearnerState } from './learner-state';

export type StudyPlayer = { getCurrentTime?: () => number; getDuration?: () => number; getPlayerState?: () => number; seekTo?: (seconds: number, allowSeekAhead: boolean) => void; pauseVideo?: () => void };
export const VideoStudyContext = createContext<{
  enabled: boolean;
  savedVideos: string[]; videoNotes: Record<string, string>; toggleSaved: (id: string) => void; setNote: (id: string, text: string) => void;
  openCourseMap: () => void;
  navigation: { previous?: { title: string; select: () => void }; next?: { title: string; duration?: string; optional: boolean; select: () => void }; position: number; total: number; path: string; moduleTitle: string };
  positions: LearnerState['videoPositions']; notes: LearnerState['timestampNotes'];
  position: (id: string, seconds: number) => void;
  addNote: (id: string, seconds: number, text: string) => void;
  removeNote: (id: string, noteId: string) => void;
}>({ enabled: false, savedVideos: [], videoNotes: {}, toggleSaved: () => {}, setNote: () => {}, openCourseMap: () => {}, navigation: { position: 1, total: 1, path: '', moduleTitle: '' }, positions: {}, notes: {}, position: () => {}, addNote: () => {}, removeNote: () => {} });
export const timestamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

// Never infer progress from an unloaded player. Checkpoint during playback,
// on pause/navigation, and when the tab becomes hidden.
export function trackVideoPosition(player: StudyPlayer, save: (seconds: number) => void) {
  let ended = false;
  const capture = () => {
    try {
      const state = player.getPlayerState?.();
      if (state === 0) { ended = true; save(0); return; }
      if (state !== 1 && state !== 2) return;
      ended = false;
      const seconds = player.getCurrentTime?.();
      if (typeof seconds === 'number' && Number.isFinite(seconds) && seconds >= 0 && seconds <= 86400) save(Math.floor(seconds));
    } catch { /* Player may have been removed during navigation. */ }
  };
  const timer = window.setInterval(capture, 5000);
  const hide = () => { if (document.hidden) capture(); };
  document.addEventListener('visibilitychange', hide);
  window.addEventListener('pagehide', capture);
  return Object.assign(() => { if (!ended) capture(); window.clearInterval(timer); document.removeEventListener('visibilitychange', hide); window.removeEventListener('pagehide', capture); }, { capture });
}

export function VideoStudyTools({ videoId, getPlayer }: { videoId: string; getPlayer: () => StudyPlayer | null }) {
  const study = useContext(VideoStudyContext);
  const [draft, setDraft] = useState('');
  const [message, setMessage] = useState('');
  if (!study.enabled) return null;
  const seconds = study.positions[videoId] ?? 0;
  const notes = study.notes[videoId] ?? [];
  const notesFull = notes.length >= 100 || Object.values(study.notes).reduce((count, entries) => count + entries.length, 0) >= 1000;
  const seek = (time: number) => {
    const player = getPlayer();
    if (!player?.seekTo) { setMessage('Start the video to connect playback controls.'); return; }
    player.seekTo(time, true); study.position(videoId, time); setMessage(time ? `Resumed at ${timestamp(time)}.` : 'Video restarted.');
  };
  return <section className="video-study-tools" aria-label="Playback and timestamp notes">
    <div className="video-resume-actions">{seconds > 0 && <button type="button" onClick={() => seek(seconds)}>Resume at {timestamp(seconds)}</button>}<button type="button" onClick={() => seek(0)}>Start again</button><span>Your place is saved to your account</span></div>
    <details><summary>Notes at a moment {notes.length > 0 && `(${notes.length})`}</summary>
      <form onSubmit={event => { event.preventDefault(); const time = getPlayer()?.getCurrentTime?.(); if (typeof time !== 'number' || !Number.isFinite(time)) { setMessage('Start the video before adding a timestamp note.'); return; } if (!draft.trim() || notesFull) return; study.addNote(videoId, time, draft.trim()); setDraft(''); setMessage('Timestamp note added.'); }}>
        <label>Note for the current moment<textarea maxLength={2000} required value={draft} onChange={event => setDraft(event.target.value)} placeholder="What would you like to remember?"/></label>
        <button type="submit" disabled={notesFull}>Add timestamp note</button>{notesFull && <p>Timestamp note limit reached. Delete an existing timestamp note to add another.</p>}
      </form>
      <ul>{notes.map(note => <li key={note.id}><button type="button" aria-label={`Jump to ${timestamp(note.seconds)}`} onClick={() => seek(note.seconds)}>{timestamp(note.seconds)}</button><p>{note.text}</p><button type="button" aria-label={`Delete note at ${timestamp(note.seconds)}`} onClick={() => study.removeNote(videoId, note.id)}>Delete</button></li>)}</ul>
    </details>
    {message && <p role="status">{message}</p>}
  </section>;
}

export function VideoLessonStepper() {
  const { navigation } = useContext(VideoStudyContext);
  return <div className="lesson-stepper"><button type="button" disabled={!navigation.previous} onClick={navigation.previous?.select} aria-label="Previous lesson"><ChevronLeft size={20}/></button><span>Video {navigation.position} of {navigation.total}</span><button type="button" disabled={!navigation.next} onClick={navigation.next?.select} aria-label="Next lesson"><ChevronRight size={20}/></button></div>;
}
export function NextVideoCard() {
  const { navigation, openCourseMap } = useContext(VideoStudyContext);
  return <footer className="lesson-next-card"><div><span>{navigation.next ? 'Up next' : 'End of video sequence'}</span><h3>{navigation.next?.title ?? 'Explore the course map'}</h3>{navigation.next && <p>{navigation.next.duration ? navigation.next.duration + ' · ' : ''}{navigation.next.optional ? 'Optional lesson' : 'Core lesson'}</p>}</div><button type="button" onClick={navigation.next?.select ?? openCourseMap}>{navigation.next ? 'Continue' : 'Course map'}<ArrowRight size={18}/></button></footer>;
}
