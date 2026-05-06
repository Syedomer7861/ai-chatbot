# Research: AI Chatbot Features

## Table Stakes (Must-Have)

- **Product Discovery**: Shoppers can ask "Do you have red sneakers?" and get direct product links.
- **Policy Retrieval**: Answers about shipping, returns, and refunds based on store pages.
- **Factual Grounding**: AI must only answer using store-provided data (no hallucinations).
- **Brand Matching**: Custom colors and tone of voice.
- **Mobile Responsive**: Widget must work seamlessly on iOS/Android browsers.
- **Shopify Billing**: App must handle plan upgrades/downgrades via Shopify API.

## Differentiators (Value Add)

- **Capture Lead Flow**: If AI doesn't know the answer, prompt for email to "notify when we have more info."
- **Collection Recommendations**: "Show me your summer collection."
- **Intent Analytics**: Merchant sees "Top 10 questions" to identify stock/info gaps.
- **Proactive Welcome**: Trigger a welcome message based on page URL (e.g., "Need help with sizing?" on product pages).

## Anti-Features (Avoid for MVP)

- **Human Live-Chat**: High complexity; requires agent seats and presence logic.
- **Multi-language Translation**: Use Shopify's native language if available, but don't auto-translate on-the-fly yet.
- **Order Modification**: Cancelling or editing orders via chat (Security/Audit risk).

## Dependencies

| Feature | Dependency |
|---------|------------|
| Product Search | Shopify Admin GraphQL API (Products) |
| Policy Answers | Shopify Admin GraphQL API (Pages/Online Store) |
| Billing | Shopify Billing API / App Bridge |
| Widget Injection | Theme App Extension (App Block) |

---
*Complexity: Medium (Primary challenge is RAG accuracy and Shopify OAuth)*
