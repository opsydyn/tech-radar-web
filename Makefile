.PHONY: help check run ci test test-watch biome commit cargo-build cargo-run sherif astro rust ratatui astro-upgrade code-owners api-blips api-blip api-quadrant api-headers api-save api-test-all api-help install-jq mastra-dev api-rels api-freshness-docs api-freshness-get api-freshness-post api-freshness-examples api-validate api-benchmark api-peek api-links

# Include modular makefiles
include .make/common.mk
include .make/development.mk
include .make/testing.mk
include .make/projects.mk
include .make/api.mk
