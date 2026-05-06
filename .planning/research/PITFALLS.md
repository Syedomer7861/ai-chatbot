# Research: Common Pitfalls

## Shopify Review Rejections

- **OAuth Loop**: App fails to handle re-authentication or session token expiry.
- **Off-platform Billing**: Trying to charge via Stripe/PayPal directly (strictly forbidden for App Store).
- **Theme Code Pollution**: Injecting code directly into `theme.liquid` instead of using App Blocks.
- **API Versioning**: Using deprecated GraphQL fields. (Always use the latest stable version).
- **Misleading Claims**: Claiming "Best" or "Guaranteed sales" in the app listing.

## Technical Gotchas

- **Styling Clashes**: Chat widget CSS leaking into the storefront or vice-versa. (Use Shadow DOM).
- **Rate Limits**: Hitting Shopify Admin API limits during initial product sync for large stores. (Use bulk operations).
- **Hallucinations**: AI recommending out-of-stock products or inventing non-existent return policies. (Strict system prompting required).
- **Session Tokens**: Failing to use the new App Bridge v4 session token pattern, leading to broken frames in Safari.

## Prevention Strategy

- **Verification Loop**: Test OAuth in a development store with a fresh install.
- **Theme Testing**: Test the widget on the "Dawn" theme and at least one paid premium theme.
- **Safe Fallbacks**: Implement explicit "I don't know" logic for the LLM.
- **Billing Sandboxing**: Use Shopify test charges to verify the full subscription flow.

---
*Critical: Shopify's "Embedded App" requirements are non-negotiable for approval.*
