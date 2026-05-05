import { describe, expect, it } from "vitest";
import type { Blip } from "~types/radar-types";
import { filterBlipsByAdr } from "./useBlipSearch";

const buildBlip = (overrides: Partial<Blip> = {}): Blip => ({
	id: "1",
	name: "Example",
	quadrant: "Tools",
	ring: "Adopt",
	description: "Example blip",
	hasAdr: false,
	tags: ["Cloud"],
	move: [],
	authors: ["Author"],
	...overrides,
});

describe("filterBlipsByAdr", () => {
	it("returns all blips for the default filter", () => {
		const blips = [
			buildBlip({ id: "1" }),
			buildBlip({ id: "2", hasAdr: true }),
		];

		expect(filterBlipsByAdr(blips, "all")).toHaveLength(2);
	});

	it("returns only ADR-backed blips when requested", () => {
		const blips = [
			buildBlip({ id: "1" }),
			buildBlip({ id: "2", hasAdr: true }),
		];

		expect(filterBlipsByAdr(blips, "has-adr").map(({ id }) => id)).toEqual([
			"2",
		]);
	});

	it("returns only non-ADR blips when requested", () => {
		const blips = [
			buildBlip({ id: "1" }),
			buildBlip({ id: "2", hasAdr: true }),
		];

		expect(filterBlipsByAdr(blips, "no-adr").map(({ id }) => id)).toEqual([
			"1",
		]);
	});
});
