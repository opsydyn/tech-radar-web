import { createVar, globalStyle, style } from "@vanilla-extract/css";
import {
	darkThemeVars,
	hardEdgeRadius,
	lightThemeVars,
} from "../styles/theme.css";

// Create CSS variables for dynamic quadrant colors
export const quadrantColor = createVar();
export const quadrantColorSolid = createVar();
export const quadrantColorDark = createVar();

// Container styles
export const container = style({
	display: "flex",
	flexDirection: "column",
	minHeight: "80vh",
	width: "100%",
	maxWidth: "100%",
	minWidth: 0,
	boxSizing: "border-box",
	backgroundColor: lightThemeVars.color.background,
	color: lightThemeVars.color.text,
	vars: {
		[quadrantColor]: "inherit",
		[quadrantColorSolid]: "inherit",
		[quadrantColorDark]: "inherit",
	},
	transition: "background-color 0.3s ease, color 0.3s ease",
});

// Dark theme styles for container
globalStyle(`html[data-theme="dark"] .${container}`, {
	backgroundColor: darkThemeVars.color.background,
	color: darkThemeVars.color.text,
});

// Header container styles
export const headerContainer = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "flex-start",
	boxSizing: "border-box",
	width: "100%",
	minWidth: 0,
	margin: "1rem 2rem 1.5rem 2rem",
	position: "relative",
	gap: "1.5rem",
	"@media": {
		"screen and (max-width: 980px)": {
			flexDirection: "column",
			alignItems: "stretch",
			margin: "1rem 1.25rem 1.5rem",
		},
	},
});

// Main heading styles
export const mainHeading = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "3rem",
	fontWeight: 700,
	color: lightThemeVars.color.text,
	paddingBottom: "0.5rem",
	borderBottom: `4px solid ${quadrantColor}`,
	display: "inline-block",
	margin: 0,
	transition: "color 0.3s ease",
});

// Dark theme styles for main heading
globalStyle(`html[data-theme="dark"] .${mainHeading}`, {
	color: darkThemeVars.color.text,
});

export const quadrantIntro = style({
	display: "grid",
	gap: "0.85rem",
	maxWidth: "62rem",
	minWidth: 0,
	paddingTop: "0.1rem",
	flex: 1,
});

export const quadrantIntroLead = style({
	margin: 0,
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.1rem",
	fontWeight: 600,
	lineHeight: 1.35,
	color: lightThemeVars.color.text,
});

globalStyle(`html[data-theme="dark"] .${quadrantIntroLead}`, {
	color: darkThemeVars.color.text,
});

export const quadrantIntroList = style({
	margin: 0,
	paddingLeft: "1.15rem",
	display: "grid",
	gap: "0.7rem",
});

export const quadrantIntroItem = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.85rem",
	lineHeight: 1.7,
	color: lightThemeVars.color.secondary,
	paddingLeft: "0.2rem",
	transition: "color 0.2s ease",
});

globalStyle(`html[data-theme="dark"] .${quadrantIntroItem}`, {
	color: darkThemeVars.color.secondary,
});

export const quadrantIntroItemActive = style({
	color: lightThemeVars.color.text,
	selectors: {
		"&::marker": {
			color: quadrantColor,
		},
	},
});

globalStyle(`html[data-theme="dark"] .${quadrantIntroItemActive}`, {
	color: darkThemeVars.color.text,
});

export const quadrantIntroItemTitle = style({
	color: quadrantColor,
	fontWeight: 700,
});

// Search container styles
export const searchContainer = style({
	display: "flex",
	flexDirection: "column",
	minWidth: 0,
	width: "100%",
	maxWidth: "14rem",
	marginBottom: "0.5rem",
	flexShrink: 0,
	"@media": {
		"screen and (max-width: 980px)": {
			maxWidth: "100%",
		},
	},
});

// Search footer styles
export const searchFooter = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	width: "100%",
	marginTop: "0.25rem",
	minHeight: "1.5rem",
});

// Search input styles
export const searchInput = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.9rem",
	padding: "0.5rem 0.75rem",
	border: `2px solid ${quadrantColor}40`,
	borderRadius: hardEdgeRadius,
	backgroundColor: "#f0f0f0",
	color: "#333",
	boxSizing: "border-box",
	width: "100%",
	maxWidth: "100%",
	transition:
		"background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease",
	":focus": {
		outline: "none",
		borderColor: quadrantColor,
		boxShadow: `0 0 0 2px ${quadrantColor}20`,
	},
});

// Dark theme styles for search input
globalStyle(`html[data-theme="dark"] .${searchInput}`, {
	backgroundColor: "#333",
	color: "#f0f0f0",
	border: `2px solid ${quadrantColor}70`,
});

// Search clear button styles
export const searchClearButton = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.8rem",
	marginLeft: "0.5rem",
	padding: "0.25rem 0.5rem",
	backgroundColor: "transparent",
	border: "none",
	color: quadrantColor,
	cursor: "pointer",
	":hover": {
		textDecoration: "underline",
	},
});

// Search results count styles
export const searchResultsCount = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	color: lightThemeVars.color.secondary,
	marginLeft: "0.5rem",
	transition: "color 0.3s ease",
});

// Dark theme styles for search results count
globalStyle(`html[data-theme="dark"] .${searchResultsCount}`, {
	color: darkThemeVars.color.secondary,
});

// Content container styles
export const contentContainer = style({
	display: "flex",
	flex: 1,
	minWidth: 0,
	"@media": {
		"screen and (max-width: 980px)": {
			flexDirection: "column",
		},
	},
});

// Scroll panel styles
export const scrollPanel = style({
	flex: "0 0 38.2%",
	minWidth: 0,
	boxSizing: "border-box",
	borderRight: `1px solid ${quadrantColor}`,
	padding: "2rem",
	height: "calc(80vh - 5rem)",
	overflowY: "auto",
	overflowX: "hidden",
	scrollbarGutter: "stable",
	backgroundColor: lightThemeVars.color.background,
	transition: "background-color 0.3s ease",
	selectors: {
		"&::-webkit-scrollbar": {
			width: "8px",
			background: "transparent",
		},
		"&::-webkit-scrollbar-thumb": {
			background: `color-mix(in srgb, ${quadrantColor} 18%, transparent)`,
			borderRadius: hardEdgeRadius,
			transition: "background 0.2s",
		},
		"&::-webkit-scrollbar-thumb:hover": {
			background: `color-mix(in srgb, ${quadrantColor} 35%, transparent)`,
		},
	},
	"@media": {
		"screen and (max-width: 980px)": {
			flex: "none",
			width: "100%",
			height: "auto",
			maxHeight: "24rem",
			borderRight: "none",
			borderBottom: "1px solid var(--quadrant-color)",
			padding: "1.25rem",
		},
	},
});

// Dark theme styles for scroll panel
globalStyle(`html[data-theme="dark"] .${scrollPanel}`, {
	backgroundColor: darkThemeVars.color.background,
	borderRight: `1px solid ${quadrantColor}80`,
});

export const scrollPanelFirefox = style({
	scrollbarWidth: "thin",
	scrollbarColor: `color-mix(in srgb, ${quadrantColor} 18%, transparent) transparent`,
});

// Blip count styles
export const blipCount = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.8rem",
	color: lightThemeVars.color.secondary,
	textTransform: "uppercase",
	letterSpacing: "0.05em",
	marginBottom: "1.5rem",
	transition: "color 0.3s ease",
});

// Dark theme styles for blip count
globalStyle(`html[data-theme="dark"] .${blipCount}`, {
	color: darkThemeVars.color.secondary,
});

// Blip item styles
export const blipItem = style({
	WebkitAppearance: "none",
	appearance: "none",
	background: "transparent",
	border: "1px solid transparent",
	borderLeft: "3px solid transparent",
	borderRadius: hardEdgeRadius,
	color: "inherit",
	cursor: "pointer",
	display: "block",
	marginBottom: "1.5rem",
	fontWeight: 400,
	padding: "0.65rem 0.85rem",
	textAlign: "left",
	transition:
		"background-color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
	width: "100%",
	selectors: {
		"&:hover": {
			background: "color-mix(in srgb, var(--quadrant-color) 7%, transparent)",
			borderColor: "color-mix(in srgb, var(--quadrant-color) 18%, transparent)",
			borderLeftColor: "var(--quadrant-color)",
			boxShadow:
				"inset 0 0 0 1px color-mix(in srgb, var(--quadrant-color) 10%, transparent)",
		},
		"&:focus-visible": {
			outline: "2px solid var(--quadrant-color)",
			outlineOffset: "2px",
			background: "color-mix(in srgb, var(--quadrant-color) 8%, transparent)",
		},
	},
});

// Selected blip item styles
export const selectedBlipItem = style({
	fontWeight: 700,
	borderColor: "color-mix(in srgb, var(--quadrant-color) 24%, transparent)",
	borderLeftColor: quadrantColor,
	backgroundColor: "color-mix(in srgb, var(--quadrant-color) 10%, transparent)",
	boxShadow:
		"inset 0 0 0 1px color-mix(in srgb, var(--quadrant-color) 12%, transparent)",
});

// Blip name styles
export const blipName = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.2rem",
	fontWeight: 500,
	margin: 0,
	color: lightThemeVars.color.text,
	transition: "color 0.3s ease",
});

// Dark theme styles for blip name
globalStyle(`html[data-theme="dark"] .${blipName}`, {
	color: darkThemeVars.color.text,
});

// Blip ring styles
export const blipRing = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	color: lightThemeVars.color.secondary,
	marginTop: "0.25rem",
	transition: "color 0.3s ease",
});

// Dark theme styles for blip ring
globalStyle(`html[data-theme="dark"] .${blipRing}`, {
	color: darkThemeVars.color.secondary,
});

// Detail panel styles
export const detailPanel = style({
	flex: 1,
	minWidth: 0,
	boxSizing: "border-box",
	minHeight: "calc(80vh - 5rem)",
	alignSelf: "flex-start",
	padding: "2rem",
	backgroundColor: lightThemeVars.color.background,
	transition: "background-color 0.3s ease",
	"@media": {
		"screen and (max-width: 980px)": {
			alignSelf: "stretch",
			minHeight: "auto",
			padding: "1.25rem",
		},
	},
});

// Dark theme styles for detail panel
globalStyle(`html[data-theme="dark"] .${detailPanel}`, {
	backgroundColor: darkThemeVars.color.background,
});
