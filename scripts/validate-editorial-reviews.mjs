import {readFileSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
import katex from 'katex';

// Validate evidence and completeness, not merely the presence of rewritten text.
const directory=resolve('../assessment-editorial-research');
const packets=readdirSync(directory).filter(name=>/^module-\d+\.json$/.test(name)).map(name=>JSON.parse(readFileSync(resolve(directory,name),'utf8')));
const questions=new Map(),cards=new Map(),sources=new Map();
for(const packet of packets)for(const entry of packet.lessons){
 for(const question of entry.assessment.questions)questions.set(question.id,question);
 for(const card of entry.assessment.flashcards)cards.set(card.id,card);
 if(entry.transcriptPath)sources.set(entry.lesson.videoId,readFileSync(entry.transcriptPath,'utf8'));
}
const normalized=text=>text.normalize('NFKC').replace(/\s+/g,' ').trim().toLowerCase();
const seenQuestions=new Set(),seenCards=new Set();
let rewrittenQuestions=0,rewrittenCards=0;
for(const name of readdirSync(directory).filter(name=>/^review-\d+\.json$/.test(name))){
 const review=JSON.parse(readFileSync(resolve(directory,name),'utf8'));
 for(const [field,bank,seen] of [['questions',questions,seenQuestions],['cards',cards,seenCards]]){
  for(const item of review[field]){
   assert(bank.has(item.id),`Unknown ${field} ID: ${item.id}`);
   assert(!seen.has(item.id),`Duplicate review: ${item.id}`);seen.add(item.id);
   assert(['retained','rewritten'].includes(item.status),`Missing explicit verdict: ${item.id}`);
   assert(item.reason?.trim().length>20,`Missing editorial reason: ${item.id}`);
   const evidence=item.sourceEvidence;
   assert(evidence?.excerpt?.trim(),`Missing source evidence: ${item.id}`);
   const source=sources.get(evidence.videoId);
   assert(source&&normalized(source).includes(normalized(evidence.excerpt)),`Evidence not found in transcript: ${item.id}`);
   if(item.status==='retained')continue;
   if(field==='cards'){
    assert(item.front?.trim()&&item.back?.trim(),`Incomplete card: ${item.id}`);rewrittenCards++;continue;
   }
   const r=item.revision;
   assert(r?.prompt?.trim().endsWith('?'),`Missing question: ${item.id}`);
   assert(r.wrong?.length===3&&r.errors?.length===3,`Expected three distractors and diagnoses: ${item.id}`);
   assert(new Set([r.correct,...r.wrong].map(normalized)).size===4,`Repeated option: ${item.id}`);
   assert(new Set(r.errors.map(normalized)).size===3,`Repeated diagnosis: ${item.id}`);
   for(const key of ['correct','why','distinction','practice'])assert(r[key]?.trim(),`Missing ${key}: ${item.id}`);
   for(const key of ['prompt','answer','why'])assert(r.followUp?.[key]?.trim(),`Missing follow-up ${key}: ${item.id}`);
   for(const tex of [r.workingTex,r.followUp.workingTex].filter(Boolean))katex.renderToString(tex,{throwOnError:true});
   rewrittenQuestions++;
  }
 }
}
const missingQuestions=[...questions.keys()].filter(id=>!seenQuestions.has(id));
const missingCards=[...cards.keys()].filter(id=>!seenCards.has(id));
console.log(JSON.stringify({reviewedQuestions:seenQuestions.size,totalQuestions:questions.size,rewrittenQuestions,reviewedCards:seenCards.size,totalCards:cards.size,rewrittenCards,remainingQuestions:missingQuestions.length,remainingCards:missingCards.length},null,2));
if(process.argv.includes('--complete'))assert(!missingQuestions.length&&!missingCards.length,'Course-wide editorial review remains incomplete');
