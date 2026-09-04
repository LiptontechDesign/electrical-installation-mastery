export type FormulaMode = 'ohm' | 'power' | 'energy' | 'series' | 'three-phase';
export type OhmTarget = 'current' | 'voltage' | 'resistance';
export type Field = { key: string; label: string; symbol: string; unit: string; max: number; step: number };
export type FormulaSpec = { id: FormulaMode; title: string; tex: string; note: string; fields: Field[]; defaults: Record<string, string> };
const voltage: Field = { key: 'voltage', label: 'Voltage', symbol: 'V', unit: 'V', max: 48, step: 1 };
const current: Field = { key: 'current', label: 'Current', symbol: 'I', unit: 'A', max: 10, step: 0.1 };
const resistance: Field = { key: 'resistance', label: 'Resistance', symbol: 'R', unit: 'Ω', max: 100, step: 1 };

export const formulas: FormulaSpec[] = [
  { id: 'ohm', title: 'Ohm’s law', tex: 'V = IR', note: 'For an ohmic component at constant temperature.', fields: [voltage, current, resistance], defaults: { voltage: '12', current: '0.5', resistance: '24' } },
  { id: 'power', title: 'Power', tex: 'P = VI', note: 'DC power, or AC real power at unity power factor.', fields: [voltage, current], defaults: { voltage: '24', current: '2' } },
  { id: 'energy', title: 'Energy', tex: 'E = Pt', note: 'Constant power × time. 1 kWh = 1,000 Wh.', fields: [{ key: 'power', label: 'Power', symbol: 'P', unit: 'W', max: 3000, step: 10 }, { key: 'time', label: 'Time', symbol: 't', unit: 'h', max: 24, step: 0.5 }], defaults: { power: '100', time: '3' } },
  { id: 'series', title: 'Series resistance', tex: 'R_{T} = R_1 + R_2 + R_3', note: 'Series resistors carry the same current.', fields: [1, 2, 3].map((n) => ({ key: `r${n}`, label: `Resistor ${n}`, symbol: `R_${n}`, unit: 'Ω', max: 100, step: 1 })), defaults: { r1: '10', r2: '20', r3: '30' } },
  { id: 'three-phase', title: 'Three-phase power', tex: 'P = \\sqrt{3}\\,V_L I_L\\,\\mathrm{PF}', note: 'Balanced three-phase load. Use RMS line voltage and line current.', fields: [{ ...voltage, label: 'Line voltage', symbol: 'V_L', max: 690 }, { ...current, label: 'Line current', symbol: 'I_L', max: 100 }, { key: 'pf', label: 'Power factor', symbol: '\\mathrm{PF}', unit: '', max: 1, step: 0.05 }], defaults: { voltage: '400', current: '10', pf: '0.8' } },
];

export const ohmExpressions: Record<OhmTarget, string> = { current: 'I = \\frac{V}{R}', voltage: 'V = IR', resistance: 'R = \\frac{V}{I}' };
export const formatNumber = (n: number) => Number(n.toPrecision(5)).toLocaleString('en', { maximumSignificantDigits: 5 });
const texNumber = (n: number) => {
  const value = Number(n.toPrecision(5)).toString();
  if (!value.includes('e')) return value;
  const [mantissa, exponent] = value.split('e');
  return `${mantissa}\\times10^{${Number(exponent)}}`;
};

export type Calculation = { value: number; unit: string; label: string; tex: string; numbers: Record<string, number> };
export function calculate(spec: FormulaSpec, values: Record<string, string>, target: OhmTarget): { result?: Calculation; error?: string } {
  const fields = spec.fields.filter((field) => spec.id !== 'ohm' || field.key !== target);
  const numbers: Record<string, number> = {};
  for (const field of fields) {
    const raw = values[field.key]?.trim() ?? '';
    if (!raw) return { error: `Enter ${field.label.toLowerCase()}.` };
    const number = Number(raw);
    if (!Number.isFinite(number) || number < 0 || number > 1e9) return { error: `${field.label} must be a number from 0 to 1,000,000,000.` };
    if ((field.key === 'resistance' && target === 'current' && number === 0) || (spec.id === 'ohm' && target === 'resistance' && field.key === 'current' && number === 0)) return { error: `${field.label} must be greater than zero for this calculation.` };
    if (field.key === 'pf' && number > 1) return { error: 'Power factor must be between 0 and 1.' };
    numbers[field.key] = number;
  }
  const { voltage: v, current: i, resistance: r, power: p, time: t, r1, r2, r3, pf } = numbers;
  let value: number, unit: string, label: string, tex: string;
  if (spec.id === 'ohm') {
    if (target === 'current') { value = v / r; unit = 'A'; label = 'Current'; tex = `I = \\frac{${texNumber(v)}}{${texNumber(r)}}`; }
    else if (target === 'voltage') { value = i * r; unit = 'V'; label = 'Voltage'; tex = `V = ${texNumber(i)} \\times ${texNumber(r)}`; }
    else { value = v / i; unit = 'Ω'; label = 'Resistance'; tex = `R = \\frac{${texNumber(v)}}{${texNumber(i)}}`; }
    numbers[target] = value;
  } else if (spec.id === 'power') { value = v * i; unit = 'W'; label = 'Power'; tex = `P = ${texNumber(v)} \\times ${texNumber(i)}`; }
  else if (spec.id === 'energy') { value = p * t / 1000; unit = 'kWh'; label = 'Energy'; tex = `E = \\frac{${texNumber(p)} \\times ${texNumber(t)}}{1000}`; }
  else if (spec.id === 'series') { value = r1 + r2 + r3; unit = 'Ω'; label = 'Total resistance'; tex = `R_T = ${texNumber(r1)} + ${texNumber(r2)} + ${texNumber(r3)}`; }
  else { value = Math.sqrt(3) * v * i * pf / 1000; unit = 'kW'; label = 'Real power'; tex = `P = \\frac{\\sqrt{3} \\times ${texNumber(v)} \\times ${texNumber(i)} \\times ${texNumber(pf)}}{1000}`; }
  if (!Number.isFinite(value)) return { error: 'These values produce a result outside the supported range.' };
  tex += ` = ${texNumber(value)}\\,${unit === 'Ω' ? '\\Omega' : `\\mathrm{${unit}}`}`;
  return { result: { value, unit, label, tex, numbers } };
}
