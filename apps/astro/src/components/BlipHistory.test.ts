import { describe, expect, it } from "vitest";
import {
	countMovesByType,
	transformMoveHistoryToTimelineEvents,
} from "./BlipHistory";

describe("transformMoveHistoryToTimelineEvents", () => {
	it("sorts move events by actual date and maps labels", () => {
		const events = transformMoveHistoryToTimelineEvents([
			["stay", "2025-04-07"],
			["go", "2022-11-06"],
			["grow", "2024-04-01"],
		]);

		expect(events.map((event) => event.moveType)).toEqual([
			"go",
			"grow",
			"stay",
		]);
		expect(events.map((event) => event.moveLabel)).toEqual([
			"Moved Out",
			"Moved In",
			"Stayed",
		]);
		expect(events.map((event) => event.actualDate)).toEqual([
			"2022-11-06",
			"2024-04-01",
			"2025-04-07",
		]);
	});
});

describe("countMovesByType", () => {
	it("counts move event types for a single blip history", () => {
		const counts = countMovesByType(
			transformMoveHistoryToTimelineEvents([
				["stay", "2025-04-07"],
				["go", "2022-11-06"],
				["grow", "2024-04-01"],
				["go", "2025-03-02"],
			]),
		);

		expect(counts).toEqual({
			go: 2,
			grow: 1,
			stay: 1,
		});
	});
});
