import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import StudyPageHeader from '../../study-page-header';
import PastPaperCentre from '../past-paper-centre';
import '../../practice/study.css';
import '../past-papers.css';

type Props = { params: Promise<{ pathway: string }> };
export function generateStaticParams() { return [{ pathway: 'c1' }, { pathway: 'c2' }]; }
export const dynamicParams = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pathway } = await params;
  return { title: `${pathway.toUpperCase()} Past Papers: Questions with Worked Answers`, description: 'Consolidated electrical past-paper study questions, question breakdowns, key terms, worked answers and precise study diagrams.', alternates: { canonical: `/past-papers/${pathway}` } };
}
export default async function PastPaperPage({ params }: Props) {
  const { pathway } = await params;
  if (pathway !== 'c1' && pathway !== 'c2') notFound();
  const path = pathway === 'c1' ? 'C1' : 'C2';
  return <div className="epra-page past-paper-page"><a className="skip-link" href="#past-paper-main">Skip to past-paper content</a><StudyPageHeader active={path}/><main id="past-paper-main"><PastPaperCentre key={path} path={path}/></main></div>;
}
