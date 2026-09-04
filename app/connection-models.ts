/** Illustrative sinusoidal models, not equipment selection or compliance checks. */
export function powerFactorExample(powerKW: number, voltage: number, before: number, after: number) {
  if (![powerKW, voltage, before, after].every(Number.isFinite) || powerKW <= 0 || voltage <= 0 || before <= 0 || before > 1 || after < before || after > 1) throw new RangeError('Invalid power-factor example');
  const reactive = (pf: number) => powerKW * Math.tan(Math.acos(pf));
  return { real: powerKW, beforeReactive: reactive(before), afterReactive: reactive(after), compensation: reactive(before) - reactive(after), beforeCurrent: powerKW * 1000 / (voltage * before), afterCurrent: powerKW * 1000 / (voltage * after) };
}
export function motorSpeedExample(frequency: number, poles: number, slipPercent: number) {
  if (![frequency, poles, slipPercent].every(Number.isFinite) || frequency <= 0 || !Number.isInteger(poles) || poles < 2 || poles % 2 !== 0 || slipPercent < 0 || slipPercent >= 100) throw new RangeError('Invalid induction motor example');
  const synchronous = 120 * frequency / poles;
  return { synchronous, rotor: synchronous * (1 - slipPercent / 100), slip: slipPercent / 100 };
}
