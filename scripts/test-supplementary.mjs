import assert from 'node:assert/strict';
import { build } from 'esbuild';

await build({
  entryPoints: ['app/supplementary-model.ts'],
  outdir: 'work/supplementary-check',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
});

const { supplementaryDescendants, supplementaryPlacementCreatesCycle } = await import('../work/supplementary-check/supplementary-model.js');
const video = (id, anchorId, archived = false) => ({
  id,
  anchorId,
  archived,
  videoId: `${id}000000000`.slice(0, 11),
  title: id,
  instructor: '',
  moduleId: 'module-01',
  position: 'after',
  updatedAt: '2026-09-19T00:00:00.000Z',
});
const videos = [video('first', 'lesson-1'), video('second', 'first'), video('hidden', 'second', true), video('third', 'hidden')];

assert.deepEqual(supplementaryDescendants(videos, ['lesson-1']).map(item => item.id), ['first', 'second', 'third'], 'nested active videos are found through archived placement anchors');
assert.equal(supplementaryPlacementCreatesCycle(videos, 'first', 'third'), true, 'moving a parent beneath its descendant is rejected');
assert.equal(supplementaryPlacementCreatesCycle(videos, 'third', 'lesson-1'), false, 'moving a descendant back to a core lesson is allowed');
assert.equal(supplementaryPlacementCreatesCycle(videos, undefined, 'second'), false, 'a new video can be placed after an existing supplementary video');

console.log('Supplementary ordering checks passed.');
