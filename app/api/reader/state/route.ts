import { limitedJson, privateHeaders, readerAuthenticated, sameOrigin } from '../../../server/reader-auth';
import { readReaderState, updateReaderState } from '../../../server/reader-storage';
import { parseReaderCommand } from '../../../reader-state';

export const runtime = 'nodejs';
export async function GET() {
  if (!await readerAuthenticated()) return Response.json({ error: 'Unlock your books first.' }, { status: 401, headers: privateHeaders });
  try { return Response.json((await readReaderState()).state, { headers: privateHeaders }); }
  catch { return Response.json({ error: 'Saved pages could not be loaded. Please retry.' }, { status: 503, headers: privateHeaders }); }
}
export async function PATCH(request: Request) {
  if (!sameOrigin(request)) return Response.json({ error: 'Request not allowed.' }, { status: 403, headers: privateHeaders });
  if (!await readerAuthenticated()) return Response.json({ error: 'Unlock your books first.' }, { status: 401, headers: privateHeaders });
  let command;
  try { command = parseReaderCommand(await limitedJson(request)); } catch { command = null; }
  if (!command) return Response.json({ error: 'Invalid page or bookmark.' }, { status: 400, headers: privateHeaders });
  try { return Response.json(await updateReaderState(command), { headers: privateHeaders }); }
  catch (error) {
    const limit = error instanceof Error && error.message === 'BOOKMARK_LIMIT';
    return Response.json({ error: limit ? 'This book has reached the 200-bookmark limit.' : 'Changes were not saved. Please retry.' }, { status: limit ? 400 : 503, headers: privateHeaders });
  }
}
