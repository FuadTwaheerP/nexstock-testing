import json
import re
import subprocess
from pathlib import Path
from pypdf import PdfReader
import pdfplumber

root = Path.cwd()
archive = root / 'blob-report/archive/release-verification-2026-11-12'
pdf = root / 'output/pdf/NexStock-Five-Finding-Fix-Retest-2026-11-12.pdf'
documents = [root / 'docs/release-verification-2026-11-12' / name for name in ('README.md', 'remaining-bugs.md')]
all_text = '\n'.join(path.read_text(encoding='utf-8') for path in documents)
outside = []
with pdfplumber.open(pdf) as report:
    assert len(report.pages) == 1
    for page in report.pages:
        all_text += '\n' + (page.extract_text() or '')
        outside += [char for char in page.chars if char.get('text', '').strip() and (char['x0'] < 50 or char['x1'] > page.width - 50 or char['top'] < 25 or char['bottom'] > page.height - 18)]
assert not outside, 'Report text extends beyond margins'
for ticket in ('RET-002', 'RET-003', 'P2-QUOTE-002', 'P2-DOC-004', 'REL-DN-001'):
    assert ticket in all_text
for line in (root / '.env').read_text(encoding='utf-8').splitlines():
    if '=' not in line or line.lstrip().startswith('#'):
        continue
    key, value = line.split('=', 1)
    value = value.strip().strip('"\'')
    if re.search(r'PASSWORD|TOKEN|SECRET', key, re.I) and value:
        assert value not in all_text, 'Credential redaction failed'
bugs = documents[1].read_text(encoding='utf-8')
assert re.findall(r'^### (.+)$', bugs, flags=re.M) == ['Title', 'Environment', 'Priority', 'Step-by-step', 'Expected Result', 'Actual Result', 'Attachment', 'Comment']
assert bugs.rstrip().endswith('---')
links = []
for path in documents:
    for target in re.findall(r'\]\(([^)]+)\)', path.read_text(encoding='utf-8')):
        if re.match(r'https?://', target):
            continue
        candidate = Path(target) if re.match(r'^[A-Za-z]:/', target) else (path.parent / target).resolve()
        assert candidate.exists(), 'Missing linked evidence: ' + target
        links.append(target)
pdf_rows = []
for path in archive.rglob('*.pdf'):
    reader = PdfReader(path, strict=True)
    text = '\n'.join(page.extract_text() or '' for page in reader.pages)
    pdf_rows.append({'path': path.relative_to(root).as_posix(), 'pages': len(reader.pages), 'characters': len(text)})
render = root / 'tmp/pdfs/five-finding-evidence'
render.mkdir(parents=True, exist_ok=True)
for filename in ('RET-002-invoice.pdf', 'P2-QUOTE-002.pdf', 'REL-DN-001-new.pdf', 'REL-DN-001-legacy.pdf'):
    subprocess.run(['pdftoppm', '-f', '1', '-singlefile', '-scale-to', '1400', '-png', str(archive / 'evidence' / filename), str(render / Path(filename).stem)], check=True, capture_output=True)
result = {'summaryPages': 1, 'outsideMargins': 0, 'credentialCheck': 'passed', 'bugFormat': 'passed', 'verifiedDocumentLinks': len(links), 'parsedEvidencePDFs': len(pdf_rows), 'pdfs': pdf_rows}
(archive / 'deliverable-validation.json').write_text(json.dumps(result, indent=2), encoding='utf-8')
print(json.dumps({key: value for key, value in result.items() if key != 'pdfs'}))
