# Star–delta practical wiring and English VFD additions

Reviewed 26 October 2026. These five additions belong to C1 Module 13, **Motor Starting, Protection and Speed Control** (`module-07`). They add 67:55 of video without changing the opening eFIXX/GSH creator sequences or any existing lesson identity.

## Teaching order

Existing star–delta operation, nameplate connections and Jim Pytel's manual/timed control drawings come first. The new practical block follows:

| Order | Lesson | Creator | Duration | Views checked 26 October |
|---|---|---|---|---:|
| 1 | [Power wiring and standard timer control](https://www.youtube.com/watch?v=aDhX7fzXmQQ) | Tech Gaurav | 17:23 | 1,994,410 |
| 2 | [Holding circuit, timer and interlocks](https://www.youtube.com/watch?v=vVs_1oEVMgQ) | The Electrical Guy | 13:30 | 1,028,793 |
| 3 | [Timer-NC and auxiliary-contact variant](https://www.youtube.com/watch?v=pseZ6W6K28Y) | Tech Gaurav | 24:12 | 1,030,934 |

The first two form **Star–delta practical wiring: power, timer and interlocks**. The third has its own optional **Further study** section: comparison follows conventional wiring rather than replacing it. The existing autotransformer and soft-starter lessons follow.

The new **VFD applications: speed control and starter selection** section then introduces purpose and equipment choice before the existing longer VFD power-stage lesson:

| Order | Lesson | Creator | Duration | Views checked 26 October |
|---|---|---|---|---:|
| 1 | [VFD purpose, operation and pump applications](https://www.youtube.com/watch?v=g7jFGOn6xfU) | RealPars | 5:20 | 1,527,924 |
| 2 | [Choosing a soft starter or VFD](https://www.youtube.com/watch?v=_ZztDN5XX5o) | RealPars | 7:30 | 2,594,292 |

Popular uploads were screened on The Electrical Guy, Tech Gaurav and the creator-linked Electrical Technician channel. Their screened VFD demonstrations were below the user's one-million-view minimum for discovered lessons. The two original-English RealPars videos meet that requirement and fill the application/selection gap. Unrelated popular wiring videos and additional overlapping timer demonstrations were not selected solely for their views.

## Spoken English and review evidence

The Electrical Guy and both RealPars videos have English original audio. Both Tech Gaurav videos have a separate English (US) automatic dub alongside their Hindi original. Public YouTube adaptive audio-track metadata distinguishes these from captions; player status and oEmbed were also available for all five. YouTube controls the selected audio track: the course does not force English. A viewer can select **Settings → Audio track → English** when that menu is offered.

Complete available captions were read for all five lessons. Four reviews used English caption exports. The complete available Hindi ASR for `aDhX7fzXmQQ` was read with translation, and its English audio-dub availability was independently verified. That review is not represented as an English-dub transcript review. Full independent listening to every English dub or visual approval of a finished electrical design is not claimed.

[The review ledger](c1-motor-practical-video-review.json) records source titles, channel IDs, dated views, durations, audio-track evidence, caption hashes/ranges, teaching flow and technical limitations. Full newly retrieved caption text remains in ignored local research files. Technical qualifications stay in this internal documentation; the additions introduce no section introductions or learner-facing study notes.

In particular, the timer-NC lesson is an optional comparison because its claims about timer failure and switched control returns are not general guarantees of protection or isolation. Real installations require appropriate break-before-make operation, interlocking, protection and manufacturer-specific coordination. The ledger also qualifies equipment-specific wiring/settings and simplified VFD/soft-starter explanations.

## Saved-course preservation and verification

This is a pure addition of five stable lesson IDs in three new sections. Curriculum revision stays 14, so historical migration steps are not replayed. Every prior row retains its relative order and section membership. Repeatable media registration preserves existing personal copies and descendants. Personal moves, archives, deletions, progress and historical Undo remain valid.

Current totals are 514 catalogue entries, 218 sections and 546 default mixed rows. C1 contains 113 sections and 212 default rows. The motor module contains 44 catalogue lessons and 17 sections.

`node scripts/test-c1-motor-practical.mjs` checks the frozen 541-row previous publication, teaching order, source evidence and saved-course behaviour. `node scripts/test-c1-motor-practical-browser.mjs` checks all five embeds, section placement, cross-section Next navigation, desktop/320px layouts, guest access and a simulated saved account on a local server. Browser fixtures replace YouTube and account APIs and make no live account edits. Existing curriculum, account, progress, practice-source and past-paper suites remain applicable.
