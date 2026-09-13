# C2-01 Overview / Standards Companion — Electrical Foundations

This commit is the first reviewed stage-specific Overview published through the horizontal Standards Companion shell.

## Scope

The stage covers all fourteen neutral Module 01 learning sections:

1. Electricity and charge
2. Circuits and Ohm’s law
3. Conductor geometry, temperature and resistance
4. Length and material resistivity
5. Series and parallel circuits
6. Power, energy and electrical effects
7. Magnetism and AC waveforms
8. Inductive and capacitive opposition
9. Waveforms and phasors
10. Voltage and impedance triangles
11. AC currents and power
12. Coil analysis and correction
13. Apparent-power reinforcement
14. Safe electrical measurement

It also provides the licensing bridge into connected load, maximum demand, diversity/utilization/coincidence and single-phase design current, because EPRA lists these as C2 foundation competencies even though the detailed course lesson on demand sits later in the design stage.

## Source decisions

- The current EPRA written/oral competency document is the Kenyan authority for what C2 must cover.
- Basic electrical theory is primarily taught from the existing course because the supplied wiring guides are not complete basic-theory textbooks.
- ECA Guide C3 pp. 23–25 is used only as historical/explanatory support for load-assessment terminology.
- ECA Guide C4.3.2 p. 30 is used only as historical/explanatory support for the single-phase design-current relationship.
- Schneider Electrical Installation Guide is used as a current specialist explanation for utilization (`ku`), coincidence (`ks`) and reciprocal diversity conventions.
- Current IET On-Site Guide Appendix A is kept as a bibliographic current-technical reference for demand/diversity. No reader jump is enabled until the exact pages used are separately verified.
- The already verified On-Site Guide printed p. 123 / reader p. 125 mapping is reused only for safe measurement/testing-state discipline.

No historical numerical table is promoted to a current Kenyan rule.

## Canonical definition policy

Existing course vocabulary is preserved for compatibility. C2-01 enriches the canonical records with:

- reviewed stage/section ownership;
- practical examples;
- related terms;
- explicit distinctions;
- formula links;
- related lesson links where a reliable target is known;
- unscored oral-explanation prompts.

New canonical records are added for concepts missing from the old vocabulary, including energy, AC/DC, frequency, single phase, series/parallel circuits, resistivity, magnetic field, induction, transformer, inductance/capacitance/reactance, phasors, RMS, the P/Q/S family, connected load, duty cycle, demand factor, utilization factor and coincidence factor.

None is labelled `FORMAL DEFINITION — VERIFIED` because exact current Part 2 wording has not been supplied/verified for this stage.

## Formula policy

Every formula includes explicit assumptions and variable definitions. The stage includes:

- `Q = It`
- `V = IR`
- `R = rho L/A`
- series and parallel resistance
- electrical power identities under the stated resistive condition
- `E = Pt`
- `f = 1/T`
- sinusoidal RMS/peak relationships
- `XL = 2 pi f L`
- `XC = 1/(2 pi f C)`
- simple series impedance magnitude
- single-phase `P/Q/S/PF`
- `Ib = P/(V PF)`
- demand factor
- utilization factor
- coincidence and reciprocal diversity

The formulas are not presented as permission to skip their assumptions.

## Kenya study values

Worked examples use **240 V single phase, 50 Hz** unless stated otherwise. The Overview explicitly tells the learner that these are course/exam calculation values and that an actual supply must be verified in real work.

## Verification boundary

C2-01 teaches what electrical measuring quantities mean and how instrument choice follows the question. It does not try to replace C2-08 testing.

The practical safety rule remains:

- resistance/continuity on an appropriately isolated circuit;
- live voltage/current work only under the applicable competent, rated and controlled method;
- safe-isolation evidence is not inferred from a control switch or an instrument in the wrong mode.

## Assessment boundary

No quiz, score, checkpoint, pass/fail gate or assessment engine is introduced.

The C1/C2 exam banks are used only as a completeness check: if C2 may legitimately ask a foundation concept, C2-01 must teach it before the future assessment layer tests it.
