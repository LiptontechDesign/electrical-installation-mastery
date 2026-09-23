import CourseApp from './course-app';
import { SupplementaryProvider } from './supplementary-videos';
import { CourseOrderProvider } from './course-order';
import { getCourseUser } from './server/auth';
import SignIn from './sign-in';

export default async function Home({ searchParams }: { searchParams: Promise<{ authError?: string }> }) {
  const user = await getCourseUser();
  if (!user) return <SignIn error={(await searchParams).authError} />;
  return <CourseOrderProvider><SupplementaryProvider userId={user.id}><CourseApp user={user} /></SupplementaryProvider></CourseOrderProvider>;
}
