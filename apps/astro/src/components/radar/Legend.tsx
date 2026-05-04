import React, { useState, useEffect } from "react";
import { LegendItem, LegendLabel, LegendOrdinal } from "@visx/legend";
import { scaleOrdinal } from "@visx/scale";
import { LegendMoveState } from "./LegendMoveState";
import { useStore } from "@nanostores/react";
import { withBasePath } from "~utils/sitePaths";
import { theme, getEffectiveTheme } from "~stores/theme-store";

// Quadrant data with links and colors
const quadrantData = [
	{
		id: "Platforms",
		label: "Platforms",
		href: withBasePath("/quadrants/platforms"),
		color: "rgb(125, 110, 238, 1)",
		tooltip: "View all platform technologies",
	},
	{
		id: "Languages",
		label: "Languages & Frameworks",
		href: withBasePath("/quadrants/languages-frameworks"),
		color: "rgb(81, 245, 141, 1)",
		tooltip: "View all languages and frameworks",
	},
	{
		id: "Tools",
		label: "Tools",
		href: withBasePath("/quadrants/tools"),
		color: "rgb(80, 197, 241, 1)",
		tooltip: "View all tools and utilities",
	},
	{
		id: "Techniques",
		label: "Techniques",
		href: withBasePath("/quadrants/techniques"),
		color: "rgb(255, 163, 71, 1)",
		tooltip: "View all techniques and methodologies",
	},
];

const ordinalColor2Scale = scaleOrdinal({
	domain: quadrantData.map((q) => q.id),
	range: quadrantData.map((q) => q.color),
});

const clipPaths = [
	"clipTopRight",
	"clipTopLeft",
	"clipBottomLeft",
	"clipBottomRight",
];

const legendGlyphSize = 16;
const events = false;

function LegendBase({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const currentTheme = useStore(theme);
	const [isDarkTheme, setIsDarkTheme] = useState(true);

	// Update theme state based on current theme
	useEffect(() => {
		const effectiveTheme = getEffectiveTheme();
		setIsDarkTheme(effectiveTheme === "dark" || effectiveTheme === "machine");
	}, [currentTheme]);

	return (
		<div className={`legend ${isDarkTheme ? "dark" : "light"}`}>
			<div style={{ fontFamily: "IBM Plex Mono, monospace" }} className="title">
				{title}
			</div>
			{children}
			<style>
				{`
          .legend {
              line-height: 0.9em;
              font-size: 10px;
              font-family: 'IBM Plex Mono, monospace';
              padding: 10px;
              width: 100%;
              box-sizing: border-box;
              border-radius: 8px;
              margin: 5px;
              transition: all 0.3s ease;
          }
          .legend.dark {
              color: #efefef;
              border: 1px solid rgba(255, 255, 255, 0.3);
              background-color: rgba(0, 0, 0, 0.7);
          }
          .legend.light {
              color: #333333;
              border: 1px solid rgba(0, 0, 0, 0.2);
              background-color: rgba(255, 255, 255, 0.9);
          }
          .title {
              font-size: 12px;
              margin-bottom: 10px;
              font-weight: 100;
          }
          `}
			</style>
		</div>
	);
}
export const LegendTwo = () => {
	const currentTheme = useStore(theme);
	const [textColor, setTextColor] = useState("#efefef");
	const [tooltipContent, setTooltipContent] = useState<string | null>(null);
	const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const effectiveTheme = getEffectiveTheme();
		setTextColor(
			effectiveTheme === "dark" || effectiveTheme === "machine"
				? "#efefef"
				: "#333333",
		);
	}, [currentTheme]);

	// Find the quadrant data by ID
	const getQuadrantByLabelId = (id: string) => {
		return quadrantData.find((q) => q.id === id) || quadrantData[0];
	};

	const handleMouseMove = (e: React.MouseEvent, tooltip: string) => {
		setTooltipContent(tooltip);
		setTooltipPosition({ x: e.clientX + 10, y: e.clientY + 10 });
	};

	const handleMouseLeave = () => {
		setTooltipContent(null);
	};

	return (
		<>
			<LegendBase title="Quadrants">
				<LegendOrdinal scale={ordinalColor2Scale}>
					{(labels) =>
						labels.map((label, i) => {
							const quadrant = getQuadrantByLabelId(label.text);
							return (
								<LegendItem
									key={`legend-${i}`}
									style={{
										color: textColor,
										fontFamily: "IBM Plex Mono, monospace",
										cursor: "pointer",
									}}
									onClick={() => {
										window.location.href = quadrant.href;
									}}
									onMouseMove={(e) => handleMouseMove(e, quadrant.tooltip)}
									onMouseLeave={handleMouseLeave}
									// title={quadrant.tooltip} // Native HTML tooltip as fallback
								>
									<svg
										width={legendGlyphSize}
										height={legendGlyphSize}
										style={{ margin: "2px 0" }}
									>
										<defs>
											<clipPath id="clipTopRight">
												<path d="M 16,16 L 16,0 A 16,16 0 0 1 32,16 Z" />{" "}
											</clipPath>

											<clipPath id="clipTopLeft">
												<path d="M 16,16 L 0,16 A 16,16 0 0 1 16,0 Z" />
											</clipPath>

											<clipPath id="clipBottomLeft">
												<path d="M 16,16 L 16,32 A 16,16 0 0 1 0,16 Z" />
											</clipPath>

											<clipPath id="clipBottomRight">
												<path d="M 16,16 L 32,16 A 16,16 0 0 1 16,32 Z" />
											</clipPath>
										</defs>
										{clipPaths.map((clipPathId, index) => (
											<circle
												key={index}
												fill={label.value}
												r={legendGlyphSize}
												cx={legendGlyphSize / 2}
												cy={legendGlyphSize / 2}
												clipPath={`url(#${clipPathId})`}
											/>
										))}
									</svg>
									<LegendLabel
										align="left"
										margin="0 0 0 4px"
										style={{
											color: textColor,
											fontFamily: "IBM Plex Mono, monospace",
											textDecoration: "none",
										}}
									>
										{quadrant.label}
									</LegendLabel>
								</LegendItem>
							);
						})
					}
				</LegendOrdinal>
			</LegendBase>

			{/* Custom tooltip */}
			{tooltipContent && (
				<div
					style={{
						position: "fixed",
						top: `${tooltipPosition.y}px`,
						left: `${tooltipPosition.x}px`,
						backgroundColor: "rgba(0, 0, 0, 0.8)",
						color: "#fff",
						padding: "5px 10px",
						borderRadius: "4px",
						fontSize: "12px",
						zIndex: 1000,
						pointerEvents: "none",
						fontFamily: "IBM Plex Mono, monospace",
						border: "1px solid rgba(255, 255, 255, 0.2)",
						boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
						backdropFilter: "blur(4px)",
					}}
				>
					{tooltipContent}
				</div>
			)}

			<LegendMoveState />
		</>
	);
};
