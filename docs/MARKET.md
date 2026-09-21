# Market check — 2026-09-21

This document records the evidence behind the initial product wedge. It is not a claim that demand or pricing is guaranteed.

## Paid category

Current vendor pages keep core Customer Success pricing behind a sales process:

- Gainsight Customer Success: Essentials and Enterprise both show **Request Pricing** — https://www.gainsight.com/pricing/
- Vitally: Tech-Touch, Hybrid-Touch and High-Touch all show **Request Pricing** — https://www.vitally.io/pricing
- Planhat: pricing packages use **Enquire** rather than a public list price — https://www.planhat.com/pricing
- Custify: pricing page routes buyers to contact/demo rather than publishing a list price — https://www.custify.com/pricing

The point is not that quote-based pricing is inherently bad. It leaves a clear opening for a small-team product with instant deployment and transparent pricing.

## Demand signals

- 2025-11-12: a /r/CustomerSuccess thread says a company chose not to renew ChurnZero because of budget constraints; replies repeatedly ruled out Gainsight on cost grounds.
  https://www.reddit.com/r/CustomerSuccess/comments/1ovaur6/churnzero_alternative/
- 2025-10-14: a B2B SaaS operator at roughly $2–3M ARR described renewal/churn risk as still largely a hunch despite weekly review and usage monitoring.
  https://www.reddit.com/r/CustomerSuccess/comments/1o6csqk/im_in_b2b_saas_and_i_dread_renewals_am_i_the_only/
- September 2026 G2 category data rates Gainsight Ease of Use at 8.0/10 versus a 8.9/10 category average.
  https://www.g2.com/categories/customer-success
- Current TrustRadius review synthesis highlights reporting complexity, a clunky UI, steep learning curve and substantial administrative effort as recurring Gainsight concerns.
  https://www.trustradius.com/products/gainsight-cs/reviews

## Open-source / source-available competition check

The search surfaced useful adjacent projects, but not a mature self-hosted equivalent with the exact account-health + revenue-risk + renewal-operations wedge:

- Rereflect — open-source feedback intelligence with churn-risk extraction from feedback. Strong adjacent product, but feedback intelligence is its center of gravity rather than account-level CS operations.
  https://github.com/haqaliz/rereflect
- fromHello — open-source autonomous lifecycle/growth platform focused on channels, journeys, segments and experiments. Adjacent on retention, but primarily a growth/messaging platform.
  https://github.com/Synapsr/fromHello
- LimeJourney — open-source Customer.io alternative for customer engagement journeys. Adjacent messaging category rather than CSP replacement.
  https://github.com/LimeJourney/limeJourney

## Positioning implication

Do not build another generic CRM or generic AI churn predictor. OpenRetention should win on:

1. Stripe/product-usage data in quickly.
2. Explainable account health rather than a black-box score.
3. Revenue-at-risk prioritization.
4. Renewal workflow with opinionated defaults.
5. Self-hosting and transparent hosted pricing.
6. No per-seat tax.
