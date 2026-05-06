# Phase 02: Storefront Widget & Data Sync - Research

## Implementation Strategy

### 1. Theme App Extension (Widget)
- **Command**: `npm run generate extension` -> Select `Theme App Extension`.
- **Structure**:
    - `blocks/chatbot.liquid`: The entry point for the widget.
    - `assets/chatbot.js`: The Preact/Vanilla JS logic.
    - `assets/chatbot.css`: The Shadow DOM styles.
- **Shadow DOM Implementation**:
    ```javascript
    class ChatbotWidget extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
      }
      connectedCallback() {
        this.shadowRoot.innerHTML = `
          <style>@import "${this.getAttribute('css-url')}";</style>
          <div id="chatbot-container">
            <!-- Widget HTML -->
          </div>
        `;
        // Initialize Preact/Logic here
      }
    }
    customElements.define('ai-chatbot-widget', ChatbotWidget);
    ```
- **Liquid Integration**: Pass `shop.url` and brand colors via attributes:
    ```liquid
    <ai-chatbot-widget 
      css-url="{{ 'chatbot.css' | asset_url }}"
      shop-url="{{ shop.permanent_domain }}"
      primary-color="{{ block.settings.primary_color }}"
    ></ai-chatbot-widget>
    ```

### 2. Data Sync (Backend)
- **Webhooks**: Register `products/create`, `products/update`, `products/delete` in `shopify.app.toml`.
- **Mandatory Ingestion**:
    - Products: Title, Description, Variants (Price, SKU), Handle.
    - Policies: Refund, Shipping, Privacy (via `shop` object or specific policy endpoints).
- **Prisma Schema Update**:
    ```prisma
    model KnowledgeItem {
      id        String   @id @default(uuid())
      shopId    String
      type      String   // "product", "policy", "page"
      sourceId  String   // Shopify ID
      content   String   // Text for RAG
      metadata  Json?
      updatedAt DateTime @updatedAt
    }
    ```

### 3. Gemini RAG foundation
- **Library**: `@google/generative-ai`.
- **Model**: `gemini-1.5-flash` (balanced speed/cost).
- **Strategy**:
    - **Search**: For SQLite MVP, use Prisma `findMany` with keyword filters on `content`.
    - **Context**: Inject top 5 matches into the Gemini system prompt.

## Gotchas & Pitfalls

- **Storefront Performance**: Ensure the widget JS is loaded as `defer` to not block LCP.
- **Style Leaks**: Even with Shadow DOM, some styles inherit. Reset `all: initial` or specific properties in the shadow container.
- **Webhook Delivery**: Ensure the backend can handle bursts of webhooks during a bulk product update.

---
*Research complete: 2026-05-06*
