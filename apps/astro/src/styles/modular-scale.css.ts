import { style } from "@vanilla-extract/css";
import { ScaleRatios, createGridStyle, createTypographyScale } from "./system";

// --- Typography ---
const majorThirdTypography = createTypographyScale(ScaleRatios.GoldenRatio);

export const typographyLevel1 = majorThirdTypography(5);
export const typographyLevel2 = majorThirdTypography(4);
export const typographyLevel3 = majorThirdTypography(3);
export const typographyLevel4 = majorThirdTypography(2);
export const typographyLevel5 = majorThirdTypography(1);

// --- Grids ---
export const threeColumnGrid = createGridStyle(ScaleRatios.GoldenRatio, 3, 0.5);
export const twoColumnGrid = createGridStyle(ScaleRatios.GoldenRatio, 2, 0.5);

export const oneColumnGrid = style({
	display: "grid",
	gridTemplateColumns: "1fr",
});

export const equalThreeColumnGrid = style({
	display: "grid",
	gridTemplateColumns: "repeat(3, 1fr)",
});

export const equalTwoColumnGrid = style({
	display: "grid",
	gridTemplateColumns: "repeat(2, 1fr)",
});
