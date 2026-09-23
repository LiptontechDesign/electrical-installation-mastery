# Current theme and accessibility checks

Updated 23 September 2026 for the video-focused application.

The public overview, personal home, video workspace, course map, reference reader, account controls, search and settings use semantic surface, text, action, status and focus tokens. Light and system-dark palettes are defined in globals.css and dark-theme.css.

The removed guide, companion, recap, simulation and exam interfaces are no longer part of the theme or current QA scope. Their dedicated styles and obsolete selectors were removed.

## Verification and limits

Run npm run test:theme. The current static suite checks 64 declared light/dark foreground/background pairs for at least 4.5:1 contrast, scans stylesheets and TSX presentation colors, and rejects undefined tokens and inappropriate raw component colors. This check is part of the production build.

Static contrast checks do not prove every rendered layout or interaction is accessible. No new visual/browser audit was performed during this cleanup, at the owner's request. Keyboard, screen-reader and authenticated book-reader end-to-end testing remain useful release checks for future UI changes.

## Intentional exceptions

Original PDF canvases and source figures preserve document colors; their surrounding interface follows the theme. PDF text mode follows the theme. YouTube content is a third-party surface. Browser/manifest metadata has platform-specific colors.

## Maintenance

Add colors as paired semantic roles. Preserve visible focus, readable disabled/error states, responsive controls and reduced-motion handling. Do not globally invert source document imagery.
