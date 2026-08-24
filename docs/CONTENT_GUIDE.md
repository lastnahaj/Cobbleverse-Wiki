# Cobbleverse Wiki Content Guide

This guide covers the updates server staff are most likely to make.

## Edit or add a guide

Guides are Markdown files in `src/content/docs/`. Edit the prose below the frontmatter block. To add a page, copy a nearby article, change every frontmatter field, and begin with `status: draft` and `verified: false`.

The file path becomes the public route. For example:

```text
src/content/docs/getting-started/claims.md
→ /getting-started/claims/
```

Change `status` to `published` only after review. Published content is automatically added to local search.

## Add a command

Add a record to `src/data/commands.json` with a unique machine ID:

```json
{
  "id": "example",
  "command": "/example",
  "syntax": "/example <value>",
  "aliases": [],
  "description": "Verified player-facing description.",
  "category": "utility",
  "audience": "player",
  "examples": [],
  "notes": [],
  "related": "/getting-started/",
  "verified": true,
  "lastVerified": "2026-08-23"
}
```

Unverified records are hidden from the normal public command table.

## Change a rank

Edit `src/data/ranks.json`. Keep `id` stable, change the display `name` separately, and use the correct `track`: `playtime`, `staff`, or `gym`. Playtime thresholds use `hours`.

## Update a feature status

Edit the matching record in `src/data/features.json`. Allowed statuses are:

- `active`
- `planned`
- `optional-client`
- `deprecated`
- `unknown`

Use `unknown` when the current state has not been confirmed. Never use `active` as a placeholder.

## Update a Gym entry

Edit `src/data/gyms.json`. The directory already contains every standard type. Keep any unavailable value as `null`:

```json
{
  "id": "fire",
  "type": "Fire",
  "leaderName": null,
  "badgeName": null,
  "reward": null,
  "status": "unknown"
}
```

Do not create a leader, team, badge, reward, schedule, or rule to fill an empty design state.

## Add a notice

Permanent wiki changes and dated notices are rendered from `src/pages/changelog/index.astro`. Every temporary server notice should state its date, affected system or world, and whether it has ended. Keep temporary changes out of permanent world guides.

## Replace a banner

Production images live in `public/assets/`. Replace the existing filename so page code remains stable. Keep the same intended role and compatible dimensions, then update:

- `artwork/asset-manifest.json`
- `artwork/IMAGE_VALIDATION.json`

Check the banner at desktop and mobile widths. Its baked typography should not be covered by duplicate text.

## Verify before publishing

```bash
npm ci
npm run check
npm run build
```

Review links, images, local search, tables, navigation, metadata, and the `/Cobbleverse-Wiki/` base path before merging.
