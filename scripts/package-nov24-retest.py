"""Package the reviewed retest documents and portable, credential-free evidence."""
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / 'docs/retest-2026-11-24'
EVIDENCE = ROOT / 'blob-report/archive/retest-2026-11-24'
OUT = ROOT / 'output/retest-2026-11-24/NexStock-Production-Fix-Retest-2026-11-24.zip'
report = json.loads((DOCS / 'report-data.json').read_text(encoding='utf-8'))
assert report['reviewComplete']
index = json.loads((EVIDENCE / 'execution-index.json').read_text(encoding='utf-8'))
entries = {}
mapping = {}
JWT = re.compile(r'eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}')
PRIVATE = re.compile(r'password|authorization|plaintextkey|secret|cookie|(?:access|refresh)[_-]?token|^token$', re.I)


def safe(value):
    if isinstance(value, dict):
        return {key: '[REDACTED]' if PRIVATE.search(key) else safe(item) for key, item in value.items()}
    if isinstance(value, list):
        return [safe(item) for item in value]
    if isinstance(value, str):
        value = JWT.sub('[REDACTED JWT]', value)
        return re.sub(r'(?i)([?&](?:token|secret|signature|key)=)[^&\s]+', r'\1[REDACTED]', value)
    return value


def json_bytes(value):
    return (json.dumps(safe(value), indent=2, ensure_ascii=False) + '\n').encode('utf-8')


def add_evidence(absolute):
    path = Path(absolute)
    key = path.as_posix()
    if key in mapping:
        return mapping[key]
    assert path.is_file(), path
    if path.name == 'results.json':
        stage = path.parent.resolve()
        cases = [case for case in index['cases'] if Path(case['stage']).resolve() == stage]
        assert cases, stage
        target = f'evidence/{stage.name}/execution-summary.json'
        summarized = []
        for case in cases:
            summarized.append({
                'module': case['module'], 'file': case['file'], 'title': case['title'],
                'rawStatus': case['rawStatus'], 'classification': case['classification'],
                'annotations': case['annotations'], 'errors': case['errors'],
                'diagnostics': [{'name': attachment['name'], 'data': attachment['json']}
                                for attachment in case['attachments'] if 'json' in attachment]
            })
        entries[target] = json_bytes(summarized)
    elif path.suffix.lower() in ('.png', '.pdf'):
        digest = hashlib.sha256(path.read_bytes()).hexdigest()[:12]
        target = f'evidence/attachments/{digest}-{path.name}'
        entries[target] = path.read_bytes()
    elif path.suffix.lower() == '.json':
        target = f'evidence/attachments/{hashlib.sha256(key.encode()).hexdigest()[:12]}-{path.name}'
        entries[target] = json_bytes(json.loads(path.read_text(encoding='utf-8')))
    else:
        raise AssertionError(f'Unexpected evidence file type: {path}')
    mapping[key] = target
    return target


for filename in ['REMAINING-BUGS.md', 'RETEST-STATUS.md', 'SUMMARY.md', 'OBSERVATIONS.md']:
    text = (DOCS / filename).read_text(encoding='utf-8')
    for absolute in set(re.findall(r'\]\((C:/[^)]+)\)', text)):
        target = add_evidence(absolute)
        text = text.replace(f']({absolute})', f']({target})')
    entries[filename] = text.encode('utf-8')

entries['report-data.json'] = json_bytes(report)
for filename in ['Vera.ttf', 'VeraIt.ttf', 'bitstream-vera-license.txt', 'README.md']:
    path = ROOT / 'tests/fixtures/fonts' / filename
    if path.exists():
        entries[f'fixtures/fonts/{filename}'] = path.read_bytes()

entries['README.md'] = (
    '# NexStock production fix retest\n\n'
    f"Retested {report['campaignDate']} in Nexstock QA Company. Start with SUMMARY.md. "
    'RETEST-STATUS.md accounts for every original ticket; REMAINING-BUGS.md contains '
    'only confirmed open application findings. OBSERVATIONS.md keeps unconfirmed requirements and platform capabilities separate.\n\n'
    'Absolute QA-machine links have been replaced with portable evidence links. '
    'Execution summaries preserve reviewed statuses and named diagnostic observations; '
    'credentials and token fields are redacted. Raw browser auth state, environment '
    'files, native export dumps and unreviewed execution reports are excluded.\n'
).encode('utf-8')
for name, body in entries.items():
    if name.endswith(('.json', '.md')):
        assert not JWT.search(body.decode('utf-8')), f'JWT in {name}'

entries['manifest.json'] = json_bytes({name: {'bytes': len(body), 'sha256': hashlib.sha256(body).hexdigest()}
                                       for name, body in sorted(entries.items())})
OUT.parent.mkdir(parents=True, exist_ok=True)
temporary = OUT.with_suffix('.tmp.zip')
with zipfile.ZipFile(temporary, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for name, body in sorted(entries.items()):
        archive.writestr(name, body)
with zipfile.ZipFile(temporary) as archive:
    assert archive.testzip() is None
    manifest = json.loads(archive.read('manifest.json'))
    for name, expected in manifest.items():
        assert hashlib.sha256(archive.read(name)).hexdigest() == expected['sha256']
temporary.replace(OUT)
print(json.dumps({'path': str(OUT), 'files': len(entries), 'bytes': OUT.stat().st_size,
                  'portableEvidenceLinks': len(mapping)}))
