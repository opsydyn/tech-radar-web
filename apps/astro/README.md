# Astro Tech Radar App

This is the static Astro application for the Tech Radar.

It renders MDX content collections as a GitHub Pages-friendly static site with React islands for the interactive radar, search, sidebar, and table drawer.

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
bun run astro      # Run the Astro CLI
```

## Content

Content is defined with Astro content collections in `src/content`.

```text
src/content/
├── blip/      # Technology blip MDX documents
└── edition/   # Tech radar edition MDX documents
```

The current implementation uses blip `move` metadata plus edition dates to determine which blips appear in each edition. The planned simplification is edition-owned snapshots, where each edition explicitly owns the blips and rings it contains.

## Key folders

```text
src/components/   # Astro and React components
src/hooks/        # React hooks
src/layouts/      # Astro layouts
src/pages/        # Static Astro routes
src/stores/       # Nanostores state
src/styles/       # Vanilla Extract styles
src/types/        # Shared TypeScript types
src/utils/        # Build-time and domain utilities
```

## Build output

Production builds are written to:

```text
dist/
```

GitHub Pages deploys this directory from the root workflow at `.github/workflows/deploy.yml`.
