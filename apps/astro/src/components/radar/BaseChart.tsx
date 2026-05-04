import { useStore } from "@nanostores/react";
import { Group } from "@visx/group";
import { Arc, Circle, Line } from "@visx/shape";
import { memo, useEffect, useState } from "react";
import { radarConfig } from "~stores/radar-store";
import { getEffectiveTheme, theme } from "~stores/theme-store";

// Theme-dependent fill colors for quadrants
const getRadarColors = (isDarkTheme: boolean) => [
	isDarkTheme ? "#000" : "#fff",
	isDarkTheme ? "#000" : "#fff",
	isDarkTheme ? "#000" : "#fff",
	isDarkTheme ? "#000" : "#fff",
];

// Vibrant stroke colors for quadrants - consistent with cyberpunk theme
const radarStrokeColors = [
	"rgb(81, 245, 141, 0.9)", // Green
	"rgb(80, 197, 241, 0.9)", // Blue
	"rgb(255, 163, 71, 0.9)", // Orange
	"rgb(125, 110, 238, 0.9)", // Purple
];

const axisAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2] as const;

export const RadarChart = memo(function RadarChart() {
	const { width, height, centerX, centerY, radius, gutter } =
		useStore(radarConfig);
	const currentTheme = useStore(theme);
	const [radarColors, setRadarColors] = useState(getRadarColors(true));

	// Update radar colors based on theme
	useEffect(() => {
		const effectiveTheme =
			currentTheme === "machine" ? getEffectiveTheme() : currentTheme;
		setRadarColors(
			getRadarColors(effectiveTheme === "dark" || effectiveTheme === "machine"),
		);
	}, [currentTheme]);

	const quadrantAngles = [
		{ startAngle: gutter, endAngle: Math.PI / 2 - gutter },
		{ startAngle: Math.PI / 2 + gutter, endAngle: Math.PI - gutter },
		{ startAngle: Math.PI + gutter, endAngle: (3 * Math.PI) / 2 - gutter },
		{
			startAngle: (3 * Math.PI) / 2 + gutter,
			endAngle: 2 * Math.PI - gutter,
		},
	] as const;

	const isDarkTheme = radarColors[0] === "#000";
	const axisBorderColor = isDarkTheme ? "#555" : "#aaa";
	const axisMarginColor = isDarkTheme ? "#0a0a0a" : "#ffffff";
	const axisLineColor = isDarkTheme ? "#000" : "#fff";

	return (
		<svg width={width} height={height} aria-hidden="true" focusable="false">
			<Group top={centerY} left={centerX}>
				{quadrantAngles.map((quadrant, i) => {
					const fillColor = radarColors[i % radarColors.length];
					const strokeColor = radarStrokeColors[i % radarStrokeColors.length];
					return (
						<Arc
							key={`quadrant-${quadrant.startAngle}-${quadrant.endAngle}`}
							innerRadius={0}
							outerRadius={radius}
							startAngle={quadrant.startAngle}
							endAngle={quadrant.endAngle}
							padAngle={gutter}
							cornerRadius={0}
							fill={fillColor}
							stroke={strokeColor}
							strokeWidth={2.5}
							style={{
								filter: "drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.2))",
							}}
						/>
					);
				})}

				{/* Overlay axis lines for quadrant separation with borders */}
				{axisAngles.map((angle) => {
					const x2 = radius * Math.cos(angle);
					const y2 = radius * Math.sin(angle);
					return (
						<g key={`axis-separator-group-${angle}`}>
							{/* Border */}
							<Line
								x1={0}
								y1={0}
								x2={x2}
								y2={y2}
								stroke={axisBorderColor}
								strokeWidth={16}
								pointerEvents="none"
							/>
							{/* Margin (gap) */}
							<Line
								x1={0}
								y1={0}
								x2={x2}
								y2={y2}
								stroke={axisMarginColor}
								strokeWidth={12}
								pointerEvents="none"
							/>
							{/* Axis (thin colored line) */}
							<Line
								x1={0}
								y1={0}
								x2={x2}
								y2={y2}
								stroke={axisLineColor}
								strokeWidth={2.5}
								pointerEvents="none"
							/>
						</g>
					);
				})}
				{/* Center grey circle to cover intersection of the cross - must be last for stacking */}
				<Circle
					cx={0}
					cy={0}
					r={28}
					fill="#000"
					style={{ pointerEvents: "none" }}
				/>
			</Group>
		</svg>
	);
});
