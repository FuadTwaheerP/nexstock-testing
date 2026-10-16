# Products & Catalog — Phase 1 UI automation

Each spec is independently runnable through its matching `npm run test:products:*` command. Tests use unique product names, SKUs and barcodes. Categories and units are created idempotently from the configured fixture names.

## Coverage

| Phase 1 submodule | Spec | Live automation status |
|---|---|---|
| Add Product | `add-product.ui.spec.ts` | Standard inventory, wholesale price and service/labour requirements execute as normal tests |
| Edit Product | `edit-product.ui.spec.ts` | Name, standard price, barcode and per-product tax requirements execute as normal tests |
| Delete / Archive | `archive-product.ui.spec.ts` | Active-list removal and recoverable archived-record requirements execute as normal tests |
| Variants & Attributes | `variants-attributes.ui.spec.ts` | Size, Color and Material combinations with independent SKU/price/stock |
| Categories & Organization | `categories-organization.ui.spec.ts` | Flat category, hierarchy and tag-grouping requirements execute as normal tests |
| Barcode Management | `barcode-management.ui.spec.ts` | Manual entry, exact lookup and keyboard-wedge scanner input |
| Units of Measure | `units-of-measure.ui.spec.ts` | Pieces, boxes, kg, meters and liters |
| Pricing & Taxes | `pricing-taxes.ui.spec.ts` | Cost, selling price, VAT classes and inclusive/exclusive requirements execute as normal tests |
| Media & Photography | `media-photography.ui.spec.ts` | Image upload and product-list display |
| Full Product Flow | `product-full-flow.ui.spec.ts` | Supported create → variants/image → barcode lookup → edit → archive path |

No Products test is intentionally skipped or annotated as an expected failure. Missing controls and product defects are reported as ordinary test failures so they can be tracked in the defect backlog.

## Required environment

Use a disposable account/business. These tests create catalog data and some tests archive it.

```powershell
$env:BASE_URL = 'https://your-target/app'
$env:ALLOWED_ORIGINS = 'https://your-target'
$env:TARGET_ENV = 'staging'
$env:ALLOW_WRITES = 'true'
$env:PRODUCT_TEST_ACCOUNT_DISPOSABLE = 'true'
$env:PRODUCT_TEST_EMAIL = '<email>'
$env:PRODUCT_TEST_PASSWORD = '<password>'
$env:PRODUCT_TEST_COMPANY = 'Nexstock QA Company'
```

After login, the shared fixture detects the **Choose a business** screen and selects this company before any product test continues.

Production is refused unless `TARGET_ENV=production` and `ALLOW_PRODUCTION_PRODUCT_TESTS=true` are both explicitly set.

Run everything:

```powershell
npm run test:products
```

Run one submodule:

```powershell
npm run test:products:add
npm run test:products:edit
npm run test:products:archive
npm run test:products:variants
npm run test:products:categories
npm run test:products:barcode
npm run test:products:uom
npm run test:products:pricing
npm run test:products:media
npm run test:products:flow
```
