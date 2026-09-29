import { requireCourseUser } from '../../server/auth';
import { limitedJson, sameOrigin, privateHeaders } from '../../server/reader-auth';
import { readPersonalCourse, savePersonalCourse } from '../../server/personal-course-store';
import { CourseEditError, validateEditRequest } from '../../personal-course-model';

export const runtime = 'nodejs';
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: privateHeaders });
export async function GET() {
  try { const user = await requireCourseUser(); return reply((await readPersonalCourse(user.id)).state); }
  catch (error) { const unauthenticated = error instanceof Error && error.message === 'UNAUTHENTICATED'; return reply({ error: unauthenticated ? 'Sign in to open your course arrangement.' : 'Your course arrangement could not be loaded. Please retry.' }, unauthenticated ? 401 : 503); }
}
export async function POST(request: Request) {
  if (!sameOrigin(request)) return reply({ error: 'Request not allowed.' }, 403);
  let user;
  try { user = await requireCourseUser(); }
  catch { return reply({ error: 'Sign in to change your course.' }, 401); }
  let body;
  try { body = validateEditRequest(await limitedJson(request)); }
  catch (error) { return reply({ error: error instanceof CourseEditError ? error.message : 'Check your video and destination.' }, 400); }
  try { return reply(await savePersonalCourse(user.id, body)); }
  catch (error) {
    if (error instanceof CourseEditError) {
      let state;
      if (error.status === 409) { try { state = (await readPersonalCourse(user.id)).state; } catch { /* Keep the original error. */ } }
      return reply({ error: error.message, existingId: error.existingId, state }, error.status);
    }
    return reply({ error: 'The change could not be confirmed. Your form has been kept. Retry to check and safely save this change.' }, 503);
  }
}
