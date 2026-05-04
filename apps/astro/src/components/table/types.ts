import type {
  ColumnFiltersState,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";

type Quadrant = "Tools" | "Techniques" | "Platforms" | "languages-frameworks";
type Ring = "Adopt" | "Trial" | "Assess" | "Hold";
type Tags = "Frontend" | "Backend";

export type Blip = {
  id: string;
  name: string;
  quadrant: Quadrant;
  ring: Ring;
  description: string;
  hasAdr: boolean;
  tags: Array<Tags>;
};

export type Row = {
  values: Blip;
};
export type BlipKeys = keyof Blip;

export type ToggleState = "on" | "off";
export type ToggleVisibility = "show" | "hide";

export type State = {
  data: Array<Blip>;
  tableView: ToggleState;
  textFilter: string;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  tableControlsVisibility: ToggleVisibility;
};

export type Action =
  | { type: "SET_DATA"; payload: Array<Blip> }
  | { type: "SET_VIEW"; payload: ToggleState }
  | { type: "SET_TEXT_FILTER"; payload: ToggleState }
  | { type: "SET_SORTING"; payload: (sortingState: SortingState) => [] }
  | { type: "SET_COLUMN_FILTERS"; payload: ColumnFiltersState }
  | {
      type: "SET_PAGINATION";
      payload: (paginationState: PaginationState) => PaginationState;
    }
  | { type: "SET_TABLE_CONTROLS_VISIBILITY"; payload: ToggleVisibility };

export type Handler<S, T> = (currentState: S, payload: T) => S;

export type ActionHandler<S> = {
  [K in Action["type"]]: Handler<S, Extract<Action, { type: K }>["payload"]>;
};
