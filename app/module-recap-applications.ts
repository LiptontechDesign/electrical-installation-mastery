import {page, type RecapCopy} from './module-recap-content';

export const applicationRecaps: Record<string, RecapCopy> = {
  'p09-l04': page('Fault finding starts when a reading does not fit the expected circuit. Treat it as evidence to explain, not as a number to correct by trial and error.', [
    ['Ring integrity','An open conductor can leave outlets apparently working while changing the circuit’s electrical behaviour.'],
    ['Insulation problems','Check what remains connected before attributing a low insulation reading to the fixed cable.'],
    ['Connection defects','Reversed polarity and high-resistance connections require a different explanation from an open ring. Relate each finding to the tested path.'],
  ], 'flow',['Expected circuit behaviour','Observed reading','Possible causes','A test that separates those causes'],'The ring and insulation case studies show why several different faults can share the symptom “it still works”.'),
  'p09-l08': page('Trace the actual circuit, including the return and protective paths. Labels and assumptions are starting clues—not proof of what is connected.', [
    ['Loss of supply','The dishwasher case isolates a break in the neutral after other explanations are checked. A missing neutral can stop a load just as a missing line can.'],
    ['Borrowed neutral','A return path taken from another circuit can disturb residual-current protection and complicate isolation.'],
    ['Misleading voltage','Unexpected line-to-earth or neutral-to-earth readings can point to a defective protective path. Establish the wiring condition before interpreting a single reading.'],
  ], 'compare',['Load not working → examine the complete circuit','RCD behaviour → examine outgoing and returning paths','Unexpected voltage → examine references and connections'],'Changes made for diagnosis must not be left as an undocumented permanent circuit arrangement.'),
  'p09-l11': page('A useful diagnostic measurement narrows the suspect area. The leakage and heater cases connect an observed symptom with a specific part of the circuit or load.', [
    ['Residual-current measurement','A leakage clamp measures the imbalance through the conductors enclosed by its jaws; that is different from measuring ordinary line load current.'],
    ['Divide the investigation','Compare sections or groups to identify where the abnormal contribution appears, following a controlled test procedure.'],
    ['Load behaviour','A heater that does not warm may have a supply, control or element problem. Confirm the cause rather than replacing parts from the symptom alone.'],
  ], 'flow',['Describe the symptom','Choose a discriminating measurement','Locate the suspect section','Verify the diagnosis and repair'],'A clamp reading identifies what passes through the measured boundary; it does not automatically identify the failed component.'),
  'p16-l04': page('Early load estimation and service detection reduce uncertainty before installation begins. Both depend on understanding what the available evidence can—and cannot—show.', [
    ['Estimate demand','The load-estimation examples use building purpose and expected electrical loads to inform supply and distribution planning.'],
    ['Supply consequences','The estimated demand can change the scale of incoming supply or transformer provision. Example thresholds belong to their stated supply context.'],
    ['Hidden services','A detector response needs interpretation across a survey. No signal is not proof that an area contains no services.'],
  ], 'flow',['Building use and load brief','Demand estimate and assumptions','Supply / distribution strategy','Site survey and route coordination'],'Refine an early estimate as equipment and site information become available.'),
  'p16-l05': page('First fix establishes routes and positions; second fix completes connections and accessories. The quality of the finished job depends on decisions made before either stage.', [
    ['First fix','Coordinate boxes, routes and existing services before cutting or chasing. The on-site case also identifies defects that need resolving.'],
    ['Second fix','Keep conductor identity and protective connections consistent with the circuit drawing when fitting the accessories.'],
    ['Service-location methods','The CAT and generator training distinguishes direct connection, clamp application and induction; each has limitations and a defined use.'],
  ], 'flow',['Survey and agree positions','First-fix routes and boxes','Second-fix connections','Verification and records'],'Service detection is part of a safe-work plan, not permission to drill wherever a detector is silent.'),
  'p10-l08': page('Complete projects connect design, installation and verification. Their value is the chain of decisions, not copying the exact cable or accessory from the filmed job.', [
    ['New circuits and alterations','Shed, cooker and consumer-unit cases assess existing conditions and include checks after the physical installation.'],
    ['Three-phase distribution','Single-phase loads can be spread across phases, while the board and terminations still need coordinated ratings and torque settings.'],
    ['Condition assessment','The poor-installation example shows why apparent age, operation or appearance alone cannot establish whether equipment is serviceable.'],
  ], 'flow',['Assess existing installation','Design the defined work','Install and inspect','Test, document and hand over'],'Resolve identified defects and limitations explicitly; do not conceal them behind the new work.'),
  'p11-v2-l05': page('Accessory selection is a physical and electrical decision. The chosen product must fit the box, conductors and intended use—not merely match the finish.', [
    ['Position and depth','Box layout, alignment and available depth affect wiring space and the final accessory fit. Survey before chasing.'],
    ['Terminal functions','Read line, neutral, earth and supply/load markings on the actual accessory, especially fused connection units.'],
    ['USB accessories','Charging output, supported charging modes, standby consumption and mounting depth are product-specific selection details.'],
  ], 'compare',['Front face → user function and finish','Back box → space and conductor management','Terminals → actual supply, load and protective connections'],'Safe isolation remains necessary when changing an accessory; an apparently simple replacement is still electrical work.'),
  'p11-v2-l08': page('Kitchen and high-power appliance circuits start with the room layout and equipment requirements. A remembered cable size is not a complete specification.', [
    ['Kitchen planning','Coordinate sockets and connection points with appliances, sinks, worktops and access rather than adding them after the layout is fixed.'],
    ['Cooking demand','The cooker example applies diversity in a defined domestic context. State the load and assumptions before using an allowance.'],
    ['Shower isolation','Disconnection requirements follow the equipment and installation requirements. Distinguish an operational switch from an appropriate means of isolation.'],
  ], 'flow',['Room and appliance brief','Load and demand assessment','Connection / isolation positions','Circuit design and verification'],'Do not transfer the example’s dimensions, diversity factors or cable selection to a different installation without assessment.'),
  'p11-v2-l11': page('An accessory must suit both its electrical duty and its environment. Labels describe tested properties, not a promise of suitability in every location.', [
    ['Shaver supply','An isolating transformer changes the supply arrangement. Its presence does not make contact with both secondary conductors safe.'],
    ['Outdoor enclosures','Cable entries and assembly details are part of maintaining the enclosure’s protection; drilling an entry changes the enclosure boundary.'],
    ['Industrial sockets','Consider voltage, current, pin arrangement, environmental protection and impact duty as separate selection questions.'],
  ], 'compare',['Electrical duty → supply, current and contacts','Environmental duty → dust / water protection','Mechanical duty → impact and installation conditions'],'Use the complete installed product’s suitability, not just a high IP number on an unopened box.'),
  'supp-lighting-03': page('Separate the light leaving a source from the light arriving at a surface. A lamp’s electrical watts alone do not tell you the illuminance on a desk.', [
    ['Quantities','Lumens describe luminous flux; candelas describe intensity in a direction; lux describes flux per unit area at a surface.'],
    ['Directly below a source','The point-source model uses luminous intensity divided by squared source-to-point distance.'],
    ['Distance effect','At twice the distance the illuminance becomes one quarter, not one half. The relationship is inverse-square, not exponential.'],
  ], 'equation',['E = I ÷ d²','1000 cd ÷ (2 m)² = 250 lx','Double d → one quarter E'],'E: illuminance; I: luminous intensity; d: distance. This idealised point calculation is not a whole-room lighting assessment.'),
  'supp-lighting-05': page('At an offset point, account for both the longer light path and the angle at which the light meets the surface.', [
    ['Distance','Use the actual source-to-point distance, not automatically the vertical mounting height.'],
    ['Angle reference','Measure the incidence angle from the surface normal—the line perpendicular to the surface.'],
    ['Directly underneath','The angle is zero and cos 0° = 1, returning the inverse-square formula as a special case.'],
  ], 'equation',['E = I cos θ ÷ d²','d² = h² + x²','cos θ = h ÷ d (horizontal receiving surface)'],'h: vertical height; x: horizontal offset. Use degree mode when entering the angles in these examples.'),
  'supp-lighting-09': page('The lumen method estimates average illuminance across an indoor area. It accounts for light utilisation and the reduction expected over the installation’s life.', [
    ['Area and target','Start with the room area and required average illuminance. Point illuminance and room average are different results.'],
    ['Loss factors','Utilisation and maintenance factors reduce the useful maintained light. Do not treat all emitted lumens as arriving at the working plane.'],
    ['Count luminaires','Divide the required source lumens by lumens per complete luminaire and round the fitting count up. Count all lamps in each fitting.'],
  ], 'equation',['N = E × A ÷ (F × UF × MF)','F = lumens per complete luminaire','Round required N upward'],'E in lux, A in m²; UF: utilisation factor; MF: maintenance factor. A calculated count still needs an appropriate layout.'),
  'supp-lighting-12': page('When two lights contribute to one point, calculate each contribution separately. Their distances and incidence angles may differ.', [
    ['Label the geometry','Name the source and receiving point before choosing dimensions. A value for point A cannot be reused blindly at point B.'],
    ['Calculate independently','Apply the point-source and angle relationship to each source-to-point path.'],
    ['Then add','Add the illuminance contributions at the same point; do not add distances or substitute a combined intensity without a valid model.'],
  ], 'equation',['Epoint = E₁ + E₂ + …','Each Eᵢ = Iᵢ cos θᵢ ÷ dᵢ²','Repeat the calculation for the next point'],'The supplied exam cases use this separation to keep multiple sources and receiving points organised.'),
  'p12-v2-l06': page('A lighting scheme succeeds when people can see and use the space comfortably. Calculation supports that goal; it does not replace observation and judgement.', [
    ['Start with the task','Identify what people need to see, where they look and how they move through the space.'],
    ['Shape and contrast','Lighting surfaces and objects can create depth and hierarchy. More fittings or more lumens alone do not guarantee a better result.'],
    ['Controls and maintenance','Keep user controls understandable and consider access, compatibility and upkeep when selecting the scheme.'],
  ], 'flow',['Observe the space and visual task','Choose light distribution and contrast','Check quantities and product performance','Review controls and maintenance'],'The “Thirty Rules” are design prompts, not mandatory technical regulations.'),
  'p12-v2-l10': page('A fitting is part of an assembly. Its thermal and construction compatibility affects the performance of the complete installation.', [
    ['Ceiling compatibility','A downlight’s fire-performance claim refers to tested ceiling/floor arrangements. A larger minute-rating does not establish suitability for every ceiling.'],
    ['LED strip selection','Choose the required light output and colour behaviour before matching the strip, supply and controls.'],
    ['Heat management','High operating temperature can shorten useful life and reduce output even when the strip initially lights correctly. Profiles and installation conditions matter.'],
  ], 'compare',['Downlight → tested ceiling assembly','LED strip → output, voltage and control needs','Thermal arrangement → operating conditions and service life'],'Check compatibility of the whole system rather than relying on a product label in isolation.'),
  'p12-v2-l13': page('Reliable dimming depends on the combination of lamp or LED load, driver and controller. A working full-brightness test does not establish low-level performance.', [
    ['Driver ratings','Read the output, mounting and temperature information. Similar symbols may describe different conditions or limits.'],
    ['Dimmer compatibility','Leading-edge and trailing-edge behaviour, permitted loads and manufacturer compatibility information affect the result.'],
    ['Commissioning','Check low-end stability, start-up and adjustment across the useful range. A changed lamp design can behave differently from an older version.'],
  ], 'flow',['Identify lamp / LED load','Match driver and dimmer','Set permitted operating range','Check start-up, low level and flicker'],'Do not solve flicker by bypassing protection or applying arbitrary settings from a different product.'),
  'p12-v2-l16': page('Outdoor lighting should make the intended surfaces visible without exposing people to glare or leaving the equipment unsuitable for its environment.', [
    ['Ratings','IP describes ingress protection; IK describes impact resistance. They address different hazards.'],
    ['Visual effect','The garden examples use the effect of light on paths, plants and structures rather than making the source itself the dominant object.'],
    ['Installed condition','Consider cable routes, connections, water exposure and future maintenance as part of the lighting design.'],
  ], 'compare',['IP → solids and water ingress','IK → mechanical impact','Lighting effect → where the useful light falls'],'A case-study preference about supply voltage is not a universal installation rule. Retain the safety and environmental assessment.'),
  'p12-v2-l22': page('Choose a control architecture that supports the space and its users. More features can create more commissioning and maintenance demands.', [
    ['Local control','PIR sensing and manual override have different operating paths. Understand what stays energised in each mode.'],
    ['Digital control','DALI separates control communication from the supply arrangement; equipment capability and wiring requirements remain important.'],
    ['Connected products','Check dimming, two-way operation, neutral requirements and local versus network-dependent behaviour for the actual product.'],
  ], 'flow',['Required user actions and scenes','Sensors, overrides and schedules','Compatible wiring and control architecture','Commissioning and usable handover'],'Control commands and “off” states are not substitutes for electrical isolation.'),
  'p12-l04': page('Emergency lighting has a safety purpose distinct from normal visual comfort. Its provision, inspection, testing and records must remain visible in the final design.', [
    ['Failure condition','Consider what happens when the normal lighting supply is unavailable, not just how the space looks during ordinary use.'],
    ['Inspection and test','Visible damage or failed indicators need attention alongside functional and duration testing. Automatic tests still need recorded and reviewed results.'],
    ['Final review','Check fitting positions, layers, controls and maintenance access against the intended use of the space.'],
  ], 'flow',['Identify the emergency-lighting purpose','Coordinate normal and emergency operation','Inspect and test to the applicable scheme','Record results and remedy defects'],'Intervals and standards discussed in dated videos need checking against the current requirements for the premises.'),
  'p13-v2-l03': page('KNX programming links physical equipment with logical functions. The building view, topology and group addresses describe different aspects of the same installation.', [
    ['Physical structure','Building and topology views help organise locations and devices, but they are not interchangeable representations.'],
    ['Logical links','Group addresses connect relevant communication objects so a command can produce the intended action.'],
    ['Commissioning tools','Device identification and diagnostic functions help check what is actually present and programmed. Preserve project documentation.'],
  ], 'compare',['Building view → where equipment belongs','Topology / individual address → which device','Group address → which shared function'],'The ETS demonstrations teach organisation and relationships; menu details belong to the software version shown.'),
  'p13-v2-l09': page('Connected-building systems need evidence that communication and control will work, not merely evidence that a cable has continuity.', [
    ['Network testing','Verification checks wiring; qualification assesses support for an application; certification checks the link against a defined test standard and setup.'],
    ['Termination model','Field-terminated plugs and MPTL links need the appropriate adapters and test configuration rather than an assumed ordinary patch-lead test.'],
    ['Security interfaces','Camera performance, access-control wiring and gate controllers depend on supply, network capacity, input/output functions and operating requirements.'],
  ], 'compare',['Verify → is the wiring correct?','Qualify → can it support the application?','Certify → does it meet the selected test limit?'],'Record the actual link type and tester configuration. A pass obtained with the wrong setup is not useful evidence.'),
  'p13-v2-l13': page('Life-safety and powered-gate systems need deliberate failure behaviour. A functioning command or detector is not by itself proof of a safe system.', [
    ['Powered gates','Safety edges, sensors and controller functions address different movement hazards. The complete gate and its environment need assessment.'],
    ['Detector selection','Smoke, heat and other sensing technologies have different applications. A CO warning device is not simply interchangeable with a fire detector.'],
    ['System scope','The fire-alarm material distinguishes domestic and non-domestic contexts and connects detection, alarms, interfaces and response logic.'],
  ], 'flow',['Define the hazard and system purpose','Select compatible detection / protective functions','Verify the intended response and failure behaviour','Document commissioning and maintenance'],'Do not carry a detector location, delay setting or gate safety arrangement from a filmed example into another site without specialist design.'),
  'p14-v2-l09': page('A solar-and-storage installation adds sources of energy, not just another load. Survey and isolation planning must identify where energy can still be present.', [
    ['Site survey','Assess roof and structure, cable routes, equipment locations and the customer’s requirements before specifying the system.'],
    ['Existing installation','Supply capacity, protection, fault conditions, voltage drop and labelling affect how the new system connects.'],
    ['Multiple sources','PV, batteries, inverter outputs and the grid can create different energisation paths. Inverter shutdown is not the same as proving every conductor dead.'],
  ], 'compare',['Grid → incoming AC source','PV array → DC source when illuminated','Battery / inverter → stored-energy and converted supplies'],'This is a source-identification aid, not a switching sequence. Follow the complete equipment-specific isolation plan.'),
  'p14-v2-l07': page('Equipment position is part of safety and maintainability. A convenient wall or loft space may introduce structural, fire, temperature or access problems.', [
    ['Location','Battery weight, fire considerations, ventilation and access differ from ordinary accessories. Inverter noise and cable distances also matter.'],
    ['PV verification','The test demonstration relates continuity, insulation, polarity and string measurements to a controlled sequence and the available conditions.'],
    ['System integration','The hybrid-installation case combines protection, isolation, metering and DC/AC connections; the components must work as a coordinated system.'],
  ], 'flow',['Survey structure and environment','Select equipment locations','Coordinate routes, isolation and protection','Verify and record the installed system'],'Location recommendations in the source are jurisdiction- and edition-specific; they are not a universal permission to install batteries in a particular room.'),
  'p14-l07': page('Backup systems differ in how they convert energy and transfer loads. “Backup available” does not tell you which circuits, phases or interruptions the system supports.', [
    ['Inverter-charger','DC-to-AC conversion, charging and transfer functions interact but remain distinct.'],
    ['Transfer switches','Open transition interrupts before transfer. Closed transition requires controlled synchronisation and temporary paralleling; it is not a simple substitute.'],
    ['UPS and phases','Standby, line-interactive and double-conversion UPS designs behave differently. A three-phase backup case cannot be assumed from a single-phase product.'],
  ], 'compare',['Conversion → what form of power is produced','Transfer → how the load changes source','Backup scope → which loads and phases remain supplied'],'Confirm neutral, earthing and protection behaviour for the actual source arrangement rather than inferring it from a block diagram.'),
  'p14-v2-l16': page('EV charging is a sustained load connected to a particular supply and earthing arrangement. Successful handover includes operating limits and fault interpretation.', [
    ['Survey and demand','Check the existing installation, load management, cable route and communication options before selecting the connection.'],
    ['Protective functions','The source discusses open-PEN conditions and charger protection in a UK context. Suitability depends on the actual system and applicable requirements.'],
    ['Commissioning and handover','CT load sensing, charging modes, schedules and fault indicators must be set and explained for the installed charger.'],
  ], 'flow',['Supply / earthing and load assessment','Protection and load-management design','Connections and commissioning','Explain modes, limits and fault response'],'A status LED meaning or protection feature belongs to the demonstrated model; use the installed product’s information.'),
  'p15-v2-l04': page('Building services combine electrical control with a physical process. A motor running or a fan spinning is only one part of successful operation.', [
    ['Motor and pump control','Distinguish power contacts from the control path. Pressure, level and overload inputs determine when a pump should run or stop.'],
    ['Ventilation','Duct layout and restrictions affect delivered airflow; electrical operation alone does not establish ventilation performance.'],
    ['Sensitive loads','Transient overvoltage can damage or degrade lighting electronics. Surge protection must be considered as a coordinated system.'],
  ], 'compare',['Control evidence → correct response to inputs','Process evidence → water flow / pressure or airflow','Protection evidence → intended fault response'],'The pump-panel case includes operating instructions: leave users with understandable modes, not an unexplained control cabinet.'),
  'p16-l08': page('Professional judgement connects reliable evidence with a clearly priced scope. Explain what you know, what remains uncertain and what the quoted work includes.', [
    ['Thermal evidence','Surface material and emissivity affect apparent temperature. Shiny metal can reflect infrared radiation and mislead a comparison.'],
    ['Pricing','Build the materials list, obtain prices and lead times, and allow for the labour needed to deliver the defined work.'],
    ['Rewire scope','The case study compares an estimate with actual effort. Access, extent of work and assumptions need to be explicit rather than hidden in a headline price.'],
  ], 'flow',['Reliable survey and diagnostic evidence','Defined scope and assumptions','Materials, lead times and labour','Clear quotation and handover responsibilities'],'A hot-looking image is not a complete diagnosis; a price from one filmed job is not a rate for another job.'),
};
