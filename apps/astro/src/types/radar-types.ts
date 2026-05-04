type Quadrant = "Tools" | "Techniques" | "Platforms" | "languages-frameworks";
type Ring = "Adopt" | "Trial" | "Assess" | "Hold";
type Tags = "Frontend" | "Backend";

const validMoves = ["grow", "go", "stay"] as const;
export type MoveType = (typeof validMoves)[number];
export type MoveDateValue = string | Date;

export type MoveTuple = [MoveType, MoveDateValue];

export type RelationshipType =
	| "alternative"
	| "complement"
	| "migration"
	| "prerequisite"
	| "evolution"
	| "comparison"
	| "ecosystem";

export type RelatedBlip = {
	blipId: string;
	relationshipType: RelationshipType;
	reason?: string;
	context?: string;
	bidirectional: boolean;
};

export type RelatedBlipWithData = RelatedBlip & {
	blipName: string;
	blipQuadrant: Quadrant;
	blipRing: Ring;
};

export type Blip = {
	id: string;
	name: string;
	quadrant: Quadrant;
	ring: Ring;
	description: string;
	hasAdr: boolean;
	tags: Tags[];
	move: MoveTuple[];
	created: Date;
	authors: string[];
	relatedBlips?: RelatedBlip[];
};

export type BlipWithPosition = Blip & {
	position: { x: number; y: number };
};
