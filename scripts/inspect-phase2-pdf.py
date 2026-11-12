import json
import sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1])
print(json.dumps({
    "pages": len(reader.pages),
    "sizes": [[float(p.mediabox.width), float(p.mediabox.height)] for p in reader.pages],
    "text": "\n".join(p.extract_text() or "" for p in reader.pages),
}))
