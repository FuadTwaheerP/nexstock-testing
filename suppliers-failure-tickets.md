# Suppliers & Vendor Management — Findings

Environment: production `https://nexstock.stylotech.mu/app/suppliers`, disposable **Nexstock QA Company**, desktop Chromium. Latest run reviewed: **19 October 2026 (Mauritius, UTC+4)**. Only synthetic QA vendor records are used; no purchase order, bill or payment was submitted.

Latest complete run: **20 tests — 15 passed, 5 failed, 0 skipped, 0 runner errors** (5 minutes 7 seconds). Functional tests: **13 passed / 5 failed**, plus passing authentication and cleanup. This run includes the earlier automation corrections; the negative-period, profile-update and optional-field-clearing checks all pass in this same complete run.

**Review conclusion: no automation error was identified in these five failures.** The failing assertions match the actual Add/Edit Supplier form snapshots: Tax ID is present but BRN is absent; Credit Period and Min Order Value are present but Credit Limit is absent. These are requirement gaps, not a locator mismatch or the earlier loading/search race. No test assertions were weakened, skipped or marked as expected failures, and no test-script changes were needed for this review.

The five failed tests represent **two existing bugs**, not five new bugs:

| Failed test | Existing ticket |
|---|---|
| Add Supplier — stores optional BRN separately from Tax ID | SUP-002 |
| Credit Terms — persists a credit limit when adding a supplier | SUP-001 |
| Credit Terms — persists an edited supplier credit limit | SUP-001 |
| Edit Supplier — edits and clears optional BRN independently of Tax ID | SUP-002 |
| Full flow — configure supplier BRN and credit limit | SUP-001 and SUP-002; one failed test with two assertion errors |

The full-flow report contains only those two missing-control errors. Its supported creation, profile/terms update, active-supplier selection, deactivation and retained-profile checks completed. Final cleanup passed. The module is **not a fully passing sign-off** until the missing capabilities are implemented and their persistence checks can run successfully.

## SUP-001 — Supplier credit limits unavailable

### Title

Suppliers — A credit limit cannot be configured when creating or editing a vendor

### Environment

- Production → Suppliers → New Supplier / Edit Profile.
- URL: `https://nexstock.stylotech.mu/app/suppliers`.
- Workspace: Nexstock QA Company.
- Browser: Chromium.
- Reconfirmed in the complete run dated 19 October 2026 (Mauritius).
- Requirement: **F18-c — Credit Terms & Payment Conditions**: set credit limits and allowed payment periods.

### Priority

Medium — required vendor credit-limit configuration is unavailable.

### Step-by-step

1. Log in as the disposable QA administrator and select Nexstock QA Company.
2. Open **Suppliers → New Supplier**.
3. Enter a unique QA supplier name and reserved test email.
4. Inspect **Commercial Details** and attempt to set a credit limit of Rs10,000.
5. Observe that Payment Terms, Credit Period, Lead Time, Min Order Value, Rating and Currency are available, but no Credit Limit control is exposed.
6. Cancel the unsaved form, then open an existing QA supplier's action menu → **Edit Profile**.
7. Inspect Commercial Details again and attempt to set a credit limit of Rs15,000.
8. After reproduction, retain any newly created QA supplier as Inactive rather than deleting it.

### Expected Result

A supplier credit limit can be entered and maintained, and its value survives saving, reload and reopening. A minimum order value is a separate concept and does not replace the required credit limit.

### Actual Result

Neither Add Supplier nor Edit Supplier exposes a credit-limit control. Both dedicated checks fail because the control is absent; the full flow records the same missing capability. The setting cannot be entered or tested for persistence. Net 15/30/60 terms and corresponding credit periods pass separately in the latest run.

### Attachment

- Add Supplier: `test-results/phase1-suppliers-credit-te-1b99e-a-supplier-phase1-suppliers-chromium-suppliers/test-failed-1.png`.
- Edit Supplier: `test-results/phase1-suppliers-credit-te-40c04-edit-limit-phase1-suppliers-chromium-suppliers/test-failed-1.png`.
- Each directory also contains `error-context.md`.
- Shared full-flow evidence: `test-results/phase1-suppliers-suppliers-52548--phase1-suppliers-full-flow-chromium-suppliers/error-context.md`.
- HTML report: `playwright-report/index.html`.

### Comment

The create-limit, edit-limit and full-flow checks concern the same missing requirement, not three distinct bugs. The current form snapshot lists Credit Period, Lead Time, Min Order Value and Rating, but no Credit Limit field; changing a locator or increasing a timeout would not supply the missing capability. The full flow continues supported steps after recording a soft failure; it does not count the limit as configured. Credit enforcement, purchase acceptance and financial balances are not established by this UI finding.

---

## SUP-002 — Separate optional supplier BRN unavailable

### Title

Suppliers — BRN cannot be entered independently of Tax ID

### Environment

- Production → Suppliers → Add Supplier / Edit Profile.
- URL: `https://nexstock.stylotech.mu/app/suppliers`.
- Workspace: Nexstock QA Company.
- Browser: Chromium.
- Reconfirmed in the complete run dated 19 October 2026 (Mauritius).
- Requirement: **F18-a**, including the user's confirmation on 18 October 2026 that BRN and Tax ID must be separate and both optional.

### Priority

Medium — required supplier identification field is unavailable.

### Step-by-step

1. Log in and select Nexstock QA Company.
2. Open Suppliers → New Supplier.
3. Enter a unique QA supplier name and inspect the identification fields.
4. Attempt to enter a BRN and a different Tax ID in separate fields.
5. Cancel, then open an existing QA supplier → Actions → Edit Profile.
6. Repeat the search for separate BRN and Tax ID controls.

### Expected Result

Add/Edit Supplier provides separate BRN and Tax ID fields. Either or both can be left blank. When supplied, each value saves independently and survives reload; clearing one must not overwrite the other.

### Actual Result

Tax ID is exposed, but no separate BRN field is available in either form. Both dedicated checks fail because BRN is absent; the full flow records the same missing field. Optional name-only creation and clearing Tax ID pass, but BRN entry, editing, clearing and persistence cannot be exercised through the UI.

### Attachment

- Add: `test-results/phase1-suppliers-add-suppl-d24e8-n-creation-phase1-suppliers-chromium-suppliers/test-failed-1.png`.
- Edit: `test-results/phase1-suppliers-edit-deac-06527--of-Tax-ID-phase1-suppliers-chromium-suppliers/test-failed-1.png`.
- Each directory also contains `error-context.md`.
- Shared full-flow evidence: `test-results/phase1-suppliers-suppliers-52548--phase1-suppliers-full-flow-chromium-suppliers/error-context.md`.
- HTML report: `playwright-report/index.html`.

### Comment

This is based on the user's explicit requirement confirmation, not an assumption that Tax ID means BRN. Current form snapshots show Tax ID and VAT Number, but no separate BRN/Business Registration Number control. Create, edit and full-flow BRN failures represent one missing-field finding; they are not separate bugs. Official BRN-format validation is not established by these synthetic tests.

---

## Requirement / policy observations — not confirmed additional bugs

- **Credit days versus overdue days:** the negative-period fresh-navigation check passes in the latest complete run. The user clarified that negative days remaining can legitimately indicate an overdue payment. That transaction-level countdown is distinct from agreed terms and is not certified by this supplier profile suite. Do not file the withdrawn negative-days candidate.
- **Withdrawn edit/clearing candidates:** profile updates and clearing optional fields pass in the latest complete run. The earlier late-search-response and in-memory-state checks were corrected automation issues; no persistence defect is alleged.
- **Historical inactive purchase-form selection observation:** an inactive inspection supplier was previously visible and selectable in the new purchase-order form. This eligibility behaviour was not re-tested in the latest run and no order was submitted. Confirm the intended policy before calling it an enforcement defect; purchase history is Phase 2.
- **Email field marking:** the form says only the name is required while the email label includes an asterisk. Name-only creation is tested against the advertised contract; this label discrepancy is not treated as a blocking creation bug when name-only saving works.

## Test-data handling

Per-test cleanup deactivates this run's QA suppliers, and suite teardown verifies their retained records. No supplier is deleted and no existing real vendor is edited. The preliminary inspection supplier was also left inactive. Company settings, invoice branding, VAT and inventory balances are not changed by this module.

## Run and evidence

```powershell
npm run test:suppliers
npm run test:suppliers -- --headed
npm run report
```

Independent commands and detailed coverage boundaries are in `tests/phase1/suppliers/README.md`. Report artifacts are replaced on rerun; preserve screenshots before filing tickets.

Evidence reviewed: the latest `test-results/junit.xml`, the detailed test results embedded in `playwright-report/index.html`, all five `error-context.md` files, and the latest Add/Edit form screenshots. Attachment paths above point to this latest run, not the obsolete `suppliers-final` or focused-recheck output directories. No new production test run was necessary for this review, and the supplied report was preserved. Do not submit tickets for corrected automation failures.
