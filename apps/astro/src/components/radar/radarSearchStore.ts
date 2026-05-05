import { atom } from "nanostores";
import type { Blip } from "~types/radar-types";

export const radarSearchTerm = atom("");
export const radarSearchableBlips = atom<readonly Blip[]>([]);

export const setRadarSearchTerm = (value: string) => {
	radarSearchTerm.set(value);
};

export const clearRadarSearchTerm = () => {
	radarSearchTerm.set("");
};

export const setRadarSearchableBlips = (blips: readonly Blip[]) => {
	radarSearchableBlips.set(blips);
};

export const clearRadarSearchableBlips = () => {
	radarSearchableBlips.set([]);
};
