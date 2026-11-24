"""Inspect the fonts used by marker text, rather than page-level font presence."""
import sys, json, hashlib, io
import pdfplumber
from pypdf import PdfReader
from reportlab.pdfbase.ttfonts import TTFontFile

path, *markers = sys.argv[1:]
result = {"sha256": hashlib.sha256(open(path, "rb").read()).hexdigest(), "pages": [], "markers": {}, "resources": []}
with pdfplumber.open(path) as pdf:
    for index, page in enumerate(pdf.pages):
        # Preserve PDF content-stream flow. Sorting every column by page Y
        # interleaves Quantity/Price cells into a wrapped item description.
        text = page.extract_text(use_text_flow=True) or ""
        result["pages"].append({"page": index + 1, "text": text})
        # Markers are deliberately unique, unbroken ASCII words. Group the actual
        # characters on their rendered line to retain each character's font name.
        for marker in markers:
            for word in page.extract_words(extra_attrs=["fontname"]):
                if marker in word["text"]:
                    result["markers"].setdefault(marker, []).append({"page": index + 1, **word})
reader = PdfReader(path)
for index, page in enumerate(reader.pages):
    resources = page.get("/Resources", {}).get_object()
    for key, reference in resources.get("/Font", {}).get_object().items():
        font = reference.get_object()
        children = font.get("/DescendantFonts", [])
        leaf = children[0].get_object() if children else font
        descriptor = leaf.get("/FontDescriptor")
        descriptor = descriptor.get_object() if descriptor else {}
        embedded = []
        for field in ["/FontFile", "/FontFile2", "/FontFile3"]:
            if field in descriptor:
                data = descriptor[field].get_object().get_data()
                face = {"kind": field, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()}
                if field == "/FontFile2":
                    try:
                        font_data = TTFontFile(io.BytesIO(data))
                        names = [getattr(font_data, key, "") for key in ("name", "familyName", "styleName", "fullName")]
                        face["names"] = sorted({name.decode("utf-8", errors="replace") if isinstance(name, bytes) else str(name) for name in names if name})
                    except Exception as error:
                        face["nameReadError"] = type(error).__name__
                embedded.append(face)
        result["resources"].append({"page": index + 1, "key": str(key), "baseFont": str(font.get("/BaseFont")), "embedded": embedded})
# Node callers decode UTF-8. Escaping Unicode also makes this transport safe
# when Windows redirects Python stdout using a legacy console code page.
print(json.dumps(result, ensure_ascii=True))
