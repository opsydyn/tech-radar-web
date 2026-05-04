import { defineCollection, reference, z } from "astro:content";

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
const Edition = z.date();
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
	description: z.string(),
	hasAdr: z.boolean(),
	tags: TagsEnum,
	authors: z.array(z.string()),
	move: z.array(MoveTuple),
	relatedBlips: z.array(RelatedBlipSchema).optional(),
	// 🗺️ Optional Wardley mapping data
	wardley: WardleyComponentSchema.optional(),
});

const AdrSchema = z.object({
	id: reference("BlipSchema"),
	created: z.date(),
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
	date: z.date(), // Publication date - used to match blip movements
});

const combinedCollection = defineCollection({
	type: "content",
	schema: z.object({
		blips: z.array(BlipSchema),
		adrs: z.array(AdrSchema),
	}),
});

export const collections = {
	radar: combinedCollection,
	adr: AdrSchema,
	blip: BlipSchema,
	edition: EditionSchema,
};

// 🎪 Export types for use in components
export type WardleyPosition = z.infer<typeof WardleyPositionSchema>;
export type WardleyComponent = z.infer<typeof WardleyComponentSchema>;
export type WardleyEvolutionStage = z.infer<typeof WardleyEvolutionStageEnum>;
export type WardleyVisibility = z.infer<typeof WardleyVisibilityEnum>;
export type WardleyComponentType = z.infer<typeof WardleyComponentTypeEnum>;
export type WardleyMovement = z.infer<typeof WardleyMovementEnum>;
