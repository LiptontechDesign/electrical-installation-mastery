# Site-wide theme audit

Audit baseline: 7b68576. Scope: every first-party stylesheet and TS/TSX file in app, all page workspaces, responsive rules, inline SVG presentation attributes, and system/print behavior. Raw colors are not automatically defects: document pixels, chart series, inverse panels, and print need deliberate treatment.

## Findings recorded before implementation

| Area / source | Finding | Required correction |
| --- | --- | --- |
| Shared styles / globals.css | Fixed white cards, search/settings panels, input shells, progress panels, legacy lesson panels, and selected controls; small text mixes unrelated gray shades. | Semantic surfaces, text, borders, selection, and input roles. |
| Module recap / globals.css | Reading spread, contents, pagination, notes, transcript, video dialog, and connection cards retain light surfaces; fixed dark copy conflicts with system dark. | Theme every recap surface and child; retain explicit print colors. |
| Course connections / globals.css, lesson-connection.tsx | Fixed exercise surfaces, result labels, links, and graph colors. | Shared surface, text, and diagram roles. |
| Books / book-reading.css | Reader toolbar/index/bookmarks/figure surroundings/loading/error panels remain light; child labels and result values are dark even where parents have dark overrides. | Theme the complete reader shell and states, not only its outer dialog. |
| Reader mobile / reader-mobile.css | Fixed selected-state, feedback, sync, and focus colors. | Same paired state tokens at all breakpoints. |
| Tutor / tutor.css | Fixed guide labels, term links, numbered steps, timeline/option labels, and callout text. | Theme child foregrounds alongside containers. |
| Learning tools / learning-ui.css | Fixed concept, circuit, formula control, term-heading, and answer colors. | Semantic foregrounds, states, and chart palette. |
| Assessment / assessment.css | Light table headers, confidence selections, worked-method labels; translucent focus outline; faded answer options can reduce contrast. | Token-based tables/states and opaque focus ring; avoid fading readable answer content. |
| Supplementary / supplementary.css | Footer and metadata links retain fixed dark teal; form and action colors require per-selector overrides. | Shared links, inputs, actions, warning states. |
| Licensing / licensing.css | Repeated fixed card, guide, milestone, and example-input colors. | Shared roles with explicit warning colors. |
| Standards Companion / overview-reader.module.css | Already token-based following the earlier correction. | Retain and include in broader regression check. |
| SVG / loop-visual.tsx, recap-math.tsx, lesson-connection.tsx, toolkit-visual.tsx | Fixed SVG labels, surfaces, wires, and series colors. | Theme diagram labels/surfaces; retain distinguishable labeled series. |
| dark-theme.css | A long selector override list misses nested elements and newer components. | Replace selector patching with central system-driven tokens. |
| Accessibility preferences | High-contrast coverage is partial; control borders and focus vary by component. | Consistent focus/control borders and forced-colors selected-state cues. |

## Intentional exceptions

- Original PDF canvases and source figure images preserve document colors; their surrounding interface follows the theme. Text reading mode follows the theme.
- Print uses dark text on white paper regardless of system preference.
- Video content/YouTube internals are third-party surfaces.
- Manifest and browser toolbar colors are platform metadata, not component styling.
- Inverse heroes, video surroundings, and book covers use explicitly paired inverse colors in both themes.

## Verification

Implemented shared surface, foreground, inverse, action, status, diagram and focus roles across all ten stylesheets. Removed the legacy dark selector override list. SVG presentation colors now use semantic tokens. Native input text/backgrounds and placeholder colors follow the system theme; reading content is no longer faded with whole-control opacity.

- Static checks pass for 60 light/dark contrast pairs, all ten stylesheets, and every TSX component (excluding platform metadata in layout). The build rejects new raw component colors, malformed or undefined CSS tokens, and surface tokens used as text.
- Browser checks completed: dark Home, settings, reset confirmation, search, and answered exam state; light answered exam state. These rendered states reported no contrast violations. A scan during the exam loading transition reported a missing heading; the loaded exam has its heading.
- The previous Standards Companion verification covered light/dark desktop and mobile; this migration retains its semantic roles.
- Full live coverage of all reader states and every simulation/recap interaction has not been completed. Local supplementary/reader services lack storage/authentication credentials; their error states are visible. Static audit coverage must not be represented as end-to-end authenticated reader verification.
- User requested commit/push during verification. Production compilation and deployment status are checked before handoff.

## Maintaining the palette

Run `npm run test:theme`. Add new colors as paired semantic roles in the root palettes, not directly in components. Inverse regions define a complete local text/surface palette. Do not globally invert document imagery or overwrite SVG colors by tag name. Contrast calculations cover declared pairs; new component combinations still need browser checks.
