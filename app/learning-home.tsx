'use client';
import { ArrowRight, Bookmark, BookOpen, Check, CirclePlay, Clock3, ListChecks } from 'lucide-react';
import type { CourseUser } from './server/auth';
import type { LearnerState } from './learner-state';
import { useCourseOrder } from './course-order';
import { useSupplementary } from './supplementary-videos';

export default function LearningHome({ user, learner, percent, weekMinutes, onLesson, onExam, onBooks }: {
  user: CourseUser; learner: LearnerState; percent: number; weekMinutes: number;
  onLesson: (id: string) => void; onExam: () => void; onBooks: () => void;
}) {
  const { course } = useCourseOrder();
  const supplementary = useSupplementary();
  const lessons = course.modules.flatMap(courseModule => courseModule.lessons);
  const active = lessons.find(lesson => lesson.id === learner.activeLessonId) ?? lessons[0];
  const courseModule = course.modules.find(courseModule => courseModule.lessons.some(lesson => lesson.id === active.id))!;
  const index = courseModule.lessons.findIndex(lesson => lesson.id === active.id);
  const next = courseModule.lessons.slice(index + 1, index + 4);
  const saved = lessons.filter(lesson => learner.bookmarkedLessonIds.includes(lesson.id));
  const watched = new Set(learner.completedLessonIds);
  const moduleWatched = courseModule.lessons.filter(lesson => watched.has(lesson.id)).length;
  return <section className="learning-home" aria-labelledby="learning-home-title">
    <div className="learning-home-heading"><div><span className="eyebrow neutral">YOUR ELECTRICAL WORKSHOP</span><h1 id="learning-home-title">Welcome back, {user.name.split(' ')[0]}.</h1><p>Your course. Your pace. Every step kept in one place.</p></div><span className="learning-account-status"><span/> Signed in · personal progress</span></div>
    <div className="learning-desk">
      <article className="resume-lesson">
        <div className="resume-label"><span>{learner.updatedAt ? 'CONTINUE LEARNING' : 'YOUR FIRST LESSON'}</span><span><Clock3 size={15}/>{active.duration}</span></div>
        <div className="resume-module">{courseModule.path} <span>/</span> Module {String(courseModule.number).padStart(2,'0')} <span>/</span> L{String(supplementary?.displayNumberById.get(active.id) ?? active.number).padStart(2,'0')}</div>
        <h2>{active.title}</h2><p>{courseModule.title}</p>
        <div className="resume-bottom"><button className="primary-button" onClick={() => onLesson(active.id)}><CirclePlay size={19}/>{learner.updatedAt ? 'Continue learning' : 'Start the course'}<ArrowRight size={18}/></button><span>{moduleWatched} of {courseModule.lessons.length} lessons watched<br/><small>in this module</small></span></div>
        <div className="resume-progress" aria-hidden="true"><span style={{width:`${Math.round(moduleWatched / courseModule.lessons.length * 100)}%`}}/></div>
      </article>
      <aside className="learning-progress-panel"><div className="progress-panel-heading"><span>YOUR PROGRESS</span><BookOpen size={18}/></div><div className="progress-panel-number">{percent}<span>%</span></div><p>of your required course path</p><div className="learning-progress-track"><span style={{width:`${percent}%`}}/></div><dl><div><dt>Lessons watched</dt><dd>{watched.size}<span> / {lessons.length}</span></dd></div><div><dt>Study this week</dt><dd>{weekMinutes}<span> min</span></dd></div><div><dt>Private notes</dt><dd>{Object.values(learner.notes).filter(note => note.trim()).length}</dd></div></dl><small>Saved to your account. Ready on your next device.</small></aside>
    </div>
    <div className="learning-rail">
      <section className="upcoming-lessons"><div className="learning-list-heading"><h2>Next in this module</h2><span>{next.length ? 'Keep the ideas connected' : 'Module complete'}</span></div>{next.length ? next.map(lesson => <button key={lesson.id} onClick={() => onLesson(lesson.id)}><span className="upcoming-icon">{watched.has(lesson.id) ? <Check size={17}/> : <CirclePlay size={17}/>}</span><span><strong>{lesson.title}</strong><small>L{String(supplementary?.displayNumberById.get(lesson.id) ?? lesson.number).padStart(2,'0')} · {lesson.duration}</small></span><ArrowRight size={17}/></button>) : <p>Explore the course modules below, or revisit a lesson.</p>}</section>
      <section className="saved-learning"><div className="learning-list-heading"><h2>Saved for later</h2><Bookmark size={18}/></div>{saved.length ? saved.slice(0,3).map(lesson => <button key={lesson.id} onClick={() => onLesson(lesson.id)}><Bookmark size={16}/><span>{lesson.title}</span><ArrowRight size={16}/></button>) : <div className="saved-learning-empty"><Bookmark size={25}/><strong>A place for the lessons you want to revisit.</strong><p>Choose “Save lesson” while watching. Your bookmarks will appear here.</p></div>}</section>
    </div>
    <div className="learning-tools"><button onClick={onExam}><span className="learning-tool-icon"><ListChecks size={23}/></span><span><strong>Put your knowledge to the test</strong><small>EPRA exam practice and worked solutions</small></span><ArrowRight size={20}/></button><button onClick={onBooks}><span className="learning-tool-icon"><BookOpen size={23}/></span><span><strong>Go deeper with your reference library</strong><small>Books, saved pages and interactive explanations</small></span><ArrowRight size={20}/></button></div>
  </section>;
}
