// Vocabulary bridges, not interchangeable labels for different quantities.
// Shared presentation is intentional; assessment questions remain separately authored.
const bridges=[
  {match:/\b(real|true|active) power\b/i,term:'True power (real or active power), P',meaning:'These names refer to net energy transfer per second, measured in watts. This includes useful output and real losses.'},
  {match:/\breactive power\b/i,term:'Reactive power, Q — var',meaning:'The field-energy exchange discussed in the AC lessons. It is distinct from true power in watts and apparent power in volt-amperes.'},
  {match:/\bapparent power\b/i,term:'Apparent power, S — VA',meaning:'The RMS voltage–current product. Keep kVA separate from kW when discussing supply loading.'},
  {match:/\b(rms|root.mean.square)\b/i,term:'RMS (root mean square)',meaning:'The effective value used for AC comparisons with DC heating in a resistance. It is not the peak value.'},
  {match:/\bpotential difference|\bvoltage\b/i,term:'Potential difference (voltage), V',meaning:'The energy transferred per unit charge between two points. Voltage and current describe different things.'},
  {match:/\bimpedance\b/i,term:'Impedance, Z',meaning:'The combined opposition in an AC circuit. Resistance and reactance contribute differently; impedance is not simply another name for resistance.'},
  {match:/\bresistivity\b/i,term:'Resistivity, ρ, versus resistance, R',meaning:'Resistivity is a material property at a stated temperature. A conductor’s resistance also depends on its length and cross-sectional area.'},
  {match:/\b(line conductor|phase conductor|polarity)\b/i,term:'Line conductor (often called phase)',meaning:'The instructor may use phase when referring to a line conductor. Do not treat live as meaning line only: neutral is also a live conductor in the terminology used by the course.'},
  {match:/\b(cpc|circuit protective conductor)\b/i,term:'CPC (circuit protective conductor)',meaning:'The protective conductor associated with a circuit. It is not the neutral conductor or a normal load-current return.'},
  {match:/\b(main earthing terminal|\bmet\b|bonding)\b/i,term:'MET (main earthing terminal) and bonding',meaning:'The MET is the main connection point for the installation’s protective arrangement. Bonding connects specified conductive parts; it is not a substitute name for every earthing connection.'},
  {match:/\bmaximum demand|\bdiversity\b/i,term:'Maximum demand and diversity',meaning:'Maximum demand concerns the credible simultaneous load. Diversity describes the allowance for loads not all operating together; it is not an arbitrary reduction.'},
  {match:/\b(swa|steel.wire.armoured)\b/i,term:'SWA (steel-wire-armoured cable)',meaning:'The armour and the insulated cores have distinct roles. Identify the cable construction before interpreting its termination.'},
  {match:/\b(dol|direct.on.line)\b/i,term:'DOL (direct-on-line)',meaning:'The motor-starting arrangement connects the motor directly to the supply through its switching and protective arrangement. Keep its power and control circuits distinct.'},
  {match:/\b(star|delta)\b/i,term:'Star (Y) and delta (Δ)',meaning:'These names describe different three-phase winding connections. Identify the connection before relating line quantities to phase quantities.'},
  {match:/\b(illuminance|lux|lumen|luminous flux)\b/i,term:'Luminous flux (lumens) and illuminance (lux)',meaning:'Lumens describe light output; lux describes the flux received per unit area. They are related quantities, not synonyms.'},
  {match:/\b(lamp|luminaire)\b/i,term:'Lamp and luminaire (light fitting)',meaning:'The lamp is the light source. The luminaire is the fitting that supports and distributes the light; some LED products integrate the source into it.'},
  {match:/\b(colour temperature|color temperature)\b/i,term:'Colour temperature — kelvin (K)',meaning:'This describes the warm or cool appearance of the light. It does not describe the lamp’s operating temperature or its brightness.'},
];

export function terminologyForLesson(text:string){
  return bridges.filter(item=>item.match.test(text)).slice(0,3);
}
