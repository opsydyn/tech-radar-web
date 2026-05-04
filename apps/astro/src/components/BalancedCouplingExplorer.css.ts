import { globalStyle, style, styleVariants } from "@vanilla-extract/css";

export const theme = {
	font: {
		family: "IBM Plex Mono, monospace",
		size: {
			base: 16,
			label: 14,
			value: 20,
			chart: 16,
			feedback: 16,
			icon: 14,
			tooltip: 14,
		},
		weight: {
			regular: 400,
			semibold: 500,
			bold: 600,
		},
		letterSpacing: 0.01,
		lineHeight: 1.6,
	},
	color: {
		primary: "#b5e853",
		active: "#c7f066",
		border: "#333",
		background: "#1a1a1a",
		chartBar: "#5e81ac",
		tooltipBg: "#1a1a1a",
		tooltipText: "#b5e853",
		cardBorder: "#b5e853",
		tooltipShadow: "rgba(0, 0, 0, 0.4)",
	},
	spacing: {
		gap: 32,
		chartGap: 16,
		chartSectionGap: 16,
		sliderGap: 32,
		sliderWidth: 120,
		buttonPadding: "0.75em 2em",
		cardPadding: "1em 1.5em",
		feedbackPadding: "0.5em 0",
		tooltipPadding: "8px 12px",
		labelGap: 8,
		labelHeaderGap: 4,
		marginBottom: 8,
		presetButtonGap: 12,
		presetsContainerGap: 16,
	},
	borderRadius: 8,
	borderWidth: 1,
	borderLeft: 6,
	minWidth: 120,
	cardMinWidth: 300,
	chartWidth: 480,
	chartHeight: 280,
	maxWidth: 1000,
	tooltip: {
		borderRadius: 6,
		maxWidth: 250,
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
	},
};

// Common flexbox utility styles
export const flexRow = style({
	display: "flex",
	flexDirection: "row",
});
export const flexColumn = style({
	display: "flex",
	flexDirection: "column",
});
export const flexCenter = style({
	alignItems: "center",
	justifyContent: "center",
});
export const flexAlignCenter = style({
	alignItems: "center",
});
export const flexJustifyCenter = style({
	justifyContent: "center",
});
export const flexWrap = style({
	flexWrap: "wrap",
});

// Composite flex utility styles
export const flexRowWrapCenter = style([
	flexRow,
	flexAlignCenter,
	flexWrap,
	flexJustifyCenter,
]);

export const flexRowWrapJustifyCenter = style([
	flexRow,
	flexWrap,
	flexJustifyCenter,
]);

export const flexColumnAlignCenter = style([flexColumn, flexAlignCenter]);

export const container = style([
	flexColumn,
	{
		gap: theme.spacing.gap,
		maxWidth: theme.maxWidth,
		fontFamily: theme.font.family,
	},
]);

export const sliderContainer = style([
	flexRowWrapCenter,
	{
		gap: theme.spacing.sliderGap,
		marginBottom: theme.spacing.marginBottom,
	},
]);

export const labelStyle = style([
	flexColumnAlignCenter,
	{
		fontWeight: theme.font.weight.semibold,
		color: theme.color.primary,
		gap: theme.spacing.labelGap,
		minWidth: theme.minWidth,
		fontFamily: theme.font.family,
	},
]);

export const labelHeader = style([
	flexRow,
	flexAlignCenter,
	{
		gap: theme.spacing.labelHeaderGap,
	},
]);

export const labelText = style({
	fontFamily: theme.font.family,
});

export const labelValue = style({
	color: theme.color.primary,
	fontFamily: theme.font.family,
});

export const infoIcon = style({
	cursor: "help",
	fontSize: theme.font.size.icon,
});

export const slider = style({
	width: theme.spacing.sliderWidth,
});

export const chartsContainer = style([
	flexRowWrapCenter,
	{
		gap: theme.spacing.gap,
	},
]);

export const chartSection = style([
	flexColumnAlignCenter,
	{
		gap: theme.spacing.chartSectionGap,
	},
]);

export const chartTitle = style({
	color: theme.color.primary,
	fontFamily: theme.font.family,
});

export const bottomSection = style({
	display: "flex",
	gap: theme.spacing.gap,
	alignItems: "flex-start",
	flexWrap: "wrap",
	justifyContent: "center",
});

export const formula = style({
	fontFamily: theme.font.family,
	color: theme.color.primary,
	fontSize: theme.font.size.base,
	background: theme.color.background,
	padding: theme.spacing.cardPadding,
	borderRadius: theme.borderRadius,
	border: `${theme.borderWidth}px solid ${theme.color.border}`,
	textAlign: "center",
	minWidth: theme.cardMinWidth,
	flex: `1 1 ${theme.cardMinWidth}px`,
});

export const feedbackCard = style({
	minWidth: theme.cardMinWidth,
	flex: `1 1 ${theme.cardMinWidth}px`,
	borderLeft: `${theme.borderLeft}px solid ${theme.color.primary}`,
});

export const feedbackContent = style({
	color: theme.color.primary,
	fontFamily: theme.font.family,
	fontSize: theme.font.size.feedback,
	lineHeight: theme.font.lineHeight,
	letterSpacing: theme.font.letterSpacing,
	padding: theme.spacing.feedbackPadding,
});

export const presetsContainer = style([
	flexColumn,
	flexAlignCenter,
	{
		gap: theme.spacing.presetsContainerGap,
	},
]);

export const presetsTitle = style({
	color: theme.color.primary,
	marginBottom: theme.spacing.marginBottom,
	fontFamily: theme.font.family,
});

export const presetButtons = style([
	flexRowWrapJustifyCenter,
	{
		gap: theme.spacing.presetButtonGap,
	},
]);

export const presetButton = styleVariants({
	inactive: {
		color: theme.color.primary,
		backgroundColor: "transparent",
		padding: theme.spacing.buttonPadding,
		border: `${theme.borderWidth}px solid ${theme.color.primary}`,
		fontFamily: theme.font.family,
		transition: "all 0.2s ease",
	},
	active: {
		color: theme.color.active,
		backgroundColor: "rgba(199, 240, 102, 0.1)",
		padding: theme.spacing.buttonPadding,
		border: `${theme.borderWidth}px solid ${theme.color.active}`,
		fontFamily: theme.font.family,
		transition: "all 0.2s ease",
	},
});

globalStyle(`.${presetButton.inactive}`, {
	border: `${theme.borderWidth}px solid ${theme.color.primary} !important`,
	color: `${theme.color.primary} !important`,
	backgroundColor: "transparent !important",
	padding: `${theme.spacing.buttonPadding} !important`,
});
globalStyle(`.${presetButton.active}`, {
	border: `${theme.borderWidth}px solid ${theme.color.active} !important`,
	color: `${theme.color.active} !important`,
	backgroundColor: "rgba(199, 240, 102, 0.1) !important",
	padding: `${theme.spacing.buttonPadding} !important`,
});

export const tooltip = style({
	backgroundColor: theme.color.tooltipBg,
	color: theme.color.tooltipText,
	padding: theme.spacing.tooltipPadding,
	borderRadius: theme.tooltip.borderRadius,
	border: `${theme.borderWidth}px solid ${theme.color.border}`,
	fontFamily: theme.font.family,
	fontSize: theme.font.size.tooltip,
	maxWidth: theme.tooltip.maxWidth,
	boxShadow: theme.tooltip.boxShadow,
});

export const systemExamplesSection = style([
	flexColumn,
	{
		gap: theme.spacing.chartSectionGap,
		marginTop: theme.spacing.gap,
	},
]);

export const systemExamplesContainer = style([
	flexRowWrapCenter,
	{
		gap: theme.spacing.gap,
	},
]);

export const systemExampleCard = style({
	width: '300px',
	display: 'flex',
	flexDirection: 'column',
	gap: '0.75rem',
	padding: theme.spacing.cardPadding,
	borderLeft: `${theme.borderLeft}px solid ${theme.color.primary}`,
});

export const systemExampleHeader = style({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

export const riskIndicator = style({
	padding: '2px 8px',
	borderRadius: '4px',
	fontSize: '0.8rem',
	color: '#222',
	fontWeight: theme.font.weight.semibold,
});

export const systemExampleDetails = style({
	display: 'flex',
	flexDirection: 'column',
	gap: '0.25rem',
	marginTop: '0.5rem',
});

export const systemExampleParam = style({
	display: 'flex',
	justifyContent: 'space-between',
});

export const systemExampleRecommendation = style({
	marginTop: '0.5rem',
	paddingTop: '0.5rem',
	borderTop: `1px solid ${theme.color.border}`,
});

export const sectionTitle = style({
	color: theme.color.primary,
	marginBottom: theme.spacing.marginBottom,
	fontFamily: theme.font.family,
});
