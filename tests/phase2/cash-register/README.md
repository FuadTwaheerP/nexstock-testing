# Cash Register - Phase 2

Run `node scripts/run-phase2.mjs cash-register`. Append a submodule `.ui.spec.ts` for independent execution, `--grep @full-flow` for the integrated flow, or `--headed` for maximized Chromium.

The suite uses uniquely marked owned QA shifts and closes them in finally/teardown. An unrelated active drawer blocks setup rather than being modified. Opening/notes persistence, balanced/over/short counts, native variance confirmation, correct cashier, history and cash-sale expected-cash integration are verified. Recovery is private in `test-results/phase2-register-recovery.json`; do not attach auth state or private recovery files to tickets.

The integrated flow continues through a QA service cash sale and closing even when cash in/out and X/Z controls are unavailable, recording every failed step. Missing workflows remain red; no intentionally skipped or expected-failure cases are used. Report contents/thermal formatting and cash movement arithmetic remain unverified until their controls are delivered. Any newly reachable controls require adapter/content assertions before they can be certified.

Findings: `docs/phase2/bugs/cash-register.md`. Synthetic paid receipts and closed shift history remain as QA evidence. No real payment, refund, email or physical printer action is performed. The configured actor defaults to Fuad Peerbocus (`ADJUSTMENT_TEST_ACTOR` can identify a different approved QA fixture account).
