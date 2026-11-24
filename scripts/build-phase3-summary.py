"""Render the reviewed Phase 3 campaign in the established NexStock QA style."""
import html
import json
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'docs/phase3/report-data.json').read_text(encoding='utf-8'))
review = json.loads((ROOT / 'data/phase3-review.json').read_text(encoding='utf-8'))
assert data['reviewComplete'] and not data['unresolvedAutomation']
assert data['deploymentFinal'] and data['deploymentFinal']['assets'][0]['sha256'] == data['deployment']['assets'][0]['sha256']
out = ROOT / 'output/pdf/NexStock-Phase-3-QA-Summary-2026-11-17.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
teal, ink, muted = map(colors.HexColor, ['#087F86', '#172F3B', '#607482'])
styles = getSampleStyleSheet()
for name, size, leading, bold, after in [
    ('BrandQA', 11, 14, True, 7), ('TitleQA', 22, 26, True, 6),
    ('MetaQA', 8.7, 12, False, 9), ('BodyQA', 9, 12.4, False, 6),
    ('SectionQA', 11, 14, True, 5), ('CellQA', 8.1, 10.7, False, 0), ('SmallQA', 7.7, 10.2, False, 5),
]:
    styles.add(ParagraphStyle(name=name, fontName='Helvetica-Bold' if bold else 'Helvetica', fontSize=size, leading=leading,
        textColor=teal if name in ('BrandQA', 'SectionQA') else muted if name in ('MetaQA', 'SmallQA') else ink,
        spaceAfter=after, spaceBefore=7 if name == 'SectionQA' else 0, keepWithNext=name == 'SectionQA'))

def p(text, style='BodyQA'):
    return Paragraph(html.escape(str(text)).replace('\n', '<br/>'), styles[style])

def table(rows, widths):
    result = Table([[p(cell, 'CellQA') for cell in row] for row in rows], colWidths=widths, repeatRows=1, hAlign='LEFT')
    result.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#DBEEEE')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F8FA')]),
        ('GRID', (0, 0), (-1, -1), .35, colors.HexColor('#D4DFE4')), ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LEFTPADDING', (0, 0), (-1, -1), 7), ('RIGHTPADDING', (0, 0), (-1, -1), 7),
        ('TOPPADDING', (0, 0), (-1, -1), 5), ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]))
    return result

def page_title(title, subtitle):
    return [p('NexStock', 'BrandQA'), p(title, 'TitleQA'), p(subtitle, 'MetaQA')]

counts = data['requirementsCount']
status_rows = [['Disposition', 'Count', 'Acceptance meaning'],
    ['Fully passed', counts['PASS'], 'Verified functional acceptance; counts toward the strict percentage.'],
    ['Partial', counts['PARTIAL'], 'Useful positive coverage with explicit remaining acceptance limits.'],
    ['Failed', counts['FAIL'], 'One or more confirmed application/availability findings.'],
    ['Blocked', counts['BLOCKED'], 'Required account, destination or verification dependency unavailable.'],
    ['Skipped', counts['SKIPPED'], 'Physical execution skipped at the user\'s request.']]
story = page_title('Phase 3 QA Review', '17 November 2026 | Live production | Nexstock QA Company | Windows / Chromium')
story += [p('Acceptance decision', 'SectionQA'), p('Phase 3 cannot be treated as 100% complete.'),
    p(f"28/28 feature domains and 61/61 requirement entries have a reviewed disposition. Fully passed: {counts['PASS']}/61 ({data['strictAcceptancePercent']}%). This is an unweighted evidence count, not implementation effort or code completion."),
    table(status_rows, [91, 41, 355]),
    p('Execution and findings', 'SectionQA'),
    p(f"{data['bugs']} unique confirmed tickets are compiled in one developer Markdown. {len([c for c in data['cases'] if not c['support']])} functional cases produced {data['rawFunctional']['passed']} raw passes and {data['rawFunctional']['failed']} application-failing cases. Raw passes include partial/blocked cases and are not a completion percentage."),
    p('Setup, recovery and cleanup are counted separately. Automation errors were corrected and affected cases rerun; no current case remains classified as an unresolved automation error.'),
    p('Verified positive paths', 'SectionQA')]
story += [p('- ' + x, 'SmallQA') for x in review['positives']]

for page_number, group in enumerate([data['modules'][:14], data['modules'][14:]], start=1):
    story += [PageBreak()] + page_title('Feature review ' + str(page_number) + ' of 2', 'Submodule coverage and material limits; detailed requirement status is in the accompanying register.')
    rows = [['Feature', 'Reviewed behavior / remaining limits']]
    rows += [[str(m['number']) + '. ' + m['title'], m['summary']] for m in group]
    story += [table(rows, [151, 336])]

story += [PageBreak()] + page_title('Dependencies & evidence', 'Physical skips, external delivery limits, corrections and safe recovery')
story += [p('Blocked checks and user-requested skips', 'SectionQA')]
story += [p('- ' + x, 'SmallQA') for x in review['dependencies']]
story += [p('How the tests ran', 'SectionQA'), p('Features were exercised sequentially in specification order, followed by focused corrections and validation. The QA tenant was checked before writes. Unmodified fingerprinted public assets were cached locally; business reads/writes remained live. Only owned QA fixtures were changed. API fixture setup and diagnostic workarounds are labelled and never turn a failed native UI path into a pass.', 'SmallQA'),
    p('Corrections and observations', 'SectionQA'), p('Corrected response-field/pagination/hydration waits, offline paused-mutation handling, PDF parser path, empty-session API controls, asynchronous form loading, export telemetry noise and archive persistence checks. Withdrawn provisional findings are excluded. Cost provenance, JSON-format interpretation and deployment provenance remain observations, not additional confirmed bugs. Full detail: docs/phase3/REVIEW-NOTES.md.', 'SmallQA'),
    p('Fixtures and cleanup', 'SectionQA'), p(review['cleanup'], 'SmallQA'),
    p('Deployment and deliverables', 'SectionQA'), p('Initial and final public frontend hashes match: index-Bw0A9VIv.js\nSHA-256 ' + data['deployment']['assets'][0]['sha256'] + '\nThis does not identify the deployed backend revision or certify every backend/security policy.', 'SmallQA'),
    p('Developer tickets: docs/phase3/PHASE3-BUGS.md\nAcceptance register: docs/phase3/REQUIREMENT-STATUS.md\nEvidence: blob-report/archive/phase3-2026-11-17/assessment.json and its linked attempts.\nShare only curated evidence; exclude environment/auth state, tokens, passwords, recovery state and minted secrets.', 'SmallQA')]

def footer(canvas, document):
    canvas.saveState()
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(muted)
    canvas.drawString(54, 27, 'NexStock QA | Phase 3 | 17 November 2026 | page ' + str(document.page))
    canvas.restoreState()

SimpleDocTemplate(str(out), pagesize=A4, leftMargin=54, rightMargin=54, topMargin=35, bottomMargin=41,
    title='NexStock Phase 3 QA Review - 17 November 2026', author='NexStock QA').build(story, onFirstPage=footer, onLaterPages=footer)
print(json.dumps({'pdf': str(out)}))
