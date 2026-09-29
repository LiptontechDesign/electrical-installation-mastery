import { requireCourseUser } from '../../server/auth';
import { readPersonalCourse } from '../../server/personal-course-store';
import { personalCourseSnapshot } from '../../personal-course-model';
import { privateHeaders, sameOrigin } from '../../server/reader-auth';
export const runtime = 'nodejs';
export async function GET() {
  try { const user = await requireCourseUser(); return Response.json(personalCourseSnapshot((await readPersonalCourse(user.id)).state).order, { headers: privateHeaders }); }
  catch (error) { return Response.json({ error: 'Your course order is unavailable.' }, { status: error instanceof Error && error.message === 'UNAUTHENTICATED' ? 401 : 503, headers: privateHeaders }); }
}
// Old tabs must refresh: a core-only write cannot express the mixed arrangement.
export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403, headers: privateHeaders });
  try { await requireCourseUser(); }
  catch { return Response.json({ error: 'Sign in first.' }, { status: 401, headers: privateHeaders }); }
  return Response.json({ error: 'The course editor has been updated. Reload the page to make this change.' }, { status: 409, headers: privateHeaders });
}
