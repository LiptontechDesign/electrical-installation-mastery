'use client';

import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { bookByteLengths, type BookId } from './books-data';
import { PdfRangeQueue } from './pdf-range';
import { pdfRenderSize } from './pdf-layout';

export default function PdfPage({ bookId, page, zoom, mode = 'page', onRendered }: { bookId: BookId; page: number; zoom: number; mode?: 'page' | 'text'; onRendered: (page: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [width, setWidth] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState<string | null>(null);
  const [textSize, setTextSize] = useState(18);
  const [retry, setRetry] = useState(0);
  useEffect(() => { canvasRef.current?.parentElement?.scrollTo({ left: 0, top: 0, behavior: 'instant' }); }, [page]);
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(entries => setWidth(Math.max(1, Math.floor(entries[0].contentRect.width - 24))));
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
    })().catch(() => { if (!cancelled) { setLoading(false); setError('This page could not load. Check your connection or reopen My books.'); } });
    return () => { cancelled = true; downloads?.abort(); void task?.destroy(); };
  }, [bookId, retry]);
  useEffect(() => {
    if (!document || !width) return;
    let cancelled = false;
    let render: RenderTask | undefined;
    void (async () => {
      setLoading(true); setError(''); setText(null);
      const pdfPage = await document.getPage(page);
      if (cancelled || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const original = pdfPage.getViewport({ scale: 1 });
      const size = pdfRenderSize(width, original.width, original.height, zoom, window.devicePixelRatio || 1);
      const viewport = pdfPage.getViewport({ scale: size.scale });
      const ratio = size.ratio;
      canvas.width = size.pixelsWide;
      canvas.height = size.pixelsHigh;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;
      render = pdfPage.render({ canvas, viewport, transform: ratio === 1 ? undefined : [ratio, 0, 0, ratio, 0, 0] });
      await render.promise;
      if (cancelled) return;
      setLoading(false); onRendered(page);
      try {
        const content = await pdfPage.getTextContent();
        if (!cancelled) setText(content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join(''));
      } catch { if (!cancelled) setText(''); }
    })().catch(error => { if (!cancelled && error?.name !== 'RenderingCancelledException') { setLoading(false); setError('Could not render this page. Try loading it again.'); } });
    return () => { cancelled = true; render?.cancel(); };
  }, [document, page, zoom, width, onRendered]);
  return <div ref={containerRef} className="pdf-stage" aria-busy={loading}>
    {loading && <div className="pdf-status" role="status">Loading page {page}…</div>}
    {error && <div className="pdf-error" role="alert"><p>{error}</p><button type="button" onClick={() => setRetry(value => value + 1)}>Retry page</button></div>}
    <div className="pdf-canvas-scroll" hidden={mode === 'text'} tabIndex={mode === 'page' ? 0 : -1} aria-label="Book page; scroll sideways when zoomed"><canvas ref={canvasRef} aria-label={`Book page ${page}`} style={{ visibility: loading || error ? 'hidden' : 'visible' }} /></div>
    {mode === 'text' && !loading && !error && <section className="pdf-readable-text" aria-label={`Text of book page ${page}`}>
      {text === null ? <p role="status">Preparing page text…</p> : text.trim() ? <><div className="reader-text-size"><span>Text size</span><button type="button" aria-label="Smaller page text" disabled={textSize <= 16} onClick={() => setTextSize(value => value - 2)}>A−</button><button type="button" aria-label="Larger page text" disabled={textSize >= 28} onClick={() => setTextSize(value => value + 2)}>A+</button></div><p className="text-mode-note">For diagrams and equations, use Page view.</p><div style={{ fontSize: `${textSize / 16}rem` }}>{text.split(/\n\s*\n/).filter(paragraph => paragraph.trim()).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></> : <p>This page has no selectable text. Choose <strong>Page</strong> and zoom in to read the original scan.</p>}
    </section>}
  </div>;
}
