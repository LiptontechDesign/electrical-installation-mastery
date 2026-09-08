import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const manifest=JSON.parse(await readFile(new URL('../course-transcripts/manifest.json',import.meta.url),'utf8'));
const directory=new URL('../public/recap-transcripts/',import.meta.url);
await mkdir(directory,{recursive:true});
for(const video of manifest.videos){
 if(!video.output_file)continue;
 const text=(await readFile(resolve(fileURLToPath(new URL('../course-transcripts/',import.meta.url)),video.output_file),'utf8')).replaceAll('\r\n','\n');
 if(createHash('sha256').update(text).digest('hex')!==video.sha256)throw new Error('Transcript fingerprint mismatch: '+video.video_id);
 // Preserve the supplied source verbatim, including timestamps where present.
 await writeFile(new URL(video.video_id+'.json',directory),JSON.stringify({title:video.title,text,sha256:video.sha256}));
}
console.log('Complete supplied recap transcripts prepared.');
