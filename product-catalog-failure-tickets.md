# Products & Catalog Management — Failure Tickets

**Environment:** Production  
**URL:** https://nexstock.stylotech.mu/app  
**Workspace:** Nexstock QA Company  
**Browser:** Chromium  
**Exported:** 16 October 2026

---

## 1. Add Product does not provide a separate wholesale price field

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Add Product

### Priority

Medium

### Step-by-step

1. Log in with the disposable test account.
2. Select Nexstock QA Company if the workspace selection screen appears.
3. Navigate to Products.
4. Click New Product.
5. Inspect the pricing fields in the Add Product dialog.
6. Look for a Wholesale Price field.

### Expected Result

The form should provide separate fields for cost price, standard selling price and wholesale price. The wholesale price should be saved with the product.

### Actual Result

Only cost price and standard selling price are available. There is no separate wholesale-price field.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-add-produc-9adfe-esale-price-phase1-products-chromium-products\test-failed-1.png)

### Comment

Reproduced by the automated test: supports a separate wholesale price.

---

## 2. Add Product does not support service or labour items without inventory tracking

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Add Product

### Priority

Medium

### Step-by-step

1. Log in and select Nexstock QA Company.
2. Navigate to Products.
3. Click New Product.
4. Look for a Product Type or Item Type selector.
5. Attempt to select Service or Labour.
6. Attempt to create the item without stock tracking.

### Expected Result

The user should be able to select a service or labour product type. Inventory quantity and stock tracking should not be required for that type.

### Actual Result

No product-type selector is available. Products can only be entered using the inventory-oriented form.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-add-produc-174d0-ry-tracking-phase1-products-chromium-products\test-failed-1.png)

### Comment

Reproduced by the automated test: creates a service or labour item without inventory tracking.

---

## 3. Products module has no Archived view or status filter for recovering archived records

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Delete / Archive

### Priority

High

### Step-by-step

1. Log in and select the test workspace.
2. Navigate to Products.
3. Create and save a new inventory product.
4. Open the product's actions menu.
5. Select the available Archive or Delete action.
6. Confirm the action.
7. Return to the Products page.
8. Look for an Archived status filter or archived-products view.
9. Attempt to search for the archived product by SKU.

### Expected Result

The product should be soft-deleted and retrievable from an Archived view. Its record should remain available for historical transactions.

### Actual Result

The product disappears from the active list, but no Archived status filter or recovery view is available.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-archive-pr-d1acd-ical-record-phase1-products-chromium-products\test-failed-1.png)

### Comment

Active-list removal works. The failure concerns recovery and verification of the retained archived record.

---

## 4. Barcode scanner mode removes the first character of the scanned barcode

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Barcode Management

### Priority

High

### Step-by-step

1. Log in and navigate to Products.
2. Click New Product.
3. Locate the Barcode field in scanner mode.
4. Confirm that it displays the scanner-ready placeholder.
5. Scan or type 9123456789012 as keyboard-wedge input.
6. Send Enter, as a barcode scanner normally would.
7. Inspect the resulting barcode value.

### Expected Result

The Barcode field should contain exactly 9123456789012.

### Actual Result

The first character is removed. The field contains 123456789012.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-barcode-ma-0c178-rcode-input-phase1-products-chromium-products\test-failed-1.png)

### Comment

Manual barcode entry and exact barcode lookup pass. The defect is specific to keyboard-wedge scanner mode.

---

## 5. Product categories do not support parent and child hierarchy

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Settings → Products → Product Categories

### Priority

Medium

### Step-by-step

1. Log in and select the test workspace.
2. Navigate to Settings.
3. Open the Products tab.
4. Create or identify an existing category to use as a parent.
5. Start creating another category.
6. Look for a Parent Category selector.
7. Attempt to assign the new category as a child of the existing category.

### Expected Result

Category creation should provide a parent-category selector and allow parent and child category relationships.

### Actual Result

Only flat category creation is available. There is no parent-category selector.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-categories-1b30e-y-hierarchy-phase1-products-chromium-products\test-failed-1.png)

### Comment

Flat category creation works successfully. Only multi-level hierarchy is missing.

---

## 6. Add Product does not provide tag assignment or tag grouping

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Categories & Organization

### Priority

Low

### Step-by-step

1. Log in and navigate to Products.
2. Click New Product.
3. Inspect all sections and tabs in the product form.
4. Look for a Tags field or tag-assignment control.
5. Attempt to assign one or more tags to the product.

### Expected Result

The product form should allow tags to be assigned so products can be grouped and filtered by tags.

### Actual Result

No tag-assignment control is available.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-categories-908cc-ag-grouping-phase1-products-chromium-products\test-failed-1.png)

### Comment

Category assignment exists, but it does not replace the requested tag-grouping functionality.

---

## 7. Edit Product does not allow VAT classification to be changed

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Edit Product

### Priority

High

### Step-by-step

1. Log in and navigate to Products.
2. Create a standard inventory product.
3. Locate the product in the catalogue.
4. Open its actions menu and select Edit.
5. Inspect the pricing and tax fields.
6. Look for a Tax Classification, VAT Rate or VAT Class selector.
7. Attempt to change the product to Standard VAT 15%.

### Expected Result

The edit form should allow the product's VAT classification to be changed and saved.

### Actual Result

No per-product VAT-classification field is available in the Edit Product dialog.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-edit-produ-f1154-ssification-phase1-products-chromium-products\test-failed-1.png)

### Comment

Editing the product name, selling price and barcode works. The failure is limited to tax classification.

---

## 8. Product image disappears after saving the product

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Media & Photography

### Priority

Medium

### Step-by-step

1. Log in and navigate to Products.
2. Click New Product.
3. Complete the required product fields.
4. Open the Images tab.
5. Upload a supported PNG or JPG image.
6. Confirm that the image preview appears.
7. Save the product.
8. Locate the saved product and select Edit.
9. Open the Images tab again.

### Expected Result

The uploaded image should remain attached to the product and should be visible after reopening it.

### Actual Result

The image preview appears before saving, but no image is displayed after reopening the saved product.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-media-phot-ea387-roduct-list-phase1-products-chromium-products\test-failed-1.png)

### Comment

File selection and pre-save preview work. Persistence or retrieval of the saved image fails.

---

## 9. Add Product does not provide Standard VAT, Zero-Rated and Exempt classifications

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Pricing Rules & Taxes

### Priority

High

### Step-by-step

1. Log in and navigate to Products.
2. Click New Product.
3. Inspect the pricing and tax section.
4. Look for a tax-classification selector.
5. Attempt to select Standard VAT 15%.
6. Attempt to select Zero-Rated 0%.
7. Attempt to select Exempt.

### Expected Result

A per-product tax-classification selector should expose all three supported VAT classifications.

### Actual Result

No per-product tax-classification selector is available.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-pricing-ta-2c723-per-product-phase1-products-chromium-products\test-failed-1.png)

### Comment

This ticket covers classification during product creation. Ticket 7 separately covers changing the classification while editing.

---

## 10. Add Product does not allow tax-inclusive or tax-exclusive pricing selection

### Environment

Production — https://nexstock.stylotech.mu/app; Workspace — Nexstock QA Company; Browser — Chromium; Module — Products & Catalog → Pricing Rules & Taxes

### Priority

High

### Step-by-step

1. Log in and navigate to Products.
2. Click New Product.
3. Enter a standard selling price.
4. Inspect the pricing and tax section.
5. Look for a tax-inclusive or tax-exclusive switch or checkbox.
6. Attempt to change between tax-inclusive and tax-exclusive pricing.

### Expected Result

The form should provide a pricing-mode control and clearly indicate whether the entered selling price includes or excludes tax.

### Actual Result

No tax-inclusive or tax-exclusive pricing control is available.

### Attachment

[Failure screenshot](C:\Users\amiirah\Documents\Projects\nexstock-testing\test-results\phase1-products-pricing-ta-14d6d-uct-pricing-phase1-products-chromium-products\test-failed-1.png)

### Comment

Cost and standard selling prices persist successfully. The missing functionality is the tax treatment of those prices.

---

## Test Report

[Open the complete Playwright report](C:/Users/amiirah/Documents/Projects/nexstock-testing/playwright-report/index.html)

