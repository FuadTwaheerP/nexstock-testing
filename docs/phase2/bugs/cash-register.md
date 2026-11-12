# Cash Register & Shift Management - Phase 2 findings

Test date: **2026-10-25**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **7 passed, 5 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **2 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- Independent cases exercise opening-float/notes persistence, balanced closure, positive and negative variance with confirmation, closed-shift history and a cash sale increasing expected drawer cash. The logged-in QA owner is the cashier; separate live staff attribution/branch authorization is outside this module's verified scope.
- Cash movements cannot be entered and X/Z output cannot be generated through the observed register UI. Their amounts, reason persistence, accounting effects, report contents and thermal formatting are not certified merely because opening/closing works.
- Only uniquely marked owned QA shifts are opened and closed; an unrelated pre-existing shift would block fixture creation. All owned sessions are closed and the private recovery ledger confirms closure. QA cash sales/shift history are retained; no real payment, refund, invitation or physical print operation occurs.

## Confirmed application bugs

## P2-REG-001

### Title

An open register has no cash in/out workflow for additions and petty-cash withdrawals

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F09-b.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company and open Cash Register.
2. With no unrelated shift open, enter an opening float of Rs 100.00 and uniquely labelled QA notes, then click Open register.
3. Wait for Session open and verify the opening and expected cash figures.
4. Attempt to record a cash addition with an amount and reason.
5. Attempt to record a petty-cash withdrawal with an amount and reason.
6. After inspecting, close only the QA shift using its actual expected cash to leave the fixture closed.

### Expected Result

An active drawer offers cash in/pay-in and cash out/pay-out entry workflows. Each records amount and reason against the shift, adjusts expected cash with the correct sign, and remains traceable in reconciliation.

### Actual Result

The active register exposes the cash figures, counted-cash/notes inputs and Close register. There are no cash in/out or pay-in/pay-out entry controls, so additions and withdrawals cannot be entered through this workflow. Ordinary cash sales do increase expected cash correctly.

Affected cases:

- F09-b cash in with amount and reason
- F09-b cash out with amount and reason
- Register opening cash movements checkout reporting and closure full flow

### Attachment

- [P2-REG-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-movemen-5245a-h-in-with-amount-and-reason-phase2-cash-register/attachments/P2-REG-001-36fe56d0fcdbda2a16f7fa652737896a01314455.png)
- [P2-REG-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-movemen-ec792--out-with-amount-and-reason-phase2-cash-register/attachments/P2-REG-001-563f1e6aa48309dddb9f9d41224a1bc9a7610d12.png)
- [P2-REG-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-registe-3dbaf-closure-full-flow-full-flow-phase2-cash-register/attachments/P2-REG-001-eb6093c4c87948d2b270a90ac36c76d9c7a81df3.png)
- [F09-b cash in with amount and reason - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-movemen-5245a-h-in-with-amount-and-reason-phase2-cash-register/error-context.md)
- [F09-b cash out with amount and reason - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-movemen-ec792--out-with-amount-and-reason-phase2-cash-register/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-assessment.json)

### Comment

Both missing directions are grouped into one cash-movement capability ticket. This is an unavailable UI workflow, not a failure of the already-tested cash-sale arithmetic. Add scoped movement entry and reason/history support, then verify additions, withdrawals, expected totals and reconciliation. No unverified backend absence or cash policy is asserted.

---

## P2-REG-002

### Title

Register workflow does not expose mid-shift X reports or final Z reports

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F09-d.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open a uniquely labelled QA register shift with an opening float.
2. While Session open is visible, look for the X-report or mid-shift summary generation/print action.
3. Record a QA cash sale if needed and confirm expected cash increases.
4. Enter the counted cash and close the owned shift.
5. Locate the closed row in Past shifts and look for its Z-report/end-of-shift report or print action.

### Expected Result

Users can generate a thermal mid-shift X report without closing the drawer and a final Z report for its closure, with the appropriate shift cash/reconciliation figures.

### Actual Result

No X-report control is available on the active shift. After successful closure, Past shifts shows cashier, closing time, opening/expected/counted cash and difference, but has no Z-report generation or print action. No shift report is produced for content/format verification.

Affected cases:

- Register opening cash movements checkout reporting and closure full flow
- F09-d mid-shift X-report content and printing
- F09-d closed-shift Z-report content and printing

### Attachment

- [P2-REG-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-registe-3dbaf-closure-full-flow-full-flow-phase2-cash-register/attachments/P2-REG-002-32d2d9b703a6647c694fbee8052663bd776f583f.png)
- [P2-REG-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-registe-3dbaf-closure-full-flow-full-flow-phase2-cash-register/attachments/P2-REG-002-32d2d9b703a6647c694fbee8052663bd776f583f.png)
- [P2-REG-002 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-shift-report-a8bd6-report-content-and-printing-phase2-cash-register/attachments/P2-REG-002-b1c0b8ceded93eadf062271af134dea622b8a83e.png)
- [Register opening cash movements checkout reporting and closure full flow - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-registe-3dbaf-closure-full-flow-full-flow-phase2-cash-register/error-context.md)
- [F09-d mid-shift X-report content and printing - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-shift-report-a8bd6-report-content-and-printing-phase2-cash-register/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-assessment.json)

### Comment

The two unavailable outputs are grouped as the same shift-reporting capability. Register closure and variance history work. This is a software report-access gap, not a claim about physical printer compatibility. Expose the outputs for the correct owned shift and test content, mid-shift behavior, final closure and thermal formatting after implementation.

---

## Corrected automation / maintenance - not application tickets

- The first focused case verified the actual opening/count/notes controls, correct cashier and history row locators before running the complete module.
- Close-register variance uses a native confirmation. The test accepts it only while closing its owned QA shift and independently verifies expected, counted and signed variance values.
- The integrated flow records missing cash/report capabilities but continues to verify the QA cash sale, expected cash increment, closing and history. No failed step is silently marked passed.
- Public client source corroborates the observed open/close/history contract. Confirmed tickets describe missing UI workflows and do not claim to have proven that every possible backend endpoint is absent.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | cash-register-2 |
| F09-a opening cash float and QA shift notes persist | PASS | cash-register-2 |
| audit Phase 2 write scope and log out QA session | PASS | cash-register-2 |
| F09-b cash in with amount and reason | FAIL - P2-REG-001 | cash-register-2 |
| F09-b cash out with amount and reason | FAIL - P2-REG-001 | cash-register-2 |
| Register opening cash movements checkout reporting and closure full flow | FAIL - P2-REG-001, P2-REG-002 | cash-register-2 |
| F09-c balanced drawer closure | PASS | cash-register-2 |
| F09-c overage calculation and confirmation | PASS | cash-register-2 |
| F09-c shortage calculation and confirmation | PASS | cash-register-2 |
| F09-e own closed-shift reconciliation remains in history | PASS | cash-register-2 |
| F09-d mid-shift X-report content and printing | FAIL - P2-REG-002 | cash-register-2 |
| F09-d closed-shift Z-report content and printing | FAIL - P2-REG-002 | cash-register-2 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs cash-register
node scripts/assess-phase2.mjs cash-register
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
