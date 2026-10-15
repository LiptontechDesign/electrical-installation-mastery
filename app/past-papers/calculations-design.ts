import { question as q } from './types';
export const calculationsDesign = [
q('three-phase-energy', ['C1'], 'Calculations', 'Three-phase power and energy', 'For 415 V line voltage, 30 A balanced current and PF 0.8, calculate active power and 24-hour energy.', ['Identify the given voltage as line-to-line RMS.', 'Find active power before multiplying by operating time.'], ['Active power $P$|The real power converted by the load, measured in W or kW.', 'Apparent power $S$|The voltage/current capacity represented in VA or kVA.'], String.raw`For this balanced sinusoidal case,

$$
S=\sqrt3V_LI_L=\sqrt3\times415\times30=21.564\text{ kVA}.
$$

$$
P=S \mathrm{PF}=21.564\times0.8=17.251\text{ kW}.
$$

At the stated constant load for 24 h,

$$
E=Pt=17.251\times24=414.029\text{ kWh}.
$$

Approximately **414 kWh** is sensible. This is electrical input energy, not necessarily useful shaft-output energy. The 0.8 factor belongs in active power, and the square-root-of-three factor is needed because the givens are three-phase line quantities. If load or PF changes, calculate each interval rather than assuming the peak load runs all day.`, ['The final energy unit is kWh.', 'Apparent and active power are not interchanged.']),
q('motor-current', ['C1'], 'Calculations', 'Motor shaft power, efficiency and current', 'Calculate current for a 7.46 kW shaft-output motor at 400 V three phase, efficiency 0.85 and PF 0.8.', ['Convert shaft output to electrical active input using efficiency.', 'Apply power factor separately when calculating apparent input/current.'], ['Efficiency η|Useful output power divided by input power.', 'Power factor|Electrical active input divided by apparent input under the stated conditions.'], String.raw`The rating is taken as useful shaft output:

$$
P_{\rm in}=\frac{P_{\rm shaft}}{\eta}=\frac{7.46}{0.85}=8.7765\text{ kW}.
$$

$$
S=\frac{P_{\rm in}}{\mathrm{PF}}=\frac{8.7765}{0.8}=10.9706\text{ kVA}.
$$

$$
I_L=\frac{S\times1000}{\sqrt3V_L}=\frac{10970.6}{\sqrt3\times400}=15.835\text{ A}.
$$

Check by reversing the calculation: $\sqrt3\times400\times15.835\times0.8\times0.85$ is approximately 7460 W shaft output. Omitting efficiency understates the input current. If a question explicitly gives electrical input kW, do not divide that value by efficiency a second time. Use the actual nameplate and operating duty when selecting protection.`, ['PF and efficiency appear as separate factors.', 'The input/output interpretation is stated before substitution.']),
q('single-phase-capacitors', ['C1'], 'Calculations', 'Single-phase compensation: four worked cases', "At **50 Hz**, calculate capacitor reactive power and capacitance for each single-phase case:\n\n| Case | Supply and load | PF change |\n|---|---|---|\n| A | 240 V, 40 A | 0.75 → unity |\n| B | 220 V, 1000 W electrical input | 0.7 → 0.9 |\n| C | 400 V, 10 kW shaft output, efficiency 0.84 | 0.7 → 0.9 |\n| D | 200 V, 1000 W electrical input | 0.7 → unity |\n\nFor case C, also find input VA, current and its active/reactive components.", ['Find electrical input power first; distinguish shaft output from consumed watts.', 'Calculate the reactive-power reduction, then use the actual capacitor voltage and frequency.'], ['Reactive power $Q$|The sinusoidal reactive component, measured in var or kVAr.', 'Compensation $Q_c$|The amount of capacitive reactive power required.', 'Capacitance $C$|The capacitor quantity measured in farads.'], String.raw`Use $\phi_i=\cos^{-1}(\mathrm{PF}_i)$ and

$$
Q_c=P(\tan\phi_1-\tan\phi_2),\qquad C=\frac{Q_c}{2\pi fV^2}.
$$

Here $P$ is input W and $Q_c$ is var, so $C$ is F. Multiply F by $10^6$ for μF.

**Worked example: 200 V, 1000 W input, PF 0.7 corrected to unity.**

$$
\begin{aligned}
\phi_1&=\cos^{-1}(0.7)=45.573^\circ, \\
\phi_2&=0^\circ, \\
Q_c&=1000(\tan45.573^\circ-\tan0^\circ)\\
&=1020.204\text{ var},\\
C&=\frac{1020.204}{2\pi\times50\times200^2}\\
&=81.1853\times10^{-6}\text{ F}\\
&=\boxed{81.19\,\mu\text{F}.}
\end{aligned}
$$

Keep full precision during calculation; round the final result. The same method gives the following results, all at 50 Hz:

| Case | Electrical input | PF change | $Q_c$ | $C$ |
|---|---:|---|---:|---:|
| 240 V, 40 A | $240\times40\times0.75=7200$ W | 0.75 to 1 | 6349.80 var | 350.90 μF |
| 220 V, consumed 1000 W | 1000 W | 0.7 to 0.9 | 535.88 var | 35.24 μF |
| 400 V, 10 kW shaft, η 0.84 | $10000/0.84=11904.76$ W | 0.7 to 0.9 | 6379.55 var | 126.92 μF |
| 200 V, consumed 1000 W | 1000 W | 0.7 to 1 | 1020.20 var | 81.19 μF |

For the 400 V single-phase case, $S=11904.76/0.7=17006.80$ VA and $I=42.517$ A. Its active current component is $P/V=29.762$ A; its reactive component is $Q_1/V=30.363$ A. Use a current triangle, not a three-phase current formula.

Practical capacitor ratings, steps and discharge/protection need a separate design check.`, ['W/var and F/μF conversions are shown.', 'The actual capacitor voltage is squared.'], ['pfc'], 'power-triangle'),
q('three-phase-compensation', ['C1'], 'Calculations', 'Three-phase kVAr correction and current', 'For 100 kW electrical input at 415 V and PF 0.8, calculate compensation to PF 0.97.', ['Treat kW as electrical input in this worked case.', 'Keep active power constant while reducing net reactive power.'], ['Power triangle|The sinusoidal relationship $S^2=P^2+Q^2$.', 'Upstream current|The current supplying the combined motor and capacitor bank.'], String.raw`Initially $S_1=P/\mathrm{PF}_1=100/0.8=125$ kVA and $Q_1=P\tan(\cos^{-1}0.8)=75$ kVAr.

At PF 0.97, $Q_2=100\tan(\cos^{-1}0.97)=25.0624$ kVAr. Therefore

$$
Q_c=75-25.0624=49.9376\text{ kVAr}.
$$

The initial line current is $100000/(\sqrt3\times415\times0.8)=173.901$ A. The new combined upstream current is $100000/(\sqrt3\times415\times0.97)=143.423$ A. Motor branch current is not automatically this corrected upstream current.

A nominal 50 kVAr staged bank is a possible starting point for engineering selection; assess actual voltage, harmonics, load variation and step control. Select motor-branch protection from the motor’s own current and starting duty.`, ['Compensation is the difference in Q, not a difference in kW.', 'Motor current and corrected upstream current are distinguished.'], ['pfc'], 'power-triangle'),
q('ahu-compensation', ['C1'], 'Calculations', 'Air-handling load: calculate the correction', 'At 415 V three phase, 120 A and PF 0.7, determine P, Q and compensation to PF 0.95.', ['Calculate the initial power triangle from measured line quantities.', 'Recalculate target Q from the same active power.'], ['Target PF|The specified post-correction ratio of active to apparent power.', 'Lagging|Current displacement associated with net inductive reactive demand in this case.'], String.raw`The apparent power is $S_1=\sqrt3\times415\times120/1000=86.2561$ kVA.

$$
P=S_1\times0.7=60.3793\text{ kW}.
$$

$$
Q_1=S_1\sqrt{1-0.7^2}=61.5992\text{ kVAr}.
$$

At the target, $Q_2=P\tan(\cos^{-1}0.95)=19.8457$ kVAr. Hence

$$
Q_c=61.5992-19.8457=41.7535\text{ kVAr}.
$$

Check the target using $P/\sqrt{P^2+Q_2^2}=0.95$. Keep trigonometric calculations at full precision until the final rounding.`, ['P remains constant during this ideal compensation calculation.', 'The corrected result is checked by reconstructing PF.'], ['pfc']),
q('transformer-demand', ['C1'], 'Calculations', 'Measured transformer load and capacitor-bank savings', "A **630 kVA transformer** supplies a balanced **415 V** load at **PF 0.82**.\n\n1. For line currents of **800 A** and **850 A**, calculate measured S, P and Q.\n2. Find the new S and PF after adding **100 kVAr**.\n3. Using the given rates of **KES 200 per 0.01 PF below 0.9** and **KES 250/kVA**, find the initial PF surcharge and the demand-charge saving for the 850 A case.", ['Use measured current rather than substituting the transformer’s 630 kVA nameplate.', 'Separate a question’s hypothetical tariff from actual current utility charges.'], ['Measured demand|The demand represented by the actual metered quantities.', 'Nameplate rating|The equipment’s specified capacity, not proof that it is fully loaded.'], String.raw`For a balanced 415 V supply at PF 0.82, $S=\sqrt3V_LI_L/1000$, $P=0.82S$ and $Q_1=S\sqrt{1-0.82^2}$. With a 100 kVAr bank, $Q_2=Q_1-100$, $S_2=\sqrt{P^2+Q_2^2}$ and $\mathrm{PF}_2=P/S_2$.

| Line current | S₁ kVA | P kW | Q₁ kVAr | Q₂ kVAr | S₂ kVA | New PF |
|---:|---:|---:|---:|---:|---:|---:|
| 800 A | 575.041 | 471.534 | 329.132 | 229.132 | 524.257 | 0.89943 |
| 850 A | 610.981 | 501.004 | 349.703 | 249.703 | 559.783 | 0.89500 |

In star on the LV side, phase current equals line current. The 630 kVA capacity does not replace either measured S value.

For the question’s linear surcharge of KES 200 per 0.01 below PF 0.9, the initial PF 0.82 gives $(0.9-0.82)/0.01\times200=$ **KES 1600**. If demand costs KES 250/kVA, the 850 A case saves $(610.981-559.783)\times250=$ **KES 12,799.47** for the stated demand basis. Real billing may have different intervals, rounding, thresholds and charges; these are exam data, not a current tariff quotation.`, ['Nameplate capacity is not mistaken for measured demand.', 'The source side after correction is used for savings.'], ['pfc']),
q('ct-power', ['C1'], 'Calculations', 'Current-transformer ratio and measured power', 'Use a 200/5 A CT reading of 7.3 A to calculate primary current and power at 415 V with 15° lag.', ['Apply the ratio in the correct direction.', 'Use the measured current, not the transformer’s installation rating.'], ['CT ratio|The rated primary-to-secondary current relationship.', 'Phase angle|The displacement between sinusoidal voltage and current.'], String.raw`The ratio is $200/5=40$, so $I_p=7.3\times40=292$ A. For the balanced 415 V case,

$$
S=\sqrt3\times415\times292/1000=209.890\text{ kVA}.
$$

$$
P=S\cos15^\circ=202.738\text{ kW},\qquad Q=S\sin15^\circ=54.324\text{ kVAr}.
$$

Check $P^2+Q^2=S^2$ within rounding. The 1000 kVA transformer nameplate is not the measured load.

A ratio calculation does not prove that 7.3 A is within a nominal 5 A CT secondary’s continuous duty: verify the CT’s actual ratings, accuracy, burden and permitted overload. A loaded CT secondary must not be opened; use a correctly designed test/shorting procedure.`, ['The CT scale factor is 40.', 'The power triangle and CT operating limits are distinguished.']),
q('generator-cable', ['C1'], 'Calculations', 'Generator current and cable derating', 'For a 100 kVA, 415 V three-phase generator circuit with correction factor 0.91, calculate full-load current and the minimum tabulated cable capacity based on load. Assess a proposed cable rated 154 A in the table, including whether its corrected capacity supports a 160 A protective setting.', ['Use kVA directly; no PF division is required for current from apparent power.', 'Divide by a reducing correction factor when finding the required table capacity.'], ['Correction factor|A multiplier adapting a tabulated capacity to actual conditions.', 'Protective rating $I_n$|The applicable device rating or setting used in coordination.'], String.raw`The full-load current is

$$
I_b=\frac{100000}{\sqrt3\times415}=139.121\text{ A}.
$$

For a load-capacity check with the sole stated factor 0.91, the table target is $I_t\ge139.121/0.91=152.880$ A. For ordinary overload coordination, however, the target must support the selected protective rating/setting: use the applicable $I_n$ basis and verify $I_b\le I_n\le I_z$.

For a proposed cable with a tabulated capacity of 154 A, the corrected value is $I_z=154\times0.91=140.14$ A: just enough for the stated load, but not enough for an unqualified 160 A protective setting.

Verify the actual table/reference method, conductor and terminal ratings, grouping, loaded cores, voltage drop and fault duty before selecting the cable.`, ['The derating factor is not multiplied into the required table target.', 'Both load current and the protective setting are checked against corrected capacity.']),
q('motor-speed', ['C1'], 'Calculations', 'Pole count, synchronous speed and slip', 'Calculate: (a) synchronous speed for six poles at 50 Hz and 60 Hz; (b) rotor speed for four poles at 50 Hz with 5% and ideal zero slip; (c) four poles at 60 Hz with 5% slip; (d) eight poles at 50 Hz with 5% slip; (e) slip for four poles at 50 Hz and 1420 rpm; (f) pole count for a motor running close to 1800 rpm at no load on 60 Hz.', ['Use the total number of poles, not pole pairs, in 120f/p.', 'Apply fractional slip to synchronous speed.'], ['Synchronous speed $n_s$|Speed of the rotating field in revolutions per minute.', 'Rotor speed $n_r$|Measured mechanical shaft speed.'], String.raw`Use $n_s=120f/p$, $n_r=n_s(1-s)$ and $s=(n_s-n_r)/n_s$.

| Stated case | Working | Result |
|---|---|---|
| Six poles, 50 Hz | $120\times50/6$ | 1000 rpm |
| Six poles, 60 Hz | $120\times60/6$ | 1200 rpm |
| Four poles, 50 Hz, 5% slip | $1500\times0.95$ | 1425 rpm |
| Four poles, 50 Hz, stipulated zero no-load slip | $1500\times1$ | 1500 rpm |
| Four poles, 60 Hz, 5% slip | $1800\times0.95$ | 1710 rpm |
| Eight poles, 50 Hz, 5% slip | $750\times0.95$ | 712.5 rpm |
| Four poles, 50 Hz, measured 1420 rpm | $(1500-1420)/1500$ | 5.333% slip |
| Almost 1800 rpm at no load on 60 Hz | $120\times60/1800$ | Four poles |

A real induction motor usually needs small no-load slip to supply its losses. In an eight-pole 60 Hz no-load question without a specified slip, 900 rpm is synchronous speed; the actual shaft speed is slightly lower and cannot be known exactly.`, ['Frequency and pole count are retained for each row.', 'Ideal zero slip is not presented as universal actual no-load behaviour.']),
q('single-phase-angle', ['C1'], 'Calculations', 'Active power and a 32° phase angle', 'For 2.55 kW active input and a 32° lag angle, calculate apparent and reactive power.', ['State whether the kW represents input or shaft output.', 'Use cosine for apparent power and tangent for reactive power.'], ['Apparent power|Active power divided by PF in this sinusoidal case.', 'Reactive power|Active power multiplied by the tangent of the displacement angle.'], String.raw`Taking 2.55 kW as **electrical active input**,

$$
\mathrm{PF}=\cos32^\circ=0.848048.
$$

$$
S=P/\cos32^\circ=3.00690\text{ kVA}.
$$

$$
Q=P\tan32^\circ=1.59342\text{ kVAr}.
$$

Check with $S^2=P^2+Q^2$. The units are kW, kVA and kVAr respectively, not three interchangeable labels for the same quantity.

If “motor rating” means 2.55 kW shaft output, the efficiency is also required: electrical input is $2.55/\eta$ kW and both calculated electrical quantities change. Identify input or output power before applying the formulas.`, ['The input-power assumption is explicit.', 'The power-triangle check closes within rounding.']),
q('office-demand', ['C1'], 'Calculations', 'Office connected-load assessment', "A balanced **415 V three-phase** supply feeds the following loads, evenly allocated across phases:\n\n- 240 fittings, each containing two 85 W lamps plus 7 W loss per lamp, PF 0.8.\n- Twelve fully loaded 32 A single-phase rings at unity PF.\n- 21 kW resistive floor warming.\n\nCalculate their full connected-load current. Then include:\n\n- Three motors, each delivering 20 kW shaft output at efficiency 0.9 and PF 0.75.\n- Six 12 kW resistive cookers.\n- Twelve 2 kW resistive heaters.\n\nCalculate the combined current. **Apply no diversity.**", ['Resolve whether each lamp rating applies per lamp or per fitting.', 'Determine ring-circuit demand and sum compatible active/reactive powers.'], ['Connected load|The aggregate installed load before any justified demand allowance.', 'Coincident demand|The load expected to occur simultaneously.'], String.raw`**Given connected loads, with no diversity applied:** 240 fittings, each containing two 85 W lamps plus 7 W loss per lamp; PF 0.8; twelve fully loaded 32 A single-phase rings at unity PF, evenly allocated across 415 V three phase; 21 kW floor warming. Then lighting $P=44.16$ kW, $Q=33.12$ kVAr; rings $P=12\times32\times415/\sqrt3/1000=92.0065$ kW. The three-load subset gives $I_L=223.453$ A after vector power addition.

**1. Convert each load to electrical active and reactive power.** For a sinusoidal load, $Q=P\tan(\cos^{-1}\mathrm{PF})$. A unity-PF resistive load has zero reactive power in this model. The motor ratings are shaft output, so divide by efficiency before calculating their reactive input.

| Load group | Active power P (kW) | Reactive power Q (kVAr) |
|---|---:|---:|
| Lighting | $240\times2\times(85+7)/1000=44.160$ | $44.16\tan(\cos^{-1}0.8)=33.120$ |
| Twelve rings | $12\times32\times(415/\sqrt3)/1000=92.0065$ | 0 |
| Floor warming | 21.000 | 0 |
| Three motors | $3\times20/0.9=66.6667$ | $66.6667\tan(\cos^{-1}0.75)=58.7945$ |
| Six cookers | $6\times12=72.000$ | 0 |
| Twelve heaters | $12\times2=24.000$ | 0 |

**2. Add P and Q separately.** Reactive and active components are at right angles in the power triangle; adding each group’s kVA arithmetically would not give the correct combined result for loads at different power factors.

$$
\begin{aligned}
P_{\rm total}&=319.8332\text{ kW}, \\
Q_{\rm total}&=91.9145\text{ kVAr}, \\
S_{\rm total}&=\sqrt{319.8332^2+91.9145^2} \\
&=332.7785\text{ kVA}.
\end{aligned}
$$

**3. Convert total kVA to balanced line current.**

$$
I_L=\frac{332.7785\times1000}{\sqrt3\times415}=\boxed{462.96\text{ A}}.
$$

The result is the full connected-load current under the stated balanced-load assumptions. For maximum-demand design, establish justified coincidence/diversity and check the most-loaded phase before choosing the main protective device. A socket count alone does not determine ring demand.`, ['Assumptions precede arithmetic.', 'The most-loaded phase, justified demand and device coordination govern the real design.']),
q('four-storey-design', ['C1'], 'Building design', 'Design, protect and verify a four-storey office', 'Explain a coherent four-storey electrical arrangement from intake to final circuits and handover.', ['Collect design inputs before selecting ratings.', 'Connect the single-line arrangement to protection, testing and documentation.'], ['Submain|A circuit distributing power to a downstream board.', 'Single-line diagram|A simplified representation of the distribution and protective arrangement.'], String.raw`Obtain the floor plans, supply characteristics, intended use/occupancy, equipment loads and starting duties, routes/environment and future requirements. Confirm the installation is within the intended licence scope.

Provide a suitable intake/main switchboard and separately protected feeders to appropriate floor boards. Allocate single-phase loads across phases; retain neutral and protective-conductor provisions required by the loads. Separate lighting, socket and dedicated equipment circuits. Identify life-safety services such as fire alarm and emergency lighting from ordinary convenience circuits and design their continuity/protection under the applicable specialist requirements.

Select cables and protective devices from demand, installation method, corrected capacity, voltage drop, fault duty, disconnection and selectivity requirements. Provide accessible isolation, earthing/bonding, appropriate enclosures, labels and circuit schedules.

Inspect, perform applicable dead tests, rectify failures, then complete necessary supply/live and functional checks through the safe procedure. Verify phase sequence and machine direction where relevant. Supply test/certification records, as-built schematics and operating/maintenance information. The diagram is an arrangement to explain; it does not establish feeder sizes or a complete approved design.`, ['Intake, feeders, floor boards and final circuits form a complete route.', 'Design, protection and verification are linked.'], ['epra', 'connection'], 'four-storey'),
q('cold-store-diagram', ['C1'], 'Building design', 'Cold-store building single-line diagram', "Draw distribution from a stated **120 A TPN incomer** to:\n\n| Floor | Required loads |\n|---|---|\n| Ground | 20 × 15 W and 2 × 50 W lights |\n| First | 12 kW three-phase cold store, lighting and ring final circuit |\n| Second | Lighting, ring final circuit, three separate 4 kW autoclaves, separate AC1 and AC2 circuits |\n\nShow required branches and protection functions. Cable sizes and remaining equipment ratings require the complete design data.", ['Provide a board for each of the three named levels.', 'Show the required circuits without inventing missing equipment ratings.'], ['TPN|Three poles and neutral, with the device’s actual switching/protection functions confirmed from its specification.', 'Dedicated circuit|A final circuit assigned to a particular load or function.'], String.raw`Provide distribution to ground, first and second floors. The ground-floor stated lighting is $20\times15+2\times50=400$ W. The first floor has a 12 kW three-phase cold store plus lighting and a ring circuit. The second floor has lighting, a ring circuit, three separate 4 kW autoclave circuits and separate circuits for AC1 and AC2.

Show the stipulated 120 A TPN main device, separate protected feeders and one board per named level. Label the three-phase cold-store branch, individual equipment circuits, neutral/PE arrangements and suitable isolation/protection functions. Use the actual nameplate and design information to assign phase connections and protective ratings.

The lighting/ring demands and air-conditioner ratings are not supplied. Nor are cable routes, fault levels or installation methods. Therefore the diagram identifies the required branches and device functions, with design-dependent feeder/final ratings left for calculation. The stipulated 120 A incomer is question data, not proof that the final load design is adequate.`, ['All named loads and three boards are represented.', 'The two air conditioners have separate circuits.'], [], 'cold-store'),
q('tariff-reasoning', ['C1'], 'Load assessment', 'Energy, demand and power-factor charges', 'Calculate the subtotal for 4000 kWh at KES 20/kWh, 100 kVA billed demand at KES 250/kVA and a stated PF surcharge of KES 1600. Exclude taxes and other adjustments.', ['Identify the units and billing interval for each component.', 'Apply the stated charge separately to each billing quantity.'], ['Energy charge|A charge associated with metered energy such as kWh.', 'Demand charge|A charge based on the specified measured demand, such as kVA.', 'PF surcharge|A charge calculated according to the applicable power-factor tariff condition.'], String.raw`Read the demand register and its unit, active energy, charge rates, PF basis, surcharge and other applicable adjustments separately. If simultaneous maximum-demand kW and kVA are supplied on the required basis, their ratio gives that demand PF; do not divide unrelated maxima occurring at different times without the tariff’s stated method.

**Energy charge:** 4000 × 20 = KES 80,000.

**Demand charge:** 100 × 250 = KES 25,000.

**Subtotal:** 80,000 + 25,000 + 1600 = **KES 106,600**.

These are the rates given in this calculation. Taxes and other adjustments are excluded as instructed. Improving PF can reduce kVA demand for the same active power; it does not automatically remove the active-energy charge.`, ['Every number has a unit, interval and stated basis.', 'The subtotal contains only the requested charge components.']),
];
