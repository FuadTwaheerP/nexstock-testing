// Consolidate reviewed cross-document evidence without duplicating each symptom.
import {readFileSync,writeFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
const root='blob-report/archive/retest-2026-11-19',path='data/retest-2026-11-19-review.json';
const review=JSON.parse(readFileSync(path,'utf8'));
const index=JSON.parse(readFileSync(join(root,'execution-index.json'),'utf8'));
const findings=JSON.parse(readFileSync(join(root,'findings.json'),'utf8'));
const c=index.cases.find(c=>c.title.startsWith('MVP-FONT-002'));
const dir=join(c.stage,'artifacts/document-design-custom-fon-b557c-e-Quotation-and-native-PDFs-phase3-document-design');
const evidence=names=>[join(c.stage,'results.json'),...names.map(n=>join(dir,n))];
const pass=(id,detail,stages)=>review.tickets[id]={status:'PASS',detail,evidence:stages.map(s=>join(root,s,'results.json'))};
pass('P3-LOOKUP-001','Server-search pickers found newly created products by lower-case SKU in batch creation, Invoice and Quotation; both billing customer pickers found a later-created active contact beyond the old initial page. Inactive contacts were excluded and stale selected contacts were refused by both save endpoints. MVP-LOOKUP-001 is the same capability. This does not certify every search-ranking or pagination boundary.',['shelf-life-2','customers-1','customers-2','document-design-3']);
pass('P3-FONT-001','Native Settings upload accepted Regular/Italic TTF files as multipart bodies, persisted both after reload and downloaded byte-identical files (SHA-256 matched fixtures). Invalid TXT was rejected, and the separate management-case font was deleted. MVP-FONT-001 is the same upload defect. Using these fonts in billing remains blocked by new RET-FONT-001; selected-font rendering is not passed.',['document-design-1','document-design-3']);
pass('MVP-FONT-002','Two font-capable product Text definitions survived native create, fresh read, native edit/save and another fresh read; both Invoice and Quotation exposed usable corresponding text inputs. This closes product-definition storage only. Their entered billing values are lost separately under new RET-FONT-002.',['document-design-3']);
pass('P2-DOC-004','Classic Invoice, Quotation and Credit Note retained exact #17675e borders and rendered brand text #2e766e against actual #13191b at 3.3256:1, exceeding the ticket minimum 3:1 and developer target 3.1. The readable #15b8a6 control stayed unchanged at 7.1359:1. Template settings were restored after each check; this is not a general accessibility audit.',['document-design-2']);
pass('P3-SEC-001','A valid own-session refresh retained one session row. Targeted revocation returned success, removed that row and made both access and refresh return 401; anonymous access also returned 401. Own logout removed its row. Other sessions/authentication factors were preserved. This verifies live behavior rather than direct Redis configuration.',['security-1']);
const fontFinding=structuredClone(findings.find(f=>f.id==='RET-FONT-001'));
fontFinding.steps=[
 'In Settings > Advanced, upload the bundled Vera.ttf and VeraIt.ttf as distinct Regular/Italic TTF fonts; reload and download each to verify persistence and exact SHA-256.',
 'Create a Service with two Text custom fields (QA Engraving and QA Signature), enabling font support on both; save, reopen, save and verify a fresh product read.',
 'Create an Invoice, find that product using the normal server-search picker and enter distinct text in both fields.',
 'Open each field font selector and inspect the available options for the uploaded Regular/Italic fonts.',
 'Repeat both field-selector checks on a new Quotation using the same product.'
];
fontFinding.actual='All four inspected selectors (two fields on Invoice and two on Quotation) offered only Default. Settings fonts 9 (QARETESTFontmwo8nflsRegular) and 10 (QARETESTFontmwo8nflsItalic) were absent despite successful native upload, fresh-list persistence and byte-identical downloads. Product 232 / QA-P3-FONTSERVIC-mwo8oo7b retained both font-capable definitions.';
fontFinding.comment='Upload and product-definition fixes passed. No font option was injected and no legacy localStorage font list was seeded (both billing checks observed null). A mismatch between the legacy font cache and server catalogue is a diagnostic hypothesis, not a verified backend cause. Populate both billing selectors from the tenant font catalogue and verify in a fresh session. Selected-font web/PDF output remains blocked before selection; Default controls do not prove an incorrect-font renderer defect. Fonts 9/10 and draft documents are retained for reproduction; the owned service is archived.';
fontFinding.attachments=['invoice-field-0-font-options.png','invoice-field-1-font-options.png','quotation-field-0-font-options.png','quotation-field-1-font-options.png'].map(n=>join(dir,n));
review.newTickets['RET-FONT-001']={status:'FAIL',detail:fontFinding.actual,evidence:evidence(['custom-font-workflow.json']),finding:fontFinding};
const textFinding=structuredClone(findings.find(f=>f.id==='RET-FONT-002'));
textFinding.title='Invoice and Quotation discard submitted customer custom text and omit it from web/PDF output';
textFinding.steps=[
 'Create/reopen the same Service with persisted QA Engraving and QA Signature Text definitions (font support enabled).',
 'Add it to a new Invoice through the normal product picker and enter QAREGMWO8NFLS Emile & Co and QAITALICMWO8NFLS Personalised gift in the two fields.',
 'Leave the available Default font selected; click Save as Draft and capture the native POST request and 201 response.',
 'Reload the exact Invoice and inspect its fresh item data and customer-facing web document; export its native PDF.',
 'Repeat the same native flow for a Quotation and inspect the fresh saved record, web document and native PDF.'
];
textFinding.actual='Both native POST requests included the two exact values in items[0].customFields. Both returned 201, but the response and fresh detail GET returned items[0].customFields=[]. Invoice 298 / INV-DJY67K and Quotation 40 / QUO-DP3RO0 both omitted the entered text from their customer-facing web view and native one-page PDFs. PDF extraction and visual review agreed. Product definitions remained persisted, so this is distinct from the corrected MVP-FONT-002 product-storage defect.';
textFinding.comment='Default-font controls isolate text persistence from RET-FONT-001. Fix retention/serialization of billing item custom fields and render the saved text in both document types; then rerun Default controls and independent per-field selected-font browser/PDF checks. Do not close this merely because the editor displays the text before saving. Native draft documents were retained; no customer delivery occurred. Backend storage versus resource serialization is not directly visible from this repository.';
textFinding.attachments=['invoice-saved-customer-text.png','quotation-saved-customer-text.png'].map(n=>join(dir,n));
review.newTickets['RET-FONT-002']={status:'FAIL',detail:textFinding.actual,evidence:evidence(['custom-font-workflow.json','invoice-custom-fonts.pdf','quotation-custom-fonts.pdf']),finding:textFinding};
// The create response used a placeholder SKU, but the fresh Invoice GET resolved
// the correct catalogue SKU. Do not report a persistent identity defect.
const json=name=>c.attachments.find(a=>a.name===name).json;
const skuObservation={observedAt:new Date().toISOString(),catalogue:{id:json('owned-product-fontservice').id,sku:json('owned-product-fontservice').sku},invoice:{postRequestSKU:json('invoice-saved-native-custom-fields').request.items[0].sku,postResponseSKU:json('invoice-saved-native-custom-fields').body.data.items[0].sku,freshDetailSKU:json('invoice-actual-browser-fonts').doc.items[0].sku},quotation:{postResponseSKU:json('quotation-saved-native-custom-fields').body.data.items[0].sku,freshDetailSKU:json('quotation-actual-browser-fonts').doc.items[0].sku},disposition:'Response inconsistency observed; fresh detail resolves correct catalogue SKU. Not classified as a persistent SKU or PDF defect.'};
writeFileSync(join(root,'sku-roundtrip-observations.json'),JSON.stringify(skuObservation,null,2)+'\n');
const correction='Waited for the actual saved template response and Classic letterhead before measuring dark-mode styles; the prior Modern fallback measurement was superseded by both passing contrast controls.';
if(!review.automationCorrections.includes(correction))review.automationCorrections.push(correction);
writeFileSync(path,JSON.stringify(review,null,2)+'\n');
console.log(JSON.stringify({reviewedPasses:5,mergedNewFindings:2,reviewFile:resolve(path)}));
