import { globalStyle, style } from "@vanilla-extract/css";
import { colors } from "../styles/colors";
import { hardEdgeRadius } from "../styles/theme.css";
import { zIndex } from "../styles/zIndex";

export const trigger = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	width: "1.5rem",
	height: "1.5rem",
	padding: 0,
	borderRadius: hardEdgeRadius,
	border: "1px solid rgba(255, 255, 255, 0.28)",
	backgroundColor: "transparent",
	color: "rgba(255, 255, 255, 0.78)",
	cursor: "pointer",
	transition:
		"border-color 160ms ease, background-color 160ms ease, color 160ms ease",
	selectors: {
		'html[data-theme="light"] &': {
			border: "1px solid rgba(17, 24, 39, 0.18)",
			backgroundColor: "rgba(255, 255, 255, 0.92)",
			color: "rgba(17, 24, 39, 0.72)",
		},
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.08)",
			borderColor: "rgba(255, 255, 255, 0.48)",
			color: colors.white,
		},
		'html[data-theme="light"] &:hover': {
			backgroundColor: "rgba(17, 24, 39, 0.06)",
			borderColor: "rgba(17, 24, 39, 0.28)",
			color: "rgba(17, 24, 39, 0.9)",
		},
		"&:focus-visible": {
			outline: `2px solid ${colors.cyan[400]}`,
			outlineOffset: "2px",
		},
	},
});

export const positioner = style({
	zIndex: zIndex.overlay,
});

export const popup = style({
	maxWidth: "20rem",
	padding: "0.875rem",
	borderRadius: hardEdgeRadius,
	border: "1px solid rgba(255, 255, 255, 0.14)",
	backgroundColor: "rgba(14, 14, 14, 0.96)",
	color: colors.white,
	boxShadow: "0 18px 48px rgba(0, 0, 0, 0.45)",
	transformOrigin: "var(--transform-origin)",
	transition: "opacity 160ms ease, transform 160ms ease",
	selectors: {
		'html[data-theme="light"] &': {
			border: "1px solid rgba(17, 24, 39, 0.12)",
			backgroundColor: "rgba(255, 255, 255, 0.98)",
			color: "rgba(17, 24, 39, 0.94)",
			boxShadow: "0 18px 48px rgba(15, 23, 42, 0.14)",
		},
	},
});

globalStyle(`${popup}[data-starting-style], ${popup}[data-ending-style]`, {
	opacity: 0,
	transform: "scale(0.96)",
});

export const arrow = style({
	display: "flex",
	width: "0.75rem",
	height: "0.5rem",
	color: "rgba(14, 14, 14, 0.96)",
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(255, 255, 255, 0.98)",
		},
	},
});

export const title = style({
	margin: 0,
	marginBottom: "0.5rem",
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1rem",
	fontWeight: 700,
	lineHeight: 1.2,
});

export const description = style({
	margin: 0,
	marginBottom: "0.75rem",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	lineHeight: 1.5,
	color: "rgba(255, 255, 255, 0.72)",
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(17, 24, 39, 0.68)",
		},
	},
});

export const list = style({
	display: "grid",
	gap: "0.625rem",
});

export const row = style({
	display: "grid",
	gridTemplateColumns: "1rem 1fr",
	gap: "0.625rem",
	alignItems: "start",
});

export const icon = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "1rem",
	height: "1rem",
	marginTop: "0.125rem",
	color: "rgba(255, 255, 255, 0.82)",
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(17, 24, 39, 0.72)",
		},
	},
});

export const itemTitle = style({
	margin: 0,
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "0.875rem",
	fontWeight: 600,
	lineHeight: 1.25,
	color: colors.white,
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(17, 24, 39, 0.94)",
		},
	},
});

export const itemDescription = style({
	margin: "0.125rem 0 0",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	lineHeight: 1.45,
	color: "rgba(255, 255, 255, 0.68)",
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(17, 24, 39, 0.66)",
		},
	},
});
