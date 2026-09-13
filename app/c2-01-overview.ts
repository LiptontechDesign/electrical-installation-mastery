import { learningSections } from './learning-sections';
import type { CanonicalTerm, OverviewFormula, OverviewSection } from './overview-models';
import type { PreservedCanonicalTerm } from './standards-terms';

const stageId = 'C2-01';
const sectionId = 'c2-01-electrical-foundations';
const moduleId = 'module-01';
const foundationGroups = learningSections.filter(section => section.moduleId === moduleId);
const foundationLessonIds = [...new Set(foundationGroups.flatMap(section => section.lessonIds))];
const sourceIds = [
  'epra-c2-competencies',
  'course-c2-foundations',
  'eca-c3-load-assessment',
  'eca-c4-design-current',
  'schneider-demand-factors',
  'osg-demand-diversity',
] as const;

const reviewed = (lessonIds: string[], formulaIds: string[] = [], relatedTermIds: string[] = []): Partial<CanonicalTerm> => ({
  editorialStatus: 'reviewed',
  stageIds: [stageId],
  sectionIds: [sectionId],
  lessonIds,
  formulaIds,
  relatedTermIds,
});

export const c201TermPatches: Record<string, Partial<CanonicalTerm>> = {
  electron: {
    ...reviewed(['p01-l01'], [], ['charge', 'glossary-current']),
    practicalExample: 'In a metallic conductor, mobile electrons provide the charge carriers whose drift constitutes conventional circuit current.',
    explainAloud: 'Explain why electron drift and conventional current direction are described in opposite directions without saying that either convention changes the circuit result.',
  },
  charge: {
    ...reviewed(['p01-l04'], ['charge-current-time'], ['electron', 'glossary-current']),
    practicalExample: 'A steady current of 2 A transfers 10 C of charge in 5 s.',
    notTheSameAs: [{ termId: 'glossary-current', distinction: 'Charge is an amount of electrical property measured in coulombs; current is the rate at which charge is transferred.' }],
    explainAloud: 'Define charge, define current, then connect them with Q = It.',
  },
  'glossary-current': {
    ...reviewed(['p01-l04'], ['charge-current-time', 'ohms-law', 'electrical-power', 'single-phase-design-current'], ['charge', 'glossary-voltage', 'glossary-resistance']),
    practicalExample: 'A 240 V, 2.4 kW resistive heater takes 10 A because I = P/V for the stated unity-power-factor case.',
    notTheSameAs: [{ termId: 'glossary-voltage', distinction: 'Current is charge-transfer rate; voltage is potential difference between two points.' }],
    explainAloud: 'What physical quantity does an ammeter report, and why is current not “used up” by the first load in a series circuit?',
  },
  'glossary-voltage': {
    ...reviewed(['p01-l04'], ['ohms-law', 'electrical-power'], ['glossary-current', 'glossary-resistance']),
    practicalExample: 'A nominal 240 V single-phase supply means approximately 240 V RMS between the relevant line and neutral conductors under the stated study convention.',
    notTheSameAs: [{ termId: 'glossary-current', distinction: 'Voltage is a potential difference; current is the resulting charge-transfer rate when a conducting path and circuit conditions permit it.' }],
    explainAloud: 'Explain voltage without saying “voltage is electricity” or “voltage flows.”',
  },
  'glossary-resistance': {
    ...reviewed(['p01-l07'], ['ohms-law', 'resistance-geometry', 'series-resistance', 'parallel-resistance'], ['resistivity', 'glossary-impedance']),
    practicalExample: 'For a 24 V DC source and a 12 ohm resistor, I = 24/12 = 2 A under the stated resistive model.',
    notTheSameAs: [
      { termId: 'resistivity', distinction: 'Resistance belongs to a particular component/conductor geometry and temperature; resistivity is a material property used in R = rho L/A.' },
      { termId: 'glossary-impedance', distinction: 'Resistance is the dissipative opposition used in DC and AC models; impedance is the broader AC opposition that can also include reactance.' },
    ],
    explainAloud: 'Why can two copper conductors have different resistance even though the material resistivity is the same?',
  },
  'glossary-power': {
    ...reviewed(['p01-l16'], ['electrical-power', 'single-phase-ac-power'], ['energy', 'real-power', 'apparent-power', 'reactive-power']),
    practicalExample: 'A 2 kW heater transfers electrical energy at 2 kJ per second while it is operating.',
    notTheSameAs: [{ termId: 'energy', distinction: 'Power is the rate of energy transfer; energy is the accumulated transfer over a stated time.' }],
    explainAloud: 'Distinguish 2 kW from 2 kWh in one sentence, then give a practical example.',
  },
  'sine-wave': {
    ...reviewed(['p01-l21'], ['frequency-period', 'sinusoidal-rms'], ['alternating-current', 'frequency', 'rms-value', 'phase-angle']),
    practicalExample: 'On a 50 Hz sinusoidal supply, one complete cycle takes 20 ms.',
    explainAloud: 'Describe amplitude, period and frequency on a sine wave and state what 50 Hz means.',
  },
  'power-factor': {
    ...reviewed(['supp-ac-theory-23'], ['single-phase-ac-power', 'single-phase-design-current'], ['real-power', 'apparent-power', 'reactive-power', 'power-triangle']),
    practicalExample: 'For a fixed 2.4 kW load at 240 V, reducing power factor from 1.0 to 0.8 raises current from 10 A to 12.5 A in the simple single-phase model.',
    notTheSameAs: [{ termId: 'power-triangle', distinction: 'Power factor is the ratio P/S; the power triangle is a graphical relationship among P, Q and S.' }],
    explainAloud: 'Why can poor power factor increase current without increasing the useful real power of the load?',
  },
  'glossary-impedance': {
    ...reviewed(['p01-l24'], ['series-impedance'], ['glossary-resistance', 'reactance', 'phase-angle']),
    practicalExample: 'A series AC load can have 8 ohm resistance and 6 ohm net reactance, giving an impedance magnitude of 10 ohm.',
    notTheSameAs: [{ termId: 'glossary-resistance', distinction: 'Resistance is the real/dissipative component; impedance combines resistance and reactance and also has phase information.' }],
    explainAloud: 'Explain why a coil can oppose AC by more than its measured DC resistance alone would suggest.',
  },
  'glossary-maximum-demand': {
    ...reviewed(['p06-l11'], ['demand-factor', 'coincidence-diversity'], ['connected-load', 'duty-cycle', 'glossary-diversity', 'utilization-factor', 'coincidence-factor']),
    sourceIds: ['course-vocabulary', 'course-c2-foundations', 'eca-c3-load-assessment', 'schneider-demand-factors', 'osg-demand-diversity'],
    practicalExample: 'A premises can have 20 kW of connected equipment while its assessed simultaneous maximum demand is only 12 kW because not every load reaches its individual maximum at the same time.',
    explainAloud: 'Why is maximum demand not automatically equal to the arithmetic sum of all connected nameplate ratings?',
  },
  'glossary-diversity': {
    ...reviewed(['p06-l11'], ['coincidence-diversity'], ['connected-load', 'glossary-maximum-demand', 'coincidence-factor', 'utilization-factor']),
    sourceIds: ['course-vocabulary', 'course-c2-foundations', 'eca-c3-load-assessment', 'schneider-demand-factors', 'osg-demand-diversity'],
    practicalExample: 'If two individual loads each reach 8 kW maximum but their group maximum is 12 kW, the coincidence factor is 12/16 = 0.75 and the reciprocal diversity factor is about 1.33.',
    explainAloud: 'State the convention you are using before giving a numerical “diversity factor.” Why is that necessary?',
  },
  ib: {
    ...reviewed(['p06-l01'], ['single-phase-design-current'], ['connected-load', 'power-factor', 'glossary-maximum-demand']),
    sourceIds: ['course-vocabulary', 'course-c2-foundations', 'eca-c4-design-current'],
    practicalExample: 'For a 2.4 kW single-phase load at 240 V and PF 0.8, Ib = 2400/(240 x 0.8) = 12.5 A.',
    explainAloud: 'Start with load power, voltage/system and power factor, then explain how they determine design current Ib.',
  },
};

const newTerm = (
  id: string,
  term: string,
  aliases: string[],
  standardsMeaning: string,
  plainMeaning: string,
  category: string,
  options: Partial<PreservedCanonicalTerm> = {},
): PreservedCanonicalTerm => ({
  id,
  term,
  aliases,
  definition: standardsMeaning,
  category,
  authority: 'explanatory-definition',
  editorialStatus: 'reviewed',
  standardsMeaning,
  plainMeaning,
  practicalExample: options.practicalExample,
  notTheSameAs: options.notTheSameAs ?? [],
  relatedTermIds: options.relatedTermIds ?? [],
  sourceIds: options.sourceIds ?? ['course-c2-foundations'],
  formulaIds: options.formulaIds ?? [],
  stageIds: [stageId],
  sectionIds: [sectionId],
  lessonIds: options.lessonIds ?? [],
  kenyaStatus: options.kenyaStatus ?? 'check-kenyan-requirement',
  explainAloud: options.explainAloud,
  contrast: options.contrast,
  unit: options.unit,
  formula: options.formula,
  formulaTex: options.formulaTex,
  formulaNote: options.formulaNote,
});

export const c201AdditionalTerms: PreservedCanonicalTerm[] = [
  newTerm('energy', 'Energy', ['electrical energy', 'kwh', 'kilowatt-hour'], 'Energy is the quantity transferred or converted over time; electrical energy is commonly calculated from power multiplied by time.', 'Power tells you how fast energy is being transferred. Energy tells you how much transfer accumulated during the stated time.', 'Science', {
    unit: 'J or kWh', formula: 'E = Pt', formulaIds: ['energy-from-power'], relatedTermIds: ['glossary-power'],
    notTheSameAs: [{ termId: 'glossary-power', distinction: 'Energy accumulates over time; power is the rate of that transfer.' }], lessonIds: ['p01-l16'],
    practicalExample: 'A 2 kW heater running for 3 h uses 6 kWh of electrical energy.', explainAloud: 'Explain why a device can have a 2 kW power rating without “containing 2 kWh.”',
  }),
  newTerm('direct-current', 'Direct current (DC)', ['dc', 'direct current'], 'Direct current has a unidirectional reference direction; in steady DC its magnitude is constant, although DC need not always be perfectly constant.', 'The polarity does not alternate back and forth as it does in AC. A battery-fed resistive circuit is the simplest study example.', 'Science', {
    relatedTermIds: ['alternating-current', 'glossary-current', 'glossary-voltage'],
    notTheSameAs: [{ termId: 'alternating-current', distinction: 'DC keeps one reference polarity/direction; AC reverses periodically.' }],
    practicalExample: 'A 24 V battery supplying a resistor is treated as a DC source in the basic circuit model.', explainAloud: 'Give one electrical difference between steady DC and 50 Hz AC that matters to circuit behavior.',
  }),
  newTerm('alternating-current', 'Alternating current (AC)', ['ac', 'alternating current'], 'Alternating current reverses direction periodically; AC voltage likewise changes polarity with time according to its waveform.', 'The supply quantity repeats and reverses. Frequency tells you how many cycles occur each second.', 'Science', {
    relatedTermIds: ['direct-current', 'sine-wave', 'frequency', 'rms-value', 'phase-angle'],
    notTheSameAs: [{ termId: 'direct-current', distinction: 'AC reverses periodically; DC retains one reference direction/polarity.' }],
    practicalExample: 'The course uses 50 Hz for Kenyan low-voltage calculations unless a question states otherwise.', explainAloud: 'What does 50 Hz tell you about an AC waveform, and what does it not tell you about its voltage magnitude?',
  }),
  newTerm('frequency', 'Frequency', ['frequency', 'hz', 'hertz'], 'Frequency is the number of complete periodic cycles per second.', 'It tells you how quickly an AC waveform repeats. One hertz means one cycle each second.', 'Science', {
    unit: 'Hz', formula: 'f = 1/T', formulaIds: ['frequency-period'], relatedTermIds: ['sine-wave', 'alternating-current', 'phase-angle'], lessonIds: ['p01-l21'],
    practicalExample: 'At 50 Hz, T = 1/50 = 0.02 s = 20 ms.', explainAloud: 'Convert 50 Hz into period and state the unit of each quantity.',
  }),
  newTerm('single-phase', 'Single-phase supply', ['single phase', 'single-phase', '1 phase', '1φ'], 'A single-phase AC supply provides one alternating phase quantity to the load; in the course C2 calculations the nominal study value is 240 V, 50 Hz unless stated otherwise.', 'For C2, think of the ordinary low-voltage line-to-neutral supply used for single-phase building circuits. Always verify the actual supply on real work.', 'Science', {
    relatedTermIds: ['alternating-current', 'glossary-voltage', 'frequency', 'ib'],
    practicalExample: 'A 2.4 kW unity-power-factor load on the 240 V study supply takes 10 A.', explainAloud: 'State the course single-phase calculation convention and explain why it is still necessary to verify the actual supply in practice.',
  }),
  newTerm('series-circuit', 'Series circuit', ['series circuit', 'series'], 'In a series path the same current passes through each series element; the supply voltage is shared across the elements and the resistances add in the simple resistive model.', 'There is one current path through the series elements.', 'Science', {
    formulaIds: ['series-resistance'], relatedTermIds: ['parallel-circuit', 'glossary-current', 'glossary-voltage', 'glossary-resistance'], lessonIds: ['p01-l11'],
    notTheSameAs: [{ termId: 'parallel-circuit', distinction: 'Series elements share the same current; parallel branches share the same voltage.' }],
    practicalExample: 'Two 10 ohm resistors in series give 20 ohm total resistance.', explainAloud: 'Why does opening one element in a simple series path stop current through all the other series elements?',
  }),
  newTerm('parallel-circuit', 'Parallel circuit', ['parallel circuit', 'parallel'], 'Parallel branches are connected between the same pair of nodes, so each branch has the same voltage; total current is the sum of branch currents.', 'Each branch sees the same node-to-node voltage and provides another current path.', 'Science', {
    formulaIds: ['parallel-resistance'], relatedTermIds: ['series-circuit', 'glossary-current', 'glossary-voltage', 'glossary-resistance'], lessonIds: ['p01-l11'],
    notTheSameAs: [{ termId: 'series-circuit', distinction: 'Parallel branches share voltage; series elements share current.' }],
    practicalExample: 'Two 12 ohm resistors in parallel across 12 V each take 1 A, so the source supplies 2 A and sees 6 ohm equivalent resistance.', explainAloud: 'Why does adding another finite-resistance branch in parallel reduce the equivalent resistance seen by the source?',
  }),
  newTerm('resistivity', 'Resistivity', ['resistivity', 'rho', 'ρ'], 'Resistivity is a material property used with conductor length and cross-sectional area to determine resistance at the stated temperature.', 'It describes how strongly the material itself resists current, separate from the conductor dimensions.', 'Science', {
    unit: 'ohm m', formula: 'R = rho L/A', formulaIds: ['resistance-geometry'], relatedTermIds: ['glossary-resistance'], lessonIds: ['supp-resistance-06'],
    practicalExample: 'For the same material and temperature, doubling conductor length doubles resistance while doubling cross-sectional area halves it.', explainAloud: 'Separate material resistivity from the resistance of one actual conductor.',
  }),
  newTerm('magnetic-field', 'Magnetic field', ['magnetic field', 'magnetism'], 'A magnetic field is the region in which magnetic forces and electromagnetic interactions are represented; electric current produces a magnetic field around a conductor.', 'Current and magnetism are linked. That link is the foundation for relays, motors, transformers and many measuring devices.', 'Science', {
    relatedTermIds: ['electromagnetic-induction', 'transformer', 'inductance'], lessonIds: ['p01-l18'],
    practicalExample: 'A current-carrying coil produces a magnetic field whose strength depends on the circuit and coil arrangement.', explainAloud: 'Give one installation device whose operation depends on the magnetic effect of current.',
  }),
  newTerm('electromagnetic-induction', 'Electromagnetic induction', ['induction', 'electromagnetic induction', 'faraday'], 'A changing magnetic flux linking a conductor or winding induces an electromotive force; the magnitude and polarity depend on the rate and direction of flux change and the winding arrangement.', 'Changing magnetism can create a voltage in a conductor. Transformers depend on this effect.', 'Science', {
    relatedTermIds: ['magnetic-field', 'transformer', 'alternating-current'], lessonIds: ['p01-l18'],
    practicalExample: 'An AC current in a transformer primary creates changing flux that induces voltage in the secondary.', explainAloud: 'Why does a normal transformer need changing flux rather than steady DC after the transient has ended?',
  }),
  newTerm('transformer', 'Transformer', ['transformer', 'primary', 'secondary'], 'A transformer transfers AC electrical energy between windings by electromagnetic induction, with voltage/current relationships governed by the winding ratio and losses.', 'Two or more windings share changing magnetic flux so AC voltage can be stepped up or down without a direct conductive connection between windings in the basic isolated model.', 'Science', {
    relatedTermIds: ['electromagnetic-induction', 'magnetic-field', 'alternating-current'], lessonIds: ['p01-transformers'],
    practicalExample: 'An ideal 10:1 turns ratio gives approximately one tenth of the primary voltage at the secondary.', explainAloud: 'Explain the energy path through a transformer without saying that current jumps directly from primary conductor to secondary conductor.',
  }),
  newTerm('inductance', 'Inductance', ['inductance', 'henry', 'coil'], 'Inductance is the property of a circuit or coil by which a change in current produces an induced voltage that opposes the change.', 'A coil resists changes in current because its changing magnetic field induces a counter-voltage.', 'Science', {
    unit: 'H', formulaIds: ['inductive-reactance'], relatedTermIds: ['magnetic-field', 'inductive-reactance', 'reactance'],
    practicalExample: 'At higher frequency, the same inductance has greater inductive reactance.', explainAloud: 'Why does a coil oppose changes in current rather than simply behaving like a fixed resistor?',
  }),
  newTerm('capacitance', 'Capacitance', ['capacitance', 'farad', 'capacitor'], 'Capacitance is the ability of a system to store separated electric charge for a given voltage.', 'A capacitor stores energy in an electric field and its AC opposition depends on frequency and capacitance.', 'Science', {
    unit: 'F', formulaIds: ['capacitive-reactance'], relatedTermIds: ['capacitive-reactance', 'reactance'],
    practicalExample: 'Increasing capacitance reduces capacitive reactance at a fixed AC frequency.', explainAloud: 'State what a capacitor stores and why its opposition to AC changes with frequency.',
  }),
  newTerm('reactance', 'Reactance', ['reactance', 'x', 'inductive opposition', 'capacitive opposition'], 'Reactance is the frequency-dependent opposition associated with inductance or capacitance in an AC circuit; it contributes to impedance and phase displacement without representing the same dissipative effect as resistance.', 'Reactance is the AC opposition caused by energy storage in magnetic or electric fields.', 'Science', {
    unit: 'ohm', relatedTermIds: ['inductive-reactance', 'capacitive-reactance', 'glossary-impedance', 'glossary-resistance'],
    notTheSameAs: [{ termId: 'glossary-resistance', distinction: 'Resistance dissipates real power in the simple model; ideal reactance stores and returns energy and creates phase displacement.' }],
    practicalExample: 'A coil can have 4 ohm winding resistance and an additional frequency-dependent inductive reactance.', explainAloud: 'Distinguish resistance, reactance and impedance in one coherent explanation.',
  }),
  newTerm('inductive-reactance', 'Inductive reactance', ['xl', 'x_l', 'inductive reactance'], 'Inductive reactance is the magnitude of AC opposition produced by inductance: XL = 2 pi f L for the sinusoidal steady-state model.', 'Higher frequency or higher inductance gives greater AC opposition from an inductor.', 'Science', {
    unit: 'ohm', formula: 'XL = 2 pi f L', formulaIds: ['inductive-reactance'], relatedTermIds: ['inductance', 'reactance', 'glossary-impedance'], lessonIds: ['supp-ac-theory-08'],
    practicalExample: 'For L = 0.1 H at 50 Hz, XL is about 31.4 ohm.', explainAloud: 'If frequency doubles while inductance stays constant, what happens to XL and why?',
  }),
  newTerm('capacitive-reactance', 'Capacitive reactance', ['xc', 'x_c', 'capacitive reactance'], 'Capacitive reactance is the magnitude of AC opposition produced by capacitance: XC = 1/(2 pi f C) for the sinusoidal steady-state model.', 'Higher frequency or larger capacitance gives a smaller capacitive reactance.', 'Science', {
    unit: 'ohm', formula: 'XC = 1/(2 pi f C)', formulaIds: ['capacitive-reactance'], relatedTermIds: ['capacitance', 'reactance', 'glossary-impedance'], lessonIds: ['supp-ac-theory-08'],
    practicalExample: 'Doubling frequency halves XC when capacitance is unchanged.', explainAloud: 'Why do XL and XC move in opposite directions as frequency rises?',
  }),
  newTerm('phasor', 'Phasor', ['phasor', 'phasor diagram'], 'A phasor is a rotating-vector representation used to show the magnitude and relative phase of sinusoidal quantities of the same frequency.', 'It lets you compare AC quantities by magnitude and angle without drawing the full waveform every time.', 'Science', {
    relatedTermIds: ['phase-angle', 'alternating-current', 'rms-value'], lessonIds: ['supp-ac-theory-11'],
    practicalExample: 'A current phasor can lag a voltage phasor in an inductive load.', explainAloud: 'What information does a phasor preserve from a sine wave, and what detail does it intentionally omit?',
  }),
  newTerm('phase-angle', 'Phase angle', ['phase angle', 'phi', 'φ'], 'Phase angle is the angular displacement between sinusoidal quantities of the same frequency.', 'It tells you how far one AC waveform leads or lags another.', 'Science', {
    unit: 'degrees or rad', relatedTermIds: ['phasor', 'power-factor', 'reactance'], lessonIds: ['supp-ac-theory-11'],
    practicalExample: 'For a sinusoidal load with displacement power factor 0.8, the corresponding angle magnitude is cos^-1(0.8) about 36.9 degrees.', explainAloud: 'Explain the difference between amplitude difference and phase difference.',
  }),
  newTerm('rms-value', 'RMS value', ['rms', 'root mean square', 'effective value'], 'The RMS value of an alternating quantity is the value that produces the same heating effect in a resistor as the stated DC value; for a pure sine wave Vrms = Vpeak/sqrt(2).', 'RMS is the effective magnitude normally used for AC voltage and current ratings.', 'Science', {
    formulaIds: ['sinusoidal-rms'], relatedTermIds: ['sine-wave', 'alternating-current', 'glossary-voltage', 'glossary-current'],
    practicalExample: 'A sine wave with about 339 V peak has about 240 V RMS.', explainAloud: 'Why is the 240 V study supply not the peak of the sine wave?',
  }),
  newTerm('real-power', 'Real power', ['real power', 'active power', 'kw'], 'Real power P is the average rate at which electrical energy is converted to useful work, heat or other net energy transfer in the load.', 'This is the kW that actually becomes useful output and losses.', 'Science', {
    unit: 'W or kW', formulaIds: ['single-phase-ac-power'], relatedTermIds: ['glossary-power', 'apparent-power', 'reactive-power', 'power-factor', 'power-triangle'], lessonIds: ['supp-ac-theory-23'],
    practicalExample: 'A load taking 3 kVA at PF 0.8 consumes 2.4 kW real power.', explainAloud: 'Why is kW not interchangeable with kVA when power factor is below 1?',
  }),
  newTerm('reactive-power', 'Reactive power', ['reactive power', 'kvar', 'var'], 'Reactive power Q represents the alternating exchange of energy associated with electric and magnetic fields in AC systems under the stated sinusoidal model.', 'Reactive power does not represent net useful energy conversion, but it still contributes to current and apparent power.', 'Science', {
    unit: 'var or kVAr', formulaIds: ['single-phase-ac-power'], relatedTermIds: ['real-power', 'apparent-power', 'power-factor', 'power-triangle'], lessonIds: ['supp-ac-theory-23'],
    practicalExample: 'For S = 3 kVA and P = 2.4 kW, Q = 1.8 kVAr in the simple power-triangle model.', explainAloud: 'Explain why reactive power can increase current even though it is not the load’s net useful kW.',
  }),
  newTerm('apparent-power', 'Apparent power', ['apparent power', 'kva', 'va'], 'Apparent power S is the product of RMS voltage and RMS current in the single-phase AC model; it combines the real and reactive components of load demand.', 'kVA tells you how much voltage-current capacity the source and conductors must support, regardless of how much becomes useful kW.', 'Science', {
    unit: 'VA or kVA', formulaIds: ['single-phase-ac-power'], relatedTermIds: ['real-power', 'reactive-power', 'power-factor', 'power-triangle'], lessonIds: ['supp-ac-theory-23'],
    practicalExample: '240 V x 12.5 A = 3.0 kVA apparent power.', explainAloud: 'Why are conductors and supplies affected by kVA/current even when the useful real power is lower?',
  }),
  newTerm('power-triangle', 'Power triangle', ['power triangle', 'p q s triangle'], 'For sinusoidal steady-state conditions, the power triangle represents the relationship S^2 = P^2 + Q^2 between apparent, real and reactive power.', 'It is a right-triangle model linking kW, kVAr and kVA.', 'Science', {
    formulaIds: ['single-phase-ac-power'], relatedTermIds: ['real-power', 'reactive-power', 'apparent-power', 'power-factor'], lessonIds: ['p01-pf-visual'],
    practicalExample: 'P = 2.4 kW and Q = 1.8 kVAr give S = 3.0 kVA.', explainAloud: 'Draw the power triangle verbally: which side is P, which is Q, which is S, and where does power factor fit?',
  }),
  newTerm('connected-load', 'Connected load', ['connected load', 'installed load'], 'Connected load is the sum of the ratings of the loads connected to the installation on a consistent stated basis before applying diversity.', 'Add the installed loads first. Do not reduce the sum just because they are unlikely to run together.', 'Design', {
    sourceIds: ['course-c2-foundations', 'eca-c3-load-assessment', 'schneider-demand-factors'], relatedTermIds: ['glossary-maximum-demand', 'duty-cycle', 'demand-factor', 'utilization-factor', 'coincidence-factor', 'glossary-diversity'], lessonIds: ['p06-l11'],
    practicalExample: 'Two 10 kW installed loads give 20 kW connected load even if their group maximum demand is only 12 kW.', explainAloud: 'Why must connected load be established before diversity is applied?',
  }),
  newTerm('duty-cycle', 'Duty cycle', ['duty cycle', 'duty'], 'Duty cycle describes a repeated sequence of operating and rest conditions, or the proportion of time equipment operates within a stated cycle.', 'It tells you how the load actually runs over time, not just its nameplate rating.', 'Design', {
    sourceIds: ['course-c2-foundations', 'eca-c3-load-assessment'], relatedTermIds: ['connected-load', 'glossary-maximum-demand', 'utilization-factor'], lessonIds: ['p06-l11'],
    practicalExample: 'A heater energized 6 minutes in every 10 minutes has a 60% time duty in that simplified cycle description.', explainAloud: 'How can two loads with the same kW rating create different demand because of duty cycle?',
  }),
  newTerm('demand-factor', 'Demand factor', ['demand factor'], 'Demand factor is maximum demand divided by connected load, using the same units and assessment basis.', 'It compares the greatest simultaneous demand with the total installed load.', 'Design', {
    formulaIds: ['demand-factor'], sourceIds: ['course-c2-foundations', 'eca-c3-load-assessment'], relatedTermIds: ['connected-load', 'glossary-maximum-demand'], lessonIds: ['p06-l11'],
    practicalExample: 'If connected load is 20 kW and group maximum demand is 12 kW, demand factor = 12/20 = 0.60.', explainAloud: 'State the numerator and denominator before calculating a demand factor.',
  }),
  newTerm('utilization-factor', 'Utilization factor', ['utilization factor', 'utilisation factor', 'ku'], 'Utilization factor ku expresses an individual load’s assessed operating demand relative to its nominal/rated load on the stated basis.', 'A machine often operates below its nameplate maximum; ku expresses that relationship for the load assessment.', 'Design', {
    formulaIds: ['utilization-factor'], sourceIds: ['course-c2-foundations', 'schneider-demand-factors'], relatedTermIds: ['connected-load', 'duty-cycle', 'coincidence-factor', 'glossary-diversity'], lessonIds: ['p06-l11'],
    practicalExample: 'A 10 kW load assessed to operate at 8 kW has ku = 8/10 = 0.8 on that stated basis.', explainAloud: 'Why must utilization of one load not be confused with coincidence among several loads?',
  }),
  newTerm('coincidence-factor', 'Coincidence factor', ['coincidence factor', 'simultaneity factor', 'ks'], 'Coincidence factor ks is the simultaneous maximum demand of a group divided by the sum of the individual maximum demands over the same stated period; by this convention it is at most 1.', 'It asks how much of the individual peaks happen together.', 'Design', {
    formulaIds: ['coincidence-diversity'], sourceIds: ['course-c2-foundations', 'schneider-demand-factors'], relatedTermIds: ['glossary-diversity', 'utilization-factor', 'glossary-maximum-demand'], lessonIds: ['p06-l11'],
    notTheSameAs: [{ termId: 'glossary-diversity', distinction: 'Under the reciprocal convention used here, diversity factor = 1/ks. Some publications loosely use “diversity” for ks, so always state the convention.' }],
    practicalExample: 'Individual maxima of 8 kW + 8 kW with a simultaneous group maximum of 12 kW give ks = 12/16 = 0.75.', explainAloud: 'Why is coincidence calculated from individual maxima rather than connected load?',
  }),
];

export const c201Formulas: OverviewFormula[] = [
  {
    id: 'charge-current-time', expression: 'Q = I t',
    assumptions: ['Use when current is constant over the stated interval; otherwise charge is the time integral of current.'],
    variables: [
      { symbol: 'Q', meaning: 'charge transferred', unit: 'C', termId: 'charge' },
      { symbol: 'I', meaning: 'current', unit: 'A', termId: 'glossary-current' },
      { symbol: 't', meaning: 'time interval', unit: 's' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'ohms-law', expression: 'V = I R',
    assumptions: ['Apply to an ohmic/resistive element under conditions where resistance can be treated as constant.'],
    variables: [
      { symbol: 'V', meaning: 'potential difference', unit: 'V', termId: 'glossary-voltage' },
      { symbol: 'I', meaning: 'current', unit: 'A', termId: 'glossary-current' },
      { symbol: 'R', meaning: 'resistance', unit: 'ohm', termId: 'glossary-resistance' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'resistance-geometry', expression: 'R = rho L / A',
    assumptions: ['Use the resistivity appropriate to the material and stated temperature; conductor geometry must be represented consistently.'],
    variables: [
      { symbol: 'R', meaning: 'conductor resistance', unit: 'ohm', termId: 'glossary-resistance' },
      { symbol: 'rho', meaning: 'material resistivity', unit: 'ohm m', termId: 'resistivity' },
      { symbol: 'L', meaning: 'conductor length', unit: 'm' },
      { symbol: 'A', meaning: 'cross-sectional area', unit: 'm2' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'series-resistance', expression: 'R_total = R1 + R2 + ... + Rn',
    assumptions: ['Applies to resistors in one series current path.'],
    variables: [
      { symbol: 'R_total', meaning: 'equivalent series resistance', unit: 'ohm', termId: 'glossary-resistance' },
      { symbol: 'R1...Rn', meaning: 'individual series resistances', unit: 'ohm' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'parallel-resistance', expression: '1 / R_total = 1/R1 + 1/R2 + ... + 1/Rn',
    assumptions: ['Applies to resistive branches connected across the same two nodes.'],
    variables: [
      { symbol: 'R_total', meaning: 'equivalent parallel resistance', unit: 'ohm', termId: 'glossary-resistance' },
      { symbol: 'R1...Rn', meaning: 'individual branch resistances', unit: 'ohm' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'electrical-power', expression: 'P = V I = I^2 R = V^2 / R',
    assumptions: ['The equivalent resistive forms apply to the stated resistive/DC or unity-power-factor condition. For general AC real power include power factor.'],
    variables: [
      { symbol: 'P', meaning: 'real/electrical power', unit: 'W', termId: 'glossary-power' },
      { symbol: 'V', meaning: 'voltage', unit: 'V', termId: 'glossary-voltage' },
      { symbol: 'I', meaning: 'current', unit: 'A', termId: 'glossary-current' },
      { symbol: 'R', meaning: 'resistance', unit: 'ohm', termId: 'glossary-resistance' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'energy-from-power', expression: 'E = P t',
    assumptions: ['Power must be constant over the stated interval, or use the appropriate time integration/energy record. Keep units consistent.'],
    variables: [
      { symbol: 'E', meaning: 'energy transferred', unit: 'J, Wh or kWh', termId: 'energy' },
      { symbol: 'P', meaning: 'power', unit: 'W or kW', termId: 'glossary-power' },
      { symbol: 't', meaning: 'time', unit: 's or h' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'frequency-period', expression: 'f = 1 / T',
    assumptions: ['Applies to a periodic waveform with one period T per cycle.'],
    variables: [
      { symbol: 'f', meaning: 'frequency', unit: 'Hz', termId: 'frequency' },
      { symbol: 'T', meaning: 'period', unit: 's' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'sinusoidal-rms', expression: 'V_rms = V_peak / sqrt(2);  I_rms = I_peak / sqrt(2)',
    assumptions: ['These sqrt(2) relationships apply to a pure sine wave.'],
    variables: [
      { symbol: 'V_rms', meaning: 'RMS voltage', unit: 'V', termId: 'rms-value' },
      { symbol: 'V_peak', meaning: 'peak voltage', unit: 'V' },
      { symbol: 'I_rms', meaning: 'RMS current', unit: 'A', termId: 'rms-value' },
      { symbol: 'I_peak', meaning: 'peak current', unit: 'A' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'inductive-reactance', expression: 'X_L = 2 pi f L',
    assumptions: ['Sinusoidal steady-state AC model; L is treated as the stated inductance.'],
    variables: [
      { symbol: 'X_L', meaning: 'inductive reactance', unit: 'ohm', termId: 'inductive-reactance' },
      { symbol: 'f', meaning: 'frequency', unit: 'Hz', termId: 'frequency' },
      { symbol: 'L', meaning: 'inductance', unit: 'H', termId: 'inductance' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'capacitive-reactance', expression: 'X_C = 1 / (2 pi f C)',
    assumptions: ['Sinusoidal steady-state AC model; C is treated as the stated capacitance.'],
    variables: [
      { symbol: 'X_C', meaning: 'capacitive reactance', unit: 'ohm', termId: 'capacitive-reactance' },
      { symbol: 'f', meaning: 'frequency', unit: 'Hz', termId: 'frequency' },
      { symbol: 'C', meaning: 'capacitance', unit: 'F', termId: 'capacitance' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'series-impedance', expression: '|Z| = sqrt(R^2 + X^2)',
    assumptions: ['Simple series R-X sinusoidal model; X is the net reactance with sign/phase handled consistently.'],
    variables: [
      { symbol: '|Z|', meaning: 'impedance magnitude', unit: 'ohm', termId: 'glossary-impedance' },
      { symbol: 'R', meaning: 'resistance', unit: 'ohm', termId: 'glossary-resistance' },
      { symbol: 'X', meaning: 'net reactance', unit: 'ohm', termId: 'reactance' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'single-phase-ac-power', expression: 'S = V I;  P = V I PF;  Q = sqrt(S^2 - P^2);  PF = P/S',
    assumptions: ['Single-phase RMS quantities under the stated AC model; the P-Q-S triangle relation assumes the usual sinusoidal steady-state treatment.'],
    variables: [
      { symbol: 'S', meaning: 'apparent power', unit: 'VA', termId: 'apparent-power' },
      { symbol: 'P', meaning: 'real power', unit: 'W', termId: 'real-power' },
      { symbol: 'Q', meaning: 'reactive power', unit: 'var', termId: 'reactive-power' },
      { symbol: 'V', meaning: 'RMS voltage', unit: 'V', termId: 'glossary-voltage' },
      { symbol: 'I', meaning: 'RMS current', unit: 'A', termId: 'glossary-current' },
      { symbol: 'PF', meaning: 'power factor', unit: 'dimensionless', termId: 'power-factor' },
    ], sourceIds: ['course-c2-foundations'],
  },
  {
    id: 'single-phase-design-current', expression: 'I_b = P / (V PF)',
    assumptions: ['Single-phase load; P and V use a consistent basis; include power factor when it is relevant to the stated load.'],
    variables: [
      { symbol: 'I_b', meaning: 'design current', unit: 'A', termId: 'ib' },
      { symbol: 'P', meaning: 'real input power', unit: 'W', termId: 'real-power' },
      { symbol: 'V', meaning: 'single-phase RMS voltage', unit: 'V', termId: 'glossary-voltage' },
      { symbol: 'PF', meaning: 'power factor', unit: 'dimensionless', termId: 'power-factor' },
    ], sourceIds: ['course-c2-foundations', 'eca-c4-design-current'],
  },
  {
    id: 'demand-factor', expression: 'k_d = D_max / P_connected',
    assumptions: ['Numerator and denominator must use the same units and stated assessment basis. Do not apply the same reduction twice.'],
    variables: [
      { symbol: 'k_d', meaning: 'demand factor', unit: 'dimensionless', termId: 'demand-factor' },
      { symbol: 'D_max', meaning: 'maximum demand', unit: 'W, kW, VA or kVA on stated basis', termId: 'glossary-maximum-demand' },
      { symbol: 'P_connected', meaning: 'connected load on same basis', unit: 'W, kW, VA or kVA', termId: 'connected-load' },
    ], sourceIds: ['course-c2-foundations', 'eca-c3-load-assessment'],
  },
  {
    id: 'utilization-factor', expression: 'k_u = P_operating / P_rated',
    assumptions: ['Use a clearly defined operating/rated basis for the individual load.'],
    variables: [
      { symbol: 'k_u', meaning: 'utilization factor', unit: 'dimensionless', termId: 'utilization-factor' },
      { symbol: 'P_operating', meaning: 'assessed operating demand', unit: 'W or kW' },
      { symbol: 'P_rated', meaning: 'nominal/rated load', unit: 'W or kW' },
    ], sourceIds: ['course-c2-foundations', 'schneider-demand-factors'],
  },
  {
    id: 'coincidence-diversity', expression: 'k_s = D_group / sum(D_i);  F_div = 1 / k_s',
    assumptions: ['The group and individual maxima must refer to the same stated period/basis. This guide declares the reciprocal diversity convention explicitly because terminology varies between publications.'],
    variables: [
      { symbol: 'k_s', meaning: 'coincidence factor', unit: 'dimensionless', termId: 'coincidence-factor' },
      { symbol: 'D_group', meaning: 'simultaneous group maximum demand', unit: 'W, kW, VA or kVA' },
      { symbol: 'sum(D_i)', meaning: 'sum of individual maximum demands', unit: 'same as D_group' },
      { symbol: 'F_div', meaning: 'reciprocal diversity factor', unit: 'dimensionless', termId: 'glossary-diversity' },
    ], sourceIds: ['course-c2-foundations', 'schneider-demand-factors'],
  },
];

const termIds = [
  'electron', 'charge', 'glossary-current', 'glossary-voltage', 'glossary-resistance', 'energy',
  'direct-current', 'alternating-current', 'frequency', 'single-phase', 'series-circuit', 'parallel-circuit',
  'resistivity', 'magnetic-field', 'electromagnetic-induction', 'transformer', 'inductance', 'capacitance',
  'reactance', 'inductive-reactance', 'capacitive-reactance', 'glossary-impedance', 'sine-wave', 'phasor',
  'phase-angle', 'rms-value', 'glossary-power', 'real-power', 'reactive-power', 'apparent-power', 'power-triangle',
  'power-factor', 'connected-load', 'duty-cycle', 'glossary-maximum-demand', 'demand-factor',
  'utilization-factor', 'coincidence-factor', 'glossary-diversity', 'ib',
];

export const c201Sections: OverviewSection[] = [{
  id: sectionId,
  stageId,
  moduleId,
  learningSectionIds: foundationGroups.map(section => section.id),
  title: 'Electrical Foundations',
  status: 'reviewed',
  lessonIds: foundationLessonIds,
  termIds,
  sourceIds: [...sourceIds, 'osg-safe-testing'],
  relatedSectionIds: [],
  prerequisiteSectionIds: [],
  pages: {
    'system-model': [
      {
        kind: 'prose', title: 'The electrical system model', sourceIds: ['course-c2-foundations'],
        paragraphs: [
          'Start with physical quantities, not memorized equations. A source establishes a potential difference. If a complete conducting path exists, charge can move and current flows. The load converts electrical energy into heat, light, motion or another form, and the current returns through the complete circuit path.',
          'For C2 calculations in this course, use 240 V single phase and 50 Hz unless the question states otherwise. Those are study values, not permission to assume the actual supply on site without verification.',
        ],
      },
      {
        kind: 'flow', title: 'From source to useful effect', sourceIds: ['course-c2-foundations'],
        steps: ['Source establishes voltage', 'Closed circuit provides a complete path', 'Current transfers charge', 'Circuit impedance limits/changes current', 'Load converts electrical energy', 'Current returns through the circuit path'],
      },
      {
        kind: 'table', title: 'AC and DC: keep the distinction clear', sourceIds: ['course-c2-foundations'],
        columns: ['Feature', 'DC model', 'AC model'],
        rows: [
          ['Direction/polarity', 'One reference direction/polarity', 'Reverses periodically'],
          ['Frequency', '0 Hz for steady DC', 'Specified in hertz; course supply convention 50 Hz'],
          ['Common study source', 'Battery or DC supply', 'Building AC supply'],
          ['Extra quantities', 'Resistance often sufficient in simple steady-state model', 'Reactance, impedance, RMS and phase may also matter'],
        ],
      },
    ],
    definitions: [{
      kind: 'prose', title: 'Use one precise meaning at a time', sourceIds: ['course-c2-foundations', 'epra-c2-competencies'],
      paragraphs: ['The term strip above is the canonical foundation glossary for C2-01. Use the standards/technical meaning for an exam definition, then use the plain meaning and example to make the concept physically understandable.'],
    }],
    relationships: [
      { kind: 'formula', formulaId: 'charge-current-time' },
      { kind: 'formula', formulaId: 'ohms-law' },
      { kind: 'formula', formulaId: 'resistance-geometry' },
      { kind: 'formula', formulaId: 'series-resistance' },
      { kind: 'formula', formulaId: 'parallel-resistance' },
      { kind: 'formula', formulaId: 'electrical-power' },
      { kind: 'formula', formulaId: 'energy-from-power' },
      { kind: 'formula', formulaId: 'frequency-period' },
      { kind: 'formula', formulaId: 'sinusoidal-rms' },
      { kind: 'formula', formulaId: 'inductive-reactance' },
      { kind: 'formula', formulaId: 'capacitive-reactance' },
      { kind: 'formula', formulaId: 'series-impedance' },
      { kind: 'formula', formulaId: 'single-phase-ac-power' },
      { kind: 'flow', title: 'Load-assessment relationship', sourceIds: ['course-c2-foundations', 'eca-c3-load-assessment', 'schneider-demand-factors'], steps: ['Connected load', 'Operating pattern and duty', 'Individual utilization', 'Coincidence/diversity across loads', 'Maximum demand', 'Supply/submain design decision'] },
    ],
    'engineering-rules': [
      {
        kind: 'table', title: 'Foundation quantities and units', sourceIds: ['course-c2-foundations'],
        columns: ['Quantity', 'Symbol/example', 'Unit', 'Engineering meaning'],
        rows: [
          ['Voltage', 'V', 'volt (V)', 'Potential difference between two points'],
          ['Current', 'I', 'ampere (A)', 'Rate of charge transfer'],
          ['Resistance', 'R', 'ohm', 'Resistive opposition for the stated element/conditions'],
          ['Impedance', 'Z', 'ohm', 'Total AC opposition including resistance and reactance'],
          ['Power', 'P', 'watt (W)', 'Rate of energy transfer'],
          ['Energy', 'E', 'joule or kWh', 'Accumulated energy transfer'],
          ['Frequency', 'f', 'hertz (Hz)', 'Cycles per second'],
          ['Power factor', 'PF', 'dimensionless', 'Real power divided by apparent power'],
        ],
      },
      { kind: 'formula', formulaId: 'single-phase-design-current' },
      {
        kind: 'flow', title: 'Do not use design current as an isolated formula', sourceIds: ['course-c2-foundations', 'eca-c4-design-current'],
        steps: ['Identify load real/input power', 'Confirm voltage and supply system', 'Establish whether power factor is relevant', 'Calculate design current Ib', 'Carry Ib into the later protection and cable-design stages'],
      },
      {
        kind: 'table', title: 'Load and demand factors: declare the numerator and denominator', sourceIds: ['course-c2-foundations', 'eca-c3-load-assessment', 'schneider-demand-factors'],
        columns: ['Term', 'Meaning in this course', 'Typical range under stated convention'],
        rows: [
          ['Demand factor', 'Maximum demand / connected load', 'Normally <= 1'],
          ['Utilization factor ku', 'Individual operating demand / nominal rating', 'Normally <= 1'],
          ['Coincidence factor ks', 'Simultaneous group maximum / sum of individual maxima', '<= 1'],
          ['Diversity factor Fdiv', 'Reciprocal of coincidence factor in the convention used here', '>= 1'],
        ],
      },
      {
        kind: 'prose', title: 'Do not copy diversity blindly', sourceIds: ['schneider-demand-factors', 'osg-demand-diversity'],
        paragraphs: ['Demand and diversity depend on the actual installation, occupancy, duty and evidence. Do not apply a convenient percentage from an unrelated building, and do not reduce the same load twice through overlapping assumptions.'],
      },
    ],
    application: [
      {
        kind: 'prose', title: 'Worked example 1 — resistive load and energy', sourceIds: ['course-c2-foundations'],
        paragraphs: ['A 2.4 kW resistive heater on the 240 V study supply has I = P/V = 2400/240 = 10 A. If it runs for 3 h at that power, E = Pt = 2.4 kW x 3 h = 7.2 kWh. The 2.4 kW rating is a rate; 7.2 kWh is the accumulated energy.'],
      },
      {
        kind: 'prose', title: 'Worked example 2 — power factor changes current', sourceIds: ['course-c2-foundations'],
        paragraphs: ['A single-phase load consumes 2.4 kW at 240 V and PF 0.80. Apparent power S = P/PF = 3.0 kVA. Current I = S/V = 3000/240 = 12.5 A. Reactive power Q = sqrt(3.0^2 - 2.4^2) = 1.8 kVAr. The same 2.4 kW at unity PF would take 10 A, so poorer PF increases current for the same real power.'],
      },
      {
        kind: 'prose', title: 'Worked example 3 — connected load, maximum demand and coincidence', sourceIds: ['course-c2-foundations', 'schneider-demand-factors'],
        paragraphs: ['Two workshops each have 10 kW connected load and each reaches an individual maximum of 8 kW. If the measured group maximum is 12 kW: connected load = 20 kW; group demand factor = 12/20 = 0.60; coincidence factor ks = 12/(8+8) = 0.75; reciprocal diversity factor = 1/0.75 about 1.33. Each ratio answers a different question.'],
      },
    ],
    verification: [
      {
        kind: 'verification', title: 'Resistance/continuity measurement foundation', purpose: 'Determine the resistance/continuity of an intended conducting path without confusing that result with insulation resistance or live voltage.',
        safeState: 'Appropriately isolated/de-energized circuit for resistance/continuity measurement; prove the circuit condition using the specified safe-isolation process before connecting an ohmmeter.',
        instrument: 'Low-resistance ohmmeter or the appropriate continuity function of a suitable multifunction tester.',
        method: ['Identify the exact two test points and the conductor/path being investigated.', 'Null/account for leads where the specified method requires it.', 'Measure and record the resistance with units and test points.', 'Interpret the value against conductor length/size, connections and the expected path rather than treating every audible buzzer as a pass.'],
        expected: 'A continuous path with a resistance consistent with the conductor and connection arrangement being tested.',
        abnormal: 'Unexpectedly high or open-circuit resistance can indicate poor connections, wrong test points, conductor damage or an incomplete path.',
        nextAction: 'Check the test setup, sectionalize if necessary, locate/rectify the cause and repeat the relevant measurement before relying on the circuit.',
        sourceIds: ['course-c2-foundations', 'osg-safe-testing'],
      },
      {
        kind: 'table', title: 'Choose the measurement by the question', sourceIds: ['course-c2-foundations', 'osg-safe-testing'],
        columns: ['Question', 'Typical instrument/function', 'Safety principle'],
        rows: [
          ['Is voltage present/absent?', 'Suitable two-pole voltage indicator within the safe-isolation method', 'Instrument proving and safe method are part of the evidence'],
          ['What is conductor/path resistance?', 'Low-resistance ohmmeter/continuity function', 'Use on an appropriately isolated circuit'],
          ['What is load current?', 'Suitable ammeter/clamp method for the actual task', 'Live measurement requires competence, correct ratings and controlled access'],
          ['What is insulation resistance?', 'Insulation-resistance tester', 'This is a later verification test with specified isolation/equipment preparation; do not apply it to an energized circuit'],
        ],
      },
    ],
    'common-confusions': [
      {
        kind: 'table', title: 'Confusions that lose marks and cause bad engineering', sourceIds: ['course-c2-foundations', 'eca-c3-load-assessment', 'schneider-demand-factors'],
        columns: ['Do not confuse', 'Correct distinction'],
        rows: [
          ['Charge vs current', 'Charge is an amount in coulombs; current is charge per unit time in amperes.'],
          ['Voltage vs current', 'Voltage is potential difference; current is charge-transfer rate. Voltage does not “flow.”'],
          ['Power vs energy', 'Power is a rate in W/kW; energy accumulates in J, Wh or kWh.'],
          ['Resistance vs impedance', 'Resistance is the real/dissipative component; impedance is the complete AC opposition and can include reactance.'],
          ['kW vs kVA vs kVAr', 'kW is real power, kVA apparent power and kVAr reactive power.'],
          ['Power factor vs efficiency', 'PF describes the relation P/S; efficiency compares useful output power with input power.'],
          ['Connected load vs maximum demand', 'Connected load is the installed total on a stated basis; maximum demand is the greatest simultaneous assessed/observed demand.'],
          ['Coincidence vs diversity', 'In this course ks <= 1; reciprocal diversity Fdiv = 1/ks >= 1. Always state the convention.'],
          ['Series vs parallel', 'Series elements share current; parallel branches share voltage.'],
          ['RMS vs peak', 'RMS is the effective AC value normally used for ratings; peak is the waveform maximum.'],
        ],
      },
    ],
    sources: [
      {
        kind: 'table', title: 'Source hierarchy for C2-01', sourceIds: [...sourceIds, 'osg-safe-testing'],
        columns: ['Source', 'Role in this Overview', 'Authority note'],
        rows: [
          ['EPRA C2 competency document', 'Defines the examinable C2 foundation areas: AC/DC, V/I/R/P/E, power triangle, basic circuits, factors and single-phase calculations.', 'Current Kenyan licensing competency source'],
          ['Course foundation lessons and recaps', 'Primary teaching source for the basic electrical theory that the wiring guides do not cover comprehensively.', 'Course explanation; not a substitute for law/standards'],
          ['ECA Guide C3 pp. 23-25', 'Historical explanatory support for connected load, duty, maximum demand and diversity.', 'Historical guidance; do not use old numerical rules as current requirements'],
          ['ECA Guide C4.3.2 p. 30', 'Historical explanatory support for the single-phase design-current bridge.', 'Physical relationship remains useful; product/regulatory requirements must be current'],
          ['Schneider Electrical Installation Guide', 'Current explanatory source for utilization, coincidence and diversity conventions.', 'Specialist explanatory source; local requirements still govern'],
          ['IET On-Site Guide Appendix A', 'Current technical baseline reference for maximum-demand/diversity context.', 'Bibliographic reference only here until the exact reader pages used are separately verified'],
          ['IET On-Site Guide initial-testing safety page', 'Current technical safety reference for measurement/test-state discipline.', 'Exact printed-page/reader-page mapping already verified'],
        ],
      },
    ],
  },
  coverage: [
    { competency: 'Basic principles of electrical circuits: AC, DC, voltage, current, resistance, power, energy, power triangle and basic circuits.', referenceIds: ['epra-c2-competencies', 'module-01-section-1', 'module-01-section-5', 'module-01-section-11'], teachingPage: 'relationships' },
    { competency: 'Electrical terms including diversity factor, utilization factor and power factor.', referenceIds: ['epra-c2-competencies', 'eca-c3-load-assessment', 'schneider-demand-factors'], teachingPage: 'engineering-rules' },
    { competency: 'Calculation of power, current and voltage at low voltage, single phase.', referenceIds: ['epra-c2-competencies', 'eca-c4-design-current'], teachingPage: 'application' },
    { competency: 'Instrumentation and types of electrical measuring instruments.', referenceIds: ['epra-c2-competencies', 'osg-safe-testing'], teachingPage: 'verification' },
    { competency: 'Course foundation extension: resistance geometry, magnetism, AC waveforms, reactance, impedance, phasors, RMS and transformers.', referenceIds: foundationGroups.map(section => section.id), teachingPage: 'definitions' },
  ],
}];
