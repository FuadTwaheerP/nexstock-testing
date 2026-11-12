# Stores & Branches — Failure Tickets

Generated from the latest production Playwright run on 17 October 2026.

---

## 1. Branch-level tax registration cannot be configured

### Title

Stores — Branch-level tax registration field is missing from Add/Edit Store

### Environment

- Environment: Production
- Application: NexStock
- URL: `https://nexstock.stylotech.mu/app/stores`
- Company/workspace: Nexstock QA Company
- Browser: Chromium desktop
- Automation test: `captures branch tax registration details @phase1 @stores`

### Priority

High — Phase 1 requirement; affects companies whose branches use different tax registrations.

### Step-by-step

1. Sign in to NexStock with an administrator account.
2. Select **Nexstock QA Company**.
3. Open **Inventory → Stores**.
4. Click **New Store**.
5. Review every field in the **Add New Store Branch** dialog.
6. Enter the available branch information.
7. Attempt to configure a tax registration, BRN, VAT registration, or an option to inherit the company's registration.
8. Alternatively, open an existing branch and click **Edit Store**.
9. Attempt to configure or review that branch's tax registration.

### Expected Result

The branch form should allow the administrator to choose whether the branch:

- inherits the company's tax registration; or
- uses a different branch-specific tax registration.

When a branch-specific registration is selected, the relevant BRN/VAT details should be editable, saved, and displayed again when the branch is reopened.

### Actual Result

The Add Store and Edit Store dialogs only provide store name, code, branch type, status, phone, email, and address. There is no tax registration, BRN, VAT, or company-registration inheritance control.

### Attachment

- `test-results/phase1-stores-add-branch.u-8cd34-ation-details-phase1-stores-chromium-stores/test-failed-1.png`
- `test-results/phase1-stores-add-branch.u-8cd34-ation-details-phase1-stores-chromium-stores/error-context.md`

### Comment

The developer clarified that a company may use one tax registration across every branch or different registrations for individual branches. Therefore, the branch form needs an inheritance/override model; relying only on the company-level registration does not cover both cases.

---

## 2. Branch receipt-header settings are unavailable

### Title

Stores — Receipt header cannot be configured for an individual branch

### Environment

- Environment: Production
- Application: NexStock
- URL: `https://nexstock.stylotech.mu/app/stores`
- Company/workspace: Nexstock QA Company
- Browser: Chromium desktop
- Automation test: `updates branch receipt header details @phase1 @stores`

### Priority

High — Phase 1 requirement; branch receipts cannot display location-specific information.

### Step-by-step

1. Sign in to NexStock with an administrator account.
2. Select **Nexstock QA Company**.
3. Open **Inventory → Stores**.
4. Choose any existing branch.
5. Click **Edit Store**.
6. Review all available branch settings.
7. Attempt to enter a branch-specific receipt header, such as the branch name, address, or customer message.
8. Attempt to save and reopen the branch to verify that the receipt header persists.

### Expected Result

The Edit Store dialog should provide a receipt-header setting for the selected branch. The administrator should be able to save the value, reopen the branch and see the saved value, and have it used on receipts issued by that branch.

### Actual Result

The Edit Store dialog has no receipt-header field or related receipt customization section. A branch-specific receipt header cannot be entered, saved, or verified.

### Attachment

- `test-results/phase1-stores-edit-branch--041ca-eader-details-phase1-stores-chromium-stores/test-failed-1.png`
- `test-results/phase1-stores-edit-branch--041ca-eader-details-phase1-stores-chromium-stores/error-context.md`

### Comment

The company-level **Invoice Header** under Settings is not equivalent to a branch-specific receipt header. This ticket concerns receipts produced by an individual store location.

---

## 3. Registers cannot be assigned to a branch

### Title

Stores — Assigned-register controls are missing from branch settings

### Environment

- Environment: Production
- Application: NexStock
- URL: `https://nexstock.stylotech.mu/app/stores`
- Company/workspace: Nexstock QA Company
- Browser: Chromium desktop
- Automation test: `assigns registers to a branch @phase1 @stores`

### Priority

Pending product classification — suggested Medium until the intended register model is confirmed.

### Step-by-step

1. Sign in to NexStock with an administrator account.
2. Select **Nexstock QA Company**.
3. Open **Inventory → Stores**.
4. Choose any existing branch.
5. Click **Edit Store**.
6. Review all available branch settings.
7. Attempt to select or assign one or more cash registers/POS terminals to the branch.
8. Open **Cash Register** and look for a branch or register-assignment configuration.

### Expected Result

If assigned registers are part of the Phase 1 branch requirements, the administrator should be able to select the registers belonging to the branch. The saved assignment should identify which branch owns each register and should be available to register-shift and transaction workflows.

### Actual Result

The Edit Store dialog contains no assigned-register control. The Cash Register page exposes the register-shift workflow but no register record or branch-assignment configuration.

### Attachment

- `test-results/phase1-stores-edit-branch--32b3a-s-to-a-branch-phase1-stores-chromium-stores/test-failed-1.png`
- `test-results/phase1-stores-edit-branch--32b3a-s-to-a-branch-phase1-stores-chromium-stores/error-context.md`

### Comment

This failure still requires developer/product classification. Confirm whether NexStock supports separate register/POS terminal records assigned to branches. If registers are company-level or planned for a later phase, the Phase 1 requirement and this automated test should be revised rather than logging a product bug.

