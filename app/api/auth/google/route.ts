import { NextResponse } from 'next/server';
import { beginGoogleSignIn } from '../../../server/auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    return NextResponse.redirect(await beginGoogleSignIn(request));
  } catch {
    return NextResponse.redirect(new URL('/?authError=configuration', request.url));
  }
}
