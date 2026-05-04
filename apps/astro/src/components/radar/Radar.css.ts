import {
	createGlobalTheme,
	createTheme,
	globalStyle,
	style,
	styleVariants,
} from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";
import { createSprinkles, defineProperties } from "@vanilla-extract/sprinkles";
// import { animationEnabled } from "~stores/animation-store";
// import { colors, typography } from "~styles/theme.css";

export const [darkTheme, darkThemeVars] = createTheme({
	color: {
		background: "#000",
		text: "#fff",
	},
});

export const buttonRecipe = recipe({
	base: {
		/* Base styles */
	},
	variants: {
		size: {
			small: {
				/* Small size styles */
			},
			large: {
				/* Large size styles */
			},
		},
		color: {
			primary: {
				/* Primary color styles */
			},
			secondary: {
				/* Secondary color styles */
			},
		},
	},
	// Define more variants and compound variants
});

const layoutProperties = defineProperties({
	properties: {
		display: ["none", "block", "flex", "grid"],
		flexDirection: ["row", "column"],
	},
});

export const layoutSprinkles = createSprinkles(layoutProperties);

export const colors = createGlobalTheme(":root", {
	primary: "#005f73",
	secondary: "#0a9396",
	accent: "#94d2bd",
	background: "#000",
	text: "#3d405b",
	purpleLightest: "#e4d7f5",
	purpleLight: "#cbb1e4",
	purple: "#a390c1",
	purpleDark: "#7a5f9e",
	purpleDarkest: "#503d6e",
	tealLight: "#c2f2ef",
	teal: "#71e3e2",
	tealDark: "#1dcbca",
	tealDarkHover: "#01718f",
	navy: "#003147",
	greenLightest: "#ccfdce",
	greenLight: "#9ef4a6",
	green: "#5ee471",
	greenHover: "#05823f",
	greenDark: "#36cf57",
	forestGreen: "#05823f",
});

export const typography = createGlobalTheme(":root", {
	fontSizes: {
		small: "0.8rem",
		medium: "1rem",
		large: "1.2rem",
	},
	fontWeights: {
		regular: "400",
		medium: "500",
		bold: "700",
	},
	fontFamily: "monospace",
});

export const spacing = createGlobalTheme(":root", {
	small: "8px",
	medium: "16px",
	large: "24px",
});

export const margin = {
	small: style({ margin: spacing.small }),
	medium: style({ margin: spacing.medium }),
};

export const size = styleVariants({
	small: { fontSize: 16 },
	medium: { fontSize: 24 },
	large: { fontSize: 32 },
});

export const root = style({
	fontFamily: "monospace",
});

globalStyle("body", {
	fontFamily: typography.fontFamily,
	// color: colors.text,
	backgroundColor: colors.background,
});

export const text = style({
	fontFamily: "monospace",
});

export const twStyle = style(["text-[hsl(280,100%,70%)]"]);

export const container = style({
	display: "grid",
	gridTemplateColumns: "1fr 3fr 1fr",
	gap: "1rem",
	position: "relative",
	zIndex: -2,
});

export const sideColumn = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "center",
});

export const radarColumn = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "60vh",
});

export const scanlineAnimation = recipe({
	base: {
		// Base styles
	},
	variants: {
		animated: {
			true: {
				animation: "scanline 6s linear infinite",
			},
			false: {
				animation: "none",
			},
		},
	},
	defaultVariants: {
		animated: true,
	},
});

export const glitchAnimation = recipe({
	base: {
		// Base styles
	},
	variants: {
		animated: {
			true: {
				animation: "glitch 4s linear infinite",
			},
			false: {
				animation: "none",
			},
		},
	},
	defaultVariants: {
		animated: true,
	},
});

export const hoverStyle = {
	":hover": {
		fill: "#ff0000",
		r: "15",
	},
};

export const responsiveStyle = style({
	"@media": {
		"screen and (min-width: 768px)": {
			padding: "24px",
		},
		"screen and (min-width: 1024px)": {
			padding: "48px",
		},
	},
});

export const position = style({
	position: "relative",
});

export const btn = style({
	margin: 0,
	textAlign: "center",
	border: "none",
	padding: "0 4px",
	transition: "background-color 0.3s, color 0.3s",
});

export const btnDark = style({
	background: "#2f2f2f",
	color: "#888",
	borderTop: "1px solid #0a0a0a",
	selectors: {
		"&:hover": {
			background: "#3f3f3f",
			color: "#fff",
		},
	},
});

export const btnLight = style({
	background: "#e8e8e8",
	color: "#333",
	borderTop: "1px solid #ccc",
	selectors: {
		"&:hover": {
			background: "#d8d8d8",
			color: "#000",
		},
	},
});

export const btnLg = style({
	fontSize: "12px",
	lineHeight: 1,
	padding: "4px",
});

export const btnZoom = style({
	width: "26px",
	fontSize: "22px",
});

export const btnBottom = style({
	marginBottom: "1rem",
});

export const description = style({
	fontSize: "12px",
	marginRight: "0.25rem",
});

export const controls = style({
	position: "absolute",
	top: "15px",
	right: "15px",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-end",
});

// Right side controls container - Edition + Search
export const rightSearchContainer = style({
	position: "absolute",
	top: "15px", // Same top position as the zoom controls
	right: "65px", // Increased gap between search and zoom controls
	zIndex: 100,
	display: "flex",
	flexDirection: "column",
	gap: "8px", // 🆕 Gap between edition switcher and search
	width: "auto", // 🆕 Auto width to fit content
	minWidth: "220px",
	maxWidth: "95%",
	boxSizing: "border-box",
	padding: "4px 8px",
	borderRadius: "4px",
	marginRight: "10px", // Additional margin for better spacing
	transition: "all 0.3s ease",
	selectors: {
		'[data-theme="dark"] &': {
			background: "#1a1a1a",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
		},
		'[data-theme="light"] &': {
			background: "#e8e8e8",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
			border: "1px solid rgba(200, 200, 200, 0.8)",
		},
		'[data-theme="machine"] &': {
			background: "#1a1a1a",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
		},
	},
});

export const miniMap = style({
	position: "absolute",
	bottom: "25px",
	right: "15px",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-end",
});

export const adrsButton = style({
	position: "absolute",
	bottom: "25px",
	left: "15px",
	display: "flex",
	flexDirection: "column",
	alignItems: "flex-start",
	zIndex: 100,
	// Gap is now handled by the gapLevel utility from vertical-rhythm.css
});

export const relative = style({
	position: "relative",
});

// Left side controls container (for quadrants, movement, and search)
export const leftControlsContainer = style({
	position: "absolute",
	top: "20px",
	left: "20px",
	zIndex: 100,
	display: "flex",
	flexDirection: "column",
	gap: "15px",
	width: "250px", // Match the radar's edge alignment
});

// Search container styles
export const searchContainer = style({
	display: "flex",
	flexDirection: "column",
	width: "100%", // Full width of parent container
	padding: "10px",
	borderRadius: "8px",
	transition: "all 0.3s ease",
	selectors: {
		'[data-theme="dark"] &': {
			background: "rgba(0, 0, 0, 0.7)",
			boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
		},
		'[data-theme="light"] &': {
			background: "rgba(240, 240, 240, 0.95)",
			boxShadow: "0 0 10px rgba(0, 0, 0, 0.15)",
			border: "1px solid rgba(200, 200, 200, 0.5)",
		},
		'[data-theme="machine"] &': {
			background: "rgba(0, 0, 0, 0.7)",
			boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
		},
	},
});

// Search input styles
export const searchInput = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.9rem",
	padding: "0.25rem 0.5rem", // More compact padding
	borderRadius: "4px",
	width: "100%",
	height: "26px", // Match the height of the zoom buttons
	boxSizing: "border-box", // Ensure padding is included in width calculation
	transition: "all 0.2s ease",
	selectors: {
		'[data-theme="dark"] &': {
			border: "1px solid rgba(255, 255, 255, 0.3)",
			backgroundColor: "#2f2f2f",
			color: "#888",
		},
		'[data-theme="dark"] &:focus': {
			outline: "none",
			borderColor: "rgba(255, 255, 255, 0.6)",
			color: "#fff",
			boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)",
		},
		'[data-theme="dark"] &::placeholder': {
			color: "rgba(255, 255, 255, 0.5)",
		},
		'[data-theme="light"] &': {
			border: "1px solid rgba(0, 0, 0, 0.2)",
			backgroundColor: "#f5f5f5",
			color: "#555",
		},
		'[data-theme="light"] &:focus': {
			outline: "none",
			borderColor: "rgba(0, 0, 0, 0.4)",
			color: "#000",
			boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.05)",
		},
		'[data-theme="light"] &::placeholder': {
			color: "rgba(0, 0, 0, 0.4)",
		},
		'[data-theme="machine"] &': {
			border: "1px solid rgba(255, 255, 255, 0.3)",
			backgroundColor: "#2f2f2f",
			color: "#888",
		},
		'[data-theme="machine"] &:focus': {
			outline: "none",
			borderColor: "rgba(255, 255, 255, 0.6)",
			color: "#fff",
			boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.1)",
		},
		'[data-theme="machine"] &::placeholder': {
			color: "rgba(255, 255, 255, 0.5)",
		},
	},
});

// Search footer styles
export const searchFooter = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	width: "100%",
	marginTop: "0.15rem",
	minHeight: "1.25rem",
	boxSizing: "border-box",
	flexWrap: "wrap",
});

// Search clear button styles
export const searchClearButton = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	padding: "0.15rem 0.4rem",
	border: "none",
	cursor: "pointer",
	textAlign: "center",
	marginLeft: "auto",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	borderRadius: "4px",
	minWidth: "40px",
	maxWidth: "60px",
	whiteSpace: "nowrap",
	overflow: "hidden",
	textOverflow: "ellipsis",
	transition: "all 0.2s ease",
	selectors: {
		'[data-theme="dark"] &': {
			backgroundColor: "#2f2f2f",
			borderTop: "1px solid #0a0a0a",
			color: "#888",
		},
		'[data-theme="dark"] &:hover': {
			backgroundColor: "#3f3f3f",
			color: "#fff",
		},
		'[data-theme="light"] &': {
			backgroundColor: "#f0f0f0",
			borderTop: "1px solid #e0e0e0",
			color: "#555",
		},
		'[data-theme="light"] &:hover': {
			backgroundColor: "#e0e0e0",
			color: "#000",
		},
		'[data-theme="machine"] &': {
			backgroundColor: "#2f2f2f",
			borderTop: "1px solid #0a0a0a",
			color: "#888",
		},
		'[data-theme="machine"] &:hover': {
			backgroundColor: "#3f3f3f",
			color: "#fff",
		},
	},
});

// Search results count styles
export const searchResultsCount = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	transition: "color 0.3s ease",
	maxWidth: "50%",
	whiteSpace: "nowrap",
	overflow: "hidden",
	textOverflow: "ellipsis",
	selectors: {
		'[data-theme="dark"] &': {
			color: "rgba(255, 255, 255, 0.6)",
		},
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.6)",
		},
		'[data-theme="machine"] &': {
			color: "rgba(255, 255, 255, 0.6)",
		},
	},
});

export const blipTooltip = style({
	minWidth: "240px",
	maxWidth: "360px",
	background: "rgba(8, 10, 14, 0.94)",
	border: "1px solid var(--radar-blip-color)",
	borderLeft: "8px solid var(--radar-blip-color)",
	borderRadius: "10px",
	boxShadow:
		"0 0 0 1px rgba(255, 255, 255, 0.08), 0 16px 36px rgba(0, 0, 0, 0.42), 0 0 28px var(--radar-blip-color)",
	color: "#f8fafc",
	fontFamily: "'IBM Plex Mono', monospace",
	padding: "0.85rem 1rem",
	pointerEvents: "none",
});

export const blipTooltipHeader = style({
	alignItems: "center",
	display: "flex",
	gap: "0.65rem",
	marginBottom: "0.6rem",
});

export const blipTooltipBadge = style({
	background: "var(--radar-blip-color)",
	borderRadius: "999px",
	color: "#020617",
	fontSize: "0.78rem",
	fontWeight: 800,
	lineHeight: 1,
	padding: "0.35rem 0.5rem",
});

export const blipTooltipTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.1rem",
	letterSpacing: "0.01em",
	lineHeight: 1.1,
});

export const blipTooltipDetails = style({
	display: "grid",
	gap: "0.35rem",
});

export const blipTooltipLabel = style({
	color: "#94a3b8",
});

// Theme indicator for displaying current theme state
export const themeIndicator = style({
	marginTop: "12px",
	padding: "8px 10px",
	backgroundColor: "rgba(0, 0, 0, 0.7)",
	border: "1px solid rgba(255, 255, 255, 0.2)",
	borderRadius: "4px",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.85rem",
	fontWeight: "500",
	color: "rgba(255, 255, 255, 0.9)",
	width: "100%",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "all 0.3s ease",
	selectors: {
		'[data-theme="dark"] &': {
			backgroundColor: "rgba(30, 30, 30, 0.8)",
			color: "#fff",
			borderColor: "rgba(100, 100, 255, 0.3)",
			boxShadow: "0 0 10px rgba(100, 100, 255, 0.1)",
		},
		'[data-theme="light"] &': {
			backgroundColor: "rgba(240, 240, 240, 0.9)",
			color: "#333",
			borderColor: "rgba(0, 0, 0, 0.1)",
			boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
		},
	},
});

export const z = style({
	position: "relative",
	zIndex: 1000,
	width: "30px",
	height: "30px",
	display: "inline-block",
});

export const legendBoxStyle = style({
	lineHeight: "0.9em",
	color: "#efefef",
	fontSize: "10px",
	fontFamily: "monospace",
	padding: "10px 10px",
	float: "left",
	border: "1px solid rgba(255, 255, 255, 0.3)",
	borderRadius: "8px",
	margin: "5px 5px",
});

export const legendTitleStyle = style({
	fontSize: "12px",
	marginBottom: "10px",
	fontWeight: 100,
});

export const radarStyles = style(
	[
		// animationEnabled && scanlineAnimation({ animated: true }),
		// animationEnabled && glitchAnimation({ animated: true })
	].filter(Boolean),
);
