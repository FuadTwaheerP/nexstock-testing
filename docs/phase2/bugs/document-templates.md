# Document Builder & Visual Template Designer - Phase 2 findings

Test date: **25 October 2026**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **6 passed, 3 application-failing cases, 1 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **2 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Modern/Classic style, primary color, font and watermark save/reload pass. Header/footer notes with QA bank/terms/legal text persist and update the preview.
- The actual newly generated QA invoice does not use the saved primary theme. Native invoice/quotation PDF export remains covered by the existing RET-002 blocker, not a new template PDF ticket.
- A4 builder dimensions, A4 invoice paper option and 80mm receipt controls were verified across Builder and Settings > Customization. Quotation output remains blocked by P2-QUOTE-001/RET-002; no missing-80mm preset bug is claimed.
- Company logo file selection/display is verified through Settings without Save Template; persisted logo and final output propagation remain unverified. No Phase 3 canvas dragging or custom-font uploads were tested.
- Every saved template change is restored to its captured baseline and unrelated template fields are checked. Only new QA service sales are used for actual invoice checks; synthetic fiscal records remain as evidence.

## Confirmed application bugs

## P2-DOC-001

### Title

Document Builder has no secondary brand color control

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F22-a.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Document Builder.
2. Inspect Theme Settings and all available controls.
3. Try to configure distinct primary and secondary brand colors.

### Expected Result

The document theme supports both primary and secondary brand colors.

### Actual Result

Only a Primary Color input is present. There is no Secondary Color field or selector.

Affected cases:

- F22-a primary and secondary brand theme controls
- Document theme content presets preview and actual invoice full flow

### Attachment

- [P2-DOC-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-brand-t-92fd6-ondary-brand-theme-controls-phase2-document-templates/attachments/P2-DOC-001-4c26b16b467389b9a5422160fc455171561da073.png)
- [P2-DOC-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-documen-fbac2-invoice-full-flow-full-flow-phase2-document-templates/attachments/P2-DOC-001-d3f31f93479d3bec1c062e31340c62793bfd6325.png)
- [F22-a primary and secondary brand theme controls - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-brand-t-92fd6-ondary-brand-theme-controls-phase2-document-templates/error-context.md)
- [Document theme content presets preview and actual invoice full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-documen-fbac2-invoice-full-flow-full-flow-phase2-document-templates/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-assessment.json)

### Comment

Add secondary color configuration, persistence, preview and document application. Primary-color persistence is independently tested; logo selection is available in Settings and is not assumed missing.

---

## P2-DOC-004

### Title

Saved document theme updates Builder preview but is ignored by actual invoices

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 25 October 2026. Requirements: F22-a, F22-d.

### Priority

High

### Step-by-step

1. In Document Builder, set primary color #17675e, Classic style and Roboto font; save.
2. Reload Builder and confirm the saved color/style/font remain.
3. Create a fresh Rs 100 QA service cash sale for QA Billing Automation Customer.
4. Open that exact sale's formal invoice through its actual /app/invoicing/<id> document.
5. Compare the invoice appearance to the saved theme and live preview.

### Expected Result

The generated invoice uses the saved document theme, including its selected primary branding color.

### Actual Result

Builder save/readback and live preview use #17675e, but the actual new invoice retains its fixed appearance. No document element uses the saved primary color. The deployed Invoice Details component reads the older invoice header/footer settings and does not consume the document-template query.

Affected cases:

- F22-a saved primary theme applies to a newly generated actual QA invoice
- Document theme content presets preview and actual invoice full flow

### Attachment

- [P2-DOC-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-brand-t-c0d13-generated-actual-QA-invoice-phase2-document-templates/attachments/P2-DOC-004-c67062ca46e9d4bab6ce90521406c104de688d0e.png)
- [P2-DOC-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-documen-fbac2-invoice-full-flow-full-flow-phase2-document-templates/attachments/P2-DOC-004-ae106fb02f55ca1a30b8cd023dd5be07d054e75f.png)
- [F22-a saved primary theme applies to a newly generated actual QA invoice - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-brand-t-c0d13-generated-actual-QA-invoice-phase2-document-templates/error-context.md)
- [Document theme content presets preview and actual invoice full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-documen-fbac2-invoice-full-flow-full-flow-phase2-document-templates/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-assessment.json)

### Comment

Connect actual document rendering to the persisted template configuration, then retest invoices, quotations and receipt output as applicable. Preserve saved content/branding and verify the exported document after RET-002 is repaired. All temporary template changes were restored.

---

## Corrected automation / maintenance - not application tickets

- Focused first run verified preview/style and restoration before broader template writes.
- Inspected Settings > Customization as an alternate format/logo surface before classifying capabilities. Receipt 80mm and A4 controls exist there, so a missing-preset hypothesis was not logged.
- The assessor distinguishes successful full-flow steps from step errors, supports known RET blockers, and separates authorized mocked staff UI results from real passes. This maintenance does not change actual assertion outcomes.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | document-templates-2 |
| F22-d live notes font and watermark preview before save | PASS | document-templates-2 |
| F22-c Modern and Classic style persistence | PASS | document-templates-2 |
| audit Phase 2 write scope and log out QA session | PASS | document-templates-2 |
| F22-a primary and secondary brand theme controls | FAIL - P2-DOC-001 | document-templates-2 |
| F22-a choose and display an unsaved company logo while preserving saved settings | PASS | document-templates-2 |
| F22-a saved primary theme applies to a newly generated actual QA invoice | FAIL - P2-DOC-004 | document-templates-2 |
| Document theme content presets preview and actual invoice full flow | FAIL - P2-DOC-001, P2-DOC-004 | document-templates-2 |
| F22-b bank terms legal reference header and footer persist | PASS | document-templates-2 |
| F22-c invoice quotation and 80mm thermal document presets | BLOCKED | document-templates-2 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs document-templates
node scripts/assess-phase2.mjs document-templates
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
