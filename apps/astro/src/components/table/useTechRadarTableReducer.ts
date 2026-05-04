import { useReducer } from "react";
import type { Reducer, ReducerWithoutAction } from "react";
import type { Action, ActionHandler, State } from "~components/table/types";

const initialState: State = {
  data: [],
  tableView: "off",
  textFilter: "",
  sorting: [],
  columnFilters: [],
  pagination: { pageIndex: 0, pageSize: 20 },
  tableControlsVisibility: "hide",
};

const actionHandler: ActionHandler<State> = {
  SET_DATA: (currentState, payload) => ({
    ...currentState,
    data: payload,
  }),
  SET_VIEW: (currentState, payload) => ({
    ...currentState,
    tableView: payload,
  }),
  SET_TEXT_FILTER: (currentState, payload) => ({
    ...currentState,
    textFilter: payload,
  }),
  SET_SORTING: (currentState, payload) => ({
    ...currentState,
    sorting: payload(currentState.sorting),
  }),
  SET_COLUMN_FILTERS: (currentState, payload) => ({
    ...currentState,
    columnFilters: payload,
  }),
  SET_PAGINATION: (currentState, payload) => ({
    ...currentState,
    pagination: payload(currentState.pagination),
  }),
  SET_TABLE_CONTROLS_VISIBILITY: (currentState, payload) => ({
    ...currentState,
    tableControlsVisibility: payload,
  }),
};

const techRadarTableReducer:
  | Reducer<State, Action>
  | ReducerWithoutAction<State> = (state = initialState, action: Action) => {
  const handler = actionHandler[action.type];
  // @ts-ignore: not assignable to parameter of type 'never'.
  return handler ? handler(state, action.payload) : state;
};

export default function useTechRadarTableReducer() {
  const [state, dispatch] = useReducer(techRadarTableReducer, initialState);
  return { state, dispatch };
}
