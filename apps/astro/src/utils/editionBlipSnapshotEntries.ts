import type { EditionBlipSnapshotData } from "../content.config";
import type { Blip } from "../types/radar-types";
import { getBlipSlug } from "./blipRouting";
import { getEditionIdFromSnapshotPath } from "./editionSnapshots";

type BlipIdentity = Pick<Blip, "id" | "name">;

type EditionScopedOptions = {
	readonly editionId?: string;
};

type EditionBlipSnapshotEntryLike = {
	readonly id: string;
	readonly data: EditionBlipSnapshotData;
};

const hasDefinedValue = <T>(value: T | undefined): value is T =>
	value !== undefined;

const matchesEditionScope = (
	entryId: string,
	options: EditionScopedOptions,
): boolean => {
	if (options.editionId === undefined) {
		return true;
	}

	return getEditionIdFromSnapshotPath(entryId) === options.editionId;
};

export const matchesBlipRouteParam = (
	routeParam: string,
	blip: BlipIdentity,
): boolean => routeParam === blip.id || routeParam === getBlipSlug(blip);

export const matchesEditionBlipSnapshotRouteParam = (
	routeParam: string,
	snapshot: Pick<EditionBlipSnapshotData, "blip" | "name">,
): boolean => {
	if (routeParam === snapshot.blip) {
		return true;
	}

	if (snapshot.name === undefined) {
		return false;
	}

	return routeParam === getBlipSlug({ id: snapshot.blip, name: snapshot.name });
};

export const hasSelfContainedEditionBlipSnapshotData = (
	snapshot: EditionBlipSnapshotData,
): boolean =>
	hasDefinedValue(snapshot.name) &&
	hasDefinedValue(snapshot.quadrant) &&
	hasDefinedValue(snapshot.description) &&
	typeof snapshot.hasAdr === "boolean" &&
	hasDefinedValue(snapshot.tags) &&
	hasDefinedValue(snapshot.authors) &&
	hasDefinedValue(snapshot.move) &&
	(snapshot.hasAdr === false || snapshot.adr !== undefined);

export const findEditionBlipSnapshotEntryByRouteParam = (
	entries: readonly EditionBlipSnapshotEntryLike[],
	routeParam: string,
	options: EditionScopedOptions = {},
): EditionBlipSnapshotEntryLike | undefined =>
	entries.find(
		(entry) =>
			matchesEditionScope(entry.id, options) &&
			matchesEditionBlipSnapshotRouteParam(routeParam, entry.data),
	);

export const findEditionBlipSnapshotEntryByRouteParamTyped = <
	TEntry extends EditionBlipSnapshotEntryLike,
>(
	entries: readonly TEntry[],
	routeParam: string,
	options: EditionScopedOptions = {},
): TEntry | undefined =>
	entries.find(
		(entry) =>
			matchesEditionScope(entry.id, options) &&
			matchesEditionBlipSnapshotRouteParam(routeParam, entry.data),
	);

export const findEditionBlipSnapshotEntryByBlipId = (
	entries: readonly EditionBlipSnapshotEntryLike[],
	blipId: string,
	options: EditionScopedOptions = {},
): EditionBlipSnapshotEntryLike | undefined =>
	entries.find(
		(entry) =>
			matchesEditionScope(entry.id, options) && entry.data.blip === blipId,
	);

export const findEditionBlipSnapshotEntryByBlipIdTyped = <
	TEntry extends EditionBlipSnapshotEntryLike,
>(
	entries: readonly TEntry[],
	blipId: string,
	options: EditionScopedOptions = {},
): TEntry | undefined =>
	entries.find(
		(entry) =>
			matchesEditionScope(entry.id, options) && entry.data.blip === blipId,
	);
