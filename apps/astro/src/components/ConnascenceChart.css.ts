// Vanilla Extract CSS for Connascence Chart visualization
// Following project typography standards: Space Grotesk for headings, IBM Plex Mono for body text

import { style, styleVariants } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// 🎨 Base container styles
export const container = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: "1.5rem",
	padding: "2rem",
	backgroundColor: "var(--color-background)",
	borderRadius: "8px",
	border: "1px solid var(--color-border)",
	fontFamily: "'IBM Plex Mono', monospace",
});

// 📊 SVG container styles
export const svgContainer = style({
	position: "relative",
	width: "100%",
	maxWidth: "800px",
	height: "auto",
	backgroundColor: "#fafafa",
	borderRadius: "6px",
	border: "1px solid #e0e0e0",
	overflow: "hidden",
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
	"@media": {
		"(prefers-color-scheme: dark)": {
			backgroundColor: "#1a1a1a",
			borderColor: "#333",
		},
	},
});

export const svg = style({
	width: "100%",
	height: "auto",
	display: "block",
});

// 🏷️ Title and header styles
export const title = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.75rem",
	fontWeight: 600,
	color: "var(--color-text-primary, #000)",
	marginBottom: "0.5rem",
	textAlign: "center",
	"@media": {
		"(prefers-color-scheme: dark)": {
			color: "var(--color-text-primary, #fff)",
		},
	},
});

export const subtitle = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.95rem",
	color: "var(--color-text-secondary, #000)",
	textAlign: "center",
	marginBottom: "1rem",
	lineHeight: 1.5,
	"@media": {
		"(prefers-color-scheme: dark)": {
			color: "var(--color-text-secondary, #e0e0e0)",
		},
	},
});

// 📊 Bar chart styles
export const barRect = recipe({
	base: {
		cursor: "pointer",
		transition: "all 0.2s ease-in-out",
		stroke: "none",
		opacity: 0.8,
	},
	variants: {
		state: {
			idle: {
				opacity: 0.8,
			},
			hovered: {
				opacity: 1,
				filter: "brightness(1.1)",
			},
			selected: {
				opacity: 1,
				stroke: "#333",
				strokeWidth: "2px",
			},
		},
		severity: {
			low: {
				fill: "#4CAF50",
			},
			medium: {
				fill: "#FF9800",
			},
			high: {
				fill: "#F44336",
			},
		},
	},
	defaultVariants: {
		state: "idle",
		severity: "low",
	},
});

// 🏷️ Text label styles
export const barLabel = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.85rem",
	fontWeight: 500,
	fill: "#000",
	textAnchor: "end",
	dominantBaseline: "middle",
	pointerEvents: "none",
	userSelect: "none",
	"@media": {
		"(prefers-color-scheme: dark)": {
			fill: "#fff",
		},
	},
});

export const barValue = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	fontWeight: 400,
	fill: "#000",
	textAnchor: "start",
	dominantBaseline: "middle",
	pointerEvents: "none",
	userSelect: "none",
	"@media": {
		"(prefers-color-scheme: dark)": {
			fill: "#fff",
		},
	},
});

// 🎯 Axis styles
export const axisLabel = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "0.9rem",
	fontWeight: 500,
	fill: "#666",
	textAnchor: "middle",
	dominantBaseline: "middle",
	"@media": {
		"(prefers-color-scheme: dark)": {
			fill: "#ccc",
		},
	},
});

export const axisLine = style({
	stroke: "#e0e0e0",
	strokeWidth: "1px",
	"@media": {
		"(prefers-color-scheme: dark)": {
			stroke: "#333",
		},
	},
});

export const gridLine = style({
	stroke: "#f0f0f0",
	strokeWidth: "1px",
	strokeDasharray: "2,2",
	opacity: 0.5,
	"@media": {
		"(prefers-color-scheme: dark)": {
			stroke: "#2a2a2a",
		},
	},
});

// 📝 Tooltip styles
export const tooltip = style({
	position: "absolute",
	padding: "0.75rem",
	backgroundColor: "#fff",
	border: "1px solid #e0e0e0",
	borderRadius: "4px",
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
	fontSize: "0.8rem",
	fontFamily: "'IBM Plex Mono', monospace",
	pointerEvents: "none",
	zIndex: 1000,
	maxWidth: "300px",
	"@media": {
		"(prefers-color-scheme: dark)": {
			backgroundColor: "#2a2a2a",
			borderColor: "#444",
			color: "#fff",
		},
	},
});

export const tooltipTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "0.9rem",
	fontWeight: 600,
	marginBottom: "0.25rem",
	color: "#333",
	"@media": {
		"(prefers-color-scheme: dark)": {
			color: "#fff",
		},
	},
});

export const tooltipContent = style({
	fontSize: "0.75rem",
	lineHeight: 1.4,
	color: "#666",
	"@media": {
		"(prefers-color-scheme: dark)": {
			color: "#ccc",
		},
	},
});

// 📊 Legend styles
export const legend = style({
	display: "flex",
	flexDirection: "row",
	gap: "1.5rem",
	alignItems: "center",
	justifyContent: "center",
	padding: "1rem",
	backgroundColor: "#f8f9fa",
	borderRadius: "6px",
	border: "1px solid #e0e0e0",
	"@media": {
		"(prefers-color-scheme: dark)": {
			backgroundColor: "#2a2a2a",
			borderColor: "#444",
		},
	},
});

export const legendItem = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	fontSize: "0.8rem",
	fontFamily: "'IBM Plex Mono', monospace",
	color: "#666",
	"@media": {
		"(prefers-color-scheme: dark)": {
			color: "#ccc",
		},
	},
});

export const legendColor = style({
	width: "12px",
	height: "12px",
	borderRadius: "2px",
	flexShrink: 0,
});

// 📊 Statistics panel styles
export const statsPanel = style({
	display: "grid",
	gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
	gap: "1rem",
	width: "100%",
	maxWidth: "600px",
});

export const statCard = style({
	padding: "1rem",
	backgroundColor: "#f8f9fa",
	borderRadius: "6px",
	border: "1px solid #e0e0e0",
	textAlign: "center",
	"@media": {
		"(prefers-color-scheme: dark)": {
			backgroundColor: "#2a2a2a",
			borderColor: "#444",
		},
	},
});

export const statValue = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.5rem",
	fontWeight: 600,
	color: "#333",
	marginBottom: "0.25rem",
	"@media": {
		"(prefers-color-scheme: dark)": {
			color: "#fff",
		},
	},
});

export const statLabel = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	color: "#666",
	textTransform: "uppercase",
	letterSpacing: "0.5px",
	"@media": {
		"(prefers-color-scheme: dark)": {
			color: "#ccc",
		},
	},
});

// 🎨 Severity category variants
export const severityColors = styleVariants({
	low: { backgroundColor: "#4CAF50" },
	medium: { backgroundColor: "#FF9800" },
	high: { backgroundColor: "#F44336" },
});

// 📱 Responsive styles
export const responsiveContainer = style({
	"@media": {
		"screen and (max-width: 768px)": {
			padding: "1rem",
			gap: "1rem",
		},
		"screen and (max-width: 480px)": {
			padding: "0.5rem",
			gap: "0.5rem",
		},
	},
});

export const responsiveSvg = style({
	"@media": {
		"screen and (max-width: 768px)": {
			maxWidth: "100%",
			height: "auto",
		},
	},
});

// 🎪 Utility classes
export const visuallyHidden = style({
	position: "absolute",
	width: "1px",
	height: "1px",
	padding: "0",
	margin: "-1px",
	overflow: "hidden",
	clip: "rect(0, 0, 0, 0)",
	whiteSpace: "nowrap",
	border: "0",
});

export const focusVisible = style({
	":focus-visible": {
		outline: "2px solid var(--color-primary, #4CAF50)",
		outlineOffset: "2px",
	},
});

// 🌈 Animation styles
export const fadeIn = style({
	animation: "fadeIn 0.3s ease-in-out",
	"@keyframes fadeIn": {
		from: { opacity: 0 },
		to: { opacity: 1 },
	},
});

export const slideIn = style({
	animation: "slideIn 0.4s ease-out",
	"@keyframes slideIn": {
		from: { transform: "translateX(-20px)", opacity: 0 },
		to: { transform: "translateX(0)", opacity: 1 },
	},
});

// 🎯 Export grouped styles for component usage
export const styles = {
	container,
	svgContainer,
	svg,
	title,
	subtitle,
	barRect,
	barLabel,
	barValue,
	axisLabel,
	axisLine,
	gridLine,
	tooltip,
	tooltipTitle,
	tooltipContent,
	legend,
	legendItem,
	legendColor,
	statsPanel,
	statCard,
	statValue,
	statLabel,
	severityColors,
	responsiveContainer,
	responsiveSvg,
	visuallyHidden,
	focusVisible,
	fadeIn,
	slideIn,
} as const;
