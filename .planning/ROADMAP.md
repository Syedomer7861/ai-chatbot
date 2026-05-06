# Roadmap: Shopify AI Chatbot

## Overview

This roadmap takes us from a blank slate to a review-ready Shopify AI Chatbot app. We focus first on the mandatory Shopify App Bridge/OAuth foundation, then move to data ingestion and storefront injection, followed by the AI engine, and finally the monetization and compliance requirements for the App Store.

## Phases

- [ ] **Phase 1: Embedded App Foundation** - Establish OAuth, App Bridge, and Polaris Admin shell.
- [ ] **Phase 2: Storefront Widget & Data Sync** - Build the Theme Extension widget and background knowledge ingestion.
- [ ] **Phase 3: AI Engine & Admin Dashboard** - Connect the LLM with store data and build the settings/logs UI.
- [ ] **Phase 4: Billing, Analytics & Compliance** - Implement subscription plans, basic stats, and prepare for Shopify review.

## Phase Details

### Phase 1: Embedded App Foundation
**Goal**: A functional, authenticated Shopify app that loads in the Shopify Admin.
**Depends on**: Nothing
**Requirements**: [AUTH-01, AUTH-02, AUTH-03, AUTH-04]
**Success Criteria**:
  1. Merchant can install the app on a development store.
  2. The app shell loads within the Shopify Admin iframe without errors.
  3. App Bridge v4 is correctly initialized via CDN script tag.
  4. The "Dashboard" tab shows a Polaris-styled empty state.
**Plans**: 2 plans
- [ ] 01-01: Scaffold project with React Router, Vite, and Node.js backend.
- [ ] 01-02: Implement Shopify OAuth and App Bridge v4 session token handling.

### Phase 2: Storefront Widget & Data Sync
**Goal**: Inject a chat widget on the storefront and sync merchant data.
**Depends on**: Phase 1
**Requirements**: [WDGT-01, WDGT-02, WDGT-03, WDGT-04, KNWL-01, KNWL-02]
**Success Criteria**:
  1. Chat widget appears on the storefront when enabled in Theme Editor.
  2. Widget uses Shadow DOM and doesn't conflict with theme styles.
  3. App successfully fetches products and pages via GraphQL and stores them locally.
  4. Merchant can trigger a manual "Sync Data" action.
**Plans**: 2 plans
- [ ] 02-01: Create Theme App Extension (App Block) with Shadow DOM widget.
- [ ] 02-02: Build GraphQL sync engine for Products and Pages.

### Phase 3: AI Engine & Admin Dashboard
**Goal**: Real-time AI answers grounded in store data.
**Depends on**: Phase 2
**Requirements**: [AI-01, AI-02, AI-03, AI-04, DASH-01, DASH-02]
**Success Criteria**:
  1. AI answers questions about products with correct links.
  2. AI respects the "Tone" setting (e.g., Casual vs Professional).
  3. AI triggers a lead capture form if it cannot answer a question.
  4. Merchant can view past conversation logs in the Admin dashboard.
**Plans**: 2 plans
- [ ] 03-01: Integrate LLM (Gemini) with synced store data context.
- [ ] 03-02: Build Settings, Tone customization, and Conversation Logs UI.

### Phase 4: Billing, Analytics & Compliance
**Goal**: Monetization and App Store readiness.
**Depends on**: Phase 3
**Requirements**: [BILL-01, BILL-02, DASH-03]
**Success Criteria**:
  1. App requests subscription approval when switching to a "Paid" plan.
  2. Analytics dashboard shows total chats and leads captured.
  3. App listing demo credentials and screencast requirements are satisfied.
**Plans**: 1 plan
- [ ] 04-01: Implement Shopify Billing API and Analytics aggregation.

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Storefront & Sync | 0/2 | Not started | - |
| 3. AI Engine & Dashboard | 0/2 | Not started | - |
| 4. Billing & Compliance | 0/1 | Not started | - |

---
*Roadmap defined: 2026-05-06*
*Last updated: 2026-05-06 after initialization*
