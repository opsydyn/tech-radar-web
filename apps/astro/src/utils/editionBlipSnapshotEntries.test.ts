import { describe, expect, it } from "vitest";
import type { EditionBlipSnapshotData } from "../content.config";
import {
	findEditionBlipSnapshotEntryByBlipIdTyped,
	findEditionBlipSnapshotEntryByRouteParamTyped,
	hasSelfContainedEditionBlipSnapshotData,
	matchesBlipRouteParam,
} from "./editionBlipSnapshotEntries";

const buildSnapshotData = (
	overrides: Partial<EditionBlipSnapshotData> = {},
): EditionBlipSnapshotData => ({
	blip: "33",
	name: "React",
	quadrant: "languages-frameworks",
	ring: "Adopt",
	description: "A JavaScript library for building user interfaces",
	hasAdr: false,
	tags: ["Frontend"],
	authors: ["Author"],
	move: [],
	status: "active",
	...overrides,
});

const buildSnapshotEntry = ({
	editionId,
	slug,
	data,
}: {
	readonly editionId: string;
	readonly slug: string;
	readonly data: EditionBlipSnapshotData;
}) => ({
	id: `${editionId}/blips/${slug}`,
	data,
});

describe("matchesBlipRouteParam", () => {
	it("matches either the canonical id or the slugified name", () => {
		expect(matchesBlipRouteParam("33", { id: "33", name: "React" })).toBe(true);
		expect(matchesBlipRouteParam("react", { id: "33", name: "React" })).toBe(
			true,
		);
	});
});

describe("hasSelfContainedEditionBlipSnapshotData", () => {
	it("returns true for a backfilled snapshot", () => {
		expect(hasSelfContainedEditionBlipSnapshotData(buildSnapshotData())).toBe(
			true,
		);
	});

	it("returns false when required snapshot-backed detail fields are missing", () => {
		expect(
			hasSelfContainedEditionBlipSnapshotData(
				buildSnapshotData({ name: undefined }),
			),
		).toBe(false);
	});

	it("requires adr metadata when hasAdr is true", () => {
		expect(
			hasSelfContainedEditionBlipSnapshotData(
				buildSnapshotData({ hasAdr: true, adr: undefined }),
			),
		).toBe(false);
	});
});

describe("edition blip snapshot entry lookup", () => {
	const entries = [
		buildSnapshotEntry({
			editionId: "2025-09",
			slug: "react",
			data: buildSnapshotData({ ring: "Trial" }),
		}),
		buildSnapshotEntry({
			editionId: "2026-05",
			slug: "react",
			data: buildSnapshotData({ ring: "Adopt" }),
		}),
	];

	it("finds a snapshot entry by route param within an edition scope", () => {
		expect(
			findEditionBlipSnapshotEntryByRouteParamTyped(entries, "react", {
				editionId: "2026-05",
			})?.id,
		).toBe("2026-05/blips/react");
	});

	it("finds a snapshot entry by blip id within an edition scope", () => {
		expect(
			findEditionBlipSnapshotEntryByBlipIdTyped(entries, "33", {
				editionId: "2025-09",
			})?.id,
		).toBe("2025-09/blips/react");
	});
});
