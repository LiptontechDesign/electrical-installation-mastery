# Personal course editor: investigation and proposal

Investigation date: 28 September 2026. Implemented locally on 29 September 2026 following approval. This document records the original investigation and design rationale; see [current implementation](course-drag-and-drop.md) for behavior and verification. Refined following online UX research and the owner's direction to preserve the current design and use compact controls.

## Findings from the checked-out main branch

The features still exist. Commit `72beb20` on 24 September introduced study mode and CSS that hides add, archive, and drag controls while `data-organizing="false"`. The signed-in course-map toolbar exposes them through **Organise course**. The initial organizing state is false. On mobile, this toolbar is inside the course-map drawer.

Evidence: `app/course-progress.css:104`, `app/course-app.tsx:127`, and `app/course-app.tsx:821`.

Existing capabilities worth preserving:

- Signed-in learners can add YouTube videos with title/channel lookup and manual corrections.
- Added videos already use inline playback, personal notes, bookmarks, watched marks, and playback resume.
- Core lessons can move between sections, modules, and pathways. Supplementary videos can move relative to core or supplementary videos.
- The map and manual Previous/Next navigation use a combined course sequence. Numbering is continuous within each module.
- Server APIs authenticate the user and store documents using `(user_id, document_type)` keys. These are personal changes, even though some old interface messages say “shared course.”

Current shortcomings:

1. Add controls disappear behind Organise course and appear as small plus icons when revealed.
2. The precise core move control is on the selected lesson. Supplementary movement uses a different “Rename or move” form. A user cannot open one consistent destination picker directly from every row.
3. Supplementary add/edit forms ask learners to type `ADD VIDEO` or `EDIT VIDEO`. This is unnecessary friction for ordinary reversible edits.
4. Supplementary placement depends on an anchor video, rather than an explicit section. Empty sections cannot accept supplementary videos. The add function returns without opening when a module has no core lessons; the module selector also assumes a first core lesson exists.
5. Moving a video carries its attached descendants. Core drag positions are constrained by these groups, which can make the apparent drop location surprising.
6. Map numbering includes supplementary videos, but search labels and module lesson totals still use the core catalogue in some places. Core auto-next uses the core lesson list, so it can skip inserted supplementary videos.
7. Supplementary requests send a revision, but the API does not reject stale edits. Core ordering checks revisions before an unconditional write; that check is not an atomic database comparison. Concurrent saves can overwrite one another.
8. Supplementary selection retains a video object separately from catalogue state; the redesign should derive its current placement from its stable ID so the player context follows moves.

This is a source investigation of the local checkout. It does not establish which commit is deployed or whether the live signed-in account has a storage/configuration error.

## Recommended learner experience

### Entry points

Use compact **+ Add video** and **Organise** text actions in the existing signed-in course-map toolbar. Use the current typography, colours, spacing tokens, and corner styles. Show “Only your course changes” inside the editing flow. On phones, keep the actions easy to find near the top of Course content.

Each section offers a discreet plus control labelled “Add video to [section]”, including an empty section. Every video row has one **⋯** actions menu with **Move to…** and **Add video after this**. Supplementary entries also have **Edit details** and **Archive**. Keep these menus available in study mode. Reserve drag handles and expanded placement tools for organising mode. Use a separate button beside the lesson link, rather than nesting interactive controls or making the whole row a drag handle.

Keep menu icons visible at a restrained, readable contrast; hover and keyboard focus can strengthen their background. Hover must not be the only way to discover editing. Use the same actions beside the currently playing video's title when its course-map row is offscreen.

### Compact visual specification

These are proposed starting sizes, to be checked against the rendered course rather than applied as a blanket global restyle:

- Icons: approximately 16–18px, matching existing Lucide icons.
- Desktop action targets: approximately 32–36px tall, with transparent or subtle backgrounds; use the existing compact text scale for toolbar actions.
- Touch targets: aim for a non-overlapping 44px activation area around the same small icon. Keep the visible icon/background restrained. Do not shrink readable labels or form inputs to achieve density.
- Desktop add/move dialog: approximately 480–560px wide, responsive to long titles and zoom. A mobile sheet uses the available width and a reachable action footer.
- Each dialog has one clear primary submit action. Toolbar and row controls use quieter styling.
- Use a thin insertion marker, a small dragged-video preview, and brief destination highlighting. Honour reduced-motion settings.

Preserve the course map, player proportions, module accents, lesson typography, light/dark themes, and current navigation hierarchy as the visual baseline. Before implementation, capture representative desktop and mobile states; compare them again after integration for title wrapping, density, focus, and layout shifts.

### Add a video

1. Paste a YouTube link.
2. Review the fetched thumbnail, title, and channel. Title/channel remain editable; failed lookup allows manual entry. An existing matching video offers **Go to video**, **Move existing video**, or **Restore** when archived.
3. Review the preselected destination as a short breadcrumb and placement preview. **Change location** opens the destination selector only when needed. A section/lesson action supplies its exact location; a toolbar action defaults to the current section and states that choice visibly.
4. Select **Add to my course**. Show saving and success states, reveal the new row, and offer **Watch now** or **Add another**.

Use one compact form with link, preview, location summary, and submit action. Keep title/channel editing available through **Edit details**; reveal those fields automatically if lookup fails. Use the established embedded lesson experience automatically. Keep entered values after a failed save. No typed confirmation phrase is needed. Saving the addition should not unexpectedly replace an actively playing lesson.

### Move any video

Use the same **Move to…** dialog/sheet for core and supplementary videos. Show the video title and current location, then a searchable section picker whose results include pathway and module breadcrumbs. Allow browsing by pathway/module as an alternative to search. After choosing a section, show its videos as an ordered preview with selectable insertion gaps, including beginning/end and empty-section placement. The preview shows neighbouring titles and the resulting lesson numbers. Long lists must remain keyboard navigable and searchable; avoid several long dropdowns that must be repeatedly cross-referenced.

The learner selects **Move video** once; this is the confirmation, with no second routine confirmation dialog. After saving, expand the destination, reveal and briefly highlight the moved row, and show “Moved to [module / section]” with **Undo**. Preserve the playing video and its position. Restore keyboard focus to the moved row's action control.

Dragging provides the same placement preview. A single-video drop onto a clearly identified insertion point saves on release with Undo. Do not introduce different confirmation rules solely because a section boundary was crossed. Explicit group moves show the affected titles and destination before submission. Recommend the Move to picker for distant modules/pathways rather than requiring long drags, hover switching, or prolonged auto-scroll. Keyboard and touch users always have the Move to sheet, with no drag gesture required. On touch, ordinary row gestures continue to scroll or select; dragging starts only from its dedicated handle.

Undo should remain accessible through **Undo last change** in the organiser menu for the current session, even after the brief success message disappears. Saving failures restore the last confirmed arrangement and retain the proposed destination for retry. Announce the result accessibly and do not cover playback controls with status messages.

Move only the selected video by default. Where existing data records attached supporting videos, offer an explicit **Move with supporting videos** option and show the affected titles/count before saving. Preserve existing groups during migration; moving a single item must leave the others at their current positions.

### Predictable feedback

- Number videos from 1 through the current combined sequence inside each module. Preserve module and section identities.
- Derive map labels, search labels, player position, counts, Previous/Next, and enabled auto-next from that same sequence.
- Keep required-course completion separate from optional additions, with clearly labelled totals.
- Keep playback, watched records, notes, timestamps, and bookmarks attached to stable video identities.
- Show loading, saving, saved, retry, and conflict states in place. Never imply success before persistence is confirmed.
- Archive remains reversible, with Restore and a valid destination fallback. Use plain action buttons and Undo for ordinary edits.
- Provide labelled controls, visible keyboard focus, focus restoration, screen-reader announcements, sufficient touch targets, reduced-motion support, and a mobile sheet with a reachable action footer.

## Implementation approach

1. Introduce a versioned personal arrangement that stores a mixed ordered list of core and supplementary entry IDs per section. Video metadata and progress remain keyed by stable identities. A section can contain only supplementary videos or no videos.
2. Convert the existing core order and supplementary anchor tree into that arrangement using the current rendered sequence. Retain archived metadata and existing attachment relationships as explicit information. Preserve legacy records until the conversion is validated; migration must be repeatable and must not duplicate entries.
3. Build a shared placement operation and destination picker used by adding, moving, dragging, and restoring. Do not expose internal anchor IDs to learners.
4. Make writes transactional where catalogue and arrangement change together. Use atomic revision comparisons, idempotent operation IDs, and clear stale-edit recovery so retries or two devices cannot silently discard changes.
5. Implement Undo as a validated inverse operation. It should restore the affected item’s position without replacing unrelated subsequent changes.
6. Derive current selection and all course navigation from the resolved arrangement. Reconcile or cancel pending auto-next when an edit changes its destination.
7. Keep authentication checks and user-scoped reads/writes on the server. Guests continue to receive the published course. No admin role is required for personal editing.

## Research supporting this refinement

These sources support the interaction principles. The exact dimensions, menu placement, and workflow above are design recommendations for this course, not claims of a universally optimal interface.

- [Nielsen Norman Group: Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) supports presenting essential choices first and revealing less frequent options through clearly labelled entry points. Applied here: compact add/organise actions, with editing details and destination changes available on demand.
- [Nielsen Norman Group: Drag-and-Drop](https://www.nngroup.com/articles/drag-drop/) discusses the difficulty of precise or long-distance dragging and the importance of previews and feedback. Applied here: nearby drag reordering and a destination picker for distant moves.
- [Atlassian: Drag-and-drop accessibility guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/accessibility-guidelines) recommends menu-based alternatives, forms for operations needing input, meaningful action names, result announcements, and focus restoration. Applied here: one lesson actions menu and one shared Move to flow.
- [W3C: Dragging Movements](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements) requires a single-pointer alternative to dragging where applicable. A keyboard-only drag implementation would not address that requirement by itself.
- [W3C: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) specifies a 24 by 24 CSS pixel minimum subject to its exceptions and explicitly discusses enlarging the active area independently of visible size. The proposed 44px touch area is a usability target for this course, not the AA minimum.

The next design validation should ask a learner to add a video to a specified section, move one across modules, and undo a mistake without coaching. Observe discoverability, wrong destinations, recovery, and whether the learning page still feels familiar. Automated functionality tests cannot establish those UX outcomes alone.

## Verification before release

- Existing accounts migrate without losing custom videos, order, archives, progress, or notes; untouched accounts keep the published default.
- Core and supplementary moves work within a section, between sections/modules/pathways, and into empty sections. Every active entry appears exactly once.
- Selected-video moves and explicit group moves match the preview; Undo and Restore preserve later unrelated changes.
- Numbering, labels, counts, manual navigation, and auto-next agree after add/move/archive/restore and page refresh.
- The same account sees persisted changes after reload and on a second session. A second account and guests remain unchanged.
- Failed, repeated, stale, and concurrent requests cannot show false success, duplicate an addition, or silently overwrite another arrangement.
- Desktop, narrow-screen touch, keyboard, and screen-reader flows cover add, precise move, drag, cancel, Undo, and recovery.

Investigation checks: the existing `test-account-isolation.mjs` source assertions passed. The guest test could not run because this fresh checkout has no installed dependencies (`esbuild` is missing); placement/browser suites and live authenticated persistence remain unverified. No application files were changed during this investigation.
