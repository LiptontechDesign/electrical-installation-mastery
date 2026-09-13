import teaching from './supplied-teaching.json';
import type { SuppliedTeaching } from './supplied-content-types';
export const integratedTeaching: Record<string, SuppliedTeaching> = Object.fromEntries(Object.entries(teaching).filter(([id]) => id.startsWith('course-')));
