import { describe, expect, it } from "vitest";
import type { Blip } from "~types/radar-types";
import {
	getBlipSearchSuggestions,
	getHighlightedSnippet,
} from "./useBlipSearch";

const buildBlip = (
	overrides: Partial<Blip> & Pick<Blip, "id" | "name">,
): Blip => {
	const { id, name, ...restOverrides } = overrides;

	return {
		authors: ["test"],
		description: "Test description",
		hasAdr: false,
		id,
		move: [["stay", "2026-05-01"]],
		name,
		quadrant: "Tools",
		ring: "Adopt",
		tags: [],
		...restOverrides,
	};
};

const blips: readonly Blip[] = [
	buildBlip({
		id: "1",
		name: "Kubernetes",
		description: "Container orchestration platform",
		quadrant: "Platforms",
	}),
	buildBlip({
		id: "2",
		name: "TypeScript",
		description: "Typed JavaScript language",
		quadrant: "languages-frameworks",
	}),
	buildBlip({
		id: "3",
		name: "Backstage",
		description: "Developer portal for platform teams",
		quadrant: "Tools",
	}),
];

describe("getBlipSearchSuggestions", () => {
	it("returns fuzzy matches for misspelled names", () => {
		const suggestions = getBlipSearchSuggestions(blips, "kubernets");

		expect(suggestions[0]?.item.name).toBe("Kubernetes");
	});

	it("matches across searchable fields like description", () => {
		const suggestions = getBlipSearchSuggestions(blips, "portal");

		expect(suggestions.map(({ item }) => item.name)).toContain("Backstage");
	});

	it("returns no suggestions for blank terms", () => {
		expect(getBlipSearchSuggestions(blips, "   ")).toEqual([]);
	});

	it("limits the number of suggestions", () => {
		const suggestions = getBlipSearchSuggestions(blips, "t", 2);

		expect(suggestions).toHaveLength(2);
	});

	it("returns highlight ranges for matched suggestion text", () => {
		const suggestions = getBlipSearchSuggestions(blips, "plat");

		expect(suggestions[0]?.item.name).toBe("Kubernetes");
		expect(suggestions[0]?.highlights.quadrant).not.toEqual([]);
	});

	it("returns description highlight ranges when the match comes from description", () => {
		const suggestions = getBlipSearchSuggestions(blips, "portal");
		const backstageSuggestion = suggestions.find(
			({ item }) => item.name === "Backstage",
		);

		expect(backstageSuggestion?.highlights.description).not.toEqual([]);
	});

	it("creates an ellipsis-aware highlighted snippet for description matches", () => {
		const snippet = getHighlightedSnippet(
			"Developer portal for platform teams",
			[[10, 15]],
			8,
		);

		expect(snippet?.text).toContain("portal");
		expect(snippet?.highlightRanges).not.toEqual([]);
	});
});
