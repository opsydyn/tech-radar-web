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
	readonly ring?: Ring;
	readonly quadrant?: Quadrant;
	readonly status: EditionBlipStatus;
	readonly notes?: string;
	readonly relatedBlips?: RelatedBlip[];
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
	Hold: 4,
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
		if (canonicalBlip === undefined) {
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
				...canonicalBlip,
				editionId,
				movement,
				previousRing,
				quadrant: currentSnapshot.quadrant ?? canonicalBlip.quadrant,
				relatedBlips: currentSnapshot.relatedBlips,
				ring: currentSnapshot.ring,
			},
		];
	}),
});

export const getEditionIdFromSnapshotPath = (entryId: string): string =>
	entryId.split("/")[0] ?? entryId;
