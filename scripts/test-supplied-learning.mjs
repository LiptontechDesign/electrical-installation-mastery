import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const teaching=JSON.parse(await readFile('app/supplied-teaching.json','utf8'));
for(const [id,item] of Object.entries(teaching)){
 assert.ok(item.model.length>30,id);
 assert.ok(item.ideas.length>=3,id);
 assert.ok(item.retrieval.answer.length>10,id);
 assert.ok(item.explanations.every(note=>note.principle&&note.reasoning),id);
 assert.ok(!('questions' in item),id);
}
assert.equal(Object.keys(teaching).length,50);
console.log('PASS: 50 supplied teaching entries preserve explanations without an assessment bank.');
