import { NextResponse } from 'next/server';
import { sameOrigin } from '../../../server/reader-auth';
import { signOutCourseUser } from '../../../server/auth';

export async function POST(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403 });
  await signOutCourseUser();
  return NextResponse.redirect(new URL('/', request.url), { status: 303 });
}
