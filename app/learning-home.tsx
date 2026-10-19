'use client';
import { useState } from 'react';
import { ArrowRight, Bookmark, Check, CirclePlay, Clock3 } from 'lucide-react';
import type { CourseUser } from './server/auth';
import type { LearnerState } from './learner-state';
import { useCourseOrder } from './course-order';
import { SupplementaryDuration, useSupplementary } from './supplementary-videos';
import { pathwayLabel, type VideoProgress } from './course-progress-model';
import { OverallProgress } from './pathway-progress';
import { homeContinueDestination } from './course-ui-model';
import HomeBookResume from './home-book-resume';
import type { BookSelection } from './reader-state';

export default function LearningHome({ user, learner, path, progress, overallProgress, watchedRows, weekMinutes, ready = true, onLesson, onBooks }: {
  user: CourseUser; learner: LearnerState; path: string; progress: VideoProgress; overallProgress: VideoProgress; watchedRows: ReadonlySet<string>; weekMinutes: number; ready?: boolean;
  onLesson: (id: string) => void; onBooks: (selection?: BookSelection) => void;
}) {
  const { course, allRows, openEditor } = useCourseOrder();
  const supplementary = useSupplementary();
  const [choice, setChoice] = useState<'next' | 'recent'>('next');
  const lessons = course.modules.flatMap(module => module.lessons);
  const pathModules = new Set(course.modules.filter(module => module.path === path).map(module => module.id));
  const pathRows = allRows.filter(row => pathModules.has(row.moduleId));
  const recent = allRows.find(row => row.id === (supplementary?.selected?.id ?? learner.activeLessonId));
  const recommended = homeContinueDestination(pathRows, watchedRows, recent?.id);
  const active = choice === 'recent' && recent ? recent : recommended;
  const courseModule = course.modules.find(module => module.id === active?.moduleId);
  const saved = allRows.filter(row => row.kind === 'core' ? learner.bookmarkedLessonIds.includes(row.id) : supplementary?.videos.some(video => video.id === row.id && learner.videoBookmarks.includes(video.videoId)));
  const next = pathRows.filter(row => row.id !== active?.id && !watchedRows.has(row.id)).slice(0, 2);
  const duration = (id: string) => lessons.find(lesson => lesson.id === id)?.duration ?? <SupplementaryDuration video={supplementary?.videos.find(video => video.id === id)}/>;
  const videoId = lessons.find(lesson => lesson.id === active?.id)?.videoId ?? supplementary?.videos.find(video => video.id === active?.id)?.videoId;
  const watched = Boolean(active && watchedRows.has(active.id));
  const resuming = Boolean(videoId && learner.videoPositions[videoId]);
  const nextLabel = progress.total > 0 && progress.watched === progress.total ? 'Revisit pathway' : 'Next unwatched';

  return <section className="learning-home study-home" aria-labelledby="learning-home-title" aria-busy={!ready}>
    <div className="study-home-heading"><div><p className="workspace-kicker">Your study space</p><h1 id="learning-home-title">Welcome back, {user.name.split(' ')[0]}.</h1></div><span className="workspace-path">{pathwayLabel(path)} pathway</span></div>
    {!ready ? <div className="study-home-loading" role="status"><CirclePlay size={24}/><span>Opening your learning…</span></div> : <>
      <div className="study-home-desk">
        <div className="study-home-main">
        <article className="study-resume">
          <div className="study-resume-heading"><span><CirclePlay size={18}/>{watched ? 'Revisit a lesson' : resuming ? 'Pick up where you left off' : 'Your next step'}</span>{recent && recommended && recent.id !== recommended.id && <div className="workspace-segmented" role="group" aria-label="Continue from"><button type="button" aria-pressed={choice === 'next'} onClick={() => setChoice('next')}>{nextLabel}</button><button type="button" aria-pressed={choice === 'recent'} onClick={() => setChoice('recent')}>Last opened</button></div>}</div>
          {active && courseModule ? <>
            <p className="study-resume-context">{pathwayLabel(courseModule.path)} · Module {String(courseModule.stageNumber).padStart(2, '0')} · Video {active.displayNumber}</p>
            <h2>{active.title}</h2>
            <div className="study-resume-meta"><span><Clock3 size={16}/>{duration(active.id)}</span><span>{watched ? <><Check size={16}/> Watched</> : 'Not watched'}</span></div>
            <button type="button" className="workspace-primary" onClick={() => onLesson(active.id)}><CirclePlay size={19}/>{watched ? 'Replay lesson' : resuming ? 'Resume video' : 'Start lesson'}<ArrowRight size={18}/></button>
          </> : <><h2>No active {pathwayLabel(path)} videos</h2><p>Restore an archived video or add a video to this pathway.</p><button type="button" className="workspace-secondary" onClick={() => openEditor({ type: 'archive' })}>Archived videos</button></>}
        </article>
        <HomeBookResume key={user.id} userId={user.id} onOpen={onBooks}/>
        </div>
        <aside className="learning-progress-panel study-progress" data-pathway={path}>
          <div className="study-progress-top"><div className="progress-panel-heading"><span>{pathwayLabel(path)} PROGRESS</span></div><div className="progress-panel-number">{progress.percent}<span>%</span></div></div>
          <p>{progress.watched} of {progress.total} videos watched</p>
          <div className="learning-progress-track" role="progressbar" aria-label={pathwayLabel(path) + ' pathway progress'} aria-valuemin={0} aria-valuemax={Math.max(1, progress.total)} aria-valuenow={progress.watched}><span style={{ width: `${progress.percent}%` }}/></div>
          <p className="study-remaining">{progress.total - progress.watched ? `${progress.total - progress.watched} videos remaining` : progress.total ? 'Every active video watched' : 'Add a video to begin'}</p>
          <details className="study-home-stats"><summary>More about your progress</summary><OverallProgress progress={overallProgress}/><dl><div><dt>Study this week</dt><dd>{weekMinutes} min</dd></div><div><dt>Private notes</dt><dd>{Object.values(learner.notes).filter(note => note.trim()).length}</dd></div></dl><small>Saved to your account across devices.</small></details>
        </aside>
      </div>
      <div className="study-home-rail">
        <section className="study-next" aria-labelledby="study-next-title"><div className="workspace-section-heading"><h2 id="study-next-title">Up next in {pathwayLabel(path)}</h2><span>{next.length ? 'Unwatched videos' : 'Your pathway'}</span></div>{next.length ? next.map(row => <button type="button" key={row.id} className="study-lesson-row" onClick={() => onLesson(row.id)}><span className="study-row-icon"><CirclePlay size={19}/></span><span><strong>{row.title}</strong><small>Module {String(course.modules.find(module => module.id === row.moduleId)?.number).padStart(2, '0')} · {duration(row.id)}</small></span><ArrowRight size={17}/></button>) : <p className="study-empty">{pathRows.length ? 'You’re up to date. Revisit a lesson or explore another pathway below.' : 'Choose a pathway below to explore its videos.'}</p>}</section>
        <section className="study-saved" aria-labelledby="study-saved-title"><div className="workspace-section-heading"><h2 id="study-saved-title">Saved for later</h2><Bookmark size={18}/></div>{saved.length ? saved.slice(0, 3).map(row => <button type="button" key={row.id} className="study-lesson-row" onClick={() => onLesson(row.id)}><Bookmark size={18}/><span><strong>{row.title}</strong></span><ArrowRight size={17}/></button>) : <p className="study-empty">Save a lesson while watching to find it here.</p>}</section>
      </div>
    </>}
  </section>;
}
