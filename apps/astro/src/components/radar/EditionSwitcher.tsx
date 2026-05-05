/**
 * EditionSwitcher Component
 *
 * Provides UI for filtering blips by tech radar edition.
 * Editions represent snapshots in time based on blip move history.
 *
 * IMPORTANT: Edition selection is MANDATORY to prevent duplicate blips.
 * A blip may appear in multiple editions, so we must always filter by a specific edition.
 */

import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { useEffect, useMemo } from "react";
import type { Edition } from "~utils/editionHelpers";
import {
	findEditionByIdentity,
	formatEditionLabel,
	getEditionIdentity,
	getLatestEdition,
	sortEditionsByDate,
} from "~utils/editionHelpers";
import * as styles from "./EditionSwitcher.css";

// 🗂️ Global store for selected edition
// Initialized with null, but will be set to latest edition on mount
export const selectedEdition = atom<Edition | null>(null);

type EditionSwitcherProps = {
	editions: Edition[];
};

/**
 * EditionSwitcher dropdown component
 *
 * Allows users to filter radar view by edition.
 * Always defaults to the latest edition on mount to prevent duplicate blips.
 */
export const EditionSwitcher = ({ editions }: EditionSwitcherProps) => {
	const selected = useStore(selectedEdition);

	// Sort editions most recent first
	const sortedEditions = useMemo(
		() => sortEditionsByDate(editions),
		[editions],
	);

	// Initialize with latest edition if not set
	useEffect(() => {
		if (!selected && sortedEditions.length > 0) {
			const latest = getLatestEdition(editions);
			if (latest) {
				selectedEdition.set(latest);
			}
		}
	}, [editions, selected, sortedEditions.length]);

	const handleChange = (value: string) => {
		const edition = findEditionByIdentity(editions, value);
		if (edition) {
			selectedEdition.set(edition);
		}
	};

	// Get current selection value for dropdown
	const currentValue =
		(selected ? getEditionIdentity(selected) : undefined) ??
		(sortedEditions[0] ? getEditionIdentity(sortedEditions[0]) : undefined) ??
		"";

	return (
		<div className={styles.container}>
			<select
				id="edition-select"
				className={styles.select}
				value={currentValue}
				onChange={(e) => handleChange(e.target.value)}
				aria-label="Select tech radar edition"
			>
				{sortedEditions.map((edition) => (
					<option
						key={getEditionIdentity(edition)}
						value={getEditionIdentity(edition)}
					>
						{formatEditionLabel(edition)}
					</option>
				))}
			</select>
		</div>
	);
};
