import { deleteAccountData } from '../../server/database';
import { requireCourseUser, signOutCourseUser } from '../../server/auth';
import { limitedJson, privateHeaders, sameOrigin } from '../../server/reader-auth';

export const runtime = 'nodejs';

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403, headers: privateHeaders });
  try {
    const user = await requireCourseUser();
    const body = await limitedJson(request) as { confirmation?: unknown };
    if (body?.confirmation !== 'DELETE MY DATA') return Response.json({ error: 'Type DELETE MY DATA exactly.' }, { status: 400, headers: privateHeaders });
    await deleteAccountData(user.id);
    await signOutCourseUser();
    return Response.json({ deleted: true }, { headers: privateHeaders });
  } catch (error) {
    return Response.json({ error: error instanceof Error && error.message === 'UNAUTHENTICATED' ? 'Sign in first.' : 'Your account data was not deleted. Please retry.' }, { status: error instanceof Error && error.message === 'UNAUTHENTICATED' ? 401 : 503, headers: privateHeaders });
  }
}
