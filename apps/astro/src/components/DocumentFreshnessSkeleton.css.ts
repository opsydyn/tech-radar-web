import { keyframes, style, styleVariants } from "@vanilla-extract/css";
import { match } from "ts-pattern";

// Shimmer animation using keyframes
const shimmer = keyframes({
	"0%": { backgroundPosition: "-200% 0" },
	"100%": { backgroundPosition: "200% 0" },
});

// Base container styles
export const container = style({
	display: "flex",
	flexDirection: "column",
	gap: "0.75rem",
	margin: "1rem 0",
});

// Base skeleton badge styles
export const badge = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	padding: "0.5rem 1rem",
	borderRadius: "0.5rem",
	background:
		"linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%)",
	backgroundSize: "200% 100%",
	animation: `${shimmer} 1.5s infinite`,
	border: "1px solid rgba(255, 255, 255, 0.1)",
});

// Size configurations using lookup table and pattern matching
const SKELETON_SIZES = {
	small: { height: "2rem", width: "8rem" },
	medium: { height: "2.5rem", width: "10rem" },
	large: { height: "3rem", width: "12rem" },
} as const;

// Create size variant using functional approach
const createSizeVariant = (size: keyof typeof SKELETON_SIZES) =>
	match(size)
		.with("small", () => ({
			height: SKELETON_SIZES.small.height,
			width: SKELETON_SIZES.small.width,
		}))
		.with("medium", () => ({
			height: SKELETON_SIZES.medium.height,
			width: SKELETON_SIZES.medium.width,
		}))
		.with("large", () => ({
			height: SKELETON_SIZES.large.height,
			width: SKELETON_SIZES.large.width,
		}))
		.exhaustive();

export const sizeVariants = styleVariants({
	small: createSizeVariant("small"),
	medium: createSizeVariant("medium"),
	large: createSizeVariant("large"),
});

// Skeleton elements
export const icon = style({
	width: "16px",
	height: "16px",
	borderRadius: "50%",
	background: "rgba(255, 255, 255, 0.15)",
	flexShrink: 0,
});

export const text = style({
	height: "14px",
	flex: 1,
	background: "rgba(255, 255, 255, 0.15)",
	borderRadius: "4px",
	maxWidth: "120px",
});

// Responsive container with mobile adjustments
export const responsiveContainer = style({
	"@media": {
		"(max-width: 768px)": {
			margin: "0.75rem 0",
			gap: "0.5rem",
		},
	},
});

// Mobile-specific badge adjustments
export const mobileBadge = style({
	"@media": {
		"(max-width: 768px)": {
			height: "2rem !important",
			width: "7rem !important",
			padding: "0.375rem 0.75rem",
		},
	},
});
