import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import useTechRadarTableReducer from "~components/table/useTechRadarTableReducer";

import type { Blip, ToggleState, ToggleVisibility } from "./types";

function useTechRadarDispatchHandlers() {
  const { dispatch, state } = useTechRadarTableReducer();

  const handleColumnFiltering: OnChangeFn<ColumnFiltersState> = (
    newfilterState,
  ) => {
    dispatch({
      type: "SET_COLUMN_FILTERS",
      payload: newfilterState,
    });
  };

  const handleTableSorting: OnChangeFn<SortingState> = (newSortingState) => {
    dispatch({
      type: "SET_SORTING",
      payload: newSortingState,
    });
  };

  const handleData = (blipData: Array<Blip>) => {
    console.log("blipData", blipData);
    dispatch({
      type: "SET_DATA",
      payload: blipData,
    });
  };

  const handlePagination = (
    newPaginationState: OnChangeFn<PaginationState>,
  ) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: newPaginationState,
    });
  };

  const handleTextFilterChange = (e: { target: { value: string } }) => {
    dispatch({
      type: "SET_TEXT_FILTER",
      payload: e.target.value.toLowerCase(),
    });
  };

  const resetTypeaheadFilter = () => {
    dispatch({
      type: "SET_TEXT_FILTER",
      payload: "",
    });
  };

  const handleToggleTableView = (value: ToggleState) => {
    dispatch({
      type: "SET_VIEW",
      payload: value,
    });
  };

  const handleTableControlsVisibility = (value: ToggleVisibility) => {
    dispatch({
      type: "SET_TABLE_CONTROLS_VISIBILITY",
      payload: value,
    });
  };
  return {
    state,
    handleColumnFiltering,
    handleTableSorting,
    handleData,
    handlePagination,
    handleTextFilterChange,
    resetTypeaheadFilter,
    handleToggleTableView,
    handleTableControlsVisibility,
  };
}

export default useTechRadarDispatchHandlers;
