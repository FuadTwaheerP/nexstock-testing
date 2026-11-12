# Document Builder — Phase 2

```powershell
node scripts/run-phase2.mjs document-templates
node scripts/assess-phase2.mjs document-templates
```

Append a spec filename or `--grep @full-flow`; use `--headed` for a maximized visible browser. Independent checks cover theme controls/invoice propagation, local logo display, content persistence, styles/formats and live preview.

Saved template fields are captured/restored through the real UI, with recovery in cleanup. Existing unrelated template fields remain checked. No full-company settings save, hardware print, Phase 3 canvas editing or font upload is performed. Logo selection is verified locally without saving its customization. A4/80mm options exist across Builder and Settings; quotation output is genuinely blocked by its existing route/export bugs.

The actual-invoice scenario creates only a QA service sale, without stock or external payment effects. Current findings are secondary-color absence and saved theme not applied to actual invoices. See the separate detailed Markdown.
