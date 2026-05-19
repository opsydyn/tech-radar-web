# Astro Tech Radar App

This is the static Astro application for the Tech Radar.

It renders MDX content collections as a GitHub Pages-friendly static site with React islands for the interactive radar, search, sidebar, and table drawer.

The app now serves both canonical routes and edition-aware static routes for
quadrants and blips, and it resolves related technologies from edition snapshot
metadata before falling back to canonical content.

## Stack

- Astro 6
- React 19
- TypeScript
- Vanilla Extract
- Visx
- Nanostores
- Fuse.js
- Base UI
- Pixelarticons
- Vitest

## Development

From the repository root:

```bash
make astro-dev
```

From this app directory:

```bash
bun run dev
```

## Scripts

```bash
bun run dev        # Start Astro dev server
bun run start      # Start Astro dev server without --host
bun run build      # Run astro check and astro build
bun run preview    # Preview the static build
bun run test       # Run Vitest once
bun run test:watch # Run Vitest in watch mode
bun run lint       # Lint Vanilla Extract source files
bun run astro      # Run the Astro CLI
```

## Content

Content is defined with Astro content collections in `src/content`.

```text
src/content/
├── blip/      # Canonical technology blip MDX documents
└── editions/  # Edition-owned snapshot folders and blip state
```

Current behavior is snapshot-first:

- the radar homepage reads edition-owned snapshots from `src/content/editions/`
- edition landing pages read snapshot `index.mdx` files only
- each edition snapshot owns the blips and rings it contains
- movement is derived by comparing adjacent edition snapshots
- the app emits both canonical routes and edition-scoped routes for blip and quadrant pages
- canonical quadrant pages use the latest edition snapshot when one exists
- canonical blip pages use the latest edition snapshot when the requested blip exists there
- related blips on detail pages resolve from edition snapshot metadata first
- some blip detail/history views still read legacy `ring` and `move` fields

The old `src/content/edition/` folder is no longer loaded by the app runtime
and is ready for deletion after content review. Canonical blip files still
retain authored descriptions, ADR content, and movement metadata, so the full
domain model simplification is not complete end-to-end yet.

## Key folders

```text
src/components/   # Astro and React components
src/hooks/        # React hooks
src/layouts/      # Astro layouts
src/pages/        # Canonical and edition-scoped static Astro routes
src/stores/       # Nanostores state
src/styles/       # Vanilla Extract styles
src/types/        # Shared TypeScript types
src/utils/        # Build-time/domain utilities and route helpers
```

Important route families include:

```text
src/pages/index.astro
src/pages/blip/[slug].astro
src/pages/quadrants/[quadrant].astro
src/pages/edition/[edition]/blip/[slug].astro
src/pages/edition/[edition]/quadrants/[quadrant].astro
```

## Build output

Production builds are written to:

```text
dist/
```

GitHub Pages deploys this directory from the root workflow at `.github/workflows/deploy.yml`.
