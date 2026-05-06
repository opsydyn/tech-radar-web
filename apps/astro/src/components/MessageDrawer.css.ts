import { globalStyle, style } from "@vanilla-extract/css";
import { colors } from "../styles/colors";
import {
	motionDurationMedium,
	motionSurfaceTransition,
	motionTransformSurfaceTransition,
	motionTransformTransition,
} from "../styles/motion.css";
import {
	darkThemeVars,
	hardEdgeRadius,
	lightThemeVars,
} from "../styles/theme.css";
import { zIndex } from "../styles/zIndex";

const drawerBleed = "3rem";

export const trigger = style({
	position: "fixed",
	left: "50%",
	bottom: 0,
	transform: "translateX(-50%)",
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "center",
	width: "7rem",
	height: "1.25rem",
	paddingTop: "0.5rem",
	border: 0,
	background: "transparent",
	cursor: "pointer",
	zIndex: zIndex.middle,
	selectors: {
		"&:focus-visible": {
			outline: `2px solid ${colors.cyan[400]}`,
			outlineOffset: "4px",
			borderRadius: hardEdgeRadius,
		},
	},
});

export const triggerBar = style({
	width: "3.25rem",
	height: "0.3125rem",
	borderRadius: hardEdgeRadius,
	backgroundColor: "rgba(255, 255, 255, 0.55)",
	boxShadow: "0 0 12px rgba(0, 0, 0, 0.35)",
	transition: motionTransformSurfaceTransition,
});

globalStyle(`${trigger}:hover ${triggerBar}`, {
	backgroundColor: "rgba(255, 255, 255, 0.8)",
	transform: "translateY(-1px)",
});

globalStyle(`${trigger}[data-popup-open] ${triggerBar}`, {
	backgroundColor: "rgba(255, 255, 255, 0.9)",
});

export const viewport = style({
	position: "fixed",
	inset: 0,
	display: "flex",
	alignItems: "flex-end",
	justifyContent: "center",
	pointerEvents: "none",
	zIndex: zIndex.top,
});

export const popup = style({
	boxSizing: "border-box",
	position: "relative",
	display: "flex",
	flexDirection: "column",
	width: "100%",
	maxWidth: "100vw",
	height: "fit-content",
	minHeight: "24rem",
	maxHeight: `calc(92vh + ${drawerBleed})`,
	marginBottom: `calc(-1 * ${drawerBleed})`,
	padding: "1rem 1rem 1.5rem",
	paddingBottom: `calc(1.5rem + env(safe-area-inset-bottom, 0px) + ${drawerBleed})`,
	borderTopLeftRadius: hardEdgeRadius,
	borderTopRightRadius: hardEdgeRadius,
	outline: `1px solid ${lightThemeVars.color.border}`,
	borderTop: `3px solid ${colors.primary[500]}`,
	backgroundColor: "rgba(0, 0, 0, 0.94)",
	color: colors.white,
	boxShadow: "0 -16px 48px rgba(0, 0, 0, 0.45)",
	overflow: "hidden",
	pointerEvents: "auto",
	overscrollBehavior: "contain",
	willChange: "transform",
	transform: "translateY(var(--drawer-swipe-movement-y))",
	transition: motionTransformTransition,
});

globalStyle(`html[data-theme="dark"] .${popup}`, {
	outlineColor: darkThemeVars.color.border,
});

globalStyle(`${popup}[data-starting-style], ${popup}[data-ending-style]`, {
	transform: `translateY(calc(100% - ${drawerBleed} + 2px))`,
});

globalStyle(`${popup}[data-ending-style]`, {
	transitionDuration: `calc(var(--drawer-swipe-strength) * ${motionDurationMedium})`,
});

globalStyle(`${popup}[data-swiping]`, {
	userSelect: "none",
});

export const titleBar = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "1rem",
	paddingBottom: "0.75rem",
	borderBottom: "1px solid rgba(255, 255, 255, 0.16)",
});

export const handle = style({
	width: "3rem",
	height: "0.25rem",
	margin: "0 auto 1rem",
	borderRadius: hardEdgeRadius,
	backgroundColor: "rgba(255, 255, 255, 0.45)",
	flexShrink: 0,
});

export const title = style({
	margin: 0,
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.125rem",
	fontWeight: 700,
	lineHeight: 1.2,
	letterSpacing: "-0.02em",
	color: colors.white,
});

export const closeButton = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "2rem",
	padding: "0.375rem 0.75rem",
	borderRadius: hardEdgeRadius,
	border: "1px solid rgba(255, 255, 255, 0.18)",
	backgroundColor: "rgba(255, 255, 255, 0.06)",
	color: colors.white,
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	textTransform: "uppercase",
	letterSpacing: "0.08em",
	cursor: "pointer",
	transition: motionSurfaceTransition,
	selectors: {
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.12)",
			borderColor: "rgba(255, 255, 255, 0.32)",
		},
		"&:focus-visible": {
			outline: `2px solid ${colors.cyan[400]}`,
			outlineOffset: "2px",
		},
	},
});

export const scrollRegion = style({
	flex: 1,
	minHeight: 0,
	overflow: "auto",
	paddingTop: "0.5rem",
	touchAction: "auto",
});

export const tableContainer = style({
	display: "flex",
	flexDirection: "column",
	minHeight: 0,
	width: "100%",
});

globalStyle(`${scrollRegion}::-webkit-scrollbar`, {
	width: "8px",
	background: "transparent",
});

globalStyle(`${scrollRegion}::-webkit-scrollbar-thumb`, {
	background: "rgba(255, 255, 255, 0.18)",
	borderRadius: hardEdgeRadius,
});

globalStyle(`${scrollRegion}::-webkit-scrollbar-thumb:hover`, {
	background: "rgba(255, 255, 255, 0.3)",
});

export const visuallyHidden = style({
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: 0,
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0 0 0 0)",
	whiteSpace: "nowrap",
	border: 0,
});
