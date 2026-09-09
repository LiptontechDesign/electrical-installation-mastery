import {build} from 'esbuild';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
await build({entryPoints:['app/course-curriculum.ts','app/assessment-data.ts','app/lesson-guides.ts'],outdir:'work/editorial-export',bundle:true,platform:'node',format:'esm'});
const {default:course}=await import('../work/editorial-export/course-curriculum.js');
const {buildAssessmentBank}=await import('../work/editorial-export/assessment-data.js');
const {lessonGuides}=await import('../work/editorial-export/lesson-guides.js');
const bank=buildAssessmentBank(course.modules,lessonGuides);
const manifest=JSON.parse(readFileSync('course-transcripts/manifest.json','utf8'));
const output=resolve('../assessment-editorial-research');
mkdirSync(output,{recursive:true});
for(const module of course.modules){
 const lessons=module.lessons.map(lesson=>{
  const source=manifest.videos.find(v=>v.video_id===lesson.videoId);
  return {lesson,guide:lessonGuides[lesson.id],assessment:bank.lessons[lesson.id],source,transcriptPath:source?.output_file?resolve('course-transcripts',source.output_file):null};
 });
 writeFileSync(resolve(output,module.id+'.json'),JSON.stringify({id:module.id,title:module.title,lessons},null,2));
}
console.log('Exported 16 source-linked assessment packets to '+output);
