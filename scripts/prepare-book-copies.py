"""Prepare complete PDF reading copies with compact object indexes; requires pikepdf.

Usage: python scripts/prepare-book-copies.py designs.pdf wiring.pdf output_directory
Source files are never overwritten. Verify app/book-assets.json sizes before uploading.
"""
import sys
from pathlib import Path
import pikepdf

if len(sys.argv) != 4:
    raise SystemExit(__doc__)
target = Path(sys.argv[3]).resolve()
target.mkdir(parents=True, exist_ok=True)
for book_id, source, count in zip(
    ["installation-designs", "modern-wiring"], sys.argv[1:3], [264, 352]
):
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
