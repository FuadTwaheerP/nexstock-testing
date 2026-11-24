"""Render completed native PDF evidence; visual review is recorded separately."""
from pathlib import Path
import hashlib
import json
import subprocess
from pypdf import PdfReader

root = Path('blob-report/archive/retest-2026-11-24').resolve()
out = root / 'pdf-visual-review'
out.mkdir(exist_ok=True)
manifest_path = out / 'manifest.json'
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
poppler = Path.home() / '.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
rendered = []
for path in sorted(root.glob('document-design-*/artifacts/**/*.pdf'), key=lambda p: ('attachments' in p.parts, str(p))):
    body = path.read_bytes()
    if not body.startswith(b'%PDF-') or b'%%EOF' not in body[-1024:]:
        continue  # A browser download may still be in progress.
    digest = hashlib.sha256(body).hexdigest()
    if digest in manifest:
        sources = manifest[digest]['sources']
        if str(path) not in sources:
            sources.append(str(path))
        continue
    pages = len(PdfReader(path).pages)
    prefix = out / (digest[:12] + '-' + path.stem)
    subprocess.run([str(poppler), '-scale-to', '1500', '-png', str(path), str(prefix)], check=True, capture_output=True)
    images = sorted(out.glob(prefix.name + '-*.png'))
    assert len(images) == pages, (path, pages, images)
    manifest[digest] = {'sources': [str(path)], 'pages': pages, 'images': [str(p) for p in images], 'visuallyReviewed': False}
    rendered.append({'source': str(path), 'pages': pages, 'images': [str(p) for p in images]})
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'newlyRendered': rendered, 'uniquePDFs': len(manifest)}))
