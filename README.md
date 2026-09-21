# OpenRetention — self-hosted customer success software for B2B SaaS

[Website](https://yashkhou.github.io/openretention/) · [Health score guide](https://yashkhou.github.io/openretention/customer-health-score.html) · [Self-hosting guide](https://yashkhou.github.io/openretention/self-hosted-customer-success.html) · [FAQ](https://yashkhou.github.io/openretention/faq.html)

OpenRetention is a **source-available, self-hosted customer success operating system** for B2B SaaS teams that need account health scoring, churn-risk detection, renewal visibility and revenue-at-risk prioritization without adopting a large enterprise customer-success suite.

## Why OpenRetention

Most early-stage SaaS teams do not need a giant customer-success platform. They need four things working reliably:
1. one account list with revenue context,
2. a transparent customer health score,
3. a risk inbox ordered by revenue exposure,
4. a renewal/action workflow.

OpenRetention starts there. It does **not** claim feature parity with Gainsight, ChurnZero, Vitally, Planhat or other established enterprise products.

## Current release

- SQLite account store
- Deterministic, inspectable health-scoring engine
- Usage decline, inactivity, payment and renewal risk signals
- Risk inbox ranked by revenue impact
- ARR / at-risk ARR summary
- Account upsert API for future Stripe, PostHog, CRM or warehouse adapters
- Node.js 24 runtime
- Docker support
- Unit tests for scoring logic

## Quick start

```bash
npm run seed
npm start
```

Open <http://localhost:8787>.

Or run `docker compose up --build`.

## What is a customer health score?

A customer health score is a repeatable measure of an account's likelihood of remaining successful or becoming at risk. OpenRetention currently uses explainable signals such as product-usage decline, activity recency, payment state and renewal proximity rather than hiding the result inside an opaque model.

Read the [customer health score guide](https://yashkhou.github.io/openretention/customer-health-score.html) or inspect [the scoring code](src/score.js).

## Alternatives and fit

OpenRetention can be relevant to teams searching for a **self-hosted Gainsight alternative**, **self-hosted ChurnZero alternative**, or simply a smaller customer-success risk system. The current product is deliberately narrower than those commercial suites.

- [OpenRetention vs Gainsight](https://yashkhou.github.io/openretention/gainsight-alternative.html)
- [OpenRetention vs ChurnZero](https://yashkhou.github.io/openretention/churnzero-alternative.html)
- [When self-hosted customer success software makes sense](https://yashkhou.github.io/openretention/self-hosted-customer-success.html)

## Planned integrations

Stripe, PostHog, HubSpot, Intercom/Zendesk and Slack are on the roadmap. Planned integrations are not represented as shipped features until they are implemented.

## License

Business Source License 1.1. The Additional Use Grant permits internal production use for up to 100 active customer accounts, subject to the full license terms. The code is **source-available, not open source before the Change Date**. See [LICENSE](LICENSE).

## Research, citations and discovery

The repository includes [CITATION.cff](CITATION.cff), crawlable product/guide pages, a sitemap, structured software metadata and crawler rules that allow OAI-SearchBot. Search/distribution guidance is documented in [SEO-AEO.md](SEO-AEO.md).

## Contributing

Issues and focused pull requests are welcome. If you publish a benchmark, integration, deployment guide or customer-success research using OpenRetention, link the underlying source and methodology so others can verify it.
