# Stock Transfers (Inter-Branch) - Phase 2 findings

Test date: **2026-10-25**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **7 passed, 0 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **0 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- All four Phase 2 submodules and the integrated flow use real UI writes on one simple QA SKU, two QA branches and a two-unit full shipment. Source/destination balances are captured before seeding and restored after completion/cancellation.
- The deployed lifecycle is Draft -> Pending -> In Transit -> Completed (API draft/pending/transit/completed). Pending and completed history/details expose the QA item, quantity, requester and event dates. This does not certify other-user attribution, every product type, partial shipments or concurrent stock changes.
- Phase 3 dispatch manifests and transit damage/dispute workflows are excluded. No external shipment, supplier email, payment or physical printer operation occurs.
- Owned diagnostic Drafts were cancelled with reasons; the interrupted owned in-transit shipment was received before final stock recovery. Completed/cancelled records remain as audit evidence. The recovery ledger marks successful restoration only after terminal state and both balances are verified.

## Confirmed application bugs

No confirmed application bugs were found in the executed scope. This is not a pass for blocked/unverified requirements.

## Corrected automation / maintenance - not application tickets

- P2-TRANSFER-001 is withdrawn: the source/destination selectors were inspected before branch data loaded. Waiting for enabled controls disproved the proposed defect. Do not log it as an application bug.
- Transfer rows are located by the ID column. A prior any-cell locator also matched another row's quantity 2.
- Cancellation uses the actual Cancel Transfer reason dialog and Confirm Cancellation button, not a guessed native confirmation. The workflow uses Submit, Approve & Ship and Mark as Received / Complete.
- Pre-navigation GET waits include application boot time and are awaited together with navigation to prevent unhandled early timeout rejections. Shared navigation waits for DOM readiness and actual controls, rather than an unrelated full load event; an unsuccessful setup does not reuse old auth for business cleanup.
- Between transitions, read-only oracles re-read only the identical GET observed in the browser. Session headers remain in memory and are never included in reports. All transfer/status/adjustment writes use scoped real UI actions.
- Recovery receives an owned in-transit fixture before restoring stock and records successful restoration, avoiding redundant recovery page boots. The end-to-end budget includes real production navigation and cleanup latency; no performance SLA or intentional retry/skip is used.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | stock-transfers-13 |
| F05-a create source-to-destination transfer request | PASS | stock-transfers-11 |
| F05-c receiving reconciles both QA branch stock balances | PASS | stock-transfers-12 |
| Stock transfer request dispatch receipt and ledger full flow | PASS | stock-transfers-11 |
| F05-d own pending and completed transfer ledger history | PASS | stock-transfers-12 |
| F05-b draft to in-transit progression | PASS | stock-transfers-13 |
| audit Phase 2 write scope and log out QA session | PASS | stock-transfers-13 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs stock-transfers
node scripts/assess-phase2.mjs stock-transfers
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
