"""Brief release-fix summary from the reviewed, fresh verification register."""
import json, html
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[1]
r = json.loads((ROOT/'blob-report/archive/release-verification-2026-11-04/verification-register.json').read_text())
assert r['complete']
assert not any(c['status']=='AUTOMATION REVIEW' for c in r['cases'])
out = ROOT/'output/pdf/NexStock-Release-Fix-Retest-Summary-2026-11-04.pdf'
out.parent.mkdir(parents=True, exist_ok=True)
styles = getSampleStyleSheet()
teal, ink, muted = map(colors.HexColor, ['#087F86','#172F3B','#607482'])
for name,size,leading,bold,after in [('Brand',11,14,True,7),('TitleQA',22,26,True,6),('Meta',8.7,12,False,9),('BodyQA',9,12.4,False,5),('SectionQA',11,14,True,5),('CellQA',8.2,11,False,0),('SmallQA',7.7,10,False,3)]:
    styles.add(ParagraphStyle(name=name, fontName='Helvetica-Bold' if bold else 'Helvetica', fontSize=size, leading=leading, textColor=teal if name in ('Brand','SectionQA') else muted if name in ('Meta','SmallQA') else ink, spaceAfter=after, spaceBefore=7 if name=='SectionQA' else 0, keepWithNext=name=='SectionQA'))
def p(text, style='BodyQA'):
    return Paragraph(html.escape(str(text)), styles[style])
def table(rows, widths):
    t=Table([[p(c,'CellQA') for c in row] for row in rows],colWidths=widths,repeatRows=1,hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#DBEEEE')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#F5F8FA')]),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#D4DFE4')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
    return t
story=[p('NexStock','Brand'),p('Release Fix Retest Summary','TitleQA'),p('4 November 2026 | Production | Nexstock QA Company | Chromium / Windows\nPhase 1 Round 2, separate Help fix and Phase 2 release claims','Meta')]
story += [p('Outcome','SectionQA'),p('Retesting is complete. Five confirmed application issues remain, including one additional debit-document finding. The user confirmed that Classic dark mode must preserve the chosen brand colour.')]
story += [table([['Scope','Reviewed outcome'],['Phase 1 Round 2 - 4 tickets','2 fixed (RET-001, RET-004); RET-002 partially fixed; RET-003 open.'],['Separate Help fix','HELP-001 fixed: public Terms/Privacy work on desktop and mobile without submitting login.'],['Phase 2 - 24 addressed tickets','21 fixed; 3 partially fixed. Another 10 tickets were explicitly not included by the developer.']],[137,350])]
story += [p('Confirmed issues and required follow-up','SectionQA'),table([
 ['Ticket','Remaining behaviour','Required follow-up'],
 ['RET-002\nPartial','Invoice PDFs omit the saved Company Settings header and banking/payment notes. Downloads and invoice identity work.','Connect the retained settings to PDF export and define configuration precedence.'],
 ['RET-003\nOpen','Variant content covers the Add to order footer at 1920 x 1080 and 1440 x 900.','Constrain the scrolling viewport and keep the footer readable and clickable.'],
 ['P2-QUOTE-002\nPartial','Customer-facing Notes persist/display on the quotation but are missing from its PDF. Terms, discounts and conversion work.','Include the saved quotation Notes in the customer PDF.'],
 ['P2-DOC-004\nPartial','Classic dark invoice, quotation and credit-note views replace the chosen brand colour. Modern and native Classic PDF colour work.','Preserve the configured brand colour in Classic dark views.'],
 ['REL-DN-001\nAdditional','The corrected debit print route opens, but its selected product appears as Item 4 with no SKU.','Preserve product name and SKU in debit-line persistence/view mapping.'],
 ],[77,239,171])]
story += [p('Explicit partial delivery','SectionQA'),p('P2-CN-004: partial/final refunds and balance checks pass. Credit allocation is explicitly not delivered; refund date/method history is not certified.')]
c=r['counts']['functional']
story += [p('Execution and scope','SectionQA'),p(f"Final scoped cases: {c.get('PASS',0)} passed, {c.get('APPLICATION FAIL',0)} application-failing cases (5 unique issues). No policy checks remain blocked. All 38 setup/cleanup checks and 76 local safety/classification checks pass. Automation errors were corrected and rerun; no final scoped case was intentionally skipped."),p('Captured QA stock, VAT, invoice branding, document template and notification preferences were restored. Synthetic records remain as evidence. This is web verification; mobile, legal approval, cross-company isolation and an authoritative deployed commit are not certified.','SmallQA'),p('Detailed tickets, full ticket matrix and evidence: docs/release-verification-2026-11-04/README.md','SmallQA')]
def footer(canvas, doc):
    canvas.saveState(); canvas.setFont('Helvetica',7.5); canvas.setFillColor(muted)
    canvas.drawString(54,27,'NexStock QA | Release fix verification | 4 November 2026 | page '+str(doc.page));canvas.restoreState()
SimpleDocTemplate(str(out),pagesize=A4,leftMargin=54,rightMargin=54,topMargin=35,bottomMargin=41,title='NexStock Release Fix Retest Summary - 4 November 2026',author='NexStock QA').build(story,onFirstPage=footer,onLaterPages=footer)
print(json.dumps({'pdf':str(out)}))
