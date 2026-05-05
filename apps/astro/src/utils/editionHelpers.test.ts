import { describe, expect, it } from "vitest";
import {
	createEdition,
	findEditionByIdentity,
	formatEditionLabel,
	getEditionIdentity,
} from "./editionHelpers";

describe("edition helpers", () => {
	it("preserves folder-backed edition identity when provided", () => {
		const result = createEdition(
			6,
			"Tech Radar Edition 6 - May 2026",
			new Date("2026-05-05"),
			"2026-05",
		);

		expect(result.isOk).toBe(true);
		if (!result.isOk) return;

		expect(getEditionIdentity(result.value)).toBe("2026-05");
	});

	it("falls back to edition number identity for legacy editions", () => {
		const result = createEdition(1, "June 2025", new Date("2025-06-01"));

		expect(result.isOk).toBe(true);
		if (!result.isOk) return;

		expect(getEditionIdentity(result.value)).toBe("1");
	});

	it("finds editions by stable identity instead of display number only", () => {
		const mayResult = createEdition(
			6,
			"Tech Radar Edition 6 - May 2026",
			new Date("2026-05-05"),
			"2026-05",
		);
		const septemberResult = createEdition(
			5,
			"Tech Radar Edition 5 - September 2025",
			new Date("2025-09-01"),
			"2025-09",
		);

		expect(mayResult.isOk).toBe(true);
		expect(septemberResult.isOk).toBe(true);
		if (!mayResult.isOk || !septemberResult.isOk) return;

		expect(
			findEditionByIdentity([mayResult.value, septemberResult.value], "2025-09")
				?.title,
		).toBe("Tech Radar Edition 5 - September 2025");
	});

	it("does not duplicate the edition number when the title already includes it", () => {
		const result = createEdition(
			6,
			"Tech Radar Edition 6 - May 2026",
			new Date("2026-05-05"),
			"2026-05",
		);

		expect(result.isOk).toBe(true);
		if (!result.isOk) return;

		expect(formatEditionLabel(result.value)).toBe(
			"Tech Radar Edition 6 - May 2026",
		);
	});
});
