# Current theme and accessibility checks

Updated 16 October 2026 for the shared study workspace.

The public overview, personal home, video workspace, course map, reference reader, account controls, search and settings use semantic surface, text, action, status and focus tokens. Light and system-dark palettes are defined in globals.css and dark-theme.css.

The retired lesson guide, companion, recap, simulation and lesson-assessment interfaces remain absent. The separately authorized Practice and Papers areas share the current study workspace theme.

## Verification and limits

Run npm run test:theme. The current static suite checks 64 declared light/dark foreground/background pairs for at least 4.5:1 contrast, scans stylesheets and TSX presentation colors, and rejects undefined tokens and inappropriate raw component colors. This check is part of the production build.

Static contrast checks do not prove every rendered layout or interaction is accessible. The October workspace redesign includes browser review of phone, tablet, landscape and desktop layouts, light/dark surfaces, reader controls and isolated signed-in records. See [the study workspace verification](study-workspace.md). Physical-device and screen-reader testing remain separate release checks.

## Intentional exceptions

Original PDF canvases and source figures preserve document colors; their surrounding interface follows the theme. PDF text mode follows the theme. YouTube content is a third-party surface. Browser/manifest metadata has platform-specific colors.

## Maintenance

Add colors as paired semantic roles. Preserve visible focus, readable disabled/error states, responsive controls and reduced-motion handling. Do not globally invert source document imagery.
