import { AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { LegendOrdinal } from "@visx/legend";
import { scaleBand, scaleOrdinal, scaleTime } from "@visx/scale";
import { Text } from "@visx/text";
import { useEffect, useMemo, useState } from "react";
import { hardEdgeRadius } from "../styles/theme.css";
import type { MoveTuple, MoveType } from "../types/radar-types";
import { formatShortDate, normalizeDateValue } from "../utils/dateFormatter";

export type BlipHistoryEvent = {
	readonly actualDate: string;
	readonly date: Date;
	readonly dateLabel: string;
	readonly moveLabel: string;
	readonly moveType: MoveType;
};

export type MoveCounts = Readonly<Record<MoveType, number>>;

export type BlipHistoryProps = {
	width: number;
	height: number;
	moveHistory: MoveTuple[];
	margin?: { top: number; right: number; bottom: number; left: number };
	events?: boolean;
};

const lightColors = {
	grow: "#36cf57",
	go: "#e91e63",
	stay: "#71e3e2",
} as const satisfies Record<MoveType, string>;

const darkColors = {
	grow: "#4CAF50",
	go: "#FF5252",
	stay: "#64FFDA",
} as const satisfies Record<MoveType, string>;

const moveLabels = {
	grow: "Moved In",
	go: "Moved Out",
	stay: "Stayed",
} as const satisfies Record<MoveType, string>;

const moveRows: readonly MoveType[] = ["grow", "stay", "go"];
const legendOrder: readonly MoveType[] = ["grow", "go", "stay"];
const oneDayMilliseconds = 24 * 60 * 60 * 1000;

const defaultMargin = { top: 44, left: 120, right: 40, bottom: 96 };

export const transformMoveHistoryToTimelineEvents = (
	moveHistory: MoveTuple[],
): readonly BlipHistoryEvent[] =>
	[...moveHistory]
		.sort(
			(a, b) =>
				new Date(normalizeDateValue(a[1])).getTime() -
				new Date(normalizeDateValue(b[1])).getTime(),
		)
		.map(([moveType, dateValue]) => {
			const actualDate = normalizeDateValue(dateValue, "No date recorded");

			return {
				actualDate,
				date: new Date(actualDate),
				dateLabel: formatShortDate(dateValue),
				moveLabel: moveLabels[moveType],
				moveType,
			};
		});

export const countMovesByType = (
	events: readonly BlipHistoryEvent[],
): MoveCounts => {
	const counts: Record<MoveType, number> = { go: 0, grow: 0, stay: 0 };

	for (const event of events) {
		counts[event.moveType] += 1;
	}

	return counts;
};

const BlipHistory = ({
	width,
	height,
	moveHistory,
	margin = defaultMargin,
	events: _events = false,
}: BlipHistoryProps) => {
	const [isDarkTheme, setIsDarkTheme] = useState(false);

	useEffect(() => {
		const checkTheme = () => {
			const theme = document.documentElement.getAttribute("data-theme");
			setIsDarkTheme(theme === "dark");
		};

		checkTheme();

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === "data-theme") {
					checkTheme();
				}
			}
		});

		observer.observe(document.documentElement, { attributes: true });

		return () => observer.disconnect();
	}, []);

	const colors = isDarkTheme ? darkColors : lightColors;

	const themeStyles = {
		axisStroke: isDarkTheme ? "#888888" : "#333333",
		background: isDarkTheme ? "#333333" : "#f9f9f9",
		emptyText: isDarkTheme ? "#aaaaaa" : "#666666",
		gridStroke: isDarkTheme ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
		pointOutline: isDarkTheme ? "#0f1115" : "#ffffff",
		text: isDarkTheme ? "#ffffff" : "#333333",
		timelineStroke: isDarkTheme ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.22)",
	};

	const timelineEvents = useMemo(
		() => transformMoveHistoryToTimelineEvents(moveHistory),
		[moveHistory],
	);
	const moveCounts = useMemo(
		() => countMovesByType(timelineEvents),
		[timelineEvents],
	);

	if (timelineEvents.length === 0) {
		return (
			<div
				style={{
					width: "100%",
					maxWidth: `${width}px`,
					height,
					boxSizing: "border-box",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background: themeStyles.background,
					borderRadius: hardEdgeRadius,
					color: themeStyles.emptyText,
				}}
			>
				No movement history available
			</div>
		);
	}

	const xMax = width - margin.left - margin.right;
	const yMax = height - margin.top - margin.bottom;
	const firstDate = timelineEvents[0]?.date;
	const lastDate = timelineEvents[timelineEvents.length - 1]?.date;
	const hasSingleDate =
		firstDate !== undefined &&
		lastDate !== undefined &&
		firstDate.getTime() === lastDate.getTime();

	const xDomain =
		firstDate && lastDate
			? hasSingleDate
				? [
						new Date(firstDate.getTime() - oneDayMilliseconds),
						new Date(lastDate.getTime() + oneDayMilliseconds),
					]
				: [firstDate, lastDate]
			: [new Date(), new Date()];

	const dateScale = scaleTime<number>({
		domain: xDomain,
		range: [0, xMax],
	});

	const moveScale = scaleBand<MoveType>({
		domain: [...moveRows],
		paddingInner: 0.42,
		paddingOuter: 0.22,
		range: [0, yMax],
	});

	const colorScale = scaleOrdinal<MoveType, string>({
		domain: [...legendOrder],
		range: legendOrder.map((key) => colors[key]),
	});

	const getMoveY = (moveType: MoveType) => {
		const y = moveScale(moveType);

		return (y ?? 0) + moveScale.bandwidth() / 2;
	};

	return (
		<div
			style={{
				position: "relative",
				width: "100%",
				maxWidth: `${width}px`,
			}}
		>
			<svg
				width={width}
				height={height}
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="xMinYMin meet"
				style={{ display: "block", width: "100%", height: "auto" }}
			>
				<title>Movement history timeline</title>
				<rect
					width={width}
					height={height}
					fill={themeStyles.background}
					rx={0}
				/>
				<Group left={margin.left} top={margin.top}>
					{moveRows.map((moveType) => {
						const y = getMoveY(moveType);

						return (
							<Group key={moveType}>
								<line
									x1={0}
									x2={xMax}
									y1={y}
									y2={y}
									stroke={themeStyles.gridStroke}
									strokeDasharray="4 6"
								/>
								<Text
									x={-14}
									y={y}
									fill={themeStyles.text}
									fontSize={12}
									textAnchor="end"
									verticalAnchor="middle"
								>
									{moveLabels[moveType]}
								</Text>
							</Group>
						);
					})}

					{timelineEvents.slice(1).map((event, index) => {
						const previousEvent = timelineEvents[index];

						return (
							<line
								key={`${previousEvent.actualDate}-${event.actualDate}`}
								x1={dateScale(previousEvent.date)}
								x2={dateScale(event.date)}
								y1={getMoveY(previousEvent.moveType)}
								y2={getMoveY(event.moveType)}
								stroke={themeStyles.timelineStroke}
								strokeWidth={2}
							/>
						);
					})}

					{timelineEvents.map((event) => {
						return (
							<circle
								key={`${event.moveType}-${event.actualDate}`}
								cx={dateScale(event.date)}
								cy={getMoveY(event.moveType)}
								r={10}
								fill={colorScale(event.moveType)}
								stroke={themeStyles.pointOutline}
								strokeWidth={3}
							>
								<title>{`${event.moveLabel} — ${event.actualDate}`}</title>
							</circle>
						);
					})}

					<AxisBottom
						top={yMax}
						scale={dateScale}
						numTicks={Math.min(timelineEvents.length, 5)}
						tickFormat={(value) =>
							formatShortDate(
								value instanceof Date ? value : new Date(value.valueOf()),
							)
						}
						stroke={themeStyles.axisStroke}
						tickStroke={themeStyles.axisStroke}
						tickLabelProps={() => ({
							fill: themeStyles.text,
							fontSize: 12,
							textAnchor: "middle",
						})}
					/>

					<Text
						x={xMax / 2}
						y={-20}
						textAnchor="middle"
						fontSize={16}
						fontWeight="bold"
						fill={themeStyles.text}
					>
						Recorded movement events
					</Text>
				</Group>
			</svg>

			<div
				style={{
					position: "absolute",
					bottom: 20,
					width: "100%",
					display: "flex",
					justifyContent: "center",
					fontSize: "14px",
				}}
			>
				<div style={{ color: themeStyles.text }}>
					<LegendOrdinal
						scale={colorScale}
						direction="row"
						labelMargin="0 15px 0 0"
						shape="circle"
						style={{ display: "flex", alignItems: "center" }}
						labelFormat={(label) =>
							`${moveLabels[label]} (${moveCounts[label]})`
						}
					/>
				</div>
			</div>
		</div>
	);
};

export default BlipHistory;
