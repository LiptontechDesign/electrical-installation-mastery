import index from './integrated-video-index.json';
import { integratedTeaching } from './integrated-content';
import type { CurriculumLesson } from './course-curriculum';
import { formatVideoDuration } from './course-extension/builders';

export const integratedLessons: CurriculumLesson[] = index.map(video=>{
  const content=integratedTeaching[video.id];
  if(!content) throw new Error('Missing authored transcript lesson: '+video.id);
  return {id:video.id,videoId:video.videoId,title:video.title,instructor:video.instructor,
    durationSeconds:video.durationSeconds,duration:'≈ '+formatVideoDuration(video.durationSeconds),
    number:0,url:'https://www.youtube.com/watch?v='+video.videoId,topic:video.topic,layer:'WHY',
    sourceKind:video.instructor==='St John Ambulance'?'Professional body':['Schneider Electric','AutomationDirect','Bentley EasyPower / ABB presenter'].includes(video.instructor)?'Manufacturer or trade specialist':'Educator',prerequisite:'',rationale:content.model,regulationSensitive:true,
    regulationStatus:content.note??'Apply current local requirements and the exact manufacturer instructions. Video examples do not establish Kenyan regulatory approval.'};
});
export const integratedGuides=Object.fromEntries(Object.entries(integratedTeaching).map(([id,t])=>[id,{
  summary:t.model,keyConcepts:t.ideas,remember:t.ideas[t.ideas.length-1],
  practicalConnection:t.practice,checkYourself:t.retrieval.prompt,
}]));
