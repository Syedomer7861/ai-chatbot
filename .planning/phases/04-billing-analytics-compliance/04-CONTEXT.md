# Phase 04: Billing, Analytics & Compliance - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Finalize the app for production. This includes setting up the Shopify Billing API for monetization, implementing mandatory GDPR webhooks for compliance, and performing a final visual and performance audit.

</domain>

<decisions>
## Implementation Decisions

### Billing
- **Plan Name**: "Standard Pro"
- **Amount**: $9.99 USD / month
- **Trial**: 7 Days
- **Logic**: Use the `billing` configuration in `shopify.server.ts`.

### Compliance
- **GDPR Webhooks**:
    - `customers/data_request`
    - `customers/redact`
    - `shop/redact`
- **Support**: Add a "Need Help?" link in the dashboard pointing to a support placeholder.
- **App Store Requirements**: Ensure all external links use `App Bridge` navigation.

### Final Polish
- **Widget**: Add a "powered by" link (optional but common).
- **Onboarding**: Ensure the first-run experience is smooth (DB record creation on install).

</decisions>

<canonical_refs>
## Canonical References

- `app/shopify.server.ts` — Location for billing config.
- `shopify.app.toml` — Location for GDPR webhook registrations.
- `app/routes/webhooks.tsx` — Location for GDPR webhook handlers.

</canonical_refs>

<specifics>
## Specific Ideas

- Implement a "Billing Status" indicator in the dashboard.
- Create a `WALKTHROUGH.md` for the user to follow during final testing.

</specifics>

---
*Phase: 04-billing-analytics-compliance*
*Context gathered: 2026-05-06*
