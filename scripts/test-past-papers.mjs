import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';
import katex from 'katex';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
await build({entryPoints:['app/past-papers/bank.ts','app/past-papers/sources.ts','app/past-papers/study-diagrams.ts','app/practice/study-markdown.tsx'],outdir:'work/past-paper-tests',bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic'});
const {questions,questionsFor,filterQuestions,compilationMarkdown}=await import('../work/past-paper-tests/past-papers/bank.js');
const {papers,references}=await import('../work/past-paper-tests/past-papers/sources.js');
const {diagrams}=await import('../work/past-paper-tests/past-papers/study-diagrams.js');
const {default:StudyMarkdown}=await import('../work/past-paper-tests/practice/study-markdown.js');
const defs=JSON.parse(fs.readFileSync('app/practice/definitions.json','utf8'));
assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
assert.equal(questions.length,87);
assert.equal(papers.length,10);assert.equal(papers.filter(p=>p.path==='C1').length,8);assert.equal(papers.filter(p=>p.path==='C2').length,2);
let maths=0;
for(const q of questions){
 assert.ok(q.occurrences.length,q.id+' missing researched occurrence');
 assert.ok(q.prompt.length>30&&q.answer.length>200&&q.breakdown.length>=2&&q.terms.length>=2&&q.check.length>=2,q.id+' lacks teaching structure');
 for(const o of q.occurrences)assert.ok(papers.some(p=>p.id===o.paperId),q.id+' unknown paper');
 for(const r of q.referenceIds)assert.ok(references[r],q.id+' unknown reference');
 for(const t of q.terms)if(t.definitionId)assert.ok(defs.some(d=>d.id===t.definitionId),q.id+' unknown definition');
 const text=[q.prompt,q.answer,...q.breakdown,...q.check,...q.terms.flatMap(t=>[t.term,t.meaning])].join('\n');
 assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text),q.id+' invalid control character');
 assert.ok(!/old answer key|public solution|source’s (?:[0-9]|solution)|OCR|unreadable|historical MCQ|2022 solution|Some papers/.test(text),q.id+' distracting provenance or correction commentary');
 for(const m of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^\n$]*?)\$/g)){
  const v=m[1]??m[2];katex.renderToString(v,{throwOnError:true,strict:'error'});maths++;
  assert.ok(!/Ssqrt|Scos|Ssin|\\tanphi|\^circ|_ble|_nle|(?<![\\a-z])cosphi/.test(v),q.id+' malformed math');
 }
 const html=renderToStaticMarkup(React.createElement(StudyMarkdown,{prefix:q.id},q.answer));
 assert.ok(!html.includes('katex-error'),q.id+' actual Markdown rendering contains failed math');
 if(q.diagram){assert.ok(diagrams[q.diagram]);const svg=fs.readFileSync('public/past-paper-diagrams/'+q.diagram+'.svg','utf8');assert.ok(svg.includes('<title')&&svg.includes('<desc')&&svg.includes('</svg>'));}
}
assert.equal(Object.keys(diagrams).length,12);
assert.ok(questionsFor('C2').some(q=>q.id==='domestic-supply'));
assert.ok(!questionsFor('C2').some(q=>q.id==='four-storey-design'));
assert.ok(questionsFor('C1').some(q=>q.id==='four-storey-design'));
assert.ok(filterQuestions('C1','CAPACITOR 81.19').some(q=>q.id==='single-phase-capacitors'));
assert.equal(filterQuestions('C2','no-such-study-question').length,0);
assert.ok(filterQuestions('C1','','Motors and controls').every(q=>q.topic==='Motors and controls'));
const md=compilationMarkdown('C2',questionsFor('C2'),{'domestic-supply':'My example working'});
assert.ok(md.includes('My example working')&&md.includes('### Key terms')&&md.includes('### What the question asks'));
assert.ok(!/scribd|Related original|marking scheme|Paper:/.test(md));
// Independent calculations, including the error-prone capacitor, CT, load and motor-speed cases.
const near=(a,b,e=.0001)=>assert.ok(Math.abs(a-b)<e,`${a} != ${b}`);
const tanpf=pf=>Math.sqrt(1-pf*pf)/pf;
near(1000*tanpf(.7)/(2*Math.PI*50*200**2)*1e6,81.18525965);
near((10000/.84)*(tanpf(.7)-tanpf(.9))/(2*Math.PI*50*400**2)*1e6,126.917057);
near(100*(tanpf(.8)-tanpf(.97)),49.93763763);
const ahuP=Math.sqrt(3)*415*120*.7/1000;
near(ahuP*(tanpf(.7)-tanpf(.95)),41.75348476);
const S=Math.sqrt(3)*415*850/1000,P=.82*S,Q=S*Math.sqrt(1-.82**2),S2=Math.hypot(P,Q-100);
near((S-S2)*250,12799.47121,.01);
near(120*50/4,1500);near(120*60/4*(1-.05),1710);
near(7460/(.85*.8*Math.sqrt(3)*400),15.8346471);
near(100000/(Math.sqrt(3)*415)/.91,152.87972175);
const officeP=44.16+12*32*415/Math.sqrt(3)/1000+21+60/.9+72+24;
const officeQ=33.12+(60/.9)*tanpf(.75);
near(Math.hypot(officeP,officeQ)*1000/(Math.sqrt(3)*415),462.96331014);
const cap=questions.find(q=>q.id==='single-phase-capacitors').answer;
assert.ok(cap.includes('81.19')&&cap.includes('126.92'));
assert.ok(questions.find(q=>q.id==='ahu-compensation').answer.includes('41.7535'));
assert.ok(questions.find(q=>q.id==='motor-speed').answer.includes('1500 rpm'));
console.log(`Past papers: ${questions.length} questions (${questionsFor('C1').length} C1, ${questionsFor('C2').length} C2), ${maths} valid LaTeX expressions, 12 diagrams; content, filters, export and independent calculations passed.`);
