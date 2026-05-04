import type { CollectionEntry } from "astro:content";
import { withBasePath } from "./sitePaths";

interface BlipIdentity {
	id: string;
	name: string;
}

const slugifyBlipName = (name: string): string =>
	name
		.normalize("NFKD")
		.replace(/\p{M}+/gu, "")
		.toLowerCase()
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-");

export const getBlipSlug = ({ id, name }: BlipIdentity): string => {
	const slug = slugifyBlipName(name);

	return slug.length > 0 ? slug : `blip-${id}`;
};

export const getBlipPath = (blip: BlipIdentity): string =>
	withBasePath(`/blip/${getBlipSlug(blip)}`);

const matchesBlipRouteParam = (
	routeParam: string,
	blip: BlipIdentity,
): boolean => routeParam === blip.id || routeParam === getBlipSlug(blip);

export const findBlipByRouteParam = <T extends CollectionEntry<"blip">>(
	blips: T[],
	routeParam: string,
): T | undefined =>
	blips.find((blip) =>
		matchesBlipRouteParam(routeParam, {
			id: blip.data.id,
			name: blip.data.name,
		}),
	);
