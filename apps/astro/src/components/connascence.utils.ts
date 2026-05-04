// Pure transformation functions for Connascence Chart visualization
// Following functional programming patterns from CLAUDE.md

import { Either } from "effect";
import {
	CONNASCENCE_DEFINITIONS,
	type ConnascenceData,
	type ConnascenceEntry,
	type ConnascenceError,
	SEVERITY_COLORS,
	SEVERITY_THRESHOLDS,
	type SeverityCategory,
	createConnascenceEntry,
} from "./connascence.types";

// 🎯 Configuration constants
const CHART_CONFIG = {
	DEFAULT_WIDTH: 600,
	DEFAULT_HEIGHT: 400,
	MIN_BAR_HEIGHT: 20,
	MAX_BAR_HEIGHT: 40,
	PADDING: { top: 20, right: 60, bottom: 40, left: 180 },
	LABEL_FONT_SIZE: 12,
	VALUE_FONT_SIZE: 10,
} as const;

// 📊 Pure function to generate connascence data
export const generateConnascenceData = (): Either.Either<
	ConnascenceData,
	ConnascenceError
> => {
	const entries: ConnascenceEntry[] = [];

	// Transform definitions into typed entries
	for (const [typeName, definition] of Object.entries(
		CONNASCENCE_DEFINITIONS,
	)) {
		const entryResult = createConnascenceEntry(
			typeName,
			definition.description,
			definition.severity,
			definition.category,
			[...definition.examples],
		);

		if (Either.isLeft(entryResult)) {
			return Either.left(entryResult.left);
		}

		entries.push(entryResult.right);
	}

	// Sort by severity (ascending - worst to best)
	const sortedEntries = entries.sort(
		(a, b) => Number(a.severity) - Number(b.severity),
	);

	const maxSeverity = Math.max(...sortedEntries.map((e) => Number(e.severity)));
	const categories = Array.from(new Set(sortedEntries.map((e) => e.category)));

	return Either.right({
		entries: sortedEntries,
		maxSeverity: maxSeverity as import("./connascence.types").SeverityLevel,
		categories: categories as readonly SeverityCategory[],
	});
};

// 🎨 Pure function to calculate bar dimensions
export const calculateBarDimensions = (
	data: ConnascenceData,
	width: number,
	height: number,
): Either.Either<
	{ barHeight: number; maxBarWidth: number; yScale: (index: number) => number },
	ConnascenceError
> => {
	if (width <= 0 || height <= 0) {
		return Either.left({
			type: "CalculationError",
			operation: "calculateBarDimensions",
			message: "Width and height must be positive",
		});
	}

	const availableHeight =
		height - CHART_CONFIG.PADDING.top - CHART_CONFIG.PADDING.bottom;
	const availableWidth =
		width - CHART_CONFIG.PADDING.left - CHART_CONFIG.PADDING.right;

	const barHeight = Math.min(
		Math.max(
			availableHeight / data.entries.length,
			CHART_CONFIG.MIN_BAR_HEIGHT,
		),
		CHART_CONFIG.MAX_BAR_HEIGHT,
	);

	const yScale = (index: number) =>
		CHART_CONFIG.PADDING.top + index * (barHeight + 5);

	return Either.right({
		barHeight,
		maxBarWidth: availableWidth,
		yScale,
	});
};

// 🎯 Pure function to calculate bar width based on severity
export const calculateBarWidth = (
	severity: number,
	maxSeverity: number,
	maxBarWidth: number,
): number => {
	return (severity / maxSeverity) * maxBarWidth;
};

// 🎨 Pure function to get color by severity level
export const getSeverityColor = (severity: number): string => {
	const colorMap = {
		low: SEVERITY_COLORS.low,
		medium: SEVERITY_COLORS.medium,
		high: SEVERITY_COLORS.high,
	};

	if (severity <= SEVERITY_THRESHOLDS.low.max) return colorMap.low;
	if (severity <= SEVERITY_THRESHOLDS.medium.max) return colorMap.medium;
	return colorMap.high;
};

// 📊 Pure function to format connascence type name
export const formatConnascenceTypeName = (typeName: string): string => {
	// Remove "Connascence of " prefix for cleaner display
	return typeName.replace("Connascence of ", "");
};

// 🎯 Pure function to get category statistics
export const getCategoryStats = (
	data: ConnascenceData,
): {
	[K in SeverityCategory]: {
		count: number;
		averageSeverity: number;
		entries: ConnascenceEntry[];
	};
} => {
	const stats = {
		low: { count: 0, averageSeverity: 0, entries: [] as ConnascenceEntry[] },
		medium: { count: 0, averageSeverity: 0, entries: [] as ConnascenceEntry[] },
		high: { count: 0, averageSeverity: 0, entries: [] as ConnascenceEntry[] },
	};

	// Group entries by category
	for (const entry of data.entries) {
		stats[entry.category].entries.push(entry);
		stats[entry.category].count++;
	}

	// Calculate average severity for each category
	for (const category of Object.keys(stats) as SeverityCategory[]) {
		const categoryStats = stats[category];
		if (categoryStats.count > 0) {
			const totalSeverity = categoryStats.entries.reduce(
				(sum, entry) => sum + Number(entry.severity),
				0,
			);
			categoryStats.averageSeverity = totalSeverity / categoryStats.count;
		}
	}

	return stats;
};

// 🎨 Pure function to generate tooltip content
export const generateTooltipContent = (
	entry: ConnascenceEntry,
): {
	title: string;
	description: string;
	severity: string;
	examples: string;
} => {
	return {
		title: entry.type,
		description: entry.description,
		severity: `Severity: ${entry.severity}/10 (${entry.category})`,
		examples:
			entry.examples.length > 0
				? `Examples: ${entry.examples.join(", ")}`
				: "No examples available",
	};
};

// 🎯 Pure function to validate chart dimensions
export const validateChartDimensions = (
	width: number,
	height: number,
): Either.Either<{ width: number; height: number }, ConnascenceError> => {
	if (width < 300 || height < 200) {
		return Either.left({
			type: "ValidationError",
			field: "dimensions",
			message: "Chart dimensions must be at least 300x200 pixels",
		});
	}

	if (width > 1200 || height > 800) {
		return Either.left({
			type: "ValidationError",
			field: "dimensions",
			message: "Chart dimensions must not exceed 1200x800 pixels",
		});
	}

	return Either.right({ width, height });
};

// 🎪 Pure function to create chart scales
export const createChartScales = (
	data: ConnascenceData,
	width: number,
	height: number,
) => {
	const dimensionsResult = calculateBarDimensions(data, width, height);

	if (Either.isLeft(dimensionsResult)) {
		return Either.left(dimensionsResult.left);
	}

	const { barHeight, maxBarWidth, yScale } = dimensionsResult.right;

	// X scale for severity values
	const xScale = (value: number) =>
		CHART_CONFIG.PADDING.left +
		calculateBarWidth(value, Number(data.maxSeverity), maxBarWidth);

	// Color scale
	const colorScale = (severity: number) => getSeverityColor(severity);

	return Either.right({
		xScale,
		yScale,
		colorScale,
		barHeight,
		maxBarWidth,
	});
};

// 🎯 Export configuration for component usage
export const CONNASCENCE_CHART_CONFIG = {
	...CHART_CONFIG,
	SEVERITY_COLORS,
	SEVERITY_THRESHOLDS,
} as const;

// 🧮 Utility functions for component integration
export const createDefaultConnascenceData = (): Either.Either<
	ConnascenceData,
	ConnascenceError
> => {
	return generateConnascenceData();
};

export const getConnascenceTypeByName = (
	data: ConnascenceData,
	typeName: string,
): ConnascenceEntry | null => {
	return data.entries.find((entry) => entry.type === typeName) || null;
};

export const getSeverityRange = (
	data: ConnascenceData,
): { min: number; max: number } => {
	const severities = data.entries.map((entry) => Number(entry.severity));
	return {
		min: Math.min(...severities),
		max: Math.max(...severities),
	};
};
