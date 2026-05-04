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

// 🗺️ Wardley mapping schemas following functional programming patterns
const WardleyEvolutionStageEnum = z.enum([
	"Genesis",
	"Custom",
	"Product",
	"Commodity",
]);

const WardleyVisibilityEnum = z.enum(["Visible", "Internal", "Infrastructure"]);

const WardleyComponentTypeEnum = z.enum([
	"User",
	"Business",
	"Data",
	"Infrastructure",
	"Anchor",
]);

const WardleyMovementEnum = z.enum(["Evolving", "Stable", "Declining"]);

// Wardley position schema with validation
const WardleyPositionSchema = z.object({
	evolution: z.number().min(0).max(1), // 0-1 (Genesis to Commodity)
	value: z.number().min(0).max(1), // 0-1 (Infrastructure to User-facing)
});

// Complete Wardley component data schema
const WardleyComponentSchema = z.object({
	position: WardleyPositionSchema,
	stage: WardleyEvolutionStageEnum,
	visibility: WardleyVisibilityEnum,
	componentType: WardleyComponentTypeEnum,
	size: z.number().min(1).max(10), // 1-10 relative importance
	dependencies: z.array(z.string()).optional(), // IDs of other blips this depends on
	movement: WardleyMovementEnum.optional(),
	strategicNotes: z.string().optional(), // Strategic context/notes
});

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
	// 🗺️ Optional Wardley mapping data
	wardley: WardleyComponentSchema.optional(),
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

// 🎪 Export types for use in components
export type WardleyPosition = z.infer<typeof WardleyPositionSchema>;
export type WardleyComponent = z.infer<typeof WardleyComponentSchema>;
export type WardleyEvolutionStage = z.infer<typeof WardleyEvolutionStageEnum>;
export type WardleyVisibility = z.infer<typeof WardleyVisibilityEnum>;
export type WardleyComponentType = z.infer<typeof WardleyComponentTypeEnum>;
export type WardleyMovement = z.infer<typeof WardleyMovementEnum>;
