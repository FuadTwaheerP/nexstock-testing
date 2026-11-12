import json
import subprocess
from pathlib import Path
from pypdf import PdfReader

root = Path.cwd()
rows = []
for folder in ('output', 'blob-report', 'test-results'):
    for path in (root / folder).rglob('*.pdf'):
        try:
            reader = PdfReader(path)
            text = '\n'.join(page.extract_text() or '' for page in reader.pages)
            rows.append({'path': path.relative_to(root).as_posix(), 'pages': len(reader.pages), 'textCharacters': len(text), 'bytes': path.stat().st_size})
        except Exception as error:
            rows.append({'path': path.relative_to(root).as_posix(), 'error': str(error)})
out = root / 'tmp' / 'project-review'
(out / 'pdf-index.json').write_text(json.dumps(rows, indent=2), encoding='utf-8')
print(json.dumps({'pdfFiles': len(rows), 'totalPages': sum(row.get('pages', 0) for row in rows), 'parseErrors': [row for row in rows if 'error' in row]}, indent=2))
targets = list((root / 'output' / 'pdf').glob('*.pdf'))
evidence = root / 'blob-report' / 'archive' / 'release-verification-2026-11-05' / 'evidence'
targets += [evidence / name for name in ('RET-002-invoice.pdf', 'P2-QUOTE-002.pdf', 'REL-DN-001.pdf')]
for path in targets:
    subprocess.run(['pdftoppm', '-f', '1', '-singlefile', '-scale-to', '1500', '-png', str(path), str(out / path.stem)], check=True, capture_output=True)
print('Rendered first pages of three historical summaries and three latest evidence documents.')
