import { describe, expect, it } from "vitest";
import { getBlipPath } from "./blipRouting";

describe("getBlipPath", () => {
	it("builds the canonical blip path when no edition is supplied", () => {
		expect(
			getBlipPath({
				id: "33",
				name: "React.js",
			}),
		).toBe("/blip/react-js");
	});

	it("builds an edition-specific blip path when an edition id is supplied", () => {
		expect(
			getBlipPath(
				{
					id: "33",
					name: "React.js",
				},
				{ editionId: "2026-05" },
			),
		).toBe("/edition/2026-05/blip/react-js");
	});
});
