import CourseApp from './course-app';
import { SupplementaryProvider } from './supplementary-videos';

export default function Home() {
  return <SupplementaryProvider><CourseApp /></SupplementaryProvider>;
}
