import chroma from "chroma-js";
import { pipe } from "effect";

// --- Color Palette Generation ---

type ColorVariantLevel = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type ColorVariants = Record<ColorVariantLevel, string>;

const createColorVariants = (baseColor: string): ColorVariants => {
	if (!chroma.valid(baseColor)) {
		throw new Error(`Invalid base color provided: ${baseColor}`);
	}

	const lightest = chroma(baseColor).set("hsl.l", 0.95);
	const darkest = chroma(baseColor).set("hsl.l", 0.1);
	const scale = chroma
		.scale([lightest, baseColor, darkest])
		.mode("lch")
		.colors(9);

	return pipe(
		scale,
		(scaleColors) =>
			scaleColors.map((color, index) => [
				((index + 1) * 100) as ColorVariantLevel,
				color,
			]),
		Object.fromEntries,
	) as ColorVariants;
};

// --- Base Colors ---

const baseColors = {
	// Brand
	primary: "#0056D2",

	// Quadrants
	quadrantPlatform: "#7d6bff",
	quadrantLanguage: "#3cff8f",
	quadrantTechnique: "#ffa347",
	quadrantTool: "#58d3ff",

	// Neutrals
	gray: "#707070",

	// Accents
	cyan: "#00e5ff",
};

// --- Generated Palettes ---

export const colors = {
	white: "#ffffff",
	black: "#000000",
	transparent: "transparent",

	primary: createColorVariants(baseColors.primary),

	platform: createColorVariants(baseColors.quadrantPlatform),
	language: createColorVariants(baseColors.quadrantLanguage),
	technique: createColorVariants(baseColors.quadrantTechnique),
	tool: createColorVariants(baseColors.quadrantTool),

	gray: createColorVariants(baseColors.gray),
	cyan: createColorVariants(baseColors.cyan),
};
