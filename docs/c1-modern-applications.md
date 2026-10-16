# C1 modern applications and historical priorities

Reviewed 16 October 2026. Curriculum revision 11 adds seven YouTube videos (1 h 34 min 20 s), using the existing lesson players, section rows and study-role labels. C1 now has 138 default video rows in 84 sections. C2 and Advanced retain their published content and order.

## Selection and teaching order

Complete available English captions were read for every selected video. Five tracks came from YouTube's native transcript export and two from the public YTTools caption provider. Native exports give the final cue timestamp, not its duration; this is recorded separately from the observed video running time. The [evidence manifest](c1-application-video-review.json) records scope, language, review extent and hashes. Full third-party caption text remains in ignored research files. This is a content review, not a claim of frame-by-frame inspection.

| Placement | Video and instructor | Contribution and boundary |
|---|---|---|
| Module 11, after CT and wattmeter principles | [Configure a three-phase analyser](https://www.youtube.com/watch?v=1JhOXUrjpsI), ATEC, 5:55 | Shows voltage/current channels, neutral, phasors, supply configuration and logging. The bench is already connected; it does not teach a safe live-connection procedure or calculate an unbalanced load. Its 480 V / 60 Hz example is identified in one short note. |
| Same section, second | [Digital two-wattmeter demonstration](https://www.youtube.com/watch?v=-RWS7Cwkuus), Yokogawa Test&Measurement, 9:48 | Defines and derives the three-wire method, connects two measuring elements and displays real measurements on a motor-drive bench. Explicitly separates total real power from individual phase powers and discusses limits of power-factor inference for unbalanced loads. |
| Module 13 opening, before load assessment and sizing | [Plan a building installation](https://www.youtube.com/watch?v=7nge0ugiVyY), SparkyNinja, 29:44 | Turns a client brief and floor plan into distribution, containment, lighting/switching and socket routes, then defensible cable lengths. Provisional choices are checked later. This is a planning example from an earlier UK course, not a complete current design calculation or completed four-storey project. |
| Module 15, after capacitor correction arrangements | [Synchronous-condenser introduction](https://www.youtube.com/watch?v=6U_rO5FWW0Y), Flirting with Technology, 1:53 | Short explanation of an unloaded synchronous machine supplying or absorbing reactive power for voltage and power-factor support. This is introductory awareness, not excitation calculations, condenser sizing or grid engineering. |
| Module 18, after test procedures and handover, before periodic reporting | [Interpret ring-circuit readings](https://www.youtube.com/watch?v=niuVdopqlcs), Learn Electrics, 15:37 | Derives expected readings from series/parallel paths, explains the divide-by-four estimate and unequal conductor sizes, then distinguishes spurs, loose connections and wrong test links. Reuses C2 continuity principles without requiring a trip back to C2. It is a focused interpretation exercise, not every test-result scenario. |
| Module 19, after fire prevention and emergency response | [Preserve the scene and collect evidence](https://www.youtube.com/watch?v=_RMYPD-T1Aw), Compassa / Will Taylor, 12:40 | Applies evidence collection to an authored workplace-injury case: photographs, sketches, positions, conditions, witnesses and relevant equipment/training records. A short note establishes that emergency response and scene safety come first. |
| Same section, second | [Causes and corrective actions](https://www.youtube.com/watch?v=vbmQ4yXcXB8), Compassa / Will Taylor, 18:43 | The same instructor develops an authored near-miss case from immediate, underlying and root causes into controls, management reporting and assigned actions with timescales/resources. General investigation method transfers to electrical incidents; specialist electrical-fire forensics and Kenyan notification rules are outside these clips. |

Four additions use UK teaching channels. The metering demonstrations use instrument specialists; the short condenser explanation was selected for its specific introductory scope. Different instruments and teachers remain separate examples rather than being presented as one continuous physical installation.

## Priorities retained

- **Wheatstone bridge remains core:** null balance and comparative resistance measurement are useful principles. Age alone is not a reason to remove a concept.
- **Lorenz apparatus remains available as optional historical revision:** its stable lesson ID, marks and personal notes survive. It moves to the end of Module 11, after generator control, in a clearly labelled historical section. No lengthy new Lorenz lecture was added. The available absolute-versus-comparative question does not establish a requirement for a full numerical Lorenz derivation.
- **Historical phase advancers receive brief written awareness:** no long new historical video branch was added. Modern capacitor correction and the condenser overview receive priority.
- **Power summation and load imbalance remain relevant:** modern analyser teaching supplements the existing one/two/three-wattmeter principles. The exact procedure of successively using one wattmeter on an unbalanced four-wire load remains in the independently authored worked answer; neither new analyser clip is claimed to demonstrate that exact arrangement.
- **Synchronous condensers are current technology:** their continuing reactive-power, inertia and system-strength roles are independently supported by [Hitachi Energy's current system description](https://www.hitachienergy.com/us/en/products-and-solutions/facts/synchronous-condenser-system). The C1 addition stays introductory.
- The retained capacitor-placement note now states **self-excited induction generation**, alongside the existing warning to keep correction capacitors off VFD outputs. It does not describe an induction motor as becoming a synchronous generator.

The evidence → analysis → controls → action sequence agrees with [HSE HSG245](https://www.hse.gov.uk/pubns/books/hsg245.htm). The fact that this useful investigation method predates current equipment does not make the reasoning obsolete.

## Candidates not added

The review deliberately omitted additional product tours and examples that needed more corrective explanation than their teaching benefit justified:

- A121 `P3n4qlyRIdo`: first 30 minutes reviewed; the motor cannot-overload assumption and the three-phase voltage-drop comparison required qualifications. No complete-caption-review claim is made for the remaining portion.
- Completely Electrical `pxqn3JFBuOo`: first 40 minutes reviewed; the later blanket 1.45 × device-rating explanation was unsuitable as a beginner's design rule. The remaining caption portion was not needed for rejection.
- JPElectric `yFeDPY9NO0k`: complete available captions reviewed; the generic 0.05 Ω bonding limit needed qualification. The more focused Learn Electrics application was selected.
- Learn Electrics `BEK1iUx09kQ`: complete available captions reviewed; the mixed revision lesson had ambiguous PFC terminology in the captions. The focused ring-result lesson gave a cleaner evidence-to-interpretation sequence.
- Energy Live News `T29D2npCo5A`: complete available English captions reviewed; useful current-industry context, but much longer than the concise condenser introduction needed here.
- Jim Pytel `0Ciis2LMw8U`: complete translated captions and the first eight minutes of the recovered English track reviewed; a deeper bench lecture with synchronous-motor prerequisites, rather than the short introduction chosen. No full recovered-English review claim is made.
- Transgrid `IdWaTaNfr10`: a promising short operator explanation, but a complete transcript was not obtained, so it was not selected.
- A full testing demonstration already in C2, `JIdARijhacs`, was not copied as a result-judgement capstone: the reviewed opening explicitly prioritises procedure over the training rig's numerical readings. Its existing C2 placement remains.

## Coverage limits

The comparison uses the 78 consolidated C1 study questions drawn from eight available dated third-party C1 archive copies. It does not establish possession of every past paper, an authenticated official marking scheme or future EPRA coverage.

These additions strengthen modern measurement, building planning, result interpretation and incident investigation. The existing [four-storey worked project](../public/c1-worked-project.md) and past-paper worked answers still join the individual methods into complete written design/calculation responses. Exact multi-storey/cold-store drawings, every failed test combination, billing applications, the older successive one-wattmeter arrangement and detailed absolute-resistance methods are not newly demonstrated end to end in video. Kenyan licensing, supply and reporting requirements still require their local sources.

## Saved courses and verification

Revision 11 inserts seven new stable lesson IDs and moves only the former published Lorenz occurrence. The existing revision-aware migration preserves explicit personal destinations, relative order, private copies of every new video, supporting descendants through archived parents, archives, deletions, historical Undo receipts and later edits. C2 originals and Advanced sequences are checked against their approved fixtures.

`scripts/fixtures/c1-application-previous.json` is the actual 464-row revision-10 published snapshot captured before this edit. `test:c1-applications` verifies its exact upgrade, removal and edit preservation, prerequisite order, caption evidence and independent ring-resistance calculations. Curriculum, historical migration, progress, account-isolation, guest-access, protected Practice/Past Papers, lint and the Next.js production build passed. A separate comparison with the previous commit confirmed that complete C2/Advanced module metadata and every existing lesson's content/identity remain unchanged except the intended Lorenz role/note and C1 numbering.

All seven new embedded players were started successfully in a local production build in guest mode. Each had `paused: false`, media ready state 4 and an advancing position beyond 11 seconds. The analyser pair and incident pair were also checked through the existing Next lesson control; building planning opens at Video 1 and leads into load assessment, and result interpretation leads into periodic reporting. No watched marks were set. Actual playback observations are in the evidence manifest. The browser's screenshot capture timed out; no visual screenshot verification is claimed. Layout/navigation checks used the rendered DOM and media elements.

The pre-existing Definitions export-freshness issue is outside this video-only change; its source and generated files remain untouched. The passing build used the configured Vercel Next.js command, which does not run that unrelated export check.
