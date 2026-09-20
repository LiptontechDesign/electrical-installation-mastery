import CourseApp from './course-app';
import { SupplementaryProvider } from './supplementary-videos';
import { CourseOrderProvider } from './course-order';

export default function Home() {
  return <CourseOrderProvider><SupplementaryProvider><CourseApp /></SupplementaryProvider></CourseOrderProvider>;
}
