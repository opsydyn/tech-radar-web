import { style } from "@vanilla-extract/css";
import { pipe } from "effect";

// --- System DNA ---

export const ScaleRatios = {
	GoldenRatio: 1.618,
	MajorSecond: 1.125,
	MinorThird: 1.2,
	MajorThird: 1.25,
	PerfectFourth: 1.333,
	PerfectFifth: 1.5,
	MinorSixth: 1.6,
	MajorSixth: 1.6667,
	MinorSeventh: 1.778,
	MajorSeventh: 1.875,
	Octave: 2,
} as const;

export type ScaleRatio = (typeof ScaleRatios)[keyof typeof ScaleRatios];

// --- Style Generator Functions ---

/**
 * Creates a function that generates typography styles based on a modular scale.
 */
export const createTypographyScale =
	(ratio: ScaleRatio) =>
	(level: number): string => {
		const fontSizeRem = +(1 * ratio ** level).toFixed(3);
		const lineHeightRem = +(fontSizeRem * 1.5).toFixed(3);
		return style({
			fontSize: `${fontSizeRem}rem`,
			lineHeight: `${lineHeightRem}rem`,
		});
	};

/**
 * Creates a full grid style with display: grid and scaled columns.
 */
export const createGridStyle = (ratio: ScaleRatio, count: number, base = 1) => {
	return style({
		display: "grid",
		gridTemplateColumns: createGridColumns(ratio, count, base),
	});
};

/**
 * Creates a function that generates spacing styles (margin and padding) based on a modular scale.
 */
export const createSpacingScale = (ratio: ScaleRatio) => (level: number) => {
	const spacingRem = (0.5 * ratio ** level).toFixed(3);
	return style({
		margin: `${spacingRem}rem`,
		padding: `${spacingRem}rem`,
	});
};

/**
 * Creates a function that generates gap styles based on a modular scale.
 */
export const createGapScale = (ratio: ScaleRatio) => (level: number) => {
	const gapRem = (0.5 * ratio ** level).toFixed(3);
	return style({
		gap: `${gapRem}rem`,
	});
};

// --- Value Generator Functions ---

/**
 * Creates an object containing typography values (fontSize, lineHeight) for a given scale level.
 */
/**
 * Creates a map of named spacing values (e.g., s1, s2) based on a modular scale.
 * This is designed for consumption by systems like vanilla-extract's sprinkles.
 */
const createSpacingValueMap =
	(ratio: ScaleRatio, base = 0.25) =>
	(count: number): Record<`s${number}` | "none", string> => {
		const generatedValues = pipe(
			Array.from({ length: count }, (_, i) => i),
			(indices) =>
				indices.map((i): [`s${number}`, string] => {
					const level = i + 1;
					const value = +(base * ratio ** i).toFixed(3);
					return [`s${level}`, `${value}rem`];
				}),
			Object.fromEntries,
		);

		return {
			none: "0rem",
			...generatedValues,
		};
	};

/**
 * Creates a grid-template-columns string based on a modular scale.
 */
const createGridColumns = (
	ratio: ScaleRatio,
	count: number,
	base = 1,
): string => {
	const cols = Array.from({ length: count }, (_, i) => {
		const size = +(base * ratio ** i).toFixed(2);
		return `${size}rem`;
	});
	return cols.join(" ");
};
