import type React from "react";
import { useEffect, useState } from "react";
import { BlipDetail } from "~components/BlipDetail";
import * as styles from "~components/BlipListIsland.css";
import { useBlipSearch } from "~hooks/useBlipSearch";
import type { Blip } from "~types/radar-types";

type BlipListIslandProps = {
	blips: Blip[];
	quadrant: string;
	quadrantColor: string;
};

const quadrantDefinitions = [
	{
		key: "techniques",
		title: "Techniques",
		description:
			"These include elements of a software development process, such as experience design; and ways of structuring software, such as microservices.",
	},
	{
		key: "platforms",
		title: "Platforms",
		description:
			"Things that we build software on top of such as mobile technologies like Android, virtual platforms like the JVM, or generic kinds of platforms like hybrid clouds.",
	},
	{
		key: "tools",
		title: "Tools",
		description:
			"These can be components, such as databases, software development tools, such as versions' control systems; or more generic categories of tools, such as the notion of polyglot persistence.",
	},
	{
		key: "languages-frameworks",
		title: "Languages and Frameworks",
		description:
			"These include programming languages like Java and Python but today primarily focus on frameworks like Gradle, Jetpack, and React.js.",
	},
] as const;

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
	const [selected, setSelected] = useState<Blip | null>(() => blips[0] ?? null);
	const resultsLabel = resultsCount === 1 ? "result" : "results";
	const normalizedQuadrant = quadrant.toLowerCase();

	// Update selected blip when filtered blips change
	useEffect(() => {
		if (
			filteredBlips.length > 0 &&
			(!selected || !filteredBlips.some((blip) => blip.name === selected.name))
		) {
			setSelected(filteredBlips[0]);
		}
	}, [filteredBlips, selected]);

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
				<div className={styles.quadrantIntro}>
					<p className={styles.quadrantIntroLead}>
						The quadrants are a categorization of the type of blips:
					</p>
					<ul className={styles.quadrantIntroList}>
						{quadrantDefinitions.map((definition) => (
							<li
								key={definition.key}
								className={`${styles.quadrantIntroItem} ${definition.key === normalizedQuadrant ? styles.quadrantIntroItemActive : ""}`}
							>
								<strong className={styles.quadrantIntroItemTitle}>
									{definition.title}.
								</strong>{" "}
								<span>{definition.description}</span>
							</li>
						))}
					</ul>
				</div>

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
								{resultsCount} {resultsLabel}
							</span>
						)}
						{hasSearchTerm && (
							<button
								type="button"
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
							<button
								type="button"
								key={blip.name}
								className={`${styles.blipItem} ${selected?.name === blip.name ? styles.selectedBlipItem : ""}`}
								onClick={() => setSelected(blip)}
							>
								<h2 className={styles.blipName}>{blip.name}</h2>
								<div className={styles.blipRing}>Ring: {blip.ring}</div>
							</button>
						))
					) : (
						<div>
							<p>No blips match your search criteria.</p>
							<button
								type="button"
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
