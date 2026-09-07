// One specific misconception per core question replaces the generic fallback.
const rows = `
p01-l03|Charge can take any fraction of an electron’s charge.|One coulomb is the charge of one electron.|SI prefixes change the physical quantity being measured.
p01-l04|One ampere is one joule transferred each second.|Current depends on charge alone, regardless of elapsed time.|Multiplying current by time gives resistance.
p01-l05|The source supplies resistance instead of potential difference.|An open path allows continuous current through the load.|A normal operating switch necessarily provides fault protection.
p01-l06|Voltage is the rate at which charge flows.|Resistance increases current at a fixed voltage.|Increasing resistance at fixed voltage increases current.
p01-l07|Ohm’s law relates power, energy and time.|Rearranging Ohm’s law gives current without needing resistance or voltage.|A component’s resistance is fixed regardless of temperature.
p01-l08|Current is used up as it passes through each series component.|Series resistance equals only the largest resistance.|Each series component has the full supply voltage across it.
p01-l09|Supply voltage is divided equally between parallel branches.|Source current equals only the largest branch current.|Parallel resistance is greater than every individual branch resistance.
p01-l10|Parallel conductances are combined by subtracting them.|The reciprocal formula works only for equal resistances.|Identical parallel resistances are multiplied by the branch count.
p01-l11|Every parallel branch carries the same current regardless of resistance.|Current disappears at a junction.|Source current is found by averaging the branch currents.
p01-l12|One watt is one coulomb per second.|DC power is voltage divided by current.|Higher power means the same energy is converted more slowly.
p01-l13|The supply frequency is required in the resistive DC power formula.|Heating is independent of current for fixed resistance.|Doubling current only doubles resistive power loss.
p01-l14|Current must be measured separately before using voltage and resistance.|Power rises directly with voltage, rather than with its square.|The choice of power formula is independent of the known quantities.
p01-l15|Watts measure accumulated energy.|Energy is power divided by operating time.|One kilowatt-hour equals 1,000 joules.
p01-l16|Resistance converts heat into stored electric charge without a supply.|A steady current has no magnetic effect.|Current can only produce heat and cannot drive chemical change.
p01-l17|Insulation colour determines magnetic field direction.|More turns always weaken a coil’s field at the same current.|A ferromagnetic core blocks all magnetic flux.
p01-l18|Constant flux always produces a sustained induced voltage.|A faster flux change reduces the induced voltage.|Adding linked turns eliminates the induced voltage.
p01-l19|Rotation keeps the flux linkage constant throughout a cycle.|The induced polarity stays unchanged throughout a full AC cycle.|Frequency is independent of rotation speed at fixed pole count.
p01-l20|A sine wave changes instantaneously between two fixed levels.|A sine wave has the same value at every angular position.|An ideal sine wave has a positive half-cycle only.
p01-l21|Amplitude counts cycles per second.|Frequency measures the maximum voltage.|Period increases when frequency increases.
p01-l22|Resistance opposes AC but not DC.|Ideal reactive components permanently consume all exchanged field energy.|Impedance excludes resistance.
p01-l23|Inductance opposes only steady, unchanging current.|Back emf comes from the insulation colour.|Inductive reactance falls as frequency increases.
p01-l24|The horizontal side represents inductive reactance.|The reactive side represents real power in watts.|Resistance and reactance always add as ordinary scalar quantities.
p01-l25|Capacitance is charge multiplied by voltage.|Parallel capacitors divide the voltage equally regardless of capacitance.|Series capacitors add their capacitances directly.
p01-l26|Power factor is apparent power divided by real power.|Phase displacement cannot affect power factor.|Lower power factor reduces supply current at unchanged real power.
p01-l27|Real power represents only energy moving back and forth in fields.|Reactive power is the same as useful mechanical output.|Real and reactive power are added arithmetically to give apparent power.
p06-l14|Real power is measured in amperes.|Reactive power is measured in ohms.|Apparent power excludes reactive power.
p01-l28|A voltmeter measures the charge stored in one point.|High input impedance increases the meter’s loading of the circuit.|Any input socket and range are safe for every voltage measurement.
p01-l29|An ammeter must provide a separate path across the voltage source.|Every multimeter socket is interchangeable for current measurements.|The lowest current range is always safest for an unknown current.
p01-l30|Resistance should be measured while the circuit remains energised.|Parallel paths always increase the resistance reading.|Lead resistance has no effect on small resistance readings.
p01-l31|A clamp meter measures current by detecting cable colour.|Clamping a whole multicore cable always measures the load current.|An open clamp jaw has no effect on accuracy.
p04-l01|Conduit can be set out accurately without reference measurements.|One cutting tool is suitable for every conduit operation.|Eye protection removes the need to secure the workpiece.
p04-l02|Conduit diameter depends only on the number of circuits.|Conduit fittings replace the cable insulation.|Expansion couplers are intended to increase cable current capacity.
p04-l03|Local scorching strengthens the bend.|A tighter bend always makes cable pulling easier.|Cooling has no effect on the formed conduit shape.
p04-l04|Steel conduit eliminates the need for insulated conductors.|The same finish suits every corrosive environment.|Any box and fitting combination guarantees electrical continuity.
p04-l05|An angled cut makes threaded fittings seat straighter.|Burrs should be left to grip the cable insulation.|Thread quality is independent of die size and workholding.
p04-l06|Set allowance is the cable’s electrical resistance.|A bend can be measured from any point without affecting its position.|Abrupt forming prevents flattening better than gradual forming.
p04-l07|Cut lines can be placed after the bend is formed without measurement.|Reducing internal space improves trunking capacity.|Sharp finished edges help retain cable insulation.
p04-l08|Cables need no support through a tray bend.|Unequal bend markings always produce a symmetrical route.|Bare cut edges need no consideration after cutting.
p04-l09|A conduit is acceptable whenever the cables can be forced inside.|Bends and run length cannot affect cable pulling.|Capacity factors are chosen by conductor colour.
p04-l10|Cable factors are compared with the circuit’s voltage rating.|An acceptable fill calculation proves thermal suitability.|Spare capacity only changes appearance.
p04-l11|The outer sheath carries the normal load current.|Steel armour removes the need to assess protective continuity.|Core colour proves conductor function without checking the circuit.
p04-l12|A BW gland provides an outer-sheath seal for any wet location.|A CW gland seals only the conductor insulation inside the cable.|A decorative shroud alone establishes the protective connection.
p04-l13|Only one armour wire needs to seat correctly.|A loose gland gives better strain relief.|Enclosure entry details cannot affect ingress protection.
p04-l14|Cleats transfer cable forces into the terminals.|Any bend radius is acceptable if the cable can be forced into place.|The terminations should carry the full catenary load.
p04-l15|The SY braid can be left loose at the gland without assessment.|The gland should grip individual insulated cores instead of the cable.|Cable appearance alone establishes suitability.
p04-l16|MICC uses an air gap as its only insulation.|Heat resistance means MICC requires no bending care.|Exposed mineral insulation is unaffected by moisture.
p04-l17|The pot seal is intended to admit moisture.|The gland should leave the metal sheath mechanically loose.|An insulation test is unnecessary after preparing an MICC end.
p04-l18|Inaccessible joints make future inspection easier.|PVC singles provide their own complete mechanical enclosure.|Conductor identification is needed only at the first box.
p05-l01|An overload must always flow directly to earth.|A short circuit follows the intended load resistance.|Earth-fault current cannot return to the source.
p05-l02|A fuse operates by measuring cable colour.|A fuse clears every current in exactly the same time.|Breaking capacity is only the fuse’s normal load rating.
p05-l03|A thermal trip responds only to voltage frequency.|A magnetic trip is intended only for very slow overloads.|The largest ampere rating is always the most suitable breaker.
p05-l04|An RCD compares the temperature of line and neutral.|Residual current is always the normal load current.|Every standalone RCD includes overload protection.
p05-l05|A breaker must be reset repeatedly until it stays on.|Type B and Type C curves have identical magnetic thresholds.|Repeated resetting automatically removes the underlying fault.
p05-l06|Automatic disconnection works without a protective device.|Higher fault-path impedance always produces more fault current.|Bonding removes the need for a fault-current return path.
p05-l07|Ze represents only the final circuit’s line conductor.|R1 and R2 represent the source voltage and load current.|Zs excludes the external supply loop.
p05-l08|TN-S combines neutral and protective functions throughout the supply.|TN-C-S has separate neutral and protective functions everywhere upstream.|TT depends solely on a distributor-provided protective conductor.
p05-l09|A sound appearance alone proves bonding continuity.|Continuity testing establishes only the conductor colour.|Parallel paths cannot affect a continuity result.
p05-l10|A protective conductor is intended to carry normal load current.|Protective-conductor size depends only on its colour.|Mechanical strength never affects the minimum conductor size.
p05-l11|Copper resistance falls as its temperature rises.|Temperature correction changes the cable’s physical length.|Adding Ze gives only the resistance of the final circuit.
p05-l12|Units and temperature assumptions can be mixed in one calculation.|Supply impedance and conductor temperature are permanently fixed.|A disagreement between measured and calculated values should be ignored.
p05-l13|Design Zs includes the load resistance but not the protective conductor.|A protective device disconnects in the same time at every fault current.|Only the most favourable temperature should be used for design.
p05-l14|Cable capacity can be lower than the load current without consequence.|The ampere rating alone establishes breaking capacity.|Trip behaviour matters only after an installation fails.
p05-l15|High loop impedance always speeds up overcurrent disconnection.|An RCD operates only when the load exceeds its normal current rating.|An RCD makes protective conductors unnecessary.
p07-l01|The three phase peaks occur together.|Line and phase voltages are equal in every star supply.|Balanced three-phase loads deliver power only during one half-cycle.
p07-l02|Each star element is connected across two lines.|Star line current is three times phase current.|Star line voltage equals phase voltage divided by three.
p07-l03|Each delta element is connected between a line and neutral.|Delta phase voltage is line voltage divided by three.|Balanced delta line current equals phase current divided by three.
p07-l04|Balanced fundamental phase currents add arithmetically in neutral.|Unequal single-phase loads guarantee zero neutral current.|Triplen harmonics always cancel in the neutral.
p07-l05|Phase angles can be ignored when calculating neutral current.|Unequal phase currents always sum to zero.|Nonlinear loads cannot affect neutral current.
p06-l01|Supply voltage alone defines every supply characteristic.|Nameplate colour establishes the load’s operating current.|Installation conditions cannot affect cable selection.
p06-l02|Design current is the prospective short-circuit current.|The same DC formula applies unchanged to all three-phase loads.|Efficiency and power factor have no effect on input current.
p06-l03|Transposition permits changing only one side of an equation.|Amperes and milliamperes can be substituted without conversion.|Efficiency and power factor are always equal to one.
p06-l04|Corrected cable capacity may be below the device rating without assessment.|Grouping always increases a cable’s allowable current.|Voltage drop has no effect on cable-size selection.
p06-l05|Tabulated capacity already covers every possible installation condition.|Conductor size is selected before considering required capacity.|Any cable table can be used for any installation method.
p06-l06|Longer conductors always have lower resistance.|Larger cross-sectional area always increases resistance.|Conductor temperature cannot affect resistivity.
p06-l07|Cable resistance creates additional energy at the load.|Voltage drop increases the voltage reaching the load.|A longer cable always has less voltage drop.
p06-l08|Voltage-drop tables give only the cable’s weight.|Design current has no effect on voltage drop.|A voltage-drop limit only controls cable appearance.
p06-l09|Resistivity depends only on conductor length.|Only the outward conductor contributes to a single-phase loop.|Three-phase voltage drop is always calculated as a single DC conductor.
p06-l10|Closely grouped cables always cool faster.|Grouping factors increase current capacity in every case.|Spacing and loading pattern have no effect on grouping correction.
p06-l11|Connected load is only the largest installed appliance.|Maximum demand is the sum of all possible fault currents.|Diversity assumes every load runs at full power simultaneously.
p06-l12|One diversity allowance accurately describes every building.|New high-power equipment cannot change peak demand.|Measured load profiles are irrelevant to demand estimation.
p06-l13|Star line voltage always equals phase voltage.|Delta line current always equals phase current.|The balanced-system relationships apply unchanged to every unbalanced load.
p06-l15|Breaking capacity is the normal continuous load current.|Prospective fault current may exceed device capacity without assessment.|The kA marking is another way of writing the ampere trip rating.
p04-l21|The coil must carry the full motor load current.|Any coil can be supplied at any voltage.|Contact duty is independent of the type of load.
p04-l19|The power circuit carries only the push-button current.|The control circuit bypasses every stop device.|The motor must stop as soon as the start button is released.
p04-l20|Terminal numbers are interchangeable between all starter designs.|Overload auxiliary contacts increase coil current during a fault.|Rotation should be checked without controlling access to the motor.
`;

export const recallDistractors = Object.fromEntries(rows.trim().split('\n').map(row => {
  const [id, ...choices] = row.split('|');
  return [id, choices];
}));
