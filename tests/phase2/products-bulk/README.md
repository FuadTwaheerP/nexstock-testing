# Bulk Catalog Operations - Phase 2

Independent scripts cover CSV/JSON export, user-confirmed branch stock columns/totals, valid two-row import and persistence, invalid required-name rows, CRLF/quoted CSV and leading-zero barcodes. The integrated script executes export/import/validation/cleanup in one journey and records all failed steps without skipping them.

Run `node scripts/run-phase2.mjs products-bulk`; append a spec filename to run independently, `--grep @full-flow` for the module flow, or `--headed` to visualize it. Authentication, exact QA company selection and cleanup/audit/logout are required.

Only uniquely QA-P2-CSV-prefixed fixtures are imported. Tests reopen Edit to check persisted name, price, cost, description and barcode, then explicitly Archive (not Delete) their own records. Four exact fixtures left by an early ambiguous cleanup locator were recovered; its queue is empty. No existing product or stock balance is modified.

Reviewed result: 6 passes including setup/cleanup, 3 failing cases grouped into two confirmed export bugs, zero unresolved automation issues. CSV includes every active SKU; JSON misses paginated records; branch/total columns are absent. Details and scope limits are in `docs/phase2/bugs/products-bulk.md`. Duplicate-ID conflict policy, every encoding/size and advanced new-field/variant/media formats are not certified.
