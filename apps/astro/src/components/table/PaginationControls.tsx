import type { Table } from "@tanstack/react-table";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { ArrowBarLeft } from "pixelarticons/react/ArrowBarLeft";
import { ArrowBarRight } from "pixelarticons/react/ArrowBarRight";
import { ChevronLeft } from "pixelarticons/react/ChevronLeft";
import { ChevronRight } from "pixelarticons/react/ChevronRight";
import { useMemo } from "react";
import * as styles from "~components/table/PaginationControls.css";
import type { Blip } from "~components/table/types";

const usePaginationOptions = (totalRows: number, pageIncrement: number) => {
	const paginationOptions = useMemo(() => {
		const options = Array.from(
			{ length: Math.ceil(totalRows / pageIncrement) },
			(_, i) => (i + 1) * pageIncrement,
		);
		return totalRows <= pageIncrement
			? [totalRows]
			: [...options.filter((option) => option < totalRows), totalRows];
	}, [totalRows, pageIncrement]);

	return paginationOptions;
};

const getTotalRows = (table: Table<Blip>) => {
	if (table.getPrePaginationRowModel()?.rows?.length) {
		return table.getPrePaginationRowModel().rows.length;
	}
	return 0;
};

const getRowCountText =
	(size: number) =>
	(totalRows: number): string =>
		size === totalRows ? `All ${totalRows}` : `${size}`;

const paginationIconProps = {
	"aria-hidden": true,
	height: 16,
	width: 16,
} as const;

const buttonVariants: Variants = {
	initial: {
		scale: 1,
		rotate: 0,
	},
	hover: {
		scale: 1.04,
		rotate: [0, -5, 5, 0],
		transition: {
			rotate: {
				repeat: Number.POSITIVE_INFINITY,
				duration: 0.5,
			},
		},
	},
	tap: {
		scale: 0.96,
		rotate: 0,
	},
	disabled: {
		scale: 1,
		opacity: 0.5,
		rotate: 0,
	},
};

const selectVariants: Variants = {
	initial: {
		scale: 1,
		y: 0,
	},
	hover: {
		scale: 1.05,
		y: -2,
		transition: {
			y: {
				type: "spring",
				stiffness: 300,
				damping: 10,
			},
		},
	},
	tap: {
		scale: 0.98,
		y: 1,
	},
};

export default function PaginationControls({ table }: { table: Table<Blip> }) {
	const TOTAL_ROWS = getTotalRows(table);
	const PAGE_INCREMENT = 20;
	const paginationOptions = usePaginationOptions(TOTAL_ROWS, PAGE_INCREMENT);
	const canGoToPreviousPage = table.getCanPreviousPage();
	const canGoToNextPage = table.getCanNextPage();
	const currentPage = table.getState().pagination.pageIndex + 1;
	const pageCount = table.getPageCount();

	return (
		<div className={styles.tableControls}>
			<AnimatePresence>
				<motion.div className={styles.pageControlCluster}>
					<motion.button
						key="first-page-button"
						type="button"
						className={styles.button}
						onClick={() => table.setPageIndex(0)}
						disabled={!canGoToPreviousPage}
						variants={buttonVariants}
						initial="initial"
						aria-label="Go to first page"
						whileHover={canGoToPreviousPage ? "hover" : "disabled"}
						whileTap={canGoToPreviousPage ? "tap" : "disabled"}
						animate={canGoToPreviousPage ? "initial" : "disabled"}
						transition={{ type: "spring", stiffness: 400, damping: 15 }}
					>
						<ArrowBarLeft {...paginationIconProps} />
					</motion.button>
					<motion.button
						key="prev-page-button"
						type="button"
						className={styles.button}
						onClick={() => table.previousPage()}
						disabled={!canGoToPreviousPage}
						variants={buttonVariants}
						initial="initial"
						aria-label="Go to previous page"
						whileHover={canGoToPreviousPage ? "hover" : "disabled"}
						whileTap={canGoToPreviousPage ? "tap" : "disabled"}
						animate={canGoToPreviousPage ? "initial" : "disabled"}
						transition={{ type: "spring", stiffness: 400, damping: 15 }}
					>
						<ChevronLeft {...paginationIconProps} />
					</motion.button>
					<motion.span
						key="page-info-span"
						className={styles.pageInfo}
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
					>
						Page{" "}
						<strong className={styles.pageInfoStrong}>
							{`${currentPage} of ${pageCount}`}
						</strong>
					</motion.span>
					<motion.button
						key="next-page-button"
						type="button"
						className={styles.button}
						onClick={() => table.nextPage()}
						disabled={!canGoToNextPage}
						variants={buttonVariants}
						initial="initial"
						aria-label="Go to next page"
						whileHover={canGoToNextPage ? "hover" : "disabled"}
						whileTap={canGoToNextPage ? "tap" : "disabled"}
						animate={canGoToNextPage ? "initial" : "disabled"}
						transition={{ type: "spring", stiffness: 400, damping: 15 }}
					>
						<ChevronRight {...paginationIconProps} />
					</motion.button>
					<motion.button
						key="last-page-button"
						type="button"
						className={styles.button}
						onClick={() => table.setPageIndex(pageCount - 1)}
						disabled={!canGoToNextPage}
						variants={buttonVariants}
						initial="initial"
						aria-label="Go to last page"
						whileHover={canGoToNextPage ? "hover" : "disabled"}
						whileTap={canGoToNextPage ? "tap" : "disabled"}
						animate={canGoToNextPage ? "initial" : "disabled"}
						transition={{ type: "spring", stiffness: 400, damping: 15 }}
					>
						<ArrowBarRight {...paginationIconProps} />
					</motion.button>
				</motion.div>
				<motion.div className={styles.pageControlCluster}>
					<motion.label
						key="go-to-page-span"
						className={styles.pageField}
						initial={{ opacity: 1 }}
						animate={{ opacity: 1 }}
					>
						<span>Go to page</span>
						<input
							type="number"
							min={1}
							max={Math.max(pageCount, 1)}
							defaultValue={currentPage}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								table.setPageIndex(page);
							}}
							className={styles.input}
						/>
					</motion.label>
					<motion.select
						key="page-size-select"
						value={table.getState().pagination.pageSize}
						onChange={(e) => {
							table.setPageSize(Number(e.target.value));
						}}
						className={styles.select}
						variants={selectVariants}
						initial="initial"
						whileHover="hover"
						whileTap="tap"
						transition={{ type: "spring", stiffness: 400, damping: 15 }}
					>
						{paginationOptions.map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								{getRowCountText(pageSize)(TOTAL_ROWS)}
							</option>
						))}
					</motion.select>
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
