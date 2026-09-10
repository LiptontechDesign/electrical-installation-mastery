// Answers belong to the exact retrieval prompts in lesson-guides, not to a
// generic reminder. Numerical answers carry separate, renderable working.
const rows = `
p01-l01|Protons are positive and neutrons have no net charge; both are in the nucleus. Electrons are negative and occupy the surrounding electron structure.
p01-l02|Mobile conduction electrons move through copper while its positive ion cores remain in the solid structure. Charge can therefore move without the copper itself flowing.
p01-l03|Coulombs measure charge. Prefixes express the same quantity at a convenient scale; milli means one thousandth and micro means one millionth.
p01-l04|10 C of charge.
p01-l05|The load. A lamp converts electrical energy into light and heat; a motor converts part of it into mechanical output.
p01-l06|Current halves, assuming the same voltage is maintained across the resistance.
p01-l07|4 Ω.
p01-l08|10 Ω.
p01-l09|The added branch provides another conducting path. At the same supply voltage the source delivers more total current, so the equivalent resistance is lower.
p01-l10|4 Ω.
p01-l11|Add the individual branch currents, or divide the supply voltage by the equivalent resistance. Both methods should give the same total for the same resistive circuit.
p01-l12|24 W.
p01-l13|Power increases by a factor of four, because resistive heating depends on current squared at constant resistance.
p01-l14|48 W.
p01-l15|6 kWh of energy.
p01-l16|The magnetic effect. Current in the coil creates a field that moves the relay’s armature and contacts.
p01-l17|At the same current, increasing the number of turns or adding a suitable ferromagnetic core can strengthen the field. At fixed voltage, extra turns may also increase resistance and reduce current, so the result is not automatic.
p01-l18|Induction needs a change in magnetic flux linkage. With no motion or field change, the flux linkage is constant and its rate of change is zero.
p01-l19|Continued rotation changes the sign of the rate of flux-linkage change. This reverses the induced voltage polarity on successive half-cycles.
p01-l20|At 0°, 180° and 360° in one complete cycle, then every further 180°.
p01-l21|0.020 s, or 20 ms.
p01-l22|Resistance and net reactance. Their phase relationship must be included when finding the magnitude of impedance.
p01-l23|At higher frequency, current changes more rapidly. The inductor develops greater opposing induced voltage for the same current amplitude; its reactance increases with frequency.
p01-l24|Their voltage contributions are 90° apart in a series resistance–inductance model. Their magnitudes combine using a right-angle triangle, not ordinary addition.
p01-l25|Parallel gives the greater capacitance. Parallel capacitances add; identical series capacitors give the individual capacitance divided by their number.
p01-l26|Current increases, assuming supply voltage and real power remain unchanged.
p01-l27|The hypotenuse: apparent power, measured in VA or kVA, in the sinusoidal power-triangle model.
p01-l28|A voltmeter measures potential difference between two points. Connecting it across those points provides the comparison; its high input impedance limits the current it draws.
p01-l29|Its low-resistance current input can create a short circuit, causing high fault current and potentially an arc or instrument failure.
p01-l30|Other connected paths can carry the meter’s test current. Their parallel resistance makes the combined reading lower than the resistor’s own resistance.
p01-l31|The magnetic effects of equal outgoing and returning currents cancel. The clamp then measures only their residual imbalance, within its sensitivity and accuracy.
p02-l01|A route exposed to impact or other mechanical damage may need suitable armoured cable or another protective system. Selection still depends on the actual cable rating, environment, flexibility, termination and installation method.
p02-l02|The schedule identifies which device supplies and protects each circuit. A mismatch can cause someone to isolate the wrong circuit or use the wrong protective-device data during verification.
p02-l03|The fundamental neutral current is zero in the ideal balanced case, because the three equal current phasors cancel.
p02-l04|TT connects installation exposed conductive parts to a local earth electrode electrically independent of the supply electrode. TN systems use a protective return path connected to the supply’s earthed point.
p02-l05|Bonding connects relevant conductive parts to limit potential differences. An appliance still needs its designed protective arrangement; pipework is not a substitute for its circuit protective conductor.
p02-l06|Its breaking capacity may be below the prospective fault current. Correct load-current rating does not establish that it can safely interrupt the available fault.
p02-l07|A balanced overload can increase both outgoing and returning currents equally. An RCCB senses their difference, so it needs coordinated overcurrent protection.
p02-l08|Overload and short-circuit protection, in addition to residual-current protection.
p02-l09|A higher external loop impedance generally reduces prospective earth-fault current at the same voltage. The complete fault loop also includes the circuit contribution.
p02-l10|Conductor capacity, fault protection, routing, mechanical protection, the supply protective device and the distributor’s conditions all matter. Length alone cannot establish adequate protection.
p02-l11|Interchanging two phases reverses phase sequence and therefore the rotating magnetic field direction in a conventional three-phase motor.
p03-l01|A nick can reduce conductor cross-section and create a stress concentration. The conductor may later overheat or break even though it initially remains connected.
p03-l02|Strain on individual cores can pull directly on their terminals or damage insulation. A suitable cord grip normally secures the cable assembly as the accessory manufacturer specifies.
p03-l03|Loose clamping, damaged strands, trapped insulation, incompatible conductors or incorrect preparation can increase contact resistance and cause heating under load.
p03-l04|Crowding can force conductors into sharp bends, pull on terminals or trap insulation when the accessory is fitted. Electrical correctness at the bench does not prove a sound final assembly.
p03-l05|Connecting a switched-line conductor into the neutral group can create a short circuit when the switch closes. Identify conductor function and verify polarity before energising.
p03-l06|Connecting the lamp line to the permanent-line loop bypasses the switch, leaving the lamp supplied continuously. The lamp must use the identified switched-line connection.
p03-l07|Opening neutral stops normal load current but leaves line connected to the holder. An unlit lamp is therefore not proof that the holder is dead.
p03-l08|The common terminal. Each switch connects common to one of its two traveller terminals.
p03-l09|An intermediate switch changes two traveller paths together, connecting them straight through or crossed. It does not select one traveller from a single common terminal.
p03-l10|A broken ring changes current sharing and can leave a conductor carrying more than the intended design allows. Normal socket operation does not establish ring continuity or capacity for an addition.
p03-l11|Fire resistance, acoustic performance, thermal insulation and moisture or air barriers may all be affected. The fitting and installation detail must suit the actual ceiling construction.
p03-l12|Neat wiring does not establish compatible devices, adequate ratings or sound contact pressure. Incorrect selection or tightening can still cause loss of protection or overheating.
p03-l13|The tool indicates that a torque threshold was reached. It does not prove correct strip length, conductor engagement, terminal compatibility or absence of trapped insulation.
p03-l14|Re-proving confirms the indicator still operates after the dead test. Otherwise a failed indicator could make an apparent absence-of-voltage result unreliable.
p04-l01|A sharp internal edge can cut conductor insulation during pulling or later movement. Deburring removes that avoidable damage source.
p04-l02|Expansion can cause buckling, joint movement or strain at terminations. The route and expansion provisions must accommodate the material’s expected temperature movement.
p04-l03|Flattening, kinks, collapse, scorching or discolouration indicate a damaged or poorly formed bend. The internal path must remain usable and within the system’s bend requirements.
p04-l04|Corrosion can weaken the containment and impair joints or protective continuity where the system has a protective role. The finish must suit moisture, chemicals and other external influences.
p04-l05|The thread may be uneven, weak or poorly aligned, preventing full joint engagement and creating sharp internal edges or unreliable mechanical and electrical continuity.
p04-l06|Bender geometry, conduit size and the required bend radius change the take-up. Use the actual tool’s data and confirm the resulting geometry.
p04-l07|Look for burrs, sharp edges, intrusive fixings, insufficient bend space and any loss of segregation or protective continuity needed by the system.
p04-l08|Cutting can expose unprotected metal to corrosion. Remove burrs and restore suitable corrosion protection using the system manufacturer’s method.
p04-l09|Bends, pulling distance, conductor stiffness, future provision or access can make a technically adequate fill difficult to install without damage. Capacity is only one selection check.
p04-l10|Confirm cable current capacity under the actual grouping and thermal conditions, and confirm bends and entries allow installation without damage.
p04-l11|Armour mainly provides mechanical protection and may have a designed protective-conductor role. Core insulation electrically separates the live conductors from each other and surrounding conductive parts.
p04-l12|A typical CW arrangement adds an outer-sheath environmental seal. Its actual suitability still depends on the specified gland, cable dimensions, assembly and required ingress protection.
p04-l13|Mechanical grip and the intended armour connection may be reduced. Uneven engagement can also distort the assembly; prepare and assemble the gland to its instructions.
p04-l14|Cable weight and movement would load the gland and terminations. Properly selected supports carry the route load and limit strain at the enclosure entry.
p04-l15|A good termination cannot make a cable suitable for an application it is not rated or approved for. Check the actual product standard, voltage, environment and intended wiring-system use.
p04-l16|Exposed mineral insulation can absorb moisture. Prompt preparation and sealing help preserve its high insulation resistance.
p04-l17|It may indicate moisture, contamination or damaged insulation. Investigate the cable and termination condition instead of assuming that a neat seal proves the insulation is sound.
p04-l18|A schedule establishes each conductor’s route and function before pulling. It reduces omitted conductors, incorrect colours or sizes and confusing identification at intermediate boxes.
p04-l19|A normally open auxiliary contact closes with the contactor and provides a parallel path around the momentary Start button. The stop and overload control contacts remain able to interrupt the coil circuit.
p04-l20|The coil must suit the actual control voltage and supply type. A mismatch can prevent operation, cause chatter or overheat and damage the coil.
p04-l21|Motor starting and interruption impose different current and switching stresses from a resistive load. The utilisation category and operating duty must match the motor application.
p05-l01|An overload follows the intended live-conductor load path at excessive current. An earth fault creates an unintended connection to an exposed conductive part or earth-related path back to the source.
p05-l02|Fuses also differ in voltage rating, breaking capacity and operating characteristic. The replacement must match the required protection and equipment specification.
p05-l03|The magnetic mechanism normally provides the rapid response to sufficiently high short-circuit current; the thermal mechanism addresses sustained overload.
p05-l04|An RCCB detects residual imbalance but does not provide integral overload or short-circuit protection. Those functions need a coordinated device; an RCBO combines them.
p05-l05|A Type C device has a higher instantaneous operating threshold than Type B. This can accommodate suitable inrush, but fault-loop conditions and disconnection must still be checked.
p05-l06|Fault current may become too small to operate the overcurrent device within the required time. Assess the actual loop together with the device characteristic and applicable conditions.
p05-l07|The circuit line conductor and protective return contribution, commonly represented by R1 + R2 in a simplified resistive model. Ze is the external part.
p05-l08|The installation electrode connects the protective arrangement to earth, forming part of the return route towards the source electrode. Its resistance affects fault current and protective design.
p05-l09|Pipework and other parallel metallic paths can bypass a defective bonding conductor. A low reading may therefore prove an alternative path rather than the intended conductor.
p05-l10|A CPC must withstand the fault energy until protection operates and satisfy applicable sizing and mechanical requirements. It is not normally sized from load current alone.
p05-l11|Conductor resistance increases as temperature rises. A cool measurement can underestimate resistance under the hotter conditions relevant to the protection assessment.
p05-l12|Record the device and characteristic, external and circuit contributions, temperature basis, assumptions, applicable limit and source, and required disconnection condition.
p05-l13|It reduces prospective earth-fault current at the same voltage, potentially delaying or preventing timely operation of an overcurrent device.
p05-l14|Its operating curve, breaking capacity, voltage rating or assembly compatibility may be unsuitable even when its normal current rating matches the load.
p05-l15|An RCD responds to residual imbalance and can operate at a much smaller earth-fault current than an MCB’s rapid overcurrent mechanism. The complete arrangement must still satisfy its required conditions.
p06-l01|Confirm voltage, phase arrangement, earthing system, prospective fault current, external impedance where relevant and the supply’s capacity and protective arrangements.
p06-l02|Motor output power is less than its electrical input because of losses, while power factor relates real input power to apparent demand. Ignoring either can underestimate supply current.
p06-l03|The calculated current is 1,000 times too small because one kilowatt equals 1,000 watts.
p06-l04|Voltage drop, fault-energy withstand and reduced capacity from installation conditions can each require a larger conductor. Device coordination and other applicable checks remain necessary.
p06-l05|The old example may use different cable data, installation conditions, loading or requirements. Recalculate with the actual circuit, current applicable sources and manufacturer data.
p06-l06|Resistance doubles, assuming temperature also remains unchanged.
p06-l07|A larger area reduces conductor resistance at the same material, length and temperature. With the same current, that reduces the resistive voltage drop.
p06-l08|A percentage relates the loss to the supply voltage and supports comparison with the applicable design limit. Keep the voltage value as well, so the calculation remains traceable.
p06-l09|The load-current path includes both outgoing and returning conductors. If the given length is only the one-way route, a simple equal-conductor loop model includes it twice.
p06-l10|Spacing, contact, layers, ventilation and the installation method change heat dissipation. The cable count alone does not describe the thermal arrangement.
p06-l11|Connected load is the combined installed load. Maximum demand estimates the greatest load expected to operate together under the stated use conditions.
p06-l12|Use representative measured data when it covers relevant operating patterns and expected peaks. It still needs adjustment for planned changes and unobserved exceptional conditions.
p06-l13|Line current equals phase current in a balanced star load.
p06-l14|Current increases at the same voltage and real power because more apparent power must be supplied.
p06-l15|The prospective fault current may exceed 6 kA, or another protection or compatibility condition may fail. A 20 A operating load does not establish the device’s ability to interrupt a fault.
p07-l01|The corresponding points of the three equal-frequency waveforms occur one third of a cycle apart. One third of 360° is 120°.
p07-l02|Line voltage divided by the square root of three, for a balanced star load. A 400 V line-to-line supply gives approximately 231 V per element.
p07-l03|Line current is the square root of three times phase current for a balanced delta load. Phase current is the current in one load element.
p07-l04|Unequal loads, different phase angles and harmonic currents can produce neutral current. Similar nameplate ratings alone do not prove electrical balance.
p07-l05|Phase currents occur at different phase angles. Their instantaneous or phasor sum, rather than the sum of their magnitudes, determines neutral current.
p07-l06|Confirm existing and expected phase loading, circuit demand, available capacity, protective arrangements and any phase-sequence or load-specific requirements.
p07-l07|Required isolation, overcurrent protection, fault protection and other essential safety functions must remain effective independently of optional smart control features.
p07-l08|The device must carry intended demand while protecting the feeder under overload and fault conditions. Downstream devices and available fault current affect coordination.
p07-l09|Bundling can restrict heat loss and raise conductor temperature. The applicable grouping conditions may reduce current-carrying capacity.
p07-l10|Utilisation accounts for how much source light reaches the working plane. Maintenance accounts for expected reduction over time from factors such as dirt and ageing.
p07-l11|Required initial source lumens increase for the same maintained illuminance, because a smaller fraction is expected to remain available in service.
p07-l12|Check spacing, uniformity, glare, room geometry, task position, controls, maintenance access and the actual luminaire’s photometric and electrical suitability.
p07-l13|Consistent feeder and board identifiers, the supply path, switching and protective devices, cable details and their links to the relevant schedules.
p07-l14|A riser diagram, linked to the board identifiers and detailed circuit schedules.
p07-l15|In the board’s circuit or panel schedule, using the circuit reference and confirming it against the installed device.
p07-l16|Demand affects operating current and voltage drop; fault level affects protective-device duty and conductor withstand. Passing only one check does not establish a suitable distribution design.
p08-l01|The first proving check establishes that the indicator works before use. The final check establishes that it still worked after the dead test, reducing the risk of accepting a false dead indication.
p08-l02|Null suitable continuity-test leads before measurement, following the instrument procedure and rechecking after lead changes. This removes the leads’ contribution from low-resistance readings.
p08-l03|The test current can return through parallel metalwork instead of the intended bonding conductor. The reading must be interpreted with the connected paths and inspection findings.
p08-l04|Investigate loose or damaged connections, unexpected length or conductor size, broken strands and test-lead or contact errors. Compare with the expected circuit resistance.
p08-l05|They establish each conductor’s end-to-end resistance but do not alone reveal every cross-connection, interconnection or incorrect spur arrangement. Further appropriate cross-connected tests and inspection are needed.
p08-l06|Joining line and neutral can avoid applying the test voltage between them while assessing insulation of the live conductors to earth. Equipment suitability, test voltage and required disconnections still need checking.
p08-l07|It can support identification of voltage relationships and conductor polarity at the tested point. It does not prove protective continuity, insulation resistance or every circuit connection.
p08-l08|Parallel protective paths can reduce the reading so it no longer represents the intended external loop alone. The test method and connected arrangement must match what the result claims to measure.
p08-l09|The device must safely interrupt the fault current relevant to its location and fault duty. Using a lower, inapplicable value can understate the required breaking capacity.
p08-l10|Higher impedance reduces fault current at the same voltage. This can slow an overcurrent device’s response, so assess the result against the actual device and disconnection requirement.
p08-l11|Each line has its own conductor and connections. A satisfactory result on one phase does not establish the condition of the others.
p08-l12|Soil moisture, temperature, seasonal conditions, electrode condition and the placement and influence of test electrodes can change the result.
p08-l13|Existing residual leakage can add to or oppose the injected test current. It can therefore shift the apparent ramp operating point away from the device-only response.
p08-l14|Confirm RCD type, rated residual current, time delay or selectivity, manufacturer instructions, the applicable requirements and the tester’s supported waveforms and settings.
p08-l15|A lamp can operate with incorrect connections, including neutral-only switching. Functional operation does not establish that single-pole control is correctly in line or that protective paths are sound.
p08-l16|Disconnect equipment when the proposed test could apply an unsuitable voltage across its terminals or its connected circuits would distort the measurement. Follow the applicable test method and equipment instructions.
p08-l17|Different fault combinations can have different available currents. The assessment must represent the device’s actual duty rather than assuming one phase-to-neutral result covers every fault.
p09-l01|After safe isolation, end-to-end continuity measurements of the separated line, neutral and protective ring conductors identify which intended ring path is open. Further tests locate and characterise the defect.
p09-l02|Use a controlled separation of connected equipment from safely isolated fixed wiring, then repeat the appropriate tests. A change in the result helps distinguish the equipment from the wiring.
p09-l03|Safely isolate, separate connected equipment as required, divide the circuit into identifiable sections, test each section appropriately and narrow the investigation to the section retaining the low reading.
p09-l04|Load current flowing through extra contact resistance produces concentrated heating. The appliance may still receive enough voltage to operate while the joint deteriorates.
p09-l05|Under controlled testing, compare appropriate line-to-neutral, line-to-earth and neutral-to-earth readings with dead continuity evidence. The pattern must be interpreted with the circuit arrangement; no single voltage reading proves the fault location.
p09-l06|The neutral may carry current or be energised through another circuit that remains connected. Identify all associated circuits and supplies before isolation and work.
p09-l07|Establish the damage cause and extent, cable type and exposure, insulation and conductor condition, test results and manufacturer guidance. A satisfactory isolated measurement alone cannot rule out hidden degradation.
p09-l08|Use a suitable, correctly rated low-impedance test method within a safe procedure. A coupled indication often collapses under that load; interpret this with source tracing and the complete test evidence.
p09-l09|The clamp must compare outgoing and returning current. Including both lets their balanced magnetic effects cancel, leaving residual imbalance rather than ordinary load current.
p09-l10|Identify and safely isolate every relevant supply, including separately controlled or off-peak circuits; prove dead and address stored heat or other equipment hazards before access.
p09-l11|Approximately zero residual current if outgoing and returning currents balance, subject to actual leakage and the clamp’s resolution and accuracy.
p10-l01|Settle load demand, supply capacity, route and external influences, earthing, protection, voltage drop, isolation and termination arrangements before choosing the cable.
p10-l02|Identify circuits and supplies; assess earthing and bonding, circuit condition, existing defects and test evidence, supply characteristics and compatibility with the proposed protection.
p10-l03|Grouping, ambient temperature, thermal insulation and the relevant installation method can reduce capacity. Apply only the factors required by the actual cable data and conditions.
p10-l04|Use identified circuit paths and appropriate dead continuity and polarity checks after safe isolation. Colour or position alone is insufficient evidence of function.
p10-l05|Disconnection depends on the particular device’s characteristic and required conditions. A Zs value cannot be accepted against a limit chosen only from the circuit’s load description.
p10-l06|Similar dimensions do not establish tested assembly compatibility, busbar engagement, ratings or thermal performance. Use the assembly manufacturer’s specified compatible equipment.
p10-l07|Obtain the agreed supply capacity, voltage and phase arrangement, earthing information, prospective fault data, metering and service arrangements, and distributor-specific connection requirements.
p10-l08|Widespread deterioration, inadequate protective arrangements, unsuitable wiring for planned demand, inaccessible recurring defects or numerous unsafe alterations may make comprehensive replacement more appropriate.
p10-l09|Not every load operates at full rating simultaneously. Maximum demand needs a justified assessment of likely use, while still accounting for credible peaks and future requirements.
p10-l10|Current rises at unchanged line voltage and real power. Lower power factor means the supply must carry greater apparent power for the same useful demand.
p11-l01|Confirm safe isolation of relevant electrical supplies, concealed services, structural and permitted-chase constraints, and control of dust and tool hazards before intrusive work.
p11-v2-l02|Two-way switching controls one load from two positions. An isolator provides the specified separation for isolation. A fused connection unit supplies equipment through a local fuse; appearance does not establish these functions.
p11-v2-l03|Incorrect polarity, a missing or resistive CPC, broken ring continuity, damaged insulation and poor terminal engagement can remain despite normal appliance operation.
p11-v2-l04|The local fuse can limit overcurrent in the downstream appliance flex according to its design. The fixed circuit still needs its own coordinated protection for its wiring and fault conditions.
p11-v2-l05|Confirm required connector and charging protocols, supported output power, product safety and compatibility, available box depth, installation conditions and continued suitability of the socket circuit.
p11-v2-l06|Confirm finished worktop and unit positions, sink and hob locations, appliance dimensions and service connections, splash or heat exposure, and access to required controls and isolation.
p11-v2-l07|Justified diversity can reflect non-simultaneous use of cooking elements. Cable capacity under actual conditions, protection, voltage drop and all other required design checks still apply to the adopted demand.
p11-v2-l08|Use the shower manufacturer’s instructions, circuit and maintenance requirements, zone constraints, accessibility and the actual means of isolation. A video example alone cannot justify the decision.
p11-v2-l09|A compliant shaver supply uses a specific isolating arrangement for a limited load. Its output capacity and intended appliance scope do not make it a general-purpose socket.
p11-v2-l10|Incorrect glands, open entries, incompatible seals, poor mounting, damaged covers or an unsuitable operating position can undermine ingress protection of the installed assembly.
p11-v2-l11|Voltage and frequency rating, current rating, pole arrangement, protective-contact position or coding, connector standard and environmental duty must match the intended supply and equipment.
p12-v2-l01|Match required light output, distribution, colour quality, cap and dimensions, voltage and control compatibility. Equal wattage does not guarantee equal light or suitable operation.
p12-v2-l02|Identify the task or surface each fitting serves, who uses that area and the needed visibility or atmosphere. Remove fittings with no justified lighting purpose.
p12-v2-l03|Obtain room dimensions and use, target lighting performance, surfaces, ceiling construction, mounting options, existing supply, controls, environment and maintenance access.
p12-v2-l04|Close grazing light emphasises texture and shadows; a broader or more distant wash gives a more even appearance. Choose beam and position from the intended effect and actual wall geometry.
p12-v2-l05|Provide circuit and fitting references, positions, control relationships, driver locations, product details and safe access information. Labels on site must match the drawings.
p12-v2-l06|Room geometry and surfaces affect light distribution; tasks determine visibility needs; equipment defines output and control behaviour. A fitting that works in one room can give glare or inadequate light in another.
p12-v2-l07|Know the lighting task, dimensions and required distribution, plus ceiling construction, fire or acoustic requirements, insulation, void depth, ventilation and product clearances.
p12-v2-l08|Use product test or approval evidence that covers the actual ceiling type and installation arrangement, including required components and clearances. A general fire-rated label is not enough.
p12-v2-l09|Calculate strip current and voltage drop, respect the permitted run length and use a suitable supply arrangement such as shorter separately fed sections where the product permits it.
p12-v2-l10|Provide the specified heat-dissipating mounting surface or profile, correct loading and ventilation, accessible drivers and connections, and replaceable sections with identified compatible parts.
p12-v2-l11|Match constant-current or constant-voltage output as required, voltage and current or power range, control protocol, environmental rating, thermal conditions and the LED manufacturer’s compatibility requirements.
p12-v2-l12|Use compatibility information for the exact lamp or driver and dimmer, including load range and control type. A representative trial can expose flicker, poor range or startup problems before a large installation.
p12-v2-l13|Under a suitable safe test procedure, substitute a known compatible control or driver while changing one variable at a time. Compare behaviour and verify the supply before blaming the removed component.
p12-v2-l14|One fitting may face driven rain, dust, impact or public access that another does not. IP concerns ingress and IK concerns impact; the actual exposures determine the selection.
p12-v2-l15|Link each fitting to a specific path, entrance, hazard, security view or intended setting. Check beam direction and glare so it serves that purpose without obscuring adjacent areas.
p12-v2-l16|The design reasoning can transfer, but mounting, environmental protection, ceiling or wall construction, light distribution and electrical arrangements must be checked against the new site.
p12-v2-l17|Measure mounting height, task and aisle geometry, existing illuminance where useful, obstructions, surfaces and environmental conditions; establish operating hours, maintenance access and glare constraints.
p12-v2-l18|Provide an identified manual override and a defined return to automatic operation, with clear state indication. Document priority between local controls and automatic commands.
p12-v2-l19|Addressable grouping, scenes, flexible reconfiguration or monitoring may justify DALI. The benefit must outweigh additional design, commissioning and maintenance requirements for the project.
p12-v2-l20|Document supply circuit references separately from bus routes, device addresses, groups and control functions. Link both to the same physical equipment identifiers.
p12-v2-l21|Required electrical protection must remain effective, and an agreed local control or fallback state must remain usable. Confirm the actual product behaviour when each dependency fails.
p12-v2-l22|Record the functions supported locally, the documented fallback states and access to configuration backups. Features dependent on an unavailable service or proprietary access cannot be assumed to continue.
p12-v2-l23|Establish the approved escape routes, exits, risk locations, required emergency-lighting functions and performance criteria from the fire strategy before fixing positions.
p12-v2-l24|Coordinate with the responsible person, account for battery discharge and recharge, and provide a suitable timing or temporary safety arrangement so required emergency coverage is maintained.
p12-l04|For every fitting and control, identify its required task, suitable product evidence, circuit and control relationship, installation constraints and maintenance access. Revise any choice without a defensible purpose.
p13-v2-l01|A sensor sends commands; an actuator controls a load; the bus supply powers the bus; the interface allows programming and diagnostics. Identify essential lighting and other agreed functions that need usable local fallback.
p13-v2-l02|Record exact product and application versions, physical locations, addresses and intended functions. Preserve a dated recoverable project export with the information needed to recommission it.
p13-v2-l03|Confirm sensor communication, parameters, group-address links and datapoint compatibility, then use bus diagnostics to trace the command. Successful direct actuator operation narrows the fault but does not prove the sensor path.
p13-v2-l04|Continuity alone does not prove correct pair geometry or high-frequency performance. Inspect wiremap and the relevant crosstalk or termination-related certification results against the correct link standard.
p13-v2-l05|Verify the selected standard and link type, adapters or launch leads, reference procedure, instrument condition and connection cleanliness before accepting the result as a cable defect.
p13-v2-l06|An MPTL ends in a field-terminated plug connected directly to equipment. Certification needs the specified MPTL test configuration and suitable adapters, rather than treating both ends as permanent-link outlets.
p13-v2-l07|Collect camera count, stream resolution and codec, frame rate or bitrate, recording schedule and retention duration. Include realistic traffic and storage overhead and the required recorder features.
p13-v2-l08|The decision depends on the approved escape strategy, fire interfaces, door function and security requirement. Power-loss behaviour must not defeat required escape; a universal fail-safe or fail-secure answer is inappropriate.
p13-v2-l09|Assess crushing, shearing, drawing-in and impact zones throughout travel. Select the required safeguards from the risk assessment and verify their detection and stop or reversal performance using the specified commissioning method.
p13-v2-l10|Photocells monitor only their detection paths. Hinge gaps, closing edges, trapping zones and reach-through hazards may need additional guarding, safety edges or other assessed protective measures.
p13-v2-l11|Select detector technology from the specified system design and actual nuisance sources. Heat detection may suit cooking-related nuisance conditions, while smoke-detection type and placement must suit the escape strategy and environment.
p13-l10|The category defines the intended protection coverage; zones identify areas for locating alarms; circuits describe electrical connections. Record them in the design specification, zone plan and circuit or as-built documentation respectively.
p13-v2-l13|Refer the departure to the responsible designer and relevant approving parties. Assess its effect on the agreed fire strategy and document the decision and variation in the appropriate design and handover records.
p14-l01|A supply or export restriction, major shading, unsuitable roof condition, lack of a safe equipment location or a need for backup operation can change the architecture. Roof area alone does not determine system suitability.
p14-v2-l02|Use the configured operating priorities, metering direction and actual power-flow readings. Available sources do not by themselves show whether the system is charging, exporting or supplying particular loads.
p14-v2-l03|Inadequate earthing or bonding, damaged wiring, unsuitable protection, limited board capacity or unresolved supply issues can undermine the installation. Assess the existing system before adding generation.
p14-v2-l04|Access, ventilation or temperature, fire and escape considerations, structural support and manufacturer siting requirements can outweigh shorter cable length.
p14-v2-l05|Temperature, ventilation, direct sun, moisture, dust, mounting clearances and access affect performance and reliability. Electrical ratings assume the product’s permitted installation conditions.
p14-v2-l06|Reverse polarity or excessive string voltage can damage equipment or create a hazard. Confirm expected voltage over the design temperature range and the actual connector and polarity arrangement before connection.
p14-v2-l07|Battery communications and protocol, charging limits, compatible firmware, protection settings and manufacturer-specific wiring are product-dependent. Use the approved combination and commissioning instructions.
p14-l02|The unit changes to its supported backup power path, drawing from stored energy through an inverter as applicable. Transfer, neutral and earthing behaviour depend on the actual architecture.
p14-v2-l09|Illuminated PV strings can still generate DC; batteries and backup inverter outputs may remain energised; capacitors may retain energy. Identify and isolate all relevant sources using the equipment procedure.
p14-v2-l10|Neutral switching depends on source configuration, earthing, bonding and the transfer arrangement. Establish these for every operating mode and follow the approved design; it is not a decision based only on phase count.
p14-v2-l11|The power rating describes allowable load, not runtime. Battery energy and condition, actual load, conversion losses and discharge limits determine how long the supply lasts.
p14-l07|Whole-property backup introduces larger and less predictable demand, phase imbalance, starting surges and more complex transfer, neutral, earthing and fault-protection conditions in island mode.
p14-v2-l13|Assess agreed supply capacity, existing peak demand, phase allocation, charger demand, other large loads and expected simultaneous use. Load management is needed when the planned demand must be constrained to the available capacity.
p14-v2-l14|The device addresses specified open-PEN conditions within a defined application. Confirm the actual earthing system, product scope and installation conditions; it does not resolve every possible earthing hazard.
p14-l08|Confirm the sensor’s conductor, phase and orientation, compare its reading with known load changes, and verify that increasing other demand reduces available charging current as designed, including sensor-failure behaviour.
p14-v2-l16|Check supply availability, protective-device state and the charger’s electrical indications first, then use diagnostics and controlled known-compatible substitutions to distinguish network, configuration and vehicle issues.
p15-v2-l01|The contactor’s normally open holding contact maintains the coil path. The normally closed Stop contact and overload auxiliary contact can interrupt that path.
p15-v2-l02|Check the automatic-mode selector, control supply, level or pressure input, permissive interlocks and relevant wiring. Manual operation suggests the motor and some power components work but does not prove the automatic command path.
p15-v2-l03|Duct resistance, bends, blocked outlets or inadequate replacement air can reduce installed airflow. Inspect the complete air path and measure actual performance against the design, not just the fan’s free-air rating.
p15-v2-l04|Establish the supply arrangement, lightning and surge exposure, required protection, equipment sensitivity and existing SPDs. Coordinate device type, ratings and connections using the applicable design and manufacturer requirements.
p16-l01|Prioritise suitable isolation and proving equipment, correctly rated tools and the PPE required by the work assessment. Specialist tools should follow the actual task and competence needs, rather than being bought for appearance.
p16-l02|Use manufacturer compatibility for conductor size and class, ferrule, die and terminal. Reject damaged strands, incomplete insertion, split or distorted ferrules and an incorrect or insecure crimp.
p16-l03|Confirm conductor material and class, lug size and barrel design, specified die and tool, preparation and crimp sequence, and equipment terminal requirements. Physical fit alone does not establish a sound connection.
p16-l04|Depth, shielding, construction, cable condition or detector mode can hide a service. Check drawings and visible routes, assess the building and use appropriate additional detection or access methods before drilling.
p16-l05|Induction can couple to neighbouring utilities. Where permitted and safe, direct connection improves signal attribution; trace route and signal-current behaviour to distinguish the intended service from coupled paths.
p16-l06|Emissivity, reflections, viewing angle and load affect apparent temperature. Compare suitable reference points and operating conditions, then assess the component’s function and corroborating evidence before deciding severity.
p16-l07|Travel, estimating, administration, insurance, training, tools and non-billable time continue outside installation hours. Recover justified overheads in the business’s labour rate or explicitly priced project items without double counting.
p16-l08|Occupancy, access, building construction, existing wiring condition and making-good requirements can change labour greatly. State their assumptions, included work and a clear variation process in the quotation.
p16-l09|Use consistent circuit identifiers and traceable design, inspection and test records, with instrument details and responsible-person declarations. Do not fill gaps with inferred or copied measurements.
p01-transformers|23 V at the secondary, using the ideal turns ratio.
p01-pf-visual|Power factor is 0.8. The 8 kW is real power, representing net energy transfer per second; 10 kVA is apparent power.
p07-induction|The synchronous field speed is 1,500 rpm. A motoring induction rotor needs slip relative to that field to induce rotor current and develop torque, so its rated speed is lower.
p07-star-delta|Star reduces winding voltage, lowering starting current and torque. Simultaneous star and delta closure creates incompatible connections and can cause a short circuit, so the transition must be correctly interlocked.
p07-vfd|The rectifier, DC link and inverter form the main power stages. A stopped motor does not isolate the drive input or discharge its DC-link capacitors.
p05-spd|A cartridge check does not establish correct SPD type, ratings, coordination, lead routing or protective arrangement. The installed system must suit the supply and equipment it protects.
p08-periodic|An existing-installation report records assessed condition within a stated scope and limitations. A new-work certificate records the relevant design, construction, inspection and testing responsibilities for that work.
`;

export const overviewAnswers: Record<string, string> = Object.fromEntries(rows.trim().split('\n').map(row => {
  const split = row.indexOf('|');
  return [row.slice(0, split), row.slice(split + 1)];
}));

export const overviewWorking: Record<string, string> = {
  'p01-l04': 'Q=It=(2\\,\\mathrm{A})(5\\,\\mathrm{s})=10\\,\\mathrm{C}',
  'p01-l06': 'I_1=\\frac{V}{R},\\qquad I_2=\\frac{V}{2R}=\\frac{I_1}{2}',
  'p01-l07': 'R=\\frac{V}{I}=\\frac{12\\,\\mathrm{V}}{3\\,\\mathrm{A}}=4\\,\\Omega',
  'p01-l08': 'R_T=R_1+R_2+R_3=2+3+5=10\\,\\Omega',
  'p01-l10': 'R_T=\\frac{R}{n}=\\frac{12\\,\\Omega}{3}=4\\,\\Omega',
  'p01-l12': 'P=VI=(12\\,\\mathrm{V})(2\\,\\mathrm{A})=24\\,\\mathrm{W}',
  'p01-l13': 'P_1=I^2R,\\qquad P_2=(2I)^2R=4I^2R=4P_1',
  'p01-l14': 'P=\\frac{V^2}{R}=\\frac{(24\\,\\mathrm{V})^2}{12\\,\\Omega}=48\\,\\mathrm{W}',
  'p01-l15': 'E=Pt=(2\\,\\mathrm{kW})(3\\,\\mathrm{h})=6\\,\\mathrm{kWh}',
  'p01-l21': 'T=\\frac{1}{f}=\\frac{1}{50\\,\\mathrm{Hz}}=0.020\\,\\mathrm{s}=20\\,\\mathrm{ms}',
  'p01-transformers': 'V_s=V_p\\frac{N_s}{N_p}=(230\\,\\mathrm{V})\\frac{100}{1000}=23\\,\\mathrm{V}',
  'p01-pf-visual': '\\mathrm{PF}=\\frac{P}{S}=\\frac{8\\,\\mathrm{kW}}{10\\,\\mathrm{kVA}}=0.8',
  'p07-induction': 'n_s=\\frac{120f}{p}=\\frac{120\\times50}{4}=1500\\,\\mathrm{rpm}',
  'p07-l02': 'V_{ph}=\\frac{V_L}{\\sqrt{3}}=\\frac{400\\,\\mathrm{V}}{\\sqrt{3}}\\approx231\\,\\mathrm{V}',
};

export const overviewPrompts: Record<string, string> = {
  'p06-l05': 'Why must cable size be recalculated before reusing a design from an older example?',
  'p12-v2-l01': 'Which lamp characteristics must be checked when selecting a replacement?',
  'p12-v2-l02': 'What makes an individual fitting necessary in a lighting design?',
  'p12-v2-l05': 'What information lets another electrician maintain a lighting installation from its drawings?',
  'p12-v2-l11': 'Which specifications must match when choosing a driver for an LED load?',
  'p12-v2-l15': 'How should each exterior fitting be linked to a practical lighting purpose?',
  'p12-v2-l20': 'What must a drawing show so a technician can trace both power and digital lighting control?',
  'p12-v2-l21': 'What must be checked about a smart dimmer’s behaviour when its network fails?',
  'p12-l04': 'What evidence justifies each fitting and control in a completed lighting scheme?',
  'p13-v2-l01': 'What do a KNX sensor, actuator, bus supply and programming interface each do?',
  'p13-v2-l08': 'What determines whether an access-controlled door should fail safe or fail secure?',
};

export const overviewPurpose: Record<string, string> = {
  'p01-l01': 'Understanding which particles carry charge explains why a solid conductor can carry current without its material flowing.',
  'p01-l02': 'This model explains how copper carries current and why an appliance responds quickly even though electron drift is slow.',
  'p01-l03': 'Charge units and prefixes let you interpret current, stored charge and small electrical quantities without confusing their scale.',
  'p01-l04': 'A current rating is a charge-transfer rate. Understanding that rate lets you calculate transferred charge and distinguish current from energy use.',
  'p01-l05': 'Recognising the source, path and load helps you explain why a circuit operates, and what an open connection changes.',
  'p01-l06': 'Voltage and resistance let you predict current before measuring it. A reading that disagrees with that prediction needs an explanation.',
  'p01-l07': 'Rearranging Ohm’s law lets you predict a missing voltage, current or resistance while checking whether the result is physically reasonable.',
  'p01-l08': 'The series model explains how one poor connection can add resistance and reduce the voltage available to a load.',
  'p01-l09': 'Parallel-circuit reasoning explains why appliances share supply voltage while their currents add at the source.',
  'p01-l10': 'Equivalent resistance lets you replace several parallel branches with one value and check the supply current.',
  'p01-l11': 'Following branch currents gives you an independent way to check a parallel-circuit calculation or measurement.',
  'p01-l12': 'Voltage and current together tell you the rate of energy transfer. Neither quantity alone is a power rating.',
  'p01-l13': 'The square-law relationship explains why increased current can sharply increase heating in a conductor or poor connection.',
  'p01-l14': 'Voltage and resistance let you calculate resistive power without a separate current measurement, provided the resistance assumption is valid.',
  'p01-l15': 'An appliance’s power rating does not tell you its total energy use. Operating time connects the rating to consumption.',
};

export const overviewModels: Record<string, string> = {
  'p01-l01': 'Electrical charge has a sign. Protons carry positive charge, electrons carry negative charge, and neutrons have no net charge. In a metal, mobile electrons carry current while the solid structure stays in place.',
  'p01-l03': 'Charge is an amount, measured in coulombs (C). The charge of an electron is extremely small, so ordinary charge measurements represent enormous numbers of particles. Prefixes change the numerical scale without changing the quantity.',
  'p01-l04': 'Current is charge transferred per second, not charge stored at a point. A steady 1 A transfers 1 C each second; the longer it flows, the more charge passes.',
  'p01-l06': 'At fixed resistance, more voltage produces more current. At fixed voltage, more resistance produces less current. Always identify what is held constant before predicting a change.',
  'p01-l07': 'Ohm’s law connects voltage, current and resistance under the stated operating conditions. Choose the form that isolates the unknown quantity and check its unit; changing temperature may change the resistance.',
  'p01-l13': 'Current through resistance transfers energy into heat. At fixed resistance, heating power grows with the square of current: twice the current gives four times the heating.',
  'p01-l14': 'At fixed resistance, resistive power grows with voltage squared. Use voltage and resistance directly when they are the known quantities, while keeping the constant-resistance assumption explicit.',
  'p01-l15': 'Power is the rate of energy transfer. Energy accumulates while the load operates: a steady 2 kW transfers 2 kWh in each hour. A power rating needs an operating time before it becomes an energy amount.',
  'p01-l21': 'Frequency counts complete cycles each second; period is the time for one cycle. They are reciprocals. Amplitude describes the size of the waveform and does not determine its timing.',
};

// Explicit placement prevents an early charge lesson from acquiring a formula
// about current merely because both contain the word charge.
export const overviewFormulas: Record<string, string> = {
  'course-8Z255dd78H4': 'I_b\\leq I_n\\leq I_z,\\qquad \\Delta U=\\frac{m I_b L}{1000}',
  'course-NIrKOVZrqnU': '\\begin{aligned}S^2&=P^2+Q^2,\\quad \\mathrm{PF}=P/S\\\\Q_c&=P(\\tan\\phi_1-\\tan\\phi_2)\\\\C&=\\frac{Q_c}{2\\pi fV^2}\\quad\\text{(single phase)}\\end{aligned}',
  'course-XbL0R_9KLD4': 'P_{\\mathrm{in}}=\\frac{P_{\\mathrm{shaft}}}{\\eta},\\qquad n_s=\\frac{120f}{p}',
  'course-Me_adh09CdY': '\\mathrm{B}:3I_n\\text{–}5I_n,\\quad \\mathrm{C}:5I_n\\text{–}10I_n,\\quad \\mathrm{D}:10I_n\\text{–}20I_n',
  'p01-l04': 'I=\\frac{Q}{t},\\quad Q=It,\\quad [I]=\\mathrm{A},\\ [Q]=\\mathrm{C},\\ [t]=\\mathrm{s}',
  'p01-l06': 'I=\\frac{V}{R}',
  'p01-l07': 'V=IR,\\quad I=\\frac{V}{R},\\quad R=\\frac{V}{I}',
  'p01-l08': 'R_T=R_1+R_2+\\cdots,\\quad V_s=V_1+V_2+\\cdots',
  'p01-l09': 'I_T=I_1+I_2+\\cdots',
  'p01-l10': '\\frac{1}{R_T}=\\frac{1}{R_1}+\\frac{1}{R_2}+\\cdots',
  'p01-l11': 'I_k=\\frac{V}{R_k},\\qquad I_T=\\sum_k I_k',
  'p01-l12': 'P=VI',
  'p01-l13': 'P=I^2R',
  'p01-l14': 'P=\\frac{V^2}{R}',
  'p01-l15': 'E=Pt,\\qquad \\mathrm{kW}\\times\\mathrm{h}=\\mathrm{kWh}',
  'p01-l21': 'T=\\frac{1}{f}',
  'p01-l23': 'X_L=2\\pi fL',
  'p01-l24': '\\lvert Z\\rvert=\\sqrt{R^2+X_L^2}\\quad\\text{(series R–L circuit)}',
  'p01-l25': 'C=\\frac{Q}{V}',
  'p01-l26': '\\mathrm{PF}=\\frac{P}{S}',
  'p01-transformers': '\\frac{V_s}{V_p}=\\frac{N_s}{N_p}\\quad\\text{(ideal transformer)}',
  'p01-pf-visual': '\\mathrm{PF}=\\frac{P}{S}',
};
