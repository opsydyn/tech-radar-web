import { useEffect, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import ExportToExcelButton from "~components/table/DownloadExcel";
import IconExpandLess from "~components/table/expand_less.svg?component";
import IconExpandMore from "~components/table/expand_more.svg?component";
import PaginationControls from "~components/table/PaginationControls";
import * as styles from "~components/table/TechRadarTable.css";
import TechRadarTableColumns from "~components/table/TechRadarTableColumns";
import useTechRadarDispatchHandlers from "~components/table/useTechRadarDispatchHandlers";
import { getMatches, typeaheadFilter } from "~components/table/utils";
// import ToggleSwitchWithFieldset from "~components/toggleSwitchWithFieldset/ToggleSwitchWithFieldset";
import type { Blip } from "~components/table/types";

const MOBILE_TABLE_HEADINGS = ["PRICE", "IMAGES", "DAYS", "VIEWS"];
const getMobileLabels = getMatches(MOBILE_TABLE_HEADINGS);

type TechRadarTableProps = {
  blips: Array<Blip>;
};

export function TechRadarTable({ blips }: TechRadarTableProps) {
  const {
    state,
    handleColumnFiltering,
    handleTableSorting,
    handleData,
    handlePagination,
    handleTextFilterChange,
    resetTypeaheadFilter,
    // handleToggleTableView,
    // handleTableControlsVisibility,
  } = useTechRadarDispatchHandlers();

  const {
    tableView,
    tableControlsVisibility,
    textFilter,
    sorting,
    data,
    columnFilters,
    pagination: { pageIndex, pageSize },
  } = state;

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const defaultData = useMemo(() => [], []);
  const columns = TechRadarTableColumns();
  console.log("blips", blips);
  const table = useReactTable({
    data: blips ?? defaultData,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: handleTableSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: handleColumnFiltering,
    getPaginationRowModel: getPaginationRowModel(),
    // @ts-ignore: not assignable to type 'OnChangeFn<PaginationState>'.
    onPaginationChange: handlePagination,
    debugTable: true,
    enableSorting: true,
    filterFns: {
      typeaheadFilter,
    },
  });

  useEffect(() => {
    handleData(blips);
    table.setGlobalFilter(textFilter);
  }, [blips, handleData, table, textFilter]);

  return (
    <div className={styles.tableWrapper}>
      {/* <button
        type="button"
        aria-label="button"
        className={styles.buttonSecondary}
        onClick={() =>
          handleTableControlsVisibility(
            tableControlsVisibility === "show" ? "hide" : "show",
          )
        }
      >
        Show utils{" "}
      </button> */}
      {tableControlsVisibility === "show" ? (
        <div>
          {/* <TechRadarTableControls /> */}
          {/* <ToggleSwitchWithFieldset
            notify={tableView}
            onToggle={handleToggleTableView}
            label={{ on: "table view", off: "card view" }}
          /> */}
          <fieldset className={styles.formControlWrapper}>
            <ExportToExcelButton data={data} />
            <label htmlFor="hidePriceCheckbox">search filter</label>
            <input
              type="text"
              value={textFilter}
              onChange={handleTextFilterChange}
              placeholder="Filter by description or VRM"
            />
            <button
              className={styles.buttonSecondary}
              type="submit"
              onClick={resetTypeaheadFilter}
              aria-label="Reset search"
            >
              Clear
            </button>
          </fieldset>
        </div>
      ) : null}

      <div
        className={
          tableView === "off"
            ? styles.tableContainerMobile
            : styles.tableContainer
        }
      >
        <table
          className={
            tableView === "off" ? styles.tableResponsive : styles.table
          }
        >
          <thead className={tableView === "off" ? styles.trhCard : styles.trh}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                className={tableView === "off" ? styles.trhCard : styles.trh}
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    className={styles.th}
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        aria-label="sort table contents by column"
                        {...{
                          className: header.column.getCanSort()
                            ? styles.buttonWithWhiteSvg
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: <IconExpandLess />,
                          desc: <IconExpandMore />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    tableView === "off"
                      ? styles.stripedRowCard
                      : styles.stripedRow
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      className={
                        tableView === "off" ? styles.tdResponsive : styles.td
                      }
                      key={cell.id}
                      data-label={getMobileLabels([
                        cell.getContext().column.id,
                      ])}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className={styles.tdNoResults} colSpan={columns.length}>
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <PaginationControls table={table} />
    </div>
  );
}

export default TechRadarTable;
