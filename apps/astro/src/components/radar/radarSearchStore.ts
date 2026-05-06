import { atom } from "nanostores";
import type { Blip } from "~types/radar-types";

export type RadarAdrFilter = "all" | "has-adr" | "no-adr";
export const allRadarTagsValue = "__all__" as const;
export type RadarTagFilter = typeof allRadarTagsValue | string;

export const radarSearchTerm = atom("");
export const radarSearchableBlips = atom<readonly Blip[]>([]);
export const radarTagFilterSourceBlips = atom<readonly Blip[]>([]);
export const radarAdrFilter = atom<RadarAdrFilter>("all");
export const radarTagFilter = atom<RadarTagFilter>(allRadarTagsValue);

export const setRadarSearchTerm = (value: string) => {
	radarSearchTerm.set(value);
};

export const clearRadarSearchTerm = () => {
	radarSearchTerm.set("");
};

export const setRadarAdrFilter = (value: RadarAdrFilter) => {
	radarAdrFilter.set(value);
};

export const setRadarTagFilter = (value: RadarTagFilter) => {
	radarTagFilter.set(value);
};

export const setRadarSearchableBlips = (blips: readonly Blip[]) => {
	radarSearchableBlips.set(blips);
};

export const setRadarTagFilterSourceBlips = (blips: readonly Blip[]) => {
	radarTagFilterSourceBlips.set(blips);
};

export const clearRadarSearchableBlips = () => {
	radarSearchableBlips.set([]);
};

export const clearRadarTagFilterSourceBlips = () => {
	radarTagFilterSourceBlips.set([]);
};
