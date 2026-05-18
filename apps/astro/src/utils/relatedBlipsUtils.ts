import { getCollection } from "astro:content";
import type { RelatedBlipWithData } from "../types/radar-types";
import {
	resolveRelatedBlipsContext,
	type RelatedBlipsContext,
} from "./relatedBlipsResolver";

export type { RelatedBlipsContext } from "./relatedBlipsResolver";

export const getRelatedBlipsContext = async (
	currentBlipId: string,
	options: {
		readonly editionId?: string;
	} = {},
): Promise<RelatedBlipsContext> => {
	try {
		const [allBlipEntries, editionEntries, snapshotEntries] = await Promise.all(
			[
				getCollection("blip"),
				getCollection("editionSnapshot"),
				getCollection("editionBlipSnapshot"),
			],
		);
		const canonicalBlips = allBlipEntries.map(({ data }) => data);

		return resolveRelatedBlipsContext(
			{
				currentBlipId,
				canonicalBlips,
				editionEntries,
				snapshotEntries,
			},
			options,
		);
	} catch (error) {
		console.error("Error fetching related blips:", error);
		return {
			type: "canonical",
			relatedBlips: [],
			fallbackBlips: [],
		};
	}
};

export const getEnrichedRelatedBlips = async (
	currentBlipId: string,
	options: {
		readonly editionId?: string;
	} = {},
): Promise<RelatedBlipWithData[]> => {
	const context = await getRelatedBlipsContext(currentBlipId, options);
	return [...context.relatedBlips];
};
