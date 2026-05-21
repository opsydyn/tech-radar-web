import type { Blip, RelatedBlip } from "~types/radar-types";

type Ring = Blip["ring"];
type Quadrant = Blip["quadrant"];

export type EditionBlipStatus = "active" | "removed";

export type DerivedMovement =
	| "new"
	| "unchanged"
	| "moved-in"
	| "moved-out"
	| "removed"
	| "reintroduced";

export type EditionBlipSnapshot = {
	readonly blipId: string;
	readonly name?: Blip["name"];
	readonly ring?: Ring;
	readonly quadrant?: Quadrant;
	readonly description?: Blip["description"];
	readonly hasAdr?: Blip["hasAdr"];
	readonly adr?: Blip["adr"];
	readonly tags?: Blip["tags"];
	readonly authors?: Blip["authors"];
	readonly move?: Blip["move"];
	readonly created?: Blip["created"];
	readonly status: EditionBlipStatus;
	readonly notes?: string;
	readonly relatedBlips?: RelatedBlip[];
};

type SnapshotBackfilledBlipFields = {
	readonly name: Blip["name"];
	readonly quadrant: Quadrant;
	readonly description: Blip["description"];
	readonly hasAdr: Blip["hasAdr"];
	readonly adr?: Blip["adr"];
	readonly tags: Blip["tags"];
	readonly authors: Blip["authors"];
	readonly move: Blip["move"];
	readonly created?: Blip["created"];
};

export type ActiveEditionBlipSnapshot = EditionBlipSnapshot & {
	readonly ring: Ring;
	readonly status: "active";
};

export type RadarEditionBlip = Omit<Blip, "ring" | "quadrant"> & {
	readonly editionId: string;
	readonly movement: DerivedMovement;
	readonly previousRing?: Ring;
	readonly quadrant: Quadrant;
	readonly ring: Ring;
};

export type RadarEditionView = {
	readonly editionId: string;
	readonly blips: readonly RadarEditionBlip[];
};

type DeriveEditionMovementInput = {
	readonly current: EditionBlipSnapshot;
	readonly previous?: EditionBlipSnapshot;
};

type BuildRadarEditionViewInput = {
	readonly editionId: string;
	readonly canonicalBlips: readonly Blip[];
	readonly currentSnapshots: readonly EditionBlipSnapshot[];
	readonly previousSnapshots: readonly EditionBlipSnapshot[];
};

const ringRank: Record<Ring, number> = {
	Adopt: 1,
	Trial: 2,
	Assess: 3,
	Caution: 4,
};

const isActiveSnapshot = (
	snapshot: EditionBlipSnapshot | undefined,
): snapshot is ActiveEditionBlipSnapshot =>
	snapshot !== undefined &&
	snapshot.status === "active" &&
	snapshot.ring !== undefined;

const findSnapshotByBlipId = (
	snapshots: readonly EditionBlipSnapshot[],
	blipId: string,
): EditionBlipSnapshot | undefined =>
	snapshots.find((snapshot) => snapshot.blipId === blipId);

const findBlipById = (
	blips: readonly Blip[],
	blipId: string,
): Blip | undefined => blips.find((blip) => blip.id === blipId);

const hasDefinedValue = <T>(value: T | undefined): value is T =>
	value !== undefined;

const hasBackfilledSnapshotBlipFields = (
	snapshot: ActiveEditionBlipSnapshot,
): snapshot is ActiveEditionBlipSnapshot & SnapshotBackfilledBlipFields =>
	hasDefinedValue(snapshot.name) &&
	hasDefinedValue(snapshot.quadrant) &&
	hasDefinedValue(snapshot.description) &&
	typeof snapshot.hasAdr === "boolean" &&
	hasDefinedValue(snapshot.tags) &&
	hasDefinedValue(snapshot.authors) &&
	hasDefinedValue(snapshot.move) &&
	(snapshot.hasAdr === false || snapshot.adr !== undefined);

const buildSnapshotBackfilledBlip = (
	snapshot: ActiveEditionBlipSnapshot,
): Blip | undefined => {
	if (!hasBackfilledSnapshotBlipFields(snapshot)) {
		return undefined;
	}

	return {
		id: snapshot.blipId,
		name: snapshot.name,
		quadrant: snapshot.quadrant,
		ring: snapshot.ring,
		description: snapshot.description,
		hasAdr: snapshot.hasAdr,
		adr: snapshot.adr,
		tags: snapshot.tags,
		authors: snapshot.authors,
		move: snapshot.move,
		created: snapshot.created,
		relatedBlips: snapshot.relatedBlips,
	};
};

const buildEditionBlip = (
	snapshot: ActiveEditionBlipSnapshot,
	canonicalBlip: Blip | undefined,
): Blip | undefined => {
	const snapshotBackfilledBlip = buildSnapshotBackfilledBlip(snapshot);
	const baseBlip = snapshotBackfilledBlip ?? canonicalBlip;

	if (baseBlip === undefined) {
		return undefined;
	}

	const hasAdr = snapshot.hasAdr ?? baseBlip.hasAdr;
	const adr = hasAdr ? (snapshot.adr ?? baseBlip.adr) : undefined;

	return {
		...baseBlip,
		id: snapshot.blipId,
		name: snapshot.name ?? baseBlip.name,
		quadrant: snapshot.quadrant ?? baseBlip.quadrant,
		ring: snapshot.ring,
		description: snapshot.description ?? baseBlip.description,
		hasAdr,
		adr,
		tags: snapshot.tags ?? baseBlip.tags,
		authors: snapshot.authors ?? baseBlip.authors,
		move: snapshot.move ?? baseBlip.move,
		created: snapshot.created ?? baseBlip.created,
		relatedBlips: snapshot.relatedBlips,
	};
};

const deriveActiveMovement = (
	current: ActiveEditionBlipSnapshot,
	previous: EditionBlipSnapshot,
): DerivedMovement => {
	if (previous.status === "removed") {
		return "reintroduced";
	}

	if (!isActiveSnapshot(previous)) {
		return "new";
	}

	const currentRank = ringRank[current.ring];
	const previousRank = ringRank[previous.ring];
	const movedCloserToAdopt = currentRank < previousRank;
	const movedAwayFromAdopt = currentRank > previousRank;

	if (movedCloserToAdopt) {
		return "moved-in";
	}

	if (movedAwayFromAdopt) {
		return "moved-out";
	}

	return "unchanged";
};

export const deriveEditionMovement = ({
	current,
	previous,
}: DeriveEditionMovementInput): DerivedMovement => {
	if (current.status === "removed") {
		return previous?.status === "active" ? "removed" : "unchanged";
	}

	if (!isActiveSnapshot(current)) {
		return "unchanged";
	}

	if (previous === undefined) {
		return "new";
	}

	return deriveActiveMovement(current, previous);
};

export const buildRadarEditionView = ({
	editionId,
	canonicalBlips,
	currentSnapshots,
	previousSnapshots,
}: BuildRadarEditionViewInput): RadarEditionView => ({
	editionId,
	blips: currentSnapshots.flatMap((currentSnapshot) => {
		if (!isActiveSnapshot(currentSnapshot)) {
			return [];
		}

		const canonicalBlip = findBlipById(canonicalBlips, currentSnapshot.blipId);
		const editionBlip = buildEditionBlip(currentSnapshot, canonicalBlip);
		if (editionBlip === undefined) {
			return [];
		}

		const previousSnapshot = findSnapshotByBlipId(
			previousSnapshots,
			currentSnapshot.blipId,
		);
		const previousRing = isActiveSnapshot(previousSnapshot)
			? previousSnapshot.ring
			: undefined;
		const movement = deriveEditionMovement({
			current: currentSnapshot,
			previous: previousSnapshot,
		});

		return [
			{
				...editionBlip,
				editionId,
				movement,
				previousRing,
			},
		];
	}),
});

export const getEditionIdFromSnapshotPath = (entryId: string): string =>
	entryId.split("/")[0] ?? entryId;
