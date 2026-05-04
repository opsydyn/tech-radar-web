# Project-specific targets
astro-build: ## Run tasks for astro project (usage: make astro task=<taskname>)
	bun run moon:run -- astro:$(if $(task),$(task),build)


astro-dev: ## Run Astro development server
	bun run moon:run -- astro:dev

rust: ## Run tasks for rust project (usage: make rust task=<taskname>)
	bun run moon:run -- rust_adr_gen:$(if $(task),$(task),build)

ratatui: ## Run tasks for ratatui project (usage: make ratatui task=<taskname>)
	bun run moon:run -- ratatui_adr_gen:$(if $(task),$(task),build)

cargo-build: ## Build the Rust ADR generator
	bun run cargo:build

cargo-run: ## Run the Rust ADR generator
	bun run cargo:run

astro-upgrade: ## Upgrade Astro to the latest version
	cd apps/astro && bunx @astrojs/upgrade

mastra-dev: ## Run Mastra development server
	bun run moon:run -- astro:mastra
