# Contributing

1. Create a focused branch from `main`.
2. Update the authoritative Markdown article or structured data record.
3. Record the source, version, scope, and actual review date for factual changes.
4. Run `npm ci`, `npm run format:check`, `npm run check`, `npm run build`, and `npm run audit:site`.
5. Review the rendered page on mobile and desktop, including keyboard navigation.
6. Submit a concise pull request describing the resulting player behavior and validation.

Never infer commands, prices, teams, rewards, permissions, rates, or policy. Use null or unknown when facts are unavailable. Keep staff commands and infrastructure out of player navigation. Review staged content and commit metadata for private information before publication.

Use `status: draft` while authoring. Draft and archived articles are excluded from routes and search. `verified` describes a reviewed reference; use `verificationScope`, `source`, and `serverVersion` to distinguish base-pack behavior from configuration confirmed on Cobbleverse.

See [the staff content guide](docs/CONTENT_GUIDE.md) for field-by-field editing instructions.
