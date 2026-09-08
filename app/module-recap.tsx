'use client';

import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,BookOpen,CheckCircle2,Play,List,Printer,X} from 'lucide-react';
import {recapBooks,recapSafety,type RecapChapter} from './module-recaps';
import {useDialogFocus} from './use-dialog-focus';
import {RecapLine,RecapDiagram} from './recap-math';
import RecapVideo from './recap-video';
import RecapLessonNotes,{LessonNoteContent} from './recap-lesson-notes';

type Props = {moduleId:string; onClose:()=>void; completedLessonIds:readonly string[]};

function Spread({chapter,printing=false}:{chapter:RecapChapter;printing?:boolean}) {
  return <div className="recap-spread">
    <section className="recap-paper recap-principles">
      <span className="recap-kicker">The essential idea</span>
      <h2 tabIndex={printing?undefined:-1} id={printing?undefined:'recap-chapter-title'}>{chapter.title}</h2>
      <p className="recap-lead">{chapter.lead}</p>
      <dl className="recap-notes">{chapter.notes.map(([label,explanation],index)=><div key={label}><dt><span aria-hidden="true">{String(index+1).padStart(2,'0')}</span>{label}</dt><dd>{explanation}</dd></div>)}</dl>
    </section>
    <section className="recap-paper recap-connections" aria-label="Key relationships">
      <span className="recap-kicker">{chapter.visual.kind==='equation'?'Keep the relationship':chapter.visual.kind==='compare'?'Keep these distinct':'See the sequence'}</span>
      <div className={`recap-visual ${chapter.visual.kind}`}>
        <RecapDiagram chapterId={chapter.id}/>
        {chapter.visual.kind==='flow'?<ol>{chapter.visual.lines.map(line=><li key={line}><RecapLine line={line}/></li>)}</ol>:<ul>{chapter.visual.lines.map(line=><li key={line}><RecapLine line={line}/></li>)}</ul>}
      </div>
      <p className="recap-caption">{chapter.visual.caption}</p>
      {chapter.caution&&<aside className="recap-caution"><strong>Important boundary</strong><p>{chapter.caution}</p></aside>}
      <div className="recap-source-note"><BookOpen size={19} aria-hidden="true"/><span>Based on the lesson group below. Return to the videos for the demonstrations and full context.</span></div>
    </section>
  </div>;
}

export default function ModuleRecap({moduleId,onClose,completedLessonIds}:Props) {
  const book=recapBooks.find(item=>item.id===moduleId)!;
  const [index,setIndex]=useState(0);
  const [contentsOpen,setContentsOpen]=useState(false);
  const [view,setView]=useState<'summary'|'notes'>('summary');
  const [video,setVideo]=useState<RecapChapter['lessons'][number]|null>(null);
  const dialog=useRef<HTMLElement>(null);
  const readingArea=useRef<HTMLDivElement>(null);
  const previousChapter=useRef(index);
  const chapter=book.chapters[index];
  useDialogFocus(dialog,true);

  useEffect(()=>{
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const siblings=Array.from(dialog.current?.parentElement?.children??[])
      .filter((element):element is HTMLElement=>element instanceof HTMLElement&&element!==dialog.current);
    const prior=siblings.map(element=>element.inert);
    siblings.forEach(element=>{element.inert=true;});
    return ()=>{
      document.body.style.overflow=previousOverflow;
      siblings.forEach((element,i)=>{element.inert=prior[i];});
    };
  },[]);

  const turnTo=(next:number)=>{
    setIndex(Math.max(0,Math.min(book.chapters.length-1,next)));
    setContentsOpen(false);
    setView('summary');
    readingArea.current?.scrollTo({top:0,behavior:'instant'});
  };
  useEffect(()=>{
    if(previousChapter.current!==index)dialog.current?.querySelector<HTMLElement>('#recap-chapter-title')?.focus({preventScroll:true});
    previousChapter.current=index;
  },[index]);

  return <section ref={dialog} className="module-recap" role="dialog" aria-modal="true" aria-labelledby="recap-book-title"
    onKeyDown={event=>{
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();onClose();return;}
      const tag=(event.target as HTMLElement).tagName;
      if(['INPUT','TEXTAREA','SELECT','BUTTON','A','SUMMARY'].includes(tag))return;
      if(event.key==='ArrowRight'){event.preventDefault();turnTo(index+1);}
      if(event.key==='ArrowLeft'){event.preventDefault();turnTo(index-1);}
    }}>
    <div className="recap-screen" inert={!!video}>
      <header className="recap-toolbar">
        <div><span className="recap-kicker">Module {String(book.number).padStart(2,'0')} · Recap book</span><h1 id="recap-book-title">{book.title}</h1></div>
        <div className="recap-tools">
          <button type="button" aria-expanded={contentsOpen} aria-controls="recap-contents" onClick={()=>setContentsOpen(value=>!value)}><List size={18}/>Contents</button>
          <button type="button" onClick={()=>window.print()}><Printer size={18}/>Print / Save PDF</button>
          <button type="button" onClick={onClose} aria-label="Close module recap"><X size={22}/></button>
        </div>
      </header>
      {contentsOpen&&<nav id="recap-contents" className="recap-contents" aria-label="Recap chapters"><ol>{book.chapters.map((item,i)=><li key={item.id}><button type="button" aria-current={i===index?'page':undefined} onClick={()=>turnTo(i)}><span>{String(i+1).padStart(2,'0')}</span>{item.title}</button></li>)}</ol></nav>}
      <div className="recap-reading-area" ref={readingArea}>
        <p className="recap-safety">{recapSafety}</p>
        <div className="recap-view-switch" aria-label="Reading depth"><button type="button" aria-pressed={view==='summary'} onClick={()=>setView('summary')}>Chapter summary</button><button type="button" aria-pressed={view==='notes'} onClick={()=>setView('notes')}>Detailed lesson notes · {chapter.lessons.length} lessons</button></div>
        {view==='summary'?<Spread key={chapter.id} chapter={chapter}/>:<RecapLessonNotes key={chapter.id+'-notes'} chapter={chapter} onVideo={setVideo}/>}
        {view==='summary'&&<details open className="recap-sources" key={chapter.id+'-sources'}><summary>Source videos · {chapter.lessons.length} lessons <span>Reading this recap does not mark videos or quizzes complete.</span></summary>
          <ul>{chapter.lessons.map(lesson=><li key={lesson.id}>
            <div><button className="recap-source-play" type="button" onClick={()=>setVideo(lesson)}><Play size={18}/>L{String(lesson.number).padStart(2,'0')} · {lesson.title}</button>
              <small>{lesson.transcript?'Supplied transcript':'Visual-only source — no transcript summary claimed'}</small></div>
            <span className="recap-watched">{completedLessonIds.includes(lesson.id)?<><CheckCircle2 size={16}/>Watched</>:'Not yet watched'}</span>
          </li>)}</ul>
        </details>}
      </div>
      <footer className="recap-pagination">
        <button type="button" onClick={()=>turnTo(index-1)} disabled={index===0}><ArrowLeft size={19}/>Previous</button>
        <div><p role="status" aria-live="polite">Chapter {index+1} of {book.chapters.length}</p><span className="recap-progress" aria-hidden="true"><i style={{width:`${(index+1)/book.chapters.length*100}%`}}/></span></div>
        {index<book.chapters.length-1?<button type="button" onClick={()=>turnTo(index+1)}>Next<ArrowRight size={19}/></button>:<button type="button" onClick={onClose}>Return to course<ArrowRight size={19}/></button>}
      </footer>
    </div>
    <div className="recap-print" aria-hidden="true">
      <header><p>Electrical Installation Mastery · Module {book.number}</p><h1>{book.title}</h1><p>{recapSafety}</p><p>{book.chapters.length} chapters · Revision notes, not completion evidence.</p></header>
      {book.chapters.map(item=><article key={item.id}><header><p>Module {book.number} · Chapter {item.number} of {book.chapters.length}</p></header><Spread chapter={item} printing/>{item.lessons.map(lesson=><section className="recap-print-lesson" key={lesson.id}><LessonNoteContent lesson={lesson}/></section>)}<section className="recap-print-sources"><h3>Source videos</h3><ul>{item.lessons.map(lesson=><li key={lesson.id}>{lesson.title} — {lesson.transcript?'supplied transcript':'visual only; no transcript'}<br/>{lesson.url}</li>)}</ul></section></article>)}
    </div>
    {video&&<RecapVideo lesson={video} onClose={()=>setVideo(null)}/>}
  </section>;
}
