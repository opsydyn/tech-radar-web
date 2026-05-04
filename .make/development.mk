check: ## Run Moon checks across all projects
	bun run moon:check

run: ## Run Moon tasks (usage: make run task=<taskname> project=<project>)
	bun run moon:run -- $(if $(project),$(project):)$(if $(task),$(task))

biome: ## Format code with Biome
	bunx @biomejs/biome format . --write

commit: ## Create a commit using Commitizen
	bun run commit

sherif: ## Run sherif
	bun run sherif

code-owners: ## Sync CODEOWNERS file based on Moon configuration
	bun run moon -- sync codeowners

