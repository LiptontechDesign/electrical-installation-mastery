'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { bookByteLengths, type BookId } from './books-data';
import { PdfRangeQueue } from './pdf-range';

export default function PdfPage({ bookId, page, zoom, onRendered }: { bookId: BookId; page: number; zoom: number; onRendered: (page: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(720);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(240, entries[0].contentRect.width - 32)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    let cancelled = false;
    let task: ReturnType<typeof import('pdfjs-dist')['getDocument']> | undefined;
    let downloads: PdfRangeQueue | undefined;
    void (async () => {
      setDocument(null); setError(''); setLoading(true);
      const pdfjs = await import('pdfjs-dist');
      if (cancelled) return;
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
      class PrivateRange extends pdfjs.PDFDataRangeTransport {
        requestDataRange(begin: number, end: number) { downloads?.request(begin, end); }
        abort() { downloads?.abort(); }
      }
      const transport = new PrivateRange(bookByteLengths[bookId], new Uint8Array(), true);
      downloads = new PdfRangeQueue(`/api/reader/books/${bookId}`, (begin, data) => transport.onDataRange(begin, data), error => {
        if (!cancelled) { setLoading(false); setError(error.message); }
        void task?.destroy();
      });
      task = pdfjs.getDocument({ range: transport, disableAutoFetch: true, disableStream: true, rangeChunkSize: 1048576, cMapUrl: '/pdfjs/cmaps/', cMapPacked: true, standardFontDataUrl: '/pdfjs/standard_fonts/', wasmUrl: '/pdfjs/wasm/' });
      const loaded = await task.promise;
      if (!cancelled) setDocument(loaded);
    })().catch(() => { if (!cancelled) { setLoading(false); setError('This page could not load. Check your connection and that your books are unlocked.'); } });
    return () => { cancelled = true; downloads?.abort(); void task?.destroy(); };
  }, [bookId, retry]);
  useEffect(() => {
    if (!document) return;
    let cancelled = false;
    let render: RenderTask | undefined;
    void (async () => {
      setLoading(true); setError(''); setText('');
      const pdfPage = await document.getPage(page);
      if (cancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const original = pdfPage.getViewport({ scale: 1 });
      const scale = Math.min(width, 960) / original.width * zoom;
      const viewport = pdfPage.getViewport({ scale });
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(viewport.width * ratio);
      canvas.height = Math.round(viewport.height * ratio);
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      render = pdfPage.render({ canvas, viewport, transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] });
      await render.promise;
      if (cancelled) return;
      setLoading(false); onRendered(page);
      const content = await pdfPage.getTextContent();
      if (!cancelled) setText(content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join(''));
    })().catch(error => { if (!cancelled && error?.name !== 'RenderingCancelledException') { setLoading(false); setError('Could not render this page. Try loading it again.'); } });
    return () => { cancelled = true; render?.cancel(); };
  }, [document, page, zoom, width, onRendered]);
  return <div ref={containerRef} className="pdf-stage" aria-busy={loading}>
    {loading && <div className="pdf-status" role="status">Loading page {page}…</div>}
    {error && <div className="pdf-error" role="alert"><p>{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>Retry page</button></div>}
    <div className="pdf-canvas-scroll"><canvas ref={canvasRef} aria-label={`Book page ${page}`} style={{ visibility: loading || error ? 'hidden' : 'visible' }} /></div>
    {!loading && !error && <details className="pdf-page-text"><summary>Page text</summary>{text.trim() ? <p>{text}</p> : <p>This is a scanned page. Use the page image and zoom controls to read it.</p>}</details>}
  </div>;
}
