import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const manifest=JSON.parse(readFileSync('course-transcripts/manifest.json','utf8'));
const sources={};
for(const video of manifest.videos){
 if(video.output_file){
  const bytes=readFileSync('course-transcripts/'+video.output_file);
  const digest=createHash('sha256').update(bytes.toString('utf8').replaceAll('\r\n','\n')).digest('hex');
  if(digest!==video.sha256)throw new Error('Transcript changed: '+video.video_id);
  sources[video.video_id]={transcript:true,sha256:digest,file:video.output_file};
 }else{
  sources[video.video_id]={transcript:false,sha256:null,file:null};
 }
}
// Mechanical provenance export only; this script does not write learning copy.
writeFileSync('app/module-recap-sources.json',JSON.stringify(sources,null,2)+'\n');
console.log('Verified source records:',Object.keys(sources).length);
