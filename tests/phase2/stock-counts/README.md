# Stock Counts - Phase 2

Run `node scripts/run-phase2.mjs stock-counts`. Append any submodule `.ui.spec.ts` filename to run it independently, `--grep @full-flow` for the combined scenario, or `--headed` for maximized Chromium.

Each scenario captures both QA branch stock balances, seeds three units of a simple QA inventory product, starts an independent count, saves/reopens the counted quantity and verifies signed variance. Reconciliation cases cover surplus and shortage, check the target branch and comparison branch, and compensate stock in finally/teardown. Uncommitted counts are abandoned. Committed history is retained.

The core count fixture uses QA Inspection Store 20261017, branch ID 1, and SKU QA-ADD-mv9rtxw1-3b087e. That branch must remain a disposable QA location with zero unrelated stock. The baseline is captured rather than assumed. The product's current cost is read from its catalogue record.

`initial-balance-reconciliation.ui.spec.ts` independently checks active ordinary SKU QA-ARCHIVE-mv9s9v7r-b9c0c9, whose first positive count fails to create/update its branch balance (P2-COUNT-005). Saved quantity and the native positive-variance confirmation are verified before commitment, and a separate fresh count is the readback oracle. Zero stock is restored and independently checked; snapshot-only counts are abandoned. This regression was discovered while preparing the reporting boundary case, which now records the genuine dependency blocker.

See `docs/phase2/bugs/stock-counts.md` for reviewed results. Concurrent transactions, other item types and Phase 3 scheduled/scanner counting are outside this suite.
