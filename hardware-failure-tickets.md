# Hardware & Printer Configuration — findings

Production: https://nexstock.stylotech.mu/app · Nexstock QA Company · Chromium · 19 October 2026.

Phase 1 scope: browser thermal printing (58mm / 80mm) and USB/Bluetooth HID input. ESC/POS drivers, cash drawers and barcode-label printers are Phase 3 and excluded.

## Latest report review — all nine unsuccessful cases

Reviewed the latest saved HTML/JUnit report, test/helper code, failure contexts, screenshot evidence, passing manual-click calibration and safety journal. This review concerns the same completed 19 October 2026 run: **8 passed, 9 unsuccessful, 0 skipped**. No additional production run was performed during this review. No new automation fault was identified among these nine outcomes, so the application expectation was not changed from one unit to two and no evidence/prerequisite flags were fabricated to force passes.

| Unsuccessful check | Classification | Ticket / next action |
| --- | --- | --- |
| HID input at 0ms cadence | Same confirmed application bug | HW-001: expected initial quantity 1, actual 2 |
| HID input at 5ms cadence | Same confirmed application bug | HW-001, not a second bug |
| HID input at 25ms cadence | Same confirmed application bug | HW-001, not a third bug |
| Repeated scans merge to three units | Stops at HW-001 on the first scan | Fix initial quantity, then rerun merged-count assertions; no separate repeated-count bug established |
| Manual keyboard after scanner input | Stops at HW-001 before keyboard-continuation assertions | Fix initial quantity, then rerun; manual keyboard itself is not proven broken |
| Actual USB/Bluetooth device acceptance | Missing physical-device evidence | Blocked coverage, not a confirmed transport or pairing defect |
| Existing QA receipt invokes browser printing | No saved QA sale in All-time history | Receipt-data blocker, not a proven print failure |
| Actual 58/80mm print/native-dialog acceptance | Missing physical printer/native-dialog evidence | Blocked coverage, not a confirmed printer defect |
| Integrated Hardware flow | Aggregate duplicate | Retains HW-001 and the same receipt/device blockers; do not create another ticket |

The input helper types the persisted barcode as a string and sends exactly one Enter; it does not click the plus button. The captured UI and error context show quantity **2**, base price **Rs175.00** and total **Rs350.00**, while the independent manual-click calibration passes at quantity **1**. Thus HW-001 is an observed browser input/quantity defect, not an assumed physical scanner issue. Its exact event-handler root cause remains unverified.

JUnit's single `error` entry is the explicit **RECEIPT DATA BLOCKER** above, not a browser crash. Authentication and cleanup passed; the journal records zero unexpected application writes. The detailed ticket below is the **only confirmed application bug** to log from these nine cases. Previously corrected automation issues and the separate footer observation remain documented below rather than being recast as new bugs.

## Confirmed application bug

### HW-001 — One barcode plus Enter changes customization quantity to two

#### Title

A single keyboard-wedge barcode scan opens Customize Product with quantity 2 instead of 1.

#### Environment

Production /app/pos; Nexstock QA Company; Chromium desktop (1920×1080 automated window); existing in-stock customizable QA product `QA-FLOW-mv89ihb7-8dc11e`, barcode `0001791991570723270`.

#### Priority

P1 — A single scan selects an unintended extra unit and could produce an incorrect order if accepted without correction.

#### Step-by-step

1. Sign in with the disposable QA account and select **Nexstock QA Company**.
2. Open **Point of Sale** with an empty order.
3. Locate the in-stock product **QA flow mv89ihb7-8dc11e Final**. Use its persisted barcode above; do not edit the barcode or stock.
4. Focus **Search products or scan barcode…**.
5. Enter the barcode once as normal sequential keyboard/HID input, preserving all leading zeroes, and send exactly one Enter suffix. Do not click the quantity plus button.
6. Inspect **Customize Product** and its Quantity / Total Price before clicking Add to Order.
7. Cancel the customization. As a control, search the same product by SKU and click its tile once; inspect the initial customization quantity.
8. Repeat the scan with an empty order. Automated repetitions used 0ms, 5ms and 25ms between character events.

#### Expected Result

One barcode with one Enter opens customization for exactly one unit, matching the manual-click control. For this fixture, the standard base price is Rs175.00, so the unmodified one-unit total is Rs175.00. Merely submitting the barcode must not increment the dialog's quantity.

#### Actual Result

One barcode plus Enter opens the correct product but shows **Quantity 2** and **Total Price Rs350.00**. The plus button is focused without an explicit plus-button click. The manual product-click control starts at **Quantity 1**. The leading-zero string is preserved; the failure occurs in quantity handling after Enter. The same quantity mismatch appears at all three tested character cadences.

#### Attachment

- Screenshot: `test-results/phase1-hardware-barcode-sc-5a4fa-ing-zeros-and-adds-one-unit-chromium-hardware/test-failed-1.png` (0ms).
- Screenshot: `test-results/phase1-hardware-barcode-sc-91d0e-ing-zeros-and-adds-one-unit-chromium-hardware/test-failed-1.png` (5ms).
- Corresponding `error-context.md` files record expected `1`, received `2`.
- Latest `playwright-report/index.html`: HID cadence cases, repeated scans, manual keyboard after scan, manual-click calibration and integrated flow.

#### Comment

One ticket groups the duplicate cadence failures, repeated-scan case, post-scan keyboard case and integrated flow. Repeated count/cart assertions and post-scan keyboard behavior are not reported as separate confirmed defects: they stop at the same initial quantity mismatch. No sale, payment, refund or stock mutation was submitted; a financial overcharge is a risk, not an observed completed transaction. Real USB/Bluetooth devices were not used, so this is a reproduced browser HID/Enter-handling defect, not proof of a device-driver or Bluetooth transport failure. Root cause (including whether Enter propagates to the focused plus control) needs developer investigation; it is not established by the screenshot alone.

---

## Blocked coverage — not confirmed application bugs

1. **Existing-receipt printing:** POS History > All time shows **No sales found**. The reprint case is RECEIPT DATA BLOCKER. No synthetic financial transaction is created just to bypass this. Supply an existing approved QA receipt/reference, then validate its actual history/reprint adapter. This does not prove printing or payment methods are broken.
2. **Native dialog / actual 58mm and 80mm output:** no physical acceptance record was supplied. Selecting widths and inspecting sample previews does not prove native dialog appearance, paper output, wrapping, printed totals or cancellation. The physical-printer case is HARDWARE EVIDENCE BLOCKER.
3. **Actual USB and Bluetooth scanners:** keyboard-event emulation is not hardware transport verification. Real-device scan, repeated count and subsequent keyboard-use evidence are still required. The physical-scanner case is HARDWARE EVIDENCE BLOCKER.
4. **Downstream scan assertions:** exact merged cart quantity/subtotal and normal keyboard behavior after a successful scan cannot be certified while HW-001 prevents the first one-unit confirmation. The integrated flow retains this failure and continues independent read-only checks; it never invents a successful checkout or receipt.

Use `tests/phase1/hardware/README.md` for the human/device checklist and genuine evidence schema. Do not populate an illustrative acceptance record to turn these cases green.

## Corrected automation issues and separate observations

- **Stock baseline text representation:** setup captured `innerText` with a newline, while the first cleanup compared `textContent`, which concatenated quantity/status. It now compares normalized `innerText` consistently. The follow-up cleanup passed with stock unchanged at 10 and saved receipt settings unchanged. No stock compensation was needed.
- **Headless window sizing:** `viewport: null` with only `--start-maximized` left headless Chromium at 800×600. Hardware projects now also specify a 1920×1080 native window; headed mode retains maximization, with no incompatible device-scale preset.
- **Manual calibration scope / footer observation:** the manual-click control is specifically an independent check of the initial customization quantity. It inspects that quantity and cancels the unsaved dialog. An earlier version also clicked Add to Order, which was outside the viewport in the long customization dialog, even after desktop sizing. That footer reachability observation needs separate layout/manual investigation; it is not mislabeled as a scanner-quantity failure or claimed fixed by the window-size adjustment. Successful add-to-cart through that long dialog is not certified by the calibration pass.
- **Full-flow continuation:** a scanner failure remains a failed soft assertion with its screenshot retained. Only the unsaved modal/cart is discarded so independent receipt-data and physical-evidence prerequisites can still be assessed. No expected-failure or skip annotation is used.

## Execution summary

Latest complete run, 19 October 2026: `npm run test:hardware` — **17 cases: 8 passed, 9 unsuccessful, 0 skipped**, approximately 2.8 minutes. Playwright CLI reports the nine unsuccessful cases as failed. JUnit represents them as **8 assertion failures plus 1 error**; that one error is the explicit **RECEIPT DATA BLOCKER**, not a browser crash or unexpected automation exception.

| Scope | Passed | Unsuccessful | Classification |
| --- | ---: | ---: | --- |
| Barcode Scanner Compatibility | 3 | 6 | Five duplicate HW-001 checks; one actual USB/Bluetooth acceptance prerequisite |
| Browser-Based Thermal Printing | 3 | 2 | Missing existing QA receipt; missing real printer/native-dialog evidence |
| Integrated flow | 0 | 1 | Aggregates HW-001 and the same receipt/device blockers; not an additional ticket |
| Authentication setup / safety cleanup | 2 | 0 | Existing QA fixture discovered; saved settings and stock unchanged; logout completed |

The functional subset is **15 cases: 6 passed, 9 unsuccessful**. Additional shared safety unit suite: **29 passed, 0 failed, 0 skipped**. There were **zero unexpected application writes**. Receipt configuration retained its captured baseline; QA product stock remained **10**. No sale, payment, refund, hold, product/stock edit, settings save, physical print job, device pairing or driver install occurred.

Verified browser passes: 58mm selection/sample preview; 80mm selection/sample preview; unsaved configuration discarded; unknown barcode rejected without adding a product; Scan focuses input; manual product click opens quantity 1 and cancels cleanly. Barcode string preservation assertions were reached, but the complete scan cases still fail on quantity 2. Merged quantities/subtotals, successful post-scan keyboard continuation, actual receipt reprint/native dialog and physical devices are not certified.

**One confirmed application ticket**, **three standalone prerequisite blockers**, and the integrated duplicates account for the report. The footer observation remains separate, not silently classified as fixed or as a confirmed HID/device bug. **Hardware remains partially tested, not fully signed off.**

The three independent scope commands are `npm run test:hardware:printing`, `npm run test:hardware:scanner` and `npm run test:hardware:flow`. Run all with `npm run test:hardware -- --headed`; inspect with `npm run report`. No skip, fixme, expected-failure or focused-test annotations are present.

The previous Security report and safe artifacts were preserved at `blob-report/archive/security-before-hardware-2026-10-19-231946/`. Its auth state was not copied. The normal HTML report is replaced by Hardware's latest run.
