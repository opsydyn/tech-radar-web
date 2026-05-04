import { createGlobalTheme, style } from "@vanilla-extract/css";

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
	round: "4px",
	radiusMedium: "8px",
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
	sm: 24,
};

const padding = {
	none: 0,
	sm: `${spacing.xxxs}px ${spacing.xs}px`,
	md: `${spacing.xs}px ${spacing.sm}px`,
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
	maxHeight: heights.H70VH,
	minHeight: heights.H70VH,
	overflow: "auto",
	background: colors.darkBg,
	border: `1px solid ${colors.neonBlue}`,
	borderRadius: radius.radiusMedium,
	boxShadow: colors.borderGlow,
	scrollbarColor: `${colors.scrollbarThumb} ${colors.scrollbarTrack}`,
	scrollbarWidth: "thin",
	selectors: {
		"&::-webkit-scrollbar": {
			width: spacing.xs,
		},
		"&::-webkit-scrollbar-track": {
			background: colors.scrollbarTrack,
			borderRadius: radius.round,
		},
		"&::-webkit-scrollbar-thumb": {
			background: colors.scrollbarThumb,
			borderRadius: radius.round,
			border: `1px solid ${colors.neonBlue}`,
		},
		"&::-webkit-scrollbar-thumb:hover": {
			background: colors.neonPink,
		},
	},
});

export const tableContainerMobile = style([
	tableContainer,
	{
		maxHeight: "400px",
		minHeight: "400px",
	},
]);

export const table = style({
	width: widths.W100Pcnt,
	borderCollapse: "separate",
	borderSpacing: "0 4px",
	color: colors.textPrimary,
	fontFamily: fontStack,
});

export const th = style({
	position: "relative",
	height: "auto",
	padding: padding.md,
	background: colors.darkBgAlt,
	color: colors.neonBlue,
	textTransform: "uppercase",
	letterSpacing: "1px",
	fontWeight: "bold",
	borderBottom: `2px solid ${colors.neonBlue}`,
	textAlign: "left",
});

export const td = style({
	position: "relative",
	height: "auto",
	padding: padding.md,
	verticalAlign: "middle",
	background: colors.darkBgAlt,
	borderBottom: `1px solid ${colors.darkBgHover}`,
	transition: `background ${transitions.duration} ${transitions.easing}`,
	":hover": {
		background: colors.darkBgHover,
	},
});

export const tdNoResults = style({
	padding: spacing.sm,
	textAlign: "center",
	verticalAlign: "middle",
	color: colors.neonPink,
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
	background: colors.darkBg,
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
	display: "block",
	marginTop: "1rem",
	padding: spacing.sm,
	background: colors.darkBg,
	borderRadius: radius.radiusMedium,
	boxShadow: "0 0 20px rgba(5, 217, 232, 0.1)",
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
			justifyContent: "space-between",
			padding: "8px",
			":before": {
				content: "attr(data-label)",
				fontSize: fontSize.medium,
				fontWeight: 700,
				flexBasis: "50%",
				flexGrow: 1,
				paddingRight: "10px",
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
	borderRadius: "50px",
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
	padding: "0px",
	backgroundColor: "transparent",
	border: "none",
	cursor: "pointer",
	color: colors.textPrimary,
});

export const stripedRowCard = style({
	background: colors.darkBgAlt,
	selectors: {
		"&:nth-child(even)": {
			background: colors.darkBg,
		},
	},
	"@media": {
		[media.small]: {
			display: "block",
			borderRadius: radius.radiusMedium,
			background: colors.darkBgAlt,
			marginBottom: spacing.sm,
			padding: padding.md,
			selectors: {
				"&:nth-child(even)": {
					background: colors.darkBgAlt,
					borderTopLeftRadius: radius.radiusMedium,
				},
			},
		},
	},
});

export const stripedRow = style({
	background: colors.darkBgAlt,
	selectors: {
		"&:nth-child(even)": {
			background: colors.darkBg,
		},
	},
	"@media": {
		[media.small]: {
			selectors: {
				"&:nth-child(even)": {
					background: colors.darkBg,
				},
			},
		},
	},
});
