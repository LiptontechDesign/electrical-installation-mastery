import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
await build({entryPoints:['app/course-curriculum.ts','app/checkpoint-plan.ts','app/lesson-guides.ts'],outdir:'work/recap-source',bundle:true,platform:'node',format:'esm'});
const {default:course}=await import('../work/recap-source/course-curriculum.js');
const {checkpointPlan}=await import('../work/recap-source/checkpoint-plan.js');
const {lessonGuides}=await import('../work/recap-source/lesson-guides.js');
const manifest=JSON.parse(readFileSync('course-transcripts/manifest.json','utf8'));
const first=Number(process.argv[2]||1),last=Number(process.argv[3]||16);
for(const module of course.modules.filter(m=>m.number>=first&&m.number<=last)){
 console.log('\nMODULE',module.id,module.title);
 let start=0;
 for(const chapter of checkpointPlan[module.id]){
  const end=module.lessons.findIndex(l=>l.id===chapter.throughLessonId);
  console.log('\nCHAPTER',chapter.title);
  for(const lesson of module.lessons.slice(start,end+1)){
   const record=manifest.videos.find(v=>v.video_id===lesson.videoId);
   const guide=lessonGuides[lesson.id];
   console.log(lesson.id,lesson.title);
   if(!record?.output_file){console.log('VISUAL ONLY');continue;}
   const raw=readFileSync('course-transcripts/'+record.output_file,'utf8');
   const body=raw.split(/\n\[\d+:\d+/)[0].replace(/^#.*$/gm,'').trim();
   const words=body.split(/\s+/);
   const terms=new Set((guide.keyConcepts.join(' ')+' '+lesson.title).toLowerCase().match(/[a-z]{5,}/g));
   const windows=[];
   for(let i=0;i<words.length;i+=45){const sample=words.slice(i,i+85);windows.push({sample,score:new Set(sample.join(' ').toLowerCase().match(/[a-z]{5,}/g)?.filter(w=>terms.has(w))).size});}
   windows.sort((a,b)=>b.score-a.score);
   console.log('EVIDENCE:',windows[0]?.sample.join(' '));
  }
  start=end+1;
 }
}
