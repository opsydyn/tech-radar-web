import type { CSSProperties } from "@vanilla-extract/css";
import { applyStyleProp } from "./utils";

type RadiusName = "sm" | "md" | "lg" | "full";

const radiusValues: Record<RadiusName, string> = {
	sm: "4px",
	md: "8px",
	lg: "16px",
	full: "9999px",
};

export const radii = radiusValues;

export const applyRadius = (radiusName: RadiusName) =>
	applyStyleProp("borderRadius", radiusValues[radiusName]);

// Convenience functions for common border-radius values
export const asRadiusSmall = applyRadius("sm");
export const asRadiusMedium = applyRadius("md");
export const asRadiusLarge = applyRadius("lg");
export const asRadiusFull = applyRadius("full");

if (import.meta.vitest) {
	const { it, expect } = import.meta.vitest;

	it("should apply the specified border-radius value to the given rules", () => {
		const result = applyRadius("md")({
			display: "block",
		} as CSSProperties);

		const expectedOutput = {
			display: "block",
			borderRadius: "8px",
		};

		expect(result).toEqual(expectedOutput);
	});

	it("should handle an undefined radius name gracefully", () => {
		const result = applyRadius(undefined as unknown as RadiusName)({
			display: "block",
		} as CSSProperties);

		const expectedOutput = {
			display: "block",
			borderRadius: undefined,
		};

		expect(result).toEqual(expectedOutput);
	});

	it("should apply convenience functions correctly", () => {
		const result = asRadiusFull({
			width: "100%",
		} as CSSProperties);

		const expectedOutput = {
			width: "100%",
			borderRadius: "9999px",
		};

		expect(result).toEqual(expectedOutput);
	});
}
