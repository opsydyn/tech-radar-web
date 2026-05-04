import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import type { Blip } from "~components/table/types";

function BlipTableColumns() {
  const columnHelper = createColumnHelper<Blip>();
  const columns = useMemo<Array<ColumnDef<Blip, any>>>(
    () => [
      columnHelper.accessor("name", {
        header: () => <span>Name</span>,
        cell: (info) => info.getValue() as string,
      }),
      columnHelper.accessor("ring", {
        header: () => <span>Ring</span>,
        cell: (info) => <i>{info.getValue()}</i>,
      }),
      columnHelper.accessor("quadrant", {
        header: () => "QUADRANT",
        cell: (info) => <span>{info.renderValue()}</span>,
      }),
      // columnHelper.accessor("description", {
      //   header: "DESCRIPTION",
      //   cell: (info) => <i>{info.getValue()}</i>,
      // }),
      columnHelper.accessor("tags", {
        header: "TAGS",
        cell: (info) => <span>{info.renderValue()}</span>,
      }),
      columnHelper.accessor("hasAdr", {
        header: "HAS_ADR",
        cell: (info) => <i>{info.getValue()}</i>,
      }),
    ],
    [columnHelper],
  );
  return columns;
}

export default BlipTableColumns;
