# How to run the edition agent

Use this guide when you already know what the Flue edition agent is and you want to execute it for a specific task.

## Run the default local package command

From `tooling/tech-radar-edition-agent`, run:

```bash
bun run flue:run
```

Use this when you want the package’s default local execution path.

## Start local development mode

From `tooling/tech-radar-edition-agent`, run:

```bash
bun run flue:dev
```

Use this when you want an interactive local development loop with the root `.env` file loaded.

## Run the agent with a custom payload

From the repository root or from the package directory, run:

```bash
flue run edition --target node --id edition-2026-05-06 --payload '{
  "runDate": "2026-05-06",
  "model": "openai/gpt-4.1-mini",
  "librarianSummarySeed": "Summarize the edition in a calm, evidence-aware tone.",
  "viewsContext": "View data is partial for this run.",
  "recommendationsContext": "Focus on practical guidance for the next edition.",
  "aiProvenanceNotes": ["Triggered from a manual local run."]
}'
```

Use this when you need to override defaults without editing the agent source.

## Run against a different repository root

Pass `repoRoot` in the payload:

```bash
flue run edition --target node --id edition-alt-root --payload '{
  "repoRoot": "/workspace",
  "runDate": "2026-05-06"
}'
```

Use this pattern in CI, sandboxed runs, or when the checked-out repo path differs from your local default.

## Choose a different model

Pass an exact model ID in the payload:

```bash
flue run edition --target node --id edition-alt-model --payload '{
  "model": "openai/gpt-4.1-mini"
}'
```

Prefer exact model IDs over informal aliases so runs remain reproducible.

## Check the result

A successful run returns an envelope with:

- `kind = "EditionAgentResult"`
- deterministic edition metadata
- `aiProvenance` details
- the generated markdown body in `result.mdx`

If you are validating the run, check these first:

- `result.fileName`
- `result.title`
- `result.date`
- `result.aiProvenance.captureStatus`
- `result.mdx`

## Use the correct target

For this repo, use:

```text
--target node
```

This agent is currently designed around local and CI node execution.

## Use the generated result safely

Treat the Flue result as a reviewable draft artifact:

- keep deterministic metadata authoritative
- review prose before publishing
- preserve provenance notes
- avoid introducing invented metrics or adoption claims

## Related reading

- For a guided first run, see [Tutorial: Run your first local edition draft](./tutorial-run-your-first-local-edition-draft.md).
- For exact paths and schemas, use [Flue reference](./reference.md).
