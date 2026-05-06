# Why the repo uses Flue this way

This page explains the design choices behind the Flue edition agent.

## Why Flue exists in this repo at all

The repository is moving toward a simpler static-first tech radar on GitHub Pages, but there is still one narrow place where AI assistance is useful: composing human-readable edition narrative text.

Flue is used here to keep that AI boundary explicit and reviewable.

## Why the agent is in `tooling/tech-radar-edition-agent`

The Flue edition generator is a tooling concern, not part of the deployed Astro application.

That separation is intentional:

- the static site stays simple
- the authoring workflow can evolve independently
- AI orchestration does not leak into the runtime delivery path

## Why the repo uses the `.flue` layout

This package already existed before the agent was introduced.

The `.flue` layout is the right fit because it lets the repo add Flue agents and roles without pretending the package is a greenfield starter.

It also makes the Flue-specific surface area obvious:

- `.flue/agents/` for entrypoints
- `.flue/roles/` for personas
- `.agents/skills/` for reusable task instructions

## Why metadata is deterministic but narrative is AI-generated

The current slice deliberately separates two kinds of work:

- **deterministic work**: edition number, file name, title, and date
- **AI work**: prose summaries and recommendations

That split matters because it reduces risk.

The agent is allowed to help with writing, but not with inventing core repository facts. This keeps the generated result easier to review, easier to trust, and easier to compare across runs.

## Why typed schemas are important here

The agent uses `valibot` result schemas so the orchestration boundary is machine-checkable.

That gives the repo a few advantages:

- prompts produce structured output instead of ambiguous prose blobs
- downstream automation can inspect known fields safely
- provenance reporting can stay attached to the result contract
- failures become easier to diagnose

## Why the role and skill are split

The repo uses separate files for:

- **role**: behavioral stance and tone
- **skill**: task definition and output contract
- **agent**: orchestration and schema boundary

This separation keeps changes local:

- tone changes belong in the role
- composition-task changes belong in the skill
- execution-flow changes belong in the agent

## Why the current target is Node and CI-first

The edition generator is currently optimized for local execution and GitHub Actions.

That is why the documented path is:

```text
flue run edition --target node
```

This fits the repo’s actual publishing model:

- content is generated ahead of time
- output is reviewable markdown
- the production site remains static
- GitHub Pages deployment stays straightforward

## Why provenance is first-class

The generated edition text is supposed to be editorially useful, not mysteriously magical.

By recording provenance alongside the result, the repo preserves a visible record of:

- what part was AI-assisted
- what part was deterministic
- which model was used
- whether token usage was captured

That makes the Flue workflow easier to audit and safer to evolve.

## How this fits the broader repository direction

This Flue slice is intentionally narrow.

It supports the current product direction rather than fighting it:

- static site delivery
- GitHub Pages deployment
- reviewable content artifacts
- minimal runtime complexity
- AI as tooling, not infrastructure

In short: the repo is not becoming an AI platform. It is using Flue as a focused authoring tool where that trade-off is actually worth it.
