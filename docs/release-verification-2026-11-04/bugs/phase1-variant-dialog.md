# RET-003

## Title

POS product-customisation content overlaps the footer and blocks Add to order after the release fix.

## Environment

Production: https://nexstock.stylotech.mu/app. Company: Nexstock QA Company. Windows / Chromium. Reproduced on 4 November 2026 at 1920 × 1080 and 1440 × 900. Frontend: `index-D4pNS7qJ.js`.

## Priority

High — the affected product cannot be added through the normal checkout interaction.

## Step-by-step

1. Sign in and select Nexstock QA Company.
2. Open Point of Sale in a 1920 × 1080 browser viewport.
3. Open the in-stock basic-variant product `QA-FLOW-mv89ihb7-8dc11e` (QA flow mv89ihb7-8dc11e Final).
4. Leave Standard (No Variant) selected and quantity at one. The product shows 10 units in stock.
5. Try to click the enabled Add to order button normally.
6. Scroll the dialog and try again.
7. Repeat at 1440 × 900.

## Expected Result

The body scrolls within its own area. The price summary and action footer remain readable and clickable. One normal Add to order click closes the dialog and adds one cart item.

## Actual Result

The scrolling content extends over the price summary and footer. Another element from the scroll area receives the pointer at the Add to order button's centre. Normal clicks fail at both viewport sizes, although the button is enabled and the selected standard product has stock. No sale was submitted.

## Attachment

- [1920 × 1080 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/RET-003-variant-footer-1920-before-click.png)
- [1440 × 900 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/RET-003-variant-footer-1440-before-click.png)
- [Pointer hit tests and execution annotations](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/evidence/RET-003-hit-tests.json)
- [Fresh Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/phase1/hardware-1/playwright-report/index.html)

## Comment

The release's RET-003 fix has not resolved the original reproduction. Constrain and clip the actual scroll viewport, keep the summary/actions outside it, and verify normal pointer access at both sizes. The tests do not force clicks or modify application styles. Configuration and catalogue stock remained unchanged after the retest. The two failing cases are one underlying ticket.

---

