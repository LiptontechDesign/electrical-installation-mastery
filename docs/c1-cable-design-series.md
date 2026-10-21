# C1: a connected seven-step cable-design sequence

Added 21 October 2026. All seven parts were found on [EccElectric's channel](https://www.youtube.com/@Eccelectricvideos/videos), starting from the supplied Part 1 link. The series is **56 minutes 43 seconds** in the published channel metadata.

## Name and position

**Seven-Step Cable Design: From Load Current to Fault Checks** is Section 5 in **C1 Module 8 — Load Assessment and Cable Design**. It follows the brief, demand assessment and rating-factor foundations, immediately before the former Section 5. The existing worked calculations, combined voltage-drop lesson and optional building extension become Sections 6–8, retaining their stable section IDs.

This gives learners one instructor's connected method before the separate detailed calculations and three-phase applications. Placing it after the existing worked calculations would delay the overview until after the learner had already needed it. The planning and load-assessment foundations remain first because the series starts with supplied circuit data.

## The seven lessons

The same 230 V lighting circuit and socket radial are carried through the sequence; these are two single-phase examples within the C1 design route.

| Part | Focus | Video | Runtime |
|---:|---|---|---:|
| 1 | Establish design current, Ib, from the known lighting load and the socket-circuit assumed-load example. | [Calculate design current](https://www.youtube.com/watch?v=bAdNXOLSwJg) | 7:13 |
| 2 | Select protective-device current rating, In, and explain trip characteristics. | [Determine the protective device](https://www.youtube.com/watch?v=OoJvApVqZh4) | 7:42 |
| 3 | Apply the relevant rating factors to obtain the required cable-table capacity. | [Apply rating factors](https://www.youtube.com/watch?v=0CT-mT2Gm5s) | 7:04 |
| 4 | Identify the installation reference method and choose a conductor size from the appropriate cable table. | [Select cable size and installation method](https://www.youtube.com/watch?v=Ip2QJBOdalo) | 9:05 |
| 5 | Calculate voltage drop for each circuit and compare with the example's limit. | [Calculate voltage drop](https://www.youtube.com/watch?v=vSKzLpKJMLE) | 7:03 |
| 6 | Calculate line-plus-protective-conductor resistance, R1 + R2, including operating-temperature adjustment. | [Calculate R1 + R2](https://www.youtube.com/watch?v=-wi6pJPBW30) | 8:45 |
| 7 | Add external loop impedance, Ze, to obtain Zs, then compare with the relevant design limit. | [Calculate Zs](https://www.youtube.com/watch?v=tRF0Y2MaQ5g) | 9:51 |

## Content review and teaching qualifications

The complete available English captions were reviewed for all seven videos. [Review metadata](c1-cable-design-video-review.json) records their hashes, segments, reviewed ranges and exact source titles. Full third-party captions remain in ignored `work/c1-design-series/`. YouTube oEmbed returned an iframe for every video; this confirms embed metadata availability, not successful playback or frame-by-frame review. Browser regression checks use the existing simulated player to verify the course integration separately.

Part 3 labels the result of dividing In by correction factors as Iz. For the examples' ordinary protective devices, that calculation gives the **required tabulated capacity, It**. The selected cable's table rating multiplied by the applicable factors gives its installed capacity, Iz. A short lesson note makes that distinction explicit; the [IET's Appendix 4 explanation](https://electrical.theiet.org/media/1617/appendix-4-of-bs-7671.pdf) supports the terminology. Its historical table references are not adopted as current requirements.

The 23 A table rating with the example's 0.94 temperature factor gives 21.62 A installed capacity, exceeding the 20 A device rating. The corresponding minimum table rating is 20 / 0.94 = 21.2766 A; rounding that requirement down to 21 A is inappropriate. The chosen 23 A cable still exceeds the unrounded requirement.

Captioned calculation results are approximate: the socket-circuit resistance from the stated inputs is 19.51 × 20 × 1.2 / 1000 = 0.46824 ohms, giving Zs = 0.81824 ohms with the example's 0.35 ohm Ze. The lighting resistance is 1.9548 ohms. Lesson notes tell learners to retain precision, use verified supply data and distinguish design-temperature limits from measured ambient-temperature limits. The captions' quoted final table values are not treated as current design data or reproduced as authoritative limits.

This is a systematic introduction to **cable selection and circuit checks**, rather than a complete three-phase building design. Existing C1 lessons still supply three-phase load/current calculations, submain-plus-final-circuit voltage drop, protective-conductor thermal sizing and later verification. The existing video IDs, account records and immutable practice sources remain intact.

## Saved courses and checks

The existing additive catalogue normalisation supplies the new section and seven rows to saved revision-13 courses; no old video moves and no placement migration is replayed. Personal copies of these videos are intentionally retained, matching the treatment of earlier additions. An actual pre-addition published snapshot is kept in `scripts/fixtures/c1-cable-design-previous.json`.

`node scripts/test-c1-cable-design.mjs` checks the exact series, its teaching position, saved and fresh courses, original identities, personal copies and descendants, moves, removals, historical Undo, source metadata and independently calculated example results. Existing curriculum, C1 progression, personal-course, account and guest suites cover the shared behaviour.

Validation passed: TypeScript, ESLint, all six earlier C1 suites, the new series suite, curriculum/licensing and historical placement suites, personal-course/API and account/guest checks, protected EPRA and past-paper checks, theme checks, both Next.js and vinext production builds, and the new desktop/phone/guest browser checks against a local production server. Browser account data and the YouTube player were simulated; live Google sign-in, database access and video playback were not part of those checks.
