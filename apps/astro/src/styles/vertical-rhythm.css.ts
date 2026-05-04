import {
	ScaleRatios,
	createGapScale,
	createSpacingScale,
	createTypographyScale,
} from "./system";

// --- Spacing ---
const majorThirdSpacing = createSpacingScale(ScaleRatios.MajorThird);

export const spacingLevel1 = majorThirdSpacing(5);
export const spacingLevel2 = majorThirdSpacing(4);
export const spacingLevel3 = majorThirdSpacing(3);
export const spacingLevel4 = majorThirdSpacing(2);
export const spacingLevel5 = majorThirdSpacing(1);

// --- Gaps ---
const majorThirdGap = createGapScale(ScaleRatios.MajorThird);

export const gapLevel1 = majorThirdGap(5);
export const gapLevel2 = majorThirdGap(4);
export const gapLevel3 = majorThirdGap(3);
export const gapLevel4 = majorThirdGap(2);
export const gapLevel5 = majorThirdGap(1);

// --- Typography (from original file) ---
const majorThirdTypography = createTypographyScale(ScaleRatios.GoldenRatio);

export const typographyLevel1 = majorThirdTypography(5);
export const typographyLevel2 = majorThirdTypography(4);
export const typographyLevel3 = majorThirdTypography(3);
export const typographyLevel4 = majorThirdTypography(2);
export const typographyLevel5 = majorThirdTypography(1);
