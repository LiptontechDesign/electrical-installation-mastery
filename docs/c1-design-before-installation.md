# C1: complete design and protection checks before board installation

Historical change record: the current C1 module positions and independent Module 1–16 numbering are documented in [the revision-13 route](c1-focused-modules.md). Earlier module numbers below refer to the layout at the time of this change.

Reviewed 16 October 2026.

The four full submain/board-installation demonstrations formerly appeared in Module 12, before the detailed C1 design and protection teaching. Their two existing sections now follow the core protection checks in Module 14.

| Stage | Teaching order |
|---|---|
| Module 12 — Three-Phase Distribution: Boards and Outlets | Safe isolation, board layouts and phase identification; industrial outlet connections/selection; the existing labelled switchgear comparison. |
| Module 13 — Three-Phase Load, Cable and Protection Design | Read the brief and establish routes; assess demand; apply rating factors; size cables; check voltage drop. |
| Module 14 — Fault Protection and Three-Phase Board Installation | Earthing/bonding/RCD principles; fault-loop and temperature corrections; protective-conductor sizing; emergency switching and surge principles; **submain connections → complete board assembly examples → terminations/workmanship**. Optional specialist lightning study remains last. |

The relocated sections are `c1-distribution-submains` and `c1-distribution-installation`. They retain their IDs and all four lesson IDs: `p07-l08`, `p10-l06`, `p10-l07` and `p07-l09`. The submain section title now describes its SWA and switch-fuse demonstration without promising a complete three-phase feeder design.

This is a section placement update using the existing layout. No video was added or removed, and no new learner text panel was introduced. C1 remains 138 video rows in 84 sections. C2, Advanced, Module 13 content and the existing Practice/Past Papers material are unchanged.

The same section IDs remain saved-course destinations, so their existing lesson order and private additions travel with the section. Explicit moves to another section remain there. Watched marks, bookmarks, notes, playback positions, archives/deletions and Undo references retain their identities. No new group migration or revision gate is needed: saved group membership is unchanged, while the current section metadata determines its module and position.

The C1 application regression checks now require cable sizing, voltage drop, protective-conductor checks and surge principles to precede every relocated installation demonstration. The curriculum, C1 flow/gap/application, historical placement, saved-course/API, progress and guest-access suites passed, along with ESLint and the Next.js production build. Comparison with the captured previous published state confirmed identical saved groups, every existing lesson's content/identity and all unaffected modules, including Module 13, C2 and Advanced.

Local production browser checks confirmed protection teaching at Video 9 → submain at Video 10 → board assembly at Video 11, with Previous returning correctly. The relocated section headings and worked-project link display in the existing layout. No watched marks were set; the live account baseline before publication remained 5/138 C1 and 263/482 overall. Screenshot capture has been unavailable in this browser session; these checks used rendered DOM/navigation observations.
