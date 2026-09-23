import type { Metadata } from 'next';
import Link from 'next/link';
import { Zap, ArrowLeft } from 'lucide-react';
import StudyCentre from './study-centre';
import './study.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = { title: 'EPRA C1 & C2 Practice Centre', description: 'Topic practice, recall quizzes and complete C1 and C2 mock papers with full worked answers.', alternates: { canonical: '/practice' } };

export default function PracticePage() {
  return <div className="epra-page"><a className="skip-link" href="#study-main">Skip to practice content</a><header className="epra-site-header"><Link href="/" className="epra-brand"><Zap size={24}/><span>Electrical<strong>INSTALLATION MASTERY</strong></span></Link><nav aria-label="Primary navigation"><Link href="/">The course</Link><Link href="/#learn">Learn</Link><Link href="/#books">Books</Link><Link href="/practice" aria-current="page">Practice</Link></nav><Link className="epra-back-course" href="/"><ArrowLeft size={16}/> Back to course</Link></header><main id="study-main"><StudyCentre /></main></div>;
}
