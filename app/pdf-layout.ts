// Keep a single rendered page within a modest memory budget on phones.
export function pdfRenderSize(availableWidth: number, pageWidth: number, pageHeight: number, zoom: number, pixelRatio: number) {
  const scale = Math.min(availableWidth, 960) / pageWidth * zoom;
  const width = pageWidth * scale;
  const height = pageHeight * scale;
  const ratio = Math.min(Math.max(pixelRatio, 1), 2, Math.sqrt(4_000_000 / (width * height)), 4096 / Math.max(width, height));
  return { scale, width, height, ratio, pixelsWide: Math.max(1, Math.floor(width * ratio)), pixelsHigh: Math.max(1, Math.floor(height * ratio)) };
}
