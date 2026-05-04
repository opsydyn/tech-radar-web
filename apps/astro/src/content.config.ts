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

const RelatedBlipSchema = z.object({
	blipId: z.string(),
	relationshipType: RelationshipTypeEnum,
	reason: z.string().optional(),
	context: z.string().optional(),
	bidirectional: z.boolean().default(false),
});

const BlipSchema = z.object({
	id: z.string(),
	name: z.string(),
	quadrant: QuadrantEnum,
	ring: RingEnum,
	description: z.preprocess(
		(value) => (typeof value === "string" ? value : ""),
		z.string(),
	),
	hasAdr: z.boolean(),
	tags: z.array(z.string()),
	authors: z.array(z.string()),
	move: z.array(MoveTuple),
	relatedBlips: z.array(RelatedBlipSchema).optional(),
	created: z.coerce.date().optional(),
});

const AdrSchema = z.object({
	id: z.string(),
	title: z.string(),
	created: z.coerce.date(),
	status: z.string(),
	author: z.string(),
	reviewers: z.array(z.string()),
	tags: Tags,
});

// 📅 Edition represents a tech radar snapshot at a point in time
const EditionSchema = z.object({
	id: z.string(), // "1", "2", "3"...
	number: z.number().int().positive(), // Edition number for ordering/display
	title: z.string(), // "Q4 2023 Tech Radar"
	content: z.string(), // Markdown content
	date: z.coerce.date(), // Publication date - used to match blip movements
});

const adrCollection = defineCollection({
	loader: glob({
		base: "./src/content/adr",
		pattern: "**/*.{md,mdx}",
	}),
	schema: AdrSchema,
});

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
	adr: adrCollection,
	blip: blipCollection,
	edition: editionCollection,
};
