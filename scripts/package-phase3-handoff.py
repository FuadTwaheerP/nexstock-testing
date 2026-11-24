"""Package only reviewed reports and selected non-secret QA evidence."""
import base64
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'docs/phase3/report-data.json').read_text(encoding='utf-8'))
assert data['reviewComplete'] and not data['unresolvedAutomation']
bugs = json.loads((ROOT / 'blob-report/archive/phase3-2026-11-17/findings.json').read_text(encoding='utf-8'))
pdf = ROOT / 'output/pdf/NexStock-Phase-3-QA-Summary-2026-11-17.pdf'
assert pdf.exists()
out = ROOT / 'output/phase3/NexStock-Phase-3-Developer-Handoff-2026-11-17.zip'
out.parent.mkdir(parents=True, exist_ok=True)
files = {}
bug_md = (ROOT / 'docs/phase3/PHASE3-BUGS.md').read_text(encoding='utf-8')
for bug in bugs:
    for index, attachment in enumerate(bug['attachments']):
        source = Path(attachment)
        assert source.exists(), source
        target = f"attachments/{bug['id']}{'-' + str(index + 1) if index else ''}.png"
        files[target] = source.read_bytes()
        bug_md = bug_md.replace(str(source).replace('\\', '/'), target)
files['PHASE3-BUGS.md'] = bug_md.encode('utf-8')
for name in ['SUMMARY.md', 'REQUIREMENT-STATUS.md', 'REVIEW-NOTES.md']:
    files[name] = (ROOT / 'docs/phase3' / name).read_bytes()
files[pdf.name] = pdf.read_bytes()

allowed = {
    'bundle-branch-boundary', 'bundle-independent-stock-oracle',
    'all-branch-archive-stock-before-recovery', 'standalone-credit-result',
    'valid-font-UI-upload', 'unfiltered-report-contract',
    'key-authentication-controls', 'read-only-key-write-control',
    'write-enabled-key-positive-control', 'key-revocation-control',
    'JSON-export-observation', 'webhook-event-catalogue',
    'invoice-date-aging-oracle', 'final-safe-state',
    'priority-and-exhaustion-oracle', 'zero-batch-quantity',
    'supplier-SKU-mapping',
}

def specs(suite):
    for spec in suite.get('specs', []):
        yield spec
    for child in suite.get('suites', []):
        yield from specs(child)

for case in data['cases']:
    result = json.loads((ROOT / case['stage'] / 'results.json').read_text(encoding='utf-8'))
    for spec in specs(result):
        for test in spec['tests']:
            key = '|'.join([spec['file'], spec['title'], test['projectName']])
            if key != case['key'] or not test.get('results'):
                continue
            for attachment in test['results'][-1].get('attachments', []):
                if attachment['name'] not in allowed or not attachment.get('body'):
                    continue
                payload = json.loads(base64.b64decode(attachment['body']))
                # Key material is never packaged, including its otherwise safe hash.
                if isinstance(payload, dict):
                    payload.pop('secretHash', None)
                path = f"evidence/{case['module']}/{attachment['name']}.json"
                files[path] = json.dumps(payload, indent=2).encode('utf-8')

files['README.txt'] = (
    'NexStock Phase 3 developer handoff - 17 November 2026\n'
    'Read SUMMARY.md and the PDF, then the single cumulative PHASE3-BUGS.md.\n'
    'Bug screenshot links are portable within this archive. Requirement dispositions include partial, blocked and skipped checks.\n'
    'This curated bundle excludes environment files, authentication storage, JWTs, passwords, recovery state and minted API keys.\n'
    'Raw Playwright runs stay in the QA repository archive; they are not included wholesale.\n'
).encode('utf-8')
manifest = {
    'campaign': '2026-11-17', 'confirmedBugs': len(bugs),
    'requirements': data['requirementsCount'], 'strictAcceptancePercent': data['strictAcceptancePercent'],
    'frontendSha256': data['deployment']['assets'][0]['sha256'], 'backendRevision': 'unverified',
    'files': {name: hashlib.sha256(payload).hexdigest() for name, payload in sorted(files.items())},
}
files['manifest.json'] = json.dumps(manifest, indent=2).encode('utf-8')
with zipfile.ZipFile(out, 'w', zipfile.ZIP_DEFLATED) as archive:
    for name, payload in sorted(files.items()):
        assert not re.search(r'(^|/)(\.env|(?:phase\d+-)?auth(?:-state)?\.json|storage-state\.json|.*(?:credentials|tokens)\.json)$', name, re.I), name
        archive.writestr(name, payload)
print(json.dumps({'zip': str(out), 'files': len(files), 'bytes': out.stat().st_size}))
