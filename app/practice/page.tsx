import type { Metadata } from 'next';
import StudyPageHeader from '../study-page-header';
import StudyCentre from './study-centre';
import './study.css';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = { title: 'EPRA C1 & C2 Practice Centre', description: 'Topic practice, recall quizzes, complete C1 and C2 mock papers, and searchable electrical definitions.', alternates: { canonical: '/practice' } };

export default function PracticePage() {
  return <div className="epra-page"><a className="skip-link" href="#study-main">Skip to practice content</a><StudyPageHeader/><main id="study-main"><StudyCentre /></main></div>;
}
