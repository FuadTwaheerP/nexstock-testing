# Help Center, Legal & Compliance - Phase 1 / Round 1

Resumed **25 October 2026** using the developer-readiness response in `data/help-delivery-status.json`. Production target and the existing disposable QA company are unchanged.

## Latest run

`blob-report/archive/help-round1-2026-10-25/help-2`: **12 checks, 4 passed, 8 failed, 0 skipped**. Reviewed classification: **5 failing cases share HELP-001; 3 are prerequisite-blocked**. The four passes include two functional checks and auth setup/logout cleanup. No unresolved automation failures or unexpected business writes remain. This is not a complete legal/release sign-off.

- HELP-001: public Terms/Privacy controls submit the empty login form; desktop pointer and mobile Tab/Enter reproduce the same mechanism.
- Authenticated document availability and active build identity remain blocked/unconfirmed given pending legal/release delivery, not additional confirmed bugs.
- Prior HELP-002/003 remain historical observations, not current confirmed tickets under the developer clarification. Neither is marked fixed or passed.
- The integrated flow attempts every independent step and records both HELP-001 and blockers. A prerequisite failure is kept red with a `PREREQUISITE BLOCKED` annotation, not skipped or made green.

## Independent scripts

| Requirement | Script | Command |
| --- | --- | --- |
| F30-a Terms of Service | `terms-of-service.ui.spec.ts` | `npm.cmd run test:help:terms` |
| F30-b Privacy Policy | `privacy-policy.ui.spec.ts` | `npm.cmd run test:help:privacy` |
| F30-c System Version / Build | `system-version-build.ui.spec.ts` | `npm.cmd run test:help:version` |
| Integrated flow / navigation | `help-full-flow.ui.spec.ts` | `npm.cmd run test:help:flow` |

Each includes authentication, exact QA company selection and logout cleanup. Do not use `--no-deps`. Run with one worker and no concurrent QA session changes. No skip/fixme/only or expected-failure annotations are used.

## Run and inspect

```powershell
node scripts/run-release-retest.mjs help
node scripts/assess-help-run.mjs blob-report/archive/help-round1-2026-10-25/help-2
npm.cmd run test:help -- --headed
npm.cmd run report
```

The isolated runner prints and creates the next `help-N` evidence folder; replace `help-2` in the assessment command with that actual folder. It preserves JSON/JUnit/HTML, screenshots and the safe journal without copying auth state. To open the current isolated HTML report:

```powershell
npx.cmd playwright show-report blob-report/archive/help-round1-2026-10-25/help-2/playwright-report
```

Append `-- --headed` to any npm command to visualize it. Authenticated windows maximize; anonymous desktop is 1440 x 1000 and mobile keyboard cases intentionally use 390 x 844. Headless authenticated runs through the isolated runner use 1920 x 1080.

## What is and is not verified

The suite checks public legal-control behavior, empty-form independence, normal keyboard access, authenticated Help navigation, public copyright/year, and observed document/build surfaces. It does not claim unread document content, focus return or layout passed when an earlier step fails.

Developer response: Terms will be generated after project completion; the production release reference is not ready. An approved Privacy document/version and separate readiness confirmation are still absent. Approved wording/version, legal approval/compliance and comparison to the actual deployed commit remain blocked. No policy, version or commit is guessed. This does not imply the earlier application fixes were rolled back.

Phase 3 searchable knowledge base/video guides and release feeds are out of scope. Editable company policy fields in Settings are not approved platform legal documents. A future PDF-only document needs an inspected document adapter; no HTML-only false failure should be called a PDF content bug.

## Safety and evidence

Uses existing ignored `.env` credentials/production-disposable opt-ins. The guard allows routine own-session login, business selection and logout only; other business/policy writes are blocked. It never accepts agreements, changes credentials, edits company legal text, sends support email, invokes export/health actions or creates transactions. No Settings baseline is recaptured.

Public checks use fresh anonymous contexts with empty fields. Button semantics, submit counts and required-field messages are recorded without credentials. Never share `.env`, `test-results/help-auth.json` or private baselines.

Detailed bug files: `help-failure-tickets.md` (Help only) and `phase1-round1-combined-failure-tickets.md` (the earlier seven failed cases/four tickets plus the Help Round 1 omission). Earlier 21 October evidence and the first 25 October continuation attempt are preserved. Coverage updates use F30-a/b/c and P1-061/062/063 by identity; misplaced Help results on dashboard/product records were corrected and protected by a unit test.
