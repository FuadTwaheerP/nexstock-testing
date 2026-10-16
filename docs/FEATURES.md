# NexStock — Complete Features & Subfeatures Specification

> **QA Testing Priority Legend (3-Phase Framework):**\
> 🔴 **Phase 1 — Critical MVP (P1 / Must Have):** Foundational, mission-critical features that must pass QA first before any initial deployment.\
> 🟡 **Phase 2 — Secondary Core (P2 / Should Have):** Essential commercial operations, cash control, purchasing, and reporting to be tested in the second pass.\
> 🟢 **Phase 3 — Extended & Advanced (P3 / Nice to Have):** Advanced automation, integrations, complex logistics, and post-launch enhancements tested in the third pass.

---

## Executive QA Testing Matrix

| **#**  | **Module / Domain**            | **Testing Phase** | **Priority Scope Summary**                                                                |
| ------ | ------------------------------ | :---------------: | ----------------------------------------------------------------------------------------- |
| **1**  | **Dashboard & Analytics**      |     🟡 Phase 2    | KPI cards, revenue graphs, top-selling items, low stock alerts, branch filter             |
| **2**  | **Products & Catalog**         |     🔴 Phase 1    | Add/Edit/Delete products, variants, categories, barcode scan/input, VAT rates             |
| **3**  | **Stores & Branches**          |     🔴 Phase 1    | Add/Edit branch, header branch switcher, isolated inventory levels                        |
| **4**  | **Stock Adjustments**          |     🔴 Phase 1    | Manual +/- adjustments, reason codes (damage/theft/count), instant balance update         |
| **5**  | **Stock Transfers**            |     🟡 Phase 2    | Inter-branch transfer requests, status flow (Pending/Transit/Received), ledger            |
| **6**  | **Stock Counts & Audits**      |     🟡 Phase 2    | Physical stock count entry, discrepancy variance calculation, auto-reconciliation         |
| **7**  | **Shelf Life & Expiry**        |     🟢 Phase 3    | Batch/Lot number tracking, expiration date warnings, FIFO picking, disposal               |
| **8**  | **Point of Sale (POS)**        |     🔴 Phase 1    | Barcode scan, live search, cart ops, cash/card/Juice, split payment, thermal receipt      |
| **9**  | **Cash Register & Shifts**     |     🟡 Phase 2    | Open shift float, cash in/out, close shift variance, X-report & Z-report print            |
| **10** | **Order Queue / Tickets**      |     🟢 Phase 3    | Kitchen/workshop order queue display, status progression, ticket assignment               |
| **11** | **Quotations & Estimates**     |     🟡 Phase 2    | Create/Edit quote, branded PDF export, status lifecycle, 1-click convert to invoice       |
| **12** | **Invoicing & Billing**        |     🔴 Phase 1    | Create tax invoice, sequential numbering, partial payments, status lifecycle, PDF invoice |
| **13** | **Credit Notes**               |     🟡 Phase 2    | Issue credit note from invoice, restock inventory option, credit refund/balance, PDF      |
| **14** | **Debit Notes**                |     🟢 Phase 3    | Supplemental debit adjustments, freight/service additions against invoices                |
| **15** | **Purchase Orders (PO)**       |     🟡 Phase 2    | Create PO, supplier selection, unit cost, status flow, PDF PO export                      |
| **16** | **Goods Receiving (GRN)**      |     🟡 Phase 2    | Receive items against PO, partial delivery, auto-increment warehouse stock                |
| **17** | **Bills & Accounts Payable**   |     🟡 Phase 2    | Supplier bill creation, payment recording (Bank/Cash/Check), payables tracking            |
| **18** | **Suppliers & Vendors**        |     🔴 Phase 1    | Add/Edit/Delete supplier, BRN/contact info, transaction history ledger                    |
| **19** | **Customers & Accounts Rec.**  |     🔴 Phase 1    | Add/Edit/Delete customer, BRN/VAT, outstanding balance, purchase history                  |
| **20** | **Reports & Business BI**      |     🟡 Phase 2    | Sales summary, product sales, inventory valuation, VAT report, CSV/PDF export             |
| **21** | **Custom Report Builder**      |     🟢 Phase 3    | Visual drag-and-drop report builder, saved query templates, cron scheduled emails         |
| **22** | **Document & Template Design** |     🟡 Phase 2    | Upload company logo, brand colors, invoice header/footer notes, standard templates        |
| **23** | **Users, Roles & RBAC**        |     🟡 Phase 2    | Invite/Add user, Admin/Manager/Cashier roles, branch restriction, deactivate user         |
| **24** | **Security & Authentication**  |     🔴 Phase 1    | Secure login, password reset/change, session timeouts *(2FA is Phase 3)*                  |
| **25** | **Audit Trail & Activity Log** |     🟡 Phase 2    | System activity stream (Create/Update/Delete actions), user & date filter                 |
| **26** | **API & Webhooks**             |     🟢 Phase 3    | Developer API keys, scoped endpoint permissions, webhooks & delivery logs                 |
| **27** | **Hardware & Peripherals**     |     🔴 Phase 1    | Browser thermal receipt print (58mm/80mm), USB/BT barcode scanner input                   |
| **28** | **Settings & Localization**    |     🔴 Phase 1    | Company profile (BRN/VAT), currency (MUR), VAT rates (15%), Light/Dark mode               |
| **29** | **Notifications Center**       |     🟡 Phase 2    | In-app notification drawer, low-stock alerts, overdue payment notices                     |
| **30** | **Legal, Help & Compliance**   |     🔴 Phase 1    | MIPS-compliant Terms of Service, Privacy Policy (DPA 2017/GDPR), version info             |

---

## Detailed Hierarchical Features Specification

### 1. Dashboard & Executive Analytics 🟡 [Phase 2]

- 🟡 **a. KPI Metric Cards**
  - 🟡 Real-time revenue & sales volume
  - 🟡 Gross profit & net margin calculations
  - 🟡 Total order count & average order value (AOV)
  - 🟡 Low-stock & out-of-stock summary count badges
- 🟡 **b. Revenue & Sales Velocity Charts**
  - 🟡 Daily, weekly, and monthly sales trends graph
  - 🟢 Period-over-period comparative analytics *(Phase 3)*
- 🟡 **c. Top-Selling & Fast-Moving Products**
  - 🟡 Top items ranked by quantity sold and revenue generated
- 🟡 **d. Low Stock Alert Panel**
  - 🟡 Quick-action list of SKUs that breached reorder thresholds
- 🟡 **e. Recent Transaction Feed**
  - 🟡 Live stream of POS checkouts, invoices, and stock movements
- 🟡 **f. Multi-Branch Scope Switcher**
  - 🟡 Aggregate company-wide metrics or isolate individual branches

---

### 2. Products & Catalog Management 🔴 [Phase 1]

- 🔴 **a. Add Product**
  - 🔴 Product title, SKU, barcode, category, description
  - 🔴 Cost price, standard selling price, wholesale price
  - 🔴 Standard inventory items, basic variants, service/labor items
  - 🟢 Complex assembly bundles and serialized units *(Phase 3)*
- 🔴 **b. Edit Product**
  - 🔴 Update product information, prices, tax classifications, and barcodes
- 🔴 **c. Delete / Archive Product**
  - 🔴 Soft-deletion and archiving to preserve historical sales records
- 🔴 **d. Product Variants & Attributes**
  - 🔴 Multiple options (Size, Color, Material) with independent SKUs and prices
- 🔴 **e. Categories & Organization**
  - 🔴 Multi-level category hierarchy and tag grouping
- 🔴 **f. Barcode Scanning & Management**
  - 🔴 Barcode scanner instant lookup and manual barcode entry
- 🔴 **g. Units of Measure (UOM)**
  - 🔴 Pieces (pcs), boxes, kg, meters, liters
- 🔴 **h. Pricing Rules & Taxes**
  - 🔴 Standard VAT 15%, Zero-Rated (0%), and Exempt flags
  - 🔴 Tax-inclusive vs. tax-exclusive pricing toggle
- 🔴 **i. Media & Product Photography**
  - 🔴 Upload and display product photos
- 🟡 **j. Bulk Catalog Operations** *(Phase 2)*
  - 🟡 CSV product mass import and catalog export
- 🟢 **k. Product Bundles & Kits (BOM / Composite Items)** *(Phase 3)*
  - 🟢 Multi-component bundles with auto-deduction of sub-items
- 🟢 **l. Custom Category Fields** *(Phase 3)*
  - 🟢 User-defined dynamic attributes per category

---

### 3. Stores & Branches (Multi-Location) 🔴 [Phase 1]

- 🔴 **a. Add Branch / Store / Warehouse**
  - 🔴 Branch code, tax registration, address, and contact details
- 🔴 **b. Edit Branch Settings**
  - 🔴 Contact info, receipt header details, assigned registers
- 🔴 **c. Independent Branch Stock Levels**
  - 🔴 Separate, isolated inventory counts per location
- 🔴 **d. Switch Active Branch**
  - 🔴 Global branch selector in top header to toggle views
- 🟡 **e. Branch Staff Assignment** *(Phase 2)*
  - 🟡 Restrict cashiers and managers to specific locations
- 🟡 **f. Deactivate / Close Branch** *(Phase 2)*
  - 🟡 Safe archiving of store locations
- 🟢 **g. Comparative Branch Performance Analytics** *(Phase 3)*

---

### 4. Stock Adjustments 🔴 [Phase 1]

- 🔴 **a. Create Stock Adjustment**
  - 🔴 Manual positive (+) or negative (-) quantity adjustments
- 🔴 **b. Reason Code Tracking**
  - 🔴 Damaged stock, shrinkage, theft, expired lot, opening balance correction
- 🔴 **c. Inventory Valuation Impact**
  - 🔴 Immediate calculation and updating of stock-on-hand value
- 🔴 **d. Adjustment History & Audit Trail**
  - 🔴 User attribution, timestamp, and justification notes
- 🟢 **e. Multi-Item Batch Adjustment Vouchers** *(Phase 3)*

---

### 5. Stock Transfers (Inter-Branch) 🟡 [Phase 2]

- 🟡 **a. Create Transfer Request**
  - 🟡 Source branch to destination branch stock movement
- 🟡 **b. In-Transit Workflow Tracking**
  - 🟡 Status progression: Draft → In Transit → Received
- 🟡 **c. Receiving Stock Transfer**
  - 🟡 Accept shipments; instant stock decrement at source and increment at destination
- 🟡 **d. Transfer Ledger & Audit History**
  - 🟡 Full history of completed and pending transfers
- 🟢 **e. Printable Dispatch Manifests & Delivery Slips** *(Phase 3)*
- 🟢 **f. Transit Damage & Discrepancy Dispute Logging** *(Phase 3)*

---

### 6. Stock Counts (Physical Inventory Audits) 🟡 [Phase 2]

- 🟡 **a. Physical Stock Count Entry**
  - 🟡 Input counted quantity against system-recorded stock
- 🟡 **b. Discrepancy & Variance Calculation**
  - 🟡 Automated calculation of surplus, shortage, and variance value
- 🟡 **c. One-Click Reconciliation**
  - 🟡 Auto-generate stock adjustments to match physical counts
- 🟢 **d. Scheduled Cycle Count Audits by Category** *(Phase 3)*
- 🟢 **e. Live Barcode Scanner Count Auditing** *(Phase 3)*

---

### 7. Shelf Life & Expiry Tracking (Batches & Lots) 🟢 [Phase 3]

- 🟢 **a. Batch / Lot Number Assignment**
  - Capture manufacturer lot numbers during purchase receiving
- 🟢 **b. Expiry Date Tracking**
  - Track expiration dates per inventory lot
- 🟢 **c. Expiry Warning System**
  - Visual indicators for items nearing expiration
- 🟢 **d. FIFO / FEFO Inventory Rules**
  - Automatic picking priority enforcement
- 🟢 **e. Expired Stock Disposal Workflow**
  - Formal disposal write-off with supervisor authorization

---

### 8. Point of Sale (POS) & Checkout 🔴 [Phase 1]

- 🔴 **a. High-Speed Barcode Scanning & Search**
  - 🔴 USB/BT barcode scanner input and instant keyword search
- 🔴 **b. Visual Product Grid**
  - 🔴 Category navigation tabs and color-coded product tiles
- 🔴 **c. Cart Operations**
  - 🔴 Instant quantity increments, price overrides, and line-item removals
  - 🔴 Clear cart button with confirmation
- 🔴 **d. Customer Linking**
  - 🔴 Walk-in customer default, existing customer lookup, or quick-add
- 🔴 **e. Discounts & Promotions**
  - 🔴 Line-item percentage/amount discounts, overall cart-level discount
- 🔴 **f. Tax Engine**
  - 🔴 Automatic 15% VAT calculation with tax-exempt toggles
- 🔴 **g. Multi-Tender Payments**
  - 🔴 Cash, Credit/Debit Cards, MCB Juice, Bank Transfer, Split tenders
- 🔴 **h. Change Calculator**
  - 🔴 Automatic change due display on cash transactions
- 🔴 **i. Thermal Receipt Printing**
  - 🔴 58mm / 80mm thermal receipt preview and print dialog
- 🟡 **j. Park / Hold Orders** *(Phase 2)*
  - 🟡 Hold current cart and resume held carts seamlessly
- 🟡 **k. Cash Sale vs Invoice Conversion** *(Phase 2)*
  - 🟡 Instant receipt or full formal A4 Tax Invoice generation
- 🟢 **l. Offline Resilience (IndexedDB)** *(Phase 3)*
  - Process sales during internet drops; background synchronization
- 🟢 **m. Customer Loyalty Points Redemptions at POS** *(Phase 3)*

---

### 9. Cash Register & Shift Management 🟡 [Phase 2]

- 🟡 **a. Open Register / Shift**
  - 🟡 Enter opening cash float amount
- 🟡 **b. Cash In / Cash Out (Pay-Ins & Pay-Outs)**
  - 🟡 Petty cash disbursements and cash additions with reason notes
- 🟡 **c. Close Register / Shift**
  - 🟡 Physical cash count entry, automated expected vs. actual variance calculation
- 🟡 **d. Thermal X-Reports & Z-Reports**
  - 🟡 Print mid-shift summary (X-Report) and end-of-day closure (Z-Report)
- 🟡 **e. Shift Reconciliation History**
  - 🟡 Complete log of past cashier shifts and variances

---

### 10. Orders Queue (Workshop / Kitchen Processing) 🟢 [Phase 3]

- 🟢 **a. Live Order Queue Display**
  - Visual states: New → Preparing/In Progress → Ready → Completed
- 🟢 **b. Ticket Assignment**
  - Link orders to technicians, service bays, or tables
- 🟢 **c. Kitchen / Work Order Thermal Printing**

---

### 11. Quotations & Cost Estimates 🟡 [Phase 2]

- 🟡 **a. Create Quotation**
  - 🟡 Customer selection, line items, pricing, terms, and expiry validity date
- 🟡 **b. Negotiated Pricing & Commercial Terms**
  - 🟡 Custom line discounts, custom payment terms, notes
- 🟡 **c. Branded PDF Generation & Printing**
  - 🟡 Professional branded quote PDF export and print
- 🟡 **d. Status Pipeline**
  - 🟡 Draft → Sent → Accepted → Rejected → Expired
- 🟡 **e. One-Click Conversion**
  - 🟡 Instantly convert accepted quotations into Tax Invoices

---

### 12. Invoicing & Commercial Sales Billing 🔴 [Phase 1]

- 🔴 **a. Create Tax Invoice**
  - 🔴 Sequential fiscal invoice numbering, customer BRN, and VAT specifications
- 🔴 **b. Installment & Partial Payments**
  - 🔴 Record customer deposits, partial payments, and balance tracking
- 🔴 **c. Due Dates & Commercial Payment Terms**
  - 🔴 Due on receipt, Net 15, Net 30, Net 60 terms
- 🔴 **d. Invoice Lifecycle Tracking**
  - 🔴 Draft → Unpaid → Partially Paid → Paid → Overdue → Cancelled
- 🔴 **e. Branded PDF Export & Print**
  - 🔴 Professional PDFs with banking instructions, bank details, and payment notes
- 🟢 **f. Automated Recurring Invoicing** *(Phase 3)*
  - Automated periodic billing for contracts and retainers
- 🟢 **g. Multi-Currency Billing** *(Phase 3)*
  - Issue invoices in MUR, USD, EUR with recorded exchange rates
- 🟢 **h. Automated Overdue Payment Email Reminders** *(Phase 3)*

---

### 13. Credit Notes 🟡 [Phase 2]

- 🟡 **a. Issue Credit Note**
  - 🟡 Linked directly to existing invoices
- 🟡 **b. Return Reason Logging**
  - 🟡 Product return, billing correction, price concession
- 🟡 **c. Inventory Restock Integration**
  - 🟡 Option to automatically return items back to warehouse stock
- 🟡 **d. Credit Allocation**
  - 🟡 Apply credit balance against invoice or issue cash refund
- 🟡 **e. Credit Note PDF Export & Print**
  - 🟡 Printable official credit voucher PDF
- 🟢 **f. Standalone Credit Notes without Invoice Link** *(Phase 3)*

---

### 14. Debit Notes 🟢 [Phase 3]

- 🟢 **a. Issue Debit Note**
  - Upward billing adjustments for freight, additional services, or scope changes
- 🟢 **b. Invoice Reference Linking**
- 🟢 **c. PDF Generation & Dispatch**

---

### 15. Purchasing & Purchase Orders (PO) 🟡 [Phase 2]

- 🟡 **a. Create Purchase Order**
  - 🟡 Select supplier, items, delivery location, and agreed purchase costs
- 🟡 **b. Status Lifecycle**
  - 🟡 Draft → Approved → Sent to Supplier → Closed
- 🟡 **c. Purchase Order PDF Export**
  - 🟡 Clean printable purchase order PDF
- 🟡 **d. Fulfillment Tracking**
  - 🟡 Pending → Partially Received → Fully Received → Closed
- 🟢 **e. Automated Low-Stock Reordering** *(Phase 3)*
  - Auto-generate POs for items below safety thresholds
- 🟢 **f. Direct Supplier Email Transmission** *(Phase 3)*

---

### 16. Goods Receipt Notes (GRN) 🟡 [Phase 2]

- 🟡 **a. Receive Goods**
  - 🟡 Check in items against Purchase Orders or ad-hoc shipments
- 🟡 **b. Partial Shipment Support**
  - 🟡 Receive orders in multiple deliveries with balance tracking
- 🟡 **c. Automatic Inventory Increment**
  - 🟡 Instant warehouse stock increment upon receiving confirmation
- 🟡 **d. Damage & Shortage Logging**
  - 🟡 Record discrepancies and reject damaged items
- 🟢 **e. Batch & Expiry Capture at Ingestion** *(Phase 3)*

---

### 17. Bills & Accounts Payable (AP) 🟡 [Phase 2]

- 🟡 **a. Create Vendor Bill**
  - 🟡 Enter supplier invoices against received shipments
- 🟡 **b. Record Bill Payments**
  - 🟡 Log payments (Bank Transfer, Check, Cash) with transaction references
- 🟡 **c. Payables Aging & Due Dates**
  - 🟡 Monitor upcoming liabilities and overdue payments
- 🟢 **d. 3-Way Reconciliation (PO vs GRN vs Bill)** *(Phase 3)*

---

### 18. Suppliers & Vendor Management 🔴 [Phase 1]

- 🔴 **a. Add Supplier**
  - 🔴 Company name, BRN, contact person, email, phone, physical address
- 🔴 **b. Edit / Deactivate Supplier**
  - 🔴 Update vendor details or archive inactive suppliers
- 🔴 **c. Credit Terms & Payment Conditions**
  - 🔴 Set credit limits and allowed payment periods (Net 30, etc.)
- 🟡 **d. Supplier Transaction History** *(Phase 2)*
  - 🟡 Complete ledger of POs, GRNs, Bills, and outgoing payments
- 🟢 **e. Supplier Product Catalogs & Preferred Vendor SKUs** *(Phase 3)*
- 🟢 **f. Supplier Account Statement Export** *(Phase 3)*

---

### 19. Customers & Accounts Receivable (AR) 🔴 [Phase 1]

- 🔴 **a. Add Customer**
  - 🔴 Retail individual or corporate entity, BRN, VAT number, contacts, address
- 🔴 **b. Edit / Archive Customer**
  - 🔴 Update customer info and manage active records
- 🔴 **c. Outstanding Balances & Statements**
  - 🔴 Customer statement of account and aging balance tracking
- 🔴 **d. Complete Purchase History**
  - 🔴 Full log of historical invoices, POS receipts, and quotations
- 🟢 **e. Customer Groups & Tiers (Retail, Wholesale, VIP)** *(Phase 3)*
  - Custom tier-based automatic price discounts
- 🟢 **f. Strict Credit Limit Blocking** *(Phase 3)*
  - Prevent checkout if customer breaches debt ceiling

---

### 20. Reports & Business Intelligence 🟡 [Phase 2]

- 🟡 **a. Sales Summary Reports**
  - 🟡 Sales by date range, payment method, cashier, and branch
- 🟡 **b. Product Sales Performance Reports**
  - 🟡 Top sellers, quantity sold, and revenue contribution
- 🟡 **c. Inventory Valuation Reports**
  - 🟡 Asset value of stock on hand across locations at cost price
- 🟡 **d. Low Stock & Stockout Reports**
  - 🟡 Comprehensive list of depleted and critical inventory items
- 🟡 **e. Tax & Fiscal VAT Reports**
  - 🟡 Collected VAT (15%), zero-rated sales, and net tax liability summaries
- 🟡 **f. Data Export Formats**
  - 🟡 CSV and PDF exports of standard reports
- 🟢 **g. Gross Profit & Net Margin Deep-Dive** *(Phase 3)*
- 🟢 **h. Stock Movement & Velocity Ledger** *(Phase 3)*
- 🟢 **i. Customer & Supplier Aging Debtors/Creditors Analysis** *(Phase 3)*

---

### 21. Custom Report Builder & Scheduled Delivery 🟢 [Phase 3]

- 🟢 **a. Visual Custom Report Builder**
  - Choose dimensions, metrics, date intervals, and custom filters
- 🟢 **b. Saved Report Templates**
  - Save custom queries for one-click re-runs
- 🟢 **c. Automated Scheduled Reports via Cron Email**

---

### 22. Document Builder & Visual Template Designer 🟡 [Phase 2]

- 🟡 **a. Brand Theme Customization**
  - 🟡 Company logo upload, primary and secondary brand colors
- 🟡 **b. Header & Footer Notes**
  - 🟡 Bank details, payment terms, legal registration numbers, footer messages
- 🟡 **c. Standard Template Presets**
  - 🟡 A4 Portrait Tax Invoices, Quotations, and 80mm Thermal Receipts
- 🟡 **d. Real-Time Document Preview**
  - 🟡 Live preview of generated documents before printing
- 🟢 **e. Drag-and-Drop Visual Canvas Designer** *(Phase 3)*
- 🟢 **f. Custom Font Upload & Management** *(Phase 3)*

---

### 23. Users, Roles & Access Control (RBAC) 🟡 [Phase 2]

- 🟡 **a. Invite / Add Users**
  - 🟡 Name, email, temporary credentials, phone, and role assignment
- 🟡 **b. Edit User Profiles & Password Reset**
  - 🟡 Update user information, roles, or reset access credentials
- 🟡 **c. Deactivate / Revoke User Access**
  - 🟡 Instant revocation of active user accounts
- 🟡 **d. Built-In Predefined Roles**
  - 🟡 Super Admin, Store Manager, Cashier / Front-desk Staff
- 🟡 **e. Branch-Level Scoping**
  - 🟡 Restrict staff strictly to their designated store or grant multi-branch access
- 🟢 **f. Granular Custom Permission Matrix Builder** *(Phase 3)*
  - Custom roles with granular checkbox toggles per entity

---

### 24. Security, Sessions & Authentication 🔴 [Phase 1]

- 🔴 **a. Secure Authentication & Password Policies**
  - 🔴 Bcrypt hashing, minimum password length, and complexity validation
- 🔴 **b. Password Reset & Update**
  - 🔴 User self-service or admin-initiated password update
- 🔴 **c. Session Inactivity Timeout**
  - 🔴 Automatic logout on prolonged inactivity to protect registers
- 🟢 **d. Two-Factor Authentication (2FA / TOTP)** *(Phase 3)*
  - Time-based one-time password via Google / Microsoft Authenticator
- 🟢 **e. Backup Recovery Codes** *(Phase 3)*
- 🟢 **f. Remote Active Session Revocation** *(Phase 3)*

---

### 25. Audit Logs & System Activity 🟡 [Phase 2]

- 🟡 **a. Comprehensive Activity Stream**
  - 🟡 Log of every record creation, modification, deletion, and export
- 🟡 **b. Filtering & Search**
  - 🟡 Filter audit trail by User, Module, Action Type, and Date Range
- 🟢 **c. Before-and-After Value Diffs** *(Phase 3)*
- 🟢 **d. Compliance Export (CSV/JSON)** *(Phase 3)*

---

### 26. Integrations, REST API & Webhooks 🟢 [Phase 3]

- 🟢 **a. API Key Management**
  - Create, name, rotate, and revoke secure API keys
- 🟢 **b. Scoped Permissions per Key**
  - Read-only, write, or restricted to specific resource endpoints
- 🟢 **c. Full RESTful API Documentation**
  - Programmatic access to Products, Inventory, Invoices, Orders, Customers
- 🟢 **d. Real-Time Webhooks**
  - Event dispatch for `order.created`, `stock.low`, `invoice.paid`
- 🟢 **e. Webhook Delivery Logs & Manual Retries**

---

### 27. Hardware & Printer Configuration 🔴 [Phase 1]

- 🔴 **a. Browser-Based Thermal Printing**
  - 🔴 Native browser print dialog for 58mm / 80mm thermal receipt printers
- 🔴 **b. Barcode Scanner Compatibility**
  - 🔴 USB and Bluetooth HID keyboard emulation scanners supported out-of-the-box
- 🟢 **c. Direct ESC/POS Network & Serial Drivers** *(Phase 3)*
- 🟢 **d. Cash Drawer RJ11 Auto-Kick Pulse** *(Phase 3)*
- 🟢 **e. Adhesive Barcode Label Roll Printers** *(Phase 3)*

---

### 28. System Settings & Localization 🔴 [Phase 1]

- 🔴 **a. Company Profile & Legal Identity**
  - 🔴 Company Name, BRN, VAT number, registered office address, phone, emails
- 🔴 **b. Currency & Financial Formatting**
  - 🔴 Primary currency (MUR), currency symbol placement, decimal conventions
- 🔴 **c. Fiscal Tax Settings**
  - 🔴 Default VAT rate (15%), tax-inclusive vs. tax-exclusive pricing toggle
- 🔴 **d. Theme Settings**
  - 🔴 Modern Dark Mode, Light Mode, and System Default
- 🔴 **e. Multi-Language Support (i18n)**
  - 🔴 Interface language switching (English & French)
- 🟢 **f. Automated Database Backup & JSON Dump Export** *(Phase 3)*

---

### 29. Notifications & Alerts Center 🟡 [Phase 2]

- 🟡 **a. In-App Notification Center**
  - 🟡 Header notification bell with live unread badge count and slide-over panel
- 🟡 **b. Low Stock & Out-of-Stock Alerts**
  - 🟡 Instant notifications when inventory drops below reorder points
- 🟡 **c. Overdue Invoice Alerts**
  - 🟡 Alerts for unpaid customer invoices that have passed payment due dates
- 🟢 **d. Outgoing Email & SMS Gateway Delivery** *(Phase 3)*

---

### 30. Help Center, Legal & Compliance 🔴 [Phase 1]

- 🔴 **a. Terms of Service**
  - 🔴 MIPS-approved terms governed by Mauritian Law, recurring billing, last-day cancellation rules
- 🔴 **b. Privacy Policy**
  - 🔴 Compliance with Mauritius Data Protection Act 2017 & EU GDPR
- 🔴 **c. System Version & Build Information**
  - 🔴 Display active platform version, commit hash, and legal copyright
- 🟢 **d. Interactive Searchable Knowledge Base & Video Guides** *(Phase 3)*
- 🟢 **e. System Changelog & Release Notes Feed** *(Phase 3)*