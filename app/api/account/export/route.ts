import { requireCourseUser } from '../../../server/auth';
import { listUserDocuments } from '../../../server/database';
import { privateHeaders } from '../../../server/reader-auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const user = await requireCourseUser();
    const payload = JSON.stringify({
      app: 'Electrical Installation Mastery',
      exportedAt: new Date().toISOString(),
      account: { email: user.email, name: user.name },
      records: await listUserDocuments(user.id),
    }, null, 2);
    return new Response(payload, {
      headers: {
        ...privateHeaders,
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="electrical-mastery-account-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    return Response.json({ error: error instanceof Error && error.message === 'UNAUTHENTICATED' ? 'Sign in first.' : 'The export is temporarily unavailable.' }, { status: error instanceof Error && error.message === 'UNAUTHENTICATED' ? 401 : 503, headers: privateHeaders });
  }
}
