import Link from './study-navigation-link';
import { Check } from 'lucide-react';
export const paperDestinations = [{ path: 'C1', href: '/past-papers/c1' }, { path: 'C2', href: '/past-papers/c2' }];
export default function PastPaperLinks({ active, selected = Boolean(active) }: { active?: string; selected?: boolean }) {
  return <Link href={active === 'C1' ? '/past-papers/c1' : '/past-papers/c2'} className="studio-practice-link past-paper-nav-link" aria-current={selected ? 'page' : undefined}>Papers</Link>;
}

export function PastPaperPathSwitcher({ active }: { active: 'C1' | 'C2' }) {
  return <nav className="past-paper-path-switcher" aria-label="Past paper pathway">
    {([{ path: 'C2', label: 'Foundations' }, { path: 'C1', label: 'Extended study' }] as const).map(({ path, label }) => <Link key={path} href={path === active ? '#past-paper-main' : `/past-papers/${path.toLowerCase()}`} aria-current={active === path ? 'page' : undefined}><strong>{path}</strong><span>{label}</span>{active === path && <Check size={16} aria-hidden="true"/>}</Link>)}
  </nav>;
}
