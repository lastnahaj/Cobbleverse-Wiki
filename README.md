# Cobbleverse Wiki

Official player documentation for Infinite Gaming Servers. Published at https://wiki.infinitegamingservers.com/ through GitHub Pages.

## Development

Use Node 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

## Architecture

- Astro 7 and TypeScript produce static HTML with no application framework hydration.
- Markdown articles use Astro Content Collections and validated frontmatter.
- `src/data/` contains shared server facts, commands, ranks, regional leaders, navigation, systems, and dated notices. Zod rejects malformed entries and duplicate identifiers.
- `src/components/` and `src/layouts/` contain the shared article shell, navigation, search, status, and reference views.
- `src/styles/global.css` supplies existing component styles; `atlas.css` defines the current visual system and responsive refinements.
- The production search index is generated from rendered public pages and verified player commands by `scripts/build-search.mjs`; there is no parallel title/description registry.
- `public/data/cobbleverse-guides/` contains versioned external reference snapshots. Search summaries are distinguished from complete data feeds.

## Verification

```sh
npm ci
npm run format:check
npm run check
npm run build
npm run audit:site
```

The link audit checks all generated pages, local images, anchors, and domain paths. Browser review covers navigation, search, tables, article reading, status failures, and responsive widths. See [the content guide](docs/CONTENT_GUIDE.md), [verification register](docs/VERIFICATION.md), and [contribution process](CONTRIBUTING.md).

## Deployment and domain

Pushes to `main` run the Pages workflow: install from the lockfile, formatting and type checks, static build, link audit, artifact upload, then deploy. A failed build cannot deploy.

Astro's `site` is `https://wiki.infinitegamingservers.com`; the site uses root paths. `public/CNAME` records the custom domain. Configure repository Pages to use GitHub Actions and set the custom domain to `wiki.infinitegamingservers.com`. DNS must have a CNAME for host `wiki` targeting `lastnahaj.github.io` with no path. Enable HTTPS after GitHub validates DNS and issues the certificate.

## Assets and sources

Production assets are grouped into `public/assets/brand/` and `public/assets/sections/`. Unused historical artwork is preserved outside production in `artwork/legacy/`. Add screenshots, items, and collectibles to descriptive folders when verified reference imagery is available. Retain dimensions and credits.

Refresh external reference snapshots with `npm run import:guides`, review changes and provenance, then run the full checks. Installation reports and upstream capability descriptions do not establish live server values.
