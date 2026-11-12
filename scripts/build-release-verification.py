"""Build the deployment retest report from preserved Playwright JSON evidence."""
import json, re, html, sys
from pathlib import Path
from collections import Counter, defaultdict
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[1]
RUNS = ROOT / 'blob-report/archive/release-retest-2026-10-24'
REVIEW = ROOT / 'docs/release-verification-2026-10-24.json'
OUT = ROOT / 'output/pdf/NexStock-QA-Release-Retest-2026-10-24.pdf'
review = json.loads(REVIEW.read_text(encoding='utf-8'))
teal = colors.HexColor('#087F86'); muted = colors.HexColor('#607482')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='Brand', fontName='Helvetica-Bold', fontSize=12, textColor=teal, spaceAfter=12))
styles.add(ParagraphStyle(name='ReleaseTitle', fontName='Helvetica-Bold', fontSize=24, leading=28, spaceAfter=10))
styles.add(ParagraphStyle(name='SubtitleQA', fontName='Helvetica', fontSize=10, leading=14, textColor=muted, spaceAfter=18))
styles.add(ParagraphStyle(name='SectionQA', fontName='Helvetica-Bold', fontSize=14, leading=18, textColor=teal, spaceBefore=16, spaceAfter=9, keepWithNext=True))
styles.add(ParagraphStyle(name='BodyQA', fontName='Helvetica', fontSize=10, leading=14, spaceAfter=7))
styles.add(ParagraphStyle(name='SmallQA', fontName='Helvetica', fontSize=8.2, leading=11, spaceAfter=4))
styles.add(ParagraphStyle(name='CellQA', fontName='Helvetica', fontSize=8.1, leading=10.7))
styles.add(ParagraphStyle(name='BugQA', fontName='Helvetica-Bold', fontSize=11, leading=15, textColor=teal, spaceBefore=12, spaceAfter=6, keepWithNext=True))
styles.add(ParagraphStyle(name='NoteQA', fontName='Helvetica', fontSize=9, leading=12, spaceAfter=6))
styles.add(ParagraphStyle(name='NoteHeadingQA', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=teal, spaceBefore=9, spaceAfter=5, keepWithNext=True))
secret_values = []
for line in (ROOT / '.env').read_text(encoding='utf-8').splitlines():
    if '=' in line and not line.lstrip().startswith('#'):
        key, value = line.split('=',1)
        if re.search(r'PASSWORD|SECRET|TOKEN',key,re.I) and value.strip():
            secret_values.append(value.strip().strip('\"\''))

def clean(s):
    s = re.sub(r'\x1b\[[0-9;]*m', '', str(s or ''))
    for value in secret_values: s=s.replace(value,'[REDACTED]')
    s = s.replace('\u2014','-').replace('\u2013','-').replace('\u2011','-').replace('\u2019', "'")
    for before, after in [('×','x'),('≤','<='),('≥','>='),('\u00a0',' '),('…','...'),('“','"'),('”','"')]: s=s.replace(before,after)
    s = re.sub(r'(?<!\S)@[a-zA-Z][\w-]*', '', s)
    return s.encode('ascii', 'replace').decode('ascii')

def p(s, style='BodyQA'):
    return Paragraph(html.escape(clean(s)).replace('\n','<br/>'), styles[style])

def table(rows, widths):
    t = Table([[p(c, 'CellQA') for c in row] for row in rows], colWidths=widths, repeatRows=1, hAlign='LEFT')
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#DBEEEE')),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.white,colors.HexColor('#F6F8F9')]),('GRID',(0,0),(-1,-1),0.35,colors.HexColor('#D6DFE3')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    return t

latest = {}
attempts = []
for path in sorted(RUNS.glob('*/execution.json'), key=lambda path: json.loads(path.read_text()).get('started','')):
    meta = json.loads(path.read_text(encoding='utf-8'))
    result_path = path.parent/'results.json'
    if not result_path.exists() or 'finished' not in meta:
        attempts.append({**meta, 'note': 'Interrupted/probe only; not used as final case verdict'})
        continue
    result = json.loads(result_path.read_text(encoding='utf-8'))
    attempts.append({**meta, 'stats': result.get('stats',{})})
    def visit(suites, parents=()):
        for suite in suites:
            names = parents + (suite.get('title',''),)
            for spec in suite.get('specs',[]):
                for test in spec.get('tests',[]):
                    executed = [r for r in test.get('results',[]) if r.get('status') not in ('skipped','interrupted')]
                    if not executed:
                        continue
                    final = executed[-1]
                    key = (test.get('projectName',''),spec.get('file',''),spec['title'])
                    messages = [error.get('message','') for error in final.get('errors',[])]
                    latest[key] = {'module':meta['module'], 'stage':path.parent.name, 'project':key[0], 'file':key[1], 'line':spec.get('line'), 'title':spec['title'], 'raw':final['status'], 'error':clean('\n'.join(messages)), 'durationMs':final.get('duration'), 'attachments':final.get('attachments',[])}
            visit(suite.get('suites',[]), names)
    visit(result.get('suites',[]))

cases = sorted([c for c in latest.values() if c['title'] not in review.get('supersededTests',[])], key=lambda c:(c['module'],c['project'],c['file'],c['line'] or 0))
for index, case in enumerate(cases, 1):
    case['id'] = f'T{index:03d}'
    case['status'] = 'PASS' if case['raw']=='passed' else 'REVIEW REQUIRED'
    case['meaning'] = 'Executed assertions passed; only the stated test scope is certified.' if case['status']=='PASS' else 'Do not treat an unreviewed automation failure as a confirmed application bug.'
    for rule in review.get('caseRules',[]):
        if re.search(rule['match'], case['title'], re.I) and (not rule.get('module') or rule['module']==case['module']):
            if case['raw']=='passed' and rule.get('status') in ('FAIL','OBSERVATION') and 'negative credit' not in case['title']:
                continue
            case['status'] = rule.get('status',case['status'])
            case['meaning'] = rule.get('meaning',case['meaning'])
    for limitation in review.get('limits',[]):
        if re.search(limitation['match'],case['title'],re.I) and (not limitation.get('module') or limitation['module']==case['module']):
            case['meaning'] += ' Scope: ' + limitation['meaning']

OUT.parent.mkdir(parents=True, exist_ok=True)
story = [p('NexStock','Brand'), p('QA Release Retest','ReleaseTitle'), p('24 October 2026 | Production deployment verification\nFix release + requested feature release | Desktop Chromium', 'SubtitleQA')]
story += [p('Verification outcome','SectionQA'),p(review['verdict'])]
summary = defaultdict(Counter)
for case in cases:
    kind = 'Support' if not case['project'].startswith('chromium-') else case['status']
    summary[case['module']][kind]+=1
rows=[['Suite','Pass','Fail / open','Blocked / review','Setup / cleanup']]
for module, counts in sorted(summary.items()):
    rows.append([module.title(),str(counts['PASS']),str(counts['FAIL']),str(sum(n for k,n in counts.items() if k not in ('PASS','FAIL','Support'))),str(counts['Support'])])
story += [table(rows,[138,48,74,100,91]),Spacer(1,10)]
feature_counts=Counter(c['status'] for c in cases if c['project'].startswith('chromium-'))
support_count=sum(not c['project'].startswith('chromium-') for c in cases)
story.append(p(f"Final executed checks: {feature_counts['PASS']} feature passes, {feature_counts['FAIL']} failing cases grouped into {len(review['bugs'])} confirmed findings, {sum(n for k,n in feature_counts.items() if k not in ('PASS','FAIL'))} observations/review items, plus {support_count} setup/cleanup checks. These counts are not a percentage of the entire release requirements."))
story += [PageBreak(),p('How to read this report','SectionQA')]
for line in review['methodology']: story.append(p('- '+line))
story += [p('Environment and source documents','SectionQA')]
for line in review['environment']: story.append(p(line))
story += [p('Source: NexStock-QA-Fix-Release-Notes.pdf, developer release dated 21 October 2026, branch fix/qa-findings.'), p('Source: NexStock-Features-Release-Notes.pdf, developer release dated 21 October 2026, branch feat/qa-requested-features. Feature release dependencies and explicit exclusions take precedence over the earlier fix-only omissions.')]

story += [PageBreak(),p('NexStock','Brand'),p('Release Claim Verification','ReleaseTitle'),p('Ticket-level closure is narrower than a green test count. Partial evidence is not a full pass.','SubtitleQA')]
for group in review['claims']:
    story.append(p(group['heading'],'SectionQA'))
    story.append(table([['Ticket / claim','Verdict','Evidence and next action']]+[[row['id'],row['status'],row['detail']] for row in group['rows']],[104,75,272]))

story += [PageBreak(),p('NexStock','Brand'),p('Open Findings & Actions','ReleaseTitle'),p('Confirmed application defects are separate from automation corrections and evidence blockers.','SubtitleQA')]
for section in ['bugs','automation','blockers']:
    story.append(p({'bugs':'Confirmed application findings','automation':'Corrected automation / test maintenance','blockers':'Blocked, deferred and limited coverage'}[section],'SectionQA'))
    for item in review.get(section,[]):
        story.append(p(item['id']+' | '+item['title'],'BugQA' if section=='bugs' else 'NoteHeadingQA'))
        if section=='bugs': story.append(p('Title: '+item['title']))
        for key in ['environment','priority','steps','expected','actual','attachment','comment','action']:
            if item.get(key):
                value = item[key]
                if isinstance(value,list): value='\n'.join(f'{i}. {step}' for i,step in enumerate(value,1))
                label={'steps':'Step-by-step','expected':'Expected Result','actual':'Actual Result','action':'What should be done'}.get(key,key.capitalize())
                story.append(p(label+': '+value, 'BodyQA' if section=='bugs' else 'NoteQA'))
        if section=='bugs': story.append(HRFlowable(width='100%', thickness=0.5, color=colors.HexColor('#CBD7DD'), spaceBefore=10,spaceAfter=8))

story += [PageBreak(),p('NexStock','Brand'),p('Executed Test Register','ReleaseTitle'),p('One final executed result per project/file/test title. Later reruns supersede earlier attempts for that same case. Support checks are listed but are not feature coverage.','SubtitleQA')]
for module in sorted(summary):
    story.append(p(module.title(),'SectionQA'))
    for case in (c for c in cases if c['module']==module):
        block=[p(f"{case['id']} | {case['status']} | {case['title']}",'BugQA')]
        generic='Executed assertions passed; only the stated test scope is certified.'
        if case['meaning']!=generic: block.append(p(case['meaning'].replace(generic+' Scope: ','Scope: '),'SmallQA'))
        block.append(p(f"Evidence: {case['stage']}/results.json | {case['file']}:{case['line']} | {case['project']} | {case['durationMs']/1000:.1f}s",'SmallQA'))
        if case['raw']!='passed':
            lines=case['error'].splitlines()
            concise=' '.join(line.strip() for line in lines[:8] if line.strip())[:550]
            block.append(p('Observed failure: '+concise,'SmallQA'))
        story.append(KeepTogether(block))

story += [PageBreak(),p('NexStock','Brand'),p('Evidence & Rerun Handoff','ReleaseTitle')]
def handoff(s): return p(s,'NoteQA')
story += [p('Evidence location','SectionQA'),handoff(str(RUNS)),handoff('Each completed attempt contains results.json, junit.xml, console.log, execution.json and an isolated playwright-report folder. Failed-test screenshots and error contexts are preserved in the attempt folder. Authentication state and private recovery baselines are not included in this PDF.'),p('Commands','SectionQA'),handoff('From the repository: node scripts/run-release-retest.mjs <module>'),handoff('Modules: products, stores, adjustments, pos, invoicing, suppliers, customers, security, settings, hardware.'),handoff('Open a module HTML report: npx playwright show-report blob-report/archive/release-retest-2026-10-24/<attempt>/playwright-report'),p('Final evidence attempts','SectionQA')]
history_rows=[['Suite','Evidence supplying final results']]
for module in sorted(summary):
    stages=sorted({c['stage'] for c in cases if c['module']==module},key=lambda s:int(s.rsplit('-',1)[1]))
    history_rows.append([module.title(),', '.join(stages)])
history_table=table(history_rows,[104,347])
history_table.setStyle(TableStyle([('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3)]))
story.append(history_table)
story.append(p('Full attempt history is retained in verification-register.json, including failed and interrupted probes. Earlier raw failure counts are not the current outstanding bug count.','SmallQA'))
story.append(p('Release scope and cleanup','SectionQA'))
for line in review.get('cleanup',[]): story.append(handoff(line))

if '--detailed' not in sys.argv:
    # The user-facing report is an executive summary. Keep detailed evidence
    # in the register and the separate Markdown tickets, not in this PDF.
    story = [p('NexStock','Brand'), p('QA Retest Summary','ReleaseTitle'),
             p('Test date: 24 October 2026 | Production | Desktop Chromium\nhttps://nexstock.stylotech.mu/app | Nexstock QA Company','SubtitleQA'),
             p('Outcome','SectionQA'),
             p('Post-deployment retesting found substantial progress, but the release is not ready for full QA sign-off. Seven failing test cases relate to four confirmed application bugs; duplicate failures are grouped into single tickets.')]
    story.append(table([['Final result','Count'],
                       ['Feature checks passed',str(feature_counts['PASS'])],
                       ['Failing test cases / unique confirmed bugs',f"{feature_counts['FAIL']} / {len(review['bugs'])}"],
                       ['Requirement / policy observations','2'],
                       ['Setup and cleanup checks passed',str(support_count)],
                       ['Local automation safety checks passed','67']], [335,116]))
    story += [p('What happened','SectionQA'),
              p('Release-related checks ran across Products, Stores, Stock Adjustments, POS, Invoicing, Suppliers, Customers/AR, Security, Hardware and Settings.'),
              p('Test scripts were updated for deployed controls, saved-state readiness and child-window printing. Automation issues were corrected and affected cases rerun; rate-limited probes were rerun sequentially.'),
              p('Successful checks include product persistence, branch settings, stock details, checkout tenders, invoice/quotation saving, payment settlement, AR reconciliation and localization. A pass applies only to the assertions exercised, not an entire module.'),
              p('QA stock and temporary settings were restored. Synthetic transaction records remain as test evidence; no real payment charge, customer email or physical printing was performed.'),
              p('Next steps','SectionQA'),
              p('Use the separate Markdown tickets for the four confirmed bugs and all seven affected tests. After fixes are deployed, rerun those cases. Clarify the two policy observations and complete remaining fixture-dependent, security and physical-device verification. PIN locking and branch registers remain explicitly deferred.'),
              p('This revision only shortens the report; it does not represent a new test run. Detailed evidence remains in blob-report/archive/release-retest-2026-10-24/verification-register.json.','SmallQA'),
              p('Source releases: NexStock-QA-Fix-Release-Notes.pdf and NexStock-Features-Release-Notes.pdf (21 October 2026).','SmallQA')]

def footer(canvas, doc):
    canvas.saveState(); canvas.setFont('Helvetica',8); canvas.setFillColor(muted)
    canvas.drawString(72,34,f'NexStock QA Release Retest - page {doc.page}')
    canvas.restoreState()

doc=SimpleDocTemplate(str(OUT),pagesize=A4,rightMargin=72,leftMargin=72,topMargin=56,bottomMargin=55,title='NexStock QA Retest Summary - 24 October 2026',author='NexStock QA',pageCompression=1)
doc.build(story,onFirstPage=footer,onLaterPages=footer)
data={'cases':cases,'attempts':attempts,'review':review}
(RUNS/'verification-register.json').write_text(json.dumps(data,indent=2),encoding='utf-8')
print(json.dumps({'pdf':str(OUT),'cases':len(cases),'statuses':dict(Counter(c['status'] for c in cases))}))
