import { withBasePath } from "./sitePaths";

export const quadrantRouteLabels = {
	tools: "Tools",
	techniques: "Techniques",
	platforms: "Platforms",
	"languages-frameworks": "Languages & Frameworks",
} as const;

export type QuadrantRouteKey = keyof typeof quadrantRouteLabels;

type QuadrantPathOptions = {
	readonly editionId?: string;
};

const hasQuadrantRouteKey = (quadrant: string): quadrant is QuadrantRouteKey =>
	quadrant in quadrantRouteLabels;

export const toQuadrantRouteKey = (
	quadrant: string,
): QuadrantRouteKey | undefined => {
	const normalizedQuadrant = quadrant.toLowerCase();
	return hasQuadrantRouteKey(normalizedQuadrant)
		? normalizedQuadrant
		: undefined;
};

export const getQuadrantPath = (
	quadrant: string,
	options: QuadrantPathOptions = {},
): string => {
	const routeKey = toQuadrantRouteKey(quadrant) ?? "tools";
	const path = options.editionId
		? (`/edition/${options.editionId}/quadrants/${routeKey}` as const)
		: (`/quadrants/${routeKey}` as const);

	return withBasePath(path);
};
