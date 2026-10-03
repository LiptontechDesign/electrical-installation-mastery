# Earthing, ADS and fault-loop learning order

The [1 October course placement update](curriculum-placement-update.md) retains this Module 5 teaching sequence and carries its migration into curriculum revision 3. The [3 October surge-protection update](surge-protection-integration.md) splits the former combined SPD/AFDD topic, adds six videos and introduces curriculum revision 4. The course now has 330 catalogue lessons and 115 sections overall.

Updated 30 September 2026 after the user's review of Module 5. Module names, lesson identities, video URLs, the player and editing controls stay unchanged. The catalogue still contains 324 lessons across 25 modules; three new sections bring the total to 90.

## Module 5

| Section | Heading | Teaching purpose |
| --- | --- | --- |
| 1 | Fault types and protective-device functions | Identify faults and protective-device functions. |
| 2 | Fuses, circuit breakers and trip characteristics | Understand overcurrent operation before fault protection. |
| 3 | Earthing systems and protective bonding | Basics, TN/TT arrangements, then earthing versus bonding and reinforcement. |
| 4 | Residual-current protection: RCDs and RCBOs | Explain device operation before their role in ADS. |
| 5 | Automatic disconnection of supply: fault protection | GSH Electrical's ADS lesson connects earthing, bonding and disconnection. |
| 6 | Earth-fault loop impedance: Ze, Zs and R1 + R2 | Fault path, temperature-corrected calculations, RCD relationship, then advanced touch-voltage calculations. |
| 7 | Earth electrodes: installation and resistance testing | John Ward's six-video playlist, kept together in its original order. |
| 8 | Surge protection devices (SPDs) | Learn the introduction, John Ward Parts 1–6, then the existing SPD-test demonstration. |
| 9 | Arc-fault detection devices (AFDDs) | Study the existing Schneider Electric arc-fault lesson as its own topic. |
| 10 | Protective-device selection and selectivity | Apply selection and coordination after the protective principles. |

The RCD/loop-impedance lesson moves from the device introduction into Section 6. The advanced touch-voltage lesson closes the calculation sequence. The electrode playlist retains the coverage limits in [its selection record](earth-electrode-video-selection.md).

## Modules 6 and 8

**Small Earth Wire: Does Size Matter?** (`p05-l10`) moves into Module 6, Section 4, **Circuit protective conductor sizing and fault withstand**, after voltage-drop calculations and before final design proof. The existing final-design section becomes Section 5.

**Testing an Extraneous Conductive Part: High or Low?** (`course-TFt3d77LujQ`) opens Module 8, Section 2, **Protective bonding, continuity, polarity, ring-circuit and insulation tests**. Assess which conductive parts need bonding before studying bonding continuity and the remaining dead tests.

The C2 URL-only text files follow the new catalogue order. No lesson is deleted by this reorganisation.

## Saved courses

All 87 previous section IDs remain valid; display numbers reflect the new sequence. The first migration skipped customised source groups and touched rows, which could leave Section 5 empty while ADS and calculation lessons remained in Section 3. Revision 2 corrects those known lessons even when their old combined group was reordered. It changes only obsolete source placements; personal moves to other destinations remain intact.

The introductory mixed order in an existing revision-1 course stays intact. For the reported eight-video arrangement, Section 3 keeps its five catalogue earthing/bonding lessons and three personal introductions, in the same order. The remaining catalogue lessons move to ADS (Section 5), loop impedance (Section 6), conductor sizing (Module 6) and bonding assessment (Module 8). Personal entries before the first relocated lesson stay in Section 3 even if a legacy anchor points at a moving lesson. Later untouched legacy attachments follow their relocated anchor. Archives, permanent removals, account revisions and operation receipts are retained.

The `curriculumRevision: 2` marker prevents subsequent personal moves from being moved back by the correction. A read performs no database write; the marker is persisted with the next successful course edit. Stable lesson and YouTube IDs keep watched marks, notes, bookmarks and playback positions attached to the same videos. Active totals and numbering are derived from the new membership.

Verify with `node scripts/test-earthing-curriculum.mjs`, the curriculum/licensing suites and the existing personal-course model/API/browser suites. Browser scenarios use local account/storage and YouTube fixtures; they do not change live learner records.

`node scripts/test-earthing-browser.mjs` uses the local fixture server to reproduce the customised eight-video introduction and empty ADS section on desktop and 320px mobile. It verifies repaired placements, mixed watched totals, notes, bookmarks, resume positions, three-dot move/Undo and reload.
