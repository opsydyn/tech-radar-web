import { globalStyle, style } from "@vanilla-extract/css";
import { hardEdgeRadius } from "../../styles/theme.css";
import { tableThemeVars } from "./TechRadarTable.css";

export const breakpoints = {
	small: "600px",
	medium: "800px",
	large: "1200px",
};

export const media = {
	small: `screen and (max-width: ${breakpoints.small})`,
	medium: `screen and (max-width: ${breakpoints.medium})`,
	large: `screen and (max-width: ${breakpoints.large})`,
};

export const flexRowWrapAlignCenter = style({
	display: "flex",
	flexDirection: "row",
	flexWrap: "wrap",
	alignItems: "center",
});

export const tableControls = style([
	flexRowWrapAlignCenter,
	{
		justifyContent: "space-between",
		gap: "8px",
		padding: "10px 0 0",
		borderTop: `1px solid ${tableThemeVars.borderMuted}`,
		borderRadius: hardEdgeRadius,
		marginBottom: 0,
		"@media": {
			[media.small]: {
				flexDirection: "column",
				alignItems: "stretch",
				gap: "6px",
			},
		},
	},
]);

export const button = style({
	padding: "0.45rem",
	border: `1px solid ${tableThemeVars.borderMuted}`,
	borderRadius: hardEdgeRadius,
	cursor: "pointer",
	backgroundColor: tableThemeVars.surfaceAlt,
	color: tableThemeVars.textSecondary,
	fontFamily: "monospace",
	fontSize: "0.8rem",
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	minWidth: "2.25rem",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	"@media": {
		[media.small]: {
			padding: "0.35rem",
			minWidth: "2rem",
		},
	},
	selectors: {
		"&:disabled": {
			opacity: 0.5,
			cursor: "not-allowed",
		},
		"&:not(:disabled):hover": {
			backgroundColor: tableThemeVars.surfaceHover,
			borderColor: tableThemeVars.borderStrong,
			color: tableThemeVars.textPrimary,
		},
	},
});

export const input = style({
	padding: "0.5rem 0.65rem",
	border: `1px solid ${tableThemeVars.borderMuted}`,
	borderRadius: hardEdgeRadius,
	backgroundColor: tableThemeVars.surfaceAlt,
	color: tableThemeVars.textPrimary,
	fontFamily: "monospace",
	width: "4rem",
	"@media": {
		[media.small]: {
			width: "3.5rem",
			padding: "0.4rem 0.5rem",
		},
	},
	selectors: {
		"&:focus": {
			outline: `1px solid ${tableThemeVars.borderStrong}`,
			outlineOffset: "1px",
		},
	},
});

export const select = style({
	padding: "0.5rem 0.65rem",
	border: `1px solid ${tableThemeVars.borderMuted}`,
	borderRadius: hardEdgeRadius,
	backgroundColor: tableThemeVars.surfaceAlt,
	color: tableThemeVars.textPrimary,
	fontFamily: "monospace",
	minWidth: "4.75rem",
	"@media": {
		[media.small]: {
			padding: "0.4rem 0.5rem",
			minWidth: "4.25rem",
		},
	},
	selectors: {
		"&:focus": {
			outline: `1px solid ${tableThemeVars.borderStrong}`,
			outlineOffset: "1px",
		},
	},
});

globalStyle(`${select} option`, {
	backgroundColor: tableThemeVars.surfaceAlt,
	color: tableThemeVars.textPrimary,
});

export const flexItemsCenterGap = style({
	display: "flex",
	alignItems: "center",
	gap: "10px",
	color: tableThemeVars.textMuted,
	fontFamily: "monospace",
	fontSize: "0.8rem",
	letterSpacing: "0.06em",
	textTransform: "uppercase",
});

export const pageControlCluster = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	flexWrap: "wrap",
	"@media": {
		[media.small]: {
			justifyContent: "space-between",
			width: "100%",
			gap: "0.35rem 0.5rem",
		},
	},
});

export const pageInfo = style({
	color: tableThemeVars.textMuted,
	fontFamily: "monospace",
	fontSize: "0.8rem",
	letterSpacing: "0.06em",
	textTransform: "uppercase",
	"@media": {
		[media.small]: {
			fontSize: "0.75rem",
		},
	},
});

export const pageInfoStrong = style({
	color: tableThemeVars.textPrimary,
});

export const pageField = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	color: tableThemeVars.textMuted,
	fontFamily: "monospace",
	fontSize: "0.8rem",
	letterSpacing: "0.06em",
	textTransform: "uppercase",
	"@media": {
		[media.small]: {
			justifyContent: "space-between",
			width: "100%",
			fontSize: "0.75rem",
		},
	},
});
