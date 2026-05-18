import { describe, expect, it } from "vitest";
import type { EditionBlipSnapshotData, EditionData } from "../content.config";
import type { Blip, RelatedBlip } from "../types/radar-types";
import { resolveRelatedBlipsContext } from "./relatedBlipsResolver";

const buildBlip = ({
	id,
	name,
	quadrant,
	ring,
	...overrides
}: Partial<Blip> & Pick<Blip, "id" | "name" | "quadrant" | "ring">): Blip => ({
	id,
	name,
	quadrant,
	ring,
	description: `${name} description`,
	hasAdr: false,
	tags: [],
	move: [],
	authors: ["Author"],
	...overrides,
});

const buildEdition = ({
	id,
	number,
	date,
	...overrides
}: Partial<EditionData> &
	Pick<EditionData, "id" | "number" | "date">): EditionData => ({
	id,
	number,
	title: `Edition ${id}`,
	content: `Content for ${id}`,
	date,
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

const buildRelationship = ({
	blipId,
	relationshipType,
	...overrides
}: Partial<RelatedBlip> &
	Pick<RelatedBlip, "blipId" | "relationshipType">): RelatedBlip => ({
	blipId,
	relationshipType,
	bidirectional: false,
	...overrides,
});

describe("resolveRelatedBlipsContext", () => {
	it("prefers the latest snapshot edition and includes incoming bidirectional relationships", () => {
		const canonicalBlips = [
			buildBlip({
				id: "33",
				name: "React",
				quadrant: "languages-frameworks",
				ring: "Adopt",
				relatedBlips: [
					buildRelationship({
						blipId: "44",
						relationshipType: "comparison",
					}),
				],
			}),
			buildBlip({
				id: "44",
				name: "Vue",
				quadrant: "languages-frameworks",
				ring: "Trial",
			}),
			buildBlip({
				id: "55",
				name: "TypeScript",
				quadrant: "languages-frameworks",
				ring: "Adopt",
			}),
			buildBlip({
				id: "71",
				name: "Next.js",
				quadrant: "languages-frameworks",
				ring: "Trial",
			}),
		];
		const editionEntries = [
			{
				id: "2025-09/index",
				data: buildEdition({
					id: "2025-09",
					number: 5,
					date: new Date("2025-09-01"),
				}),
			},
			{
				id: "2026-05/index",
				data: buildEdition({
					id: "2026-05",
					number: 6,
					date: new Date("2026-05-01"),
				}),
			},
		];
		const snapshotEntries = [
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "react",
				data: {
					blip: "33",
					ring: "Trial",
					status: "active",
					relatedBlips: [
						buildRelationship({
							blipId: "71",
							relationshipType: "complement",
							reason: "React pairs with the framework layer.",
						}),
					],
				},
			}),
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "vue",
				data: {
					blip: "44",
					ring: "Assess",
					status: "active",
					relatedBlips: [
						buildRelationship({
							blipId: "33",
							relationshipType: "alternative",
							bidirectional: true,
							reason: "Teams compare these UI stacks directly.",
						}),
					],
				},
			}),
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "typescript",
				data: { blip: "55", ring: "Adopt", status: "active" },
			}),
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "nextjs",
				data: { blip: "71", ring: "Adopt", status: "active" },
			}),
		];

		const result = resolveRelatedBlipsContext({
			currentBlipId: "33",
			canonicalBlips,
			editionEntries,
			snapshotEntries,
		});

		expect(result.type).toBe("snapshot");
		if (result.type !== "snapshot") {
			throw new Error("Expected snapshot related blips context");
		}
		expect(result.editionId).toBe("2026-05");
		expect(result.relatedBlips).toEqual([
			expect.objectContaining({
				blipId: "71",
				relationshipType: "complement",
				blipName: "Next.js",
				blipRing: "Adopt",
			}),
			expect.objectContaining({
				blipId: "44",
				relationshipType: "alternative",
				blipName: "Vue",
				blipRing: "Assess",
				bidirectional: true,
			}),
		]);
		expect(result.fallbackBlips.map((blip) => blip.id)).toEqual([
			"44",
			"55",
			"71",
		]);
	});

	it("keeps an empty relationship list when the latest snapshot defines none", () => {
		const canonicalBlips = [
			buildBlip({
				id: "33",
				name: "React",
				quadrant: "languages-frameworks",
				ring: "Adopt",
				relatedBlips: [
					buildRelationship({
						blipId: "44",
						relationshipType: "comparison",
					}),
				],
			}),
			buildBlip({
				id: "44",
				name: "Vue",
				quadrant: "languages-frameworks",
				ring: "Trial",
			}),
		];
		const editionEntries = [
			{
				id: "2026-05/index",
				data: buildEdition({
					id: "2026-05",
					number: 6,
					date: new Date("2026-05-01"),
				}),
			},
		];
		const snapshotEntries = [
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "react",
				data: { blip: "33", ring: "Trial", status: "active" },
			}),
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "vue",
				data: { blip: "44", ring: "Assess", status: "active" },
			}),
		];

		const result = resolveRelatedBlipsContext({
			currentBlipId: "33",
			canonicalBlips,
			editionEntries,
			snapshotEntries,
		});

		expect(result.type).toBe("snapshot");
		expect(result.relatedBlips).toEqual([]);
		expect(result.fallbackBlips.map((blip) => blip.id)).toEqual(["44"]);
	});

	it("uses the requested edition when an edition id is supplied", () => {
		const canonicalBlips = [
			buildBlip({
				id: "33",
				name: "React",
				quadrant: "languages-frameworks",
				ring: "Adopt",
			}),
			buildBlip({
				id: "44",
				name: "Vue",
				quadrant: "languages-frameworks",
				ring: "Trial",
			}),
			buildBlip({
				id: "71",
				name: "Next.js",
				quadrant: "languages-frameworks",
				ring: "Trial",
			}),
		];
		const editionEntries = [
			{
				id: "2025-09/index",
				data: buildEdition({
					id: "2025-09",
					number: 5,
					date: new Date("2025-09-01"),
				}),
			},
			{
				id: "2026-05/index",
				data: buildEdition({
					id: "2026-05",
					number: 6,
					date: new Date("2026-05-01"),
				}),
			},
		];
		const snapshotEntries = [
			buildSnapshotEntry({
				editionId: "2025-09",
				slug: "react",
				data: {
					blip: "33",
					ring: "Assess",
					status: "active",
					relatedBlips: [
						buildRelationship({
							blipId: "44",
							relationshipType: "comparison",
							reason: "React and Vue were still directly compared here.",
						}),
					],
				},
			}),
			buildSnapshotEntry({
				editionId: "2025-09",
				slug: "vue",
				data: { blip: "44", ring: "Trial", status: "active" },
			}),
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "react",
				data: {
					blip: "33",
					ring: "Trial",
					status: "active",
					relatedBlips: [
						buildRelationship({
							blipId: "71",
							relationshipType: "complement",
							reason: "React pairs with Next.js in the newer snapshot.",
						}),
					],
				},
			}),
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "nextjs",
				data: { blip: "71", ring: "Adopt", status: "active" },
			}),
		];

		const result = resolveRelatedBlipsContext(
			{
				currentBlipId: "33",
				canonicalBlips,
				editionEntries,
				snapshotEntries,
			},
			{ editionId: "2025-09" },
		);

		expect(result.type).toBe("snapshot");
		if (result.type !== "snapshot") {
			throw new Error("Expected requested-edition snapshot context");
		}
		expect(result.editionId).toBe("2025-09");
		expect(result.relatedBlips).toEqual([
			expect.objectContaining({
				blipId: "44",
				relationshipType: "comparison",
				blipName: "Vue",
			}),
		]);
		expect(result.fallbackBlips.map((blip) => blip.id)).toEqual(["44"]);
	});

	it("falls back to canonical relationships when the current blip is absent from the latest snapshot edition", () => {
		const canonicalBlips = [
			buildBlip({
				id: "33",
				name: "React",
				quadrant: "languages-frameworks",
				ring: "Adopt",
				relatedBlips: [
					buildRelationship({
						blipId: "44",
						relationshipType: "comparison",
						reason: "Canonical fallback relationship.",
					}),
				],
			}),
			buildBlip({
				id: "44",
				name: "Vue",
				quadrant: "languages-frameworks",
				ring: "Trial",
			}),
		];
		const editionEntries = [
			{
				id: "2026-05/index",
				data: buildEdition({
					id: "2026-05",
					number: 6,
					date: new Date("2026-05-01"),
				}),
			},
		];
		const snapshotEntries = [
			buildSnapshotEntry({
				editionId: "2026-05",
				slug: "vue",
				data: { blip: "44", ring: "Assess", status: "active" },
			}),
		];

		const result = resolveRelatedBlipsContext({
			currentBlipId: "33",
			canonicalBlips,
			editionEntries,
			snapshotEntries,
		});

		expect(result.type).toBe("canonical");
		expect(result.relatedBlips).toEqual([
			expect.objectContaining({
				blipId: "44",
				relationshipType: "comparison",
				blipName: "Vue",
				blipRing: "Trial",
			}),
		]);
	});
});
