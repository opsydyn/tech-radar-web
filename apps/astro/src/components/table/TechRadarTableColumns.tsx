import type { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import * as styles from "~components/table/TechRadarTable.css";
import type { Blip } from "~components/table/types";

const formatQuadrantLabel = (quadrant: Blip["quadrant"]): string =>
	quadrant === "languages-frameworks" ? "Languages & Frameworks" : quadrant;

function BlipTableColumns() {
	const columnHelper = createColumnHelper<Blip>();
	const columns = useMemo<ColumnDef<Blip>[]>(
		() => [
			columnHelper.accessor("name", {
				header: () => <span>Name</span>,
				cell: (info) => (
					<span className={styles.cellTextPrimary}>
						{info.getValue() as string}
					</span>
				),
			}),
			columnHelper.accessor("ring", {
				header: () => <span>Ring</span>,
				cell: (info) => (
					<span className={styles.ringBadge[info.getValue()]}>
						{info.getValue()}
					</span>
				),
			}),
			columnHelper.accessor("quadrant", {
				header: () => <span>Quadrant</span>,
				cell: (info) => (
					<span className={styles.quadrantCell}>
						{formatQuadrantLabel(info.getValue())}
					</span>
				),
			}),
			columnHelper.accessor("tags", {
				header: () => <span>Tags</span>,
				cell: (info) => {
					const tags = info.getValue() as string[];

					if (tags.length === 0) {
						return <span className={styles.cellTextSecondary}>No tags</span>;
					}

					return (
						<span className={styles.tagList}>
							{tags.map((tag) => (
								<span key={tag} className={styles.tag}>
									{tag}
								</span>
							))}
						</span>
					);
				},
			}),
			columnHelper.accessor("hasAdr", {
				header: () => <span>ADR</span>,
				cell: (info) => {
					const hasAdr = info.getValue();

					return (
						<span className={styles.adrBadge[hasAdr ? "yes" : "no"]}>
							{hasAdr ? "ADR" : "None"}
						</span>
					);
				},
			}),
		],
		[columnHelper],
	);

	return columns;
}

export default BlipTableColumns;
