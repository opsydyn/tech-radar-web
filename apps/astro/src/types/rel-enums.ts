/**
 * Relationship types for blip resources
 */
export const BlipRel = {
	Self: "blip:self",
	Html: "blip:html",
	Quadrant: "blip:quadrant",
	Update: "blip:update",
} as const;

/**
 * Global relationship types for API navigation
 */
export const GlobalRel = {
	Self: "global:self",
	Quadrants: "global:quadrants",
	Blips: "global:blips",
	Rings: "global:rings",
	Rels: "global:rels",
	Problems: "global:problems",
	Home: "global:home",
	Freshness: "global:freshness",
} as const;

/**
 * Type for relationship keys
 */
export type BlipRelType = keyof typeof BlipRel;
export type GlobalRelType = keyof typeof GlobalRel;

/**
 * Type for relationship values
 */
export type BlipRelValue = (typeof BlipRel)[BlipRelType];
export type GlobalRelValue = (typeof GlobalRel)[GlobalRelType];

/**
 * HTTP methods supported by the API
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
