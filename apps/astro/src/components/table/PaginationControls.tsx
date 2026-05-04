import { useMemo } from "react";
import type { Table } from "@tanstack/react-table";
import * as styles from "~components/table/PaginationControls.css";
import type { Blip } from "~components/table/types";
import { motion, AnimatePresence } from "framer-motion";

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

export const getRowCountText =
  (size: number) =>
  (totalRows: number): string =>
    size === totalRows ? `All (${totalRows})` : `${size}`;

const buttonVariants = {
  initial: { 
    scale: 1,
    rotate: 0,
    backgroundColor: "var(--color-background)",
  },
  hover: { 
    scale: 1.1,
    rotate: [0, -5, 5, 0],
    backgroundColor: "var(--color-primary)",
    color: "var(--color-white)",
    transition: {
      rotate: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 0.5
      }
    }
  },
  tap: { 
    scale: 0.9,
    rotate: 0,
    backgroundColor: "var(--color-primary-dark)",
  },
  disabled: { 
    scale: 1,
    opacity: 0.5,
    backgroundColor: "var(--color-background-disabled)",
    rotate: 0
  }
};

const selectVariants = {
  initial: { 
    scale: 1,
    y: 0
  },
  hover: { 
    scale: 1.05,
    y: -2,
    transition: {
      y: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  },
  tap: { 
    scale: 0.98,
    y: 1
  }
};

export default function PaginationControls({ table }: { table: Table<Blip> }) {
  const TOTAL_ROWS = getTotalRows(table);
  const PAGE_INCREMENT = 20;
  const paginationOptions = usePaginationOptions(TOTAL_ROWS, PAGE_INCREMENT);
  
  return (
    <div className={styles.tableControls}>
      <AnimatePresence>
        <motion.button
          key="first-page-button"
          type="button"
          className={styles.button}
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          variants={buttonVariants}
          initial="initial"
          whileHover={!table.getCanPreviousPage() ? "disabled" : "hover"}
          whileTap={!table.getCanPreviousPage() ? "disabled" : "tap"}
          animate={!table.getCanPreviousPage() ? "disabled" : "initial"}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {"<<"}
        </motion.button>
        <motion.button
          key="prev-page-button"
          type="button"
          className={styles.button}
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          variants={buttonVariants}
          initial="initial"
          whileHover={!table.getCanPreviousPage() ? "disabled" : "hover"}
          whileTap={!table.getCanPreviousPage() ? "disabled" : "tap"}
          animate={!table.getCanPreviousPage() ? "disabled" : "initial"}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {"<"}
        </motion.button>
        <motion.span
          key="page-info-span"
          className={styles.flexItemsCenterGap}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </motion.span>
        <motion.span
          key="go-to-page-span"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className={styles.input}
          />
        </motion.span>
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
        <motion.button
          key="next-page-button"
          type="button"
          className={styles.button}
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          variants={buttonVariants}
          initial="initial"
          whileHover={!table.getCanNextPage() ? "disabled" : "hover"}
          whileTap={!table.getCanNextPage() ? "disabled" : "tap"}
          animate={!table.getCanNextPage() ? "disabled" : "initial"}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {">"}
        </motion.button>
        <motion.button
          key="last-page-button"
          type="button"
          className={styles.button}
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
          variants={buttonVariants}
          initial="initial"
          whileHover={!table.getCanNextPage() ? "disabled" : "hover"}
          whileTap={!table.getCanNextPage() ? "disabled" : "tap"}
          animate={!table.getCanNextPage() ? "disabled" : "initial"}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          {">>"}
        </motion.button>
      </AnimatePresence>
    </div>
  );
}
