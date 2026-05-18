import type { FlueContext } from "@flue/sdk/client";
import * as v from "valibot";
import {
	applyRelationshipProposals,
	buildAllowedBlipIdsContext,
	buildCandidateBlipsContext,
	buildExistingRelationshipGraphContext,
	buildRelationshipReviewMarkdown,
	buildRelationshipTypeGuide,
	confidenceLevels,
	createRelationshipDraftContext,
	defaultRepoRoot,
	normalizeRelationshipProposalIds,
	relationshipTypes,
} from "../../src/relationshipDraft";

export const triggers = {};

const defaultModel = "openai/gpt-4.1-mini";
const defaultMinimumConfidence = "medium";
const defaultMaxRelationshipsPerBlip = 3;

const payloadSchema = v.object({
	repoRoot: v.optional(v.string()),
	editionId: v.string(),
	model: v.optional(v.string()),
	maxRelationshipsPerBlip: v.optional(v.number()),
	minimumConfidence: v.optional(v.picklist(confidenceLevels)),
});

const proposalSchema = v.object({
	sourceBlipId: v.string(),
	targetBlipId: v.string(),
	relationshipType: v.picklist(relationshipTypes),
	reason: v.string(),
	context: v.optional(v.string()),
	bidirectional: v.boolean(),
	confidence: v.picklist(confidenceLevels),
	evidence: v.array(v.string()),
});

const skippedProposalSchema = v.object({
	sourceBlipId: v.string(),
	targetBlipId: v.string(),
	relationshipType: v.picklist(relationshipTypes),
	reason: v.string(),
	context: v.optional(v.string()),
	bidirectional: v.boolean(),
	confidence: v.picklist(confidenceLevels),
	evidence: v.array(v.string()),
	skipReason: v.picklist([
		"self-relationship",
		"source-not-active",
		"target-not-active",
		"duplicate-relationship",
		"low-confidence",
		"max-per-source",
		"bidirectional-owned-by-target",
	]),
});

const reviewSchema = v.object({
	overview: v.string(),
	highlights: v.array(v.string()),
	cautions: v.array(v.string()),
});

const relationshipDraftSchema = v.object({
	overview: v.string(),
	highlights: v.array(v.string()),
	cautions: v.array(v.string()),
	proposals: v.array(proposalSchema),
});

const resultSchema = v.object({
	editionId: v.string(),
	editionTitle: v.string(),
	editionDate: v.string(),
	proposalCount: v.number(),
	skippedProposalCount: v.number(),
	changedFileCount: v.number(),
	changedFiles: v.array(v.string()),
	acceptedProposals: v.array(proposalSchema),
	skippedProposals: v.array(skippedProposalSchema),
	review: reviewSchema,
	reviewMarkdown: v.string(),
	files: v.array(
		v.object({
			path: v.string(),
			content: v.string(),
		}),
	),
});

const envelopeSchema = v.object({
	kind: v.literal("RelatedBlipsDraftResult"),
	result: resultSchema,
});

const resolveMaxRelationshipsPerBlip = (value: number | undefined): number => {
	const normalizedValue =
		typeof value === "number" && Number.isInteger(value)
			? value
			: defaultMaxRelationshipsPerBlip;

	return Math.min(5, Math.max(1, normalizedValue));
};

export default async function ({ init, payload }: FlueContext) {
	const input = v.parse(payloadSchema, payload ?? {});
	const maxRelationshipsPerBlip = resolveMaxRelationshipsPerBlip(
		input.maxRelationshipsPerBlip,
	);
	const minimumConfidence = input.minimumConfidence ?? defaultMinimumConfidence;
	const context = await createRelationshipDraftContext({
		repoRoot: input.repoRoot ?? defaultRepoRoot,
		editionId: input.editionId,
	});
	const harness = await init({
		sandbox: "local",
		model: input.model ?? defaultModel,
		role: "relationship-curator",
	});
	const session = await harness.session();
	const draft = await session.skill("propose-related-blips", {
		args: {
			editionId: context.editionId,
			editionTitle: context.editionTitle,
			editionDate: context.editionDate,
			maxRelationshipsPerBlip,
			allowedBlipIdsContext: buildAllowedBlipIdsContext(context),
			relationshipTypeGuide: buildRelationshipTypeGuide(),
			candidateBlipsContext: buildCandidateBlipsContext(context),
			existingRelationshipGraph: buildExistingRelationshipGraphContext(context),
		},
		role: "relationship-curator",
		result: relationshipDraftSchema,
	});
	const normalizedProposals = normalizeRelationshipProposalIds(
		context,
		draft.proposals,
	);
	const appliedDraft = applyRelationshipProposals(
		context,
		normalizedProposals,
		{
			maxRelationshipsPerBlip,
			minimumConfidence,
		},
	);
	const review = {
		overview: draft.overview,
		highlights: draft.highlights,
		cautions: draft.cautions,
	};
	const reviewMarkdown = buildRelationshipReviewMarkdown(
		context,
		review,
		appliedDraft,
	);

	return v.parse(envelopeSchema, {
		kind: "RelatedBlipsDraftResult",
		result: {
			editionId: context.editionId,
			editionTitle: context.editionTitle,
			editionDate: context.editionDate,
			proposalCount: appliedDraft.proposalCount,
			skippedProposalCount: appliedDraft.skippedProposalCount,
			changedFileCount: appliedDraft.changedFileCount,
			changedFiles: appliedDraft.changedFiles,
			acceptedProposals: appliedDraft.acceptedProposals,
			skippedProposals: appliedDraft.skippedProposals,
			review,
			reviewMarkdown,
			files: appliedDraft.files,
		},
	});
}
