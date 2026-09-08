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
  localStorage:{getItem:()=>saved,setItem:(_,value)=>{saved=value;}},
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
const mode=()=>tree.root.findAllByType('button').find(node=>node.props.role==='switch'&&text(node).includes('Browse freely'));
const state=()=>JSON.parse(saved);
const mount=async()=>{await act(async()=>{tree=create(h(App));});await flush();};
await mount();
assert.equal(state().freeBrowseEnabled,false,'Existing users retain guided mode');
const modules=()=>tree.root.findAllByType('button').filter(node=>node.props.className==='module-card');
await click(modules().at(-1));
assert.equal(state().activeLessonId,'p01-l01','Guided mode blocks a distant module');
await click(mode());
assert.equal(state().freeBrowseEnabled,true);
await click(button('Home'));
await click(modules().at(-1));
const distant=state().activeLessonId;
assert.notEqual(distant,'p01-l01','Free mode opens requested distant module');
assert.deepEqual(state().completedLessonIds,[],'Opening a video does not mark it watched');
assert.deepEqual(state().completedCheckpointIds,[],'Skipping does not pass checkpoints');
await act(async()=>tree.unmount());
await mount();
assert.equal(state().activeLessonId,distant,'Reload preserves free-mode deep link');
assert.equal(mode().props['aria-checked'],true,'Preference is restored');
await click(button('Resume unfinished work'));
assert.equal(state().activeLessonId,'p01-l01','Resume returns to earliest unfinished video');
await click(mode());
assert.equal(state().freeBrowseEnabled,false);
assert.deepEqual(state().completedLessonIds,[]);
await act(async()=>tree.unmount());
saved=JSON.stringify({...state(),freeBrowseEnabled:'true'});
window.location.hash='#learn/'+distant;
await mount();
assert.equal(state().freeBrowseEnabled,false,'Malformed preference cannot bypass guided mode');
assert.equal(state().activeLessonId,'p01-l01','Guided deep links respect checkpoints');
await act(async()=>tree.unmount());
console.log('Navigation: guided/free selection, distant modules, reload, resume and unchanged completion passed.');
