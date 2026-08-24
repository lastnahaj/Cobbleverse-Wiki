# Contributing

Contributions should keep the wiki accurate, readable, and safe to publish.

## Workflow

1. Create a focused branch from `main`.
2. Make the content or data change.
3. Run `npm run check` and `npm run build`.
4. Review the rendered page at both desktop and mobile widths.
5. Open a pull request that describes the project-facing change.

## Article frontmatter

New files in `src/content/docs/` must include:

```yaml
title: Article title
description: Short search and metadata description.
category: Getting Started
order: 50
tags: [example]
aliases: []
status: draft
lastUpdated: 2026-08-23
verified: false
related: []
hero: /assets/banner-getting-started.png
```

Use `draft` until the article is ready for public navigation and search. Use `verified: true` only when its server facts were checked against an authoritative source.

## Server facts

Do not guess commands, prices, rewards, Gym Leaders, teams, badges, staff roles, claim limits, permissions, event dates, recipes, addresses, or configuration values. Leave the relevant field null or keep the article in a clear unpublished state.

Keep reusable facts in the structured data files rather than repeating them in several pages. Preserve machine IDs separately from public labels.

## Commands and rules

Commands require `verified: true` and a `lastVerified` date before they appear in the public table. Rules require the authoritative policy text and revision information.

## Assets

Use repository-owned production artwork. Do not hotlink, scrape fan artwork, or replace section art with generic stock media. Preserve stable filenames and record approved changes in the artwork manifest.
