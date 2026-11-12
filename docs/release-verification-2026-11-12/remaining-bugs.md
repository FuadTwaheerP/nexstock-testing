# NexStock - Phase 1 and Phase 2 fix retest: remaining bugs

Retested on **12 November 2026** in production after the developer's five-finding fix notes. **Four tickets pass; one is partially fixed.** The original Classic neutral-branding override is corrected. The single residual contrast boundary below is grouped under existing **P2-DOC-004**; invoice, quotation and credit-note occurrences are not separate tickets.

RET-002, RET-003, P2-QUOTE-002 and REL-DN-001 pass. This list covers the requested five-ticket release scope, not the previously excluded project backlog. No unconfirmed requirement observation or automation error is presented as an application bug.

## P2-DOC-004

### Title

Classic dark brand text narrowly misses the developer's stated 3:1 contrast minimum on its actual rendered background.

### Environment

Production: https://nexstock.stylotech.mu/app. Nexstock QA Company. Windows / Chromium / Playwright 1.62.1. Dark mode, Classic layout, 1920 x 1080. Retested 12 November 2026. Frontend: index-Bw0A9VIv.js; SHA-256 bd0987b86cf20ca4531f81b3f859bb2d32d3d7d41da42386d09a9c377992584c.

### Priority

Low - a small contrast-threshold miss. Chosen branding now appears correctly, borders and native PDF colour work, and the documents remain usable.

### Step-by-step

1. Sign in and select Nexstock QA Company.
2. Enable dark mode and open Document Builder.
3. Select Classic and set Primary Color to `#17675e`; save and reload to confirm persistence.
4. Open a saved QA invoice, quotation or credit note in the actual document view.
5. Inspect the computed brand-text colour and its background, including ancestor background layers. The brand text is `rgb(35, 111, 102)` (`#236f66`); its actual opaque background is `rgb(19, 25, 27)` (`#13191b`).
6. Calculate the sRGB relative-luminance contrast for those rendered colours and compare it with the stated minimum of 3:1. Repeat for the other two document types.

### Expected Result

Borders retain the exact selected brand colour. If the original text colour is too dark, the lightened brand tint reaches **at least 3:1 against the actual rendered dark surface**, as specified by the developer. Readable brand colours remain unchanged.

### Actual Result

The original neutral-grey override is fixed, and borders correctly retain `#17675e`. Brand text uses the announced `#236f66` tint, but against the actual `#13191b` surface it measures **2.991035:1**, below 3:1. The same result occurs on invoice, quotation and credit-note company/title/total branding. The deployed client calculates its tint against a fixed `#0f172a` surface, on which that tint measures 3.006964:1; this differs from the rendered surface. A focused independent rerun reproduces the boundary. The `#15b8a6` positive control stays unchanged and measures 7.135925:1 on the actual surface.

### Attachment

- [Invoice screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/evidence/P2-DOC-004-invoicing.png)
- [Quotation screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/evidence/P2-DOC-004-quotations.png)
- [Credit-note screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/evidence/P2-DOC-004-credit-notes.png)
- [Computed colours, background layers and contrast measurements](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/evidence/P2-DOC-004-contrast.json)
- [Focused retest report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/phase2/document-templates-2/playwright-report/index.html)
- [Complete reviewed case register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/verification-register.json)

### Comment

**Partially fixed; retain the existing ticket for this minor boundary.** This is not the old missing-brand-colour behaviour: exact borders, visible brand tint, Modern display and native Classic PDF colour now pass. The three document occurrences share the same calculation and are one ticket. The 3:1 threshold comes from the supplied developer fix contract; this is not a claim of complete accessibility certification. Independent JavaScript and Python calculations agree. Use the actual document surface for the tint calculation and check the unrounded ratio before accepting a colour. The test changes no application styles and restores its captured template through the real UI; stock/settings cleanup passes. No new ticket ID is required.

---

