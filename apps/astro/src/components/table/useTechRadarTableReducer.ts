import { functionalUpdate } from "@tanstack/react-table";
import type { Reducer } from "react";
import { useReducer } from "react";
import type { Action, State } from "~components/table/types";

const initialState: State = {
	tableView: "on",
	sorting: [],
	pagination: { pageIndex: 0, pageSize: 20 },
};

const techRadarTableReducer: Reducer<State, Action> = (
	state = initialState,
	action,
) => {
	switch (action.type) {
		case "SET_VIEW":
			return {
				...state,
				tableView: action.payload,
			};
		case "SET_SORTING":
			return {
				...state,
				sorting: functionalUpdate(action.payload, state.sorting),
			};
		case "SET_PAGINATION":
			return {
				...state,
				pagination: functionalUpdate(action.payload, state.pagination),
			};
		default:
			return state;
	}
};

export default function useTechRadarTableReducer() {
	const [state, dispatch] = useReducer(techRadarTableReducer, initialState);
	return { state, dispatch };
}
