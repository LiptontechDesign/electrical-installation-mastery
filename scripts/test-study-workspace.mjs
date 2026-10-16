import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h } from 'react';
import { act, create } from 'react-test-renderer';

await mkdir('work/study-workspace-tests', { recursive: true });
await build({
  stdin: { contents: "export { default as Home } from './app/learning-home'; export { homeContinueDestination } from './app/course-ui-model'; export { initialLearnerState } from './app/learner-state'; export { personalCourseSnapshot, publishedPersonalCourse } from './app/personal-course-model';", resolveDir: process.cwd(), loader: 'tsx' },
  outfile: 'work/study-workspace-tests/home.mjs', bundle: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic',
  plugins: [{ name: 'view-dependencies', setup(builder) {
    builder.onResolve({ filter: /^next\/(script|dynamic|image|link)$/ }, args => ({ path: args.path, namespace: 'view-stub' }));
    builder.onLoad({ filter: /.*/, namespace: 'view-stub' }, args => ({ contents: args.path === 'next/link' ? 'import {createElement} from "react"; export default ({children,...props}) => createElement("a",props,children)' : args.path === 'next/dynamic' ? 'export default () => () => null' : 'export default () => null', loader: 'js', resolveDir: process.cwd() }));
  } }],
});
const { Home, homeContinueDestination, initialLearnerState, personalCourseSnapshot, publishedPersonalCourse } = await import('../work/study-workspace-tests/home.mjs');
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
