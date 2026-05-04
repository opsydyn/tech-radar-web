import { useMemo } from "react";
import { getBlipPath } from "~utils/blipRouting";
import * as styles from "../pages/blip/Blip.css";
import type {
	RelatedBlipWithData,
	RelationshipType,
} from "../types/radar-types";

// Fluent UI Icons
import {
	ArrowLeftFilled,
	ArrowSyncFilled,
	DataTrendingFilled,
	GlobeFilled,
	LinkSquare20Filled,
	ScalesFilled,
	SearchFilled,
} from "@fluentui/react-icons";

type RelatedBlipsSectionProps = {
	relatedBlips: Array<RelatedBlipWithData>;
	currentBlipName: string;
};

const relationshipLabels: Record<RelationshipType, string> = {
	alternative: "Alternative",
	complement: "Complement",
	migration: "Migration Path",
	prerequisite: "Prerequisite",
	evolution: "Evolution",
	comparison: "Comparison",
	ecosystem: "Ecosystem",
} as const;

const relationshipIcons: Record<
	RelationshipType,
	React.ComponentType<{ style?: React.CSSProperties; "aria-label"?: string }>
> = {
	alternative: ScalesFilled,
	complement: LinkSquare20Filled,
	migration: ArrowSyncFilled,
	prerequisite: ArrowLeftFilled,
	evolution: DataTrendingFilled,
	comparison: SearchFilled,
	ecosystem: GlobeFilled,
} as const;

const relationshipColors: Record<RelationshipType, string> = {
	alternative: "#4ade80", // Light green
	complement: "#60a5fa", // Light blue
	migration: "#f87171", // Light red
	prerequisite: "#c084fc", // Light purple
	evolution: "#fbbf24", // Light amber
	comparison: "#fb7185", // Light pink
	ecosystem: "#34d399", // Light emerald
} as const;

const relationshipDescriptions: Record<RelationshipType, string> = {
	alternative: "Can be used instead of this technology",
	complement: "Works well together with this technology",
	migration: "Part of a migration path from or to this technology",
	prerequisite: "Required before adopting this technology",
	evolution: "Next step or advancement from this technology",
	comparison: "Similar technology worth comparing",
	ecosystem: "Part of the same technology ecosystem",
} as const;

const groupBlipsByRelationship = (blips: Array<RelatedBlipWithData>) =>
	blips.reduce(
		(acc, blip) => {
			const type = blip.relationshipType;
			if (!acc[type]) {
				acc[type] = [];
			}
			acc[type].push(blip);
			return acc;
		},
		{} as Record<RelationshipType, Array<RelatedBlipWithData>>,
	);

const RelatedBlipCard = ({
	blip,
	relationshipType,
}: {
	blip: RelatedBlipWithData;
	relationshipType: RelationshipType;
}) => (
	<a
		href={getBlipPath({ id: blip.blipId, name: blip.blipName })}
		className={styles.relatedBlipCard}
		title={`View ${blip.blipName} details`}
		style={{
			margin: 0,
			minHeight: "fit-content",
			height: "auto",
		}}
	>
		<span className={styles.relatedBlipMeta}>{blip.blipRing}</span>
		<div className={styles.relatedBlipTitleWrapper}>
			<h3 className={styles.relatedBlipTitle}>{blip.blipName}</h3>
		</div>
		<p className={styles.relatedBlipMetaUnderlined}>
			{blip.blipQuadrant.replace(
				"languages-frameworks",
				"Languages & Frameworks",
			)}
		</p>

		{(blip.reason || blip.context) && (
			<div
				style={{
					marginTop: "0.75rem",
					fontSize: "0.8rem",
					color: "#aaa",
					lineHeight: "1.4",
				}}
			>
				{blip.reason && (
					<div style={{ marginBottom: "0.5rem" }}>
						<strong>Why:</strong> {blip.reason}
					</div>
				)}
				{blip.context && (
					<div>
						<strong>Context:</strong> {blip.context}
					</div>
				)}
			</div>
		)}
	</a>
);

const RelationshipGroup = ({
	type,
	blips,
}: {
	type: RelationshipType;
	blips: Array<RelatedBlipWithData>;
}) => {
	const IconComponent = relationshipIcons[type];
	const color = relationshipColors[type];

	return (
		<div
			style={{
				marginBottom: "3rem",
				breakInside: "avoid",
				pageBreakInside: "avoid",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "0.75rem",
					marginBottom: "1.5rem",
					paddingBottom: "0.75rem",
					borderBottom: `2px solid ${color}`,
					color: color,
				}}
			>
				<IconComponent
					style={{ width: "1.25rem", height: "1.25rem", color: color }}
					aria-label={relationshipLabels[type]}
				/>
				<h3
					style={{
						margin: 0,
						fontFamily: "'Space Grotesk', sans-serif",
						fontSize: "1.125rem",
						fontWeight: "600",
					}}
				>
					{relationshipLabels[type]}
				</h3>
				<span
					style={{
						backgroundColor: color,
						color: "#000",
						padding: "0.25rem 0.75rem",
						borderRadius: "1rem",
						fontSize: "0.75rem",
						fontWeight: "600",
						fontFamily: "'IBM Plex Mono', monospace",
					}}
				>
					{blips.length}
				</span>
			</div>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
					gap: "1.25rem",
					alignItems: "start",
				}}
			>
				{blips.map((blip) => (
					<RelatedBlipCard
						key={`${blip.blipId}-${blip.relationshipType}`}
						blip={blip}
						relationshipType={type}
					/>
				))}
			</div>
		</div>
	);
};

export const RelatedBlipsSection = ({
	relatedBlips,
	currentBlipName,
}: RelatedBlipsSectionProps) => {
	const groupedBlips = useMemo(
		() => groupBlipsByRelationship(relatedBlips),
		[relatedBlips],
	);

	const relationshipTypes = useMemo(
		() => Object.keys(groupedBlips) as Array<RelationshipType>,
		[groupedBlips],
	);

	if (relatedBlips.length === 0) {
		return (
			<div
				style={{
					textAlign: "center",
					padding: "4rem 2rem",
					color: "#666",
					fontFamily: "'IBM Plex Mono', monospace",
				}}
			>
				No related technologies defined yet.
			</div>
		);
	}

	return (
		<section
			style={{
				maxWidth: "1200px",
				margin: "0 auto",
				padding: "2rem 1rem",
			}}
		>
			<h2 className={styles.relatedBlipsTitle} style={{ marginBottom: "1rem" }}>
				Related Technologies
			</h2>
			<p
				style={{
					textAlign: "center",
					marginBottom: "3rem",
					color: "#ccc",
					fontFamily: "'IBM Plex Mono', monospace",
					fontSize: "0.9rem",
					maxWidth: "600px",
					margin: "0 auto 3rem auto",
				}}
			>
				Technologies related to{" "}
				<strong style={{ color: "#fff" }}>{currentBlipName}</strong> and their
				relationships.
			</p>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
					gap: "2rem",
					alignItems: "start",
				}}
			>
				{relationshipTypes.map((type) => (
					<RelationshipGroup
						key={type}
						type={type}
						blips={groupedBlips[type]}
					/>
				))}
			</div>
		</section>
	);
};
