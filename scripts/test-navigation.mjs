import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { act, create } from 'react-test-renderer';

await mkdir('work/navigation-tests', {recursive:true});
await build({
  entryPoints:['app/course-app.tsx'], outfile:'work/navigation-tests/app.mjs',
  bundle:true, platform:'node', format:'esm', packages:'external', jsx:'automatic',
  plugins:[{name:'non-navigation-ui',setup(b){
    b.onResolve({filter:/^(next\/(script|dynamic|image)|\.\/(lesson-overview|assessment-panel|checkpoint-workspace))$/},args=>({path:args.path,namespace:'stub'}));
    b.onLoad({filter:/.*/,namespace:'stub'},args=>({contents:args.path==='next/dynamic'?'export default () => () => null':'export default () => null',loader:'js'}));
  }}],
});
const {default:App}=await import('../work/navigation-tests/app.mjs');
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let saved=null, tree;
const timers=new Map(); let timerId=0;
globalThis.document={hidden:false,fullscreenElement:null,addEventListener(){},removeEventListener(){},querySelector(){return null;}};
globalThis.window={
  location:{hash:'',origin:'http://localhost:3000'},
  localStorage:{getItem:key=>key==='electrical-mastery-progress-v1'?saved:null,setItem:(_,value)=>{saved=value;}},
  history:{replaceState:(_,__,hash)=>{window.location.hash=hash;}},
  scrollTo(){},addEventListener(){},removeEventListener(){},
  setTimeout(fn,delay){const id=++timerId;if(!delay)timers.set(id,fn);return id;},
  clearTimeout(id){timers.delete(id);},setInterval(){return 1;},clearInterval(){},
  matchMedia:()=>({matches:false}),
};
const flush=async()=>{for(let i=0;i<5&&timers.size;i++)await act(async()=>{const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn());});};
const text=node=>typeof node==='string'?node:Array.isArray(node)?node.map(text).join(''):node?.children?text(node.children):'';
const click=async node=>{assert.ok(node,'Control exists');await act(async()=>node.props.onClick());await flush();};
const button=label=>tree.root.findAllByType('button').find(node=>text(node).includes(label));
const state=()=>JSON.parse(saved);
const mount=async()=>{await act(async()=>{tree=create(h(App));});await flush();};
await mount();
assert.equal(button('Browse freely'),undefined,'No mode toggle is needed');
const modules=()=>tree.root.findAllByType('button').filter(node=>node.props.className==='module-card');
await click(modules().at(-1));
const distant=state().activeLessonId;
assert.notEqual(distant,'p01-l01','A distant module opens without prior progress');
assert.deepEqual(state().completedLessonIds,[],'Opening a lesson is not completion');
assert.deepEqual(state().completedCheckpointIds,[],'Navigation cannot award passes');
await click(button('Mark video watched'));
assert.deepEqual(state().completedLessonIds,[distant]);
assert.equal(state().videoCompletionCounts[distant],1);
await click(button('Watched · Undo'));
assert.deepEqual(state().completedLessonIds,[]);
assert.equal(state().videoCompletionCounts[distant],1,'Undo keeps historical event count');
await click(button('Mark video watched'));
assert.equal(state().completedLessonIds.length,1);
assert.equal(state().videoCompletionCounts[distant],2,'Repeated completion does not inflate unique progress');
await click(button('Checkpoint 1:'));
let checkpoint=tree.root.findAll(node=>Boolean(node.props.checkpoint&&node.props.onComplete))[0];
assert.ok(checkpoint,'An unwatched checkpoint opens directly');
const checkpointId=checkpoint.props.checkpoint.id,total=checkpoint.props.checkpoint.questions.length;
await act(async()=>checkpoint.props.onComplete(0,total));
await flush();
assert.ok(!state().completedCheckpointIds.includes(checkpointId),'Failure remains an attempt, not a pass');
assert.equal(state().quizRecords['checkpoint:'+checkpointId].attempts,1);
await act(async()=>checkpoint.props.onContinue());
await flush();
assert.ok(!tree.root.findAll(node=>Boolean(node.props.checkpoint&&node.props.onComplete)).length,'Continue works without passing');
window.location.hash='#checkpoint/'+checkpointId;
await act(async()=>tree.unmount());
await mount();
checkpoint=tree.root.findAll(node=>Boolean(node.props.checkpoint&&node.props.onComplete))[0];
assert.equal(checkpoint.props.checkpoint.id,checkpointId,'Checkpoint deep link survives reload');
await act(async()=>checkpoint.props.onComplete(total,total));
await flush();
assert.ok(state().completedCheckpointIds.includes(checkpointId));
assert.equal(state().quizRecords['checkpoint:'+checkpointId].attempts,2);
assert.equal(state().completedLessonIds.length,1,'Passing does not mark other videos watched');
await click(button('Suggested next step'));
assert.equal(state().activeLessonId,'p01-l01','Suggested next is an explicit action');
await act(async()=>tree.unmount());
saved=JSON.stringify({...state(),freeBrowseEnabled:false});
window.location.hash='#learn/'+distant;
await mount();
assert.equal(state().activeLessonId,distant,'Old guided preferences cannot redirect deep links');
assert.equal(state().videoCompletionCounts[distant],2,'Counters persist');
await act(async()=>tree.unmount());
console.log('Flexible navigation, arbitrary checkpoints, independent passes, repeat counts, reload and old-backup migration passed.');
