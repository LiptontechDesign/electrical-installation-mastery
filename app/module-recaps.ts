import course from './course-curriculum';
import {checkpointPlan} from './checkpoint-plan';
import {foundationRecaps} from './module-recap-content';
import {applicationRecaps} from './module-recap-applications';
import provenance from './module-recap-sources.json';

const copy = {...foundationRecaps,...applicationRecaps};
const sources: Record<string,{transcript:boolean;sha256:string|null;file:string|null}> = provenance;
export const recapBooks = course.modules.map(module => {
  let from = 0;
  const chapters = checkpointPlan[module.id].map((chapter,index) => {
    const end = module.lessons.findIndex(lesson => lesson.id === chapter.throughLessonId);
    const chapterCopy = copy[chapter.recapKey ?? chapter.throughLessonId];
    if(end < from || !chapterCopy) throw new Error('Missing recap chapter: '+chapter.throughLessonId);
    const lessons = module.lessons.slice(from,end+1).map(lesson => {
      const source=sources[lesson.videoId];
      if(!source)throw new Error('Missing recap source: '+lesson.id);
      return {id:lesson.id,number:lesson.number,title:lesson.title,url:lesson.url,...source};
    });
    from=end+1;
    return {id:chapter.throughLessonId,number:index+1,title:chapter.title,lessons,...chapterCopy};
  });
  if(from!==module.lessons.length)throw new Error('Incomplete recap coverage: '+module.id);
  return {id:module.id,number:module.number,title:module.title,chapters,lessonCount:module.lessons.length};
});
export type RecapBook = typeof recapBooks[number];
export type RecapChapter = RecapBook['chapters'][number];
export const recapSafety = 'Revision from the supplied videos, not a stand-alone work procedure or proof of competence. Video-era UK rules and product examples are not current local approval: use the applicable requirements, manufacturer instructions and competent supervision for actual work.';
