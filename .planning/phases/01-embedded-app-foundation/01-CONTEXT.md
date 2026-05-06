# Phase 01: Embedded App Foundation - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the authenticated app shell within Shopify Admin. This includes OAuth 2.0 flow, Session Token handling (App Bridge v4), and a Polaris-styled dashboard shell.

</domain>

<decisions>
## Implementation Decisions

### Scaffolding
- Use official Shopify CLI (`npm init @shopify/app@latest`) to generate the boilerplate.
- Framework: React Router v7+ (Modern Shopify Template).
- Bundler: Vite.

### Core Stack
- UI: Polaris Web Components (via CDN).
- App Bridge: v4 (via CDN).
- Persistence: Prisma + SQLite (Local for MVP).

### App Identity
- App Handle: `ai-chatbot-app`.

### the agent's Discretion
- Project structure: Standard Shopify template structure (app/root.tsx, app/routes/*).
- Environment Variables: `SHOPIFY_API_KEY`, `SHOPIFY_API_SECRET`, `SCOPES`, `SHOPIFY_APP_URL`.
- Port: Defaulting to 3000 or as defined by Shopify CLI.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Shopify Standards
- `.planning/research/STACK.md` — 2025 Stack requirements.
- `.planning/research/PITFALLS.md` — OAuth and review gotchas.

</canonical_refs>

<specifics>
## Specific Ideas

- Ensure the `document.head` contains the CDN script tags for App Bridge v4 and Polaris Web Components.
- Implement a "Loading" state using Polaris components to ensure a smooth transition during session token validation.

</specifics>

<deferred>
## Deferred Ideas

- Storefront widget injection (Phase 2).
- AI Engine integration (Phase 3).
- Billing API (Phase 4).

</deferred>

---

*Phase: 01-embedded-app-foundation*
*Context gathered: 2026-05-06 via discuss-phase defaults*
