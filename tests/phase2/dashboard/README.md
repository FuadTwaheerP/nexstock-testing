# Dashboard & Executive Analytics - Phase 2

Independent specs cover F01-a KPI metrics, F01-b revenue trends, F01-c top products, F01-d low stock, F01-e recent activity and F01-f branch scope. `dashboard-full-flow.ui.spec.ts` executes the complete analytics journey, records independent steps after failures, and fails rather than hiding missing capabilities.

Run `node scripts/run-phase2.mjs dashboard`. Append a spec filename for an independent submodule, `--grep @full-flow` for the integrated flow, or `--headed` for a visible maximized browser. Required auth setup and write-audit/logout cleanup are automatic. Do not use `--no-deps`.

All results must wait for the observed dashboard stats response. Widget edit cards are not live values; tests save only isolated browser-local layouts to inspect rendered widgets. Test-created widgets are removed through UI controls when returning to the original empty/default view. No transaction, stock or company setting is written.

Current reviewed outcome: four grouped application findings, with no unresolved automation errors. The default low-stock arithmetic and existing activity checks pass; live widget binding and required missing capabilities fail. Those failures are not full module acceptance. See `docs/phase2/bugs/dashboard.md` and the per-attempt evidence under `blob-report/archive/phase2-2026-10-25`.
