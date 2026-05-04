# Colors for help message
BLUE := \033[36m
RESET := \033[0m

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  ${BLUE}%-15s${RESET} %s\n", $$1, $$2}' $(MAKEFILE_LIST)
