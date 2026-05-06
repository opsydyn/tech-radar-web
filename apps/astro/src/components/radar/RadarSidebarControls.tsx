import { useStore } from "@nanostores/react";
import { useEffect, useMemo } from "react";
import { EditionSwitcher } from "~components/radar/EditionSwitcher";
import { getAvailableRadarTags } from "~hooks/useBlipSearch";
import type { Edition } from "~utils/editionHelpers";
import * as styles from "./RadarSidebar.css";
import {
	allRadarTagsValue,
	type RadarAdrFilter,
	radarAdrFilter,
	radarTagFilter,
	radarTagFilterSourceBlips,
	setRadarAdrFilter,
	setRadarTagFilter,
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
	const tagFilter = useStore(radarTagFilter);
	const tagFilterSourceBlips = useStore(radarTagFilterSourceBlips);
	const availableTags = useMemo(
		() => getAvailableRadarTags(tagFilterSourceBlips),
		[tagFilterSourceBlips],
	);

	useEffect(() => {
		if (tagFilter === allRadarTagsValue) {
			return;
		}

		if (!availableTags.includes(tagFilter)) {
			setRadarTagFilter(allRadarTagsValue);
		}
	}, [availableTags, tagFilter]);

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
			<label className={styles.sidebarFilterField}>
				<span className={styles.sidebarFilterLabel}>Tags</span>
				<select
					className={styles.sidebarFilterSelect}
					value={tagFilter}
					onChange={(event) => setRadarTagFilter(event.target.value)}
					aria-label="Filter blips by tag"
				>
					<option value={allRadarTagsValue}>All</option>
					{availableTags.map((tag) => (
						<option key={tag} value={tag}>
							{tag}
						</option>
					))}
				</select>
			</label>
		</>
	);
};
