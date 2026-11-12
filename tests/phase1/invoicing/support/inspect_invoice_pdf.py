"""Read-only integrity/content check for an application's exported invoice.

Requires pypdf. Layout/physical print quality is a separate visual check.
"""
import json
import sys
from pypdf import PdfReader

reader = PdfReader(sys.argv[1], strict=True)
if reader.is_encrypted:
    raise ValueError("QA invoice PDF unexpectedly requires decryption")
colours = []
for page in reader.pages:
    for operands, operator in page.get_contents().operations:
        if operator in (b"rg", b"RG") and len(operands) == 3:
            colours.append([float(value) for value in operands])
print(json.dumps({"pages": len(reader.pages), "text": "\n".join(page.extract_text() or "" for page in reader.pages), "colours": colours}))
