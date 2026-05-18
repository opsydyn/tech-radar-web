import { useStore } from "@nanostores/react";
import { CornerUpRight } from "pixelarticons/react/CornerUpRight";
import type { CSSProperties } from "react";
import { selectedEdition } from "~components/radar/editionSelectionState";
import * as styles from "~components/BlipDetail.css";
import type { Blip } from "~types/radar-types";
import { getBlipPath } from "~utils/blipRouting";
import { formatDate, normalizeDateValue } from "~utils/dateFormatter";
import { getEditionIdentity } from "~utils/editionHelpers";

type BlipDetailProps = {
	blip: Blip | null;
	quadrantColor: string;
	editionId?: string;
};

const getDescription = (desc: unknown) =>
	typeof desc === "string" ? desc.trim() : "awaiting description";

const formatMoveDate = (dateValue: Blip["move"][number][1]): string =>
	formatDate(dateValue);

const movementClassByType = {
	go: styles.movementGo,
	grow: styles.movementGrow,
	stay: styles.movementStay,
} as const;

const detailsIconProps = {
	"aria-hidden": true,
	height: 16,
	width: 16,
} as const;

export const BlipDetail = ({
	blip,
	quadrantColor,
	editionId,
}: BlipDetailProps) => {
	const currentEdition = useStore(selectedEdition);
	const activeEditionId =
		editionId ??
		(currentEdition ? getEditionIdentity(currentEdition) : undefined);
	const quadrantStyle = {
		"--quadrant-color": quadrantColor,
		"--quadrant-color-shadow": `${quadrantColor}40`,
	} as CSSProperties;

	if (!blip) {
		return (
			<div className={styles.emptyState}>Select a blip to see details</div>
		);
	}

	return (
		<div className={styles.root} style={quadrantStyle}>
			<p className={styles.eyebrow}>Selected blip</p>
			<h1 className={styles.title}>{blip.name}</h1>

			<div className={styles.description}>
				{getDescription(blip.description)}
			</div>

			<div className={styles.meta}>
				<b>Ring:</b> {blip.ring}
			</div>

			<div className={`${styles.meta} ${styles.metaWithSpacing}`}>
				<b>Quadrant:</b> {blip.quadrant}
			</div>

			<p className={styles.card}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
				nunc vel tincidunt lacinia, nunc nisl aliquam nunc, eget aliquam nunc
				nisl eu nunc. Pellentesque habitant morbi tristique senectus et netus et
				malesuada fames ac turpis egestas.
			</p>

			<p className={styles.card}>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
				nunc vel tincidunt lacinia, nunc nisl aliquam nunc, eget aliquam nunc
				nisl eu nunc. Pellentesque habitant morbi tristique senectus et netus et
				malesuada fames ac turpis egestas.
			</p>

			{blip.move && blip.move.length > 0 && (
				<div className={styles.movementSection}>
					<h3 className={styles.movementHeading}>Movement History</h3>
					<div className={styles.movementList}>
						{blip.move.map(([type, date]) => (
							<div
								key={`${blip.id}-${type}-${normalizeDateValue(date)}`}
								className={styles.movementItem}
							>
								<span
									className={`${styles.movementType} ${movementClassByType[type]}`}
								>
									{type.toUpperCase()}
								</span>
								<span className={styles.movementDate}>
									{formatMoveDate(date)}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			<a
				href={getBlipPath(
					blip,
					activeEditionId ? { editionId: activeEditionId } : undefined,
				)}
				className={styles.detailsLink}
			>
				<span className={styles.detailsLinkText}>View full details</span>
				<CornerUpRight
					{...detailsIconProps}
					className={styles.detailsLinkIcon}
				/>
			</a>
		</div>
	);
};
