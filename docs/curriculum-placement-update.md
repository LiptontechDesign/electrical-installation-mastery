# Reviewed curriculum placement update

Implemented 1 October 2026 following the user's approval of the 30 September module-by-module review.

## Scope

The course retains all **25 module names**, **324 catalogue videos**, **32 bundled supplementary videos** and **356 published rows**. All **90 previous section IDs** remain valid; **24 populated sections** were added, bringing the total to **114**.

No existing video was deleted. The page components, styles, player, three-dot menus, Organise controls, notes, bookmarks, playback resume, archive, restore, permanent removal and account boundaries are retained.

The new organisation is a teaching sequence. Existing UK regulatory examples remain references; renaming a heading does not turn a UK certificate demonstration into Kenyan-specific instruction.

## Implemented changes

| Module | Changes |
|---|---|
| 1 | Separate magnetism/induction/transformers from AC generation and sine-wave quantities. |
| 2 | Rename the supply-equipment section to describe its actual equipment/circuit content. |
| 3 | Keep kitchen-point planning here; place equipment protection classes beside IP/IK ratings. |
| 4 | Bring wall chasing/first fix into routing. Separate PVC conduit, steel conduit, trunking/tray fabrication, capacity calculations, conduit lighting and SWA. The PVC-singles second-fix lesson now follows its wiring explanation. |
| 6 | Move socket planning into load assessment; separate ring current sharing from cable correction factors; use a focused breaking-capacity heading. |
| 8 | Split the different dead tests and electrode/Ze/PFC/Zs measurements. Keep regular RCD verification here. Place the full verification/EIC walkthrough with the installation capstones. Rename certificate teaching accurately. |
| 9 | Separate diagnostic method, lighting, ring/socket/circuit paths, insulation/cable deterioration, RCD/leakage and load-current cases. Move RCD ramp testing here from initial verification. |
| 11 | Clarify the worked three-phase calculation section heading. |
| 13 | Mark the seven-floor building/transformer-sizing example Optional extension instead of Core lesson. |
| 14 | Make the Module 5, Section 6 Part 1 prerequisite explicit in the existing module description/outcome before Part 2 temperature correction. |
| 16 | Include terminal connections in the section heading. |
| 17 | Separate contactor/DOL principles, protection and DOL construction, star-delta/soft starting, and VFD speed control. Protection selection precedes practical starter wiring. |
| 18 | Introduce supply/polarity verification before the phase-rotation demonstration. |
| 19 | Separate supply/board/neutral faults, motor phase loss and thermal diagnosis. |
| 21 | Bring Electrical Surges and Lighting from Module 24 into LED-driver/protection teaching. Clarify garden lighting; introduce the optional control-architecture overview before DALI and product applications. |
| 22 | Separate KNX, network testing, CCTV/access, automated gates and fire detection. Gate controllers and safety devices are together. |
| 23 | Teach inverter operation before hybrid installation, then PV verification. Keep transfer/UPS/backup and EV topics distinct. |
| 24 | Retain pump and ventilation controls after relocating the lighting-specific surge lesson. |

Modules 5, 7, 10, 12, 15, 20 and 25 keep their existing sensible topic grouping. Module 5's earlier eight-video personal introduction and separate ADS/electrode/loop topics remain covered by their regression checks.

## Main C2 learning groups

### Module 6

1. Load assessment, demand and design current — 8 videos.
2. Cable capacity, reference methods and correction factors — 7.
3. Ring-final circuit design and load distribution — 2.
4. Voltage-drop calculation — 4.
5. CPC sizing and fault withstand — 1.
6. Prospective fault duty and breaker breaking capacity — 1.

Total: **23**.

### Module 8

1. Visual inspection, test planning and instrument setup — 2.
2. Protective bonding: assessment and continuity — 4.
3. CPC continuity and dead polarity — 2.
4. Ring-final continuity and polarity — 3.
5. Insulation-resistance testing — 5.
6. Earth-electrode resistance measurement — 1.
7. External loop impedance Ze and prospective fault current — 4.
8. Circuit earth-fault loop impedance Zs — 2.
9. RCD verification and functional checks — 2.
10. Certification and recording results — 2.
11. Complete verification and installation walkthroughs — 4.

Total: **31**, after relocating ramp testing to Module 9.

### Module 9

1. Systematic diagnostic method — 1.
2. Lighting-circuit faults and visual evidence — 3.
3. Ring, socket and circuit-path faults — 6.
4. Insulation faults and cable deterioration — 2.
5. RCD/RCBO, borrowed-neutral and leakage diagnosis — 5.
6. Load-current and functional diagnosis — 2.

Total: **19**.

Published counts include supplementary videos. Account-specific moves, additions, archives and removals may produce different personal totals.

## Saved-course migration

The existing personal-course document version remains 2; its published curriculum marker advances to **3**.

- The prior earthing correction runs first for older records.
- Known videos still in their former published sections move to their reviewed topics.
- Untouched published ordering receives the new sequence. Custom relative order is retained within its split destinations.
- Videos already placed in other sections retain those personal destinations.
- Standalone private additions stay in their chosen sections. Untouched legacy supporting attachments follow their moved lesson, including visible descendants of an archived parent. Explicitly edited private positions stay put.
- Archived and deleted IDs remain inactive; default merging cannot revive permanent removals.
- Supplemental module metadata follows actual membership, including nested attachments and personal destinations.
- Read-time normalisation performs no database write and consumes no edit revision. The next successful personal-course edit persists the curriculum marker.
- Subsequent moves, restores and Undo are not reapplied by the curriculum update. Previous section IDs and edit receipts remain usable.
- Watched marks, bookmarks, notes and playback positions remain keyed by the existing video/lesson identities.

Bundled videos can now use a section ID as a stable placement anchor. This populates sections whose introductory content consists entirely of supplementary videos, such as diagnostic method and motor phase-loss diagnosis, without inventing new catalogue lessons.

## Copyable C2 URLs

The nine files in C2 YouTube Links were refreshed in the new canonical module order. They retain the existing URL-only format and contain **213 catalogue URLs** overall. Bundled/private supplementary entries remain outside these canonical exports.

## Verification

- Curriculum and licensing checks preserve all original identities, titles, YouTube URLs and durations, and the approved John Ward/JPElectric selections.
- The new placement regression uses a captured, actual revision-2 published course rather than constructing an old arrangement from the new implementation.
- Model checks cover all reviewed homes, populated sections, supplementary-only groups, idempotence, custom order, old/new personal moves and Undo, nested support, archives/deletions/restores, overall watched totals and continuous numbering.
- API checks cover a full authenticated revision-2 read, no read-time write, marker persistence on edit, subsequent moves, retained learner documents and account isolation.
- Desktop and 320-pixel browser checks use the production build and simulated learner/YouTube fixtures. They inspect the rendered video sequence and headings across all 25 modules, menus, notes/resume, move/Undo/reload, and supplementary-only watched/archive/delete totals.
- Existing earthing and mixed-progress browser suites cover the eight-video introduction, ADS population and progress totals in the map, Home, overview and Settings.
- Theme, lint, TypeScript and the production Next.js build remain publishing gates.

Browser/API fixtures contain no live learner data; live Postgres changes and uninterrupted third-party video playback are outside these fixture checks.
