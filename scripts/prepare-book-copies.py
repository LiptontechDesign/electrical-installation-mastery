"""Prepare complete PDF reading copies with compact object indexes; requires pikepdf.

Usage: python scripts/prepare-book-copies.py designs.pdf wiring.pdf output_directory
   or: python scripts/prepare-book-copies.py --book book_id source.pdf page_count output_directory
Source files are never overwritten. Verify app/book-assets.json sizes before uploading.
"""
import sys
from pathlib import Path
import pikepdf

if len(sys.argv) == 6 and sys.argv[1] == '--book':
    inputs = [(sys.argv[2], sys.argv[3], int(sys.argv[4]))]
    destination = sys.argv[5]
elif len(sys.argv) == 4:
    inputs = zip(['installation-designs', 'modern-wiring'], sys.argv[1:3], [264, 352])
    destination = sys.argv[3]
else:
    raise SystemExit(__doc__)
target = Path(destination).resolve()
target.mkdir(parents=True, exist_ok=True)
for book_id, source, count in inputs:
    if not book_id or any(c not in 'abcdefghijklmnopqrstuvwxyz0123456789-' for c in book_id):
        raise ValueError('Invalid book ID')
    source = Path(source).resolve()
    output = target / f"{book_id}-reader.pdf"
    if source == output:
        raise ValueError("The reading copy must have a different path from the source.")
    with pikepdf.open(source) as pdf:
        if len(pdf.pages) != count:
            raise ValueError(f"Unexpected edition/page count for {book_id}")
        # Keeping page dictionaries in object streams avoids loading every scanned
        # image just to traverse the book's page tree. No images are recompressed.
        pdf.save(output, object_stream_mode=pikepdf.ObjectStreamMode.generate)
    with pikepdf.open(output) as copy:
        assert len(copy.pages) == count
        assert not copy.check_pdf_syntax()
    print(f"{book_id}: {count} pages; {output.stat().st_size} bytes")
