import { overviewPages, type CanonicalTerm, type OverviewPageId } from './overview-models';

export const overviewPageLabels: Record<OverviewPageId, string> = {
  'system-model': 'System Model',
  definitions: 'Definitions',
  relationships: 'Relationships',
  'engineering-rules': 'Engineering Rules',
  application: 'Application',
  verification: 'Verification',
  'common-confusions': 'Common Confusions',
  sources: 'Sources',
};

export const authorityLabels: Record<CanonicalTerm['authority'], string> = {
  'formal-definition-verified': 'FORMAL DEFINITION — VERIFIED',
  'current-standards-meaning': 'CURRENT STANDARDS MEANING',
  'explanatory-definition': 'EXPLANATORY DEFINITION',
  'historical-explanation': 'HISTORICAL/EXPLANATORY WORDING',
};

export const kenyaStatusLabels: Record<CanonicalTerm['kenyaStatus'], string> = {
  'kenya-verified': 'KENYA VERIFIED',
  'bs7671-technical-baseline': 'CURRENT BS 7671 TECHNICAL BASELINE',
  'check-kenyan-requirement': 'CHECK KENYAN REQUIREMENT',
};

export type NavigationDirection = 'previous' | 'next' | 'first' | 'last';

export function moveSelection(current: number, length: number, direction: NavigationDirection) {
  if (length <= 0) return -1;
  if (direction === 'first') return 0;
  if (direction === 'last') return length - 1;
  if (direction === 'previous') return Math.max(0, current - 1);
  return Math.min(length - 1, current + 1);
}

export { overviewPages };
