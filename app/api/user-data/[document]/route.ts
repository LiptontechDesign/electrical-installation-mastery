import { clampState } from '../../../learner-state';
import { readUserDocument, writeUserDocument, type UserDocumentType } from '../../../server/database';
import { requireCourseUser } from '../../../server/auth';
import { limitedJson, privateHeaders, sameOrigin } from '../../../server/reader-auth';

export const runtime = 'nodejs';

const clientDocuments = new Set<UserDocumentType>(['learner-state', 'supplementary-progress']);
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: privateHeaders });

function parsePayload(type: UserDocumentType, value: unknown) {
  if (type === 'learner-state') return clampState(value);
  if (type === 'supplementary-progress') {
    if (!Array.isArray(value) || value.length > 2000 || value.some(id => typeof id !== 'string' || id.length > 120)) {
      throw new Error('INVALID_PROGRESS');
    }
    return [...new Set(value)];
  }
  throw new Error('INVALID_DOCUMENT');
}

async function documentType(context: { params: Promise<{ document: string }> }) {
  const type = (await context.params).document as UserDocumentType;
  return clientDocuments.has(type) ? type : null;
}

export async function GET(_request: Request, context: { params: Promise<{ document: string }> }) {
  const type = await documentType(context);
  if (!type) return reply({ error: 'Record not found.' }, 404);
  try {
    const user = await requireCourseUser();
    const stored = await readUserDocument<unknown>(user.id, type);
    return reply({ exists: Boolean(stored), revision: stored?.revision ?? 0, payload: stored ? parsePayload(type, stored.payload) : null });
  } catch (error) {
    return reply({ error: error instanceof Error && error.message === 'UNAUTHENTICATED' ? 'Sign in to open your learning record.' : 'Your saved record is temporarily unavailable.' }, error instanceof Error && error.message === 'UNAUTHENTICATED' ? 401 : 503);
  }
}

export async function PUT(request: Request, context: { params: Promise<{ document: string }> }) {
  if (!sameOrigin(request)) return reply({ error: 'Request not allowed.' }, 403);
  const type = await documentType(context);
  if (!type) return reply({ error: 'Record not found.' }, 404);
  try {
    const user = await requireCourseUser();
    const body = await limitedJson(request, 1_000_000) as { payload?: unknown };
    const payload = parsePayload(type, body?.payload);
    const stored = await writeUserDocument(user.id, type, payload);
    return reply({ revision: stored.revision, payload: stored.payload });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message === 'UNAUTHENTICATED') return reply({ error: 'Sign in to save your learning record.' }, 401);
    if (message.startsWith('INVALID_') || message === 'BAD_BODY') return reply({ error: 'The learning record is not valid.' }, 400);
    return reply({ error: 'Your changes could not be saved. Please retry.' }, 503);
  }
}
