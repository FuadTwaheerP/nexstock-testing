# NexStock - Developer handoff: two partially fixed Phase 2 tickets

Prepared **13 November 2026** (Indian/Mauritius) from existing production evidence and the developer's release statements. **No new live test was run for this document.** Retain the existing ticket IDs; do not create duplicate tickets for repeated document types or already working refund behavior.

| Ticket | Remaining work | Latest relevant evidence | Priority |
| --- | --- | --- | --- |
| P2-DOC-004 | Make Classic dark brand text reach the stated 3:1 contrast minimum against its actual background. | Reproduced twice on 12 November; original color propagation now works. | Low |
| P2-CN-004 | Deliver the remaining invoice-credit allocation workflow and verify its persisted balance effects. | Original missing settlement controls observed 25 October; developer explicitly excluded allocation on 4 November. Refunds passed on 4 November. | High |

The 12 November five-ticket retest exercised debit documents and document branding, **not a fresh credit-allocation or refund retest**. P2-CN-004 remains a confirmed undelivered portion of the agreed release backlog; this document does not claim a newly reproduced allocation-processing failure.

The QA repository is `FuadTwaheerP/nexstock-testing`. Links to committed files below are pinned to commit `f0afdea8173a1165d7c28dd206289dd457535771`. Production frontend/backend implementation files are not bundled in this repository. Suggested implementation locations are based on observed behavior, deployed client symbols and request contracts; locate their actual source in the application repository.

Local evidence links point to the QA workstation. They will not open on the developer's machine unless the referenced files are supplied separately. The expected/actual results, measurements, proposed acceptance fixtures and closure criteria are included directly in this document so it can be read independently.

## P2-DOC-004

### Title

Classic dark brand text narrowly misses the stated 3:1 contrast minimum because its tint is calculated against a different background from the rendered document.

### Environment

- Production: https://nexstock.stylotech.mu/app.
- Company: **Nexstock QA Company**.
- Windows / Chromium / Playwright 1.62.1; 1920 x 1080; actual application dark mode; Classic document layout.
- Last reproduced: **12 November 2026**, including an independent focused rerun.
- Frontend: `index-Bw0A9VIv.js`; SHA-256 `bd0987b86cf20ca4531f81b3f859bb2d32d3d7d41da42386d09a9c377992584c`. The same frontend fingerprint remained active at the end of that retest. No authoritative deployed Git commit was supplied.
- Observed on QA invoice internal ID `238`, quotation ID `33`, and credit-note ID `15`. These identify the evidence records, not fixtures that should be edited or deleted.

### Priority

**Low.** The original neutral-grey override is fixed. Brand borders, visible brand tint, Modern display and native Classic PDF color work. The remaining issue is a small, measurable miss against the developer's stated text-contrast rule.

### Step-by-step

1. Sign in and select **Nexstock QA Company**.
2. Enable dark mode through the application and open **Document Builder**.
3. Select **Classic**, set Primary Color to `#17675e`, save, and reload to verify persistence.
4. Open an actual saved QA invoice, quotation or credit note. Inspect the document itself rather than only the Builder preview.
5. Inspect the computed color of the branded company heading, document title and branded total. Inspect the rendered background behind those elements, including ancestor backgrounds and any transparency.
6. Calculate the unrounded sRGB relative-luminance contrast between the rendered text and background. Repeat for the other two document types.
7. As a positive control, select `#15b8a6`, save, and repeat. This readable brand color should remain unchanged.

### Expected Result

- Brand borders retain the **exact selected primary color**.
- Dark brand text retains that color when it reaches **at least 3:1 against the actual rendered surface**. Otherwise, use an appropriately lightened brand tint that reaches the minimum.
- The comparison uses the unrounded ratio. A value below 3 must not pass because it rounds to `3.0` for display.
- Invoice, quotation and credit-note views follow the same rule. Saving or rendering must not replace the stored brand color with the derived display tint.
- Modern layout and native Classic PDF color retain their working behavior.

The 3:1 requirement comes from the developer's supplied fix description. It is the acceptance criterion for this branding behavior, not a certification of every document element or all accessibility requirements.

### Actual Result

The selected `#17675e` is saved, and brand borders now retain it correctly. Brand text becomes the developer's announced tint, `#236f66`. However, the actual rendered background differs from the background used by the tint calculation:

| Check | Text | Background | Calculated contrast | Result |
| --- | --- | --- | ---: | --- |
| Deployed helper's assumed surface | `#236f66` | `#0f172a` | 3.006964:1 | Meets 3:1 on that assumed surface. |
| Actual invoice, quotation and credit-note surface | `#236f66` | `#13191b` | **2.991035:1** | **Below 3:1.** |
| Readable-color positive control | `#15b8a6` | `#13191b` | 7.135925:1 | Passes without tinting. |

The failing computed colors are `rgb(35, 111, 102)` over `rgb(19, 25, 27)`. Nine observed brand-text elements across the three document types share the same result. A focused rerun reproduced it; independent JavaScript and Python calculations agree. All occurrences belong to this one ticket.

### Attachment

- [Computed text colors, ancestor background layers, borders and measurements](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/evidence/P2-DOC-004-contrast.json)
- [Classic dark invoice screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/evidence/P2-DOC-004-invoicing.png)
- [Classic dark quotation screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/evidence/P2-DOC-004-quotations.png)
- [Classic dark credit-note screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/evidence/P2-DOC-004-credit-notes.png)
- [Focused reproduction HTML report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-12/phase2/document-templates-2/playwright-report/index.html)
- [Committed 12 November findings](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/docs/release-verification-2026-11-12/remaining-bugs.md)
- [Rendered-color regression scenarios](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/tests/phase2/document-templates/release-contrast.ui.spec.ts)
- [Independent color/contrast arithmetic](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/helpers/document-colour.mjs)

### Comment

**Status: partially fixed. Remaining change: account for the actual dark document surface when deriving the text tint.**

**Implementation guidance**

- In the deployed client, inspect `DARK_SURFACE`, `readableOnDark()`, `contrastRatio()`, `documentThemeFrom()`, `documentColorVars()` and the shared document letterhead/total styles. The inspected helper uses `DARK_SURFACE = "#0f172a"`; the actual rendered background in this reproduction is `#13191b`.
- Make the tint calculation and rendered document background agree. Prefer a shared authoritative surface value, or derive the effective surface correctly if the component supports varying/translucent backgrounds. Do not hard-code the observed QA color as a universal solution without checking other supported surfaces.
- Keep `--doc-primary` as the saved brand color for exact borders and appropriate output. Use the derived `--doc-primary-dark` for dark text. Recalculate when the saved primary color, theme or relevant surface changes.
- Validate the final quantized RGB color after tinting. The emitted color must still reach the threshold; intermediate floating-point calculations alone are insufficient.
- As an arithmetic illustration, `#247067` over the observed `#13191b` surface gives approximately 3.034528:1. This demonstrates a passing nearby color; it is not a requirement to hard-code that tint or proof it is the minimum possible tint.

**Closure checks to execute after deployment**

1. Repeat the exact `#17675e` reproduction on invoice, quotation and credit note. Assert computed active borders equal the selected brand color and actual rendered text contrast is at least 3:1.
2. Confirm `#15b8a6` remains unchanged. Add boundary cases just below/above the threshold, very dark valid colors and the supported short/long hex input forms.
3. Verify Classic dark and light views, Modern layout, saved/reloaded template values, and the actual native Classic PDF. Do not infer PDF behavior from browser CSS alone.
4. Verify the derived tint does not overwrite the stored primary color and that restoring the original template succeeds.

Existing scoped rerun, from the QA repository root with the approved environment and a **new evidence directory**:

```powershell
$env:PHASE2_ARCHIVE_ROOT = 'blob-report/archive/<new-campaign>/phase2'
node scripts/run-phase2.mjs document-templates release-contrast.ui.spec.ts
node scripts/assess-phase2.mjs document-templates
```

The existing integration case in `brand-theme.ui.spec.ts` also checks actual invoice propagation, native PDF color, related document views and a Modern positive control. Passing that case alone does not close the remaining rendered-contrast boundary. Run serially with setup/cleanup enabled. The previous retest restored its captured template and did not alter application CSS to obtain a result.

---

## P2-CN-004

### Title

Deliver the remaining invoice-credit allocation workflow; cash-refund settlement is already implemented and verified.

### Environment

- Production: https://nexstock.stylotech.mu/app.
- Company: **Nexstock QA Company**; Windows / Chromium / Playwright 1.62.1.
- Requirement: **F13-d - Credit Allocation**. The specification describes applying credit balance against an invoice or issuing a cash refund. This handoff requests the remaining allocation portion so the existing partially delivered ticket can close.
- Original missing settlement controls: observed **25 October 2026**.
- Latest relevant release statement and refund verification: **4 November 2026**. The developer explicitly stated that allocation was not included; partial/final refund behavior passed.
- No fresh allocation/refund execution is claimed for 12 or 13 November. The 12 November credit-notes run selected debit-print/legacy-debit checks, not this allocation scenario.

### Priority

**High, retained from the original ticket.** Customers' available credits cannot be settled through the required invoice-allocation path. A functioning cash-refund alternative does not deliver that outstanding workflow.

### Step-by-step

1. Sign in and select **Nexstock QA Company**.
2. Prepare a fresh, synthetic **paid Rs 100 invoice** for **QA Billing Automation Customer**, using approved QA items and record-only payment handling.
3. Create a **Rs 100 invoice-linked credit note** for that same customer, with a valid reason such as Product return and unique QA details. Use the existing save action; record the returned credit and source-invoice IDs.
4. Reopen the saved credit and verify its available balance is **Rs 100**, with an open/usable status. Do not use a credit already fully refunded or allocated.
5. Inspect the credit detail and relevant invoice settlement actions for an **Apply credit / Allocate credit** workflow. Try to select an eligible unpaid invoice and enter a partial allocation.
6. Verify whether the allocation can be saved and the credit/invoice balances independently reread. The previously reported missing workflow stops before this processing step; no unexecuted allocation calculation is reported as a current failure.

The unpaid-invoice fixture and balance examples below describe the acceptance scenario to implement and execute after delivery. They are not a claim that such an allocation succeeded or failed on the current deployment.

### Expected Result

- A usable credit can be applied to an eligible outstanding invoice through an explicit, discoverable workflow.
- Partial/full application reduces both the credit's available balance and the target invoice's amount due by the applied amount, persists after reload, and retains credit-to-invoice linkage.
- Allocation is distinguishable from a cash refund in the UI and persisted settlement history. It must not fabricate a cash payment or alter the issued invoice's original total to simulate settlement.
- Available credit cannot be consumed twice through allocations, refunds or concurrent/repeated submissions.
- Already working partial/final cash refunds, over-refund rejection, reason persistence and credit document output remain working.

### Actual Result

**Allocation remains explicitly undelivered in the reviewed release scope.** The 25 October detail had no allocation/refund action. The later release added Record refund and verified settlement, while the developer explicitly excluded invoice allocation. The QA adapter retains a visible `BLOCKED` outcome for this undeployed portion rather than claiming allocation passed.

The following refund behavior **passed on 4 November** and must not be described to the developer as still broken:

| Evidence record / action | Verified result |
| --- | --- |
| Credit `CN-8FHUPD`, internal ID `10`, linked invoice ID `171` | Saved as open, total Rs 100, remaining balance Rs 100, correct QA customer. |
| Attempt to refund Rs 101 | Rejected before a financial POST; balance preserved. |
| Record-only cash refund Rs 40 | Response amount 40; remaining balance 60; status open; fresh readback checked. |
| Record-only cash refund Rs 60 | Response amount 60; remaining balance 0; status settled; fresh readback checked. |

That credit is **settled historical evidence**, not an available-credit fixture for a new allocation test. No real cash moved. Refund date/method history was not certified; the developer stated that there was no refund-history table. That limitation is recorded separately from the confirmed missing allocation capability and is not presented here as a newly reproduced history bug.

### Attachment

- [Committed release matrix and explicit partial-delivery statement](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/docs/release-verification-2026-11-04/README.md)
- [Recorded developer scope: allocation explicitly excluded](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/data/release-verification-2026-11-04.json)
- [Original ticket and dated reproduction](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/docs/phase2/bugs/credit-notes.md)
- [F13-d requirement specification](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/docs/FEATURES.md)
- [Allocation spec](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/tests/phase2/credit-notes/credit-allocation.ui.spec.ts), [refund regression spec](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/tests/phase2/credit-notes/cash-refund.ui.spec.ts), and [shared credit scenario adapter](https://github.com/FuadTwaheerP/nexstock-testing/blob/f0afdea8173a1165d7c28dd206289dd457535771/tests/phase2/credit-notes/support/credit.ts)
- [Passing refund execution HTML report](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/phase2/credit-notes-2/playwright-report/index.html)
- [Saved full-credit detail before refunds](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/phase2/credit-notes-2/artifacts/credit-notes-cash-refund.u-1bc26-endent-saved-balance-checks-phase2-credit-notes/attachments/credit-detail-770410713b0d4b36b6f889476aafec2de09929a9.png)
- [After Rs 40 refund: remaining Rs 60](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/phase2/credit-notes-2/artifacts/credit-notes-cash-refund.u-1bc26-endent-saved-balance-checks-phase2-credit-notes/attachments/credit-refund-balance-60-c9801c643dec2e056914917ff798af84fb732ac5.png)
- [After final refund: remaining Rs 0](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/release-verification-2026-11-04/phase2/credit-notes-2/artifacts/credit-notes-cash-refund.u-1bc26-endent-saved-balance-checks-phase2-credit-notes/attachments/credit-refund-balance-0-54fb08793cabfd5ae4b7de790f7d87f8397be1f5.png)

### Comment

**Status: partially delivered. Remaining implementation: invoice allocation and its verified persisted effects.** The checks below are proposed implementation/acceptance requirements for the new capability, not a list of independently confirmed existing calculation, authorization or concurrency bugs.

**Implementation guidance**

- Add a discoverable allocation action on an available credit, an eligible invoice, or both. Show available credit, the target invoice's outstanding amount, the proposed allocation and resulting balances before confirmation. Match records by stable IDs rather than customer display names.
- Implement allocation as a distinct server-side operation linked to the exact credit, invoice, customer and business. The currently observed refund endpoint is `POST /app/api/v1/sales/credit-notes/{id}/payments`, with amount/method/reference fields; it is evidence of working refund behavior, not an established allocation API contract. Do not invent an allocation route in tests before observing the delivered contract.
- Validate authorization, business/customer eligibility, credit availability, invoice eligibility, positive monetary amount, and both balance limits on the server. Use the application's supported monetary precision and rounding consistently.
- Commit the allocation, credit balance and invoice settlement changes atomically. Prevent duplicate consumption from rapid clicks, retries and concurrent allocation/refund requests. On failure, leave both balances unchanged and show a meaningful error.
- Persist allocation identity, amount, linked credit/invoice/business, actor and timestamp, so the application can reconstruct and explain the balance after refresh. Show how much was allocated versus refunded. A status label should follow the application's agreed enums; do not introduce a label-only defect if balances and meaning are correct.
- Allocation is a settlement operation. It should not independently trigger a stock return, recalculate the issued document's original tax/total, send an email or invoke a real payment provider. Optional restocking belongs to separate P2-CN-003.

**Proposed arithmetic fixture for acceptance**

Use a fresh linked credit with **Rs 100 available** and a separate eligible **Rs 200 unpaid invoice** for the same QA customer and business. The original linked invoice may already be paid; it must not be treated as having an artificial outstanding balance just to enable a test.

| Scenario | Credit available after action | Target invoice due after action |
| --- | ---: | ---: |
| Start | Rs 100 | Rs 200 |
| Allocate Rs 40 | Rs 60 | Rs 160 |
| Allocate the remaining Rs 60 | Rs 0 | Rs 100 |
| Separate fresh fixture: allocate Rs 40, then refund the remaining Rs 60 | Rs 0 | Rs 160; only the Rs 40 allocation reduces this invoice |

If the target has only **Rs 30 due** and the credit has **Rs 100 available**, applying Rs 30 should leave credit Rs 70 and invoice due Rs 0. An attempt above the invoice's due amount must not silently over-settle it. These examples assume no intervening transactions and no additional fees.

**Product decisions to settle before implementation sign-off**

- Confirm which invoices are eligible: the source invoice only, other unpaid invoices for the same customer, and/or multiple targets. Since the original QA credit was linked to a paid invoice, specify how its remaining balance is intended to be used. The cross-invoice example above is a proposed fixture, not an already confirmed production policy.
- Define whether draft/voided/fully paid invoices and draft/voided/settled credits are eligible, and which state exposes allocation. Preserve the existing working credit/refund lifecycle.
- Specify any allocation reversal/cancellation workflow if it is part of this delivery. Do not count an unspecified reversal policy as an existing bug. Multi-currency allocation is outside this Phase 2 acceptance fixture.

**Closure checks to execute after deployment**

1. Confirm the allocation action is reachable for an eligible available credit and unavailable, or clearly explained, for an ineligible record.
2. Execute the partial/full allocation examples; verify both balances through fresh independent reads and UI reloads, including customer outstanding balances where supported. Retain exact transaction IDs as evidence.
3. Verify zero, negative, above-credit and above-invoice-due amounts are rejected without balance changes. Verify settled/voided records, wrong-customer/business targets and unauthorized actors using approved isolated fixtures.
4. Verify duplicate submission/retry and concurrent settlement cannot spend more than the available credit or invoice due. Verify a failed operation does not leave one side updated.
5. Execute the separate mixed allocation/refund example to prove both consume the same remaining credit without double counting or fabricating cash receipts.
6. Rerun the existing Rs 40 + Rs 60 refund regression and Rs 101 rejection. Verify reason/details persistence, credit PDF/print, source-invoice linkage and unchanged stock except for separately authorized restock workflows.
7. Inspect persisted allocation history and the final status/balance after reopening. Report any refund date/method-history limitation explicitly; do not mark that history verified from aggregate refund balances alone.

**Automation change required**

`creditScenario()` in `tests/phase2/credit-notes/support/credit.ts` currently reports allocation as `BLOCKED` because it was explicitly excluded. After the UI/API is delivered, replace that branch with real UI actions and independent balance/history assertions. Updating an annotation to PASS is not evidence of delivery.

The current integrated `full` mode first refunds **40 + 60**, consuming the entire credit, and then reaches the allocation blocker. Restructure the integration fixture before adding allocation assertions: use a fresh credit, or deliberately exercise the partial-allocation/remaining-refund example. A settled credit must not become the positive allocation fixture.

Scoped rerun once the adapter matches the delivered controls:

```powershell
$env:PHASE2_ARCHIVE_ROOT = 'blob-report/archive/<new-campaign>/phase2'
node scripts/run-phase2.mjs credit-notes credit-allocation.ui.spec.ts cash-refund.ui.spec.ts credit-notes-full-flow.ui.spec.ts
node scripts/assess-phase2.mjs credit-notes
```

Run serially with normal setup/cleanup and the approved disposable QA account. Keep financial history as evidence, restore captured stock/settings, and perform no real payment or external dispatch. Close P2-CN-004 only after the delivered allocation path and retained refund behavior have reviewed evidence; developer intent or a passing unrelated debit-print check is insufficient.

---

