# Architecture

## Public/source-available layer

- Account/customer data model
- Health scoring engine and rules
- Risk inbox and renewal views
- Import/upsert API
- Local SQLite development runtime
- Docker image
- Connector interface definitions
- Community adapters that do not require managed secrets infrastructure

## Private commercial layer

Keep these outside the public repository:

- hosted multi-tenant control plane
- entitlement and billing service
- managed OAuth credential vault
- high-maintenance premium connectors
- proprietary benchmarking and forecast models
- enterprise SSO/SAML/SCIM
- anti-abuse systems
- hosted background-sync infrastructure

## Production target

The prototype deliberately uses SQLite and no runtime dependencies. The hosted product should move persistence to Postgres, queues to a durable worker system, and integrations to isolated sync workers while keeping the scoring engine as a pure package.
