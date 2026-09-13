import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sources=JSON.parse(await readFile('app/module-recap-sources.json','utf8'));
let count=0;
for(const [id,source] of Object.entries(sources)){
 if(!source.transcript)continue;
 const text=(await readFile('course-transcripts/'+source.file,'utf8')).replaceAll('\r\n','\n');
 assert.equal(createHash('sha256').update(text).digest('hex'),source.sha256,id);
 count++;
}
assert.ok(count>=295);
console.log('PASS: '+count+' supplied transcript fingerprints match their recorded sources.');
