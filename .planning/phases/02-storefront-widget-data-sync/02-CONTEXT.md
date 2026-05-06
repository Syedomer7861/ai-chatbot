# Phase 02: Storefront Widget & Data Sync - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the storefront presence and the data backbone. This includes the Theme App Extension (App Block), the background data sync logic for Products and Policies, and the initial knowledge ingestion pipeline.

</domain>

<decisions>
## Implementation Decisions

### Storefront Widget
- **Type**: Theme App Extension (App Block).
- **Style**: Floating chat bubble (Bottom-Right).
- **Isolation**: Use Shadow DOM (mandatory for Shopify App Store review to prevent merchant theme CSS from breaking the widget).
- **Framework**: Preact or Vanilla JS (keep it lightweight for storefront performance).

### Data Sync
- **Scope**: Active products only.
- **Mechanism**:
    - Initial full sync on install.
    - Webhook-based updates (`products/update`, `products/create`, `products/delete`).
- **Storage**: Prisma (expand schema to include `ProductKnowledge` and `StorePolicy`).

### AI & Knowledge
- **Engine**: Gemini (via Google AI SDK).
- **Strategy**: RAG (Retrieval-Augmented Generation) foundation.
- **Chunks**: Simple per-product description chunks for MVP.

</decisions>

<canonical_refs>
## Canonical References

- `.planning/research/ARCHITECTURE.md` — Storefront Widget section.
- `extensions/ai-chatbot-widget` (to be created).

</canonical_refs>

<specifics>
## Specific Ideas

- Use `Liquid` to inject the merchant's brand colors (from Shopify settings) into the widget.
- Implement a "Loading" state for the chat bubble so it doesn't flicker on page load.

</specifics>

---
*Phase: 02-storefront-widget-data-sync*
*Context gathered: 2026-05-06 via "do the best" defaults*
