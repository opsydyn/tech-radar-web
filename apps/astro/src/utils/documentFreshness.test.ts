import { describe, expect, it } from "vitest";
import { calculateDocumentFreshness } from "./documentFreshness";

describe("calculateDocumentFreshness", () => {
	it("accepts content collection Date objects", () => {
		const freshness = calculateDocumentFreshness(new Date("2023-01-02"));

		expect(freshness.level).not.toBe("invalid");
		expect(freshness.message).not.toBe("Invalid date");
	});

	it("keeps stringified Date values valid for legacy call sites", () => {
		const dateString = new Date("2023-01-02").toString();
		const freshness = calculateDocumentFreshness(dateString);

		expect(freshness.level).not.toBe("invalid");
		expect(freshness.message).not.toBe("Invalid date");
	});

	it("returns invalid freshness for missing dates", () => {
		const freshness = calculateDocumentFreshness(undefined);

		expect(freshness.level).toBe("invalid");
		expect(freshness.message).toBe("Invalid date");
	});
});
