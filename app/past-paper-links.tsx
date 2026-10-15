import Link from 'next/link';
import { Files } from 'lucide-react';
export const paperDestinations = [{ path: 'C1', href: '/past-papers/c1' }, { path: 'C2', href: '/past-papers/c2' }];
export default function PastPaperLinks({ mobile = false, active }: { mobile?: boolean; active?: string }) {
  return <>{paperDestinations.map(item => <Link key={item.path} href={item.href} className={mobile ? 'mobile-practice-link past-paper-nav-link' : 'studio-practice-link past-paper-nav-link'} aria-current={active === item.path ? 'page' : undefined}>{mobile && <Files size={20}/>}<span>{item.path} {mobile ? 'papers' : 'Past Papers'}</span></Link>)}</>;
}
