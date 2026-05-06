# Phase 03: AI Engine & Admin Dashboard - Context

**Gathered:** 2026-05-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrate the "brain" (Gemini) into the storefront chat and build the merchant control center in the Shopify Admin. This includes prompt engineering for RAG, the Admin Dashboard UI for settings and analytics, and the merchant-facing sync status.

</domain>

<decisions>
## Implementation Decisions

### AI Engine
- **Provider**: Google Gemini (via `@google/generative-ai`).
- **Model**: `gemini-1.5-flash` (or `gemini-2.0-flash` if available in the SDK).
- **Key**: `AIzaSyCvIM613H1jpUs1D3m3l0HbGR7z-bAjnmU` (Provided by user).
- **Prompting**: 
    - **System Persona**: "You are a helpful, professional shopping assistant for the Shopify store. Use the provided context to answer customer questions about products, shipping, and store policies. If you don't know the answer, politely offer to capture their email for a follow-up."
    - **RAG Integration**: Inject knowledge snippets from Phase 2 into the prompt.

### Admin Dashboard
- **Framework**: Polaris (React Router).
- **Settings**:
    - Bot Name (Text field).
    - Custom Persona/Instruction (Text area).
- **Analytics**:
    - "Pulse" metrics: Total messages, successful retrievals.
    - Top products queried (based on knowledge access logs).

### Knowledge Sync UI
- **Feature**: A "Sync Now" button to manually trigger product/policy re-indexing.
- **Feedback**: Progress bar or "Last Synced" timestamp.

</decisions>

<canonical_refs>
## Canonical References

- `app/routes/api.chat.tsx` — The endpoint to be updated with Gemini logic.
- `app/routes/app._index.tsx` — The dashboard to be built.

</canonical_refs>

<specifics>
## Specific Ideas

- Use `shopify.toast` to confirm settings saves and sync triggers.
- Implement a "Preview Chat" in the Admin dashboard so merchants can test their persona without going to the storefront.

</specifics>

---
*Phase: 03-ai-engine-admin-dashboard*
*Context gathered: 2026-05-06 via user-provided API key*
