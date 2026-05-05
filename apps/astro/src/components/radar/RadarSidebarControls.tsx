import { useStore } from "@nanostores/react";
import { EditionSwitcher } from "~components/radar/EditionSwitcher";
import type { Edition } from "~utils/editionHelpers";
import * as styles from "./RadarSidebar.css";
import {
	type RadarAdrFilter,
	radarAdrFilter,
	setRadarAdrFilter,
} from "./radarSearchStore";

const adrFilterOptions: readonly { label: string; value: RadarAdrFilter }[] = [
	{ label: "All", value: "all" },
	{ label: "Has ADR", value: "has-adr" },
	{ label: "No ADR", value: "no-adr" },
] as const;

type RadarSidebarControlsProps = {
	editions: Edition[];
};

export const RadarSidebarControls = ({
	editions,
}: RadarSidebarControlsProps) => {
	const adrFilter = useStore(radarAdrFilter);

	return (
		<>
			<EditionSwitcher editions={editions} />
			<label className={styles.sidebarFilterField}>
				<span className={styles.sidebarFilterLabel}>ADR</span>
				<select
					className={styles.sidebarFilterSelect}
					value={adrFilter}
					onChange={(event) =>
						setRadarAdrFilter(event.target.value as RadarAdrFilter)
					}
					aria-label="Filter blips by ADR availability"
				>
					{adrFilterOptions.map((option) => (
						<option key={option.value} value={option.value}>
							{option.label}
						</option>
					))}
				</select>
			</label>
		</>
	);
};
