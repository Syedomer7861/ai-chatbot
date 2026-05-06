# Phase 03: AI Engine & Admin Dashboard - Research

## Implementation Strategy

### 1. Gemini Integration (The "Brain")
- **SDK**: `@google/generative-ai`.
- **Model**: `gemini-1.5-flash`.
- **RAG Pipeline**:
    1. Receive user message and `shop`.
    2. Search DB for relevant `KnowledgeItem`s (Keyword/FTS).
    3. Construct a System Prompt:
       ```text
       You are a helpful, professional shopping assistant for the Shopify store.
       Use ONLY the provided context to answer customer questions.
       If the answer is not in the context, say "I'm sorry, I don't have that information. Can I get your email to have someone follow up with you?"
       
       Context:
       ${retrievedSnippets}
       ```
    4. Call Gemini and stream/return the response.

### 2. Admin Dashboard (Settings & Stats)
- **UI Framework**: Polaris Web Components (`s-` tags).
- **Settings Persistence**:
    - For MVP, store in a `AppSettings` table in Prisma.
    - Fields: `shop`, `botName`, `botPersona`.
- **Analytics Ingestion**:
    - Track "Conversations" in a new `ChatSession` table.
    - Simple count queries for the dashboard.

### 3. Sync Status & Control
- **Manual Sync**: Add a `/api/sync` endpoint that calls `syncPolicies` and re-triggers product ingestion.
- **UI**: A Polaris `Banner` or `Card` showing:
    - Total items in knowledge base.
    - Last sync timestamp.
    - "Sync Now" button.

## Gotchas & Pitfalls

- **API Usage Limits**: Gemini Flash has a generous free tier, but monitor for "429 Too Many Requests".
- **Token Limits**: Ensure context snippets are truncated to avoid exceeding model input limits (though Flash handles 1M+ tokens).
- **Session Tokens**: Ensure all Admin calls are authenticated with `shopify.authenticate.admin`.

---
*Research complete: 2026-05-06*
