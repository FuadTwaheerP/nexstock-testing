# Stores & Branches - Closure and Staff Scoping - Phase 2 findings

Test date: **2026-10-25**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **4 passed, 0 application-failing cases, 0 blocked, 0 unresolved automation issues**. Separately: **0 mocked UI passes and 2 unconfirmed mock-based observations**; these are not live authorization/account-enforcement results. Duplicate failures are grouped into **0 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- The user authorized mock data/fake joins. Staff assignment screens and a simulated Manager are inspected with in-memory member/invitation responses; real members/invitations remain unchanged. Real staff login, effective cashier/manager restrictions and branch isolation remain unverified. No mailbox is being requested again.
- Closure exercises a zero-stock QA Inspection Store, preserves its identifier/name/code and persisted Inactive status, and reconciles active-location count. It does not certify historical sales retention or the behavior of active stock/registers attached to a closing branch.
- The company branch quota rejects new branch creation with HTTP 402 QUOTA_EXCEEDED. No upgrade or new subscription was attempted. No first-run branch was actually created; the empty recovery queue was verified by exact name/code lookup.
- The existing disposable QA Inspection Store is restored to Active after each test and by teardown. No location is permanently deleted.

## Confirmed application bugs

No confirmed application bugs were found in the executed scope. This is not a pass for blocked/unverified requirements.

## Unconfirmed observations / mocked scope — not confirmed bug tickets

- P2-STAFF-OBS-002: no branch assignment selector appears in the deployed invite/member UI or QA branch editor with simulated Manager staff. This is an unconfirmed mock-based observation shared with Users/RBAC, not a separate confirmed Stores defect.

## Corrected automation / maintenance - not application tickets

- Branch creation's initial modal timeout was a rejected quota request, not a confirmed application bug. The closure scenario now reuses a zero-stock QA test location and restores its status.
- Status save closes the modal asynchronously. Removed a racy isVisible-then-Cancel action and now wait for successful dismissal before reading persistence.
- Fresh branch reads consume response bodies immediately. A Chromium discarded-buffer error re-reads the identical observed GET with existing session headers; visible branch cards and reopened status remain the UI oracle. No auth headers are recorded in artifacts.
- The guard permits the application's observed own-session token refresh. No business or staff invitation endpoint is exempted.
- Replaced the obsolete mailbox prerequisite with the user's authorized mocked staff flow. Mock observations are separately classified and cannot become live branch authorization passes.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | stores-lifecycle-7 |
| F03-f closing an owned QA branch preserves its identifier and details | PASS | stores-lifecycle-7 |
| F03-f active-location count reconciles after adding and closing only a QA branch | PASS | stores-lifecycle-7 |
| F03-e cashier and manager branch restrictions require an activated QA staff fixture | MOCK OBSERVATION | stores-lifecycle-7 |
| Branch closure and staff-scoping full flow | MOCK OBSERVATION | stores-lifecycle-7 |
| audit Phase 2 write scope and log out QA session | PASS | stores-lifecycle-7 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs stores-lifecycle
node scripts/assess-phase2.mjs stores-lifecycle
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.
