import { describe, expect, it } from "vitest";
import type { Blip } from "~types/radar-types";
import type { EditionBlipSnapshotData, EditionData } from "../content.config";
import { buildRadarEditionViewsFromCollections } from "./editionSnapshotAdapter";

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

const buildEdition = (
	overrides: Partial<EditionData> & Pick<EditionData, "id" | "number">,
): EditionData => ({
	title: `Tech Radar Edition ${overrides.number}`,
	content: "Edition snapshot",
	date: new Date(`202${overrides.number}-01-01`),
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

describe("buildRadarEditionViewsFromCollections", () => {
	it("builds newest-first edition views with derived movement from adjacent snapshots", () => {
		const canonicalBlips = [
			buildBlip(),
			buildBlip({
				id: "43",
				name: "Webpack",
				quadrant: "Tools",
				ring: "Adopt",
			}),
		];
		const editionEntries = [
			{ id: "2025-09/index", data: buildEdition({ id: "2025-09", number: 5 }) },
			{ id: "2026-05/index", data: buildEdition({ id: "2026-05", number: 6 }) },
		];
		const snapshotEntries = [
			buildSnapshotEntry({
				editionId: "2025-09",
				slug: "react",
				data: { blip: "33", ring: "Trial", status: "active" },
			}),
			buildSnapshotEntry({
				editionId: "2025-09",
				slug: "webpack",
				data: { blip: "43", ring: "Adopt", status: "active" },
			}),
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "react",
				data: { blip: "33", ring: "Adopt", status: "active" },
			}),
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "webpack",
				data: { blip: "43", status: "removed" },
			}),
		];

		const views = buildRadarEditionViewsFromCollections({
			canonicalBlips,
			editionEntries,
			snapshotEntries,
		});

		expect(views.map(({ edition }) => edition.id)).toEqual([
			"2026-05",
			"2025-09",
		]);
		expect(views[0]?.blips).toHaveLength(1);
		expect(views[0]?.blips[0]).toMatchObject({
			id: "33",
			name: "React",
			ring: "Adopt",
			previousRing: "Trial",
			movement: "moved-in",
			editionId: "2026-05",
		});
		expect(views[1]?.blips.map(({ movement }) => movement)).toEqual([
			"new",
			"new",
		]);
	});
});
