import 'server-only';
import { readUserDocument, compareAndSwapPersonalCourse } from './database';
import { defaultOrder, parseOrder } from '../course-order-model';
import type { SupplementaryState } from '../supplementary-model';
import { applyCourseEdit, migratePersonalCourse, parsePersonalCourse, CourseEditError, type EditRequest } from '../personal-course-model';

export async function readPersonalCourse(userId: string) {
  const stored = await readUserDocument(userId, 'personal-course');
  if (stored) return { state: parsePersonalCourse(stored.payload), storageRevision: stored.revision };
  const [order, supplementary] = await Promise.all([
    readUserDocument(userId, 'course-order'), readUserDocument<SupplementaryState>(userId, 'supplementary'),
  ]);
  if (supplementary && (supplementary.payload.version !== 1 || !Array.isArray(supplementary.payload.videos))) throw new Error('Invalid legacy library');
  return { state: migratePersonalCourse(order ? parseOrder(order.payload) : defaultOrder, supplementary?.payload), storageRevision: 0 };
}

export async function savePersonalCourse(userId: string, request: EditRequest) {
  const current = await readPersonalCourse(userId);
  if (current.state.receipts.some(receipt => receipt.id === request.operationId)) return current.state;
  const next = applyCourseEdit(current.state, request);
  const saved = await compareAndSwapPersonalCourse(userId, current.storageRevision, next);
  if (saved) return parsePersonalCourse(saved.payload);
  const latest = await readPersonalCourse(userId);
  if (latest.state.receipts.some(receipt => receipt.id === request.operationId)) return latest.state;
  throw new CourseEditError('Your course changed in another tab or device. Review the latest arrangement and try again.', 409);
}
