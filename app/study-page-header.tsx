import Link from './study-navigation-link';
import { Zap } from 'lucide-react';
import SiteSearch from './site-search';
import PastPaperLinks from './past-paper-links';
import MobileNavigation from './mobile-navigation';
export default function StudyPageHeader({ active = 'Practice' }: { active?: string }) {
  return <><header className="epra-site-header study-site-header"><Link href="/" className="epra-brand" aria-label="Electrical Installation Mastery home"><Zap size={24}/><span>Electrical<strong>INSTALLATION MASTERY</strong></span></Link><nav aria-label="Primary navigation"><Link href="/#home">Home</Link><Link href="/#learn">Learn</Link><Link href="/#books">Books</Link><Link href="/practice" aria-current={active === 'Practice' ? 'page' : undefined}>Practice</Link><PastPaperLinks active={active} selected={active === 'C1' || active === 'C2'}/></nav><SiteSearch/></header><MobileNavigation active={active === 'Practice' ? 'practice' : 'papers'} papersHref={active === 'C1' || active === 'C2' ? '#past-paper-main' : '/past-papers/c2'}/></>;
}
