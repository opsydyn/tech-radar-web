import { globalStyle, style } from "@vanilla-extract/css";
import { colors } from "../colors";
import { motionColorTransition, motionSurfaceTransition } from "../motion.css";
import { darkThemeVars, hardEdgeRadius, lightThemeVars } from "../theme.css";

// Container for the quadrant page
export const quadrantContainer = style({
	padding: "2rem",
	boxSizing: "border-box",
	width: "100%",
	maxWidth: "100%",
	minWidth: 0,
	minHeight: "100vh",
	backgroundColor: lightThemeVars.color.background,
	color: lightThemeVars.color.text,
	"@media": {
		"screen and (max-width: 768px)": {
			padding: "1rem",
		},
	},
});

// Quadrant header with navigation
export const quadrantHeader = style({
	padding: "1.5rem 0",
	borderBottom: `1px solid ${lightThemeVars.color.border}`,
	marginBottom: "2rem",
	position: "sticky",
	top: 0,
	zIndex: 10,
	backgroundColor: lightThemeVars.color.background,
	backdropFilter: "blur(10px)",
});

export const navigationContainer = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	minWidth: 0,
	gap: "1rem",
	marginBottom: "1rem",
	"@media": {
		"screen and (max-width: 768px)": {
			flexDirection: "column",
			gap: "1rem",
			alignItems: "flex-start",
		},
	},
});

export const homeLink = style({
	fontFamily: "'IBM Plex Mono', monospace",
	color: lightThemeVars.color.text,
	textDecoration: "none",
	fontSize: "0.875rem",
	fontWeight: "500",
	letterSpacing: "0.01em",
	transition: motionColorTransition,
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	":hover": {
		color: lightThemeVars.color.primary,
	},
});

export const quadrantTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.875rem",
	fontWeight: "700",
	margin: "0",
	letterSpacing: "-0.025em",
	color: lightThemeVars.color.text,
	"@media": {
		"screen and (max-width: 768px)": {
			fontSize: "1.5rem",
		},
	},
});

// Quadrant navigation menu - Ghost buttons using design tokens
export const quadrantNav = style({
	display: "flex",
	gap: "0.75rem",
	minWidth: 0,
	maxWidth: "100%",
	flexWrap: "nowrap",
	overflowX: "auto",
	"@media": {
		"screen and (max-width: 768px)": {
			display: "grid",
			gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
			width: "100%",
			gap: "0.5rem",
			overflowX: "visible",
		},
	},
});

export const quadrantNavItem = style({
	fontFamily: "'IBM Plex Mono', monospace !important",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	minWidth: 0,
	padding: "0.75rem 1.25rem",
	borderRadius: hardEdgeRadius,
	textDecoration: "none !important",
	fontSize: "0.875rem",
	fontWeight: "500",
	letterSpacing: "0.01em",
	transition: motionSurfaceTransition,
	border: "2px solid transparent",
	backgroundColor: "transparent",
	color: lightThemeVars.color.text,
	whiteSpace: "nowrap",
	outline: "2px solid transparent",
	outlineOffset: "2px",
	"@media": {
		"screen and (max-width: 768px)": {
			padding: "0.75rem 0.85rem",
			fontSize: "0.8125rem",
			minHeight: "4rem",
			whiteSpace: "normal",
			lineHeight: 1.25,
			flex: "none",
			textAlign: "center",
		},
	},
	":hover": {
		boxShadow: "inset 0 0 0 1px currentColor",
	},
	":focus": {
		outlineColor: lightThemeVars.color.primary,
		outlineWidth: "2px",
		outlineStyle: "solid",
	},
});

// Quadrant-specific color variants using design tokens
export const quadrantNavItemTools = style([
	quadrantNavItem,
	{
		borderColor: `${colors.tool[500]} !important`,
		color: `${colors.tool[600]} !important`,
		fontFamily: "'IBM Plex Mono', monospace !important",
		":hover": {
			backgroundColor: `${colors.tool[500]} !important`,
			color: `${colors.black} !important`,
			borderColor: `${colors.tool[500]} !important`,
		},
	},
]);

export const quadrantNavItemTechniques = style([
	quadrantNavItem,
	{
		borderColor: `${colors.technique[500]} !important`,
		color: `${colors.technique[600]} !important`,
		fontFamily: "'IBM Plex Mono', monospace !important",
		":hover": {
			backgroundColor: `${colors.technique[500]} !important`,
			color: `${colors.black} !important`,
			borderColor: `${colors.technique[500]} !important`,
		},
	},
]);

export const quadrantNavItemPlatforms = style([
	quadrantNavItem,
	{
		borderColor: `${colors.platform[500]} !important`,
		color: `${colors.platform[600]} !important`,
		fontFamily: "'IBM Plex Mono', monospace !important",
		":hover": {
			backgroundColor: `${colors.platform[500]} !important`,
			color: `${colors.black} !important`,
			borderColor: `${colors.platform[500]} !important`,
		},
	},
]);

export const quadrantNavItemLanguages = style([
	quadrantNavItem,
	{
		borderColor: `${colors.language[500]} !important`,
		color: `${colors.language[600]} !important`,
		fontFamily: "'IBM Plex Mono', monospace !important",
		":hover": {
			backgroundColor: `${colors.language[500]} !important`,
			color: `${colors.black} !important`,
			borderColor: `${colors.language[500]} !important`,
		},
	},
]);

// Active state styles
export const quadrantNavItemActive = style({
	fontWeight: "600",
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
	":hover": {
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
	},
});

export const quadrantNavItemActiveTools = style([
	quadrantNavItemActive,
	{
		backgroundColor: `${colors.tool[500]} !important`,
		color: `${colors.black} !important`,
		borderColor: `${colors.tool[500]} !important`,
		fontFamily: "'IBM Plex Mono', monospace !important",
	},
]);

export const quadrantNavItemActiveTechniques = style([
	quadrantNavItemActive,
	{
		backgroundColor: `${colors.technique[500]} !important`,
		color: `${colors.black} !important`,
		borderColor: `${colors.technique[500]} !important`,
		fontFamily: "'IBM Plex Mono', monospace !important",
	},
]);

export const quadrantNavItemActivePlatforms = style([
	quadrantNavItemActive,
	{
		backgroundColor: `${colors.platform[500]} !important`,
		color: `${colors.black} !important`,
		borderColor: `${colors.platform[500]} !important`,
		fontFamily: "'IBM Plex Mono', monospace !important",
	},
]);

export const quadrantNavItemActiveLanguages = style([
	quadrantNavItemActive,
	{
		backgroundColor: `${colors.language[500]} !important`,
		color: `${colors.black} !important`,
		borderColor: `${colors.language[500]} !important`,
		fontFamily: "'IBM Plex Mono', monospace !important",
	},
]);

// Dark theme styles
globalStyle(`html[data-theme="dark"] .${quadrantContainer}`, {
	backgroundColor: darkThemeVars.color.background,
	color: darkThemeVars.color.text,
});

globalStyle(`html[data-theme="dark"] .${quadrantHeader}`, {
	backgroundColor: darkThemeVars.color.background,
	borderBottomColor: darkThemeVars.color.border,
});

globalStyle(`html[data-theme="dark"] .${homeLink}`, {
	color: darkThemeVars.color.text,
});

globalStyle(`html[data-theme="dark"] .${homeLink}:hover`, {
	color: darkThemeVars.color.primary,
});

globalStyle(`html[data-theme="dark"] .${quadrantTitle}`, {
	color: darkThemeVars.color.text,
});

globalStyle(`html[data-theme="dark"] .${quadrantNavItem}`, {
	color: darkThemeVars.color.text,
});

globalStyle(`html[data-theme="dark"] .${quadrantNavItem}:focus`, {
	outlineColor: darkThemeVars.color.primary,
});

// Hide scrollbar on webkit browsers for navigation
globalStyle(`.${quadrantNav}::-webkit-scrollbar`, {
	display: "none",
});
