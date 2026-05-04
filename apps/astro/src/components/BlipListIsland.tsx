import type React from "react";
import { useEffect, useState } from "react";
import type { Blip } from "~types/radar-types";
import { BlipDetail } from "~components/BlipDetail";
import * as styles from "~components/BlipListIsland.css";
import { useBlipSearch } from "~hooks/useBlipSearch";
import { withBasePath } from "~utils/sitePaths";

type BlipListIslandProps = {
	blips: Blip[];
	quadrant: string;
	quadrantColor: string;
};

const BlipListIsland: React.FC<BlipListIslandProps> = ({
	blips,
	quadrant,
	quadrantColor,
}) => {
	// Use our custom search hook
	const {
		searchTerm,
		filteredBlips,
		handleSearchChange,
		clearSearch,
		resultsCount,
		hasSearchTerm,
	} = useBlipSearch(blips);

	// State for selected blip
	const [selected, setSelected] = useState<Blip | null>(null);
	const homePath = withBasePath("/");

	// Update selected blip when filtered blips change
	useEffect(() => {
		if (
			filteredBlips.length > 0 &&
			(!selected || !filteredBlips.some((blip) => blip.name === selected.name))
		) {
			setSelected(filteredBlips[0]);
		}
	}, [filteredBlips, selected]);

	// Initialize selected blip on first render
	useEffect(() => {
		if (blips.length > 0 && !selected) {
			setSelected(blips[0]);
		}
	}, [blips, selected]);

	return (
		<div
			className={styles.container}
			style={
				{
					"--quadrant-color": quadrantColor,
					"--quadrant-color-solid": quadrantColor,
					"--quadrant-color-dark": quadrantColor,
				} as React.CSSProperties
			}
		>
			{/* Header container with heading and search */}
			<div className={styles.headerContainer}>
				{/* Main heading */}
				<h1 className={styles.mainHeading}>{quadrant}</h1>

				{/* Search container */}
				<div className={styles.searchContainer}>
					<input
						type="text"
						className={styles.searchInput}
						placeholder="Search blips..."
						value={searchTerm}
						onChange={handleSearchChange}
						aria-label="Search blips"
					/>
					<div className={styles.searchFooter}>
						{hasSearchTerm && (
							<span className={styles.searchResultsCount}>
								{resultsCount} result{resultsCount !== 1 ? "s" : ""}
							</span>
						)}
						{hasSearchTerm && (
							<button
								className={styles.searchClearButton}
								onClick={clearSearch}
								aria-label="Clear search"
							>
								Clear
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Home link - positioned absolutely for layout */}
			<a href={homePath} className={styles.homeLink}>
				<span aria-hidden="true" className={styles.arrowIcon}>
					⬅
				</span>{" "}
				Home
			</a>

			{/* Main content container */}
			<div className={styles.contentContainer}>
				{/* Blip list panel */}
				<div className={`${styles.scrollPanel} ${styles.scrollPanelFirefox}`}>
					<div>
						<span className={styles.blipCount}>
							Number of blips: {filteredBlips.length}
							{hasSearchTerm && ` (filtered from ${blips.length})`}
						</span>
					</div>

					{filteredBlips.length > 0 ? (
						filteredBlips.map((blip) => (
							<div
								key={blip.name}
								className={`${styles.blipItem} ${selected?.name === blip.name ? styles.selectedBlipItem : ""}`}
								onClick={() => setSelected(blip)}
							>
								<h2 className={styles.blipName}>{blip.name}</h2>
								<div className={styles.blipRing}>Ring: {blip.ring}</div>
							</div>
						))
					) : (
						<div>
							<p>No blips match your search criteria.</p>
							<button
								className={styles.searchClearButton}
								onClick={clearSearch}
							>
								Clear search
							</button>
						</div>
					)}
				</div>

				{/* Blip detail panel */}
				<div className={styles.detailPanel}>
					<BlipDetail blip={selected} quadrantColor={quadrantColor} />
				</div>
			</div>
		</div>
	);
};

export default BlipListIsland;
