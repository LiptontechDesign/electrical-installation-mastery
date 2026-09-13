# C2/C1 Competency and Source Counter-Audit

Date: 2026-09-13

Repository baseline audited: `LiptontechDesign/electrical-installation-mastery`

## Audit purpose

This audit asks two separate questions:

1. **Competency completeness:** does the C2/C1 Overview knowledge layer actually teach every current EPRA competency that a later assessment engine may legitimately test?
2. **Source completeness:** is each important rule/definition/number supported at the correct authority level, without silently promoting course notes, historical guidance, draft regulations or unverified book pages into current Kenyan requirements?

A competency can therefore be **covered** while an exact normative source remains deliberately **source-limited**. Those are not the same status.

## Authority hierarchy used

1. Kenyan law / EPRA / adopted Kenyan standards.
2. Current BS 7671 / current IET On-Site Guide technical baseline where consistent with Kenyan requirements.
3. Current manufacturer/product data for exact equipment.
4. Specialist explanatory sources.
5. Historical ECA material for explanation only.
6. Course explanation and worked examples.

The 2024 draft electricity installation regulations are not treated as current normative authority merely because they exist in draft/public-comment form.

## Primary current anchors now in the canonical dataset

### EPRA competency documents

- `epra-c2-competencies` — verified Kenyan licensing competency source.
- `epra-c1-competencies` — verified Kenyan licensing competency source.

### Kenya Energy Act 2019

Canonical source: `kenya-energy-act-2019`.

Sections 149–151 anchor electrical-worker certification, contractor licensing, work by persons duly authorised by the Authority, installation certification before initial connection, periodic inspection/testing and defect remediation.

### National Building Code 2024

Canonical source: `kenya-building-code-2024-electrical`.

Part XV is now used as the Kenyan building-electrical standards bridge. Paragraph 312 identifies the Energy Act, KS 662, KS 1587, relevant KS IEC 60947/61439/62208 families and BS 7671 among the applicable electrical references.

## Licensing scope remediation completed during this audit

The Overview now contains canonical, Kenya-verified scope terms instead of leaving the licensing boundary implicit.

### C2

`c2-licence-scope` records:

- low voltage;
- single phase;
- buildings up to two storeys;
- factories excluded;
- places designated for public entertainment excluded.

### C1

`c1-licence-scope` records:

- every C2 competency remains part of C1;
- low-voltage three-phase installation is added;
- buildings up to four storeys;
- factories excluded;
- places designated for public entertainment excluded;
- the additional C1 competencies remain required.

This matters because C1 is cumulative, not a replacement curriculum.

# C2 competency matrix

| EPRA C2 competency | Canonical teaching location | Result | Source status |
|---|---|---|---|
| National regulations, codes and standards | C2-02 + `kenya-electrical-installation-framework` | **PASS** | **Strong current Kenyan anchor** — EPRA + Energy Act + Building Code |
| LV single-phase installation up to 2 storeys; exclusions | C2-02 + `c2-licence-scope` | **PASS** | **Kenya verified** — EPRA |
| AC/DC, voltage, current, resistance, power, energy, power triangle, circuits | C2-01 | **PASS** | EPRA + course; technical/explanatory sources |
| Diversity, utilization, PF, selectivity terminology | C2-01 / C2-05 / C2-06 | **PASS** | EPRA + course + specialist/current technical baseline |
| Single-phase P/I/V calculations | C2-01 / C2-06 | **PASS** | EPRA + course; 240 V is a declared course convention |
| One-way/two-way/intermediate switching | C2-03 | **PASS** | EPRA + course + OSG baseline |
| Radial/ring socket circuits | C2-03 | **PASS** | EPRA + course + OSG baseline |
| Sizing/installation of protective devices | C2-05 / C2-06 / C2-07 | **PASS** | EPRA + current technical baseline |
| Special protective devices | C2-05 / C2-07 | **PASS** | RCD/RCCB/RCBO/SPD/AFDD concepts covered |
| Measuring instruments | C2-01 / C2-08 | **PASS** | EPRA + verified OSG safe-testing page + course |
| Cable selection/current capacity and colour coding | C2-03 / C2-04 / C2-06 | **PASS WITH SOURCE CAVEAT** | Capacity/design strong; colour table is BS 7671 technical baseline pending exact current adopted KS 662 table |
| Fuses/MCB/MCCB/RCD etc. | C2-05 / C2-07 | **PASS** | Strong conceptual/current technical coverage |
| Luminaire selection | C2-03 | **PASS** | EPRA + course; environmental/IP/thermal/control suitability taught |
| Testing and commissioning domestic installation | C2-08 | **PASS** | EPRA + Energy Act legal anchor + current OSG initial-verification baseline |
| Domestic earthing | C2-05 | **PASS** | EPRA + current OSG earthing/ADS baseline |
| Electrical safety and first aid | C2-02 | **PASS** | EPRA + safe-isolation material + current St John CPR/AED guidance |

## C2 stage-by-stage source counter-check

| Stage | Competency completeness | Source quality | Notes |
|---|---|---|---|
| C2-01 Foundations | PASS | Good | OSG Appendix A remains bibliography-only until the exact reader pages used by the Overview are individually verified. The supplied 258-page asset contains the appendix. |
| C2-02 Architecture/Drawings/Safety | PASS | **Strong** | Audit added exact C2 scope plus Energy Act and Building Code authority layer. |
| C2-03 Wiring/Accessories | PASS | Good with caveat | Audit added explicit conductor-identification/colour teaching. Exact current adopted KS 662 colour table still needs verification. |
| C2-04 Cables/Containment | PASS | Good conceptually | OSG Appendices C–F are present in the supplied asset and referenced bibliographically; exact reader jumps remain disabled until each source-page mapping used by the Overview is verified. |
| C2-05 Protection/Earthing/ADS | PASS | Strong conceptually | OSG protection/earthing/RCD/Zs sources remain current baseline references; unverified appendix page jumps are not guessed. |
| C2-06 Single-Phase Design | PASS | Strong | Full load → Ib → In → method/factors → Iz → VD → fault/ADS → breaking-capacity workflow. |
| C2-07 Consumer Units | PASS | **Improved** | Audit added Building Code bridge to KS IEC 60947/61439 product/assembly families. |
| C2-08 Testing/Commissioning | PASS | **Improved** | Audit added Energy Act certification/periodic-duty anchor; technical sequence remains source-based. |
| C2-09 Fault Finding | PASS | Good | Evidence-led diagnosis reuses the testing/protection source layer rather than inventing a separate fault standard. |

# C1 competency matrix

EPRA states that C1 includes the areas of competency under C2. The rows below therefore describe the **additional C1 layer**; all C2 rows above remain inherited.

| Additional EPRA C1 competency | Canonical teaching location | Result | Source status |
|---|---|---|---|
| All C2 competencies | C1-01 + `c1-licence-scope` | **PASS** | Kenya verified — EPRA |
| LV three-phase installation up to 4 storeys; exclusions | C1-01 + `c1-licence-scope` | **PASS** | Kenya verified — EPRA |
| Three-phase P/I/V | C1-01 / C1-02 | **PASS** | Star/delta + √3 power/current relationships; 240/415 V, 50 Hz declared course convention |
| Cable/protective-device sizing | C1-03 / C1-04 | **PASS** | Extends C2 design into phase balance, neutral, feeder/submain and 3φ VD/fault duty |
| Special protective devices | inherited C2 + C1 distribution/motor protection | **PASS** | Product-specific settings still require manufacturer data |
| Earthing in domestic/small-commercial installations | C1-05 | **PASS** | Submain CPC/SWA armour/parallel paths/ADS/Zs/fault thermal duty covered |
| PF causes, demerits, correction, PFC sizing | C1-06 | **PASS** | P/Q/S, Qc, capacitor current, fixed/APFC and harmonic/detuned cautions covered |
| Three-phase machines: motors, starting, speed control, protection | C1-07 / C1-08 | **PASS** | Nameplates, synchronous speed/slip, DOL/star-delta/soft/VFD and protection layers covered |
| Initial and periodic inspection/testing | C1-09 | **PASS WITH SOURCE CAVEAT** | Initial verification strong; Kenyan legal periodic duty verified; detailed current GN3 codes/intervals remain deliberately unintegrated |

## C1 stage-by-stage source counter-check

| Stage | Competency completeness | Source quality | Notes |
|---|---|---|---|
| C1-01 Three-Phase Fundamentals | PASS | **Strong after audit** | Exact cumulative C1 scope + Kenyan regulatory framework + conductor-identification baseline now explicit. |
| C1-02 Three-Phase Power | PASS | Good | Balanced 3φ P/Q/S/current formulas and worked interpretation. |
| C1-03 Distribution | PASS | Good | Boards/feeders/submains/phase allocation/neutral/harmonics/phase sequence/selectivity. |
| C1-04 Design | PASS | Good/strong | Full 3φ design evidence chain; exact tables remain source-sensitive. |
| C1-05 Earthing | PASS | Good/strong | SWA-as-CPC only when suitability is demonstrated; parallel paths explicitly addressed. |
| C1-06 PFC | PASS | Good | Specialist PFC source currently supporting; exact equipment selection remains manufacturer-specific. |
| C1-07 Motors | PASS | Good | Motor/nameplate/course sources + historical ECA only for explanatory context. |
| C1-08 Motor Control/Protection | PASS | **Improved** | Audit added Building Code / KS IEC 60947 product-family bridge; exact starter/drive settings remain manufacturer data. |
| C1-09 Testing/Periodic | PASS | **Known source gap remains** | Energy Act legal periodic duty is verified; detailed current GN3 content has not been imported locally. |
| C1-10 Fault Diagnosis | PASS | Good | Evidence-led distribution/motor/control diagnosis; repair → retest → document preserved. |

# Remaining source gaps — intentionally visible

These are **not competency omissions**. They are source-authority gaps that the course must continue to label honestly.

## 1. Exact current adopted KS 662 conductor-identification table

Status: **OPEN — high value**.

The course now teaches the BS 7671 technical-baseline colours and explicitly covers EPRA's colour-coding competency, but it does **not** claim that the displayed table is a verbatim current adopted Kenyan KS 662 table.

Until that exact source is integrated:

- retain `CURRENT BS 7671 TECHNICAL BASELINE` / `CHECK KENYAN REQUIREMENT` status;
- do not label the colour table `KENYA VERIFIED`;
- do not write assessment answers claiming the table is verbatim KS 662.

## 2. Current Guidance Note 3 detailed periodic-inspection content

Status: **OPEN — high value for C1-09**.

The legal duty for periodic inspection/testing is now anchored in Energy Act 2019. The course still lacks a verified local copy/extraction of the current GN3 detail needed for exact observation coding, recommended frequencies and source-specific procedural detail.

Until integrated:

- teach the purpose/scope/evidence model;
- do not invent codes, intervals or numerical limits;
- assessment questions must not require unsourced GN3-specific recall.

## 3. Exact current OSG Appendix A–M reader mappings

Status: **OPEN — page-mapping/editorial limitation**.

The supplied current OSG asset has 258 PDF pages and includes Appendices A–M. Its chapter map reaches printed page 254 and the final index/back matter. Overview references correctly retain bibliographic printed-page labels, but an “Open source page” action remains disabled until the exact PDF page used by that individual reference has direct mapping evidence. The course does not infer a reader jump merely from the known general page offset.

## 4. Exact current BS 7671 Part 2 formal-definition wording

Status: **OPEN — editorial precision**.

Current canonical terms therefore remain `CURRENT STANDARDS MEANING` or explanatory definitions unless exact current formal wording has been independently verified. The UI must not promote a paraphrase to `FORMAL DEFINITION — VERIFIED`.

## 5. Manufacturer-specific protective-device / motor-control settings

Status: **BY DESIGN**.

Breaking capacities, selectivity ranges, MCCB settings, motor protection settings, capacitor bank ratings, VFD/soft-starter parameters and torque values remain product-specific and should be sourced from actual current manufacturer data when a question/design uses a particular device.

# Assessment-readiness decision

## Competency readiness

**PASS.** The complete C2 + additional C1 EPRA competency set is now represented in the Overview knowledge layer.

## Regulatory/source readiness

**PASS WITH DECLARED SOURCE LIMITATIONS.** The audit closed the most serious authority gaps by integrating Energy Act 2019, National Building Code 2024, exact C2/C1 licensing boundaries and explicit colour-coding teaching. Remaining gaps are narrow and are now explicitly marked rather than hidden.

## Safe boundary for the next assessment phase

The new assessment engine may now draw questions from the Overview where the answer is fully supported. It must continue to obey these gates:

1. past papers define **question style and mark depth**, not automatically the current technical answer;
2. current Kenyan law/EPRA/adopted standards override historical material;
3. UK/IET material is a technical baseline where consistent with Kenyan requirements;
4. do not assess exact KS 662 conductor-colour wording as Kenya-verified until the current adopted source is integrated;
5. do not assess exact GN3 periodic codes/intervals until the current source is integrated;
6. do not assess source-sensitive OSG appendix table values unless the exact current data are verified or supplied in the question/source pack;
7. manufacturer-specific questions must provide or cite the actual product data;
8. every scored question should be traceable back to the canonical Overview term/formula/source that teaches its answer.

# Regression protection

A dedicated script now checks the cross-cutting findings:

```bash
npm run test:competency
```

The test asserts:

- current Kenyan legal/EPRA sources exist and are marked correctly;
- exact C2 and C1 scope language remains present;
- C1 explicitly inherits C2;
- national regulations/codes/standards are taught with Kenyan authority sources;
- colour coding remains explicitly covered but is not falsely marked Kenya-verified;
- C2-07 and C1-08 retain the Building Code product/assembly bridge;
- C2-08 and C1-09 retain the Energy Act inspection/certification anchor;
- all 19 licensing stages remain authored and source-linked;
- GN3 detail and unverified OSG appendix reader mappings remain visibly source-limited.

# Final audit verdict

**C2 competency coverage:** PASS  
**C1 additional competency coverage:** PASS  
**C1 inheritance of C2:** PASS  
**Kenyan licensing-scope coverage:** PASS after remediation  
**National law/standards framework:** PASS after remediation  
**Colour-coding competency:** PASS for teaching; exact adopted KS 662 source still open  
**Initial verification:** PASS  
**Periodic inspection legal basis:** PASS; detailed current GN3 source still open  
**Source-page integrity / no guessed PDF jumps:** PASS  
**Historical ECA isolation from current authority:** PASS  
**Ready to begin assessment-engine implementation:** YES, subject to the source gates above.
