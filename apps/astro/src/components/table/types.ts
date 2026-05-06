import type {
	PaginationState,
	SortingState,
	Updater,
} from "@tanstack/react-table";

type Quadrant = "Tools" | "Techniques" | "Platforms" | "languages-frameworks";
type Ring = "Adopt" | "Trial" | "Assess" | "Hold";
type Tags = string;

export type Blip = {
	id: string;
	name: string;
	quadrant: Quadrant;
	ring: Ring;
	description: string;
	hasAdr: boolean;
	tags: Tags[];
};

export type Row = {
	values: Blip;
};
export type BlipKeys = keyof Blip;

export type ToggleState = "on" | "off";
export type ToggleVisibility = "show" | "hide";

export type State = {
	tableView: ToggleState;
	sorting: SortingState;
	pagination: PaginationState;
};

export type Action =
	| { type: "SET_VIEW"; payload: ToggleState }
	| { type: "SET_SORTING"; payload: Updater<SortingState> }
	| { type: "SET_PAGINATION"; payload: Updater<PaginationState> };
