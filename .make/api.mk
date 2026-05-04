# API Testing Makefile
# ==================
# This file contains commands for testing the API endpoints with curl

# Base URL for local development
API_HOST ?= http://localhost:4321

# Output formatting options
FORMAT ?= cat # Alternative: python -m json.tool or jq

# Default values for parameters
ID ?= 48
QUADRANT ?= tools
ENDPOINT ?= blips
FILE ?= api-response.json
LIMIT ?= 30
IDENTIFIER ?= react
DOC_TYPE ?= auto

# Core API endpoints
api-blips: ## Get all blips from the API
	@echo "Fetching all blips..."
	@curl -s -X GET $(API_HOST)/api/blips.api | $(FORMAT)

api-blip: ## Get a specific blip by ID (usage: make api-blip ID=48)
	@echo "Fetching blip with ID $(ID)..."
	@curl -s -X GET $(API_HOST)/api/blip/$(ID).api | $(FORMAT)

api-quadrant: ## Get blips for a specific quadrant (usage: make api-quadrant QUADRANT=tools)
	@echo "Fetching quadrant: $(QUADRANT)..."
	@curl -s -X GET $(API_HOST)/api/quadrant/$(QUADRANT).api | $(FORMAT)

api-rels: ## Get API relationship documentation
	@echo "Fetching API relationships documentation..."
	@curl -s -X GET $(API_HOST)/api/rels.api | $(FORMAT)

# Document Freshness Testing API
api-freshness-docs: ## Get freshness test API documentation
	@echo "Fetching freshness test API documentation..."
	@curl -s -X GET $(API_HOST)/api/notifications/freshness-test.api | $(FORMAT)

api-freshness-get: ## Test document freshness via GET (usage: make api-freshness-get IDENTIFIER=react DOC_TYPE=auto)
	@echo "Testing document freshness for '$(IDENTIFIER)' with type '$(DOC_TYPE)'..."
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?identifier=$(IDENTIFIER)&type=$(DOC_TYPE)" | $(FORMAT)

api-freshness-post: ## Test document freshness via POST (usage: make api-freshness-post IDENTIFIER=react DOC_TYPE=auto)
	@echo "Testing document freshness via POST for '$(IDENTIFIER)' with type '$(DOC_TYPE)'..."
	@curl -s -X POST $(API_HOST)/api/notifications/freshness-test.api \
		-H "Content-Type: application/json" \
		-d '{"identifier": "$(IDENTIFIER)", "type": "$(DOC_TYPE)"}' | $(FORMAT)

api-freshness-examples: ## Run multiple freshness test examples
	@echo "Running freshness test examples..."
	@echo "\n=== Testing React.js (blip) ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?identifier=React.js&type=blip" | head -20
	@echo "\n\n=== Testing astro (adr) ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?identifier=astro&type=adr" | head -20
	@echo "\n\n=== Testing auto search for 'docker' ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?identifier=docker" | head -20
	@echo "\n\n=== Testing validation error ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?identifier=test&type=invalid" | head -20
	@echo "\n\n=== Testing not found ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?identifier=nonexistent" | head -20

# Enhanced Freshness API (Bulk & Stats)
api-freshness-bulk: ## Test bulk document freshness queries (usage: make api-freshness-bulk DOC_TYPE=blip LIMIT=5)
	@echo "Testing bulk document freshness for '$(DOC_TYPE)' with limit $(LIMIT)..."
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=$(DOC_TYPE)&limit=$(LIMIT)" | $(FORMAT)

api-freshness-bulk-critical: ## Get critical freshness documents only (usage: make api-freshness-bulk-critical DOC_TYPE=all LIMIT=10)
	@echo "Testing bulk critical documents for '$(DOC_TYPE)' with limit $(LIMIT)..."
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=$(DOC_TYPE)&level=critical&limit=$(LIMIT)" | $(FORMAT)

api-freshness-bulk-sorted: ## Get bulk documents sorted by freshness (usage: make api-freshness-bulk-sorted DOC_TYPE=all LIMIT=5)
	@echo "Testing bulk documents sorted by freshness (oldest first) for '$(DOC_TYPE)' with limit $(LIMIT)..."
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=$(DOC_TYPE)&sortBy=freshness&sortOrder=desc&limit=$(LIMIT)" | $(FORMAT)

api-freshness-stats: ## Get freshness statistics (usage: make api-freshness-stats DOC_TYPE=all)
	@echo "Getting freshness statistics for '$(DOC_TYPE)'..."
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=stats&type=$(DOC_TYPE)" | $(FORMAT)

api-freshness-all-modes: ## Test all freshness API modes with examples
	@echo "Testing all freshness API modes..."
	@echo "\n=== SINGLE MODE: React.js ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?identifier=React.js&type=blip" | head -15
	@echo "\n\n=== BULK MODE: 3 Blips ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=blip&limit=3" | head -20
	@echo "\n\n=== BULK MODE: Critical Only ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=all&level=critical&limit=3" | head -20
	@echo "\n\n=== STATS MODE: All Documents ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=stats&type=all" | head -25
	@echo "\n\n=== Done ==="

api-freshness-all-critical-blips: ## Get ALL critical blips using pagination (retrieves all 131+ blips)
	@echo "Getting ALL critical blips using pagination..."
	@echo "\n=== BATCH 1: First 100 critical blips ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=blip&level=critical&limit=100&offset=0" | head -15
	@echo "\n=== BATCH 2: Remaining critical blips (offset=100) ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=blip&level=critical&limit=100&offset=100" | head -15
	@echo "\n=== SUMMARY ==="
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=blip&level=critical&limit=100&offset=0" | grep -E '"total":|"hasMore":'
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?mode=bulk&type=blip&level=critical&limit=100&offset=100" | grep -E '"total":|"hasMore":'
	@echo "All critical blips retrieved successfully!"

# Utility commands
api-headers: ## Show response headers for API request (usage: make api-headers ENDPOINT=blips)
	@echo "Fetching headers for $(ENDPOINT)..."
	@curl -s -i -X GET $(API_HOST)/api/$(ENDPOINT).api | head -20

api-save: ## Save API response to file (usage: make api-save ENDPOINT=blips FILE=blips.json)
	@echo "Saving $(ENDPOINT) to $(FILE)..."
	@curl -s -X GET $(API_HOST)/api/$(ENDPOINT).api -o $(FILE)
	@echo "Saved to $(FILE)"

api-peek: ## View first N lines of API response (usage: make api-peek ENDPOINT=blips LIMIT=30)
	@echo "Peeking at $(ENDPOINT) (first $(LIMIT) lines)..."
	@curl -s -X GET $(API_HOST)/api/$(ENDPOINT).api | head -$(LIMIT)

api-links: ## Extract and display _links from API response (requires grep and sed)
	@echo "Extracting links from $(ENDPOINT)..."
	@curl -s -X GET $(API_HOST)/api/$(ENDPOINT).api | grep -o '"_links":{[^}]*}' | sed 's/","/",\n  "/g'

# Comprehensive testing suites
api-test-all: ## Run tests for all API endpoints
	@echo "Testing all API endpoints..."
	@echo "\n=== Core APIs ==="
	@echo "Blips API (sample):"
	@curl -s -X GET $(API_HOST)/api/blips.api | head -15
	@echo "\n\nAPI Relationships:"
	@curl -s -X GET $(API_HOST)/api/rels.api | head -15
	@echo "\n=== Freshness Testing API ==="
	@echo "Documentation:"
	@curl -s -X GET $(API_HOST)/api/notifications/freshness-test.api | head -20
	@echo "\n\nSample freshness test:"
	@curl -s -X GET "$(API_HOST)/api/notifications/freshness-test.api?identifier=react" | head -15
	@echo "\n\n=== Done ==="

api-validate: ## Validate that all API endpoints are responding
	@echo "Validating API endpoints..."
	@echo "Checking core APIs..."
	@curl -s -o /dev/null -w "  Blips API: %{http_code}\n" $(API_HOST)/api/blips.api
	@curl -s -o /dev/null -w "  Blip API: %{http_code}\n" $(API_HOST)/api/blip/$(ID).api || echo "  Blip API: Not implemented"
	@curl -s -o /dev/null -w "  Quadrant API: %{http_code}\n" $(API_HOST)/api/quadrant/$(QUADRANT).api || echo "  Quadrant API: Not implemented"
	@curl -s -o /dev/null -w "  Rels API: %{http_code}\n" $(API_HOST)/api/rels.api
	@echo "Checking freshness testing API..."
	@curl -s -o /dev/null -w "  Freshness Docs: %{http_code}\n" $(API_HOST)/api/notifications/freshness-test.api
	@curl -s -o /dev/null -w "  Freshness GET: %{http_code}\n" "$(API_HOST)/api/notifications/freshness-test.api?identifier=react"
	@echo "All endpoints validated!"

api-benchmark: ## Simple benchmark of API response times
	@echo "Benchmarking API response times..."
	@echo "Core APIs:"
	@curl -s -o /dev/null -w "  Blips API: %{time_total}s\n" $(API_HOST)/api/blips.api
	@curl -s -o /dev/null -w "  Rels API: %{time_total}s\n" $(API_HOST)/api/rels.api
	@echo "Freshness API:"
	@curl -s -o /dev/null -w "  Freshness Docs: %{time_total}s\n" $(API_HOST)/api/notifications/freshness-test.api
	@curl -s -o /dev/null -w "  Freshness Test: %{time_total}s\n" "$(API_HOST)/api/notifications/freshness-test.api?identifier=react"

# Install jq for better JSON formatting
install-jq: ## Install jq JSON processor for better output formatting
	@echo "Installing jq..."
	@if [ "$(shell uname)" = "Darwin" ]; then \
		brew install jq; \
	elif [ -f /etc/debian_version ]; then \
		sudo apt-get update && sudo apt-get install -y jq; \
	elif [ -f /etc/redhat-release ]; then \
		sudo yum install -y jq; \
	else \
		echo "Please install jq manually: https://stedolan.github.io/jq/download/"; \
	fi
	@echo "jq installed successfully. You can now use FORMAT=jq with API commands."

# Help command
api-help: ## Show all API testing commands with examples
	@echo "API Testing Commands"
	@echo "===================="
	@echo ""
	@echo "Core API Endpoints:"
	@grep -E '^api-(blips|blip|quadrant|rels):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Document Freshness Testing:"
	@grep -E '^api-freshness.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Utilities & Testing:"
	@grep -E '^api-(headers|save|peek|links|test-all|validate|benchmark):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Setup:"
	@grep -E '^(install-jq|api-help):.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Common Usage Examples:"
	@echo "  make api-freshness-get IDENTIFIER=React.js DOC_TYPE=blip"
	@echo "  make api-freshness-post IDENTIFIER=docker DOC_TYPE=auto"
	@echo "  make api-freshness-bulk DOC_TYPE=blip LIMIT=5"
	@echo "  make api-freshness-bulk-critical DOC_TYPE=all LIMIT=10"
	@echo "  make api-freshness-stats DOC_TYPE=all"
	@echo "  make api-freshness-all-modes"
	@echo "  make api-freshness-all-critical-blips  # Get ALL 131+ critical blips"
	@echo "  make api-blip ID=37"
	@echo "  make api-quadrant QUADRANT=platforms"
	@echo "  make api-save ENDPOINT=blips FILE=all-blips.json FORMAT=jq"
