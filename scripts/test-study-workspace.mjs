import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h, useState } from 'react';
import { act, create } from 'react-test-renderer';

await mkdir('work/study-workspace-tests', { recursive: true });
await build({
  stdin: { contents: "export { default as Papers } from './app/past-papers/past-paper-centre'; export { default as Practice } from './app/practice/study-centre'; export { default as StudyTabs } from './app/study-tabs'; export { default as Home } from './app/learning-home'; export { homeContinueDestination } from './app/course-ui-model'; export { initialLearnerState } from './app/learner-state'; export { personalCourseSnapshot, publishedPersonalCourse } from './app/personal-course-model';", resolveDir: process.cwd(), loader: 'tsx' },
  outfile: 'work/study-workspace-tests/home.mjs', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
  plugins: [{ name: 'view-dependencies', setup(builder) {
    builder.onResolve({ filter: /^next\/(script|dynamic|image|link)$/ }, args => ({ path: args.path, namespace: 'view-stub' }));
    builder.onLoad({ filter: /.*/, namespace: 'view-stub' }, args => ({ contents: args.path === 'next/link' ? 'export const useLinkStatus=()=>({pending:false}); import {createElement} from "react"; export default ({children,...props}) => createElement("a",props,children)' : args.path === 'next/dynamic' ? 'export default () => () => null' : 'export default () => null', loader: 'js', resolveDir: process.cwd() }));
  } }],
});
const { Papers, Practice, StudyTabs, Home, homeContinueDestination, initialLearnerState, personalCourseSnapshot, publishedPersonalCourse } = await import('../work/study-workspace-tests/home.mjs');
const rows = [{ id: 'personal-video' }, { id: 'core-video' }, { id: 'optional-video' }];
assert.equal(homeContinueDestination(rows, new Set(), 'core-video').id, 'core-video', 'Unfinished current work is preferred');
assert.equal(homeContinueDestination(rows, new Set(['core-video']), 'core-video').id, 'personal-video', 'A watched current lesson does not hide the next unwatched video');
assert.equal(homeContinueDestination(rows, new Set(['personal-video']), 'different-pathway').id, 'core-video', 'A recent video outside the selected pathway cannot redirect the suggestion');
assert.equal(homeContinueDestination([...rows].reverse(), new Set(['optional-video']), 'removed-video').id, 'core-video', 'Suggestions respect the current mixed order after removal or reordering');
assert.equal(homeContinueDestination(rows, new Set(rows.map(row => row.id)), 'core-video').id, 'core-video', 'A complete pathway offers a replay without claiming unfinished work');
assert.equal(homeContinueDestination([], new Set(), 'removed-video'), undefined, 'An empty pathway has no fabricated destination');

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const snapshot = personalCourseSnapshot(publishedPersonalCourse);
const pathRows = snapshot.allRows.filter(row => snapshot.course.modules.find(module => module.id === row.moduleId)?.path === 'C2');
const learner = { ...initialLearnerState, activeLessonId: pathRows[0].id, completedLessonIds: [pathRows[0].id], notes: { [pathRows[0].id]: 'Existing private note' } };
const before = structuredClone(learner);
const opened = [];
const openedBooks = [];
const savedReading = { version: 1, books: { 'on-site-guide': { page: 6, updatedAt: '2026-10-16T10:00:00Z', bookmarks: [] } } };
globalThis.fetch = async url => { assert.equal(url, '/api/reader/state'); return { ok: true, json: async () => structuredClone(savedReading) }; };
const props = { user: { id: 'preview', name: 'Preview Learner', email: 'preview@example.test' }, learner, path: 'C2', progress: { watched: 1, total: pathRows.length, percent: Math.round(100 / pathRows.length) }, overallProgress: { watched: 1, total: snapshot.allRows.length, percent: 0 }, watchedRows: new Set(learner.completedLessonIds), weekMinutes: 10, onLesson: id => opened.push(id), onBooks: selection => openedBooks.push(selection) };
const text = node => typeof node === 'string' ? node : Array.isArray(node) ? node.map(text).join('') : node?.children ? text(node.children) : '';
let tree;
await act(async () => { tree = create(h(Home, props)); });
const button = label => tree.root.findAllByType('button').find(node => text(node) === label);
await act(async () => button('Start lesson').props.onClick());
assert.equal(opened.at(-1), pathRows[1].id, 'Home opens the first unwatched row after a watched current lesson');
await act(async () => button('Last opened').props.onClick());
assert.ok(button('Replay lesson'), 'A watched last-opened lesson is explicitly labelled as replay');
await act(async () => button('Replay lesson').props.onClick());
assert.equal(opened.at(-1), learner.activeLessonId);
const continueBook = tree.root.findAllByType('button').find(node => text(node).includes('Continue reading') && text(node).includes('On-Site Guide'));
assert.ok(continueBook, 'Home shows the existing saved book and printed page');
await act(async () => continueBook.props.onClick());
assert.deepEqual(openedBooks.at(-1), { id: 'on-site-guide', page: 6 }, 'Continue reading opens the actual saved PDF page');
assert.deepEqual(learner, before, 'Suggestion choices and replay do not mutate progress, notes or bookmarks');
await act(async () => tree.update(h(Home, { ...props, ready: false })));
assert.match(text(tree.toJSON()), /Opening your learning/);
assert.equal(tree.root.findAllByProps({ className: 'progress-panel-number' }).length, 0, 'Loading does not show false zero progress');
await act(async () => tree.unmount());
console.log('PASS: Home resumes unfinished work, scopes suggestions to the current mixed pathway, labels replay, handles empty courses and preserves learner records while loading.');

// Synchronous panels use one keyboard tab stop and conventional horizontal keys.
const focusedTabs = [];
const tabs = [{id:'topic',label:'Topic practice'}, {id:'recall',label:'Recall quizzes'}, {id:'definitions',label:'Definitions'}];
function TabHarness() {
  const [value,setValue] = useState('topic');
  return h(StudyTabs,{id:'test-mode',label:'Practice type',value,items:tabs,onChange:setValue});
}
await act(async()=>{tree=create(h(TabHarness),{createNodeMock:element=>element.type==='button'?{focus(){focusedTabs.push(element.props.id);}}:null});});
const tabButtons=()=>tree.root.findAllByProps({role:'tab'});
const selectedTab=()=>tabButtons().find(node=>node.props['aria-selected']);
const key=async value=>{let prevented=false; await act(async()=>selectedTab().props.onKeyDown({key:value,preventDefault(){prevented=true;}}));return prevented;};
assert.equal(tabButtons().filter(node=>node.props.tabIndex===0).length,1);
assert.equal(await key('ArrowRight'),true);
assert.equal(selectedTab().props.id,'test-mode-recall');
assert.equal(focusedTabs.at(-1),'test-mode-recall','Keyboard focus follows the active panel');
await key('End'); assert.equal(selectedTab().props.id,'test-mode-definitions');
await key('ArrowRight'); assert.equal(selectedTab().props.id,'test-mode-topic','Arrow navigation wraps');
await key('ArrowLeft'); assert.equal(selectedTab().props.id,'test-mode-definitions');
await key('Home'); assert.equal(selectedTab().props.id,'test-mode-topic');
assert.equal(await key('ArrowDown'),false,'Vertical arrows keep ordinary page scrolling');
assert.ok(tabButtons().every(node=>node.props['aria-controls']==='test-mode-panel'));
await act(async()=>tree.unmount());
console.log('PASS: local tabs expose selection and panel relationships, maintain one tab stop, and support arrows, Home and End without intercepting vertical scrolling.');

const documentListeners = new Map();
const frames=[];
const focusEvents=[];
globalThis.document={addEventListener:(name,fn)=>documentListeners.set(name,fn),removeEventListener:(name,fn)=>{if(documentListeners.get(name)===fn)documentListeners.delete(name);},getElementById(){return null;}};
let confirmations=0;
globalThis.window={location:{search:'',href:'http://localhost/past-papers/c2',origin:'http://localhost',pathname:'/past-papers/c2'},history:{replaceState(){}},scrollTo(){},addEventListener(){},removeEventListener(){},requestAnimationFrame:fn=>{frames.push(fn);return frames.length;},cancelAnimationFrame(){},matchMedia:()=>({matches:false}),confirm:()=>{confirmations++;return false;}};
globalThis.requestAnimationFrame=window.requestAnimationFrame;
globalThis.cancelAnimationFrame=window.cancelAnimationFrame;
const flushFrames=()=>{while(frames.length)frames.shift()();};
const pressButton=async label=>{await act(async()=>{tree.root.findAllByType('button').find(node=>text(node).trim()===label).props.onClick();});flushFrames();};
await act(async()=>{tree=create(h(Papers,{path:'C2'}),{createNodeMock:element=>({focus(){focusEvents.push(element.props['aria-label']??element.type);},scrollIntoView(){}})});});
await pressButton('Attempt first');
assert.equal(tree.root.findAllByProps({'aria-label':'Worked answer'}).length,0);
await pressButton('Show worked answer');
assert.equal(focusEvents.at(-1),'Worked answer','Revealing a Papers answer moves focus to its beginning');
const paperWorking=()=>tree.root.findByProps({'aria-label':'Your answer and working'});
await act(async()=>paperWorking().props.onChange({target:{value:'Existing calculation'}}));
await act(async()=>tree.root.findByProps({'aria-label':'Continue to next question'}).props.onClick());flushFrames();
assert.equal(tree.root.findAllByProps({'aria-label':'Worked answer'}).length,0,'Next retains Attempt first and hides the new answer');
await act(async()=>tree.root.findByProps({'aria-label':'Go to previous question'}).props.onClick());flushFrames();
assert.equal(paperWorking().props.value,'Existing calculation','Previous/next preserve question working');
assert.equal(tree.root.findAllByProps({'aria-label':'Worked answer'}).length,1,'Previously revealed answers remain available');
await act(async()=>tree.unmount());
window.location={search:'',href:'http://localhost/practice',origin:'http://localhost',pathname:'/practice'};
await act(async()=>{tree=create(h(Practice));});
await act(async()=>tree.root.findAllByType('button').find(node=>node.props.className==='epra-collection').props.onClick());
await act(async()=>tree.root.findByType('textarea').props.onChange({target:{value:'Session draft'}}));
const guard=documentListeners.get('click');
assert.ok(guard,'Session working retains a navigation guard');
function guardEvent(href,changes={}) {
  const url=new URL(href,window.location.href);
  let prevented=false,stopped=false;
  const link={href:url.href,target:'',hasAttribute:()=>false};
  guard({target:{closest:()=>link},button:0,defaultPrevented:false,preventDefault(){prevented=true;},stopPropagation(){stopped=true;},...changes});
  return {prevented,stopped};
}
guardEvent('/practice');
guardEvent('/past-papers/c2',{ctrlKey:true});
guardEvent('/past-papers/c2',{metaKey:true});
guardEvent('/past-papers/c2',{shiftKey:true});
assert.equal(confirmations,0,'Same-page and new-tab actions do not warn about losing the open session');
assert.deepEqual(guardEvent('/past-papers/c2'),{prevented:true,stopped:true},'Cancelling a real page exit protects the draft before navigation');
assert.equal(confirmations,1);
assert.equal(tree.root.findByType('textarea').props.value,'Session draft');
await act(async()=>tree.unmount());
console.log('PASS: Papers reveal/next/back preserve attempts and working; Practice protects actual exits while allowing same-page and modified navigation.');
