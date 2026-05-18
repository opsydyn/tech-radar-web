import { useStore } from "@nanostores/react";
import {
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowDown } from "pixelarticons/react/ArrowDown";
import { ArrowUp } from "pixelarticons/react/ArrowUp";
import { ChevronsVertical } from "pixelarticons/react/ChevronsVertical";
import { useMemo } from "react";
import PaginationControls from "~components/table/PaginationControls";
import * as styles from "~components/table/TechRadarTable.css";
import TechRadarTableColumns from "~components/table/TechRadarTableColumns";
// import ToggleSwitchWithFieldset from "~components/toggleSwitchWithFieldset/ToggleSwitchWithFieldset";
import type { Blip, BlipKeys } from "~components/table/types";
import { selectedEdition } from "~components/radar/editionSelectionState";
import useTechRadarDispatchHandlers from "~components/table/useTechRadarDispatchHandlers";
import { getBlipPath } from "~utils/blipRouting";
import { getEditionIdentity } from "~utils/editionHelpers";

const MOBILE_TABLE_LABELS: Partial<Record<BlipKeys, string>> = {
	hasAdr: "ADR",
	name: "Name",
	quadrant: "Quadrant",
	ring: "Ring",
	tags: "Tags",
};

const CENTERED_COLUMN_IDS = new Set<BlipKeys>(["hasAdr", "ring"]);

const HEADER_CLASS_NAMES: Partial<Record<BlipKeys, string>> = {
	hasAdr: `${styles.th} ${styles.thCenter} ${styles.thAdr}`,
	ring: `${styles.th} ${styles.thCenter} ${styles.thRing}`,
};

const DATA_CLASS_NAMES: Partial<Record<BlipKeys, string>> = {
	hasAdr: `${styles.td} ${styles.tdCenter}`,
	ring: `${styles.td} ${styles.tdCenter}`,
};

const getMobileLabel = (columnId: string): string =>
	MOBILE_TABLE_LABELS[columnId as BlipKeys] ?? columnId;

type TechRadarTableProps = {
	blips: Blip[];
};

const sortIconProps = {
	"aria-hidden": true,
	height: 14,
	width: 14,
} as const;

function TechRadarTable({ blips }: TechRadarTableProps) {
	const currentEdition = useStore(selectedEdition);
	const { state, handleTableSorting, handlePagination } =
		useTechRadarDispatchHandlers();

	const {
		tableView,
		sorting,
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
	const table = useReactTable({
		data: blips ?? defaultData,
		columns,
		state: {
			sorting,
			pagination,
		},
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: handleTableSorting,
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: handlePagination,
		enableSorting: true,
	});

	const totalRows = table.getPrePaginationRowModel().rows.length;
	const pageRows = table.getRowModel().rows.length;
	const pageCount = Math.max(table.getPageCount(), 1);
	const hasNoRows = totalRows === 0;

	const getSortIcon = (sortState: false | "asc" | "desc") => {
		if (sortState === "asc") {
			return <ArrowUp {...sortIconProps} />;
		}

		if (sortState === "desc") {
			return <ArrowDown {...sortIconProps} />;
		}

		return <ChevronsVertical {...sortIconProps} />;
	};

	const getHeaderCellClassName = (columnId: string): string =>
		HEADER_CLASS_NAMES[columnId as BlipKeys] ??
		(CENTERED_COLUMN_IDS.has(columnId as BlipKeys)
			? `${styles.th} ${styles.thCenter}`
			: styles.th);

	const getDataCellClassName = (columnId: string): string =>
		DATA_CLASS_NAMES[columnId as BlipKeys] ??
		(CENTERED_COLUMN_IDS.has(columnId as BlipKeys)
			? `${styles.td} ${styles.tdCenter}`
			: styles.td);

	const navigateToBlip = (blip: Blip): void => {
		window.location.assign(
			getBlipPath(
				blip,
				currentEdition
					? { editionId: getEditionIdentity(currentEdition) }
					: undefined,
			),
		);
	};

	const handleRowKeyDown = (
		event: React.KeyboardEvent<HTMLTableRowElement>,
		blip: Blip,
	): void => {
		if (event.key !== "Enter" && event.key !== " ") {
			return;
		}

		event.preventDefault();
		navigateToBlip(blip);
	};

	return (
		<div className={styles.tableWrapper}>
			<div className={styles.tableSummaryBar}>
				<div className={styles.tableSummaryBlock}>
					<span className={styles.tableSummaryEyebrow}>Radar table</span>
					<strong className={styles.tableSummaryPrimary}>
						{hasNoRows ? "No blips" : `${totalRows} blips`}
					</strong>
				</div>
				<div className={styles.tableSummaryMeta}>
					<span className={styles.tableSummaryChip}>
						{`${pageRows} on this page`}
					</span>
					<span className={styles.tableSummaryChip}>
						{`Page ${pageIndex + 1} / ${pageCount}`}
					</span>
				</div>
			</div>

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
										className={getHeaderCellClassName(header.id)}
										key={header.id}
										colSpan={header.colSpan}
									>
										{header.isPlaceholder ? null : header.column.getCanSort() ? (
											<button
												type="button"
												aria-label="Sort table contents by column"
												className={styles.sortControl}
												data-sorted={
													header.column.getIsSorted() ? "true" : "false"
												}
												onClick={header.column.getToggleSortingHandler()}
											>
												<span className={styles.sortLabel}>
													{flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
												</span>
												<span className={styles.sortIcon}>
													{getSortIcon(header.column.getIsSorted())}
												</span>
											</button>
										) : (
											<span className={styles.sortLabel}>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
											</span>
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
									tabIndex={0}
									aria-label={`Open blip ${row.original.name}`}
									className={
										tableView === "off"
											? `${styles.stripedRowCard} ${styles.clickableRow}`
											: `${styles.stripedRow} ${styles.clickableRow}`
									}
									onClick={() => navigateToBlip(row.original)}
									onKeyDown={(event) => handleRowKeyDown(event, row.original)}
								>
									{row.getVisibleCells().map((cell) => (
										<td
											className={
												tableView === "off"
													? styles.tdResponsive
													: getDataCellClassName(cell.getContext().column.id)
											}
											key={cell.id}
											data-label={getMobileLabel(cell.getContext().column.id)}
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
									No blips match this radar selection.
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
