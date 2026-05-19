import type { Blip } from "~types/radar-types";
import type { EditionBlipSnapshotData, EditionData } from "../content.config";
import {
	buildRadarEditionView,
	type EditionBlipSnapshot,
	getEditionIdFromSnapshotPath,
	type RadarEditionView,
} from "./editionSnapshots";

export type RadarEditionMetadata = {
	readonly id: string;
	readonly number: number;
	readonly title: string;
	readonly date: Date;
};

export type RadarEditionViewWithMetadata = RadarEditionView & {
	readonly edition: RadarEditionMetadata;
};

type CollectionEntryLike<TData> = {
	readonly id: string;
	readonly data: TData;
};

type BuildRadarEditionViewsInput = {
	readonly canonicalBlips: readonly Blip[];
	readonly editionEntries: readonly CollectionEntryLike<EditionData>[];
	readonly snapshotEntries: readonly CollectionEntryLike<EditionBlipSnapshotData>[];
};

type EditionSnapshotsById = ReadonlyMap<string, readonly EditionBlipSnapshot[]>;

const toEditionMetadata = ({ data }: CollectionEntryLike<EditionData>) => ({
	id: data.id,
	number: data.number,
	title: data.title,
	date: data.date,
});

const sortEditionsOldestFirst = (
	editions: readonly RadarEditionMetadata[],
): readonly RadarEditionMetadata[] =>
	[...editions].sort((left, right) => {
		const dateDelta = left.date.getTime() - right.date.getTime();
		return dateDelta === 0 ? left.number - right.number : dateDelta;
	});

const toEditionBlipSnapshot = ({
	data,
}: CollectionEntryLike<EditionBlipSnapshotData>): EditionBlipSnapshot => ({
	blipId: data.blip,
	authors: data.authors,
	created: data.created,
	description: data.description,
	adr: data.adr,
	hasAdr: data.hasAdr,
	move: data.move,
	name: data.name,
	notes: data.notes,
	quadrant: data.quadrant,
	relatedBlips: data.relatedBlips,
	ring: data.ring,
	status: data.status,
	tags: data.tags,
});

const appendSnapshot = (
	groupedSnapshots: Map<string, EditionBlipSnapshot[]>,
	editionId: string,
	snapshot: EditionBlipSnapshot,
): Map<string, EditionBlipSnapshot[]> => {
	const existingSnapshots = groupedSnapshots.get(editionId) ?? [];
	groupedSnapshots.set(editionId, [...existingSnapshots, snapshot]);
	return groupedSnapshots;
};

const groupSnapshotsByEditionId = (
	snapshotEntries: readonly CollectionEntryLike<EditionBlipSnapshotData>[],
): EditionSnapshotsById =>
	snapshotEntries.reduce((groupedSnapshots, snapshotEntry) => {
		const editionId = getEditionIdFromSnapshotPath(snapshotEntry.id);
		const snapshot = toEditionBlipSnapshot(snapshotEntry);
		return appendSnapshot(groupedSnapshots, editionId, snapshot);
	}, new Map<string, EditionBlipSnapshot[]>());

export const buildRadarEditionViewsFromCollections = ({
	canonicalBlips,
	editionEntries,
	snapshotEntries,
}: BuildRadarEditionViewsInput): readonly RadarEditionViewWithMetadata[] => {
	const snapshotsByEditionId = groupSnapshotsByEditionId(snapshotEntries);
	const editionsOldestFirst = sortEditionsOldestFirst(
		editionEntries.map(toEditionMetadata),
	);
	const viewsOldestFirst = editionsOldestFirst.map((edition, index) => {
		const previousEdition = editionsOldestFirst[index - 1];
		const currentSnapshots = snapshotsByEditionId.get(edition.id) ?? [];
		const previousSnapshots = previousEdition
			? (snapshotsByEditionId.get(previousEdition.id) ?? [])
			: [];
		const editionView = buildRadarEditionView({
			editionId: edition.id,
			canonicalBlips,
			currentSnapshots,
			previousSnapshots,
		});

		return {
			...editionView,
			edition,
		};
	});

	return [...viewsOldestFirst].reverse();
};
