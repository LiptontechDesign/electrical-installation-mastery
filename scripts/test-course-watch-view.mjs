import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { createElement as h, useState } from 'react';
import { act, create } from 'react-test-renderer';

await mkdir('work/watch-tests', { recursive: true });
await build({ entryPoints: ['app/course-watch-view.tsx', 'app/video-study-tools.tsx'], outdir: 'work/watch-tests', bundle: true, splitting: true, platform: 'node', format: 'esm', packages: 'external', jsx: 'automatic' });
const { default: WatchView, CoursePlayerControls, fullscreenBlocksCourseNavigation } = await import('../work/watch-tests/course-watch-view.js');
const { VideoStudyContext } = await import('../work/watch-tests/video-study-tools.js');
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const listeners = new Map();
let fullscreen = null, element, tree, mode = 'native', rejectRotation = false, completeRequest;
let exits = 0, locks = 0, unlocks = 0, restored = 0;
const emit = type => { for (const handler of listeners.get(type) ?? []) handler({ type }); };
globalThis.document = {
  get fullscreenElement() { return fullscreen; },
  activeElement: { focus() { restored++; } },
  addEventListener(type, handler) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(handler); },
  removeEventListener(type, handler) { listeners.get(type)?.delete(handler); },
  querySelector() { return null; },
  async exitFullscreen() { exits++; fullscreen = null; emit('fullscreenchange'); },
};
globalThis.window = {
  requestAnimationFrame(callback) { callback(); return 1; }, cancelAnimationFrame() {},
  matchMedia() { return { matches: true }; },
  screen: { orientation: {
    async lock(value) { assert.equal(value, 'landscape'); locks++; if (rejectRotation) throw new Error('Orientation unavailable'); },
    unlock() { unlocks++; },
  } },
};
function CoreLesson() { return h('article', { className: 'lesson-canvas core' }, h('div', { className: 'video-shell' }, h('iframe', { title: 'Core video' }), h(CoursePlayerControls))); }
function SupportingLesson() { return h('article', { className: 'lesson-canvas supp-lesson' }, h('div', { className: 'video-shell' }, h('iframe', { title: 'Supporting video' }), h(CoursePlayerControls))); }
function Harness() {
  const [index, setIndex] = useState(0);
  return h(VideoStudyContext.Provider, { value: { navigation: { position: index + 1, total: 2 }, autoNextEnabled: true, toggleAutoNext() {} } },
    h(WatchView, { collapsed: false, title: index ? 'Supporting lesson' : 'Core lesson', previous: index ? { title: 'Core lesson', select: () => setIndex(0) } : undefined, next: !index ? { title: 'Supporting lesson', select: () => setIndex(1) } : undefined }, h(index ? SupportingLesson : CoreLesson)));
}
async function mount() {
  fullscreen = null;
  await act(async () => { tree = create(h(Harness), { createNodeMock(node) {
    if (!Object.hasOwn(node.props, 'data-course-watch-screen')) return null;
    element = {
      hasAttribute(name) { return name === 'data-course-watch-screen'; },
      contains(value) { return value === element; }, querySelectorAll() { return []; }, querySelector() { return null; },
      async requestFullscreen() {
        if (mode === 'reject') throw new Error('Fullscreen refused');
        if (mode === 'pending') await new Promise(resolve => { completeRequest = resolve; });
        fullscreen = element; emit('fullscreenchange');
      },
    };
    return element;
  } }); });
}
const root = () => tree.root.findByType('div');
const expanded = () => root().props['data-watch-expanded'];
const controls = () => tree.root.findAllByType('div').find(node => node.props.className?.includes('fullscreen-player-controls'));
const button = (name, within = tree.root) => within.findAllByType('button').find(node => node.props['aria-label'] === name);
const click = async node => { assert.ok(node, 'Control exists'); await act(async () => { node.props.onClick(); }); };
const unmount = async () => { await act(async () => tree.unmount()); };

await mount();
await click(button('Fullscreen lesson'));
assert.equal(expanded(), true);
assert.equal(fullscreen, element);
assert.equal(locks, 1, 'Native phone fullscreen attempts landscape');
assert.equal(fullscreenBlocksCourseNavigation(), false, 'The persistent course container allows auto-next');
const originalControls = controls(), originalElement = element;
await click(button('Next lesson', controls()));
assert.equal(element, originalElement, 'Switching lesson types retains the fullscreen DOM element');
assert.equal(fullscreen, originalElement, 'Supporting videos retain native fullscreen');
assert.equal(controls(), originalControls, 'The fullscreen controls and keyboard focus target survive a lesson change');
assert.ok(tree.root.findAllByType('article').some(node => node.props.className.includes('supp-lesson')));
assert.equal(button('Next lesson', controls()).props.disabled, true, 'The sequence does not wrap at its end');
await click(button('Previous lesson', controls()));
assert.equal(fullscreen, originalElement);
await act(async () => { fullscreen = { hasAttribute() { return false; } }; });
assert.equal(fullscreenBlocksCourseNavigation(), true, 'An independent fullscreen iframe keeps the safe-exit guard');
await act(async () => { fullscreen = null; emit('fullscreenchange'); });
assert.equal(expanded(), false, 'Browser fullscreen exit restores the lesson page');
assert.equal(unlocks, 1, 'Only the orientation owned by this session is released');
assert.ok(restored > 0, 'Closing restores the previous keyboard focus');
await unmount();

mode = 'reject';
await mount();
await click(button('Fullscreen lesson'));
assert.equal(expanded(), true, 'Rejected native fullscreen keeps a working expanded view');
assert.equal(fullscreenBlocksCourseNavigation(), false);
assert.ok(button('Next lesson', controls()));
assert.equal(locks, 1, 'Expanded fallback does not request an unsupported orientation lock');
await click(button('Exit expanded view', controls()));
assert.equal(expanded(), false);
await unmount();

mode = 'native'; rejectRotation = true;
await mount();
await click(button('Fullscreen lesson'));
assert.equal(expanded(), true, 'Orientation refusal does not interrupt fullscreen');
assert.ok(button('Exit fullscreen', controls()));
await click(button('Exit fullscreen', controls()));
assert.equal(expanded(), false);
assert.equal(unlocks, 1, 'Failed orientation requests do not unlock device settings');
await unmount();

rejectRotation = false; mode = 'pending';
await mount();
await click(button('Fullscreen lesson'));
assert.equal(expanded(), true);
await click(button('Exit expanded view', controls()));
await act(async () => completeRequest());
assert.equal(expanded(), false, 'A cancelled fullscreen request cannot reopen the view later');
assert.equal(fullscreen, null, 'Late native fullscreen is dismissed after cancellation');
await unmount();

mode = 'native';
await mount();
delete element.requestFullscreen;
await click(button('Fullscreen lesson'));
assert.equal(expanded(), true, 'Browsers without the API still have an expanded player');
await act(async () => { for (const handler of listeners.get('keydown') ?? []) handler({ key: 'Escape', defaultPrevented: false }); });
assert.equal(expanded(), false, 'Escape closes expanded fallback');
await unmount();

await mount();
await click(button('Fullscreen lesson'));
await act(async () => { for (const handler of listeners.get('keydown') ?? []) handler({ key: 'Escape', defaultPrevented: false }); });
assert.equal(expanded(), false, 'Escape also closes native fullscreen when the host delivers the key event');
assert.equal(fullscreen, null);
await unmount();

mode = 'pending';
await mount();
await click(button('Fullscreen lesson'));
await unmount();
await act(async () => completeRequest());
assert.equal(fullscreen, null, 'A pending request cannot leave an orphaned fullscreen session after navigation');

mode = 'native';
await mount();
delete element.requestFullscreen;
element.webkitRequestFullscreen = async () => { document.webkitFullscreenElement = element; emit('webkitfullscreenchange'); };
document.webkitExitFullscreen = async () => { document.webkitFullscreenElement = null; emit('webkitfullscreenchange'); };
await click(button('Fullscreen lesson'));
assert.ok(button('Exit fullscreen', controls()), 'The prefixed Safari API is supported');
assert.equal(fullscreenBlocksCourseNavigation(), false);
await click(button('Exit fullscreen', controls()));
assert.equal(expanded(), false);
assert.equal(document.webkitFullscreenElement, null);
await unmount();
delete document.webkitFullscreenElement;
delete document.webkitExitFullscreen;

const beforeUnmountUnlocks = unlocks;
await mount();
await click(button('Fullscreen lesson'));
await unmount();
assert.equal(fullscreen, null, 'Leaving Learn exits the course fullscreen session');
assert.equal(unlocks, beforeUnmountUnlocks + 1, 'Unmount releases the active orientation lock');
assert.ok(exits >= 2);
console.log('PASS: persistent fullscreen across core/supporting videos, boundary navigation, native/prefixed APIs, rotation refusal, expanded fallback, Escape, cancellation, focus restoration and orientation cleanup.');
