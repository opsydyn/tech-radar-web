# Flue Knowledge Base

This package uses Flue for the phase-1 tech radar edition generator. These notes distill the most relevant guidance from the Flue starter docs, README, and GitHub Actions deployment guide.

## Source references

- `https://flueframework.com/start.md`
- `https://raw.githubusercontent.com/withastro/flue/refs/heads/main/README.md`
- `https://raw.githubusercontent.com/withastro/flue/refs/heads/main/docs/deploy-github-actions.md`
- `https://flueframework.com/models.json`

## Workspace layout rule

Flue starter guidance distinguishes between two layouts:

- **Root layout** for a new or empty directory:
  - `./agents/`
  - `./roles/`
- **`.flue` layout** for an existing non-empty directory:
  - `./.flue/agents/`
  - `./.flue/roles/`

Because `tooling/tech-radar-edition-agent/` already exists and contains files, this project should use the **`.flue` layout** for agents and roles.

## Discovery model

In a local sandbox or CI run, Flue discovers context from the workspace automatically:

- `AGENTS.md` at the workspace root provides global system context
- `.agents/skills/` holds reusable markdown skills
- `.flue/roles/` holds role overlays/personas
- `.flue/agents/` holds agent entrypoints for this package layout

## Package split we should follow

Reference projects use a split between CLI and runtime dependencies:

- **Workspace root**: `@flue/cli` as a dev dependency
- **Agent package**: `@flue/sdk` and `valibot`
- Add only extra libraries needed for the specific job (for us, `gray-matter` is useful for MDX/frontmatter handling)

For this repo, that means:

- root package owns `@flue/cli`
- `tooling/tech-radar-edition-agent` owns `@flue/sdk`, `valibot`, and slice-specific runtime dependencies

## GitHub Actions conventions

For CI-oriented agents:

- use `export const triggers = {}`
- initialize with `sandbox: 'local'`
- the local sandbox mounts the checked-out repo at `/workspace`
- `flue run <agent> --target node` is the intended one-shot CI path

Example shape:

- `flue run edition --target node --id edition-2026-05-05 --payload '{...}'`

Important starter constraints from Flue docs:

- `flue run` supports `--target node`
- for local iteration use `flue dev --target node`
- `flue run --target cloudflare` is not supported

## Local development commands

Preferred commands from the starter docs:

- `flue dev --target node --env .env`
- `flue run <agent> --target node --id <id> --payload '<json>'`
- `flue build --target node` for deployable HTTP output

## Agent authoring guidance

Flue expects:

- an explicit `model` passed to `init()`
- typed result schemas with `valibot`
- orchestration through `session.prompt()` and `session.skill()`
- optional `session.task()` for detached research/child-agent work

Use typed results to drive deterministic orchestration decisions instead of parsing free-text output.

## Commands and secrets

If a CI agent needs privileged CLIs like `gh`, `git`, or `npm`:

- expose them with command wrappers (for example via `defineCommand`)
- pass required secrets in command env, not in prompts
- grant commands per prompt/skill call, not globally

This keeps secrets out of agent-visible context.

## Model guidance

The Flue starter docs explicitly suggest exact model IDs, including:

- `anthropic/claude-sonnet-4-6`
- `anthropic/claude-opus-4-7`
- `openai/gpt-5.5`
- `openrouter/moonshotai/kimi-k2.6`

`models.json` confirms these and many more valid IDs. For this project, prefer an exact stable model ID rather than an informal alias.

## Guidance for this tech-radar edition slice

For the current phase-1 edition generator:

- keep the Astro edition frontmatter compatible with the existing `edition` collection
- use Flue only to generate the free-text edition body content
- prefer deterministic inputs for edition numbering and source selection
- keep AI focused on summary/recommendation wording and provenance-aware narrative
- record provenance explicitly in the generated edition body

## Immediate implementation implications

When we scaffold the first agent in this package, it should likely live at:

- `tooling/tech-radar-edition-agent/.flue/agents/edition.ts`

Likely supporting files:

- `tooling/tech-radar-edition-agent/.flue/roles/project-librarian.md`
- `tooling/tech-radar-edition-agent/.agents/skills/compose-edition/SKILL.md`

And the agent should be designed for GitHub Actions first, not as an HTTP webhook.
