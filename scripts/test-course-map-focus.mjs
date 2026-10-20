import assert from 'node:assert/strict';
import { build } from 'esbuild';

await build({ entryPoints: ['app/course-map-focus-model.ts', 'app/course-progress-model.ts'], outdir: 'work/course-map-focus-tests', bundle: true, platform: 'node', format: 'esm' });
const { buildCourseMapGroups } = await import('../work/course-map-focus-tests/course-map-focus-model.js');
const { progressForVideos } = await import('../work/course-map-focus-tests/course-progress-model.js');

const modules = ['foundation', 'safety', 'cables', 'protection', 'design', 'testing', 'empty', 'unloaded'].map(id => Object.freeze({ id, title: id }));
const progressByModule = new Map([
  ['foundation', { total: 1, watched: 1 }],
  ['safety', { total: 2, watched: 2 }],
  ['cables', { total: 2, watched: 1 }],
  ['protection', { total: 1, watched: 1 }],
  ['design', { total: 1, watched: 1 }],
  ['testing', { total: 1, watched: 1 }],
  ['empty', { total: 0, watched: 0 }],
]);
const options = { enabled: true, currentModuleId: 'design', progressByModule };
const shape = nodes => nodes.map(node => node.kind === 'module' ? node.module.id : node.modules.map(module => module.id));
const before = JSON.stringify([...progressByModule]);
const groups = buildCourseMapGroups(modules, options);
assert.deepEqual(shape(groups), [['foundation', 'safety'], 'cables', ['protection'], 'design', ['testing'], 'empty', 'unloaded'], 'Only contiguous, fully watched, non-current modules form completed groups');
assert.equal(groups[0].watched, 3, 'Completed groups count every active mixed video');
assert.equal(groups[0].modules[0], modules[0], 'Module objects keep their identities');
assert.equal(groups[3].module, modules[4], 'A completed playing module remains directly reachable');
const completed = groups.filter(node => node.kind === 'completed');
assert.ok(completed.every(node => typeof node.id === 'string' && node.id.length > 0));
assert.equal(new Set(completed.map(node => node.id)).size, completed.length, 'Separate runs have independent disclosure identities');
assert.deepEqual(groups.map(node => node.kind === 'module' ? [node.module] : node.modules).flat(), modules, 'Grouping preserves exact course order and every module once');
assert.equal(JSON.stringify([...progressByModule]), before, 'Reading groups does not mutate private progress');

assert.deepEqual(shape(buildCourseMapGroups(modules, { ...options, enabled: false })), modules.map(module => module.id), 'Disabled grouping retains the complete outline for guests, loading, filters and Organise');
assert.deepEqual(buildCourseMapGroups([], options), [], 'An empty pathway is valid');
assert.deepEqual(shape(buildCourseMapGroups(modules.slice(0, 2), { ...options, currentModuleId: 'foundation' })), ['foundation', ['safety']], 'The first playing module is exempt');
assert.deepEqual(shape(buildCourseMapGroups(modules.slice(0, 2), { ...options, currentModuleId: 'safety' })), [['foundation'], 'safety'], 'The last playing module is exempt');
assert.deepEqual(shape(buildCourseMapGroups(modules.slice(0, 2), { ...options, currentModuleId: 'another-pathway' })), [['foundation', 'safety']], 'Browsing another pathway does not invent a current module there');

// A completed core lesson must not conceal an unfinished personal addition.
const mixedRows = ['catalogue-lesson', 'personal-video'];
const watched = new Set(['catalogue-lesson', 'archived-historical-mark']);
const mixedProgress = new Map([['safety', progressForVideos(mixedRows, watched)]]);
assert.deepEqual(shape(buildCourseMapGroups([modules[1]], { ...options, progressByModule: mixedProgress })), ['safety']);
watched.add('personal-video');
mixedProgress.set('safety', progressForVideos(mixedRows, watched));
const finished = buildCourseMapGroups([modules[1]], { ...options, progressByModule: mixedProgress });
assert.deepEqual(shape(finished), [['safety']], 'A mixed module groups after its personal addition is watched too');
assert.equal(finished[0].watched, 2, 'Retained historical marks do not inflate group counts');
mixedProgress.set('safety', progressForVideos(['catalogue-lesson'], watched));
assert.equal(buildCourseMapGroups([modules[1]], { ...options, progressByModule: mixedProgress })[0].watched, 1, 'Archiving an addition immediately changes the active total');

const focused = buildCourseMapGroups(modules, { ...options, compactFollowing: true });
assert.deepEqual(shape(focused), [['foundation', 'safety'], 'cables', ['protection'], 'design', ['testing', 'empty', 'unloaded']], 'Later modules form one group while earlier incomplete modules stay visible');
assert.equal(focused.at(-1).kind, 'following', 'Later modules keep their separate meaning from completed work');
assert.deepEqual(focused.flatMap(node => node.kind === 'module' ? [node.module] : node.modules), modules);
assert.deepEqual(shape(buildCourseMapGroups(modules, { ...options, compactFollowing: true, enabled: false })), modules.map(module => module.id));
assert.deepEqual(shape(buildCourseMapGroups(modules, { ...options, compactFollowing: true, currentModuleId: 'elsewhere' })), shape(buildCourseMapGroups(modules, { ...options, currentModuleId: 'elsewhere' })), 'Browsing a different pathway never assumes which module comes next');
console.log('PASS: completed and later module groups, original order and identities, current exemption, loading/empty/missing progress, mixed-video completion and archive totals.');
