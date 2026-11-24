# Document Builder — Phase 2

## Final MVP custom-font acceptance, 13 November 2026

The explicitly requested custom-font checks are in `release-custom-fonts.ui.spec.ts`. Run them serially through the module runner. They attempt two licensed TTF uploads through Settings > Advanced, create an owned stockless QA product with two font-capable text fields, save draft invoices/quotations, and inspect saved data, actual browser fonts and the fonts used by custom text in native PDFs. The private fixture ledger is `test-results/final-mvp-fonts.json`; reusable font fixtures and their license are in `tests/fixtures/fonts/`. Owned fonts and stockless items may be retained for developer reproduction of the saved QA evidence. No other Phase 3 feature is included.

If the UI upload is broken, `MVP_FONT_DIAGNOSTIC_SEED=1` permits standard-multipart fixture creation at the exact UI-observed font endpoint using the same verified QA session. Every such setup is labelled separately in the evidence; it never turns a failed Settings upload into a pass. If a persisted font is unavailable in an editor, the test records that selector failure and may save Default custom text to check text propagation. It does not inject browser font state, force a font choice or claim to have verified selected-font rendering without a selectable font.

For post-fix acceptance, preserve/rename only `test-results/final-mvp-fonts.json` before starting the complete three-case spec, so it creates a fresh owned product and fixture ledger. Do not remove authentication or recovery files. Product 163 is historical evidence of lost definitions; a fix for future saves is not expected to reconstruct definitions that were never returned. Existing remote QA fonts/products remain available for comparison. The current reviewed results are in `docs/final-mvp-2026-11-13/`.

The older module notes below describe the original scope and limitations at that time; later release reports supersede their historical bug status.

```powershell
node scripts/run-phase2.mjs document-templates
node scripts/assess-phase2.mjs document-templates
```

Append a spec filename or `--grep @full-flow`; use `--headed` for a maximized visible browser. Independent checks cover theme controls/invoice propagation, local logo display, content persistence, styles/formats and live preview.

Saved template fields are captured/restored through the real UI, with recovery in cleanup. Existing unrelated template fields remain checked. No full-company settings save, hardware print, Phase 3 canvas editing or font upload is performed. Logo selection is verified locally without saving its customization. A4/80mm options exist across Builder and Settings; quotation output is genuinely blocked by its existing route/export bugs.

The actual-invoice scenario creates only a QA service sale, without stock or external payment effects. Current findings are secondary-color absence and saved theme not applied to actual invoices. See the separate detailed Markdown.
