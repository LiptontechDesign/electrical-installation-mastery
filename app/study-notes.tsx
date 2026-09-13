import notes from './lesson-study-notes.json';
import LearningText from './learning-text';
import Formula from './formula';

type StudyNote = { principle: string; reasoning?: string; application?: string; distinction?: string; workingTex?: string };
const studyNotes: Record<string, StudyNote[]> = notes;
export default function StudyNotes({ lessonId }: { lessonId: string }) {
  return <div className="overview-support-body">{(studyNotes[lessonId] ?? []).map((note, index) => <article key={index}><h3><LearningText text={note.principle}/></h3>{note.reasoning&&<p><LearningText text={note.reasoning}/></p>}{note.workingTex&&<Formula tex={note.workingTex} block/>}{note.distinction&&<p><strong>Distinction:</strong> <LearningText text={note.distinction}/></p>}{note.application&&<p><strong>Application:</strong> <LearningText text={note.application}/></p>}</article>)}</div>;
}
