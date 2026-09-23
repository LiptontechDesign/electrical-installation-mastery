import 'server-only';
import { neon } from '@neondatabase/serverless';

export type UserDocumentType =
  | 'learner-state'
  | 'course-order'
  | 'supplementary'
  | 'supplementary-progress'
  | 'reader-state';

export type StoredDocument<T> = {
  payload: T;
  revision: number;
  updatedAt: string;
};

export type AccountProfile = {
  id: string;
  email: string;
  name: string;
  picture: string | null;
  isAdmin: boolean;
};

const allowedDocumentTypes = new Set<UserDocumentType>([
  'learner-state',
  'course-order',
  'supplementary',
  'supplementary-progress',
  'reader-state',
]);

let schemaReady: Promise<void> | undefined;

function connectionString() {
  const value = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!value) throw new Error('DATABASE_NOT_CONFIGURED');
  return value;
}

function sql() {
  return neon(connectionString());
}

async function ensureSchema() {
  schemaReady ??= (async () => {
    const query = sql();
    await query`
      CREATE TABLE IF NOT EXISTS course_users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL,
        name TEXT NOT NULL DEFAULT '',
        picture TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        last_login_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await query`
      CREATE TABLE IF NOT EXISTS user_documents (
        user_id TEXT NOT NULL REFERENCES course_users(id) ON DELETE CASCADE,
        document_type TEXT NOT NULL,
        revision BIGINT NOT NULL DEFAULT 1,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, document_type)
      )
    `;
  })().catch(error => {
    schemaReady = undefined;
    throw error;
  });
  return schemaReady;
}

function assertDocumentType(type: string): asserts type is UserDocumentType {
  if (!allowedDocumentTypes.has(type as UserDocumentType)) throw new Error('INVALID_DOCUMENT_TYPE');
}

export async function upsertAccount(profile: AccountProfile) {
  await ensureSchema();
  const query = sql();
  await query`
    INSERT INTO course_users (id, email, name, picture)
    VALUES (${profile.id}, ${profile.email}, ${profile.name}, ${profile.picture})
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      name = EXCLUDED.name,
      picture = EXCLUDED.picture,
      last_login_at = NOW()
  `;
}

export async function readUserDocument<T>(userId: string, type: UserDocumentType): Promise<StoredDocument<T> | null> {
  assertDocumentType(type);
  await ensureSchema();
  const query = sql();
  const rows = await query`
    SELECT payload, revision::int AS revision, updated_at::text AS "updatedAt"
    FROM user_documents
    WHERE user_id = ${userId} AND document_type = ${type}
    LIMIT 1
  `;
  return rows[0] as StoredDocument<T> | undefined ?? null;
}

export async function writeUserDocument<T>(userId: string, type: UserDocumentType, payload: T): Promise<StoredDocument<T>> {
  assertDocumentType(type);
  await ensureSchema();
  const encoded = JSON.stringify(payload);
  if (encoded.length > 1_000_000) throw new Error('DOCUMENT_TOO_LARGE');
  const query = sql();
  const rows = await query`
    INSERT INTO user_documents (user_id, document_type, payload)
    VALUES (${userId}, ${type}, ${encoded}::jsonb)
    ON CONFLICT (user_id, document_type) DO UPDATE SET
      payload = EXCLUDED.payload,
      revision = user_documents.revision + 1,
      updated_at = NOW()
    RETURNING payload, revision::int AS revision, updated_at::text AS "updatedAt"
  `;
  return rows[0] as StoredDocument<T>;
}

export async function listUserDocuments(userId: string) {
  await ensureSchema();
  const query = sql();
  return await query`
    SELECT document_type AS "type", revision::int AS revision, payload, updated_at::text AS "updatedAt"
    FROM user_documents
    WHERE user_id = ${userId}
    ORDER BY document_type
  `;
}

export async function deleteAccountData(userId: string) {
  await ensureSchema();
  const query = sql();
  await query`DELETE FROM course_users WHERE id = ${userId}`;
}

export async function databaseReady() {
  try {
    await ensureSchema();
    return true;
  } catch {
    return false;
  }
}
