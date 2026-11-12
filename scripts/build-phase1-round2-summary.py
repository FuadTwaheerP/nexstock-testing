"""Brief PDF from reviewed, fresh Phase 1 Round 2 evidence only."""
import json, html
from pathlib import Path
from datetime import datetime
from zoneinfo import ZoneInfo
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.pagesizes import A4

ROOT=Path(__file__).resolve().parents[1]
RUNS=ROOT/'blob-report/archive/phase1-round2-2026-10-26'
r=json.loads((RUNS/'verification-register.json').read_text(encoding='utf-8'))
assert len(r['primary'])==7
assert not any(c['status']=='AUTOMATION REVIEW' for c in r['cases'])
assert not r['unexpectedHelpWrites']
OUT=ROOT/'output/pdf/NexStock-Phase1-Round2-Retest-Summary-2026-10-26.pdf'
OUT.parent.mkdir(parents=True,exist_ok=True)
teal=colors.HexColor('#087F86'); muted=colors.HexColor('#607482')
styles=getSampleStyleSheet()
for name,size,leading,color,after in [('BrandQA',11,14,teal,10),('TitleQA',23,27,colors.HexColor('#102333'),7),('SubQA',9,12,muted,12),('BodyQA',9.2,13,colors.HexColor('#172F3B'),6),('SectionQA',11.3,15,teal,6),('CellQA',8.3,11,colors.HexColor('#172F3B'),0),('SmallQA',7.7,10,muted,4)]:
 styles.add(ParagraphStyle(name=name,fontName='Helvetica-Bold' if name in ('BrandQA','TitleQA','SectionQA') else 'Helvetica',fontSize=size,leading=leading,textColor=color,spaceAfter=after,spaceBefore=8 if name=='SectionQA' else 0,keepWithNext=name=='SectionQA'))
def p(text,style='BodyQA'):
 return Paragraph(html.escape(str(text)),styles[style])
def table(rows,widths):
 t=Table([[p(c,'CellQA') for c in row] for row in rows],colWidths=widths,repeatRows=1,hAlign='LEFT')
 t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#DBEEEE')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#F5F8FA')]),('GRID',(0,0),(-1,-1),.35,colors.HexColor('#D4DFE4')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
 return t
dates=sorted({datetime.fromisoformat(a[k].replace('Z','+00:00')).astimezone(ZoneInfo('Indian/Mauritius')).strftime('%d %B %Y') for a in r['attempts'] for k in ('started','finished')})
date_label=' / '.join(dates)
states={s:sum(t['status']==s for t in r['tickets']) for s in ['FIXED','PARTIAL','OPEN','UNVERIFIED']}
story=[p('NexStock','BrandQA'),p('Phase 1 - Round 2 Retest','TitleQA'),p(date_label+' | Production | Nexstock QA Company\nhttps://nexstock.stylotech.mu/app | Chromium / Windows','SubQA')]
story += [p('Outcome','SectionQA'),p(f"Fix verification is incomplete: {states['FIXED']} of the 4 original tickets are fixed, {states['PARTIAL']} is partially fixed and {states['OPEN']} remains open. The seven previously failing cases now have {r['primaryCounts'].get('PASS',0)} passes and {r['primaryCounts'].get('APPLICATION FAIL',0)} application failures.")]
details={
 'RET-001':'Existing customer selection and the full POS checkout now pass, including receipt printing and a fresh empty order.',
 'RET-002':'PDF export no longer returns 404. Saved invoice identity and Rs 200 / Rs 230 totals pass. Saved header, banking instructions and payment notes are missing from exported PDFs.',
 'RET-003':'Dialog content overlaps the action footer and blocks a normal Add to order click at 1920 x 1080 and 1440 x 900.',
 'RET-004':'The active QA supplier is selectable; the deactivated vendor is excluded. Cleanup retained both new QA vendors inactive.',
}
story += [table([['Ticket','Result','Verified result']]+[[t['id'],t['status'],details[t['id']]] for t in r['tickets']],[61,65,361])]
story += [p('Required follow-up','SectionQA'),p('Correct the variant dialog height, scrolling and footer stacking so the action receives pointer events. Ensure invoice export includes the saved invoice header and banking/payment instructions, with consistent configuration precedence. Redeploy and rerun the affected checks.')]
help_cases=[c for c in r['additional'] if c['module']=='help']
if help_cases:
 story.append(p('Separate Phase 1 Help check','SectionQA'))
 if any(c.get('bug')=='HELP-001' for c in help_cases):
  story.append(p('HELP-001 still reproduces: public legal controls submit or validate the login form. This is the separately recorded Round 1 Help omission, not an extra Round 2 release ticket. Use navigation links or explicit non-submit buttons; approved legal wording remains outside this verification.'))
 elif r['helpActivations'] and all(a['submitEvents']==0 and a['requiredFeedback']==0 for a in r['helpActivations']):
  pending=any(c['status']=='BLOCKED' for c in help_cases)
  story.append(p('HELP-001 is fixed in the executed checks: public Terms and Privacy open on desktop and mobile without submitting or validating login.'+(' Authenticated Help document access and visible version/commit checks remain blocked.' if pending else '')+' Legal wording/approval and a deployment-matched release reference are not certified.'))
 else: raise AssertionError('Help status needs explicit review')
story += [p('Execution and scope','SectionQA'),p('Automation fixes were rerun: updated dialog label casing, precise receipt Print/Close controls, child-window print tracking and canonical invoice-number validation. Final remaining failures are application findings; no scoped test was intentionally skipped.'),p('QA stock, VAT and temporary invoice header/footer settings were restored. Synthetic sales/invoices remain as evidence. No real payment charge, customer email or physical printing was performed. This targeted retest does not certify all Phase 1 or any Phase 2 requirements.'),p('A changed production frontend bundle was verified after deployment confirmation. No authoritative deployed commit was supplied. Detailed evidence: blob-report/archive/phase1-round2-2026-10-26/verification-register.json.','SmallQA')]
def footer(canvas,doc):
 canvas.saveState();canvas.setFont('Helvetica',7.7);canvas.setFillColor(muted);canvas.drawString(54,29,'NexStock QA | Phase 1 Round 2 | page '+str(doc.page));canvas.restoreState()
SimpleDocTemplate(str(OUT),pagesize=A4,leftMargin=54,rightMargin=54,topMargin=43,bottomMargin=45,title='NexStock Phase 1 Round 2 Retest Summary',author='NexStock QA').build(story,onFirstPage=footer,onLaterPages=footer)
print(json.dumps({'pdf':str(OUT),'primary':r['primaryCounts'],'tickets':states}))
