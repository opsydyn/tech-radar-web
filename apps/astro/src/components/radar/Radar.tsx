import { useStore } from "@nanostores/react";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { useTooltipInPortal } from "@visx/tooltip";
import { Zoom } from "@visx/zoom";
import type { PinchDelta, TransformMatrix } from "@visx/zoom/lib/types";
import type {
	CSSProperties,
	MouseEvent,
	WheelEvent as ReactWheelEvent,
} from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import MessageDrawer from "~components/MessageDrawer";
import { RadarChart } from "~components/radar/BaseChart";
import { selectedEdition } from "~components/radar/EditionSwitcher";
import { Labels } from "~components/radar/Labels";
import { LegendTwo } from "~components/radar/Legend";
import { MiniMapControls } from "~components/radar/MiniMapControls";
import {
	getRadarBlipColor,
	MiniMapBlip,
	RadarBlip,
} from "~components/radar/RadarBlip";
import { RadarControls } from "~components/radar/RadarControls";
import { RadarRings } from "~components/radar/RadarRings";
import { RadarSidebar } from "~components/radar/RadarSidebar";
import {
	clearRadarSearchableBlips,
	radarSearchTerm,
	setRadarSearchableBlips,
} from "~components/radar/radarSearchStore";
import type { Blip as TableBlip } from "~components/table/types";
import UseBlipPositions from "~hooks/UseBlipPositions";
import { useBlipSearchResults } from "~hooks/useBlipSearch";
import { miniMapState, radarConfig } from "~stores/radar-store";
import { theme } from "~stores/theme-store";
import type { Blip, BlipWithPosition } from "~types/radar-types";
import type { Edition } from "~utils/editionHelpers";
import { getBlipsForEdition } from "~utils/editionHelpers";

import * as styles from "./Radar.css";
import {
	setRadarSidebarOpenPreference,
	subscribeRadarSidebarOpenPreference,
} from "./radarSidebarState";

const initialTransform = {
	scaleX: 1.27,
	scaleY: 1.27,
	translateX: -211.62,
	translateY: 162.59,
	skewX: 0,
	skewY: 0,
};

const minZoomScale = 0.7;
const maxZoomScale = 2.5;
const wheelZoomSensitivity = 0.0015;
const pinchZoomSensitivity = 0.01;
const minWheelZoomStep = 0.86;
const maxWheelZoomStep = 1.16;
const minPinchZoomStep = 0.92;
const maxPinchZoomStep = 1.08;
const wheelDeltaMode = {
	pixel: 0,
	line: 1,
	page: 2,
} as const;

type RadarWheelEvent = WheelEvent | ReactWheelEvent;

const clamp = (value: number, min: number, max: number) =>
	Math.max(min, Math.min(value, max));

const normalizeWheelDelta = (event: RadarWheelEvent) => {
	const lineHeightDelta = 16;
	const pageHeightDelta = 800;

	if (event.deltaMode === wheelDeltaMode.line) {
		return event.deltaY * lineHeightDelta;
	}

	if (event.deltaMode === wheelDeltaMode.page) {
		return event.deltaY * pageHeightDelta;
	}

	return event.deltaY;
};

const smoothWheelDelta = (event: RadarWheelEvent) => {
	const normalizedDelta = normalizeWheelDelta(event);
	const scale = clamp(
		Math.exp(-normalizedDelta * wheelZoomSensitivity),
		minWheelZoomStep,
		maxWheelZoomStep,
	);

	return { scaleX: scale, scaleY: scale };
};

const smoothPinchDelta: PinchDelta = ({ offset, lastOffset }) => {
	const scaleDelta = offset[0] - lastOffset[0];
	const scale = clamp(
		1 + scaleDelta * pinchZoomSensitivity,
		minPinchZoomStep,
		maxPinchZoomStep,
	);

	return { scaleX: scale, scaleY: scale };
};

const createRadarTransformConstraint = (width: number, height: number) => {
	const minTranslateX = -width * 0.5;
	const maxTranslateX = width * 0.5;
	const minTranslateY = -height * 0.5;
	const maxTranslateY = height * 0.5;

	return (transform: TransformMatrix): TransformMatrix => ({
		...transform,
		scaleX: clamp(transform.scaleX, minZoomScale, maxZoomScale),
		scaleY: clamp(transform.scaleY, minZoomScale, maxZoomScale),
		translateX: clamp(transform.translateX, minTranslateX, maxTranslateX),
		translateY: clamp(transform.translateY, minTranslateY, maxTranslateY),
	});
};

type RadarTooltipState = {
	blip: BlipWithPosition;
	left: number;
	top: number;
};

type RadarTooltipStyle = CSSProperties & {
	readonly "--radar-blip-color": string;
};

type SkeletonBlip = {
	readonly id: string;
	readonly x: number;
	readonly y: number;
	readonly radius: number;
	readonly delay: number;
	readonly duration: number;
};

const skeletonBlips: readonly SkeletonBlip[] = [
	{ id: "s1", x: 628, y: 214, radius: 6, delay: 0, duration: 1700 },
	{ id: "s2", x: 718, y: 352, radius: 4, delay: 180, duration: 1900 },
	{ id: "s3", x: 562, y: 408, radius: 7, delay: 360, duration: 2100 },
	{ id: "s4", x: 774, y: 618, radius: 5, delay: 540, duration: 1800 },
	{ id: "s5", x: 652, y: 752, radius: 4, delay: 720, duration: 2200 },
	{ id: "s6", x: 416, y: 698, radius: 7, delay: 900, duration: 2000 },
	{ id: "s7", x: 294, y: 806, radius: 5, delay: 1080, duration: 1850 },
	{ id: "s8", x: 238, y: 584, radius: 4, delay: 1260, duration: 2050 },
	{ id: "s9", x: 332, y: 468, radius: 6, delay: 1440, duration: 1750 },
	{ id: "s10", x: 196, y: 318, radius: 5, delay: 1620, duration: 2150 },
	{ id: "s11", x: 438, y: 268, radius: 4, delay: 1980, duration: 1900 },
	{ id: "s12", x: 514, y: 612, radius: 6, delay: 2160, duration: 2250 },
];

const getSkeletonBlipStyle = (blip: SkeletonBlip): CSSProperties => ({
	animationDelay: `${blip.delay}ms`,
	animationDuration: `${blip.duration}ms`,
});

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

const RadarLoadingState = ({
	width,
	height,
	centerX,
	centerY,
	state,
}: {
	width: number;
	height: number;
	centerX: number;
	centerY: number;
	state: "loading" | "ready";
}) => (
	<div
		className={styles.radarLoadingOverlay}
		data-state={state}
		aria-hidden="true"
	>
		<svg
			className={styles.radarLoadingSvg}
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			focusable="false"
		>
			<title>Loading radar</title>
			<rect width={width} height={height} rx={14} fill="rgba(0, 0, 0, 0.86)" />
			<g className={styles.radarLoadingGrid}>
				{[100, 200, 300, 400].map((radius) => (
					<circle
						key={`loading-ring-${radius}`}
						cx={centerX}
						cy={centerY}
						r={radius}
						fill="none"
						stroke="rgba(255,255,255,0.18)"
						strokeWidth={1.5}
					/>
				))}
				<line
					x1={centerX}
					y1={100}
					x2={centerX}
					y2={height - 100}
					stroke="rgba(255,255,255,0.12)"
					strokeWidth={2}
				/>
				<line
					x1={100}
					y1={centerY}
					x2={width - 100}
					y2={centerY}
					stroke="rgba(255,255,255,0.12)"
					strokeWidth={2}
				/>
			</g>
			<circle
				className={styles.radarLoadingSweep}
				cx={centerX}
				cy={centerY}
				r={402}
				fill="none"
				stroke="rgba(255,255,255,0.72)"
				strokeWidth={2}
				strokeDasharray="38 84"
			/>
			<g>
				{skeletonBlips.map((blip) => (
					<circle
						key={blip.id}
						className={styles.radarLoadingBlip}
						cx={blip.x}
						cy={blip.y}
						r={blip.radius}
						fill="rgba(255,255,255,0.94)"
						style={getSkeletonBlipStyle(blip)}
					/>
				))}
			</g>
			<text
				x={centerX}
				y={height - 124}
				className={styles.radarLoadingText}
				textAnchor="middle"
			>
				Calibrating tech radar…
			</text>
		</svg>
	</div>
);

const usePersistentRadarSidebar = () => {
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => subscribeRadarSidebarOpenPreference(setIsOpen), []);

	const handleOpenChange = useCallback((nextOpen: boolean) => {
		setIsOpen(nextOpen);
		void setRadarSidebarOpenPreference(nextOpen);
	}, []);

	return { isOpen, handleOpenChange };
};

const Radar = ({ blips, editions }: { blips: Blip[]; editions: Edition[] }) => {
	const { width, height, centerX, centerY } = useStore(radarConfig);
	const { containerRef, TooltipInPortal } = useTooltipInPortal();
	const miniMapstate = useStore(miniMapState);
	const currentTheme = useStore(theme);
	const activeSearchTerm = useStore(radarSearchTerm);
	const [bgColor, setBgColor] = useState<string>("#000000");
	const [tooltip, setTooltip] = useState<RadarTooltipState | null>(null);
	const { isOpen: isSidebarOpen, handleOpenChange: handleSidebarOpenChange } =
		usePersistentRadarSidebar();

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

	useEffect(() => {
		setRadarSearchableBlips(editionBlips);
	}, [editionBlips]);

	useEffect(() => clearRadarSearchableBlips, []);

	const { filteredBlips } = useBlipSearchResults(
		editionBlips,
		activeSearchTerm,
	);
	const tableBlips = useMemo<TableBlip[]>(
		() =>
			filteredBlips.map(
				({ description, hasAdr, id, name, quadrant, ring, tags }) => ({
					description,
					hasAdr,
					id,
					name,
					quadrant,
					ring,
					tags,
				}),
			),
		[filteredBlips],
	);

	// Calculate positions for edition + search filtered blips
	const radarBlips = UseBlipPositions(filteredBlips);

	// Minimap also uses edition-filtered blips (not all blips)
	const miniMapBlips = UseBlipPositions(editionBlips);
	const constrainRadarTransform = useMemo(
		() => createRadarTransformConstraint(width, height),
		[width, height],
	);
	const isRadarPreparing = editions.length > 0 && currentEdition === null;
	const [showRadarLoadingState, setShowRadarLoadingState] =
		useState(isRadarPreparing);

	useEffect(() => {
		if (isRadarPreparing) {
			setShowRadarLoadingState(true);
			return;
		}

		const loadingExitDuration = 420;
		const loadingExitTimer = window.setTimeout(() => {
			setShowRadarLoadingState(false);
		}, loadingExitDuration);

		return () => window.clearTimeout(loadingExitTimer);
	}, [isRadarPreparing]);

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
			scaleXMin={minZoomScale}
			scaleXMax={maxZoomScale}
			scaleYMin={minZoomScale}
			scaleYMax={maxZoomScale}
			initialTransformMatrix={initialTransform}
			wheelDelta={smoothWheelDelta}
			pinchDelta={smoothPinchDelta}
			constrain={constrainRadarTransform}
		>
			{(zoom) => {
				// Generate transform string manually
				const transformString = `matrix(${zoom.transformMatrix.scaleX},${zoom.transformMatrix.skewY},${zoom.transformMatrix.skewX},${zoom.transformMatrix.scaleY},${zoom.transformMatrix.translateX},${zoom.transformMatrix.translateY})`;
				return (
					<div className={styles.radarShell}>
						<RadarSidebar
							editions={editions}
							isOpen={isSidebarOpen}
							onOpenChange={handleSidebarOpenChange}
						/>
						<div
							className={styles.sidebarSpacer}
							data-open={isSidebarOpen ? "true" : "false"}
						/>
						<div className={styles.radarCanvas}>
							<div className={styles.relative} ref={containerRef}>
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
										<Group
											top={centerY}
											left={centerX}
											className={styles.radarBlipLayer}
											data-hovering={hoveredBlipId ? "true" : undefined}
										>
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
													zoom.scale({ scaleX: 1.12, scaleY: 1.12, point });
												}}
											/>
											{radarBlips.map((blip) => (
												<RadarBlip
													key={blip.id}
													blip={blip}
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
								<div className={styles.leftControlsContainer}>
									<LegendTwo />
								</div>
								<RadarControls zoom={zoom} />
								<MiniMapControls />
								{showRadarLoadingState && (
									<RadarLoadingState
										width={width}
										height={height}
										centerX={centerX}
										centerY={centerY}
										state={isRadarPreparing ? "loading" : "ready"}
									/>
								)}
							</div>
						</div>
						<MessageDrawer blips={tableBlips} />
					</div>
				);
			}}
		</Zoom>
	);
};

export default Radar;
