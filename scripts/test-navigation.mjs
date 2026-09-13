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
    b.onResolve({filter:/^(next\/(script|dynamic|image)|\.\/(lesson-overview))$/},args=>({path:args.path,namespace:'stub'}));
    b.onLoad({filter:/.*/,namespace:'stub'},args=>({contents:args.path==='next/dynamic'?'export default () => () => null':'export default () => null',loader:'js'}));
  }}],
});
const {default:App}=await import('../work/navigation-tests/app.mjs');
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let saved=null, tree, narrowViewport=false;
const timers=new Map(); let timerId=0;
globalThis.document={hidden:false,fullscreenElement:null,addEventListener(){},removeEventListener(){},querySelector(){return null;}};
globalThis.window={
  location:{hash:'',origin:'http://localhost:3000'},
  localStorage:{getItem:key=>key==='electrical-mastery-progress-v1'?saved:null,setItem:(_,value)=>{saved=value;}},
  history:{replaceState:(_,__,hash)=>{window.location.hash=hash;}},
  scrollTo(){},addEventListener(){},removeEventListener(){},
  setTimeout(fn,delay){const id=++timerId;if(!delay)timers.set(id,fn);return id;},
  clearTimeout(id){timers.delete(id);},setInterval(){return 1;},clearInterval(){},
  matchMedia:query=>({matches:narrowViewport&&query.includes('max-width: 1180px')}),
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
assert.ok(tree.root.findAllByProps({'aria-current':'page'}).some(node=>node.type==='button'),'Current lesson is identified in the course map');
const learnPage=()=>tree.root.findByProps({className:tree.root.findAll(node=>typeof node.props.className==='string'&&node.props.className.startsWith('learn-page'))[0].props.className});
await click(tree.root.findAllByProps({'aria-label':'Close course map'})[0]);
assert.match(learnPage().props.className,/course-map-collapsed/,'Wide course map can be closed');
await click(button('Course map'));
assert.doesNotMatch(learnPage().props.className,/course-map-collapsed/,'Wide course map can be reopened');
narrowViewport=true;
await click(button('Course map'));
assert.match(tree.root.findByProps({'aria-label':'Course modules'}).props.className,/drawer-open/,'Narrow course map opens as a drawer');
await click(tree.root.findAllByProps({'aria-label':'Close course map'})[0]);
assert.doesNotMatch(tree.root.findByProps({'aria-label':'Course modules'}).props.className,/drawer-open/,'Narrow course map can be closed');
narrowViewport=false;
const distant=state().activeLessonId;
assert.notEqual(distant,'p01-l01','A distant module opens without prior progress');
assert.deepEqual(state().completedLessonIds,[],'Opening a lesson is not completion');
assert.equal(state().schemaVersion,7); assert.ok(!('completedCheckpointIds' in state()));
await click(button('Mark video watched'));
assert.deepEqual(state().completedLessonIds,[distant]);
assert.equal(state().videoCompletionCounts[distant],1);
await click(button('Watched · Undo'));
assert.deepEqual(state().completedLessonIds,[]);
assert.equal(state().videoCompletionCounts[distant],1,'Undo keeps historical event count');
await click(button('Mark video watched'));
assert.equal(state().completedLessonIds.length,1);
assert.equal(state().videoCompletionCounts[distant],2,'Repeated completion does not inflate unique progress');
const note=tree.root.findByProps({'aria-label':'Your lesson notes'});
await act(async()=>note.props.onChange({target:{value:'Preserved study note'}}));await flush();
assert.equal(state().notes[distant],'Preserved study note');
await click(button('Save lesson'));assert.ok(state().bookmarkedLessonIds.includes(distant));
assert.equal(tree.root.findAllByProps({role:'tablist'}).length,0,'No quiz tab');
assert.ok(!text(tree.toJSON()).includes('Checkpoint'));
await click(button('Suggested next step'));
assert.equal(state().activeLessonId,'p01-l01','Suggested next is an explicit action');
await act(async()=>tree.unmount());
saved=JSON.stringify({...state(),freeBrowseEnabled:false});
window.location.hash='#learn/'+distant;
await mount();
assert.equal(state().activeLessonId,distant,'Old guided preferences cannot redirect deep links');
assert.equal(state().videoCompletionCounts[distant],2,'Counters persist');
await act(async()=>tree.unmount());
console.log('PASS: flexible lesson navigation, watched/undo/replay, suggested next, reload and saved notes.');
