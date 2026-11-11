# Cobbleverse Wiki

Official player documentation for Infinite Gaming Servers. Published at https://lastnahaj.github.io/Cobbleverse-Wiki/ through GitHub Pages.

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
- The Pokédex uses a dedicated TypeScript browser with species filters, shareable entries, form statistics, evolution links, learnsets, and spawn conditions. Species artwork is served locally from `public/assets/pokemon/`.
- Moves, abilities, items, and shops use dedicated catalogues with persistent filters, price sorting, item imagery, and species/form links. Battle references resolve learnsets and ability ownership from the same species snapshot as the Pokédex.
- The regional Gym directory retains the published 52-checkpoint sequence and supports a personal checklist saved in browser storage. It does not read or change server progress. Sources & Credits maps guide origins to local topic coverage; guide-source links remain inside the wiki.

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

Astro's `site` is `https://lastnahaj.github.io` with base `/Cobbleverse-Wiki`. Configure repository Pages to use GitHub Actions. No custom domain or DNS record is required. Internal links, search results, assets, and metadata retain the project-site prefix.

## Assets and sources

Production assets are grouped into `public/assets/brand/` and `public/assets/sections/`. Unused historical artwork is preserved outside production in `artwork/legacy/`. Add screenshots, items, and collectibles to descriptive folders when verified reference imagery is available. Retain dimensions and credits.

Refresh external reference snapshots with `npm run import:guides`, review changes and provenance, then run the full checks. Installation reports and upstream capability descriptions do not establish live server values.

Run `npm run import:pokemon-art` to restore missing species artwork from the PokéAPI sprite repository. Images are optimized to WebP at a maximum of 475 pixels; source attribution and missing-image results are recorded in `public/assets/pokemon/credits.json`.

Run `npm run import:pokemon-forms` to refresh the form artwork catalogue and locally hosted Pokémon Showdown animations. Entries switch images with the selected form, offer playback controls, and default to static artwork when reduced motion is enabled. Custom forms without matching artwork display an availability notice. Provenance and coverage are recorded in `public/assets/pokemon/forms/credits.json`.

Run `npm run import:item-art` to refresh matching item icons from the PokéAPI sprite repository. Custom items without a matching sprite use a category symbol. The site audit checks every image referenced by the artwork catalogues.
