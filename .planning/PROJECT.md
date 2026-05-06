# Shopify AI Chatbot

## What This Is

An AI-powered chatbot app for Shopify stores that helps shoppers find products, understand store policies, and resolve pre-purchase questions. It provides a merchant admin dashboard for customization, knowledge management, analytics, and Shopify-integrated billing.

## Core Value

Empower Shopify merchants to increase conversion and reduce support overhead by providing shoppers with instant, factual, AI-driven product and policy guidance directly on the storefront.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **Embedded App Foundation**: OAuth authentication, Shopify App Bridge integration, and Polaris-based admin UI.
- [ ] **Storefront Widget**: Theme app extension that injects a customizable chat widget without code edits.
- [ ] **Knowledge Ingestion**: Automatic syncing of Shopify products, collections, pages, and policies.
- [ ] **AI Response Engine**: RAG-based answer generation using Shopify data, with fallback "Capture Lead" flow.
- [ ] **Merchant Dashboard**: Settings for brand/tone, conversation logs, analytics, and knowledge source selection.
- [ ] **Shopify Billing**: Integration with Shopify Billing API for free and paid plans.
- [ ] **Review Readiness**: Compliance with Shopify App Store requirements, including demo credentials and screencast prep.

### Out of Scope

- **Multi-language Auto-translation**: Deferred to future milestones for MVP simplicity.
- **Human Live-Chat Routing**: Out of scope for MVP; focus is on autonomous AI.
- **Complex Order Actions**: (e.g., cancelling an order inside chat) Deferred to post-MVP.
- **Voice Chat**: Explicitly excluded for MVP.

## Context

- **Ecosystem**: Shopify App Store ecosystem. Requires adherence to strict security, performance, and billing standards.
- **Tech Stack**: Node.js backend (Remix/Vite recommended by Shopify), Shopify GraphQL Admin API, Polaris UI.
- **User Personas**: Busy merchants (Admin) and curious shoppers (Storefront).

## Constraints

- **Platform**: Must be an embedded Shopify App — required for App Store listing.
- **Billing**: Must use Shopify Billing or Managed Pricing — off-platform billing is prohibited.
- **Frontend**: Must use Theme App Extensions for storefront injection — code injection is deprecated.
- **Security**: Must handle session tokens and HMAC validation securely.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Node.js (Remix) | Official Shopify recommendation for modern embedded apps. | — Pending |
| Shopify-native data only | Ensure data accuracy and simplify MVP ingestion. | — Pending |
| Capture Lead fallback | Provides value even when the AI doesn't have an answer. | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-06 after initialization*
