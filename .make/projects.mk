# Project-specific targets
astro-build: ## Run tasks for astro project (usage: make astro task=<taskname>)
	bun run moon:run -- astro:$(if $(task),$(task),build)

astro-dev: ## Run Astro development server
	bun run moon:run -- astro:dev

astro-upgrade: ## Upgrade Astro to the latest version
	cd apps/astro && bunx @astrojs/upgrade
