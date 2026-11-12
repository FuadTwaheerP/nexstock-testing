# Phase 2 — Detailed Bug Tickets

**35 unique confirmed tickets:** 34 Phase 2 tickets and 1 existing ticket reproduced during Phase 2. Findings come from the 25–26 October 2026 test runs.

Duplicate failures are grouped under one ID. RET-002 includes both POS/invoice and quotation export paths. Corrected automation errors, blocked tests and unconfirmed mock observations are excluded from this bug list. Coverage limitations relevant to a ticket remain in its Comment.

Attachment links refer to local evidence files; upload those files separately when sharing a ticket.

| ID | Module | Title | Priority |
| --- | --- | --- | --- |
| [P2-DASH-001](#p2-dash-001) | Dashboard & Executive Analytics | Gross profit and net margin are unavailable as Dashboard KPI metrics | Medium |
| [P2-DASH-002](#p2-dash-002) | Dashboard & Executive Analytics | Dashboard sales trends lack daily/weekly/monthly period selection | Medium |
| [P2-DASH-003](#p2-dash-003) | Dashboard & Executive Analytics | Saved configured Dashboard widgets render sample values or the wrong selected data source | High |
| [P2-DASH-004](#p2-dash-004) | Dashboard & Executive Analytics | Dashboard has no branch scope switcher for isolated location metrics | Medium |
| [P2-BULK-001](#p2-bulk-001) | Products & Catalog Management | Full-data JSON catalogue export omits products beyond the visible page | High |
| [P2-BULK-004](#p2-bulk-004) | Products & Catalog Management | Product CSV inventory export lacks per-branch stock columns and an all-branch total | High |
| [P2-COUNT-002](#p2-count-002) | Stock Counts (Physical Inventory Audits) | Stock counts show quantity variance but omit its cost-based monetary value | Medium |
| [P2-COUNT-004](#p2-count-004) | Stock Counts (Physical Inventory Audits) | Committed physical counts change stock without a Stock Adjustments history entry | High |
| [P2-COUNT-005](#p2-count-005) | Stock Counts (Physical Inventory Audits) | A committed first positive count leaves an active QA item's branch stock at zero | High |
| [P2-POS-002](#p2-pos-002) | Point of Sale (POS) & Checkout | Held Orders says no orders are on hold although the saved QA cart is returned by the API | High |
| [RET-002](#ret-002) | Point of Sale (POS) & Checkout; Quotations & Cost Estimates | Invoice and quotation PDF export opens a public 404 page (existing RET-002) | High |
| [P2-REG-001](#p2-reg-001) | Cash Register & Shift Management | An open register has no cash in/out workflow for additions and petty-cash withdrawals | High |
| [P2-REG-002](#p2-reg-002) | Cash Register & Shift Management | Register workflow does not expose mid-shift X reports or final Z reports | Medium |
| [P2-QUOTE-001](#p2-quote-001) | Quotations & Cost Estimates | Saved quotation View opens an invoice route and displays Invoice Not Found | High |
| [P2-QUOTE-002](#p2-quote-002) | Quotations & Cost Estimates | Quotation editor has no custom payment terms, notes or per-line discount fields | Medium |
| [P2-CN-002](#p2-cn-002) | Credit Notes | Credit Note editor does not support return or adjustment reason logging | Medium |
| [P2-CN-003](#p2-cn-003) | Credit Notes | Credit Note has no optional return-to-stock or warehouse selection | High |
| [P2-CN-004](#p2-cn-004) | Credit Notes | Saved invoice-linked credit has no allocation or cash-refund action | High |
| [P2-PO-001](#p2-po-001) | Purchasing & Purchase Orders (PO) | Purchase Order creation requires a delivery branch that the form does not let the user select | Critical |
| [P2-GRN-002](#p2-grn-002) | Goods Receipt Notes (GRN) | Standalone Restock estimates purchase cost using the product selling price | Medium |
| [P2-GRN-003](#p2-grn-003) | Goods Receipt Notes (GRN) | No standalone supplier GRN can be created without a Purchase Order | High |
| [P2-AP-002](#p2-ap-002) | Bills & Accounts Payable (AP) | Vendor bill payment cannot record a transaction or cheque reference | Medium |
| [P2-SUPH-001](#p2-suph-001) | Suppliers & Vendor Management | Supplier transaction history omits real bills and outgoing payments | High |
| [P2-REP-001](#p2-rep-001) | Reports & Business Intelligence | Sales reporting lacks custom date, cashier and payment-method filters | Medium |
| [P2-REP-002](#p2-rep-002) | Reports & Business Intelligence | Product sales performance report is unavailable | Medium |
| [P2-REP-003](#p2-rep-003) | Reports & Business Intelligence | Low Stock report omits products beyond the first catalogue page | High |
| [P2-REP-004](#p2-rep-004) | Reports & Business Intelligence | VAT and fiscal reporting is unavailable | Medium |
| [P2-REP-005](#p2-rep-005) | Reports & Business Intelligence | Reports use dollar prefix for MUR financial values | Medium |
| [P2-REP-006](#p2-rep-006) | Reports & Business Intelligence | Standard report PDF export is missing | Medium |
| [P2-DOC-001](#p2-doc-001) | Document Builder & Visual Template Designer | Document Builder has no secondary brand color control | Medium |
| [P2-DOC-004](#p2-doc-004) | Document Builder & Visual Template Designer | Saved document theme updates Builder preview but is ignored by actual invoices | High |
| [P2-AUD-001](#p2-aud-001) | Audit Logs & System Activity | Audit user, action and date filtering controls are incomplete | Medium |
| [P2-AUD-003](#p2-aud-003) | Audit Logs & System Activity | Product CSV exports are absent from the audit activity stream | Medium |
| [P2-AUD-004](#p2-aud-004) | Audit Logs & System Activity | Searching an actor shown in Audit Logs returns no matching entries | Medium |
| [P2-NOT-002](#p2-not-002) | Notifications & Alerts Center | Issuing an already overdue unpaid invoice produces no immediate in-app alert | Medium |

## P2-DASH-001

### Title

Gross profit and net margin are unavailable as Dashboard KPI metrics

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Dashboard & Executive Analytics. Verified: 25 October 2026. Requirements: F01-a.

### Priority

Medium

### Step-by-step

1. Sign in to the approved QA company and open Dashboard.
2. Wait for the dashboard to finish loading its business data.
3. Choose Customize Dashboard, Add Widget, then Stat Card.
4. Inspect the complete Select Metric list for Gross Profit and Net Margin.
5. Cancel without changing the user's saved layout.

### Expected Result

Phase 2 dashboard analytics offers gross profit and net margin metrics as required, with company data rather than invented values.

### Actual Result

The available Stat Card metrics include stock, products, suppliers, customers, orders, Revenue, stores, transfers, AOV and conversion rate, but no gross profit or net margin. The default dashboard has neither metric.

### Attachment

- [Dashboard & Executive Analytics — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-kpi-metrics.ui-F-43d36-n-KPI-metrics-are-available-phase2-dashboard/attachments/P2-DASH-001-c626032541c70fc5d46477a279af29de13706332.png)
- [Dashboard & Executive Analytics — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-4/artifacts/dashboard-dashboard-full-f-9916f-te-analytics-flow-full-flow-phase2-dashboard/attachments/P2-DASH-001-38f9c85c52bcc3fdac4224aee19d3627070decbd.png)
- [Dashboard & Executive Analytics — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-kpi-metrics.ui-F-43d36-n-KPI-metrics-are-available-phase2-dashboard/error-context.md)
- [Dashboard & Executive Analytics — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-assessment.json)

### Comment

User confirmed Phase 2 requirements are expected on production. This is a missing required KPI capability, not a guessed formula failure. Add the metrics and independently validate their defined cost/revenue calculations after implementation.

---

## P2-DASH-002

### Title

Dashboard sales trends lack daily/weekly/monthly period selection

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Dashboard & Executive Analytics. Verified: 25 October 2026. Requirements: F01-b.

### Priority

Medium

### Step-by-step

1. Open the hydrated Dashboard in Nexstock QA Company.
2. Inspect the dashboard for sales date/period grouping controls.
3. Choose Customize Dashboard, Add Widget, then Line Chart.
4. Inspect data sources and any date range/grouping controls; attempt to choose a weekly revenue view.
5. Compare the available Revenue Trend/Monthly Performance options with the required daily, weekly and monthly views.

### Expected Result

Users can inspect daily, weekly and monthly sales trends, including a usable weekly view and explicit period/grouping controls or equivalent views.

### Actual Result

The default dashboard has no sales period switcher. Line Chart offers Revenue Trend, Monthly Performance and other data sources, but no weekly source or daily/weekly/monthly grouping selector. No weekly view is reachable through those inspected controls.

### Attachment

- [Dashboard & Executive Analytics — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-revenue-trends.u-c5e36-les-periods-can-be-selected-phase2-dashboard/attachments/P2-DASH-002-4ee709015fe4f58df2a7812009f83542c2d3ffd6.png)
- [Dashboard & Executive Analytics — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-4/artifacts/dashboard-dashboard-full-f-9916f-te-analytics-flow-full-flow-phase2-dashboard/attachments/P2-DASH-002-0ff2f3675f00f37485d461ee4d99b4ca8cb79131.png)
- [Dashboard & Executive Analytics — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-revenue-trends.u-c5e36-les-periods-can-be-selected-phase2-dashboard/error-context.md)
- [Dashboard & Executive Analytics — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-assessment.json)

### Comment

This is the Phase 2 period-view requirement, not Phase 3 period-over-period comparisons. Implement the supported period views and verify aggregation/date boundaries with seeded sales.

---

## P2-DASH-003

### Title

Saved configured Dashboard widgets render sample values or the wrong selected data source

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Dashboard & Executive Analytics. Verified: 25 October 2026. Requirements: F01-a, F01-b, F01-c.

### Priority

High

### Step-by-step

1. Open Dashboard in Nexstock QA Company and let the live reporting data load.
2. Choose Customize Dashboard, Add Widget, then Stat Card. Give it a QA title and select Revenue; add it and Save Layout in the isolated QA browser.
3. Compare the rendered Revenue with the reporting/dashboard/stats response generated by that same screen.
4. Repeat with Total Orders and Avg. Order Value.
5. Add and save a Line Chart using Revenue Trend and inspect its displayed month labels against the live revenue series.
6. Add and save a Data Table using Top Products; inspect the rendered columns and products.
7. Remove only the test widgets in the isolated browser to return to the original default layout.

### Expected Result

Each saved widget uses its selected data source and the current QA company's live values. Top Products shows sales quantity/revenue ranking, not an unrelated low-stock table.

### Actual Result

The observed live response has revenue 5,890, 34 orders and AOV 173.24, while configured Stat Cards show Rs 458,920.00, 1,156 orders and Rs 397.00. Top Products renders a low-stock table with Current/Min/Store/Status columns and sample items such as Laptop Charger/HDMI Cable. The configured line chart also renders sample month labels instead of the live May-October revenue series.

### Attachment

- [Dashboard & Executive Analytics — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-kpi-metrics.ui-F-91966-ues-and-reconcile-the-ratio-phase2-dashboard/attachments/P2-DASH-003-23985b0e9d7b7f861e6a9a318a36bf793dfb32e0.png)
- [Dashboard & Executive Analytics — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-top-products.ui--20f09-ity-and-revenue-performance-phase2-dashboard/attachments/P2-DASH-003-5d90d45140c9511c32c1903e5a95a2d2ca9b96e4.png)
- [Dashboard & Executive Analytics — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-kpi-metrics.ui-F-91966-ues-and-reconcile-the-ratio-phase2-dashboard/error-context.md)
- [Dashboard & Executive Analytics — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-assessment.json)

### Comment

Grouped source-binding defect across configured widgets, not separate tickets for each repeated sample value. These observations do not prove data from another real tenant was exposed. Bind widgets to their selected live data source; remove demo fallbacks from production views and rerun arithmetic/ranking/chart checks.

---

## P2-DASH-004

### Title

Dashboard has no branch scope switcher for isolated location metrics

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Dashboard & Executive Analytics. Verified: 25 October 2026. Requirements: F01-f.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company, which has multiple existing QA branches.
2. Open Dashboard and wait for the live data.
3. Inspect the dashboard controls for All Branches versus an individual location.
4. Inspect Branch Comparison and attempt to isolate one branch's metrics rather than displaying all branches together.

### Expected Result

Users can select company-wide metrics or a specific branch and see the corresponding scoped analytics.

### Actual Result

The dashboard contains an aggregate Branch Comparison chart but no branch/store/location scope selector. The company business selector is not a branch filter.

### Attachment

- [Dashboard & Executive Analytics — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-branch-scope.ui--e2557--of-only-comparing-branches-phase2-dashboard/attachments/P2-DASH-004-77eec407763bb196cdc8fc528a2a69ec17ef6069.png)
- [Dashboard & Executive Analytics — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-4/artifacts/dashboard-dashboard-full-f-9916f-te-analytics-flow-full-flow-phase2-dashboard/attachments/P2-DASH-004-863590ae87f20dc4bd312804b238fbe9ce13672a.png)
- [Dashboard & Executive Analytics — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-2/artifacts/dashboard-branch-scope.ui--e2557--of-only-comparing-branches-phase2-dashboard/error-context.md)
- [Dashboard & Executive Analytics — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/dashboard-assessment.json)

### Comment

This is a missing Phase 2 analytics-scoping capability, not a claim of RBAC bypass. Add the branch scope control and verify that KPIs, trends, rankings, alerts and activity use the same chosen branch.

---

## P2-BULK-001

### Title

Full-data JSON catalogue export omits products beyond the visible page

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Products & Catalog Management. Verified: 25 October 2026. Requirements: F02-j.

### Priority

High

### Step-by-step

1. Open Products in Nexstock QA Company with more than 15 active products.
2. Confirm the catalogue total and navigate beyond the first page to establish that additional active SKUs exist.
3. Return to the first page, choose Import/Export and keep Export selected.
4. Choose Export as JSON - Full data format.
5. Inspect the downloaded records and compare their SKU set with the active catalogue across pages. Compare with CSV export without changing records.

### Expected Result

The full-data backup/migration export contains every active product in the catalogue, not only those currently rendered in the paginated table.

### Actual Result

The JSON export contains only the 15 products of the visible page and omits active SKUs on other pages. The catalogue initially had 71 active products. CSV export covers the active catalogue; the two export formats are inconsistent.

### Attachment

- [Products & Catalog Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-export-catal-ad123-ains-the-complete-catalogue-phase2-products-bulk/attachments/P2-BULK-001-e6a9d369b64d317efdc06d40930f93e554a93ec1.png)
- [Products & Catalog Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-products-bul-5fa58-d-archive-QA-rows-full-flow-phase2-products-bulk/attachments/P2-BULK-001-b27e26af7b60902f333d5f748f760e255be009e6.png)
- [Products & Catalog Management — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-export-catal-ad123-ains-the-complete-catalogue-phase2-products-bulk/error-context.md)
- [Products & Catalog Management — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-assessment.json)

### Comment

This ticket concerns the offered JSON Full data format and its all-products backup/migration claim. CSV's inclusion of archived records is not this defect. Export all required records independent of table pagination and verify SKU completeness, not just a successful download.

---

## P2-BULK-004

### Title

Product CSV inventory export lacks per-branch stock columns and an all-branch total

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Products & Catalog Management. Verified: 25 October 2026. Requirements: F02-j.

### Priority

High

### Step-by-step

1. Open Stores in Nexstock QA Company and inspect the inventory matrix's branch columns and total.
2. Note the QA flow product with stock in a branch and the aggregate catalogue stock.
3. Open Products, choose Import/Export, then Export as CSV.
4. Inspect the CSV header and stock values.
5. Attempt to identify a column for every branch and a separate total across all branches.

### Expected Result

As directly clarified by the user on 25 October, CSV displays one stock column for each branch (all branches) and a total column equal to the sum across branches.

### Actual Result

The CSV header is SKU, Name, Barcode, Category, Unit, Price, Cost, Stock, Supplier, Description. It has only a generic Stock column, without the branch columns or explicit all-branch total. An observed QA product displayed 10 in the catalogue while this legacy Stock field exported 0.

### Attachment

- [Products & Catalog Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-7/artifacts/products-bulk-export-branc-a182f--a-reconciled-company-total-phase2-products-bulk/attachments/P2-BULK-004-87807e4d861c7f650c099899c43cb1974f7874c0.png)
- [Products & Catalog Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-products-bul-5fa58-d-archive-QA-rows-full-flow-phase2-products-bulk/attachments/P2-BULK-004-0871c256508c1ba9ecc53cacbb53a04120e50b65.png)
- [Products & Catalog Management — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-7/artifacts/products-bulk-export-branc-a182f--a-reconciled-company-total-phase2-products-bulk/error-context.md)
- [Products & Catalog Management — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-assessment.json)

### Comment

Confirmed against the user's explicit export contract, not an assumed default-branch policy. Add every branch column and a total calculated from the same inventory balances. Retest zero/positive branch values and equality of the total to all branch columns; no missing-column reconciliation is counted passed.

---

## P2-COUNT-002

### Title

Stock counts show quantity variance but omit its cost-based monetary value

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Stock Counts (Physical Inventory Audits). Verified: 25 October 2026. Requirements: F06-b.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and note a simple QA product's cost and stock in a QA branch. The automated example uses cost Rs 40.00 at QA Inspection Store 20261017.
2. Use a labelled QA stock adjustment to establish three units at that branch, noting the original balance for restoration.
3. Open Stock Counts and start a count for that QA branch.
4. Locate the QA product: expected quantity is 3. Enter counted quantity 5, a surplus of 2.
5. Save counts, reopen the same reference and inspect the line variance and summary. Commit the count and reopen it again.
6. Repeat independently with expected 3 and counted 2 to check a shortage of 1. Inspect the calculated monetary variance in both the saved and committed views.
7. After the checks, restore the original QA stock balance with a labelled adjustment.

### Expected Result

The count shows quantity variance and its value at product cost. A surplus of 2 at Rs 40.00 is Rs 80.00; a shortage of 1 is Rs -40.00. Users can assess the financial effect before or after reconciliation.

### Actual Result

Saved and committed count sheets expose Product, Expected, Counted and Variance quantity columns plus a Net variance quantity summary. The quantity calculations and stock reconciliation work, but no cost-based variance amount is displayed for either surplus or shortage.

### Attachment

- [Stock Counts (Physical Inventory Audits) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-4/artifacts/stock-counts-count-varianc-6f83d--quantity-and-cost-variance-phase2-stock-counts/attachments/P2-COUNT-002-b4cfb2c069dbcd00ad613b62ff50938ebdbd6b80.png)
- [Stock Counts (Physical Inventory Audits) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-4/artifacts/stock-counts-count-varianc-7d498--quantity-and-cost-variance-phase2-stock-counts/attachments/P2-COUNT-002-e7ac2e931f8f00b0c783b220e548e137d3d77911.png)
- [Stock Counts (Physical Inventory Audits) — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-4/artifacts/stock-counts-count-varianc-6f83d--quantity-and-cost-variance-phase2-stock-counts/error-context.md)
- [Stock Counts (Physical Inventory Audits) — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-assessment.json)

### Comment

This is a missing monetary variance result in the count UI, not a claim that the underlying stock quantities are wrong or that backend accounting calculations were inspected. Add line and summary valuation based on cost, format the amounts as company currency, and verify positive/negative values and totals. The integrated flow can reach and verify reconciliation despite this display gap.

---

## P2-COUNT-004

### Title

Committed physical counts change stock without a Stock Adjustments history entry

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Stock Counts (Physical Inventory Audits). Verified: 25 October 2026. Requirements: F06-c.

### Priority

High

### Step-by-step

1. In Nexstock QA Company, establish three units of a simple QA product at QA Inspection Store 20261017. Record the original balance for later restoration.
2. Open Stock Adjustments for that branch and note the latest adjustment references.
3. Start a Stock Count for the same QA branch, enter counted quantity 5 for the QA product, and save it.
4. Commit the count and verify that branch stock changes from 3 to 5 while the comparison branch is unchanged.
5. Return to Stock Adjustments for the counted branch. Refresh/read its latest history repeatedly for at least 20 seconds and compare the references with the pre-commit list.
6. Repeat with a shortage count, then restore the original stock using a separately labelled QA adjustment.

### Expected Result

One-click reconciliation generates an attributable stock adjustment for the counted difference. The history exposes the affected product, signed quantity and originating count so that the movement can be traced.

### Actual Result

Count commitment updates the QA product's stock correctly, but the successful branch adjustment-history reads contain no new adjustment reference for the count. The list continues to show the earlier manual QA seed/restore records. The count movement cannot be located in Stock Adjustments.

### Attachment

- [Stock Counts (Physical Inventory Audits) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-count-reconci-e030b--updates-only-its-QA-branch-phase2-stock-counts/attachments/P2-COUNT-004-92ba83a1bb4bf091122db4f7572532a56ad223cf.png)
- [Stock Counts (Physical Inventory Audits) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-count-reconci-b0c07--updates-only-its-QA-branch-phase2-stock-counts/attachments/P2-COUNT-004-0a4e7d5e7ea98015554dcd93cf5374625fcd2ea7.png)
- [Stock Counts (Physical Inventory Audits) — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-6/artifacts/stock-counts-count-reconci-e030b--updates-only-its-QA-branch-phase2-stock-counts/error-context.md)
- [Stock Counts (Physical Inventory Audits) — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-assessment.json)

### Comment

The test compares the same branch's latest history before and after commitment, with no other test writes between those reads, and allows a 20-second refresh window. This is separate from the missing monetary variance display. It concerns the required generated adjustment record, not a claim that stock reconciliation itself failed. Generate/link a count adjustment and expose it in the stock adjustment trail; verify both surplus and shortage.

---

## P2-COUNT-005

### Title

A committed first positive count leaves an active QA item's branch stock at zero

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Stock Counts (Physical Inventory Audits). Verified: 25 October 2026. Requirements: F06-c.

### Priority

High

### Step-by-step

1. In Nexstock QA Company, open active physical product QA archive mv9s9v7r-b9c0c9 (SKU QA-ARCHIVE-mv9s9v7r-b9c0c9). Confirm it has zero stock and no displayed branch-stock entry.
2. Start a count for QA Inspection Store 20261017; the product's frozen expected quantity is 0.
3. Enter counted quantity 1 for that exact product and save counts.
4. Reopen the saved count and confirm counted quantity 1 persists.
5. Click Commit and accept Apply 1 variance(s) to stock? The completion request returns HTTP 200.
6. Start a separate fresh count for the same branch and inspect the same SKU; also search the product in a fresh catalogue view.
7. Abandon the fresh verification snapshot. Restore/verify the original zero balance using an owned count.

### Expected Result

Committing counted quantity 1 reconciles this branch to 1, creating its balance row if necessary. A fresh count and catalogue read show the updated stock.

### Actual Result

The save payload contains product_id 19 / counted_quantity 1, reopening retains 1, and completion succeeds with a positive-variance confirmation. A separate newly opened count still freezes expected quantity 0; the fresh catalogue also reports stock 0. Repeated independent execution reproduces it.

### Attachment

- [Stock Counts (Physical Inventory Audits) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-7/artifacts/stock-counts-initial-balan-2da0c-em-without-a-branch-balance-phase2-stock-counts/attachments/P2-COUNT-005-648d86d9e76470831c01ba3b22982ec987f4dc9d.png)
- [Stock Counts (Physical Inventory Audits) — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-7/artifacts/stock-counts-initial-balan-2da0c-em-without-a-branch-balance-phase2-stock-counts/error-context.md)
- [Stock Counts (Physical Inventory Audits) — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/stock-counts-assessment.json)

### Comment

Investigate commitment for a product/branch pair without an existing stock row; missing balance initialization is a hypothesis, not a verified backend cause. The previously stocked QA-ADD product reconciles successfully, so this is a distinct data-state regression. Fix and retest first surplus/shortage and existing-balance paths. Reporting's later-page positive-stock test remains blocked until this prerequisite works.

---

## P2-POS-002

### Title

Held Orders says no orders are on hold although the saved QA cart is returned by the API

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Point of Sale (POS) & Checkout. Verified: 25 October 2026. Requirements: F08-j.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company and open Point of Sale.
2. Add two units of the QA service product QA-SERVICE-mvmgbd15-fba79b; the cart total is Rs 200.00.
3. Click Hold and confirm the successful save response contains a held-order ID and the two-unit cart.
4. Reload POS in the same signed-in session and wait for the held-orders GET to finish.
5. Confirm that response contains the just-created ID, then open Held.
6. Wait at least 12 seconds and attempt to find and resume the saved order.

### Expected Result

The held cart appears in Held Orders and can be resumed with its products, quantity and prices restored. A successful save must result in a usable saved-cart entry for its branch/context.

### Actual Result

The POST saves the cart and its ID is present in the successful fresh GET, but Held Orders displays No orders on hold and provides no Resume/Discard row. The combined hold-resume-checkout flow cannot continue.

### Attachment

- [Point of Sale (POS) & Checkout — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-5/artifacts/pos-extensions-hold-orders-6a99d-and-display-it-after-reload-phase2-pos-extensions/attachments/P2-POS-002-ffc90b1d1e65edb19fab77c7c33b0f25eb80fc51.png)
- [Point of Sale (POS) & Checkout — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-5/artifacts/pos-extensions-pos-extensi-d216b-invoice-full-flow-full-flow-phase2-pos-extensions/attachments/P2-POS-002-1195b94dde0d2d34c56a5f7ed9c17a4dcea7cd40.png)
- [Point of Sale (POS) & Checkout — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-5/artifacts/pos-extensions-hold-orders-6a99d-and-display-it-after-reload-phase2-pos-extensions/error-context.md)
- [Point of Sale (POS) & Checkout — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-assessment.json)

### Comment

Verified with live production QA data and a rendering wait, not inferred from a save timeout or an assumed cart-clear policy. Investigate the frontend's response/branch filtering and ensure save, list and resume use consistent context. Keep the saved QA records for investigation or remove only their recorded owned IDs after the UI is repaired.

---

## RET-002

### Title

Invoice and quotation PDF export opens a public 404 page (existing RET-002)

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Modules: Point of Sale (POS) & Checkout; Quotations & Cost Estimates. Verified: 25 October 2026. Requirements: F08-k, F11-c.

### Priority

High

### Step-by-step

Reproduce either affected path below.

**Point of Sale (POS) & Checkout**

1. In Nexstock QA Company, open POS and select QA Billing Automation Customer.
2. Sell one QA service item for Rs 100.00 using Cash, recording exactly Rs 100.00 received.
3. Verify the receipt and paid transaction, then open Invoices and find the newly saved invoice ID.
4. Open its detail view and verify the customer, service item, Rs 100.00 total and zero amount due. Its Print action invokes browser printing.
5. Return to the invoice list and click the saved record's download/PDF action.
6. Inspect the export popup and attempt to obtain the formal invoice PDF.

**Quotations & Cost Estimates**

1. Create and save an isolated QA quotation.
2. In Quotations, click Download PDF on its row.
3. Inspect the actual popup URL and content.

### Expected Result

**Point of Sale (POS) & Checkout:** Export opens a usable invoice print view or downloads the correct formal PDF. The generated document can be checked for invoice identity, customer, amounts and A4 output.

**Quotations & Cost Estimates:** The action opens or downloads the selected quotation's branded, printable document.

### Actual Result

**Point of Sale (POS) & Checkout:** The invoice is saved, paid and viewable, but export opens the public 404 page instead of an invoice document. No valid PDF is produced for content/page-size verification.

**Quotations & Cost Estimates:** It opens public /invoicing/<quotation-id>?print=true outside /app and displays 404 / That page is not here.

### Attachment

- [Point of Sale (POS) & Checkout — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-6/artifacts/pos-extensions-formal-invo-eced5-eneration-for-a-QA-POS-sale-phase2-pos-extensions/attachments/invoice-export-popup-f1c3697643878b72d77a4ac4addd8b5af77bc059.png)
- [Point of Sale (POS) & Checkout — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-6/artifacts/pos-extensions-formal-invo-eced5-eneration-for-a-QA-POS-sale-phase2-pos-extensions/error-context.md)
- [Point of Sale (POS) & Checkout — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/pos-extensions-assessment.json)
- [Quotations & Cost Estimates — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-pdf-print.ui-F1-510f1-d-PDF-and-print-entry-point-phase2-quotations/attachments/quotation-export-popup-4f4508c7bfd93518a63eb2951e66f7fa07790813.png)
- [Quotations & Cost Estimates — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-pdf-print.ui-F1-510f1-d-PDF-and-print-entry-point-phase2-quotations/error-context.md)
- [Quotations & Cost Estimates — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-assessment.json)

### Comment

This is one shared, previously logged ticket. Update/reopen **RET-002** once; both affected paths are included here.

**Point of Sale (POS) & Checkout:** This is the existing RET-002 from the Round 1 release retest, reproduced through the new Phase 2 POS scenario. Update/reopen the original ticket rather than log a duplicate. Fix application-prefix/export routing and retest authenticated invoice export. The test does not rewrite the broken URL or substitute a manufactured PDF for application output.

**Quotations & Cost Estimates:** Update the existing RET-002 ticket rather than creating another export ticket. Correct both the application base path and quotation document routing; then validate actual output branding, content and printing.

---

## P2-REG-001

### Title

An open register has no cash in/out workflow for additions and petty-cash withdrawals

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Cash Register & Shift Management. Verified: 25 October 2026. Requirements: F09-b.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company and open Cash Register.
2. With no unrelated shift open, enter an opening float of Rs 100.00 and uniquely labelled QA notes, then click Open register.
3. Wait for Session open and verify the opening and expected cash figures.
4. Attempt to record a cash addition with an amount and reason.
5. Attempt to record a petty-cash withdrawal with an amount and reason.
6. After inspecting, close only the QA shift using its actual expected cash to leave the fixture closed.

### Expected Result

An active drawer offers cash in/pay-in and cash out/pay-out entry workflows. Each records amount and reason against the shift, adjusts expected cash with the correct sign, and remains traceable in reconciliation.

### Actual Result

The active register exposes the cash figures, counted-cash/notes inputs and Close register. There are no cash in/out or pay-in/pay-out entry controls, so additions and withdrawals cannot be entered through this workflow. Ordinary cash sales do increase expected cash correctly.

### Attachment

- [Cash Register & Shift Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-movemen-5245a-h-in-with-amount-and-reason-phase2-cash-register/attachments/P2-REG-001-36fe56d0fcdbda2a16f7fa652737896a01314455.png)
- [Cash Register & Shift Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-movemen-ec792--out-with-amount-and-reason-phase2-cash-register/attachments/P2-REG-001-563f1e6aa48309dddb9f9d41224a1bc9a7610d12.png)
- [Cash Register & Shift Management — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-cash-movemen-5245a-h-in-with-amount-and-reason-phase2-cash-register/error-context.md)
- [Cash Register & Shift Management — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-assessment.json)

### Comment

Both missing directions are grouped into one cash-movement capability ticket. This is an unavailable UI workflow, not a failure of the already-tested cash-sale arithmetic. Add scoped movement entry and reason/history support, then verify additions, withdrawals, expected totals and reconciliation. No unverified backend absence or cash policy is asserted.

---

## P2-REG-002

### Title

Register workflow does not expose mid-shift X reports or final Z reports

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Cash Register & Shift Management. Verified: 25 October 2026. Requirements: F09-d.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open a uniquely labelled QA register shift with an opening float.
2. While Session open is visible, look for the X-report or mid-shift summary generation/print action.
3. Record a QA cash sale if needed and confirm expected cash increases.
4. Enter the counted cash and close the owned shift.
5. Locate the closed row in Past shifts and look for its Z-report/end-of-shift report or print action.

### Expected Result

Users can generate a thermal mid-shift X report without closing the drawer and a final Z report for its closure, with the appropriate shift cash/reconciliation figures.

### Actual Result

No X-report control is available on the active shift. After successful closure, Past shifts shows cashier, closing time, opening/expected/counted cash and difference, but has no Z-report generation or print action. No shift report is produced for content/format verification.

### Attachment

- [Cash Register & Shift Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-shift-report-a8bd6-report-content-and-printing-phase2-cash-register/attachments/P2-REG-002-b1c0b8ceded93eadf062271af134dea622b8a83e.png)
- [Cash Register & Shift Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-shift-report-076c9-report-content-and-printing-phase2-cash-register/attachments/P2-REG-002-a1c878e04e6f645c91e97b991fb539d11dd57530.png)
- [Cash Register & Shift Management — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-2/artifacts/cash-register-shift-report-a8bd6-report-content-and-printing-phase2-cash-register/error-context.md)
- [Cash Register & Shift Management — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/cash-register-assessment.json)

### Comment

The two unavailable outputs are grouped as the same shift-reporting capability. Register closure and variance history work. This is a software report-access gap, not a claim about physical printer compatibility. Expose the outputs for the correct owned shift and test content, mid-shift behavior, final closure and thermal formatting after implementation.

---

## P2-QUOTE-001

### Title

Saved quotation View opens an invoice route and displays Invoice Not Found

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Quotations & Cost Estimates. Verified: 25 October 2026. Requirements: F11-a, F11-d, F11-e.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company and open Quotations.
2. Create a quotation for QA Billing Automation Customer, select QA add mv9rtxw1-3b087e, set quantity 2, price Rs 93.25, 10% discount and a future expiry.
3. Save as Draft; confirm the record and Rs 167.85 total appear in the list.
4. Click the saved row's eye/View button.
5. Repeat with a newly created quotation using Mark Accepted & Save.

### Expected Result

View displays the saved quotation and its commercial details, status workflow, and invoice conversion action for accepted quotations.

### Actual Result

The eye action navigates to /app/invoicing/<quotation-id>. The page displays Invoice Not Found instead of the quotation; both draft and accepted records reproduce it.

### Attachment

- [Quotations & Cost Estimates — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-2/artifacts/quotations-invoice-convers-32d7e-oses-tax-invoice-conversion-phase2-quotations/attachments/P2-QUOTE-001-0d055c9b86973ad23e9142685bb10a5f2a9a1337.png)
- [Quotations & Cost Estimates — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-2/artifacts/quotations-status-pipeline-907b6-aft-exposes-status-pipeline-phase2-quotations/attachments/P2-QUOTE-001-587f01eadbfb9eaf0526061db588786b39761702.png)
- [Quotations & Cost Estimates — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-2/artifacts/quotations-invoice-convers-32d7e-oses-tax-invoice-conversion-phase2-quotations/error-context.md)
- [Quotations & Cost Estimates — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-assessment.json)

### Comment

Fix the quotation row route/document resolver and provide its status and conversion actions. Retest all lifecycle branches and verify a converted invoice preserves items, prices, customer and totals. Multiple dependent failures are grouped here; no separate status/conversion defect is assumed.

---

## P2-QUOTE-002

### Title

Quotation editor has no custom payment terms, notes or per-line discount fields

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Quotations & Cost Estimates. Verified: 25 October 2026. Requirements: F11-a, F11-b.

### Priority

Medium

### Step-by-step

1. Open Quotations > New Quotation.
2. Select the QA billing customer and add a product row.
3. Inspect row pricing, customer details and Billing totals for commercial fields.
4. Try to set separate line discounts, custom payment terms and a negotiated note.

### Expected Result

Each line supports its own discount, and the quotation allows custom payment terms and notes that persist after saving.

### Actual Result

The editor exposes editable unit prices and a single document-level discount. No custom payment terms, notes or line discount controls are present. Deployed client payload sets notes to an empty string and generates fixed validity terms.

### Attachment

- [Quotations & Cost Estimates — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-commercial-term-1a79b-d-individual-line-discounts-phase2-quotations/attachments/P2-QUOTE-002-484f5de4a3ef230f0894ab44480a77d9f796c48f.png)
- [Quotations & Cost Estimates — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-1/artifacts/quotations-commercial-term-1a79b-d-individual-line-discounts-phase2-quotations/error-context.md)
- [Quotations & Cost Estimates — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/quotations-assessment.json)

### Comment

Add the required editable commercial fields to creation/editing, persist them, and include them in the quotation output. The verified editable unit price/document discount is not a substitute for these explicit requirements.

---

## P2-CN-002

### Title

Credit Note editor does not support return or adjustment reason logging

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Credit Notes. Verified: 25 October 2026. Requirements: F13-b.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Credit Notes > Create Credit Note.
2. Select QA Billing Automation Customer and add a product line.
3. Look for a return reason or adjustment type such as Product return, Billing correction or Price concession.
4. Save an invoice-linked QA credit and reopen its detail.

### Expected Result

A user can record the return/adjustment reason and see it retained with the credit note.

### Actual Result

There is no reason input or reason selection in the editor. The save payload sends reason and reasonCode as empty strings; the saved QA credit retains an empty reason.

### Attachment

- [Credit Notes — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-return-reason-5fb08-d-concession-reason-logging-phase2-credit-notes/attachments/P2-CN-002-2e1fa27b3e750ec8e035c100648bdfbedfddc60d.png)
- [Credit Notes — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-return-reason-5fb08-d-concession-reason-logging-phase2-credit-notes/error-context.md)
- [Credit Notes — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-assessment.json)

### Comment

Add a reason field/type, preserve it in the saved record and show it on the official voucher/history. This ticket covers the missing capability rather than inventing mandatory validation or reason-code policy.

---

## P2-CN-003

### Title

Credit Note has no optional return-to-stock or warehouse selection

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Credit Notes. Verified: 25 October 2026. Requirements: F13-c.

### Priority

High

### Step-by-step

1. Open Credit Notes > Create Credit Note in the QA company.
2. Select a QA customer and an inventory product line.
3. Inspect all creation controls for return-to-stock and receiving warehouse options.
4. Inspect the saved credit's available actions.

### Expected Result

A product return can optionally restock the selected warehouse; leaving the option off should preserve stock.

### Actual Result

Creation has customer, linked invoice, dates, product/quantity/price and discount controls, but no restock toggle or warehouse selector. Saved detail offers printing only.

### Attachment

- [Credit Notes — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-inventory-res-e762d-l-return-to-warehouse-stock-phase2-credit-notes/attachments/P2-CN-003-335d43757a25fbe89690550717da6e79841f410b.png)
- [Credit Notes — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-inventory-res-e762d-l-return-to-warehouse-stock-phase2-credit-notes/error-context.md)
- [Credit Notes — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-assessment.json)

### Comment

Implement the optional restock workflow and preserve location/quantity linkage. Retest both enabled/disabled cases and branch isolation; no stock effect is claimed passed from this missing-UI check.

---

## P2-CN-004

### Title

Saved invoice-linked credit has no allocation or cash-refund action

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Credit Notes. Verified: 25 October 2026. Requirements: F13-d.

### Priority

High

### Step-by-step

1. Create an isolated paid Rs 100 QA invoice for QA Billing Automation Customer.
2. Create a Rs 100 Credit Note linked to that exact invoice using the available Save as Draft action.
3. Confirm the saved record exists with status open and remaining balance Rs 100.
4. Open its eye/View action and inspect available controls.

### Expected Result

The available credit can be applied through an invoice allocation workflow or settled as an explicitly recorded cash refund.

### Actual Result

The saved detail exposes Print and PDF only. There is no apply-credit, allocation, activation/issue transition or cash-refund action, leaving the recorded Rs 100 credit inaccessible for settlement.

### Attachment

- [Credit Notes — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-credit-alloca-377e6-nd-cash-refund-entry-points-phase2-credit-notes/attachments/P2-CN-004-75ba7a5fc58bff4e2ea280d1703f0138f0f28eb5.png)
- [Credit Notes — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-credit-notes--0635a-ocation-full-flow-full-flow-phase2-credit-notes/attachments/P2-CN-004-03e9bfaa70a39b5e2fd61ddd76c6eea885dc0403.png)
- [Credit Notes — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-2/artifacts/credit-notes-credit-alloca-377e6-nd-cash-refund-entry-points-phase2-credit-notes/error-context.md)
- [Credit Notes — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/credit-notes-assessment.json)

### Comment

Add the credit lifecycle and allocation/refund controls with balance updates and audit linkage. Saved open credit was observed; do not assume money moved or log a separate cash-refund processing defect without an accessible action.

---

## P2-PO-001

### Title

Purchase Order creation requires a delivery branch that the form does not let the user select

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Purchasing & Purchase Orders (PO). Verified: 25 October 2026. Requirements: F15-a, F15-b, F15-c, F15-d.

### Priority

Critical

### Step-by-step

1. Sign in to Nexstock QA Company and open Purchase Orders > New Purchase Order.
2. Select an active isolated QA supplier (QA P2 Vendor mvo2d41l) and QA add mv9rtxw1-3b087e.
3. Enter quantity 4, unit cost Rs 25, tax Rs 10, discount Rs 5 and shipping Rs 2; total Rs 107.
4. Set currency MUR, a future expected delivery date and a QA note.
5. Inspect the form for a delivery branch or warehouse selector, then click Create Purchase Order.

### Expected Result

The user can select the destination branch and save a valid draft PO for subsequent approval, receipt and PDF export.

### Actual Result

No delivery branch/warehouse input is present and the form submits no branchId. The server rejects creation with HTTP 422 validation_failed: data.branchId = Choose the branch the goods are delivered to. All six independent/full-flow cases reproduce the same prerequisite failure.

### Attachment

- [Purchasing & Purchase Orders (PO) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-4/artifacts/purchase-orders-create-pur-3c5a3-currency-and-totals-persist-phase2-purchase-orders/attachments/P2-PO-001-07346517a95c79203b956f9e78e12410d77499ab.png)
- [Purchasing & Purchase Orders (PO) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-4/artifacts/purchase-orders-create-pur-d4815-elivery-warehouse-or-branch-phase2-purchase-orders/attachments/P2-PO-001-624afeead6ec612e713a5f5b11d071d29e476409.png)
- [Purchasing & Purchase Orders (PO) — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-4/artifacts/purchase-orders-create-pur-3c5a3-currency-and-totals-persist-phase2-purchase-orders/error-context.md)
- [Purchasing & Purchase Orders (PO) — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/purchase-orders-assessment.json)

### Comment

Add a destination branch selector backed by active company branches, send its branchId and retain/display the delivery location. Then rerun PO lifecycle/export/fulfillment, GRN and PO-linked billing. Do not log duplicate downstream receipt, status or PDF defects before they become reachable.

---

## P2-GRN-002

### Title

Standalone Restock estimates purchase cost using the product selling price

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Goods Receipt Notes (GRN). Verified: 25–26 October 2026. Requirements: F16-a.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company.
2. Open Products and inspect QA-ADD-mv9rtxw1-3b087e: cost price Rs40 and selling price Rs100.
3. Open Store Inventory for QA Inspection Store 20261017, then click Restock.
4. Deselect all items and search the exact QA SKU.
5. Select only that item and set quantity to 1.
6. Read its Cost amount and Estimated restock cost; cancel without confirming.

### Expected Result

For quantity1, line cost and estimated restocking cost use the product's purchase/cost price, Rs40, rather than its selling price.

### Actual Result

The line Cost and estimated total both show100 for one item, matching its selling price100 instead of its stored cost40. The same result reproduces in the independent check and integrated flow.

### Attachment

- [Goods Receipt Notes (GRN) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-3/artifacts/goods-receipts-restock-cos-a8c88-al-use-the-QA-purchase-cost-phase2-goods-receipts/attachments/P2-GRN-002-4be8fb7e94442473eb953ea4e1b738f84371ca90.png)
- [Goods Receipt Notes (GRN) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-goods-recei-9c9e4-receipt-full-flow-full-flow-phase2-goods-receipts/attachments/P2-GRN-002-518ba6f3e4db7704cf936a986ffe8ec84b791456.png)
- [Goods Receipt Notes (GRN) — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-3/artifacts/goods-receipts-restock-cos-a8c88-al-use-the-QA-purchase-cost-phase2-goods-receipts/error-context.md)
- [Goods Receipt Notes (GRN) — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-assessment.json)

### Comment

Calculate estimates from the applicable unit purchase/cost value and format them with the company currency. Preserve the independently passing stock-quantity behavior. This ticket concerns the visible estimate; no incorrect ledger or stock valuation is claimed. The read-only reproduction never confirms a restock.

---

## P2-GRN-003

### Title

No standalone supplier GRN can be created without a Purchase Order

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Goods Receipt Notes (GRN). Verified: 25–26 October 2026. Requirements: F16-a.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company.
2. Open Purchasing > Purchase Orders and look for a way to receive a shipment without creating or selecting a Purchase Order.
3. Open Suppliers and inspect the available receiving actions.
4. Open Store Inventory and select Restock.
5. Try to record a separate Goods Receipt Note by selecting a supplier, product and received quantity, leaving all other details blank.

### Expected Result

A separate GRN can be created without a Purchase Order. Supplier, product and quantity are the only mandatory user inputs; delivery-note/reference number, dates, notes and all other details are optional. Saving retains the supplier receipt and posts the received inventory.

### Actual Result

The inspected Purchasing, Suppliers and Inventory screens expose no standalone GRN entry. The available Restock dialog selects products and quantities but has no supplier input or supplier-receipt form. The required minimum-input GRN cannot be created through this UI.

### Attachment

- [Goods Receipt Notes (GRN) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-standalone--16e72-pplier-product-and-quantity-phase2-goods-receipts/attachments/P2-GRN-003-6cfc6637158197f45489af061d57ede52d0d92e6.png)
- [Goods Receipt Notes (GRN) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-goods-recei-9c9e4-receipt-full-flow-full-flow-phase2-goods-receipts/attachments/P2-GRN-003-1a8e55e37c3779a4b4d513e169bb09d5a5e33fd6.png)
- [Goods Receipt Notes (GRN) — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-5/artifacts/goods-receipts-standalone--16e72-pplier-product-and-quantity-phase2-goods-receipts/error-context.md)
- [Goods Receipt Notes (GRN) — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/goods-receipts-assessment.json)

### Comment

Add a separate GRN flow with supplier selection and product/quantity lines, persistence and stock posting. Allow all other user-entered details to remain blank/defaulted; do not require a Purchase Order. This is one missing-workflow ticket. Required-field, optional-field, saved-receipt and stock-posting assertions are unverified until the form becomes available. No claim is made that an unpublished backend endpoint is absent.

---

## P2-AP-002

### Title

Vendor bill payment cannot record a transaction or cheque reference

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Bills & Accounts Payable (AP). Verified: 25 October 2026. Requirements: F17-b.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Bills (AP).
2. Create an isolated bill for QA P2 Vendor mvo2d41l with subtotal Rs 97, tax Rs 10 and a future due date.
3. Click Pay on that exact QA bill.
4. Select Bank Transfer or Cheque and inspect all payment inputs.

### Expected Result

The manual payment can retain its amount, payment date, method and transaction/cheque reference for reconciliation.

### Actual Result

Record Payment exposes Amount, Payment Date and Payment Method only. There is no reference or transaction field. The actual tested payment payloads include amount, paymentDate and paymentMethod, with no reference.

### Attachment

- [Bills & Accounts Payable (AP) — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/bills-payable-1/artifacts/bills-payable-bill-payment-9fcce-with-bank-or-cheque-payment-phase2-bills-payable/attachments/P2-AP-002-a433f56a03c2cf2834c9930ce14a92e633fc718a.png)
- [Bills & Accounts Payable (AP) — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/bills-payable-1/artifacts/bills-payable-bill-payment-9fcce-with-bank-or-cheque-payment-phase2-bills-payable/error-context.md)
- [Bills & Accounts Payable (AP) — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/bills-payable-assessment.json)

### Comment

Add reference entry/persistence and expose it in the bill payment/supplier ledger. The amount arithmetic and Cash/Bank Transfer/Cheque bookkeeping paths pass; this ticket concerns the missing required reference capability.

---

## P2-SUPH-001

### Title

Supplier transaction history omits real bills and outgoing payments

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Suppliers & Vendor Management. Verified: 25 October 2026. Requirements: F18-d.

### Priority

High

### Step-by-step

1. Sign in to Nexstock QA Company and select the active isolated supplier QA P2 Vendor mvo2d41l.
2. Create a direct QA vendor bill in Bills (AP): subtotal Rs 97, tax Rs 10, total Rs 107, future due date and a unique QA reference.
3. For the payment scenario, record a manual cash installment of Rs 20 and verify paid Rs 20 / due Rs 87 in AP.
4. Open that supplier's details and inspect all history tabs.
5. Open Purchase Orders history and search visually for the newly recorded bill/payment.

### Expected Result

The supplier has a complete transaction ledger with its POs, received shipments, vendor bills and outgoing payments, including amounts and document linkage.

### Actual Result

The page exposes Catalog Products and Purchase Orders only. The exact newly saved QA bill references, balances and Rs 20 payment are absent, with no Bills/Payments ledger view. Independent unpaid and partially paid fixtures reproduce the omission.

### Attachment

- [Suppliers & Vendor Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-2/artifacts/supplier-history-outgoing--10172-rtial-outgoing-cash-payment-phase2-supplier-history/attachments/P2-SUPH-001-33ab952d01d4667271b9e8dd860799d21ddfcedf.png)
- [Suppliers & Vendor Management — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-2/artifacts/supplier-history-vendor-bi-906f0-cludes-an-owned-unpaid-bill-phase2-supplier-history/attachments/P2-SUPH-001-b82de207ac04819108e8adb76569089d36ea02eb.png)
- [Suppliers & Vendor Management — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-2/artifacts/supplier-history-outgoing--10172-rtial-outgoing-cash-payment-phase2-supplier-history/error-context.md)
- [Suppliers & Vendor Management — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/supplier-history-assessment.json)

### Comment

Add the supplier's bill/payment ledger and integrate receipt/purchase-order linkage. Use the saved QA references and payment events when retesting. Populated PO/GRN history cannot yet be certified because P2-PO-001 prevents provisioning; no separate defect is assumed for those blocked paths.

---

## P2-REP-001

### Title

Sales reporting lacks custom date, cashier and payment-method filters

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Reports & Business Intelligence. Verified: 25 October 2026. Requirements: F20-a.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports > Business & Sales
3. Inspect Reporting Horizon, branch controls and available filters.

### Expected Result

Sales reporting supports custom start/end dates, cashier and payment-method filtering.

### Actual Result

Only preset reporting horizons and branch controls are available. Custom date inputs, cashier and payment-method controls are absent.

### Attachment

- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-sales-summary.ui-F-6eaf0-shier-and-branch-dimensions-phase2-reports/attachments/P2-REP-001-927f75abccbb110ea7d07498b23b69559cff4f8d.png)
- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-001-3f221485084e2344c7a1fb19969688fc23abb352.png)
- [Reports & Business Intelligence — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-sales-summary.ui-F-6eaf0-shier-and-branch-dimensions-phase2-reports/error-context.md)
- [Reports & Business Intelligence — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Add the missing dimensions and verify them against non-zero QA sales. Existing branch/preset wiring is not declared broken.

---

## P2-REP-002

### Title

Product sales performance report is unavailable

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Reports & Business Intelligence. Verified: 25 October 2026. Requirements: F20-b.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports
3. Inspect Report Focus choices and Business & Sales content.

### Expected Result

A product performance report ranks products by quantity sold and revenue contribution.

### Actual Result

There is no product performance/top-seller report; a revenue trend and stock movement do not provide ranked product revenue.

### Attachment

- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-product-performanc-14233-revenue-contribution-report-phase2-reports/attachments/P2-REP-002-32aaa7fba16574cc08f8683f2e520abe99603bd3.png)
- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-002-ea5a16aa500f01a37269703c95b273d5b560c423.png)
- [Reports & Business Intelligence — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-product-performanc-14233-revenue-contribution-report-phase2-reports/error-context.md)
- [Reports & Business Intelligence — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Implement the required report and reconcile quantities and revenue with known sales.

---

## P2-REP-003

### Title

Low Stock report omits products beyond the first catalogue page

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Reports & Business Intelligence. Verified: 25 October 2026. Requirements: F20-d.

### Priority

High

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Paginate the Products catalogue to collect all 71 active products
3. Identify inventory items at or below reorder point
4. Open Reports > Low Stock and compare their SKUs.

### Expected Result

Every eligible low-stock/out-of-stock catalogue item appears in the report.

### Actual Result

53 eligible depleted/critical SKUs are absent. Reporting loads 15 of 71 products. Current cost valuation still reconciles because omitted items have no positive verified stock.

### Attachment

- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-low-stock.ui-F20-d-ef3cd-d-and-critical-stock-report-phase2-reports/attachments/P2-REP-003-1c48ad5f7edaa1cffdf6a117987c8c8c96b99c58.png)
- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-003-e72ad139b8574bc0dd1d925730994c02b8faf511.png)
- [Reports & Business Intelligence — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-low-stock.ui-F20-d-ef3cd-d-and-critical-stock-report-phase2-reports/error-context.md)
- [Reports & Business Intelligence — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Load the complete applicable dataset or aggregate server-side. Do not infer an incorrect asset total from zero-stock omissions; later-page positive initialization is separately blocked by P2-COUNT-005.

---

## P2-REP-004

### Title

VAT and fiscal reporting is unavailable

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Reports & Business Intelligence. Verified: 25 October 2026. Requirements: F20-e.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports
3. Inspect Report Focus choices and Business & Sales tax content.

### Expected Result

Fiscal reporting distinguishes standard VAT, zero-rated sales and net tax liability.

### Actual Result

Only aggregate tax-collected text exists; no VAT/fiscal report is available.

### Attachment

- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-tax-vat.ui-F20-e-s-bd00f-d-and-net-VAT-fiscal-report-phase2-reports/attachments/P2-REP-004-fa6987483f8cab4783108a06a9df67d2a8fcfc95.png)
- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-004-d7517403d1f5c481aaf2d7f673e544762c5348d0.png)
- [Reports & Business Intelligence — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-tax-vat.ui-F20-e-s-bd00f-d-and-net-VAT-fiscal-report-phase2-reports/error-context.md)
- [Reports & Business Intelligence — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Provide the required tax breakdown and reconcile it against eligible transactions. No guessed tax calculation is reported as a bug.

---

## P2-REP-005

### Title

Reports use dollar prefix for MUR financial values

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Reports & Business Intelligence. Verified: 25 October 2026. Requirements: F20-a.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports in Nexstock QA Company
3. Read the Stock Cost Value and other monetary KPI cards.

### Expected Result

MUR amounts use the confirmed Rs prefix.

### Actual Result

Financial KPI cards display dollar-prefixed amounts, for example $500.00.

### Attachment

- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-export-formats.ui--61841-onfirmed-Rs-currency-prefix-phase2-reports/attachments/P2-REP-005-78ea124b89933f44f5808ed5927768dad7bb96d3.png)
- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-005-757d16c6a550a8a3ec71acca8a0d5b3731deb9c6.png)
- [Reports & Business Intelligence — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-export-formats.ui--61841-onfirmed-Rs-currency-prefix-phase2-reports/error-context.md)
- [Reports & Business Intelligence — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Use company currency formatting consistently, preserving the configured decimal preference.

---

## P2-REP-006

### Title

Standard report PDF export is missing

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Reports & Business Intelligence. Verified: 25 October 2026. Requirements: F20-f.

### Priority

Medium

### Step-by-step

1. Sign in to the production Nexstock QA Company.
2. Open Reports
3. Open Download Format and inspect all options.

### Expected Result

Standard reports can be exported to PDF.

### Actual Result

Only CSV and Excel choices are available; PDF is absent.

### Attachment

- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-export-formats.ui--a41a0-ort-PDF-export-availability-phase2-reports/attachments/P2-REP-006-55f867ad29bd217feca222e99e1fadd3d6fbdc3e.png)
- [Reports & Business Intelligence — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-6/artifacts/reports-reports-full-flow.-fc044--export-full-flow-full-flow-phase2-reports/attachments/P2-REP-006-543c1a02de76c0b17cef8fc2070a4153d8daacaf.png)
- [Reports & Business Intelligence — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-1/artifacts/reports-export-formats.ui--a41a0-ort-PDF-export-availability-phase2-reports/error-context.md)
- [Reports & Business Intelligence — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/reports-assessment.json)

### Comment

Implement PDF export and validate actual downloaded content, layout and complete data.

---

## P2-DOC-001

### Title

Document Builder has no secondary brand color control

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Document Builder & Visual Template Designer. Verified: 25 October 2026. Requirements: F22-a.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Document Builder.
2. Inspect Theme Settings and all available controls.
3. Try to configure distinct primary and secondary brand colors.

### Expected Result

The document theme supports both primary and secondary brand colors.

### Actual Result

Only a Primary Color input is present. There is no Secondary Color field or selector.

### Attachment

- [Document Builder & Visual Template Designer — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-brand-t-92fd6-ondary-brand-theme-controls-phase2-document-templates/attachments/P2-DOC-001-4c26b16b467389b9a5422160fc455171561da073.png)
- [Document Builder & Visual Template Designer — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-documen-fbac2-invoice-full-flow-full-flow-phase2-document-templates/attachments/P2-DOC-001-d3f31f93479d3bec1c062e31340c62793bfd6325.png)
- [Document Builder & Visual Template Designer — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-brand-t-92fd6-ondary-brand-theme-controls-phase2-document-templates/error-context.md)
- [Document Builder & Visual Template Designer — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-assessment.json)

### Comment

Add secondary color configuration, persistence, preview and document application. Primary-color persistence is independently tested; logo selection is available in Settings and is not assumed missing.

---

## P2-DOC-004

### Title

Saved document theme updates Builder preview but is ignored by actual invoices

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Document Builder & Visual Template Designer. Verified: 25 October 2026. Requirements: F22-a, F22-d.

### Priority

High

### Step-by-step

1. In Document Builder, set primary color #17675e, Classic style and Roboto font; save.
2. Reload Builder and confirm the saved color/style/font remain.
3. Create a fresh Rs 100 QA service cash sale for QA Billing Automation Customer.
4. Open that exact sale's formal invoice through its actual /app/invoicing/<id> document.
5. Compare the invoice appearance to the saved theme and live preview.

### Expected Result

The generated invoice uses the saved document theme, including its selected primary branding color.

### Actual Result

Builder save/readback and live preview use #17675e, but the actual new invoice retains its fixed appearance. No document element uses the saved primary color. The deployed Invoice Details component reads the older invoice header/footer settings and does not consume the document-template query.

### Attachment

- [Document Builder & Visual Template Designer — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-brand-t-c0d13-generated-actual-QA-invoice-phase2-document-templates/attachments/P2-DOC-004-c67062ca46e9d4bab6ce90521406c104de688d0e.png)
- [Document Builder & Visual Template Designer — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-documen-fbac2-invoice-full-flow-full-flow-phase2-document-templates/attachments/P2-DOC-004-ae106fb02f55ca1a30b8cd023dd5be07d054e75f.png)
- [Document Builder & Visual Template Designer — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-2/artifacts/document-templates-brand-t-c0d13-generated-actual-QA-invoice-phase2-document-templates/error-context.md)
- [Document Builder & Visual Template Designer — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/document-templates-assessment.json)

### Comment

Connect actual document rendering to the persisted template configuration, then retest invoices, quotations and receipt output as applicable. Preserve saved content/branding and verify the exported document after RET-002 is repaired. All temporary template changes were restored.

---

## P2-AUD-001

### Title

Audit user, action and date filtering controls are incomplete

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Audit Logs & System Activity. Verified: 25 October 2026. Requirements: F25-b.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Audit Logs.
2. Confirm the activity stream includes named actors and Purchasing records.
3. Inspect the User and Module selectors, then click Filters.
4. Select Custom Range in Date Range and look for start/end date inputs.

### Expected Result

Users can filter the audit stream by an existing actor, recorded module, action type and a chosen date range.

### Actual Result

User offers All Users only. There is no Action Type selector; Filters opens no additional controls. Custom Range displays no from/to inputs or date-range query. Module choices omit the Purchasing records visible in the stream.

### Attachment

- [Audit Logs & System Activity — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-07776-action-type-filter-controls-phase2-audit-logs/attachments/P2-AUD-001-69ed6f590b25e473071f899cef4dc2c3c19e3cb1.png)
- [Audit Logs & System Activity — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-276e3-custom-date-range-filtering-phase2-audit-logs/attachments/P2-AUD-001-3fed279ab3df57e90acb9dc18d883599c5c27066.png)
- [Audit Logs & System Activity — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-07776-action-type-filter-controls-phase2-audit-logs/error-context.md)
- [Audit Logs & System Activity — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-assessment.json)

### Comment

Populate actual actors/modules and add action and date controls wired to the query. The existing Products query/reset is exercised separately; an empty Products result is not itself a defect.

---

## P2-AUD-003

### Title

Product CSV exports are absent from the audit activity stream

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Audit Logs & System Activity. Verified: 25 October 2026. Requirements: F25-a.

### Priority

Medium

### Step-by-step

1. Open Audit Logs and note the latest entry identifiers.
2. Open Products and download the actual standard CSV export.
3. Return to Audit Logs and inspect fresh activity repeatedly for at least 20 seconds.
4. Look for a new export event for the operation.

### Expected Result

The completed product export creates an audit event with its actor, timestamp and export operation.

### Actual Result

The real CSV file downloads, but no new export activity entry appears in fresh audit reads during the observation window.

### Attachment

- [Audit Logs & System Activity — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-activity-stream-de3a7-roduct-CSV-export-operation-phase2-audit-logs/attachments/P2-AUD-003-f5d11efbb38666fce58dda0cbfb8e4ec5b022aab.png)
- [Audit Logs & System Activity — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/attachments/P2-AUD-003-ea8532e3cf0f2eaec1ad315f51b3672e8b8443a9.png)
- [Audit Logs & System Activity — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-activity-stream-de3a7-roduct-CSV-export-operation-phase2-audit-logs/error-context.md)
- [Audit Logs & System Activity — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-assessment.json)

### Comment

Record the export operation in the audit stream, including actor, time and useful scope/reference. This ticket concerns logging product exports, not the Phase 3 audit-export capability.

---

## P2-AUD-004

### Title

Searching an actor shown in Audit Logs returns no matching entries

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Audit Logs & System Activity. Verified: 25 October 2026. Requirements: F25-b.

### Priority

Medium

### Step-by-step

1. Open Audit Logs in Nexstock QA Company.
2. Find an entry whose User is Fuad Peerbocus.
3. Enter Fuad Peerbocus into Search by user, action, or details.
4. Clear/reload the unfiltered page, confirm that actor still has entries, and repeat the exact search.

### Expected Result

Searching the displayed actor name returns that actor's matching activity entries.

### Actual Result

The exact displayed actor returns zero entries on two fresh attempts, while fresh unfiltered activity still contains that actor.

### Attachment

- [Audit Logs & System Activity — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-a20a6-ing-persisted-audit-entries-phase2-audit-logs/attachments/P2-AUD-004-e9ab3583c05a682ba92d87f3d8bdcce05e32876c.png)
- [Audit Logs & System Activity — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-audit-logs-full-4462e-h-audit-full-flow-full-flow-phase2-audit-logs/attachments/P2-AUD-004-f834065d9fd7b5c21b12575fa51d7fa226bb90b3.png)
- [Audit Logs & System Activity — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-3/artifacts/audit-logs-filter-search.u-a20a6-ing-persisted-audit-entries-phase2-audit-logs/error-context.md)
- [Audit Logs & System Activity — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/audit-logs-assessment.json)

### Comment

Include the displayed actor identity in backend search matching, with correct user joins/name handling. Keep tenant scoping and pagination intact. This is separate from the absent dedicated actor filter.

---

## P2-NOT-002

### Title

Issuing an already overdue unpaid invoice produces no immediate in-app alert

### Environment

[NexStock production](https://nexstock.stylotech.mu/app); **Nexstock QA Company**; Windows; Chromium, 1920 × 1080.

Module: Notifications & Alerts Center. Verified: 25 October 2026. Requirements: F29-c.

### Priority

Medium

### Step-by-step

1. Sign in to Nexstock QA Company and open Notifications > Settings.
2. Enable In-App and Invoice Due Reminders; disable quiet hours for the check. Use in-app delivery only.
3. Ensure the disposable QA inventory product has sufficient stock. Create an invoice for QA Billing Automation Customer with one QA item priced Rs100, issue date 10 October 2026 and due date 24 October 2026 (test date 25 October).
4. Save as Draft, then use Change Status to set Pending. Confirm the invoice remains unpaid with Rs100 outstanding and the past due date.
5. Immediately open Notifications and inspect fresh All/overdue alerts for the new invoice, allowing 30 seconds for delivery.

### Expected Result

Once the invoice is eligible and unpaid past its due date, an immediate in-app overdue alert identifies that invoice, consistent with the user's confirmed timing contract.

### Actual Result

The independent and integrated scenarios create valid past-due unpaid invoices, but no new matching overdue/invoice-due alert appears during the bounded observation window. Fresh main-feed reads contain no ambiguous new invoice alert either. One reproduced full-flow reference is INV-0Z2K2J.

### Attachment

- [Notifications & Alerts Center — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-3/artifacts/notifications-overdue-invo-3912a--unpaid-past-due-QA-invoice-phase2-notifications/attachments/P2-NOT-002-e4876617ae087562a5b81d299f08e1d36a7d6d28.png)
- [Notifications & Alerts Center — screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-3/artifacts/notifications-notification-57bf3--filter-full-flow-full-flow-phase2-notifications/attachments/P2-NOT-002-d8802d00f4fb5322827d957c2b8ca74a08ff6734.png)
- [Notifications & Alerts Center — failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-3/artifacts/notifications-overdue-invo-3912a--unpaid-past-due-QA-invoice-phase2-notifications/error-context.md)
- [Notifications & Alerts Center — reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/notifications-assessment.json)

### Comment

Evaluate overdue alert eligibility when the invoice becomes an unpaid past-due record, and deliver it immediately while respecting company scope, preferences and deduplication. The UI evidence does not establish whether an event, worker or scheduler is the root cause. Test invoices are cancelled during cleanup; create a new QA invoice for manual reproduction. Natural due-date crossing should also be tested after the fix.

---

