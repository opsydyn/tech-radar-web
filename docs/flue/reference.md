# Flue reference

This page is the factual reference for the Flue edition agent in this repository.

## Package ownership

### Repository root

Root `package.json` owns:

- `@flue/cli` in `devDependencies`

### Flue package

`tooling/tech-radar-edition-agent/package.json` owns:

- `@flue/sdk`
- `valibot`
- `gray-matter`
- `effect`

## Important paths

```text
tooling/tech-radar-edition-agent/
├── .flue/
│   ├── agents/
│   │   └── edition.ts
│   └── roles/
│       └── project-librarian.md
├── .agents/
│   └── skills/
│       └── compose-edition/
│           └── SKILL.md
├── FLUE_KNOWLEDGE_BASE.md
├── package.json
└── src/
```

## Layout rule used in this repo

Because `tooling/tech-radar-edition-agent/` is an existing non-empty directory, the repo uses the **`.flue` layout**:

- `.flue/agents/`
- `.flue/roles/`

The package also uses:

- `.agents/skills/`

## Agent entrypoint

File:

```text
tooling/tech-radar-edition-agent/.flue/agents/edition.ts
```

Exports:

- `triggers = {}`
- default async agent function

## Role file

File:

```text
tooling/tech-radar-edition-agent/.flue/roles/project-librarian.md
```

Purpose:

- sets tone
- constrains hallucinations
- reinforces deterministic metadata boundaries

Default model in role frontmatter:

```text
openai/gpt-4.1-mini
```

## Skill file

File:

```text
tooling/tech-radar-edition-agent/.agents/skills/compose-edition/SKILL.md
```

Purpose:

- composes the free-text body content for one edition
- returns fields matching the structured result contract

## Package scripts

From `tooling/tech-radar-edition-agent/package.json`:

```text
generate:edition = bun run src/generateEditionFile.ts
typecheck        = tsc --noEmit
flue:dev         = flue dev --target node --env ../../.env
flue:run         = flue run edition --target node --id local-edition --payload '{}'
```

## Supported execution target

Use:

```text
flue run edition --target node
```

This repository’s current Flue slice is designed for node execution in local development and CI.

## Payload fields

The agent payload schema currently accepts these optional fields:

- `repoRoot: string`
- `runDate: string`
- `model: string`
- `librarianSummarySeed: string`
- `viewsContext: string`
- `recommendationsContext: string`
- `aiProvenanceNotes: string[]`

## Result envelope

The agent returns:

```text
{
  kind: "EditionAgentResult",
  result: {
    editionNumber: number,
    fileName: string,
    title: string,
    date: string,
    aiProvenance: {
      captureStatus: "captured" | "missing",
      auditEngine: string,
      generatedBy: string,
      entries: EditionAiProvenanceEntry[]
    },
    mdx: string
  }
}
```

## Provenance entry shape

Each `aiProvenance.entries[]` item contains:

- `feature`
- `kind`
- `provider`
- `model`
- `items`
- `calls`
- `inputTokens`
- `outputTokens`
- `cacheReadTokens`
- `cacheWriteTokens`
- `totalTokens`
- `notes`

## Current defaults

Defaults in the agent currently include:

- model: `openai/gpt-4.1-mini`
- sandbox: `local`
- role: `project-librarian`
- deterministic edition metadata generation

## Discovery model in this repo

Flue-relevant discovery points:

- root `AGENTS.md` for workspace context
- package `.flue/roles/` for role overlays
- package `.flue/agents/` for agent entrypoints
- package `.agents/skills/` for reusable skill markdown

## Related documents

- [Flue documentation landing page](./README.md)
- [How to run the edition agent](./how-to-run-the-edition-agent.md)
- [Why the repo uses Flue this way](./explanation.md)
