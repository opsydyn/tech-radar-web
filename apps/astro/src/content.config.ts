import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const QuadrantEnum = z.enum([
	"Tools",
	"Techniques",
	"Platforms",
	"languages-frameworks",
]);

const RingEnum = z.enum(["Adopt", "Trial", "Assess", "Hold"]);

const TagsEnum = z.enum([
	"Database",
	"Frontend",
	"Backend",
	"Mobile",
	"Cloud",
	"Qa",
]);

const RelationshipTypeEnum = z.enum([
	"alternative",
	"complement",
	"migration",
	"prerequisite",
	"evolution",
	"comparison",
	"ecosystem",
]);

const MoveEnum = z.enum(["stay", "grow", "go"]);
const Edition = z.coerce.date();
const MoveTuple = z.tuple([MoveEnum, Edition]);
const EditionBlipStatusEnum = z.enum(["active", "removed"]);
const Tags = z.array(TagsEnum);
const AdrStatusEnum = z.enum([
	"Proposed",
	"Accepted",
	"Superseded",
	"Deprecated",
]);

const RelatedBlipSchema = z.object({
	blipId: z.string(),
	relationshipType: RelationshipTypeEnum,
	reason: z.string().optional(),
	context: z.string().optional(),
	bidirectional: z.boolean().default(false),
});

const AdrSchema = z.object({
	status: AdrStatusEnum,
	author: z.string(),
	reviewers: z.array(z.string()),
	tags: Tags,
});

const DescriptionSchema = z.preprocess(
	(value) => (typeof value === "string" ? value : ""),
	z.string(),
);

const addAdrConsistencyIssues = (
	value: { hasAdr?: boolean; adr?: AdrMetadata },
	ctx: z.RefinementCtx,
	options: {
		readonly missingAdrMessage: string;
		readonly unexpectedAdrMessage: string;
	},
) => {
	const hasEmbeddedAdr = value.hasAdr === true && value.adr !== undefined;
	const hasUnexpectedAdr = value.hasAdr !== true && value.adr !== undefined;

	if (value.hasAdr === true && !hasEmbeddedAdr) {
		ctx.addIssue({
			code: "custom",
			message: options.missingAdrMessage,
			path: ["adr"],
		});
	}

	if (hasUnexpectedAdr) {
		ctx.addIssue({
			code: "custom",
			message: options.unexpectedAdrMessage,
			path: ["adr"],
		});
	}
};

const BlipSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		quadrant: QuadrantEnum,
		ring: RingEnum,
		description: DescriptionSchema,
		hasAdr: z.boolean(),
		adr: AdrSchema.optional(),
		tags: z.array(z.string()),
		authors: z.array(z.string()),
		move: z.array(MoveTuple),
		relatedBlips: z.array(RelatedBlipSchema).optional(),
		created: z.coerce.date().optional(),
	})
	.superRefine((blip, ctx) => {
		addAdrConsistencyIssues(blip, ctx, {
			missingAdrMessage:
				"Blips with hasAdr: true must include an adr metadata block.",
			unexpectedAdrMessage:
				"Blips with hasAdr: false must not include adr metadata.",
		});
	});

export type AdrStatus = z.infer<typeof AdrStatusEnum>;
export type AdrMetadata = z.infer<typeof AdrSchema>;
export type BlipData = z.infer<typeof BlipSchema>;

const AiProvenanceEntrySchema = z.object({
	feature: z.string(),
	kind: z.enum(["ai", "deterministic"]),
	provider: z.string(),
	model: z.string(),
	items: z.number().int().nonnegative(),
	calls: z.number().int().nonnegative(),
	inputTokens: z.number().int().nonnegative(),
	outputTokens: z.number().int().nonnegative(),
	cacheReadTokens: z.number().int().nonnegative(),
	cacheWriteTokens: z.number().int().nonnegative(),
	totalTokens: z.number().int().nonnegative(),
	notes: z.array(z.string()),
});

const AiProvenanceSchema = z.object({
	captureStatus: z.enum(["captured", "missing"]),
	auditEngine: z.string(),
	generatedBy: z.string(),
	entries: z.array(AiProvenanceEntrySchema),
});

// 📅 Edition represents a tech radar snapshot at a point in time
const EditionSchema = z.object({
	id: z.string(), // "1", "2", "3"...
	number: z.number().int().positive(), // Edition number for ordering/display
	title: z.string(), // "Q4 2023 Tech Radar"
	content: z.string(), // Markdown content
	date: z.coerce.date(), // Publication date - used to match blip movements
	aiProvenance: AiProvenanceSchema.optional(),
});

export type EditionData = z.infer<typeof EditionSchema>;

const EditionBlipSnapshotSchema = z
	.object({
		blip: z.string().min(1),
		name: z.string().optional(),
		ring: RingEnum.optional(),
		quadrant: QuadrantEnum.optional(),
		description: DescriptionSchema.optional(),
		hasAdr: z.boolean().optional(),
		adr: AdrSchema.optional(),
		tags: z.array(z.string()).optional(),
		authors: z.array(z.string()).optional(),
		move: z.array(MoveTuple).optional(),
		created: z.coerce.date().optional(),
		status: EditionBlipStatusEnum.default("active"),
		notes: z.string().optional(),
		relatedBlips: z.array(RelatedBlipSchema).optional(),
	})
	.superRefine((snapshot, ctx) => {
		const activeSnapshotMissingRing =
			snapshot.status === "active" && snapshot.ring === undefined;

		if (activeSnapshotMissingRing) {
			ctx.addIssue({
				code: "custom",
				message: "Active edition blip snapshots must include a ring.",
				path: ["ring"],
			});
		}

		addAdrConsistencyIssues(snapshot, ctx, {
			missingAdrMessage:
				"Edition blip snapshots with hasAdr: true must include an adr metadata block.",
			unexpectedAdrMessage:
				"Edition blip snapshots with hasAdr: false must not include adr metadata.",
		});
	});

export type EditionBlipSnapshotData = z.infer<typeof EditionBlipSnapshotSchema>;

const blipCollection = defineCollection({
	loader: glob({
		base: "./src/content/blip",
		pattern: "**/*.{md,mdx}",
	}),
	schema: BlipSchema,
});

const editionSnapshotCollection = defineCollection({
	loader: glob({
		base: "./src/content/editions",
		pattern: "*/index.{md,mdx}",
	}),
	schema: EditionSchema,
});

const editionBlipSnapshotCollection = defineCollection({
	loader: glob({
		base: "./src/content/editions",
		pattern: "*/blips/*.{md,mdx}",
	}),
	schema: EditionBlipSnapshotSchema,
});

export const collections = {
	blip: blipCollection,
	editionSnapshot: editionSnapshotCollection,
	editionBlipSnapshot: editionBlipSnapshotCollection,
};
