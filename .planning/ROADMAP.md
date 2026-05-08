# Roadmap: Shopify AI Chatbot

## Overview

This roadmap takes us from a blank slate to a review-ready Shopify AI Chatbot app. We focus first on the mandatory Shopify App Bridge/OAuth foundation, then move to data ingestion and storefront injection, followed by the AI engine, and finally the monetization and compliance requirements for the App Store.

## Phases

- [x] **Phase 1: Embedded App Foundation** - Establish OAuth, App Bridge, and Polaris Admin shell.
- [x] **Phase 2: Storefront Widget & Data Sync** - Build the Theme Extension widget and background knowledge ingestion.
- [x] **Phase 3: AI Engine & Admin Dashboard** - Connect the LLM with store data and build the settings/logs UI.
- [x] **Phase 4: Billing, Analytics & Compliance** - Implement subscription plans, basic stats, and prepare for Shopify review.
- [x] **Phase 5: Premium Interactivity & UI** - Upgrade widget with Markdown, Product Cards, and interactive Quick Replies.
- [x] **Phase 6: Advanced Knowledge & CRM** - Support custom FAQ training, Blog sync, and Klaviyo lead capture.
- [x] **Phase 7: Launch Readiness & Optimization** - Refine billing tiers, perform GDPR audit, and create reviewer demo tools.

## Phase Details

### Phase 1: Embedded App Foundation ✅
**Goal**: A functional, authenticated Shopify app that loads in the Shopify Admin.
**Depends on**: Nothing
**Requirements**: [AUTH-01, AUTH-02, AUTH-03, AUTH-04]
**Success Criteria**:
  1. Merchant can install the app on a development store.
  2. The app shell loads within the Shopify Admin iframe without errors.
  3. App Bridge v4 is correctly initialized via CDN script tag.
  4. The "Dashboard" tab shows a Polaris-styled empty state.
**Plans**: 2 plans
- [x] 01-01: Scaffold project with React Router, Vite, and Node.js backend.
- [x] 01-02: Implement Shopify OAuth and App Bridge v4 session token handling.
**Status**: Completed (2026-05-06)

### Phase 2: Storefront Widget & Data Sync ✅
**Goal**: Inject a chat widget on the storefront and sync merchant data.
**Depends on**: Phase 1
**Requirements**: [WDGT-01, WDGT-02, WDGT-03, WDGT-04, KNWL-01, KNWL-02]
**Success Criteria**:
  1. Chat widget appears on the storefront when enabled in Theme Editor.
  2. Widget uses Shadow DOM and doesn't conflict with theme styles.
  3. App successfully fetches products and pages via GraphQL and stores them locally.
  4. Merchant can trigger a manual "Sync Data" action.
**Plans**: 2 plans
- [x] 02-01: Create Theme App Extension (App Block) with Shadow DOM widget.
- [x] 02-02: Build GraphQL sync engine for Products and Pages.
**Status**: Completed (2026-05-06)

### Phase 3: AI Engine & Admin Dashboard ✅
**Goal**: Real-time AI answers grounded in store data.
**Depends on**: Phase 2
**Requirements**: [AI-01, AI-02, AI-03, AI-04, DASH-01, DASH-02]
**Success Criteria**:
  1. AI answers questions about products with correct links.
  2. AI respects the "Tone" setting (e.g., Casual vs Professional).
  3. AI triggers a lead capture form if it cannot answer a question.
  4. Merchant can view past conversation logs in the Admin dashboard.
**Plans**: 2 plans
- [x] 03-01: Integrate LLM (Gemini) with synced store data context.
- [x] 03-02: Build Settings, Tone customization, and Conversation Logs UI.
**Status**: Completed (2026-05-06)

### Phase 4: Billing, Analytics & Compliance ✅
**Goal**: Monetization and App Store readiness.
**Depends on**: Phase 3
**Requirements**: [BILL-01, BILL-02, DASH-03]
**Success Criteria**:
  1. App requests subscription approval when switching to a "Paid" plan.
  2. Analytics dashboard shows total chats and leads captured.
  3. App listing demo credentials and screencast requirements are satisfied.
**Plans**: 1 plan
- [x] 04-01: Implement Shopify Billing API and Analytics aggregation.
**Status**: Completed (2026-05-06)

### Phase 5: Premium Interactivity & UI ✅
**Goal**: Elevate the chat experience to "Manifest AI" standards with rich media and interactive elements.
**Depends on**: Phase 3
**Requirements**: [UI-01, UI-02, UI-03]
**Success Criteria**:
  1. Chatbot correctly renders Markdown (bold, lists, links).
  2. Products mentioned by AI are displayed as clickable rich cards with images/prices.
  3. "Quick Reply" chips appear for common queries (e.g., "Best Sellers", "Order Status").
**Plans**: 2 plans
- [x] 05-01: Integrate marked.js and implement Product Card components in Shadow DOM.
- [x] 05-02: Build "Quick Reply" chip system and dynamic suggestion logic.
**Status**: Completed (2026-05-06)

### Phase 6: Advanced Knowledge & CRM ✅
**Goal**: Expand the bot's intelligence beyond just product data and capture leads.
**Depends on**: Phase 5
**Requirements**: [KNWL-03, LEAD-01, LEAD-02]
**Success Criteria**:
  1. Merchant can add custom Q&A pairs in the Admin dashboard.
  2. Bot can answer questions based on Blog posts.
  3. Captured leads are automatically synced to Klaviyo/Email.
**Plans**: 2 plans
- [x] 06-01: Build Custom Knowledge & Blog Sync engine.
- [x] 06-02: Implement Klaviyo/Marketing integration for lead capture.
**Status**: Completed (2026-05-06)

### Phase 7: Launch Readiness & Optimization ✅
**Goal**: Final polish for Shopify App Store submission.
**Depends on**: Phase 6
**Requirements**: [COMP-01, COMP-02, BILL-02]
**Success Criteria**:
  1. GDPR mandatory webhooks are fully implemented and tested.
  2. Subscription tiers (Free vs Pro) are correctly enforced.
  3. "Demo Mode" toggle allows reviewers to see premium features without a live store.
**Plans**: 1 plan
- [x] 07-01: Final compliance audit, GDPR webhooks, and Reviewer Demo tool.
**Status**: Completed (2026-05-06)

### Phase 8: AI Quiz System ✅
**Goal**: Interactive product discovery quizzes that recommend products based on customer answers.
**Depends on**: Phase 3
**Requirements**: [QUIZ-01, QUIZ-02, QUIZ-03]
**Success Criteria**:
  1. Merchant can create multiple quizzes with questions and answer options.
  2. Quiz widget appears on storefront and collects customer answers.
  3. Products are recommended based on quiz answers with lead capture.
  4. Quiz results and analytics visible in admin dashboard.
**Plans**: 5 plans
- [x] 08-01: Create Quiz database models (Quiz, QuizQuestion, QuizResult).
- [x] 08-02: Build Quiz management dashboard UI in admin.
- [x] 08-03: Create storefront quiz widget with embed code.
- [x] 08-04: Build AI-powered product recommendation engine based on answers.
- [x] 08-05: Add quiz analytics and lead tracking.
**Status**: Completed (2026-05-08)

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Completed | 2026-05-06 |
| 2. Storefront & Sync | 2/2 | Completed | 2026-05-06 |
| 3. AI Engine & Dashboard | 2/2 | Completed | 2026-05-06 |
| 4. Billing & Compliance | 1/1 | Completed | 2026-05-06 |
| 5. Premium UI | 2/2 | Completed | 2026-05-06 |
| 6. Advanced Knowledge | 2/2 | Completed | 2026-05-06 |
| 7. Launch Readiness | 1/1 | Completed | 2026-05-06 |
| 8. AI Quiz System | 5/5 | Completed | 2026-05-08 |

---
*Roadmap defined: 2026-05-06*
*Last updated: 2026-05-08 - completed Phase 8 (AI Quiz System)*
