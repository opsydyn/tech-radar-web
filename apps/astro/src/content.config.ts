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

const BlipSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		quadrant: QuadrantEnum,
		ring: RingEnum,
		description: z.preprocess(
			(value) => (typeof value === "string" ? value : ""),
			z.string(),
		),
		hasAdr: z.boolean(),
		adr: AdrSchema.optional(),
		tags: z.array(z.string()),
		authors: z.array(z.string()),
		move: z.array(MoveTuple),
		relatedBlips: z.array(RelatedBlipSchema).optional(),
		created: z.coerce.date().optional(),
	})
	.superRefine((blip, ctx) => {
		const hasEmbeddedAdr = blip.hasAdr === true && blip.adr !== undefined;
		const hasUnexpectedAdr = blip.hasAdr === false && blip.adr !== undefined;

		if (blip.hasAdr === true && !hasEmbeddedAdr) {
			ctx.addIssue({
				code: "custom",
				message: "Blips with hasAdr: true must include an adr metadata block.",
				path: ["adr"],
			});
		}

		if (hasUnexpectedAdr) {
			ctx.addIssue({
				code: "custom",
				message: "Blips with hasAdr: false must not include adr metadata.",
				path: ["adr"],
			});
		}
	});

export type AdrStatus = z.infer<typeof AdrStatusEnum>;
export type AdrMetadata = z.infer<typeof AdrSchema>;
export type BlipData = z.infer<typeof BlipSchema>;

// 📅 Edition represents a tech radar snapshot at a point in time
const EditionSchema = z.object({
	id: z.string(), // "1", "2", "3"...
	number: z.number().int().positive(), // Edition number for ordering/display
	title: z.string(), // "Q4 2023 Tech Radar"
	content: z.string(), // Markdown content
	date: z.coerce.date(), // Publication date - used to match blip movements
});

export type EditionData = z.infer<typeof EditionSchema>;

const blipCollection = defineCollection({
	loader: glob({
		base: "./src/content/blip",
		pattern: "**/*.{md,mdx}",
	}),
	schema: BlipSchema,
});

const editionCollection = defineCollection({
	loader: glob({
		base: "./src/content/edition",
		pattern: "**/*.{md,mdx}",
	}),
	schema: EditionSchema,
});

export const collections = {
	blip: blipCollection,
	edition: editionCollection,
};
