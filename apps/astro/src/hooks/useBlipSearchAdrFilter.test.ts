import { describe, expect, it } from "vitest";
import type { Blip } from "~types/radar-types";
import {
	filterBlipsByAdr,
	filterBlipsByTag,
	getAvailableRadarTags,
} from "./useBlipSearch";

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

describe("getAvailableRadarTags", () => {
	it("returns unique alphabetized tags from the visible blips", () => {
		const blips = [
			buildBlip({ id: "1", tags: ["be", "fe"] }),
			buildBlip({ id: "2", tags: ["FE", "ops"] }),
			buildBlip({ id: "3", tags: ["  ", "platform"] }),
		];

		expect(getAvailableRadarTags(blips)).toEqual([
			"be",
			"fe",
			"ops",
			"platform",
		]);
	});
});

describe("filterBlipsByTag", () => {
	it("returns all blips for the default tag filter", () => {
		const blips = [
			buildBlip({ id: "1", tags: ["fe"] }),
			buildBlip({ id: "2", tags: ["be"] }),
		];

		expect(filterBlipsByTag(blips, "__all__")).toHaveLength(2);
	});

	it("returns only blips that contain the requested tag", () => {
		const blips = [
			buildBlip({ id: "1", tags: ["fe"] }),
			buildBlip({ id: "2", tags: ["be", "ops"] }),
			buildBlip({ id: "3", tags: ["ops"] }),
		];

		expect(filterBlipsByTag(blips, "ops").map(({ id }) => id)).toEqual([
			"2",
			"3",
		]);
	});

	it("matches tags without case sensitivity", () => {
		const blips = [
			buildBlip({ id: "1", tags: ["FE"] }),
			buildBlip({ id: "2", tags: ["be"] }),
		];

		expect(filterBlipsByTag(blips, "fe").map(({ id }) => id)).toEqual(["1"]);
	});
});
