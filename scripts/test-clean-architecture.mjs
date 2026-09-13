import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {build} from 'esbuild';
const retired=/assessment-data|assessment-panel|checkpoint-plan|checkpoint-questions|checkpoint-workspace|question-authoring|question-revisions|recall-distractors|recall-extras|supplied-assessments|professional-flashcard-revisions|simulation-assessments|answer-teaching|concept-distractors|connection-assessments|standards-checks|learning-design/;
async function walk(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(item=>item.isDirectory()?walk(dir+'/'+item.name):dir+'/'+item.name))).flat();}
for(const file of (await walk('app')).filter(f=>/\.[jt]sx?$/.test(f))){
 const source=await readFile(file,'utf8');
 assert.ok(!/I remembered this|application-reflection|Show this again later/.test(source),file+': retired recall controls');
 assert.ok(!retired.test(file),file+' retired');
 for(const match of source.matchAll(/(?:from\s*|import\s*\()\s*['"]([^'"]+)/g))assert.ok(!retired.test(match[1]),file+': '+match[1]);
}
const app=await readFile('app/course-app.tsx','utf8');
assert.match(app,/type View = 'home' \| 'learn' \| 'books'/);
assert.ok(!/AssessmentPanel|assessmentBank|completedCheckpointIds|lessonQuiz|moduleQuiz|checkpointQuiz|flashcardProgress|LessonTab|assessmentMode|navigate\(['"](?:toolkit|progress)/.test(app));
const bundle=await build({entryPoints:['app/course-app.tsx'],bundle:true,platform:'node',format:'esm',packages:'external',jsx:'automatic',write:false,metafile:true});
for(const file of Object.keys(bundle.metafile.inputs))assert.ok(!retired.test(file),'No retired engine in app bundle: '+file);
assert.ok(!bundle.outputFiles[0].text.includes('buildAssessmentBank'));
console.log('PASS: Home/Learn/Books navigation, no orphan engine imports and no old assessment generator in application bundle.');
