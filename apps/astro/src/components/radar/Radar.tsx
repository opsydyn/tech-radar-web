import { useStore } from "@nanostores/react";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { useTooltipInPortal } from "@visx/tooltip";
import { Zoom } from "@visx/zoom";
import type { CSSProperties, MouseEvent } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RadarChart } from "~components/radar/BaseChart";
import {
	EditionSwitcher,
	selectedEdition,
} from "~components/radar/EditionSwitcher";
import { Labels } from "~components/radar/Labels";
import { LegendTwo } from "~components/radar/Legend";
// import { Legend, LegendTwo } from "~components/radar/Legend";
import { MiniMapControls } from "~components/radar/MiniMapControls";
import {
	getRadarBlipColor,
	MiniMapBlip,
	RadarBlip,
} from "~components/radar/RadarBlip";
import { RadarControls } from "~components/radar/RadarControls";
import { RadarRings } from "~components/radar/RadarRings";
import UseBlipPositions from "~hooks/UseBlipPositions";
import { useBlipSearch } from "~hooks/useBlipSearch";
import { miniMapState, radarConfig } from "~stores/radar-store";
import { theme } from "~stores/theme-store";
import type { Blip, BlipWithPosition } from "~types/radar-types";
import type { Edition } from "~utils/editionHelpers";
import { getBlipsForEdition } from "~utils/editionHelpers";

import * as styles from "./Radar.css";

type RadarTooltipState = {
	blip: BlipWithPosition;
	left: number;
	top: number;
};

type RadarTooltipStyle = CSSProperties & {
	readonly "--radar-blip-color": string;
};

const createTooltipPosition = (event: MouseEvent<Element>) => ({
	left: event.clientX + 12,
	top: event.clientY - 18,
});

const RadarBlipTooltip = ({ blip }: { blip: BlipWithPosition }) => {
	const blipColor = getRadarBlipColor(blip.quadrant);
	const tooltipStyle: RadarTooltipStyle = {
		"--radar-blip-color": blipColor,
	};

	return (
		<div className={styles.blipTooltip} style={tooltipStyle}>
			<div className={styles.blipTooltipHeader}>
				<span className={styles.blipTooltipBadge}>{blip.id}</span>
				<strong className={styles.blipTooltipTitle}>{blip.name}</strong>
			</div>
			<div className={styles.blipTooltipDetails}>
				<span>
					<span className={styles.blipTooltipLabel}>Quadrant:</span>{" "}
					{blip.quadrant}
				</span>
				<span>
					<span className={styles.blipTooltipLabel}>Ring:</span> {blip.ring}
				</span>
			</div>
		</div>
	);
};

const Radar = ({ blips, editions }: { blips: Blip[]; editions: Edition[] }) => {
	const { width, height, centerX, centerY } = useStore(radarConfig);
	const { containerRef, TooltipInPortal } = useTooltipInPortal();
	const miniMapstate = useStore(miniMapState);
	const currentTheme = useStore(theme);
	const [bgColor, setBgColor] = useState<string>("#000000");
	const [tooltip, setTooltip] = useState<RadarTooltipState | null>(null);

	// Handle theme state on client-side only to avoid hydration mismatch
	useEffect(() => {
		setBgColor(currentTheme === "light" ? "#ffffff" : "#000000");
	}, [currentTheme]);

	// 🆕 Edition filtering MUST happen first to prevent duplicate blips
	// A blip can appear in multiple editions, so we always filter by current edition
	const currentEdition = useStore(selectedEdition);

	// Get blips for current edition (or empty array if no edition selected yet)
	const editionBlips = useMemo(
		() => (currentEdition ? getBlipsForEdition(blips, currentEdition) : []),
		[blips, currentEdition],
	);

	// Use the search hook to filter edition-specific blips
	const {
		searchTerm,
		filteredBlips,
		handleSearchChange,
		clearSearch,
		resultsCount,
		hasSearchTerm,
	} = useBlipSearch(editionBlips);
	const resultsSuffix = resultsCount === 1 ? "" : "s";

	// Calculate positions for edition + search filtered blips
	const radarBlips = UseBlipPositions(filteredBlips);

	// Minimap also uses edition-filtered blips (not all blips)
	const miniMapBlips = UseBlipPositions(editionBlips);

	const initialTransform = {
		scaleX: 1.27,
		scaleY: 1.27,
		translateX: -211.62,
		translateY: 162.59,
		skewX: 0,
		skewY: 0,
	};

	const [hoveredBlipId, setHoveredBlipId] = useState<string | null>(null);
	const handleBlipHover = useCallback(
		(event: MouseEvent<Element>, blip: BlipWithPosition) => {
			const { left, top } = createTooltipPosition(event);
			setHoveredBlipId((currentBlipId) =>
				currentBlipId === blip.id ? currentBlipId : blip.id,
			);
			setTooltip((currentTooltip) =>
				currentTooltip?.blip.id === blip.id
					? currentTooltip
					: { blip, left, top },
			);
		},
		[],
	);
	const handleBlipUnhover = useCallback(() => {
		setHoveredBlipId(null);
		setTooltip(null);
	}, []);

	return (
		<Zoom<SVGSVGElement>
			width={width}
			height={height}
			scaleXMin={0.7}
			scaleXMax={2.5}
			scaleYMin={0.7}
			scaleYMax={2.5}
			initialTransformMatrix={initialTransform}
		>
			{(zoom) => {
				// Clamp translation values before rendering
				const clamp = (val: number, min: number, max: number) =>
					Math.max(min, Math.min(val, max));
				// Clamp the transform for smoother pan
				const clampedTransform = {
					...zoom.transformMatrix,
					translateX: clamp(
						zoom.transformMatrix.translateX,
						-width * 0.5,
						width * 0.5,
					),
					translateY: clamp(
						zoom.transformMatrix.translateY,
						-height * 0.5,
						height * 0.5,
					),
				};
				// Generate transform string manually
				const transformString = `matrix(${clampedTransform.scaleX},${clampedTransform.skewY},${clampedTransform.skewX},${clampedTransform.scaleY},${clampedTransform.translateX},${clampedTransform.translateY})`;
				return (
					<div className={styles.relative} ref={containerRef}>
						{/* Left side controls container */}
						<div className={styles.leftControlsContainer}>
							{/* Legend components */}
							<LegendTwo />
						</div>

						{/* Right side controls: Edition + Search */}
						<div className={styles.rightSearchContainer}>
							{/* 🆕 Edition Switcher */}
							<EditionSwitcher editions={editions} />

							{/* Search Input */}
							<input
								type="text"
								className={styles.searchInput}
								placeholder="Search blips..."
								value={searchTerm}
								onChange={handleSearchChange}
								aria-label="Search radar blips"
							/>
							{hasSearchTerm && (
								<div className={styles.searchFooter}>
									<span className={styles.searchResultsCount}>
										{resultsCount} result{resultsSuffix}
									</span>
									<button
										type="button"
										className={styles.searchClearButton}
										onClick={clearSearch}
										aria-label="Clear search"
									>
										Clear
									</button>
								</div>
							)}

							{/* Theme state indicator for testing */}

							{/* <div className={styles.themeIndicator}>
                  <div>
                    <span role="img" aria-label="theme icon">
                      {effectiveTheme === 'dark' ? '🌙' : effectiveTheme === 'light' ? '☀️' : '⚙️'}
                    </span>
                    {' '}{effectiveTheme.charAt(0).toUpperCase() + effectiveTheme.slice(1)} Mode
                  </div>
                </div> */}
						</div>

						<svg
							ref={zoom.containerRef}
							role="img"
							aria-label="Interactive tech radar chart"
							width={width}
							height={height}
							style={{
								cursor: zoom.isDragging ? "grabbing" : "grab",
								touchAction: "none",
							}}
							onMouseLeave={handleBlipUnhover}
						>
							<defs>
								<filter
									id="radar-blip-outer-glow"
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
							<RectClipPath id="zoom-clip" width={width} height={height} />
							<rect width={width} height={height} rx={14} fill={bgColor} />
							<g transform={transformString}>
								<RadarChart />
								<Labels />
								<Group top={centerY} left={centerX}>
									<RadarRings />
									{/* Global dimming overlay */}
									{hoveredBlipId && (
										<rect
											x={-centerX}
											y={-centerY}
											width={width}
											height={height}
											fill="#000"
											fillOpacity={0.45}
											style={{ pointerEvents: "none" }}
										/>
									)}
									{/* biome-ignore lint/a11y/noStaticElementInteractions: transparent SVG hit layer delegates drag, touch, and zoom gestures for the radar surface. */}
									<rect
										x={-centerX}
										y={-centerY}
										width={width}
										height={height}
										rx={14}
										fill="transparent"
										onTouchStart={zoom.dragStart}
										onTouchMove={zoom.dragMove}
										onTouchEnd={zoom.dragEnd}
										onMouseDown={zoom.dragStart}
										onMouseMove={zoom.dragMove}
										onMouseUp={zoom.dragEnd}
										onMouseLeave={() => {
											if (zoom.isDragging) zoom.dragEnd();
										}}
										onDoubleClick={(event) => {
											const point = localPoint(event) ?? { x: 0, y: 0 };
											zoom.scale({ scaleX: 1.05, scaleY: 1.05, point });
										}}
									/>
									{radarBlips.map((blip, i) => (
										<RadarBlip
											key={blip.id}
											blip={blip}
											index={i}
											isDimmed={
												hoveredBlipId !== null && hoveredBlipId !== blip.id
											}
											isHovered={hoveredBlipId === blip.id}
											onHover={handleBlipHover}
											onUnhover={handleBlipUnhover}
										/>
									))}
								</Group>
							</g>
							{miniMapstate.showMiniMap && (
								<g
									clipPath="url(#zoom-clip)"
									transform={`
                    scale(0.25)    
                    translate(${width * 4 - width - 60},
                    ${height * 4 - height - 60})
                  `}
								>
									<rect width={width} height={height} fill="#1a1a1a" />
									<RadarChart />
									<Labels />
									<Group top={centerY} left={centerX}>
										<RadarRings />
										{miniMapBlips.map((blip) => (
											<MiniMapBlip key={blip.id} blip={blip} />
										))}
									</Group>
									<rect
										width={width}
										height={height}
										fill="white"
										fillOpacity={0.2}
										stroke="white"
										strokeWidth={4}
										transform={zoom.toStringInvert()}
									/>
								</g>
							)}
						</svg>
						{tooltip && (
							<TooltipInPortal
								key={`tooltip-${tooltip.blip.id}`}
								top={tooltip.top}
								left={tooltip.left}
								offsetLeft={0}
								offsetTop={0}
								unstyled
								applyPositionStyle
							>
								<RadarBlipTooltip blip={tooltip.blip} />
							</TooltipInPortal>
						)}
						<RadarControls zoom={zoom} />
						<MiniMapControls />
					</div>
				);
			}}
		</Zoom>
	);
};

export default Radar;
