"""Read-only checks of the saved deliverable; preview sheets are PDF-QA intermediates."""
import json, re, sys
from pathlib import Path
import pdfplumber
from PIL import Image, ImageDraw

root=Path(__file__).resolve().parents[1]
target=root/'output/pdf/NexStock-QA-Release-Retest-2026-10-24.pdf'
render=root/('tmp/pdfs/retest-final-v2' if '--detailed' in sys.argv else 'tmp/pdfs/retest-summary')
texts=[]; outside=[]
with pdfplumber.open(target) as doc:
    for number,page in enumerate(doc.pages,1):
        texts.append(page.extract_text() or '')
        bad=[c for c in page.chars if c.get('text','').strip() and (c['x0']<60 or c['x1']>page.width-60 or c['top']<35 or c['bottom']>page.height-20)]
        if bad: outside.append({'page':number,'characters':len(bad)})
text='\n'.join(texts)
assert 'PENDING' not in text, 'Unfinished report placeholder'
assert not outside, f'Out-of-margin characters: {outside}'
for line in (root/'.env').read_text(encoding='utf-8').splitlines():
    if '=' not in line or line.lstrip().startswith('#'): continue
    key,value=line.split('=',1)
    value=value.strip().strip('"\'')
    if re.search(r'PASSWORD|SECRET|TOKEN',key,re.I) and value:
        assert value not in text, 'Credential redaction failed'
for number,page_text in enumerate(texts,1):
    assert f'page {number}' in page_text, f'Missing footer page {number}'
render.mkdir(parents=True,exist_ok=True)
pages=sorted(path for path in render.glob('page-*.png') if int(path.stem.rsplit('-',1)[1])<=len(texts))
for start in range(0,len(pages),6):
    sheet=Image.new('RGB',(930,1341),'#dce2e5')
    draw=ImageDraw.Draw(sheet)
    for position,path in enumerate(pages[start:start+6]):
        picture=Image.open(path).convert('RGB'); picture.thumbnail((300,424))
        x=(position%3)*310+5; y=(position//3)*450+25
        # Three columns, two rows; page numbers appear outside the PDF pixels.
        sheet.paste(picture,(x,y)); draw.text((x,y-18),path.stem,fill='black')
    sheet.crop((0,0,930,905)).save(render/f'sheet-{start//6+1:02}.png')
print(json.dumps({'pdf':str(target),'pages':len(texts),'rendered':len(pages),'outsideMargins':outside,'credentialCheck':'passed'}))
