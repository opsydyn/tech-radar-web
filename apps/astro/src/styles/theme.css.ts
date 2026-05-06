import {
	createGlobalTheme,
	createTheme,
	globalStyle,
	style,
} from "@vanilla-extract/css";
import { colors } from "./colors";
import { zIndex } from "./zIndex";

globalStyle("body", {
	lineHeight: 1.5,
	margin: 0,
	padding: 0,
	boxSizing: "border-box",
});

export const lightThemeVars = createGlobalTheme(":root", {
	color: {
		background: colors.white,
		text: colors.gray[800],
		primary: colors.primary[500],
		secondary: colors.gray[500],
		border: colors.gray[200],
	},
});

export const darkThemeVars = createGlobalTheme(":root", {
	color: {
		background: colors.gray[900],
		text: colors.gray[100],
		primary: colors.primary[400],
		secondary: colors.gray[400],
		border: colors.gray[700],
	},
});

export const shapeVars = createGlobalTheme(":root", {
	radius: {
		hardEdge: "0px",
	},
});

export const hardEdgeRadius = shapeVars.radius.hardEdge;

export const baseStyle = style({
	// Common base styles
});

export const [lightTheme, lightThemeSelectorVars] = createTheme({
	color: {
		background: "#f0e68c",
		text: "#333",
	},
});

export const [darkTheme, darkThemeelectorVars] = createTheme({
	color: {
		background: "#556b2f",
		text: "#fff",
	},
});

export const lightThemeStyle = style({
	backgroundColor: lightThemeVars.color.background,
	color: lightThemeVars.color.text,
	selectors: {
		[`${lightTheme} &`]: {
			backgroundColor: lightThemeVars.color.background,
			color: lightThemeVars.color.text,
		},
	},
});

export const darkThemeStyle = style({
	backgroundColor: darkThemeVars.color.background,
	color: darkThemeVars.color.text,
	selectors: {
		[`${darkTheme} &`]: {
			backgroundColor: darkThemeVars.color.background,
			color: darkThemeVars.color.text,
		},
	},
});

export const sunStyle = style({
	fill: "black",
});

export const moonStyle = style({
	fill: "white",
});

globalStyle(".dark .sun", {
	fill: "transparent",
});

globalStyle(".dark .moon", {
	fill: "white",
});

export const navVars = {
	color: {
		white: colors.white,
		navBg: "rgba(10,10,10,0.7)",
		borderPlatform: colors.platform[500],
		borderLanguage: colors.language[500],
		borderTechnique: colors.technique[500],
		borderTool: colors.tool[500],
		navBgHover: colors.gray[800],
		navTextHover: colors.cyan[400],
	},
	spacing: {
		navMinWidth: "250px",
		navPadding: "24px 32px 24px 32px",
		navLeft: "120px",
		navRight: "120px",
		navTop: "40px",
		navBottom: "40px",
	},
	font: {
		navSize: "1.25rem",
		navWeight: "700",
	},
	shadow: {
		nav: "0 2px 16px rgba(0,0,0,0.18)",
	},
	z: {
		nav: zIndex.high,
	},
};

globalStyle("body, [data-scrollable]", {
	scrollbarWidth: "thin",
	scrollbarColor: "rgba(127,255,212,0.18) transparent",
	scrollBehavior: "smooth",
});

globalStyle("body::-webkit-scrollbar, [data-scrollable]::-webkit-scrollbar", {
	width: "8px",
	background: "transparent",
});

globalStyle(
	"body::-webkit-scrollbar-thumb, [data-scrollable]::-webkit-scrollbar-thumb",
	{
		background: "rgba(127,255,212,0.18)",
		borderRadius: hardEdgeRadius,
		transition: "background 0.2s",
	},
);

globalStyle(
	"body::-webkit-scrollbar-thumb:hover, [data-scrollable]::-webkit-scrollbar-thumb:hover",
	{
		background: "rgba(127,255,212,0.35)",
	},
);
