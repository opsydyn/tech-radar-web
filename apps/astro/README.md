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
├── blip/      # Canonical technology blip MDX documents
├── edition/   # Legacy tech radar edition MDX documents
└── editions/  # Edition-owned snapshot folders and blip state
```

Current behavior is hybrid:

- the radar homepage prefers edition-owned snapshots from `src/content/editions/`
- each edition snapshot owns the blips and rings it contains
- movement is derived by comparing adjacent edition snapshots
- the app still supports a legacy fallback using blip `move` metadata plus
	`src/content/edition/` dates when snapshot editions are absent
- some blip detail/history views still read legacy `ring` and `move` fields

So edition alignment is underway and live in the main radar pipeline, but the
full domain model has not been simplified end-to-end yet.

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
