# Stock Transfers - Phase 2

Run `node scripts/run-phase2.mjs stock-transfers`. Append any `.ui.spec.ts` in this folder for an independent submodule, `--grep @full-flow` for the integrated entry point, or `--headed` for maximized Chromium.

Review reopened: the earlier disabled-selector finding P2-TRANSFER-001 was an automation readiness error and is withdrawn. The selectors enable after branch data loads. Do not log that proposed defect.

The suite captures both QA branch stock balances, seeds a simple QA inventory item, creates a Draft, opens its own history/detail, and advances only its owned request using the deployed Submit, Approve & Ship and Mark as Received / Complete controls. Final composite: 7 passes including setup/cleanup, no confirmed bugs or unresolved automation errors. The core lifecycle, two-unit receipt, source/destination stock effects, requester and populated event dates are verified. Draft cleanup supplies a cancellation reason. Owned in-transit fixtures are received before compensating stock; completed/cancelled history is retained.

Backend read oracles use only the identical GET observed in the browser, with session headers kept in memory. All business mutations use the real scoped UI; no selector responses or status transitions are mocked.

See `docs/phase2/bugs/stock-transfers.md` for evidence and the rerun requirement after repair. No Phase 3 dispatch manifests or transit dispute checks are included.
