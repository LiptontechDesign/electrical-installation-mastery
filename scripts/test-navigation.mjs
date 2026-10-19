import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { act, create } from 'react-test-renderer';

await mkdir('work/navigation-tests', {recursive:true});
await build({
  entryPoints:['app/course-app.tsx'], outfile:'work/navigation-tests/app.mjs',
  bundle:true, platform:'node', format:'esm', packages:'external', jsx:'automatic',
  plugins:[{name:'non-navigation-ui',setup(b){
    b.onResolve({filter:/^next\/(script|dynamic|image|link)$/},args=>({path:args.path,namespace:'stub'}));
    b.onLoad({filter:/.*/,namespace:'stub'},args=>({contents:args.path==='next/link'?'export const useLinkStatus=()=>({pending:false}); import {createElement} from \"react\"; export default ({children,...props}) => createElement(\"a\",props,children)':args.path==='next/dynamic'?'export default () => () => null':'export default () => null',loader:'js',resolveDir:process.cwd()}));
  }}],
});
const {default:App}=await import('../work/navigation-tests/app.mjs');
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let saved=null, tree, narrowViewport=false;
const timers=new Map(); let timerId=0;
globalThis.document={hidden:false,fullscreenElement:null,addEventListener(){},removeEventListener(){},querySelector(){return null;},getElementById(){return null;}};
globalThis.window={
  location:{hash:'',origin:'http://localhost:3000'},
  localStorage:{getItem:key=>key==='electrical-mastery-progress-v1'?saved:null,setItem:(_,value)=>{saved=value;}},
  history:{replaceState:(_,__,hash)=>{window.location.hash=hash;}},
  scrollTo(){},requestAnimationFrame(fn){fn();return 1;},addEventListener(){},removeEventListener(){},
  setTimeout(fn,delay){const id=++timerId;if((delay??0)<=600)timers.set(id,fn);return id;},
  clearTimeout(id){timers.delete(id);},setInterval(){return 1;},clearInterval(){},
  matchMedia:query=>({matches:narrowViewport&&query.includes('max-width: 1180px')}),
};
const flush=async()=>{for(let i=0;i<5&&timers.size;i++)await act(async()=>{const pending=[...timers.values()];timers.clear();pending.forEach(fn=>fn());});};
const text=node=>typeof node==='string'?node:Array.isArray(node)?node.map(text).join(''):node?.children?text(node.children):'';
const click=async node=>{assert.ok(node,'Control exists');await act(async()=>node.props.onClick());await flush();};
const button=label=>tree.root.findAllByType('button').find(node=>text(node).includes(label));
const state=()=>JSON.parse(saved);
const mount=async()=>{await act(async()=>{tree=create(h(App,{user:{id:'test-user',email:'learner@example.com',name:'Test Learner',picture:null,isAdmin:false}}));});await flush();};
await mount();
const mobileNavigation=()=>tree.root.findByProps({'aria-label':'Mobile navigation'});
const mobileControls=()=>mobileNavigation().findAll(node=>node.type==='button'||node.type==='a');
assert.deepEqual(mobileControls().map(text),['Home','Learn','Books','Practice','Papers'],'Mobile destinations remain consistent and fit one bar');
assert.equal(mobileControls().filter(node=>node.props['aria-current']==='page').length,1,'One mobile destination is selected');
assert.equal(mobileControls().find(node=>text(node)==='Papers').props.href,'/past-papers/c2');
const beforeMobileNavigation=state();
await click(mobileControls().find(node=>text(node)==='Learn'));
assert.equal(mobileControls().find(node=>text(node)==='Learn').props['aria-current'],'page');
await click(mobileControls().find(node=>text(node)==='Books'));
assert.equal(window.location.hash,'#books','Books keeps in-app navigation');
await click(mobileControls().find(node=>text(node)==='Home'));
assert.equal(mobileControls().find(node=>text(node)==='Home').props['aria-current'],'page');
assert.deepEqual(state(),beforeMobileNavigation,'Switching mobile destinations does not change progress or notes');
await click(button('About this course'));
assert.equal(tree.root.findAllByProps({role:'tab'}).find(node=>text(node)==='About this course').props['aria-selected'],true);
await click(mobileControls().find(node=>text(node)==='Home'));
assert.ok(tree.root.findAllByType('h1').some(node=>text(node).includes('Welcome back')),'Home returns to the personal study workspace from About');
await click(mobileControls().find(node=>text(node)==='Learn'));
const beforeReselect = state();
await click(mobileControls().find(node=>text(node)==='Learn'));
assert.deepEqual(state(),beforeReselect,'Reselecting Learn preserves the active lesson and learning records');
await click(mobileControls().find(node=>text(node)==='Home'));

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
const beforeBrowsing=state();
const pathButton=label=>tree.root.findByProps({'aria-label':'Choose learning pathway'}).findAllByType('button').find(node=>text(node)===label);
const mapModules=()=>tree.root.findAllByType('section').filter(node=>typeof node.props.className==='string'&&node.props.className.startsWith('module-accordion'));
const moduleButton=number=>mapModules().find(node=>text(node).startsWith(number)).findAllByType('button')[0];
await click(pathButton('C1'));
assert.equal(pathButton('C1').props['aria-pressed'],true);
assert.equal(mobileControls().find(node=>text(node)==='Papers').props.href,'/past-papers/c1','Papers follows the browsed C1 course pathway');
assert.ok(mapModules().length>1&&mapModules().every(node=>node.props['data-pathway']==='C1'),'C1 shows its own module list');
assert.deepEqual(mapModules().map(node=>text(node.findByProps({className:'module-eyebrow'})).match(/^Module (\d+)/)[1]),Array.from({length:16},(_,i)=>String(i+1).padStart(2,'0')),'C1 displays its own Module 01–16 sequence');
assert.ok(mapModules().every(node=>!node.props.className.includes('open')),'Switching pathways starts with a compact module overview on mobile');
await click(moduleButton('01'));
await click(moduleButton('13'));
assert.equal(moduleButton('13').props['aria-expanded'],true,'A later module can be expanded');
assert.equal(moduleButton('01').props['aria-expanded'],false,'The previously expanded module closes');
await click(pathButton('C1'));
assert.equal(moduleButton('13').props['aria-expanded'],true,'Tapping the selected pathway preserves the expanded module');
await click(tree.root.findAllByProps({'aria-label':'Close course map'})[0]);
assert.doesNotMatch(tree.root.findByProps({'aria-label':'Course modules'}).props.className,/drawer-open/,'Narrow course map can be closed');
await click(button('Course map'));
assert.equal(pathButton('C1').props['aria-pressed'],true,'Reopening remembers the browsed pathway');
assert.equal(moduleButton('13').props['aria-expanded'],true,'Reopening remembers the expanded module');
await click(pathButton('C2'));
assert.ok(mapModules().length>1&&mapModules().every(node=>node.props['data-pathway']==='C2'),'C2 switching updates the whole module list');
assert.ok(mapModules().every(node=>!node.props.className.includes('open')));
await click(button('Saved 0'));
assert.equal(mapModules().length,0,'Saved filter is scoped to the selected pathway');
await click(pathButton('C1'));
assert.ok(mapModules().length>1,'Switching pathways clears a filter that could hide every module');
await click(button('Course tools'));
assert.equal(button('Course tools').props['aria-expanded'],true);
await click(button('Organise'));
assert.equal(button('Done').props['aria-pressed'],true);
await click(button('Course tools'));
assert.equal(button('Course tools').props['aria-expanded'],false);
assert.equal(button('Organise').props['aria-pressed'],false,'Closing the tools returns to ordinary lesson browsing');
assert.deepEqual(state(),beforeBrowsing,'Pathway, module and tool navigation do not alter learning records');
await click(pathButton('Advanced'));
await click(tree.root.findAllByProps({'aria-label':'Close course map'})[0]);
narrowViewport=false;
const distant=state().activeLessonId;
assert.notEqual(distant,'p01-l01','A distant module opens without prior progress');
await click(tree.root.findAllByProps({'aria-label':'Next lesson'}).find(node=>node.type==='button'));
assert.notEqual(state().activeLessonId,distant,'Player navigation selects the following video');
assert.deepEqual(state().completedLessonIds,[],'Next does not mark an unfinished video watched');
await click(tree.root.findAllByProps({'aria-label':'Previous lesson'}).find(node=>node.type==='button'));
assert.equal(state().activeLessonId,distant,'Previous returns to the original lesson');
assert.deepEqual(state().completedLessonIds,[],'Opening a lesson is not completion');
assert.equal(state().schemaVersion,10);
assert.equal(button('Exam prep'),undefined,'Video course has no exam destination');
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
assert.equal(tree.root.findAllByProps({role:'tablist'}).length,0,'No lesson guide tabs');
assert.ok(!/Lesson guide|Standards companion|Module recap|Mock paper|Simulations/.test(text(tree.toJSON())));
await click(button('Next unwatched'));
const catalog=JSON.parse(readFileSync('app/video-catalog.json','utf8'));
const distantPath=catalog.modules.find(module=>module.lessons.some(lesson=>lesson.id===distant)).path;
const firstInPath=catalog.modules.find(module=>module.path===distantPath).lessons[0].id;
assert.equal(state().activeLessonId,firstInPath,'Suggested next is an explicit action within the selected pathway');
await act(async()=>tree.unmount());
saved=JSON.stringify({...state(),freeBrowseEnabled:false});
window.location.hash='#learn/'+distant;
await mount();
assert.equal(state().activeLessonId,distant,'Old guided preferences cannot redirect deep links');
assert.equal(state().videoCompletionCounts[distant],2,'Counters persist');
await act(async()=>tree.unmount());
console.log('PASS: mobile pathway/module navigation and tool disclosure preserve learning records; flexible lessons, watched/undo/replay, suggested next, reload and saved notes.');
