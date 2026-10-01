'use client';
import { ArrowRight, Bookmark, BookOpen, Check, CirclePlay, Clock3 } from 'lucide-react';
import type { CourseUser } from './server/auth';
import type { LearnerState } from './learner-state';
import { useCourseOrder } from './course-order';
import { SupplementaryDuration, useSupplementary } from './supplementary-videos';
import { pathwayLabel, progressForVideos, type VideoProgress } from './course-progress-model';
import { OverallProgress } from './pathway-progress';

export default function LearningHome({ user, learner, path, progress, overallProgress, watchedRows, weekMinutes, onLesson, onBooks }: {
  user: CourseUser; learner: LearnerState; path: string; progress: VideoProgress; overallProgress: VideoProgress; watchedRows: ReadonlySet<string>; weekMinutes: number;
  onLesson: (id: string) => void; onBooks: () => void;
}) {
  const { course, byId, allRows, openEditor } = useCourseOrder();
  const supplementary = useSupplementary();
  const lessons = course.modules.flatMap(courseModule => courseModule.lessons);
  const active = allRows.find(row => row.id === (supplementary?.selected?.id ?? learner.activeLessonId)) ?? allRows[0];
  if (!active) return <section className="learning-home" aria-labelledby="learning-home-title"><div className="learning-home-heading"><div><h1 id="learning-home-title">Welcome back, {user.name.split(' ')[0]}.</h1></div></div><article className="resume-lesson"><h2>{allRows.length ? 'Choose a video from your course' : 'No active videos'}</h2><p>Restore an archived video or add a video to your course.</p><button type="button" className="editor-secondary" onClick={() => openEditor({ type: 'archive' })}>Archived videos</button>{allRows.map(row => <button type="button" className="editor-secondary" key={row.id} onClick={() => { const video = supplementary?.videos.find(v => v.id === row.id); if (video) supplementary?.open(video); }}>{row.title}</button>)}</article><div className="learning-tools"><button type="button" onClick={onBooks}><BookOpen size={23}/><span>Open your reference library</span><ArrowRight size={20}/></button></div></section>;
  const courseModule = course.modules.find(courseModule => courseModule.id === active.moduleId)!;
  const moduleRows = allRows.filter(row => row.moduleId === courseModule.id);
  const index = moduleRows.findIndex(row => row.id === active.id);
  const next = moduleRows.slice(index + 1, index + 4);
  const saved = allRows.filter(row => row.kind === 'core' ? learner.bookmarkedLessonIds.includes(row.id) : supplementary?.videos.some(v => v.id === row.id && learner.videoBookmarks.includes(v.videoId)));
  const moduleProgress = progressForVideos(moduleRows.map(row => row.id), watchedRows);
  return <section className="learning-home" aria-labelledby="learning-home-title">
    <div className="learning-home-heading"><div><span className="eyebrow neutral">YOUR ELECTRICAL WORKSHOP</span><h1 id="learning-home-title">Welcome back, {user.name.split(' ')[0]}.</h1><p>Your course. Your pace. Every step kept in one place.</p></div><span className="learning-account-status"><span/> Signed in · personal progress</span></div>
    <div className="learning-desk">
      <article className="resume-lesson">
        <div className="resume-label"><span>{learner.updatedAt ? 'CONTINUE LEARNING' : 'YOUR FIRST LESSON'}</span><span><Clock3 size={15}/>{lessons.find(lesson => lesson.id === active.id)?.duration ?? <SupplementaryDuration video={supplementary?.videos.find(video => video.id === active.id)}/>}</span></div>
        <div className="resume-module">{courseModule.path} <span>/</span> Module {String(courseModule.number).padStart(2,'0')} <span>/</span> L{String(active.displayNumber).padStart(2,'0')}</div>
        <h2>{active.title}</h2><p>{courseModule.title}</p>
        <div className="resume-bottom"><button className="primary-button" onClick={() => onLesson(active.id)}><CirclePlay size={19}/>{learner.updatedAt ? 'Continue learning' : 'Start the course'}<ArrowRight size={18}/></button><span>{moduleProgress.watched} of {moduleProgress.total} videos watched<br/><small>in this module</small></span></div>
        <div className="resume-progress" aria-hidden="true"><span style={{width:`${moduleProgress.percent}%`}}/></div>
      </article>
      <aside className="learning-progress-panel" data-pathway={path}><div className="progress-panel-heading"><span>{pathwayLabel(path)} PROGRESS</span><BookOpen size={18}/></div><div className="progress-panel-number">{progress.percent}<span>%</span></div><p>of your active {pathwayLabel(path)} videos</p><div className="learning-progress-track" role="progressbar" aria-label={pathwayLabel(path) + ' pathway progress'} aria-valuemin={0} aria-valuemax={progress.total} aria-valuenow={progress.watched}><span style={{width:`${progress.percent}%`}}/></div><dl><div><dt>{pathwayLabel(path)} videos watched</dt><dd>{progress.watched}<span> / {progress.total}</span></dd></div><div><dt>Study this week</dt><dd>{weekMinutes}<span> min</span></dd></div><div><dt>Private notes</dt><dd>{Object.values(learner.notes).filter(note => note.trim()).length}</dd></div></dl><OverallProgress progress={overallProgress}/><small>Saved to your account. Ready on your next device.</small></aside>
    </div>
    <div className="learning-rail">
      <section className="upcoming-lessons"><div className="learning-list-heading"><h2>Next in this module</h2><span>{next.length ? 'Keep the ideas connected' : moduleProgress.watched === moduleProgress.total ? 'Module complete' : 'Earlier videos remaining'}</span></div>{next.length ? next.map(lesson => <button key={lesson.id} onClick={() => onLesson(lesson.id)}><span className="upcoming-icon">{watchedRows.has(lesson.id) ? <Check size={17}/> : <CirclePlay size={17}/>}</span><span><strong>{lesson.title}</strong><small>L{String(byId.get(lesson.id)?.displayNumber ?? 1).padStart(2,'0')} · {lessons.find(l => l.id === lesson.id)?.duration ?? <SupplementaryDuration video={supplementary?.videos.find(video => video.id === lesson.id)}/>}</small></span><ArrowRight size={17}/></button>) : <p>Explore the course modules below, or revisit a lesson.</p>}</section>
      <section className="saved-learning"><div className="learning-list-heading"><h2>Saved for later</h2><Bookmark size={18}/></div>{saved.length ? saved.slice(0,3).map(lesson => <button key={lesson.id} onClick={() => onLesson(lesson.id)}><Bookmark size={16}/><span>{lesson.title}</span><ArrowRight size={16}/></button>) : <div className="saved-learning-empty"><Bookmark size={25}/><strong>A place for the lessons you want to revisit.</strong><p>Choose “Save lesson” while watching. Your bookmarks will appear here.</p></div>}</section>
    </div>
    <div className="learning-tools"><button onClick={onBooks}><span className="learning-tool-icon"><BookOpen size={23}/></span><span><strong>Open your reference library</strong><small>Books, chapters and saved pages</small></span><ArrowRight size={20}/></button></div>
  </section>;
}
