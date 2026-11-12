# Feature coverage register

Source: your supplied FEATURES.md. Detailed subfeature phase overrides the executive summary (e.g. supplier transaction history is Phase 2). Phase 2 module cycles were executed and reviewed on 25 October 2026; see [the summary](phase2/SUMMARY.md) for separate findings, blocked prerequisites and mock-only scope. Phase 1/3 history is retained. A registered requirement or completed module cycle is not proof of full feature acceptance.

| ID | Phase | Module | Feature | Status |
|---|---|---|---|---|
| F01-a | 2 | Dashboard & Executive Analytics | KPI Metric Cards | Executed — confirmed defect(s): P2-DASH-001, P2-DASH-003; see scoped results/limits |
| F01-b | 2 | Dashboard & Executive Analytics | Revenue & Sales Velocity Charts | Executed — confirmed defect(s): P2-DASH-002, P2-DASH-003; see scoped results/limits |
| F01-c | 2 | Dashboard & Executive Analytics | Top-Selling & Fast-Moving Products | Executed — confirmed defect(s): P2-DASH-003; see scoped results/limits |
| F01-d | 2 | Dashboard & Executive Analytics | Low Stock Alert Panel | Executed — scoped checks passed; see acceptance limits |
| F01-e | 2 | Dashboard & Executive Analytics | Recent Transaction Feed | Executed — scoped checks passed; see acceptance limits |
| F01-f | 2 | Dashboard & Executive Analytics | Multi-Branch Scope Switcher | Executed — confirmed defect(s): P2-DASH-004; see scoped results/limits |
| F02-a | 1 | Products & Catalog Management | Add Product | Not executed |
| F02-b | 1 | Products & Catalog Management | Edit Product | Not executed |
| F02-c | 1 | Products & Catalog Management | Delete / Archive Product | Not executed |
| F02-d | 1 | Products & Catalog Management | Product Variants & Attributes | Not executed |
| F02-e | 1 | Products & Catalog Management | Categories & Organization | Not executed |
| F02-f | 1 | Products & Catalog Management | Barcode Scanning & Management | Not executed |
| F02-g | 1 | Products & Catalog Management | Units of Measure (UOM) | Not executed |
| F02-h | 1 | Products & Catalog Management | Pricing Rules & Taxes | Not executed |
| F02-i | 1 | Products & Catalog Management | Media & Product Photography | Not executed |
| F02-j | 2 | Products & Catalog Management | Bulk Catalog Operations | Executed — confirmed defect(s): P2-BULK-001, P2-BULK-004; see scoped results/limits |
| F02-k | 3 | Products & Catalog Management | Product Bundles & Kits (BOM / Composite Items) | Not executed |
| F02-l | 3 | Products & Catalog Management | Custom Category Fields | Not executed |
| F03-a | 1 | Stores & Branches (Multi-Location) | Add Branch / Store / Warehouse | Tested — partial pass; branch-level tax registration is missing |
| F03-b | 1 | Stores & Branches (Multi-Location) | Edit Branch Settings | Tested — partial pass; receipt header missing, assigned-register requirement awaiting developer classification |
| F03-c | 1 | Stores & Branches (Multi-Location) | Independent Branch Stock Levels | Tested — passed, including isolated +1/−1 stock mutation and cleanup |
| F03-d | 1 | Stores & Branches (Multi-Location) | Switch Active Branch | Not applicable — developer confirmed no global branch switcher requirement |
| F03-e | 2 | Stores & Branches (Multi-Location) | Branch Staff Assignment | Mock UI only — production account/branch enforcement unverified |
| F03-f | 2 | Stores & Branches (Multi-Location) | Deactivate / Close Branch | Executed — scoped checks passed; see acceptance limits |
| F03-g | 3 | Stores & Branches (Multi-Location) | Comparative Branch Performance Analytics | Not executed |
| F04-a | 1 | Stock Adjustments | Create Stock Adjustment | Tested — passed: positive/negative quantities, overdraw/zero rejection, unchanged other branch |
| F04-b | 1 | Stock Adjustments | Reason Code Tracking | Tested — partial pass: five reasons retained; saved notes not readable in history |
| F04-c | 1 | Stock Adjustments | Inventory Valuation Impact | Tested — passed: +10 and −3 use cost valuation |
| F04-d | 1 | Stock Adjustments | Adjustment History & Audit Trail | Tested — partial pass: actor/timestamp/status pass; SKU and movement details unavailable |
| F04-e | 3 | Stock Adjustments | Multi-Item Batch Adjustment Vouchers | Not executed |
| F05-a | 2 | Stock Transfers (Inter-Branch) | Create Transfer Request | Executed — scoped checks passed; see acceptance limits |
| F05-b | 2 | Stock Transfers (Inter-Branch) | In-Transit Workflow Tracking | Executed — scoped checks passed; see acceptance limits |
| F05-c | 2 | Stock Transfers (Inter-Branch) | Receiving Stock Transfer | Executed — scoped checks passed; see acceptance limits |
| F05-d | 2 | Stock Transfers (Inter-Branch) | Transfer Ledger & Audit History | Executed — scoped checks passed; see acceptance limits |
| F05-e | 3 | Stock Transfers (Inter-Branch) | Printable Dispatch Manifests & Delivery Slips | Not executed |
| F05-f | 3 | Stock Transfers (Inter-Branch) | Transit Damage & Discrepancy Dispute Logging | Not executed |
| F06-a | 2 | Stock Counts (Physical Inventory Audits) | Physical Stock Count Entry | Executed — scoped checks passed; see acceptance limits |
| F06-b | 2 | Stock Counts (Physical Inventory Audits) | Discrepancy & Variance Calculation | Executed — confirmed defect(s): P2-COUNT-002; see scoped results/limits |
| F06-c | 2 | Stock Counts (Physical Inventory Audits) | One-Click Reconciliation | Executed — confirmed defect(s): P2-COUNT-004, P2-COUNT-005; see scoped results/limits |
| F06-d | 3 | Stock Counts (Physical Inventory Audits) | Scheduled Cycle Count Audits by Category | Not executed |
| F06-e | 3 | Stock Counts (Physical Inventory Audits) | Live Barcode Scanner Count Auditing | Not executed |
| F07-a | 3 | Shelf Life & Expiry Tracking (Batches & Lots) | Batch / Lot Number Assignment | Not executed |
| F07-b | 3 | Shelf Life & Expiry Tracking (Batches & Lots) | Expiry Date Tracking | Not executed |
| F07-c | 3 | Shelf Life & Expiry Tracking (Batches & Lots) | Expiry Warning System | Not executed |
| F07-d | 3 | Shelf Life & Expiry Tracking (Batches & Lots) | FIFO / FEFO Inventory Rules | Not executed |
| F07-e | 3 | Shelf Life & Expiry Tracking (Batches & Lots) | Expired Stock Disposal Workflow | Not executed |
| F08-a | 1 | Point of Sale (POS) & Checkout | High-Speed Barcode Scanning & Search | Tested — passed: SKU/name/barcode/no-match; physical scanner not verified |
| F08-b | 1 | Point of Sale (POS) & Checkout | Visual Product Grid | Tested — partial pass: stock policy passes; catalog category ignored |
| F08-c | 1 | Point of Sale (POS) & Checkout | Cart Operations | Tested — partial pass: quantities/removal/totals pass; price override and clear confirmation missing |
| F08-d | 1 | Point of Sale (POS) & Checkout | Customer Linking | Tested — partial pass: walk-in/existing pass; quick-add missing |
| F08-e | 1 | Point of Sale (POS) & Checkout | Discounts & Promotions | Tested — partial pass: cart percentage/amount pass; line controls and invalid-input handling fail |
| F08-f | 1 | Point of Sale (POS) & Checkout | Tax Engine | Tested — partial pass: configured 15% VAT passes; exemption missing |
| F08-g | 1 | Point of Sale (POS) & Checkout | Multi-Tender Payments | Automated — failed/blocked: configured tenders and split controls missing; no completed sale |
| F08-h | 1 | Point of Sale (POS) & Checkout | Change Calculator | Automated — blocked at missing Cash tender; calculator assertions not reached |
| F08-i | 1 | Point of Sale (POS) & Checkout | Thermal Receipt Printing | Automated — blocked at missing Cash tender; receipt/print assertions not reached |
| F08-j | 2 | Point of Sale (POS) & Checkout | Park / Hold Orders | Executed — confirmed defect(s): P2-POS-002; see scoped results/limits |
| F08-k | 2 | Point of Sale (POS) & Checkout | Cash Sale vs Invoice Conversion | Executed — confirmed defect(s): RET-002; see scoped results/limits |
| F08-l | 3 | Point of Sale (POS) & Checkout | Offline Resilience (IndexedDB) | Not executed |
| F08-m | 3 | Point of Sale (POS) & Checkout | Customer Loyalty Points Redemptions at POS | Not executed |
| F09-a | 2 | Cash Register & Shift Management | Open Register / Shift | Executed — scoped checks passed; see acceptance limits |
| F09-b | 2 | Cash Register & Shift Management | Cash In / Cash Out (Pay-Ins & Pay-Outs) | Executed — confirmed defect(s): P2-REG-001; see scoped results/limits |
| F09-c | 2 | Cash Register & Shift Management | Close Register / Shift | Executed — scoped checks passed; see acceptance limits |
| F09-d | 2 | Cash Register & Shift Management | Thermal X-Reports & Z-Reports | Executed — confirmed defect(s): P2-REG-002; see scoped results/limits |
| F09-e | 2 | Cash Register & Shift Management | Shift Reconciliation History | Executed — scoped checks passed; see acceptance limits |
| F10-a | 3 | Orders Queue (Workshop / Kitchen Processing) | Live Order Queue Display | Not executed |
| F10-b | 3 | Orders Queue (Workshop / Kitchen Processing) | Ticket Assignment | Not executed |
| F10-c | 3 | Orders Queue (Workshop / Kitchen Processing) | Kitchen / Work Order Thermal Printing | Not executed |
| F11-a | 2 | Quotations & Cost Estimates | Create Quotation | Executed — confirmed defect(s): P2-QUOTE-001, P2-QUOTE-002; see scoped results/limits |
| F11-b | 2 | Quotations & Cost Estimates | Negotiated Pricing & Commercial Terms | Executed — confirmed defect(s): P2-QUOTE-002; see scoped results/limits |
| F11-c | 2 | Quotations & Cost Estimates | Branded PDF Generation & Printing | Executed — confirmed defect(s): RET-002; see scoped results/limits |
| F11-d | 2 | Quotations & Cost Estimates | Status Pipeline | Executed — confirmed defect(s): P2-QUOTE-001; see scoped results/limits |
| F11-e | 2 | Quotations & Cost Estimates | One-Click Conversion | Executed — confirmed defect(s): P2-QUOTE-001; see scoped results/limits |
| F12-a | 1 | Invoicing & Commercial Sales Billing | Create Tax Invoice | Tested — partial: editor arithmetic/required fields pass; valid save returns server error; customer BRN unavailable |
| F12-b | 1 | Invoicing & Commercial Sales Billing | Installment & Partial Payments | Automated — blocked by invoice creation failure; payment/balance assertions not reached |
| F12-c | 1 | Invoicing & Commercial Sales Billing | Due Dates & Commercial Payment Terms | Tested — terms controls missing; manual due date persistence blocked by creation failure |
| F12-d | 1 | Invoicing & Commercial Sales Billing | Invoice Lifecycle Tracking | Automated — blocked by invoice creation failure; transitions/cancellation/sequencing not reached |
| F12-e | 1 | Invoicing & Commercial Sales Billing | Branded PDF Export & Print | Tested — branding clear persistence fails; PDF/print assertions blocked by invoice creation failure |
| F12-f | 3 | Invoicing & Commercial Sales Billing | Automated Recurring Invoicing | Not executed |
| F12-g | 3 | Invoicing & Commercial Sales Billing | Multi-Currency Billing | Not executed |
| F12-h | 3 | Invoicing & Commercial Sales Billing | Automated Overdue Payment Email Reminders | Not executed |
| F13-a | 2 | Credit Notes | Issue Credit Note | Executed — scoped checks passed; see acceptance limits |
| F13-b | 2 | Credit Notes | Return Reason Logging | Executed — confirmed defect(s): P2-CN-002; see scoped results/limits |
| F13-c | 2 | Credit Notes | Inventory Restock Integration | Executed — confirmed defect(s): P2-CN-003; see scoped results/limits |
| F13-d | 2 | Credit Notes | Credit Allocation | Executed — confirmed defect(s): P2-CN-004; see scoped results/limits |
| F13-e | 2 | Credit Notes | Credit Note PDF Export & Print | Executed — scoped checks passed; see acceptance limits |
| F13-f | 3 | Credit Notes | Standalone Credit Notes without Invoice Link | Not executed |
| F14-a | 3 | Debit Notes | Issue Debit Note | Not executed |
| F14-b | 3 | Debit Notes | Invoice Reference Linking | Not executed |
| F14-c | 3 | Debit Notes | PDF Generation & Dispatch | Not executed |
| F15-a | 2 | Purchasing & Purchase Orders (PO) | Create Purchase Order | Executed — confirmed defect(s): P2-PO-001; see scoped results/limits |
| F15-b | 2 | Purchasing & Purchase Orders (PO) | Status Lifecycle | Executed — confirmed defect(s): P2-PO-001; see scoped results/limits |
| F15-c | 2 | Purchasing & Purchase Orders (PO) | Purchase Order PDF Export | Executed — confirmed defect(s): P2-PO-001; see scoped results/limits |
| F15-d | 2 | Purchasing & Purchase Orders (PO) | Fulfillment Tracking | Executed — confirmed defect(s): P2-PO-001; see scoped results/limits |
| F15-e | 3 | Purchasing & Purchase Orders (PO) | Automated Low-Stock Reordering | Not executed |
| F15-f | 3 | Purchasing & Purchase Orders (PO) | Direct Supplier Email Transmission | Not executed |
| F16-a | 2 | Goods Receipt Notes (GRN) | Receive Goods | Executed — confirmed defects P2-GRN-002 and P2-GRN-003; separate GRN with only supplier/product/quantity mandatory; see limits |
| F16-b | 2 | Goods Receipt Notes (GRN) | Partial Shipment Support | Executed — prerequisite blocked; available scope in module register |
| F16-c | 2 | Goods Receipt Notes (GRN) | Automatic Inventory Increment | Executed — prerequisite blocked; available scope in module register |
| F16-d | 2 | Goods Receipt Notes (GRN) | Damage & Shortage Logging | Executed — prerequisite blocked; available scope in module register |
| F16-e | 3 | Goods Receipt Notes (GRN) | Batch & Expiry Capture at Ingestion | Not executed |
| F17-a | 2 | Bills & Accounts Payable (AP) | Create Vendor Bill | Executed — prerequisite blocked; available scope in module register |
| F17-b | 2 | Bills & Accounts Payable (AP) | Record Bill Payments | Executed — confirmed defect(s): P2-AP-002; see scoped results/limits |
| F17-c | 2 | Bills & Accounts Payable (AP) | Payables Aging & Due Dates | Executed — scoped checks passed; see acceptance limits |
| F17-d | 3 | Bills & Accounts Payable (AP) | 3-Way Reconciliation (PO vs GRN vs Bill) | Not executed |
| F18-a | 1 | Suppliers & Vendor Management | Add Supplier | Tested — creation/contact/address/Tax ID and validation; separate optional BRN unavailable |
| F18-b | 1 | Suppliers & Vendor Management | Edit / Deactivate Supplier | Tested — supported updates, optional-field clearing, status/retention pass; separate BRN unavailable |
| F18-c | 1 | Suppliers & Vendor Management | Credit Terms & Payment Conditions | Tested — Net 15/30/60 pass; negative-period fresh-navigation recheck passes; credit-limit control unavailable |
| F18-d | 2 | Suppliers & Vendor Management | Supplier Transaction History | Executed — confirmed defect(s): P2-SUPH-001; see scoped results/limits |
| F18-e | 3 | Suppliers & Vendor Management | Supplier Product Catalogs & Preferred Vendor SKUs | Not executed |
| F18-f | 3 | Suppliers & Vendor Management | Supplier Account Statement Export | Not executed |
| F19-a | 1 | Customers & Accounts Receivable (AR) | Add Customer | Tested — supported Individual/Business/contact/address and validation; BRN/VAT unavailable |
| F19-b | 1 | Customers & Accounts Receivable (AR) | Edit / Archive Customer | Partially tested — updates/status and active/inactive/late-sorting billing selection pass; optional clearing fails; historical retention blocked by draft save |
| F19-c | 1 | Customers & Accounts Receivable (AR) | Outstanding Balances & Statements | Partially tested — empty-account UI/export checks; non-zero statements, partial-payment arithmetic and aging require verified QA ledger |
| F19-d | 1 | Customers & Accounts Receivable (AR) | Complete Purchase History | Partially tested — empty baseline; populated invoice/quotation history blocked by document prerequisites, POS seed unavailable |
| F19-e | 3 | Customers & Accounts Receivable (AR) | Customer Groups & Tiers (Retail, Wholesale, VIP) | Not executed |
| F19-f | 3 | Customers & Accounts Receivable (AR) | Strict Credit Limit Blocking | Not executed |
| F20-a | 2 | Reports & Business Intelligence | Sales Summary Reports | Executed — confirmed defect(s): P2-REP-001, P2-REP-005; see scoped results/limits |
| F20-b | 2 | Reports & Business Intelligence | Product Sales Performance Reports | Executed — confirmed defect(s): P2-REP-002; see scoped results/limits |
| F20-c | 2 | Reports & Business Intelligence | Inventory Valuation Reports | Executed — prerequisite blocked; available scope in module register |
| F20-d | 2 | Reports & Business Intelligence | Low Stock & Stockout Reports | Executed — confirmed defect(s): P2-REP-003; see scoped results/limits |
| F20-e | 2 | Reports & Business Intelligence | Tax & Fiscal VAT Reports | Executed — confirmed defect(s): P2-REP-004; see scoped results/limits |
| F20-f | 2 | Reports & Business Intelligence | Data Export Formats | Executed — confirmed defect(s): P2-REP-006; see scoped results/limits |
| F20-g | 3 | Reports & Business Intelligence | Gross Profit & Net Margin Deep-Dive | Not executed |
| F20-h | 3 | Reports & Business Intelligence | Stock Movement & Velocity Ledger | Not executed |
| F20-i | 3 | Reports & Business Intelligence | Customer & Supplier Aging Debtors/Creditors Analysis | Not executed |
| F21-a | 3 | Custom Report Builder & Scheduled Delivery | Visual Custom Report Builder | Not executed |
| F21-b | 3 | Custom Report Builder & Scheduled Delivery | Saved Report Templates | Not executed |
| F21-c | 3 | Custom Report Builder & Scheduled Delivery | Automated Scheduled Reports via Cron Email | Not executed |
| F22-a | 2 | Document Builder & Visual Template Designer | Brand Theme Customization | Executed — confirmed defect(s): P2-DOC-001, P2-DOC-004; see scoped results/limits |
| F22-b | 2 | Document Builder & Visual Template Designer | Header & Footer Notes | Executed — scoped checks passed; see acceptance limits |
| F22-c | 2 | Document Builder & Visual Template Designer | Standard Template Presets | Executed — prerequisite blocked; available scope in module register |
| F22-d | 2 | Document Builder & Visual Template Designer | Real-Time Document Preview | Executed — confirmed defect(s): P2-DOC-004; see scoped results/limits |
| F22-e | 3 | Document Builder & Visual Template Designer | Drag-and-Drop Visual Canvas Designer | Not executed |
| F22-f | 3 | Document Builder & Visual Template Designer | Custom Font Upload & Management | Not executed |
| F23-a | 2 | Users, Roles & Access Control (RBAC) | Invite / Add Users | Mock UI only — production account/branch enforcement unverified |
| F23-b | 2 | Users, Roles & Access Control (RBAC) | Edit User Profiles & Password Reset | Mock UI only — production account/branch enforcement unverified |
| F23-c | 2 | Users, Roles & Access Control (RBAC) | Deactivate / Revoke User Access | Mock UI only — production account/branch enforcement unverified |
| F23-d | 2 | Users, Roles & Access Control (RBAC) | Built-In Predefined Roles | Executed — live role choices passed; permission enforcement unverified |
| F23-e | 2 | Users, Roles & Access Control (RBAC) | Branch-Level Scoping | Mock UI only — production account/branch enforcement unverified |
| F23-f | 3 | Users, Roles & Access Control (RBAC) | Granular Custom Permission Matrix Builder | Not executed |
| F24-a | 1 | Security, Sessions & Authentication | Secure Authentication & Password Policies | Partially tested: auth/client feedback; UI gaps; bcrypt/server policy evidence outstanding |
| F24-b | 1 | Security, Sessions & Authentication | Password Reset & Update | Partially tested: reset entry/validation and masked controls; identity defect; full credential/admin workflow blocked |
| F24-c | 1 | Security, Sessions & Authentication | Session Inactivity Timeout | Partially tested: settings UI gaps; 30-minute PIN lock/onboarding fixture and real-time/unlock/API protection outstanding |
| F24-d | 3 | Security, Sessions & Authentication | Two-Factor Authentication (2FA / TOTP) | Not executed |
| F24-e | 3 | Security, Sessions & Authentication | Backup Recovery Codes | Not executed |
| F24-f | 3 | Security, Sessions & Authentication | Remote Active Session Revocation | Not executed |
| F25-a | 2 | Audit Logs & System Activity | Comprehensive Activity Stream | Executed — confirmed defect(s): P2-AUD-003; see scoped results/limits |
| F25-b | 2 | Audit Logs & System Activity | Filtering & Search | Executed — confirmed defect(s): P2-AUD-001, P2-AUD-004; see scoped results/limits |
| F25-c | 3 | Audit Logs & System Activity | Before-and-After Value Diffs | Not executed |
| F25-d | 3 | Audit Logs & System Activity | Compliance Export (CSV/JSON) | Not executed |
| F26-a | 3 | Integrations, REST API & Webhooks | API Key Management | Not executed |
| F26-b | 3 | Integrations, REST API & Webhooks | Scoped Permissions per Key | Not executed |
| F26-c | 3 | Integrations, REST API & Webhooks | Full RESTful API Documentation | Not executed |
| F26-d | 3 | Integrations, REST API & Webhooks | Real-Time Webhooks | Not executed |
| F26-e | 3 | Integrations, REST API & Webhooks | Webhook Delivery Logs & Manual Retries | Not executed |
| F27-a | 1 | Hardware & Printer Configuration | Browser-Based Thermal Printing | Partially tested: 58/80mm UI previews and unsaved configuration; real-receipt print blocked by missing QA receipt, native dialog/paper acceptance unverified |
| F27-b | 1 | Hardware & Printer Configuration | Barcode Scanner Compatibility | Partially tested: HID emulation detects duplicate customization quantity after Enter; unknown-input/focus checks; actual USB/Bluetooth acceptance unverified |
| F27-c | 3 | Hardware & Printer Configuration | Direct ESC/POS Network & Serial Drivers | Not executed |
| F27-d | 3 | Hardware & Printer Configuration | Cash Drawer RJ11 Auto-Kick Pulse | Not executed |
| F27-e | 3 | Hardware & Printer Configuration | Adhesive Barcode Label Roll Printers | Not executed |
| F28-a | 1 | System Settings & Localization | Company Profile & Legal Identity | Partially tested - profile persistence passes; email, Tax ID, BRN clearing and separate VAT field defects; see settings-failure-tickets.md for execution and coverage boundaries |
| F28-b | 1 | System Settings & Localization | Currency & Financial Formatting | Partially tested - MUR and Rs/2dp zero total pass; decimal control missing; see settings-failure-tickets.md for execution and coverage boundaries |
| F28-c | 1 | System Settings & Localization | Fiscal Tax Settings | Partially tested - VAT15 and disabled tax persist; pricing mode missing; see settings-failure-tickets.md for execution and coverage boundaries |
| F28-d | 1 | System Settings & Localization | Theme Settings | Partially tested - Dark persistence passes; Light reload and System Default defects; see settings-failure-tickets.md for execution and coverage boundaries |
| F28-e | 1 | System Settings & Localization | Multi-Language Support (i18n) | Partially tested - visible switching and French labels pass; saved-language and HTML-language defects; see settings-failure-tickets.md for execution and coverage boundaries |
| F28-f | 3 | System Settings & Localization | Automated Database Backup & JSON Dump Export | Not executed |
| F29-a | 2 | Notifications & Alerts Center | In-App Notification Center | Executed — scoped checks passed; see acceptance limits |
| F29-b | 2 | Notifications & Alerts Center | Low Stock & Out-of-Stock Alerts | Executed — scoped checks passed; see acceptance limits |
| F29-c | 2 | Notifications & Alerts Center | Overdue Invoice Alerts | Executed — confirmed defect(s): P2-NOT-002; see scoped results/limits |
| F29-d | 3 | Notifications & Alerts Center | Outgoing Email & SMS Gateway Delivery | Not executed |
| F30-a | 1 | Help Center, Legal & Compliance | Terms of Service | Partially tested - HELP-001 login-form submission; Terms delivery and approval blocked; 25 Oct 2026; see help-failure-tickets.md |
| F30-b | 1 | Help Center, Legal & Compliance | Privacy Policy | Partially tested - HELP-001 login-form submission; Privacy delivery and approval unconfirmed; 25 Oct 2026; see help-failure-tickets.md |
| F30-c | 1 | Help Center, Legal & Compliance | System Version & Build Information | Partially tested - copyright passed; production release identity verification blocked; 25 Oct 2026; see help-failure-tickets.md |
| F30-d | 3 | Help Center, Legal & Compliance | Interactive Searchable Knowledge Base & Video Guides | Not executed |
| F30-e | 3 | Help Center, Legal & Compliance | System Changelog & Release Notes Feed | Not executed |
