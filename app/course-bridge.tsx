import { BookOpen, ChevronDown, ArrowRight } from 'lucide-react';
import Formula from './formula';
import { courseBridges } from './course-bridge-data';

export default function CourseBridge({lessonId}:{lessonId:string}) {
  const note=courseBridges[lessonId];
  if(!note)return null;
  return <details className="course-bridge">
    <summary><BookOpen size={20} aria-hidden="true"/><span><small>Connect the ideas · course-authored</small><strong>{note.title}</strong></span><ChevronDown size={18} aria-hidden="true"/></summary>
    <div className="course-bridge-body">
      <p className="course-bridge-lead">{note.lead}</p>
      {note.flow&&<ol className="course-bridge-flow" aria-label="Concept sequence">{note.flow.map((step,i)=><li key={step}><span>{step}</span>{i<note.flow!.length-1&&<ArrowRight size={18} aria-hidden="true"/>}</li>)}</ol>}
      <div className="course-bridge-grid"><dl>{note.rows.map(([term,meaning])=><div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>
        <section className="course-bridge-example"><h3>Connect it to a job</h3><p>{note.example}</p>{note.formula&&<Formula tex={note.formula} block/>}
          <h4>Explain it back</h4><p>{note.prompt}</p><details><summary>Reveal the explanation</summary><p>{note.answer}</p></details>
        </section>
      </div>
      {note.caution&&<aside className="course-bridge-caution"><strong>Before applying this</strong><p>{note.caution}</p></aside>}
      <footer><small>Written course bridge, not a quotation from the instructor. Sources:</small><ul>{note.sources.map(source=><li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul></footer>
    </div>
  </details>;
}
