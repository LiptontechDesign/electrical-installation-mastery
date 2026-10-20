# Focused course navigation

Implemented 20 October 2026.

In Learn, consecutive finished modules share one compact **Completed modules** row. The row names the original module numbers and watched-video total; expanding it restores the original module cards and colours. Unfinished and empty modules retain their positions. The playing module remains outside completed groups, including after its last video is marked watched. It joins its finished neighbours when the learner selects a video in another module.

Completion uses the existing active mixed course: core, optional, bundled supplementary and personal videos all count. Grouping waits for the account course, learner record and supplementary watched record to load. Guests keep the public outline without progress grouping or tracking. All / Unwatched / Saved keep their existing meaning; filters expose matching modules directly, and Organise exposes the full editable outline.

Opening an earlier module preserves the current module and other deliberately opened modules. Disclosure state lasts in the open study view; no account schema, storage keys or new tracking are introduced. Selecting a video makes its module the current module; leaving a finished current module folds it away. Changing pathways clears extra expansions, keeping the phone pathway overview compact. Completed module titles remain keyboard-accessible through native disclosure controls.

When the playing module is collapsed, a filter excludes its video, or another pathway is being browsed, **Return to lesson** identifies the playing video and its module. It clears the filter, reveals and focuses the existing row. It never selects the video again, seeks or recreates the player. The phone course drawer remains open for navigation and retains its existing close/focus behaviour.

Module colours remain stable by module ID. Visible accent edges continue through expanded history, and the current module has a stronger border and background. Completion uses a check, text and count as well as colour. New surfaces use existing paired light/dark roles, visible focus outlines, full title wrapping, 44px return controls and reduced-motion support.

## Verification

- `npm run test:course-map-focus`: contiguous runs, preserved order/identities, current exemption, incomplete/empty/missing records, readiness gating and mixed-video totals.
- `npm run test:course-map-focus-browser`: isolated account fixtures covering revision, keyboard disclosure, final-video completion, mixed core/supplementary playback, Return without playback reset, filters/Organise, delayed progress, guests and narrow light/dark layouts.
- Existing navigation, progress, guest/account, personal-course, protected-source, theme/contrast, lint, TypeScript and both production build targets remain applicable.

Rendered checks at 320px and 390px retain full titles without horizontal overflow. The new text controls measure at least 5.63:1 in light mode and 7.65:1 in dark mode, above the 4.5:1 text requirement. Desktop and phone previews cover both themes. Existing browser progress assertions use the current pathway-labelled overview and Home wording, and playback assertions wait for saved responses rather than a fixed debounce delay.

Browser fixtures simulate account endpoints and YouTube playback on a loopback server. They do not modify live learner accounts. Emulated viewports do not replace physical-device or screen-reader testing.
