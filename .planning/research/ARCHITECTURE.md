# Research: Architecture

## Component Boundaries

1. **Embedded Admin App (React Router)**
   - Dashboard UI (Polaris).
   - Settings management (Brand, Tone, Data Sources).
   - Billing handling.
   - Conversation Logs & Analytics.

2. **Backend API (Node.js)**
   - OAuth / Session Token validation.
   - GraphQL proxy for Shopify Admin API.
   - AI Orchestration (Prompting LLM, fetching context).
   - Webhook handlers (Product updates, App uninstall).

3. **Storefront Widget (Theme App Extension)**
   - App Block (`liquid` + `javascript`).
   - Shadow DOM for styling isolation.
   - Communication with Backend API via `fetch`.

4. **AI/Data Layer**
   - Vector Store (optional for MVP, or Simple Search) for store data context.
   - LLM Integration (e.g., Gemini API).

## Data Flow

1. **Ingestion**: Backend fetches Products/Pages via GraphQL -> Formats for Context -> Stores in Database/Cache.
2. **Chat**: Shopper sends message -> Widget calls Backend -> Backend fetches context -> Backend calls LLM -> Response sent back to Widget.
3. **Analytics**: Every chat interaction logged in Database -> Aggregated for Dashboard.

## Suggested Build Order

1. **Auth & Shell**: Get the app installing and running in Shopify Admin.
2. **Data Sync**: Implement GraphQL fetching for products/policies.
3. **Storefront Widget**: Basic injection via Theme Extension.
4. **AI Core**: Connect LLM to the synced data.
5. **Billing & Polish**: Implement plans and dashboard analytics.

---
*Boundary Concern: Styling isolation in Theme App Extensions is critical to avoid breaking merchant themes.*
