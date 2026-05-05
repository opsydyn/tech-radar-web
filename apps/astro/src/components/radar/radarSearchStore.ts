import { atom } from "nanostores";
import type { Blip } from "~types/radar-types";

export type RadarAdrFilter = "all" | "has-adr" | "no-adr";

export const radarSearchTerm = atom("");
export const radarSearchableBlips = atom<readonly Blip[]>([]);
export const radarAdrFilter = atom<RadarAdrFilter>("all");

export const setRadarSearchTerm = (value: string) => {
	radarSearchTerm.set(value);
};

export const clearRadarSearchTerm = () => {
	radarSearchTerm.set("");
};

export const setRadarAdrFilter = (value: RadarAdrFilter) => {
	radarAdrFilter.set(value);
};

export const setRadarSearchableBlips = (blips: readonly Blip[]) => {
	radarSearchableBlips.set(blips);
};

export const clearRadarSearchableBlips = () => {
	radarSearchableBlips.set([]);
};
