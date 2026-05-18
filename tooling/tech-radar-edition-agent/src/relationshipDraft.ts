import * as fs from "node:fs/promises";
import * as path from "node:path";
import matter from "gray-matter";
import * as v from "valibot";
import { defaultRepoRoot } from "./editionDraft";

export { defaultRepoRoot };

export const relationshipTypes = [
	"alternative",
	"complement",
	"migration",
	"prerequisite",
	"evolution",
	"comparison",
	"ecosystem",
] as const;

export const confidenceLevels = ["high", "medium", "low"] as const;

const confidenceRank = {
	high: 3,
	medium: 2,
	low: 1,
} as const;

const defaultReviewFallback =
	"No relationship guidance was generated for this run.";
const defaultMaxRelationshipsPerBlip = 3;
const minimumAllowedRelationshipsPerBlip = 1;
const maximumAllowedRelationshipsPerBlip = 5;

const RelationshipTypeSchema = v.picklist(relationshipTypes);
const SnapshotStatusSchema = v.picklist(["active", "removed"]);

const RawRelatedBlipSchema = v.object({
	blipId: v.string(),
	relationshipType: RelationshipTypeSchema,
	reason: v.optional(v.string()),
	context: v.optional(v.string()),
	bidirectional: v.optional(v.boolean()),
});

const RawSnapshotFrontmatterSchema = v.object({
	blip: v.string(),
	ring: v.optional(v.string()),
	quadrant: v.optional(v.string()),
	status: v.optional(SnapshotStatusSchema),
	notes: v.optional(v.string()),
	relatedBlips: v.optional(v.array(RawRelatedBlipSchema)),
});

const RawCanonicalBlipSchema = v.object({
	id: v.string(),
	name: v.string(),
	quadrant: v.string(),
	ring: v.string(),
	description: v.optional(v.unknown()),
	tags: v.optional(v.array(v.string())),
	hasAdr: v.optional(v.boolean()),
});

const RawEditionFrontmatterSchema = v.object({
	id: v.string(),
	number: v.number(),
	title: v.string(),
	date: v.union([v.string(), v.date()]),
});

export type RelationshipType = (typeof relationshipTypes)[number];
export type ConfidenceLevel = (typeof confidenceLevels)[number];
export type SnapshotStatus = "active" | "removed";

export type RelatedBlipEntry = {
	readonly blipId: string;
	readonly relationshipType: RelationshipType;
	readonly reason?: string;
	readonly context?: string;
	readonly bidirectional: boolean;
};

export type SnapshotFrontmatter = {
	readonly blip: string;
	readonly ring?: string;
	readonly quadrant?: string;
	readonly status: SnapshotStatus;
	readonly notes?: string;
	readonly relatedBlips?: readonly RelatedBlipEntry[];
};

export type SnapshotFile = {
	readonly filePath: string;
	readonly relativePath: string;
	readonly slug: string;
	readonly body: string;
	readonly frontmatter: SnapshotFrontmatter;
};

export type CanonicalBlip = {
	readonly id: string;
	readonly name: string;
	readonly quadrant: string;
	readonly ring: string;
	readonly description?: string;
	readonly tags: readonly string[];
	readonly hasAdr: boolean;
};

export type RelationshipCandidateBlip = {
	readonly blipId: string;
	readonly name: string;
	readonly quadrant: string;
	readonly ring: string;
	readonly description?: string;
	readonly tags: readonly string[];
	readonly notes?: string;
	readonly existingRelationships: readonly RelatedBlipEntry[];
};

export type RelationshipDraftContext = {
	readonly repoRoot: string;
	readonly editionId: string;
	readonly editionTitle: string;
	readonly editionDate: string;
	readonly editionDirectory: string;
	readonly snapshotDirectory: string;
	readonly snapshotFiles: readonly SnapshotFile[];
	readonly activeSnapshotFiles: readonly SnapshotFile[];
	readonly candidateBlips: readonly RelationshipCandidateBlip[];
	readonly canonicalBlipsById: ReadonlyMap<string, CanonicalBlip>;
};

export type RelationshipProposal = {
	readonly sourceBlipId: string;
	readonly targetBlipId: string;
	readonly relationshipType: RelationshipType;
	readonly reason: string;
	readonly context?: string;
	readonly bidirectional: boolean;
	readonly confidence: ConfidenceLevel;
	readonly evidence: readonly string[];
};

export type SkippedRelationshipProposal = RelationshipProposal & {
	readonly skipReason:
		| "self-relationship"
		| "source-not-active"
		| "target-not-active"
		| "duplicate-relationship"
		| "low-confidence"
		| "max-per-source"
		| "bidirectional-owned-by-target";
};

export type RelationshipDraftFile = {
	readonly path: string;
	readonly content: string;
};

export type RelationshipReview = {
	readonly overview: string;
	readonly highlights: readonly string[];
	readonly cautions: readonly string[];
};

export type AppliedRelationshipDraft = {
	readonly acceptedProposals: readonly RelationshipProposal[];
	readonly skippedProposals: readonly SkippedRelationshipProposal[];
	readonly changedFiles: readonly string[];
	readonly files: readonly RelationshipDraftFile[];
	readonly changedFileCount: number;
	readonly proposalCount: number;
	readonly skippedProposalCount: number;
};

const normalizeOptionalString = (
	value: string | undefined,
): string | undefined => {
	const trimmed = value?.trim();
	return trimmed && trimmed.length > 0 ? trimmed : undefined;
};

const sanitizeDescription = (value: unknown): string | undefined => {
	if (typeof value !== "string") {
		return undefined;
	}

	const trimmed = value.trim();
	const containsTemplatePlaceholder = /\{\{[^}]+\}\}/.test(trimmed);

	return trimmed.length > 0 && !containsTemplatePlaceholder
		? trimmed
		: undefined;
};

const toIsoDate = (value: string | Date): string =>
	typeof value === "string"
		? value.slice(0, 10)
		: value.toISOString().slice(0, 10);

const normalizeRelatedBlipEntry = (
	input: v.InferOutput<typeof RawRelatedBlipSchema>,
): RelatedBlipEntry => ({
	blipId: input.blipId,
	relationshipType: input.relationshipType,
	reason: normalizeOptionalString(input.reason),
	context: normalizeOptionalString(input.context),
	bidirectional: input.bidirectional ?? false,
});

const normalizeSnapshotFrontmatter = (
	input: v.InferOutput<typeof RawSnapshotFrontmatterSchema>,
): SnapshotFrontmatter => ({
	blip: input.blip,
	ring: normalizeOptionalString(input.ring),
	quadrant: normalizeOptionalString(input.quadrant),
	status: input.status ?? "active",
	notes: normalizeOptionalString(input.notes),
	relatedBlips: input.relatedBlips?.map(normalizeRelatedBlipEntry),
});

const normalizeCanonicalBlip = (
	input: v.InferOutput<typeof RawCanonicalBlipSchema>,
): CanonicalBlip => ({
	id: input.id,
	name: input.name,
	quadrant: input.quadrant,
	ring: input.ring,
	description: sanitizeDescription(input.description),
	tags: input.tags ?? [],
	hasAdr: input.hasAdr ?? false,
});

const readMarkdownFile = async (filePath: string): Promise<string> =>
	fs.readFile(filePath, "utf8");

const listMarkdownFiles = async (
	directoryPath: string,
): Promise<readonly string[]> => {
	const directoryEntries = await fs.readdir(directoryPath, {
		withFileTypes: true,
	});

	return directoryEntries
		.filter((entry) => entry.isFile() && /\.mdx?$/.test(entry.name))
		.map((entry) => entry.name)
		.sort((left, right) => left.localeCompare(right));
};

const loadCanonicalBlips = async (
	repoRoot: string,
): Promise<ReadonlyMap<string, CanonicalBlip>> => {
	const canonicalDirectory = path.join(
		repoRoot,
		"apps",
		"astro",
		"src",
		"content",
		"blip",
	);
	const markdownFiles = await listMarkdownFiles(canonicalDirectory);
	const canonicalBlips = await Promise.all(
		markdownFiles.map(async (fileName) => {
			const filePath = path.join(canonicalDirectory, fileName);
			const fileContents = await readMarkdownFile(filePath);
			const parsed = v.parse(RawCanonicalBlipSchema, matter(fileContents).data);
			const canonicalBlip = normalizeCanonicalBlip(parsed);

			return [canonicalBlip.id, canonicalBlip] as const;
		}),
	);

	return new Map(canonicalBlips);
};

const loadSnapshotFiles = async (
	repoRoot: string,
	editionId: string,
): Promise<readonly SnapshotFile[]> => {
	const snapshotDirectory = path.join(
		repoRoot,
		"apps",
		"astro",
		"src",
		"content",
		"editions",
		editionId,
		"blips",
	);
	const markdownFiles = await listMarkdownFiles(snapshotDirectory);

	return Promise.all(
		markdownFiles.map(async (fileName) => {
			const filePath = path.join(snapshotDirectory, fileName);
			const fileContents = await readMarkdownFile(filePath);
			const parsedMatter = matter(fileContents);
			const frontmatter = normalizeSnapshotFrontmatter(
				v.parse(RawSnapshotFrontmatterSchema, parsedMatter.data),
			);

			return {
				filePath,
				relativePath: path.relative(repoRoot, filePath),
				slug: fileName.replace(/\.mdx?$/, ""),
				body: parsedMatter.content,
				frontmatter,
			};
		}),
	);
};

const loadEditionMetadata = async (
	repoRoot: string,
	editionId: string,
): Promise<{ readonly editionTitle: string; readonly editionDate: string }> => {
	const editionFilePath = path.join(
		repoRoot,
		"apps",
		"astro",
		"src",
		"content",
		"editions",
		editionId,
		"index.mdx",
	);
	const fileContents = await readMarkdownFile(editionFilePath);
	const parsed = v.parse(
		RawEditionFrontmatterSchema,
		matter(fileContents).data,
	);

	return {
		editionTitle: parsed.title,
		editionDate: toIsoDate(parsed.date),
	};
};

const buildCandidateBlip = (
	snapshotFile: SnapshotFile,
	canonicalBlipsById: ReadonlyMap<string, CanonicalBlip>,
): RelationshipCandidateBlip => {
	const canonicalBlip = canonicalBlipsById.get(snapshotFile.frontmatter.blip);

	if (canonicalBlip === undefined) {
		throw new Error(
			`No canonical blip entry exists for snapshot blip ${snapshotFile.frontmatter.blip}.`,
		);
	}

	return {
		blipId: snapshotFile.frontmatter.blip,
		name: canonicalBlip.name,
		quadrant: snapshotFile.frontmatter.quadrant ?? canonicalBlip.quadrant,
		ring: snapshotFile.frontmatter.ring ?? canonicalBlip.ring,
		description: canonicalBlip.description,
		tags: canonicalBlip.tags,
		notes: snapshotFile.frontmatter.notes,
		existingRelationships: snapshotFile.frontmatter.relatedBlips ?? [],
	};
};

export const createRelationshipDraftContext = async (input: {
	repoRoot?: string;
	editionId: string;
}): Promise<RelationshipDraftContext> => {
	const repoRoot = input.repoRoot ?? defaultRepoRoot;
	const editionDirectory = path.join(
		repoRoot,
		"apps",
		"astro",
		"src",
		"content",
		"editions",
		input.editionId,
	);
	const snapshotDirectory = path.join(editionDirectory, "blips");
	const [{ editionDate, editionTitle }, canonicalBlipsById, snapshotFiles] =
		await Promise.all([
			loadEditionMetadata(repoRoot, input.editionId),
			loadCanonicalBlips(repoRoot),
			loadSnapshotFiles(repoRoot, input.editionId),
		]);
	const activeSnapshotFiles = snapshotFiles.filter(
		(snapshotFile) => snapshotFile.frontmatter.status === "active",
	);

	if (activeSnapshotFiles.length === 0) {
		throw new Error(
			`Edition ${input.editionId} has no active snapshot blips to draft relationships for.`,
		);
	}

	return {
		repoRoot,
		editionId: input.editionId,
		editionTitle,
		editionDate,
		editionDirectory,
		snapshotDirectory,
		snapshotFiles,
		activeSnapshotFiles,
		candidateBlips: activeSnapshotFiles.map((snapshotFile) =>
			buildCandidateBlip(snapshotFile, canonicalBlipsById),
		),
		canonicalBlipsById,
	};
};

const relationshipTypeDescriptions: Record<RelationshipType, string> = {
	alternative: "Comparable choice or substitute in this edition.",
	complement: "Works well alongside the other blip in a combined workflow.",
	migration: "Represents a migration path toward or away from the other blip.",
	prerequisite: "Usually needs the other blip or practice in place first.",
	evolution:
		"Represents an evolution, successor, or earlier stage of the other blip.",
	comparison: "Useful contrast for readers weighing similar approaches.",
	ecosystem: "Belongs to the same wider platform or technology ecosystem.",
};

const formatExistingRelationship = (
	relationship: RelatedBlipEntry,
	canonicalBlipsById: ReadonlyMap<string, CanonicalBlip>,
): string => {
	const targetBlip = canonicalBlipsById.get(relationship.blipId);
	const targetName = targetBlip?.name ?? relationship.blipId;
	const directionLabel = relationship.bidirectional
		? "bidirectional"
		: "directional";

	return `${relationship.relationshipType} -> targetBlipId=${relationship.blipId} (${targetName}) [${directionLabel}]`;
};

export const buildRelationshipTypeGuide = (): string =>
	relationshipTypes
		.map((type) => `- \`${type}\`: ${relationshipTypeDescriptions[type]}`)
		.join("\n");

export const buildAllowedBlipIdsContext = (
	context: RelationshipDraftContext,
): string =>
	context.candidateBlips
		.map((candidateBlip) => `- \`${candidateBlip.blipId}\`: ${candidateBlip.name}`)
		.join("\n");

export const buildCandidateBlipsContext = (
	context: RelationshipDraftContext,
): string =>
	context.candidateBlips
		.map((candidateBlip) => {
			const description =
				candidateBlip.description ??
				"No clean canonical description was available in frontmatter.";
			const tagsLabel =
				candidateBlip.tags.length > 0 ? candidateBlip.tags.join(", ") : "none";
			const notesLabel = candidateBlip.notes ?? "none";
			const existingRelationshipsLabel =
				candidateBlip.existingRelationships.length > 0
					? candidateBlip.existingRelationships
							.map((relationship) =>
								formatExistingRelationship(
									relationship,
									context.canonicalBlipsById,
								),
							)
							.join("; ")
					: "none";

			return [
				`### ${candidateBlip.name}`,
				`- Exact blipId for output: \`${candidateBlip.blipId}\``,
				`- Ring: ${candidateBlip.ring}`,
				`- Quadrant: ${candidateBlip.quadrant}`,
				`- Tags: ${tagsLabel}`,
				`- Edition notes: ${notesLabel}`,
				`- Description: ${description}`,
				`- Existing relationships: ${existingRelationshipsLabel}`,
			].join("\n");
		})
		.join("\n\n");

export const buildExistingRelationshipGraphContext = (
	context: RelationshipDraftContext,
): string => {
	const graphLines = context.activeSnapshotFiles.flatMap((snapshotFile) => {
		const sourceBlip = context.canonicalBlipsById.get(
			snapshotFile.frontmatter.blip,
		);
		const sourceName = sourceBlip?.name ?? snapshotFile.frontmatter.blip;

		return (snapshotFile.frontmatter.relatedBlips ?? []).map((relationship) => {
			const targetBlip = context.canonicalBlipsById.get(relationship.blipId);
			const targetName = targetBlip?.name ?? relationship.blipId;
			const directionLabel = relationship.bidirectional
				? "bidirectional"
				: "directional";

			return `- sourceBlipId=${snapshotFile.frontmatter.blip} (${sourceName}) -> targetBlipId=${relationship.blipId} (${targetName}) [${relationship.relationshipType}, ${directionLabel}]`;
		});
	});

	return graphLines.length > 0
		? graphLines.join("\n")
		: "No edition-local relationships are currently defined.";
};

export const compareBlipIds = (left: string, right: string): number => {
	const leftIsNumeric = /^\d+$/.test(left);
	const rightIsNumeric = /^\d+$/.test(right);

	if (leftIsNumeric && rightIsNumeric) {
		return Number(left) - Number(right);
	}

	return left.localeCompare(right, undefined, { numeric: true });
};

export const isBidirectionalOwner = (
	sourceBlipId: string,
	targetBlipId: string,
): boolean => compareBlipIds(sourceBlipId, targetBlipId) < 0;

const normalizeCandidateReference = (value: string): string =>
	value.trim().replace(/^[`"'“”‘’]+|[`"'“”‘’]+$/g, "").trim();

const normalizeCandidateLookupKey = (value: string): string =>
	normalizeCandidateReference(value).toLowerCase().replace(/\s+/g, " ");

const buildCandidateBlipReferenceLookup = (
	candidateBlips: readonly RelationshipCandidateBlip[],
) => {
	const candidateIds = new Set(
		candidateBlips.map((candidateBlip) => candidateBlip.blipId),
	);
	const directKeyToId = new Map<string, string>();
	const nameToIds = new Map<string, Set<string>>();

	for (const candidateBlip of candidateBlips) {
		directKeyToId.set(
			normalizeCandidateLookupKey(candidateBlip.blipId),
			candidateBlip.blipId,
		);
		directKeyToId.set(
			normalizeCandidateLookupKey(
				`${candidateBlip.name} (${candidateBlip.blipId})`,
			),
			candidateBlip.blipId,
		);

		const normalizedName = normalizeCandidateLookupKey(candidateBlip.name);
		const idsForName = nameToIds.get(normalizedName) ?? new Set<string>();
		idsForName.add(candidateBlip.blipId);
		nameToIds.set(normalizedName, idsForName);
	}

	const uniqueNameToId = new Map(
		Array.from(nameToIds.entries()).flatMap(([normalizedName, idsForName]) =>
			idsForName.size === 1
				? [[normalizedName, Array.from(idsForName)[0] ?? ""]]
				: [],
		),
	);

	return {
		candidateIds,
		directKeyToId,
		uniqueNameToId,
	};
};

const resolveCandidateBlipId = (
	value: string,
	lookup: ReturnType<typeof buildCandidateBlipReferenceLookup>,
): string => {
	const normalizedReference = normalizeCandidateReference(value);

	if (normalizedReference.length === 0) {
		return value;
	}

	const normalizedKey = normalizeCandidateLookupKey(normalizedReference);
	const directMatch = lookup.directKeyToId.get(normalizedKey);

	if (directMatch !== undefined) {
		return directMatch;
	}

	const extractedParenthesizedId = normalizedReference
		.match(/\(([^()]+)\)\s*$/)?.[1]
		?.trim();

	if (
		extractedParenthesizedId !== undefined &&
		lookup.candidateIds.has(extractedParenthesizedId)
	) {
		return extractedParenthesizedId;
	}

	return lookup.uniqueNameToId.get(normalizedKey) ?? value;
};

export const normalizeRelationshipProposalIds = (
	context: RelationshipDraftContext,
	proposals: readonly RelationshipProposal[],
): readonly RelationshipProposal[] => {
	const lookup = buildCandidateBlipReferenceLookup(context.candidateBlips);

	return proposals.map((proposal) => ({
		...proposal,
		sourceBlipId: resolveCandidateBlipId(proposal.sourceBlipId, lookup),
		targetBlipId: resolveCandidateBlipId(proposal.targetBlipId, lookup),
	}));
};

const stripProposalMetadata = (
	proposal: RelationshipProposal,
): RelatedBlipEntry => ({
	blipId: proposal.targetBlipId,
	relationshipType: proposal.relationshipType,
	reason: normalizeOptionalString(proposal.reason),
	context: normalizeOptionalString(proposal.context),
	bidirectional: proposal.bidirectional,
});

const createRelationshipKey = (
	targetBlipId: string,
	relationshipType: RelationshipType,
): string => `${targetBlipId}:${relationshipType}`;

const resolveMaxRelationshipsPerBlip = (value: number | undefined): number => {
	const normalizedValue =
		typeof value === "number" && Number.isInteger(value)
			? value
			: defaultMaxRelationshipsPerBlip;

	return Math.min(
		maximumAllowedRelationshipsPerBlip,
		Math.max(minimumAllowedRelationshipsPerBlip, normalizedValue),
	);
};

const toMatterRelatedBlip = (relationship: RelatedBlipEntry) => ({
	blipId: relationship.blipId,
	relationshipType: relationship.relationshipType,
	...(relationship.reason ? { reason: relationship.reason } : {}),
	...(relationship.context ? { context: relationship.context } : {}),
	bidirectional: relationship.bidirectional,
});

const toMatterFrontmatter = (frontmatter: SnapshotFrontmatter) => ({
	blip: frontmatter.blip,
	...(frontmatter.ring ? { ring: frontmatter.ring } : {}),
	...(frontmatter.quadrant ? { quadrant: frontmatter.quadrant } : {}),
	status: frontmatter.status,
	...(frontmatter.notes ? { notes: frontmatter.notes } : {}),
	...(frontmatter.relatedBlips && frontmatter.relatedBlips.length > 0
		? {
				relatedBlips: frontmatter.relatedBlips.map(toMatterRelatedBlip),
			}
		: {}),
});

const confidenceMeetsThreshold = (
	confidence: ConfidenceLevel,
	minimumConfidence: ConfidenceLevel,
): boolean => confidenceRank[confidence] >= confidenceRank[minimumConfidence];

export const applyRelationshipProposals = (
	context: RelationshipDraftContext,
	proposals: readonly RelationshipProposal[],
	options: {
		maxRelationshipsPerBlip?: number;
		minimumConfidence?: ConfidenceLevel;
	} = {},
): AppliedRelationshipDraft => {
	const maxRelationshipsPerBlip = resolveMaxRelationshipsPerBlip(
		options.maxRelationshipsPerBlip,
	);
	const minimumConfidence = options.minimumConfidence ?? "medium";
	const activeBlipIds = new Set(
		context.activeSnapshotFiles.map(
			(snapshotFile) => snapshotFile.frontmatter.blip,
		),
	);
	const snapshotFilesByBlipId = new Map(
		context.snapshotFiles.map(
			(snapshotFile) => [snapshotFile.frontmatter.blip, snapshotFile] as const,
		),
	);
	const proposalsBySource = proposals.reduce((groupedProposals, proposal) => {
		const currentProposals = groupedProposals.get(proposal.sourceBlipId) ?? [];
		groupedProposals.set(proposal.sourceBlipId, [
			...currentProposals,
			proposal,
		]);
		return groupedProposals;
	}, new Map<string, RelationshipProposal[]>());
	const acceptedProposals: RelationshipProposal[] = [];
	const skippedProposals: SkippedRelationshipProposal[] = [];
	const acceptedRelationshipsBySource = new Map<string, RelatedBlipEntry[]>();

	for (const [sourceBlipId, sourceProposals] of proposalsBySource.entries()) {
		const sourceSnapshot = snapshotFilesByBlipId.get(sourceBlipId);
		const existingRelationships =
			sourceSnapshot?.frontmatter.relatedBlips ?? [];
		const existingKeys = new Set(
			existingRelationships.map((relationship) =>
				createRelationshipKey(
					relationship.blipId,
					relationship.relationshipType,
				),
			),
		);
		const pendingKeys = new Set<string>();
		let acceptedCount = 0;

		for (const proposal of sourceProposals) {
			const relationshipKey = createRelationshipKey(
				proposal.targetBlipId,
				proposal.relationshipType,
			);
			const shouldSkipForDuplicate =
				existingKeys.has(relationshipKey) || pendingKeys.has(relationshipKey);
			const skipReason = (() => {
				if (proposal.sourceBlipId === proposal.targetBlipId) {
					return "self-relationship" as const;
				}

				if (!activeBlipIds.has(proposal.sourceBlipId)) {
					return "source-not-active" as const;
				}

				if (!activeBlipIds.has(proposal.targetBlipId)) {
					return "target-not-active" as const;
				}

				if (!confidenceMeetsThreshold(proposal.confidence, minimumConfidence)) {
					return "low-confidence" as const;
				}

				if (
					proposal.bidirectional &&
					!isBidirectionalOwner(proposal.sourceBlipId, proposal.targetBlipId)
				) {
					return "bidirectional-owned-by-target" as const;
				}

				if (shouldSkipForDuplicate) {
					return "duplicate-relationship" as const;
				}

				if (acceptedCount >= maxRelationshipsPerBlip) {
					return "max-per-source" as const;
				}

				return null;
			})();

			if (skipReason !== null) {
				skippedProposals.push({
					...proposal,
					skipReason,
				});
				continue;
			}

			const acceptedRelationship = stripProposalMetadata(proposal);
			const currentAcceptedRelationships =
				acceptedRelationshipsBySource.get(sourceBlipId) ?? [];

			acceptedRelationshipsBySource.set(sourceBlipId, [
				...currentAcceptedRelationships,
				acceptedRelationship,
			]);
			acceptedProposals.push(proposal);
			pendingKeys.add(relationshipKey);
			acceptedCount += 1;
		}
	}

	const files = context.snapshotFiles.flatMap((snapshotFile) => {
		const acceptedRelationships =
			acceptedRelationshipsBySource.get(snapshotFile.frontmatter.blip) ?? [];

		if (acceptedRelationships.length === 0) {
			return [];
		}

		const mergedFrontmatter: SnapshotFrontmatter = {
			...snapshotFile.frontmatter,
			relatedBlips: [
				...(snapshotFile.frontmatter.relatedBlips ?? []),
				...acceptedRelationships,
			],
		};
		const stringified = matter
			.stringify(
				snapshotFile.body.trim(),
				toMatterFrontmatter(mergedFrontmatter),
				{
					language: "yaml",
				},
			)
			.trim();

		return [
			{
				path: snapshotFile.relativePath,
				content: `${stringified}\n`,
			},
		] satisfies readonly RelationshipDraftFile[];
	});
	const changedFiles = files.map((file) => file.path);

	return {
		acceptedProposals,
		skippedProposals,
		changedFiles,
		files,
		changedFileCount: changedFiles.length,
		proposalCount: acceptedProposals.length,
		skippedProposalCount: skippedProposals.length,
	};
};

const skipReasonDescriptions: Record<
	SkippedRelationshipProposal["skipReason"],
	string
> = {
	"self-relationship": "Skipped because the proposal linked a blip to itself.",
	"source-not-active":
		"Skipped because the source blip is not active in this edition snapshot.",
	"target-not-active":
		"Skipped because the target blip is not active in this edition snapshot.",
	"duplicate-relationship":
		"Skipped because the same target and relationship type already exists.",
	"low-confidence":
		"Skipped because the confidence was below the configured threshold.",
	"max-per-source":
		"Skipped because the source blip already reached the per-blip proposal limit.",
	"bidirectional-owned-by-target":
		"Skipped because bidirectional links are only written from the canonical owning side.",
};

const escapeTableCell = (value: string): string => value.replaceAll("|", "\\|");

const markdownTable = (
	headers: readonly string[],
	rows: readonly (readonly string[])[],
): string =>
	[
		`| ${headers.join(" | ")} |`,
		`| ${headers.map(() => "---").join(" | ")} |`,
		...rows.map((row) => `| ${row.join(" | ")} |`),
	].join("\n");

const resolveBlipLabel = (
	blipId: string,
	canonicalBlipsById: ReadonlyMap<string, CanonicalBlip>,
): string => {
	const canonicalBlip = canonicalBlipsById.get(blipId);
	return canonicalBlip ? `${canonicalBlip.name} (${blipId})` : blipId;
};

const bulletList = (items: readonly string[], fallback: string): string =>
	items.length > 0
		? items.map((item) => `- ${item}`).join("\n")
		: `- ${fallback}`;

export const buildRelationshipReviewMarkdown = (
	context: RelationshipDraftContext,
	review: RelationshipReview,
	appliedDraft: AppliedRelationshipDraft,
): string => {
	const acceptedRows = appliedDraft.acceptedProposals.map((proposal) => [
		escapeTableCell(
			resolveBlipLabel(proposal.sourceBlipId, context.canonicalBlipsById),
		),
		escapeTableCell(
			resolveBlipLabel(proposal.targetBlipId, context.canonicalBlipsById),
		),
		escapeTableCell(proposal.relationshipType),
		escapeTableCell(proposal.confidence),
		escapeTableCell(proposal.bidirectional ? "yes" : "no"),
		escapeTableCell(proposal.reason),
	]);
	const skippedRows = appliedDraft.skippedProposals.map((proposal) => [
		escapeTableCell(
			resolveBlipLabel(proposal.sourceBlipId, context.canonicalBlipsById),
		),
		escapeTableCell(
			resolveBlipLabel(proposal.targetBlipId, context.canonicalBlipsById),
		),
		escapeTableCell(proposal.relationshipType),
		escapeTableCell(skipReasonDescriptions[proposal.skipReason]),
	]);

	return [
		`# Related blips draft review — ${context.editionTitle}`,
		"",
		"## Edition context",
		"",
		`- Edition id: \`${context.editionId}\``,
		`- Edition date: \`${context.editionDate}\``,
		`- Active snapshot blips considered: ${context.activeSnapshotFiles.length}`,
		`- Accepted relationship proposals: ${appliedDraft.proposalCount}`,
		`- Snapshot files changed: ${appliedDraft.changedFileCount}`,
		`- Skipped proposals: ${appliedDraft.skippedProposalCount}`,
		"",
		"## Overview",
		"",
		review.overview.trim() || defaultReviewFallback,
		"",
		"## Highlights",
		"",
		bulletList(review.highlights, defaultReviewFallback),
		"",
		"## Cautions",
		"",
		bulletList(review.cautions, "No additional cautions were generated."),
		"",
		"## Accepted proposals",
		"",
		acceptedRows.length > 0
			? markdownTable(
					["Source", "Target", "Type", "Confidence", "Bidirectional", "Reason"],
					acceptedRows,
				)
			: "No proposals cleared the deterministic merge rules.",
		"",
		"## Skipped proposals",
		"",
		skippedRows.length > 0
			? markdownTable(
					["Source", "Target", "Type", "Why it was skipped"],
					skippedRows,
				)
			: "No proposals were skipped.",
	].join("\n");
};
