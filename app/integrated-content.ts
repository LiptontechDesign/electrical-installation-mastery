import type { SuppliedTeaching } from './supplied-content-types';
import { safetyTeaching } from './integrated-safety-content';
import { protectionTeaching } from './integrated-protection-content';
import { applicationsTeaching } from './integrated-applications-content';
import { deeperQuestions } from './integrated-deeper-questions';

export const integratedTeaching: Record<string, SuppliedTeaching> = Object.fromEntries(
  Object.entries({...safetyTeaching,...protectionTeaching,...applicationsTeaching}).map(([videoId, content])=>['course-'+videoId,{...content,questions:[...content.questions,...(deeperQuestions[videoId]??[])]}]),
);
