'use client';
import {useEffect,useState} from 'react';
import {ArrowLeft,ArrowRight,Play} from 'lucide-react';
import {lessonGuides} from './lesson-guides';
import {overviewAnswers,overviewWorking,overviewPrompts,overviewPurpose,overviewFormulas} from './overview-answers';
import {sourceClarifications,suppliedTeaching} from './supplied-lessons';
import LearningText from './learning-text';
import Formula from './formula';
import type {RecapChapter} from './module-recaps';
import CourseBridge from './course-bridge';

type Lesson=RecapChapter['lessons'][number];
function Transcript({lesson}:{lesson:Lesson}){
 const [result,setResult]=useState<{text?:string;error?:boolean}>({});
 const [page,setPage]=useState(0);
 useEffect(()=>{
  const controller=new AbortController();
  const id=new URL(lesson.url).searchParams.get('v');
  fetch(`/recap-transcripts/${id}.json`,{signal:controller.signal}).then(response=>{if(!response.ok)throw new Error('Source unavailable');return response.json();}).then(data=>{if(typeof data.text!=='string')throw new Error('Invalid source');setResult({text:data.text});}).catch(error=>{if(error.name!=='AbortError')setResult({error:true});});
  return()=>controller.abort();
 },[lesson.id,lesson.url]);
 if(result.error)return <p role="alert">The transcript could not be loaded. Please reopen it to retry, or watch the source video.</p>;
 if(!result.text)return <p role="status">Loading the supplied transcript…</p>;
 const words=result.text.split(/\s+/),pages=Math.ceil(words.length/320);
 return <div className="recap-transcript"><p>Complete supplied source, not an edited teaching note. Automatic captions can mishear technical terms and numbers. Some supplied files contain both plain and timestamped copies.</p><div className="recap-transcript-text" tabIndex={0}>{words.slice(page*320,(page+1)*320).join(' ')}</div><nav aria-label="Transcript pages"><button type="button" disabled={page===0} onClick={()=>setPage(n=>n-1)}>Previous transcript page</button><span>Page {page+1} of {pages}</span><button type="button" disabled={page===pages-1} onClick={()=>setPage(n=>n+1)}>Next transcript page</button></nav></div>;
}

export function LessonNoteContent({lesson}:{lesson:Lesson}){
 const guide=lessonGuides[lesson.id];
 const retrieval=suppliedTeaching[lesson.id]?.retrieval;
 return <div className="recap-lesson-copy">
  <section><span className="recap-kicker">Understand the explanation</span><h3>{lesson.title}</h3><p><LearningText text={guide.summary}/></p>{overviewFormulas[lesson.id]&&<Formula tex={overviewFormulas[lesson.id]} block/>}<ol>{guide.keyConcepts.map(concept=><li key={concept}><LearningText text={concept}/></li>)}</ol>{sourceClarifications[lesson.id]&&<aside className="recap-caution"><strong>Keep the model accurate</strong><LearningText text={sourceClarifications[lesson.id]}/></aside>}</section>
  <section><span className="recap-kicker">Connect it to the work</span><h3>What to carry into practice</h3><p><LearningText text={overviewPurpose[lesson.id]??guide.practicalConnection}/></p><h4>Keep this distinction</h4><p><LearningText text={guide.remember}/></p><h4>Explain it back</h4><p><LearningText text={retrieval?.prompt??overviewPrompts[lesson.id]??guide.checkYourself}/></p><details className="recap-note-answer"><summary>Model explanation</summary><p><LearningText text={retrieval?.answer??overviewAnswers[lesson.id]}/></p>{(retrieval?.workingTex??overviewWorking[lesson.id])&&<Formula tex={(retrieval?.workingTex??overviewWorking[lesson.id])!} block/>}</details></section>
  <CourseBridge lessonId={lesson.id}/>
 </div>;
}

export default function RecapLessonNotes({chapter,onVideo}:{chapter:RecapChapter;onVideo:(lesson:Lesson)=>void}){
 const [index,setIndex]=useState(0),[transcriptOpen,setTranscriptOpen]=useState(false);
 const lesson=chapter.lessons[index];
 const select=(next:number)=>{setIndex(next);setTranscriptOpen(false);};
 return <section className="recap-detailed-notes" aria-label="Detailed lesson notes">
  <header><div><span className="recap-kicker">Beyond the chapter summary</span><h2>Lesson-by-lesson notes</h2><p>Work through the explanation, key distinctions and practical connection for each source lesson.</p></div><label>Choose a lesson<select value={index} onChange={event=>select(Number(event.target.value))}>{chapter.lessons.map((item,i)=><option key={item.id} value={i}>L{item.number} · {item.title}</option>)}</select></label></header>
  <LessonNoteContent key={lesson.id} lesson={lesson}/>
  <div className="recap-note-actions"><button type="button" onClick={()=>onVideo(lesson)}><Play size={17}/>Watch this explanation</button>{lesson.transcript?<button type="button" aria-expanded={transcriptOpen} onClick={()=>setTranscriptOpen(open=>!open)}>{transcriptOpen?'Close transcript':'Read complete supplied transcript'}</button>:<p>No transcript was supplied for this visual-only source.</p>}</div>
  {transcriptOpen&&<Transcript key={lesson.id} lesson={lesson}/>}
  <nav className="recap-note-pagination" aria-label="Lesson note pages"><button type="button" disabled={index===0} onClick={()=>select(index-1)}><ArrowLeft size={17}/>Previous lesson notes</button><span>Lesson {index+1} of {chapter.lessons.length}</span><button type="button" disabled={index===chapter.lessons.length-1} onClick={()=>select(index+1)}>Next lesson notes<ArrowRight size={17}/></button></nav>
 </section>;
}
