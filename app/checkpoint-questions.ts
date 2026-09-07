import type { AssessmentQuestion } from './assessment-data';
import { recallDistractors } from './recall-distractors';

// Checkpoint wording is independent of video titles and lesson-page context.
// Keys retain the original question IDs so saved learning evidence stays linked.
const prompts: Record<string, string> = {
  'p01-l03:3': 'How do SI prefixes change the size of a unit?',
  'p01-l04:2': 'Which two quantities determine electric current?',
  'p01-l04:3': 'Which quantity can be calculated by multiplying current by time?',
  'p01-l05:1': 'What does a power source supply to drive current through a circuit?',
  'p01-l05:2': 'Why does a circuit need a closed conducting path?',
  'p01-l05:3': 'How do circuit controls and protective devices differ in purpose?',
  'p01-l06:3': 'How do voltage and resistance affect current in a resistive circuit?',
  'p01-l07:1': 'Which quantities are related by Ohm’s law?',
  'p01-l07:2': 'What can be calculated by rearranging Ohm’s law?',
  'p01-l08:1': 'How does current compare at different points in a series circuit?',
  'p01-l09:1': 'How does voltage compare across branches connected in parallel?',
  'p01-l10:1': 'How are conductances combined in a parallel circuit?',
  'p01-l11:1': 'What determines the current in a resistive branch of a parallel circuit?',
  'p01-l13:1': 'Using current and resistance to calculate power, which electrical quantity is not needed?',
  'p01-l14:1': 'Using voltage and resistance to calculate power, which electrical quantity is not needed?',
  'p01-l17:1': 'What determines the magnetic field direction around a current-carrying conductor?',
  'p01-l19:1': 'How does rotation in an AC generator change magnetic flux linkage?',
  'p01-l22:1': 'How does resistance affect direct current and alternating current?',
  'p01-l24:1': 'What does the horizontal side of an impedance triangle represent?',
  'p01-pf-visual:1': 'What does real power represent, and which unit measures it?',
  'p01-l27:1': 'What does real power in watts represent?',
  'p01-l29:1': 'Why is an ammeter connected in series with the load?',
  'p01-l30:1': 'What condition is required before measuring circuit resistance?',
  'p01-l31:1': 'What physical effect allows a clamp meter to detect current?',
  'p02-l01:3': 'What functions can cable armour perform?',
  'p02-l02:1': 'What is the purpose of the main switch in a consumer unit?',
  'p02-l02:3': 'Where should neutral and protective conductors terminate in a consumer unit?',
  'p02-l03:1': 'What is the phase displacement between the three supply waveforms?',
  'p02-l03:3': 'What happens to neutral current when the fundamental phase currents are balanced?',
  'p02-l04:1': 'How are neutral and protective functions arranged in a TN-S supply?',
  'p02-l04:2': 'How are neutral and protective functions arranged in a TN-C-S supply?',
  'p02-l05:2': 'What is the purpose of protective bonding between conductive parts?',
  'p02-l06:1': 'How does a fuse disconnect excessive current?',
  'p02-l07:1': 'What residual-current balance is expected when outgoing and returning currents are equal?',
  'p02-l08:1': 'Why may an RCD require a separate overcurrent protective device?',
  'p02-l11:1': 'What electrical relationship exists between the three phase terminals?',
  'p03-l01:1': 'What damage must be avoided when removing a cable sheath?',
  'p03-l01:2': 'How should the conductor strip length be chosen for a terminal?',
  'p03-l01:3': 'How should the circuit protective conductor be routed and identified?',
  'p03-l02:2': 'How should the strands of a flexible conductor enter a terminal?',
  'p03-l03:1': 'How should line, neutral and protective conductors be connected?',
  'p03-l03:2': 'What should be checked for outside a completed terminal connection?',
  'p03-l04:1': 'What must a terminal accommodate when several conductors are connected?',
  'p03-l04:2': 'Where should conductor insulation end at a terminal?',
  'p03-l05:1': 'Why are permanent line conductors joined at a loop-in lighting point?',
  'p03-l05:2': 'How is the neutral connected in a basic switched lighting circuit?',
  'p03-l06:1': 'What do loop terminals maintain in a lighting circuit?',
  'p03-l07:1': 'Which conductor should an ordinary light switch interrupt?',
  'p03-l08:1': 'How does a two-way switch change its internal connection?',
  'p03-l09:1': 'Where are the two-way switches placed in a circuit with intermediate switching?',
  'p03-l11:1': 'What must be checked when matching an LED driver to a luminaire?',
  'p03-l12:1': 'Where should each circuit conductor terminate in a distribution board?',
  'p03-l13:1': 'Where should the required terminal tightening torque be obtained?',
  'p04-l01:1': 'Why are accurate measurements needed when setting out conduit?',
  'p04-l02:1': 'What must be considered when selecting PVC conduit size?',
  'p04-l02:2': 'What functions do conduit fittings provide?',
  'p04-l03:3': 'Why is formed PVC conduit allowed to cool before handling?',
  'p04-l04:2': 'What conditions determine the required finish for steel conduit?',
  'p04-l05:2': 'Why must cut conduit ends be deburred?',
  'p04-l06:1': 'What does the set allowance account for when bending conduit?',
  'p04-l06:2': 'Why are reference marks needed before bending conduit?',
  'p04-l07:1': 'Why should a trunking bend be marked out before cutting?',
  'p04-l07:2': 'Why must cuts and folds preserve the space inside a trunking bend?',
  'p04-l09:1': 'Why is conduit cable capacity limited?',
  'p04-l10:1': 'How are cable factors used to check trunking capacity?',
  'p04-l12:1': 'In what conditions is a BW cable gland suitable?',
  'p04-l13:1': 'Why must armour wires be prepared evenly for a cable gland?',
  'p04-l15:1': 'What must be considered when terminating the braid of an SY cable?',
  'p04-l16:1': 'How is MICC cable constructed?',
  'p04-l17:1': 'What does the pot seal protect in an MICC termination?',
  'p04-l18:1': 'Why are conductors looped through accessible conduit boxes?',
  'p05-l01:1': 'How does overload current differ from normal load current?',
  'p05-l01:2': 'What path does a short-circuit current take?',
  'p05-l01:3': 'What path does earth-fault current take back to the source?',
  'p05-l02:1': 'What causes a fuse element to melt?',
  'p05-l02:3': 'What must the breaking capacity of a fuse safely interrupt?',
  'p05-l03:1': 'What type of excessive current primarily operates a thermal trip?',
  'p05-l03:2': 'What type of current primarily operates a magnetic trip?',
  'p05-l03:3': 'What must be considered when choosing a circuit breaker’s trip curve and breaking capacity?',
  'p05-l05:2': 'How do Type B and Type C breaker curves differ in their response to inrush current?',
  'p05-l06:1': 'How does automatic disconnection of supply protect against an electrical fault?',
  'p05-l07:1': 'What portion of the earth-fault loop does Ze represent?',
  'p05-l08:1': 'How is the protective conductor arranged in a TN-S system?',
  'p05-l08:2': 'Where are neutral and protective functions combined in a TN-C-S system?',
  'p05-l08:3': 'What provides the local earth connection in a TT system?',
  'p05-l10:2': 'What determines the required cross-sectional area of a protective conductor?',
  'p05-l10:3': 'Why might a protective conductor need to be larger than its thermal calculation suggests?',
  'p05-l12:1': 'What must be kept consistent when calculating earth-fault loop impedance?',
  'p05-l13:1': 'Which parts of the fault path are included in the design value of Zs?',
  'p05-l14:1': 'Which three current ratings must be coordinated when selecting a cable and protective device?',
  'p05-spd:1': 'How does a surge protective device limit transient overvoltage?',
  'p06-l02:1': 'What does design current represent?',
  'p06-l03:1': 'What is the purpose of transposing an electrical formula?',
  'p06-l04:1': 'How must the corrected cable capacity relate to the protective-device rating?',
  'p06-l05:1': 'Which installation conditions require correction of tabulated cable capacity?',
  'p06-l10:1': 'Why can grouping loaded cables reduce their current-carrying capacity?',
  'p06-l13:1': 'How are line and phase voltage related in a balanced star connection?',
  'p06-l14:1': 'What does real power do, and what is its unit?',
  'p07-l01:1': 'How far apart are the voltage peaks in a balanced three-phase supply?',
  'p07-l02:1': 'Between which points is each load element connected in star?',
  'p07-l02:2': 'How do line current and phase current compare in a balanced star-connected load?',
  'p07-l02:3': 'How do line voltage and phase voltage compare in a balanced star-connected load?',
  'p07-l03:1': 'Between which points is each load element connected in delta?',
  'p07-l03:2': 'How do line voltage and phase voltage compare in a delta connection?',
  'p07-l03:3': 'How do line current and phase current compare in a balanced delta-connected load?',
  'p07-l04:1': 'What is the vector sum of balanced fundamental phase currents at the neutral point?',
  'p07-l05:1': 'How should three-phase currents be combined to find neutral current?',
  'p07-l05:2': 'How can unequal phase-current magnitudes affect neutral current?',
  'p07-l06:1': 'What is the purpose of the incomer in a distribution board?',
  'p07-l07:1': 'What can electrical monitoring reveal about a distribution system?',
  'p07-l12:1': 'How is the initial number of luminaires calculated from the required light output?',
  'p07-l12:2': 'Why is a calculated luminaire count rounded up?',
  'p07-l13:1': 'What can a single line represent on a three-phase electrical diagram?',
  'p07-l16:1': 'How does total connected load usually compare with maximum demand?',
  'p07-induction:2': 'Why is relative motion between the magnetic field and rotor needed in an induction motor?',
  'p07-vfd:1': 'What conversion does the rectifier perform inside a variable-frequency drive?',
  'p08-l01:1': 'Which sources must be identified before isolating an installation?',
  'p08-l02:1': 'Why must the correct test function be selected on a multifunction tester?',
  'p08-l03:2': 'What must be done with long test leads before measuring bonding continuity?',
  'p08-l04:1': 'What does R1 + R2 represent in a circuit continuity test?',
  'p08-l04:2': 'How can operating a light switch help check continuity of the switched line?',
  'p08-l05:1': 'What do end-to-end continuity tests establish in a ring final circuit?',
  'p08-l05:2': 'What pattern should be assessed in cross-connected ring-final readings at socket-outlets?',
  'p08-l08:1': 'Which part of the earth-fault loop is represented by Ze?',
  'p08-l09:1': 'What does prospective short-circuit current describe?',
  'p08-l10:1': 'Which impedances are included in Zs?',
  'p08-l11:1': 'Why should line-to-earth loop impedance be considered for each phase?',
  'p08-l13:1': 'What does an RCD ramp test estimate?',
  'p08-l14:1': 'What does an RCD’s type indicate about the residual currents it detects?',
  'p08-l15:1': 'What should be verified for every switch combination in a multiway lighting circuit?',
  'p08-l16:1': 'During an insulation test to earth, what happens when the live conductors are joined together?',
  'p08-l16:2': 'Why must sensitive electronics and surge devices be considered before insulation testing?',
  'p09-l01:1': 'What can end-to-end resistance tests reveal about a ring final circuit?',
  'p09-l02:1': 'How can an open conductor be identified in a ring final circuit?',
  'p09-l03:1': 'Why are different conductor pairs tested when locating an insulation fault?',
  'p09-l03:2': 'How does subdividing a circuit help locate an insulation fault?',
  'p09-l09:1': 'What does a leakage clamp measure when it surrounds all live conductors of one circuit?',
  'p10-l04:1': 'How do permanent line and switched line function in a lighting circuit?',
  'p10-l04:2': 'How is neutral routed in an ordinary switched lighting circuit?',
  'p10-l09:2': 'What does maximum demand estimate?',
  'p10-l09:3': 'Why is maximum demand often lower than total connected load?',
  'p10-l10:1': 'What information belongs in an electrical load schedule?',
  'p11-l01:1': 'What should be set out before cutting wall chases for electrical wiring?',
  'p11-l01:3': 'What precautions are needed before chasing a wall?',
  'p11-v2-l02:1': 'How are one-way, two-way and intermediate switches distinguished?',
  'p11-v2-l02:2': 'How should socket-outlets, connection units, isolators and consumer units be distinguished?',
  'p11-v2-l02:3': 'What information should be checked before connecting an electrical accessory?',
  'p11-v2-l03:2': 'What should be recorded and inspected before replacing a socket-outlet?',
  'p11-v2-l03:3': 'What makes a sound conductor termination when replacing a socket-outlet?',
  'p11-v2-l04:1': 'Which terminal groups must be distinguished on a fused connection unit?',
  'p11-v2-l04:2': 'How can a correctly selected fuse in a connection unit protect appliance flex?',
  'p11-v2-l05:1': 'What should be compared when choosing a USB charging socket for several devices?',
  'p11-v2-l05:2': 'What space and thermal checks are needed before retrofitting a USB socket?',
  'p11-v2-l06:1': 'What should guide the position of general-use kitchen socket-outlets?',
  'p11-v2-l07:1': 'What supply information is needed to convert appliance nameplate power into current?',
  'p11-v2-l08:1': 'How should the required means of appliance isolation be determined?',
  'p11-v2-l09:1': 'What is the purpose of the isolating transformer in a shaver supply unit?',
  'p11-v2-l11:1': 'What must match when selecting an industrial plug and socket for equipment?',
  'p12-v2-l02:1': 'What should be defined before choosing a lighting fitting?',
  'p12-v2-l02:2': 'How do light distribution and surface reflectance affect a lighting scheme?',
  'p12-v2-l02:3': 'Which visual-quality factors should be considered alongside brightness?',
  'p12-v2-l03:1': 'What should a lighting survey establish before products are selected?',
  'p12-v2-l04:2': 'How should contrast be treated when designing lighting?',
  'p12-v2-l05:1': 'How should lighting controls be grouped for easy use?',
  'p12-v2-l06:1': 'What kinds of criteria must a lighting design combine?',
  'p12-v2-l09:1': 'Which LED-strip ratings help determine the driver and cable requirements?',
  'p12-v2-l10:1': 'Does high LED efficiency remove the need for heat management?',
  'p12-v2-l11:1': 'Can constant-voltage and constant-current LED drivers be substituted for each other?',
  'p12-v2-l13:1': 'What can testing at a low dimming level reveal?',
  'p12-v2-l14:1': 'How do IP and IK ratings differ?',
  'p12-v2-l16:1': 'What does a lighting site survey connect to the visual design brief?',
  'p12-v2-l18:1': 'What electrical connections does a lighting sensor need?',
  'p12-v2-l19:1': 'How does DALI control relate to the mains power wiring?',
  'p12-v2-l20:1': 'How do DALI bus power and control differ in function?',
  'p12-v2-l21:1': 'How do lighting controls without a neutral connection obtain operating power?',
  'p12-v2-l22:1': 'What should guide the choice of lighting control architecture?',
  'p12-v2-l24:1': 'Does an emergency-lighting functional test establish the same result as a full-duration test?',
  'p12-l04:1': 'What should guide the first decisions in a lighting design?',
  'p13-v2-l01:1': 'How does a KNX bus relate to the mains supply powering the loads?',
  'p13-v2-l01:2': 'What roles do sensors, actuators and system devices have in KNX?',
  'p13-v2-l01:3': 'What is one benefit of a multi-manufacturer open automation standard?',
  'p13-v2-l02:1': 'How should an ETS project represent the actual building?',
  'p13-v2-l02:2': 'What determines the available parameters and communication objects of a KNX device?',
  'p13-v2-l03:1': 'What do the parameters of an individual KNX device determine?',
  'p13-v2-l03:2': 'What do KNX group addresses represent?',
  'p13-v2-l04:1': 'Why does a correct network cable wire map not establish bandwidth performance?',
  'p13-v2-l04:2': 'Why are insertion loss, return loss and near-end crosstalk measured in network cable testing?',
  'p13-v2-l05:1': 'What must match when selecting a network cable certification test?',
  'p13-v2-l05:2': 'What preparation is needed for meaningful fibre test measurements?',
  'p13-v2-l06:1': 'How does a modular plug terminated link connect at the device end?',
  'p13-v2-l09:1': 'What does an automatic gate controller coordinate?',
  'p13-v2-l10:1': 'What gate hazards should a site-specific risk assessment identify?',
  'p13-v2-l11:1': 'Why are different fire-alarm sensor types suited to different room risks?',
  'p13-l10:1': 'Where should a fire-alarm system’s protection category be specified?',
  'p13-v2-l13:1': 'Why must the applicable standards edition be established for a life-safety project?',
  'p14-l01:1': 'What energy-use information should a solar site survey record?',
  'p14-l01:2': 'What site conditions should be assessed for a proposed PV array?',
  'p14-l01:3': 'What existing electrical infrastructure should be inspected before adding solar generation?',
  'p14-v2-l02:1': 'Which parts of a hybrid solar system should be included when tracing power flow?',
  'p14-v2-l02:2': 'Which operating states should be distinguished in a hybrid solar system?',
  'p14-v2-l02:3': 'What equipment should be located at the boundaries of a hybrid solar system?',
  'p14-v2-l03:1': 'What supply and earthing checks are needed before adding a solar installation?',
  'p14-v2-l03:2': 'What distribution-board checks are needed before connecting solar generation?',
  'p14-v2-l03:3': 'What electrical routes and protective provisions should be planned before installing solar equipment?',
  'p14-v2-l04:1': 'What locations should be avoided when positioning battery storage?',
  'p14-v2-l04:2': 'What environmental conditions affect the suitability of a battery-storage location?',
  'p14-v2-l05:1': 'How should overheating be prevented when positioning a solar inverter?',
  'p14-v2-l05:2': 'What exposure conditions should be checked when choosing an inverter location?',
  'p14-v2-l06:1': 'What should be inspected before energising a PV installation?',
  'p14-v2-l06:2': 'What polarity and voltage checks are needed on a PV string?',
  'p14-v2-l07:1': 'What should be set out before drilling and terminating solar equipment?',
  'p14-v2-l09:1': 'Which sources can energise the work area in a hybrid solar installation?',
  'p14-v2-l09:2': 'How does an operating control differ from a means of safe isolation?',
  'p14-v2-l09:3': 'What hazards can remain after switching off a solar inverter?',
  'p14-l02:1': 'What energy conversion takes place through a solar inverter?',
  'p14-v2-l10:1': 'Which transfer-switch operating methods should be distinguished?',
  'p14-v2-l11:1': 'What operating characteristics should be compared when selecting a UPS?',
  'p14-l07:1': 'What should be shown when mapping a three-phase battery-backup system?',
  'p14-v2-l14:1': 'What must be identified when assessing earthing for an EV charging installation?',
  'p14-l08:1': 'What instructions govern power, protective and communication terminations on an EV charger?',
  'p14-v2-l16:1': 'What electrical checks should come before investigating EV charger software?',
  'p15-v2-l01:1': 'How do the power and control circuits differ in a motor starter?',
  'p15-v2-l01:2': 'What happens to the contactor coil circuit when a normally closed stop or overload contact opens?',
  'p15-v2-l01:3': 'What keeps the contactor energised after a momentary start button is released?',
  'p15-v2-l03:2': 'How can long, narrow or sharply bent ventilation ducts affect a system?',
  'p15-v2-l04:1': 'How can the surge sensitivity of electronic LED drivers differ from that of resistive lighting loads?',
  'p16-l02:1': 'What is the purpose of a ferrule on a fine-stranded conductor?',
  'p16-l02:3': 'How does a proper ferrule crimp differ from squeezing the sleeve with ordinary pliers?',
  'p16-l04:1': 'What should be done before relying on a detector to locate hidden services?',
  'p16-l04:3': 'What can a detector’s metal mode indicate about a hidden object?',
  'p16-l05:1': 'Do passive power and radio scans establish the location of every buried service?',
  'p16-l05:2': 'How do direct connection, clamping and induction differ when applying a tracing signal?',
  'p16-l06:1': 'Under what load conditions is an electrical thermal survey most informative?',
  'p16-l06:3': 'Does a thermal anomaly by itself identify the cause of an electrical fault?',
  'p16-l07:1': 'Which business activities must chargeable labour rates recover?',
  'p16-l07:2': 'What should be included when pricing materials for an electrical quotation?',
  'p16-l07:3': 'Why must an electrical quotation allow for both overheads and profit?',
  'p16-l08:1': 'How does a room-by-room electrical schedule help define the scope of a quotation?',
};

const additionalPrompts = `
p01-l07:3|Why can a component’s resistance differ between operating conditions?
p01-l08:3|How do the voltage drops add up around a series circuit?
p01-l09:2|How does source current relate to the branch currents in a parallel circuit?
p01-l09:3|How does equivalent parallel resistance compare with the smallest branch resistance?
p01-l10:2|Can the reciprocal resistance formula be used for unequal parallel resistors?
p01-l10:3|How is the equivalent resistance of identical parallel resistors calculated?
p01-l11:3|How can a calculated source current be cross-checked in a parallel resistor network?
p01-l12:2|How is power calculated for a steady DC load?
p01-l12:3|What does a higher power rating mean about the rate of energy conversion?
p01-l13:3|At constant resistance, what happens to resistive power loss if current doubles?
p01-l14:3|How should a power formula be selected for a calculation?
p01-l15:2|How is energy calculated for a load operating at constant power?
p01-l17:3|How does a ferromagnetic core affect a coil’s magnetic flux?
p01-l18:2|How does a faster rate of flux change affect induced voltage?
p01-l19:2|Why does the induced polarity reverse during AC generation?
p01-l19:3|For a generator with a fixed pole count, what determines waveform frequency?
p01-l20:2|What determines the instantaneous value of a sine wave?
p01-l20:3|How do the positive and negative half-cycles of an ideal sine wave compare?
p01-l21:3|How are period and frequency related?
p01-l22:2|How do reactive components exchange energy with a circuit?
p01-l23:2|What causes back electromotive force in a coil?
p01-transformers:2|What does the turns ratio determine in an ideal transformer?
p01-transformers:4|How does an autotransformer differ from a separate-winding transformer in electrical isolation?
p01-l24:2|What does the reactive side of an inductive impedance triangle represent?
p01-l24:3|How must resistance and reactance be combined to obtain impedance?
p01-pf-visual:2|What does reactive power represent, and what is its unit?
p01-pf-visual:3|Which quantities determine apparent power, and what is its unit?
p01-l27:2|What does reactive power in vars represent?
p01-l27:3|How are real and reactive power related to apparent power for sinusoidal loads?
p06-l14:2|What does reactive power represent, and what is its unit?
p03-l14:4|Why must all relevant conductors be checked when proving a circuit dead?
p03-l14:5|What should happen if the circuit identity or isolation result is uncertain?
p01-l28:3|What must be checked before connecting a meter to measure voltage?
p01-l29:2|What input arrangements are used for current measurements on a multimeter?
p01-l29:3|What should guide the initial range and connection method for a current measurement?
p01-l30:3|Why does test-lead resistance matter when measuring a very small resistance?
p02-l03:2|How are line-to-line and line-to-neutral voltages related in a balanced star supply?
p02-l04:3|How is the installation earth connection provided in a TT system?
p02-l04:4|Why must the supply earthing arrangement be identified before designing protection?
p02-l05:4|Do protective earthing and protective bonding perform the same function?
p02-l07:3|What causes an RCD to disconnect the circuit?
p02-l07:4|Does residual-current protection alone provide complete overcurrent protection?
p02-l08:4|Why must an RCBO’s markings be checked before selection?
p02-l11:2|What requirements apply to the protective conductor at a three-phase connection?
p02-l11:3|When is a neutral terminal needed at a three-phase connection?
p16-l01:4|How should electrical tools be kept dependable and defects identified?
p03-l01:4|Why should conductors be formed neatly before termination?
p03-l02:4|When should ferrules be used on flexible conductors?
p03-l04:3|Why must sufficient conductor space be provided inside an accessory box?
p03-l04:4|What termination defects should a final inspection look for?
p03-l06:2|Which conductors are joined at the neutral terminals of a ceiling rose?
p03-l06:3|Which conductor feeds the lamp’s line terminal in a loop-in lighting circuit?
p03-l06:4|Why should terminal markings be checked on a lighting accessory?
p03-l07:2|Which terminals create the switched path in a one-way light switch?
p03-l07:3|Why must conductor function be identified rather than assumed from colour alone?
p03-l07:4|What protective continuity is needed around conductive boxes and accessories?
p03-l08:3|How can either switch change the lamp state in a two-way circuit?
p03-l09:2|Where is an intermediate switch connected relative to the two-way switches?
p03-l09:3|How does an intermediate switch change the traveller connections?
p03-l10:2|How does a spur differ from the main ring of a ring final circuit?
p03-l10:4|What must testing confirm about the ring after an alteration?
p03-l11:2|What provisions are needed around downlight and driver connections?
p03-l12:2|How should conductors be routed inside a distribution board?
p04-l06:3|Why should conduit be formed gradually during bending?
p04-l08:2|Why should cable-tray bend markings be symmetrical?
p04-l08:3|What protection is needed at cut cable-tray edges?
p04-l11:2|What functions can steel wire armour perform?
p04-l12:2|What part of a cable does a CW gland seal against the environment?
p16-l03:3|What determines the correct tool and die for a lug crimp?
p04-l14:2|Why must the cable’s minimum bend radius be respected?
p04-l15:2|How should a cable gland grip an SY cable?
p04-l15:3|What determines whether an SY cable is suitable for an installation?
p04-l16:2|What installation care is needed for heat-resistant MICC cable?
p04-l16:3|Why must exposed mineral insulation be sealed promptly?
p04-l17:2|What mechanical and electrical functions does an MICC gland perform?
p04-l17:3|What does insulation resistance testing check after an MICC termination?
p04-l18:3|What must remain clear and continuous along a conduit wiring system?
p05-l06:2|Why is a complete, low-impedance fault path needed for overcurrent disconnection?
p05-l07:2|What do R1 and R2 represent in an earth-fault loop calculation?
p05-l07:3|What does Zs represent at the fault location?
p05-l11:2|Why is a temperature factor applied to measured conductor resistance?
p05-l11:3|What is obtained by adding Ze to the final circuit’s R1 + R2?
p05-l12:2|Why should loop-impedance calculations allow for changes in supply impedance and temperature?
p05-l12:3|How should measured and calculated loop-impedance results be handled?
p05-l13:2|What must the fault current achieve for automatic disconnection by an overcurrent device?
p05-l15:3|Does fitting an RCD remove the need for sound earthing and protective conductors?
p05-spd:2|What does Uc mean on a surge protective device?
p07-l01:2|How are line-to-line and line-to-neutral voltages related in a balanced star supply?
p06-l13:3|What load condition is assumed when using the standard star and delta current relationships?
p06-l11:2|What does maximum demand estimate?
p06-l11:3|Why is diversity considered when estimating maximum demand?
p06-l12:3|How can a maximum-demand estimate be improved beyond standard assumptions?
p06-l03:2|What should be checked about units before calculating electrical power or current?
p06-l05:2|What capacity value is needed before selecting a cable size from a table?
p06-l05:3|What determines the correct cable-capacity table and correction factors?
p06-l07:2|How does voltage drop along a cable affect the voltage at the load?
p06-l08:3|Why is voltage drop limited in an installation design?
p06-l15:1|What does a circuit breaker’s breaking capacity specify?
p06-l15:3|How does a breaker’s kA marking differ from its normal current rating?
p08-l01:4|Which conductor pairs may need checking when proving a three-phase installation dead?
p07-induction:3|What is the difference between synchronous speed and rotor speed called?
p04-l19:1|What does the power circuit carry in a direct-on-line motor starter?
p04-l19:2|What does the control circuit do in a direct-on-line motor starter?
p04-l19:3|What keeps a starter contactor energised after the start button is released?
p04-l20:1|How do terminal references help when wiring a motor starter?
p07-star-delta:2|For the same supply and winding impedance, how does star starting current compare with delta starting current?
p07-star-delta:3|Why must the driven load be suitable for the reduced torque of star starting?
p07-vfd:2|What hazard can remain in a drive’s DC link after isolation?
p07-l08:1|What does the fuse protect in a switch-fuse sub-main supply?
p07-l09:3|What forces and temperatures should supports for loaded cables withstand?
p08-l03:4|What should be inspected on a protective bonding conductor?
p05-l09:1|What should a visual inspection of protective bonding confirm?
p08-l04:4|How can recorded continuity values help later circuit assessment?
p08-l05:3|What can irregular ring-final test readings reveal?
p08-l05:4|What does polarity verification establish about protective switching?
p08-l06:2|What connected devices may need disconnection before insulation resistance testing?
p08-l06:4|What should happen if insulation resistance readings are unexpectedly low?
p08-l17:4|Which prospective fault-current value is relevant when checking breaking capacity?
p08-l11:2|Why is the highest line-to-earth loop reading important in a three-phase circuit?
p08-l13:3|How does RCD type affect the waveform selected for testing?
p08-l14:2|What must an RCD tester’s settings match?
p08-l14:4|What should determine the RCD test procedure for an installation?
p08-l15:4|What should be satisfactory before live functional confirmation?
p16-l09:4|What information and demonstrations should accompany an electrical handover?
p09-l01:4|What verification is needed after repairing a ring-final fault?
p09-l07:2|Where can green contamination from deteriorating cable materials travel?
p09-l07:3|What assessment is needed when cable material deterioration is found?
p09-l07:4|Can accessories affected by cable contamination require replacement despite conductor continuity?
p09-l10:3|What does the thermal cut-out do in a heater?
p09-l11:2|What does a clamp measure around all live conductors of the same circuit?
p10-l10:4|What does balancing loads across phases improve?
p10-l10:5|Why should maximum-demand calculation assumptions be documented?
p16-l04:4|Why should hidden-service detection use repeated scans and more than one method?
p16-l05:3|Why might a cable locator’s strongest response be away from the target service?
p10-l04:5|What verification is needed before accepting a working lamp as evidence of a sound circuit?
p10-l05:3|What does Zs represent in a cooker circuit?
p10-l05:5|What final checks are needed after connecting a cooker circuit?
p10-l08:2|What defects can electrical tests reveal that visual inspection may miss?
p11-l01:4|What must wall chases preserve in the building structure?
p11-v2-l03:4|What must be restored and verified after replacing a socket-outlet?
p11-v2-l04:3|Which functions must be distinguished when choosing a fused connection unit?
p11-v2-l04:4|What installation provisions are needed around a fused connection unit?
p11-v2-l05:3|What circuit checks are needed when replacing a mains socket with a USB charging socket?
p11-v2-l05:4|What long-term factors should be considered when selecting a USB charging socket?
p11-v2-l06:2|Where should an appliance’s means of isolation remain accessible?
p11-v2-l06:3|What information should guide cooker controls, connection points and cable routes?
p11-v2-l06:4|What room measurements and service locations should be recorded before kitchen first fix?
p11-v2-l07:2|What should govern the use of diversity in a cooker-circuit calculation?
p11-v2-l07:3|What design checks remain after cooker demand has been estimated?
p11-v2-l07:4|What future needs should be discussed when assessing cooker demand?
p11-v2-l08:3|What should guide the position of a shower isolation control?
p11-v2-l08:4|What needs coordinating when installing a shower isolator?
p11-v2-l09:2|What product limits should be checked on a shaver supply unit?
p11-v2-l09:3|What should guide the position of a shaver supply unit?
p11-v2-l09:4|What installation provisions are needed for a shaver supply unit?
p11-v2-l10:1|What exposure conditions determine the enclosure protection for an outdoor socket?
p11-v2-l10:2|How should cable entries be arranged to maintain an outdoor socket’s protection?
p11-v2-l10:3|What protective measures are needed for an outdoor socket circuit?
p11-v2-l10:4|Which parts of an outdoor socket should be inspected for weathering?
p11-v2-l11:3|Why may an industrial socket need interlocking or switch-disconnection?
p11-v2-l11:4|What must be coordinated around an industrial socket installation?
p07-l10:4|Does an acceptable average illuminance establish uniformity and glare control?
p12-v2-l03:4|Can lighting rules of thumb replace the required calculations?
p12-v2-l05:3|What supply conditions should a lighting design accommodate?
p12-v2-l05:4|What should be reviewed before a lighting first-fix drawing is released?
p12-v2-l06:3|How do maintenance and controls affect lighting performance over time?
p12-v2-l06:4|How should lighting reference values be selected for a project?
p12-v2-l08:3|Which ceiling details affect fire performance around a downlight?
p12-v2-l09:4|What electrical planning is needed for long LED-strip runs?
p12-v2-l10:3|What does an aluminium profile contribute to an LED-strip installation?
p12-v2-l10:4|What should be planned before fixing an LED strip?
p12-v2-l11:2|What electrical ratings must be matched when choosing an LED driver?
p12-v2-l12:2|What affects the usable dimming range of an LED system?
p12-v2-l13:2|Are leading-edge and trailing-edge dimming electrically interchangeable for every load?
p12-v2-l13:4|Which variables should be separated when diagnosing unstable LED dimming?
p12-v2-l14:3|How can installation workmanship affect an enclosure’s IP protection?
p12-v2-l15:1|How should outdoor lighting be arranged to serve different purposes?
p12-v2-l16:2|What quality of workmanship is needed for outdoor lighting joints and supports?
p12-v2-l16:3|What should outdoor lighting controls support?
p12-v2-l16:4|What visual check belongs in outdoor lighting commissioning?
p12-v2-l17:2|What lighting-quality checks remain even with high-output luminaires?
p12-v2-l18:2|How should a lighting sensor’s manual override be arranged and recorded?
p12-v2-l19:2|What does DALI addressing enable?
p12-v2-l19:4|Why should DALI commissioning records be retained?
p12-v2-l20:4|Where should DALI addresses and groups be recorded?
p12-v2-l22:2|Do sensors, scenes and schedules perform the same lighting-control function?
p12-v2-l22:4|What practical qualities matter alongside smart-control features?
p12-v2-l23:1|What should determine emergency-lighting coverage?
p12-v2-l23:2|Are maintained and non-maintained emergency-lighting modes suitable for identical needs?
p12-v2-l23:3|Which duration and supply decisions must be made when designing emergency lighting?
p12-v2-l24:2|What should be considered when scheduling an emergency-lighting duration test?
p12-v2-l24:3|What is required after an emergency-lighting test failure?
p12-l04:3|What visual effects should be controlled when positioning luminaires?
p12-l04:4|What should be coordinated early in a lighting design?
p13-v2-l03:4|How should a KNX system be commissioned to keep changes controlled?
p13-v2-l04:3|How do network verification, qualification and certification differ?
p13-v2-l06:2|Why must the test configuration match an MPTL installation?
p13-v2-l08:4|What operating conditions should be tested when commissioning access control?
p13-v2-l09:3|What electrical provisions are needed around an automatic gate installation?
p13-v2-l10:3|Why might a gate safety circuit need fault monitoring?
p13-v2-l10:4|What operating tests belong in final gate-safety validation?
p13-v2-l11:3|What should alarm interconnection achieve, and how is it verified?
p13-v2-l11:4|What installation factors influence the effectiveness of a smoke-alarm system?
p13-l10:4|How should responsibility for fire-alarm design, installation and maintenance be recorded?
p14-l01:4|What equipment locations should be reserved when planning a solar installation?
p14-v2-l02:4|What should a client understand about solar settings and daily load timing?
p14-v2-l03:4|What existing defects should be documented before connecting a PV system?
p14-v2-l09:4|What information and controls support safe isolation of a hybrid solar system?
p14-v2-l04:3|What access and mounting provisions must be maintained around a battery installation?
p14-v2-l04:4|What emergency-response provisions should be coordinated for battery storage?
p14-v2-l05:3|What mounting surface is appropriate for a solar inverter?
p14-v2-l05:4|What must remain accessible around an installed inverter?
p14-v2-l06:3|How should insulation testing be selected for a PV system with connected electronics?
p14-v2-l06:4|What PV records should be provided at handover?
p14-v2-l07:2|What DC connections and protection must be coordinated in an inverter installation?
p14-v2-l07:3|What AC-side provisions are needed for a hybrid inverter installation?
p14-v2-l07:4|What configuration and records are needed when commissioning an inverter with a battery?
p14-l02:2|Which paths should be understood on the AC-input side of an inverter-charger?
p14-l02:3|How do load-support features relate the external source to battery power?
p14-l02:4|What internal inverter-charger paths may be absent from a simplified external diagram?
p14-v2-l10:2|What must be compared when choosing a transfer-switch transition method?
p14-v2-l10:3|What determines whether transfer switching includes the neutral conductor?
p14-v2-l10:4|What operating and maintenance features should be checked on an automatic transfer switch?
p14-v2-l11:2|Which power paths should be identified in a UPS?
p14-v2-l11:3|What load information is needed to size UPS power and battery runtime?
p14-v2-l11:4|What installation provisions should be planned for a UPS?
p14-l07:2|What loading checks are needed for a three-phase battery-backup system?
p14-l07:3|What physical installation requirements should be planned for a battery-backup system?
p14-l07:4|What operating modes should be verified when commissioning battery backup?
p14-v2-l13:1|What user and vehicle requirements should be established before selecting an EV charger?
p14-v2-l13:2|What supply checks determine whether EV charging needs load management?
p14-v2-l13:4|What protection and access must be coordinated around an EV charger?
p14-v2-l14:2|How can a lost neutral or PEN conductor create a danger at an EV?
p14-v2-l14:3|What built-in and external protective provisions must be checked for an EV charger?
p14-v2-l14:4|What procedure should govern the verification of EV protective functions?
p14-l08:2|How should a current transformer be fitted for EV load monitoring?
p14-l08:3|What settings should be configured when commissioning an EV charger?
p14-l08:4|What electrical and functional checks are needed at EV charger handover?
p14-v2-l16:2|How should EV load-sensing readings be checked during fault finding?
p14-v2-l16:3|Which possible fault sources should be distinguished when an EV will not charge?
p14-v2-l16:4|What records should follow correction of an EV charging fault?
p16-l06:4|What should an electrical thermal-survey report contain?
`;
for (const line of additionalPrompts.trim().split('\n')) {
  const [id, prompt] = line.split('|');
  prompts[id] = prompt;
}

const conciseAnswers: Record<string, string> = {
  'p01-l03:1': 'Charge occurs in whole multiples of elementary charge.',
  'p01-l03:2': 'A quantity of charge equal to one ampere flowing for one second.',
  'p01-l03:3': 'By powers of ten, without changing the physical quantity.',
  'p01-l04:2': 'Charge transferred and elapsed time.',
  'p01-l04:3': 'Transferred charge.',
  'p01-l05:1': 'A potential difference across the circuit.',
  'p01-l05:2': 'To allow charge to circulate through the source and load.',
  'p01-l05:3': 'Controls manage normal operation; protection responds to abnormal conditions.',
  'p01-l06:3': 'At fixed resistance, more voltage gives more current; at fixed voltage, more resistance gives less current.',
  'p01-l07:1': 'Voltage, current and resistance.',
  'p01-l07:2': 'Current or resistance when the other two quantities are known.',
  'p01-l08:1': 'The same current flows through every component in the series path.',
  'p01-l09:1': 'Every parallel branch has the same voltage across it.',
  'p01-l10:1': 'Add the individual branch conductances.',
  'p01-l10:3': 'Divide one resistor’s resistance by the number of parallel branches.',
  'p01-l12:3': 'Energy is converted at a faster rate.',
  'p01-l13:1': 'Voltage.',
  'p01-l13:3': 'The power loss becomes four times as large.',
  'p01-l14:1': 'Current.',
  'p01-l17:3': 'It guides and concentrates the magnetic flux.',
  'p01-l18:2': 'The induced voltage increases.',
  'p01-l20:1': 'A waveform whose value follows the projection of uniform circular motion.',
  'p01-l21:3': 'Period is the reciprocal of frequency.',
  'p01-l22:2': 'They store energy in fields and return it to the circuit.',
  'p01-l24:1': 'Resistance.',
  'p01-l24:2': 'Inductive reactance.',
  'p01-l24:3': 'As perpendicular components of a vector.',
  'p01-pf-visual:3': 'RMS voltage and RMS current; the unit is volt-amperes.',
  'p01-l27:3': 'They form perpendicular components of the apparent-power vector.',
  'p02-l03:2': 'Line-to-line voltage is √3 times line-to-neutral voltage.',
  'p07-l01:2': 'Line-to-line voltage is √3 times line-to-neutral voltage.',
  'p02-l05:4': 'No. Earthing provides a fault-current path; bonding limits potential differences between conductive parts.',
  'p02-l08:1': 'Residual-current detection does not by itself detect every overload or short circuit.',
  'p02-l11:3': 'When the connected equipment or circuit requires a neutral.',
  'p03-l03:2': 'No loose strands or excess exposed copper.',
  'p03-l08:1': 'It connects the common terminal to either of two traveller terminals.',
  'p03-l09:2': 'Between the two-way switches, in the traveller paths.',
  'p03-l13:1': 'From the equipment manufacturer’s instructions.',
  'p04-l12:1': 'Protected dry locations where an outer-sheath seal is not needed.',
  'p04-l16:3': 'It can absorb moisture, reducing insulation resistance.',
  'p04-l17:2': 'It secures the sheath and forms the intended protective connection.',
  'p05-l07:2': 'R1 is the circuit line-conductor resistance; R2 is its protective-conductor resistance.',
  'p05-l08:3': 'A local earth electrode.',
  'p05-l11:3': 'The estimated total earth-fault loop impedance at that point.',
  'p05-l14:1': 'Design current, protective-device rating and corrected cable capacity.',
  'p05-spd:2': 'The maximum continuous operating voltage.',
  'p06-l04:1': 'Corrected cable capacity must be at least the coordinated protective-device rating.',
  'p06-l11:3': 'Many loads do not run at full power at the same time.',
  'p07-l04:1': 'Zero.',
  'p07-l04:2': 'Current in the shared neutral conductor.',
  'p07-l05:2': 'They can produce a nonzero vector sum and therefore neutral current.',
  'p07-l12:1': 'Divide the required source lumens by the output of one luminaire.',
  'p07-induction:3': 'Slip.',
  'p07-star-delta:2': 'Star line current is approximately one third of delta line current.',
  'p07-star-delta:3': 'The motor must accelerate the load despite the lower starting torque.',
  'p07-vfd:2': 'DC-link capacitors may retain hazardous stored energy.',
  'p08-l14:4': 'The applicable BS requirements, device type and instrument instructions.',
  'p10-l09:2': 'The greatest credible load expected to operate at one time.',
  'p11-v2-l04:2': 'It limits overcurrent in the appliance flex when correctly coordinated.',
  'p11-v2-l07:1': 'Supply voltage and whether the load is single-phase or three-phase.',
  'p11-v2-l09:1': 'To electrically separate the output from the normal mains supply.',
  'p12-v2-l02:2': 'They affect where light reaches and how surfaces appear.',
  'p12-v2-l02:3': 'Glare, shadows and contrast.',
  'p12-v2-l06:4': 'Use the applicable BS guidance for the task and the project’s design requirements.',
  'p12-v2-l11:1': 'No; the driver’s output method must match the LED load.',
  'p12-v2-l12:2': 'The control method, minimum load and driver compatibility.',
  'p12-v2-l13:2': 'No; the driver or lamp must be compatible with the dimming method.',
  'p12-v2-l14:1': 'IP rates solid and water ingress protection; IK rates impact resistance.',
  'p12-v2-l19:1': 'DALI carries digital control separately from the load’s mains power path.',
  'p12-v2-l20:1': 'Bus power energises the communication bus; control messages set lighting behaviour.',
  'p12-v2-l21:1': 'By passing a small operating current through the connected load.',
  'p12-v2-l23:2': 'No. Maintained lights operate during normal use as well as supply failure; non-maintained lights operate on supply failure.',
  'p12-v2-l24:1': 'No. A functional test checks operation; a duration test checks operation for the required period.',
  'p13-v2-l01:2': 'Sensors send commands, actuators switch or regulate loads, and system devices support the network.',
  'p13-v2-l03:1': 'How the device behaves.',
  'p13-v2-l03:2': 'Control functions such as switching, dimming, status and scenes.',
  'p13-v2-l04:1': 'Continuity can pass while split pairs or poor terminations still limit performance.',
  'p13-v2-l04:3': 'Verification checks connections, qualification checks application capability, and certification checks a defined cabling limit.',
  'p13-v2-l11:3': 'A detector’s warning must reach the other intended alarms, verified by a commissioning test.',
  'p14-v2-l02:4': 'Control settings and when loads run affect savings and backup performance.',
  'p14-l02:1': 'DC energy is converted into a controlled AC waveform.',
  'p14-l02:3': 'They coordinate the external source limit with available battery power.',
  'p14-v2-l10:3': 'The installation’s neutral and earthing design.',
  'p15-v2-l01:3': 'An auxiliary holding contact maintains the coil circuit.',
  'p16-l06:3': 'No; further inspection and electrical measurements are needed to establish the cause.',
};

const acronyms: Record<string, string> = { rcd:'RCD', rcbo:'RCBO', rcbos:'RCBOs', mcb:'MCB', led:'LED', pvc:'PVC', swa:'SWA', micc:'MICC', sy:'SY', bw:'BW', cw:'CW', tt:'TT', 'tn-s':'TN-S', 'tn-c-s':'TN-C-S', ze:'Ze', zs:'Zs', r1:'R1', r2:'R2', pscc:'PSCC', pefc:'PEFC', ip:'IP', ik:'IK', dali:'DALI', knx:'KNX', ets:'ETS', mptl:'MPTL', poe:'PoE', dc:'DC', ac:'AC', ka:'kA', uc:'Uc', eicr:'EICR' };
const plain = (value: string) => value.replace(/[“”"]/g, '').replace(/\bsi prefixes\b/gi, 'SI prefixes')
  .replace(/\b(?:tn-c-s|tn-s|rcbos|rcbo|rcd|mcb|led|pvc|swa|micc|sy|bw|cw|tt|ze|zs|r1|r2|pscc|pefc|ip|ik|dali|knx|ets|mptl|poe|dc|ac|ka|uc|eicr)\b/gi, word => acronyms[word.toLowerCase()]);

export function standaloneCheckpointQuestion(question: AssessmentQuestion): AssessmentQuestion {
  const concept = question.id.match(/^(.*)-q-concept-(\d+)$/);
  const key = concept ? `${concept[1]}:${concept[2]}` : '';
  const authoredPrompt = prompts[key];
  const prompt = authoredPrompt ?? question.prompt.replace(/^Which definition best matches [“"](.+)[”"]\?$/, 'What does $1 mean?');
  const options = question.options.map(plain);
  // Several generated answers were sentence fragments. The source explanation
  // supplies the complete taught principle for these independently authored stems.
  if (authoredPrompt) options[question.answer] = plain(question.explanation);
  if (conciseAnswers[key]) options[question.answer] = conciseAnswers[key];
  const misconception = concept ? recallDistractors[concept[1]]?.[Number(concept[2]) - 1] : undefined;
  if (misconception) {
    for (let index = 0; index < options.length; index++) {
      if (index !== question.answer && /opposite relationship|appearance alone|regardless of the circuit/i.test(options[index])) options[index] = misconception;
    }
  }
  return { ...question, prompt: plain(prompt), options: options.map(plain), explanation: plain(conciseAnswers[key] ?? question.explanation), feedback: question.feedback?.map(plain) };
}
