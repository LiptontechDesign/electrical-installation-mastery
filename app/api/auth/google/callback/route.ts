import { NextResponse } from 'next/server';
import { appOrigin, completeGoogleSignIn } from '../../../../server/auth';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    await completeGoogleSignIn(request);
    return NextResponse.redirect(`${appOrigin(request)}/`);
  } catch (error) {
    console.error('Google sign-in failed', { type: error instanceof Error ? error.message : 'UNKNOWN' });
    return NextResponse.redirect(`${appOrigin(request)}/?authError=signin`);
  }
}
