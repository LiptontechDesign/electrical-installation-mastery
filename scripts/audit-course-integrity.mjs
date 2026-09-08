import {writeFileSync,mkdirSync} from 'node:fs';
import {build} from 'esbuild';
await build({entryPoints:['app/course-curriculum.ts','app/assessment-data.ts','app/lesson-guides.ts','app/module-recaps.ts'],outdir:'work/integrity-audit',bundle:true,platform:'node',format:'esm'});
const {default:course}=await import('../work/integrity-audit/course-curriculum.js');
const {buildAssessmentBank}=await import('../work/integrity-audit/assessment-data.js');
const {lessonGuides}=await import('../work/integrity-audit/lesson-guides.js');
const {recapBooks}=await import('../work/integrity-audit/module-recaps.js');
const lessons=course.modules.flatMap(module=>module.lessons.map(lesson=>({...lesson,moduleId:module.id})));
const bank=buildAssessmentBank(course.modules,lessonGuides);
const questions=Object.values(bank.lessons).flatMap(a=>a.questions);
const cards=Object.values(bank.lessons).flatMap(a=>a.flashcards);
const normal=text=>text.toLowerCase().normalize('NFKC').replace(/[^a-z0-9]+/g,' ').trim();
function duplicates(items,key,identify){
 const grouped=new Map();
 for(const item of items){const k=key(item);if(!k)continue;grouped.set(k,[...(grouped.get(k)||[]),identify(item)]);}
 return [...grouped].filter(([,items])=>items.length>1).map(([value,occurrences])=>({value,occurrences}));
}
const canonicalDuplicates={
 lessonIds:duplicates(lessons,l=>l.id,l=>l.moduleId),
 videoIds:duplicates(lessons,l=>l.videoId,l=>({id:l.id,moduleId:l.moduleId})),
 titles:duplicates(lessons,l=>normal(l.title),l=>({id:l.id,moduleId:l.moduleId})),
};
const questionDuplicates=duplicates(questions,q=>normal(q.prompt),q=>({id:q.id,lessonId:q.lessonId,answer:q.options[q.answer]}));
const cardDuplicates=duplicates(cards,c=>normal(c.front),c=>({id:c.id,lessonId:c.lessonId,back:c.back}));
const answerLeaks=questions.filter(q=>normal(q.options[q.answer]).length>18&&normal(q.prompt).includes(normal(q.options[q.answer]))).map(q=>({id:q.id,prompt:q.prompt,answer:q.options[q.answer]}));
const similarLessons=[];
for(let i=0;i<lessons.length;i++)for(let j=i+1;j<lessons.length;j++){
 const a=new Set(normal(lessons[i].title).split(' ').filter(w=>w.length>3)),b=new Set(normal(lessons[j].title).split(' ').filter(w=>w.length>3));
 const common=[...a].filter(w=>b.has(w)).length,score=common/new Set([...a,...b]).size;
 if(score>=.65)similarLessons.push({first:lessons[i].id,second:lessons[j].id,firstTitle:lessons[i].title,secondTitle:lessons[j].title,score:Number(score.toFixed(2))});
}
const report={
 generatedAt:new Date().toISOString(),lessons:lessons.length,modules:course.modules.length,questions:questions.length,flashcards:cards.length,
 canonicalDuplicates,questionDuplicates,cardDuplicates,answerLeaks,similarLessons,
 repeatedQuestionCategories:{
   glossary:questionDuplicates.filter(g=>g.occurrences.every(q=>q.id.includes('-q-term-'))).length,
   standards:questionDuplicates.filter(g=>g.occurrences.every(q=>q.id.endsWith('-q-standard'))).length,
   other:questionDuplicates.filter(g=>!g.occurrences.every(q=>q.id.includes('-q-term-'))&&!g.occurrences.every(q=>q.id.endsWith('-q-standard'))).length,
 },
 editorialStatus:'Twenty questions and their linked cards were individually revised in the recap/editorial passes: eleven core items and nine foundation vocabulary items. Remaining repeated glossary and standards stems are disclosed, not disguised by inserting lesson titles. A complete bespoke rewrite of inherited assessment content remains outstanding.',
 moduleFlow:course.modules.map(m=>({id:m.id,title:m.title,lessons:m.lessons.length,chapters:recapBooks.find(b=>b.id===m.id).chapters.map(c=>({title:c.title,lessons:c.lessons.map(l=>l.id)}))})),
 interpretation:'Canonical lesson/video duplicates are errors. Similar titles are review candidates, not proof of duplication. Checkpoints and module revision deliberately reuse canonical assessment items and are excluded from duplicate-question counting.',
};
mkdirSync('docs',{recursive:true});
writeFileSync('docs/course-integrity-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({lessons:report.lessons,canonicalDuplicates,questionDuplicateGroups:questionDuplicates.length,cardDuplicateGroups:cardDuplicates.length,answerLeaks,similarLessons},null,2));
if(Object.values(canonicalDuplicates).some(items=>items.length)||answerLeaks.length)process.exitCode=1;
