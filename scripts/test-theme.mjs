import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const tokens = css => Object.fromEntries([...css.matchAll(/(--[\w-]+):\s*(#[\da-f]{6});/gi)].map(([, name, color]) => [name, color]));
const light = tokens(read('app/globals.css').split('* { box-sizing')[0]);
const dark = { ...light, ...tokens(read('app/dark-theme.css').split('  html,')[0]) };
const luminance = hex => hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
  .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
const pairs = [
  ...['--paper', '--white', '--surface-soft', '--surface-muted'].flatMap(surface => ['--ink', '--muted', '--text-accent', '--copper-dark'].map(text => [text, surface])),
  ['--surface-selected-text', '--surface-selected'],
  ['--text-on-inverse', '--surface-inverse'],
  ['--accent-on-inverse', '--surface-inverse'],
];
for (const [name, theme] of Object.entries({ light, dark })) {
  for (const [foreground, background] of pairs) {
    const values = [luminance(theme[foreground]), luminance(theme[background])].sort((a, b) => b - a);
    const ratio = (values[0] + .05) / (values[1] + .05);
    assert.ok(ratio >= 4.5, `${name}: ${foreground} on ${background} contrast ${ratio.toFixed(2)} < 4.5`);
  }
}
const companion = read('app/overview-reader.module.css');
assert.doesNotMatch(companion, /#[\da-f]{3,8}\b|\brgba?\(|\bhsla?\(/i, 'Standards Companion must use shared theme tokens');
assert.doesNotMatch(companion, /(?:^|[;{\s])color:\s*var\(--white\)/, 'A surface token must not be used for text');
console.log('Theme checks passed: paired text contrast in light/dark and token-only Standards Companion.');
