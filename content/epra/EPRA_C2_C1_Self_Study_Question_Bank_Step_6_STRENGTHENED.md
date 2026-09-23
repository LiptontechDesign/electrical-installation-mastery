# EPRA C2 & C1 Self-Study Question Bank

## Step 6 — Three-Phase Systems, Star/Delta Connections, Three-Phase Power, Motors, Motor Starting, Protection, Speed Control and Power Factor — Strengthened Distinction Edition

> **Purpose of this step:**  
> Step 6 is the major transition from the C2 foundation into the additional technical depth expected at C1 level.
>
> The student should be able to:
>
> - explain how a three-phase supply is produced;
> - distinguish line and phase quantities;
> - calculate three-phase power and current;
> - understand star and delta connections;
> - interpret motor nameplates;
> - explain induction-motor operation;
> - select and explain motor starting methods;
> - distinguish overload, short-circuit and earth-fault protection;
> - explain motor reversing and speed control;
> - understand real, reactive and apparent power;
> - calculate power factor;
> - explain the disadvantages of poor power factor;
> - and calculate basic power-factor correction.
>
> The emphasis remains the same:
>
> \[
> \boxed{\text{understand the electrical principle first, then calculate}}
> \]

---

# Strengthened-Edition Answer Method

This strengthened Step 6 keeps the original question bank but upgrades the answer standard.

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


# Important EPRA Scope Note

EPRA C1 includes the C2 competency areas and then adds subjects including:

- three-phase low-voltage calculations;
- power factor;
- power-factor correction;
- three-phase electrical machines;
- motor starting methods;
- motor protection;
- motor speed control;
- broader inspection and testing.

This step concentrates on those C1-specific additions.

---

# Definition Discipline for Step 6

Most of the central terms in this step—three-phase supply, line voltage, phase voltage, synchronous speed, slip and power-factor correction—are **machine/power-system theory concepts rather than Part 2 BS 7671 definitions**.

Therefore they are taught as foundational electrical theory.

Where installation-protection terms occur, the uploaded BS 7671 definitions are used. For example:

- **Overcurrent:** current exceeding the rated value; for conductors the rated value is current-carrying capacity.
- **Overload current:** an overcurrent occurring in a circuit which is electrically sound.
- **Short-circuit current:** an overcurrent resulting from a negligible-impedance fault between live conductors having a potential difference.
- **Circuit-breaker:** a switching device capable of carrying/breaking normal current and automatically breaking specified abnormal currents.

This prevents a motor-theory explanation from being falsely presented as a BS 7671 definition.

---

# Section A — Three-Phase Fundamentals

## Question 1 — What Is a Three-Phase Supply?
**Define a three-phase AC supply. (4 marks)**

### Answer

A three-phase AC supply consists of three alternating voltages of the same:

- frequency;
- nominal magnitude;

but displaced in phase from one another by:

\[
\boxed{120^\circ}
\]

The three phases are commonly identified as:

\[
\boxed{L1,\quad L2,\quad L3}
\]

A neutral conductor may also be present depending on the system and connected loads.

The 120° displacement is what gives a balanced three-phase system its characteristic power-transfer and rotating-field advantages.

---

## Question 2 — Why 120 Degrees?
**Explain why the phase displacement in a balanced three-phase system is 120°. (4 marks)**

### Answer

One complete AC cycle is:

\[
360^\circ
\]

A three-phase system divides the cycle equally among three phases.

Therefore:

\[
\frac{360^\circ}{3}=120^\circ
\]

Hence the three phase voltages are separated by:

\[
\boxed{120^\circ}
\]

This equal spacing helps create a smooth transfer of power and a rotating magnetic field in three-phase motors.

---

## Question 3 — Identify the Conductors
A typical three-phase four-wire supply has:

- L1;
- L2;
- L3;
- N.

State the function of each. **(5 marks)**

### Answer

### L1, L2 and L3

These are the three line conductors carrying the three phase voltages.

They are displaced from each other by:

\[
120^\circ
\]

### Neutral

The neutral conductor is connected to the neutral point of the system and provides a return path for unbalanced single-phase currents where required.

In a perfectly balanced three-phase load:

\[
\boxed{I_N\approx0}
\]

because the three phase currents cancel vectorially.

In a real installation with unbalanced single-phase loads, neutral current may be present.

---

## Question 4 — Why Some Three-Phase Motors Do Not Need Neutral
**Explain why many three-phase motors are supplied by L1, L2, L3 and CPC only, with no neutral. (4 marks)**

### Answer

A balanced three-phase motor uses current flowing between the three line conductors.

Its windings are connected in:

- star;
- or delta.

The motor does not normally require a neutral return path because the three phase currents form a balanced three-phase system.

Therefore many motors are supplied by:

\[
\boxed{L1,\ L2,\ L3,\ CPC}
\]

with no neutral conductor.

Control circuits may still require a neutral depending on their design.

---

## Question 5 — Advantages of Three-Phase Supply
**State six advantages or uses of three-phase supply. (6 marks)**

### Answer

Advantages include:

1. efficient transmission of large amounts of power;
2. smoother power delivery than single-phase;
3. natural production of a rotating magnetic field;
4. efficient operation of induction motors;
5. reduced conductor material for a given transmitted power compared with equivalent single-phase arrangements;
6. ability to supply both three-phase and single-phase loads;
7. suitability for large commercial and industrial loads;
8. more uniform motor torque.

---

# Step 6 Distinction Lens — \(\sqrt3\) Is a Vector Result

Do not treat \(\sqrt3\) as a magic number.

The three phase voltages/currents are separated by \(120^\circ\). Line quantities result from **phasor differences or vector sums**, which is why the \(\sqrt3\) relationship appears.

Remember:

### Star

\[
V_L=\sqrt3V_{ph}
\]

\[
I_L=I_{ph}
\]

### Delta

\[
V_L=V_{ph}
\]

\[
I_L=\sqrt3I_{ph}
\]

A good exam answer states the relationship **and identifies whether the connection is star or delta before substituting numbers**.

---

# Section B — Line and Phase Voltage

## Question 6 — Define Line Voltage
**Define line voltage in a three-phase system. (3 marks)**

### Answer

Line voltage is the voltage measured:

\[
\boxed{\text{between any two line conductors}}
\]

For example:

\[
V_{L1-L2},\quad V_{L2-L3},\quad V_{L3-L1}
\]

Its symbol is often:

\[
V_L
\]

---

## Question 7 — Define Phase Voltage
**Define phase voltage. (3 marks)**

### Answer

Phase voltage is the voltage across one phase winding or one phase of the load.

Its symbol is commonly:

\[
V_{ph}
\]

In a star-connected system with neutral available, phase voltage is also the line-to-neutral voltage.

---

## Question 8 — Star Voltage Relationship
**State the relationship between line voltage and phase voltage in a balanced star-connected system. (3 marks)**

### Answer

For star:

\[
\boxed{V_L=\sqrt{3}V_{ph}}
\]

Therefore:

\[
\boxed{V_{ph}=\frac{V_L}{\sqrt{3}}}
\]

---

## Question 9 — Calculate Star Phase Voltage
A balanced star-connected load is supplied at:

\[
V_L=400V
\]

Calculate the phase voltage. **(4 marks)**

### Answer

Use:

\[
V_{ph}=\frac{V_L}{\sqrt{3}}
\]

\[
V_{ph}=\frac{400}{1.732}
\]

\[
V_{ph}=230.95V
\]

Therefore:

\[
\boxed{V_{ph}\approx231V}
\]

This explains why a 400/230 V three-phase system provides approximately 230 V line-to-neutral.

---

## Question 10 — Delta Voltage Relationship
**State the line/phase voltage relationship in a delta-connected load. (3 marks)**

### Answer

In delta:

\[
\boxed{V_L=V_{ph}}
\]

Each phase winding is connected directly between two line conductors.

Therefore each winding receives the full line voltage.

---

# Section C — Line and Phase Current

## Question 11 — Star Current Relationship
**State the line/phase current relationship in a star-connected load. (3 marks)**

### Answer

In star:

\[
\boxed{I_L=I_{ph}}
\]

The line conductor carries the same current as the phase winding to which it is connected.

---

## Question 12 — Delta Current Relationship
**State the line/phase current relationship in a balanced delta-connected load. (3 marks)**

### Answer

In delta:

\[
\boxed{I_L=\sqrt{3}I_{ph}}
\]

Therefore:

\[
\boxed{I_{ph}=\frac{I_L}{\sqrt{3}}}
\]

---

## Question 13 — Calculate Delta Phase Current
A delta-connected load draws:

\[
I_L=30A
\]

Calculate phase current. **(4 marks)**

### Answer

Use:

\[
I_{ph}=\frac{I_L}{\sqrt{3}}
\]

\[
I_{ph}=\frac{30}{1.732}
\]

\[
I_{ph}=17.32A
\]

Therefore:

\[
\boxed{I_{ph}\approx17.3A}
\]

---

# Step 6 Distinction Lens — Three-Phase Calculation Discipline

Before using:

\[
P=\sqrt3V_LI_LPF
\]

identify whether the power in the question is:

- electrical input;
- mechanical output;
- real power;
- apparent power.

For motors:

\[
\eta=\frac{P_{out}}{P_{in}}
\]

so if shaft output is given:

\[
P_{in}=\frac{P_{out}}{\eta}
\]

Only then calculate supply current.

This prevents the common error of inserting shaft kW directly into the electrical-input equation while ignoring efficiency.

---

# Section D — Three-Phase Power

## Question 14 — Three-Phase Real Power Formula
**State the formula for real power in a balanced three-phase system. (4 marks)**

### Answer

The formula is:

\[
\boxed{P=\sqrt{3}V_LI_L\cos\phi}
\]

where:

- \(P\) = real power in watts;
- \(V_L\) = line voltage;
- \(I_L\) = line current;
- \(\cos\phi\) = power factor.

---

## Question 15 — Three-Phase Apparent Power
**State the formula for apparent power in a balanced three-phase system. (3 marks)**

### Answer

\[
\boxed{S=\sqrt{3}V_LI_L}
\]

where:

- \(S\) = apparent power in VA;
- \(V_L\) = line voltage;
- \(I_L\) = line current.

---

## Question 16 — Three-Phase Reactive Power
**State the formula for reactive power in a balanced three-phase system. (3 marks)**

### Answer

\[
\boxed{Q=\sqrt{3}V_LI_L\sin\phi}
\]

where:

- \(Q\) = reactive power in var;
- \(\phi\) = phase angle between voltage and current.

---

## Question 17 — Calculate Three-Phase Power
A balanced three-phase load operates at:

\[
V_L=400V
\]

\[
I_L=25A
\]

\[
PF=0.8
\]

Calculate real power. **(5 marks)**

### Answer

Use:

\[
P=\sqrt{3}V_LI_L\cos\phi
\]

\[
P=1.732\times400\times25\times0.8
\]

\[
P=13856W
\]

Therefore:

\[
\boxed{P\approx13.86kW}
\]

---

## Question 18 — Calculate Line Current
A three-phase motor takes:

\[
P=15kW
\]

from a:

\[
400V
\]

supply at:

\[
PF=0.82
\]

Ignoring efficiency for this question, calculate line current. **(5 marks)**

### Answer

Use:

\[
P=\sqrt{3}V_LI_LPF
\]

Rearrange:

\[
I_L=\frac{P}{\sqrt{3}V_LPF}
\]

Substitute:

\[
I_L=\frac{15000}{1.732\times400\times0.82}
\]

\[
I_L=26.40A
\]

Therefore:

\[
\boxed{I_L\approx26.4A}
\]

---

## Question 19 — Include Motor Efficiency
A motor delivers:

\[
15kW
\]

mechanical output.

Efficiency is:

\[
\eta=90\%
\]

Power factor is:

\[
0.82
\]

Supply voltage:

\[
400V
\]

Calculate approximate line current. **(7 marks)**

### Answer

The electrical input power is greater than mechanical output power.

\[
\eta=\frac{P_{out}}{P_{in}}
\]

Therefore:

\[
P_{in}=\frac{P_{out}}{\eta}
\]

Convert:

\[
90\%=0.90
\]

\[
P_{in}=\frac{15000}{0.90}
\]

\[
P_{in}=16666.7W
\]

Now:

\[
I_L=\frac{P_{in}}{\sqrt{3}V_LPF}
\]

\[
I_L=\frac{16666.7}{1.732\times400\times0.82}
\]

\[
I_L=29.34A
\]

Therefore:

\[
\boxed{I_L\approx29.3A}
\]

---

# Section E — Balanced and Unbalanced Loads

## Question 20 — Balanced Three-Phase Load
**What is meant by a balanced three-phase load? (4 marks)**

### Answer

A balanced three-phase load has substantially equal:

- phase impedances;
- phase currents;
- power factors

on all three phases.

The three currents are equal in magnitude and displaced by:

\[
120^\circ
\]

In a balanced four-wire system:

\[
\boxed{I_N\approx0}
\]

because the phase currents cancel vectorially in the neutral.

---

## Question 21 — Unbalanced Load
**What is an unbalanced three-phase load? (4 marks)**

### Answer

An unbalanced load occurs when the loads on L1, L2 and L3 are not equal.

This can cause:

- unequal phase currents;
- neutral current;
- unequal voltage drops;
- heating;
- poor utilization of the supply.

Single-phase loads connected across a three-phase distribution board should therefore be distributed as evenly as reasonably practicable.

---

## Question 22 — Why Balance Single-Phase Loads?
**Explain why single-phase loads in a three-phase installation should be distributed across the phases. (5 marks)**

### Answer

Good load balancing helps:

- reduce neutral current;
- reduce excessive loading on one phase;
- reduce unequal voltage drop;
- improve transformer utilization;
- reduce heating;
- improve supply stability.

If most loads are placed on one phase, that phase may overload while the others remain lightly loaded.

---

# Section F — Phase Sequence

## Question 23 — Define Phase Sequence
**What is phase sequence? (4 marks)**

### Answer

Phase sequence is the order in which the three phase voltages reach corresponding positions in their AC cycles.

A normal sequence may be:

\[
\boxed{L1\rightarrow L2\rightarrow L3}
\]

The sequence matters for equipment such as three-phase motors.

---

## Question 24 — Reversing Two Phases
**What happens to a three-phase motor if any two supply phases are interchanged? Explain. (4 marks)**

### Answer

Interchanging any two phases reverses the phase sequence.

The rotating magnetic field therefore reverses direction.

As a result, the motor generally rotates in the opposite direction.

Thus:

\[
\boxed{\text{swap any two phases}\rightarrow\text{reverse motor direction}}
\]

---

# Section G — Star and Delta Connections

## Question 25 — Describe Star Connection
**Describe a star-connected three-phase load. (5 marks)**

### Answer

In a star connection:

- one end of each of the three phase windings is joined at a common star point;
- the other end of each winding is connected to L1, L2 or L3.

The important relationships are:

\[
V_L=\sqrt{3}V_{ph}
\]

and:

\[
I_L=I_{ph}
\]

If the star point is brought out, it can form a neutral connection.

---

## Question 26 — Describe Delta Connection
**Describe a delta-connected three-phase load. (5 marks)**

### Answer

In delta:

- the end of one winding connects to the beginning of the next;
- the three windings form a closed triangle;
- the three junctions connect to L1, L2 and L3.

The important relationships are:

\[
V_L=V_{ph}
\]

and:

\[
I_L=\sqrt{3}I_{ph}
\]

---

## Question 27 — Compare Winding Voltage
A motor is connected first in star and then in delta to the same line voltage.

**Compare the voltage across each winding. (5 marks)**

### Answer

In star:

\[
V_{ph}=\frac{V_L}{\sqrt{3}}
\]

In delta:

\[
V_{ph}=V_L
\]

Therefore each winding receives a lower voltage in star.

For a 400 V supply:

Star winding voltage:

\[
\frac{400}{1.732}\approx231V
\]

Delta winding voltage:

\[
400V
\]

Thus the star winding voltage is approximately:

\[
\boxed{58\%}
\]

of the delta winding voltage.

---

# Section H — Induction-Motor Fundamentals

## Question 28 — Principle of a Three-Phase Induction Motor
**Explain the operating principle of a three-phase induction motor. (8 marks)**

### Answer

When a balanced three-phase supply is applied to the stator windings:

1. the three currents are displaced by 120°;
2. the stator produces a rotating magnetic field;
3. this rotating field cuts the rotor conductors;
4. electromagnetic induction produces rotor current;
5. the rotor current creates its own magnetic field;
6. interaction between stator and rotor fields produces torque;
7. the rotor accelerates in the direction of the rotating field.

The rotor does not need a direct electrical connection to the supply in a standard squirrel-cage induction motor.

Its rotor current is induced electromagnetically.

---

## Question 29 — Why the Rotor Cannot Reach Synchronous Speed
**Why does a standard induction motor rotor normally run below synchronous speed? (6 marks)**

### Answer

Rotor current is produced by electromagnetic induction.

For induction to occur, there must be relative motion between:

- the rotating stator field;
- the rotor.

If the rotor reached exactly the same speed as the rotating field:

\[
\boxed{\text{relative speed}=0}
\]

Therefore:

- no induced rotor EMF;
- no rotor current;
- no electromagnetic torque.

The rotor must therefore run slightly below synchronous speed.

The difference is called:

\[
\boxed{\text{slip}}
\]

---

## Question 30 — Synchronous Speed Formula
**State the synchronous-speed formula for an AC motor. (4 marks)**

### Answer

\[
\boxed{N_s=\frac{120f}{P}}
\]

where:

- \(N_s\) = synchronous speed in revolutions per minute;
- \(f\) = supply frequency in hertz;
- \(P\) = number of poles.

---

## Question 31 — Calculate Synchronous Speed
A 4-pole motor is supplied at:

\[
50Hz
\]

Calculate synchronous speed. **(4 marks)**

### Answer

\[
N_s=\frac{120f}{P}
\]

\[
N_s=\frac{120\times50}{4}
\]

\[
N_s=1500rpm
\]

Therefore:

\[
\boxed{N_s=1500rpm}
\]

---

## Question 32 — Calculate Slip
A 4-pole 50 Hz induction motor runs at:

\[
1440rpm
\]

Calculate percentage slip. **(5 marks)**

### Answer

Synchronous speed:

\[
N_s=1500rpm
\]

Slip speed:

\[
N_s-N_r=1500-1440=60rpm
\]

Percentage slip:

\[
s=\frac{N_s-N_r}{N_s}\times100
\]

\[
s=\frac{60}{1500}\times100
\]

\[
\boxed{s=4\%}
\]

---

# Step 6 Distinction Lens — Read the Nameplate as a Winding-Voltage Problem

For a dual-voltage motor, ask:

\[
\boxed{\text{What voltage is each winding designed to receive?}}
\]

Example:

\[
400/690V\quad\Delta/Y
\]

means the winding is designed for about 400 V.

- 400 V supply → delta gives 400 V per winding.
- 690 V supply → star gives \(690/\sqrt3\approx398V\) per winding.

Do not memorize “first number delta, second number star” without understanding the winding voltage.

---

# Section I — Motor Nameplates

## Question 33 — Nameplate Information
**State eight items commonly found on a three-phase motor nameplate. (8 marks)**

### Answer

Typical items include:

1. rated power in kW or hp;
2. rated voltage;
3. rated current;
4. frequency;
5. speed in rpm;
6. power factor;
7. efficiency;
8. star/delta voltage relationship;
9. insulation class;
10. duty rating;
11. enclosure/IP rating;
12. manufacturer;
13. serial/type number;
14. number of phases.

A technician should read the nameplate before selecting:

- connection;
- starter;
- protection;
- cable;
- control method.

---

## Question 34 — Motor kW Rating
**What does the kW rating on a motor nameplate normally represent? (4 marks)**

### Answer

The kW rating normally represents the rated:

\[
\boxed{\text{mechanical output power at the shaft}}
\]

under the specified operating conditions.

It is not automatically the electrical input power.

Because motor efficiency is less than 100%:

\[
P_{in}>P_{out}
\]

---

## Question 35 — Nameplate Current
**Why is the motor nameplate current important? (5 marks)**

### Answer

Nameplate current helps determine:

- cable loading;
- overload relay setting;
- starter selection;
- contactor rating;
- control/protection requirements;
- expected normal operating current.

The actual protective design must also consider:

- starting current;
- short-circuit current;
- installation method;
- ambient conditions;
- duty cycle.

---

## Question 36 — Dual Voltage Nameplate
A motor nameplate shows:

\[
230/400V\quad \Delta/Y
\]

Explain the meaning. **(6 marks)**

### Answer

The motor windings are rated for approximately:

\[
230V
\]

each.

At a 230 V line supply:

- connect in delta;
- each winding receives 230 V.

At a 400 V line supply:

- connect in star;
- each winding receives:

\[
\frac{400}{\sqrt{3}}\approx230V
\]

Therefore:

\[
\boxed{230V\ \Delta,\quad400V\ Y}
\]

---

## Question 37 — 400/690 V Motor
A motor nameplate shows:

\[
400/690V\quad \Delta/Y
\]

What connection is normally used on a 400 V supply? **(5 marks)**

### Answer

At 400 V line voltage, the motor is intended to operate in:

\[
\boxed{\Delta}
\]

because each winding then receives:

\[
V_{ph}=V_L=400V
\]

At 690 V line voltage, it would be connected in star:

\[
V_{ph}=\frac{690}{1.732}\approx398V
\]

which is approximately the same winding voltage.

---

# Section J — Direct-On-Line Starting

## Question 38 — Define DOL Starting
**What is direct-on-line (DOL) starting? (4 marks)**

### Answer

DOL starting connects the motor directly to the full line voltage through suitable switching and protection.

The motor receives full rated supply voltage immediately.

Advantages include:

- simplicity;
- low cost;
- high starting torque.

Disadvantages include:

- high starting current;
- mechanical shock;
- possible voltage dip on the supply.

---

## Question 39 — Why DOL Current Is High
**Explain why an induction motor draws a large current at starting. (6 marks)**

### Answer

At standstill:

- rotor speed is zero;
- slip is approximately 100%;
- relative speed between stator field and rotor is maximum;
- induced rotor current is high.

The motor therefore presents a relatively low effective impedance to the supply.

Starting current can be several times full-load current.

As the rotor accelerates:

- slip falls;
- rotor frequency falls;
- motor impedance/electromagnetic conditions change;
- current reduces toward normal running current.

---

## Question 40 — DOL Advantages and Disadvantages
**State three advantages and three disadvantages of DOL starting. (6 marks)**

### Answer

### Advantages

1. simple;
2. inexpensive;
3. high starting torque;
4. easy maintenance.

### Disadvantages

1. high starting current;
2. supply voltage dip;
3. mechanical stress;
4. unsuitable for some large motors or weak supplies.

Any three of each are acceptable.

---

# Section K — Star-Delta Starting

## Question 41 — Purpose of Star-Delta Starting
**What is the purpose of star-delta starting? (5 marks)**

### Answer

Star-delta starting reduces motor starting current by initially connecting the windings in:

\[
\boxed{\text{star}}
\]

The winding voltage is reduced to:

\[
\frac{V_L}{\sqrt{3}}
\]

After the motor accelerates, the windings are reconnected in:

\[
\boxed{\Delta}
\]

for normal running.

This reduces the electrical impact of starting compared with DOL.

---

## Question 42 — Starting Voltage in Star
A motor designed to run in delta at 400 V is started in star from a 400 V supply.

Calculate the voltage across each winding during starting. **(4 marks)**

### Answer

In star:

\[
V_{ph}=\frac{V_L}{\sqrt{3}}
\]

\[
V_{ph}=\frac{400}{1.732}
\]

\[
V_{ph}=230.95V
\]

Therefore:

\[
\boxed{V_{ph}\approx231V}
\]

---

## Question 43 — Starting Current Reduction
**Approximately how does star connection affect starting current compared with delta for the same motor and supply? (5 marks)**

### Answer

Each winding receives:

\[
\frac{1}{\sqrt{3}}
\]

of the delta winding voltage.

Winding current is therefore reduced.

The line current during star starting is approximately:

\[
\boxed{\frac{1}{3}}
\]

of the line current that would occur in delta at the same supply voltage, under the simplified starting comparison.

---

## Question 44 — Starting Torque Reduction
**How is starting torque affected during star-delta starting? Explain. (5 marks)**

### Answer

Motor torque is approximately proportional to:

\[
V^2
\]

During star starting, winding voltage is reduced to:

\[
\frac{1}{\sqrt{3}}
\]

of delta voltage.

Therefore torque becomes approximately:

\[
\left(\frac{1}{\sqrt{3}}\right)^2
=
\frac{1}{3}
\]

Hence star starting torque is approximately:

\[
\boxed{\frac{1}{3}}
\]

of delta starting torque.

This makes star-delta unsuitable for loads requiring high starting torque.

---

## Question 45 — Star-Delta Suitability
**State four conditions or considerations for using star-delta starting. (4 marks)**

### Answer

Considerations include:

1. motor must have six accessible winding terminals;
2. motor must be designed to run in delta at the supply voltage;
3. load must tolerate reduced starting torque;
4. supply/system should benefit from reduced starting current;
5. starter must prevent simultaneous star and delta connection;
6. correct transition timing is required.

---

# Section L — Motor Reversing

## Question 46 — Reversing a Three-Phase Motor
**How is the direction of a three-phase motor reversed? (3 marks)**

### Answer

Reverse any two of the three phases.

For example:

\[
L1\leftrightarrow L2
\]

This reverses the phase sequence and therefore reverses the rotating magnetic field.

---

## Question 47 — Forward/Reverse Contactor Circuit
**Why must forward and reverse contactors be interlocked? (6 marks)**

### Answer

The forward contactor applies one phase sequence.

The reverse contactor interchanges two phases.

If both contactors close simultaneously, phase conductors can be connected incorrectly against each other and produce a severe short circuit.

Therefore the circuit should use:

- electrical interlocking;
- and often mechanical interlocking.

The purpose is:

\[
\boxed{\text{prevent simultaneous forward and reverse contactor closure}}
\]

---

# Step 6 Distinction Lens — Separate the Protection Functions

The strongest motor-protection answer distinguishes the abnormal condition:

- **overload** → sustained excessive current in an electrically sound circuit;
- **short circuit** → very high current from a low-impedance fault;
- **earth fault** → current through an unintended earth/protective path;
- **phase loss** → abnormal unbalanced motor operation;
- **stall/locked rotor** → prolonged starting-like current and heating.

One device does not automatically perform every function.

---

# Section M — Motor Protection

## Question 48 — Three Different Motor Protection Functions
**Differentiate between:**

**(a)** short-circuit protection;  
**(b)** overload protection;  
**(c)** earth-fault protection.

**(9 marks)**

### Answer

### Short-Circuit Protection

Protects against very high current caused by low-impedance faults between conductors.

Devices may include:

- fuses;
- circuit-breakers.

### Overload Protection

Protects against sustained current above normal motor rating due to conditions such as:

- mechanical overload;
- stalled rotor;
- phase loss;
- excessive load.

An overload relay is commonly used.

### Earth-Fault Protection

Protects against current flowing from live conductors to Earth/exposed metalwork.

Protection may involve:

- overcurrent devices;
- RCD/earth-fault devices;
- protective earthing;
- other fault-protection systems.

These functions are related but not identical.

---

## Question 49 — Why an Overload Relay Is Not a Short-Circuit Device
**Explain why a motor overload relay does not replace short-circuit protection. (5 marks)**

### Answer

An overload relay is designed to respond to sustained overcurrent associated with motor overload.

A short circuit can produce extremely high current requiring very rapid interruption and high breaking capacity.

The overload relay is not designed to interrupt large short-circuit fault current by itself.

Therefore motor circuits usually require separate:

- short-circuit protection;
- overload protection.

---

## Question 50 — Single Phasing
**What is single phasing, and why is it dangerous to a three-phase motor? (6 marks)**

### Answer

Single phasing occurs when one phase of a three-phase supply is lost while the motor remains connected to the other phases.

Possible effects include:

- reduced torque;
- increased current in remaining phases;
- overheating;
- failure to start;
- winding damage.

A running motor may continue operating under severe stress.

Proper motor protection should detect or respond to damaging phase-loss conditions.

---

## Question 51 — Locked Rotor
**What is a locked-rotor condition, and why is it dangerous? (5 marks)**

### Answer

A locked rotor occurs when the motor is energized but the rotor cannot turn.

Examples include:

- seized bearing;
- jammed machine;
- mechanically locked load.

The motor may draw current close to starting current continuously.

This produces rapid heating because the normal reduction in current after acceleration does not occur.

Overload protection should disconnect before thermal damage occurs.

---

# Section N — Motor Speed Control

## Question 52 — Factors Determining Induction-Motor Speed
**State the two main electrical factors determining synchronous speed. (3 marks)**

### Answer

From:

\[
N_s=\frac{120f}{P}
\]

synchronous speed depends on:

1. supply frequency \(f\);
2. number of poles \(P\).

---

## Question 53 — Variable Frequency Drive
**Explain how a variable frequency drive (VFD) controls motor speed. (6 marks)**

### Answer

A VFD controls the frequency supplied to the motor.

Since:

\[
N_s=\frac{120f}{P}
\]

reducing frequency reduces synchronous speed.

Increasing frequency increases synchronous speed within the permitted operating range.

A VFD also controls voltage appropriately to maintain suitable motor magnetic flux.

Therefore VFDs provide:

- speed control;
- controlled acceleration/deceleration;
- reduced mechanical shock;
- possible energy savings in variable-torque loads.

---

## Question 54 — Why Voltage Alone Is Not Good Speed Control
**Why is simply reducing voltage not an effective general method of controlling induction-motor speed? (5 marks)**

### Answer

Synchronous speed is primarily determined by:

\[
f
\]

and:

\[
P
\]

not by voltage.

Reducing voltage significantly:

- reduces available torque;
- increases slip under load;
- can increase heating;
- can cause stalling.

Therefore frequency control is the preferred general method for adjustable-speed induction motors.

---

# Step 6 Distinction Lens — Power Factor Is Not “Efficiency”

Power factor is:

\[
PF=\frac{P}{S}
\]

It tells us how much apparent power/current must be supplied for a given real power.

It is **not the same thing as motor efficiency**.

- Efficiency compares mechanical output to electrical input.
- Power factor compares real power to apparent power.

A motor can have good efficiency and still have a poor power factor.

That distinction is frequently tested indirectly in calculations.

---

# Section O — Power Factor Fundamentals

## Question 55 — Define Power Factor
**Define power factor. (4 marks)**

### Answer

Power factor is the ratio of real power to apparent power:

\[
\boxed{PF=\frac{P}{S}}
\]

For a sinusoidal system:

\[
\boxed{PF=\cos\phi}
\]

where \(\phi\) is the phase angle between voltage and current.

Power factor is dimensionless.

---

## Question 56 — Real, Reactive and Apparent Power
**State the symbols and units of real, reactive and apparent power. (6 marks)**

### Answer

### Real Power

\[
P
\]

Unit:

\[
\boxed{W}
\]

### Reactive Power

\[
Q
\]

Unit:

\[
\boxed{var}
\]

### Apparent Power

\[
S
\]

Unit:

\[
\boxed{VA}
\]

Relationship:

\[
\boxed{S^2=P^2+Q^2}
\]

---

## Question 57 — Why Induction Motors Have Lagging Power Factor
**Explain why induction motors normally have a lagging power factor. (5 marks)**

### Answer

An induction motor requires magnetizing current to establish its magnetic field.

This magnetizing current is largely inductive.

In an inductive load:

\[
\boxed{\text{current lags voltage}}
\]

Therefore the motor draws reactive power in addition to real power.

This produces a lagging power factor below unity.

---

## Question 58 — Disadvantages of Poor Power Factor
**State six disadvantages of poor power factor. (6 marks)**

### Answer

Poor power factor causes more current to be required for the same real power.

Consequences include:

1. greater cable current;
2. higher \(I^2R\) losses;
3. increased voltage drop;
4. larger cable requirements;
5. larger transformer/generator kVA loading;
6. larger switchgear ratings;
7. reduced system capacity;
8. possible utility penalties in applicable tariffs.

---

## Question 59 — Current at Different Power Factors
A three-phase load requires:

\[
20kW
\]

at:

\[
400V
\]

Calculate current at:

**(a)** PF = 1.0  
**(b)** PF = 0.8.

**(8 marks)**

### Answer

Use:

\[
I=\frac{P}{\sqrt{3}V_LPF}
\]

### (a) PF = 1

\[
I=\frac{20000}{1.732\times400\times1}
\]

\[
I=28.87A
\]

\[
\boxed{I\approx28.9A}
\]

### (b) PF = 0.8

\[
I=\frac{20000}{1.732\times400\times0.8}
\]

\[
I=36.09A
\]

\[
\boxed{I\approx36.1A}
\]

The poorer-power-factor load requires substantially more current for the same real power.

---

# Section P — Power-Factor Correction

## Question 60 — Principle of Power-Factor Correction
**Explain how capacitors improve the power factor of an inductive load. (6 marks)**

### Answer

Inductive loads draw lagging reactive current.

A capacitor draws leading reactive current.

When capacitors are connected appropriately:

- part of the inductive reactive-current requirement is supplied locally by the capacitor;
- reactive current drawn from the supply is reduced;
- apparent power falls;
- supply current falls;
- real power delivered to the load remains substantially unchanged.

Therefore the power factor moves closer to:

\[
\boxed{1.0}
\]

---

## Question 61 — Does PF Correction Reduce kW Load?
**Does power-factor correction significantly reduce the real kW required by an unchanged motor load? Explain. (4 marks)**

### Answer

No.

The mechanical load still requires approximately the same real power.

Power-factor correction mainly reduces:

- reactive power drawn from the supply;
- apparent power;
- supply current.

Therefore:

\[
\boxed{\text{kW remains approximately unchanged}}
\]

while:

\[
kvar\downarrow,\quad kVA\downarrow,\quad I\downarrow
\]

---

## Question 62 — Power Triangle Calculation
A load has:

\[
P=30kW
\]

and:

\[
PF=0.75
\]

Calculate apparent power. **(4 marks)**

### Answer

\[
PF=\frac{P}{S}
\]

Therefore:

\[
S=\frac{P}{PF}
\]

\[
S=\frac{30}{0.75}
\]

\[
\boxed{S=40kVA}
\]

---

## Question 63 — Calculate Reactive Power
Using Question 62:

\[
P=30kW,\qquad S=40kVA
\]

Calculate reactive power. **(5 marks)**

### Answer

Use:

\[
S^2=P^2+Q^2
\]

Therefore:

\[
Q=\sqrt{S^2-P^2}
\]

\[
Q=\sqrt{40^2-30^2}
\]

\[
Q=\sqrt{1600-900}
\]

\[
Q=\sqrt{700}
\]

\[
Q=26.46kvar
\]

Therefore:

\[
\boxed{Q\approx26.5kvar}
\]

---

## Question 64 — Capacitor kvar Required
A 30 kW load operates at:

\[
PF_1=0.75
\]

It is to be corrected to:

\[
PF_2=0.95
\]

Calculate the required capacitor kvar. **(8 marks)**

### Answer

Use:

\[
Q_c=P(\tan\phi_1-\tan\phi_2)
\]

First:

\[
\cos\phi_1=0.75
\]

\[
\phi_1=\cos^{-1}(0.75)
\]

\[
\phi_1\approx41.41^\circ
\]

\[
\tan\phi_1\approx0.882
\]

Now:

\[
\cos\phi_2=0.95
\]

\[
\phi_2=\cos^{-1}(0.95)
\]

\[
\phi_2\approx18.19^\circ
\]

\[
\tan\phi_2\approx0.329
\]

Therefore:

\[
Q_c=30(0.882-0.329)
\]

\[
Q_c=30\times0.553
\]

\[
Q_c=16.59kvar
\]

Therefore:

\[
\boxed{Q_c\approx16.6kvar}
\]

A practical capacitor-bank size would be selected from available standard ratings and the actual system requirements.

---

## Question 65 — Current Before and After PF Correction
The 30 kW load in Question 64 is supplied at:

\[
400V
\]

Calculate line current:

**(a)** before correction at PF 0.75;  
**(b)** after correction at PF 0.95.

**(8 marks)**

### Answer

Use:

\[
I=\frac{P}{\sqrt{3}V_LPF}
\]

### Before correction

\[
I_1=\frac{30000}{1.732\times400\times0.75}
\]

\[
I_1=57.74A
\]

\[
\boxed{I_1\approx57.7A}
\]

### After correction

\[
I_2=\frac{30000}{1.732\times400\times0.95}
\]

\[
I_2=45.58A
\]

\[
\boxed{I_2\approx45.6A}
\]

Current reduction:

\[
57.7-45.6=12.1A
\]

Therefore correction reduces the supply current substantially.

---

# Section Q — Automatic Power-Factor Correction

## Question 66 — Why Use Automatic PF Correction?
**Why are automatic capacitor banks used in installations where load changes significantly? (5 marks)**

### Answer

If the load changes, the reactive-power requirement also changes.

A fixed capacitor bank may then:

- under-correct at high load;
- over-correct at low load.

Automatic power-factor-correction equipment switches capacitor stages in and out according to the measured system condition.

This helps maintain the target power factor over changing load.

---

## Question 67 — Danger of Overcorrection
**What is overcorrection of power factor, and why can it be undesirable? (5 marks)**

### Answer

Overcorrection occurs when too much capacitive reactive power is connected.

The installation power factor may become:

\[
\boxed{\text{leading}}
\]

rather than lagging.

Possible problems include:

- undesirable voltage effects;
- resonance;
- equipment stress;
- poor interaction with generators/transformers;
- utility issues.

Power-factor correction should therefore be properly calculated and controlled.

---

# Section R — Integrated Motor Calculation

## Question 68 — Full Motor Input Calculation
A three-phase induction motor has:

- output power = 22 kW;
- efficiency = 91%;
- power factor = 0.84;
- line voltage = 400 V.

Calculate:

**(a)** input power;  
**(b)** line current.

**(8 marks)**

### Answer

### (a) Input power

\[
\eta=\frac{P_{out}}{P_{in}}
\]

Therefore:

\[
P_{in}=\frac{P_{out}}{\eta}
\]

\[
P_{in}=\frac{22000}{0.91}
\]

\[
P_{in}=24175.8W
\]

\[
\boxed{P_{in}\approx24.18kW}
\]

### (b) Line current

\[
I_L=\frac{P_{in}}{\sqrt{3}V_LPF}
\]

\[
I_L=\frac{24175.8}{1.732\times400\times0.84}
\]

\[
I_L=41.55A
\]

Therefore:

\[
\boxed{I_L\approx41.6A}
\]

---

# Section S — Integrated Nameplate and Connection Scenario

## Question 69 — Motor Nameplate Interpretation
A motor nameplate reads:

\[
400/690V\quad \Delta/Y
\]

\[
18.5kW,\quad 35A,\quad 50Hz,\quad 1470rpm,\quad PF=0.86
\]

Answer the following:

**(a)** connection on a 400 V supply;  
**(b)** synchronous speed if it is a four-pole motor;  
**(c)** approximate slip;  
**(d)** meaning of 18.5 kW;  
**(e)** meaning of PF 0.86.

**(12 marks)**

### Answer

### (a) Connection

For:

\[
400/690V\quad\Delta/Y
\]

at 400 V:

\[
\boxed{\Delta}
\]

---

### (b) Synchronous speed

\[
N_s=\frac{120f}{P}
\]

\[
N_s=\frac{120\times50}{4}
\]

\[
\boxed{N_s=1500rpm}
\]

---

### (c) Slip

\[
s=\frac{1500-1470}{1500}\times100
\]

\[
s=\frac{30}{1500}\times100
\]

\[
\boxed{s=2\%}
\]

---

### (d) 18.5 kW

This is approximately the rated mechanical shaft output power under rated operating conditions.

---

### (e) PF 0.86

The motor's real power is 86% of its apparent power ratio:

\[
PF=\frac{P}{S}=0.86
\]

The current lags voltage because the motor is predominantly inductive.

---

# Section T — Motor Starter Selection

## Question 70 — Choose DOL or Star-Delta
A motor drives a pump that requires only moderate starting torque.

The supply network is sensitive to voltage dip.

Would DOL or star-delta be more suitable in principle, and why? **(6 marks)**

### Answer

Star-delta may be more suitable in principle because it reduces starting current.

During star starting:

- winding voltage is reduced;
- starting current is reduced;
- supply voltage disturbance is reduced.

However, starting torque is also reduced to roughly one-third of the delta value.

Because the pump requires only moderate starting torque, this may be acceptable.

Final selection depends on:

- motor nameplate suitability;
- motor terminal access;
- load torque;
- supply limitations;
- starter design.

---

## Question 71 — High Starting Torque Load
A conveyor requires high torque immediately from rest.

Why may star-delta starting be unsuitable? **(5 marks)**

### Answer

Star-delta reduces winding voltage.

Since motor torque is approximately proportional to:

\[
V^2
\]

the starting torque is reduced to roughly:

\[
\boxed{\frac{1}{3}}
\]

of delta starting torque.

A high-torque load may therefore:

- fail to accelerate;
- remain at low speed;
- draw high current too long;
- overheat.

A different starting method may be required.

---

# Section U — Oral Examination Questions

## Question 72 — Explain Star vs Delta Without Drawing
An examiner asks:

> **“Explain the difference between star and delta connections.”**

Give a complete answer. **(10 marks)**

### Answer

In **star**:

- one end of each winding joins at a common point;
- the remaining ends connect to the three lines;
- line voltage is:

\[
V_L=\sqrt{3}V_{ph}
\]

- line current equals phase current:

\[
I_L=I_{ph}
\]

In **delta**:

- windings connect end-to-start forming a closed triangle;
- the three junctions connect to L1, L2 and L3;
- line voltage equals phase voltage:

\[
V_L=V_{ph}
\]

- line current is:

\[
I_L=\sqrt{3}I_{ph}
\]

For the same line voltage, each winding receives less voltage in star than in delta.

This is why star connection can be used to reduce motor starting current in suitable star-delta applications.

---

## Question 73 — Explain a Three-Phase Motor from Supply to Torque
An examiner asks:

> **“Explain how three-phase electricity makes an induction motor turn.”**

Give a complete answer. **(12 marks)**

### Answer

1. Three-phase supply provides three currents displaced by 120°.
2. These currents flow in stator windings physically arranged around the motor.
3. Their magnetic fields combine to form a rotating magnetic field.
4. The rotating field cuts the rotor conductors.
5. Relative motion induces rotor EMF.
6. Rotor current flows because the rotor circuit is closed.
7. Rotor current produces a magnetic field.
8. The stator and rotor magnetic fields interact.
9. Electromagnetic torque is produced.
10. The rotor accelerates in the direction of the rotating field.
11. As speed rises, slip reduces.
12. The rotor settles at a speed slightly below synchronous speed where developed torque equals load torque.

Therefore the motor is called an:

\[
\boxed{\text{induction motor}}
\]

because rotor current is induced rather than directly supplied in the common squirrel-cage design.

---

## Question 74 — Explain Motor Protection
An examiner asks:

> **“What protection does a three-phase motor require?”**

Give a strong answer. **(12 marks)**

### Answer

A motor installation may require protection against:

### 1. Short circuit

Very high fault current between live conductors.

Use suitable fuse/circuit-breaker with adequate breaking capacity.

### 2. Overload

Sustained excessive current due to mechanical overload or abnormal operation.

Use overload relay or suitable motor-protection device.

### 3. Earth fault

Fault from live conductor to exposed metalwork/Earth.

Requires protective earthing and appropriate fault-protection device.

### 4. Phase loss

Single phasing can overheat the motor.

Suitable protection should detect damaging phase-loss/unbalance conditions.

### 5. Locked rotor/stall

A stalled motor may draw high current continuously.

Protection should disconnect before thermal damage.

### 6. Undervoltage/restart considerations

Automatic unexpected restart after supply restoration may be dangerous.

Control circuits may use undervoltage release/no-volt protection.

### 7. Temperature

Large or critical motors may use winding or bearing temperature protection.

Protection must coordinate with:

- cable;
- starter;
- contactor;
- motor nameplate current;
- starting current;
- fault level.

---

## Question 75 — Explain Power Factor to an Examiner
An examiner asks:

> **“What is power factor, why is poor power factor undesirable, and how do you correct it?”**

Give a complete answer. **(15 marks)**

### Answer

Power factor is:

\[
PF=\frac{P}{S}
\]

For a sinusoidal system:

\[
PF=\cos\phi
\]

Inductive loads such as motors require magnetizing current.

This causes current to lag voltage and produces reactive power.

For the same real power, a low power factor requires higher current.

Higher current causes:

- higher \(I^2R\) losses;
- greater voltage drop;
- larger cable requirements;
- greater transformer loading;
- greater generator loading;
- larger switchgear requirements;
- lower usable system capacity.

Power factor can be improved using capacitors.

Capacitors supply leading reactive current that offsets part of the lagging reactive current of inductive loads.

The correction does not significantly reduce the motor's required real kW.

It mainly reduces:

\[
Q,\quad S,\quad I
\]

A capacitor bank can be calculated using:

\[
\boxed{Q_c=P(\tan\phi_1-\tan\phi_2)}
\]

where:

- \(\phi_1\) = original phase angle;
- \(\phi_2\) = target phase angle.

For changing loads, automatic capacitor banks can switch stages in and out.

---

# Step 6 Summary

By the end of Step 6, the student should be able to:

- define three-phase AC supply;
- explain 120° phase displacement;
- distinguish line and phase quantities;
- use star relationships:

\[
V_L=\sqrt{3}V_{ph},\qquad I_L=I_{ph}
\]

- use delta relationships:

\[
V_L=V_{ph},\qquad I_L=\sqrt{3}I_{ph}
\]

- calculate three-phase real, reactive and apparent power;
- calculate line current from power, voltage and power factor;
- include motor efficiency in current calculations;
- explain balanced and unbalanced loading;
- explain phase sequence;
- reverse a three-phase motor;
- explain star and delta motor connections;
- explain induction-motor operation;
- calculate synchronous speed;
- calculate slip;
- interpret motor nameplates;
- distinguish output kW from electrical input;
- explain DOL starting;
- explain star-delta starting;
- calculate star winding voltage;
- explain starting-current and starting-torque reduction;
- explain forward/reverse interlocking;
- distinguish short-circuit, overload and earth-fault motor protection;
- explain single phasing and locked rotor;
- explain VFD speed control;
- define power factor;
- explain why motors have lagging PF;
- explain disadvantages of poor PF;
- calculate current at different PF values;
- calculate capacitor kvar;
- calculate current before and after PF correction;
- explain automatic PF correction;
- and answer integrated oral questions on motors and three-phase systems.

---

# Step 6 Distinction Checklist

You should now be able to:

1. explain why three phases are \(120^\circ\) apart;
2. derive and apply star/delta line/phase relationships correctly;
3. explain where \(\sqrt3\) comes from conceptually;
4. distinguish electrical input kW from mechanical shaft-output kW;
5. include efficiency before calculating motor current;
6. calculate synchronous speed and slip and explain why slip is necessary;
7. interpret 230/400 V and 400/690 V motor nameplates by winding voltage;
8. explain DOL, star-delta and VFD starting/control physically;
9. distinguish overload, short-circuit, earth-fault, phase-loss and stall protection;
10. distinguish power factor from efficiency;
11. calculate kvar correction and explain what the capacitor actually changes;
12. give a complete oral explanation of how a three-phase induction motor develops torque.

**End of Strengthened Step 6**
