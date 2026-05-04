import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
import { colors } from "./colors";
import { radii } from "./radii";
import { ScaleRatios, createSpacingValueMap } from "./system";

// Generate our spacing scale using the system engine
const spacing = createSpacingValueMap(ScaleRatios.MajorThird, 0.25)(12);

const responsiveProperties = defineProperties({
	conditions: {
		mobile: {},
		tablet: { "@media": "screen and (min-width: 768px)" },
		desktop: { "@media": "screen and (min-width: 1024px)" },
	},
	defaultCondition: "mobile",
	properties: {
		display: ["none", "flex", "block", "inline"],
		flexDirection: ["row", "column"],
		justifyContent: [
			"stretch",
			"flex-start",
			"center",
			"flex-end",
			"space-around",
			"space-between",
		],
		alignItems: ["stretch", "flex-start", "center", "flex-end"],
		gap: spacing,
		paddingTop: spacing,
		paddingBottom: spacing,
		paddingLeft: spacing,
		paddingRight: spacing,
		margin: spacing,
		borderRadius: radii,
	},
	shorthands: {
		padding: ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"],
		paddingX: ["paddingLeft", "paddingRight"],
		paddingY: ["paddingTop", "paddingBottom"],
		placeItems: ["justifyContent", "alignItems"],
	},
});

const colorProperties = defineProperties({
	conditions: {
		lightMode: {},
		darkMode: { "@media": "(prefers-color-scheme: dark)" },
	},
	defaultCondition: "lightMode",
	properties: {
		color: {
			...colors.primary,
			...colors.gray,
			...colors.cyan,
			white: colors.white,
			black: colors.black,
			transparent: colors.transparent,
		},
		background: {
			...colors.primary,
			...colors.gray,
			...colors.cyan,
			white: colors.white,
			black: colors.black,
			transparent: colors.transparent,
		},
	},
});

export const sprinkles = createSprinkles(responsiveProperties, colorProperties);

export type Sprinkles = Parameters<typeof sprinkles>[0];
