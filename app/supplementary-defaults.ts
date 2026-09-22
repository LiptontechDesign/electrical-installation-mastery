import course from './course-curriculum';
import type { SupplementaryState, SupplementaryVideo } from './supplementary-model';

// Approved study-plan media. No duration, transcript or assessment is invented.
const resources = [
  ['protection-overview','8VhgQ9Q9ixA','Protective-device overview: MCB, MCCB, RCD, RCBO and MPCB','The Electrical Guy','p05-l01','after'],
  ['protection-study-path-07','kx35WN3uLis','Things you should know about fuses (including a 15kV one)','bigclivedotcom','p05-l02','after'],
  ['protection-mcb','gqEu9t8HwW0',"Why Circuit Breakers DON'T Protect People (electric shocks)",'The Engineering Mindset','p05-l03','after'],
  ['protection-curves','Me_adh09CdY','B C D K Z Type of MCB and Their Uses','The Electrical Guy','p05-l05','after'],
  ['protection-rcd','TUno2IT-KZY',"Why This Doesn't Make You Safe",'The Engineering Mindset','p05-l04','after'],
  ['protection-study-path-06','TqdQRgf3uGs','Difference Between MCB and MCCB','The Electrical Guy','course-Me_adh09CdY','after'],
  ['protection-study-path-08','CNiLNvBLopI','Why do we Need to Fit a Type 2 SPD?','GSH Electrical','p05-spd','before'],
  ['protection-study-path-09','wQwGZMcDGXk','What is MPCB | MPCB vs MCB | Motor Protection Circuit Breaker','The Electrical Guy','p04-l19','before'],
  ['protection-study-path-10','lIit5k8QVj8','What Every Electricity Professional Needs to Know About Arc Fault Devices','Schneider Electric','p05-spd','after'],
  ['c2-design-bridge','8Z255dd78H4','CABLE SIZE SELECTION AND THE OSG – Matching Cable and Circuit Breaker Sizes','LEARN ELECTRICS','p06-l10','after'],
  ['c2-first-aid-cpr','TsJ49Np3HS0','First Aid Training: CPR','St John Ambulance','p03-l14','after'],
  ['c2-first-aid-aed','UFvL7wTFzl0','AED / Defibrillator Training','St John Ambulance','p03-l14','after'],
  ['c2-electric-shock-first-aid','luTRnCoeD4c','Learn first aid gestures: Electrocution','SIKANA English','course-TsJ49Np3HS0','before'],
  ['c2-cable-sizes-colours','A8lBYlk5zjE','What Sizes do Twin and Earth Cables Come in?','GSH Electrical','p02-l01','after'],
  ['c2-equipment-protection-classes','eWHQRcO071E','Appliance Protection Classes 0, I, II and III','John Ward','p12-v2-l01','after'],
  ['c2-ip-ik-ratings','bvUZ2L7eHSE','IP Ratings Explained: Water, Dust and Impact','eFIXX','p12-v2-l01','after'],
  ['c2-spd-foundation','7en_Rc14c2g','What is a Surge Protection Device (SPD), and How Do They Work?','eFIXX','course-CNiLNvBLopI','before'],
  ['c2-selectivity-bridge','lOcbVQgCSpM','Selectivity, Discrimination and Co-ordination of Protective Devices','LEARN ELECTRICS','p05-l14','after'],
  ['c2-visual-inspection-bridge','RCCi6lfLT-U','Importance of Electrical Testing and Visual Inspections','GSH Electrical','p08-l02','before'],
  ['c2-certificate-overview','rYtaZRcCjl8','Electrical Certificates Part 1 — Overview and Minor Works','John Ward','p16-l09','before'],
  ['c2-full-verification-capstone','JIdARijhacs','Full Testing Sequence Including Completion of an EIC','Jim Henson','p16-l09','after'],
  ['c2-troubleshooting-method','UJZLP8ttrd4','A Systematic Electrical Troubleshooting Method','The Electrical Guy','p09-l01','before'],
  ['c2-lighting-faults','S1Tzr5VX8-Q','Lighting Circuit Faults: Common Problems and Solutions','LEARN ELECTRICS','p09-l01','before'],
  ['c1-pfc-bridge','NIrKOVZrqnU','Power Factor Explained – Your Electricity Bill Money Drain (Reactive Power)','The Engineering Mindset','p06-l14','before'],
  ['c1-nameplate','XbL0R_9KLD4','How to read a Motor Nameplate (IEC standard)','ElectricalEngineeringPlanet','p07-induction','after'],
  ['c1-dol-bridge','HFkTPmY7N7w','How Do Direct On Line Motor (DOL) Starters Work?','eFIXX','p15-v2-l01','before'],
  ['professional-selectivity','V6WR_TBf1AU','Circuit Breaker Selective Coordination: Common Questions and Misconceptions','Bentley EasyPower / ABB presenter','p05-l14','after'],
] as const;
const locations=new Map(course.modules.flatMap(m=>m.lessons.map(l=>[l.id,m.id] as const)));
const canonical=new Set(course.modules.flatMap(m=>m.lessons.map(l=>l.videoId)));
const defaults:SupplementaryVideo[]=resources.filter(r=>!canonical.has(r[1])).map(([id,videoId,title,instructor,anchorId,position])=>({
  id,videoId,title,instructor,anchorId,position,moduleId:locations.get(anchorId)!,archived:false,placementRevision:1,updatedAt:'2026-09-10T00:00:00.000Z',
}));
export function withSupplementaryDefaults(state:SupplementaryState):SupplementaryState {
  // Promoted videos now have one canonical lesson. Keep stored history intact,
  // but do not display or merge a second supplementary copy.
  const saved=state.videos.filter(video=>!canonical.has(video.videoId)).map(video=>{
    const seed=defaults.find(item=>item.id===video.id||item.videoId===video.videoId);
    // One curriculum migration; later visitor moves are preserved.
    const migrated=seed&&!video.placementRevision ? {...video,moduleId:seed.moduleId,anchorId:seed.anchorId,position:seed.position,title:video.title.replace(/^Protection study path \d+\/10 · /,''),placementRevision:1} : video;
    return {...migrated,moduleId:locations.get(migrated.anchorId)??migrated.moduleId};
  });
  const ids=new Set(saved.map(v=>v.id)),videoIds=new Set(saved.map(v=>v.videoId));
  return {...state,videos:[...saved,...defaults.filter(v=>!ids.has(v.id)&&!videoIds.has(v.videoId))]};
}
