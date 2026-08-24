# Cobbleverse Wiki

Official wiki for the Cobbleverse Cobblemon server by Infinite Gaming Servers.

The site is a static Astro field guide with content collections, typed server data, local browser search, custom CSS, and GitHub Pages deployment. It is designed for the project-site URL `https://lastnahaj.github.io/Cobbleverse-Wiki/`.

## Local development

Requirements:

- Node.js 22.12 or newer
- npm

```bash
npm ci
npm run dev
```

The development server uses Astro's local URL. Production routing is configured with the `/Cobbleverse-Wiki/` base path.

## Production build

```bash
npm run check
npm run build
```

The static site is written to `dist/`. GitHub Actions installs from `package-lock.json`, builds the same output, uploads `dist`, and deploys it to GitHub Pages.

## Content editing

Long-form guides live in `src/content/docs/`. Each Markdown article uses validated frontmatter for title, description, category, ordering, tags, aliases, publication status, update date, verification state, related pages, and optional section artwork.

Draft and archived articles are excluded from public article routes and local search.

Structured facts live in `src/data/`:

- `regions.json` — region order and unlock copy
- `ranks.json` — independent playtime, staff, and Gym rank tracks
- `gyms.json` — typed Gym records with nullable unpublished fields
- `currencies.json` — currency category and activity state
- `features.json` — server-system publication status
- `commands.json` — verified command records
- `server.json` and `navigation.json` — shared identity and navigation

The Zod schemas in `src/data/index.ts` fail the build when data is malformed.

See [docs/CONTENT_GUIDE.md](docs/CONTENT_GUIDE.md) for staff-oriented editing instructions and [CONTRIBUTING.md](CONTRIBUTING.md) for review requirements.

## Artwork

Production images are in `public/assets/` and retain stable filenames. Editable/reference material and validation records are in `artwork/`.

Replace an image in place only when its role and dimensions remain compatible. Update `artwork/asset-manifest.json` and `artwork/IMAGE_VALIDATION.json` with any approved visual revision.

## Base-path handling

`astro.config.mjs` defines:

```js
site: "https://lastnahaj.github.io",
base: "/Cobbleverse-Wiki"
```

Internal runtime links use `src/lib/basePath.ts`. Navigation, artwork, search results, favicons, the web manifest, canonical URLs, social images, the sitemap, and the 404 page are all project-path aware.

## Deployment

Pushes to `main` run `.github/workflows/deploy.yml`. The repository's Pages source must be set to **GitHub Actions**.

No backend, database, external search service, analytics, or hosted content system is required.
