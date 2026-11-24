"""Render reviewed final MVP results in the established NexStock QA style."""
import html
import json
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'docs/final-mvp-2026-11-13/report-data.json').read_text(encoding='utf-8'))
register = json.loads((ROOT / 'blob-report/archive/final-mvp-2026-11-13/verification-register.json').read_text(encoding='utf-8'))
assert data['reviewComplete'] and not register['functional'].get('REVIEW') and not register['support'].get('REVIEW')
out = ROOT / 'output/pdf/NexStock-Final-MVP-and-Custom-Fonts-2026-11-13.pdf'
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
        ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    return result

story = [p('NexStock', 'BrandQA'), p('Final MVP & Custom Fonts', 'TitleQA'),
    p('13 November 2026 | Production | Nexstock QA Company | Chromium / Windows\nPhase 3 paused; only the specifically requested font workflow added.', 'MetaQA'),
    p('Outcome', 'SectionQA'), p(data['outcome']), p(data['execution']),
    p('Regression coverage', 'SectionQA'), table(data['regressionRows'], [116, 371]),
    p('Developer-fix checks', 'SectionQA'), table(data['fixRows'], [87, 65, 335]),
    p('Remaining confirmed issues', 'SectionQA'), p(data['remaining']),
    PageBreak(), p('NexStock', 'BrandQA'), p('Font acceptance & evidence', 'TitleQA'),
    p('Upload, persisted selection, browser glyphs and exported document fonts', 'MetaQA'),
    table(data['fontRows'], [115, 70, 302]),
    p('How fonts were checked', 'SectionQA'), p(data['fontMethod']),
    p('Fixtures and cleanup', 'SectionQA'), p(data['cleanup']),
    p('Automation corrections', 'SectionQA'), p(data['automation'], 'SmallQA'),
    p('Scope and acceptance limits', 'SectionQA'), p(data['limits'], 'SmallQA'),
    p('Deployment and evidence', 'SectionQA'), p(data['deployment'], 'SmallQA'),
    p('Summary and developer tickets: docs/final-mvp-2026-11-13/\nReviewed case register: blob-report/archive/final-mvp-2026-11-13/verification-register.json\nAll attempts retain their own reports, screenshots, downloads and safe journals.', 'SmallQA'),
]

def footer(canvas, document):
    canvas.saveState()
    canvas.setFont('Helvetica', 7.5)
    canvas.setFillColor(muted)
    canvas.drawString(54, 27, 'NexStock QA | Final MVP and custom fonts | 13 November 2026 | page ' + str(document.page))
    canvas.restoreState()

SimpleDocTemplate(str(out), pagesize=A4, leftMargin=54, rightMargin=54, topMargin=35, bottomMargin=41,
    title='NexStock Final MVP and Custom Fonts - 13 November 2026', author='NexStock QA').build(story, onFirstPage=footer, onLaterPages=footer)
print(json.dumps({'pdf': str(out)}))
