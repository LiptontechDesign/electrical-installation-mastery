type RangeJob = { begin: number; end: number };

// Keep PDF.js from starting a full-book transfer before switching to range requests.
// Two simultaneous requests also make large scanned pages usable on slow connections.
export class PdfRangeQueue {
  private queue: RangeJob[] = [];
  private active = 0;
  private stopped = false;
  private controllers = new Set<AbortController>();
  constructor(private url: string, private receive: (begin: number, data: Uint8Array) => void, private fail: (error: Error) => void, private extraHeaders: Record<string, string> = {}) {}
  request(begin: number, end: number) { this.queue.push({ begin, end }); this.pump(); }
  abort() { this.stopped = true; this.queue = []; for (const controller of this.controllers) controller.abort(); }
  private pump() {
    while (!this.stopped && this.active < 2 && this.queue.length) {
      const job = this.queue.shift()!;
      this.active += 1;
      void this.download(job).then(data => { if (!this.stopped) this.receive(job.begin, data); }).catch(error => {
        if (!this.stopped) { this.abort(); this.fail(error instanceof Error ? error : new Error('The book could not be loaded.')); }
      }).finally(() => { this.active -= 1; this.pump(); });
    }
  }
  private async download(job: RangeJob) {
    for (let attempt = 0; attempt < 3; attempt++) {
      if (this.stopped) throw new Error('Reader closed.');
      const controller = new AbortController();
      this.controllers.add(controller);
      const timer = setTimeout(() => controller.abort(), 25000);
      try {
        const response = await fetch(this.url, { credentials: 'same-origin', cache: 'no-store', signal: controller.signal, headers: { ...this.extraHeaders, Range: `bytes=${job.begin}-${job.end - 1}` } });
        if (response.status === 401 || response.status === 404) {
          await response.body?.cancel();
          throw new ReaderAccessError(response.status === 401 ? 'Unlock your books again to continue reading.' : 'This book is not available yet.');
        }
        if (response.status !== 206) { await response.body?.cancel(); throw new Error('Could not load part of the book.'); }
        const bytes = new Uint8Array(await response.arrayBuffer());
        if (bytes.length !== job.end - job.begin) throw new Error('The page download was incomplete.');
        return bytes;
      } catch (error) {
        if (error instanceof ReaderAccessError || this.stopped || attempt === 2) throw error;
      } finally { clearTimeout(timer); this.controllers.delete(controller); }
    }
    throw new Error('The page could not be downloaded.');
  }
}
class ReaderAccessError extends Error {}
