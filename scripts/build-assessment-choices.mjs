import { createHash } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';

const pathway = process.argv[process.argv.indexOf('--pathway') + 1];
const onlyPathway = process.argv.includes('--only');
if (!['C2', 'C1'].includes(pathway)) throw new Error('Use --pathway C2 or --pathway C1');

const bank = JSON.parse(await readFile(new URL('../app/assessment-bank.json', import.meta.url), 'utf8'));
const outputUrl = new URL('../app/assessment-choice-bank.json', import.meta.url);
let current = { schemaVersion: 1, questions: [] };
try { current = JSON.parse(await readFile(outputUrl, 'utf8')); } catch { /* First pathway creates the file. */ }

const plain = (value = '') => value
  .replace(/[\*_]/g, '')
  .replace(/^#{1,4}\s+/gm, '')
  .replace(/^[-*]\s+/gm, '')
  .replace(/^\d+\.\s+/gm, '')
  .replace(/\s+/g, ' ')
  .trim();
const sentence = (value, limit = 190) => {
  const clean = plain(value).replace(/\s+-\s*\d+\s*$/, '').replace(/\s+-\s*$/, '').replace(/\s*\(\d+\)$/, '');
  if (clean.length <= limit) return clean.replace(/[.;:,]+$/, '');
  return `${clean.slice(0, limit).replace(/\s+\S*$/, '')}…`;
};
const stableIndex = (id) => createHash('sha256').update(id).digest()[0] % 4;
const rotate = (values, correctIndex) => values.map((_, index) => values[(index - correctIndex + 4) % 4]);

const topicProfiles = [
  { pattern: /three-phase|three phase|balanced star|balanced delta|phase voltage|line voltage|phase current|line current|phase sequence|120°|120 degrees|neutral current|triplen harmonic/i, foundation: 'A three-phase system has three alternating phase quantities displaced by 120 electrical degrees. In a balanced star connection, `VL = sqrt(3)Vph` and `IL = Iph`; in a balanced delta connection, `VL = Vph` and `IL = sqrt(3)Iph`. Balanced fundamental phase currents sum vectorially to zero, but unbalance and triplen harmonics can create neutral current. Phase sequence determines the order of the phases and affects motor direction.', mistakes: ['apply star line/phase relationships to a delta connection or vice versa', 'add displaced phase currents arithmetically instead of treating them as phasors', 'assume similar RMS phase-current magnitudes guarantee zero neutral current when triplen harmonics are present'] },
  { pattern: /P, Q, S|three-phase apparent|apparent power|three-phase.*real power|transformer.*line current|sqrt\(3\)|√3|kVA.*line current/i, foundation: 'For a balanced three-phase load, `S = sqrt(3)VLIL`, `P = sqrt(3)VLIL pf` and `Q = sqrt(S^2 - P^2)`. `VL` and `IL` are RMS line values, and `pf = P/S`. These equations require a balanced steady-state model; units must be converted consistently before calculating line current or transformer loading.', mistakes: ['omit the `sqrt(3)` factor while using line voltage and line current', 'insert phase values into a line-value equation without changing the relationship', 'interchange kilowatts, kilovolt-amperes and kilovolt-amperes reactive'] },
  { pattern: /three-phase distribution board|phase allocation|submain|parallel conductors|ferrous metal|large three-phase feeder|neutral.*protective conductors/i, foundation: 'Three-phase distribution design coordinates load allocation, conductor ratings, fault level, protection, isolation, neutral and CPC paths, and the physical arrangement. Single-phase loads are distributed to manage phase imbalance, while nonlinear loads require explicit neutral-harmonic assessment. Parallel conductors need matching material, size, length, routing and termination so current sharing is predictable.', mistakes: ['balance only the circuit count and ignore the actual current and operating pattern on each phase', 'route parallel conductors with unequal length or impedance and assume they will share equally', 'pass separated single-core AC conductors through ferrous metal without controlling induced heating'] },
  { pattern: /MCCB|\bIcu\b|\bIcs\b|\bIcw\b|short-circuit breaking capacity|fault breaking capacity/i, foundation: 'Protective-device ratings describe different duties. Rated current concerns normal loading and overload coordination; `Icu` is the ultimate short-circuit breaking capacity, `Ics` is the service short-circuit breaking capacity, and `Icw` is a rated short-time withstand current under stated conditions. Selection compares the prospective fault level with verified interruption/withstand ratings and uses manufacturer data for selectivity and backup protection.', mistakes: ['treat rated current, `Icu`, `Ics` and `Icw` as the same ampere value', 'select breaking capacity below the prospective fault current at the installation point', 'claim different device ratings alone prove selectivity without manufacturer time-current or energy data'] },
  { pattern: /synchronous speed|induction motor|motor nameplate|motor winding|motor input|percentage slip|rotor-current frequency|400\/690 V|Δ\/Y/i, foundation: 'An induction motor stator creates a rotating field at synchronous speed `ns = 120f/p`, where `f` is frequency in hertz and `p` is the number of poles. The rotor must run below synchronous speed in motoring operation; slip is `s = (ns - nr)/ns`, and rotor frequency is `fr = sf`. Nameplate voltage pairs and delta/star markings state the permitted winding voltage and connection and must be matched to the actual line voltage.', mistakes: ['treat rotor running speed as always equal to synchronous speed under load', 'reverse the star and delta voltage relationships on a dual-voltage nameplate', 'calculate synchronous speed without the supply frequency or number of poles'] },
  { pattern: /DOL|contactor|overload relay|Stop push-button|holding contact|star-delta starting|soft starter|VFD|forward\/reverse|interlocking|motor starting/i, foundation: 'Motor control separates switching, overload protection, fault protection and control logic. A contactor performs repeated electromagnetic switching; an overload relay responds to sustained motor overcurrent and opens the control circuit; short-circuit protection is separate. DOL applies full supply, star-delta reduces starting winding voltage and torque, a soft starter controls applied voltage during start, and a VFD controls frequency and voltage for speed control.', mistakes: ['use the contactor coil as the motor overload and short-circuit protective device', 'wire the Stop function normally open so a broken control wire cannot stop the motor', 'select star-delta, soft starting and variable-frequency control as though they provide identical torque and speed behavior'] },
  { pattern: /APFC|automatic power-factor|capacitor bank|kvar correction|kVAr.*capacitor|detuned reactor|overcorrection|harmonic-rich/i, foundation: 'A shunt capacitor bank supplies leading reactive power locally, reducing the lagging reactive demand, apparent power and upstream current while the load real power remains essentially unchanged. Correction is commonly estimated from `Qc = P(tan phi1 - tan phi2)`. APFC stages respond to measured system conditions; harmonic-rich networks require resonance, capacitor-duty and detuning checks.', mistakes: ['claim capacitor correction creates extra real kilowatts at the mechanical load', 'switch all capacitor stages permanently without considering load variation or overcorrection', 'ignore harmonic resonance and capacitor current/voltage duty when selecting stages'] },
  { pattern: /electrical-shock casualty|first-aid|CPR|AED|unresponsive and not breathing/i, foundation: 'Electrical first aid begins with scene safety: do not touch a casualty who may still be energized. Isolate or otherwise break contact safely, check response and normal breathing, call 999 or 112, begin CPR when required and use an AED as soon as it is available.', mistakes: ['touch the casualty before the electrical source is made safe', 'delay the emergency call and CPR while using an obsolete resuscitation drill', 'give food or water instead of completing the primary emergency response'] },
  { pattern: /single-line diagram|supply path|source-to-board|domestic installation|consumer unit.*sequence/i, foundation: 'A single-line diagram simplifies functional relationships. For a typical domestic arrangement it shows the supply/service protection, metering, main isolation, distribution, final-circuit protection, circuit and load in order, while the earthing, MET and CPC path is shown separately from the normal load-current path.', mistakes: ['place the meter and service protection downstream of the final load', 'show the CPC and neutral as interchangeable normal return conductors', 'omit isolation, final-circuit protection or the protective-earth relationship'] },
  { pattern: /safe isolation|isolat|prove.*dead|absence of voltage|wall switch.*OFF/i, foundation: 'Safe isolation is a controlled process, not a switch position. Identify every source, isolate the correct conductors, secure the isolating means, prove the voltage indicator, test every relevant conductor combination for absence of voltage, and re-prove the indicator. Backfeeds and stored energy must also be controlled.', mistakes: ['treat an OFF wall switch or extinguished lamp as proof that every conductor is dead', 'use conductor colour or a non-contact detector as the sole proof of isolation', 'omit the prove-test-reprove sequence for the voltage indicator'] },
  { pattern: /ring final|ring-final|spur|two cables at a socket/i, foundation: 'An intact ring final circuit has line, neutral and CPC conductors leaving and returning to the same protective point. An open leg may leave outlets working through the remaining path, so visual appearance or two cables at a socket cannot prove integrity; end-to-end and appropriate cross-connection continuity evidence is required.', mistakes: ['declare the ring healthy because each visible outlet has two cables', 'treat a spur as a second complete return path to the protective device', 'assume an open ring conductor must make every outlet immediately dead'] },
  { pattern: /two-way|intermediate switch|lighting control|switched line|polarity test|correct polarity|wrong-polarity/i, foundation: 'Normal single-pole control interrupts the line conductor so downstream equipment is not left live merely because the load is off. Two-way switches select between two travellers; an intermediate switch crosses or passes those travellers to add further control positions. Polarity and CPC continuity remain separate verification requirements.', mistakes: ['switch the neutral while leaving the line permanently connected to the load', 'use the CPC as a traveller or normal current-carrying conductor', 'treat successful lamp operation as proof of correct polarity and protective continuity'] },
  { pattern: /\b(?:Ib|In|Iz|Ca|Cg)\b/, foundation: 'Cable and wiring-system selection is a chain of checks. Establish the connected load and evidence-based maximum demand, design current and protective-device rating, installation method, tabulated capacity and correction factors; then verify corrected current capacity, voltage drop, fault protection, thermal withstand, fault duty, environment, mechanical protection, support, segregation and manufacturer limits.', mistakes: ['choose a familiar cable size from connected load or nominal current alone and skip maximum-demand evidence and installation-condition factors', 'increase the protective-device rating when voltage drop or corrected cable capacity fails', 'treat containment fill or a secure gland as proof that thermal, support, segregation and fault checks all pass'] },
  { pattern: /cable|conductor current-carrying|mm2|voltage drop|correction factor|grouping|ambient|maximum demand|connected load|diversity|thermal insulation|SWA|trunking|containment|fire stopping|gland/i, foundation: 'Cable and wiring-system selection is a chain of checks. Establish the connected load and evidence-based maximum demand, design current and protective-device rating, installation method, tabulated capacity and correction factors; then verify corrected current capacity, voltage drop, fault protection, thermal withstand, fault duty, environment, mechanical protection, support, segregation and manufacturer limits.', mistakes: ['choose a familiar cable size from connected load or nominal current alone and skip maximum-demand evidence and installation-condition factors', 'increase the protective-device rating when voltage drop or corrected cable capacity fails', 'treat containment fill or a secure gland as proof that thermal, support, segregation and fault checks all pass'] },
  { pattern: /consumer unit|main switch|neutral bar|earth bar|terminal torque|circuit labels|circuit schedule|board assembly/i, foundation: 'A consumer unit distributes the incoming supply among final circuits and coordinates isolation, overcurrent protection, residual-current protection where required, neutral and protective-conductor terminations, labeling and any surge protection. Devices and enclosure must form a verified compatible assembly. Terminations are tightened to the manufacturer’s specified torque with the correct conductor preparation, because both loose and over-tightened connections can fail.', mistakes: ['treat the neutral bar and protective-conductor bar as interchangeable normal-current paths', 'tighten every terminal by feel without the manufacturer’s torque value', 'mix unverified devices and enclosure components solely because they appear to fit'] },
  { pattern: /RCD|RCBO|RCCB|MCB|fuse|protective device|breaking capacity|SPD|selectivity|overload|short circuit/i, foundation: 'Protective functions must be distinguished. An MCB or fuse provides overcurrent protection; an RCCB provides residual-current protection but no integral overcurrent protection; an RCBO combines both. Breaking capacity concerns safe interruption of prospective fault current, an SPD limits transient overvoltage, and selectivity limits unnecessary upstream disconnection within a verified range.', mistakes: ['treat rated current, residual-current sensitivity and breaking capacity as the same rating', 'use an RCCB alone as overload and short-circuit protection', 'claim that an SPD or isolator performs the function of an overcurrent or residual-current protective device'] },
  { pattern: /earthing|bonding|\bCPC\b|\bZs\b|\bZe\b|earth-fault|\bADS\b|\bMET\b|exposed.*conductive|extraneous.*conductive/i, foundation: 'Earthing and protective conductors provide a fault-current path so automatic disconnection can operate. `Ze` is the external earth-fault-loop impedance; `R1 + R2` is the circuit line-plus-CPC contribution; `Zs` is the total loop impedance at the point. Protective bonding limits dangerous potential differences between relevant conductive parts. An exposed-conductive-part is accessible conductive equipment metal that can become live under a basic-insulation fault; an extraneous-conductive-part is not part of the electrical installation but can introduce earth potential.', mistakes: ['treat `Ze`, `Zs`, insulation resistance and protective bonding as the same measurement', 'use the CPC as a normal neutral or line-current conductor', 'assume bonding replaces every circuit protective conductor and disconnection check'] },
  { pattern: /inspection|verification|continuity|insulation resistance|test voltage|loop impedance|prospective fault|RCD TEST|test button|instrument/i, foundation: 'Verification combines inspection with tests in a safe order. Applicable continuity, insulation-resistance and polarity checks are normally completed under safe-isolation conditions before controlled live measurements. Each result needs the correct instrument, units and acceptance criterion; a device TEST button proves only its internal test mechanism.', mistakes: ['energize first and let normal operation replace inspection and dead tests', 'use the wrong instrument or interpret a reading without its units and limit', 'treat the RCD TEST button as proof of the complete earthing and installation condition'] },
  { pattern: /fault-finding|fault finding|fault|tripping|repair|open CPC|high Zs|low insulation/i, foundation: 'Safe fault finding moves from symptom to evidence: define the fault, identify and isolate as required, inspect likely causes, test methodically, locate the root cause, repair it, and repeat the relevant verification before return to service. A functioning load does not prove protective continuity or correct polarity.', mistakes: ['replace parts or repeatedly reset protection without locating the cause', 'bypass the protective device or remove the CPC to keep the load operating', 'assume a new component proves the repair without post-repair testing and records'] },
  { pattern: /Kenya|EPRA|ERC|Kenya Power|KETRACO|KenGen|GDC|REREC|Energy Act|KS 662|KS 1587|Building Code|licen[cs]|regulat|contractor|certificate|completion evidence/i, foundation: 'Current Kenyan authority and scope must be identified precisely. EPRA is the energy-sector regulator and licenses electrical workers; Kenya Power is a licensed distribution/supply company involved in customer connections. Current law, codes and official connection and contractor-certificate requirements override obsolete institutional names or historical marking-scheme wording.', mistakes: ['use the former ERC name as though it were the current licensing authority', 'treat Kenya Power, EPRA, KenGen, KETRACO, GDC and REREC as interchangeable bodies', 'let an old examination paper override current law, official scope or connection documentation'] },
  { pattern: /luminaire|lighting|lumens|lux|glare|illumination/i, foundation: 'Lighting design separates electrical load from lighting performance. Watts affect circuit load and heat; lumens describe luminous flux; lux describes lumens incident per square metre. Selection also considers distribution, glare, colour rendering, mounting, environment, ingress protection, maintenance and manufacturer limits.', mistakes: ['select a luminaire from wattage or appearance alone', 'interchange lumens, lux, watts and electrical current', 'ignore environmental, thermal, glare and task-illumination conditions because the lamp operates'] },
  { pattern: /conductor.*colour|colour coding|green-and-yellow|mixed-era|brown|blue|same baseline.*neutral|identification information/i, foundation: 'Conductor colours communicate intended identification but do not prove function or absence of voltage. Under the stated current AC baseline, line is brown, neutral is blue and the protective conductor is green-and-yellow. Existing and altered installations can contain earlier schemes, so uncertain conductors must be traced, tested and safely verified.', mistakes: ['trust colour alone and energize or alter the conductor without safe identification', 'repurpose green-and-yellow as a normal line or neutral conductor', 'assume mixed-era wiring cannot exist and that colour proves the circuit is dead'] },
  { pattern: /DC|battery|batteries|diode|polarity/i, foundation: 'In the ideal DC model polarity is unidirectional. Ohm’s law is `V = IR`, power is `P = VI`, and energy is power multiplied by time. Series source voltages add when polarity is aligned; identical parallel sources retain nominal voltage while increasing available capacity subject to the battery design.', mistakes: ['add parallel battery voltages as though the sources were in series', 'reverse polarity on sensitive equipment because DC polarity is assumed irrelevant', 'interchange resistance, power and energy or omit the time conversion'] },
  { pattern: /power factor|kVAr|kVA|reactive|apparent power/i, foundation: 'Real power `P` in watts performs useful energy conversion; apparent power `S` in volt-amperes is the RMS voltage-current product; reactive power `Q` is the quadrature component. Power factor is `P/S`. At fixed real power and voltage, lower power factor requires higher current.', mistakes: ['treat kW, kVA and kVAr as identical quantities', 'assume lower power factor reduces current for the same real power and voltage', 'claim reactive-power correction creates additional real power at the load'] },
  { pattern: /voltage|current|resistance|Ohm|series|parallel|power|energy|frequency|Hz/i, foundation: 'Voltage is potential difference, current is the rate of charge flow and resistance opposes current in the resistive model. Ohm’s law is `V = IR`; power is the rate of energy transfer and, for a resistive load, `P = VI`; energy is `E = Pt`. Series resistances add, while parallel branches share the same voltage.', mistakes: ['interchange voltage, current, resistance, power and energy', 'add parallel resistances directly or multiply series resistances', 'omit the time term when converting power into energy'] },
];

function profileFor(question) {
  const questionText = `${question.title} ${question.prompt}`;
  const preferredProfiles = [
    [/DOL|contactor|overload relay|Stop push-button|holding contact|star-delta starting|soft starter|VFD|forward\/reverse|interlocking|motor starting/i, /Motor control separates/],
    [/synchronous speed|induction motor|motor nameplate|motor winding|percentage slip|rotor-current frequency|400\/690 V|Δ\/Y/i, /induction motor stator/],
    [/\bPFC\b|power factor correction|APFC|automatic power-factor|capacitor bank|kvar correction|detuned reactor|overcorrection|harmonic-rich/i, /shunt capacitor bank/],
    [/MCCB|\bIcu\b|\bIcs\b|\bIcw\b/i, /Protective-device ratings describe/],
    [/three-phase distribution board|phase allocation|submain|parallel conductors|ferrous metal|large three-phase feeder/i, /Three-phase distribution design/],
    [/P, Q, S|three-phase apparent|apparent power|three-phase.*real power|transformer.*line current/i, /balanced three-phase load/],
  ];
  const preferred = preferredProfiles
    .find(([questionPattern]) => questionPattern.test(questionText));
  const sectionFoundations = new Map([
    ['C1-01', /A three-phase system has/],
    ['C1-02', /For a balanced three-phase load/],
    ['C1-03', /Three-phase distribution design/],
    ['C1-04', /Cable and wiring-system selection/],
    ['C1-05', /Earthing and protective conductors/],
    ['C1-06', /A shunt capacitor bank/],
    ['C1-07', /An induction motor stator/],
    ['C1-08', /Motor control separates/],
    ['C1-09', /Verification combines inspection/],
    ['C1-10', /Safe fault finding moves/],
  ]);
  const sectionFoundation = sectionFoundations.get(question.sectionId);
  const allowPreferredInsideSection = !sectionFoundation
    || (question.sectionId === 'C1-02' && /motor|synchronous speed/i.test(questionText))
    || (question.sectionId === 'C1-04' && /MCCB|\bIcu\b|\bIcs\b|\bIcw\b/i.test(questionText));
  const profile = (preferred && allowPreferredInsideSection ? topicProfiles.find(item => preferred[1].test(item.foundation)) : undefined)
    ?? (sectionFoundation ? topicProfiles.find(item => sectionFoundation.test(item.foundation)) : undefined)
    ?? topicProfiles.find(item => item.pattern.test(questionText))
    ?? topicProfiles.find(item => item.pattern.test(question.answer));
  if (!profile) throw new Error(`No teaching profile for ${question.id}: ${question.title}`);
  return profile;
}

function foundationFor(question) {
  const primary = profileFor(question);
  if (/safe isolation.*(?:shock|casualty)|(?:shock|casualty).*safe isolation/i.test(`${question.title} ${question.prompt}`)) {
    const isolation = topicProfiles.find(item => /safe isolation/i.test(item.foundation));
    const firstAid = topicProfiles.find(item => /first aid begins/i.test(item.foundation));
    return [isolation, firstAid].filter(Boolean).map(profile => profile.foundation).join(' ');
  }
  return primary.foundation;
}

const misconceptionRules = [
  { pattern: /phases 120|balanced star|explain star|phase relationships/i, values: ['use the delta relationship `IL = sqrt(3)Iph` for a star-connected load', 'state that the three phase quantities reach the same angle at the same instant', 'calculate phase voltage in star as `Vph = sqrt(3)VL` instead of `VL/sqrt(3)`'] },
  { pattern: /balanced delta|explain delta|in delta/i, values: ['use the star current relationship `IL = Iph` for a delta-connected load', 'divide line voltage by `sqrt(3)` even though each delta branch is connected line-to-line', 'treat the closed delta branches as a neutral conductor'] },
  { pattern: /neutral current|triplen|unbalance/i, values: ['add three phase-current magnitudes arithmetically without their phase angles', 'assume equal RMS readings prove zero neutral current despite triplen harmonics', 'size or omit the neutral from phase current alone without assessing nonlinear load content'] },
  { pattern: /phase sequence|motor direction|wrong direction/i, values: ['use a normal voltmeter reading as proof of the phase rotation order', 'change phase connections before safe isolation and confirming the driven-machine risk', 'assume phase sequence cannot affect the rotation of a conventional three-phase motor'] },
  { pattern: /three-phase power formula|difference between kW|P, Q, S|apparent power|transformer.*current|sqrt/i, values: ['omit `sqrt(3)` while calculating balanced three-phase power from line quantities', 'treat `kW`, `kVA` and `kVAr` as interchangeable units', 'mix volts with kilovolt-amperes without converting powers to a consistent base unit'] },
  { pattern: /selecting a feeder|load list to a feeder|feeder design|cable sizing/i, values: ['select the feeder from connected kilowatts alone and omit power factor, demand and installation factors', 'increase the protective-device rating when corrected conductor capacity fails', 'stop after ampacity and omit voltage drop, fault level, ADS and installation checks'] },
  { pattern: /phase allocation|distribution board|submain|parallel conductors|harmonics/i, values: ['balance only the number of circuits and ignore each circuit current and duty cycle', 'assume triplen harmonic currents cancel in the neutral like balanced fundamental currents', 'use unequal parallel-conductor routes and terminations while expecting equal current sharing'] },
  { pattern: /Icu|Ics|Icw|breaking capacity|selectivity/i, values: ['treat normal current rating, breaking capacity and short-time withstand as one rating', 'accept a breaking capacity below the prospective fault current at the device', 'claim rating order alone proves selectivity without the manufacturer’s verified data'] },
  { pattern: /induction motor run below|synchronous speed|calculate synchronous|what is slip|rotor frequency/i, values: ['set rotor speed equal to synchronous speed while still expecting induction torque under load', 'calculate `ns` without both frequency and pole count', 'define slip as `nr/ns` rather than `(ns - nr)/ns`'] },
  { pattern: /400\/690 V|nameplate|star\/delta reasoning/i, values: ['connect the winding so each phase receives the higher line voltage than its nameplate rating permits', 'read the two nameplate voltages as alternative supply frequencies', 'ignore the delta/star symbols and decide the connection from motor power alone'] },
  { pattern: /DOL Start|contactor|drop out on overload|holding contact/i, values: ['use the contactor as though it were the overload and short-circuit protective device', 'wire the Stop contact normally open and defeat fail-safe control behavior', 'place the seal-in contact so the coil remains energized after a Stop or overload trip'] },
  { pattern: /DOL vs star-delta|star-delta|soft starter|VFD/i, values: ['treat reduced-voltage starting and variable-frequency speed control as the same function', 'select star-delta without confirming that the motor has accessible winding ends and the correct running connection', 'assume reduced starting voltage leaves induction-motor starting torque unchanged'] },
  { pattern: /poor power factor|\bPFC\b|power factor correction|kvar correction|APFC|capacitor|PF improves/i, values: ['claim power-factor correction creates additional real output power at the load', 'calculate correction by subtracting the two power-factor numbers directly', 'ignore load variation and harmonic resonance when selecting capacitor stages'] },
  { pattern: /motor hums|motor fault|hot neutral|hotter terminal|current imbalance/i, values: ['replace the motor or terminal immediately without comparing supply, current and connection evidence', 'treat a hot connection as proof of balanced current and correct torque', 'return the machine to service after the symptom clears without repeating the relevant tests'] },
  { pattern: /what is voltage|potential difference/i, values: ['describe voltage as the rate of charge flow measured in amperes', 'describe voltage as opposition to current measured in ohms', 'describe voltage as the rate of energy transfer measured in watts'] },
  { pattern: /what is current|electric current/i, values: ['describe current as potential difference measured in volts', 'describe current as opposition to charge flow measured in ohms', 'say current is consumed by the first component and cannot continue around a closed series circuit'] },
  { pattern: /Ohm.s law/i, values: ['use `V = I/R`, which divides rather than multiplies current and resistance', 'use `R = VI`, which gives power units rather than resistance', 'apply `V = IR` without the stated resistive conditions or consistent units'] },
  { pattern: /series versus parallel|parallel branch|radial versus ring/i, values: ['say current is identical in every parallel branch regardless of branch resistance', 'say voltage divides between ideal parallel branches connected to the same two nodes', 'add parallel resistances directly in the same way as series resistances'] },
  { pattern: /power versus energy|watts and watt-hours/i, values: ['treat watts and watt-hours as two names for instantaneous power', 'calculate energy from power without multiplying by operating time', 'describe a kilowatt-hour as a unit of current rather than energy'] },
  { pattern: /what is frequency|50 Hz/i, values: ['count each positive and negative half-cycle as a separate complete cycle', 'describe hertz as voltage magnitude rather than cycles per second', 'state that a 50 Hz supply completes 50 cycles per minute'] },
  { pattern: /power factor/i, values: ['define power factor as reactive power divided by real power', 'claim lower power factor reduces current when real power and voltage remain fixed', 'treat kilowatts, kilovolt-amperes and kilovolt-amperes reactive as interchangeable'] },
  { pattern: /connected load versus maximum demand|maximum demand versus demand factor|what is diversity/i, values: ['treat connected load and maximum demand as automatically identical in every installation', 'apply an unsupported percentage without evidence about coincident use', 'define demand factor as maximum demand divided by an unrelated cable or device rating'] },
  { pattern: /single-line diagram|trace a domestic installation|domestic installation.*sequence/i, values: ['place final-circuit protection upstream of the service protection and meter', 'show the CPC as the normal load-current return conductor', 'omit the main means of isolation and the relationship between distribution and final circuits'] },
  { pattern: /safe.isolation|isolation versus functional|wall switch|prove.*dead/i, values: ['treat an OFF switch position as proof that every relevant conductor is dead', 'omit re-proving the voltage indicator after testing the circuit', 'use conductor colour or a non-contact detector as the sole proof of absence of voltage'] },
  { pattern: /colour not enough|colour coding|mixed-era|technical-baseline colours|conductor.*colour/i, values: ['treat conductor colour alone as proof of function and absence of voltage', 'identify green-and-yellow as a permissible normal line or neutral conductor', 'assume altered installations cannot contain conductors from different identification eras'] },
  { pattern: /electrical-shock casualty|modern CPR|Holger Nielsen|first aid/i, values: ['touch the casualty while the electrical source may still be live', 'delay the emergency call, CPR and AED while performing an obsolete resuscitation drill', 'give food or water instead of checking response and normal breathing'] },
  { pattern: /what is a spur|spur reasoning/i, values: ['describe a spur as the second complete return leg of an intact ring final circuit', 'assume every branch from a radial circuit is automatically a ring final circuit', 'claim cable arrangement alone proves compliance without checking protection, load and installation conditions'] },
  { pattern: /ring-final|open ring|ring conductor|ring\/socket/i, values: ['declare a ring intact solely because two cables enter one socket', 'assume one open ring leg must immediately disconnect every socket', 'let functional operation replace end-to-end and cross-connection continuity evidence'] },
  { pattern: /two-way switching|intermediate switching|intermediate switch/i, values: ['use the CPC as a traveller between switching positions', 'connect an intermediate switch as though it were a single-pole one-way switch', 'claim successful lamp operation proves correct polarity and CPC continuity'] },
  { pattern: /switch the line|switched line|purpose of polarity|wrong-polarity/i, values: ['switch only the neutral and leave the load line terminal permanently energized', 'use the CPC as the switched conductor', 'treat the lamp operating normally as sufficient proof of correct polarity'] },
  { pattern: /what does `Ca`|ambient-temperature factor/i, values: ['describe `Ca` as a grouping factor for adjacent loaded circuits', 'apply `Ca` as an increase in protective-device rating when ambient temperature rises', 'ignore the cable insulation type and reference ambient temperature used by the table'] },
  { pattern: /what does `Cg`|grouping factor/i, values: ['describe `Cg` as the ambient-temperature correction factor', 'apply `Cg` without identifying how many relevant circuits are grouped and how they are installed', 'use grouping correction to justify increasing the protective-device rating above cable capacity'] },
  { pattern: /thermal insulation/i, values: ['assume surrounding insulation improves cable heat dissipation and current capacity', 'ignore the length and degree of enclosure by insulation', 'increase the protective-device rating to compensate for reduced cable cooling'] },
  { pattern: /SWA construction|SWA gland|armour/i, values: ['describe the outer sheath as the steel mechanical armour', 'rely on the gland alone to carry the weight of a long unsupported cable run', 'terminate the armour without establishing the required mechanical and earth-continuity connection'] },
  { pattern: /conduit\/trunking fill|trunking-fill|containment fill/i, values: ['treat a passing fill calculation as proof of current capacity, support, segregation and voltage drop', 'ignore bends, draw-in access and conductor installation damage because area fill passes', 'use spare containment area as a substitute for cable thermal and fault-protection checks'] },
  { pattern: /overload versus short circuit|overload current|short circuit/i, values: ['describe overload and short-circuit current as the same fault mechanism', 'define overload as current flowing through an unintended near-zero-impedance path', 'assume normal load current can never exceed the current-carrying capacity of conductors'] },
  { pattern: /MCB versus RCCB versus RCBO|residual-current.*without|combines residual-current|what does an RCD detect/i, values: ['claim an RCCB includes overload and short-circuit protection by itself', 'claim an MCB detects residual-current imbalance between live conductors', 'describe an RCBO as an isolator with no protective function'] },
  { pattern: /breaking capacity|PFC at consumer unit|prospective fault current/i, values: ['confuse breaking capacity with the device normal current rating', 'select a device whose breaking capacity is below the prospective fault current at its point', 'treat prospective fault current as the normal diversified load current'] },
  { pattern: /explain ADS|earth-fault current path|automatic disconnection/i, values: ['rely on earthing alone without a sufficiently low fault path and correctly operating protective device', 'use the CPC as a normal load-current return path', 'assume additional RCD protection removes the need for basic protection and circuit verification'] },
  { pattern: /`Ze`.*`R1\+R2`.*`Zs`|define `Ze`|define `Zs`|what does `Zs`|high `Zs`/i, values: ['define `Ze` as the complete loop impedance at the final load', 'treat `Zs` as insulation resistance between live conductors', 'ignore the line-and-CPC contribution `R1 + R2` when interpreting the circuit loop'] },
  { pattern: /earthing versus bonding|exposed versus extraneous/i, values: ['say protective bonding carries normal neutral load current', 'treat every metal object as an extraneous-conductive-part without checking whether it can introduce earth potential', 'claim bonding replaces the CPC and automatic-disconnection requirements'] },
  { pattern: /what is selectivity/i, values: ['define selectivity as every upstream and downstream protective device operating together', 'assume different nominal ratings alone prove selective operation for every fault level', 'confuse selectivity with an SPD limiting transient overvoltage'] },
  { pattern: /what is an SPD|transient overvoltage/i, values: ['describe an SPD as the normal overload protective device for the circuit', 'claim an SPD provides safe isolation for maintenance', 'treat an SPD as protection against every sustained overvoltage and wiring fault'] },
  { pattern: /`Ib <= In <= Iz`|cable design|2\.5 mm2 for sockets/i, values: ['select cable size from a familiar rule of thumb without load and installation conditions', 'increase `In` above `Iz` when the selected cable fails the capacity check', 'stop after current capacity and omit voltage drop, fault protection and installation checks'] },
  { pattern: /why check voltage drop/i, values: ['treat voltage drop as unrelated to circuit length and load current', 'increase protective-device rating to correct excessive voltage drop', 'assume passing current capacity automatically proves acceptable voltage at the load'] },
  { pattern: /initial-verification sequence|purpose of CPC continuity|purpose of insulation resistance|purpose of polarity/i, values: ['energize first and let successful operation replace inspection and dead tests', 'use one instrument function as proof of continuity, insulation resistance and polarity together', 'record a reading without its test conditions, units and acceptance criterion'] },
  { pattern: /RCD TEST button/i, values: ['claim the TEST button measures earth-fault-loop impedance', 'claim the TEST button proves CPC continuity and the complete earthing arrangement', 'use the TEST button result as a substitute for required instrument tests and inspection'] },
  { pattern: /sectionalize a fault|low IR|fault.finding|rule after repair|post-repair/i, values: ['replace components or repeatedly reset protection without locating the root cause', 'return the installation to service after the symptom disappears without repeat verification', 'bypass a protective device or disconnect the CPC to keep the load operating'] },
  { pattern: /Kenyan|Kenya|EPRA|licence scope|organizations/i, values: ['use obsolete institutional names as though they describe the current authority', 'treat the regulator, generator, transmitter and distributor as the same organization', 'allow an old marking scheme to override current law and official requirements'] },
];

function mistakesFor(question, profile) {
  const searchable = `${question.title} ${question.prompt}`;
  return misconceptionRules.find(rule => rule.pattern.test(searchable))?.values ?? profile.mistakes;
}

function asChoice(value) {
  return `${value.charAt(0).toLocaleUpperCase()}${value.slice(1).replace(/[.;:,]+$/, '')}.`;
}

function representativePoints(question) {
  const expanded = question.markingPoints.length === 1 && plain(question.markingPoints[0].criterion).includes(';')
    ? plain(question.markingPoints[0].criterion).split(';')
    : question.markingPoints.map(point => point.criterion);
  return [...new Set(expanded.map(point => sentence(point, 150)).filter(value => value.length > 8 && !/^C[12]-\d+/i.test(value)))];
}

function generatedChoices(question) {
  const points = representativePoints(question);
  const profile = profileFor(question);
  const foundation = foundationFor(question);
  const mistakes = mistakesFor(question, profile);
  const first = points[0] ?? sentence(question.answer, 165);
  const second = points[1] ?? sentence(question.prompt, 165);
  const middle = points[Math.floor(points.length / 2)] ?? second;
  const penultimate = points.at(-2) ?? middle;
  const last = points.at(-1) ?? middle;
  if (points.length < 3) {
    const correctIndex = stableIndex(question.id);
    const base = [
      { text: first, feedback: `${foundation} The stated answer applies that principle correctly: ${first}.` },
      { text: asChoice(mistakes[0]), feedback: `This is incorrect because it would ${mistakes[0]}. ${foundation}` },
      { text: asChoice(mistakes[1]), feedback: `This is incorrect because it would ${mistakes[1]}. ${foundation}` },
      { text: asChoice(mistakes[2]), feedback: `This is incorrect because it would ${mistakes[2]}. ${foundation}` },
    ];
    return rotate(base, correctIndex).map((choice, index) => ({ id: String.fromCharCode(65 + index), ...choice, isCorrect: index === correctIndex }));
  }
  const correct = points.join('; then ');
  const incompletePoints = points.filter((_, index) => index !== points.length - 2 && index !== points.length - 1);
  const incomplete = incompletePoints.join('; then ');
  const mixed = points.map((point, index) => index === Math.floor(points.length / 2) ? asChoice(mistakes[0]) : point).join('; then ');
  const technicallyWrong = points.map((point, index) => index === Math.max(1, points.length - 2) ? asChoice(mistakes[1]) : point).join('; then ');
  const base = [
    { text: correct, feedback: `${foundation} This response applies the complete answer plan: it begins with ${first.toLocaleLowerCase()}, includes ${middle.toLocaleLowerCase()}, and reaches ${last.toLocaleLowerCase()} without substituting a different electrical condition.` },
    { text: incomplete, feedback: `The included points are relevant, but this response omits ${penultimate.toLocaleLowerCase()} and ${last.toLocaleLowerCase()}. Those omissions leave the stated task technically incomplete. ${foundation}` },
    { text: mixed, feedback: `This response replaces the required point “${middle}” with the misconception that the learner should ${mistakes[0]}. That changes the electrical or safety conclusion. ${foundation}` },
    { text: technicallyWrong, feedback: `This response introduces the incorrect step to ${mistakes[1]}. The answer must instead establish ${penultimate.toLocaleLowerCase()} before concluding with ${last.toLocaleLowerCase()}. ${foundation}` },
  ];
  const correctIndex = stableIndex(question.id);
  return rotate(base, correctIndex).map((choice, index) => ({ id: String.fromCharCode(65 + index), ...choice, isCorrect: index === correctIndex }));
}

const unitMeanings = new Map([
  ['ampere', 'electric current'], ['volt', 'potential difference'], ['ohm', 'resistance or impedance'], ['watt', 'real power'],
  ['joule', 'energy'], ['hertz', 'frequency'], ['coulomb', 'electric charge'], ['siemens', 'conductance'],
  ['lux', 'illuminance on a surface'], ['lumen', 'luminous flux'], ['kva', 'apparent power'], ['kvar', 'reactive power'], ['kw', 'real power'],
]);

const optionMeanings = [
  [/`?P = I\/R`?|`?R = VI`?|`?E = V\/I`?/i, 'the equation has the wrong dimensional relationship for Ohm’s law: `V = IR`, `I = V/R` and `R = V/I`'],
  [/identical quantities/i, 'power is a rate measured in watts, whereas energy is the accumulated transfer measured in joules or watt-hours'],
  [/every branch has the same current/i, 'parallel branches share voltage, but each branch current depends on its impedance'],
  [/total resistance equals the sum of branch resistances/i, 'direct addition applies to series resistance; parallel resistance uses reciprocal addition and is lower than the smallest branch resistance'],
  [/voltage is zero/i, 'a connected parallel branch has the supply potential difference across its two nodes, not zero voltage'],
  [/lower current|zero current|zero apparent power/i, 'for fixed real power and voltage, reducing power factor requires greater current and nonzero apparent power'],
  [/exact physical route of every conductor/i, 'a single-line diagram communicates functional electrical relationships; a layout or detailed wiring drawing serves a different purpose'],
  [/changing a meter range on a live circuit/i, 'changing an instrument setup on an unplanned live circuit is not a safe-isolation step and may expose the user or instrument to danger'],
  [/touching conductors to confirm deadness/i, 'human touch is never an acceptable voltage test; an appropriate proven indicator is required'],
  [/returns to the same protective device.*complete ring/i, 'that describes a ring topology, whereas a radial has one principal path extending from its protective device'],
  [/continuity tests are unnecessary/i, 'functional operation cannot reveal every open ring conductor, so the specified continuity evidence remains necessary'],
  [/incoming service cable/i, 'the incoming service cable is part of the supply path, not a spur from a ring-final arrangement'],
  [/main earthing terminal/i, 'the MET is the common protective-earthing connection point, not a branch of a ring-final circuit'],
  [/RCD test button/i, 'the RCD TEST button checks the device’s internal test mechanism; it is not a lighting control or a substitute for installation tests'],
  [/lamp lighting proves polarity/i, 'a load can operate with line and neutral functions incorrectly arranged, so operation alone does not verify polarity'],
  [/socket outlets operate|functionality proves/i, 'loads may still operate with an open CPC or an open ring leg, so operation is not evidence that the protective path is intact'],
  [/guessed by feel/i, 'torque judged by feel is uncontrolled and can leave a loose connection or damage the terminal'],
  [/maximized until the screw deforms/i, 'over-tightening can deform the terminal or conductor and reduce long-term connection reliability'],
  [/ignored on incoming conductors/i, 'high-current incoming terminations also require the specified preparation and torque; ignoring them increases heating and failure risk'],
  [/energize.*inspect|energize without inspection/i, 'energizing before the required inspection and dead tests exposes avoidable defects and reverses the safe verification sequence'],
  [/replacing parts randomly|assume correct because the part is new/i, 'component replacement without diagnosis or repeat testing neither locates the root cause nor proves the repair'],
  [/bypass(?:ing)? protection|bridge the protective device/i, 'bypassing protection removes a safety function and can expose the circuit to damaging or dangerous fault current'],
  [/skip documentation/i, 'records are part of verification evidence and support safe future identification, maintenance and fault finding'],
  [/\bRCCB\b/i, 'an RCCB detects residual current but needs separate overcurrent protection'],
  [/\bRCBO\b/i, 'an RCBO combines residual-current and overcurrent protection for its circuit'],
  [/\bMCB\b|\bfuse\b/i, 'an MCB or fuse provides overcurrent protection, not an integral residual-current function'],
  [/\bSPD\b|transient overvoltage/i, 'an SPD limits transient overvoltage; it is not a normal load switch or overcurrent device'],
  [/\bisolator\b|isolating device/i, 'an isolator establishes separation but does not by itself provide every protective function'],
  [/phase.sequence|phase rotation/i, 'phase sequence describes the order of three-phase quantities and is checked with a phase-sequence indicator'],
  [/insulation resistance/i, 'insulation resistance assesses unwanted conductive paths between selected conductor groups during an appropriate dead test'],
  [/earth.electrode resistance/i, 'earth-electrode resistance concerns the electrode-to-earth path, not circuit load current or polarity'],
  [/\bZs\b/i, '`Zs` is total earth-fault-loop impedance at the circuit point'],
  [/\bZe\b/i, '`Ze` is the external portion of earth-fault-loop impedance at the origin'],
  [/power factor/i, 'power factor is the ratio of real power to apparent power under the applicable AC model'],
  [/\blux\b/i, 'lux measures illuminance on a surface'],
  [/\blumens?\b/i, 'lumens measure luminous flux from a source or luminaire'],
  [/\bCPC\b/i, 'the CPC is part of the circuit protective fault-current path and does not carry normal load current'],
  [/bonding conductor/i, 'a protective bonding conductor limits potential differences between relevant conductive parts'],
  [/neutral/i, 'the neutral is a normal current-carrying conductor and must not be confused with the CPC'],
  [/wall switch|lamp.*off|OFF proves|showing OFF/i, 'a functional control position does not isolate every possible source or prove absence of voltage'],
  [/non-contact detector/i, 'a non-contact indication can assist screening but is not the complete approved prove-test-reprove isolation method'],
  [/colour alone|colour identification only|paint colour/i, 'colour is identification evidence, not proof of conductor function or deadness'],
  [/two cables/i, 'two cables at one point do not establish end-to-end continuity or exclude cross-connections in a ring'],
  [/appearance only|price only|wattage only|colour of the housing/i, 'a single visual or commercial property omits the electrical, environmental and performance conditions'],
  [/current rating and breaking capacity.*same|same quantity/i, 'rated current concerns normal/overload coordination, while breaking capacity concerns safe interruption of fault current'],
  [/carry normal neutral current|normal line current/i, 'normal load current belongs in the designated line and neutral conductors, not a protective path'],
  [/improve power factor|raise PF/i, 'power-factor correction manages reactive demand; it is unrelated to the requested protection, isolation or test function'],
  [/increase cable capacity|current infinite|resistance becomes zero/i, 'neither a protective device nor a physical accessory removes conductor resistance or thermal limits'],
  [/obsolete|manual artificial-respiration/i, 'obsolete resuscitation drills do not replace the current emergency-call, CPR and AED sequence'],
  [/grab|touch.*casualty/i, 'touching an energized casualty can place the rescuer in the same current path'],
  [/give water|giving food/i, 'food or water does not address continuing electrical danger, breathing or cardiac arrest'],
  [/factory/i, 'a factory is specifically outside the stated C2 building-installation scope'],
  [/high-voltage|132 kV|transmission/i, 'high-voltage transmission work is outside the stated low-voltage C2 scope'],
];

function workedMethodFor(question) {
  const title = question.title;
  if (/415 V balanced star-connected.*phase voltage/i.test(title)) return 'For a balanced star connection, `VL = sqrt(3)Vph`, so `Vph = VL/sqrt(3) = 415 V / 1.732 = 239.6 V`, approximately `240 V`. Each phase is connected from a line conductor to the star point.';
  if (/relationship is correct for a balanced star/i.test(title)) return 'Balanced-star line and phase relationships are `VL = sqrt(3)Vph` and `IL = Iph`. Line voltage is measured between lines; phase voltage is measured across one star-connected phase.';
  if (/relationship is correct for a balanced delta|In delta:/i.test(title)) return 'Balanced-delta line and phase relationships are `VL = Vph` and `IL = sqrt(3)Iph`. Each phase winding is connected directly between two line conductors.';
  if (/three-phase load draws 25 A.*apparent power/i.test(title)) return '`S = sqrt(3)VLIL = 1.732 x 415 V x 25 A = 17,970 VA`, approximately `18.0 kVA`. Apparent power determines the RMS voltage-current loading before power factor is applied.';
  if (/S = 50 kVA.*P = 40 kW/i.test(title)) return '`pf = P/S = 40 kW / 50 kVA = 0.80`. Power factor is dimensionless; the k-prefix cancels when numerator and denominator use matching scales.';
  if (/(?:4-pole.*50 Hz.*synchronous speed|synchronous speed.*4-pole.*50 Hz)/i.test(title)) return '`ns = 120f/p = (120 x 50 Hz)/4 = 1500 r/min`, where `f` is supply frequency and `p` is the number of poles.';
  if (/6-pole.*50 Hz.*synchronous speed|6-pole motor at 50 Hz/i.test(title)) return '`ns = 120f/p = (120 x 50 Hz)/6 = 1000 r/min`.';
  if (/630 kVA transformer.*415 V/i.test(title)) return 'For a balanced three-phase secondary, `IL = S/(sqrt(3)VL)`. Convert `630 kVA = 630,000 VA`, then `IL = 630,000/(1.732 x 415) = 876.5 A`, approximately `877 A`.';
  if (/50 kVAr.*capacitor bank.*415 V/i.test(title)) return 'For the balanced three-phase capacitor bank, `I = Qc/(sqrt(3)VL)`. Convert `50 kVAr = 50,000 VAr`: `I = 50,000/(1.732 x 415) = 69.6 A`.';
  if (/1420 r\/min.*slip/i.test(title)) return 'First find synchronous speed for four poles at 50 Hz: `ns = 1500 r/min`. Then `s = (ns - nr)/ns = (1500 - 1420)/1500 = 0.0533`, so percentage slip is `5.33%`.';
  if (/required correction.*pf1.*pf2/i.test(title)) return 'Convert each power factor to its phase angle: `phi1 = cos^-1(pf1)` and `phi2 = cos^-1(pf2)`. The required leading correction is `Qc = P(tan phi1 - tan phi2)`, with `P` in kilowatts giving `Qc` in kilovolt-amperes reactive when the units are kept consistent.';
  if (/100%.*I-delta-n|100%.*IΔn/i.test(title)) return 'At the rated residual operating current, `Itest = 1.0 IΔn`. Under the supplied current OSG criterion, a general-purpose non-delay device should open within `300 ms`. This is different from the non-operation requirement at `0.5 IΔn`.';
  if (/Table B6 values/i.test(title)) return 'The supplied Table B6 extract is a controlled current-reference source. Select its stated edition and cable/installation assumptions before using a tabulated value; do not combine it with a value or condition from a different edition.';
  if (/selectivity data stated up to 8 kA/i.test(title)) return 'The manufacturer’s verified selective range extends only to the stated prospective fault-current limit, `8 kA`. The device pair may coordinate selectively at or below that stated limit under its published conditions; the statement does not prove selectivity above `8 kA`.';
  if (/Ohm's law for a resistive/i.test(title)) return '`V = IR`, where `V` is voltage in volts, `I` is current in amperes and `R` is resistance in ohms. The relationship may also be rearranged as `I = V/R` or `R = V/I`.';
  if (/20 ohm and 30 ohm.*series/i.test(title)) return 'Series resistances carry the same current and add directly: `Rt = R1 + R2 = 20 ohm + 30 ohm = 50 ohm`.';
  if (/120 ohm.*240 ohm.*parallel/i.test(title)) return 'Parallel branches share the same voltage. `1/Rt = 1/120 + 1/240 = 3/240`, so `Rt = 240/3 = 80 ohm`. The result is correctly lower than the smallest branch resistance.';
  if (/240 V resistive load takes 5 A/i.test(title)) return 'For a resistive load, `P = VI`. Substitution gives `P = 240 V x 5 A = 1200 W = 1.2 kW`. This is the real power converted by the load.';
  if (/2 kW heater runs for 3 hours/i.test(title)) return 'Electrical energy is power multiplied by operating time: `E = Pt = 2 kW x 3 h = 6 kWh`. Kilowatt-hours measure energy, not instantaneous power.';
  if (/50 Hz AC supply/i.test(title)) return 'Frequency is cycles per second: `f = 50 Hz = 50 cycles/s`. One complete positive-and-negative waveform is one cycle, so it must not be counted twice.';
  if (/same real power and voltage.*lower power factor/i.test(title)) return 'For single-phase AC under the stated model, `I = P/(V x pf)`. With `P` and `V` fixed, reducing `pf` reduces the denominator, so current increases.';
  if (/12 V DC source.*6 ohm/i.test(title)) return 'Apply Ohm’s law: `I = V/R = 12 V / 6 ohm = 2 A`. The result is the current in the stated resistive branch.';
  if (/Two 12 V batteries.*series/i.test(title)) return 'For equal sources connected series-aiding, voltages add: `Vt = 12 V + 12 V = 24 V`. Reversing one source would change the result and may create an unsafe circulating-current condition.';
  if (/24 V DC load draws 3 A/i.test(title)) return 'DC power is `P = VI`. Therefore `P = 24 V x 3 A = 72 W`.';
  if (/72 W DC load operates for 10 hours/i.test(title)) return '`E = Pt = 72 W x 10 h = 720 Wh = 0.72 kWh`. Dividing watt-hours by 1000 converts them to kilowatt-hours.';
  if (/2 ohm, 3 ohm and 5 ohm.*series/i.test(title)) return '`Rt = 2 ohm + 3 ohm + 5 ohm = 10 ohm` because series resistances add.';
  if (/12 V battery supplies two 12 ohm resistors in parallel/i.test(title)) return 'Each branch has the full `12 V`, so `Ibranch = 12 V / 12 ohm = 1 A`. Branch currents add: `It = 1 A + 1 A = 2 A`.';
  if (/240 V, 60 ohm resistive load/i.test(title)) return '`I = V/R = 240 V / 60 ohm = 4 A`.';
  if (/4 mm2.*Method C|Method C table.*4 mm2/i.test(title)) return 'This is a controlled table lookup, not a value to guess from cable size alone. Under the supplied Method C table and stated conductor conditions, the tabulated current-carrying capacity is `It = 37 A`. Correction factors and the rest of the design checks are applied separately where required.';
  if (/35 C.*ambient|supplied `Ca`/i.test(title)) return 'Read the row for the stated `35 degree C` ambient and the specified `70 degree C` thermoplastic insulation in the supplied table: `Ca = 0.94`. `Ca` is dimensionless and modifies the applicable cable-capacity calculation; it is not an ampere rating.';
  if (/two grouped circuits|supplied `Cg`/i.test(title)) return 'Read the supplied grouping table for two relevant grouped circuits: `Cg = 0.80`. This dimensionless factor accounts for reduced heat dissipation when loaded circuits are grouped.';
  if (/up to and including 500 V.*insulation-resistance/i.test(title)) return 'For the explicitly supplied OSG category, select the paired test condition and acceptance value together: `500 V DC` test voltage and a minimum insulation resistance of `1.0 Mohm`. Do not combine a voltage from one row with a limit from another.';
  if (/0\.5\s*(?:x|×).*I|0\.5 x I-delta-n/i.test(title)) return 'The test current is one-half of the device rated residual operating current: `Itest = 0.5 IΔn`. Under the supplied general-purpose criterion the device should not open at this level; this check is distinct from the tests at `IΔn` and higher multiples.';
  if (/Two identical 12 V batteries connected in parallel/i.test(title)) return 'Ideal equal-voltage sources connected in parallel remain at the common source voltage, so `Vt = 12 V`, while available capacity/current capability may increase subject to compatible batteries and the actual design. `12 V + 12 V = 24 V` applies to a series-aiding connection, not this parallel connection.';
  if (/Zs.*Ze.*R1.*R2/i.test(title)) return '`Zs ≈ Ze + (R1 + R2)`, where `Ze` is the external loop contribution and `R1 + R2` is the circuit line-plus-CPC contribution. The relationship separates the supply path from the circuit path; it does not turn either term into insulation resistance.';
  if (/chest-compression rate/i.test(title)) return 'The supplied current first-aid guidance gives an adult chest-compression rate of approximately `100–120 min^-1`, meaning 100 to 120 compressions per minute. This is a rate, not the total number of compressions before reassessment or AED use.';
  return undefined;
}

function optionMeaning(value) {
  const lower = plain(value).toLocaleLowerCase();
  const unit = [...unitMeanings].find(([term]) => lower === term || lower.includes(` ${term}`));
  if (unit) return `${sentence(value)} denotes ${unit[1]}`;
  return optionMeanings.find(([pattern]) => pattern.test(value))?.[1];
}

function originalChoiceFeedback(question, option, correct) {
  const foundation = foundationFor(question);
  const method = workedMethodFor(question);
  if (option.id === question.correctOption) {
    const detail = !/^Correct option:/i.test(question.answer) && plain(question.answer).length > 4 ? ` ${sentence(question.answer, 260)}.` : '';
    return `${foundation} Applied to the stated conditions, “${sentence(correct.text)}” gives the required electrical conclusion.${detail}${method ? ` ${method}` : ''}`;
  }
  const lower = plain(option.text).toLocaleLowerCase();
  const meaning = optionMeaning(option.text);
  if (/^-?\d+(?:[,.]\d+)?(?:\s|$)/.test(lower)) return `The value “${sentence(option.text)}” does not satisfy the governing relationship for the stated data. ${method ?? foundation} The correct result is ${sentence(correct.text)}.`;
  if (meaning) return `This option is incorrect in the stated context because ${meaning}. The required answer is ${sentence(correct.text)}. ${foundation}`;
  if (/\b(always|never|only|all)\b/.test(lower)) return `The absolute claim “${sentence(option.text)}” removes conditions that must be checked in the stated installation. The defensible conclusion is ${sentence(correct.text)}. ${foundation}`;
  return `The option proposes “${sentence(option.text)}”. That is incorrect here because the governing electrical relationship or device function is “${sentence(correct.text)}”. ${foundation}`;
}

const implausibleDistractor = /decorative|CPR chart|immediate return to work|ignore the supply|operate as a dimmer|meter seal|lifting eyes|voltage becomes DC|changes AC to DC|lamp colou?r temperature|earth-electrode driving|motor slip|PF controller|sets lamp colou?r|determines room area|circuit name is short|enclosure is white|label is printed clearly|a new label|a larger earth bar|turn AC into DC|transparent|no switches/i;

function originalChoicesFor(question) {
  const profile = profileFor(question);
  const foundation = foundationFor(question);
  const replacements = mistakesFor(question, profile);
  let replacementIndex = 0;
  return question.options.map(option => {
    if (option.id === question.correctOption || !implausibleDistractor.test(option.text)) {
      return { ...option, isCorrect: option.id === question.correctOption };
    }
    const misconception = replacements[replacementIndex++ % replacements.length];
    return {
      ...option,
      text: asChoice(misconception),
      feedback: `This is incorrect because it would ${misconception}. ${foundation}`,
      isCorrect: false,
    };
  });
}

function enrich(question) {
  const choices = question.options?.length === 4
    ? originalChoicesFor(question)
    : generatedChoices(question);
  const correct = choices.find(choice => choice.isCorrect);
  if (!correct) throw new Error(`No correct choice for ${question.id}`);
  return {
    questionId: question.id,
    correctOption: correct.id,
    objective: `Choose the response that completely and safely answers “${sentence(question.title, 150)}”.`,
    foundation: foundationFor(question),
    workedMethod: workedMethodFor(question),
    options: choices.map(choice => ({
      ...choice,
      feedback: choice.feedback ?? originalChoiceFeedback(question, choice, correct),
    })),
  };
}

const retained = onlyPathway ? [] : current.questions.filter(question => !question.questionId.startsWith(`${pathway}-`));
const added = bank.questions.filter(question => question.pathway === pathway).map(enrich);
const questions = [...retained, ...added].sort((left, right) => left.questionId.localeCompare(right.questionId, undefined, { numeric: true }));
await writeFile(outputUrl, `${JSON.stringify({ schemaVersion: 1, questions }, null, 2)}\n`);
console.log(`Wrote ${added.length} individually resolved ${pathway} choice sets; total ${questions.length}.`);
