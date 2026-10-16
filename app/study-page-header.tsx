import Link from 'next/link';
import { Zap } from 'lucide-react';
import SiteSearch from './site-search';
import PastPaperLinks from './past-paper-links';
import MobileNavigation from './mobile-navigation';
export default function StudyPageHeader({ active = 'Practice' }: { active?: string }) {
  return <><header className="epra-site-header study-site-header"><Link href="/" className="epra-brand"><Zap size={24}/><span>Electrical<strong>INSTALLATION MASTERY</strong></span></Link><nav aria-label="Primary navigation"><Link href="/#home">My learning</Link><Link href="/#learn">Learn</Link><Link href="/#books">Books</Link><Link href="/practice" aria-current={active === 'Practice' ? 'page' : undefined}>Practice</Link><PastPaperLinks active={active}/></nav><SiteSearch/></header><MobileNavigation active={active === 'Practice' ? 'practice' : 'papers'} papersHref={active === 'C1' ? '/past-papers/c1' : '/past-papers/c2'}/></>;
}
