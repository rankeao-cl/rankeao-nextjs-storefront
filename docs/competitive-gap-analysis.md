# Competitive Gap Analysis & Feature Prioritization
# Rankeao.cl Multi-Tenant E-Commerce Storefront

**Author**: Alex (PM)
**Date**: 2026-04-07
**Status**: Draft for Review
**Decision needed by**: 2026-04-14

---

## Executive Summary

Rankeao has a solid foundation: multi-tenancy, products, cart, checkout, orders, and a tenant panel. However, when benchmarked against Shopify, Jumpseller, and Tiendanube -- the three platforms Chilean merchants actually compare against -- there are **critical gaps that will block revenue, erode trust, or create legal exposure** if not addressed before launch.

The biggest gaps fall into four categories:
1. **Legal/Tax compliance** -- Chilean law requires electronic receipts (boleta/factura) via SII. Without this, tenants cannot legally sell.
2. **Transactional communication** -- No email notifications means customers have zero post-purchase confidence. This kills repeat purchases.
3. **SEO fundamentals** -- Storefronts invisible to Google means zero organic acquisition. Tenants will churn if they get no traffic.
4. **Shipping integration** -- Chilean buyers expect real carrier rates and tracking. Flat-rate-only shipping is a conversion killer.

Below is the full gap analysis with RICE-informed prioritization.

---

## Competitive Benchmark Matrix

| Capability | Shopify | Jumpseller | Tiendanube | Rankeao (Current) | Gap Severity |
|---|---|---|---|---|---|
| **Transactional emails** (order confirm, shipping, etc.) | Yes (built-in + Klaviyo) | Yes | Yes | **MISSING** | **CRITICAL** |
| **SII/Boleta electronica** | Via apps | Native + Openfactura/Facto | Via integrations | **MISSING** | **CRITICAL (legal)** |
| **SEO** (meta tags, sitemap, OG tags, structured data) | Comprehensive | Good | Good | **MISSING** | **CRITICAL** |
| **Shipping carrier integration** (Chilexpress, Starken, Blue Express) | Via apps | Native | Native | **MISSING** | HIGH |
| **Abandoned cart recovery** | Built-in | Built-in | Built-in | **MISSING** | HIGH |
| **Email marketing / newsletters** | Shopify Email | Built-in | Built-in | **MISSING** | MEDIUM |
| **Product reviews** | Via apps | Built-in | Via apps | **MISSING** | MEDIUM |
| **Wishlist** | Via apps | Limited | Limited | **MISSING** | LOW |
| **Blog / CMS** | Built-in | Built-in | Built-in | **MISSING** | MEDIUM |
| **Multi-currency** | Yes | Yes | Yes | **MISSING** (CLP only OK for Chile) | LOW |
| **Discount rules** (buy X get Y, bundles) | Advanced | Basic | Basic | Basic coupons only | MEDIUM |
| **Custom domain** (SSL for tenant domains) | Yes | Yes | Yes | Subdomain only | HIGH |
| **Analytics / reporting** | Comprehensive | Good | Good | Basic KPIs | MEDIUM |
| **Webhook/API for tenants** | Yes | Yes | Limited | **MISSING** | LOW |
| **SERNAC compliance** (retracto, terms) | Via policy templates | Built-in | Built-in | Partial (terms page exists) | HIGH |
| **Password recovery** | Yes | Yes | Yes | ? Needs verification | HIGH if missing |
| **Social login** (Google, Facebook) | Yes | Yes | Yes | **MISSING** | LOW |
| **Inventory low-stock alerts** | Yes | Yes | Yes | **MISSING** | MEDIUM |
| **Export/import** (products CSV, orders CSV) | Yes | Yes | Yes | **MISSING** | HIGH |
| **Customer notifications** (WhatsApp / SMS) | Via apps | Limited | Limited | WhatsApp button only | MEDIUM |
| **Print shipping labels** | Yes | Yes | Yes | **MISSING** | MEDIUM |
| **Returns/refunds management** | Yes | Yes | Yes | **MISSING** | HIGH |
| **TCG-specific: card condition grading** | N/A | N/A | N/A | **MISSING** | DIFFERENTIATOR |
| **TCG-specific: preorder for new sets** | N/A | N/A | N/A | **MISSING** | DIFFERENTIATOR |

---

## P0 -- Must Have Before Launch (Blocks Revenue or Creates Legal Risk)

These are non-negotiable. If a single one is missing, either tenants cannot legally operate, customers will not trust the platform, or stores will be invisible to discovery.

### P0-1: Transactional Email System

**Problem**: Customers who place an order receive zero confirmation. No order confirmation, no payment received, no shipping update, no delivery notification. This is the #1 trust killer in e-commerce. Every competitor has this. Every customer expects this.

**What to build**:
- Order confirmation email (triggered on order creation)
- Payment confirmed email (triggered on payment verification)
- Order shipped email (triggered on status change to SHIPPED, include tracking link if available)
- Order delivered email (triggered on status change to DELIVERED)
- Order cancelled/refunded email
- Welcome email on customer registration
- Password reset email (if not already implemented)
- Tenant-branded email templates (use tenant logo, colors, name)

**Technical approach**:
- Email service: Use a transactional email provider (Resend, SendGrid, or AWS SES)
- Template engine with per-tenant branding (logo, colors, store name)
- Event-driven: hook into order status change events in the backend
- Queue-based sending to handle volume spikes

**Effort**: M (2-3 engineer-weeks)
**Impact**: Extreme -- without this, every purchase feels like throwing money into a void
**RICE**: Reach=100% of orders | Impact=3 | Confidence=100% | Effort=2.5 = **120**

---

### P0-2: SEO Foundations

**Problem**: Storefronts are invisible to Google. Zero organic traffic means tenants depend entirely on paid/social channels. Competitors all provide SEO out of the box. A store that does not rank is a store that churns.

**What to build**:
- Dynamic `<title>` and `<meta description>` per page (home, product, category, about)
- Open Graph tags and Twitter Card meta for social sharing
- Canonical URLs to prevent duplicate content across tenants
- `robots.txt` per tenant subdomain
- Auto-generated `sitemap.xml` per tenant (products, categories, pages)
- JSON-LD structured data for:
  - `Product` schema (name, price, availability, reviews, images)
  - `Organization` schema (store info)
  - `BreadcrumbList` schema
  - `LocalBusiness` schema (if physical store)
- Semantic HTML (proper h1/h2 hierarchy, alt text on images)
- SEO-friendly URLs: `/producto/nombre-del-producto` not `/product/123`
- Product and category pages: editable slug, meta title, meta description fields in tenant panel

**Effort**: M (2 engineer-weeks)
**Impact**: High -- unlocks the entire organic acquisition channel
**RICE**: Reach=100% of storefronts | Impact=3 | Confidence=95% | Effort=2 = **142**

---

### P0-3: SII Tax Document Integration (Boleta/Factura Electronica)

**Problem**: Chilean law requires ALL sales to generate electronic tax documents (boleta electronica for B2C, factura electronica for B2B) and report them to the SII within one hour. Without this, tenants are operating illegally. This is not optional -- it is a legal requirement since 2018, with penalties from the SII.

**What to build**:
- Integration with a Chilean electronic invoicing provider (recommended: Openfactura, Bsale, or Haulmer/Facturapi)
  - Do NOT build SII integration from scratch -- use a certified intermediary
- At checkout, collect:
  - Document type selection (Boleta / Factura)
  - If Factura: RUT, Razon Social, Giro, Direccion
  - RUT validation (modulo 11 check)
- On order payment confirmation, trigger DTE emission via provider API
- Store DTE reference (folio number, PDF link) on the order record
- Include DTE PDF link in the order confirmation email
- Tenant panel: configure SII credentials / provider API keys per tenant
- Each tenant connects their own SII-certified provider (since tax documents are per-business)

**Important context**: Jumpseller integrates with Openfactura, Facto, Ingefactura, Relbase, and Bsale. This is table-stakes for Chilean e-commerce.

**Effort**: L (3-4 engineer-weeks, largely API integration + checkout flow changes)
**Impact**: Extreme -- legal blocker; tenants literally cannot operate without this
**RICE**: Reach=100% of tenants | Impact=3 | Confidence=100% | Effort=3.5 = **86**

---

### P0-4: SERNAC / Consumer Protection Compliance

**Problem**: Chile's Ley Pro Consumidor (Ley 21.398) and e-commerce regulations require specific disclosures and capabilities. Non-compliance exposes tenants and the platform to SERNAC enforcement.

**What to build**:
- **Right of withdrawal (Derecho de Retracto)**: Clear disclosure that customers have 10 days to return products purchased online. Must be visible during checkout and in order confirmation email.
- **Stock transparency**: Must show if a product is out of stock. Never allow purchase of unavailable items.
- **Total cost disclosure**: Shipping cost, taxes, and total must be visible BEFORE payment confirmation.
- **Delivery time estimates**: Must inform estimated delivery timeframe.
- **Written contract confirmation**: Order confirmation email serves as the "written confirmation" required by law. (Solved by P0-1.)
- **Return/refund policy page**: Template provided to tenants, editable, must be linked from checkout.
- **Data privacy policy**: Template covering personal data handling per Chilean data protection law.
- **Terms of service template**: Pre-built legal pages that tenants can customize.

**Effort**: S (1 engineer-week -- mostly content, templates, and minor checkout flow additions)
**Impact**: High -- legal compliance, trust building
**RICE**: Reach=100% | Impact=2 | Confidence=100% | Effort=1 = **200**

---

### P0-5: Returns and Refund Management

**Problem**: The 10-day right of withdrawal means customers WILL request returns. Without a system to handle this, tenants will manage it via WhatsApp/email chaos, and disputes will escalate to SERNAC.

**What to build**:
- Customer-facing return request flow (from order history)
- Return reasons (defective, wrong item, retracto, other)
- Tenant panel: view return requests, approve/deny, process refund
- Refund status tracking on the order
- Refund notification emails to customer
- Return policy configuration per tenant (return window, conditions)

**Effort**: M (2 engineer-weeks)
**Impact**: High -- legal compliance + customer trust + operational necessity
**RICE**: Reach=30% of orders (estimated return rate in e-commerce) | Impact=2 | Confidence=90% | Effort=2 = **27**

---

## P1 -- Need Within 30 Days of Launch (Directly Impacts Revenue Growth)

### P1-1: Shipping Carrier Integration (Chilexpress, Starken, Blue Express)

**Problem**: Currently shipping is likely flat-rate or manual. Chilean buyers expect to see real shipping costs at checkout based on their location, and they expect tracking numbers. Without this, cart abandonment at the shipping step will be high.

**What to build**:
- Integration with Chilexpress API (developer portal: developers.wschilexpress.com)
  - Coverage/address validation
  - Real-time rate quotation by origin/destination
  - Transport order generation (shipping label)
  - Tracking status polling
- Integration with Starken API (similar capabilities)
- Integration with Blue Express API
- At checkout: show calculated shipping options with carrier name, price, and estimated delivery
- In tenant panel: configure which carriers are enabled, set origin address, markup rules
- Order detail: display tracking number with link to carrier tracking page
- (Stretch) Print shipping label from tenant panel

**Effort**: L (3-4 engineer-weeks for first carrier, S for each additional)
**Impact**: High -- directly improves checkout conversion
**RICE**: Reach=70% of orders (shipping vs. pickup) | Impact=2 | Confidence=85% | Effort=3.5 = **34**

---

### P1-2: Abandoned Cart Recovery

**Problem**: Industry average cart abandonment is 70%+. Every competitor offers abandoned cart emails. This is one of the highest-ROI features in e-commerce -- recovering even 5-10% of abandoned carts directly increases revenue.

**What to build**:
- Track cart creation with customer email (if logged in or entered at checkout start)
- Define "abandoned" as: cart created, email known, no order placed within X hours (configurable, default 1 hour)
- Send automated email sequence:
  - Email 1: 1 hour after abandonment ("You left something behind")
  - Email 2: 24 hours ("Still thinking about it?")
  - Email 3: 72 hours ("Last chance" + optional discount code)
- Tenant panel: enable/disable, configure timing, edit email templates
- Analytics: abandoned cart recovery rate, revenue recovered
- Requires P0-1 (email system) as a dependency

**Effort**: M (2 engineer-weeks)
**Impact**: High -- directly recovers lost revenue (industry benchmark: 5-15% recovery rate)
**RICE**: Reach=70% of carts | Impact=2 | Confidence=80% | Effort=2 = **56**

---

### P1-3: Custom Domain Support

**Problem**: `mitienda.rankeao.cl` is fine for starting, but serious merchants need `www.mitienda.cl`. Without custom domain support, you lose credibility with larger tenants and limit your addressable market to hobbyists.

**What to build**:
- Tenant panel: input custom domain
- Backend: domain verification (DNS CNAME/A record check)
- Automatic SSL certificate provisioning (Let's Encrypt / Caddy / Cloudflare)
- Tenant resolution by custom domain in addition to subdomain
- Handle redirect from subdomain to custom domain (or vice versa) for SEO

**Effort**: M (2 engineer-weeks, infrastructure-heavy)
**Impact**: Medium-High -- unlocks professional/serious merchants
**RICE**: Reach=20% of tenants (initially) | Impact=2 | Confidence=80% | Effort=2 = **16**

---

### P1-4: Product & Order CSV Import/Export

**Problem**: Tenants migrating from Shopify, Jumpseller, or spreadsheets need a way to bulk-load products. Manually entering 500 TCG singles is a dealbreaker. Order export is needed for accounting.

**What to build**:
- Product CSV import (name, description, price, stock, category, variants, images URLs)
- Product CSV export
- Order CSV export (for accounting / SII reconciliation)
- Customer CSV export
- Template CSV files with documentation
- Import validation with error reporting (row-by-row feedback)
- Background processing for large imports with progress indicator

**Effort**: M (2 engineer-weeks)
**Impact**: High -- removes migration friction, critical for TCG stores with large catalogs
**RICE**: Reach=60% of tenants | Impact=2 | Confidence=90% | Effort=2 = **54**

---

### P1-5: Enhanced Analytics & Reporting

**Problem**: Tenants need to understand their business. Basic KPIs are not enough. They need sales trends, top products, conversion funnel, and customer cohorts to make decisions.

**What to build**:
- Sales dashboard: revenue by day/week/month, order count, AOV
- Top products by revenue and units sold
- Sales by category
- Conversion funnel: visits -> add to cart -> checkout started -> order placed
- Customer metrics: new vs. returning, CLV estimate
- Inventory report: low stock alerts, dead stock
- Coupon performance: usage count, revenue attributed
- Export reports as CSV/PDF

**Effort**: M (2-3 engineer-weeks)
**Impact**: Medium -- retention driver, helps tenants succeed (which means they stay)
**RICE**: Reach=100% of tenants | Impact=1 | Confidence=85% | Effort=2.5 = **34**

---

### P1-6: Low Stock Alerts & Inventory Notifications

**Problem**: TCG stores have highly variable inventory. A store owner selling out of a Pokemon box and not knowing until a customer complains is a bad experience for everyone.

**What to build**:
- Per-product low stock threshold (default: 5 units)
- Email notification to store owner when stock drops below threshold
- Dashboard widget: "X products below stock threshold"
- Out-of-stock auto-hide option (or show as "Sold Out")
- Back-in-stock notification for customers (email capture on out-of-stock products)

**Effort**: S (1 engineer-week)
**Impact**: Medium -- prevents lost sales, improves ops
**RICE**: Reach=40% of products | Impact=1 | Confidence=90% | Effort=1 = **36**

---

## P2 -- Nice to Have for Differentiation (Months 2-3)

### P2-1: Product Reviews & Ratings

**What to build**:
- Customer can leave a review (1-5 stars + text) after order delivered
- Review moderation by tenant (approve/reject/reply)
- Average rating displayed on product card and detail page
- Reviews feed into JSON-LD structured data (rich snippets in Google)
- Review request email sent X days after delivery

**Effort**: M (2 engineer-weeks)
**Impact**: Medium -- social proof increases conversion, rich snippets improve CTR

---

### P2-2: Blog / Content Management

**What to build**:
- Simple blog per tenant (title, body with rich text, featured image, slug, publish date)
- Blog listing page and individual post pages
- SEO-optimized (meta tags, structured data for Article)
- Category/tag system for posts
- Use case for TCG: set reviews, tournament recaps, buying guides

**Effort**: M (2 engineer-weeks)
**Impact**: Medium -- SEO content strategy, community building for TCG niche

---

### P2-3: Wishlist / Save for Later

**What to build**:
- Logged-in customers can save products to a wishlist
- Wishlist page in customer account
- "Back in stock" notification for wishlisted out-of-stock items
- (Stretch) "Price drop" notification

**Effort**: S (1 engineer-week)
**Impact**: Low-Medium -- engagement feature, drives return visits

---

### P2-4: Discount Rules Engine (Beyond Coupons)

**What to build**:
- Buy X get Y free/discounted
- Bundle pricing (buy 3 booster boxes, get 10% off)
- Tiered pricing (1-9 units: $X, 10+: $Y) -- critical for TCG singles
- Automatic discount by cart total (no code needed)
- Free shipping threshold

**Effort**: M (2-3 engineer-weeks)
**Impact**: Medium -- increases AOV, differentiates from basic coupon systems

---

### P2-5: WhatsApp Order Notifications

**What to build**:
- Integration with WhatsApp Business API (or Twilio/360dialog)
- Send order confirmation, shipping update via WhatsApp
- Opt-in during checkout
- Chile context: WhatsApp penetration is 90%+, many buyers prefer it over email

**Effort**: M (2 engineer-weeks)
**Impact**: Medium-High for Chile market specifically -- aligns with buyer behavior

---

### P2-6: Advanced Theme Customization

**What to build**:
- Theme presets (3-5 layouts) beyond just color customization
- Custom CSS injection for advanced tenants
- Configurable homepage sections (reorder, show/hide carousel, featured products, categories)
- Font selection
- Custom banner/hero management (multiple slides)

**Effort**: M (2-3 engineer-weeks)
**Impact**: Medium -- differentiation for tenants, reduces "all stores look the same" problem

---

### P2-7: Social Login (Google, Facebook)

**What to build**:
- Login/register via Google OAuth
- Login/register via Facebook OAuth
- Link social accounts to existing email accounts
- Reduces registration friction for customers

**Effort**: S (1 engineer-week)
**Impact**: Low-Medium -- reduces registration friction at checkout

---

## P3 -- Future Roadmap (3-6 Months)

### P3-1: TCG-Specific Differentiators

This is where Rankeao can build a moat that Shopify/Jumpseller/Tiendanube will never replicate.

| Feature | Description | Strategic Value |
|---|---|---|
| **Card condition grading** | NM/LP/MP/HP/DMG condition field on product variants | Table stakes for TCG singles -- no competitor does this natively |
| **Set/expansion catalog** | Pre-loaded Pokemon/MTG/One Piece/Lorcana set database | Reduces listing effort from hours to minutes |
| **Card search by set/rarity/type** | Faceted search beyond generic categories | TCG buyers search differently than general shoppers |
| **Preorder management** | Preorder new sets before release date, with deposit or full payment | Critical for TCG retail -- set launches drive 40%+ of annual revenue |
| **Price reference from market data** | Show TCGPlayer/Cardmarket reference prices | Builds buyer confidence, helps sellers price competitively |
| **Tournament integration** | Link to Rankeao's tournament system (community platform) | Unique cross-sell: tournament players become store customers |
| **Deck lists with buy links** | Community deck lists that link to store products | Content -> commerce flywheel |
| **Bulk singles listing** | Scan/batch list hundreds of singles quickly | Key seller pain point -- Cardmarket/TCGPlayer solve this |

**Signal needed to advance**: Validate demand with 10+ store owner interviews focused on TCG-specific needs.

---

### P3-2: Multi-language Support

- Spanish (default) + English storefront
- Relevant for international TCG buyers
- **Advance when**: tenant expansion beyond Chile begins

### P3-3: Multi-currency

- CLP is sufficient for Chile launch
- **Advance when**: cross-border sales become a measurable segment

### P3-4: Marketplace Mode

- Allow multiple sellers within a single storefront (like TCGPlayer model)
- Commission/fee structure
- **Advance when**: single-tenant stores are proven and growing; marketplace is a platform pivot

### P3-5: Mobile App (React Native)

- Dedicated buyer app for browsing/purchasing
- Push notifications
- **Advance when**: mobile traffic exceeds 60% and web conversion significantly lags desktop

### P3-6: AI-Powered Features

- Product description generation from card name/set
- Smart pricing suggestions based on market data
- Chatbot for customer service
- **Advance when**: core platform is stable and differentiation is needed

### P3-7: Subscription/Recurring Orders

- Monthly mystery box subscriptions
- Set subscription (auto-ship every new release)
- **Advance when**: validated demand from tenant interviews

---

## Prioritized Implementation Roadmap

### Pre-Launch Sprint (Weeks 1-4) -- P0 Items

| Week | Initiative | Owner | Dependencies |
|---|---|---|---|
| W1-W2 | P0-1: Transactional Email System | Backend + Frontend | Email provider account |
| W1 | P0-4: SERNAC Compliance (legal pages, checkout disclosures) | Frontend + Content | Legal review |
| W1-W3 | P0-2: SEO Foundations | Frontend | None |
| W2-W4 | P0-3: SII/Boleta Integration | Backend | Tenant test account with SII provider |
| W3-W4 | P0-5: Returns/Refund Management | Backend + Frontend | P0-1 (for refund emails) |

**Launch gate**: ALL P0 items complete and tested. No exceptions.

### Post-Launch Month 1 (Weeks 5-8) -- P1 Items

| Week | Initiative | Owner | Dependencies |
|---|---|---|---|
| W5-W8 | P1-1: Shipping Carrier Integration (Chilexpress first) | Backend | Chilexpress developer account |
| W5-W6 | P1-2: Abandoned Cart Recovery | Backend + Email | P0-1 |
| W5-W6 | P1-4: CSV Import/Export | Backend + Frontend | None |
| W6 | P1-6: Low Stock Alerts | Backend | P0-1 |
| W7-W8 | P1-3: Custom Domain Support | Infrastructure | SSL provisioning setup |
| W7-W8 | P1-5: Enhanced Analytics | Backend + Frontend | None |

### Months 2-3 -- P2 Items (pick based on user feedback signal)

Sequence based on signal strength from early tenants. Recommended default order:
1. P2-5: WhatsApp Notifications (highest impact in Chilean market)
2. P2-1: Product Reviews (SEO + conversion impact)
3. P2-4: Discount Rules Engine (AOV impact)
4. P2-6: Theme Customization
5. P2-2: Blog/CMS
6. P2-7: Social Login
7. P2-3: Wishlist

---

## Effort Summary

| Priority | Item Count | Total Effort (engineer-weeks) | Timeline |
|---|---|---|---|
| P0 | 5 items | 8-11 weeks | Pre-launch (4 weeks with 2-3 engineers) |
| P1 | 6 items | 12-15 weeks | Month 1 post-launch (4 weeks with 3 engineers) |
| P2 | 7 items | 12-16 weeks | Months 2-3 |
| P3 | 7 items | TBD | Months 4-6+ |

**Minimum team needed for P0 in 4 weeks**: 3 engineers (1 backend-heavy, 1 frontend-heavy, 1 full-stack) + PM + designer for email templates and legal page layouts.

---

## What We Are NOT Building (and Why)

| Request | Reason for Deferral | Revisit Condition |
|---|---|---|
| Multi-currency | CLP-only is fine for Chile launch; adds complexity | When cross-border sales > 5% of GMV |
| Mobile app | Web responsive is sufficient; app store overhead not justified | When mobile traffic > 60% with measurable conversion gap |
| Marketplace mode | Fundamentally different from single-tenant stores; premature | When 50+ active tenants and validated multi-seller demand |
| AI features | Nice-to-have, not must-have; focus on fundamentals | When core platform stable and differentiation pressure increases |
| Multi-language | Chile market is Spanish-only for now | When international expansion is a strategic priority |
| Loyalty/points program | Complexity vs. value unclear for small TCG stores | When top tenants request it and AOV data supports it |
| Live chat widget | WhatsApp button + email covers this for small stores | When tenant support volume justifies dedicated tooling |

---

## Key Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| SII integration complexity | Medium | **Critical** -- blocks legal operation | Start integration spike in Week 1; use proven intermediary (Openfactura/Bsale), not raw SII API |
| Email deliverability (spam filters) | Medium | High -- emails not received = same as no emails | Use established provider (Resend/SendGrid), set up SPF/DKIM/DMARC per tenant subdomain from day one |
| Chilexpress API reliability/documentation | Medium | Medium -- shipping feature delayed | Spike API exploration early; have flat-rate fallback ready |
| Scope creep during P0 phase | High | High -- delays launch | Freeze scope ruthlessly; any new request goes to P1 minimum |
| Tenant onboarding friction (SII setup) | High | Medium -- tenants drop off during setup | Build clear setup wizard; provide documentation; consider "start selling without SII, add later" grace period |

---

## Open Questions (Must Resolve Before Development Starts)

- [ ] **SII Provider Selection**: Which electronic invoicing provider will we integrate with first? Recommend evaluating Openfactura, Bsale, and Haulmer. Criteria: API quality, pricing for small merchants, Go SDK availability. **Owner**: [Eng Lead] **Deadline**: 2026-04-11
- [ ] **Email Provider Selection**: Resend vs SendGrid vs AWS SES. Criteria: cost at projected volume, deliverability reputation in Chile, Go SDK. **Owner**: [Eng Lead] **Deadline**: 2026-04-11
- [ ] **Chilexpress Developer Account**: Has anyone initiated the developer account application? Timeline to get API credentials? **Owner**: [Backend Lead] **Deadline**: 2026-04-14
- [ ] **Legal Review**: Do we need a lawyer to review the SERNAC compliance templates, or can we use standard Chilean e-commerce templates? **Owner**: [PM] **Deadline**: 2026-04-14
- [ ] **Password Reset**: Is password reset already implemented in the auth system? If not, add to P0-1. **Owner**: [Backend Lead] **Deadline**: 2026-04-09
- [ ] **Current Email Capability**: Is there ANY email sending capability in the backend today? (Even basic SMTP?) This affects P0-1 scope. **Owner**: [Backend Lead] **Deadline**: 2026-04-09

---

## Recommendation

**Decision**: Build all P0 items before launch. No negotiation on this set.

**Rationale**: P0-3 (SII) is a legal blocker -- tenants cannot legally sell without it. P0-1 (emails) is a trust blocker -- customers who receive no confirmation will not return and will dispute payments. P0-2 (SEO) is a growth blocker -- stores with no organic discoverability will churn within 60 days. P0-4 and P0-5 are compliance and operational necessities respectively.

The entire P0 set is achievable in 4 weeks with a focused team of 3 engineers. This is aggressive but realistic if scope is protected and no P1 items are allowed to creep in.

**The single most important thing to start today**: Set up the transactional email infrastructure (P0-1) and initiate the SII provider evaluation (P0-3). Everything else cascades from these two.

---

## Sources

- [Jumpseller Electronic Invoicing](https://jumpseller.mx/learn/facturacion-electronica/)
- [Openfactura - Jumpseller Integration](https://www.openfactura.cl/factura-electronica/integraciones/jumpseller/)
- [Chile Electronic Invoicing Requirements - EDICOM](https://edicomgroup.com/blog/electronic-invoice-chile)
- [Chile Electronic Ticket Changes - Sovos](https://sovos.com/blog/vat/chile-electronic-ticket/)
- [SII Boleta Electronica Portal](https://www.sii.cl/destacados/boletas_electronicas/index.html)
- [Chile B2C Invoice Requirements - Melasoft](https://www.melasoft.com/news/chile-introduces-new-requirements-for-business-to-consumer-invoices:-effective-september-2025)
- [SERNAC E-Commerce Rights](https://www.sernac.cl/portal/604/w3-propertyvalue-20982.html)
- [Ley Pro Consumidor - ChileAtiende](https://www.chileatiende.gob.cl/fichas/101961-ley-pro-consumidor)
- [Chilexpress Developer Portal](https://developers.wschilexpress.com/)
- [Tiendanube Shipping Companies in Chile](https://www.tiendanube.com/blog/empresas-de-envios-en-chile/)
- [Transbank Webpay Plus](https://publico.transbank.cl/productos-y-servicios/soluciones-para-ventas-internet/webpay-plus)
- [MercadoPago Chile Checkout API](https://www.mercadopago.cl/developers/en/docs/checkout-api/overview)
- [Shopify Abandoned Cart Best Practices](https://www.shopify.com/blog/abandoned-cart-emails)
- [Payment Gateways Chile 2026 - Rebill](https://www.rebill.com/blog/pasarelas-pago-chile)
- [Chile Tax Compliance for Platforms - KPMG](https://kpmg.com/us/en/taxnewsflash/news/2025/12/chile-tax-compliance-platforms-payment-service-providers.html)
- [Shopify in Chile Guide - Cancha Digital](https://cancha.io/en/blogs/todo-sobre-shopify/shopify-en-chile)
- [TCGPlayer Marketplace](https://www.tcgplayer.com/)
- [Cardmarket EU Marketplace](https://www.cardmarket.com/en/)
