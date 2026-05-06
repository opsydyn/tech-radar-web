import type {
	OnChangeFn,
	PaginationState,
	SortingState,
} from "@tanstack/react-table";
import useTechRadarTableReducer from "~components/table/useTechRadarTableReducer";

import type { ToggleState } from "./types";

function useTechRadarDispatchHandlers() {
	const { dispatch, state } = useTechRadarTableReducer();

	const handleTableSorting: OnChangeFn<SortingState> = (newSortingState) => {
		dispatch({
			type: "SET_SORTING",
			payload: newSortingState,
		});
	};

	const handlePagination: OnChangeFn<PaginationState> = (
		newPaginationState,
	) => {
		dispatch({
			type: "SET_PAGINATION",
			payload: newPaginationState,
		});
	};

	const handleToggleTableView = (value: ToggleState) => {
		dispatch({
			type: "SET_VIEW",
			payload: value,
		});
	};

	return {
		state,
		handleTableSorting,
		handlePagination,
		handleToggleTableView,
	};
}

export default useTechRadarDispatchHandlers;
