export type MotorState = { supply: boolean; tripped: boolean; running: boolean; holdingFault: boolean };
export type MotorAction = 'start' | 'release' | 'stop' | 'trip' | 'reset' | 'supply' | 'holding-fault';
export const initialMotor: MotorState = { supply: true, tripped: false, running: false, holdingFault: false };
export function motorTransition(state: MotorState, action: MotorAction): MotorState {
  if (action === 'start') return { ...state, running: state.supply && !state.tripped };
  if (action === 'release') return { ...state, running: state.running && !state.holdingFault };
  if (action === 'stop') return { ...state, running: false };
  if (action === 'trip') return { ...state, tripped: true, running: false };
  if (action === 'reset') return { ...state, tripped: false, running: false };
  if (action === 'supply') return { ...state, supply: !state.supply, running: false };
  return { ...state, holdingFault: !state.holdingFault, running: false };
}
export const cableRoutes = [
  { id: 'reference', title: 'Reference conditions', factor: 1, explanation: 'This example starts with the full illustrative table capacity.' },
  { id: 'grouped', title: 'Grouped route', factor: .8, explanation: 'An assumed factor of 0.80 reduces the capacity in this teaching example.' },
  { id: 'insulated', title: 'Thermally restricted route', factor: .6, explanation: 'An assumed factor of 0.60 shows how restricted heat loss can reduce capacity.' },
] as const;
export function cableExample(current: number, length: number, factor: number) {
  if (![current,length,factor].every(Number.isFinite) || current < 0 || current > 63 || length < 1 || length > 100 || factor <= 0 || factor > 1) return null;
  const capacity = 50 * factor;
  const drop = current * length * 4.4 / 1000;
  return { capacity, drop, percent: drop / 230 * 100, capacityMet: current <= 32 && 32 <= capacity };
}
export function residualExample(fault: boolean, leakageMilliamps = 40) {
  const residualMilliamps = fault ? Math.max(0, Math.min(60, Number.isFinite(leakageMilliamps) ? leakageMilliamps : 40)) : 0;
  return { line: 2 + residualMilliamps / 1000, neutral: 2, protective: residualMilliamps / 1000, residualMilliamps };
}
