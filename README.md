<div align="center">
  <img src="./radar-logo.png" alt="Tech Radar Logo" width="800">
</div>

# Tech Radar v2

## Overview

Tech Radar v2 is a replacement for the current tech radar

## Project Structure

### Main Project

- **Name**: tech-radar-v2
- **Version**: 0.0.1
- **Type**: module

### Monorepo Structure

- **Package Manager**: pnpm@9.15.0
- **Monorepo Tool**: Moon
- **Workspaces**:
  - Apps: `apps/*`
  - Packages: `packages/*`

### Available Commands

#### Using Make

```bash
# General commands
make help          # Show all available commands
make check         # Run Moon checks across all projects
make run          # Run Moon tasks (usage: make run task=<taskname> project=<project>)
make ci           # Run Moon CI tasks

# Testing
make test         # Run tests once
make test-watch   # Run tests in watch mode

# Project-specific commands
make astro task=<taskname>    # Run tasks for astro project
make rust task=<taskname>     # Run tasks for rust project
make ratatui task=<taskname>  # Run tasks for ratatui project

# Other utilities
make prettier     # Format code with Prettier
make commit       # Create a commit using Commitizen
make cargo-build  # Build the Rust ADR generator
make cargo-run    # Run the Rust ADR generator
make sherif       # Run sherif
```

#### API Testing Commands

The project includes comprehensive API testing capabilities via make commands:

```bash
# Core API Testing
make api-help                    # Show all API testing commands
make api-blips                   # Get all blips from the API
make api-blip ID=37             # Get specific blip by ID
make api-quadrant QUADRANT=tools # Get blips for specific quadrant
make api-rels                   # Get API relationship documentation

# Document Freshness Testing
make api-freshness-docs         # Get freshness API documentation
make api-freshness-get IDENTIFIER=react DOC_TYPE=auto    # Test via GET
make api-freshness-post IDENTIFIER=docker DOC_TYPE=blip  # Test via POST
make api-freshness-examples     # Run comprehensive test examples

# Testing & Validation
make api-test-all              # Test all API endpoints
make api-validate              # Validate all endpoints are responding
make api-benchmark             # Benchmark API response times

# Utilities
make api-headers ENDPOINT=blips           # Show response headers
make api-save ENDPOINT=blips FILE=out.json # Save response to file
make api-peek ENDPOINT=blips LIMIT=30     # Preview first N lines
make install-jq                           # Install jq for better JSON formatting
```

#### API Testing Examples

```bash
# Test document freshness for different scenarios
make api-freshness-get IDENTIFIER=React.js DOC_TYPE=blip
make api-freshness-get IDENTIFIER=astro DOC_TYPE=adr
make api-freshness-get IDENTIFIER=docker  # Auto-detects type

# Test with better JSON formatting (after installing jq)
make install-jq
make api-blips FORMAT=jq

# Save API responses for analysis
make api-save ENDPOINT=blips FILE=all-blips.json FORMAT=jq
make api-save ENDPOINT=rels FILE=api-relationships.json

# Validate all endpoints are working
make api-validate

# Run comprehensive test suite
make api-test-all
```

#### Using npm/pnpm scripts

```bash
pnpm moon:check   # Run Moon checks
pnpm moon:run     # Run Moon tasks
pnpm moon:ci      # Run Moon CI tasks
pnpm test         # Run tests
pnpm test:watch   # Run tests in watch mode
pnpm prettier     # Format code
pnpm commit       # Create a commit
```

### API Documentation

The project provides several REST API endpoints:

#### Core Endpoints
- `GET /api/blips.api` - Get all technology blips
- `GET /api/blip/{id}.api` - Get specific blip by ID
- `GET /api/quadrant/{quadrant}.api` - Get blips for specific quadrant
- `GET /api/rels.api` - Get API relationship documentation

#### Document Freshness API
- `GET /api/notifications/freshness-test.api` - API documentation
- `GET /api/notifications/freshness-test.api?identifier={name}&type={blip|adr|auto}` - Test document freshness via query parameters
- `POST /api/notifications/freshness-test.api` - Test document freshness via JSON body

The freshness API helps track when documents need review based on their age:
- **Fresh**: ≤ 30 days old
- **Aging**: 31-90 days old
- **Stale**: 91-180 days old
- **Critical**: > 180 days old (requires urgent review)

### Project Components

#### Astro App
- Main web application built with Astro
- Dependencies: `@astrojs/react`, `react`, `vanilla extract`, `visx`

#### Rust ADR Generator
- Package Name: rust_adr_gen
- Version: 0.1.0
- Edition: 2021
- Dependencies: chrono, colored, indoc, dialoguer, clap

#### Ratatui ADR Generator
- Terminal UI version of the ADR generator

## Setup and Installation

## Usage

## Contributing

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/small.svg)](https://astro.build)
