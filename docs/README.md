# Documentation

This directory is the root landing area for repository documentation that is broader than a single package or feature file.

It is organized with [Diátaxis](https://diataxis.fr/) in mind: documentation is easier to use when it is clear whether a page is helping you learn, complete a task, look up facts, or understand design choices.

## Current documentation sets

### Flue edition agent

The Flue docs describe the edition-generation tooling in `tooling/tech-radar-edition-agent`.

- [Flue documentation landing page](./flue/README.md)
- [Tutorial: Run your first local edition draft](./flue/tutorial-run-your-first-local-edition-draft.md)
- [How to run the edition agent](./flue/how-to-run-the-edition-agent.md)
- [Flue reference](./flue/reference.md)
- [Why the repo uses Flue this way](./flue/explanation.md)

## Structure

```text
docs/
├── README.md              # Documentation landing page
└── flue/
    ├── README.md          # Flue docs landing page
    ├── tutorial-run-your-first-local-edition-draft.md
    ├── how-to-run-the-edition-agent.md
    ├── reference.md
    └── explanation.md
```

## How to use this directory

- Start here if you want a documentation overview.
- Go to a package-level doc landing page when you know the area you are working in.
- Prefer tutorial/how-to/reference/explanation splits over mixing all content into a single page.

## Notes

Right now, the only Diátaxis-style doc set at the root is for the Flue edition agent. As more tooling or repository-level workflows need durable docs, they should be added here with the same structure.
