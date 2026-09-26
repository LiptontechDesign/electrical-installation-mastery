'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, CirclePlay, Clock3, Layers3, ShieldCheck, Zap } from 'lucide-react';
import { useCourseOrder } from './course-order';
import { useSupplementary } from './supplementary-videos';
import { useCourseAccount } from './course-account';
import { courseMapSnapshot } from './course-drop-model';

const outcomes = ['Understand voltage, current, resistance and electrical power.', 'Explore cables, protective devices and earthing arrangements.', 'See how drawings connect to installation decisions.', 'Follow single-phase and three-phase systems.', 'Watch inspection, testing and fault diagnosis demonstrations.', 'Move through C2, C1 and specialist video pathways.'];

export default function CourseOverview({ onLesson, onBooks }: { onLesson: (id: string) => void; onBooks: () => void }) {
  const { course, order, sectionsByModule } = useCourseOrder();
  const supplementary = useSupplementary();
  const { user, requestSignIn } = useCourseAccount();
  const [path, setPath] = useState('All');
  const [expanded, setExpanded] = useState<string[]>([]);
  const snapshot = courseMapSnapshot(order, supplementary?.videos ?? []);
  const lessons = course.modules.flatMap(module => module.lessons);
  const rows = Object.values(snapshot.rows).flat();
  const hours = Math.round(lessons.reduce((sum, lesson) => sum + lesson.durationSeconds, 0) / 3600);
  const shown = course.modules.filter(module => path === 'All' || module.path === path);
  return <div className="page course-overview-page">
    <section className="course-welcome" aria-labelledby="course-title">
      <div className="course-welcome-copy"><span className="course-kicker"><span/> ONE COURSE. FROM PRINCIPLES TO PRACTICE.</span>
        <h1 id="course-title">Electrical installation.<br/><em>Understand every connection.</em></h1>
        <p>A guided learning workshop for electrical principles, safe installation and confident problem-solving. Follow the course from the beginning, or jump straight to what you need.</p>
        <div className="course-facts"><span><Layers3 size={17}/>{course.modules.length} modules</span><span><CirclePlay size={17}/>{rows.length} videos</span><span><Clock3 size={17}/>About {hours} hours + extra videos</span></div>
        <div className="button-row"><button className="primary-button" onClick={() => onLesson(lessons[0].id)}><CirclePlay size={19}/> Start learning <ArrowRight size={18}/></button><a className="course-outline-link" href="#course-curriculum">Explore the curriculum <ChevronDown size={17}/></a></div>
        <Link className="pwa-install-link" href="/install">Install on your phone <ArrowRight size={16}/></Link><small className="open-course-note">Free to explore · No account needed · Learn at your own pace</small>
      </div>
      <div className="course-welcome-art" aria-label="Learning route: understand, apply, verify">
        <div className="circuit-heading"><Zap size={21}/><span>THE LEARNING CIRCUIT</span><span className="circuit-live"/></div>
        <svg viewBox="0 0 360 166" role="img" aria-label="An electrical circuit linking a power source to a lamp"><path d="M75 83V32H270V62M270 104V138H75V96"/><path d="M57 83H93M65 95H85"/><circle cx="270" cy="83" r="22"/><path d="m255 68 30 30m0-30-30 30"/><circle className="circuit-node" cx="167" cy="32" r="5"/><circle className="circuit-node" cx="167" cy="138" r="5"/><text x="107" y="89">PRINCIPLE → PRACTICE</text></svg>
        <div className="circuit-stages"><span><b>01</b> Understand</span><span><b>02</b> Apply</span><span><b>03</b> Verify</span></div>
        <p>Watch the video.<br/>Continue through the course.</p>
      </div>
    </section>
    {!user && <section className="course-save-invitation"><span className="save-invitation-symbol"><BookOpen size={22}/></span><div><strong>Make this course yours, whenever you’re ready.</strong><p>Sign in to save progress, keep notes and continue on another device. Browsing as a guest leaves no saved learning record.</p></div><button onClick={requestSignIn}>Sign in to save progress <ArrowRight size={17}/></button></section>}
    <nav className="course-section-links" aria-label="Course overview sections"><a href="#course-outcomes">What you’ll learn</a><a href="#course-curriculum">Course content</a><a href="#course-how-it-works">How it works</a></nav>
    <section id="course-outcomes" className="course-outcomes"><div><span className="eyebrow neutral">A connected foundation</span><h2>What you’ll learn</h2><p>Follow each topic through the videos at your own pace.</p></div><ul>{outcomes.map(outcome => <li key={outcome}><Check size={19}/><span>{outcome}</span></li>)}</ul></section>
    <section id="course-curriculum" className="public-curriculum"><div className="curriculum-heading"><div><span className="eyebrow neutral">Your route through the course</span><h2>Course content</h2><p>{course.modules.length} modules · {rows.length} videos · All lessons open</p></div><button onClick={() => setExpanded(expanded.length ? [] : shown.map(module => module.id))}>{expanded.length ? 'Collapse all' : 'Expand all'}</button></div>
      <div className="curriculum-filters" role="group" aria-label="Filter course pathway">{['All','C2','C1','Professional'].map(item => <button key={item} aria-pressed={path === item} onClick={() => setPath(item)}>{item === 'All' ? 'Full course' : item === 'Professional' ? 'Advanced systems' : item === 'C2' ? 'C2 · Foundations' : 'C1 · Three-phase'}</button>)}</div>
      <div className="curriculum-modules">{shown.map(module => {
        const moduleRows = sectionsByModule[module.id].flatMap(section => snapshot.rows[section.id] ?? []);
        return <details key={module.id} open={expanded.includes(module.id)} onToggle={event => { const open = event.currentTarget.open; setExpanded(current => open ? current.includes(module.id) ? current : [...current, module.id] : current.filter(id => id !== module.id)); }}><summary><span className="curriculum-number">{String(module.number).padStart(2,'0')}</span><span className="curriculum-module-name"><strong>{module.title}</strong><small>{moduleRows.length} videos · {module.duration} lesson time</small></span><ChevronDown size={19}/></summary><div className="curriculum-lessons">{moduleRows.map(row => {
          const lesson = lessons.find(item => item.id === row.id);
          const video = supplementary?.videos.find(item => item.id === row.id);
          if (!lesson && !video) return null;
          return <button key={row.id} onClick={() => lesson ? onLesson(lesson.id) : video && supplementary?.open(video)}><CirclePlay size={17}/><span className="curriculum-lesson-number">L{String(row.displayNumber).padStart(2,'0')}</span><span>{lesson?.title ?? video?.title}{video && <small>Supplementary</small>}</span><small>{lesson?.duration ?? 'Watch'}</small></button>;
        })}</div></details>;
      })}</div>
    </section>
    <section id="course-how-it-works" className="course-how"><div><span className="eyebrow neutral">A course, at your pace</span><h2>Choose a topic. Start watching.</h2><p>Start with C2 foundations, move into C1 three-phase systems, then explore specialist topics. You can open any video in any order.</p><p>Your watched videos, bookmarks and private notes are saved when you sign in. The reference books are available whenever you want to read further.</p><div className="course-resource-buttons"><button onClick={onBooks}>Open reference books <ArrowRight size={17}/></button></div></div><aside><ShieldCheck size={26}/><h3>Learn the theory. Practise safely.</h3><p>Electrical installation and testing require qualified supervision. Course progress is not an EPRA licence or proof of practical competence.</p><small>Curated by Liptontech. Video creators are credited within their lessons.</small></aside></section>
    <footer className="course-public-footer"><span>Electrical Installation Mastery · Liptontech</span><nav aria-label="Course policies"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></footer>
  </div>;
}
