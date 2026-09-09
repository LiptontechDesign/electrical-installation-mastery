export type RecapNote = readonly [label: string, explanation: string];
export type RecapCopy = {
  lead: string;
  notes: readonly RecapNote[];
  visual: { kind: 'equation' | 'compare' | 'flow'; lines: readonly string[]; caption: string };
  caution?: string;
};
export const page = (lead: string, notes: readonly RecapNote[], kind: RecapCopy['visual']['kind'], lines: readonly string[], caption: string, caution?: string): RecapCopy => ({lead, notes, visual:{kind,lines,caption},caution});

// Individually written thematic synthesis of the supplied video transcripts.
// Keys are stable chapter-boundary lesson IDs, not numbered display positions.
export const foundationRecaps: Record<string, RecapCopy> = {
  'p01-l04': page('Current describes charge moving, not charge being used up. Start by separating the particles in matter from the quantities we measure in a circuit.', [
    ['Charge carriers','Protons are positive, electrons negative and neutrons uncharged. The copper model explains why an outer electron can move between atoms.'],
    ['Charge versus current','A coulomb measures charge; an ampere measures the rate at which charge passes a point.'],
    ['Units first','Keep the time unit consistent. Convert milliamps to amps before using seconds in a charge calculation.'],
  ], 'equation',['I = Q ÷ t','Q = I × t','1 A = 1 C/s'],'I: current in amperes; Q: charge in coulombs; t: time in seconds.'),
  'p01-l07': page('A working circuit needs a source, a complete conducting path and a load. Voltage, current and resistance describe different parts of the same behaviour.', [
    ['Closed path','An open switch interrupts the path; a closed switch allows current through the load. Protection has a separate role from ordinary switching.'],
    ['Change one quantity','At constant resistance, raising voltage raises current. At constant voltage, raising resistance reduces current.'],
    ['Check the result','The demonstration uses a known resistor and compares measured current with the value calculated from voltage and resistance.'],
  ], 'equation',['V = I × R','I = V ÷ R','R = V ÷ I'],'V in volts, I in amperes, R in ohms. These proportional relationships assume resistance remains constant.'),
  'p06-l06': page('Resistance belongs to a particular conductor. It changes with the conductor’s length, cross-sectional area, material and temperature.', [
    ['Length','Doubling length doubles resistance when material, area and temperature stay the same.'],
    ['Cross-sectional area','Doubling area halves resistance. Area is not the same as diameter.'],
    ['Temperature','The heated copper demonstration shows rising resistance. Do not generalise its temperature behaviour to every material.'],
  ], 'equation',['R = ρ × L ÷ A','Longer → more resistance','Larger area → less resistance'],'ρ is resistivity. Use a compatible set of units: Ω·m with m², or Ω·mm²/m with mm².','The video’s temperature trend is a material-dependent approximation, not a universal direct proportion.'),
  'supp-resistance-06': page('The same resistance relationship can reveal an unknown length or help identify a material. A calculation is only as reliable as the measurements and units entered.', [
    ['Find length','Rearrange the formula before substituting measured resistance, known area and material resistivity.'],
    ['Find resistivity','The nichrome and constantan examples combine resistance, length and cross-sectional area to calculate a material property.'],
    ['Measurement limits','Small resistance values make lead resistance, dimensions and temperature important. Treat agreement with a material value as evidence, not perfect identification.'],
  ], 'equation',['L = R × A ÷ ρ','ρ = R × A ÷ L','Circular wire: A = πd² ÷ 4'],'Use diameter d and area A in compatible length units; do not insert diameter where the formula requires area.'),
  'p01-l11': page('Decide whether components share one current path or share a voltage before calculating. The connection arrangement determines which quantities add.', [
    ['Series','The same current passes through each resistor. Resistances add and the supply voltage is shared between them.'],
    ['Parallel','Each branch has the same voltage. Branch currents add to give the supply current.'],
    ['Plausibility','A parallel equivalent resistance is less than the smallest branch resistance. Two equal 18 Ω branches give 9 Ω, not 36 Ω.'],
  ], 'compare',['Series: Rtotal = R₁ + R₂ + …','Parallel: 1/Rtotal = 1/R₁ + 1/R₂ + …','Parallel current: Itotal = I₁ + I₂ + …'],'Analyse each branch using its own resistance and the common branch voltage.'),
  'p01-l16': page('Power is the rate of energy transfer. Energy also depends on how long the load operates. Heating, magnetism and chemical action explain many useful—and unwanted—electrical effects.', [
    ['Resistive power','Combine Ohm’s law with P = VI to calculate power when voltage or current is not directly known.'],
    ['Energy','Kilowatts describe a rate. Kilowatt-hours describe energy accumulated over time; they are not interchangeable units.'],
    ['Heating','I²R explains why increasing current can sharply increase heating in a resistive conductor or connection.'],
  ], 'equation',['P = VI = I²R = V²/R','Energy (kWh) = power (kW) × hours','3 kW for 1 hour = 3 kWh'],'These power forms apply to the DC/resistive examples; AC phase displacement is handled later.'),
  'p01-l21': page('Electric current produces a magnetic field. Changing magnetic flux can induce an EMF. Repeated rotation in a field connects those ideas to an alternating waveform.', [
    ['Magnetic effect','Coils concentrate the magnetic effect of current; motors, relays and contactors put it to work.'],
    ['Induction','Relative movement and the rate of change of flux matter. The demonstration changes movement to change the induced response.'],
    ['One complete cycle','A cycle runs through positive and negative halves back to the same phase position. Frequency counts cycles per second.'],
  ], 'equation',['f = 1 ÷ T','50 Hz → T = 0.02 s = 20 ms','0 → positive peak → 0 → negative peak → 0'],'Frequency f is in hertz; period T is in seconds. The last line describes one sine-wave cycle.'),
  'supp-ac-theory-08': page('AC opposition includes reactance as well as resistance. Inductors and capacitors respond in opposite ways to an increase in frequency.', [
    ['Inductors','Increasing frequency or inductance increases inductive reactance. A real coil also has winding resistance.'],
    ['Capacitors','Increasing frequency or capacitance reduces capacitive reactance. Capacitance is measured in farads, inductance in henrys.'],
    ['Capacitor combinations','Parallel capacitances add. Series capacitances combine by reciprocals, giving less capacitance than the smallest individual capacitor.'],
  ], 'equation',['Xᴸ = 2πfL','Xᶜ = 1 ÷ (2πfC)','Reactance is measured in ohms'],'Convert mH to H and μF to F before substituting. The formula for parallel resistors is not the formula for parallel capacitors.'),
  'supp-ac-theory-11': page('Wave diagrams show change with time; phasors show relative magnitude and phase angle. Use one shared reference rather than comparing arrows drawn independently.', [
    ['Resistance','For an ideal resistor, current and voltage are in phase.'],
    ['Inductance','For an ideal inductor, current lags voltage by a quarter-cycle.'],
    ['Capacitance','For an ideal capacitor, current leads voltage by a quarter-cycle. Real combined loads generally have intermediate phase angles.'],
  ], 'compare',['R: current in phase with voltage','L: current 90° behind voltage','C: current 90° ahead of voltage'],'CIVIL is the video’s memory aid: C–I–V and V–I–L. The 90° relationships describe ideal pure components.'),
  'p01-l24': page('The lamp and choke voltages do not add arithmetically because their phases differ. Draw the relationship first; then use the corresponding triangle.', [
    ['Shared current','In the series resistor–inductor model, the current is common. Resistive voltage is in phase with it; inductive voltage is perpendicular.'],
    ['Scaled phasors','A stated scale and a common origin make a graphical result interpretable. A calculation avoids drawing and measurement error.'],
    ['Impedance','Impedance Z combines resistance and net reactance. It is the total opposition used to calculate AC current.'],
  ], 'equation',['Series R–L: V = √(Vᴿ² + Vᴸ²)','Series R–L: Z = √(R² + Xᴸ²)','I = V ÷ Z'],'These right-angle forms apply to the ideal series R–L model, not arbitrary voltages or arbitrary phase angles.'),
  'supp-ac-theory-23': page('Real, reactive and apparent power answer different questions. The lamp example also shows why branch currents with different phases must be combined as phasors.', [
    ['Real power P','Watts describe average energy transfer to useful work and losses.'],
    ['Reactive power Q','An ideal inductor or capacitor stores energy and returns it each cycle, with zero average real power. Real components still have losses.'],
    ['Apparent power S','Volt-amperes describe RMS voltage multiplied by RMS current. Power factor relates real to apparent power.'],
  ], 'equation',['S² = P² + Q²','Power factor = P ÷ S','P: W   Q: var   S: VA'],'This power triangle is the sinusoidal model taught in the videos. Lower supply current alone does not prove an equal reduction in real power.'),
  'supp-ac-theory-24': page('The coil experiments separate winding resistance from AC impedance. Keep those quantities distinct throughout the voltage, current and phase calculations.', [
    ['Separate R and Z','The DC example estimates resistance; the AC voltage/current ratio gives impedance at that frequency.'],
    ['Work backwards','Once R and Z are known, obtain inductive reactance and then inductance. Consistent units keep each step connected.'],
    ['Correction topology','Identify where the capacitor is connected. Series reactance cancellation and a parallel power-factor correction branch are different circuit arrangements.'],
  ], 'equation',['Xᴸ = √(Z² − R²)','L = Xᴸ ÷ (2πf)','cos φ = R ÷ Z'],'Use this chain for the series R–L coil model. It is not a capacitor-sizing rule for every motor installation.','These are classroom models, not instructions to connect an unselected correction capacitor to equipment.'),
  'p06-l14': page('A power triangle is both a calculation tool and a reasonableness check. Real and reactive powers are perpendicular components; apparent power is the resultant.', [
    ['Find the resultant','Square real and reactive powers, add them, then take the square root. Do not add kW and kvar directly.'],
    ['Find the ratio','Power factor is real power divided by apparent power and has no unit.'],
    ['Draw consistently','Use the same numerical scale for the triangle’s power axes, label W/var/VA or their kilo-units, and identify the phase angle.'],
  ], 'equation',['P = 5 kW; Q = 3 kvar','S = √(5² + 3²) ≈ 5.83 kVA','Power factor ≈ 5/5.83 ≈ 0.857'],'The viewer’s motor example shows the calculation; it does not specify an actual installation design.'),
  'p01-l31': page('Understand what an instrument measures before connecting it. This section explains transformer and measurement principles; the full consumer-unit safe-isolation lesson follows in Module 3.', [
    ['Transformers','Changing flux links windings; turns ratio relates their voltages. Core and winding losses explain why real behaviour differs from an ideal model.'],
    ['Measurement arrangement','Voltage is measured across points; an ammeter measures current in its intended path; resistance measurement needs an unenergised, appropriately isolated component.'],
    ['Clamp meter','Opposing line and neutral magnetic fields cancel when both pass through the clamp. A zero reading in that arrangement does not mean no load current.'],
  ], 'compare',['Voltage → across two points','Current → through the measuring path','Resistance → isolated, unenergised component'],'Revisit the full safe-isolation demonstration before practical training. A switch position or dark lamp is not proof of absence of voltage.','Revision only: use competent supervision, suitable instruments and the full approved safe-isolation procedure; do not work from this condensed page alone.'),
  'p02-l05': page('Read the supply, cable and earthing arrangement as one system. Similar-looking conductors and enclosures can have different functions.', [
    ['Cable construction','Identify conductor, insulation, sheath and armour. Do not assume a protective conductor has the same area as the line conductor.'],
    ['Consumer unit','Distinguish the main switch, outgoing circuit protection, neutral terminals and protective-conductor terminals.'],
    ['Earthing and bonding','Earthing connects exposed conductive parts to a fault-return path. Protective bonding connects relevant extraneous conductive parts to reduce potential differences.'],
  ], 'compare',['TN-S → separate supply neutral and protective path','TN-C-S → combined upstream, separated in the installation','TT → installation earth electrode'],'Identify the actual arrangement; the UK supply figures in a video are not a substitute for site information.'),
  'p02-l08': page('Protective devices are defined by the fault they detect and the current they can safely interrupt—not just by the number printed on the front.', [
    ['Overcurrent','Fuses and circuit breakers protect against overcurrent; operating time depends on the device and the magnitude of the current.'],
    ['Residual current','An RCCB detects imbalance between currents through its sensing system. It does not provide overload protection by itself.'],
    ['Combined function','An RCBO combines residual-current and overcurrent protection. Check breaking capacity separately from normal current rating.'],
  ], 'compare',['MCB → overcurrent protection','RCCB → residual-current protection','RCBO → both functions'],'RCD is a family name. Do not confuse an RCCB with an RCBO or assume any device covers every electrical hazard.'),
  'p02-l11': page('Use the drawing that answers the question. Distribution diagrams show how power is organised; connection details and schedules explain the next level down.', [
    ['Single-line diagram','Follow the source, main distribution and outgoing feeders. One drawn line can represent a multi-conductor circuit.'],
    ['Other views','Risers add location between levels; block diagrams show functional relationships; panel schedules identify outgoing circuits and loads.'],
    ['Physical interfaces','Switch-fuse arrangements and industrial sockets need their actual ratings, conductor functions and terminal markings checked.'],
  ], 'flow',['Source and main distribution','Feeder or riser','Panel schedule and circuit','Equipment connection'],'Move between views rather than expecting a single-line diagram to show every terminal.'),
  'p16-l02': page('Good termination starts before the screw is tightened. Preparation must preserve the conductor and suit the terminal that will grip it.', [
    ['Safe isolation first','The consumer-unit isolation demonstration comes before conductor preparation. Identify the equipment and follow the full approved procedure under appropriate training and supervision; a switch position is not proof of absence of voltage.'],
    ['Choose the tool','Match stripping and cutting tools to the cable. Remove sheath and insulation without nicking copper or losing fine strands.'],
    ['Flexible conductors','Fine-stranded conductors need controlled preparation so every strand enters the intended connection.'],
    ['Ferrules','Ferrule size, length, profile and crimp tool must suit the conductor and terminal. They are not a universal upgrade for every connector.'],
  ], 'flow',['Identify conductor and terminal','Prepare without damage','Use the specified termination system','Inspect the finished connection'],'The supplied tool and ferrule demonstrations emphasise compatibility rather than a single method for all cables.'),
  'p03-l04': page('Socket terminals are not arranged identically across manufacturers. Identify their functions from markings, not from remembered left-to-right positions.', [
    ['Line and neutral','Read L and N markings on the actual accessory. Keep the circuit’s conductors associated correctly.'],
    ['Protective connection','Identify the earth-marked terminal or terminals and maintain protective-conductor continuity.'],
    ['Mechanical quality','Avoid trapped insulation, exposed copper outside the terminal and strain when the accessory is returned to its box.'],
  ], 'compare',['L → line conductor','N → neutral conductor','Earth symbol → protective conductor'],'Two earth terminals and one earth terminal are different layouts; inspect the manufacturer’s arrangement.','Connections must be made only after safe isolation and verified before the circuit is returned to service.'),
  'p03-l09': page('A lighting diagram becomes easier to read when permanent line, switched line and neutral remain separate ideas throughout the drawing.', [
    ['Three-plate method','The ceiling point contains permanent-line loop connections as well as lamp neutral and switched-line connections.'],
    ['Switching','A one-way switch makes or breaks its intended line path. Two-way switches use common and alternative contacts; intermediate switches connect between the end switches.'],
    ['Identification','A conductor’s function is not guaranteed by its original insulation colour. The demonstrations identify a repurposed conductor as switched line.'],
  ], 'flow',['Permanent line','Switch arrangement','Switched line','Lamp → neutral return'],'This is a functional path, not a terminal-by-terminal wiring diagram. Keep protective conductors continuous alongside it.'),
  'p03-l12': page('Final-circuit work combines a valid circuit arrangement with reliable terminations and verification. A neat-looking board does not establish electrical correctness.', [
    ['Circuit arrangement','A spur, a ring and a lighting loop are different arrangements. Assess the existing circuit before applying a demonstration to an addition.'],
    ['Torque','Use the specified terminal torque and appropriate tool. Tightness by feel is not a substitute for the stated value.'],
    ['Circuit identity','When using singles, match the outgoing line, neutral and protective conductor to the same circuit and records.'],
  ], 'flow',['Confirm circuit arrangement','Terminate to equipment requirements','Inspect and test','Record the completed work'],'The on-site spur example includes testing and certification; fitting an accessory is not the end of the task.'),
  'p04-l06': page('Conduit provides a protected route, but its material changes how it is joined, supported and allowed to move.', [
    ['PVC','Temperature changes can produce expansion and contraction. The fittings and joints need to suit that movement.'],
    ['Steel','Cutting and threading are followed by attention to burrs and sound mechanical connections. Sharp edges threaten cable insulation.'],
    ['Bend references','Measure from an explicit reference point to the specified part of the bend; do not confuse the bend’s back with its centre.'],
  ], 'compare',['PVC → movement and compatible fittings','Steel → threads, edges and continuity','Bends → reference point and final dimension'],'The PVC 90° bending lesson is visual-only in the archive. Watch it for the demonstration; no invented transcript steps are included.'),
  'p04-l10': page('Containment selection has two separate questions: will the cables fit and can they dissipate heat in that installation?', [
    ['Fabrication','Tray and trunking bends need appropriate geometry and finished edges. Prefabricated fittings and workshop-made bends are different options.'],
    ['Capacity factors','The conduit and trunking examples compare cable factors with the permitted containment factor. Apply the method for the actual route and cable construction.'],
    ['Whole cables','A fractional permissible cable count is rounded down, not up. Space compliance does not prove current-carrying capacity.'],
    ['Conduit loop-in circuits','Trace the individual line, neutral, switched-line and protective paths through the containment; changing the wiring system does not remove the need for a complete circuit.'],
  ], 'compare',['Space check → cable factors versus containment capacity','Heat check → installation and grouping conditions','Mechanical check → edges, bends and support'],'Do not use an example’s cable count as a universal limit for another containment system.'),
  'p04-l14': page('Armoured cable termination must address mechanical support, sealing and the intended protective connection together.', [
    ['Cable layers','Distinguish insulation, bedding, armour and outer sheath. Bedding is not the conductor’s primary insulation.'],
    ['Glands and lugs','Choose gland type for its environment. Cable, lug, die and crimp method form a matched system rather than interchangeable pieces.'],
    ['Support and protection','Maintain the required armour connection and support the installed route without damaging the cable at bends or entries.'],
  ], 'flow',['Cable construction and environment','Compatible gland / lug system','Mechanical and protective connections','Inspection of route and termination'],'The demonstrations’ dimensions and clipping distances are examples; use the requirements for the selected cable system.'),
  'p04-l18': page('Special cable systems need their own preparation and inspection methods. An outwardly tidy termination can conceal a problem with insulation or sealing.', [
    ['SY flex','Its braid and flexible conductors call for a compatible gland and termination method; do not assume it is interchangeable with SWA.'],
    ['MICC','The metal sheath and mineral insulation are integral to the system. The termination must seal the prepared end and retain insulation performance.'],
    ['Inspect before concealment','Check the prepared end and insulation performance before later assembly hides the work.'],
  ], 'flow',['Recognise the cable system','Use its termination method','Check insulation and protective paths','Confirm the complete circuit'],'The MICC demonstration tests an end before moving on, rather than waiting until both terminations hide the work.'),
  'p05-l05': page('Identify the fault before choosing the protection. Overload, short circuit and earth fault are not three names for the same condition.', [
    ['Fault paths','An overload uses the intended path at excessive current. A short circuit or earth fault creates an unintended low-impedance path.'],
    ['Device behaviour','Fuse and MCB operation depends on current and time. An MCB’s B/C characteristic is different from its ampere rating and breaking capacity.'],
    ['Protective conductors','The earthing arrangement and conductor withstand are part of the fault response, not optional additions to a breaker.'],
  ], 'compare',['Normal-current rating → carrying load','Time/current characteristic → when it trips','Breaking capacity → interrupting fault current safely'],'A breaker that will not reset is evidence to investigate—not a reason to fit a higher rating.'),
  'p05-l13': page('Automatic disconnection depends on a complete fault loop and a protective device that responds within the required conditions.', [
    ['Trace the loop','Include the line path to the fault, protective return path and source. The loop is not just the earth conductor.'],
    ['External and circuit parts','Ze describes the external portion; R₁ + R₂ describes the circuit line and protective-conductor contribution in the simplified model.'],
    ['Temperature','Conductor resistance rises with operating temperature. Design and measured values must be compared on an appropriate basis.'],
  ], 'equation',['Zs ≈ Ze + (R₁ + R₂)','Fault current ≈ U₀ ÷ Zs','Higher loop impedance → lower fault current'],'A lower fault current can lengthen overcurrent-device disconnection time. Use the applicable device data and design conditions, not a memorised video limit.'),
  'p05-spd': page('Coordinate protection with both the normal load and the fault conditions. Different protective functions complement each other; one does not erase all the others.', [
    ['Load coordination','Relate design current, protective-device rating and the installed cable’s current-carrying capacity.'],
    ['RCD role','An RCD can respond to a small residual current. Its presence does not remove the need for sound earthing, conductors and overcurrent protection.'],
    ['Surges','An SPD addresses transient overvoltage. A component test provides limited information and does not certify the whole protection scheme.'],
  ], 'compare',['Overcurrent → thermal and fault-current response','Residual current → imbalance response','Surge protection → transient-voltage response'],'Match each test or rating to the protective function it actually demonstrates.'),
  'p06-l13': page('Three equal sinusoidal phases are displaced by 120°. Define line and phase quantities before applying a star or delta relationship.', [
    ['Star','Each load branch sees phase voltage. Line voltage is √3 times phase voltage; line current equals phase current.'],
    ['Delta','Each load branch lies between lines. Line voltage equals phase voltage; line current is √3 times phase current.'],
    ['Neutral','Balanced sinusoidal phase currents sum to zero. An unbalanced example needs vector addition rather than ordinary subtraction.'],
  ], 'compare',['Star: Vline = √3 Vphase; Iline = Iphase','Delta: Vline = Vphase; Iline = √3 Iphase','Neutral: vector sum of phase currents'],'The zero-neutral conclusion belongs to the balanced sinusoidal model, not every real three-phase load.'),
  'p06-l03': page('Circuit design begins with supply information and an honest description of the loads—not immediately with a cable size.', [
    ['Supply characteristics','Establish voltage, phases, earthing and relevant fault information before selecting circuit equipment.'],
    ['Design current','Power divided by voltage gives current in the simple resistive example. Other loads may require power factor and efficiency to be considered.'],
    ['Demand and diversity','Connected load and simultaneous demand differ. The videos compare standard assumptions with actual household usage.'],
  ], 'equation',['Simple resistive load: I = P ÷ V','9000 W ÷ 230 V ≈ 39.13 A','Connected load ≠ necessarily simultaneous demand'],'Record which assumptions apply. A domestic example’s diversity allowance is not a general allowance for every project.'),
  'p06-l05': page('Cable capacity depends on the installed conditions. A nominal size alone does not tell you how much current a cable may carry.', [
    ['Installation method','Select the appropriate cable construction and reference installation method before reading a tabulated value.'],
    ['Correction factors','Ambient temperature, grouping and thermal insulation change heat dissipation and therefore the usable capacity.'],
    ['Route changes','A later change to grouping or insulation can invalidate the original selection. Check the limiting part of the route.'],
  ], 'flow',['Design current and device','Cable construction / installation method','Applicable correction factors','Capacity, voltage drop and fault checks'],'A successful current-capacity check is only one part of cable selection.'),
  'p06-l15': page('A cable can carry the load without overheating and still produce too much voltage drop. Protective devices also need adequate fault-interruption capability.', [
    ['Voltage along conductors','Current through conductor resistance creates a voltage difference. Include the relevant outward and return paths in the model.'],
    ['Resistance method','The resistivity example derives conductor resistance from material, length and area before calculating voltage drop.'],
    ['Fault rating','Compare the relevant prospective fault current with the protective equipment’s breaking capacity, not just its load-current rating.'],
  ], 'equation',['Simple resistive path: ΔV = I × Rpath','Rpath includes the complete modelled path','6 kA / 10 kA → fault-breaking ratings'],'Do not count a return path twice if the chosen tabulated method already includes it.'),
  'p04-l20': page('A motor starter separates the control circuit from the power path. Its operation makes more sense when the coil, main contacts and auxiliary contacts are followed separately.', [
    ['Induction motor','The rotating stator field induces rotor current. The rotor needs slip relative to the field to develop torque.'],
    ['Contactor','A small control circuit energises a coil that operates contacts switching the load circuit.'],
    ['DOL logic','The holding contact maintains the start command; the stop and overload paths can remove the coil supply.'],
  ], 'flow',['Start request','Contactor coil energises','Main contacts supply the motor','Stop / overload removes the command'],'Revisit three-phase safe isolation before any practical exercise. This flow is not a wiring or commissioning procedure.'),
  'p07-l07': page('Starting method, speed control and distribution monitoring solve different problems. Keep motor suitability and control behaviour visible in the design.', [
    ['Star–delta','Starting in star reduces winding voltage and starting torque relative to delta operation. The transition requires correctly coordinated contactors and interlocks.'],
    ['Variable-frequency drive','A drive converts and controls the supply to vary motor frequency and speed; it is more than an alternative start button.'],
    ['Distribution','Busbars organise outgoing phases. Instrumentation and current transformers add visibility but do not replace protection or verification.'],
  ], 'compare',['DOL → direct starting','Star–delta → reduced-voltage starting then transition','VFD → controlled frequency and speed'],'The motor nameplate, load torque and supply determine which method is appropriate.'),
  'p07-l16': page('A building’s distribution arrangement must keep feeder protection, conductor organisation and demand calculations connected.', [
    ['Submain','Follow the switch-fuse, cable, enclosure and protective connections as a complete feeder arrangement.'],
    ['Cable organisation','Bunched conductors affect heat dissipation. Neatness and cable ties do not remove grouping considerations.'],
    ['Load hierarchy','Calculate connected loads, state demand assumptions and carry them through boards and upstream equipment without silently applying diversity twice.'],
  ], 'flow',['Final-circuit loads','Distribution-board demand','Submain / main-board demand','Supply or transformer requirement'],'Keep phase allocation and the basis of every demand factor visible in the schedule.'),
  'p08-l05': page('Dead-test results have meaning only when you know which path the instrument is measuring. Start with instrument preparation and a correctly isolated circuit.', [
    ['Instrument setup','Check suitability and condition and account for test-lead resistance when measuring low resistance.'],
    ['Protective paths','Continuity and polarity tests establish particular conductor paths. Parallel paths can conceal a break in the intended conductor.'],
    ['Ring circuits','End-to-end and cross-connected readings answer different questions. Unexpected patterns require investigation, not forced agreement with a remembered number.'],
  ], 'compare',['Continuity → is the intended path complete?','Polarity → are conductors connected to the intended terminals?','Reading pattern → does the circuit behave as expected?'],'The ring-test video corrects an oversimplified tolerance claim; do not turn an instructor’s rule of thumb into a universal limit.'),
  'p08-l06': page('Insulation resistance concerns unwanted conduction between parts that should be separated. The test arrangement controls what a high or low reading can establish.', [
    ['Define the separation','Distinguish tests between live conductors from tests of live conductors connected together to the protective system.'],
    ['Connected equipment','Loads, electronics, switches and protective devices can affect the test or be affected by it. Preparation belongs to the full procedure.'],
    ['Interpret the display','A reading beyond the instrument’s range is a lower bound on resistance, not an exact value.'],
  ], 'compare',['Continuity: low resistance in an intended path','Insulation: high resistance across intended separation','Range limit: “greater than”, not an exact measurement'],'Do not choose test voltage or disconnect protective paths using a recap alone.'),
  'p08-l17': page('Origin tests describe the supply and fault conditions presented to the installation. Their purpose is different from proving the condition of every outgoing circuit.', [
    ['Supply polarity','Establish that supply conductors have the expected roles using the prescribed method and suitable equipment.'],
    ['Ze','Parallel paths can influence the result. The demonstrations explain why test configuration matters when identifying the external loop.'],
    ['Prospective fault current','Distinguish prospective short-circuit and earth-fault currents and assess the relevant worst case against equipment capability.'],
  ], 'compare',['Supply polarity → conductor roles','Ze → external earth-fault loop','PFC → prospective fault-current duty'],'These are live-test topics. The recap explains the evidence, not how to expose or probe live conductors.','Live testing requires specific competence, appropriate instruments and a controlled procedure.'),
  'p08-l15': page('Select and interpret the test for the protective function being checked. A button press, a trip-current reading and a loop measurement provide different evidence.', [
    ['Loop impedance','High-current and no-trip modes behave differently around RCDs. Compare results with the correct method and device conditions.'],
    ['Earth electrode','Electrode resistance testing is not simply another name for an installation loop test. The fall-of-potential demonstration examines the electrode and surrounding earth.'],
    ['RCD and function','A ramp test investigates operating residual current. Timed tests and functional checks answer other questions; connected leakage can influence results.'],
  ], 'compare',['Ramp test → current at operation','Timed RCD test → response time under test conditions','Functional check → intended switching / operation'],'The videos contain edition-specific test advice and intervals; confirm the applicable current requirements rather than copying them from this summary.'),
  'p16-l09': page('Inspection, testing and reporting form one evidence trail. The report must say what was examined, what was found and what could not be established.', [
    ['Periodic inspection','Existing installations introduce access limitations, unknown alterations and connected equipment. Plan the investigation around those realities.'],
    ['Record as you test','Write results against the correct circuit while the evidence is available, rather than reconstructing everything at the end.'],
    ['Scope and certificate','The installation certificate records the defined work and verification; periodic reporting evaluates an existing installation within a stated scope.'],
  ], 'flow',['Define scope and limitations','Inspect and test','Interpret findings','Record results and responsibilities'],'Neither an attractive report nor a working load substitutes for the underlying verification.'),
};
