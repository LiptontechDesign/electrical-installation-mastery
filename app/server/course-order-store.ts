import { defaultOrder, parseOrder, type CourseOrder } from '../course-order-model';
import { readUserDocument, writeUserDocument } from './database';

export async function readCourseOrder(userId: string) {
  const stored = await readUserDocument<unknown>(userId, 'course-order');
  return stored ? parseOrder(stored.payload) : defaultOrder;
}

export async function saveCourseOrder(userId: string, order: CourseOrder) {
  await writeUserDocument(userId, 'course-order', order);
}
