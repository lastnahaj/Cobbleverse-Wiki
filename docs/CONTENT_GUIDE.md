# Staff content guide

## Add or update a page

Articles live in `src/content/docs/`. The path becomes its URL: `getting-started/claims.md` is `/getting-started/claims/`.

```yaml
title: Guide title
description: A short explanation of what this guide helps players do.
category: Getting Started
order: 50
tags: [travel]
aliases: []
status: draft
lastUpdated: 2026-11-10
verified: false
verificationScope: unconfirmed
source: []
related: []
```

Use the actual edit date when making a meaningful documentation update. Do not change dates just to appear in Recently Updated. Publish only after review. Optional `serverVersion` identifies the tested release; `hero` is reserved for purposeful category artwork. Ordinary articles use a compact reading layout.

Verification scopes are `server`, `base-pack`, `upstream`, and `unconfirmed`. Link the evidence in `source`; explain local differences in the article. A mod's documentation establishes capabilities, not this server's prices or settings.

## Commands

Edit `src/data/commands.json`. Keep `id` unique and stable. Include `command`, `syntax`, `aliases`, `description`, `category`, `audience`, `examples`, `notes`, `sourceMod`, `related`, `verified`, and `lastVerified` where known. Public commands require player audience, verification, and a review date. Staff and admin records never appear in the player table or command search.

## Systems

Edit `features.json`. Existing `id` is the URL slug. Fields include category, status, environment (`server`, `client`, `both`, or `infrastructure`), `playerFacing`, `requiredClient`, `optionalClient`, `serverBehavior`, `externalUrl`, `article`, `verified`, and `lastVerified`. Unknown candidates remain internal with `playerFacing: false`. Add player instructions to the matching guide definition or a dedicated Markdown article.

## Gyms and progression

Edit `regionalGyms.json` for leaders, badges, locations, signature items, and rewards supported by evidence. Optional team, battle format, level range, and verification fields remain null until checked. Regional order and unlock text live in `regions.json`; the homepage builds from that data. Do not invent Pokédex thresholds.

Edit `ranks.json` for independent `playtime`, `staff`, and `gym` tracks. Preserve IDs separately from display names. Hours are cumulative thresholds.

## Currencies

Edit `currencies.json`. Keep ID, name, category, description, and status together. Status is `active`, `event`, `retired`, or `unknown`; the compatibility `active` field is retained for existing components. Unknown is a valid publication state. Do not assign prices to fill an empty table.

## Notices and updates

Add dated records to `src/data/updates.ts`, with a unique ID, date, title, description, and kind: `wiki`, `server`, `event`, `maintenance`, or `breaking`. Mark ended temporary notices explicitly. Permanent guides should describe normal behavior and link current announcements rather than retaining expired events.

## Images

Use `public/assets/brand`, `sections`, `screenshots`, `items`, or `collectibles`. Keep accurate alt text, dimensions, source/credit records, and lazy loading below the first screen. Do not stretch a small crop into a banner. Historical assets belong outside `public/`.

## Search and publication

Production search derives titles, descriptions, headings, and text from generated HTML, with player command aliases from structured data. Edit the page instead of a duplicate search registry. Build before previewing production search.

Run all commands in README, inspect the result in a browser, and check the custom-domain canonical URL. DNS and Pages setup are documented in README. Never include credentials, private addresses, host details, or unverified configuration in public guides.
