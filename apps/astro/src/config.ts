import { defineCollection } from "astro:content";
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
	type: "content",
	schema: AdrSchema,
});

const blipCollection = defineCollection({
	type: "content",
	schema: BlipSchema,
});

const editionCollection = defineCollection({
	type: "content",
	schema: EditionSchema,
});

export const collections = {
	adr: adrCollection,
	blip: blipCollection,
	edition: editionCollection,
};
