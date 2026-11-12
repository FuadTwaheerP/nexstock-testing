# System Settings & Localization — Phase 1

Five independent submodules and one integrated flow. Each command signs in with the existing disposable QA account, selects `Nexstock QA Company`, captures a recoverable baseline, and runs teardown. No intentional skips or expected-failure annotations. Failures do not mean every unmet assertion is a confirmed application bug.

Latest validated outcome (21 October 2026): all 18 functional cases executed. Most-recent result per case across the full run and focused corrections: 20 cases including setup/cleanup, 10 passed, 10 failed, no intentional skips; 10 deduplicated confirmed Settings findings. The latest standalone report is the final 3-test Light-mode reproduction (2 passed, 1 failed), not a full-module report. Full, language/theme and reload-readiness archives are linked in the existing settings-failure-tickets.md. Setup and final cleanup pass; the approved BRN baseline is not pending. Earlier Light-mode passes before complete hydration are superseded by SET-010: explicit light preference returns to Dark after reload. Dark mode passes independently.

**Approved QA baseline (20 October 2026):** the user explicitly authorized retaining BRN `QA-BRN-2026` to unblock automation. A one-time adoption validated that every other captured profile/tax/localization/theme value still matched. The original blank-BRN baseline is backed up privately at the path recorded in `brnAcceptance.backup` inside `playwright/.auth/settings-baseline.json`. Never publish either file. This acceptance does not fix or waive SET-002.

The BRN regression explicitly saves a blank BRN and expects blank after reload, then restores the approved non-empty QA value. Normal runs require no approval flag. The one-time `SETTINGS_ACCEPT_QA_BRN` adapter only accepts the exact user-approved value and rejects unrelated changes; it is not a general baseline-reset bypass. Safety tests including adoption and preference safeguards: 58 passed.

Earlier failed-setup report: 2 failed/17 dependency-blocked, archived at `blob-report/archive/settings-before-approved-brn-2026-10-20-233636`. The first post-adoption run passed setup but exceeded the profile test's old 100-second budget during recovery; its cascade is an automation timing issue, not 17 application bugs. Report retained at `blob-report/archive/settings-adoption-timing-fix-2026-10-20-234034`. Tab-only operations no longer reload the whole document; persistence readers still do. Recovery now also has an automatic fixture-teardown backstop if a test times out. See `settings-failure-tickets.md` for the final validated outcome.

| Requirement | Independent script | Command |
|---|---|---|
| F28-a Company Profile & Legal Identity | `company-profile-legal-identity.ui.spec.ts` | `npm run test:settings:company` |
| F28-b Currency & Financial Formatting | `currency-financial-formatting.ui.spec.ts` | `npm run test:settings:currency` |
| F28-c Fiscal Tax Settings | `fiscal-tax-settings.ui.spec.ts` | `npm run test:settings:tax` |
| F28-d Theme Settings | `theme-settings.ui.spec.ts` | `npm run test:settings:theme` |
| F28-e Multi-Language Support | `multi-language-support.ui.spec.ts` | `npm run test:settings:language` |
| Integrated module | `settings-full-flow.ui.spec.ts` | `npm run test:settings:flow` |

## Run and watch

From the repository root in PowerShell:

```powershell
npm.cmd run test:settings -- --headed
npm.cmd run report
```

For only the integrated flow:

```powershell
npm.cmd run test:settings:flow -- --headed
```

Without `--headed`, the same assertions run headlessly. Headed Chromium uses a maximized native window; no fixed viewport/deviceScaleFactor conflict. Do not pass `--no-deps`: authentication and restoration are required. Run with one worker and do not run other settings-changing suites or edit this QA company concurrently.

## Safety and recovery

- Uses ignored `.env` credentials `PRODUCT_TEST_EMAIL`, `PRODUCT_TEST_PASSWORD`, and the existing allowlist/disposable-production write opt-ins. Optional `SETTINGS_TEST_COMPANY` defaults to the Products QA company.
- Only the named disposable company is in scope. No new account, credential/PIN/security/privacy-policy edits, sales, payments or stock writes. Phase 3 backup/export is excluded.
- The app submits bulk settings. The guard checks all unrelated values against the observed Settings GET before allowing a scoped UI save. Only equivalent empty optional `null`/empty-string normalization is tolerated. It never rewrites a functional request to make a test pass.
- Each mutating scenario restores through UI in `finally`. Final teardown re-verifies the baseline. If the app cannot clear BRN, compensation may replay the observed UI save with only BRN replaced by its original blank value (and nullable blank fallback), using the existing QA session; this is recovery, not proof the UI passed. Both routes currently return success without clearing it.
- Private baseline `playwright/.auth/settings-baseline.json` survives a new run. Legacy blank-BRN recovery is not silently accepted. With the explicit BRN acceptance recorded, setup can restore this suite's interrupted mutations to the approved baseline, then audit it before proceeding. Other changes are not adopted as new expectations. Do not delete or publish the baseline or its private backup. Never share `test-results/settings-auth.json` or `.env`.
- HTML/JUnit/screenshots are generated under `playwright-report` and `test-results`; review/redact before sharing because UI screenshots may show QA contact details. `settings-run.json` records request paths, field names and safety decisions, not auth tokens or full API payloads.
- Earlier Hardware report was archived without session state at `blob-report/archive/hardware-before-settings-2026-10-19-235614` before running this module.

## Coverage boundaries

This suite exercises available settings UI and persistence, MUR display, VAT15/disabled settings, theme reload/form focus/table smoke, and English/French navigation/reload. Missing capabilities remain failing contract checks, not intentional skips.

User-confirmed requirements (20 October 2026):

- Tax ID and VAT registration number are separate fields; BRN also remains independent. The VAT capability check first enables VAT registration, so a legitimately conditional field is not falsely ticketed while registration is off.
- `Rs` always prefixes the amount; no symbol-placement selector is required.
- Company settings must allow decimals to be enabled/disabled. Decimals are enabled by default and always use 2dp when enabled; no configurable precision/separator selector is required.

The tests and integrated-flow gates reflect these requirements. Following the explicit BRN-baseline approval, all 18 functional cases plus setup/cleanup were executed on 21 October 2026. MUR, Rs/2dp zero-total display, VAT15/disabled persistence, visible translation and explicit light/dark checks execute independently of missing-capability regressions. The observed Company and Localization screens have no decimal display on/off control (SET-004); actual toggle/save/reload, disabled-decimal output and new-company default validation remain blocked by that missing capability and the need for an approved default-state fixture. Existing QA state alone does not prove the new-company default. See the existing settings-failure-tickets.md for full-run and focused-rerun counts, deduplicated bugs and coverage limitations.

Not certified by this module alone: RBAC/staff edit restrictions (only the approved admin exists), every translated validation/string, visual contrast/accessibility compliance, theme print/PDF layout, arbitrary currency conversions, historical invoice immutability, or tax/formatting on real financial records. These require appropriate isolated fixtures and/or human review. Existing POS/Invoicing bugs must not be bypassed by creating real financial transactions.
