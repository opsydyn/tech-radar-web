# Tutorial: Run your first local edition draft

This tutorial walks you through one successful local Flue run for the tech radar edition agent.

By the end, you will have:

- installed the workspace dependencies
- run the Flue edition agent locally
- received an `EditionAgentResult` payload containing generated MDX draft content

## Before you begin

You need:

- Node.js `22.12.0`
- Bun `1.3.11`
- repository dependencies installed
- a root `.env` file if your selected model provider requires credentials

## Step 1: install dependencies

From the repository root, install workspace dependencies:

```bash
bun install
```

You should finish with the workspace dependencies installed, including the root Flue CLI and the edition-agent package dependencies.

## Step 2: move into the Flue package

Change into the Flue tooling package:

```bash
cd tooling/tech-radar-edition-agent
```

You are now in the package that contains the agent, its role, and its skill.

## Step 3: run the agent once

Run the package script:

```bash
bun run flue:run
```

This executes:

```text
flue run edition --target node --id local-edition --payload '{}'
```

You should get a result envelope with this shape:

```text
{
  kind: "EditionAgentResult",
  result: {
    editionNumber: number,
    fileName: string,
    title: string,
    date: string,
    aiProvenance: { ... },
    mdx: string
  }
}
```

The important thing to notice is that the generated edition body is returned as `result.mdx`, while the edition number, title, file name, and date remain deterministic.

## Step 4: inspect the moving parts

Now look at the three core authoring files:

- `tooling/tech-radar-edition-agent/.flue/agents/edition.ts`
- `tooling/tech-radar-edition-agent/.flue/roles/project-librarian.md`
- `tooling/tech-radar-edition-agent/.agents/skills/compose-edition/SKILL.md`

Notice the split of responsibilities:

- the **agent** defines orchestration and typed result schemas
- the **role** defines tone and behavior boundaries
- the **skill** defines the composition task and output contract

## Step 5: try the development loop

To iterate locally with Flue’s development mode, run:

```bash
bun run flue:dev
```

This uses the repository root `.env` file:

```text
flue dev --target node --env ../../.env
```

You now have a working local Flue loop for the edition agent.

## What you accomplished

You have successfully:

- executed the Flue edition agent locally
- confirmed the package layout is working
- seen the deterministic-versus-AI boundary in the result
- identified where to edit the agent, role, and skill

## Next steps

- To run the agent with a custom payload, go to [How to run the edition agent](./how-to-run-the-edition-agent.md).
- To look up paths, scripts, and payload fields, use [Flue reference](./reference.md).
- To understand the architecture decisions, read [Why the repo uses Flue this way](./explanation.md).
