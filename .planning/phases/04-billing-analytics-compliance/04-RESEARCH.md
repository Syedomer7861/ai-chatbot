# Phase 04: Billing, Analytics & Compliance - Research

## Implementation Strategy

### 1. Shopify Billing
- **Configuration**: Define the "Standard Pro" plan in `shopify.server.ts` within the `billing` object.
- **Enforcement**: In `app/routes/app._index.tsx` (or a dedicated route), use `await billing.require(...)`.
- **Flow**: If the merchant hasn't subscribed, they are redirected to the Shopify-hosted approval page.

### 2. GDPR Compliance
- **Webhooks to implement**:
    - `CUSTOMERS_DATA_REQUEST`: Request for customer data.
    - `CUSTOMERS_REDACT`: Request to delete customer data.
    - `SHOP_REDACT`: Request to delete shop data after uninstallation.
- **Registration**: Add them to the `webhooks` section in `shopify.server.ts`.
- **Handling**: These must be verified via `authenticate.webhook(request)`.

### 3. Visual Polish & Storefront Analytics
- **Widget Polish**: 
    - Ensure `chatbot.js` correctly handles the `response` from the new AI endpoint.
    - Add a simple "typing" indicator in CSS/JS.
- **Analytics**: 
    - Log conversation start events in the DB to drive the dashboard metrics.

## Gotchas & Pitfalls
- **Billing Redirects**: Ensure `billing.require` handles the redirect correctly without breaking the iframe.
- **GDPR Verification**: Shopify will fail your app review if these webhooks aren't registered and returning a 200 OK.
- **App Store Requirements**:
    - App must use App Bridge v4 (which we already injected in `root.tsx`).
    - App must not have broken image links or placeholder text.

---
*Research complete: 2026-05-06*
