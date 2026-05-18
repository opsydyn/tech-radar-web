import { useStore } from "@nanostores/react";
import { RectClipPath } from "@visx/clip-path";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { useTooltipInPortal } from "@visx/tooltip";
import { Zoom } from "@visx/zoom";
import type {
	PinchDelta,
	ProvidedZoom,
	TransformMatrix,
} from "@visx/zoom/lib/types";
import type {
	CSSProperties,
	MouseEvent,
	WheelEvent as ReactWheelEvent,
} from "react";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageDrawer from "~components/MessageDrawer";
import { RadarChart } from "~components/radar/BaseChart";
import { selectedEdition } from "~components/radar/editionSelectionState";
import { Labels } from "~components/radar/Labels";
import { LegendTwo } from "~components/radar/Legend";
import { MiniMapControls } from "~components/radar/MiniMapControls";
import {
	getRadarBlipColor,
	MiniMapBlip,
	RadarBlip,
	type RadarBlipDetailLevel,
} from "~components/radar/RadarBlip";
import { RadarControls } from "~components/radar/RadarControls";
import { RadarRings } from "~components/radar/RadarRings";
import {
	allRadarTagsValue,
	clearRadarSearchableBlips,
	clearRadarTagFilterSourceBlips,
	radarAdrFilter,
	radarFocusRequest,
	radarSearchTerm,
	radarTagFilter,
	setRadarSearchableBlips,
	setRadarTagFilter,
	setRadarTagFilterSourceBlips,
} from "~components/radar/radarSearchStore";
import type { Blip as TableBlip } from "~components/table/types";
import UseBlipPositions from "~hooks/UseBlipPositions";
import {
	filterBlipsByAdr,
	filterBlipsByTag,
	getAvailableRadarTags,
	useBlipSearchResults,
} from "~hooks/useBlipSearch";
import { miniMapState, radarConfig } from "~stores/radar-store";
import { theme } from "~stores/theme-store";
import type {
	Blip,
	BlipWithPosition,
	RelationshipType,
} from "~types/radar-types";
import type { Edition } from "~utils/editionHelpers";
import { getEditionIdentity } from "~utils/editionHelpers";
import type { RadarEditionViewWithMetadata } from "~utils/editionSnapshotAdapter";

import * as styles from "./Radar.css";
import { subscribeRadarSidebarOpenPreference } from "./radarSidebarState";

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

const radarGridPalettes = {
	dark: {
		major: "rgba(255, 255, 255, 0.105)",
		minor: "rgba(255, 255, 255, 0.05)",
	},
	light: {
		major: "rgba(15, 23, 42, 0.09)",
		minor: "rgba(15, 23, 42, 0.04)",
	},
	machine: {
		major: "rgba(158, 255, 166, 0.085)",
		minor: "rgba(158, 255, 166, 0.042)",
	},
} as const;

const radarGridDimensions = {
	minor: 16,
	major: 64,
} as const;

const radarDetailZoomThresholds = {
	label: 1.5,
	detail: 2.05,
} as const;

const focusZoomScale = 2.12;
const focusAnimationDurationMs = 360;
const focusedBlipPulseDurationMs = 1400;
const relationshipLabelCharacterWidth = 6.5;
const relationshipLabelHorizontalPadding = 14;

const emptyRelatedBlipIds = new Set<string>();

const relationshipTypeLabels = {
	alternative: "Alternative",
	complement: "Complements",
	migration: "Migration",
	prerequisite: "Prerequisite",
	evolution: "Evolution",
	comparison: "Compare",
	ecosystem: "Ecosystem",
} as const satisfies Record<RelationshipType, string>;

const relationshipTypeColors = {
	alternative: "rgba(251, 191, 36, 0.92)",
	complement: "rgba(94, 234, 212, 0.92)",
	migration: "rgba(248, 113, 113, 0.92)",
	prerequisite: "rgba(147, 197, 253, 0.92)",
	evolution: "rgba(192, 132, 252, 0.92)",
	comparison: "rgba(244, 114, 182, 0.92)",
	ecosystem: "rgba(134, 239, 172, 0.92)",
} as const satisfies Record<RelationshipType, string>;

const radarDetailLevelLabelScale = {
	compact: 1,
	label: 1 / radarDetailZoomThresholds.label,
	detail: 1 / radarDetailZoomThresholds.detail,
} as const satisfies Record<RadarBlipDetailLevel, number>;

const getRadarBlipDetailLevel = (zoomScale: number): RadarBlipDetailLevel => {
	if (zoomScale >= radarDetailZoomThresholds.detail) {
		return "detail";
	}

	if (zoomScale >= radarDetailZoomThresholds.label) {
		return "label";
	}

	return "compact";
};

const getSkeletonBlipStyle = (blip: SkeletonBlip): CSSProperties => ({
	animationDelay: `${blip.delay}ms`,
	animationDuration: `${blip.duration}ms`,
});

const createTooltipPosition = (event: MouseEvent<Element>) => ({
	left: event.clientX + 12,
	top: event.clientY - 18,
});

type RadarRelationshipLink = {
	readonly id: string;
	readonly relationshipType: RelationshipType;
	readonly sourceBlip: BlipWithPosition;
	readonly targetBlip: BlipWithPosition;
};

type ActiveRadarRelationships = {
	readonly sourceBlip: BlipWithPosition;
	readonly links: readonly RadarRelationshipLink[];
	readonly relatedBlipIds: ReadonlySet<string>;
};

const getRelationshipLabelWidth = (label: string): number =>
	Math.max(
		86,
		label.length * relationshipLabelCharacterWidth +
			relationshipLabelHorizontalPadding,
	);

const createBlipsById = (
	blips: readonly BlipWithPosition[],
): ReadonlyMap<string, BlipWithPosition> =>
	blips.reduce((blipsById, blip) => blipsById.set(blip.id, blip), new Map());

const createDirectRelationshipLinks = (
	sourceBlip: BlipWithPosition,
	blipsById: ReadonlyMap<string, BlipWithPosition>,
): readonly RadarRelationshipLink[] =>
	(sourceBlip.relatedBlips ?? []).flatMap((relationship) => {
		const targetBlip = blipsById.get(relationship.blipId);
		const isSelfRelationship = relationship.blipId === sourceBlip.id;

		if (!targetBlip || isSelfRelationship) {
			return [];
		}

		return [
			{
				id: `${sourceBlip.id}-${targetBlip.id}-${relationship.relationshipType}-direct`,
				relationshipType: relationship.relationshipType,
				sourceBlip,
				targetBlip,
			},
		];
	});

const createIncomingBidirectionalRelationshipLinks = (
	sourceBlip: BlipWithPosition,
	blips: readonly BlipWithPosition[],
): readonly RadarRelationshipLink[] =>
	blips.flatMap((candidateBlip) =>
		(candidateBlip.relatedBlips ?? [])
			.filter(
				(relationship) =>
					relationship.blipId === sourceBlip.id &&
					relationship.bidirectional &&
					candidateBlip.id !== sourceBlip.id,
			)
			.map((relationship) => ({
				id: `${sourceBlip.id}-${candidateBlip.id}-${relationship.relationshipType}-incoming`,
				relationshipType: relationship.relationshipType,
				sourceBlip,
				targetBlip: candidateBlip,
			})),
	);

const dedupeRelationshipLinks = (
	links: readonly RadarRelationshipLink[],
): readonly RadarRelationshipLink[] => {
	const seenRelationshipKeys = new Set<string>();

	return links.filter((link) => {
		const relationshipKey = `${link.targetBlip.id}:${link.relationshipType}`;

		if (seenRelationshipKeys.has(relationshipKey)) {
			return false;
		}

		seenRelationshipKeys.add(relationshipKey);
		return true;
	});
};

const createActiveRadarRelationships = (
	sourceBlipId: string | null,
	blips: readonly BlipWithPosition[],
): ActiveRadarRelationships | null => {
	if (sourceBlipId === null) {
		return null;
	}

	const blipsById = createBlipsById(blips);
	const sourceBlip = blipsById.get(sourceBlipId);

	if (!sourceBlip) {
		return null;
	}

	const links = dedupeRelationshipLinks([
		...createDirectRelationshipLinks(sourceBlip, blipsById),
		...createIncomingBidirectionalRelationshipLinks(sourceBlip, blips),
	]);

	if (links.length === 0) {
		return null;
	}

	return {
		links,
		relatedBlipIds: new Set(links.map(({ targetBlip }) => targetBlip.id)),
		sourceBlip,
	};
};

type RadarTransformConstraint = ReturnType<
	typeof createRadarTransformConstraint
>;

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

const interpolateTransformMatrix = (
	from: TransformMatrix,
	to: TransformMatrix,
	progress: number,
): TransformMatrix => {
	const easedProgress = easeOutCubic(progress);
	const interpolate = (fromValue: number, toValue: number) =>
		fromValue + (toValue - fromValue) * easedProgress;

	return {
		scaleX: interpolate(from.scaleX, to.scaleX),
		scaleY: interpolate(from.scaleY, to.scaleY),
		skewX: interpolate(from.skewX, to.skewX),
		skewY: interpolate(from.skewY, to.skewY),
		translateX: interpolate(from.translateX, to.translateX),
		translateY: interpolate(from.translateY, to.translateY),
	};
};

const createFocusedBlipTransform = ({
	blip,
	centerX,
	centerY,
	height,
	width,
	currentTransform,
}: {
	readonly blip: BlipWithPosition;
	readonly centerX: number;
	readonly centerY: number;
	readonly height: number;
	readonly width: number;
	readonly currentTransform: TransformMatrix;
}): TransformMatrix => {
	const targetScale = clamp(
		Math.max(currentTransform.scaleX, focusZoomScale),
		minZoomScale,
		maxZoomScale,
	);
	const focusedX = centerX + blip.position.x;
	const focusedY = centerY + blip.position.y;

	return {
		scaleX: targetScale,
		scaleY: targetScale,
		skewX: 0,
		skewY: 0,
		translateX: width / 2 - focusedX * targetScale,
		translateY: height / 2 - focusedY * targetScale,
	};
};

const animateRadarTransform = ({
	from,
	to,
	setTransformMatrix,
	onComplete,
}: {
	readonly from: TransformMatrix;
	readonly to: TransformMatrix;
	readonly setTransformMatrix: (transform: TransformMatrix) => void;
	readonly onComplete?: () => void;
}): (() => void) => {
	let animationFrameId: number | null = null;
	const startedAt = performance.now();

	const step = (currentTime: number) => {
		const progress = clamp(
			(currentTime - startedAt) / focusAnimationDurationMs,
			0,
			1,
		);

		setTransformMatrix(interpolateTransformMatrix(from, to, progress));

		if (progress < 1) {
			animationFrameId = requestAnimationFrame(step);
			return;
		}

		onComplete?.();
	};

	animationFrameId = requestAnimationFrame(step);

	return () => {
		if (animationFrameId !== null) {
			cancelAnimationFrame(animationFrameId);
		}
	};
};

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

const renderRadarRelationshipLink = ({
	labelScale,
	link,
	shouldShowRelationshipLabels,
}: {
	readonly labelScale: number;
	readonly link: RadarRelationshipLink;
	readonly shouldShowRelationshipLabels: boolean;
}) => {
	const { id, relationshipType, sourceBlip, targetBlip } = link;
	const label = relationshipTypeLabels[relationshipType];
	const labelWidth = getRelationshipLabelWidth(label);
	const labelColor = relationshipTypeColors[relationshipType];
	const midpointX = (sourceBlip.position.x + targetBlip.position.x) / 2;
	const midpointY = (sourceBlip.position.y + targetBlip.position.y) / 2;

	return (
		<g key={id}>
			<line
				x1={sourceBlip.position.x}
				y1={sourceBlip.position.y}
				x2={targetBlip.position.x}
				y2={targetBlip.position.y}
				stroke={labelColor}
				strokeWidth={2.2}
				strokeLinecap="square"
				strokeDasharray="7 7"
			/>
			<circle
				cx={targetBlip.position.x}
				cy={targetBlip.position.y}
				r={18}
				fill="none"
				stroke={labelColor}
				strokeWidth={2.4}
			/>
			{shouldShowRelationshipLabels && (
				<g
					transform={`translate(${midpointX - labelWidth / 2}, ${
						midpointY - 10
					}) scale(${labelScale})`}
				>
					<rect
						x={0}
						y={-12}
						width={labelWidth}
						height={18}
						rx={0}
						fill="rgba(2, 6, 23, 0.78)"
						stroke={labelColor}
						strokeWidth={1}
					/>
					<text
						x={labelWidth / 2}
						y={1}
						fill="rgba(248, 250, 252, 0.94)"
						fontFamily="IBM Plex Mono, monospace"
						fontSize={9}
						fontWeight={800}
						textAnchor="middle"
					>
						{label}
					</text>
				</g>
			)}
		</g>
	);
};

const RadarRelationshipOverlay = memo(function RadarRelationshipOverlay({
	detailLevel,
	labelScale,
	relationships,
}: {
	readonly detailLevel: RadarBlipDetailLevel;
	readonly labelScale: number;
	readonly relationships: ActiveRadarRelationships | null;
}) {
	if (relationships === null) {
		return null;
	}

	const shouldShowRelationshipLabels = detailLevel === "detail";

	return (
		<g className={styles.radarRelationshipOverlay}>
			{relationships.links.map((link) =>
				renderRadarRelationshipLink({
					labelScale,
					link,
					shouldShowRelationshipLabels,
				}),
			)}
		</g>
	);
});

type RadarBlipCollectionProps = {
	readonly blips: readonly BlipWithPosition[];
	readonly detailLevel: RadarBlipDetailLevel;
	readonly labelScale: number;
	readonly focusedBlipId: string | null;
	readonly hoveredBlipId: string | null;
	readonly relatedBlipIds: ReadonlySet<string>;
	readonly relationshipSourceBlipId: string | null;
	readonly onHover: (
		event: MouseEvent<Element>,
		blip: BlipWithPosition,
	) => void;
	readonly onUnhover: () => void;
};

const RadarBlipCollection = memo(function RadarBlipCollection({
	blips,
	detailLevel,
	labelScale,
	focusedBlipId,
	hoveredBlipId,
	relatedBlipIds,
	relationshipSourceBlipId,
	onHover,
	onUnhover,
}: RadarBlipCollectionProps) {
	return (
		<>
			{blips.map((blip) => (
				<RadarBlip
					key={blip.id}
					blip={blip}
					detailLevel={detailLevel}
					labelScale={labelScale}
					isFocused={focusedBlipId === blip.id}
					isHovered={hoveredBlipId === blip.id}
					isRelated={relatedBlipIds.has(blip.id)}
					isRelationshipSource={relationshipSourceBlipId === blip.id}
					onHover={onHover}
					onUnhover={onUnhover}
				/>
			))}
		</>
	);
});

const MiniMapBlipCollection = memo(function MiniMapBlipCollection({
	blips,
}: {
	readonly blips: readonly BlipWithPosition[];
}) {
	return (
		<>
			{blips.map((blip) => (
				<MiniMapBlip key={blip.id} blip={blip} />
			))}
		</>
	);
});

type RadarZoom = ProvidedZoom<SVGSVGElement> & {
	readonly transformMatrix: TransformMatrix;
};

const RadarFocusController = ({
	activeSearchTerm,
	blips,
	centerX,
	centerY,
	constrainTransform,
	height,
	onFocusedBlipChange,
	width,
	zoom,
}: {
	readonly activeSearchTerm: string;
	readonly blips: readonly BlipWithPosition[];
	readonly centerX: number;
	readonly centerY: number;
	readonly constrainTransform: RadarTransformConstraint;
	readonly height: number;
	readonly onFocusedBlipChange: (blipId: string | null) => void;
	readonly width: number;
	readonly zoom: RadarZoom;
}) => {
	const focusRequest = useStore(radarFocusRequest);
	const handledRequestIdRef = useRef<number | null>(null);
	const cancelAnimationRef = useRef<(() => void) | null>(null);
	const pulseTimerRef = useRef<number | null>(null);

	useEffect(() => {
		if (!activeSearchTerm.trim()) {
			onFocusedBlipChange(null);
		}
	}, [activeSearchTerm, onFocusedBlipChange]);

	useEffect(
		() => () => {
			cancelAnimationRef.current?.();

			if (pulseTimerRef.current !== null) {
				window.clearTimeout(pulseTimerRef.current);
			}
		},
		[],
	);

	useEffect(() => {
		if (
			focusRequest === null ||
			handledRequestIdRef.current === focusRequest.id
		) {
			return;
		}

		const targetBlip = focusRequest.targetBlipId
			? blips.find((blip) => blip.id === focusRequest.targetBlipId)
			: blips[0];

		if (!targetBlip) {
			return;
		}

		handledRequestIdRef.current = focusRequest.id;
		cancelAnimationRef.current?.();

		if (pulseTimerRef.current !== null) {
			window.clearTimeout(pulseTimerRef.current);
		}

		const constrainedTargetTransform = constrainTransform(
			createFocusedBlipTransform({
				blip: targetBlip,
				centerX,
				centerY,
				currentTransform: zoom.transformMatrix,
				height,
				width,
			}),
		);

		onFocusedBlipChange(targetBlip.id);
		cancelAnimationRef.current = animateRadarTransform({
			from: zoom.transformMatrix,
			onComplete: () => {
				cancelAnimationRef.current = null;
			},
			setTransformMatrix: zoom.setTransformMatrix,
			to: constrainedTargetTransform,
		});

		pulseTimerRef.current = window.setTimeout(() => {
			onFocusedBlipChange(null);
			pulseTimerRef.current = null;
		}, focusedBlipPulseDurationMs);
	}, [
		blips,
		centerX,
		centerY,
		constrainTransform,
		focusRequest,
		height,
		onFocusedBlipChange,
		width,
		zoom.setTransformMatrix,
		zoom.transformMatrix,
	]);

	return null;
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
			<rect width={width} height={height} rx={0} fill="rgba(0, 0, 0, 0.86)" />
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

	return { isOpen };
};

type RadarProps = {
	editions: Edition[];
	editionViews?: readonly RadarEditionViewWithMetadata[];
};

const Radar = ({ editionViews, editions }: RadarProps) => {
	const { width, height, centerX, centerY } = useStore(radarConfig);
	const { containerRef, TooltipInPortal } = useTooltipInPortal();
	const miniMapstate = useStore(miniMapState);
	const currentTheme = useStore(theme);
	const activeAdrFilter = useStore(radarAdrFilter);
	const activeSearchTerm = useStore(radarSearchTerm);
	const activeTagFilter = useStore(radarTagFilter);
	const [bgColor, setBgColor] = useState<string>("#000000");
	const [tooltip, setTooltip] = useState<RadarTooltipState | null>(null);
	const { isOpen: isSidebarOpen } = usePersistentRadarSidebar();
	const radarGridPalette =
		radarGridPalettes[currentTheme as keyof typeof radarGridPalettes] ??
		radarGridPalettes.dark;

	// Handle theme state on client-side only to avoid hydration mismatch
	useEffect(() => {
		setBgColor(currentTheme === "light" ? "#ffffff" : "#000000");
	}, [currentTheme]);

	// Edition snapshots define the visible radar blips. Legacy canonical blips are
	// only used upstream to enrich those snapshots with shared blip metadata.
	const currentEdition = useStore(selectedEdition);

	const snapshotEditionBlips = useMemo(
		() =>
			currentEdition && editionViews
				? (editionViews.find(
						({ edition }) =>
							edition.id === getEditionIdentity(currentEdition) ||
							edition.number === currentEdition.number,
					)?.blips ?? [])
				: null,
		[currentEdition, editionViews],
	);

	const editionBlips = useMemo<Blip[]>(
		() => [...(snapshotEditionBlips ?? [])],
		[snapshotEditionBlips],
	);

	const adrFilteredRadarBlips = useMemo<Blip[]>(
		() => [...filterBlipsByAdr(editionBlips, activeAdrFilter)],
		[activeAdrFilter, editionBlips],
	);

	const tagFilteredRadarBlips = useMemo<Blip[]>(
		() => [...filterBlipsByTag(adrFilteredRadarBlips, activeTagFilter)],
		[activeTagFilter, adrFilteredRadarBlips],
	);

	useEffect(() => {
		setRadarTagFilterSourceBlips(adrFilteredRadarBlips);
	}, [adrFilteredRadarBlips]);

	useEffect(() => {
		if (activeTagFilter === allRadarTagsValue) {
			return;
		}

		if (
			!getAvailableRadarTags(adrFilteredRadarBlips).includes(activeTagFilter)
		) {
			setRadarTagFilter(allRadarTagsValue);
		}
	}, [activeTagFilter, adrFilteredRadarBlips]);

	useEffect(() => {
		setRadarSearchableBlips(tagFilteredRadarBlips);
	}, [tagFilteredRadarBlips]);

	useEffect(
		() => () => {
			clearRadarSearchableBlips();
			clearRadarTagFilterSourceBlips();
		},
		[],
	);

	const { filteredBlips } = useBlipSearchResults(
		tagFilteredRadarBlips,
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

	// Calculate positions for selected-edition + search-filtered blips.
	const radarBlips = UseBlipPositions(filteredBlips);

	const miniMapBlips = UseBlipPositions(adrFilteredRadarBlips);
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
	const [focusedBlipId, setFocusedBlipId] = useState<string | null>(null);
	const handleFocusedBlipChange = useCallback((blipId: string | null) => {
		setFocusedBlipId(blipId);
	}, []);
	const activeRelationshipSourceBlipId = hoveredBlipId ?? focusedBlipId;
	const activeRadarRelationships = useMemo(
		() =>
			createActiveRadarRelationships(
				activeRelationshipSourceBlipId,
				radarBlips,
			),
		[activeRelationshipSourceBlipId, radarBlips],
	);
	const relatedBlipIds =
		activeRadarRelationships?.relatedBlipIds ?? emptyRelatedBlipIds;
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
				const zoomScale = zoom.transformMatrix.scaleX;
				const blipDetailLevel = getRadarBlipDetailLevel(zoomScale);
				const blipLabelScale = radarDetailLevelLabelScale[blipDetailLevel];
				const isRelationshipModeActive =
					activeRelationshipSourceBlipId !== null &&
					activeRadarRelationships !== null;
				return (
					<div className={styles.radarShell}>
						<RadarFocusController
							activeSearchTerm={activeSearchTerm}
							blips={radarBlips}
							centerX={centerX}
							centerY={centerY}
							constrainTransform={constrainRadarTransform}
							height={height}
							onFocusedBlipChange={handleFocusedBlipChange}
							width={width}
							zoom={zoom}
						/>
						<div
							className={styles.sidebarSpacer}
							data-open={isSidebarOpen ? "true" : "false"}
							data-radar-sidebar-spacer=""
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
										<pattern
											id="radar-grid-minor"
											width={radarGridDimensions.minor}
											height={radarGridDimensions.minor}
											patternUnits="userSpaceOnUse"
										>
											<path
												d={`M ${radarGridDimensions.minor} 0 L 0 0 0 ${radarGridDimensions.minor}`}
												fill="none"
												stroke={radarGridPalette.minor}
												strokeWidth="1"
											/>
										</pattern>
										<pattern
											id="radar-grid-major"
											width={radarGridDimensions.major}
											height={radarGridDimensions.major}
											patternUnits="userSpaceOnUse"
										>
											<rect
												width={radarGridDimensions.major}
												height={radarGridDimensions.major}
												fill="url(#radar-grid-minor)"
											/>
											<path
												d={`M ${radarGridDimensions.major} 0 L 0 0 0 ${radarGridDimensions.major}`}
												fill="none"
												stroke={radarGridPalette.major}
												strokeWidth="1.1"
											/>
										</pattern>
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
									<rect width={width} height={height} rx={0} fill={bgColor} />
									<rect
										width={width}
										height={height}
										rx={0}
										fill="url(#radar-grid-major)"
									/>
									<g transform={transformString}>
										<RadarChart />
										<Labels />
										<Group
											top={centerY}
											left={centerX}
											className={styles.radarBlipLayer}
											data-hovering={
												isRelationshipModeActive ? "true" : undefined
											}
										>
											<RadarRings />
											{/* Global dimming overlay */}
											{isRelationshipModeActive && (
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
											<RadarRelationshipOverlay
												detailLevel={blipDetailLevel}
												labelScale={blipLabelScale}
												relationships={activeRadarRelationships}
											/>
											{/* biome-ignore lint/a11y/noStaticElementInteractions: transparent SVG hit layer delegates drag, touch, and zoom gestures for the radar surface. */}
											<rect
												x={-centerX}
												y={-centerY}
												width={width}
												height={height}
												rx={0}
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
											<RadarBlipCollection
												blips={radarBlips}
												detailLevel={blipDetailLevel}
												labelScale={blipLabelScale}
												focusedBlipId={focusedBlipId}
												hoveredBlipId={hoveredBlipId}
												relatedBlipIds={relatedBlipIds}
												relationshipSourceBlipId={
													activeRelationshipSourceBlipId
												}
												onHover={handleBlipHover}
												onUnhover={handleBlipUnhover}
											/>
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
											<rect width={width} height={height} fill={bgColor} />
											<rect
												width={width}
												height={height}
												fill="url(#radar-grid-major)"
											/>
											<RadarChart />
											<Labels />
											<Group top={centerY} left={centerX}>
												<RadarRings />
												<MiniMapBlipCollection blips={miniMapBlips} />
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
