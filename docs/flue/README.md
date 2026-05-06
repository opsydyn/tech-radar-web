# Flue documentation

This documentation set covers the Flue-powered edition agent in `tooling/tech-radar-edition-agent`.

It follows the [Diátaxis](https://diataxis.fr/) model so each document has one clear job:

- **Tutorial**: learn the Flue workflow by completing one successful local run
- **How-to**: accomplish a specific Flue task quickly
- **Reference**: look up commands, paths, schemas, and package ownership
- **Explanation**: understand why this repo uses Flue this way

## What this Flue package does

The current Flue slice is a **tech radar edition generator**.

It is designed to:

- compose free-text edition narrative content
- keep edition metadata deterministic
- preserve explicit AI provenance in the result
- run locally and in CI with `--target node`

## Documentation map

### Learn

- [Tutorial: Run your first local edition draft](./tutorial-run-your-first-local-edition-draft.md)

### Solve a task

- [How to run the edition agent](./how-to-run-the-edition-agent.md)

### Look things up

- [Flue reference](./reference.md)

### Understand the design

- [Why the repo uses Flue this way](./explanation.md)

## Root-level structure

```text
.
├── README.md
├── docs/
│   └── flue/
│       ├── README.md
│       ├── tutorial-run-your-first-local-edition-draft.md
│       ├── how-to-run-the-edition-agent.md
│       ├── reference.md
│       └── explanation.md
└── tooling/
    └── tech-radar-edition-agent/
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
        └── package.json
```

## Where to start

- If you are new to the agent, start with the tutorial.
- If you already know the workflow and just need a command, use the how-to.
- If you need exact paths, scripts, or payload fields, use the reference.
- If you are deciding whether to change the architecture, read the explanation first.
