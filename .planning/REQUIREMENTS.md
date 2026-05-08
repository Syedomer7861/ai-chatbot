# Requirements: Shopify AI Chatbot

**Defined:** 2026-05-06
**Core Value:** Empower Shopify merchants to increase conversion and reduce support overhead by providing shoppers with instant, factual, AI-driven product and policy guidance directly on the storefront.

## v1 Requirements

### Foundation & Auth
- [x] **AUTH-01**: App installs via Shopify OAuth flow.
- [x] **AUTH-02**: App uses Session Tokens (App Bridge v4) for Admin UI requests.
- [x] **AUTH-03**: App verifies HMAC on webhooks and proxy requests.
- [x] **AUTH-04**: App shell loads within Shopify Admin using Polaris Web Components.

### Storefront Widget
- [x] **WDGT-01**: Chat widget injected via Theme App Extension (App Block).
- [x] **WDGT-02**: Widget is mobile-responsive and respects merchant brand colors.
- [x] **WDGT-03**: Widget can be enabled/disabled via the Theme Editor.
- [x] **WDGT-04**: Widget uses Shadow DOM to prevent style leakage.

### Knowledge Management
- [x] **KNWL-01**: Automatic sync of Shopify Products (Name, Description, URL, Price, Availability).
- [x] **KNWL-02**: Automatic sync of Shopify Online Store Pages and Policies (Shipping, Returns).
- [x] **KNWL-03**: Manual data refresh trigger in Admin dashboard.

### AI Engine
- [x] **AI-01**: AI generates answers based strictly on synced store data (RAG).
- [x] **AI-02**: AI uses merchant-defined tone (Professional, Casual, Enthusiastic).
- [x] **AI-03**: AI fails safely with a "Capture Lead" email form when confidence is low.
- [x] **AI-04**: AI provides direct product links in chat responses.

### Merchant Dashboard
- [x] **DASH-01**: Settings page for Brand (Color, Greeting) and Tone.
- [x] **DASH-02**: Conversation logs view with shopper questions and AI answers.
- [x] **DASH-03**: Basic analytics (Total chats, Lead capture count).

### Billing
- [x] **BILL-01**: Support for Free and Paid tiers via Shopify Billing API.
- [x] **BILL-02**: Smooth upgrade/downgrade flow with App Bridge approval modall.

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
| AUTH-01, 02, 03, 04 | Phase 1 | Completed |
| WDGT-01, 02, 03, 04 | Phase 2 | Completed |
| KNWL-01, 02, 03 | Phase 3 | Completed |
| AI-01, 02, 03, 04 | Phase 4 | Completed |
| DASH-01, 02, 03 | Phase 5 | Completed |
| BILL-01, 02 | Phase 6 | Completed |

**Coverage:**
- v1 requirements: 19 total
- Completed: 19 ✓
- Remaining: 0 ✓

---
*Requirements defined: 2026-05-06*
*Last updated: 2026-05-08 - synced v1 requirements as completed per PROJECT.md*
