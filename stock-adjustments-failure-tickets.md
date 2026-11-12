# Stock Adjustments — Failure Tickets

Production run: 13 functional tests, 10 passed, 3 failed, 0 skipped. Authentication setup passed separately. There are two distinct findings; the full-flow test fails on the same findings.

## SA-001 — Saved adjustment notes cannot be reviewed

### Title

Stock Adjustments — History does not expose saved justification notes

### Environment

- Production: `https://nexstock.stylotech.mu/app/inventory/adjustments`
- Workspace: Nexstock QA Company
- Browser: desktop Chromium
- Test: `retains justification notes for later inspection`

### Priority

Medium — the justification for an inventory change cannot be reviewed by an administrator.

### Step-by-step

1. Log in as an administrator and select Nexstock QA Company.
2. Open Inventory → Stock Adjustments.
3. Click **New Adjustment**.
4. Select a QA branch and a QA product.
5. Enter a unique reason, such as `QA notes reproduction`.
6. Enter quantity `+1`.
7. Enter a distinctive note, such as `One extra unit found during physical count`.
8. Click **Create adjustment** and confirm its completed history row appears.
9. Reload the page, select the same branch and search for the unique reason.
10. Click the history row and attempt to review the saved note.

### Expected Result

The completed adjustment should expose its saved justification notes in a history column, expandable row, or detail view after reload.

### Actual Result

The row shows date, reason, performed-by user, completed status and modified-item count. The saved note is not displayed, and clicking the row does not expose a detail view containing it.

### Attachment

- `test-results/phase1-stock-adjustments-r-6c52e-on-phase1-stock-adjustments-chromium-adjustments/test-failed-1.png`
- `test-results/phase1-stock-adjustments-r-6c52e-on-phase1-stock-adjustments-chromium-adjustments/error-context.md`
- Full-flow reproduction: `test-results/phase1-stock-adjustments-s-19e1f-stock-adjustments-full-flow-chromium-adjustments/test-failed-1.png`

### Comment

Requirement F04-b/P1-025 requires retained notes, and F04-d requires justification evidence. This is an observed UI retrieval failure; the automation does not establish whether notes are missing from the database. The submitted stock adjustment succeeds. Automation creates a compensating adjustment afterward to restore the starting balance.

## SA-002 — Adjustment history lacks movement details

### Title

Stock Adjustments — History does not identify affected SKU or expose movement quantities

### Environment

- Production: `https://nexstock.stylotech.mu/app/inventory/adjustments`
- Workspace: Nexstock QA Company
- Browser: desktop Chromium
- Test: `exposes product, signed quantity and before/after balances for an adjustment`

### Priority

Medium — a completed inventory change cannot be traced to its product and quantities from history.

### Step-by-step

1. Log in as an administrator and select Nexstock QA Company.
2. Open Inventory → Stores and record a QA product's SKU and current quantity in a QA branch.
3. Open Inventory → Stock Adjustments and click **New Adjustment**.
4. Select that branch and product.
5. Enter a unique reason, quantity `+1` and a justification note.
6. Submit the adjustment.
7. Reload Stock Adjustments, select the same branch and search for the reason.
8. Inspect the completed record and click its row to look for additional movement details.
9. Attempt to identify the SKU, signed adjustment quantity, and stock balances before and after the operation.

### Expected Result

The adjustment record or detail view should identify the affected product/SKU, its signed quantity and before/after balances. For an initial balance of `N`, a `+1` adjustment should show `N → N+1` with the selected branch, actor and timestamp.

### Actual Result

The history only shows a count such as **1 product(s)**. It does not identify the SKU or display signed/before/after quantities. Clicking the row does not open a detail view. The automated assertion fails when looking for the recorded SKU.

### Attachment

- `test-results/phase1-stock-adjustments-h-1d113-nt-phase1-stock-adjustments-chromium-adjustments/test-failed-1.png`
- `test-results/phase1-stock-adjustments-h-1d113-nt-phase1-stock-adjustments-chromium-adjustments/error-context.md`
- Full-flow reproduction: `test-results/phase1-stock-adjustments-s-19e1f-stock-adjustments-full-flow-chromium-adjustments/test-failed-1.png`

### Comment

Requirement F04-d/P1-027 requires inspectable movement evidence. Actor, timestamp and completed status pass in a separate test. Signed stock changes and cost valuation also pass through the inventory views; this ticket concerns their absence from the adjustment history. The full-flow failure is a duplicate reproduction, not a third distinct bug.
