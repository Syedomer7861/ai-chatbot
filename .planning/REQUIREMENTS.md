# Requirements: Shopify AI Chatbot

**Defined:** 2026-05-06
**Core Value:** Empower Shopify merchants to increase conversion and reduce support overhead by providing shoppers with instant, factual, AI-driven product and policy guidance directly on the storefront.

## v1 Requirements

### Foundation & Auth
- [ ] **AUTH-01**: App installs via Shopify OAuth flow.
- [ ] **AUTH-02**: App uses Session Tokens (App Bridge v4) for Admin UI requests.
- [ ] **AUTH-03**: App verifies HMAC on webhooks and proxy requests.
- [ ] **AUTH-04**: App shell loads within Shopify Admin using Polaris Web Components.

### Storefront Widget
- [ ] **WDGT-01**: Chat widget injected via Theme App Extension (App Block).
- [ ] **WDGT-02**: Widget is mobile-responsive and respects merchant brand colors.
- [ ] **WDGT-03**: Widget can be enabled/disabled via the Theme Editor.
- [ ] **WDGT-04**: Widget uses Shadow DOM to prevent style leakage.

### Knowledge Management
- [ ] **KNWL-01**: Automatic sync of Shopify Products (Name, Description, URL, Price, Availability).
- [ ] **KNWL-02**: Automatic sync of Shopify Online Store Pages and Policies (Shipping, Returns).
- [ ] **KNWL-03**: Manual data refresh trigger in Admin dashboard.

### AI Engine
- [ ] **AI-01**: AI generates answers based strictly on synced store data (RAG).
- [ ] **AI-02**: AI uses merchant-defined tone (Professional, Casual, Enthusiastic).
- [ ] **AI-03**: AI fails safely with a "Capture Lead" email form when confidence is low.
- [ ] **AI-04**: AI provides direct product links in chat responses.

### Merchant Dashboard
- [ ] **DASH-01**: Settings page for Brand (Color, Greeting) and Tone.
- [ ] **DASH-02**: Conversation logs view with shopper questions and AI answers.
- [ ] **DASH-03**: Basic analytics (Total chats, Lead capture count).

### Billing
- [ ] **BILL-01**: Support for Free and Paid tiers via Shopify Billing API.
- [ ] **BILL-02**: Smooth upgrade/downgrade flow with App Bridge approval modall.

## v2 Requirements
- **INTG-01**: Human support handoff (Live chat).
- **INTG-02**: Multi-language support.
- **ORD-01**: Order status tracking inside chat.
- **AI-05**: Dynamic discount code generation in chat.

## Out of Scope
| Feature | Reason |
|---------|--------|
| Multi-language | Deferred for MVP simplicity |
| Human live-chat | High operational complexity |
| Voice chat | Not a core requirement for Shopify merchants in v1 |
| Manual theme code edits | Prohibited by Shopify for App Store apps |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01, 02, 03, 04 | Phase 1 | Pending |
| WDGT-01, 02, 03, 04 | Phase 2 | Pending |
| KNWL-01, 02, 03 | Phase 3 | Pending |
| AI-01, 02, 03, 04 | Phase 4 | Pending |
| DASH-01, 02, 03 | Phase 5 | Pending |
| BILL-01, 02 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-06*
*Last updated: 2026-05-06 after initial definition*
