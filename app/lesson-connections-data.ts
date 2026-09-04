export type LessonConnection = {
  title: string;
  points: string[];
  equations?: string[];
  question: string;
  answer: string;
  source: { title: string; url: string };
  exercise?: 'power-factor' | 'motor' | 'sequence';
};
const motorSource = { title: 'Schneider Electric: induction motors', url: 'https://www.electrical-installation.org/enwiki/Induction_motors' };
const ietSource = { title: 'IET: current edition and transition', url: 'https://electrical.theiet.org/bs-7671-18th-edition-wiring-regulations/ensure-you-are-up-to-date-with-bs-7671/' };
export const lessonConnections: Record<string, LessonConnection> = {
  'p01-transformers': {
    title: 'Work through the turns ratio',
    points: ['Use winding voltages for this ideal transformer relationship. It does not include losses, voltage regulation or three-phase connection factors.'],
    equations: [String.raw`\frac{V_2}{V_1}=\frac{N_2}{N_1},\qquad \frac{I_2}{I_1}=\frac{N_1}{N_2}`],
    question: 'A 230 V primary has 1,000 turns; the secondary has 100. Calculate the ideal secondary voltage. If it supplies 2 A, what is the ideal primary current?',
    answer: 'V₂ = 230 × 100 / 1,000 = 23 V. I₁ = 2 × 100 / 1,000 = 0.2 A. Both sides transfer 46 VA in this ideal example; real losses increase input power.',
    source: { title: 'The Engineering Mindset: transformers', url: 'https://theengineeringmindset.com/how-transformers-work/' },
  },
  'p01-l26': {
    title: 'Explore power-factor correction',
    points: ['For a sinusoidal lagging load, a capacitor can supply part of the reactive demand locally. Keep useful power fixed and compare the current before and after correction.', 'The example sizes reactive compensation in kVAr. An actual bank also needs switching, protection and a harmonic/resonance assessment; it is not specified by this calculation alone.'],
    equations: [String.raw`Q_c=P(\tan\varphi_1-\tan\varphi_2),\quad \varphi=\cos^{-1}(\mathrm{PF})`],
    question: 'Does better power factor mean the load now needs less useful energy?',
    answer: 'No. At unchanged real power and operating time, its useful energy requirement is unchanged. Supply current and upstream resistive losses can fall.',
    exercise: 'power-factor',
    source: { title: 'Schneider Electric: selecting compensation', url: 'https://www.electrical-installation.org/enwiki/How_to_determine_the_optimum_level_of_compensation%3F' },
  },
  'p03-l14': {
    title: 'Connect safe isolation to emergency readiness',
    points: ['Plan how to isolate every source, summon help and reach first-aid equipment before work starts. Do not touch someone who may still be in contact with an energised source; keep clear until the electrical danger is controlled.', 'Once the scene is safe, call local emergency services promptly for an unresponsive person. Follow dispatcher instructions, assess breathing and use CPR/AED skills from current practical training. A video does not establish hands-on first-aid competence.'],
    question: 'What must happen before you touch a casualty who may be in contact with electricity?',
    answer: 'Make the scene electrically safe without putting yourself at risk and summon help. Neither an emergency stop button nor an apparently stopped machine proves isolation.',
    source: { title: 'Resuscitation Council UK: 2025 adult basic life support', url: 'https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/adult-basic-life-support-guidelines' },
  },
  'p02-l01': {
    title: 'Separate a principle from a current rule',
    points: ['A physical principle explains what happens. A standard defines requirements within a stated scope. A manufacturer specifies the actual product. Record the document, edition and relevant clause before using a rule in a design.', 'The UK examples are teaching references. For a Kenyan project, establish the applicable Kenyan standards, EPRA requirements, supply conditions and authorised scope of work.', 'Edition check, 4 September 2026: BS 7671 Amendment 4:2026 is published; the IET gives 15 October 2026 as the end of the preceding edition’s transition. The 2010/2013 books remain historical explanations.'],
    question: 'Does a UK video or a draft regulation establish the rule for a Kenyan installation?',
    answer: 'No. Confirm the applicable published requirement and project scope with the responsible authority. Use EPRA and KEBS as starting points, and the exact equipment instructions for product-specific decisions.',
    source: ietSource,
  },
  'p07-l04': {
    title: 'When the neutral-current shortcut stops working',
    points: ['Balanced sinusoidal currents displaced by 120° sum to zero. “Equal currents” alone is not enough: electronic loads may draw distorted waveforms.', 'Triplen harmonic components can add in a shared neutral. Later LED, IT and drive lessons therefore need waveform and neutral-loading checks as well as phase balancing.'],
    question: 'Can three equal RMS line-current readings prove that the neutral current is zero?',
    answer: 'No. They do not describe the waveforms, harmonic content or phase relationships. The zero-neutral result requires the assumptions of the balanced sinusoidal model.',
    source: { title: 'Schneider Electric: harmonics and the neutral conductor', url: 'https://www.electrical-installation.org/enwiki/Sizing_the_neutral_conductor' },
  },
  'p06-l13': {
    title: 'Connect line quantities to total three-phase power',
    points: ['For a balanced sinusoidal load, use RMS line-to-line voltage and line current. These expressions give total power for all three phases; do not multiply by three again.'],
    equations: [String.raw`S=\sqrt{3}V_LI_L`, String.raw`P=S\cos\varphi,\qquad Q=S\sin\varphi=\sqrt{S^2-P^2}`],
    question: 'A balanced 400 V load draws 20 A at 0.80 lagging power factor. Find S, P and Q.',
    answer: 'S = 13.86 kVA; P = 11.09 kW; Q = 8.31 kVAr. Use line quantities consistently. For an unbalanced load, analyse the phases rather than applying this shortcut.',
    source: { title: 'The Engineering Mindset: power quantities', url: 'https://theengineeringmindset.com/power-factor-explained/' },
  },
  'p07-induction': {
    title: 'Read the nameplate and explore motor speed',
    points: ['Read Δ/Y voltage and its matching current, kW shaft output, frequency, rpm, efficiency, power factor, duty and IP rating together. Rated speed is measured at the stated operating condition.', 'Use shaft output in watts and efficiency as a decimal in the formula. At 7.5 kW output, 90% efficiency and 0.82 power factor on 400 V three-phase, estimated line current is 14.67 A. Use the manufacturer’s rated data for selection.'],
    equations: [String.raw`I_L=\frac{P_{\mathrm{out}}}{\sqrt{3}V_L\eta\cos\varphi}`, String.raw`n_s=\frac{120f}{p},\qquad s=\frac{n_s-n_r}{n_s}`],
    exercise: 'motor',
    question: 'At 50 Hz, a four-pole motor runs at 1,450 rpm. Find synchronous speed and slip.',
    answer: 'nₛ = 120 × 50 / 4 = 1,500 rpm. Slip = (1,500 − 1,450) / 1,500 = 0.0333, or 3.33%. Slip changes with load; it is not an efficiency figure.',
    source: motorSource,
  },
  'p04-l19': {
    title: 'Separate switching from motor protection',
    points: ['Short-circuit protection interrupts high fault current. An overload relay responds to sustained excessive motor loading. A contactor performs controlled switching; it is not a substitute for either protection.', 'Three-wire holding logic can prevent automatic restart after supply loss. Phase-loss monitoring, isolation and emergency stopping address different hazards. An ordinary stop button is not automatically a validated emergency-stop function.', 'Use a coordinated manufacturer combination and the motor nameplate. Overload settings depend on where the relay is connected; copying the upstream breaker rating can leave the motor unprotected.'],
    question: 'Can a contactor and an oversized breaker replace a correctly selected motor overload device?',
    answer: 'No. Switching, short-circuit protection and overload protection perform distinct functions. Their ratings and coordination must suit the motor, starting method and fault level.',
    source: motorSource,
  },
  'p07-star-delta': {
    title: 'Check the winding voltage before choosing a starter',
    points: ['On 400 V line-to-line, star applies about 231 V to each winding; delta applies 400 V. A suitable 400/690 V Δ/Y motor runs in delta at 400 V.', 'A 230/400 V Δ/Y motor runs in star on that supply. Switching it to delta would overvoltage its windings. Terminal links, contactor ratings and timer settings must follow the actual motor and starter documentation.'],
    equations: [String.raw`V_{\mathrm{winding,Y}}=\frac{V_L}{\sqrt{3}},\qquad V_{\mathrm{winding,\Delta}}=V_L`],
    question: 'Is every motor with six terminals suitable for star–delta starting on a 400 V supply?',
    answer: 'No. Six accessible winding ends are necessary for this arrangement but do not establish the winding-voltage rating, starting torque or suitability for the driven load.',
    source: { title: 'The Engineering Mindset: star–delta operation', url: 'https://theengineeringmindset.com/star-delta-startes/' },
  },
  'p06-l15': {
    title: 'Read breaking capacity and selectivity separately',
    points: ['Rated or set current in amperes concerns normal loading and tripping. Breaking capacity in kA concerns interruption of prospective short-circuit current at the specified voltage.', 'For an MCCB, distinguish ultimate breaking capacity Icu, service breaking capacity Ics and adjustable trip settings. Compare the relevant rating and duty with the fault level.', 'Selectivity keeps an upstream device closed for a fault cleared downstream. Cascading uses a tested upstream/downstream combination for backup protection. A larger upstream ampere rating alone proves neither.'],
    question: 'What evidence is needed before relying on backup protection or selectivity between two breakers?',
    answer: 'Use current manufacturer tables for the exact device pair, voltage, trip settings and fault level. Check each supply operating mode, including generator or inverter supply; their fault-current behaviour may differ.',
    source: { title: 'Schneider Electric: breaker coordination', url: 'https://www.electrical-installation.org/enwiki/Coordination_between_circuit-breakers' },
  },
  'p08-l07': {
    title: 'Distinguish polarity from phase sequence',
    points: ['Voltage readings identify conductor relationships; they do not establish phase rotation. A suitable phase-sequence instrument checks the order of the supply phases.', 'Confirm the driven equipment’s required rotation under its commissioning procedure. Any change to connections requires safe isolation and verification before retesting. The diagram below represents sequence, not instructions for live rewiring.'],
    exercise: 'sequence',
    question: 'What happens to the relative phase sequence if any two phases are exchanged?',
    answer: 'The sequence reverses. Actual shaft direction also depends on motor terminal identification and connection; confirm it safely rather than assuming the diagram proves rotation.',
    source: { title: 'The Engineering Mindset: induction motors', url: 'https://theengineeringmindset.com/induction-motor-basics/' },
  },
  'p05-spd': {
    title: 'Put the SPD demonstration into the protection system',
    points: ['Type 1 addresses lightning-current duty where required; Type 2 addresses distribution-level surge duty; Type 3 provides coordinated protection near equipment. A combined device can meet more than one type.', 'Choose protection level, system voltage, earthing arrangement, backup protection and connection lengths from the design and product data. An SPD does not replace an RCD or overcurrent protection.'],
    question: 'Does a green indicator or a passed cartridge test prove the protected equipment will see a safe surge voltage?',
    answer: 'No. Coordination, protective-path impedance, cable connections and the equipment’s withstand also matter. Check the installed system, not only the cartridge.',
    source: { title: 'Schneider Electric: surge protection devices', url: 'https://www.electrical-installation.org/enwiki/The_Surge_Protection_Device_(SPD)' },
  },
  'p08-periodic': {
    title: 'Interpret an older case using current evidence',
    points: ['An installation’s age or compliance with an earlier edition does not alone establish danger. Start with the actual observation, protective measure, condition and risk.', 'Keep new-work certification separate from condition reporting. Record extent, limitations, measurements and remedial recommendations using the applicable local procedure.'],
    question: 'If a video labels a defect C2, can that label be copied into another installation’s report?',
    answer: 'No. UK EICR codes are conclusions about a particular observed risk. Establish the facts and use current applicable reporting guidance. A Kenyan report also needs the correct local authority and requirements.',
    source: { title: 'IET: applying amendments to existing installations', url: 'https://electrical.theiet.org/wiring-matters/years/2026/109-april-2026/mythbuster-13-the-four-amendments-to-the-rumour-mill/' },
  },
};
