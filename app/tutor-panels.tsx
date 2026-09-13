'use client';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { lessonKnowledge, lessonsForTerm, type KnowledgeTerm } from './knowledge-graph';
import { topicsForLesson } from './standards-data';
import Formula from './formula';

export function ContextTerm({item,onLesson}:{item:KnowledgeTerm;onLesson:(id:string)=>void}){
  return <details className="context-term"><summary>{item.term}{item.unit&&<small>{item.unit}</small>}</summary><p>{item.definition}</p>{item.formulaTex?<div className="term-formula"><Formula tex={item.formulaTex} block />{item.formulaNote&&<small>{item.formulaNote}</small>}</div>:item.formula&&<p className="term-formula">{item.formula}</p>}{item.contrast&&<p><strong>Keep the distinction:</strong> {item.contrast}</p>}<div className="term-lesson-links">{lessonsForTerm(item.term).slice(0,3).map(lesson=><button type="button" key={lesson.id} onClick={()=>onLesson(lesson.id)}>{lesson.title}<ArrowRight size={15}/></button>)}</div></details>;
}
export function LessonTerms({lessonId,onLesson}:{lessonId:string;onLesson:(id:string)=>void}){
  const terms=lessonKnowledge[lessonId].terms;
  if(!terms.length)return null;
  return <details className="lesson-terms"><summary>Terms and distinctions <span>{terms.length} linked terms</span></summary><div className="context-term-list">{terms.map(item=><ContextTerm key={item.term} item={item} onLesson={onLesson}/>)}</div></details>;
}
export function StandardsLearning({text,lessonId,relevantOnly=false}:{text:string;lessonId:string;relevantOnly?:boolean}){
  const topics=topicsForLesson(text,lessonId);
  const isFoundation=topics.length===1&&topics[0].id==='basic-protection';
  if (isFoundation && relevantOnly) return null;
  if(isFoundation){const topic=topics[0];return <details className="standards-learning standards-baseline"><summary><ShieldCheck size={18}/><span><strong>Core safety connection</strong><small>{topic.reference}</small></span></summary><div className="standards-baseline-body"><p>{topic.principle}</p><p>{topic.example}</p></div></details>;}
  return <section className="standards-learning" aria-label="Standard to know"><header className="standards-heading"><span className="overview-section-icon"><ShieldCheck size={20}/></span><div><span className="eyebrow neutral">Standard to know</span><h2>{topics.length===1?topics[0].title:`${topics.length} connected requirements`}</h2></div></header>
    {topics.map(topic=><article className="standard-topic" key={topic.id}><small>{topic.reference}</small>{topics.length>1&&<h3>{topic.title}</h3>}<p>{topic.principle}</p><div className="standard-example"><strong>Apply it:</strong> {topic.example}</div><details><summary>Why it matters</summary><p>{topic.why}</p><p><strong>Avoid:</strong> {topic.mistake}</p><p><strong>Verify:</strong> {topic.verify}</p></details></article>)}
  </section>;
}
