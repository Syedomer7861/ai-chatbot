# Research: 2025 Shopify App Stack

## Recommended Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | **React Router (v7+)** | Shopify CLI templates have transitioned from Remix to React Router. |
| **Bundler** | **Vite** | Standard for high-speed development and production bundling. |
| **UI System** | **Polaris Web Components** | Framework-agnostic, stable, and now the default via CDN. |
| **App Bridge** | **App Bridge v4** | Loaded via CDN script tag; no more heavy provider setup. |
| **Backend** | **Node.js (Fastify/Express)** | Robust ecosystem for Shopify OAuth and Webhooks. |
| **Database** | **Prisma + SQLite/Postgres** | Standard for Shopify app data persistence. |
| **Storefront** | **Theme App Extensions** | Required for App Store apps; no manual theme code edits. |

## Implementation Details

### Polaris & App Bridge (CDN First)
Add these to your document `<head>`:
```html
<script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
<link rel="stylesheet" href="https://cdn.shopify.com/shopifycloud/polaris-web/v13/polaris-web.css">
<script type="module" src="https://cdn.shopify.com/shopifycloud/polaris-web/v13/polaris-web.esm.js"></script>
```

### Authentication
- Use **Session Tokens** (App Bridge v4) for all Admin API requests.
- Traditional OAuth is only for the initial install/re-install flow.

## What NOT to use
- **Polaris React (Legacy)**: Now in maintenance mode; prefer Web Components.
- **App Bridge (NPM)**: Deprecated; use the CDN script tag.
- **Manual Script Tags in Theme**: Use **App Blocks** (Theme App Extensions) instead.

---
*Confidence Level: High (Based on 2025 Shopify developer documentation)*
