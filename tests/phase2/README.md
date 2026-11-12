# Phase 2 automation

The 18-module plan is in `data/phase2-plan.json`. Each module has independent `*.ui.spec.ts` files, a `*-full-flow.ui.spec.ts` and a README. Final reviewed results and links to each separate detailed bug document are in `docs/phase2/SUMMARY.md`.

Run from the repository root with the existing approved QA environment configured in `.env`:

```powershell
node scripts/run-phase2.mjs notifications
node scripts/assess-phase2.mjs notifications
```

Replace `notifications` with any module slug in the plan. Append a spec filename for a submodule, `--grep @full-flow` for its integrated flow or `--headed` for maximized visible Chromium. Run modules serially: authentication and recovery files are shared. `npm test` remains the original smoke suite and does not run Phase 2.

Every attempt is archived separately under `blob-report/archive/phase2-2026-10-25`. The assessor combines the latest execution of each case, so focused reruns replace earlier failures without discarding evidence. Reports distinguish live passes, confirmed application failures, prerequisite blockers, mocked UI passes and unconfirmed mock observations. Setup/cleanup and full flows are cases too; case counts are not feature-acceptance percentages. A nonzero exit can be a known application failure or blocker, not necessarily broken automation.

The shared guard allows only scoped QA mutations. Stock, branch and preference changes are restored; owned shifts are closed and notification invoices cancelled. Synthetic QA financial/history records remain. Staff invitation/join mutations use explicitly authorized mocks; production members/invitations are verified unchanged. Real staff authorization is not certified by these mocks.

Fingerprint-named same-origin JavaScript/CSS assets are fetched and cached as exact, unchanged bytes per worker to avoid Chromium routing repeatedly stalling on large bundles. Their hashes are recorded. Live HTML selects the deployed asset names; API reads and writes are never served by this asset cache.

Do not share `.env`, authentication state, private baselines or recovery files. Upload selected screenshots/downloads separately when filing tickets. Do not run simultaneous suites or reinterpret unexecuted/unavailable requirements as passing coverage.
