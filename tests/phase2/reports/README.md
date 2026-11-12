# Reports & Business Intelligence — Phase 2

Run `node scripts/run-phase2.mjs reports` from the repository root. Append a spec filename for an independent submodule, `--grep @full-flow` for the integrated flow, or `--headed` to see a maximized browser.

The suite covers sales/performance/tax report availability, catalogue-wide low-stock completeness, current cost valuation, a real initialized-stock positive control, CSV download/history, PDF availability and company currency formatting. A separate later-page valuation boundary is blocked by Stock Counts P2-COUNT-005. The full flow keeps that unrelated prerequisite separate.

Real adjustments use only the QA inventory fixture. Captured branch balances are restored. Six confirmed reporting tickets and the final reviewed case register are in `docs/phase2/bugs/reports.md`. Passing subset CSV arithmetic does not certify catalogue-wide data completeness.
