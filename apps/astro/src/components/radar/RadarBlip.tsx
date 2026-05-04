import { Circle } from "@visx/shape";
import { Text } from "@visx/text";
import type { MouseEvent } from "react";
import { memo } from "react";
import type { BlipWithPosition, MoveTuple, MoveType } from "~types/radar-types";
import { getBlipPath } from "~utils/blipRouting";

import * as styles from "./Radar.css";

const quadrantColors = {
	Tools: "rgb(80, 197, 241, 0.9)",
	Techniques: "rgb(255, 163, 71,0.9)",
	Platforms: "rgb(125, 110, 238, 0.9)",
	"languages-frameworks": "rgb(81, 245, 141, 0.9)",
} as const;

const blipVisibleRadius = 12;
const blipHoverRadius = 24;

export const getRadarBlipColor = (quadrant: BlipWithPosition["quadrant"]) =>
	quadrantColors[quadrant];

function getLatestMove(move?: MoveTuple[]): MoveType | undefined {
	const latestMove = move?.[move.length - 1];
	if (latestMove === undefined) return;
	return latestMove[0];
}

type RadarBlipProps = {
	blip: BlipWithPosition;
	index: number;
	isDimmed?: boolean;
	onHover?: (event: MouseEvent<Element>, blip: BlipWithPosition) => void;
	onUnhover?: () => void;
	isHovered?: boolean;
};

export const RadarBlip = memo(function RadarBlip({
	blip,
	index,
	isDimmed = false,
	onHover,
	onUnhover,
	isHovered = false,
}: RadarBlipProps) {
	const blipColor = getRadarBlipColor(blip.quadrant);
	const { x, y } = blip.position;
	const textColor = "#000000";

	const blipMoveSvgMap = {
		go: (moveX: number, moveY: number, color: string, dimmed: boolean) => (
			<text
				x={moveX + 8}
				y={moveY - 12}
				fontSize={20}
				textAnchor="middle"
				fill={color}
				aria-label="Moved in"
				transform={`rotate(45, ${moveX}, ${moveY - 12})`}
				style={{ opacity: dimmed ? 0.3 : 1 }}
			>
				▲
			</text>
		),
		grow: (moveX: number, moveY: number, color: string, dimmed: boolean) => (
			<text
				x={moveX - 16}
				y={moveY + 24}
				fontSize={15}
				textAnchor="middle"
				fill={color}
				aria-label="Moved out"
				transform={`rotate(45, ${moveX}, ${moveY + 22})`}
				style={{ opacity: dimmed ? 0.3 : 1 }}
			>
				▼
			</text>
		),
		stay: () => null,
	} as const;

	const blipPath = getBlipPath(blip);

	return (
		<a
			key={`blip-${blip.id}=${index}`}
			aria-label={`Details about ${blip.id}`}
			className={styles.z}
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

			<Circle
				cx={x}
				cy={y}
				r={blipVisibleRadius}
				fill={blipColor}
				opacity={isDimmed ? 0.3 : 1}
				href={blipPath}
				filter={isHovered ? "url(#radar-blip-outer-glow)" : undefined}
			/>

			{blipMoveSvgMap[getLatestMove(blip.move) ?? "stay"](
				x,
				y,
				blipColor,
				isDimmed,
			)}

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
