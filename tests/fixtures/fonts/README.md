# Custom-font acceptance fixtures

`Vera.ttf` and `VeraIt.ttf` are unmodified Bitstream Vera Sans Regular and Oblique fonts distributed with the bundled ReportLab runtime. Their original license is preserved in `bitstream-vera-license.txt`.

The final MVP test uploads the original bytes with unique QA filenames, records the returned font IDs/families, compares downloaded bytes with SHA-256, and checks the actual fonts used by marker text in downloaded Invoice and Quotation PDFs. The PDF font names are `BitstreamVeraSans-Roman` and `BitstreamVeraSans-Oblique`.

Uploaded fonts referenced by retained QA financial documents remain available so that those documents can still render. Existing fonts are never deleted or replaced. These fixtures establish TTF behaviour; they do not certify every OTF font, glyph set, font license or file-size boundary.
