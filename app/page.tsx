import CourseApp from './course-app';
import { SupplementaryProvider } from './supplementary-videos';
import { CourseOrderProvider } from './course-order';
import { getCourseUser } from './server/auth';
import { CourseAccountProvider } from './course-account';

export default async function Home({ searchParams }: { searchParams: Promise<{ authError?: string }> }) {
  const user = await getCourseUser();
  return <CourseAccountProvider user={user} authError={(await searchParams).authError}><CourseOrderProvider><SupplementaryProvider userId={user?.id}><CourseApp user={user} /></SupplementaryProvider></CourseOrderProvider></CourseAccountProvider>;
}
