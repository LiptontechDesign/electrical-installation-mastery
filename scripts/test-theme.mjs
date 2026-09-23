import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import postcss from 'postcss';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const tokens = css => Object.fromEntries([...css.matchAll(/(--[\w-]+):\s*(#[\da-f]{6});/gi)].map(([, name, color]) => [name, color]));
const light = tokens(read('app/globals.css').split('* { box-sizing')[0]);
const dark = { ...light, ...tokens(read('app/dark-theme.css').match(/:root\s*\{([^}]+)\}/)[1]) };
const luminance = hex => hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
  .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
  .reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
const pairs = [
  ['--google-ink', '--google-surface'],
  ['--google-ink', '--google-hover'],
  ...['--paper', '--white', '--surface-soft', '--surface-muted'].flatMap(surface => ['--ink', '--muted', '--text-accent', '--copper-dark'].map(text => [text, surface])),
  ['--surface-selected-text', '--surface-selected'],
  ['--text-on-inverse', '--surface-inverse'],
  ['--accent-on-inverse', '--surface-inverse'],
  ['--inverse-muted', '--surface-inverse'],
  ['--inverse-muted', '--inverse-raised'],
  ['--text-on-inverse', '--inverse-raised'],
  ['--text-success', '--surface-success'],
  ['--text-warning', '--surface-warning'],
  ['--text-danger', '--surface-danger'],
  ['--text-on-primary', '--copper'],
  ['--text-on-primary', '--primary-hover'],
  ...['--solid-accent', '--solid-danger', '--solid-copper'].map(background => ['--text-on-inverse', background]),
];
for (const [name, theme] of Object.entries({ light, dark })) {
  for (const [foreground, background] of pairs) {
    const values = [luminance(theme[foreground]), luminance(theme[background])].sort((a, b) => b - a);
    const ratio = (values[0] + .05) / (values[1] + .05);
    assert.ok(ratio >= 4.5, `${name}: ${foreground} on ${background} contrast ${ratio.toFixed(2)} < 4.5`);
  }
}
const appFiles = readdirSync(new URL('../app/', import.meta.url), { recursive: true });
const cssFiles = appFiles.filter(file => file.endsWith('.css'));
const defined = new Set();
const used = new Set();
for (const file of cssFiles) {
  postcss.parse(read(`app/${file}`)).walkDecls(declaration => {
    if (declaration.prop.startsWith('--')) defined.add(declaration.prop);
    for (const match of declaration.value.matchAll(/var\((--[\w-]+)/g)) used.add(match[1]);
    if (declaration.prop.startsWith('--')) return;
    for (let parent = declaration.parent; parent; parent = parent.parent) {
      if (parent.type === 'atrule' && /print/.test(parent.params)) return;
    }
    assert.doesNotMatch(declaration.value, /#[\da-f]{3,8}\b|\brgba?\(|\bhsla?\(|(?<![\w-])(?:white|black)(?![\w-])/i,
      `${file}:${declaration.source.start.line} must use a theme role: ${declaration}`);
    assert.doesNotMatch(declaration.value, /var\(--var/, 'Invalid nested token');
    if (declaration.prop === 'color') assert.notEqual(declaration.value, 'var(--white)', 'Surface token used as text');
  });
}
// Runtime-only layout/progress custom properties are supplied by React.
for (const name of ['--progress', '--countdown', '--reader-text-size', '--desktop-sidebar', '--desktop-header', '--desktop-gutter', '--desktop-map']) defined.add(name);
for (const name of used) assert.ok(defined.has(name), `Undefined CSS token ${name}`);
for (const file of appFiles.filter(file => file.endsWith('.tsx') && file !== 'layout.tsx')) {
  assert.doesNotMatch(read(`app/${file}`), /#[\da-f]{3,8}\b/i, `${file}: use semantic SVG/style tokens`);
}
console.log(`Theme checks passed: ${pairs.length * 2} contrast pairs; ${cssFiles.length} stylesheets and all TSX components scanned.`);
