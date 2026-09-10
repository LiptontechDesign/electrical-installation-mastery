import type { SupplementaryState, SupplementaryVideo } from './supplementary-model';

// Supplied EPRA_C1_C2_Protective_Devices_Video_Study_Path.md, steps 6–10.
// Steps 1–3 and 5 are already stored remotely; step 4 is core lesson p02-l02.
// Bundle these additions so publication does not depend on a Blob overwrite.
const protectiveVideos = [
  ['06', 'TqdQRgf3uGs', 'Difference Between MCB and MCCB', 'The Electrical Guy'],
  ['07', 'kx35WN3uLis', 'Things you should know about fuses (including a 15kV one)', 'bigclivedotcom'],
  ['08', 'CNiLNvBLopI', 'Why do we Need to Fit a Type 2 SPD?', 'GSH Electrical'],
  ['09', 'wQwGZMcDGXk', 'What is MPCB | MPCB vs MCB | Motor Protection Circuit Breaker', 'The Electrical Guy'],
  ['10', 'lIit5k8QVj8', 'What Every Electricity Professional Needs to Know About Arc Fault Devices', 'Schneider Electric'],
] as const;

const defaults: SupplementaryVideo[] = protectiveVideos.map(([step, videoId, title, instructor]) => ({
  id: `protection-study-path-${step}`,
  videoId,
  title: `Protection study path ${step}/10 · ${title}`,
  instructor,
  moduleId: 'module-05',
  anchorId: 'p05-l05',
  position: 'after',
  archived: false,
  updatedAt: '2026-09-10T00:00:00.000Z',
}));

export function withSupplementaryDefaults(state: SupplementaryState): SupplementaryState {
  // Remote entries win by stable record ID or YouTube ID, including archived
  // records. Never re-add an archived default or duplicate an existing video.
  const ids = new Set(state.videos.map(video => video.id));
  const videoIds = new Set(state.videos.map(video => video.videoId));
  return { ...state, videos: [...state.videos, ...defaults.filter(video => !ids.has(video.id) && !videoIds.has(video.videoId))] };
}
