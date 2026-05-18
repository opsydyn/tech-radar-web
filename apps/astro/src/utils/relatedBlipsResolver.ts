import type { EditionBlipSnapshotData, EditionData } from "../content.config";
import type {
	Blip,
	RelatedBlip,
	RelatedBlipWithData,
} from "../types/radar-types";
import { buildRadarEditionViewsFromCollections } from "./editionSnapshotAdapter";

type CollectionEntryLike<TData> = {
	readonly id: string;
	readonly data: TData;
};

export type RelatedBlipsContext =
	| {
			readonly type: "snapshot";
			readonly editionId: string;
			readonly relatedBlips: readonly RelatedBlipWithData[];
			readonly fallbackBlips: readonly Blip[];
	  }
	| {
			readonly type: "canonical";
			readonly relatedBlips: readonly RelatedBlipWithData[];
			readonly fallbackBlips: readonly Blip[];
	  };

type SnapshotRelatedBlipsResolution =
	| {
			readonly type: "snapshot";
			readonly editionId: string;
			readonly relatedBlips: readonly RelatedBlipWithData[];
			readonly fallbackBlips: readonly Blip[];
	  }
	| {
			readonly type: "unavailable";
			readonly reason:
				| "edition-not-found"
				| "no-snapshot-editions"
				| "blip-not-in-latest-edition"
				| "blip-not-in-requested-edition";
	  };

type ResolveRelatedBlipsContextInput = {
	readonly currentBlipId: string;
	readonly canonicalBlips: readonly Blip[];
	readonly editionEntries: readonly CollectionEntryLike<EditionData>[];
	readonly snapshotEntries: readonly CollectionEntryLike<EditionBlipSnapshotData>[];
};

type ResolveRelatedBlipsContextOptions = {
	readonly editionId?: string;
};

const enrichRelatedBlip = (
	relatedBlip: RelatedBlip,
	allBlips: readonly Blip[],
): RelatedBlipWithData | null => {
	const targetBlip = allBlips.find((blip) => blip.id === relatedBlip.blipId);

	if (!targetBlip) {
		console.warn(`Related blip with id ${relatedBlip.blipId} not found`);
		return null;
	}

	return {
		...relatedBlip,
		blipName: targetBlip.name,
		blipQuadrant: targetBlip.quadrant,
		blipRing: targetBlip.ring,
	};
};

const getDirectRelationships = (
	currentBlipId: string,
	allBlips: readonly Blip[],
): readonly RelatedBlip[] =>
	allBlips.find((blip) => blip.id === currentBlipId)?.relatedBlips ?? [];

const getBidirectionalRelationships = (
	currentBlipId: string,
	allBlips: readonly Blip[],
): readonly RelatedBlip[] =>
	allBlips
		.filter((blip) => blip.id !== currentBlipId)
		.flatMap(
			(blip) =>
				blip.relatedBlips
					?.filter(
						(relatedBlip) =>
							relatedBlip.blipId === currentBlipId && relatedBlip.bidirectional,
					)
					.map((relatedBlip) => ({
						blipId: blip.id,
						relationshipType: relatedBlip.relationshipType,
						reason: relatedBlip.reason,
						context: relatedBlip.context,
						bidirectional: true,
					})) ?? [],
		);

const deduplicateRelationships = (
	relationships: readonly RelatedBlip[],
): readonly RelatedBlip[] =>
	relationships.filter(
		(relationship, index, allRelationships) =>
			index ===
			allRelationships.findIndex(
				(candidateRelationship) =>
					candidateRelationship.blipId === relationship.blipId &&
					candidateRelationship.relationshipType ===
						relationship.relationshipType,
			),
	);

const enrichRelationships = (
	currentBlipId: string,
	allBlips: readonly Blip[],
): readonly RelatedBlipWithData[] => {
	const directRelationships = getDirectRelationships(currentBlipId, allBlips);
	const bidirectionalRelationships = getBidirectionalRelationships(
		currentBlipId,
		allBlips,
	);
	const uniqueRelationships = deduplicateRelationships([
		...directRelationships,
		...bidirectionalRelationships,
	]);

	return uniqueRelationships
		.map((relationship) => enrichRelatedBlip(relationship, allBlips))
		.filter(
			(relationship): relationship is RelatedBlipWithData =>
				relationship !== null,
		);
};

const buildFallbackBlips = (
	currentBlipId: string,
	allBlips: readonly Blip[],
): readonly Blip[] => {
	const currentBlip = allBlips.find((blip) => blip.id === currentBlipId);

	if (!currentBlip) {
		console.warn(`Blip with id ${currentBlipId} not found`);
		return [];
	}

	return allBlips
		.filter(
			(blip) =>
				blip.quadrant === currentBlip.quadrant && blip.id !== currentBlipId,
		)
		.slice(0, 3);
};

const resolveSnapshotRelatedBlipsForView = ({
	currentBlipId,
	editionId,
	viewBlips,
}: {
	readonly currentBlipId: string;
	readonly editionId: string;
	readonly viewBlips: readonly Blip[];
}): SnapshotRelatedBlipsResolution => {
	const currentEditionBlip = viewBlips.find(
		(blip) => blip.id === currentBlipId,
	);

	if (!currentEditionBlip) {
		return {
			type: "unavailable",
			reason: "blip-not-in-requested-edition",
		};
	}

	return {
		type: "snapshot",
		editionId,
		relatedBlips: enrichRelationships(currentBlipId, viewBlips),
		fallbackBlips: buildFallbackBlips(currentBlipId, viewBlips),
	};
};

export const resolveSnapshotRelatedBlips = (
	{
		currentBlipId,
		canonicalBlips,
		editionEntries,
		snapshotEntries,
	}: ResolveRelatedBlipsContextInput,
	options: ResolveRelatedBlipsContextOptions = {},
): SnapshotRelatedBlipsResolution => {
	const editionViews = buildRadarEditionViewsFromCollections({
		canonicalBlips,
		editionEntries,
		snapshotEntries,
	});
	const requestedEditionId = options.editionId;
	const requestedEditionView = requestedEditionId
		? editionViews.find(
				({ edition }) =>
					edition.id === requestedEditionId ||
					edition.number.toString() === requestedEditionId,
			)
		: undefined;
	const latestEditionView = editionViews[0];

	if (requestedEditionId) {
		if (!requestedEditionView) {
			return {
				type: "unavailable",
				reason: "edition-not-found",
			};
		}

		const snapshotContext = resolveSnapshotRelatedBlipsForView({
			currentBlipId,
			editionId: requestedEditionView.edition.id,
			viewBlips: requestedEditionView.blips,
		});

		return snapshotContext.type === "snapshot"
			? snapshotContext
			: {
					type: "unavailable",
					reason: "blip-not-in-requested-edition",
				};
	}

	if (!latestEditionView) {
		return {
			type: "unavailable",
			reason: "no-snapshot-editions",
		};
	}

	const latestSnapshotContext = resolveSnapshotRelatedBlipsForView({
		currentBlipId,
		editionId: latestEditionView.edition.id,
		viewBlips: latestEditionView.blips,
	});

	if (latestSnapshotContext.type !== "snapshot") {
		return {
			type: "unavailable",
			reason: "blip-not-in-latest-edition",
		};
	}

	return latestSnapshotContext;
};

export const resolveRelatedBlipsContext = (
	input: ResolveRelatedBlipsContextInput,
	options: ResolveRelatedBlipsContextOptions = {},
): RelatedBlipsContext => {
	const snapshotResolution = resolveSnapshotRelatedBlips(input, options);
	const snapshotRelationshipsAvailable = snapshotResolution.type === "snapshot";

	if (snapshotRelationshipsAvailable) {
		return snapshotResolution;
	}

	return {
		type: "canonical",
		relatedBlips: enrichRelationships(
			input.currentBlipId,
			input.canonicalBlips,
		),
		fallbackBlips: buildFallbackBlips(
			input.currentBlipId,
			input.canonicalBlips,
		),
	};
};
