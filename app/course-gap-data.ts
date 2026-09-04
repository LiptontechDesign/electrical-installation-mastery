import { G, L, type LessonSeed } from './course-extension/builders';

const principle = { regulationSensitive: false };
const equipment = { regulationSensitive: true, regulationStatus: 'Use the actual equipment instructions and applicable current installation requirements. This video explains a principle or a particular product; it does not specify a Kenyan installation.' };

// Only additions accepted by the September 2026 whole-course review.
export const gapLessons: LessonSeed[] = [
  L('p01-transformers', 'Transformers: Changing Flux, Turns and Voltage', 'UchitHGF4n8', 'The Engineering Mindset', 390, 'Transformers', 'WHY', 'UK educator', G(
    'Follow energy from a primary winding through a changing magnetic field to a secondary winding. The animation connects induction to step-up, step-down and three-phase supply transformers.',
    ['Changing magnetic flux induces voltage in a winding; a connected load allows secondary current to flow.', 'The turns ratio sets the ideal voltage ratio; stepping voltage up reduces the current available at the same power.', 'A laminated magnetic core guides flux and limits eddy-current loss.', 'Separate windings can provide galvanic isolation; an autotransformer does not provide that separation.'],
    'Steady DC cannot sustain transformer action. Switched DC can create changing flux; a mains transformer must still receive its designed waveform and frequency.',
    'Connect the transformer principle to the supply entering a building and to low-voltage lighting supplies. Transformer output ratings and protection remain separate design decisions.',
    'An ideal transformer has 1,000 primary turns and 100 secondary turns. What secondary voltage follows from 230 V at the primary?',
  ), principle),
  L('p01-pf-visual', 'Power Factor: See Real, Reactive and Apparent Power', 'Tv_7XWf96gg', 'The Engineering Mindset', 669, 'Power factor', 'WHY', 'UK educator', G(
    'Use the animation to distinguish useful energy transfer from reactive exchange, then connect those ideas to the power triangle and the existing worked calculation.',
    ['Real power P transfers energy to useful work and losses and is measured in watts.', 'Reactive power Q describes energy exchanged with electric and magnetic fields and is measured in var.', 'Apparent power S combines RMS voltage and current and is measured in volt-amperes.', 'Improving displacement power factor can reduce supply current at unchanged real power; it does not remove the energy the load needs.'],
    'For sinusoidal waveforms, power factor equals cos φ. Harmonic distortion can reduce true power factor even when phase displacement is small.',
    'Explain why a supply cable or transformer can reach its current rating before the connected load reaches the expected useful kW.',
    'A load takes 8 kW and 10 kVA. What is its power factor, and which quantity represents useful energy transfer?',
  ), principle),
  L('p07-induction', 'Induction Motors: Rotating Field, Rotor and Slip', '59HBoIXzX_c', 'The Engineering Mindset', 933, 'Induction motors', 'WHY', 'UK educator', G(
    'Look inside a three-phase induction motor before studying its starter. Trace the rotating stator field, induced rotor currents and resulting torque, then connect the construction to cooling and the terminal box.',
    ['Three displaced stator currents create a rotating magnetic field.', 'Relative motion between the field and rotor induces rotor current and produces torque.', 'In normal induction-motor operation the rotor runs below synchronous speed; this difference is slip.', 'Motor cooling, winding insulation and the driven load affect permissible operation.', 'A motor nameplate links voltage and winding connection to rated current, frequency, output power and speed.'],
    'A motor’s rated kW normally describes shaft output. Electrical input is higher because efficiency is below 100%.',
    'Use the speed exercise to connect frequency and pole count to a plausible nameplate speed before reading the DOL control circuit.',
    'Why does a four-pole, 50 Hz induction motor show a rated speed near 1,450 rpm rather than exactly 1,500 rpm?',
  ), equipment),
  L('p07-star-delta', 'Star–Delta Starting: Sequence and Interlocks', 'h89TTwlNnpY', 'The Engineering Mindset', 668, 'Motor starting', 'HOW', 'UK educator', G(
    'Build on the DOL starter by following a motor through star starting, an open transition and delta running. Watch the power and control paths together, particularly the interlocks that keep star and delta contactors apart.',
    ['Star starting reduces the voltage across each winding compared with delta on the same line supply.', 'Star line current is approximately one third of delta line current at the same supply voltage and winding impedance.', 'Starting torque is also reduced, so the driven load must be able to accelerate under that condition.', 'Electrical and mechanical interlocks prevent the star and delta contactors closing together.', 'Star–delta starting requires accessible winding ends and a motor rated to run in delta at the supply voltage.'],
    'On a 400 V supply, a 400/690 V Δ/Y motor may suit star–delta starting. A 230/400 V Δ/Y motor must not be switched to delta on that supply.',
    'Compare DOL and star–delta starting for a pump: consider starting torque, transition, protection and the exact manufacturer diagram.',
    'Why does reducing starting current also reduce starting torque, and why must star and delta contactors never close together?',
  ), equipment),
  L('p07-vfd', 'Variable-Frequency Drives: From Rectifier to Motor Speed', 'yEPe7RDtkgo', 'The Engineering Mindset', 917, 'Variable-frequency drives', 'WHY', 'UK educator', G(
    'Trace the rectifier, DC link and switched inverter inside a drive. Connect the output frequency to motor speed, and distinguish speed control from the fixed-speed starting methods studied earlier.',
    ['The rectifier converts the incoming AC supply to a DC link.', 'DC-link capacitors smooth the intermediate supply and can retain hazardous energy after isolation.', 'Inverter switching uses pulse-width modulation to control the motor supply; the output is not a clean utility sine wave.', 'Changing output frequency changes the rotating field speed, while the drive also manages voltage or flux.', 'Drive selection must match the motor, load torque, cooling and operating speed range.'],
    'A stopped drive is not an isolated circuit. Follow the manufacturer’s isolation, discharge, cable, earthing and protection requirements.',
    'Explain why a fan needing variable airflow may benefit from a drive, while a star–delta starter only changes the starting method.',
    'Which three power stages form a VFD, and why can a stopped motor still have a hazardous drive supply?',
  ), equipment),
  L('p05-spd', 'Surge Protection: What an SPD Test Can Tell You', 'N-ocwOCoPfE', 'eFIXX', 421, 'Surge protection', 'HOW', 'UK manufacturer or trade specialist', G(
    'Use a manufacturer-specific SPD demonstration to connect the varistor’s behaviour to its markings and test result. Distinguish a component check from proof that the complete installation has effective surge protection.',
    ['An SPD limits transient overvoltage by diverting surge current through its designed protective path.', 'Uc is the maximum continuous operating voltage; it is not a universal pass value for a DC test.', 'A dedicated varistor test must be interpreted against the particular SPD and instrument instructions.', 'Condition indicators and component readings do not establish correct coordination, connecting-lead length or backup protection.'],
    'The demonstration is not a universal test method for every SPD technology. Disconnect or protect SPDs appropriately during insulation testing.',
    'Use the short surge-protection explanation below before applying the demonstration to the later lighting and solar lessons.',
    'Why can a cartridge give an expected test result while the installed surge-protection arrangement is still unsuitable?',
  ), equipment),
  L('p08-periodic', 'Periodic Inspection: Follow the Evidence Through an EICR', '1tBICSsjVWo', 'Artisan Electrics', 3584, 'Periodic inspection', 'APPLY', 'UK educator', G(
    'Follow this 2018 UK home inspection from visual checks to recorded observations. After learning the individual tests, separate observation from inference and check historical defect codes against current guidance.',
    ['Periodic inspection checks the condition of an existing installation within a defined extent and recorded limitations.', 'Visual defects and measurement results must be linked to the specific circuit or equipment concerned.', 'Unexpected readings require investigation and interpretation rather than an automatic pass or fail from one number.', 'An EICR describes an existing installation’s condition, while an installation certificate documents responsibility for defined work.', 'Observations should explain the defect, risk and evidence rather than merely copying another inspector’s code.'],
    'This case was filmed in 2018. Its particular codes, RCD expectations and terminology need checking against current guidance; age or an older edition alone does not make an installation unsafe.',
    'Choose three observations in the walkthrough. For each, identify the evidence, any missing information and the next investigation before deciding on action.',
    'How does a report about an existing installation differ from a certificate for new installation work?',
  ), { ...equipment, regulationStatus: 'Historical UK EICR case study (2018). Use current IET guidance to interpret UK observations and applicable Kenyan requirements for local reporting. Do not copy the video’s defect codes or edition-specific test limits.' }),
];

export const gapGuides = Object.fromEntries(gapLessons.map(lesson => [lesson.id, lesson.guide]));
