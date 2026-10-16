# Phase 1 execution checklist

These are designed cases, not test results. Use owner/admin for setup, staff for cashier flows, and manager for stock adjustments. Where policy is unresolved, use Blocked rather than Pass. Run every applicable case in English; repeat critical checkout and auth paths in French and supported browser/device profiles.

## P1-001 — Valid sign-in

Requirement: **F24-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Use a dedicated active account; sign in, refresh and open a protected deep link.

Expected: Account reaches its permitted business and stays signed in after refresh.

## P1-002 — Wrong password

Requirement: **F24-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Use a dedicated test account once with a wrong password.

Expected: Clear error; no authenticated session; no sensitive information in message.

## P1-003 — Empty login

Requirement: **F24-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Leave both fields blank and submit.

Expected: Both fields show errors; no login POST is sent.

## P1-004 — Password boundaries

Requirement: **F24-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: In isolated signup/reset flow try 7 chars, missing uppercase, digit or symbol, and an 8-character valid value.

Expected: Checklist and API agree; login still permits nonempty legacy passwords without applying new-password complexity.

## P1-005 — Reset password

Requirement: **F24-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Use test mailbox; request code; try invalid/expired code, then valid code; log in with new password.

Expected: Invalid codes cannot reset; valid code works once; old password rejected. No real user account used.

## P1-006 — Session timeout

Requirement: **F24-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Agree configured inactivity threshold; leave test session idle beyond it; attempt stock change.

Expected: Login required and change not saved; distinguish inactivity timeout from JWT expiry. Requirement pending configuration confirmation.

## P1-007 — Logout and back navigation

Requirement: **F24-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Log out; press Back; reload a protected page.

Expected: No authenticated data or write access after logout.

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

Requirement: **F03-d** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Switch A to B in header; inspect inventory, POS and invoice; refresh.

Expected: Every relevant view uses B; no cached A data shown as B.

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

Requirement: **F12-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create invoice with two units at 100 and valid customer details.

Expected: Persisted lines and totals match; unique invoice number is displayed.

## P1-041 — Number sequencing

Requirement: **F12-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create two invoices, cancel one, then create another.

Expected: Numbers are unique and cancelled number is not reused; confirm permitted gaps.

## P1-042 — Partial payment

Requirement: **F12-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Invoice 200; record 50; refresh; then record remaining 150.

Expected: First paid=50/due=150; then paid=200/due=0; payment status follows balance.

## P1-043 — Due dates

Requirement: **F12-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create due-on-receipt, Net 15 and Net 30 invoices near month boundary.

Expected: Dates match agreed calendar-day rules; due before issue date rejected or logged as requirement gap.

## P1-044 — Lifecycle

Requirement: **F12-d** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create draft, issue, part-pay, settle; exercise permitted cancellation; inspect overdue invoice.

Expected: Document, payment and fulfilment states remain distinct; no invented single combined status enum.

## P1-045 — PDF integrity

Requirement: **F12-e** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Download QA invoice; open and compare with screen.

Expected: Valid PDF, correct number/customer/BRN/VAT/banking details; page breaks do not drop lines.

## P1-046 — Create supplier

Requirement: **F18-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create unique supplier with contacts, BRN and address; reopen.

Expected: Supported fields round-trip without being silently discarded.

## P1-047 — Edit/deactivate supplier

Requirement: **F18-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Update contact info then deactivate a QA supplier.

Expected: Edits persist; existing purchases remain available; inactive supplier is handled consistently.

## P1-048 — Credit terms

Requirement: **F18-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Save Net 30 and credit amount; reopen and select supplier on purchase form.

Expected: Saved terms shown; enforcement beyond specification is not assumed.

## P1-049 — Create customer

Requirement: **F19-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create individual and business with BRN/VAT; reopen both.

Expected: Correct type and identity fields retained; malformed email rejected.

## P1-050 — Edit/archive customer

Requirement: **F19-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Edit QA customer then archive one with prior invoice.

Expected: Historical invoice remains accessible; archived customer absent from active picker.

## P1-051 — Outstanding balance

Requirement: **F19-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Invoice 200, payment 50; view statement and customer balance.

Expected: Outstanding 150; statement links correct invoice and receipt.

## P1-052 — Purchase history

Requirement: **F19-d** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Create one POS sale and one invoice for QA customer; inspect history.

Expected: Both records appear under that customer only; totals reconcile.

## P1-053 — 58mm receipt print

Requirement: **F27-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Print a multi-line receipt on physical 58mm printer.

Expected: No clipping; readable VAT/totals; paper layout correct. Manual hardware check.

## P1-054 — 80mm receipt print

Requirement: **F27-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Print same receipt on physical 80mm printer and cancel a subsequent print dialog.

Expected: Correct layout; cancel does not cancel sale or duplicate payment.

## P1-055 — USB/BT scanner

Requirement: **F27-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Scan same leading-zero barcode with USB and Bluetooth HID devices, including rapid repeated scans.

Expected: Exact barcode captured; expected count; no lost or doubled scan; keyboard remains usable.

## P1-056 — Company legal identity

Requirement: **F28-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Edit QA company BRN/VAT/address as owner; reload; preview invoice.

Expected: Identity persists and renders correctly; unauthorized staff cannot change it.

## P1-057 — MUR formatting

Requirement: **F28-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Inspect 0, 0.01, 1000.50 and large amount in list, POS, invoice and PDF.

Expected: Consistent Rs/MUR and two-decimal accuracy; no currency conversion implied.

## P1-058 — Tax defaults

Requirement: **F28-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Change disposable company's default tax; create new product/sale and reopen old invoice.

Expected: New records use setting as specified; prior invoice tax does not change.

## P1-059 — Themes

Requirement: **F28-d** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Select light/dark/system; inspect forms, dialogs, tables and print preview.

Expected: Readable content and visible focus; preference persists according to account policy.

## P1-060 — English/French

Requirement: **F28-e** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Switch languages; inspect labels, validations and document language, then reload.

Expected: No raw translation keys; intended preference persists; numbers remain accurate.

## P1-061 — Terms access and version

Requirement: **F30-a** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Open Terms from login and in-app help; compare approved text/version.

Expected: Correct accessible document opens; owner/legal reviewer confirms wording. Automation does not certify compliance.

## P1-062 — Privacy access

Requirement: **F30-b** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Open Privacy from login and in-app; use keyboard and mobile view.

Expected: Readable approved policy with correct version; legal approval is a separate prerequisite.

## P1-063 — Build identity

Requirement: **F30-c** · Status: **Not executed**

Preconditions: Dedicated QA business and permitted role; seeded records as described. Mutations only in isolated local/staging environment.

Steps/data: Open version/build surface and compare deployed commit with release record.

Expected: Version identifies actual deployed build; missing surface recorded as gap.

