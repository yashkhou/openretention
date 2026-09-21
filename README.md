# OpenRetention

OpenRetention is a source-available, self-hosted customer-success operating system for B2B SaaS teams that need the useful part of Gainsight/ChurnZero/Vitally without an enterprise contract or an implementation project.

## The wedge

Most early-stage SaaS teams do not need a giant customer-success suite. They need four things working immediately:

1. one account list with revenue context,
2. a transparent health score,
3. a risk inbox ordered by revenue at risk,
4. a renewal/action workflow.

OpenRetention starts there.

## Current prototype

- Local account store using SQLite
- Transparent health-scoring engine
- Risk inbox ranked by revenue impact
- ARR / at-risk ARR summary
- Account upsert API for Stripe, PostHog, CRM or warehouse adapters
- Zero-dependency Node 24 runtime
- Docker support
- Unit tests for scoring logic

### Quick start

```bash
npm run seed
npm start
```

Open <http://localhost:8787>.

Or:

```bash
docker compose up --build
```

## API

```bash
curl -X POST http://localhost:8787/api/accounts/upsert \
  -H 'content-type: application/json' \
  -d '{
    "externalId":"customer_123",
    "name":"Example Co",
    "mrr":1200,
    "usage7d":40,
    "usagePrev7d":100,
    "lastSeenAt":"2026-09-20T09:00:00Z",
    "paymentStatus":"ok",
    "renewalAt":"2026-10-10T00:00:00Z"
  }'
```

## Planned integrations

- Stripe: MRR, subscription state, payment failures, renewal date
- PostHog: active users and usage trend
- HubSpot: owner, lifecycle, contacts and notes
- Intercom/Zendesk: ticket volume and sentiment signals
- Slack: risk alerts and playbook actions

## Product model

The public code is intended to remain useful on its own. Managed cloud, premium connectors, hosted OAuth infrastructure, enterprise identity/audit controls and proprietary risk/forecast services can be sold separately.

See `docs/COMMERCIAL.md` and `docs/ARCHITECTURE.md`.

## License

Business Source License 1.1. The project is source-available today and converts to Apache License 2.0 on the Change Date. See `LICENSE` for the exact Additional Use Grant and terms.
