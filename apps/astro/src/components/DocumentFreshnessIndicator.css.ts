import { style, styleVariants } from "@vanilla-extract/css";
import { match } from "ts-pattern";

// Base styles
export const container = style({
	display: "flex",
	flexDirection: "column",
	gap: "0.75rem",
	margin: "1rem 0",
});

export const badge = style({
	display: "inline-flex",
	alignItems: "center",
	gap: "0.5rem",
	borderRadius: "0.5rem",
	fontFamily: "'IBM Plex Mono', monospace",
	fontWeight: 500,
	whiteSpace: "nowrap",
	width: "fit-content",
	transition: "all 0.2s ease",
	border: "1px solid",
	cursor: "default",

	":hover": {
		transform: "translateY(-1px)",
		boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
	},
});

// Lookup table for freshness level styles
const FRESHNESS_STYLES = {
	fresh: {
		color: "#22c55e",
		backgroundColor: "rgba(34, 197, 94, 0.1)",
		borderColor: "#22c55e",
	},
	aging: {
		color: "#f59e0b",
		backgroundColor: "rgba(245, 158, 11, 0.1)",
		borderColor: "#f59e0b",
	},
	stale: {
		color: "#f97316",
		backgroundColor: "rgba(249, 115, 22, 0.1)",
		borderColor: "#f97316",
	},
	critical: {
		color: "#ef4444",
		backgroundColor: "rgba(239, 68, 68, 0.1)",
		borderColor: "#ef4444",
	},
	invalid: {
		color: "#6b7280",
		backgroundColor: "rgba(107, 114, 128, 0.1)",
		borderColor: "#6b7280",
	},
} as const;

// Style variants using lookup table
export const badgeVariants = styleVariants({
	fresh: [badge, FRESHNESS_STYLES.fresh],
	aging: [badge, FRESHNESS_STYLES.aging],
	stale: [badge, FRESHNESS_STYLES.stale],
	critical: [badge, FRESHNESS_STYLES.critical],
	invalid: [badge, FRESHNESS_STYLES.invalid],
});

// Size variants using pattern matching approach
const createSizeVariant = (size: "small" | "medium" | "large") =>
	match(size)
		.with("small", () => ({
			fontSize: "0.75rem",
			padding: "0.375rem 0.75rem",
		}))
		.with("medium", () => ({
			fontSize: "0.875rem",
			padding: "0.5rem 1rem",
		}))
		.with("large", () => ({
			fontSize: "1rem",
			padding: "0.75rem 1.25rem",
		}))
		.exhaustive();

export const sizeVariants = styleVariants({
	small: createSizeVariant("small"),
	medium: createSizeVariant("medium"),
	large: createSizeVariant("large"),
});

export const iconContainer = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	fontSize: "1em",
});

export const textContainer = style({
	fontSize: "inherit",
	lineHeight: 1.2,
});

export const recommendation = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	padding: "0.75rem 1rem",
	backgroundColor: "rgba(59, 130, 246, 0.05)",
	border: "1px solid rgba(59, 130, 246, 0.2)",
	borderRadius: "0.5rem",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.8rem",
	color: "rgba(255, 255, 255, 0.85)",
	width: "fit-content",
	lineHeight: 1.4,
});

export const recommendationIcon = style({
	display: "flex",
	alignItems: "center",
	lineHeight: 1,
});

// Responsive styles
export const responsiveContainer = style({
	"@media": {
		"(max-width: 768px)": {
			margin: "0.75rem 0",
			gap: "0.5rem",
		},
	},
});
