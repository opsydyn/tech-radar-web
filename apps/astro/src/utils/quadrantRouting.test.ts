import { describe, expect, it } from "vitest";
import { getQuadrantPath, toQuadrantRouteKey } from "./quadrantRouting";

describe("quadrantRouting", () => {
	it("normalizes canonical quadrant names into route keys", () => {
		expect(toQuadrantRouteKey("Tools")).toBe("tools");
		expect(toQuadrantRouteKey("languages-frameworks")).toBe(
			"languages-frameworks",
		);
	});

	it("builds canonical quadrant paths by default", () => {
		expect(getQuadrantPath("Platforms")).toBe("/quadrants/platforms");
	});

	it("builds edition-specific quadrant paths when an edition id is supplied", () => {
		expect(getQuadrantPath("Techniques", { editionId: "2026-05" })).toBe(
			"/edition/2026-05/quadrants/techniques",
		);
	});
});
