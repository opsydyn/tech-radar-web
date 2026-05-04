// Wardley Map Component Styles
// Following Vanilla Extract patterns from CLAUDE.md

import { globalStyle, style } from "@vanilla-extract/css";
import { createVar } from "@vanilla-extract/css";
import { recipe } from "@vanilla-extract/recipes";

// 🎨 CSS Custom Properties for theming
export const wardleyTheme = {
	// Base colors
	background: createVar(),
	surface: createVar(),
	border: createVar(),
	text: createVar(),
	textSecondary: createVar(),

	// Component colors
	componentGenesis: createVar(),
	componentCustom: createVar(),
	componentProduct: createVar(),
	componentCommodity: createVar(),
	componentAnchor: createVar(),

	// Visibility colors
	visibilityVisible: createVar(),
	visibilityInternal: createVar(),
	visibilityInfrastructure: createVar(),

	// Interaction colors
	hover: createVar(),
	selected: createVar(),
	dependency: createVar(),

	// Grid and axis colors
	gridLines: createVar(),
	axisLabels: createVar(),
	evolutionStages: createVar(),
};

// 🌙 Theme definitions
globalStyle(":root", {
	vars: {
		// Light theme
		[wardleyTheme.background]: "#ffffff",
		[wardleyTheme.surface]: "#f8fafc",
		[wardleyTheme.border]: "#e2e8f0",
		[wardleyTheme.text]: "#1e293b",
		[wardleyTheme.textSecondary]: "#64748b",

		// Component colors (evolution stages)
		[wardleyTheme.componentGenesis]: "#ef4444",
		[wardleyTheme.componentCustom]: "#f97316",
		[wardleyTheme.componentProduct]: "#eab308",
		[wardleyTheme.componentCommodity]: "#22c55e",
		[wardleyTheme.componentAnchor]: "#3b82f6",

		// Visibility colors
		[wardleyTheme.visibilityVisible]: "#2563eb",
		[wardleyTheme.visibilityInternal]: "#7c3aed",
		[wardleyTheme.visibilityInfrastructure]: "#dc2626",

		// Interaction colors
		[wardleyTheme.hover]: "#3b82f6",
		[wardleyTheme.selected]: "#1d4ed8",
		[wardleyTheme.dependency]: "#6b7280",

		// Grid and axis
		[wardleyTheme.gridLines]: "#e2e8f0",
		[wardleyTheme.axisLabels]: "#64748b",
		[wardleyTheme.evolutionStages]: "#94a3b8",
	},
});

globalStyle(':root[data-theme="dark"]', {
	vars: {
		// Dark theme
		[wardleyTheme.background]: "#0f172a",
		[wardleyTheme.surface]: "#1e293b",
		[wardleyTheme.border]: "#334155",
		[wardleyTheme.text]: "#f1f5f9",
		[wardleyTheme.textSecondary]: "#94a3b8",

		// Component colors (adjusted for dark theme)
		[wardleyTheme.componentGenesis]: "#f87171",
		[wardleyTheme.componentCustom]: "#fb923c",
		[wardleyTheme.componentProduct]: "#fbbf24",
		[wardleyTheme.componentCommodity]: "#4ade80",
		[wardleyTheme.componentAnchor]: "#60a5fa",

		// Visibility colors
		[wardleyTheme.visibilityVisible]: "#3b82f6",
		[wardleyTheme.visibilityInternal]: "#8b5cf6",
		[wardleyTheme.visibilityInfrastructure]: "#ef4444",

		// Interaction colors
		[wardleyTheme.hover]: "#60a5fa",
		[wardleyTheme.selected]: "#3b82f6",
		[wardleyTheme.dependency]: "#9ca3af",

		// Grid and axis
		[wardleyTheme.gridLines]: "#374151",
		[wardleyTheme.axisLabels]: "#9ca3af",
		[wardleyTheme.evolutionStages]: "#6b7280",
	},
});

// 🏗️ Container styles
export const container = style({
	display: "flex",
	flexDirection: "column",
	gap: "1.5rem",
	padding: "1.5rem",
	backgroundColor: wardleyTheme.background,
	borderRadius: "0.5rem",
	border: `1px solid ${wardleyTheme.border}`,
	fontFamily: "'IBM Plex Mono', monospace",
});

export const title = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.875rem",
	fontWeight: "700",
	color: wardleyTheme.text,
	marginBottom: "0.5rem",
});

export const subtitle = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "1rem",
	color: wardleyTheme.textSecondary,
	marginBottom: "1rem",
});

// 🗺️ SVG container styles
export const svgContainer = style({
	position: "relative",
	width: "100%",
	overflow: "hidden",
	borderRadius: "0.375rem",
	border: `1px solid ${wardleyTheme.border}`,
	backgroundColor: wardleyTheme.surface,
});

export const svg = style({
	width: "100%",
	height: "auto",
	display: "block",
	cursor: "crosshair",
});

// 🎯 Component styles with recipe pattern
export const component = recipe({
	base: {
		cursor: "pointer",
		transition: "all 0.2s ease-in-out",
		stroke: wardleyTheme.border,
		strokeWidth: "2px",
		filter: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))",
	},
	variants: {
		type: {
			User: { fill: wardleyTheme.componentAnchor },
			Business: { fill: wardleyTheme.componentCustom },
			Data: { fill: wardleyTheme.componentProduct },
			Infrastructure: { fill: wardleyTheme.componentCommodity },
			Anchor: { fill: wardleyTheme.componentAnchor },
		},
		stage: {
			Genesis: { fill: wardleyTheme.componentGenesis },
			Custom: { fill: wardleyTheme.componentCustom },
			Product: { fill: wardleyTheme.componentProduct },
			Commodity: { fill: wardleyTheme.componentCommodity },
		},
		visibility: {
			Visible: { fill: wardleyTheme.visibilityVisible },
			Internal: { fill: wardleyTheme.visibilityInternal },
			Infrastructure: { fill: wardleyTheme.visibilityInfrastructure },
		},
		state: {
			idle: {
				opacity: "0.7",
				transform: "scale(1)",
			},
			hovered: {
				opacity: "0.9",
				transform: "scale(1.1)",
				stroke: wardleyTheme.hover,
				strokeWidth: "3px",
				filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))",
			},
			selected: {
				opacity: "1",
				transform: "scale(1.15)",
				stroke: wardleyTheme.selected,
				strokeWidth: "4px",
				filter: "drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))",
			},
			dragging: {
				opacity: "0.8",
				transform: "scale(1.2)",
				stroke: wardleyTheme.selected,
				strokeWidth: "3px",
				filter: "drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4))",
			},
		},
	},
	defaultVariants: {
		state: "idle",
	},
});

// 🏷️ Text label styles
export const componentLabel = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "0.875rem",
	fontWeight: "600",
	fill: wardleyTheme.text,
	textAnchor: "middle",
	dominantBaseline: "central",
	pointerEvents: "none",
	userSelect: "none",
});

export const componentSubLabel = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	fill: wardleyTheme.textSecondary,
	textAnchor: "middle",
	dominantBaseline: "central",
	pointerEvents: "none",
	userSelect: "none",
});

// 🔗 Dependency line styles
export const dependency = recipe({
	base: {
		fill: "none",
		stroke: wardleyTheme.dependency,
		strokeWidth: "2px",
		strokeDasharray: "none",
		opacity: "0.6",
		transition: "all 0.2s ease-in-out",
		pointerEvents: "none",
	},
	variants: {
		type: {
			ValueFlow: {
				stroke: wardleyTheme.dependency,
				strokeWidth: "2px",
			},
			DataFlow: {
				stroke: wardleyTheme.dependency,
				strokeWidth: "1.5px",
				strokeDasharray: "5,5",
			},
			Control: {
				stroke: wardleyTheme.dependency,
				strokeWidth: "3px",
				strokeDasharray: "10,5",
			},
		},
		strength: {
			weak: { opacity: "0.3" },
			medium: { opacity: "0.6" },
			strong: { opacity: "0.9" },
		},
		state: {
			normal: {},
			highlighted: {
				stroke: wardleyTheme.selected,
				strokeWidth: "3px",
				opacity: "1",
			},
			dimmed: {
				opacity: "0.2",
			},
		},
	},
	defaultVariants: {
		type: "ValueFlow",
		strength: "medium",
		state: "normal",
	},
});

// 📊 Grid and axis styles
export const gridLine = style({
	stroke: wardleyTheme.gridLines,
	strokeWidth: "1px",
	opacity: "0.3",
	pointerEvents: "none",
});

export const axisDivider = style({
	stroke: wardleyTheme.border,
	strokeWidth: "2px",
	opacity: "0.5",
	pointerEvents: "none",
});

export const axisLabel = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	fill: wardleyTheme.axisLabels,
	textAnchor: "middle",
	dominantBaseline: "central",
	pointerEvents: "none",
	userSelect: "none",
});

export const evolutionStageLabel = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "0.875rem",
	fontWeight: "500",
	fill: wardleyTheme.evolutionStages,
	textAnchor: "middle",
	dominantBaseline: "central",
	pointerEvents: "none",
	userSelect: "none",
});

// 💡 Tooltip and info panel styles
export const tooltip = style({
	backgroundColor: wardleyTheme.surface,
	border: `1px solid ${wardleyTheme.border}`,
	borderRadius: "0.375rem",
	padding: "0.75rem",
	boxShadow:
		"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.875rem",
	maxWidth: "300px",
	zIndex: 1000,
});

export const tooltipTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1rem",
	fontWeight: "600",
	color: wardleyTheme.text,
	marginBottom: "0.5rem",
});

export const tooltipContent = style({
	color: wardleyTheme.textSecondary,
	lineHeight: "1.5",
	marginBottom: "0.5rem",
});

export const tooltipMeta = style({
	fontSize: "0.75rem",
	color: wardleyTheme.textSecondary,
	borderTop: `1px solid ${wardleyTheme.border}`,
	paddingTop: "0.5rem",
	marginTop: "0.5rem",
});

// 📱 Info panel styles
export const infoPanel = style({
	position: "absolute",
	top: "1rem",
	right: "1rem",
	backgroundColor: wardleyTheme.surface,
	border: `1px solid ${wardleyTheme.border}`,
	borderRadius: "0.5rem",
	padding: "1rem",
	boxShadow:
		"0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
	minWidth: "280px",
	maxWidth: "400px",
	zIndex: 100,
});

export const infoPanelTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.25rem",
	fontWeight: "700",
	color: wardleyTheme.text,
	marginBottom: "0.75rem",
});

export const infoPanelContent = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.875rem",
	color: wardleyTheme.textSecondary,
	lineHeight: "1.6",
	marginBottom: "1rem",
});

export const infoPanelMeta = style({
	display: "grid",
	gridTemplateColumns: "1fr 1fr",
	gap: "0.5rem",
	fontSize: "0.75rem",
	color: wardleyTheme.textSecondary,
	borderTop: `1px solid ${wardleyTheme.border}`,
	paddingTop: "0.75rem",
});

// 🎛️ Control panel styles
export const controlPanel = style({
	display: "flex",
	flexWrap: "wrap",
	gap: "0.5rem",
	marginTop: "1rem",
	paddingTop: "0.75rem",
	borderTop: `1px solid ${wardleyTheme.border}`,
});

export const controlButton = recipe({
	base: {
		padding: "0.5rem 1rem",
		borderRadius: "0.375rem",
		border: "none",
		fontFamily: "'IBM Plex Mono', monospace",
		fontSize: "0.875rem",
		fontWeight: "500",
		cursor: "pointer",
		transition: "all 0.2s ease-in-out",
		outline: "none",
		":focus": {
			boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)",
		},
	},
	variants: {
		variant: {
			primary: {
				backgroundColor: wardleyTheme.selected,
				color: "white",
				":hover": {
					opacity: "0.9",
					transform: "translateY(-1px)",
				},
			},
			secondary: {
				backgroundColor: wardleyTheme.surface,
				color: wardleyTheme.text,
				border: `1px solid ${wardleyTheme.border}`,
				":hover": {
					backgroundColor: wardleyTheme.border,
					transform: "translateY(-1px)",
				},
			},
			ghost: {
				backgroundColor: "transparent",
				color: wardleyTheme.textSecondary,
				":hover": {
					backgroundColor: wardleyTheme.surface,
				},
			},
		},
		size: {
			sm: {
				padding: "0.25rem 0.75rem",
				fontSize: "0.75rem",
			},
			md: {
				padding: "0.5rem 1rem",
				fontSize: "0.875rem",
			},
			lg: {
				padding: "0.75rem 1.5rem",
				fontSize: "1rem",
			},
		},
	},
	defaultVariants: {
		variant: "secondary",
		size: "md",
	},
});

// 🎨 Movement indicator styles
export const movementIndicator = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "1rem",
	textAnchor: "middle",
	dominantBaseline: "central",
	pointerEvents: "none",
	userSelect: "none",
});

// 🔍 Filter and search styles
export const filterBar = style({
	display: "flex",
	gap: "1rem",
	alignItems: "center",
	padding: "1rem",
	backgroundColor: wardleyTheme.surface,
	borderRadius: "0.375rem",
	border: `1px solid ${wardleyTheme.border}`,
	marginBottom: "1rem",
});

export const filterSelect = style({
	padding: "0.5rem",
	borderRadius: "0.25rem",
	border: `1px solid ${wardleyTheme.border}`,
	backgroundColor: wardleyTheme.background,
	color: wardleyTheme.text,
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.875rem",
});

export const searchInput = style({
	flex: "1",
	padding: "0.5rem",
	borderRadius: "0.25rem",
	border: `1px solid ${wardleyTheme.border}`,
	backgroundColor: wardleyTheme.background,
	color: wardleyTheme.text,
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.875rem",
	outline: "none",
	":focus": {
		borderColor: wardleyTheme.selected,
		boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.2)",
	},
});

// 📊 Legend styles
export const legend = style({
	display: "flex",
	flexDirection: "column",
	gap: "0.75rem",
	padding: "1rem",
	backgroundColor: wardleyTheme.surface,
	borderRadius: "0.375rem",
	border: `1px solid ${wardleyTheme.border}`,
});

export const legendTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1rem",
	fontWeight: "600",
	color: wardleyTheme.text,
	marginBottom: "0.5rem",
});

export const legendItem = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	fontSize: "0.875rem",
	color: wardleyTheme.textSecondary,
});

export const legendColor = style({
	width: "1rem",
	height: "1rem",
	borderRadius: "50%",
	border: `1px solid ${wardleyTheme.border}`,
});

// 🎪 Export component color mappings for JavaScript usage
export const componentColors = {
	genesis: wardleyTheme.componentGenesis,
	custom: wardleyTheme.componentCustom,
	product: wardleyTheme.componentProduct,
	commodity: wardleyTheme.componentCommodity,
	anchor: wardleyTheme.componentAnchor,
} as const;

export const visibilityColors = {
	visible: wardleyTheme.visibilityVisible,
	internal: wardleyTheme.visibilityInternal,
	infrastructure: wardleyTheme.visibilityInfrastructure,
} as const;
