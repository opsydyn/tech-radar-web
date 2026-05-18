# Tech Radar Edition Agent

This workspace package will host the Flue-powered phase-1 edition generator for the tech radar.

## Scope

- Read existing edition content
- Bump the edition number on each run
- Generate one new edition MDX file
- Include librarian summary, views, recommendations, and AI provenance
- Draft edition-local `relatedBlips` proposals for existing snapshot editions
- Write reviewable snapshot Markdown updates plus relationship review artifacts

## Constraints

- Keep frontmatter compatible with the existing Astro `edition` collection
- Keep snapshot frontmatter compatible with the Astro `editionBlipSnapshot` collection
- Prefer deterministic inputs for selection and AI only for free-text synthesis
- Write reviewable Markdown artifacts
- Keep humans in the review loop for every relationship suggestion

## Flue reference material

- See `FLUE_KNOWLEDGE_BASE.md` in this package for the distilled Flue setup guidance we want to follow.
- Prefer the `.flue` layout in this package because the directory is already non-empty.
- Target GitHub Actions conventions first: `triggers = {}`, `sandbox: 'local'`, typed results with `valibot`, and `flue run <agent> --target node` for CI execution.
