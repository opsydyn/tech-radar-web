import { Circle } from "@visx/shape";
import { Text } from "@visx/text";
import { useTooltip, useTooltipInPortal } from "@visx/tooltip";
import type { BlipWithPosition, MoveTuple, MoveType } from "~types/radar-types";
import { getBlipPath } from "~utils/blipRouting";

import * as styles from "./Radar.css";

const quadrantColors = {
	Tools: "rgb(80, 197, 241, 0.9)",
	Techniques: "rgb(255, 163, 71,0.9)",
	Platforms: "rgb(125, 110, 238, 0.9)",
	"languages-frameworks": "rgb(81, 245, 141, 0.9)",
} as const;

function getLatestMove(move?: MoveTuple[]): MoveType | undefined {
	const latestMove = move?.[move.length - 1];
	if (latestMove === undefined) return;
	return latestMove[0];
}

export const RadarBlip = ({
	blip,
	index,
	isDimmed = false,
	onHover,
	onUnhover,
	isHovered = false,
}: {
	blip: BlipWithPosition;
	index: number;
	isDimmed?: boolean;
	onHover?: () => void;
	onUnhover?: () => void;
	isHovered?: boolean;
}) => {
	const {
		tooltipData,
		tooltipLeft,
		tooltipTop,
		tooltipOpen,
		showTooltip,
		hideTooltip,
	} = useTooltip<BlipWithPosition>();
	const { TooltipInPortal } = useTooltipInPortal();
	const blipColor = quadrantColors[blip.quadrant];
	const { x, y } = blip.position;
	const textColor = "#000000";
	const tooltipTitle = tooltipData?.name ?? blip.name;
	const tooltipQuadrant = tooltipData?.quadrant ?? blip.quadrant;
	const tooltipRing = tooltipData?.ring ?? blip.ring;

	const handleMouseOver = (
		event: React.MouseEvent<SVGElement>,
		datum: BlipWithPosition,
	) => {
		showTooltip({
			tooltipLeft: event.clientX + 12,
			tooltipTop: event.clientY - 18,
			tooltipData: datum,
		});
	};

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
		>
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

			<defs>
				<filter
					id={`blip-outer-glow-${blip.id}`}
					x="-50%"
					y="-50%"
					width="200%"
					height="200%"
				>
					<feGaussianBlur stdDeviation="8" result="coloredBlur" />
					<feMerge>
						<feMergeNode in="coloredBlur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			<Circle
				cx={x}
				cy={y}
				r={12}
				fill={blipColor}
				opacity={isDimmed ? 0.3 : 1}
				onMouseEnter={(event) => {
					handleMouseOver(event, blip);
					onHover?.();
				}}
				onMouseOut={() => {
					hideTooltip();
					onUnhover?.();
				}}
				href={blipPath}
				filter={isHovered ? `url(#blip-outer-glow-${blip.id})` : undefined}
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

			{tooltipOpen && (
				<TooltipInPortal
					key={`tooltip-${blip.id}`}
					top={tooltipTop}
					left={tooltipLeft}
					offsetLeft={0}
					offsetTop={0}
					unstyled
					applyPositionStyle
				>
					<div
						style={{
							minWidth: "240px",
							maxWidth: "360px",
							background: "rgba(8, 10, 14, 0.94)",
							border: `1px solid ${blipColor}`,
							borderLeft: `8px solid ${blipColor}`,
							borderRadius: "10px",
							boxShadow: `0 0 0 1px rgba(255, 255, 255, 0.08), 0 16px 36px rgba(0, 0, 0, 0.42), 0 0 28px ${blipColor}`,
							color: "#f8fafc",
							fontFamily: "'IBM Plex Mono', monospace",
							padding: "0.85rem 1rem",
						}}
					>
						<div
							style={{
								alignItems: "center",
								display: "flex",
								gap: "0.65rem",
								marginBottom: "0.6rem",
							}}
						>
							<span
								style={{
									background: blipColor,
									borderRadius: "999px",
									color: "#020617",
									fontSize: "0.78rem",
									fontWeight: 800,
									lineHeight: 1,
									padding: "0.35rem 0.5rem",
								}}
							>
								{blip.id}
							</span>
							<strong
								style={{
									fontFamily: "'Space Grotesk', sans-serif",
									fontSize: "1.1rem",
									letterSpacing: "0.01em",
									lineHeight: 1.1,
								}}
							>
								{tooltipTitle}
							</strong>
						</div>
						<div
							style={{
								display: "grid",
								gap: "0.35rem",
							}}
						>
							<span>
								<span style={{ color: "#94a3b8" }}>Quadrant:</span>{" "}
								{tooltipQuadrant}
							</span>
							<span>
								<span style={{ color: "#94a3b8" }}>Ring:</span> {tooltipRing}
							</span>
						</div>
					</div>
				</TooltipInPortal>
			)}
		</a>
	);
};
