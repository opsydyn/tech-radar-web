import { globalStyle, style } from "@vanilla-extract/css";
import { colors } from "../styles/colors";
import { zIndex } from "../styles/zIndex";

export const trigger = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	width: "1.5rem",
	height: "1.5rem",
	padding: 0,
	borderRadius: "999px",
	border: "1px solid rgba(255, 255, 255, 0.28)",
	backgroundColor: "transparent",
	color: "rgba(255, 255, 255, 0.78)",
	cursor: "pointer",
	transition:
		"border-color 160ms ease, background-color 160ms ease, color 160ms ease",
	selectors: {
		"&:hover": {
			backgroundColor: "rgba(255, 255, 255, 0.08)",
			borderColor: "rgba(255, 255, 255, 0.48)",
			color: colors.white,
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
	borderRadius: "0.75rem",
	border: "1px solid rgba(255, 255, 255, 0.14)",
	backgroundColor: "rgba(14, 14, 14, 0.96)",
	color: colors.white,
	boxShadow: "0 18px 48px rgba(0, 0, 0, 0.45)",
	transformOrigin: "var(--transform-origin)",
	transition: "opacity 160ms ease, transform 160ms ease",
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
});

export const itemTitle = style({
	margin: 0,
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "0.875rem",
	fontWeight: 600,
	lineHeight: 1.25,
	color: colors.white,
});

export const itemDescription = style({
	margin: "0.125rem 0 0",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	lineHeight: 1.45,
	color: "rgba(255, 255, 255, 0.68)",
});
