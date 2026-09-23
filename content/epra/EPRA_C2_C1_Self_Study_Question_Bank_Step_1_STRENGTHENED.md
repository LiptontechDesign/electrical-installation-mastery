# EPRA C2 & C1 Self-Study Question Bank

## Step 1 — Electrical Foundations, Ohm’s Law, Series & Parallel Circuits, Power, Energy and Formula Transposition — Strengthened Distinction Edition

> **Purpose of this study bank:**  
> This is a learning-focused question-and-answer bank for EPRA C2 and C1 preparation. The questions are written to develop calculation ability, conceptual understanding, fault reasoning, and oral-exam explanation skills.  
>
> The underlying learning material has been consolidated into the questions and answers themselves. The explanations are written so that the student can learn directly from this file without needing separate commentary about where each point originated.

---

## How to Use This File

For each question:

1. Attempt the question **without looking at the answer**.
2. Show all calculation steps.
3. Include the correct unit in the final answer.
4. For explanation questions, practise answering aloud as if speaking to an examiner.
5. Only check the worked answer after completing your own attempt.
6. If your answer differs, identify **where the reasoning changed**, not only whether the final number was right or wrong.

### Distinction Calculation Method

For numerical questions, train yourself to show:

\[
\boxed{\text{GIVEN}\rightarrow\text{FORMULA}\rightarrow\text{SUBSTITUTION}\rightarrow\text{ANSWER}\rightarrow\text{CHECK}}
\]

Do not jump from the question directly to the calculator result. EPRA-style electrical questions reward method, units and technically sensible reasoning.

### Distinction Explanation Method

For theory and oral questions, develop answers in this order where it fits:

\[
\boxed{\text{Definition}\rightarrow\text{Meaning}\rightarrow\text{How it works}\rightarrow\text{Why it matters}\rightarrow\text{What happens if wrong}}
\]

This turns a short remembered statement into an examiner-quality technical answer.

---

## Important Note on BS 7671 References

Most of Step 1 is based on fundamental electrical theory rather than values taken from BS 7671 tables.

Therefore, values such as **12 V, 24 V, 200 V, 230 V or 240 V** used in the calculation questions below are **question data unless explicitly stated otherwise**.

Where a later question requires a numerical value obtained from BS 7671, the study bank will identify:

- the relevant **BS 7671 Regulation, Table or Appendix**;
- what that source is used for;
- the row, column or value selected;
- why that value applies to the particular question;
- and exactly where the value enters the calculation.

This will be especially important later for subjects such as:

- cable current-carrying capacity;
- correction factors;
- voltage-drop values;
- maximum earth-fault loop impedance;
- disconnection times;
- protective-device characteristics;
- conductor sizing;
- thermal withstand;
- and other design or verification values.

## Definition Source Rule Used in the Strengthened Edition

Definitions are treated carefully throughout this study bank.

1. **If the uploaded BS 7671 book contains a formal Part 2 definition for the term, that wording is used or closely preserved and identified as the book definition.**
2. **If BS 7671 does not formally define a basic physics quantity such as electric current, resistance, electrical power or frequency in Part 2, this file does not pretend that a study definition is an official BS 7671 definition.** In those cases a clear foundational electrical/physics definition is given.
3. After a formal definition, the answer then explains the **practical electrical meaning**. This is important because an examiner may first ask “define it” and then immediately ask “what does that mean in an installation?”
4. The uploaded book is the **Seventeenth Edition incorporating Amendment 3:2015**. It is therefore used here for requested definition wording and foundational terminology, not as authority for current 2026 numerical requirements.

This distinction prevents two common study errors:

\[
\boxed{\text{memorising an inaccurate definition}}
\]

and

\[
\boxed{\text{quoting an old numerical rule as though it were current}}
\]

---

# Section A — Voltage, Current, Resistance and Ohm’s Law

## Question 1 — Electrical Current  
**Define electric current and state its unit. (2 marks)**

### Answer

### Definition source

The uploaded BS 7671 Part 2 does **not** provide a standalone formal definition of the fundamental physics quantity *electric current*. Therefore the following is a foundational electrical definition rather than a claimed BS 7671 quotation.

Electric current is the **rate at which electric charge passes a point in an electrical circuit**.

Its symbol is:

\[
I
\]

Its SI unit is the:

\[
\boxed{\text{ampere (A)}}
\]

Fundamentally:

\[
I=\frac{Q}{t}
\]

where:

- \(I\) = current in amperes;
- \(Q\) = electric charge in coulombs;
- \(t\) = time in seconds.

Therefore:

\[
1A=1C/s
\]

One ampere means **one coulomb of charge passes a point every second**.

A useful distinction is:

- **conventional current direction** is taken from positive to negative;
- electrons in a metallic conductor actually drift in the opposite direction.

---

## Question 2 — Voltage  
**Define voltage or potential difference and state its unit. (2 marks)**

### Answer

### Definition source

The uploaded BS 7671 Part 2 formally defines **nominal voltage**, but it does not give a standalone textbook definition of the fundamental quantity *potential difference*. The definition below is therefore the foundational electrical meaning.

Voltage or potential difference is the **electrical energy transferred per unit charge between two points**.

It represents the electrical energy transferred per unit charge when charge moves between those points.

Its symbol is:

\[
V
\]

Its SI unit is:

\[
\boxed{\text{volt (V)}}
\]

Fundamentally:

\[
V=\frac{W}{Q}
\]

where:

- \(V\) = potential difference in volts;
- \(W\) = energy transferred in joules;
- \(Q\) = charge in coulombs.

Therefore:

\[
1V=1J/C
\]

One volt means **one joule of energy is transferred per coulomb of charge**.

### Related official BS 7671 definition

The uploaded book defines **Voltage, nominal** as:

> **“Voltage by which an installation (or part of an installation) is designated.”**

That definition is different from the physics definition of potential difference above. The first is a **system designation term**; the second explains the physical electrical quantity.

**Examiner-level distinction:** Do not answer “230 V” when asked to define voltage. That is a value, not a definition.

---

## Question 3 — Resistance  
**Define electrical resistance and state its unit. (2 marks)**

### Answer

### Definition source

The uploaded BS 7671 Part 2 does not provide a standalone definition of the fundamental quantity *electrical resistance*. The wording below is therefore a foundational study definition.

Electrical resistance is the **opposition that a material or component offers to the flow of electric current**.

Its symbol is:

\[
R
\]

Its unit is:

\[
\boxed{\text{ohm }(\Omega)}
\]

A higher resistance makes it more difficult for current to flow.

A lower resistance allows a greater current to flow for the same applied voltage.

From Ohm’s law:

\[
R=\frac{V}{I}
\]

One ohm is therefore the resistance that allows **1 A to flow when 1 V is applied**:

\[
1\Omega=\frac{1V}{1A}
\]

---

## Question 4 — Ohm’s Law  
**State Ohm’s law. (3 marks)**

### Answer

Ohm’s law is a fundamental circuit relationship rather than a Part 2 BS 7671 definition.

Ohm’s law states that:

> **The current flowing through an ohmic conductor is directly proportional to the potential difference across it, provided its temperature and other physical conditions remain constant.**

Mathematically:

\[
\boxed{V=IR}
\]

It can be rearranged as:

\[
\boxed{I=\frac{V}{R}}
\]

and:

\[
\boxed{R=\frac{V}{I}}
\]

This means:

- increasing voltage while keeping resistance constant increases current;
- increasing resistance while keeping voltage constant decreases current.

The condition concerning temperature is important because the resistance of many materials changes with temperature.

### Physical interpretation

For a fixed resistance:

\[
V\uparrow\Rightarrow I\uparrow
\]

For a fixed voltage:

\[
R\uparrow\Rightarrow I\downarrow
\]

This is the useful mental model developed throughout the foundation lessons: **voltage provides the electrical driving effect, resistance opposes current, and current is the result of the two**.

### Reverse-check technique

After solving an Ohm’s-law question, put the answer back into another form of the equation.

Example:

\[
15V,\quad3\Omega
\]

gives:

\[
I=\frac{15}{3}=5A
\]

Check:

\[
V=IR=5\times3=15V
\]

If the reverse check does not reproduce the original known value, investigate the calculation.

---

## Question 5 — Direct and Inverse Relationships  
A resistor is connected to a constant-voltage supply.

**(a)** What happens to current if resistance increases?  
**(b)** What happens to current if resistance decreases?  
**(c)** Explain your answers. **(4 marks)**

### Answer

From:

\[
I=\frac{V}{R}
\]

if voltage remains constant:

### (a) Resistance increases

Current decreases.

\[
R\uparrow\Rightarrow I\downarrow
\]

### (b) Resistance decreases

Current increases.

\[
R\downarrow\Rightarrow I\uparrow
\]

### (c) Explanation

Current and resistance have an **inverse relationship** when voltage is constant.

For example:

\[
V=12V,\qquad R=2\Omega
\]

Then:

\[
I=\frac{12}{2}=6A
\]

If resistance doubles:

\[
R=4\Omega
\]

then:

\[
I=\frac{12}{4}=3A
\]

Resistance doubled from 2 Ω to 4 Ω, while current halved from 6 A to 3 A.

---

## Question 6 — Effect of Increasing Voltage  
A 4 Ω resistor initially has 12 V across it. The voltage is increased to 24 V while resistance remains unchanged.

Calculate the current at each voltage and explain the relationship. **(5 marks)**

### Answer

At 12 V:

\[
I=\frac{V}{R}
\]

\[
I=\frac{12}{4}=3A
\]

\[
\boxed{I=3A}
\]

At 24 V:

\[
I=\frac{24}{4}=6A
\]

\[
\boxed{I=6A}
\]

The voltage doubled:

\[
12V\rightarrow24V
\]

and because resistance remained constant, current also doubled:

\[
3A\rightarrow6A
\]

Therefore, for an ohmic conductor under constant physical conditions:

\[
\boxed{I\propto V}
\]

Current is directly proportional to voltage.

---

## Question 7 — Calculate Current  
A 15 V supply is connected across a resistance of 3 Ω.

Calculate the current. **(3 marks)**

### Answer

Use:

\[
I=\frac{V}{R}
\]

Substitute:

\[
I=\frac{15}{3}
\]

Therefore:

\[
\boxed{I=5A}
\]

### Check

\[
V=IR
\]

\[
V=5\times3=15V
\]

The answer is correct.

---

## Question 8 — Calculate Voltage  
A circuit carries 4 A through a resistance of 60 Ω.

Calculate the applied voltage. **(3 marks)**

### Answer

Use:

\[
V=IR
\]

Therefore:

\[
V=4\times60
\]

\[
\boxed{V=240V}
\]

### Check

\[
I=\frac{V}{R}
\]

\[
I=\frac{240}{60}=4A
\]

---

## Question 9 — Calculate Resistance  
A load connected to a 230 V supply draws 5 A.

Calculate its resistance. **(3 marks)**

### Answer

Use:

\[
R=\frac{V}{I}
\]

Therefore:

\[
R=\frac{230}{5}
\]

\[
\boxed{R=46\Omega}
\]

**Note:** The 230 V value is supplied by the question. It has not been obtained from a BS 7671 table.

---

## Question 10 — Changing Resistance  
A circuit is supplied at 12 V.

Calculate the current when the resistance is:

**(a)** 2 Ω  
**(b)** 4 Ω  
**(c)** 6 Ω

Then explain the pattern. **(7 marks)**

### Answer

Using:

\[
I=\frac{V}{R}
\]

### (a) 2 Ω

\[
I=\frac{12}{2}=6A
\]

\[
\boxed{6A}
\]

### (b) 4 Ω

\[
I=\frac{12}{4}=3A
\]

\[
\boxed{3A}
\]

### (c) 6 Ω

\[
I=\frac{12}{6}=2A
\]

\[
\boxed{2A}
\]

The results are:

| Resistance | Current |
|---:|---:|
| 2 Ω | 6 A |
| 4 Ω | 3 A |
| 6 Ω | 2 A |

At constant voltage, increasing resistance reduces current.

For example, when resistance doubles:

\[
2\Omega\rightarrow4\Omega
\]

current halves:

\[
6A\rightarrow3A
\]

---

# Section B — AC, DC and Frequency

## Question 11 — AC and DC  
**Differentiate between alternating current and direct current. (4 marks)**

### Answer

### Definition source

The uploaded BS 7671 Part 2 uses the terms a.c. and d.c. throughout but does not provide standalone basic-waveform definitions for AC and DC. The following is the foundational electrical distinction.

### Direct Current — DC

Direct current flows with **one polarity and one principal direction**.

A DC source has fixed positive and negative polarity.

Examples include:

- batteries;
- DC power supplies;
- many solar photovoltaic outputs before inversion.

### Alternating Current — AC

Alternating current **changes magnitude and reverses direction periodically**.

The polarity of the voltage alternates with time.

For a sinusoidal AC waveform, one complete positive and negative sequence is called a **cycle**.

---

## Question 12 — Frequency  
**Define frequency and state its unit. (2 marks)**

### Answer

Frequency is the **number of complete cycles of an alternating waveform occurring each second**.

Its symbol is:

\[
f
\]

Its unit is:

\[
\boxed{\text{hertz (Hz)}}
\]

Thus:

\[
1Hz=1\text{ cycle per second}
\]

For example, a 50 Hz waveform completes:

\[
\boxed{50\text{ cycles every second}}
\]

### Practical importance

Frequency matters because equipment must be suitable for the frequency of the circuit. The uploaded BS 7671 states in its equipment-selection requirements that equipment is to be suitable for the frequencies likely to occur in the circuit.

For motors and transformers, frequency affects magnetic operation. Later, for three-phase motors:

\[
N_s=\frac{120f}{P}
\]

shows directly that frequency affects synchronous speed.

---

## Question 12A — Official BS 7671 Definition: Nominal Voltage and Low Voltage
**Using the uploaded BS 7671 book, define nominal voltage and state the low-voltage range given in that edition. (5 marks)**

### Answer

### Formal book definition

The uploaded BS 7671 Part 2 defines **Voltage, nominal** as:

> **“Voltage by which an installation (or part of an installation) is designated.”**

The same definition entry states that, in that edition, **low voltage** is voltage exceeding extra-low voltage but not exceeding:

\[
1000V\text{ a.c. or }1500V\text{ d.c. between conductors}
\]

or:

\[
600V\text{ a.c. or }900V\text{ d.c. between conductors and Earth}
\]

### Why this question matters

An examiner may use the phrase **low voltage** technically. It does not mean “a voltage that feels small.” It is a defined voltage classification.

### Edition caution

These figures are quoted from the uploaded Seventeenth Edition definition entry. Where a current Kenyan or current BS 7671 requirement is specifically asked, use the current applicable standard rather than assuming an older edition controls the answer.

---

# Section C — Series Circuits

## Question 13 — Series Circuit Characteristics  
**State four characteristics of a series circuit containing resistors. (4 marks)**

### Answer

In a series resistor circuit:

1. **The same current flows through every resistor.**
2. **The total resistance equals the sum of the individual resistances.**

\[
R_T=R_1+R_2+R_3+\dots
\]

3. **The supply voltage is divided between the resistors.**
4. **The individual voltage drops add to equal the supply voltage.**

\[
V_T=V_1+V_2+V_3+\dots
\]

Increasing the number or resistance of series components increases total resistance and therefore reduces circuit current if the supply voltage remains unchanged.

### Reasoning rather than memorisation

A series circuit has **one current path**. Charge cannot choose an alternative branch, so the same current must pass each component.

The separate voltage drops are not arbitrary. They follow:

\[
V_n=IR_n
\]

Because \(I\) is common to every component, the larger resistance receives the larger voltage drop.

This gives a powerful exam check:

\[
\boxed{\sum V_{\text{drops}}=V_{\text{supply}}}
\]

---

## Question 14 — Total Resistance in Series  
Three resistors of 2 Ω, 5 Ω and 8 Ω are connected in series.

Calculate the total resistance. **(2 marks)**

### Answer

For resistors in series:

\[
R_T=R_1+R_2+R_3
\]

Therefore:

\[
R_T=2+5+8
\]

\[
\boxed{R_T=15\Omega}
\]

---

## Question 15 — Complete Series-Circuit Calculation  
Two resistors of 3 Ω and 5 Ω are connected in series across a 24 V supply.

Determine:

**(a)** total resistance;  
**(b)** circuit current;  
**(c)** voltage across the 3 Ω resistor;  
**(d)** voltage across the 5 Ω resistor. **(8 marks)**

### Answer

### (a) Total resistance

\[
R_T=3+5
\]

\[
\boxed{R_T=8\Omega}
\]

### (b) Current

\[
I=\frac{V}{R}
\]

\[
I=\frac{24}{8}=3A
\]

\[
\boxed{I=3A}
\]

Because it is a series circuit, the same 3 A flows through both resistors.

### (c) Voltage across the 3 Ω resistor

\[
V_1=IR_1
\]

\[
V_1=3\times3=9V
\]

\[
\boxed{V_1=9V}
\]

### (d) Voltage across the 5 Ω resistor

\[
V_2=IR_2
\]

\[
V_2=3\times5=15V
\]

\[
\boxed{V_2=15V}
\]

### Check

\[
V_T=V_1+V_2
\]

\[
9+15=24V
\]

Therefore:

\[
\boxed{V_T=24V}
\]

---

## Question 16 — Why Voltage Divides in Series  
In Question 15, why does the 5 Ω resistor have a larger voltage drop than the 3 Ω resistor? **(3 marks)**

### Answer

The same current flows through both resistors because they are connected in series.

Using:

\[
V=IR
\]

the voltage drop is proportional to resistance when current is constant.

For the 3 Ω resistor:

\[
V=3A\times3\Omega=9V
\]

For the 5 Ω resistor:

\[
V=3A\times5\Omega=15V
\]

Therefore, the larger resistance develops the larger voltage drop.

---

## Question 17 — Cable Resistance and Length  
Explain why increasing the length of a cable increases its resistance. **(4 marks)**

### Answer

The resistance of a conductor can be expressed approximately by:

\[
R=\rho\frac{L}{A}
\]

where:

- \(R\) = resistance;
- \(\rho\) = resistivity of the conductor material;
- \(L\) = conductor length;
- \(A\) = conductor cross-sectional area.

Therefore:

\[
R\propto L
\]

If conductor material and cross-sectional area remain the same, a longer conductor has greater resistance.

This matters in electrical installation work because increasing cable length can increase:

- conductor resistance;
- voltage drop;
- power loss in the cable;
- and, in fault calculations, the impedance of the fault path.

Detailed cable voltage-drop design will be dealt with later using the appropriate BS 7671 Appendix 4 data where applicable.

---

# Section D — Parallel Circuits

## Question 18 — Parallel Circuit Characteristics  
**State four characteristics of a parallel circuit containing resistors. (4 marks)**

### Answer

In a parallel circuit:

1. **The same voltage exists across each parallel branch.**
2. **Current divides between the branches.**
3. **The total supply current equals the sum of the branch currents.**

\[
I_T=I_1+I_2+I_3+\dots
\]

4. **The equivalent resistance is less than the smallest individual parallel resistance.**

The general equivalent-resistance formula is:

\[
\frac{1}{R_T}
=
\frac{1}{R_1}
+
\frac{1}{R_2}
+
\frac{1}{R_3}
+\dots
\]

### Reasoning rather than memorisation

A parallel circuit gives current **more than one path**.

Each branch is connected across the same two electrical nodes, which is why every branch has the same voltage.

Adding another parallel path increases the total conductance available to current. Therefore equivalent resistance must fall.

A rapid reasonableness check is:

\[
\boxed{R_T<\text{smallest branch resistance}}
\]

If a parallel-resistance calculation gives a value larger than the smallest branch resistance, the answer is wrong.

---

## Question 19 — Equal Resistors in Parallel  
Two 5 Ω resistors are connected in parallel across a 10 V supply.

Calculate:

**(a)** current through each resistor;  
**(b)** total current;  
**(c)** equivalent resistance. **(6 marks)**

### Answer

Each resistor receives the full 10 V.

### Branch 1

\[
I_1=\frac{10}{5}=2A
\]

### Branch 2

\[
I_2=\frac{10}{5}=2A
\]

Therefore:

\[
\boxed{I_1=I_2=2A}
\]

### Total current

\[
I_T=I_1+I_2
\]

\[
I_T=2+2=4A
\]

\[
\boxed{I_T=4A}
\]

### Equivalent resistance

\[
R_T=\frac{V}{I_T}
\]

\[
R_T=\frac{10}{4}=2.5\Omega
\]

\[
\boxed{R_T=2.5\Omega}
\]

Notice that the equivalent resistance, 2.5 Ω, is lower than either individual 5 Ω resistance.

---

## Question 20 — Unequal Parallel Resistors  
A 6 Ω resistor and a 12 Ω resistor are connected in parallel across 24 V.

Calculate:

**(a)** current through the 6 Ω resistor;  
**(b)** current through the 12 Ω resistor;  
**(c)** total current;  
**(d)** equivalent resistance. **(8 marks)**

### Answer

Both resistors have the full 24 V across them.

### (a) 6 Ω branch

\[
I_1=\frac{24}{6}=4A
\]

\[
\boxed{I_1=4A}
\]

### (b) 12 Ω branch

\[
I_2=\frac{24}{12}=2A
\]

\[
\boxed{I_2=2A}
\]

### (c) Total current

\[
I_T=4+2=6A
\]

\[
\boxed{I_T=6A}
\]

### (d) Equivalent resistance

\[
R_T=\frac{V}{I_T}
\]

\[
R_T=\frac{24}{6}=4\Omega
\]

\[
\boxed{R_T=4\Omega}
\]

This result is physically sensible because the equivalent resistance of parallel resistors must be less than the smallest branch resistance.

---

## Question 21 — Check Parallel Resistance Using the Reciprocal Formula  
Confirm the equivalent resistance in Question 20 using the general parallel-resistance formula. **(4 marks)**

### Answer

\[
\frac1{R_T}
=
\frac1{6}
+
\frac1{12}
\]

Convert to a common denominator:

\[
\frac1{6}=\frac2{12}
\]

Therefore:

\[
\frac1{R_T}
=
\frac2{12}
+
\frac1{12}
=
\frac3{12}
\]

\[
\frac1{R_T}=\frac14
\]

Therefore:

\[
\boxed{R_T=4\Omega}
\]

This agrees with the value obtained using:

\[
R_T=\frac{V}{I_T}
\]

---

## Question 22 — Why Building Loads Use Parallel Circuits  
**Explain why electrical loads in a building are generally connected in parallel rather than all being connected in series. (5 marks)**

### Answer

Loads are generally connected in parallel because:

1. each load receives approximately the full circuit supply voltage;
2. each load can draw the current required by its own impedance and power rating;
3. one load can normally be switched off without interrupting current to the others;
4. failure or disconnection of one branch does not automatically open every other parallel branch;
5. appliances of different power ratings can operate independently.

If building loads were all connected in series:

- the supply voltage would divide between them;
- switching one device off could interrupt the entire current path;
- adding or removing a load would alter current and voltage throughout the circuit;
- equipment would generally not receive its intended operating voltage.

---

## Question 23 — Series Lamps  
Two identical lamps are connected in series across a supply for which one lamp would normally be connected individually.

Explain why the lamps would not behave normally. **(4 marks)**

### Answer

Because the lamps are connected in series:

- the same current passes through both;
- the total supply voltage is divided between them.

If they have approximately equal resistance, each receives approximately half of the supply voltage.

Because electrical power depends on voltage and current, each lamp operates at much less than its intended power and is therefore likely to be much dimmer than normal.

For real lamps, resistance may change with operating temperature, so an exact calculation may require a more detailed model than a simple fixed resistance.

---

# Section E — Electrical Power

## Question 24 — Define Electrical Power  
**Define electrical power and state its unit. (2 marks)**

### Answer

### Definition source

The uploaded BS 7671 Part 2 does not give a standalone physics definition of *electrical power*. The following is the foundational electrical definition.

Electrical power is the **rate at which electrical energy is transferred or converted**.

Its symbol is:

\[
P
\]

Its SI unit is:

\[
\boxed{\text{watt (W)}}
\]

One watt is one joule per second:

\[
1W=1J/s
\]

For a DC circuit, or for a purely resistive AC load where voltage and current are effectively in phase:

\[
\boxed{P=VI}
\]

### Related official BS 7671 definition

The uploaded Part 2 defines **current-using equipment** as:

> **“Equipment which converts electrical energy into another form of energy, such as light, heat or motive power.”**

That definition connects directly to electrical power: power tells us the **rate** at which that energy conversion takes place.

Examples:

- heater → electrical energy to heat;
- lamp → electrical energy to light/heat;
- motor → electrical energy to mechanical output.

---

## Question 25 — Power Calculation  
A resistive appliance operates at 230 V and takes 10 A.

Calculate its power. **(3 marks)**

### Answer

Use:

\[
P=VI
\]

Therefore:

\[
P=230\times10=2300W
\]

\[
\boxed{P=2300W=2.3kW}
\]

**Note:** The 230 V is question data in this example.

---

## Question 26 — Calculate Current from Power  
A single-phase resistive load is rated at 4.37 kW and is supplied at 230 V.

Calculate its current. **(4 marks)**

### Answer

First convert kilowatts to watts:

\[
4.37kW=4370W
\]

For a resistive load:

\[
P=VI
\]

Rearrange:

\[
I=\frac{P}{V}
\]

Substitute:

\[
I=\frac{4370}{230}
\]

\[
\boxed{I=19A}
\]

A key step is ensuring that all quantities are expressed in compatible units before substitution.

### Why this is a strong exam method

Do not memorize the result. Build it:

**GIVEN**

\[
P=4.37kW=4370W,\qquad V=230V
\]

**FORMULA**

\[
P=VI
\]

**MAKE THE REQUIRED QUANTITY THE SUBJECT**

\[
I=\frac{P}{V}
\]

**SUBSTITUTE**

\[
I=\frac{4370}{230}
\]

**ANSWER**

\[
\boxed{I=19A}
\]

**CHECK**

\[
P=VI=230\times19=4370W
\]

The reverse check proves the numerical relationship has been used consistently.

---

## Question 27 — Calculate Voltage from Power  
An electrical load consumes 1.2 kW while drawing 5 A.

Assuming a resistive load, calculate the supply voltage. **(4 marks)**

### Answer

Convert:

\[
1.2kW=1200W
\]

Using:

\[
P=VI
\]

Rearrange:

\[
V=\frac{P}{I}
\]

Therefore:

\[
V=\frac{1200}{5}
\]

\[
\boxed{V=240V}
\]

---

## Question 28 — Convert Electrical Units  
Convert the following:

**(a)** 3.5 kW to watts  
**(b)** 750 W to kilowatts  
**(c)** 2 MW to watts  
**(d)** 3500 mA to amperes. **(4 marks)**

### Answer

### (a)

\[
3.5kW=3.5\times1000
\]

\[
\boxed{3500W}
\]

### (b)

\[
750W=\frac{750}{1000}
\]

\[
\boxed{0.75kW}
\]

### (c)

\[
2MW=2\times1,000,000
\]

\[
\boxed{2,000,000W}
\]

### (d)

\[
3500mA=\frac{3500}{1000}
\]

\[
\boxed{3.5A}
\]

Useful prefixes:

\[
k=10^3
\]

\[
M=10^6
\]

\[
m=10^{-3}
\]

---

## Question 29 — Relationship Between Power, Voltage and Resistance  
A 20 Ω purely resistive heater is connected across 200 V.

Calculate:

**(a)** current;  
**(b)** power. **(5 marks)**

### Answer

### (a) Current

\[
I=\frac{V}{R}
\]

\[
I=\frac{200}{20}=10A
\]

\[
\boxed{I=10A}
\]

### (b) Power

\[
P=VI
\]

\[
P=200\times10=2000W
\]

\[
\boxed{P=2000W=2kW}
\]

Alternatively:

\[
P=\frac{V^2}{R}
\]

\[
P=\frac{200^2}{20}
\]

\[
P=\frac{40000}{20}
\]

\[
\boxed{P=2000W}
\]

Both methods give the same result.

---

## Question 30 — Derive the Power Formulas  
Starting with:

\[
P=VI
\]

and Ohm’s law, derive:

**(a)** \(P=I^2R\)  
**(b)** \(P=\frac{V^2}{R}\). **(6 marks)**

### Answer

We know:

\[
P=VI
\]

and:

\[
V=IR
\]

### (a) Derive \(P=I^2R\)

Substitute \(IR\) for \(V\):

\[
P=(IR)I
\]

Therefore:

\[
\boxed{P=I^2R}
\]

### (b) Derive \(P=\frac{V^2}{R}\)

From Ohm’s law:

\[
I=\frac{V}{R}
\]

Substitute into:

\[
P=VI
\]

Therefore:

\[
P=V\left(\frac{V}{R}\right)
\]

Hence:

\[
\boxed{P=\frac{V^2}{R}}
\]

For a purely resistive load:

\[
\boxed{P=VI=I^2R=\frac{V^2}{R}}
\]

---

## Question 31 — Effect of Reduced Voltage on a Resistive Heater  
A fixed 24 Ω heating element is designed to operate at 240 V.

Calculate its power at:

**(a)** 240 V;  
**(b)** 220 V.

Explain the result. **(7 marks)**

### Answer

For a fixed resistance:

\[
P=\frac{V^2}{R}
\]

### (a) At 240 V

\[
P=\frac{240^2}{24}
\]

\[
P=\frac{57600}{24}
\]

\[
\boxed{P=2400W}
\]

### (b) At 220 V

\[
P=\frac{220^2}{24}
\]

\[
P=\frac{48400}{24}
\]

\[
P\approx2016.7W
\]

\[
\boxed{P\approx2017W}
\]

Therefore, power falls from:

\[
2400W
\]

to approximately:

\[
2017W
\]

when the voltage falls.

For a fixed resistive load:

\[
P\propto V^2
\]

Therefore, a reduction in voltage can significantly reduce the power delivered to a resistive heating element.

### Physical interpretation

For a **fixed resistance**:

\[
P=\frac{V^2}{R}
\]

so voltage has a squared effect on power.

This is why excessive voltage drop can make a resistive heater or kettle perform more slowly: less voltage at the appliance means less power converted into heat.

### Technical caution

Real heating elements can change resistance as their temperature changes, so \(R\) is not always perfectly constant in practice. The question deliberately uses a fixed-resistance model to teach the governing relationship.

---

# Section F — Electrical Energy

## Question 32 — Power and Energy  
**Distinguish between electrical power and electrical energy. (4 marks)**

### Answer

**Electrical power** is the **rate at which electrical energy is transferred or converted**.

\[
P=\frac{E}{t}
\]

Its unit is the watt.

**Electrical energy** is the total amount of energy transferred over a period of time.

\[
E=Pt
\]

Energy may be expressed in:

- joules;
- watt-hours;
- kilowatt-hours.

For electrical energy use, a common unit is:

\[
\boxed{kWh}
\]

For example, a 2 kW heater operating for 3 hours consumes:

\[
2\times3=6kWh
\]

Therefore:

- the heater’s **power rating** is 2 kW;
- the **energy consumed** over 3 hours is 6 kWh.

### Examiner distinction

Power and energy are not interchangeable.

\[
\boxed{\text{Power = rate}}
\]

\[
\boxed{\text{Energy = power accumulated over time}}
\]

A 2 kW heater is not “using 2 kWh” unless a time period is also specified.

---

## Question 33 — Energy Consumption  
A 2 kW heater operates continuously for 4 hours.

Calculate the electrical energy consumed. **(3 marks)**

### Answer

\[
E=Pt
\]

Therefore:

\[
E=2kW\times4h
\]

\[
\boxed{E=8kWh}
\]

In watt-hours:

\[
8kWh=8000Wh
\]

---

## Question 34 — Mixed Domestic Load  
The following loads operate simultaneously:

- heater = 1.5 kW;
- lamp = 15 W;
- iron = 750 W;
- appliance = 3.5 kW.

Determine the total connected load in kilowatts. **(5 marks)**

### Answer

Convert all loads to kilowatts.

Lamp:

\[
15W=0.015kW
\]

Iron:

\[
750W=0.75kW
\]

Now add:

\[
P_T=1.5+0.015+0.75+3.5
\]

\[
P_T=5.765kW
\]

Therefore:

\[
\boxed{P_T=5.765kW}
\]

This is the total load operating simultaneously in this particular question.

It is not automatically the same as a complete installation’s **maximum demand**, because maximum-demand and diversity calculations involve additional design considerations that will be treated separately later.

---

## Question 35 — Current of Simultaneous Loads  
Using the total load from Question 34, calculate the current if all loads are treated as purely resistive and supplied at 230 V. **(4 marks)**

### Answer

Total power:

\[
P=5.765kW
\]

Convert to watts:

\[
P=5765W
\]

Using:

\[
I=\frac{P}{V}
\]

\[
I=\frac{5765}{230}
\]

\[
I\approx25.065A
\]

Therefore:

\[
\boxed{I\approx25.1A}
\]

This calculation assumes:

- all loads operate simultaneously;
- the stated supply is 230 V;
- the loads are treated as unity-power-factor loads.

Real installation design may also require consideration of:

- diversity;
- maximum demand;
- power factor;
- starting currents;
- and the characteristics of particular loads.

---

# Section G — Power Triangle and Power Factor

## Question 36 — Real, Reactive and Apparent Power  
**Define real power, reactive power and apparent power. State their units. (6 marks)**

### Answer

### Definition source

The uploaded BS 7671 book uses power-factor and power quantities in its requirements and symbols, but its Part 2 definition list does not provide the simple classroom definitions of \(P\), \(Q\) and \(S\) used below. These are foundational AC-power definitions.

### Real Power

Real or active power is the portion of electrical power that is converted into useful output such as:

- heat;
- light;
- mechanical work;
- or other useful energy conversion.

Symbol:

\[
P
\]

Unit:

\[
\boxed{\text{watt (W)}}
\]

### Reactive Power

Reactive power represents energy that is alternately stored and returned by reactive components such as inductors and capacitors in AC systems.

Symbol:

\[
Q
\]

Unit:

\[
\boxed{\text{volt-ampere reactive (var)}}
\]

### Apparent Power

Apparent power is the product of RMS voltage and RMS current without directly accounting for phase displacement.

Symbol:

\[
S
\]

Unit:

\[
\boxed{\text{volt-ampere (VA)}}
\]

For single-phase AC:

\[
S=VI
\]

The three quantities can be represented by the **power triangle**.

---

## Question 37 — Power Triangle Calculation  
A single-phase load has:

\[
P=8kW
\]

and:

\[
Q=6kvar
\]

Calculate the apparent power. **(4 marks)**

### Answer

For the power triangle:

\[
S^2=P^2+Q^2
\]

Therefore:

\[
S=\sqrt{P^2+Q^2}
\]

Substitute:

\[
S=\sqrt{8^2+6^2}
\]

\[
S=\sqrt{64+36}
\]

\[
S=\sqrt{100}
\]

\[
\boxed{S=10kVA}
\]

---

## Question 38 — Power Factor  
Using the values in Question 37, calculate the power factor. **(3 marks)**

### Answer

Power factor is:

\[
PF=\frac{P}{S}
\]

Therefore:

\[
PF=\frac{8}{10}
\]

\[
\boxed{PF=0.8}
\]

For a sinusoidal system:

\[
PF=\cos\phi
\]

Therefore:

\[
\boxed{\cos\phi=0.8}
\]

At C2 level, it is important to understand what power factor represents.

At C1 level, power factor is studied in more depth, including:

- causes of poor power factor;
- disadvantages of low power factor;
- power-factor correction;
- capacitor sizing;
- and the effect of power factor on current and equipment ratings.

### What power factor physically tells you

Power factor compares the useful real power to the total apparent power demanded from the supply:

\[
PF=\frac{P}{S}
\]

A PF of 0.8 means that a greater current/kVA must be carried than would be needed for the same real kW at unity PF.

Do not say “20% of the power is wasted.” That is an oversimplification and can be misleading. Reactive power is exchanged with the fields of reactive equipment; the important installation effect is the **extra current and kVA loading** required for the same real power.

---

## Question 39 — Effect of Power Factor on Current  
Two single-phase loads each require 4.6 kW of real power from a 230 V supply.

Load A has unity power factor.

Load B has a power factor of 0.8.

Calculate the current drawn by each load. **(7 marks)**

### Answer

For single-phase AC:

\[
P=VI\cos\phi
\]

Therefore:

\[
I=\frac{P}{V\cos\phi}
\]

### Load A

For unity power factor:

\[
PF=1
\]

\[
I_A=\frac{4600}{230\times1}
\]

\[
\boxed{I_A=20A}
\]

### Load B

\[
PF=0.8
\]

\[
I_B=\frac{4600}{230\times0.8}
\]

\[
I_B=\frac{4600}{184}
\]

\[
\boxed{I_B=25A}
\]

Both loads require the same real power, 4.6 kW, but the poorer-power-factor load draws more current.

Higher current can contribute to:

- increased conductor losses;
- increased voltage drop;
- increased loading of cables;
- increased loading of switchgear;
- increased loading of transformers;
- and the need for larger equipment ratings.

---

# Section H — Formula Transposition

## Question 40 — Transpose Ohm’s Law  
Starting with:

\[
V=IR
\]

make:

**(a)** \(I\) the subject;  
**(b)** \(R\) the subject. **(4 marks)**

### Answer

Starting with:

\[
V=IR
\]

### (a) Make \(I\) the subject

Divide both sides by \(R\):

\[
\frac{V}{R}=\frac{IR}{R}
\]

Therefore:

\[
\boxed{I=\frac{V}{R}}
\]

### (b) Make \(R\) the subject

Divide both sides by \(I\):

\[
\frac{V}{I}=\frac{IR}{I}
\]

Therefore:

\[
\boxed{R=\frac{V}{I}}
\]

A reliable way to understand transposition is to perform the **same mathematical operation on both sides of the equation** until the required quantity is isolated.

### The balance rule

Treat the equals sign like the centre of a balanced beam:

\[
\boxed{\text{whatever operation you apply to one side, apply to the other}}
\]

Do not rely only on the shortcut phrase “move it across and change it.” The balanced-equation method shows **why** the transposition is valid and greatly reduces sign errors when formulas become more complicated.

### Verification

After rearranging, put known numbers into both the original and rearranged formulas. If both produce consistent results, the transposition is probably correct.

---

## Question 41 — Transpose the Power Formula  
Starting with:

\[
P=VI
\]

make:

**(a)** \(I\) the subject;  
**(b)** \(V\) the subject. **(4 marks)**

### Answer

### (a) Make \(I\) the subject

Divide by \(V\):

\[
\boxed{I=\frac{P}{V}}
\]

### (b) Make \(V\) the subject

Divide by \(I\):

\[
\boxed{V=\frac{P}{I}}
\]

---

## Question 42 — Transpose the Energy Equation  
Starting with:

\[
E=Pt
\]

make:

**(a)** \(P\) the subject;  
**(b)** \(t\) the subject. **(4 marks)**

### Answer

### (a)

Divide both sides by \(t\):

\[
\boxed{P=\frac{E}{t}}
\]

### (b)

Divide both sides by \(P\):

\[
\boxed{t=\frac{E}{P}}
\]

These manipulations are important because an electrical question may use the same physical relationship while asking for a different unknown.

---

## Question 43 — Choose the Correct Formula  
A 230 V appliance is rated at 2.99 kW.

Which expression should be used to calculate the current?

A.

\[
I=VR
\]

B.

\[
I=\frac{P}{V}
\]

C.

\[
I=\frac{V}{P}
\]

D.

\[
I=PV
\]

### Answer

\[
\boxed{\text{B}}
\]

For a resistive or unity-power-factor load:

\[
P=VI
\]

Therefore:

\[
I=\frac{P}{V}
\]

Convert:

\[
2.99kW=2990W
\]

Then:

\[
I=\frac{2990}{230}
\]

\[
\boxed{I=13A}
\]

---

# Section I — Reasonableness, Fault Thinking and Physical Interpretation

## Question 44 — Spot the Impossible Answer  
A 20 V supply is connected to a 10 Ω resistor. A student calculates the current as 200 A.

Explain why the answer must be wrong and give the correct result. **(4 marks)**

### Answer

Using:

\[
I=\frac{V}{R}
\]

\[
I=\frac{20}{10}
\]

\[
\boxed{I=2A}
\]

The 200 A answer is inconsistent with the values given.

A useful check is:

\[
V=IR
\]

For the correct answer:

\[
2\times10=20V
\]

For the incorrect answer:

\[
200\times10=2000V
\]

which does not equal the stated 20 V supply.

A competent electrician should therefore check whether a calculated result is **physically reasonable** rather than accepting a calculator display without verification.

---

## Question 45 — Identify a Series or Parallel Arrangement  
Two lamps operate from the same supply. Switching one lamp off does not switch the other lamp off.

Which arrangement is most consistent with this behaviour, and why? **(3 marks)**

### Answer

They are most likely connected:

\[
\boxed{\text{in parallel}}
\]

In a parallel arrangement, each lamp has its own branch across the supply.

Opening one branch interrupts current through that lamp, while another intact branch can continue carrying current.

This is one of the principal reasons building loads are generally connected in parallel.

---

## Question 46 — Fault Condition: Very Low Resistance  
A 230 V source is theoretically connected across a resistance of only 0.1 Ω.

Using Ohm’s law, calculate the prospective current, ignoring all other impedance. Explain the significance. **(5 marks)**

### Answer

\[
I=\frac{V}{R}
\]

\[
I=\frac{230}{0.1}
\]

\[
\boxed{I=2300A}
\]

The calculation demonstrates an essential principle:

\[
\boxed{\text{Very low impedance can produce extremely high fault current.}}
\]

In a real electrical system, the complete fault path includes:

- source impedance;
- conductor impedance;
- connection impedance;
- and other parts of the supply and installation.

Therefore, the real fault current depends on the **total fault-loop impedance**, not only one resistance.

This principle becomes very important later when studying:

- short-circuit current;
- earth-fault current;
- \(Z_e\);
- \(Z_s\);
- automatic disconnection;
- protective-device operation;
- breaking capacity;
- conductor thermal withstand.

---

## Question 47 — Open Circuit and Short Circuit  
**Differentiate between an open circuit and a short circuit. (4 marks)**

### Answer

### Related official BS 7671 definition

The uploaded Part 2 defines a **fault** as:

> **“A circuit condition in which current flows through an abnormal or unintended path.”**

A short circuit is one important type of fault condition.

### Open Circuit

An open circuit has a break in the intended current path.

Ideally:

\[
R\rightarrow\infty
\]

and therefore:

\[
I\rightarrow0
\]

An open switch is an intentional example.

A broken conductor is an unintentional example.

### Short Circuit

A short circuit is an unintended connection having **very low impedance** between points that should normally be at different potentials.

The low impedance can produce a very large current.

Therefore:

- **open circuit** → little or no current in the intended path;
- **short circuit** → potentially very high current.

### Practical interpretation

An open circuit is not automatically harmless. A broken conductor may leave one side of the break energized.

A short circuit is dangerous because the very low fault impedance can produce:

\[
I=\frac{V}{Z}
\]

at a very large value, creating:

- thermal stress;
- arcing;
- magnetic forces;
- fire risk.

This is why protective devices require adequate fault-breaking capability.

---

## Question 48 — Effect of Cable Size on Resistance  
Two copper conductors have equal length and operate at the same temperature.

Conductor A has a cross-sectional area of 1.5 mm².

Conductor B has a cross-sectional area of 6 mm².

Which conductor has the lower resistance, and why? **(4 marks)**

### Answer

Resistance is approximately:

\[
R=\rho\frac{L}{A}
\]

Both conductors have the same:

- material, so approximately the same resistivity \(\rho\);
- length \(L\);
- operating temperature.

The main difference is conductor cross-sectional area \(A\).

Because:

\[
R\propto\frac1A
\]

the larger conductor has lower resistance.

Therefore:

\[
\boxed{\text{The 6 mm}^2\text{ conductor has the lower resistance.}}
\]

This principle becomes important later when studying:

- current-carrying capacity;
- voltage drop;
- CPC resistance;
- earth-fault loop impedance;
- and conductor sizing.

---

# Section J — Integrated Calculation Problems

## Question 49 — Integrated Resistance, Current, Power and Energy  
A purely resistive load has a resistance of 23 Ω and is supplied at 230 V for 2 hours.

Determine:

**(a)** current;  
**(b)** power in watts;  
**(c)** power in kilowatts;  
**(d)** electrical energy consumed in kWh. **(10 marks)**

### Answer

### (a) Current

\[
I=\frac{V}{R}
\]

\[
I=\frac{230}{23}
\]

\[
\boxed{I=10A}
\]

### (b) Power in watts

\[
P=VI
\]

\[
P=230\times10
\]

\[
\boxed{P=2300W}
\]

### (c) Power in kilowatts

\[
2300W=2.3kW
\]

\[
\boxed{P=2.3kW}
\]

### (d) Energy

\[
E=Pt
\]

\[
E=2.3\times2
\]

\[
\boxed{E=4.6kWh}
\]

The calculation chain is:

\[
R\rightarrow I\rightarrow P\rightarrow E
\]

This is an example of multi-stage electrical reasoning rather than treating each formula as an isolated topic.

### Complete consistency check

Check power independently:

\[
P=\frac{V^2}{R}
\]

\[
P=\frac{230^2}{23}
\]

\[
P=2300W
\]

This agrees with:

\[
P=VI
\]

A distinction-level calculation becomes stronger when two independent relationships confirm the same answer.

---

## Question 50 — Integrated Parallel-Load Problem  
Three resistive appliances are connected in parallel to a 230 V supply:

- Load A = 460 W;
- Load B = 1.15 kW;
- Load C = 2.3 kW.

Calculate:

**(a)** current taken by each appliance;  
**(b)** total current;  
**(c)** total power;  
**(d)** what happens to total supply current if Load C is switched off. **(10 marks)**

### Answer

Because the loads are connected in parallel, each receives the full stated supply voltage of 230 V.

### Load A

\[
I_A=\frac{460}{230}
\]

\[
\boxed{I_A=2A}
\]

### Load B

Convert:

\[
1.15kW=1150W
\]

\[
I_B=\frac{1150}{230}
\]

\[
\boxed{I_B=5A}
\]

### Load C

Convert:

\[
2.3kW=2300W
\]

\[
I_C=\frac{2300}{230}
\]

\[
\boxed{I_C=10A}
\]

### Total Current

\[
I_T=2+5+10
\]

\[
\boxed{I_T=17A}
\]

### Total Power

\[
P_T=460+1150+2300
\]

\[
P_T=3910W
\]

\[
\boxed{P_T=3.91kW}
\]

### Load C Switched Off

The current in Load C’s branch becomes:

\[
0A
\]

Therefore:

\[
I_T=2+5
\]

\[
\boxed{I_T=7A}
\]

The remaining appliances can continue operating because their parallel branches remain intact.

### Independent power/current check

Total current can also be found from total power:

\[
I_T=\frac{P_T}{V}
\]

\[
I_T=\frac{3910}{230}
\]

\[
I_T=17A
\]

This agrees with:

\[
2+5+10=17A
\]

When two different routes give the same answer, confidence in the solution increases.

---

# Section K — Oral-Exam Understanding

## Question 51 — Explain Rather Than Calculate  
An examiner asks:

**“If voltage remains unchanged and resistance doubles, what happens to current, and why?” (3 marks)**

### Answer

Current halves.

From:

\[
I=\frac{V}{R}
\]

If resistance changes from \(R\) to \(2R\):

\[
I=\frac{V}{2R}
\]

The new current is therefore half of the original current.

Hence:

\[
\boxed{\text{At constant voltage, doubling resistance halves current.}}
\]

A stronger oral explanation is:

> “Current is inversely proportional to resistance when voltage is fixed. So if the resistance is doubled, the denominator in \(I=V/R\) doubles and the current becomes one-half of its previous value.”

This gives the examiner both the result and the reason.

---

## Question 52 — Physical Meaning of Voltage, Current and Resistance  
An examiner says:

**“Do not give me a formula. Explain physically what voltage, resistance and current are doing in a simple circuit.”**

Give a suitable answer. **(5 marks)**

### Answer

Voltage provides the **potential difference that drives charge through the circuit**.

The circuit and load offer opposition to that movement. In a simple DC resistive circuit this opposition is described as **resistance**. In AC systems the broader term **impedance** is often required because opposition can include both resistance and reactance.

The resulting flow of charge is the **current**.

Therefore:

- greater driving voltage tends to increase current;
- greater opposition tends to reduce current.

For a simple ohmic resistance, the relationship is:

\[
I=\frac{V}{R}
\]

The important physical idea is that the current is not an independent quantity: it results from the applied voltage and the opposition presented by the circuit.

---

## Question 53 — Why Units Matter  
A student calculates the current of a 5 kW load using:

\[
I=\frac{5}{230}
\]

and obtains approximately 0.0217 A.

Identify the mistake and calculate the correct current for a unity-power-factor single-phase load. **(4 marks)**

### Answer

The mistake is failing to convert **kilowatts to watts**.

\[
5kW=5000W
\]

Therefore:

\[
I=\frac{5000}{230}
\]

\[
I\approx21.739A
\]

Hence:

\[
\boxed{I\approx21.7A}
\]

The incorrect answer is smaller by a factor of 1000 because the `kilo` prefix was ignored.

---

## Question 54 — Calculation Discipline  
State five steps that should be followed when answering an electrical calculation question. **(5 marks)**

### Answer

A strong calculation method is:

1. **Identify the quantity the question is asking you to find.**
2. **Write down the known quantities with their units.**
3. **Choose the correct formula or relationship.**
4. **Convert units where necessary before substitution.**
5. **Substitute the numerical values carefully.**
6. **Calculate the result.**
7. **State the final answer with the correct unit.**
8. **Check whether the result is physically reasonable.**

Any five correctly stated steps would satisfy a five-mark version of the question.

For more complex calculations, showing intermediate steps is valuable because it allows both the student and examiner to identify where an error occurred.

---

## Question 55 — Final Step 1 Challenge  
A 230 V supply feeds two resistive loads connected in parallel.

Load A has a resistance of 46 Ω.

Load B has a resistance of 23 Ω.

Both operate for 3 hours.

Calculate:

**(a)** current through Load A;  
**(b)** current through Load B;  
**(c)** total supply current;  
**(d)** equivalent resistance of the two loads;  
**(e)** total power;  
**(f)** total electrical energy consumed in 3 hours. **(12 marks)**

### Answer

Both parallel branches receive:

\[
230V
\]

### (a) Current Through Load A

\[
I_A=\frac{230}{46}
\]

\[
\boxed{I_A=5A}
\]

### (b) Current Through Load B

\[
I_B=\frac{230}{23}
\]

\[
\boxed{I_B=10A}
\]

### (c) Total Supply Current

\[
I_T=I_A+I_B
\]

\[
I_T=5+10
\]

\[
\boxed{I_T=15A}
\]

### (d) Equivalent Resistance

Using the supply voltage and total current:

\[
R_T=\frac{V}{I_T}
\]

\[
R_T=\frac{230}{15}
\]

\[
\boxed{R_T\approx15.33\Omega}
\]

Check using the parallel-resistance formula:

\[
\frac1{R_T}
=
\frac1{46}
+
\frac1{23}
\]

Since:

\[
\frac1{23}=\frac2{46}
\]

then:

\[
\frac1{R_T}
=
\frac3{46}
\]

Therefore:

\[
R_T=\frac{46}{3}
\]

\[
\boxed{R_T\approx15.33\Omega}
\]

Both methods agree.

### (e) Total Power

\[
P_T=VI_T
\]

\[
P_T=230\times15
\]

\[
P_T=3450W
\]

\[
\boxed{P_T=3.45kW}
\]

### (f) Energy Consumed

\[
E=Pt
\]

\[
E=3.45\times3
\]

\[
\boxed{E=10.35kWh}
\]

This integrated problem tests:

- Ohm’s law;
- parallel circuits;
- branch current;
- total current;
- equivalent resistance;
- electrical power;
- electrical energy;
- unit conversion;
- and consistency checking.

### Final independent checks

Check total power by adding branch powers.

Load A:

\[
P_A=VI_A=230\times5=1150W
\]

Load B:

\[
P_B=VI_B=230\times10=2300W
\]

\[
P_T=1150+2300=3450W
\]

This matches:

\[
P_T=VI_T=230\times15=3450W
\]

Then:

\[
E=3.45kW\times3h=10.35kWh
\]

A multi-stage answer that checks itself is much stronger than a sequence of calculator outputs.

---

# Step 1 Summary

By the end of Step 1, the student should be able to:

- define voltage, current and resistance;
- state and use Ohm’s law;
- explain direct and inverse relationships;
- distinguish AC from DC;
- define frequency;
- analyse series circuits;
- analyse parallel circuits;
- calculate total resistance;
- calculate branch current and total current;
- calculate voltage drops in simple resistor circuits;
- define and calculate electrical power;
- derive \(P=I^2R\) and \(P=V^2/R\);
- calculate electrical energy in kWh;
- convert common electrical units correctly;
- distinguish real, reactive and apparent power;
- calculate apparent power from the power triangle;
- calculate basic power factor;
- explain how poor power factor increases current;
- transpose basic electrical equations;
- identify impossible or unreasonable calculation results;
- distinguish an open circuit from a short circuit;
- explain why conductor length and cross-sectional area affect resistance;
- and combine several electrical principles in one multi-stage problem.

---

# Official Definition Map Used in Strengthened Step 1

The following formal terminology is taken from the uploaded BS 7671 Seventeenth Edition Part 2 where relevant:

| Term | Official-book use in this Step |
|---|---|
| Voltage, nominal | Used to distinguish a system designation from the fundamental physics definition of potential difference |
| Low voltage | Used in Question 12A with an edition caution |
| Current-using equipment | Used to connect electrical power with energy conversion in loads |
| Fault | Used to strengthen the open-circuit/short-circuit discussion |

The following fundamental quantities are **not presented as BS 7671 Part 2 definitions**, because the uploaded definition list does not supply them as standalone textbook definitions:

- electric current;
- potential difference as a general physics quantity;
- resistance;
- Ohm's law;
- AC and DC waveform basics;
- frequency as cycles per second;
- electrical power as joules per second;
- electrical energy;
- real/reactive/apparent power classroom definitions;
- basic power factor equation.

Those are taught as foundational electrical theory and are then connected to the installation terminology used by BS 7671.

---

# BS 7671 Reference Note for Step 1

There is deliberately **no memorisation of a BS 7671 table in this first step**.

Ohm’s law, power relationships, series and parallel resistor theory, energy calculations, basic power factor and formula transposition are fundamental electrical principles rather than numerical design values taken from a BS 7671 table.

In later steps, when a question depends on BS 7671 numerical design data, each answer should identify the source clearly.

The intended format will be:

> **BS 7671 reference:** [Regulation/Table/Appendix]  
> **What it contains:** [brief explanation]  
> **Relevant entry:** [row/column/value]  
> **Why it applies:** [reason]  
> **How it is used:** [show the value entering the calculation]

This method will be used for areas such as:

- voltage-drop limits and cable voltage-drop data;
- correction factors;
- cable current-carrying capacities;
- protective conductor design;
- maximum permitted earth-fault loop impedance;
- protective-device operation;
- disconnection requirements;
- and other BS 7671 design/verification values.

---

# Step 1 Distinction Checklist

Before moving to Step 2, you should be able to do the following **without looking at the answer**:

1. Explain current, voltage and resistance physically, not only quote \(V=IR\).
2. Rearrange Ohm's law without relying on a triangle.
3. Reverse-check an Ohm's-law answer.
4. Predict what will happen to current before calculating when voltage or resistance changes.
5. Explain why current is common in series but voltage is common across parallel branches.
6. Reject an impossible parallel-resistance answer by inspection.
7. Move confidently between W, kW, A, V, \(\Omega\), kWh, kVA and kvar.
8. Explain the difference between power and energy.
9. Derive \(P=I^2R\) and \(P=V^2/R\), rather than only memorize them.
10. Explain what poor power factor does to current.
11. Transpose formulas by keeping both sides of the equation balanced.
12. Distinguish an open circuit from a low-impedance fault and explain the safety consequence.
13. Complete a multi-stage calculation and verify the result by a second method.
14. Distinguish an **official book definition** from a **foundation-study definition**.

If these can be done confidently, Step 1 is serving its purpose: it is building the electrical reasoning needed for the cable, protection, earthing, testing and three-phase work that follows.

---

**End of Strengthened Step 1**
