# Module 5 surge protection and arc-fault detection

Updated 3 October 2026 following the user's supplied `Surge Protection.zip` and request to split Module 5, Section 08.

The course has 330 catalogue lessons, 25 modules and 115 sections. Module 5 has 41 catalogue lessons and ten sections. The existing player, account controls, page layout, progress, notes, bookmarks, books and practice centre use their existing implementation.

## Learning order

Section 08, **Surge protection devices (SPDs)**, keeps its stable ID `module-05-section-5`. Its complete default sequence is:

1. Existing eFIXX supplementary SPD introduction (`c2-spd-foundation`).
2. Existing GSH Electrical Type 2 SPD introduction (`course-CNiLNvBLopI`).
3. The six supplied John Ward videos, together in Parts 1–6 order.
4. Existing eFIXX SPD-test demonstration (`p05-spd`).

| Part | Supplied video | Duration | Placement role |
| --- | --- | --- | --- |
| 1 | [Surge Protection Devices - Part 1](https://www.youtube.com/watch?v=DWBFHjE5zK0) | 24:00 | Core lesson: transient overvoltages and principles |
| 2 | [Surge Protection Devices - Part 2](https://www.youtube.com/watch?v=-ehw6uZOOfw) | 20:05 | Core lesson: operation, components and connections |
| 3 | [Surge Protection 3 - Types and Teardown of Combined 1+2+3](https://www.youtube.com/watch?v=5XO5d2vLUsw) | 33:00 | Core lesson: types and combined devices |
| 4 | [Surge Protection 4 - Heating the fusible link inside the SPD](https://www.youtube.com/watch?v=fczDUB6KNDk) | 6:25 | Optional extension: thermal disconnection demonstration |
| 5 | [Surge Protection 5 - Wiring Lengths, Connection Options](https://www.youtube.com/watch?v=f6PpvrCgyEA) | 24:36 | Applied practical: conductor lengths and connections |
| 6 | [Risk Calculation - Surge Protection Part 6](https://www.youtube.com/watch?v=EplV5B9fYVU) | 27:42 | Optional extension: historical UK calculation |

Section 09, **Arc-fault detection devices (AFDDs)**, has the new ID `module-05-arc-fault` and contains the existing Schneider Electric lesson `course-lIit5k8QVj8`. Its video identity and metadata remain unchanged. Section 10, **Protective-device selection and selectivity**, keeps its old ID `module-05-section-6` and existing video order. Sections 01–07 and every other module keep their published order and content.

All six additions are credited to John Ward and use the same catalogue/player fields as earlier playlist additions. Parts 4 and 6 use existing optional-extension labels; they still count in active video progress. Part 6 was published in March 2020 and describes the historical BS 7671 risk-calculation approach shown in that source. It is retained in the supplied series, with `regulationSensitive: true`, and is not presented here as current Kenyan compliance guidance. No new regulatory teaching text or practice questions are introduced.

## Sources and verification

The supplied manifest and all six complete automatic transcripts are preserved byte-for-byte under `course-transcripts/supplied-2026-10/Surge Protection/`. The transcript hashes are checked against the supplied manifest. Titles and creator were checked with YouTube oEmbed; durations were read from public watch-page `lengthSeconds` metadata. Transcript review establishes the part sequence and topic coverage; it is not a claim of full-video playback or error-free automatic captions.

`C2 YouTube Links/C2 Module 05 - Fault Protection, Earthing and Protective Devices.txt` follows the revised catalogue order. The other eight C2 URL files are unchanged.

## Existing learners

Curriculum revision 4 applies only the new split to revision-3 arrangements. The revision-2 earthing and revision-3 wider-placement migrations retain separate gates, so older changes are not reapplied to already upgraded courses. Supplementary-placement correction remains gated at revision 3.

Only the known AFDD lesson still in the former combined group moves into the AFDD section. Untouched legacy supporting descendants in that group follow it in their existing relative order, including archived parents. Explicitly edited private supporting rows stay in their saved location. An AFDD lesson moved elsewhere by a learner stays there; subsequent revision-4 moves also remain authoritative.

The six new lessons are inserted through the existing missing-published-video mechanism before the SPD-test neighbour. All previous section IDs remain valid for editing and Undo. Existing groups elsewhere, supplementary metadata, edit revisions, receipts, archives and permanent removals are preserved. Reading does not write learner documents. Stable lesson and YouTube IDs keep existing progress, bookmarks, notes and resume positions; new videos add six to the total without changing watched marks.

## Checks

Run `npm run test:surge-protection` for supplied-video identities and hashes, legacy/current saved-course migrations, unaffected groups, private attachments and order, archives/deletions/restoration, Undo, watched totals and continuous numbering. Run `npm run test:surge-protection-browser` against the local fixture server for desktop/mobile rendering, the six embeds, learner state and existing editing controls. The curriculum, earthing, placement, course-order, personal-course/API, guest and account suites continue to cover the shared implementation.

`node scripts/test-surge-protection-browser.mjs --guest-only` exercises the desktop and 320px mobile layouts against an ordinary local server without test account configuration. It checks all six embed paths, creator credit, ordered membership, section numbering and horizontal overflow. Signed-in browser scenarios require the existing local test-account fixture configuration; account migration and preservation can also be verified independently through the model/API suites.

Verified for this change: Next.js and vinext production builds, TypeScript, ESLint, theme checks, curriculum/licensing, earthing, reviewed placements, personal-course model/API, course ordering/drag, progress, account isolation, guest access, learner-state migration, architecture and supplementary metadata/duration suites. Desktop and 320px mobile guest browser checks passed. The signed-in browser setup was blocked by automatic approval review with the generic reason `blocked by policy`; saved-account behaviour was verified with deterministic model/API fixtures rather than live accounts or Postgres.

A direct comparison with the previous Git catalogue confirms that all 24 other module records and all 324 existing lesson details remain unchanged (only later Module 5 display numbers increase). All 112 unrelated section records and eight other C2 URL exports are unchanged. `test:navigation` has an existing failure: its Next unwatched expectation is `p01-l01`, while the current implementation selects `p04-l15`. The same failure was reproduced with the unchanged Git-baseline source/data; this update does not change navigation code or that test.
