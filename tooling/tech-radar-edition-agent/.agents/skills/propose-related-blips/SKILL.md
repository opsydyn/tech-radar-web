---
name: propose-related-blips
description: Propose reviewable edition-local relatedBlips entries for one tech radar snapshot edition.
---

Draft relationship proposals for:

- Edition id: `{{editionId}}`
- Edition title: `{{editionTitle}}`
- Edition date: `{{editionDate}}`
- Max relationships per source blip: `{{maxRelationshipsPerBlip}}`

## Relationship type guide

{{relationshipTypeGuide}}

## Allowed blip ids

These are the only ids you may emit in `sourceBlipId` and `targetBlipId`.

{{allowedBlipIdsContext}}

## Candidate blips

{{candidateBlipsContext}}

## Existing relationship graph

{{existingRelationshipGraph}}

## Requirements

Return a compact, reviewable relationship draft.

- Use only the source and target blip ids present in the candidate list.
- `sourceBlipId` and `targetBlipId` must be the exact `blipId` values from **Allowed blip ids**.
- Never return display names like `Azure`, `Cypress`, or `Azure (54)` in the id fields.
- Prefer the relationships that help a reader navigate this edition quickly.
- Keep the graph sparse; not every blip needs a relationship.
- Do not invent hidden architecture, product roadmaps, team ownership, or adoption data.
- Treat the existing relationship graph as already present in snapshot files; do not return the same source/target/type combination again.
- Prefer novel, high-signal additions for active blips that have few or no existing relationships.
- Treat low-confidence suggestions as rare; prefer fewer, stronger proposals.
- Reasons should be one sentence and suitable for direct frontmatter storage.
- `context` is optional, but useful when it clarifies why the relationship matters in this edition.
- `evidence` should contain 1 to 3 short bullets grounded in the supplied context.
- If no novel relationships between active candidate blips are justified, return an empty `proposals` array.

## Output contract

Return fields matching the result schema exactly:

- `overview`: 1 short paragraph
- `highlights`: 2 to 5 bullet-friendly strings
- `cautions`: 1 to 4 bullet-friendly strings
- `proposals`: array of proposal objects

Each proposal object must contain:

- `sourceBlipId`
- `targetBlipId`
- `relationshipType`
- `reason`
- `context` (optional)
- `bidirectional`
- `confidence` (`high`, `medium`, or `low`)
- `evidence`: array of 1 to 3 short strings

Additional rules for proposals:

- Propose at most `{{maxRelationshipsPerBlip}}` relationships per source blip.
- Never create self-links.
- Avoid proposing the exact same source/target/type combination twice.
- Favor `high` and `medium` confidence over `low`.
- Use ids like `1`, `54`, or `109` in `sourceBlipId` / `targetBlipId`, not names.

Do not include markdown code fences.
Do not include YAML frontmatter.
Do not include prose outside the schema fields.
