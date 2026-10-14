import { studyNoteFor } from './course-curriculum';
import type { LearningSection } from './learning-sections';

export default function LessonStudyContext({ id, section, introduction }: { id: string; section?: LearningSection; introduction?: string }) {
  const note = studyNoteFor(id);
  if (!introduction && !note && !section?.resource) return null;
  return <div className="lesson-section-introduction">
    {introduction && <p>{introduction}</p>}
    {note && <p>{note}</p>}
    {section?.resource && <p><a href={section.resource.href} download>{section.resource.label}</a></p>}
  </div>;
}
