import { moveLesson } from '../../course-order-model';
import { readCourseOrder, saveCourseOrder } from '../../server/course-order-store';
import { requireCourseUser } from '../../server/auth';
import { limitedJson, sameOrigin, privateHeaders } from '../../server/reader-auth';
export const runtime = 'nodejs';
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: privateHeaders });
export async function GET() {
  try { const user = await requireCourseUser(); return reply(await readCourseOrder(user.id)); }
  catch (error) { return reply({ error: error instanceof Error && error.message === 'UNAUTHENTICATED' ? 'Sign in to open your course order.' : 'Your course order is unavailable. Please retry.' }, error instanceof Error && error.message === 'UNAUTHENTICATED' ? 401 : 503); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: 'Request not allowed.' }, 403);
  let body: Record<string, unknown>;
  try { const value = await limitedJson(request); if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(); body = value as Record<string, unknown>; } catch { return reply({ error: 'Invalid request.' }, 400); }
  if (!body || typeof body.lessonId !== 'string' || typeof body.sectionId !== 'string' || !(body.beforeId === null || typeof body.beforeId === 'string') || !Number.isSafeInteger(body.revision)) return reply({ error: 'Check the lesson and destination.' }, 400);
  try {
    const user = await requireCourseUser();
    const order = await readCourseOrder(user.id);
    if (body.revision !== order.revision) return reply({ error: 'Someone changed the course order. Review the latest order and try again.', order }, 409);
    let next;
    try { next = moveLesson(order, { lessonId: body.lessonId, sectionId: body.sectionId, beforeId: body.beforeId }); } catch (error) { return reply({ error: (error as Error).message }, 400); }
    try { await saveCourseOrder(user.id, next); }
    catch { return reply({ error: 'The move was not saved. Refresh the order and retry.' }, 503); }
    return reply(next);
  } catch (error) { return reply({ error: error instanceof Error && error.message === 'UNAUTHENTICATED' ? 'Sign in to change your course order.' : 'Your private storage is unavailable. The move was not saved.' }, error instanceof Error && error.message === 'UNAUTHENTICATED' ? 401 : 503); }
}
