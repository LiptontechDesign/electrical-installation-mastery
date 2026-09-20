import { get, put } from '@vercel/blob';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { defaultOrder, parseOrder, type CourseOrder } from '../course-order-model';
const pathname = 'course/lesson-order-v1.json';
const localPath = 'work/course-order-local.json';
const useLocalStore = process.env.NODE_ENV !== 'production' && !process.env.BLOB_READ_WRITE_TOKEN;
export async function readCourseOrder() {
  if (useLocalStore) {
    try { const order = parseOrder(JSON.parse(await readFile(localPath, 'utf8'))); return { order, etag: `local:${order.revision}` }; }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; return { order: defaultOrder, etag: 'local:0' }; }
  }
  const result = await get(pathname, { access: 'private', useCache: false });
  if (!result) return { order: defaultOrder, etag: undefined };
  if (result.statusCode !== 200) throw new Error('Shared storage unavailable');
  return { order: parseOrder(await new Response(result.stream).json()), etag: result.blob.etag };
}
export async function saveCourseOrder(order: CourseOrder, etag?: string) {
  if (useLocalStore) {
    const current = await readCourseOrder();
    if (etag !== current.etag) throw new Error('Course order changed');
    await mkdir('work', { recursive: true });
    await writeFile(localPath, `${JSON.stringify(order, null, 2)}\n`, 'utf8');
    return;
  }
  await put(pathname, JSON.stringify(order), { access: 'private', addRandomSuffix: false,
    allowOverwrite: !!etag, ...(etag ? { ifMatch: etag } : {}), contentType: 'application/json', cacheControlMaxAge: 0 });
}
