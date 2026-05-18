import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";
import {
	applyRelationshipProposals,
	assertEditionSnapshotExists,
	buildCandidateBlipsContext,
	buildExistingRelationshipGraphContext,
	buildRelationshipReviewMarkdown,
	compareBlipIds,
	isBidirectionalOwner,
	normalizeRelationshipProposalIds,
	type CanonicalBlip,
	type RelationshipDraftContext,
	type RelationshipProposal,
	type SnapshotFile,
} from "./relationshipDraft";

const buildCanonicalBlip = (
	overrides: Partial<CanonicalBlip> & Pick<CanonicalBlip, "id" | "name">,
): CanonicalBlip => ({
	quadrant: "Platforms",
	ring: "Adopt",
	tags: [],
	hasAdr: false,
	...overrides,
});

const buildSnapshotFile = ({
	relativePath,
	frontmatter,
	body = "",
}: {
	readonly relativePath: string;
	readonly frontmatter: SnapshotFile["frontmatter"];
	readonly body?: string;
}): SnapshotFile => ({
	filePath: `/repo/${relativePath}`,
	relativePath,
	slug:
		relativePath
			.split("/")
			.at(-1)
			?.replace(/\.mdx?$/, "") ?? "snapshot",
	frontmatter,
	body,
});

const buildProposal = (
	overrides: Partial<RelationshipProposal> &
		Pick<
			RelationshipProposal,
			"sourceBlipId" | "targetBlipId" | "relationshipType" | "reason"
		>,
): RelationshipProposal => ({
	bidirectional: false,
	confidence: "high",
	evidence: ["Grounded in the supplied edition context."],
	...overrides,
});

const buildContext = (): RelationshipDraftContext => {
	const snapshotFiles = [
		buildSnapshotFile({
			relativePath: "apps/astro/src/content/editions/2026-05/blips/azure.mdx",
			frontmatter: {
				blip: "54",
				ring: "Assess",
				status: "active",
				notes: "Platform fixture",
				relatedBlips: [
					{
						blipId: "63",
						relationshipType: "complement",
						reason: "Existing relationship",
						bidirectional: true,
					},
				],
			},
		}),
		buildSnapshotFile({
			relativePath:
				"apps/astro/src/content/editions/2026-05/blips/azure-storage.mdx",
			frontmatter: {
				blip: "63",
				ring: "Trial",
				status: "active",
			},
		}),
		buildSnapshotFile({
			relativePath:
				"apps/astro/src/content/editions/2026-05/blips/google-cloud-platform.mdx",
			frontmatter: {
				blip: "79",
				ring: "Adopt",
				status: "active",
			},
		}),
		buildSnapshotFile({
			relativePath: "apps/astro/src/content/editions/2026-05/blips/webpack.mdx",
			frontmatter: {
				blip: "43",
				status: "removed",
			},
		}),
	] as const;
	const canonicalBlips = new Map<string, CanonicalBlip>([
		[
			"54",
			buildCanonicalBlip({
				id: "54",
				name: "Azure",
				quadrant: "Platforms",
				ring: "Assess",
				tags: ["Cloud"],
			}),
		],
		[
			"63",
			buildCanonicalBlip({
				id: "63",
				name: "Azure Storage",
				quadrant: "Platforms",
				ring: "Trial",
				tags: ["Cloud"],
			}),
		],
		[
			"79",
			buildCanonicalBlip({
				id: "79",
				name: "Google Cloud Platform",
				quadrant: "Platforms",
				ring: "Adopt",
				tags: ["Cloud"],
			}),
		],
		[
			"43",
			buildCanonicalBlip({
				id: "43",
				name: "Webpack",
				quadrant: "Tools",
				ring: "Adopt",
			}),
		],
	]);

	return {
		repoRoot: "/repo",
		editionId: "2026-05",
		editionTitle: "Tech Radar Edition 6 - May 2026",
		editionDate: "2026-05-05",
		editionDirectory: "/repo/apps/astro/src/content/editions/2026-05",
		snapshotDirectory: "/repo/apps/astro/src/content/editions/2026-05/blips",
		snapshotFiles,
		activeSnapshotFiles: snapshotFiles.filter(
			(snapshotFile) => snapshotFile.frontmatter.status === "active",
		),
		candidateBlips: [
			{
				blipId: "54",
				name: "Azure",
				quadrant: "Platforms",
				ring: "Assess",
				tags: ["Cloud"],
				notes: "Platform fixture",
				existingRelationships: [
					{
						blipId: "63",
						relationshipType: "complement",
						reason: "Existing relationship",
						bidirectional: true,
					},
				],
			},
			{
				blipId: "63",
				name: "Azure Storage",
				quadrant: "Platforms",
				ring: "Trial",
				tags: ["Cloud"],
				existingRelationships: [],
			},
			{
				blipId: "79",
				name: "Google Cloud Platform",
				quadrant: "Platforms",
				ring: "Adopt",
				tags: ["Cloud"],
				existingRelationships: [],
			},
		],
		canonicalBlipsById: canonicalBlips,
	};
};

describe("applyRelationshipProposals", () => {
	it("keeps existing relationships, adds valid proposals, and skips invalid ones deterministically", () => {
		const context = buildContext();
		const appliedDraft = applyRelationshipProposals(
			context,
			[
				buildProposal({
					sourceBlipId: "54",
					targetBlipId: "79",
					relationshipType: "alternative",
					reason:
						"Google Cloud Platform is the closest platform alternative in this edition.",
					bidirectional: true,
				}),
				buildProposal({
					sourceBlipId: "79",
					targetBlipId: "54",
					relationshipType: "alternative",
					reason: "Inverse duplicate that should be skipped by owner rules.",
					bidirectional: true,
				}),
				buildProposal({
					sourceBlipId: "54",
					targetBlipId: "63",
					relationshipType: "complement",
					reason: "Duplicate of the existing complement relationship.",
					bidirectional: true,
				}),
				buildProposal({
					sourceBlipId: "54",
					targetBlipId: "54",
					relationshipType: "comparison",
					reason: "Impossible self-link.",
				}),
				buildProposal({
					sourceBlipId: "54",
					targetBlipId: "999",
					relationshipType: "comparison",
					reason: "Missing target should be rejected.",
				}),
				buildProposal({
					sourceBlipId: "54",
					targetBlipId: "79",
					relationshipType: "ecosystem",
					reason: "Low-confidence relationship should not be applied.",
					confidence: "low",
				}),
				buildProposal({
					sourceBlipId: "43",
					targetBlipId: "54",
					relationshipType: "comparison",
					reason: "Removed blips cannot author new relationships.",
				}),
			],
			{ minimumConfidence: "medium", maxRelationshipsPerBlip: 3 },
		);

		expect(appliedDraft.proposalCount).toBe(1);
		expect(appliedDraft.skippedProposalCount).toBe(6);
		expect(appliedDraft.changedFiles).toEqual([
			"apps/astro/src/content/editions/2026-05/blips/azure.mdx",
		]);

		const updatedMatter = matter(appliedDraft.files[0]?.content ?? "").data as {
			relatedBlips: Array<{
				blipId: string;
				relationshipType: string;
				reason: string;
				bidirectional: boolean;
			}>;
		};

		expect(updatedMatter.relatedBlips).toHaveLength(2);
		expect(updatedMatter.relatedBlips[0]).toMatchObject({
			blipId: "63",
			relationshipType: "complement",
		});
		expect(updatedMatter.relatedBlips[1]).toMatchObject({
			blipId: "79",
			relationshipType: "alternative",
			bidirectional: true,
		});
		expect(
			appliedDraft.skippedProposals.map((proposal) => proposal.skipReason),
		).toEqual(
			expect.arrayContaining([
				"bidirectional-owned-by-target",
				"duplicate-relationship",
				"self-relationship",
				"target-not-active",
				"low-confidence",
				"source-not-active",
			]),
		);
	});
});

describe("relationship draft helpers", () => {
	it("reports available edition ids when the requested edition snapshot does not exist", async () => {
		const tempDirectory = await fs.mkdtemp(
			path.join(os.tmpdir(), "relationship-draft-"),
		);

		try {
			const existingEditionDirectory = path.join(
				tempDirectory,
				"apps",
				"astro",
				"src",
				"content",
				"editions",
				"2025-09",
			);
			await fs.mkdir(path.join(existingEditionDirectory, "blips"), {
				recursive: true,
			});
			await fs.writeFile(
				path.join(existingEditionDirectory, "index.mdx"),
				'---\nid: "2025-09"\nnumber: 5\ntitle: "Test Edition"\ndate: "2025-09-01"\n---\n',
				"utf8",
			);

			await expect(
				assertEditionSnapshotExists(tempDirectory, "2026-06"),
			).rejects.toThrow(
				"Edition snapshot `2026-06` was not found under `apps/astro/src/content/editions`. Available edition ids: `2025-09`.",
			);
		} finally {
			await fs.rm(tempDirectory, { recursive: true, force: true });
		}
	});

	it("orders numeric blip ids predictably and assigns bidirectional ownership to the lower id", () => {
		expect(compareBlipIds("54", "79")).toBeLessThan(0);
		expect(compareBlipIds("79", "54")).toBeGreaterThan(0);
		expect(isBidirectionalOwner("54", "79")).toBe(true);
		expect(isBidirectionalOwner("79", "54")).toBe(false);
	});

	it("renders explicit output ids and normalizes display-name references back to active ids", () => {
		const context = buildContext();
		const candidateContext = buildCandidateBlipsContext(context);
		const graphContext = buildExistingRelationshipGraphContext(context);
		const normalizedProposals = normalizeRelationshipProposalIds(context, [
			buildProposal({
				sourceBlipId: "Azure",
				targetBlipId: "Google Cloud Platform (79)",
				relationshipType: "alternative",
				reason: "Platform comparison within the same edition.",
				bidirectional: true,
			}),
		]);

		expect(candidateContext).toContain("Exact blipId for output: `54`");
		expect(graphContext).toContain("sourceBlipId=54 (Azure)");
		expect(normalizedProposals[0]).toMatchObject({
			sourceBlipId: "54",
			targetBlipId: "79",
		});
	});

	it("renders a review markdown summary with accepted and skipped proposal tables", () => {
		const context = buildContext();
		const appliedDraft = applyRelationshipProposals(
			context,
			[
				buildProposal({
					sourceBlipId: "54",
					targetBlipId: "79",
					relationshipType: "alternative",
					reason:
						"Cloud platform alternative for the same strategic decision space.",
					bidirectional: true,
				}),
				buildProposal({
					sourceBlipId: "79",
					targetBlipId: "54",
					relationshipType: "alternative",
					reason: "Inverse duplicate that should be skipped by owner rules.",
					bidirectional: true,
				}),
			],
			{ minimumConfidence: "medium" },
		);
		const reviewMarkdown = buildRelationshipReviewMarkdown(
			context,
			{
				overview:
					"The draft focuses on a small number of high-signal platform relationships.",
				highlights: [
					"Azure now points to Google Cloud Platform as an edition-local alternative.",
				],
				cautions: [
					"Bidirectional ownership may hide inverse duplicates from the edited file list.",
				],
			},
			appliedDraft,
		);

		expect(reviewMarkdown).toContain("Related blips draft review");
		expect(reviewMarkdown).toContain("Azure (54)");
		expect(reviewMarkdown).toContain("Google Cloud Platform (79)");
		expect(reviewMarkdown).toContain("Accepted relationship proposals: 1");
		expect(reviewMarkdown).toContain(
			"Skipped because bidirectional links are only written from the canonical owning side.",
		);
	});
});
