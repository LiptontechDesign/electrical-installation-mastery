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
  { pattern: /electrical-shock casualty|first-aid|CPR|AED|unresponsive and not breathing/i, foundation: 'Electrical first aid begins with scene safety: do not touch a casualty who may still be energized. Isolate or otherwise break contact safely, check response and normal breathing, call 999 or 112, begin CPR when required and use an AED as soon as it is available.', mistakes: ['touch the casualty before the electrical source is made safe', 'delay the emergency call and CPR while using an obsolete resuscitation drill', 'give food or water instead of completing the primary emergency response'] },
  { pattern: /single-line diagram|supply path|source-to-board|domestic installation|consumer unit.*sequence/i, foundation: 'A single-line diagram simplifies functional relationships. For a typical domestic arrangement it shows the supply/service protection, metering, main isolation, distribution, final-circuit protection, circuit and load in order, while the earthing, MET and CPC path is shown separately from the normal load-current path.', mistakes: ['place the meter and service protection downstream of the final load', 'show the CPC and neutral as interchangeable normal return conductors', 'omit isolation, final-circuit protection or the protective-earth relationship'] },
  { pattern: /safe isolation|isolat|prove.*dead|absence of voltage|wall switch.*OFF/i, foundation: 'Safe isolation is a controlled process, not a switch position. Identify every source, isolate the correct conductors, secure the isolating means, prove the voltage indicator, test every relevant conductor combination for absence of voltage, and re-prove the indicator. Backfeeds and stored energy must also be controlled.', mistakes: ['treat an OFF wall switch or extinguished lamp as proof that every conductor is dead', 'use conductor colour or a non-contact detector as the sole proof of isolation', 'omit the prove-test-reprove sequence for the voltage indicator'] },
  { pattern: /ring final|ring-final|spur|two cables at a socket/i, foundation: 'An intact ring final circuit has line, neutral and CPC conductors leaving and returning to the same protective point. An open leg may leave outlets working through the remaining path, so visual appearance or two cables at a socket cannot prove integrity; end-to-end and appropriate cross-connection continuity evidence is required.', mistakes: ['declare the ring healthy because each visible outlet has two cables', 'treat a spur as a second complete return path to the protective device', 'assume an open ring conductor must make every outlet immediately dead'] },
  { pattern: /two-way|intermediate switch|lighting control|switched line|polarity test|correct polarity|wrong-polarity/i, foundation: 'Normal single-pole control interrupts the line conductor so downstream equipment is not left live merely because the load is off. Two-way switches select between two travellers; an intermediate switch crosses or passes those travellers to add further control positions. Polarity and CPC continuity remain separate verification requirements.', mistakes: ['switch the neutral while leaving the line permanently connected to the load', 'use the CPC as a traveller or normal current-carrying conductor', 'treat successful lamp operation as proof of correct polarity and protective continuity'] },
  { pattern: /\b(?:Ib|In|Iz|Ca|Cg)\b/, foundation: 'Cable and wiring-system selection is a chain of checks. Establish the connected load and evidence-based maximum demand, design current and protective-device rating, installation method, tabulated capacity and correction factors; then verify corrected current capacity, voltage drop, fault protection, thermal withstand, fault duty, environment, mechanical protection, support, segregation and manufacturer limits.', mistakes: ['choose a familiar cable size from connected load or nominal current alone and skip maximum-demand evidence and installation-condition factors', 'increase the protective-device rating when voltage drop or corrected cable capacity fails', 'treat containment fill or a secure gland as proof that thermal, support, segregation and fault checks all pass'] },
  { pattern: /cable|conductor current-carrying|mm2|voltage drop|correction factor|grouping|ambient|maximum demand|connected load|diversity|thermal insulation|SWA|trunking|containment|fire stopping|gland/i, foundation: 'Cable and wiring-system selection is a chain of checks. Establish the connected load and evidence-based maximum demand, design current and protective-device rating, installation method, tabulated capacity and correction factors; then verify corrected current capacity, voltage drop, fault protection, thermal withstand, fault duty, environment, mechanical protection, support, segregation and manufacturer limits.', mistakes: ['choose a familiar cable size from connected load or nominal current alone and skip maximum-demand evidence and installation-condition factors', 'increase the protective-device rating when voltage drop or corrected cable capacity fails', 'treat containment fill or a secure gland as proof that thermal, support, segregation and fault checks all pass'] },
  { pattern: /consumer unit|main switch|neutral bar|earth bar|terminal torque|circuit labels|circuit schedule|board assembly/i, foundation: 'A consumer unit distributes the incoming supply among final circuits and coordinates isolation, overcurrent protection, residual-current protection where required, neutral and protective-conductor terminations, labeling and any surge protection. Devices and enclosure must form a verified compatible assembly. Terminations are tightened to the manufacturer’s specified torque with the correct conductor preparation, because both loose and over-tightened connections can fail.', mistakes: ['treat the neutral bar and protective-conductor bar as interchangeable normal-current paths', 'tighten every terminal by feel without the manufacturer’s torque value', 'mix unverified devices and enclosure components solely because they appear to fit'] },
  { pattern: /RCD|RCBO|RCCB|MCB|fuse|protective device|breaking capacity|SPD|selectivity|overload|short circuit/i, foundation: 'Protective functions must be distinguished. An MCB or fuse provides overcurrent protection; an RCCB provides residual-current protection but no integral overcurrent protection; an RCBO combines both. Breaking capacity concerns safe interruption of prospective fault current, an SPD limits transient overvoltage, and selectivity limits unnecessary upstream disconnection within a verified range.', mistakes: ['treat rated current, residual-current sensitivity and breaking capacity as the same rating', 'use an RCCB alone as overload and short-circuit protection', 'claim that an SPD or isolator performs the function of an overcurrent or residual-current protective device'] },
  { pattern: /earthing|bonding|\bCPC\b|\bZs\b|\bZe\b|earth-fault|\bADS\b|\bMET\b/i, foundation: 'Earthing and protective conductors provide a fault-current path so automatic disconnection can operate. `Ze` is the external earth-fault-loop impedance; `R1 + R2` is the circuit line-plus-CPC contribution; `Zs` is the total loop impedance at the point. Protective bonding limits dangerous potential differences between relevant conductive parts.', mistakes: ['treat `Ze`, `Zs`, insulation resistance and protective bonding as the same measurement', 'use the CPC as a normal neutral or line-current conductor', 'assume bonding replaces every circuit protective conductor and disconnection check'] },
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
  const profile = topicProfiles.find(item => item.pattern.test(questionText))
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
  return `“${sentence(option.text)}” substitutes a different electrical condition for the one asked about. In this case the required condition is “${sentence(correct.text)}”. ${foundation}`;
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
