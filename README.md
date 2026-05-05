# Tech Radar

![Tech Radar Logo](./radar-logo.png)

A static, Astro-powered technology radar for publishing edition-based technology guidance to GitHub Pages.

The project has been simplified around a crisp static-site workflow: content lives in Astro content collections, the radar renders as a React/Visx island, and the site is built and deployed as static assets.

## Current scope

This repository currently focuses on:

- an Astro 6 web app in `apps/astro`
- MDX content for blips and editions
- React 19 islands for interactive radar UI
- Visx-powered radar visualization
- Vanilla Extract styles
- fuzzy search with Fuse.js
- GitHub Pages deployment
- Moon task orchestration
- Bun package management

Out of scope for the simplified version:

- legacy sidecar generators
- terminal UI tooling
- database-backed APIs
- server-side API endpoints for blips
- document freshness API endpoints
- full-stack intelligence services

## Repository structure

```text
.
├── apps/
│   └── astro/              # Static Astro tech radar application
├── packages/
│   ├── biome-config/       # Shared Biome configuration package
│   └── tsconfig/           # Shared TypeScript configuration package
├── tooling/                # Workspace tooling packages/scripts
├── .github/workflows/      # GitHub Actions workflows
├── .make/                  # Make target definitions
├── Makefile                # Developer command shortcuts
├── package.json            # Root Bun workspace configuration
└── README.md
```

## Application structure

The main app lives in `apps/astro`.

Important paths:

```text
apps/astro/
├── src/
│   ├── components/         # Astro and React components
│   ├── content/            # Astro content collections
│   │   ├── blip/           # Technology blip MDX documents
│   │   └── edition/        # Edition MDX documents
│   ├── hooks/              # React hooks
│   ├── layouts/            # Astro layouts
│   ├── pages/              # Static routes
│   ├── stores/             # Nanostores state
│   ├── styles/             # Vanilla Extract styles
│   ├── types/              # Shared TypeScript domain types
│   └── utils/              # Build-time/content utilities
├── astro.config.mts
├── content.config.ts
└── package.json
```

## Tech stack

- **Runtime/package manager**: Bun `1.3.11`
- **Node.js**: `22.12.0`
- **Monorepo tasks**: Moon
- **Framework**: Astro `6`
- **UI islands**: React `19`
- **Visualization**: Visx
- **Styling**: Vanilla Extract
- **State**: Nanostores
- **Search**: Fuse.js
- **Icons**: Pixelarticons
- **Validation/content schema**: Astro content collections with Zod
- **Tests**: Vitest
- **Deployment**: GitHub Pages

## Prerequisites

Install:

- Node.js `22.12.0`
- Bun `1.3.11`

Then install dependencies:

```bash
bun install
```

## Development

Start the Astro development server:

```bash
make astro-dev
```

Or run the Astro app directly:

```bash
cd apps/astro
bun run dev
```

## Common commands

### Make shortcuts

```bash
make help          # Show available Make targets
make astro-dev     # Start the Astro dev server
make astro-build   # Build the Astro site through Moon
make check         # Run Moon checks
make ci            # Run Moon CI tasks
make test          # Run Vitest once
make test-watch    # Run Vitest in watch mode
make biome         # Format the workspace with Biome
make commit        # Create a Commitizen commit
make sherif        # Run dependency/workspace checks with sherif
make code-owners   # Sync CODEOWNERS from Moon metadata
```

### Bun scripts

```bash
bun run moon:check
bun run moon:ci
bun run test
bun run test:watch
bun run prettier
bun run sherif
```

### Astro app scripts

From `apps/astro`:

```bash
bun run dev        # Start Astro dev server
bun run build      # Run astro check and astro build
bun run preview    # Preview the static build
bun run test       # Run Astro app tests
```

## Content model

The radar is content-driven.

### Blips

Blips live in:

```text
apps/astro/src/content/blip/
```

Each blip is an MDX file with frontmatter such as:

```yaml
---
id: "54"
name: "Azure"
ring: "Adopt"
quadrant: "Platforms"
tags: ["Cloud"]
authors: ["Author"]
hasAdr: false
description: "Cloud platform services from Microsoft."
created: "2023-01-02"
move:
  - ["stay", "2025-04-09"]
---
```

### Editions

Editions live in:

```text
apps/astro/src/content/edition/
```

Each edition is an MDX document with metadata such as:

```yaml
---
id: "6"
number: 6
title: "Tech Radar Edition 6 - May 2026"
content: "Edition summary"
date: "2026-05-05"
---
```

The current implementation filters blips into editions using each blip's `move` dates and the selected edition date. A planned simplification is to move toward edition-owned blip snapshots, where each edition folder explicitly declares the blips and rings for that edition.

## Deployment

The site deploys to GitHub Pages with `.github/workflows/deploy.yml`.

On pushes to `main`, the workflow:

1. installs dependencies with Bun
2. builds the Astro site from `apps/astro`
3. uploads `apps/astro/dist`
4. deploys the static artifact to GitHub Pages

## Testing and validation

Recommended pre-commit checks:

```bash
make check
make test
```

For focused Astro development, run from `apps/astro`:

```bash
bun run build
bun run test
```

## Project direction

The current direction is a static-only tech radar:

- content-first
- edition-oriented
- fast GitHub Pages deployment
- minimal runtime complexity
- no database or server API dependency
- no sidecar tooling

Future work should continue to simplify the domain model, especially edition movement. The preferred direction is:

> A blip's ring and presence are edition-owned facts. Movement is derived by comparing adjacent edition snapshots.

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)
