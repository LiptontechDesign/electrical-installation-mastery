import Link from 'next/link';
export const paperDestinations = [{ path: 'C1', href: '/past-papers/c1' }, { path: 'C2', href: '/past-papers/c2' }];
export default function PastPaperLinks({ active }: { active?: string }) {
  return <>{paperDestinations.map(item => <Link key={item.path} href={item.href} className="studio-practice-link past-paper-nav-link" aria-current={active === item.path ? 'page' : undefined}><span>{item.path} Past Papers</span></Link>)}</>;
}

export function PastPaperPathSwitcher({ active }: { active: 'C1' | 'C2' }) {
  return <nav className="past-paper-path-switcher" aria-label="Past paper pathway">
    {['C2', 'C1'].map(path => <Link key={path} href={path === active ? '#past-paper-main' : `/past-papers/${path.toLowerCase()}`} aria-current={active === path ? 'page' : undefined}>{path}</Link>)}
  </nav>;
}
