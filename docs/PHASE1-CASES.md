# Phase 1 execution checklist

Case definitions alone are not execution evidence. Recorded statuses identify executed subsets and outstanding checks; Not executed remains backlog. Use owner/admin for setup, staff for cashier flows, and manager for stock adjustments. Where policy or prerequisites are unresolved, use Blocked rather than Pass. Run every applicable case in English; repeat critical checkout and auth paths in French and supported browser/device profiles.

## P1-001 — Valid sign-in

Requirement: **F24-a** · Status: **Passed - Chromium QA login/refresh/deep link**

Preconditions: Explicitly opted-in disposable QA account/company; production HTTPS and origin/write guards. No account creation, agent credential changes or security policy writes.

Steps/data: Use a dedicated active account; sign in, refresh and open a protected deep link.

Expected: Account reaches its permitted business and stays signed in after refresh.

Automation: tests/phase1/security/secure-authentication-password-policies.ui.spec.ts

## P1-002 — Wrong password

Requirement: **F24-a** · Status: **Passed - one server-rejected wrong password**

Preconditions: Explicitly opted-in disposable QA account/company; production HTTPS and origin/write guards. No account creation, agent credential changes or security policy writes.

Steps/data: Use a dedicated test account once with a wrong password.

Expected: Clear error; no authenticated session; no sensitive information in message.

Automation: tests/phase1/security/secure-authentication-password-policies.ui.spec.ts; no brute force/lockout stress

## P1-003 — Empty login

Requirement: **F24-a** · Status: **Passed - both empty fields rejected locally; no authentication POST**

Preconditions: Explicitly opted-in disposable QA account/company; production HTTPS and origin/write guards. No account creation, agent credential changes or security policy writes.

Steps/data: Leave both fields blank and submit.

Expected: Both fields show errors; no login POST is sent.

Automation: tests/phase1/security/secure-authentication-password-policies.ui.spec.ts; application-origin POST observer excludes telemetry

## P1-004 — Password boundaries

Requirement: **F24-a** · Status: **Failed UI feedback requirements; server enforcement blocked**

Preconditions: Explicitly opted-in disposable QA account/company; production HTTPS and origin/write guards. No account creation, agent credential changes or security policy writes.

Steps/data: Without submitting signup, try 7/8 characters, missing lowercase/uppercase/number, optional symbol and strength progression. Human/backend tests must separately verify server policy.

Expected: Minimum 8 with lowercase, uppercase and number; symbol optional; strength bar strongest with symbol. Server enforcement agrees; not certified by feedback checks.

Automation: tests/phase1/security/secure-authentication-password-policies.ui.spec.ts; no signup or credential mutation

## P1-005 — Reset password

Requirement: **F24-b** · Status: **Partially tested - profile identity defect; human credential workflow blocked**

Preconditions: Explicitly opted-in disposable QA account/company; production HTTPS and origin/write guards. No account creation, agent credential changes or security policy writes.

Steps/data: Automated: reset entry/return, empty/malformed email, untouched update controls and account identity. Human on isolated account: delivery/code lifecycle/reset/update/old-new password checks.

Expected: Invalid codes cannot reset; valid code works once; old password rejected. No real user account used.

Automation: tests/phase1/security/password-reset-update.ui.spec.ts; see module README for human handoff

## P1-006 — Session timeout

Requirement: **F24-c** · Status: **Partially tested - settings gaps; PIN fixture and real-time/unlock checks blocked**

Preconditions: Explicitly opted-in disposable QA account/company; production HTTPS and origin/write guards. No account creation, agent credential changes or security policy writes.

Steps/data: Require user-set onboarding PIN. Read user-configurable inactivity setting without saving; active calibration then 30-minute idle PIN lock and reload check. Verify unlock/locked write protection separately.

Expected: After 30 minutes inactive require PIN, not login/logout; remove Auto-logout; user can configure duration. No lock bypass; distinguish absolute expiry/client-clock simulation.

Automation: tests/phase1/security/session-inactivity-timeout.ui.spec.ts; SECURITY_PIN_PROVISIONED required; clock simulation not real elapsed-time proof

## P1-007 — Logout and back navigation

Requirement: **F24-a** · Status: **Passed - UI logout/back/reload/deep/shared-tab; not server revocation certification**

Preconditions: Explicitly opted-in disposable QA account/company; production HTTPS and origin/write guards. No account creation, agent credential changes or security policy writes.

Steps/data: Log out; press Back; reload a protected page.

Expected: Protected UI reads denied after logout, back/reload/deep link and shared-tab reload. Server write/session-revocation enforcement needs backend coverage.

Automation: tests/phase1/security/secure-authentication-password-policies.ui.spec.ts

## P1-008 — Physical product

Requirement: **F02-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create unique QA SKU with cost 40 and sale price 100; reopen detail.

Expected: Name, SKU, price and inventory flags persist.

## P1-009 — Required and duplicate fields

Requirement: **F02-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Submit blank name/SKU; then reuse another QA SKU and barcode.

Expected: Validation identifies offending field; no duplicate or 500 response.

## P1-010 — Edit product

Requirement: **F02-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Change QA price 100 to 125 and description; save; reload.

Expected: New values persist; historical invoice values stay unchanged.

## P1-011 — Archive referenced product

Requirement: **F02-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Sell a QA product, archive it, then open prior invoice and search active catalogue.

Expected: Prior transaction remains readable; archived item is excluded from active sale selection. Confirm desired archive semantics.

## P1-012 — Independent variants

Requirement: **F02-d** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create red/S and blue/M variants with different SKUs/prices; sell red/S.

Expected: Only selected variant stock decreases; parent and sibling remain unchanged.

## P1-013 — Category hierarchy and tags

Requirement: **F02-e** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create parent and child category; assign product and tag; filter and reopen.

Expected: Correct hierarchy and grouping persist; circular parent choice is rejected or unavailable.

## P1-014 — Barcode matching

Requirement: **F02-f** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Use a barcode with leading zeros; search exact value and then nonexistent value.

Expected: Correct product found; leading zeros preserved; unknown barcode does not add a random item.

## P1-015 — Units of measure

Requirement: **F02-g** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Assign pcs and kg; attempt a 0.5 kg POS quantity.

Expected: Record requirement gap: supplied source POS accepts integers only. Fractional sale acceptance must be agreed before marking this pass.

## P1-016 — VAT classifications

Requirement: **F02-h** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Configure 15%, zero-rated and exempt QA items; sell one of each.

Expected: Each line retains correct classification; tax total agrees with configured pricing mode.

## P1-017 — Inclusive/exclusive tax

Requirement: **F02-h** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Sell quantity 2 at 100 exclusive of 15% VAT; then quantity 2 at 115 inclusive.

Expected: Both totals 230 with tax 30, assuming agreed per-line rounding and no discounts.

## P1-018 — Product image

Requirement: **F02-i** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Upload permitted image; reload; try unsupported type and oversized file.

Expected: Valid image persists; rejected uploads show validation; no broken thumbnails. Record actual size/type limits first.

## P1-019 — Create branch

Requirement: **F03-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create unique branch code with address/phone/timezone using admin account.

Expected: Details persist; branch belongs only to chosen business; quota failures are explicit.

## P1-020 — Edit branch

Requirement: **F03-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Change phone and receipt header details; reload and preview receipt.

Expected: Updated fields persist and receipt uses chosen branch details.

## P1-021 — Branch isolation

Requirement: **F03-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Seed same SKU as A=10 and B=20; sell 2 in A; inspect both.

Expected: A=8 and B=20; totals and movements reference A only.

## P1-022 — Branch switch

Requirement: **F03-d** · Status: **Not applicable**

Developer clarification: A global active-branch selector is not an intended requirement. This case is retained only for traceability and is not part of the Stores automation suite.

## P1-023 — Positive/negative adjustment

Requirement: **F04-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: For new SKU apply +10 then -3 in same branch.

Expected: Stock becomes 10 then 7; one movement per operation.

## P1-024 — Overdraw rejection

Requirement: **F04-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Seed 2 units and request -3.

Expected: Source contract returns INSUFFICIENT_STOCK with 400; stock stays 2.

## P1-025 — Reasons and notes

Requirement: **F04-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Adjust with damage reason and distinctive QA note.

Expected: Reason and note retained with correct product, branch and signed quantity.

## P1-026 — Valuation

Requirement: **F04-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: On empty SKU add 10 at cost 40; remove 3.

Expected: Stock value becomes 400 then 280, subject to average-cost policy; no sale-price valuation.

## P1-027 — Attribution

Requirement: **F04-d** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Save adjustment as a named test user and inspect history.

Expected: Actor, timestamp, before/after quantities and justification match operation.

## P1-028 — POS search and scan

Requirement: **F08-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Search SKU, name and scan barcode with Enter suffix.

Expected: Correct item selected; one scan adds one unit; search results scoped to active branch.

## P1-029 — Product grid

Requirement: **F08-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Select each category and no-match category.

Expected: Tiles belong to category; out-of-stock policy is correctly represented.

## P1-030 — Cart controls

Requirement: **F08-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Add same item twice, reduce quantity, override permitted price, remove line.

Expected: Quantity, subtotal and total recalculate once per action; prohibited override refused.

## P1-031 — Clear cart confirmation

Requirement: **F08-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Build cart; click Clear; cancel; repeat and confirm.

Expected: Cancel preserves lines; confirm empties cart and totals.

## P1-032 — Customer association

Requirement: **F08-d** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Complete separate walk-in and named-customer sales.

Expected: Each receipt and history belong to correct customer; no stale customer between sales.

## P1-033 — Discount arithmetic

Requirement: **F08-e** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Sell 2 x 100 with 10% discount, no VAT; repeat with fixed 20 discount.

Expected: Total 180 in both cases; invalid negative or excessive discount rejected. Discount/tax ordering needs owner confirmation.

## P1-034 — Mixed VAT cart

Requirement: **F08-f** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Use taxed, zero-rated and exempt lines plus discount.

Expected: Line and grand totals match approved rounding rules; invoice agrees with receipt.

## P1-035 — Cash/card/Juice recording

Requirement: **F08-g** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Use sandbox methods for separate sales; inspect invoice and payment ledger.

Expected: Recorded method and reference match; selecting Juice/card does not itself prove real provider settlement.

## P1-036 — Split tender

Requirement: **F08-g** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: On total 200, tender card 150 and cash 100.

Expected: Paid amount 200; change 50; ledger records card 150 + cash 50.

## P1-037 — Cash change

Requirement: **F08-h** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: On total 200 tender 250.

Expected: Change 50; amountPaid 200; revenue is not 250.

## P1-038 — Duplicate checkout

Requirement: **F08-g** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Submit identical client_reference twice against QA SKU stock 10, quantity 2.

Expected: Same invoice ID; one payment; stock 8, never 6.

## P1-039 — Receipt content

Requirement: **F08-i** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Complete QA sale; preview receipt and compare with invoice.

Expected: Items, quantity, discount, VAT, change, business and branch agree; no clipped totals.

## P1-040 — Create invoice

Requirement: **F12-a** · Status: **Attempted — editor calculations and required fields pass; valid save returns server error**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create invoice with two units at 100 and valid customer details.

Expected: Persisted lines and totals match; unique invoice number is displayed.

## P1-041 — Number sequencing

Requirement: **F12-a** · Status: **Automated — blocked by invoice creation failure; sequencing assertions not reached**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create two invoices, cancel one, then create another.

Expected: Numbers are unique and cancelled number is not reused; confirm permitted gaps.

## P1-042 — Partial payment

Requirement: **F12-b** · Status: **Automated — blocked by invoice creation failure; payment assertions not reached**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Invoice 200; record 50; refresh; then record remaining 150.

Expected: First paid=50/due=150; then paid=200/due=0; payment status follows balance.

## P1-043 — Due dates

Requirement: **F12-c** · Status: **Attempted — term controls unavailable; manual persistence blocked; chronology validation requires retest**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create due-on-receipt, Net 15, Net 30 and Net 60 invoices near month boundary.

Expected: Dates match agreed calendar-day rules; due before issue date rejected or logged as requirement gap.

## P1-044 — Lifecycle

Requirement: **F12-d** · Status: **Automated — blocked by invoice creation failure; lifecycle assertions not reached**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create draft, issue, part-pay, settle; exercise permitted cancellation; inspect overdue invoice.

Expected: Document, payment and fulfilment states remain distinct; no invented single combined status enum.

## P1-045 — PDF integrity

Requirement: **F12-e** · Status: **Automated — blocked by invoice creation failure; no PDF generated or visually verified**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Download QA invoice; open and compare with screen.

Expected: Valid PDF, correct number/customer/BRN/VAT/banking details; page breaks do not drop lines.

## P1-046 — Create supplier

Requirement: **F18-a** · Status: **Tested — supported creation/validation; separate optional BRN unavailable**

Preconditions: Disposable QA administrator/account, configured Nexstock QA Company, allowlisted target and explicit write opt-ins. Production requires the dedicated override in the ignored `.env`; never target a real supplier.

Steps/data: Run `npm run test:suppliers:add`. Create/reopen synthetic supplier with contact, address and Tax ID; separately attempt optional BRN. Test name-only creation, missing name, malformed email and cancel.

Expected: Supported fields round-trip. BRN and Tax ID are separate and both optional (user confirmed 18 October 2026). Missing BRN is an ordinary failure, not a skip. This suite uses explicit production/disposable-account opt-ins and Nexstock QA Company only; see `tests/phase1/suppliers/README.md`.

## P1-047 — Edit/deactivate supplier

Requirement: **F18-b** · Status: **Tested — supported edits/optional clearing/status/retention pass; BRN missing**

Preconditions: Same supplier-suite safety controls as P1-046; each test creates its own synthetic supplier and leaves it inactive.

Steps/data: Run `npm run test:suppliers:edit`. Update identity/contact/Tax ID/address, clear optional fields, independently edit/clear BRN, deactivate/filter/reactivate a uniquely created QA supplier.

Expected: Edits persist and cleared optional fields remain blank after reload. Deactivation retains the same profile and status filters agree. Cleanup leaves synthetic vendors inactive, never deleted. Historic purchase retention is not certified: no Phase 2 purchase history is generated by this suite.

## P1-048 — Credit terms

Requirement: **F18-c** · Status: **Tested — Net 15/30/60 pass; negative-period fresh-navigation recheck passes; credit-limit controls unavailable**

Preconditions: Same supplier-suite safety controls as P1-046. Purchase form selection is read-only; do not submit an order, bill or payment.

Steps/data: Run `npm run test:suppliers:terms`. Save/reopen Net 15/30/60 and matching periods, reject negative days, attempt create/edit credit-limit persistence, select active vendor on a purchase form without submitting. Full integrated flow: `npm run test:suppliers:flow`.

Expected: Terms/periods persist and credit limits can be maintained separately from minimum order value. Missing controls fail normally. A fresh-navigation recheck confirms -1 does not persist as an agreed credit period. Negative days remaining on an overdue transaction are a separate, legitimate concept per the user's clarification and are not alleged as a bug here. Order acceptance, credit enforcement, balances and inactive-vendor eligibility policy are not certified by read-only picker checks. Findings: `suppliers-failure-tickets.md`.

## P1-049 — Create customer

Requirement: **F19-a** · Status: **Automated — executed with fiscal-identity gap**

Preconditions: Disposable Nexstock QA Company, permitted QA administrator, configured allowlist/write/disposable-account guards and explicit production opt-in when production is targeted. Synthetic `QA CUST` names and `example.invalid` emails only.

Steps/data: Run `npm run test:customers:add`. Create/reopen Individual and Business contacts with company, email, phone and address; inspect separate BRN/VAT; reject missing name/malformed email; cancel without persisting.

Expected: Supported identity/contact fields persist and invalid/cancelled records do not save. Separate BRN/VAT checks fail normally when fields are absent. This does not impose unconfirmed mandatory/optional identifier policy. Findings: `customers-failure-tickets.md`.

## P1-050 — Edit/archive customer

Requirement: **F19-b** · Status: **Automated — partially verified, failures and history prerequisite blocker**

Preconditions: Same guarded disposable QA company. Each test creates its own customer; draft-history scenario needs an existing QA-prefixed product. More than fifteen records currently exist in the QA company, exercising the late-sorting picker boundary.

Steps/data: Run `npm run test:customers:edit`. Edit all supported fields and type; clear company/phone/address and inspect each independently after reload; deactivate/filter/reactivate; prove active selection before excluding an inactive customer from billing; verify late-sorting active customer selection; attempt draft invoice then archive/history retention.

Expected: Values and inactive status persist; active customer can be selected, inactive cannot; historical reference survives archival. A failed draft save blocks historical retention rather than proving it broken. No Delete action, real payment or email dispatch is used. Cleanup retains saved QA customers inactive.

## P1-051 — Outstanding balance

Requirement: **F19-c** · Status: **Automated — empty-state observations; financial reconciliation blocked by test data**

Preconditions: Same guarded QA company. For non-zero checks provide an independently verified synthetic ledger using CUSTOMER_AR_SEED_PATH; see `tests/phase1/customers/README.md`. Inspection found no suitable existing partially paid/overdue account.

Steps/data: Run `npm run test:customers:balances`. Inspect zero-account balance/aging availability and explicit export empty state. Read-only seeded case: invoice 200, payment 50, expected outstanding 150; verify references, customer balance and the configured overdue bucket.

Expected: Real ledger reconciles independently, not from invented UI-derived expectations. Missing seed is an ordinary TEST DATA BLOCKER failure, not a skip/application bug. Empty-account UI observations do not prove non-zero calculation defects or absence of a populated statement; no specific button label is mandated. Multi-bucket boundary transitions and statement export content are not certified yet.

## P1-052 — Purchase history

Requirement: **F19-d** · Status: **Automated — empty baseline; populated history blocked by document/data prerequisites**

Preconditions: Same guarded QA company and existing QA catalogue item. POS-history check needs an independently verified posReference/customer in CUSTOMER_AR_SEED_PATH; no suitable receipt seed was found in the inspected company.

Steps/data: Run `npm run test:customers:history`. Verify empty invoice history and zero spend; attempt a safe invoice draft and check customer isolation; attempt a quotation draft and look for its actual saved reference; check a read-only seeded POS reference. Integrated attempt: `npm run test:customers:flow`.

Expected: Saved references appear only under their linked customer. Unified history is acceptable; dedicated POS/quotation tabs are not mandatory. Draft-save failures block later assertions, not separate history defects. No actual POS payment or email dispatch occurs. Completed-sale retention, full historical totals and populated POS coverage remain unverified; Phase 3 groups/credit blocking are excluded.

## P1-053 — 58mm receipt print

Requirement: **F27-a** · Status: **Partially automated - width UI; actual receipt/native dialog/physical output blocked**

Preconditions: Opted-in disposable QA company; existing synthetic completed-sale receipt and actual 58mm printer required for physical acceptance. Browser suite never creates a sale or sends paper.

Steps/data: Automate 58mm selection/sample-preview and unsaved baseline checks. With an existing approved QA receipt, validate actual receipt/print adapter. Human prints and checks wrapping, company/reference, quantities/tax/totals and clipping on 58mm paper.

Expected: No clipping; readable VAT/totals; paper layout correct. Manual hardware check.

Automation: tests/phase1/hardware/browser-thermal-printing.ui.spec.ts; HARDWARE_RECEIPT_REFERENCE and genuine physical acceptance evidence required; sample preview is not printed output

## P1-054 — 80mm receipt print

Requirement: **F27-a** · Status: **Partially automated - width UI; native dialog/cancel/physical output blocked**

Preconditions: Opted-in disposable QA company; existing synthetic receipt and actual 80mm printer; native dialog/cancellation must be checked by human.

Steps/data: Automate 80mm selection/sample-preview and discard-unsaved behavior. Human prints the existing receipt on 80mm paper, cancels a further native print dialog and verifies no sale/payment duplication or record change.

Expected: Correct layout; cancel does not cancel sale or duplicate payment.

Automation: tests/phase1/hardware/browser-thermal-printing.ui.spec.ts; intercepted window.print is invocation-only, not native-dialog or paper certification

## P1-055 — USB/BT scanner

Requirement: **F27-b** · Status: **Partially tested - emulated scan duplicate quantity finding; physical USB/Bluetooth unverified**

Preconditions: Existing in-stock QA-prefixed product with persisted leading-zero barcode; enough stock for scenario (no stock mutation). Actual USB/Bluetooth HID devices needed for acceptance.

Steps/data: Automate string-preserving keyboard events plus Enter at 0/5/25ms, exact quantity/line/subtotal, repeated bursts, unknown code, Scan focus and manual-click/keyboard controls. Human repeats with real USB/Bluetooth scanners and records actual counts.

Expected: Exact barcode captured; expected count; no lost or doubled scan; keyboard remains usable.

Automation: tests/phase1/hardware/barcode-scanner-compatibility.ui.spec.ts; hardware-full-flow.ui.spec.ts; key timing is not physical transport proof

## P1-056 — Company legal identity

Requirement: **F28-a** · Status: **Partially tested - profile persistence passes; email, Tax ID, BRN clearing and separate VAT field defects**

Automation: tests/phase1/settings/company-profile-legal-identity.ui.spec.ts; approved QA BRN baseline unblocks execution. Name/phone/address save and restoration pass. SET-001/002/003/008 remain. RBAC and invoice/PDF identity not certified. See settings-failure-tickets.md.

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Edit QA company BRN/VAT/address as owner; reload; preview invoice.

Expected: Identity persists and renders correctly; unauthorized staff cannot change it.

## P1-057 — MUR formatting

Requirement: **F28-b** · Status: **Partially tested - MUR and Rs/2dp zero total pass; decimal control missing**

Automation: tests/phase1/settings/currency-financial-formatting.ui.spec.ts; MUR persistence and fixed Rs prefix/2dp zero-total display pass. SET-004 missing Company decimal toggle blocks on/off persistence and disabled output. Fresh-company default, nonzero financial boundaries and PDF outstanding.

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Inspect 0, 0.01, 1000.50 and a large amount in list, POS, invoice and PDF. Verify the Company decimal default on an approved fresh/default-state fixture; disable/save/reload, re-enable/save/reload, and restore the original setting.

Expected: Rs always prefixes amounts. Company decimals are enabled by default and fixed at 2dp when enabled; they can be disabled. No configurable symbol position/arbitrary precision or currency conversion is implied. Rounding policy is not assumed.

## P1-058 — Tax defaults

Requirement: **F28-c** · Status: **Partially tested - VAT15 and disabled tax persist; pricing mode missing**

Automation: tests/phase1/settings/fiscal-tax-settings.ui.spec.ts; VAT15/default POS rate and disabled-registration persistence pass. SET-005 missing inclusive/exclusive mode; cross-reference Products ticket 10. No real sale or historical-invoice certification.

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Change disposable company's default tax; create new product/sale and reopen old invoice.

Expected: New records use setting as specified; prior invoice tax does not change.

## P1-059 — Themes

Requirement: **F28-d** · Status: **Partially tested - Dark persistence passes; Light reload and System Default defects**

Automation: tests/phase1/settings/theme-settings.ui.spec.ts; Dark reload/focus/table smoke passes. SET-006 missing System Default; SET-010 explicit light preference returns to Dark after same-session reload despite HTTP 200. Fresh-browser startup appearance is restored separately, not treated as company-data drift. Contrast/print/full visual acceptance outstanding.

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Select light/dark/system; inspect forms, dialogs, tables and print preview.

Expected: Readable content and visible focus; preference persists according to account policy.

## P1-060 — English/French

Requirement: **F28-e** · Status: **Partially tested - visible switching and French labels pass; saved-language and HTML-language defects**

Automation: tests/phase1/settings/multi-language-support.ui.spec.ts; English/French switching and translated Company label pass. SET-007 HTML lang remains en in French; SET-009 saved French reverts to English on same-session reload. Reload readiness explicitly awaited; see settings-failure-tickets.md. Full translation/validation and cross-device policy not certified.

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Switch languages; inspect labels, validations and document language, then reload.

Expected: No raw translation keys; intended preference persists; numbers remain accurate.

## P1-061 — Terms access and version

Requirement: **F30-a** · Status: **Partially tested - HELP-001 login-form submission; Terms delivery and approval blocked**

Automation: tests/phase1/help/terms-of-service.ui.spec.ts; 25 Oct 2026: pointer/mobile keyboard reproduce HELP-001. In-app document is unavailable; developer says Terms will be generated after project completion. Reading, focus return and approved wording/version are not passed.

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Open Terms from login and in-app help; compare approved text/version.

Expected: Correct accessible document opens; owner/legal reviewer confirms wording. Automation does not certify compliance.

## P1-062 — Privacy access

Requirement: **F30-b** · Status: **Partially tested - HELP-001 login-form submission; Privacy delivery and approval unconfirmed**

Automation: tests/phase1/help/privacy-policy.ui.spec.ts; 25 Oct 2026: pointer/mobile keyboard reproduce HELP-001. No authenticated platform document entry or approved Privacy version supplied. Availability/approval remains blocked/unconfirmed, not a new confirmed missing-document bug.

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Open Privacy from login and in-app; use keyboard and mobile view.

Expected: Readable approved policy with correct version; legal approval is a separate prerequisite.

## P1-063 — Build identity

Requirement: **F30-c** · Status: **Partially tested - copyright passed; production release identity verification blocked**

Automation: tests/phase1/help/system-version-build.ui.spec.ts; 25 Oct 2026: copyright/year passes. Visible version/commit absent; developer says production release is not ready. No expected release value invented; build verification is blocked, not a confirmed new bug.

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Open version/build surface and compare deployed commit with release record.

Expected: Version identifies actual deployed build; missing surface recorded as gap.

