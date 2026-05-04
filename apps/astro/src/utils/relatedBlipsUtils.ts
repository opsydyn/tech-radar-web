import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type {
	Blip,
	RelatedBlip,
	RelatedBlipWithData,
} from "../types/radar-types";

/**
 * Pure function to enrich a related blip with additional data
 */
const enrichRelatedBlip = (
	relatedBlip: RelatedBlip,
	allBlips: Array<CollectionEntry<"blip">>,
): RelatedBlipWithData | null => {
	const targetBlip = allBlips.find(
		(blip) => blip.data.id === relatedBlip.blipId,
	);

	if (!targetBlip) {
		console.warn(`Related blip with id ${relatedBlip.blipId} not found`);
		return null;
	}

	return {
		...relatedBlip,
		blipName: targetBlip.data.name,
		blipQuadrant: targetBlip.data.quadrant,
		blipRing: targetBlip.data.ring,
	};
};

/**
 * Pure function to get bidirectional relationships
 */
const getBidirectionalRelationships = (
	currentBlipId: string,
	allBlips: Array<CollectionEntry<"blip">>,
): Array<RelatedBlip> => {
	return allBlips
		.filter((blip) => blip.data.id !== currentBlipId)
		.flatMap(
			(blip) =>
				blip.data.relatedBlips
					?.filter(
						(related) =>
							related.blipId === currentBlipId && related.bidirectional,
					)
					.map(
						(related: {
							relationshipType: any;
							reason: any;
							context: any;
						}) => ({
							blipId: blip.data.id,
							relationshipType: related.relationshipType,
							reason: related.reason,
							context: related.context,
							bidirectional: true,
						}),
					) ?? [],
		);
};

/**
 * Fetches and enriches related blips data for a given blip
 */
export const getEnrichedRelatedBlips = async (
	currentBlipId: string,
): Promise<Array<RelatedBlipWithData>> => {
	try {
		const allBlips = await getCollection("blip");
		const currentBlip = allBlips.find((blip) => blip.data.id === currentBlipId);

		if (!currentBlip) {
			console.warn(`Blip with id ${currentBlipId} not found`);
			return [];
		}

		// Get direct relationships
		const directRelationships = currentBlip.data.relatedBlips ?? [];

		// Get bidirectional relationships
		const bidirectionalRelationships = getBidirectionalRelationships(
			currentBlipId,
			allBlips,
		);

		// Combine and deduplicate relationships
		const allRelationships = [
			...directRelationships,
			...bidirectionalRelationships,
		];
		const uniqueRelationships = allRelationships.filter(
			(relationship, index, self) =>
				index ===
				self.findIndex(
					(r) =>
						r.blipId === relationship.blipId &&
						r.relationshipType === relationship.relationshipType,
				),
		);

		// Enrich relationships with blip data
		const enrichedRelationships = uniqueRelationships
			.map((relationship) => enrichRelatedBlip(relationship, allBlips))
			.filter(
				(relationship): relationship is RelatedBlipWithData =>
					relationship !== null,
			);

		return enrichedRelationships;
	} catch (error) {
		console.error("Error fetching related blips:", error);
		return [];
	}
};

/**
 * Pure function to filter relationships by type
 */
export const filterRelationshipsByType = (
	relationships: Array<RelatedBlipWithData>,
	type: string,
): Array<RelatedBlipWithData> =>
	relationships.filter(
		(relationship) => relationship.relationshipType === type,
	);

/**
 * Pure function to get unique relationship types from relationships
 */
export const getUniqueRelationshipTypes = (
	relationships: Array<RelatedBlipWithData>,
): Array<string> => [
	...new Set(
		relationships.map((relationship) => relationship.relationshipType),
	),
];
