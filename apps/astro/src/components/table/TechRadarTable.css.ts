import {
	createGlobalTheme,
	createVar,
	globalStyle,
	style,
	styleVariants,
} from "@vanilla-extract/css";
import { hardEdgeRadius } from "../../styles/theme.css";

const baseFontSize = 16;

export const fontSize = createGlobalTheme(":root", {
	small: `${12 / baseFontSize}rem`,
	base: `${14 / baseFontSize}rem`,
	medium: `${16 / baseFontSize}rem`,
	large: `${18 / baseFontSize}rem`,
});

// Cyberpunk theme colors with WCAG compliant contrast ratios
const colors = {
	neonPink: "#ff3377", // Brightened for better contrast
	neonBlue: "#00e5ff", // Adjusted for better contrast
	neonPurple: "#9933ff", // Adjusted for better contrast
	darkBg: "#121212", // Darkened for better contrast with text
	darkBgAlt: "#1e1e1e", // Adjusted for better contrast
	darkBgHover: "#2a2a2a", // Adjusted for better contrast
	textPrimary: "#ffffff", // Pure white for maximum contrast
	textSecondary: "#00e5ff", // Brightened neon blue for better contrast
	borderGlow: "0 0 1px #00e5ff, 0 0 1px #00e5ff",
	scrollbarThumb: "#00e5ff",
	scrollbarTrack: "#121212",
};

const radius = {
	round: hardEdgeRadius,
	radiusMedium: hardEdgeRadius,
};

const heights = {
	H40: "40px",
	H70VH: "70vh",
};

const widths = {
	W100Pcnt: "100%",
	W50Pcnt: "50%",
};

const fontStack = "monospace";

const transitions = {
	duration: "250ms",
	easing: "ease-in-out",
};

const spacing = {
	xxxs: 4,
	xxs: 8,
	xs: 12,
	md: 16,
	sm: 24,
};

const padding = {
	none: 0,
	sm: `${spacing.xxxs}px ${spacing.xs}px`,
	md: `${spacing.xs}px ${spacing.sm}px`,
};

export const tableThemeVars = {
	surface: createVar(),
	surfaceAlt: createVar(),
	surfaceHover: createVar(),
	textPrimary: createVar(),
	textSecondary: createVar(),
	textMuted: createVar(),
	borderStrong: createVar(),
	borderMuted: createVar(),
	shadow: createVar(),
};

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

export const tableContainer = style({
	width: widths.W100Pcnt,
	overflowX: "auto",
	maxHeight: "min(62vh, 42rem)",
	minHeight: "0",
	overflow: "auto",
	background: tableThemeVars.surface,
	border: `1px solid ${tableThemeVars.borderStrong}`,
	borderRadius: radius.radiusMedium,
	boxShadow: tableThemeVars.shadow,
	scrollbarColor: `${tableThemeVars.borderStrong} ${tableThemeVars.surface}`,
	scrollbarWidth: "thin",
	selectors: {
		"&::-webkit-scrollbar": {
			width: spacing.xs,
		},
		"&::-webkit-scrollbar-track": {
			background: tableThemeVars.surface,
			borderRadius: radius.round,
		},
		"&::-webkit-scrollbar-thumb": {
			background: tableThemeVars.borderStrong,
			borderRadius: radius.round,
			border: `1px solid ${tableThemeVars.borderStrong}`,
		},
		"&::-webkit-scrollbar-thumb:hover": {
			background: tableThemeVars.textSecondary,
		},
	},
});

export const tableContainerMobile = style([
	tableContainer,
	{
		maxHeight: "min(62vh, 42rem)",
		minHeight: "0",
	},
]);

export const table = style({
	width: widths.W100Pcnt,
	minWidth: "48rem",
	borderCollapse: "collapse",
	borderSpacing: 0,
	color: tableThemeVars.textPrimary,
	fontFamily: fontStack,
});

export const th = style({
	position: "relative",
	height: "auto",
	padding: "0.45rem 0.75rem",
	background: tableThemeVars.surfaceAlt,
	color: tableThemeVars.textSecondary,
	textTransform: "uppercase",
	letterSpacing: "0.08em",
	fontSize: fontSize.small,
	fontWeight: "bold",
	borderBottom: `1px solid ${tableThemeVars.borderStrong}`,
	textAlign: "left",
	whiteSpace: "nowrap",
});

export const thCenter = style({
	textAlign: "center",
	width: "7rem",
});

export const thRing = style({
	width: "7.25rem",
});

export const thAdr = style({
	width: "5.5rem",
});

export const tdCenter = style({
	textAlign: "center",
});

export const td = style({
	position: "relative",
	height: "auto",
	padding: "0.9rem 1rem",
	verticalAlign: "middle",
	background: tableThemeVars.surfaceAlt,
	borderBottom: `1px solid ${tableThemeVars.borderMuted}`,
	fontSize: fontSize.base,
	lineHeight: 1.45,
	transition: `background ${transitions.duration} ${transitions.easing}`,
});

export const tdNoResults = style({
	padding: "2rem 1rem",
	textAlign: "center",
	verticalAlign: "middle",
	color: tableThemeVars.textSecondary,
	fontSize: fontSize.base,
	textTransform: "uppercase",
	letterSpacing: "0.08em",
});

export const tr = style({
	transition: `transform ${transitions.duration} ${transitions.easing}`,
	":hover": {
		transform: "translateX(4px)",
	},
});

export const trh = style({
	position: "sticky",
	top: 0,
	zIndex: 1000,
	height: heights.H40,
	background: tableThemeVars.surface,
});

export const trhCard = style([
	trh,
	{
		"@media": {
			[media.small]: {
				display: "none",
			},
		},
	},
]);

export const tableWrapper = style({
	vars: {
		[tableThemeVars.surface]: "#121212",
		[tableThemeVars.surfaceAlt]: "#1e1e1e",
		[tableThemeVars.surfaceHover]: "#2a2a2a",
		[tableThemeVars.textPrimary]: "#ffffff",
		[tableThemeVars.textSecondary]: "#00e5ff",
		[tableThemeVars.textMuted]: "rgba(255, 255, 255, 0.72)",
		[tableThemeVars.borderStrong]: "#00e5ff",
		[tableThemeVars.borderMuted]: "rgba(255, 255, 255, 0.12)",
		[tableThemeVars.shadow]: "0 0 20px rgba(5, 217, 232, 0.1)",
	},
	display: "grid",
	gap: spacing.xs,
	marginTop: 0,
	padding: spacing.xs,
	background: tableThemeVars.surface,
	borderRadius: radius.radiusMedium,
	boxShadow: tableThemeVars.shadow,
	selectors: {
		'[data-theme="light"] &': {
			vars: {
				[tableThemeVars.surface]: "#ffffff",
				[tableThemeVars.surfaceAlt]: "#f7f9fc",
				[tableThemeVars.surfaceHover]: "#edf2f7",
				[tableThemeVars.textPrimary]: "#111827",
				[tableThemeVars.textSecondary]: "#0f766e",
				[tableThemeVars.textMuted]: "rgba(17, 24, 39, 0.68)",
				[tableThemeVars.borderStrong]: "#0f766e",
				[tableThemeVars.borderMuted]: "rgba(15, 23, 42, 0.12)",
				[tableThemeVars.shadow]: "0 12px 30px rgba(15, 23, 42, 0.08)",
			},
		},
		'[data-theme="machine"] &': {
			vars: {
				[tableThemeVars.surface]: "#0e1218",
				[tableThemeVars.surfaceAlt]: "#151c22",
				[tableThemeVars.surfaceHover]: "#202a30",
				[tableThemeVars.textPrimary]: "#e5ffe8",
				[tableThemeVars.textSecondary]: "#9effa6",
				[tableThemeVars.textMuted]: "rgba(229, 255, 232, 0.72)",
				[tableThemeVars.borderStrong]: "#9effa6",
				[tableThemeVars.borderMuted]: "rgba(158, 255, 166, 0.16)",
				[tableThemeVars.shadow]: "0 0 18px rgba(158, 255, 166, 0.14)",
			},
		},
	},
});

export const tableSummaryBar = style({
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	gap: spacing.xs,
	padding: "0.15rem 0.125rem 0.45rem",
	borderBottom: `1px solid ${tableThemeVars.borderMuted}`,
	"@media": {
		[media.small]: {
			alignItems: "flex-start",
			flexDirection: "column",
			gap: spacing.xxxs,
		},
	},
});

export const tableSummaryBlock = style({
	display: "grid",
	gap: 2,
});

export const tableSummaryEyebrow = style({
	display: "block",
	color: tableThemeVars.textSecondary,
	fontFamily: fontStack,
	fontSize: "0.6875rem",
	letterSpacing: "0.14em",
	textTransform: "uppercase",
	lineHeight: 1.2,
});

export const tableSummaryPrimary = style({
	display: "block",
	color: tableThemeVars.textPrimary,
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "clamp(1.05rem, 1rem + 0.4vw, 1.3rem)",
	fontWeight: 700,
	lineHeight: 1.1,
});

export const tableSummaryMeta = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	gap: 6,
	flexWrap: "wrap",
	"@media": {
		[media.small]: {
			justifyContent: "flex-start",
		},
	},
});

export const tableSummaryChip = style({
	display: "inline-flex",
	alignItems: "center",
	padding: "0.35rem 0.55rem",
	border: `1px solid ${tableThemeVars.borderMuted}`,
	borderRadius: hardEdgeRadius,
	background: tableThemeVars.surfaceAlt,
	color: tableThemeVars.textSecondary,
	fontFamily: fontStack,
	fontSize: "0.6875rem",
	textTransform: "uppercase",
	letterSpacing: "0.08em",
	lineHeight: 1,
});

export const flexRowAlignCenterJustifyEnd = style({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "flex-end",
});

export const formControlWrapper = style([
	flexRowAlignCenterJustifyEnd,
	{
		gap: spacing.xs,
		marginBottom: spacing.sm,
		"@media": {
			[media.small]: {
				flexDirection: "column",
			},
		},
	},
]);

export const dataRows = style({
	position: "relative",
	zIndex: 1,
});

export const tableResponsive = style({
	display: "table",
	width: "100%",
});

export const cellTextPrimary = style({
	display: "block",
	color: tableThemeVars.textPrimary,
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: fontSize.medium,
	fontWeight: 600,
	lineHeight: 1.2,
});

export const cellTextSecondary = style({
	display: "block",
	color: tableThemeVars.textMuted,
	fontFamily: fontStack,
	fontSize: fontSize.small,
	lineHeight: 1.4,
	textTransform: "uppercase",
	letterSpacing: "0.08em",
});

export const badge = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	padding: "0.35rem 0.55rem",
	border: "1px solid currentColor",
	borderRadius: hardEdgeRadius,
	fontFamily: fontStack,
	fontSize: fontSize.small,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	width: "fit-content",
});

export const ringBadge = styleVariants({
	Adopt: [
		badge,
		{
			background: "rgba(94, 228, 113, 0.12)",
			color: "#5ee471",
			selectors: {
				'[data-theme="light"] &': {
					background: "rgba(22, 163, 74, 0.14)",
					color: "#166534",
				},
			},
		},
	],
	Assess: [
		badge,
		{
			background: "rgba(255, 229, 0, 0.12)",
			color: "#ffe500",
			selectors: {
				'[data-theme="light"] &': {
					background: "rgba(202, 138, 4, 0.16)",
					color: "#854d0e",
				},
			},
		},
	],
	Caution: [
		badge,
		{
			background: "rgba(255, 51, 119, 0.12)",
			color: colors.neonPink,
			selectors: {
				'[data-theme="light"] &': {
					background: "rgba(225, 29, 72, 0.14)",
					color: "#be123c",
				},
			},
		},
	],
	Trial: [
		badge,
		{
			background: "rgba(0, 229, 255, 0.12)",
			color: colors.neonBlue,
			selectors: {
				'[data-theme="light"] &': {
					background: "rgba(8, 145, 178, 0.14)",
					color: "#155e75",
				},
			},
		},
	],
});

export const adrBadge = styleVariants({
	no: [
		badge,
		{
			background: tableThemeVars.surface,
			color: tableThemeVars.textMuted,
		},
	],
	yes: [
		badge,
		{
			background: "rgba(0, 229, 255, 0.12)",
			color: colors.neonBlue,
			selectors: {
				'[data-theme="light"] &': {
					background: "rgba(8, 145, 178, 0.14)",
					color: "#155e75",
				},
			},
		},
	],
});

export const quadrantCell = style({
	color: tableThemeVars.textSecondary,
	fontFamily: fontStack,
	fontSize: fontSize.base,
	fontWeight: 700,
	lineHeight: 1.35,
	textTransform: "uppercase",
});

export const tagList = style({
	display: "flex",
	flexWrap: "wrap",
	gap: spacing.xxxs,
});

export const tag = style({
	display: "inline-flex",
	alignItems: "center",
	padding: "0.25rem 0.5rem",
	border: `1px solid ${tableThemeVars.borderMuted}`,
	borderRadius: hardEdgeRadius,
	background: tableThemeVars.surface,
	color: tableThemeVars.textPrimary,
	fontFamily: fontStack,
	fontSize: fontSize.small,
	lineHeight: 1.25,
	maxWidth: "100%",
	overflowWrap: "anywhere",
});

export const views = style({
	display: "inline-block",
	borderRadius: radius.round,
	color: "black",
	textAlign: "center",
	padding: "0.5rem",
	width: "fit-content",
});

export const highViews = style([
	views,
	{
		background: colors.neonPink,
		position: "relative",
		zIndex: 1,
	},
]);

export const lowViews = style([
	views,
	{
		background: colors.neonBlue,
	},
]);

export const cellGrey = style({
	position: "relative",
	padding: "0.5rem",
	display: "block",
	right: 132,
	zIndex: 0,
	borderRadius: radius.round,
	background: colors.darkBgAlt,
	textAlign: "right",
	color: colors.textPrimary,
	"@media": {
		[media.small]: {
			right: 0,
			textAlign: "center",
			width: "fit-content",
		},
	},
});

export const trResponsive = style({
	"@media": {
		[media.small]: {
			display: "flex",
			flexDirection: "column",
			marginBottom: "1rem",
		},
	},
});

export const tdResponsive = style({
	"@media": {
		[media.small]: {
			width: "100%",
			display: "flex",
			flexDirection: "column",
			alignItems: "flex-start",
			gap: "0.35rem",
			padding: "0.65rem 0.5rem",
			":before": {
				content: "attr(data-label)",
				color: tableThemeVars.textMuted,
				fontSize: fontSize.small,
				fontWeight: 700,
				letterSpacing: "0.08em",
				textTransform: "uppercase",
				paddingRight: 0,
			},
		},
	},
});

export const thResponsive = style({
	"@media": {
		[media.small]: {
			display: "none",
		},
	},
});

export const buttonBase = style({
	backgroundColor: "transparent",
	borderRadius: hardEdgeRadius,
	border: 0,
	boxShadow: "none",
	cursor: "pointer",
	display: "inline-block",
	fontFamily: fontStack,
	fontWeight: 700,
	maxWidth: "250px",
	outline: 0,
	padding: padding.md,
	textAlign: "center",
	textDecoration: "none",
	textTransform: "capitalize",
	transition: `${transitions.duration} ${transitions.easing}`,
	transitionProperty: "background, color, border-color",
});

export const buttonSecondary = style([
	buttonBase,
	{
		backgroundColor: colors.neonBlue,
		color: colors.textPrimary,
		selectors: {
			"&:hover, &:focus": {
				backgroundColor: colors.neonPink,
				color: colors.textPrimary,
			},
		},
	},
]);

export const buttonWithWhiteSvg = style({
	display: "inline-flex",
	alignItems: "center",
	gap: "0.25rem",
	padding: "0px",
	backgroundColor: "transparent",
	border: "none",
	cursor: "pointer",
	color: tableThemeVars.textSecondary,
	fontFamily: fontStack,
	fontSize: fontSize.small,
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
});

export const sortControl = style([
	buttonWithWhiteSvg,
	{
		width: "100%",
		justifyContent: "space-between",
		lineHeight: 1.1,
		selectors: {
			'&[data-sorted="false"]': {
				color: tableThemeVars.textMuted,
			},
			"&:hover, &:focus-visible": {
				color: tableThemeVars.textPrimary,
			},
		},
	},
]);

export const sortLabel = style({
	display: "inline-flex",
	alignItems: "center",
	gap: "0.2rem",
	minWidth: 0,
});

export const sortIcon = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	flexShrink: 0,
	opacity: 0.92,
});

export const stripedRowCard = style({
	background: tableThemeVars.surfaceAlt,
	selectors: {
		"&:nth-child(even)": {
			background: tableThemeVars.surface,
		},
	},
	"@media": {
		[media.small]: {
			display: "block",
			borderRadius: radius.radiusMedium,
			background: tableThemeVars.surfaceAlt,
			marginBottom: spacing.xxs,
			padding: "0.35rem 0.5rem",
			selectors: {
				"&:nth-child(even)": {
					background: tableThemeVars.surfaceAlt,
					borderTopLeftRadius: hardEdgeRadius,
				},
			},
		},
	},
});

globalStyle(`${stripedRowCard}:hover td`, {
	background: tableThemeVars.surfaceHover,
});

export const stripedRow = style({
	background: tableThemeVars.surfaceAlt,
	selectors: {
		"&:nth-child(even)": {
			background: tableThemeVars.surface,
		},
	},
	"@media": {
		[media.small]: {
			selectors: {
				"&:nth-child(even)": {
					background: tableThemeVars.surface,
				},
			},
		},
	},
});

globalStyle(`${stripedRow}:hover td`, {
	background: tableThemeVars.surfaceHover,
});

export const clickableRow = style({
	cursor: "pointer",
	selectors: {
		"&:focus-visible": {
			outline: `2px solid ${tableThemeVars.borderStrong}`,
			outlineOffset: "-2px",
		},
	},
});

globalStyle(`${clickableRow}:focus-visible td`, {
	background: tableThemeVars.surfaceHover,
});
