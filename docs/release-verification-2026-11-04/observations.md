# P2-DOC-004 — policy resolved

The user explicitly confirmed: **Preserve the brand colour** in Classic dark mode. The earlier uncertainty is resolved.

A fresh production retest with `CLASSIC_DARK_BRANDING_POLICY=preserve` reproduced the neutral-colour override on Classic invoice, quotation and credit-note pages. Modern display, native Classic PDF colour and saved header/footer remain working. The document-template baseline was restored.

P2-DOC-004 is now a confirmed application bug and is partially fixed. See the [detailed ticket](C:/Users/amiirah/Documents/Projects/nexstock-testing/docs/release-verification-2026-11-04/bugs/phase2-document-templates.md) and the [confirmed-policy retest report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/phase2/document-templates-3/playwright-report/index.html).
