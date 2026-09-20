import { moveLesson } from '../../course-order-model';
import { readCourseOrder, saveCourseOrder } from '../../server/course-order-store';
import { limitedJson, sameOrigin, privateHeaders } from '../../server/reader-auth';
export const runtime = 'nodejs';
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: privateHeaders });
export async function GET() {
  try { return reply((await readCourseOrder()).order); }
  catch { return reply({ error: 'Shared course order is unavailable. Please retry.' }, 503); }
}
export async function POST(request: Request) {
  // Matches the existing open, collaborative supplementary catalogue.
  if (!sameOrigin(request)) return reply({ error: 'Request not allowed.' }, 403);
  let body: Record<string, unknown>;
  try { const value = await limitedJson(request); if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(); body = value as Record<string, unknown>; } catch { return reply({ error: 'Invalid request.' }, 400); }
  if (!body || typeof body.lessonId !== 'string' || typeof body.sectionId !== 'string' || !(body.beforeId === null || typeof body.beforeId === 'string') || !Number.isSafeInteger(body.revision)) return reply({ error: 'Check the lesson and destination.' }, 400);
  try {
    const { order, etag } = await readCourseOrder();
    if (body.revision !== order.revision) return reply({ error: 'Someone changed the course order. Review the latest order and try again.', order }, 409);
    let next;
    try { next = moveLesson(order, { lessonId: body.lessonId, sectionId: body.sectionId, beforeId: body.beforeId }); } catch (error) { return reply({ error: (error as Error).message }, 400); }
    try { await saveCourseOrder(next, etag); }
    catch { return reply({ error: 'The move was not saved. Refresh the order and retry; another edit or a storage problem may have occurred.' }, 409); }
    return reply(next);
  } catch { return reply({ error: 'Shared storage is unavailable. Your move has not been saved.' }, 503); }
}
