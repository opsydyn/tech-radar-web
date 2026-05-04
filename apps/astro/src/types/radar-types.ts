type Quadrant = "Tools" | "Techniques" | "Platforms" | "languages-frameworks";
type Ring = "Adopt" | "Trial" | "Assess" | "Hold";
type Tags = "Frontend" | "Backend";

const validMoves = ["grow", "go", "stay"] as const;
type MoveType = (typeof validMoves)[number];

type MoveTuple = [MoveType, string];

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
	tags: Array<Tags>;
	move: Array<MoveTuple>;
	created: Date;
	authors: Array<string>;
	relatedBlips?: Array<RelatedBlip>;
};

export type BlipWithPosition = Blip & {
	position: { x: number; y: number };
};

export type Adr = {
	id: string;
	title: string;
	date: string;
	created: Date;
	status: string;
	author: string;
	reviewers: Array<string>;
};
