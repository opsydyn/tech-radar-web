import { describe, expect, it } from "vitest";
import type { Blip } from "~types/radar-types";
import {
	buildRadarEditionView,
	deriveEditionMovement,
	getEditionIdFromSnapshotPath,
} from "./editionSnapshots";

const buildBlip = (overrides: Partial<Blip> = {}): Blip => ({
	id: "33",
	name: "React",
	quadrant: "languages-frameworks",
	ring: "Adopt",
	description: "A JavaScript library for building user interfaces",
	hasAdr: false,
	tags: ["Frontend"],
	move: [],
	authors: ["Author"],
	...overrides,
});

describe("deriveEditionMovement", () => {
	it("marks a blip as new when it has no previous edition snapshot", () => {
		const movement = deriveEditionMovement({
			current: { blipId: "33", ring: "Trial", status: "active" },
			previous: undefined,
		});

		expect(movement).toBe("new");
	});

	it("marks a blip as moved-in when it moves closer to Adopt", () => {
		const movement = deriveEditionMovement({
			current: { blipId: "33", ring: "Adopt", status: "active" },
			previous: { blipId: "33", ring: "Trial", status: "active" },
		});

		expect(movement).toBe("moved-in");
	});

	it("marks a blip as moved-out when it moves away from Adopt", () => {
		const movement = deriveEditionMovement({
			current: { blipId: "33", ring: "Assess", status: "active" },
			previous: { blipId: "33", ring: "Trial", status: "active" },
		});

		expect(movement).toBe("moved-out");
	});

	it("marks a blip as unchanged when the ring is stable", () => {
		const movement = deriveEditionMovement({
			current: { blipId: "43", ring: "Adopt", status: "active" },
			previous: { blipId: "43", ring: "Adopt", status: "active" },
		});

		expect(movement).toBe("unchanged");
	});

	it("marks a blip as removed when it was active in the previous edition", () => {
		const movement = deriveEditionMovement({
			current: { blipId: "43", status: "removed" },
			previous: { blipId: "43", ring: "Adopt", status: "active" },
		});

		expect(movement).toBe("removed");
	});

	it("marks a blip as reintroduced when it returns after removal", () => {
		const movement = deriveEditionMovement({
			current: { blipId: "43", ring: "Assess", status: "active" },
			previous: { blipId: "43", status: "removed" },
		});

		expect(movement).toBe("reintroduced");
	});
});

describe("buildRadarEditionView", () => {
	it("enriches active edition snapshots with canonical blip data and derived movement", () => {
		const canonicalBlips = [
			buildBlip(),
			buildBlip({
				id: "43",
				name: "Webpack",
				quadrant: "Tools",
				ring: "Adopt",
			}),
		];

		const editionView = buildRadarEditionView({
			editionId: "2026-05",
			canonicalBlips,
			currentSnapshots: [
				{ blipId: "33", ring: "Adopt", status: "active" },
				{ blipId: "43", status: "removed" },
			],
			previousSnapshots: [
				{ blipId: "33", ring: "Trial", status: "active" },
				{ blipId: "43", ring: "Adopt", status: "active" },
			],
		});

		expect(editionView.blips).toHaveLength(1);
		expect(editionView.blips[0]).toMatchObject({
			id: "33",
			name: "React",
			ring: "Adopt",
			previousRing: "Trial",
			movement: "moved-in",
			editionId: "2026-05",
		});
	});

	it("builds active edition snapshots directly from snapshot content when canonical data is unavailable", () => {
		const editionView = buildRadarEditionView({
			editionId: "2026-05",
			canonicalBlips: [],
			currentSnapshots: [
				{
					blipId: "90",
					name: "PNPM",
					quadrant: "Tools",
					ring: "Adopt",
					description: "Fast, disk-efficient package manager.",
					hasAdr: false,
					tags: ["Frontend"],
					authors: ["Edition Team"],
					move: [],
					created: new Date("2026-05-01"),
					status: "active",
				},
			],
			previousSnapshots: [],
		});

		expect(editionView.blips).toHaveLength(1);
		expect(editionView.blips[0]).toMatchObject({
			id: "90",
			name: "PNPM",
			quadrant: "Tools",
			ring: "Adopt",
			description: "Fast, disk-efficient package manager.",
			movement: "new",
			editionId: "2026-05",
		});
	});
});

describe("getEditionIdFromSnapshotPath", () => {
	it("extracts the edition id from Astro content collection entry paths", () => {
		expect(getEditionIdFromSnapshotPath("2026-05/blips/react")).toBe("2026-05");
	});
});
