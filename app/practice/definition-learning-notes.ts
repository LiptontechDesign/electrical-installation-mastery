export type GuideKey =
  | 'terminology'
  | 'consumer-units'
  | 'protection'
  | 'rccds'
  | 'surge'
  | 'earthing'
  | 'switching'
  | 'final-circuits'
  | 'inspection-testing';

export type DefinitionLearningNote = {
  meaning: string;
  remember?: string;
  related?: string[];
  guide?: GuideKey;
  guideDetail?: string;
};

export const guideReferences: Record<GuideKey, { pages: string; label: string; summary: string }> = {
  terminology: {
    pages: '14',
    label: 'Terminology and defined terms',
    summary: '“Line conductor” is the terminology used in place of older “phase conductor” wording.'
  },
  'consumer-units': {
    pages: '24',
    label: 'Consumer units and similar assemblies',
    summary: 'Consumer units are assemblies with requirements for both their construction and installation; BS EN IEC 61439-3 addresses distribution boards intended to be operated by ordinary persons.'
  },
  protection: {
    pages: '33–36',
    label: 'Protective devices and fault protection',
    summary: 'Overload, short-circuit, earth-fault, automatic-disconnection and additional-protection functions are distinct. A device must be selected for the protective functions the circuit requires.'
  },
  rccds: {
    pages: '37–49',
    label: 'RCD selection and application',
    summary: 'Residual current device selection includes type, application, current rating, residual-current behaviour, device markings, ambient conditions and coordination with other devices.'
  },
  surge: {
    pages: '50–56',
    label: 'Surge protective devices',
    summary: 'Surge protection requires suitable device types and locations, coordination between devices and short connecting conductors.'
  },
  earthing: {
    pages: '61–68',
    label: 'Protective earthing and bonding',
    summary: 'Circuit protective conductors connect equipment to the main earthing terminal. Main protective bonding conductors connect relevant extraneous conductive parts to that terminal. The earthing conductor connects the terminal to the means of earthing; supplementary bonding connects relevant conductive parts locally.'
  },
  switching: {
    pages: '69–72',
    label: 'Isolation and switching',
    summary: 'Isolation, switching off for mechanical maintenance, emergency switching and functional switching serve different purposes. The switching device must be suitable for the intended function.'
  },
  'final-circuits': {
    pages: '83–92',
    label: 'Final circuits',
    summary: 'Final-circuit design brings together circuit rating, protective devices, conductor size, voltage drop, earth fault loop impedance and residual current protection.'
  },
  'inspection-testing': {
    pages: '121–138',
    label: 'Inspection and testing',
    summary: 'Inspection checks the installation by examination; testing adds measurements and functional checks. Together they address continuity, insulation resistance, polarity, earth-electrode resistance, earth fault loop impedance and prospective fault current.'
  }
};

export const definitionLearningNotes: Record<string, DefinitionLearningNote> = {
  'definition-1': {
    meaning: 'An accessory supports the wiring or the connected equipment but is not itself the item that uses electrical energy. Think of it as an electrical connection or control item associated with the installation rather than the load.',
    related: ['Current-using equipment', 'Electrical equipment', 'Plug', 'Socket-outlet']
  },
  'definition-2': {
    meaning: 'Ambient temperature is the temperature surrounding equipment where it will operate. It matters because cable ratings and equipment performance are based on stated environmental conditions.',
    remember: 'Use the actual surrounding medium and conditions, not simply an indoor weather temperature.'
  },
  'definition-3': {
    meaning: 'An appliance is current-using equipment that is neither a luminaire nor an independent motor. It is therefore a particular class of load, not a general name for every item of electrical equipment.',
    related: ['Current-using equipment', 'Luminaire', 'Electrical equipment']
  },
  'definition-4': {
    meaning: 'A circuit is the group of electrical equipment supplied from one origin and protected against overcurrent by the same protective device or devices. The common source and common overcurrent protection are what define the circuit boundary.',
    related: ['Final circuit', 'Distribution circuit', 'Circuit-breaker', 'Fuse']
  },
  'definition-5': {
    meaning: 'A consumer unit is a particular distribution-board assembly, mainly associated with domestic installations, that combines incoming isolation with outgoing protective and control devices.',
    remember: 'The historical 2015 wording is retained above. Current product and assembly requirements should be checked against the present standards rather than inferred from the old definition.',
    related: ['Distribution board', 'Switchgear', 'Isolation', 'Circuit-breaker', 'Residual current device (RCD)'],
    guide: 'consumer-units',
    guideDetail: 'Consumer units fall within BS EN IEC 61439-3. The older “type-tested” wording in this definition is historical terminology, rather than a complete current product specification.'
  },
  'definition-6': {
    meaning: 'Current-using equipment is equipment that takes electrical energy and converts it into another useful form such as light, heat or mechanical motion. In everyday terms, it is the load.',
    related: ['Appliance', 'Luminaire', 'Electrical equipment']
  },
  'definition-7': {
    meaning: 'A distribution board receives one or more incoming supplies and distributes them to outgoing circuits through switching and protective devices, with neutral and protective-conductor terminations. It is a distribution and protection point within the installation.',
    related: ['Consumer unit (may also be known as a consumer control unit or electricity control unit)', 'Distribution circuit', 'Switchboard', 'Switchgear'],
    guide: 'consumer-units',
    guideDetail: 'Consumer units and similar assemblies organise protective devices and outgoing circuits.'
  },
  'definition-8': {
    meaning: 'A distribution circuit supplies another distribution point rather than directly supplying the final load. A sub-main feeding another board or a separate building is a common example of this role.',
    related: ['Circuit', 'Final circuit', 'Distribution board']
  },
  'definition-9': {
    meaning: 'Electrical equipment is the broad umbrella term covering items used to generate, convert, transmit, distribute, measure, protect, wire or use electrical energy. Accessories, wiring systems, appliances and luminaires all sit within this wider category.',
    related: ['Electrical installation', 'Accessory', 'Current-using equipment', 'Wiring system']
  },
  'definition-10': {
    meaning: 'An electrical installation is the coordinated collection of electrical equipment arranged to fulfil one or more purposes. It is the installation as a functioning whole, not a single piece of equipment.',
    related: ['Electrical equipment', 'Origin of an installation', 'Wiring system']
  },
  'definition-11': {
    meaning: 'An external influence is any environmental or usage condition outside the installation that can affect safe design or operation. The designer must therefore consider the real location and conditions in which equipment and wiring will be used.'
  },
  'definition-12': {
    meaning: 'A final circuit is the last circuit in the distribution chain: it directly feeds current-using equipment, socket-outlets or other outlet points. It is different from a distribution circuit, which feeds another board or switchgear.',
    related: ['Circuit', 'Distribution circuit', 'Ring final circuit', 'Spur'],
    guide: 'final-circuits',
    guideDetail: 'Final-circuit arrangements depend on protective-device rating, conductor size, voltage drop, disconnection time, Zs and RCD protection.'
  },
  'definition-13': {
    meaning: 'Fixed equipment is intended to stay secured in a specific location. The important idea is the designed method of attachment or securing, rather than whether the equipment could physically be removed.'
  },
  'definition-14': {
    meaning: 'A fused connection unit connects an appliance to fixed wiring and includes a replaceable cartridge fuse link. It provides a local fused connection between the fixed circuit and the connected appliance.',
    related: ['Accessory', 'Cartridge fuse link', 'Fuse link']
  },
  'definition-15': {
    meaning: 'A low-voltage switchgear and controlgear assembly brings together switching, control, measurement, signalling, protection and regulation equipment with the internal connections and structure needed to operate as one assembly.',
    related: ['Switchgear', 'Switchboard', 'Distribution board']
  },
  'definition-16': {
    meaning: 'A luminaire is the complete lighting fitting that supports, protects, connects and controls the lamp or light source and distributes its light. The definition distinguishes the fitting from the lamp itself.',
    related: ['Current-using equipment', 'Appliance']
  },
  'definition-17': {
    meaning: 'Mobile equipment is equipment that is moved during operation or can readily be moved while still connected to the supply. The historical source notes “portable equipment” as deprecated terminology.',
    remember: 'Do not confuse mobile equipment with stationary equipment simply because both may be connected by flexible cable.',
    related: ['Stationary equipment', 'Fixed equipment', 'Flexible cable']
  },
  'definition-18': {
    meaning: 'The origin is the point where electrical energy is delivered to the installation. It is the reference point from which the installation begins for supply, isolation, protection and many design considerations.',
    related: ['Electrical installation', 'Distribution board'],
    guide: 'final-circuits',
    guideDetail: 'The origin of the installation is the reference point for distribution and final-circuit arrangements.'
  },
  'definition-19': {
    meaning: 'A plug is the male accessory with pins that mates with a socket-outlet and also provides the electrical connection and mechanical retention of its flexible cable.',
    related: ['Socket-outlet', 'Accessory', 'Flexible cable']
  },
  'definition-20': {
    meaning: 'A point in wiring is the termination of fixed wiring intended to connect current-using equipment. The emphasis is the fixed-wiring termination, not necessarily the equipment connected to it.',
    related: ['Final circuit', 'Current-using equipment']
  },
  'definition-21': {
    meaning: 'A socket-outlet is a fixed-wiring accessory with female contacts designed to receive a plug. The historical definition expressly excludes a luminaire track system from being treated as a socket-outlet system.',
    related: ['Plug', 'Accessory', 'Final circuit']
  },
  'definition-22': {
    meaning: 'Stationary equipment is either fixed equipment or equipment sufficiently heavy and without a carrying handle that it is not intended to be readily moved. It is a broader category than fixed equipment.',
    related: ['Fixed equipment', 'Mobile equipment (portable equipment (deprecated))']
  },
  'definition-23': {
    meaning: 'A switchboard is an assembly of switchgear, with or without instruments. It refers to a coordinated assembly and not merely to a group of local switches on final circuits.',
    related: ['Switchgear', 'Distribution board']
  },
  'definition-24': {
    meaning: 'Switchgear is the collection of main and auxiliary switching equipment used to operate, regulate, protect or otherwise control an electrical installation.',
    related: ['Switchboard', 'Distribution board', 'Switch', 'Circuit-breaker']
  },
  'definition-25': {
    meaning: 'A wiring system is the conductors or busbars together with the parts that support, secure and, where needed, enclose them. It is therefore more than the cable alone.',
    related: ['Electrical equipment', 'Conduit', 'Cable trunking', 'Cable tray']
  },
  'definition-26': {
    meaning: 'Cables are bunched when they are grouped closely enough to affect how they are treated for installation and rating purposes, including when they share an enclosure or are not separated by the specified distance.',
    remember: 'Bunching is about proximity and thermal interaction, not simply whether cables are visually near one another.'
  },
  'definition-27': {
    meaning: 'A busbar trunking system is an enclosed, modular conductor system using solid conductors separated by insulation, with system units for feeding, tapping off, movement, expansion or other functions.',
    related: ['Wiring system', 'Cable trunking']
  },
  'definition-28': {
    meaning: 'A cable channel is an above- or below-ground enclosure large enough to give access to cables or conduits along its length but not large enough for people to enter. It may be part of the building construction.'
  },
  'definition-29': {
    meaning: 'A cable cleat is a mechanical support component installed at intervals to retain a cable or conduit securely. Its role is physical restraint rather than electrical protection.'
  },
  'definition-30': {
    meaning: 'A cable coupler is a separable connection between two flexible cables and consists of a connector and a plug. It allows the two cable sections to be connected or disconnected deliberately.',
    related: ['Connector', 'Plug', 'Flexible cable']
  },
  'definition-31': {
    meaning: 'Cable ducting is an enclosure installed first so that cables can then be drawn through it. The definition distinguishes it from conduit and cable trunking.',
    related: ['Conduit', 'Cable trunking', 'Wiring system']
  },
  'definition-32': {
    meaning: 'A cable ladder supports cables on transverse rungs fixed between longitudinal members. It is a support system rather than a closed enclosure.',
    related: ['Cable tray', 'Cable cleat']
  },
  'definition-33': {
    meaning: 'A cable tray supports cables on a continuous base with raised edges and no cover. The base may be solid or perforated.',
    related: ['Cable ladder', 'Cable cleat']
  },
  'definition-34': {
    meaning: 'Cable trunking is a normally rectangular closed enclosure with a removable or hinged side. It protects and contains cables and can also accommodate other electrical equipment.',
    related: ['Cable ducting', 'Conduit', 'Wiring system']
  },
  'definition-35': {
    meaning: 'Conduit is part of a closed wiring system through which cables can be drawn and later replaced. Cables are not inserted laterally along the conduit length.',
    related: ['Cable ducting', 'Cable trunking', 'Wiring system']
  },
  'definition-36': {
    meaning: 'A connector is the female-contact part of a cable or appliance coupler fitted to the end of the flexible cable away from the supply.',
    related: ['Cable coupler', 'Plug', 'Flexible cable']
  },
  'definition-37': {
    meaning: 'Current-carrying capacity is the maximum continuous current a conductor can carry under the stated installation conditions without exceeding its permitted steady-state temperature. It is commonly represented by Iz in circuit design.',
    remember: 'The value depends on the specified conditions, so cable size alone does not determine current-carrying capacity.',
    related: ['Design current (of a circuit)', 'Rated current', 'Overcurrent'],
    guide: 'final-circuits',
    guideDetail: 'Conductor size must be considered together with protective-device rating, installation method and other design limits when designing a final circuit.'
  },
  'definition-38': {
    meaning: 'A flexible cable is constructed from materials and conductors that allow repeated flexing while in service. Its defining feature is suitability for movement, not simply that it can be bent during installation.'
  },
  'definition-39': {
    meaning: 'A line conductor carries electrical energy in an a.c. system and is neither neutral, protective nor PEN. In a three-phase system the line conductors are the phase conductors L1, L2 and L3.',
    remember: '“Line conductor” replaces the older term “phase conductor”.',
    related: ['Neutral conductor', 'Protective conductor (PE)', 'PEN conductor', 'Live part'],
    guide: 'terminology',
    guideDetail: 'Conductor markings include L for line, N for neutral and PE for protective conductor. In a three-phase system the line conductors are identified as L1, L2 and L3.'
  },
  'definition-40': {
    meaning: 'A live part is intended to be energized during normal use. The neutral is included as a live part for this definition, while a PEN conductor is excluded by convention.',
    related: ['Line conductor', 'Neutral conductor', 'PEN conductor']
  },
  'definition-41': {
    meaning: 'A neutral conductor is connected to the system neutral point and participates in transmitting electrical energy. It is therefore a current-carrying circuit conductor, not a protective conductor.',
    related: ['Line conductor', 'PEN conductor', 'Live part']
  },
  'definition-42': {
    meaning: 'A PEN conductor performs two functions in one conductor: the protective-conductor function and the neutral-conductor function. Because those functions are combined, it must not be treated as though it were only a neutral or only a PE.',
    related: ['Neutral conductor', 'Protective conductor (PE)', 'TN-C system', 'TN-C-S system']
  },
  'definition-43': {
    meaning: 'Protective conductor is the broad safety category for conductors used in protection against electric shock. Depending on the arrangement, a protective conductor may connect exposed parts, extraneous parts, the MET, earth electrodes or the earthed point of the source.',
    remember: 'A CPC, earthing conductor and protective bonding conductor are all specific protective-conductor functions; they are not interchangeable names.',
    related: ['Circuit protective conductor (cpc)', 'Earthing conductor', 'Protective bonding conductor', 'Main earthing terminal'],
    guide: 'earthing',
    guideDetail: 'Circuit protective conductors, main protective bonding conductors, earthing conductors and supplementary protective bonding conductors are distinct members of the protective-conductor family.'
  },
  'definition-44': {
    meaning: 'A ring final circuit leaves one supply point, passes around the connected points and returns to that same supply point, forming a ring. It is a particular final-circuit arrangement, not a general name for socket circuits.',
    related: ['Final circuit', 'Spur'],
    guide: 'final-circuits',
    guideDetail: 'Ring final-circuit design must consider protective-device rating, conductor size, voltage drop and Zs.'
  },
  'definition-45': {
    meaning: 'A spur is a branch taken from a ring or radial final circuit. The spur is a branch of the existing circuit rather than a separate final circuit with its own origin and protective device.',
    related: ['Ring final circuit', 'Final circuit']
  },
  'definition-46': {
    meaning: 'A barrier is a physical part arranged to provide a defined degree of protection against touching live parts from normal directions of access.',
    remember: 'A barrier is intended to prevent contact; an obstacle only prevents unintentional contact.',
    related: ['Obstacle', 'Enclosure', 'Basic protection']
  },
  'definition-47': {
    meaning: 'Basic insulation is the insulation on live parts that provides protection in normal, fault-free conditions. Insulation used only to make equipment function is not automatically basic insulation.',
    related: ['Basic protection', 'Supplementary insulation', 'Double insulation', 'Reinforced insulation']
  },
  'definition-48': {
    meaning: 'Basic protection is the protection that prevents electric shock when the installation is healthy and no fault exists. It addresses normal-condition contact with live parts.',
    remember: 'Basic protection is the fault-free layer; fault protection is the protection relied on after a single fault.',
    related: ['Fault protection', 'Basic insulation', 'Barrier', 'Enclosure'],
    guide: 'protection',
    guideDetail: 'Basic protection applies under normal conditions; fault protection applies when a fault occurs.'
  },
  'definition-49': {
    meaning: 'A bonding conductor is a protective conductor whose job is equipotential bonding: electrically connecting conductive parts so that dangerous potential differences are reduced.',
    related: ['Equipotential bonding', 'Protective bonding conductor', 'Protective conductor (PE)'],
    guide: 'earthing'
  },
  'definition-50': {
    meaning: 'During an earth fault, the circuit protective conductor forms part of the path that carries fault current back towards the source. This enables the protective system to operate.',
    remember: 'Connection path: equipment’s exposed conductive part → circuit protective conductor → main earthing terminal → earthing conductor → means of earthing.',
    related: ['Protective conductor (PE)', 'Earthing conductor', 'Main earthing terminal', 'Exposed-conductive-part', 'Earth fault loop impedance'],
    guide: 'earthing',
    guideDetail: 'Continuity testing checks that the protective path is electrically continuous. R1 + R2 is the combined resistance of the circuit line conductor and circuit protective conductor.\n\nMain protective bonding conductors connect relevant extraneous conductive parts to the main earthing terminal; supplementary bonding connects relevant conductive parts locally.'
  },
  'definition-51': {
    meaning: 'Class I equipment has basic insulation and also provides for exposed conductive parts to be connected to the installation protective conductor. Its fault protection therefore depends on that protective connection being effective.',
    related: ['Basic insulation', 'Protective conductor (PE)', 'Exposed-conductive-part', 'Class II equipment', 'Class III equipment']
  },
  'definition-52': {
    meaning: 'Class II equipment uses additional insulation measures instead of relying on a protective-conductor connection to accessible metalwork. It is commonly described as double-insulated equipment.',
    remember: 'Class II is not the same as Class I equipment with an omitted earth connection; its protection is built into the insulation construction.',
    related: ['Double insulation', 'Supplementary insulation', 'Reinforced insulation', 'Class I equipment']
  },
  'definition-53': {
    meaning: 'Class III equipment relies on a SELV supply for shock protection and does not internally generate voltages above SELV. The low-voltage supply arrangement is part of the protection concept.',
    related: ['SELV (separated extra-low voltage)', 'Class I equipment', 'Class II equipment']
  },
  'definition-54': {
    meaning: 'Double insulation combines two independent insulation functions: basic insulation and supplementary insulation. Together they provide both the normal-condition and additional fault-protection layers.',
    related: ['Basic insulation', 'Supplementary insulation', 'Reinforced insulation', 'Class II equipment']
  },
  'definition-55': {
    meaning: 'For electrical purposes, Earth is treated as a conductive mass whose potential is the zero reference. Earthing arrangements use that reference in different ways depending on the system.',
    related: ['Earth electrode', 'Earthing', 'TT system', 'TN system']
  },
  'definition-56': {
    meaning: 'An earth electrode is the conductive part intentionally placed in electrical contact with Earth. It provides a physical connection to the mass of Earth and is especially significant in TT arrangements.',
    related: ['Earth', 'Earth electrode resistance', 'Earthing conductor', 'TT system'],
    guide: 'earthing',
    guideDetail: 'The earth electrode is connected to the main earthing terminal through the earthing conductor and forms part of the earth-fault loop in a TT system.'
  },
  'definition-57': {
    meaning: 'Earth electrode resistance is the resistance between an earth electrode and the general mass of Earth. It is one of the values that determines the effectiveness of an electrode-based earthing arrangement.',
    related: ['Earth electrode', 'TT system', 'Earth fault loop impedance'],
    guide: 'inspection-testing',
    guideDetail: 'Measured earth-electrode resistance must be assessed against the protection requirements of the TT installation.'
  },
  'definition-58': {
    meaning: 'Earthing is the protective connection of exposed-conductive-parts to the installation’s main earthing terminal. It establishes the protective path by which those parts are tied into the earthing arrangement.',
    related: ['Circuit protective conductor (cpc)', 'Main earthing terminal', 'Protective earthing', 'Exposed-conductive-part'],
    guide: 'earthing'
  },
  'definition-59': {
    meaning: 'The earthing conductor links the main earthing terminal to the earth electrode or other means of earthing. It is the installation-to-earthing-system link, not the same conductor as the CPC serving equipment.',
    remember: 'Earthing conductor: MET → means of earthing. CPC: exposed-conductive-part → MET.',
    related: ['Main earthing terminal', 'Earth electrode', 'Circuit protective conductor (cpc)', 'Protective conductor (PE)'],
    guide: 'earthing',
    guideDetail: 'The earthing conductor has a separate protective function. If disconnected for an external earth-fault-loop test, it must be reconnected to the main earthing terminal after the test.'
  },
  'definition-60': {
    meaning: 'Electric shock is the dangerous physiological effect produced when current passes through a person or livestock. The definition is about the effect on the body, while shock current describes the current that causes it.',
    related: ['Shock current', 'Basic protection', 'Fault protection']
  },
  'definition-61': {
    meaning: 'Earth electrodes are electrically independent when they are far enough apart that current through one does not significantly change the potential of the other. Independence is therefore an electrical condition, not merely physical separation.',
    related: ['Earth electrode', 'TT system']
  },
  'definition-62': {
    meaning: 'An enclosure protects equipment from specified external influences and, from any direction, also provides basic protection against access to live parts.',
    related: ['Barrier', 'Basic protection', 'External influence']
  },
  'definition-63': {
    meaning: 'Equipotential bonding connects conductive parts together so that exposed and extraneous conductive parts remain at substantially the same potential. The purpose is to reduce dangerous voltage differences that a person could bridge.',
    related: ['Protective equipotential bonding', 'Bonding conductor', 'Exposed-conductive-part', 'Extraneous-conductive-part'],
    guide: 'earthing'
  },
  'definition-64': {
    meaning: 'An exposed-conductive-part is a touchable conductive part of electrical equipment that is not live in normal operation but could become live if a fault occurs. It is part of the electrical equipment.',
    remember: 'Exposed-conductive-part = part of electrical equipment. Extraneous-conductive-part = conductive part from outside the electrical installation that can introduce a potential.',
    related: ['Extraneous-conductive-part', 'Circuit protective conductor (cpc)', 'Fault protection'],
    guide: 'earthing'
  },
  'definition-65': {
    meaning: 'An extraneous-conductive-part is not part of the electrical installation but can bring in a potential, usually Earth potential. Metallic service pipework or structural metal may fall into this category when the definition is actually met.',
    remember: 'Do not classify something as extraneous merely because it is metal; it must be liable to introduce a potential from outside the electrical installation.',
    related: ['Exposed-conductive-part', 'Protective bonding conductor', 'Equipotential bonding'],
    guide: 'earthing',
    guideDetail: 'Metallic services and structural parts may be extraneous conductive parts. Internal metallic pipework supplied through plastic does not automatically meet this definition: whether it can introduce a potential must be assessed.'
  },
  'definition-66': {
    meaning: 'Fault protection is the protection against electric shock that operates or remains effective when a single fault has occurred. It is the second protective layer after basic protection.',
    related: ['Basic protection', 'Protective earthing', 'Protective equipotential bonding', 'Residual current device (RCD)'],
    guide: 'protection',
    guideDetail: 'For protection by automatic disconnection, protective earthing and protective equipotential bonding work with a device that disconnects the supply under fault conditions.'
  },
  'definition-67': {
    meaning: 'A functional earth is provided to help equipment or a system operate correctly, not primarily to protect people against electric shock. Its purpose must therefore be distinguished from protective earthing.',
    related: ['Protective earthing', 'Main earthing terminal']
  },
  'definition-68': {
    meaning: 'Insulation is the non-conductive material that encloses, surrounds or supports a conductor. Different insulation functions—basic, supplementary or reinforced—describe what protective role that material provides.',
    related: ['Basic insulation', 'Supplementary insulation', 'Reinforced insulation', 'Double insulation']
  },
  'definition-69': {
    meaning: 'In an IT system the live parts are not directly connected to Earth, while the installation’s exposed-conductive-parts are earthed. This is fundamentally different from TN and TT arrangements, where the source has a direct earth connection.',
    related: ['System', 'TN system', 'TT system']
  },
  'definition-70': {
    meaning: 'The main earthing terminal (MET) is the central connection point where the installation’s protective conductors and the means of earthing come together. It is the reference junction for CPCs, bonding and the earthing conductor.',
    related: ['Circuit protective conductor (cpc)', 'Earthing conductor', 'Protective bonding conductor', 'Earth electrode'],
    guide: 'earthing',
    guideDetail: 'The main earthing terminal joins circuit and bonding protective conductors to the earthing conductor or other means of earthing.'
  },
  'definition-71': {
    meaning: 'An obstacle reduces the chance of accidental contact with live parts but does not prevent deliberate contact. It therefore offers a more limited protective function than a barrier or enclosure.',
    related: ['Barrier', 'Enclosure', 'Basic protection']
  },
  'definition-72': {
    meaning: 'A protective bonding conductor is the protective conductor used specifically for protective equipotential bonding. Its purpose is to connect relevant conductive parts so dangerous potential differences are limited.',
    remember: 'It is not the same as the CPC or earthing conductor, even though all are protective conductors.',
    related: ['Protective equipotential bonding', 'Bonding conductor', 'Protective conductor (PE)', 'Circuit protective conductor (cpc)', 'Earthing conductor'],
    guide: 'earthing'
  },
  'definition-73': {
    meaning: 'Protective conductor current is any current flowing in a protective conductor, including normal leakage current and current caused by an insulation fault. The term describes the current in the protective path, not one specific fault condition.',
    related: ['Leakage current', 'Fault current', 'Protective conductor (PE)']
  },
  'definition-74': {
    meaning: 'Protective earthing is earthing provided for safety. It is a purpose-based term and should be distinguished from functional earthing, which is provided for equipment or system operation.',
    related: ['Functional earth', 'Earthing', 'Fault protection'],
    guide: 'earthing'
  },
  'definition-75': {
    meaning: 'Protective equipotential bonding is equipotential bonding carried out for safety. It connects relevant conductive parts so that dangerous touch-voltage differences are reduced under fault conditions.',
    related: ['Equipotential bonding', 'Protective bonding conductor', 'Fault protection'],
    guide: 'earthing'
  },
  'definition-76': {
    meaning: 'PME is an earthing arrangement associated with TN-C-S in which the supply neutral is used as part of the means by which the installation earthing conductor is connected to Earth. The combined neutral/protective function exists on part of the supply system.',
    remember: 'PME describes a particular earthing arrangement within TN-C-S; the terms are related but are not simply interchangeable in every context.',
    related: ['TN-C-S system', 'PEN conductor', 'Earthing conductor']
  },
  'definition-77': {
    meaning: 'Reinforced insulation is a single insulation system that provides protection equivalent to double insulation. “Single” describes the protective system, not necessarily one physical layer.',
    related: ['Double insulation', 'Basic insulation', 'Supplementary insulation', 'Class II equipment']
  },
  'definition-78': {
    meaning: 'Shock current is the current that actually passes through a person or livestock with characteristics capable of causing dangerous physiological effects.',
    related: ['Electric shock', 'Leakage current', 'Fault current']
  },
  'definition-79': {
    meaning: 'Simultaneously accessible parts are conductive parts close enough that a person—or livestock in a relevant location—can touch them at the same time. This matters because a dangerous potential difference can then be bridged by the body.',
    related: ['Exposed-conductive-part', 'Extraneous-conductive-part', 'Equipotential bonding'],
    guide: 'earthing',
    guideDetail: 'Simultaneously accessible conductive parts require attention to their earthing arrangements and the potential difference that could exist between them.'
  },
  'definition-80': {
    meaning: 'Supplementary insulation is an independent extra insulation layer added to basic insulation to provide fault protection. Basic plus supplementary insulation together form double insulation.',
    related: ['Basic insulation', 'Double insulation', 'Reinforced insulation']
  },
  'definition-81': {
    meaning: 'For earthing classification, the system describes the relationship between the source, Earth and the installation’s exposed-conductive-parts. TN, TT and IT identify fundamentally different earthing relationships, while TN-C, TN-S and TN-C-S describe how neutral and protective functions are arranged.',
    related: ['TN system', 'TN-C system', 'TN-S system', 'TN-C-S system', 'TT system', 'IT system'],
    guide: 'earthing'
  },
  'definition-82': {
    meaning: 'In a TN system the source has a direct connection to Earth and the installation’s exposed-conductive-parts are connected back to that earthed source point through protective conductors.',
    related: ['TN-C system', 'TN-S system', 'TN-C-S system', 'TT system', 'IT system'],
    guide: 'earthing'
  },
  'definition-83': {
    meaning: 'TN-C combines the neutral and protective functions in one conductor throughout the system. That combined conductor is the PEN conductor.',
    related: ['PEN conductor', 'TN system', 'TN-C-S system']
  },
  'definition-84': {
    meaning: 'TN-C-S combines neutral and protective functions in one conductor for part of the system and separates them for another part. The supply-side combined conductor is the PEN.',
    related: ['PEN conductor', 'Protective multiple earthing (PME)', 'TN-C system', 'TN-S system'],
    guide: 'earthing'
  },
  'definition-85': {
    meaning: 'TN-S keeps the neutral and protective conductors separate throughout the system. The source is earthed, but the neutral and protective paths remain distinct conductors.',
    related: ['TN system', 'TN-C system', 'TN-C-S system']
  },
  'definition-86': {
    meaning: 'Triplen harmonics are the odd multiples of the third harmonic—3rd, 9th, 15th, 21st and so on. The definition identifies the harmonic family; their practical significance must be assessed in the particular system where they occur.'
  },
  'definition-87': {
    meaning: 'In a TT system the source is earthed, but the installation’s exposed-conductive-parts are connected to a separate earth electrode that is electrically independent of the source electrode.',
    remember: 'The installation’s own electrode is a defining feature of the TT earthing path.',
    related: ['Earth electrode', 'Earth electrode resistance', 'TN system', 'IT system'],
    guide: 'earthing',
    guideDetail: 'The earth electrode and earthing conductor form part of the TT fault loop. Electrode resistance and residual current device protection must be considered together.'
  },
  'definition-88': {
    meaning: 'Back-up protection is secondary protection intended to operate if the normal protection fails to clear a fault or detect an abnormal condition in the required time. It is a resilience concept rather than the primary protective function.'
  },
  'definition-89': {
    meaning: 'A cartridge fuse link contains the fuse element or elements inside a cartridge, usually with arc-extinguishing material, and has terminations that allow it to be installed as the replaceable operating part of a fuse.',
    related: ['Fuse', 'Fuse element', 'Fuse link']
  },
  'definition-90': {
    meaning: 'A circuit-breaker is a reusable switching and protective device that carries normal current and automatically interrupts specified abnormal currents such as short-circuit current. Its protective behaviour depends on the device type and rating.',
    related: ['Fuse', 'Overcurrent', 'Short-circuit current', 'Residual current operated circuit-breaker with integral overcurrent protection (RCBO)'],
    guide: 'protection'
  },
  'definition-91': {
    meaning: 'In this definition, danger means the risk of injury arising from electrical energy—such as shock, fire, burns, arcing or explosion—or from electrically controlled mechanical movement where electrical switching is intended to prevent that harm.',
    related: ['Emergency switching', 'Emergency stopping']
  },
  'definition-92': {
    meaning: 'Design current (Ib) is the current the circuit is expected to carry in normal service. It is a design input used when selecting conductor and protective-device ratings.',
    related: ['Current-carrying capacity of a conductor', 'Rated current', 'Overload current'],
    guide: 'final-circuits'
  },
  'definition-93': {
    meaning: 'A disconnector is a mechanical switching device that, when open, meets the requirements for isolation. Its defining feature is the assured isolating function in the open position.',
    related: ['Isolation', 'Switch-disconnector', 'Switch']
  },
  'definition-94': {
    meaning: 'Discrimination, also called selectivity, means arranging protective devices in series so the device nearest the fault operates in preference to an upstream device where the design requires that behaviour.',
    related: ['Back-up protection', 'Circuit-breaker', 'Fuse']
  },
  'definition-95': {
    meaning: 'Earth fault current is the current produced by a low-impedance fault from a line conductor to an exposed-conductive-part or protective conductor. It is a particular type of fault current involving the protective/earth path.',
    related: ['Fault current', 'Earth fault loop impedance', 'Circuit protective conductor (cpc)']
  },
  'definition-96': {
    meaning: 'Earth fault loop impedance (Zs) is the total impedance around the complete fault-current path from the fault, through the protective/earthing return path and source, and back through the line conductor to the fault point. Lower loop impedance generally allows a larger fault current and faster operation of overcurrent protection.',
    remember: 'Zs is the complete loop at the fault point. It is not just the resistance of the CPC or the earth electrode.',
    related: ['Earth fault current', 'Circuit protective conductor (cpc)', 'Earthing conductor', 'Earth electrode resistance'],
    guide: 'inspection-testing',
    guideDetail: 'Loop-impedance measurements must be assessed against protective-device requirements. Testing also requires precautions to preserve the protective function of the earthing conductor.'
  },
  'definition-97': {
    meaning: 'A fault is an abnormal circuit condition in which current takes an unintended path, commonly because insulation has failed or been bridged. The definition assumes negligible impedance at the fault position for conventional fault calculations.',
    related: ['Fault current', 'Earth fault current', 'Short-circuit current']
  },
  'definition-98': {
    meaning: 'Fault current is the general term for current that flows because a fault has occurred. Earth-fault current and short-circuit current are more specific fault-current cases.',
    related: ['Fault', 'Earth fault current', 'Short-circuit current']
  },
  'definition-99': {
    meaning: 'A fuse interrupts excessive current by melting a deliberately sized fuse element. Once it operates, the replaceable fuse link or element assembly must be renewed before service is restored.',
    related: ['Fuse element', 'Fuse link', 'Cartridge fuse link', 'Circuit-breaker']
  },
  'definition-100': {
    meaning: 'The fuse carrier is the movable part that holds the fuse link and allows it to be inserted into or removed from the fuse assembly.',
    related: ['Fuse', 'Fuse link']
  },
  'definition-101': {
    meaning: 'The fuse element is the intentionally fusible part designed to melt when the fuse operates. Its melting opens the circuit.',
    related: ['Fuse', 'Fuse link', 'Cartridge fuse link']
  },
  'definition-102': {
    meaning: 'The fuse link is the replaceable part of a fuse that contains the fuse element or elements. After operation it must be replaced or renewed before the fuse can be returned to service.',
    related: ['Fuse', 'Fuse element', 'Cartridge fuse link']
  },
  'definition-103': {
    meaning: 'Isolation is the safety function of separating all or part of an installation from every source of electrical energy. It is about making the section safe from supply, not merely switching a load off for normal control.',
    remember: 'Functional switching controls normal operation; isolation is a safety separation function.',
    related: ['Disconnector', 'Switch-disconnector', 'Functional switching', 'Emergency switching'],
    guide: 'switching',
    guideDetail: 'Isolation may be required at the origin, for individual circuits and for individual equipment. It serves a different purpose from ordinary functional switching.'
  },
  'definition-104': {
    meaning: 'Overcurrent is any current above the relevant rated value. For a conductor, the reference value is its current-carrying capacity, so both overload and fault conditions can produce overcurrent.',
    related: ['Overload current', 'Short-circuit current', 'Current-carrying capacity of a conductor']
  },
  'definition-105': {
    meaning: 'Overcurrent detection is the process of determining that current has exceeded a set value for a specified time. It describes detection logic, not necessarily the complete protective device that then interrupts the circuit.'
  },
  'definition-106': {
    meaning: 'Overload current is overcurrent in a circuit that is otherwise electrically sound. It is therefore different from short-circuit or earth-fault current, which results from a fault path.',
    related: ['Overcurrent', 'Short-circuit current', 'Fault current']
  },
  'definition-107': {
    meaning: 'Prospective fault current is the fault current that would flow at a particular point if a negligible-impedance fault occurred. Protective equipment must have adequate capability for the prospective fault level at its installation point.',
    related: ['Fault current', 'Short-circuit current', 'Earth fault current'],
    guide: 'inspection-testing',
    guideDetail: 'Design must account for the maximum prospective fault current expected from the distribution network, rather than relying only on a single measured value.'
  },
  'definition-108': {
    meaning: 'Protective separation keeps one circuit electrically separated from another by insulation or protective screening arrangements strong enough to provide the stated protective separation.',
    related: ['Double insulation', 'Reinforced insulation', 'Simple separation']
  },
  'definition-109': {
    meaning: 'Rated current is the current value assigned to equipment or a system for specified operating conditions. It is a declared equipment value, whereas design current describes the expected current of a particular circuit.',
    related: ['Design current (of a circuit)', 'Current-carrying capacity of a conductor', 'Overcurrent']
  },
  'definition-110': {
    meaning: 'Residual current is the algebraic imbalance of the currents in all live conductors at a point. In a healthy balanced circuit the currents should substantially cancel; an imbalance indicates current returning by another path.',
    related: ['Residual current device (RCD)', 'Residual operating current', 'Leakage current']
  },
  'definition-111': {
    meaning: 'An RCD monitors residual-current imbalance and opens its contacts when the specified operating condition is reached. It is a residual-current protective function and does not automatically imply integral overcurrent protection.',
    remember: 'RCCB = residual-current protection without integral overload/short-circuit protection. RCBO = residual-current protection plus integral overcurrent protection.',
    related: ['Residual current', 'Residual operating current', 'Residual current operated circuit-breaker with integral overcurrent protection (RCBO)', 'Residual current operated circuit-breaker without integral overcurrent protection (RCCB)'],
    guide: 'rccds',
    guideDetail: 'RCD selection considers the device type, connected load, protective function, rated current, residual-current behaviour, directionality, markings, ambient temperature and coordination with other devices.'
  },
  'definition-112': {
    meaning: 'An RCBO combines residual-current operation with integral protection against overload and/or short-circuit. It can therefore perform functions that would otherwise require an RCD plus a separate overcurrent protective device.',
    related: ['Residual current device (RCD)', 'Residual current operated circuit-breaker without integral overcurrent protection (RCCB)', 'Circuit-breaker'],
    guide: 'rccds'
  },
  'definition-113': {
    meaning: 'An RCCB provides residual-current operation but does not provide integral overload or short-circuit protection. Separate overcurrent protection is therefore required where those functions are needed.',
    related: ['Residual current device (RCD)', 'Residual current operated circuit-breaker with integral overcurrent protection (RCBO)', 'Circuit-breaker'],
    guide: 'rccds'
  },
  'definition-114': {
    meaning: 'Residual operating current is the residual current level that causes an RCD to operate under the stated conditions. It is the threshold concept behind values such as rated residual operating current IΔn.',
    related: ['Residual current', 'Residual current device (RCD)'],
    guide: 'rccds'
  },
  'definition-115': {
    meaning: 'Short-circuit current is an overcurrent produced by a very low-impedance fault between live conductors at different normal potentials. It is a fault current, not an overload in an otherwise sound circuit.',
    related: ['Fault current', 'Overcurrent', 'Overload current', 'Prospective fault current (Ipf)'],
    guide: 'protection'
  },
  'definition-116': {
    meaning: 'An SPD limits transient overvoltage and diverts surge current so that damaging surge energy is controlled. It is intended for short-duration transient events rather than ordinary steady overvoltage or overload protection.',
    related: ['Overcurrent', 'Switchgear'],
    guide: 'surge',
    guideDetail: 'Type 1, Type 2 and Type 3 surge protective devices have different applications and require coordination. Short connecting conductors reduce the additional voltage developed during a surge.'
  },
  'definition-117': {
    meaning: 'A switch is intended to make, carry and break current in normal service and may also carry specified abnormal current for a limited time. It is not automatically an isolating device unless it also meets the relevant isolation requirements.',
    related: ['Switch-disconnector', 'Disconnector', 'Functional switching']
  },
  'definition-118': {
    meaning: 'A switch-disconnector performs normal switching and, when open, also satisfies the isolating requirements of a disconnector. It therefore combines switching and isolation capability.',
    related: ['Switch', 'Disconnector', 'Isolation'],
    guide: 'switching'
  },
  'definition-119': {
    meaning: 'FELV uses extra-low voltage for functional reasons but does not satisfy all the protective requirements of SELV or PELV. It must therefore not be assumed to provide the same electric-shock protection as those systems.',
    related: ['SELV (separated extra-low voltage)', 'PELV (protective extra-low voltage)', 'Voltage, nominal']
  },
  'definition-120': {
    meaning: 'Leakage current is current flowing in an unintended conductive path during normal operation. Because it occurs without a fault, it must be distinguished from fault current even though it may contribute to protective-conductor or residual current.',
    related: ['Protective conductor current', 'Residual current', 'Fault current']
  },
  'definition-121': {
    meaning: 'PELV provides the protective features required for SELV except that it is not electrically separated from Earth. The permitted Earth connection is the key distinction from SELV.',
    related: ['SELV (separated extra-low voltage)', 'Functional extra-low voltage (FELV)', 'Voltage, nominal'],
    guide: 'protection',
    guideDetail: 'SELV and PELV provide protection against electric shock only when their voltage and circuit-separation requirements are satisfied.'
  },
  'definition-122': {
    meaning: 'A reduced low-voltage system limits nominal voltage to 110 V line-to-line and 63.5 V line-to-Earth. It is a defined reduced-voltage arrangement and should not be confused with SELV merely because both use lower voltages.'
  },
  'definition-123': {
    meaning: 'SELV is an extra-low-voltage system electrically separated from Earth and other systems so that a single fault does not create an electric-shock risk through those other systems. Both the voltage level and the separation arrangement matter.',
    related: ['PELV (protective extra-low voltage)', 'Functional extra-low voltage (FELV)', 'Class III equipment', 'Voltage, nominal'],
    guide: 'protection',
    guideDetail: 'SELV and PELV protection depends on the source, circuit separation, insulation and connections as well as the voltage level.'
  },
  'definition-124': {
    meaning: 'Simple separation is separation by basic insulation only. It is therefore a lower level of separation than protective separation, which requires stronger insulation or protective-screening arrangements.',
    related: ['Protective separation', 'Basic insulation']
  },
  'definition-125': {
    meaning: 'Nominal voltage is the designated voltage used to describe an installation or part of it. The historical definition also sets the voltage bands used by that edition for extra-low, low and high voltage.',
    remember: 'Treat the numerical bands above as historical 17th-edition source wording when applying requirements today; always check the current edition and local requirements.',
    related: ['SELV (separated extra-low voltage)', 'PELV (protective extra-low voltage)', 'Reduced low voltage system']
  },
  'definition-126': {
    meaning: 'Emergency stopping is the emergency-switching function specifically intended to stop an operation. The focus is stopping the dangerous operation, not necessarily isolating every source for maintenance.',
    related: ['Emergency switching', 'Isolation', 'Functional switching'],
    guide: 'switching'
  },
  'definition-127': {
    meaning: 'Emergency switching is rapid switching intended to remove unexpected danger. It is a safety response to an emergency and is distinct from normal functional switching or planned isolation.',
    related: ['Emergency stopping', 'Functional switching', 'Isolation'],
    guide: 'switching',
    guideDetail: 'Emergency switches require suitable operation, accessibility, identification and reset behaviour.'
  },
  'definition-128': {
    meaning: 'Functional switching is ordinary operational control: switching electrical energy on, off or varying it so equipment or part of the installation can function as intended.',
    remember: 'Functional switching is for normal operation; it is not the same safety function as isolation or emergency switching.',
    related: ['Switch', 'Isolation', 'Emergency switching'],
    guide: 'switching'
  },
  'definition-129': {
    meaning: 'Inspection is the examination of an installation using appropriate senses to assess visible and otherwise observable condition and compliance. It is performed before and alongside testing, but is not the same thing as measurement.',
    related: ['Testing', 'Verification', 'Reporting'],
    guide: 'inspection-testing',
    guideDetail: 'Inspection precedes testing. It covers selection, identification, routing, protective measures, devices, notices, access and workmanship.'
  },
  'definition-130': {
    meaning: 'An instructed person is someone who is not necessarily independently skilled for the work but has been adequately advised or supervised by a skilled person so they can recognise and avoid electrical risks.',
    related: ['Skilled person (electrically)', 'Ordinary person']
  },
  'definition-131': {
    meaning: 'Maintenance includes both technical and administrative actions used to keep equipment capable of performing its required function or restore it to that condition. It includes supervision as well as hands-on repair work.'
  },
  'definition-132': {
    meaning: 'Minor works are additions or alterations to an existing installation that do not include providing a new circuit. The boundary is therefore whether a new circuit is created, not simply how physically small the job appears.'
  },
  'definition-133': {
    meaning: 'An ordinary person is a person who is neither electrically skilled nor electrically instructed. The classification describes the person’s electrical knowledge/supervision status for the relevant situation.',
    related: ['Instructed person (electrically)', 'Skilled person (electrically)']
  },
  'definition-134': {
    meaning: 'Reporting is the communication of periodic inspection and testing results to the person who ordered the work. It is the formal output of the assessment process rather than the inspection or tests themselves.',
    related: ['Inspection', 'Testing', 'Verification'],
    guide: 'inspection-testing'
  },
  'definition-135': {
    meaning: 'A skilled person has education, training and practical skill appropriate to the electrical work and can recognise and avoid the hazards electricity can create. The required competence is therefore related to the nature of the work being undertaken.',
    related: ['Instructed person (electrically)', 'Ordinary person']
  },
  'definition-136': {
    meaning: 'A temporary electrical installation is erected for a particular short-term purpose and is dismantled when that purpose ends. Temporary describes the intended life of the installation, not a lower safety standard.'
  },
  'definition-137': {
    meaning: 'Testing uses practical measures and instruments to prove aspects of an installation that cannot be established by inspection alone. It includes obtaining measured values and comparing them with the applicable criteria.',
    related: ['Inspection', 'Verification', 'Reporting'],
    guide: 'inspection-testing',
    guideDetail: 'Testing includes continuity, insulation resistance, polarity, earth-electrode resistance, earth fault loop impedance, prospective fault current and functional operation.'
  },
  'definition-138': {
    meaning: 'Verification is the complete process of checking compliance with the relevant BS 7671 requirements and comprises inspection, testing and certification. Inspection and testing are therefore components of verification, not synonyms for it.',
    related: ['Inspection', 'Testing', 'Reporting'],
    guide: 'inspection-testing'
  }
};
