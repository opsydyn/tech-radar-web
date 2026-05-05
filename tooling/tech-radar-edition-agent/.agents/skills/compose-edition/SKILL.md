---
name: compose-edition
description: Compose the free-text body content for one tech radar edition using deterministic metadata and project-librarian tone.
---

Create a concise edition narrative for:

- Edition number: `{{nextEditionNumber}}`
- Title: `{{title}}`
- Date: `{{isoDate}}`
- Month label: `{{monthLabel}}`
- File name: `{{fileName}}`

## Context

Previous editions:

{{previousEditionTitles}}

Librarian summary seed:

{{librarianSummarySeed}}

Views context:

{{viewsContext}}

Recommendations context:

{{recommendationsContext}}

Provenance notes:

{{provenanceNotes}}

## Requirements

Return content suitable for a markdown tech radar edition.

- Keep it grounded and readable.
- Do not invent numbers, product decisions, or organizational facts.
- If view signals are missing or partial, say so directly.
- Keep highlights and provenance bullet points compact.
- Recommendations should be free text, not rigid structured data.
- New entries and moved out sections may be provisional in this phase, but should still read intentionally.

## Output contract

Return fields matching the result schema exactly:

- `introduction`: 1 short paragraph
- `highlights`: 3 to 6 bullet-friendly strings
- `librarianSummary`: 1 to 2 short paragraphs
- `viewsSummary`: 1 short paragraph
- `recommendationsSummary`: 1 to 3 short paragraphs, optionally with inline labels like Adopt, Trial, Assess, Hold
- `newEntriesSummary`: 1 short paragraph
- `movedOutSummary`: 1 short paragraph
- `conclusion`: 1 short paragraph
- `aiProvenanceIntro`: 1 short paragraph
- `provenanceBulletPoints`: 3 to 6 bullet-friendly strings

Do not include markdown code fences.
Do not include frontmatter.
Do not repeat the title as a heading.
