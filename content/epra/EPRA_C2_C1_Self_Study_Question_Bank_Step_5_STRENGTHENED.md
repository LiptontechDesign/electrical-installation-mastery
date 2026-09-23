# EPRA C2 & C1 Self-Study Question Bank

## Step 5 — Lighting Circuits, One-Way/Two-Way/Intermediate Switching, Socket Circuits, Radial and Ring Final Circuits, and Practical Fault-Finding — Strengthened Distinction Edition

> **Purpose of this step:**  
> Step 5 develops the practical circuit knowledge that EPRA explicitly expects at C2 level and therefore also carries into C1.
>
> The focus is on understanding how circuits are actually connected and how they behave:
>
> - one-way lighting;
> - two-way lighting;
> - intermediate switching;
> - luminaires and switching conductors;
> - radial socket circuits;
> - ring final circuits;
> - spurs;
> - socket-outlet protection;
> - circuit loading;
> - continuity/polarity logic;
> - and practical fault-finding.
>
> The goal is not only to draw a circuit. The student should be able to explain:
>
> \[
> \boxed{\text{where current flows, what each conductor does, what changes when a switch operates, and how faults reveal themselves}}
> \]

---

# Strengthened-Edition Answer Method

This strengthened Step 5 keeps the original question bank but upgrades the answer standard.

For calculations:

\[
\boxed{\text{GIVEN}\rightarrow\text{FORMULA}\rightarrow\text{SUBSTITUTION}\rightarrow\text{ANSWER}\rightarrow\text{CHECK}}
\]

For technical/oral explanations:

\[
\boxed{\text{Definition}\rightarrow\text{Meaning}\rightarrow\text{How it works}\rightarrow\text{Why it matters}\rightarrow\text{What happens if wrong}}
\]

## Definition Source Rule

- Where the uploaded BS 7671 Part 2 **formally defines** a term, that definition is used or closely preserved and is identified as the formal book definition.
- Where the book does **not** formally define a classroom concept, the answer is labelled as a foundational electrical explanation rather than a supposed BS 7671 quotation.
- The uploaded book is the **Seventeenth Edition incorporating Amendment 3:2015**. It is used for requested definition wording and terminology, not as authority for current 2026 numerical requirements.


# Important Standards Note

EPRA currently lists the following directly under the C2 competency areas:

- **lighting switches — one-way, two-way and intermediate;**
- **power/socket circuits — radial and ring main;**
- **selection of luminaires;**
- **protective devices;**
- **testing and commissioning.**

C1 includes the C2 competency areas.

The BS 7671 references below are used because they provide excellent technical examples and because the source learning material is based on the Brown Book framework.

At the time this study step was prepared, **BS 7671:2018+A4:2026 had been published, but BS 7671:2018+A2:2022+A3:2024 remained valid during the transition period until 15 October 2026**.

The Brown Book regulation numbers used in the teaching material are therefore retained where appropriate.

Do not automatically assume that every BS 7671 UK-specific circuit arrangement, accessory standard or numerical rule is a Kenyan legal requirement. Learn the **electrical principle first**, and use the applicable Kenyan regulation/code where the examination specifically asks for the national requirement.

---

# Key BS 7671 References Used in Step 5

- **Regulation 411.3.3** — additional RCD protection for specified socket-outlets and outdoor mobile equipment;
- **Regulation 411.3.4** — additional RCD protection for AC final circuits supplying luminaires in domestic premises;
- **Regulation 433.1.204** — BS 1363 ring-final-circuit overload arrangement;
- **Regulation 514.4** — identification of protective conductors;
- **Regulation group 514.3** — identification of conductors;
- **Regulation 559.5** — luminaires and lighting installations;
- **Regulation 643.6** — verification of polarity;
- **Appendix 15** — informative guidance relating to ring and radial final circuits supplying BS 1363 accessories.

---

# Section A — Lighting-Circuit Fundamentals

## Question 1 — Purpose of a Lighting Circuit
**What is the purpose of a lighting final circuit? (3 marks)**

### Answer

### Formal BS 7671 definition of final circuit

The uploaded Part 2 defines a **Final circuit** as:

> **“A circuit connected directly to current-using equipment, or to a socket-outlet or socket-outlets or other outlet points for the connection of such equipment.”**

A lighting final circuit therefore directly supplies:

- luminaires;
- associated switches;
- and related lighting equipment

from the final protective device to the current-using equipment.

A final circuit is the part of the installation that directly supplies:

\[
\boxed{\text{current-using equipment or socket-outlets}}
\]

rather than another distribution board.

A lighting circuit normally contains:

- line conductor;
- neutral conductor;
- circuit protective conductor;
- switching conductors as required.

---

## Question 2 — Function of the Line Conductor
**What is the function of the line conductor in a lighting circuit? (3 marks)**

### Answer

The line conductor carries current from the source towards the load.

In a normal single-phase AC circuit, it is the conductor maintained at line potential relative to neutral/Earth.

Switches intended for ordinary single-pole control should normally interrupt the:

\[
\boxed{\text{line conductor}}
\]

not the neutral.

This ensures that when the switch is OFF, the downstream switched part of the lighting circuit is not intentionally left connected to the live line supply.

---

## Question 3 — Function of Neutral
**What is the function of the neutral conductor in a normal single-phase lighting circuit? (3 marks)**

### Answer

The neutral conductor provides the normal return path for load current to the source.

With a lamp operating:

\[
\text{line}\rightarrow\text{lamp}\rightarrow\text{neutral}
\]

forms the normal current path.

Neutral is a live conductor under BS 7671 terminology even though it is normally close to Earth potential.

Therefore neutral must not automatically be assumed safe to touch.

---

## Question 4 — Function of the CPC
**What is the function of the CPC in a lighting circuit? (4 marks)**

### Answer

The CPC provides the protective connection to exposed-conductive-parts that require earthing.

During normal operation, it should not carry normal load current.

During a line-to-metal fault, it provides a low-impedance fault-current path so that the protective device can disconnect the supply.

The CPC should be continuous to all points where protective earthing may be required, including:

- metal luminaires;
- metal switch boxes;
- metal accessories;
- other Class I equipment.

---

## Question 5 — Permanent Line vs Switched Line
**Differentiate between a permanent line conductor and a switched line conductor. (4 marks)**

### Answer

### Permanent line

A permanent line conductor remains connected to the line supply whenever the circuit is energized.

It supplies:

- switches;
- control devices;
- loop connections;
- other permanent-line points.

### Switched line

A switched line becomes energized only when the relevant switch path is closed.

It carries line potential from the switch to the load.

For a simple lighting circuit:

\[
\text{permanent line}\rightarrow\text{switch}\rightarrow\text{switched line}\rightarrow\text{lamp}
\]

---

# Step 5 Distinction Lens — Follow the Current Path

For switching questions, do not memorize a drawing without understanding it.

Always ask:

1. Where is the **permanent line**?
2. Which contact is selected?
3. Where does the **switched line** go?
4. Is neutral continuous to the load?
5. Is the CPC continuous?
6. What changes when the switch is operated?

For two-way/intermediate circuits, trace **continuity paths**, not switch-handle positions. “Up” and “down” are not universal electrical states.

---

# Section B — One-Way Lighting

## Question 6 — Define One-Way Switching
**What is one-way lighting control? (3 marks)**

### Answer

One-way switching means:

\[
\boxed{\text{one switch controls one lighting point or lighting group from one location}}
\]

The switch either:

- completes the line path to the lamp;
- or opens the line path.

Therefore:

- switch ON → circuit complete → lamp operates;
- switch OFF → line path open → lamp does not operate.

---

## Question 7 — One-Way Switch Terminals
A typical one-way switch uses COM and L1 terminals.

**Explain how they are used. (4 marks)**

### Answer

A typical connection is:

- permanent line into:

\[
\boxed{COM}
\]

- switched line out from:

\[
\boxed{L1}
\]

When the switch is ON:

\[
COM\leftrightarrow L1
\]

and current can flow to the lamp.

When the switch is OFF, the connection is open.

Depending on the switch design and manufacturer, terminal markings can vary, so the actual accessory markings should always be checked.

---

## Question 8 — Current Path with One-Way Switch ON
**Describe the current path when a one-way lighting switch is ON. (6 marks)**

### Answer

The current path is approximately:

1. source line conductor;
2. circuit protective device;
3. permanent line conductor;
4. switch common terminal;
5. closed switch contact;
6. switched line conductor;
7. luminaire;
8. lamp/load;
9. neutral conductor;
10. return to source.

The CPC is not part of the normal operating-current path.

It is provided for protection if a fault occurs.

---

## Question 9 — Current Path with Switch OFF
**What happens electrically when the one-way switch is OFF? (4 marks)**

### Answer

The switch opens the line path.

Therefore:

\[
\boxed{\text{the circuit to the lamp is incomplete}}
\]

No normal load current can flow through the lamp.

The neutral may still be connected to the luminaire.

The permanent-line conductor up to the switch remains energized while the circuit itself remains supplied.

This is why simply switching a light OFF is **not safe isolation**.

---

## Question 10 — Neutral Switched Instead of Line
A one-way switch has accidentally been connected in the neutral conductor.

The lamp still switches ON and OFF.

**Explain why the arrangement is unsafe. (6 marks)**

### Answer

Opening the neutral stops normal current, so the lamp appears to operate correctly.

However, the line conductor remains permanently connected to the lamp/fitting.

Therefore, when the switch is OFF:

- the lamp may appear dead;
- but parts of the fitting can remain connected to line potential.

A person changing a lamp or working on the luminaire could receive an electric shock.

The switch should interrupt the:

\[
\boxed{\text{line conductor}}
\]

---

## Question 11 — One-Way Circuit Fault: Lamp Never Turns On
A one-way lighting circuit is supplied correctly, but the lamp never illuminates.

**State six faults that could cause this. (6 marks)**

### Answer

Possible faults include:

1. failed lamp;
2. open line conductor;
3. open switched-line conductor;
4. open neutral conductor;
5. faulty switch contact;
6. loose terminal;
7. tripped protective device;
8. incorrect connection;
9. damaged lampholder;
10. no supply to circuit.

Fault-finding should proceed systematically rather than replacing parts randomly.

---

## Question 12 — One-Way Circuit Fault: Lamp Permanently ON
A lamp remains ON regardless of the switch position.

**Give four likely causes. (4 marks)**

### Answer

Possible causes include:

1. switch has been bypassed;
2. switched line connected directly to permanent line;
3. incorrect terminal connection;
4. switch contacts mechanically welded/failed closed;
5. wiring fault shorting across the switch path.

The key diagnostic idea is:

\[
\boxed{\text{the lamp is receiving permanent line instead of a properly switched line}}
\]

---

# Section C — Two-Way Lighting

## Question 13 — Define Two-Way Switching
**What is two-way switching? Give a practical example. (4 marks)**

### Answer

Two-way switching allows one lamp or lighting group to be controlled from:

\[
\boxed{\text{two different locations}}
\]

Typical applications include:

- top and bottom of a staircase;
- two entrances to a room;
- opposite ends of a corridor.

Either switch can change the state of the lamp.

---

## Question 14 — Two-Way Switch Terminals
A typical two-way switch contains:

- COM;
- L1;
- L2.

Explain the purpose of these terminals. **(5 marks)**

### Answer

### COM

The common terminal connects internally to either L1 or L2 depending on switch position.

### L1 and L2

These are the two alternative switched paths.

In a normal two-way arrangement:

- L1 and L2 of one switch are connected to corresponding switching conductors at the other switch;
- these interconnecting conductors are commonly called **strappers**.

The common terminals are used for the incoming permanent line and outgoing switched line, depending on the wiring method.

---

## Question 15 — What Are Strappers?
**Define strapper conductors in a two-way lighting circuit. (4 marks)**

### Answer

Strappers are the two conductors connecting the alternative switch paths between two-way switches.

They normally connect:

\[
L1\leftrightarrow L1
\]

and:

\[
L2\leftrightarrow L2
\]

or the equivalent arrangement required by the chosen wiring method.

The two-way switches select between these paths.

The lamp operates when the switch positions create a complete path from permanent line to switched line.

---

## Question 16 — How Two-Way Switching Works
**Explain, without relying on a memorized diagram, how two switches can control one lamp. (8 marks)**

### Answer

Each two-way switch is a changeover switch.

Its COM terminal connects to either:

- L1;
- or L2.

The two switches are linked by two strapper conductors.

One switch receives the permanent line at its COM.

The other switch provides the switched line from its COM to the lamp.

If both switches select a path that creates electrical continuity through the strapper system:

\[
\boxed{\text{lamp ON}}
\]

If the selected paths do not create continuity:

\[
\boxed{\text{lamp OFF}}
\]

Operating either switch changes which strapper path is selected and therefore changes the lamp state.

---

## Question 17 — Two-Way Truth Table
Two two-way switches are labelled A and B.

Explain the general ON/OFF pattern when either switch is changed. **(4 marks)**

### Answer

The exact physical up/down position depends on how the switches are installed, but the essential principle is:

\[
\boxed{\text{operating either switch reverses the lamp state}}
\]

Therefore:

- if lamp is ON → operate either switch → OFF;
- if lamp is OFF → operate either switch → ON.

The system is based on changeover continuity, not on both switches simply being “ON switches.”

---

## Question 18 — Broken Strapper
One strapper conductor in a two-way lighting circuit becomes open-circuit.

**Describe the possible symptom. (5 marks)**

### Answer

The lamp may:

- work only with particular combinations of the two switches;
- fail to operate from one position;
- appear to work from one switch but not reliably from the other.

This occurs because one of the two alternative paths has been lost.

The remaining strapper may still provide a complete circuit in certain switch positions.

Therefore an intermittent-looking two-way problem can actually be a permanent open circuit in one strapper.

---

## Question 19 — Incorrect COM Connection
A two-way switch has the permanent line mistakenly connected to L1 rather than COM.

**What type of symptom may occur? (4 marks)**

### Answer

The two-way system will no longer operate according to the intended changeover logic.

Possible symptoms include:

- lamp only works in certain unusual switch combinations;
- one switch appears ineffective in some positions;
- lamp may not toggle correctly from both locations.

The correct function depends on the common terminal being used as the changeover input/output.

---

## Question 20 — Testing a Two-Way Circuit
**Why must both switch positions be operated when checking continuity or operation of a two-way lighting circuit? (5 marks)**

### Answer

A two-way system contains two alternative switching paths.

Testing only one position proves only one path.

A fault could remain undetected in:

- the other strapper;
- one switch contact;
- another terminal.

Therefore the switches must be operated through the relevant combinations to prove:

- both strapper paths;
- both changeover switches;
- correct switched-line operation.

---

# Section D — Intermediate Switching

## Question 21 — Purpose of an Intermediate Switch
**When is an intermediate switch used? (3 marks)**

### Answer

An intermediate switch is used when a lighting point must be controlled from:

\[
\boxed{\text{three or more locations}}
\]

For control from three locations, the normal arrangement is:

\[
\boxed{\text{two-way}\rightarrow\text{intermediate}\rightarrow\text{two-way}}
\]

Additional intermediate switches can be inserted for additional control locations.

---

## Question 22 — How an Intermediate Switch Works
**Explain the operating principle of an intermediate switch. (6 marks)**

### Answer

An intermediate switch has four switching terminals associated with the two strapper paths.

It changes the relationship between the incoming and outgoing strappers.

In one position it connects the paths approximately:

\[
A\rightarrow A,\qquad B\rightarrow B
\]

In the other position it crosses them:

\[
A\rightarrow B,\qquad B\rightarrow A
\]

Therefore the intermediate switch changes the continuity path without being the start or end common switch.

Operating it reverses the lamp state when used correctly between two two-way switches.

---

## Question 23 — Three-Location Lighting Arrangement
**Describe the arrangement required to control one lamp from three locations. (5 marks)**

### Answer

Use:

1. a two-way switch at the first control point;
2. an intermediate switch at the middle point;
3. a two-way switch at the final point.

The permanent line enters one end two-way switch.

The switched line to the lamp leaves the other end two-way switch.

The strapper pair passes through the intermediate switch.

Therefore:

\[
\boxed{\text{2-way}\rightarrow\text{intermediate}\rightarrow\text{2-way}}
\]

---

## Question 24 — Four Control Locations
**How would you modify the arrangement to control the same lamp from four locations? (3 marks)**

### Answer

Use:

- one two-way switch at each end;
- two intermediate switches between them.

Arrangement:

\[
\boxed{\text{2-way}\rightarrow\text{intermediate}\rightarrow\text{intermediate}\rightarrow\text{2-way}}
\]

More intermediate switches may be added if still more control points are required.

---

## Question 25 — Intermediate-Switch Fault
An intermediate switch is incorrectly wired so that only one strapper path is passed through.

**What symptoms might appear? (4 marks)**

### Answer

Possible symptoms include:

- lamp works only in certain combinations;
- one or more switches appear ineffective;
- lamp cannot be controlled correctly from every location;
- circuit becomes permanently open in some positions.

The fault is diagnosed by tracing the continuity of **both strapper paths** through each switch state.

---

# Section E — Luminaire Selection and Protective Classes

## Question 26 — Factors in Luminaire Selection
**State eight factors that should be considered when selecting a luminaire. (8 marks)**

### Answer

### Formal BS 7671 definition

The uploaded Part 2 defines a **Luminaire** as equipment which distributes, filters or transforms light from one or more lamps and includes the parts necessary for supporting, fixing and protecting the lamps, together with necessary circuit auxiliaries and supply connection means.

That definition is useful because a luminaire is the complete lighting equipment, not merely “the bulb.”

Suitable factors include:

1. supply voltage;
2. lamp/LED power;
3. environmental conditions;
4. indoor or outdoor use;
5. moisture/water exposure;
6. ingress-protection requirement;
7. mounting surface;
8. heat generation;
9. fire risk;
10. mechanical damage;
11. luminaire class;
12. need for protective earthing;
13. compatibility with dimmers/controlgear;
14. emergency-lighting requirements;
15. colour/rendering and lighting performance;
16. manufacturer installation instructions.

The luminaire must be suitable both:

\[
\boxed{\text{electrically and environmentally}}
\]

---

## Question 27 — Class I Luminaire
**What is a Class I luminaire, and what protective provision does it require? (4 marks)**

### Answer

### Related formal BS 7671 definition

The uploaded Part 2 defines **Class I equipment** as equipment in which protection against electric shock does not rely on basic insulation only, but includes means for connecting exposed-conductive-parts to a protective conductor in the fixed wiring.

A Class I luminaire therefore uses basic insulation together with protective earthing.

Accessible conductive metal parts are connected to a protective conductor.

Therefore it requires an effective:

\[
\boxed{\text{CPC/earth connection}}
\]

If a line conductor faults to the metal enclosure, the CPC provides the fault-current path required for protective disconnection.

---

## Question 28 — Class II Luminaire
**What is a Class II luminaire? (4 marks)**

### Answer

A Class II luminaire relies on:

\[
\boxed{\text{double or reinforced insulation}}
\]

rather than protective earthing as its protective construction.

### Definition-source note

The uploaded scan clearly contains the Class II concept in the double/reinforced-insulation section, but the OCR mis-renders one heading. This strengthened file therefore does **not** present the garbled OCR heading as an exact quotation. The technical meaning is retained without falsely claiming a clean verbatim definition.

as the protective measure.

It does not rely on a protective-earth connection in the same way as Class I equipment.

However, installing Class II equipment does not automatically correct a defective fixed-wiring system.

The underlying circuit still has to be assessed and comply with the relevant requirements.

---

## Question 29 — Outdoor Luminaire
A luminaire is to be installed outside where it will be exposed to rain.

**Why is ordinary indoor electrical suitability not enough? (5 marks)**

### Answer

The luminaire must also withstand its external environment.

Factors include:

- water ingress;
- dust;
- corrosion;
- temperature;
- UV exposure;
- mechanical damage.

A suitable IP rating and manufacturer-approved installation arrangement may be required.

If water enters live electrical parts, it can cause:

- insulation failure;
- earth leakage;
- corrosion;
- electric shock;
- short circuit.

---

# Section F — Lighting RCD Protection

## Question 30 — Domestic Lighting RCD Requirement
Under the Brown Book BS 7671 framework, what additional protection is required for AC final circuits supplying luminaires in domestic premises? **(4 marks)**

### Answer

**Regulation 411.3.4** requires additional protection by an RCD having rated residual operating current not exceeding:

\[
\boxed{30mA}
\]

for AC final circuits supplying luminaires within domestic (household) premises.

The RCD does not replace the need for:

- suitable overcurrent protection;
- CPC continuity;
- correct polarity;
- correct circuit design.

---

## Question 31 — Why an RCD Does Not Replace the CPC
**Explain why fitting a 30 mA RCD does not mean a Class I luminaire can be installed without a CPC. (5 marks)**

### Answer

The protective measures perform different functions.

The CPC provides:

\[
\boxed{\text{the intended fault-current path}}
\]

The RCD detects residual current imbalance and disconnects when its operating conditions are met.

A Class I luminaire is designed to have its exposed metalwork connected to protective Earth.

Removing the CPC defeats the intended protective construction of the equipment.

Therefore:

\[
\boxed{\text{RCD protection supplements; it does not casually replace required protective earthing}}
\]

---

# Section G — Socket-Outlets and Final Circuits

## Question 32 — Define a Socket-Outlet
**What is the purpose of a socket-outlet in an installation? (3 marks)**

### Answer

### Formal BS 7671 definition

The uploaded Part 2 defines a **Socket-outlet** as:

> **“A device, provided with female contacts, which is intended to be installed with the fixed wiring, and intended to receive a plug.”**

In practical terms, it provides a point at which portable or movable electrical equipment can be connected to the fixed installation.

It allows equipment to be:

- connected;
- disconnected;
- moved;
- replaced

without permanently altering the fixed wiring.

---

## Question 33 — Final Circuit vs Distribution Circuit
**Differentiate between a final circuit and a distribution circuit. (5 marks)**

### Answer

### Final circuit

A final circuit directly supplies:

- current-using equipment;
- socket-outlets;
- or other final loads.

### Distribution circuit

A distribution circuit supplies another:

\[
\boxed{\text{distribution board or distribution point}}
\]

rather than directly supplying the final load.

Example:

\[
\text{main board}\rightarrow\text{sub-board}
\]

is a distribution circuit.

\[
\text{sub-board}\rightarrow\text{socket}
\]

is a final circuit.

---

## Question 34 — Radial Circuit
**Define a radial final circuit. (4 marks)**

### Answer

A radial final circuit leaves the protective device and passes through the required outlets or points without returning to the same protective-device terminal.

Conceptually:

\[
\boxed{\text{DB}\rightarrow A\rightarrow B\rightarrow C\rightarrow\text{end}}
\]

Each part of the circuit carries the load current downstream of that point.

The cable and protective device must therefore be selected so that the circuit is adequately protected throughout its route.

---

## Question 35 — Ring Final Circuit
**Define a ring final circuit. (4 marks)**

### Answer

### Formal BS 7671 definition

The uploaded Part 2 defines a **Ring final circuit** as:

> **“A final circuit arranged in the form of a ring and connected to a single point of supply.”**

In practical terms, the circuit leaves the protective device, passes through the socket/accessory points, and returns to the same origin/protective device to form a closed ring.

Conceptually:

\[
\boxed{\text{DB}\rightarrow A\rightarrow B\rightarrow C\rightarrow\text{DB}}
\]

Each point on the ring is connected to the origin by two conductor paths.

Under normal conditions, load current is shared between the two legs of the ring according to the load position and conductor impedances.

---

## Question 36 — Radial vs Ring
**State four differences between a radial final circuit and a ring final circuit. (4 marks)**

### Answer

| Radial | Ring |
|---|---|
| Leaves origin and terminates at final point | Returns to origin |
| One principal supply path to each downstream point | Two paths around ring |
| Current does not intentionally divide around two ring legs | Load current divides between ring legs |
| Open conductor normally disconnects downstream section | Open ring conductor may leave outlets operating as an unintended radial arrangement |

The ring therefore requires specific continuity verification.

---

# Step 5 Distinction Lens — Ring Circuits Must Be Proved, Not Assumed

A ring circuit can continue to supply every socket even after one conductor breaks.

That is why:

\[
\boxed{\text{“all sockets work”}\neq\text{“the ring is intact”}}
\]

The design relies on:

- two current paths;
- suitable conductor capacity;
- reasonable load distribution;
- verified continuity.

For fault-finding, always distinguish:

- a ring conductor open;
- a spur;
- a high-resistance termination;
- a broken CPC;
- a normal radial circuit.

---

# Section H — BS 7671 Ring-Final-Circuit Principle

## Question 37 — Regulation 433.1.204
Under the Brown Book framework, state the important conditions for the common BS 1363 ring-final-circuit arrangement permitted by Regulation 433.1.204. **(8 marks)**

### Answer

For the normal arrangement covered by Regulation 433.1.204:

- BS 1363 accessories may be supplied by a ring final circuit;
- the circuit may include permitted unfused spurs;
- the protective device is normally:

\[
\boxed{30A\text{ or }32A}
\]

of a suitable stated type;

- copper line and neutral conductors have a minimum CSA of:

\[
\boxed{2.5mm^2}
\]

for the normal thermoplastic/thermosetting arrangement;

- the effective current-carrying capacity \(I_Z\) of the cable must not be less than:

\[
\boxed{20A}
\]

- the load should be arranged so that current in any part of the ring is unlikely to exceed the cable current-carrying capacity for long periods.

This is a specific permitted arrangement and should not be reduced to the inaccurate statement:

> “2.5 mm² cable is always safe on a 32 A breaker.”

---

## Question 38 — Why Can a 2.5 mm² Ring Be Protected at 32 A?
**Explain the engineering reason why a compliant ring final circuit can use a 30/32 A protective device even though the current-carrying capacity of one 2.5 mm² leg may be less than 32 A. (7 marks)**

### Answer

The load is supplied through two paths around the ring.

At a socket located on the ring, current divides between the two legs according to their impedances.

Therefore one conductor is not expected to carry the entire 32 A circuit load continuously under the intended arrangement.

Regulation 433.1.204 permits this special arrangement provided:

- conductor size is not below the specified minimum;
- installed cable current capacity is adequate;
- load distribution does not cause long-duration overload of one part of the ring.

The ring configuration is therefore a **designed exception** to the simple radial rule that each cable must individually carry the full protective-device rating.

---

## Question 39 — Broken Ring Conductor
A ring final circuit has an open line conductor at one point.

Most socket-outlets still work.

**Explain why this fault is dangerous. (7 marks)**

### Answer

When the ring conductor opens, the circuit may no longer operate as a true ring.

It can become two radial sections supplied from the same protective device.

Socket-outlets may therefore continue to work, which can hide the fault.

However, one conductor leg may now be required to carry substantially more current than intended.

A 32 A protective device may remain in place while the circuit is no longer sharing current correctly.

This can result in:

- cable overload;
- overheating;
- damaged insulation;
- fire risk.

Therefore:

\[
\boxed{\text{“all sockets work” does not prove ring continuity}}
\]

---

## Question 40 — Open CPC on a Ring
A ring final circuit has a break in one CPC leg but line and neutral remain intact.

**Why may the fault remain hidden during ordinary use? (5 marks)**

### Answer

Normal operating current flows through:

- line;
- neutral.

The CPC normally carries no load current.

Therefore all appliances may operate normally.

However, protective conductor continuity has been weakened or lost around part of the ring.

During an earth fault:

- the effective fault path may have higher impedance;
- protective disconnection may be slower;
- some accessories may lose effective earthing.

This is why the CPC ring is specifically tested for continuity.

---

# Section I — Ring Final Circuit Loading

## Question 41 — Load at Midpoint
A 20 A load is connected exactly halfway around an ideal ring whose two legs have equal resistance.

Approximately how much current flows in each leg? **(4 marks)**

### Answer

Because the two paths have equal resistance, the load current divides equally.

Therefore:

\[
I_1=I_2=\frac{20}{2}
\]

\[
\boxed{I_1=10A,\qquad I_2=10A}
\]

This is an idealized example.

Real ring circuits have multiple loads at different points, so current sharing varies with load position and conductor impedance.

---

## Question 42 — Load Near One End
A 20 A load is connected very close to one end of a ring.

Will the current necessarily divide 10 A/10 A? Explain. **(5 marks)**

### Answer

No.

The two paths from the origin to the load have different lengths and therefore different impedances.

The shorter path has lower resistance.

More current therefore flows through the shorter path.

The longer path carries less current.

Current division follows the relative impedances of the two routes.

Therefore:

\[
\boxed{\text{ring current is not automatically shared equally}}
\]

---

## Question 43 — Why Spread Large Loads Around a Ring?
**Explain why large loads should not all be concentrated close together at one end of a ring final circuit. (5 marks)**

### Answer

Concentrating large loads at one location can produce unequal current sharing.

One leg may carry a disproportionately large current for a long period.

This can undermine the design assumption behind the ring-final-circuit overload arrangement.

Good circuit design therefore considers:

- load magnitude;
- load position;
- likely simultaneous demand.

Where large fixed loads are expected, separate dedicated circuits may be preferable.

---

# Section J — Spurs

## Question 44 — What Is a Spur?
**Define a spur from a ring final circuit. (3 marks)**

### Answer

### Formal BS 7671 definition

The uploaded Part 2 defines a **Spur** as:

> **“A branch from a ring or radial final circuit.”**

A spur therefore leaves the main circuit and does not itself continue as part of the main ring.

Conceptually:

\[
\text{ring point}\rightarrow\text{spur cable}\rightarrow\text{accessory}
\]

Spurs may be:

- unfused;
- fused through a suitable fused connection unit.

The permitted arrangement depends on the applicable design guidance and protective conditions.

---

## Question 45 — Unfused Spur
Under the common BS 1363 ring-final guidance, what may an unfused spur normally supply? **(4 marks)**

### Answer

An unfused spur is normally arranged to supply one:

- single socket-outlet;
- double socket-outlet;
- or one item of permanently connected equipment/accessory as permitted by the guidance.

The essential reason is that the spur cable is not protected by two ring paths.

Its loading must therefore be limited so that the spur conductor is not overloaded.

---

## Question 46 — Fused Spur
**Explain the advantage of using a fused connection unit to supply a spur. (5 marks)**

### Answer

A fused connection unit provides local overcurrent protection for the downstream spur cable/load.

For a typical BS 1363 arrangement, the fuse limits downstream current to a value such as:

\[
\boxed{13A}
\]

where that fuse rating is appropriate.

This allows a properly designed fused spur to supply more than the simple one-accessory unfused-spur arrangement, subject to:

- cable capacity;
- load;
- installation method;
- voltage drop;
- applicable circuit rules.

---

## Question 47 — Spur from a Spur
A student proposes to take an unfused spur from another unfused spur.

**Explain why this is generally unacceptable in the standard ring-final arrangement. (5 marks)**

### Answer

The first spur cable is already outside the current-sharing ring.

Adding further unfused sockets from that spur could allow multiple loads to be supplied through one 2.5 mm² branch while the branch remains protected only by the 30/32 A ring protective device.

This can overload the spur cable.

If multiple downstream outlets are required, a properly designed fused spur or separate circuit should be considered.

The key principle is:

\[
\boxed{\text{the branch cable must have appropriate overload protection}}
\]

---

# Section K — Radial Socket Circuits

## Question 48 — Advantages of a Radial Circuit
**State four advantages of radial final circuits. (4 marks)**

### Answer

Advantages include:

1. simpler circuit arrangement;
2. easier fault tracing;
3. no requirement to maintain ring continuity;
4. easier modification in some installations;
5. simpler current-path reasoning;
6. protective-device/cable relationship is straightforward.

The cable and protective device must still be correctly selected for:

- load;
- installation method;
- voltage drop;
- fault protection.

---

## Question 49 — Disadvantage of a Radial Circuit
**State three possible disadvantages of a radial circuit compared with a ring arrangement for the same area/load. (3 marks)**

### Answer

Possible disadvantages include:

1. a larger conductor may be required for a given protective-device rating;
2. voltage drop may become significant on long routes;
3. one open conductor may disconnect all downstream outlets;
4. the radial may require more circuits depending on area/load.

The preferred arrangement depends on the actual installation design.

---

## Question 50 — Radial Circuit Open Line
A radial circuit supplies sockets A, B, C and D in that order.

The line conductor becomes open between B and C.

Which outlets are likely to remain operational? **(4 marks)**

### Answer

Sockets before the open point remain supplied:

\[
\boxed{A\text{ and }B}
\]

Sockets after the open point lose the line supply:

\[
\boxed{C\text{ and }D}
\]

This characteristic can assist fault location.

---

## Question 51 — Radial Circuit Open Neutral
The neutral conductor opens between B and C.

What symptom is expected at C and D? **(4 marks)**

### Answer

C and D no longer have a complete normal return path.

Therefore connected appliances will normally fail to operate.

Depending on connected loads and test instruments, unusual or induced/back-fed voltage readings may still appear.

A broken neutral must therefore be diagnosed with proper voltage and continuity testing rather than assuming “no operation means no voltage.”

---

# Section L — RCD Protection of Socket-Outlets

## Question 52 — 30 mA RCD Principle
Under Brown Book Regulation 411.3.3, what rated residual operating current is used for additional protection of the relevant socket-outlets rated not exceeding 32 A? **(3 marks)**

### Answer

The additional-protection RCD has:

\[
\boxed{I_{\Delta n}\leq30mA}
\]

for the socket-outlets and mobile outdoor equipment covered by Regulation 411.3.3.

This is additional protection.

The circuit still requires appropriate:

- overload protection;
- short-circuit protection;
- fault protection;
- earthing.

---

## Question 53 — Why RCD Protection Is Valuable at Socket-Outlets
**Explain why socket-outlets often require additional RCD protection. (5 marks)**

### Answer

Socket-outlets can supply:

- portable equipment;
- flexible cords;
- equipment used by ordinary persons;
- equipment moved between environments;
- outdoor equipment.

These uses increase the possibility of:

- damaged cables;
- contact with live parts;
- earth leakage;
- faults involving people.

A 30 mA RCD provides additional protection by disconnecting when a sufficiently large residual-current imbalance occurs.

It does not make unsafe equipment safe and does not replace correct earthing or overcurrent protection.

---

# Section M — Socket Loading and Circuit Planning

## Question 54 — Is There a Fixed Maximum Number of Sockets?
A student says:

> “A ring circuit is allowed exactly 10 sockets.”

Is this a sound design rule? Explain. **(5 marks)**

### Answer

No.

Circuit design should not be based on an arbitrary socket count alone.

Important factors include:

- expected load;
- maximum demand;
- floor area/use;
- appliance type;
- circuit arrangement;
- load distribution;
- cable capacity;
- voltage drop;
- protective-device rating.

A large number of lightly loaded sockets may impose less demand than a small number supplying high-power equipment.

The correct design question is:

\[
\boxed{\text{what load is the circuit expected to supply safely?}}
\]

---

## Question 55 — Kitchen Circuit Planning
**Why may a kitchen require special consideration rather than simply extending an existing general socket circuit? (6 marks)**

### Answer

Kitchens often contain relatively high-power appliances such as:

- kettles;
- toasters;
- microwaves;
- dishwashers;
- washing machines;
- tumble dryers;
- cooking appliances.

Several may operate simultaneously.

This can create:

- high maximum demand;
- concentrated loading;
- voltage drop;
- thermal stress;
- poor ring-load distribution.

Dedicated circuits may therefore be appropriate for certain loads.

Circuit design should be based on expected demand, not only the number of outlets.

---

## Question 56 — Fixed High-Power Load
A permanently connected 3 kW appliance is located beside a general-purpose socket circuit.

**Why might a dedicated circuit be preferable? (5 marks)**

### Answer

A dedicated circuit may:

- avoid concentrating a high continuous load on the general circuit;
- simplify cable/protection selection;
- reduce voltage drop;
- improve fault discrimination;
- improve ring-load balance;
- allow suitable isolation/control;
- reduce nuisance tripping.

The need depends on the actual appliance and installation design.

---

# Section N — Conductor Identification

## Question 57 — Current BS 7671 Conductor Colours
Under the harmonized BS 7671 colour system, state the colours for:

**(a)** single-phase line;  
**(b)** neutral;  
**(c)** protective conductor;  
**(d)** L1, L2 and L3 in a three-phase circuit.

**(7 marks)**

### Answer

Under the current harmonized BS 7671 identification system:

### Single-phase line

\[
\boxed{\text{Brown}}
\]

### Neutral

\[
\boxed{\text{Blue}}
\]

### Protective conductor

\[
\boxed{\text{Green-and-yellow}}
\]

### Three-phase

- L1:

\[
\boxed{\text{Brown}}
\]

- L2:

\[
\boxed{\text{Black}}
\]

- L3:

\[
\boxed{\text{Grey}}
\]

These are BS 7671/UK harmonized identification examples. Where EPRA asks specifically for Kenyan statutory colour requirements, answer according to the applicable Kenyan standard/code.

---

## Question 58 — Switched-Line Identification
A blue-insulated core is used as a switched line in a multicore lighting cable.

**What must be done? Explain. (4 marks)**

### Answer

If a conductor colour normally associated with neutral is used as a line conductor in an allowed cable arrangement, it must be clearly identified at its terminations as a line conductor.

Under the harmonized system, suitable brown identification/sleeving is used.

The reason is to prevent someone later assuming that the conductor is neutral.

Correct conductor identification is a fundamental safety requirement.

---

## Question 59 — Protective Conductor Identification
**How should a protective conductor be identified? (3 marks)**

### Answer

A protective conductor is identified by:

\[
\boxed{\text{green-and-yellow}}
\]

This colour combination is reserved for protective-conductor identification.

A bare CPC in a cable is normally sleeved green-and-yellow at terminations.

---

# Section O — Socket and Lighting Polarity

## Question 60 — Socket Polarity
**State the correct conductor functions that must be connected to the line, neutral and earth terminals of a socket-outlet. (3 marks)**

### Answer

The socket must be connected so that:

- line conductor → line terminal;
- neutral conductor → neutral terminal;
- CPC → earth/protective terminal.

Correct polarity ensures:

- switches operate in the intended conductor;
- fuses/protective arrangements remain correct;
- exposed protective parts remain connected to Earth.

---

## Question 61 — Why Reverse Socket Polarity Is Dangerous
A socket has line and neutral reversed.

The appliance still works.

**Explain why the circuit is still unsafe. (6 marks)**

### Answer

An AC appliance may still operate because there is still potential difference across it.

However:

- single-pole switches may now interrupt neutral instead of line;
- internal parts expected to become dead when switched OFF may remain live;
- a fuse may be positioned in the wrong conductor;
- isolation assumptions become dangerous.

Correct operation therefore does not prove correct polarity.

---

## Question 62 — Lighting Polarity
**What does correct polarity mean in a one-way lighting circuit? (5 marks)**

### Answer

Correct polarity means, among other things:

- the permanent line reaches the switch correctly;
- the switch interrupts line rather than neutral;
- the switched line reaches the intended luminaire line terminal;
- neutral is connected to the intended neutral side;
- CPC is correctly connected where required.

Correct polarity prevents the fitting being unnecessarily left connected to line when the switch is OFF.

---

# Section P — Testing Lighting and Socket Circuits

## Question 63 — One-Way Lighting Continuity Test
**Describe a dead-test method that can verify the line path and CPC at a one-way lighting point. (7 marks)**

### Answer

After safe isolation:

1. link line and CPC at the circuit origin;
2. set the light switch to ON;
3. measure between switched line and CPC at the lighting point;
4. expect a low-resistance reading;
5. switch OFF;
6. the line path should open;
7. verify CPC continuity independently as necessary.

The low reading with the switch ON demonstrates continuity through:

- line conductor;
- switch;
- switched line;
- CPC return path.

---

## Question 64 — Two-Way Continuity Fault
A two-way lighting circuit passes continuity in one switch combination but fails in another.

**What does this suggest? (4 marks)**

### Answer

It suggests that one of the alternative switching paths is faulty.

Likely causes include:

- broken strapper;
- loose strapper termination;
- failed switch contact;
- incorrect L1/L2 connection.

The fault should be isolated by testing each path systematically.

---

## Question 65 — Ring End-to-End Results
A ring final circuit gives:

\[
r_1=0.82\Omega,\quad r_n=0.81\Omega,\quad r_2=1.35\Omega
\]

Are the results broadly plausible for a ring using equal-sized line/neutral conductors and a smaller CPC? Explain. **(6 marks)**

### Answer

Yes.

Line and neutral are expected to be similar because they normally have:

- same material;
- same CSA;
- same route length.

Therefore:

\[
0.82\Omega\approx0.81\Omega
\]

is reasonable.

The CPC is often smaller in CSA, so its resistance is higher:

\[
1.35\Omega>0.82\Omega
\]

The pattern is therefore plausible.

The result must still be compared with:

- expected conductor values;
- circuit length;
- actual cable construction.

---

## Question 66 — Open Ring Line
A ring final circuit gives:

- line end-to-end = open circuit;
- neutral end-to-end = normal;
- CPC end-to-end = normal.

What fault is indicated? **(4 marks)**

### Answer

The result indicates:

\[
\boxed{\text{loss of line-conductor continuity around the ring}}
\]

Possible causes include:

- loose line terminal;
- disconnected conductor;
- broken line conductor;
- incorrect termination.

The circuit must not be accepted as a complete ring until the fault is located and repaired.

---

## Question 67 — One Socket Gives High \(R_1+R_2\)
During ring crossover testing, most sockets give approximately:

\[
0.55\Omega
\]

One gives:

\[
1.20\Omega
\]

**State four possible causes. (4 marks)**

### Answer

Possible causes include:

1. socket is on an unfused spur;
2. loose CPC connection;
3. high-resistance line terminal;
4. poor accessory contact;
5. unusually long branch cable;
6. wiring error.

The abnormal reading should be investigated.

---

# Section Q — Practical Fault-Finding Scenarios

## Question 68 — Lamp Trips MCB Immediately
A lighting circuit MCB trips immediately every time one particular switch is turned ON.

**What type of faults should be suspected? (5 marks)**

### Answer

An immediate overcurrent trip suggests a low-impedance fault activated by the switched path.

Possible faults include:

- switched line shorted to neutral;
- switched line shorted to Earth/CPC;
- damaged luminaire;
- trapped conductor;
- faulty lampholder;
- wiring error at the switch or fitting.

The circuit should be isolated and tested before repeated re-energization.

---

## Question 69 — RCD Trips When Outdoor Lamp Is Switched On
A lighting circuit MCB remains ON, but the 30 mA RCD trips when an outdoor luminaire is energized.

**What faults are likely? (5 marks)**

### Answer

Likely causes include residual current to Earth due to:

- water ingress;
- damaged insulation;
- line-to-earth leakage;
- neutral-to-earth fault downstream;
- faulty electronic driver;
- contaminated luminaire.

Because the overcurrent device does not trip, the fault current may be too small to operate the MCB but large enough to create the residual-current imbalance detected by the RCD.

---

## Question 70 — Socket MCB Trips Only with Appliance Connected
A socket circuit operates normally until one particular appliance is plugged in and switched ON.

**How should the fault be approached? (5 marks)**

### Answer

The pattern suggests the fault may be associated with:

- the appliance;
- appliance flexible cord;
- plug;
- socket under load.

A logical sequence is:

1. disconnect the appliance;
2. safely verify the fixed circuit;
3. inspect/test the appliance separately using the appropriate method;
4. inspect plug and flex;
5. verify the socket if required.

Do not automatically increase the circuit-breaker rating.

---

## Question 71 — Socket Has L-E Voltage but No L-N Voltage
At a socket:

\[
L-E\approx230V
\]

but:

\[
L-N\approx0V
\]

with a load connected.

What conductor fault should be suspected first? **(5 marks)**

### Answer

A likely fault is:

\[
\boxed{\text{open or high-resistance neutral}}
\]

The line conductor is present because line-to-Earth voltage is normal.

But the normal neutral return path is missing.

Further testing should confirm:

- neutral continuity;
- neutral-to-Earth voltage;
- upstream neutral connections.

---

## Question 72 — Socket Has No L-E but L-N Is Normal
A socket gives approximately:

\[
L-N=230V
\]

but:

\[
L-E\approx0V
\]

and CPC continuity is absent.

**What is the likely problem and why is it serious? (6 marks)**

### Answer

The likely fault is:

\[
\boxed{\text{broken or disconnected CPC}}
\]

Normal operation can continue because line and neutral are intact.

However, the socket has lost its protective earth connection.

If Class I equipment develops a line-to-case fault:

- the metal case may become live;
- fault current may be insufficient;
- protective disconnection may fail or be delayed.

The socket must not be accepted until protective continuity is restored.

---

## Question 73 — Two Sockets Dead on a Radial
A radial circuit has six socket-outlets.

Sockets 1–4 work.

Sockets 5–6 are dead.

**Where should fault-finding begin? (4 marks)**

### Answer

Begin around the transition between the last working point and first dead point:

\[
\boxed{\text{Socket 4 / cable between 4 and 5 / Socket 5}}
\]

Likely faults include:

- open line;
- open neutral;
- loose terminals;
- damaged cable.

Radial topology makes this a logical first investigation point.

---

## Question 74 — All Ring Sockets Work but Test Fails
Every socket on a ring final circuit supplies appliances normally.

End-to-end line continuity is open circuit.

**Can the ring be accepted? Explain. (6 marks)**

### Answer

No.

The circuit is not operating as a complete ring.

It may have become two radials fed from the same 30/32 A protective device.

This can invalidate the overload assumptions of Regulation 433.1.204.

The fault must be located and repaired.

Therefore:

\[
\boxed{\text{functional operation is not proof of correct ring topology}}
\]

---

# Section R — Integrated Written Questions

## Question 75 — Design a Simple One-Way Lighting Circuit
A room requires one ceiling luminaire controlled from one wall switch.

**Describe the conductor functions and circuit operation from the distribution board to the lamp. (10 marks)**

### Answer

A suitable design contains:

### Supply

The final lighting circuit originates at a correctly selected protective device.

### Permanent line

Line is taken to the switching arrangement.

### Switch

The one-way switch receives permanent line at the appropriate common/input terminal.

When closed, the switch sends line potential along the switched-line conductor.

### Switched line

The switched line connects the switch output to the line terminal of the luminaire.

### Neutral

Neutral runs to the luminaire to complete the normal load-current path.

### CPC

The CPC runs continuously with the circuit and is connected to exposed metal parts requiring protective earthing.

### Operation

Switch ON:

\[
\text{line}\rightarrow\text{switch}\rightarrow\text{switched line}\rightarrow\text{lamp}\rightarrow\text{neutral}
\]

Switch OFF:

\[
\text{line path opened}
\]

so no normal load current flows through the lamp.

The switch must not be treated as a means of safe isolation for electrical work.

---

## Question 76 — Design a Three-Point Lighting Control
A corridor requires one lamp to be controlled from:

- entrance A;
- middle of corridor;
- entrance B.

Describe the switching arrangement. **(10 marks)**

### Answer

Use:

- two-way switch at entrance A;
- intermediate switch at middle;
- two-way switch at entrance B.

Permanent line enters the COM of the first two-way switch.

The two strapper conductors pass from:

\[
L1,L2
\]

through the intermediate switch.

The intermediate switch either:

- passes strappers straight through;
- or crosses them.

The two strappers then reach L1/L2 of the second two-way switch.

The COM of the final two-way switch provides the switched line to the luminaire.

Neutral goes directly to the luminaire.

CPC continuity is maintained throughout.

Operating **any** of the three switches changes the lamp state.

---

## Question 77 — Compare Ring and Radial Socket Circuits
**Compare ring and radial socket circuits under the following headings:**

**(a)** conductor path;  
**(b)** load current;  
**(c)** continuity faults;  
**(d)** testing;  
**(e)** overload design.

**(10 marks)**

### Answer

### (a) Conductor path

Radial:

\[
\text{origin}\rightarrow\text{outlets}\rightarrow\text{end}
\]

Ring:

\[
\text{origin}\rightarrow\text{outlets}\rightarrow\text{return to origin}
\]

### (b) Load current

Radial conductors carry downstream load current.

Ring current divides between the two available paths according to load position and impedance.

### (c) Continuity faults

A radial open circuit normally disconnects downstream loads.

A ring open conductor may leave every outlet operational while destroying the intended ring arrangement.

### (d) Testing

Radial circuits require continuity/polarity tests appropriate to the circuit.

Ring circuits require special end-to-end and crossover continuity testing.

### (e) Overload design

A radial cable is normally coordinated directly with its protective device.

The common BS 1363 ring-final arrangement uses the special Regulation 433.1.204 conditions allowing a 30/32 A device with suitable ring conductors and load distribution.

---

## Question 78 — Ring Final Scenario
A 32 A BS 1363 ring final circuit is wired in 2.5 mm² copper cable.

The installation conditions reduce the cable current-carrying capacity of each leg to:

\[
17A
\]

Can the circuit simply be accepted because it is a ring? Explain. **(7 marks)**

### Answer

No.

Regulation 433.1.204 requires the cable current-carrying capacity for the normal specified arrangement to be at least:

\[
\boxed{20A}
\]

The installed capacity is only:

\[
17A
\]

Therefore the normal deemed-to-comply ring arrangement cannot simply be claimed.

Possible design actions include:

- improve installation conditions;
- select larger conductors;
- reduce protective-device rating where correctly designed;
- redesign as suitable radial circuits;
- otherwise demonstrate full compliance by an appropriate engineering design.

The word “ring” does not automatically make an undersized cable safe.

---

## Question 79 — Lighting Oral Question
An examiner asks:

> **“Explain one-way, two-way and intermediate switching without drawing.”**

Give a complete oral answer. **(12 marks)**

### Answer

### One-way

One switch controls a lamp from one position.

The switch opens or closes the line path between permanent line and switched line.

### Two-way

One lamp is controlled from two positions.

Two changeover switches are used.

Each has:

- COM;
- L1;
- L2.

Two strapper conductors connect the alternative paths between the switches.

Permanent line enters the common of one switch.

The common of the other provides switched line to the lamp.

Operating either switch changes which strapper path is selected and therefore reverses the lamp state.

### Intermediate

For control from three or more positions:

- use two-way switches at the two ends;
- place one or more intermediate switches between them.

An intermediate switch either:

- passes the strapper paths straight through;
- or crosses them.

Therefore operating any switch changes the continuity path and changes the lamp state.

Throughout the installation:

- neutral goes to the load as required;
- CPC continuity is maintained;
- switching is applied to the line conductor;
- conductors are correctly identified.

---

## Question 80 — Socket-Circuit Oral Question
An examiner asks:

> **“How would you decide whether to use a radial or ring circuit for socket-outlets?”**

Give a strong answer. **(12 marks)**

### Answer

I would not choose the arrangement simply from habit.

I would consider:

### 1. Expected load

Determine:

- number and type of appliances;
- likely simultaneous demand;
- fixed high-current loads;
- future demand.

### 2. Area and layout

Consider:

- route length;
- distribution-board position;
- number and location of outlets.

### 3. Cable size and protective device

Select a cable and protective device appropriate to:

- design current;
- installation method;
- correction factors;
- voltage drop;
- fault protection.

### 4. Circuit topology

A radial is simpler and has a direct cable/protective-device relationship.

A ring can provide efficient distribution where its particular design requirements are satisfied.

### 5. Loading pattern

A ring requires reasonable load distribution so that one section is not continuously overloaded.

Large fixed loads may deserve separate circuits.

### 6. Testing and maintenance

A ring requires specific continuity verification because an open conductor can remain hidden.

A radial open circuit is often easier to identify.

### 7. Protection

Consider:

- 30 mA RCD additional protection where required;
- overload protection;
- fault protection;
- breaking capacity;
- earthing.

The final choice should produce the safest and most appropriate design for the actual installation.

---

# Step 5 Summary

By the end of Step 5, the student should be able to:

- explain line, neutral, CPC, permanent line and switched line;
- describe a one-way lighting circuit;
- explain why switches interrupt line rather than neutral;
- identify one-way lighting faults;
- explain two-way switching using COM, L1, L2 and strappers;
- diagnose open-strapper and wrong-terminal faults;
- explain intermediate switching;
- design control from three or more locations;
- select luminaires according to electrical/environmental conditions;
- distinguish Class I and Class II equipment;
- understand additional RCD protection for domestic lighting;
- define socket-outlets and final circuits;
- distinguish final and distribution circuits;
- compare radial and ring final circuits;
- explain Regulation 433.1.204 rather than simply memorizing “2.5 mm²/32 A”;
- explain ring current sharing;
- understand why ring loading must be reasonably distributed;
- explain spurs and fused spurs;
- understand radial circuit behaviour;
- apply 30 mA socket-outlet RCD concepts;
- reject arbitrary socket-count rules;
- plan socket circuits according to demand;
- identify conductor colours under the BS 7671 harmonized system;
- verify socket and lighting polarity;
- interpret lighting and socket continuity-test results;
- diagnose open line, open neutral and open CPC faults;
- distinguish MCB-tripping faults from RCD-leakage faults;
- and explain complete lighting and socket arrangements in an oral examination.

---

# BS 7671 Reference Summary for Step 5

## Regulation 411.3.3 — Socket-Outlets

Under the Brown Book framework, additional protection by an RCD with:

\[
\boxed{I_{\Delta n}\leq30mA}
\]

is required for the socket-outlets/mobile equipment covered by the regulation.

The detailed scope and permitted exceptions must be read from the applicable edition rather than reduced to a slogan.

---

## Regulation 411.3.4 — Domestic Luminaires

AC final circuits supplying luminaires within domestic premises require additional protection by an RCD with:

\[
\boxed{I_{\Delta n}\leq30mA}
\]

under the Brown Book framework.

---

## Regulation 433.1.204 — Ring Final Circuit

For the common BS 1363 arrangement:

- protective device:

\[
\boxed{30A\text{ or }32A}
\]

- copper line and neutral minimum CSA:

\[
\boxed{2.5mm^2}
\]

for the normal cable arrangement;

- effective cable current-carrying capacity:

\[
\boxed{I_Z\geq20A}
\]

- intended loading must not cause long-duration overload of a section of the ring.

The regulation is a specific permitted design arrangement, not a general rule that any 2.5 mm² cable may be protected by 32 A.

---

## Appendix 15 — Ring and Radial Final Circuits

Appendix 15 provides informative guidance on arrangements using BS 1363 socket-outlets and fused connection units, including:

- ring final circuits;
- radial circuits;
- fused and unfused spurs;
- load distribution.

Use it as guidance together with the normative regulations.

---

## Conductor Identification

Under the harmonized BS 7671 identification system:

| Function | Colour |
|---|---|
| Single-phase line | Brown |
| Neutral | Blue |
| Protective conductor | Green-and-yellow |
| L1 | Brown |
| L2 | Black |
| L3 | Grey |

Where a core is used for a different live-conductor function, it must be correctly re-identified at terminations as required.

---

# Step 5 Distinction Checklist

You should now be able to:

1. give the formal definitions of final circuit, socket-outlet, ring final circuit, spur and luminaire;
2. explain one-way switching by tracing the line path;
3. explain two-way/intermediate switching without relying on switch-handle direction;
4. distinguish Class I and Class II protection concepts;
5. compare radial and ring topologies physically;
6. explain why a broken ring may remain operational but unsafe;
7. explain why current sharing on a ring is not always 50/50;
8. diagnose open line, neutral, CPC and strapper faults from symptoms;
9. distinguish an MCB trip from an RCD trip by the type of fault suggested;
10. give a complete oral explanation of lighting or socket-circuit design and testing.

**End of Strengthened Step 5**
