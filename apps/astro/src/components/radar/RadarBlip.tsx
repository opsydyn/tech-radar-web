import { Circle } from "@visx/shape";
import { Text } from "@visx/text";
import type { MouseEvent } from "react";
import { memo } from "react";
import type { BlipWithPosition, MoveTuple, MoveType } from "~types/radar-types";
import { getBlipPath } from "~utils/blipRouting";
import type { DerivedMovement } from "~utils/editionSnapshots";

import * as styles from "./Radar.css";

const quadrantColors = {
	Tools: "rgb(80, 197, 241, 0.9)",
	Techniques: "rgb(255, 163, 71,0.9)",
	Platforms: "rgb(125, 110, 238, 0.9)",
	"languages-frameworks": "rgb(81, 245, 141, 0.9)",
} as const;

const blipVisibleRadius = 12;
const blipHoverRadius = 24;
const blipLabelCharacterWidth = 7;
const blipLabelHorizontalPadding = 12;
const blipDetailCharacterWidth = 5.5;

export type RadarBlipDetailLevel = "compact" | "label" | "detail";

export const getRadarBlipColor = (quadrant: BlipWithPosition["quadrant"]) =>
	quadrantColors[quadrant];

function getLatestMove(move?: MoveTuple[]): MoveType | undefined {
	const latestMove = move?.[move.length - 1];
	if (latestMove === undefined) return;
	return latestMove[0];
}

const movementToLegacyMove = (movement: DerivedMovement): MoveType => {
	const movementMap = {
		new: "go",
		"moved-in": "go",
		"moved-out": "grow",
		reintroduced: "go",
		removed: "grow",
		unchanged: "stay",
	} as const satisfies Record<DerivedMovement, MoveType>;

	return movementMap[movement];
};

const getDisplayMove = (
	blip: BlipWithPosition & { readonly movement?: DerivedMovement },
): MoveType =>
	blip.movement
		? movementToLegacyMove(blip.movement)
		: (getLatestMove(blip.move) ?? "stay");

type RadarBlipProps = {
	blip: BlipWithPosition;
	detailLevel?: RadarBlipDetailLevel;
	labelScale?: number;
	onHover?: (event: MouseEvent<Element>, blip: BlipWithPosition) => void;
	onUnhover?: () => void;
	isFocused?: boolean;
	isHovered?: boolean;
	isRelated?: boolean;
	isRelationshipSource?: boolean;
};

const getPrimaryLabelWidth = (name: string): number =>
	Math.max(
		96,
		name.length * blipLabelCharacterWidth + blipLabelHorizontalPadding,
	);

const getBlipTagSummary = (tags: readonly string[]): string =>
	tags.length === 0 ? "No tags" : tags.slice(0, 2).join(" · ");

const getDetailSummary = (blip: BlipWithPosition): string =>
	`${blip.ring} · ${getBlipTagSummary(blip.tags)}`;

const getDetailLabelWidth = (summary: string): number =>
	Math.max(116, summary.length * blipDetailCharacterWidth + 14);

const blipMoveSvgMap = {
	go: (moveX: number, moveY: number, color: string) => (
		<text
			x={moveX + 8}
			y={moveY - 12}
			fontSize={20}
			textAnchor="middle"
			fill={color}
			aria-label="Moved in"
			transform={`rotate(45, ${moveX}, ${moveY - 12})`}
		>
			▲
		</text>
	),
	grow: (moveX: number, moveY: number, color: string) => (
		<text
			x={moveX - 16}
			y={moveY + 24}
			fontSize={15}
			textAnchor="middle"
			fill={color}
			aria-label="Moved out"
			transform={`rotate(45, ${moveX}, ${moveY + 22})`}
		>
			▼
		</text>
	),
	stay: () => null,
} as const;

export const RadarBlip = memo(function RadarBlip({
	blip,
	detailLevel = "compact",
	labelScale = 1,
	onHover,
	onUnhover,
	isFocused = false,
	isHovered = false,
	isRelated = false,
	isRelationshipSource = false,
}: RadarBlipProps) {
	const blipColor = getRadarBlipColor(blip.quadrant);
	const { x, y } = blip.position;
	const textColor = "#000000";
	const shouldShowName = isHovered || isFocused || detailLevel !== "compact";
	const shouldShowDetails = isHovered || isFocused || detailLevel === "detail";
	const primaryLabelWidth = getPrimaryLabelWidth(blip.name);
	const detailSummary = getDetailSummary(blip);
	const detailLabelWidth = getDetailLabelWidth(detailSummary);

	const blipPath = getBlipPath(blip);

	return (
		<a
			aria-label={`Details about ${blip.id}`}
			className={styles.z}
			data-focused={isFocused ? "true" : undefined}
			data-hovered={isHovered ? "true" : undefined}
			data-related={isRelated ? "true" : undefined}
			data-relationship-source={isRelationshipSource ? "true" : undefined}
			href={blipPath}
			onMouseEnter={(event) => {
				onHover?.(event, blip);
			}}
			onMouseLeave={onUnhover}
		>
			<circle
				cx={x}
				cy={y}
				r={blipHoverRadius}
				fill="transparent"
				style={{ pointerEvents: "all" }}
			/>

			{isHovered && (
				<circle
					cx={x}
					cy={y}
					r={16}
					fill="none"
					stroke={blipColor}
					strokeWidth={4}
					opacity={0.85}
					style={{ pointerEvents: "none" }}
				/>
			)}

			{isFocused && (
				<circle
					cx={x}
					cy={y}
					r={22}
					fill="none"
					stroke={blipColor}
					strokeWidth={3}
					className={styles.radarBlipFocusRing}
					style={{ pointerEvents: "none" }}
				/>
			)}

			<Circle
				cx={x}
				cy={y}
				r={blipVisibleRadius}
				fill={blipColor}
				filter={
					isHovered || isFocused || isRelated
						? "url(#radar-blip-outer-glow)"
						: undefined
				}
			/>

			{blipMoveSvgMap[getDisplayMove(blip)](x, y, blipColor)}

			<Text
				x={x}
				y={y}
				fontSize={12}
				textAnchor="middle"
				dy=".3em"
				fill={textColor}
				fontWeight="bold"
			>
				{blip.id}
			</Text>

			{shouldShowName && (
				<g
					transform={`translate(${x + 18}, ${y - 26}) scale(${labelScale})`}
					opacity={isHovered ? 1 : 0.92}
					style={{ pointerEvents: "none" }}
				>
					<rect
						x={0}
						y={-16}
						width={primaryLabelWidth}
						height={22}
						rx={0}
						fill="rgba(3, 7, 18, 0.86)"
						stroke={blipColor}
						strokeWidth={1.2}
					/>
					<text
						x={7}
						y={-1}
						fill="#f8fafc"
						fontFamily="IBM Plex Mono, monospace"
						fontSize={11}
						fontWeight={800}
					>
						{blip.name}
					</text>
				</g>
			)}

			{shouldShowDetails && (
				<g
					transform={`translate(${x + 18}, ${y + 10}) scale(${labelScale})`}
					opacity={isHovered ? 0.98 : 0.82}
					style={{ pointerEvents: "none" }}
				>
					<rect
						x={0}
						y={-12}
						width={detailLabelWidth}
						height={18}
						rx={0}
						fill="rgba(15, 23, 42, 0.72)"
						stroke="rgba(248, 250, 252, 0.16)"
						strokeWidth={1}
					/>
					<text
						x={7}
						y={1}
						fill="rgba(226, 232, 240, 0.92)"
						fontFamily="IBM Plex Mono, monospace"
						fontSize={9.5}
						fontWeight={700}
					>
						{detailSummary}
					</text>
				</g>
			)}
		</a>
	);
});

export const MiniMapBlip = memo(function MiniMapBlip({
	blip,
}: {
	blip: BlipWithPosition;
}) {
	const { x, y } = blip.position;

	return (
		<circle
			cx={x}
			cy={y}
			r={8}
			fill={getRadarBlipColor(blip.quadrant)}
			opacity={0.85}
			style={{ pointerEvents: "none" }}
		/>
	);
});
