// Vanilla Extract CSS for Cynefin Framework diagram
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

// 🎯 Domain quadrant styles
export const domainQuadrant = recipe({
	base: {
		cursor: "pointer",
		transition: "all 0.2s ease-in-out",
		stroke: "#999",
		strokeWidth: "1px",
		fill: "var(--domain-color)",
		opacity: 0.6,
	},
	variants: {
		state: {
			idle: {
				opacity: 0.6,
				strokeWidth: "1px",
			},
			hovered: {
				opacity: 0.8,
				strokeWidth: "2px",
				stroke: "#666",
				transform: "scale(1.02)",
			},
			selected: {
				opacity: 0.9,
				strokeWidth: "3px",
				stroke: "#333",
				transform: "scale(1.05)",
			},
			transitioning: {
				opacity: 0.7,
				strokeWidth: "2px",
				stroke: "#444",
				animation: "pulse 1s ease-in-out infinite",
			},
		},
		domain: {
			clear: {
				fill: "#4CAF50",
			},
			complicated: {
				fill: "#2196F3",
			},
			complex: {
				fill: "#FF9800",
			},
			chaotic: {
				fill: "#F44336",
			},
			aporetic: {
				fill: "#9C27B0",
			},
		},
	},
	defaultVariants: {
		state: "idle",
	},
});

// 🏷️ Domain label styles
export const domainLabel = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.1rem",
	fontWeight: 600,
	fill: "#000",
	textAnchor: "middle",
	dominantBaseline: "middle",
	pointerEvents: "none",
	userSelect: "none",
});

export const domainDescription = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.8rem",
	fill: "#000",
	textAnchor: "middle",
	dominantBaseline: "middle",
	pointerEvents: "none",
	userSelect: "none",
});

export const domainApproach = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	fill: "#000",
	textAnchor: "middle",
	dominantBaseline: "middle",
	pointerEvents: "none",
	userSelect: "none",
	fontStyle: "italic",
});

// 🎨 Transition arrow styles
export const transitionArrow = style({
	stroke: "#666",
	strokeWidth: "2px",
	fill: "none",
	markerEnd: "url(#arrowhead)",
	opacity: 0.7,
	animation: "dashMove 2s linear infinite",
	strokeDasharray: "5,5",
});

// 📝 Info panel styles
export const infoPanel = style({
	display: "flex",
	flexDirection: "column",
	gap: "1rem",
	padding: "1.5rem",
	backgroundColor: "#f8f9fa",
	borderRadius: "6px",
	border: "1px solid #e9ecef",
	minWidth: "300px",
	maxWidth: "400px",
});

export const infoPanelTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.25rem",
	fontWeight: 600,
	color: "#333",
	marginBottom: "0.5rem",
});

export const infoPanelContent = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.9rem",
	color: "#555",
	lineHeight: 1.5,
});

export const infoPanelApproach = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.85rem",
	color: "#666",
	fontStyle: "italic",
	padding: "0.75rem",
	backgroundColor: "#ffffff",
	borderRadius: "4px",
	border: "1px solid #e0e0e0",
});

// 🎮 Control panel styles
export const controlPanel = style({
	display: "flex",
	flexDirection: "row",
	gap: "1rem",
	alignItems: "center",
	padding: "1rem",
	backgroundColor: "#f8f9fa",
	borderRadius: "6px",
	border: "1px solid #e9ecef",
});

export const controlButton = recipe({
	base: {
		fontFamily: "'IBM Plex Mono', monospace",
		fontSize: "0.85rem",
		padding: "0.5rem 1rem",
		borderRadius: "4px",
		border: "1px solid #ccc",
		backgroundColor: "#fff",
		color: "#333",
		cursor: "pointer",
		transition: "all 0.2s ease-in-out",
		":hover": {
			backgroundColor: "#f0f0f0",
			borderColor: "#999",
		},
		":active": {
			backgroundColor: "#e0e0e0",
		},
	},
	variants: {
		variant: {
			primary: {
				backgroundColor: "var(--quadrant-color, #4CAF50)",
				color: "#fff",
				borderColor: "var(--quadrant-color, #4CAF50)",
				":hover": {
					backgroundColor: "var(--quadrant-color-dark, #388E3C)",
				},
			},
			secondary: {
				backgroundColor: "#6c757d",
				color: "#fff",
				borderColor: "#6c757d",
				":hover": {
					backgroundColor: "#5a6268",
				},
			},
			danger: {
				backgroundColor: "#dc3545",
				color: "#fff",
				borderColor: "#dc3545",
				":hover": {
					backgroundColor: "#c82333",
				},
			},
		},
		size: {
			small: {
				padding: "0.25rem 0.5rem",
				fontSize: "0.75rem",
			},
			medium: {
				padding: "0.5rem 1rem",
				fontSize: "0.85rem",
			},
			large: {
				padding: "0.75rem 1.5rem",
				fontSize: "1rem",
			},
		},
	},
	defaultVariants: {
		variant: "primary",
		size: "medium",
	},
});

// 📊 Legend styles
export const legend = style({
	display: "flex",
	flexDirection: "column",
	gap: "0.75rem",
	padding: "1rem",
	backgroundColor: "#ffffff",
	borderRadius: "6px",
	border: "1px solid #e0e0e0",
	minWidth: "250px",
});

export const legendTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1rem",
	fontWeight: 600,
	color: "#333",
	marginBottom: "0.5rem",
});

export const legendItem = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.8rem",
	color: "#555",
});

export const legendColor = style({
	width: "16px",
	height: "16px",
	borderRadius: "3px",
	flexShrink: 0,
});

// 🎭 Animation keyframes
export const animations = {
	pulse: style({
		"@keyframes": {
			"0%, 100%": { opacity: 0.6 },
			"50%": { opacity: 0.9 },
		},
	}),
	dashMove: style({
		"@keyframes": {
			"0%": { strokeDashoffset: "0" },
			"100%": { strokeDashoffset: "10" },
		},
	}),
};

// 🎨 Domain-specific color variants
export const domainColors = styleVariants({
	clear: { backgroundColor: "#4CAF50" },
	complicated: { backgroundColor: "#2196F3" },
	complex: { backgroundColor: "#FF9800" },
	chaotic: { backgroundColor: "#F44336" },
	aporetic: { backgroundColor: "#9C27B0" },
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
		outline: "2px solid var(--quadrant-color, #4CAF50)",
		outlineOffset: "2px",
	},
});

// 🌈 Theme integration
export const themeAware = style({
	"@media": {
		"(prefers-color-scheme: dark)": {
			backgroundColor: "#1a1a1a",
			color: "#e0e0e0",
			borderColor: "#333",
		},
	},
});

// 🎯 Export grouped styles for component usage
export const styles = {
	container,
	svgContainer,
	svg,
	title,
	subtitle,
	domainQuadrant,
	domainLabel,
	domainDescription,
	domainApproach,
	transitionArrow,
	infoPanel,
	infoPanelTitle,
	infoPanelContent,
	infoPanelApproach,
	controlPanel,
	controlButton,
	legend,
	legendTitle,
	legendItem,
	legendColor,
	animations,
	domainColors,
	responsiveContainer,
	responsiveSvg,
	visuallyHidden,
	focusVisible,
	themeAware,
} as const;
