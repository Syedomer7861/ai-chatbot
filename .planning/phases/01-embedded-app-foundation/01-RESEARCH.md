# Phase 01: Embedded App Foundation - Research

## Implementation Strategy

### 1. Scaffolding
- **Command**: `npm init @shopify/app@latest -- --template reactRouter --name ai-chatbot-app --path . --package-manager npm`
- **Why**: Uses the modern 2025 Shopify app template which integrates React Router v7+ and Vite.

### 2. App Bridge v4 Integration
- **Mechanism**: CDN-hosted script tag.
- **Location**: `app/root.tsx` (or equivalent HTML entry point).
- **Initialization**:
  ```html
  <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  ```
- **Validation**: Ensure `window.shopify` is available. Use `shopify.config` to verify the host and API key.

### 3. Polaris Web Components
- **Mechanism**: CDN script and CSS.
- **Location**: `app/root.tsx`.
- **Initialization**:
  ```html
  <link rel="stylesheet" href="https://cdn.shopify.com/shopifycloud/polaris-web/v13/polaris-web.css">
  <script type="module" src="https://cdn.shopify.com/shopifycloud/polaris-web/v13/polaris-web.esm.js"></script>
  ```
- **Usage**: Replace standard React components with `<polaris-button>`, `<polaris-card>`, etc.

### 4. Authentication Flow
- **Offline Flow**: Initial installation (exchange code for permanent access token).
- **Online Flow**: Session-based access for the Admin UI (Session Tokens).
- **Session Tokens**: Handled automatically by App Bridge v4. The backend must verify the JWT sent in the `Authorization: Bearer <token>` header.

### 5. Deployment Considerations
- **Environment**: The Shopify CLI handles local tunneling (Cloudflare/Ngrok) via `npm run dev`.
- **Secrets**: Store `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET` in `.env`.

## Gotchas & Pitfalls

- **Iframe Issues**: Ensure `Content-Security-Policy` allows the app to be embedded in `admin.shopify.com`.
- **Top-level Navigation**: Use `shopify.navigate` instead of browser `window.location` to stay within the Shopify Admin context.
- **Session Expiry**: Implement graceful re-authentication if the session token expires (App Bridge v4 handles the refresh, but backend must return 401 correctly).

---
*Research complete: 2026-05-06*
