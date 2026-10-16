# Source findings and questions before sign-off

These findings come from the uploaded staging snapshot, not runtime reproduction on the current deployment.

| Finding | Evidence in staging source | QA implication |
|---|---|---|
| Fractional POS quantity is not accepted | `api/modules/Sales/Infrastructure/Http/Requests/RecordPosSaleRequest.php`: integer/min:1 | Supplied kg/metres/litres scope needs a decision for fractional sales |
| Membership roles are owner/admin/manager/staff | `api/modules/Companies/Domain/Enums/MembershipRole.php` | Map Cashier to staff only after confirmation; platform Super Admin is separate |
| Remember me only changes component state | `web/src/pages/auth/SignInPage.tsx`: rememberMe never passed to login | Candidate functional gap; verify intended session persistence |
| Login legal buttons have no navigation handler and no type=button | Same SignInPage form | Candidate defect: clicking Terms/Privacy can submit the login form instead of opening documents |
| Password eye button has no accessible name; Remember me is clickable div | Same SignInPage form | Keyboard/screen-reader acceptance required |
| Existing Cypress spec targets example page | `web/cypress/e2e/spec.cy.ts` | It is not meaningful coverage for business workflows |
| Browser offline POS not established | Website README contrasts mobile outbox with web lacking queue | Do not count mobile offline implementation as browser coverage; Phase 3 |
| Docs disagree with source | PRD appendix says cash-register/stock-count screens absent; router includes them | Prefer inspected code, verify deployed version |
| Payment/document/fulfilment status are separate | InvoiceResource and CreateInvoiceRequest | Do not assert one literal enum matching every label in supplied spec |
| Real payment-provider integration is not established | Source payment webhook is disabled without configured secret | Recorded card/Juice tender is not a real payment settlement test |
| Legal compliance cannot be proved by E2E tests | User specification requires approved Terms/Privacy | Test accessibility/version/content presence; obtain legal/product approval separately |

Confirm: deployed commit, staging URL, browser targets, disposable tenant/reset mechanism, role accounts, branch/payment IDs, VAT rounding/discount policy, idle timeout configuration and supported image sizes. These are execution prerequisites, not reasons to postpone creating the project.
