# Hardware & Printer Configuration — Phase 1

Two independent submodule specs and an integrated flow. Every command runs its own authentication/fixture setup and safety teardown; no preceding Products, POS or Security suite is required. Uses the existing opted-in disposable account and selects Nexstock QA Company.

| Scope | Command | Coverage |
| --- | --- | --- |
| F27-a Browser-Based Thermal Printing | `npm run test:hardware:printing` | 58/80mm selection and sample preview; discard unsaved edits; existing-receipt browser print invocation contract; physical/native-dialog evidence prerequisite |
| F27-b Barcode Scanner Compatibility | `npm run test:hardware:scanner` | Leading-zero barcode strings, 0/5/25ms key cadence, one-unit scan, repeated scans, unknown input, Scan focus, manual keyboard use and real-device evidence prerequisite |
| Integrated attempt | `npm run test:hardware:flow` | Both paper choices → HID scan bursts → pre-existing receipt reprint → physical acceptance prerequisites → unchanged settings |

Run all visually in maximized Chromium:

```powershell
npm run test:hardware -- --headed
npm run report
```

Headless: `npm run test:hardware`. Inspector: add `-- --debug` to an independent command. Uses `viewport: null` without a device-scale preset; an explicit 1920×1080 native window avoids the default tiny headless window, while headed mode retains maximization. No intentional skip, fixme or expected-failure annotations. Missing data/device evidence produces explicit blocker failures, not application bug tickets.

## Safety / fixtures

- Existing `.env` credentials and disposable-production opt-ins are reused. Set HARDWARE_TEST_COMPANY if needed; optional HARDWARE_TEST_SKU must be QA-prefixed, enabled in POS, have a persisted leading-zero barcode and at least three units available. Default discovery uses the first enabled QA tile.
- Does not create or edit products, adjust stock, save settings, complete/hold/refund a sale, initiate payment, pair devices, install drivers or send paper to a printer. Scan tests manipulate unsaved carts only. Customizable fixtures are confirmed using Standard (No Variant), one unit, no add-ons; an incorrect default quantity is asserted, never repaired to make a test pass.
- Uses the existing unit-tested security request guard: routine authentication only; other application writes are blocked. External POST telemetry is locally fulfilled with 204; incidental language-preference writes are blocked and classified separately. Credential changes and API mutations are not allowed.
- Setup captures settings and product-stock baselines. Teardown verifies unchanged settings/stock, checks the journal for unexpected business writes, and logs out. Any attempted protected mutation is a safety/automation finding, not an application ticket. No records need deletion or compensating stock changes.
- `test-results/hardware-auth.json` is private ignored session state. Never commit/share it. Journal/fixture JSON contain no passwords/tokens. Trace/video are off. Run one module process at a time: default runs replace test-results and the normal HTML report.

Guard verification: `npm run test:guard` (29 checks). The module reuses `helpers/security-safety.mjs`; no weaker production bypass is introduced.

## What printing checks do—and do not—prove

Settings > Customization > Receipt Customization provides 58mm and 80mm choices and a **sample** receipt. The smoke tests verify those UI choices, visible sample totals and discard of unsaved changes. They do not infer actual paper dimensions from a fixed-width screen preview, flag illustrative company/sample-currency text as a transactional defect, or claim saved settings persistence after never clicking Save.

The inspected QA POS History > All time currently shows **No sales found**. Receipt reprint therefore fails as RECEIPT DATA BLOCKER, not “printing is broken.” The suite does not create a financial transaction to bypass that prerequisite. A human may supply an already-created synthetic QA receipt via HARDWARE_RECEIPT_REFERENCE.

The seeded-history row/reprint adapter is explicitly provisional because no receipt rows exist in the inspected account. Once a receipt is available, inspect its real controls and validate the adapter before classifying downstream failures. Missing adapter controls are RECEIPT ADAPTER BLOCKER, not a confirmed application defect.

All contexts/popups intercept `window.print`. A future successful reprint test proves the application requests browser printing exactly once; it does **not** prove a native dialog opened, a particular printer received data, the selected 58/80mm paper was physically applied, cancellation behavior or paper layout. Nothing uses kiosk/silent printing. Actual receipt content, printed company/tax/totals, long-line wrapping, native-dialog cancellation and no duplicate transaction require the manual checklist below.

## HID emulation vs real USB/Bluetooth compatibility

The automated tests type the exact persisted barcode as a string using normal keyboard events followed by one Enter. Timings of 0, 5 and 25ms test browser event handling; they are not measured USB/Bluetooth transport characteristics. Repeated scans are processed sequentially, with normal customization confirmation where required; this does not certify a raw unattended multi-scan stream while a modal is open.

Unknown codes must not add unrelated products. Leading zeros must remain intact. Scan focus, exact cart quantity/line count and subtotal are independently asserted. No OS device pairing, scanner driver, Bluetooth reconnect, battery behavior or physical scan was exercised. Actual USB and Bluetooth devices require manual evidence; browser key events are not a replacement.

The separate manual-click calibration checks the initial customization quantity and then cancels the unsaved dialog; it does not claim a completed add-to-cart. Earlier exploratory activation of the long dialog's footer could not reach Add to Order with a mouse, including at desktop size. That layout observation requires separate investigation; window sizing is not presented as an application layout fix. Scan-dependent cart/repetition/keyboard assertions currently stop at the duplicate initial quantity finding and remain unverified downstream.

## Physical acceptance checklist (human/device work)

1. Use the disposable company and an approved synthetic receipt. Record actual app build/reference, browser version, date and printer/scanner models; no serial numbers/MAC addresses or real-customer data are needed.
2. Connect a 58mm printer yourself. Open the existing receipt's native browser print dialog, select the actual printer/paper and print. Check long product names, multiple lines, company/reference, quantities, subtotal/tax/total, wrapping and clipping on paper.
3. Repeat with an 80mm printer. Open a further print dialog and cancel; verify receipt/sale/reference/totals are unchanged and no duplicate sale/payment was created. Do not create/refund a sale merely to test cancellation.
4. With an actual USB HID scanner, scan a known leading-zero QA barcode plus configured Enter suffix once, then repeat scans with expected unit counts. Follow legitimate product customization prompts if applicable. Check unknown barcode handling and subsequent normal keyboard use.
5. Repeat with an actual Bluetooth HID scanner. Check paired/reconnected input separately if that support is in the agreed device scope. Capture physical evidence without claiming the emulated timing cases prove transport compatibility.
6. Record real outcomes, failures and evidence references. Do not mark a hardware assertion passed if it was only simulated or blocked.

HARDWARE_ACCEPTANCE_PATH can point to an independently produced private JSON record outside test-results (for example an ignored local evidence folder). Schema:

```json
{
  "targetOrigin": "https://nexstock.stylotech.mu",
  "company": "Nexstock QA Company",
  "verifiedBy": "actual reviewer",
  "verifiedAt": "actual ISO date/time",
  "browserVersion": "actual tested browser/version",
  "evidenceReference": "actual manual report and paper/device evidence",
  "printers": {
    "printer58Model": "actual model",
    "printer80Model": "actual model",
    "passedAssertions": [
      "thermal_58mm_output_no_clipping",
      "thermal_80mm_output_no_clipping",
      "native_dialog_cancel_no_sale_mutation"
    ]
  },
  "scanners": {
    "usbScannerModel": "actual model",
    "bluetoothScannerModel": "actual model",
    "passedAssertions": [
      "usb_hid_scan_verified",
      "bluetooth_hid_scan_verified",
      "leading_zero_preserved",
      "rapid_repeat_count_correct",
      "keyboard_after_scan_usable"
    ]
  }
}
```

This example is **not evidence**. Never copy illustrative values to force a pass. The validator checks a supplied manual record only; it does not run those physical assertions or establish that the record matches the current build. The reviewer must establish actual device results and deployment applicability. Without a real record, the two physical-acceptance cases remain HARDWARE EVIDENCE BLOCKER—not skipped, passed or application bugs.

## Scope and report preservation

Phase 3 ESC/POS network/serial drivers, RJ11 cash-drawer triggering and adhesive barcode-label printers are excluded. No physical security/OS settings or device permissions are changed.

Before this module's first run, the Security report, screenshots and sanitized journal were preserved at `blob-report/archive/security-before-hardware-2026-10-19-231946/` (ignored). No saved authentication state was copied. The normal `npm run report` now shows Hardware's latest complete run.

Execution results and confirmed bugs versus automation corrections / prerequisites are recorded in root `hardware-failure-tickets.md`. Do not mark physical device or full receipt printing coverage complete based on sample-preview or HID-emulation passes.

## Latest verified execution — 19 October 2026

`npm run test:hardware`: **17 cases — 8 passed, 9 unsuccessful, 0 skipped**, approximately 2.8 minutes. Includes two passing lifecycle checks; functional checks are 6 passed / 9 unsuccessful. CLI labels all unsuccessful cases failed; JUnit splits them into eight assertion failures and one explicit missing-receipt-data error, not an automation crash.

- Five independent scanner checks reproduce one grouped bug: barcode + Enter opens customization at quantity 2. Manual product-click calibration starts at 1 and passes.
- Three standalone checks need prerequisites: an existing QA receipt, actual 58/80mm printer/native-dialog evidence and real USB/Bluetooth scanner evidence. These are not application bug tickets.
- The failed integrated flow retains the same scan bug and blockers while checking independent read-only stages; it is not an additional bug.
- Passed: both width choices/sample previews, discard of unsaved edits, unknown-barcode rejection, Scan focus and one-unit manual-click calibration.
- Safety teardown passed: saved receipt configuration unchanged, product stock still 10, zero unexpected business writes, logout completed. Shared guard unit suite: 29 passed.
- Cleanup text comparison was corrected to use consistent DOM text representation. Native desktop sizing is explicit. The long customization footer observation and downstream cart/printing checks remain unverified as documented above.

The module is **partially tested**, not full physical-device/native-print certification. Details and the agreed-format HW-001 ticket are in `hardware-failure-tickets.md`.
