import {
	createContainer,
	globalStyle,
	style,
	styleVariants,
} from "@vanilla-extract/css";
import { darkThemeVars, lightThemeVars } from "../styles/theme.css";

export const root = style({
	fontFamily: "monospace",
});

export const breakPoints = {
	mobile: "only screen and (max-width: 600px)",
	tablet: "only screen and (min-width: 601px) and (max-width: 900px)",
	desktop: "only screen and (min-width: 901px) and (max-width: 1200px)",
	desktopXl: "only screen and (min-width: 1200px)",
};

export const size = styleVariants({
	small: { fontSize: 16 },
	medium: { fontSize: 24 },
	large: { fontSize: 32 },
});

export const text = style({
	fontFamily: "monospace",
});

export const twStyle = style({
	color: "hsl(280, 100%, 70%)",
});

export const container = style({
	display: "flex",
	// flexDirection: "column",
	minHeight: "100vh",
	transition: "background 0.3s ease",
	selectors: {
		'[data-theme="dark"] &': {
			background: "#0E1218", // Dark cyberpunk background
		},
		'[data-theme="light"] &': {
			background: "#f5f5f5", // Light clean background
		},
		'[data-theme="machine"] &': {
			background: "#0E1218", // Same as dark for machine theme
		},
	},
});

export const mainContent = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	position: "relative",
	padding: "1rem",
	width: "100%",
	maxWidth: "100vw",
	height: "calc(100vh - 60px)", // Account for the top nav height
	overflow: "hidden",
});

export const mainContentBlip = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
	position: "relative",
	padding: "1rem",
	width: "100%",
	maxWidth: "100vw",
	overflow: "hidden",
});

export const adrText = style({
	color: "white",
});

export const sidebarContainer = createContainer();

export const sidebar = style({
	containerName: sidebarContainer,
});

export const radarIcon = style({
	padding: "1rem",
	// position: 'fixed',
	// top: '0.5rem',
	// left: '1rem',
	// display: 'flex',
	// zIndex: 1000,
});

export const topNavArea = style({
	position: "fixed",
	top: "1rem",
	right: "0.5rem",
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	gap: "1.65rem",
	maxWidth: "calc(100vw - 4.5rem)",
	zIndex: 200,
	"@media": {
		"screen and (max-width: 960px)": {
			flexWrap: "wrap",
			alignItems: "stretch",
		},
	},
});

export const topNavControlsSlot = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	minWidth: 0,
	marginRight: "0.3rem",
});

// Global styles for body
globalStyle("body", {
	margin: 0,
	padding: 0,
	backgroundColor: lightThemeVars.color.background,
	color: lightThemeVars.color.text,
	transition: "background-color 0.3s ease, color 0.3s ease",
	minHeight: "100vh",
});

// Dark theme styles for body
globalStyle('html[data-theme="dark"] body', {
	backgroundColor: darkThemeVars.color.background,
	color: darkThemeVars.color.text,
});

// Machine theme styles for body (same as dark)
globalStyle('html[data-theme="machine"] body', {
	backgroundColor: "#0E1218",
	color: "#ffffff",
});
