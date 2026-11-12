# Products & Catalog - Bulk Catalog Operations - Phase 2 findings

Test date: **2026-10-25**. Production: https://nexstock.stylotech.mu/app. Company: **Nexstock QA Company**. Chromium/Windows.

## Execution summary

Final composite results: **6 passed, 3 application-failing cases, 0 blocked, 0 unresolved automation issues**. Duplicate failures are grouped into **2 confirmed tickets**. Setup/cleanup are included in the count, not feature coverage. Later focused reruns replace the same earlier cases.

A green assertion verifies only its exercised scenario. A failed full flow does not certify the steps it could not reach; independent steps attempted after a failure are recorded in its attachment. Missing/deferred prerequisites are not bugs or passing coverage. No intentionally skipped or expected-failure cases are used.

## Coverage limits / prerequisites

- CSV completeness is checked against every active SKU through actual UI pagination. Archived inclusions are allowed; no requirement to exclude archived products was assumed.
- Two-row valid CSV, invalid missing-name rows, quoted commas/quotes, CRLF, decimal prices/cost and leading-zero barcodes are exercised. This does not certify every encoding/size, conflicting duplicate-ID strategy, variants/media/new-field schema or rollback policy.
- Per-branch CSV inventory columns and total were explicitly required by the user on 25 October. Missing columns block numerical reconciliation; those later assertions are not passed.
- All created CSV fixtures are uniquely QA-prefixed and archived after inspection. No existing product or stock balance is edited by imports.

## Confirmed application bugs

## P2-BULK-001

### Title

Full-data JSON catalogue export omits products beyond the visible page

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F02-j.

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

Affected cases:

- F02-j JSON export contains the complete catalogue
- Bulk catalogue export import validate and archive QA rows

### Attachment

- [P2-BULK-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-export-catal-ad123-ains-the-complete-catalogue-phase2-products-bulk/attachments/P2-BULK-001-e6a9d369b64d317efdc06d40930f93e554a93ec1.png)
- [P2-BULK-001 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-products-bul-5fa58-d-archive-QA-rows-full-flow-phase2-products-bulk/attachments/P2-BULK-001-b27e26af7b60902f333d5f748f760e255be009e6.png)
- [F02-j JSON export contains the complete catalogue - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-export-catal-ad123-ains-the-complete-catalogue-phase2-products-bulk/error-context.md)
- [Bulk catalogue export import validate and archive QA rows - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-products-bul-5fa58-d-archive-QA-rows-full-flow-phase2-products-bulk/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-assessment.json)

### Comment

This ticket concerns the offered JSON Full data format and its all-products backup/migration claim. CSV's inclusion of archived records is not this defect. Export all required records independent of table pagination and verify SKU completeness, not just a successful download.

---

## P2-BULK-004

### Title

Product CSV inventory export lacks per-branch stock columns and an all-branch total

### Environment

Production NexStock; Nexstock QA Company; Chromium 1920 x 1080; Windows; 2026-10-25. Requirements: F02-j.

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

Affected cases:

- Bulk catalogue export import validate and archive QA rows
- F02-j CSV export displays every branch stock column and a reconciled company total

### Attachment

- [P2-BULK-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-products-bul-5fa58-d-archive-QA-rows-full-flow-phase2-products-bulk/attachments/P2-BULK-004-0871c256508c1ba9ecc53cacbb53a04120e50b65.png)
- [P2-BULK-004 screenshot](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-7/artifacts/products-bulk-export-branc-a182f--a-reconciled-company-total-phase2-products-bulk/attachments/P2-BULK-004-87807e4d861c7f650c099899c43cb1974f7874c0.png)
- [Bulk catalogue export import validate and archive QA rows - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-5/artifacts/products-bulk-products-bul-5fa58-d-archive-QA-rows-full-flow-phase2-products-bulk/error-context.md)
- [F02-j CSV export displays every branch stock column and a reconciled company total - failure context](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-7/artifacts/products-bulk-export-branc-a182f--a-reconciled-company-total-phase2-products-bulk/error-context.md)
- [Reviewed execution register](C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25/products-bulk-assessment.json)

### Comment

Confirmed against the user's explicit export contract, not an assumed default-branch policy. Add every branch column and a total calculated from the same inventory balances. Retest zero/positive branch values and equality of the total to all branch columns; no missing-column reconciliation is counted passed.

---

## Corrected automation / maintenance - not application tickets

- The current workspace's accessible name disappears when a Radix modal aria-hides the background. The scope check now validates the uniquely identified, previously observed QA header DOM text behind the modal; it is not a tenant-check bypass.
- Archive and Delete are distinct menu actions. Cleanup now explicitly chooses reversible Archive rather than an ambiguous Archive-or-Delete locator. Four exact owned fixtures left active by the initial adapter failure were recovered and archived; the recovery queue is empty.
- The catalogue total describes active products while CSV may include archived rows. Completeness now checks every active SKU through UI pagination, not a guessed equality between active and all-record counts. An initial count-only CSV failure is not an application ticket.
- Although the import preview's raw CRLF/quote representation looked suspicious, reopened product values passed the persistence assertions. No parsing-corruption bug was invented from preview formatting alone.

## Executed case register

| Check | Final result | Evidence attempt |
| --- | --- | --- |
| authenticate Phase 2 QA workspace | PASS | products-bulk-7 |
| F02-j CSV export contains the complete catalogue, not only the visible page | PASS | products-bulk-5 |
| F02-j JSON export contains the complete catalogue | FAIL - P2-BULK-001 | products-bulk-5 |
| audit Phase 2 write scope and log out QA session | PASS | products-bulk-7 |
| F02-j valid two-row CSV imports and survives catalogue reload with correct prices | PASS | products-bulk-5 |
| F02-j invalid empty-name CSV rows are rejected or skipped without creating products | PASS | products-bulk-5 |
| Bulk catalogue export import validate and archive QA rows | FAIL - P2-BULK-004, P2-BULK-001 | products-bulk-5 |
| F02-j standard CRLF CSV preserves quoted commas quotes and leading-zero barcodes | PASS | products-bulk-5 |
| F02-j CSV export displays every branch stock column and a reconciled company total | FAIL - P2-BULK-004 | products-bulk-7 |

Evidence root: C:/Users/amiirah/Documents/Projects/nexstock-testing/blob-report/archive/phase2-2026-10-25. Local attachment links must be uploaded separately when sharing tickets. Never attach auth state, .env, private baselines or generated staff credentials.

## Rerun

```powershell
node scripts/run-phase2.mjs products-bulk
node scripts/assess-phase2.mjs products-bulk
```

Append a spec filename to run a submodule independently or use `--grep @full-flow` for the integrated flow. Setup/cleanup remain required. Add `--headed` for a maximized visible browser.

