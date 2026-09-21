# Contributing to OpenRetention

Thanks for taking the time to improve OpenRetention.

OpenRetention is **source-available under Business Source License 1.1**, not OSI open source before the Change Date. Contributions are accepted under the repository's existing license terms unless explicitly agreed otherwise.

## Before opening a change

- Search existing issues and pull requests to avoid duplicate work.
- For substantial features or behavior changes, open an issue first so scope can be discussed.
- Keep changes focused. Separate unrelated refactors, documentation updates, and feature work when practical.
- Do not add claims that shipped features, integrations, security properties, or commercial terms exist unless they are verifiable in the repository.

## Local development

Requirements:

- Node.js 24 or newer
- npm

Install and test:

```bash
npm install
npm test
```

Run the application:

```bash
npm start
```

The self-hosted core uses SQLite. See the README and `docs/ARCHITECTURE.md` for current project structure.

## Pull requests

A useful pull request should include:

- a concise explanation of the problem and the change
- tests when behavior changes
- documentation updates when public behavior, setup, or APIs change
- screenshots only when they were rendered from the actual page/app and visually verified before upload
- no secrets, credentials, private customer data, or generated junk files

CI must pass before merge.

## Security reports

Do not disclose exploitable vulnerabilities in a public issue. Follow [SECURITY.md](SECURITY.md).

## Code of conduct

Be specific, technical, and respectful. Critique code and decisions rather than people. Harassment, threats, or discriminatory behavior are not acceptable in project spaces.

## License

By contributing, you agree that your contribution can be distributed under the license used by this repository. See [LICENSE](LICENSE).
