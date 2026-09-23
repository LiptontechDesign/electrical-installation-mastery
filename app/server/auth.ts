import 'server-only';
import { createRemoteJWKSet, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { upsertAccount, type AccountProfile } from './database';

const production = process.env.NODE_ENV === 'production';
const sessionCookie = production ? '__Host-electrical-session' : 'electrical-session';
const stateCookie = production ? '__Host-electrical-oauth-state' : 'electrical-oauth-state';
const nonceCookie = production ? '__Host-electrical-oauth-nonce' : 'electrical-oauth-nonce';
const verifierCookie = production ? '__Host-electrical-oauth-verifier' : 'electrical-oauth-verifier';
const sessionDuration = 60 * 60 * 24 * 30;
const oauthDuration = 60 * 10;
const issuer = 'electrical-installation-mastery';
const audience = 'electrical-course';
const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export type CourseUser = AccountProfile;

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) throw new Error('AUTH_NOT_CONFIGURED');
  return new TextEncoder().encode(value);
}

function adminEmail() {
  return (process.env.ADMIN_EMAIL || 'liptontechdesign@gmail.com').trim().toLowerCase();
}

export function authConfigured() {
  return Boolean(
    (process.env.AUTH_SECRET?.length ?? 0) >= 32 &&
    process.env.AUTH_GOOGLE_ID &&
    process.env.AUTH_GOOGLE_SECRET &&
    (process.env.DATABASE_URL || process.env.POSTGRES_URL),
  );
}

export function appOrigin(request?: Request) {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (configured) return configured.startsWith('http') ? configured.replace(/\/$/, '') : `https://${configured.replace(/\/$/, '')}`;
  if (request) return new URL(request.url).origin;
  return 'http://localhost:3000';
}

export function googleCallbackUrl(request?: Request) {
  return `${appOrigin(request)}/api/auth/google/callback`;
}

function randomValue() {
  return crypto.randomUUID().replaceAll('-', '') + crypto.randomUUID().replaceAll('-', '');
}

async function challenge(verifier: string) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return Buffer.from(digest).toString('base64url');
}

const transientOptions = {
  httpOnly: true,
  secure: production,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: oauthDuration,
};

export async function beginGoogleSignIn(request: Request) {
  if (!authConfigured()) throw new Error('AUTH_NOT_CONFIGURED');
  const state = randomValue();
  const nonce = randomValue();
  const verifier = randomValue();
  const store = await cookies();
  store.set(stateCookie, state, transientOptions);
  store.set(nonceCookie, nonce, transientOptions);
  store.set(verifierCookie, verifier, transientOptions);

  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.searchParams.set('client_id', process.env.AUTH_GOOGLE_ID!);
  url.searchParams.set('redirect_uri', googleCallbackUrl(request));
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'openid email profile');
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);
  url.searchParams.set('code_challenge', await challenge(verifier));
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('prompt', 'select_account');
  return url;
}

function clearOAuthCookies(store: Awaited<ReturnType<typeof cookies>>) {
  store.delete(stateCookie);
  store.delete(nonceCookie);
  store.delete(verifierCookie);
}

export async function completeGoogleSignIn(request: Request) {
  if (!authConfigured()) throw new Error('AUTH_NOT_CONFIGURED');
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  const store = await cookies();
  const expectedState = store.get(stateCookie)?.value;
  const nonce = store.get(nonceCookie)?.value;
  const verifier = store.get(verifierCookie)?.value;
  clearOAuthCookies(store);
  if (!code || !returnedState || returnedState !== expectedState || !nonce || !verifier) throw new Error('INVALID_OAUTH_RESPONSE');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.AUTH_GOOGLE_ID!,
      client_secret: process.env.AUTH_GOOGLE_SECRET!,
      code,
      code_verifier: verifier,
      grant_type: 'authorization_code',
      redirect_uri: googleCallbackUrl(request),
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error('TOKEN_EXCHANGE_FAILED');
  const tokens = await response.json() as { id_token?: string };
  if (!tokens.id_token) throw new Error('MISSING_ID_TOKEN');
  const { payload } = await jwtVerify(tokens.id_token, googleKeys, {
    algorithms: ['RS256'],
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: process.env.AUTH_GOOGLE_ID,
  });
  if (payload.nonce !== nonce || payload.email_verified !== true || typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
    throw new Error('INVALID_GOOGLE_IDENTITY');
  }
  const user: CourseUser = {
    id: payload.sub,
    email: payload.email,
    name: typeof payload.name === 'string' ? payload.name : payload.email.split('@')[0],
    picture: typeof payload.picture === 'string' ? payload.picture : null,
    isAdmin: payload.email.toLowerCase() === adminEmail(),
  };
  await upsertAccount(user);
  const token = await new SignJWT({ email: user.email, name: user.name, picture: user.picture, isAdmin: user.isAdmin })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuer(issuer)
    .setAudience(audience)
    .setIssuedAt()
    .setExpirationTime(`${sessionDuration}s`)
    .sign(secret());
  store.set(sessionCookie, token, {
    httpOnly: true,
    secure: production,
    sameSite: 'lax',
    path: '/',
    maxAge: sessionDuration,
  });
  return user;
}

export async function getCourseUser(): Promise<CourseUser | null> {
  if (!authConfigured()) return null;
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'], issuer, audience });
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string' || typeof payload.name !== 'string') return null;
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: typeof payload.picture === 'string' ? payload.picture : null,
      isAdmin: payload.email.toLowerCase() === adminEmail(),
    };
  } catch {
    return null;
  }
}

export async function requireCourseUser() {
  const user = await getCourseUser();
  if (!user) throw new Error('UNAUTHENTICATED');
  return user;
}

export async function signOutCourseUser() {
  (await cookies()).delete(sessionCookie);
}
