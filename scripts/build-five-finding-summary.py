"""Build the concise retest PDF in the established NexStock report style."""
import html
import json
import sys
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
DATE = sys.argv[1] if len(sys.argv) > 1 else '2026-11-12'
record = json.loads((ROOT / f'blob-report/archive/release-verification-{DATE}/verification-register.json').read_text(encoding='utf-8'))
assert record['complete'], 'Only reviewed, completed results may be reported'
assert not record['counts'].get('AUTOMATION REVIEW', 0)
out = ROOT / f'output/pdf/NexStock-Five-Finding-Fix-Retest-{DATE}.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
teal, ink, muted = map(colors.HexColor, ['#087F86', '#172F3B', '#607482'])
styles = getSampleStyleSheet()
for name, size, leading, bold, after in [
    ('BrandQA', 11, 14, True, 7), ('TitleQA', 22, 26, True, 6),
    ('MetaQA', 8.7, 12, False, 9), ('BodyQA', 9, 12.4, False, 5),
    ('SectionQA', 11, 14, True, 5), ('CellQA', 8.2, 11, False, 0),
    ('SmallQA', 7.7, 10.2, False, 4),
]:
    styles.add(ParagraphStyle(name=name, fontName='Helvetica-Bold' if bold else 'Helvetica',
        fontSize=size, leading=leading, textColor=teal if name in ('BrandQA', 'SectionQA') else muted if name in ('MetaQA', 'SmallQA') else ink,
        spaceAfter=after, spaceBefore=7 if name == 'SectionQA' else 0, keepWithNext=name == 'SectionQA'))

def paragraph(text, style='BodyQA'):
    return Paragraph(html.escape(str(text)).replace('\n', '<br/>'), styles[style])

def table(rows, widths):
    result = Table([[paragraph(cell, 'CellQA') for cell in row] for row in rows], colWidths=widths, repeatRows=1, hAlign='LEFT')
    result.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#DBEEEE')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F5F8FA')]),
        ('GRID', (0, 0), (-1, -1), .35, colors.HexColor('#D4DFE4')),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 7),
        ('RIGHTPADDING', (0, 0), (-1, -1), 7), ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return result

story = [paragraph('NexStock', 'BrandQA'), paragraph('Five-Finding Fix Retest', 'TitleQA'),
    paragraph(record['displayDate'] + ' | Production | Nexstock QA Company | Chromium / Windows\nPhase 1 and Phase 2 | https://nexstock.stylotech.mu/app', 'MetaQA'),
    paragraph('Outcome', 'SectionQA'), paragraph(record['outcome']),
    table([['Ticket / phase', 'Result', 'Verified result']] + [[f"{t['id']}\nPhase {t['phase']}", t['status'], t['summary']] for t in record['tickets']], [88, 61, 338]),
    paragraph('Remaining bugs and follow-up', 'SectionQA'), paragraph(record['followup']),
    paragraph('Regression checks', 'SectionQA'), paragraph(record['regressionSummary']),
    paragraph('Execution and cleanup', 'SectionQA'), paragraph(record['executionSummary']),
    paragraph(record['cleanupSummary'], 'SmallQA'),
    paragraph('Deployment and limits', 'SectionQA'), paragraph(record['scopeSummary'], 'SmallQA'),
    paragraph(f"Detailed Markdown: docs/release-verification-{DATE}/remaining-bugs.md\nCase register and evidence: blob-report/archive/release-verification-{DATE}/verification-register.json", 'SmallQA'),
]

def footer(canvas, document):
    canvas.saveState()
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(muted)
    canvas.drawString(54, 27, 'NexStock QA | Five-finding fix retest | ' + record['displayDate'] + ' | page ' + str(document.page))
    canvas.restoreState()

SimpleDocTemplate(str(out), pagesize=A4, leftMargin=54, rightMargin=54, topMargin=35, bottomMargin=41,
    title='NexStock Five-Finding Fix Retest - ' + record['displayDate'], author='NexStock QA').build(story, onFirstPage=footer, onLaterPages=footer)
print(json.dumps({'pdf': str(out)}))
