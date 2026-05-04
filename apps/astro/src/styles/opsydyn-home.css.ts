import { style } from "@vanilla-extract/css";
import { opsydynTokens } from "./opsydyn-tokens";

// Base page styles
export const page = style({
	fontFamily: opsydynTokens.typography.fontFamily.mono,
	fontSize: opsydynTokens.typography.fontSize.base,
	lineHeight: opsydynTokens.typography.lineHeight.normal,
	color: opsydynTokens.colors["text-primary"],
	backgroundColor: opsydynTokens.colors.paper,
	margin: 0,
	padding: 0,
	minHeight: "100vh",
	boxSizing: "border-box",

	selectors: {
		"html[data-theme='dark'] &": {
			backgroundColor: "#121212",
			color: opsydynTokens.colors.paper,
		},
	},
});

// Hero Section
export const hero = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	minHeight: "100vh",
	padding: `${opsydynTokens.spacing.xl} ${opsydynTokens.spacing.lg}`,
	textAlign: "center",

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			padding: `${opsydynTokens.spacing["3xl"]} ${opsydynTokens.spacing.xl}`,
		},
	},
});

export const heroContainer = style({
	maxWidth: opsydynTokens.layout.maxWidth.md,
	margin: "0 auto",
});

export const wordmark = style({
	fontFamily: opsydynTokens.typography.fontFamily.display,
	fontSize: opsydynTokens.typography.fontSize["4xl"],
	fontWeight: opsydynTokens.typography.fontWeight.bold,
	color: opsydynTokens.colors["text-primary"],
	marginBottom: opsydynTokens.spacing.lg,
	letterSpacing: "-0.025em",

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			fontSize: opsydynTokens.typography.fontSize["5xl"],
		},
	},
});

export const tagline = style({
	fontSize: opsydynTokens.typography.fontSize.xl,
	fontWeight: opsydynTokens.typography.fontWeight.medium,
	color: opsydynTokens.colors["accent-primary"],
	marginBottom: opsydynTokens.spacing.lg,
	fontStyle: "italic",

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			fontSize: opsydynTokens.typography.fontSize["2xl"],
		},
	},

	selectors: {
		"html[data-theme='dark'] &": {
			color: opsydynTokens.colors["accent-secondary"],
		},
	},
});

export const subcopy = style({
	fontSize: opsydynTokens.typography.fontSize.lg,
	color: opsydynTokens.colors["text-secondary"],
	marginBottom: opsydynTokens.spacing["2xl"],
	lineHeight: opsydynTokens.typography.lineHeight.relaxed,
	maxWidth: "42ch",
	margin: `0 auto ${opsydynTokens.spacing["2xl"]} auto`,
});

export const ctaButton = style({
	display: "inline-block",
	padding: `${opsydynTokens.spacing.md} ${opsydynTokens.spacing.xl}`,
	fontSize: opsydynTokens.typography.fontSize.base,
	fontWeight: opsydynTokens.typography.fontWeight.semibold,
	fontFamily: opsydynTokens.typography.fontFamily.mono,
	color: opsydynTokens.colors["bg-primary"],
	backgroundColor: opsydynTokens.colors["accent-primary"],
	border: `2px solid ${opsydynTokens.colors["accent-primary"]}`,
	borderRadius: opsydynTokens.borderRadius.md,
	cursor: "pointer",
	transition: opsydynTokens.transition.normal,
	textDecoration: "none",
	margin: `0 ${opsydynTokens.spacing.sm}`,

	":hover": {
		backgroundColor: opsydynTokens.colors["accent-secondary"],
		borderColor: opsydynTokens.colors["accent-secondary"],
		color: opsydynTokens.colors["bg-primary"],
	},

	":focus": {
		outline: `2px solid ${opsydynTokens.colors["accent-primary"]}`,
		outlineOffset: "2px",
	},

	selectors: {
		"html[data-theme='dark'] &": {
			backgroundColor: opsydynTokens.colors["accent-secondary"],
			borderColor: opsydynTokens.colors["accent-secondary"],
		},
		"html[data-theme='dark'] &:hover": {
			backgroundColor: opsydynTokens.colors["accent-primary"],
			borderColor: opsydynTokens.colors["accent-primary"],
		},
	},
});

// Feature Grid
export const featureGrid = style({
	display: "grid",
	gridTemplateColumns: "repeat(1, 1fr)",
	gap: opsydynTokens.spacing.xl,
	padding: `${opsydynTokens.spacing["3xl"]} ${opsydynTokens.spacing.lg}`,
	maxWidth: opsydynTokens.layout.maxWidth.xl,
	margin: "0 auto",

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			gridTemplateColumns: "repeat(2, 1fr)",
			padding: `${opsydynTokens.spacing["4xl"]} ${opsydynTokens.spacing.xl}`,
		},
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.lg})`]: {
			gridTemplateColumns: "repeat(3, 1fr)",
		},
	},
});

export const featureCard = style({
	padding: opsydynTokens.spacing.xl,
	border: `1px solid ${opsydynTokens.colors["border-subtle"]}`,
	borderRadius: opsydynTokens.borderRadius.lg,
	backgroundColor: opsydynTokens.colors["bg-primary"],
	boxShadow: opsydynTokens.shadows.subtle,
	transition: opsydynTokens.transition.normal,

	":hover": {
		boxShadow: opsydynTokens.shadows.medium,
		borderColor: opsydynTokens.colors["accent-primary"],
	},

	selectors: {
		"html[data-theme='dark'] &:hover": {
			borderColor: opsydynTokens.colors["accent-secondary"],
		},
	},
});

export const featureTitle = style({
	fontFamily: opsydynTokens.typography.fontFamily.display,
	fontSize: opsydynTokens.typography.fontSize.xl,
	fontWeight: opsydynTokens.typography.fontWeight.semibold,
	color: opsydynTokens.colors["text-primary"],
	marginBottom: opsydynTokens.spacing.md,
	margin: `0 0 ${opsydynTokens.spacing.md} 0`,
});

export const featureDesc = style({
	fontSize: opsydynTokens.typography.fontSize.base,
	color: opsydynTokens.colors["text-secondary"],
	lineHeight: opsydynTokens.typography.lineHeight.relaxed,
	margin: 0,
});

// Philosophy Block
export const philosophyBlock = style({
	padding: `${opsydynTokens.spacing["3xl"]} ${opsydynTokens.spacing.lg}`,
	backgroundColor: opsydynTokens.colors["bg-secondary"],

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			padding: `${opsydynTokens.spacing["4xl"]} ${opsydynTokens.spacing.xl}`,
		},
	},
});

export const philosophyTitle = style({
	fontFamily: opsydynTokens.typography.fontFamily.display,
	fontSize: opsydynTokens.typography.fontSize["3xl"],
	fontWeight: opsydynTokens.typography.fontWeight.bold,
	color: opsydynTokens.colors["bg-primary"],
	textAlign: "center",
	marginBottom: opsydynTokens.spacing["2xl"],
	margin: `0 0 ${opsydynTokens.spacing["2xl"]} 0`,
});

export const philosophyDiff = style({
	display: "grid",
	gridTemplateColumns: "repeat(1, 1fr)",
	gap: opsydynTokens.spacing.xl,
	maxWidth: opsydynTokens.layout.maxWidth.lg,
	margin: `0 auto ${opsydynTokens.spacing["2xl"]} auto`,

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			gridTemplateColumns: "repeat(2, 1fr)",
		},
	},
});

export const philosophyHeading = style({
	fontSize: opsydynTokens.typography.fontSize.xl,
	fontWeight: opsydynTokens.typography.fontWeight.semibold,
	color: opsydynTokens.colors["bg-primary"],
	marginBottom: opsydynTokens.spacing.md,
	margin: `0 0 ${opsydynTokens.spacing.md} 0`,
});

export const philosophyList = style({
	listStyle: "none",
	padding: 0,
	margin: 0,
});

export const philosophyItem = style({
	fontSize: opsydynTokens.typography.fontSize.base,
	color: opsydynTokens.colors["bg-primary"],
	padding: `${opsydynTokens.spacing.sm} 0`,
	borderBottom: `1px solid ${opsydynTokens.colors["border-subtle"]}`,
});

export const philosophyItemLast = style({
	borderBottom: "none",
});

export const philosophyValues = style({
	maxWidth: opsydynTokens.layout.maxWidth.sm,
	margin: "0 auto",
	textAlign: "center",
});

export const valuesHeading = style({
	fontSize: opsydynTokens.typography.fontSize.xl,
	fontWeight: opsydynTokens.typography.fontWeight.semibold,
	color: opsydynTokens.colors["bg-primary"],
	marginBottom: opsydynTokens.spacing.lg,
	margin: `0 0 ${opsydynTokens.spacing.lg} 0`,
});

export const valuesList = style({
	listStyle: "none",
	padding: 0,
	margin: 0,
	display: "flex",
	flexWrap: "wrap",
	justifyContent: "center",
	gap: opsydynTokens.spacing.lg,
});

export const valuesItem = style({
	fontSize: opsydynTokens.typography.fontSize.base,
	color: opsydynTokens.colors["bg-primary"],
	padding: `${opsydynTokens.spacing.sm} ${opsydynTokens.spacing.md}`,
	border: `1px solid ${opsydynTokens.colors["bg-primary"]}`,
	borderRadius: opsydynTokens.borderRadius.md,
	whiteSpace: "nowrap",
});

// Architecture Block
export const architectureBlock = style({
	padding: `${opsydynTokens.spacing["3xl"]} ${opsydynTokens.spacing.lg}`,
	textAlign: "center",

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			padding: `${opsydynTokens.spacing["4xl"]} ${opsydynTokens.spacing.xl}`,
		},
	},
});

export const architectureTitle = style({
	fontFamily: opsydynTokens.typography.fontFamily.display,
	fontSize: opsydynTokens.typography.fontSize["3xl"],
	fontWeight: opsydynTokens.typography.fontWeight.bold,
	color: opsydynTokens.colors["text-primary"],
	marginBottom: opsydynTokens.spacing["2xl"],
	margin: `0 0 ${opsydynTokens.spacing["2xl"]} 0`,
});

export const architectureVisual = style({
	display: "flex",
	justifyContent: "center",
	maxWidth: "100%",
	overflowX: "auto",
});

export const architectureDiagram = style({
	display: "inline-block",
	fontSize: opsydynTokens.typography.fontSize.base,
	fontFamily: opsydynTokens.typography.fontFamily.mono,
	color: opsydynTokens.colors["text-secondary"],
	backgroundColor: opsydynTokens.colors["bg-primary"],
	border: `2px solid ${opsydynTokens.colors["border-subtle"]}`,
	borderRadius: opsydynTokens.borderRadius.lg,
	padding: opsydynTokens.spacing.xl,
	margin: 0,
	textAlign: "left",
	lineHeight: opsydynTokens.typography.lineHeight.normal,

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			fontSize: opsydynTokens.typography.fontSize.lg,
		},
	},
});

// Hero Graphic
export const heroGraphic = style({
	marginBottom: opsydynTokens.spacing.xl,
	padding: opsydynTokens.spacing.lg,
	backgroundColor: opsydynTokens.colors["node-gray"],
	borderRadius: opsydynTokens.borderRadius.lg,
	overflow: "hidden",
	maxWidth: "100%",
});

export const heroGraphicPre = style({
	margin: 0,
	color: opsydynTokens.colors["bg-primary"],
	fontSize: opsydynTokens.typography.fontSize.sm,

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			fontSize: opsydynTokens.typography.fontSize.base,
		},
	},
});

// Final CTA
export const finalCta = style({
	padding: `${opsydynTokens.spacing["3xl"]} ${opsydynTokens.spacing.lg}`,
	textAlign: "center",
	backgroundColor: opsydynTokens.colors["bg-primary"],

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			padding: `${opsydynTokens.spacing["4xl"]} ${opsydynTokens.spacing.xl}`,
		},
	},
});

export const finalCtaText = style({
	fontSize: opsydynTokens.typography.fontSize.xl,
	color: opsydynTokens.colors["text-secondary"],
	marginBottom: opsydynTokens.spacing["2xl"],
	margin: `0 0 ${opsydynTokens.spacing["2xl"]} 0`,
	lineHeight: opsydynTokens.typography.lineHeight.relaxed,

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			fontSize: opsydynTokens.typography.fontSize["2xl"],
		},
	},
});

export const finalCtaButtons = style({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	gap: opsydynTokens.spacing.md,

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			flexDirection: "row",
			justifyContent: "center",
			gap: opsydynTokens.spacing.lg,
		},
	},
});

// Footer
export const footer = style({
	padding: `${opsydynTokens.spacing.xl} ${opsydynTokens.spacing.lg}`,
	borderTop: `1px solid ${opsydynTokens.colors["border-subtle"]}`,
	backgroundColor: opsydynTokens.colors["bg-primary"],

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			padding: `${opsydynTokens.spacing.xl} ${opsydynTokens.spacing.xl}`,
		},
	},
});

export const footerContent = style({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: opsydynTokens.spacing.xl,
	// maxWidth: opsydynTokens.layout.maxWidth.lg, // can be restored if needed
	margin: "0 auto",
	border: `2px dashed ${opsydynTokens.colors["accent-secondary"]}`,
	background: opsydynTokens.colors["node-gray"],
	padding: opsydynTokens.spacing["2xl"],

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			gridTemplateColumns: "repeat(2, 1fr)",
			gap: opsydynTokens.spacing["2xl"],
		},
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.lg})`]: {
			gridTemplateColumns: "repeat(4, 1fr)",
		},
	},
});

export const footerColumn = style({
	display: "flex",
	flexDirection: "column",
	gap: opsydynTokens.spacing.md,
});

export const footerColumnTitle = style({
	fontFamily: opsydynTokens.typography.fontFamily.display,
	fontSize: opsydynTokens.typography.fontSize.base,
	fontWeight: opsydynTokens.typography.fontWeight.semibold,
	color: opsydynTokens.colors["text-primary"],
	marginBottom: opsydynTokens.spacing.sm,
	selectors: {
		"html[data-theme='dark'] &": {
			color: opsydynTokens.colors.paper,
		},
	},
});

export const footerLinks = style({
	display: "flex",
	flexDirection: "column",
	gap: opsydynTokens.spacing.sm,

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			gap: opsydynTokens.spacing.md,
		},
	},
});

export const footerLink = style({
	fontSize: opsydynTokens.typography.fontSize.sm,
	color: opsydynTokens.colors["text-secondary"],
	textDecoration: "none",
	transition: opsydynTokens.transition.normal,

	":hover": {
		color: opsydynTokens.colors["accent-primary"],
	},

	selectors: {
		"html[data-theme='dark'] &:hover": {
			color: opsydynTokens.colors["accent-secondary"],
		},
	},
});

export const socialLinks = style({
	display: "flex",
	gap: opsydynTokens.spacing.md,
	marginTop: opsydynTokens.spacing.sm,
});

export const socialLink = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "2rem",
	height: "2rem",
	borderRadius: "50%",
	backgroundColor: opsydynTokens.colors["text-secondary"],
	color: opsydynTokens.colors["bg-primary"],
	transition: opsydynTokens.transition.normal,

	":hover": {
		backgroundColor: opsydynTokens.colors["accent-primary"],
	},

	selectors: {
		"html[data-theme='dark'] &:hover": {
			backgroundColor: opsydynTokens.colors["accent-secondary"],
		},
	},
});

export const footerCopyright = style({
	fontSize: opsydynTokens.typography.fontSize.xs,
	color: opsydynTokens.colors["text-secondary"],
	textAlign: "center",
	marginTop: opsydynTokens.spacing.xl,
});

// Back to top button
export const backToTop = style({
	position: "fixed",
	bottom: opsydynTokens.spacing.lg,
	right: opsydynTokens.spacing.lg,
	width: "3rem",
	height: "3rem",
	borderRadius: "50%",
	backgroundColor: opsydynTokens.colors["accent-primary"],
	color: opsydynTokens.colors["bg-primary"],
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	cursor: "pointer",
	boxShadow: opsydynTokens.shadows.medium,
	transition: opsydynTokens.transition.normal,
	opacity: 0,
	visibility: "hidden",
	zIndex: 100,
	border: "none",

	":hover": {
		backgroundColor: opsydynTokens.colors["accent-secondary"],
	},

	selectors: {
		"&.visible": {
			opacity: 1,
			visibility: "visible",
		},
		"html[data-theme='dark'] &": {
			backgroundColor: opsydynTokens.colors["accent-secondary"],
			color: "#F8F8F2",
		},
		"html[data-theme='dark'] &:hover": {
			backgroundColor: opsydynTokens.colors["accent-primary"],
		},
	},
});

// Architecture enhancements
export const architectureGrid = style({
	display: "grid",
	gridTemplateColumns: "1fr",
	gap: opsydynTokens.spacing.xl,
	maxWidth: opsydynTokens.layout.maxWidth.lg,
	margin: "0 auto",
	padding: `${opsydynTokens.spacing.xl} 0`,

	"@media": {
		[`screen and (min-width: ${opsydynTokens.layout.breakpoints.md})`]: {
			gridTemplateColumns: "repeat(2, 1fr)",
			gap: opsydynTokens.spacing["2xl"],
		},
	},
});

export const architectureCard = style({
	display: "flex",
	flexDirection: "column",
	gap: opsydynTokens.spacing.md,
	padding: opsydynTokens.spacing.xl,
	backgroundColor: opsydynTokens.colors["bg-primary"],
	border: `1px solid ${opsydynTokens.colors["border-subtle"]}`,
	borderRadius: opsydynTokens.borderRadius.lg,
	boxShadow: opsydynTokens.shadows.subtle,
	transition: opsydynTokens.transition.normal,

	":hover": {
		boxShadow: opsydynTokens.shadows.medium,
		borderColor: opsydynTokens.colors["accent-primary"],
	},

	selectors: {
		"html[data-theme='dark'] &:hover": {
			borderColor: opsydynTokens.colors["accent-secondary"],
		},
	},
});

export const architectureCardHeader = style({
	display: "flex",
	alignItems: "center",
	gap: opsydynTokens.spacing.md,
});

export const architectureIcon = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	width: "3rem",
	height: "3rem",
	borderRadius: opsydynTokens.borderRadius.md,
	backgroundColor: opsydynTokens.colors["accent-primary"],
	color: opsydynTokens.colors["bg-primary"],

	selectors: {
		"html[data-theme='dark'] &": {
			backgroundColor: opsydynTokens.colors["accent-secondary"],
		},
	},
});

export const architectureCardTitle = style({
	fontFamily: opsydynTokens.typography.fontFamily.display,
	fontSize: opsydynTokens.typography.fontSize.xl,
	fontWeight: opsydynTokens.typography.fontWeight.semibold,
	color: opsydynTokens.colors["text-primary"],
	margin: 0,
	selectors: {
		"html[data-theme='dark'] &": {
			color: opsydynTokens.colors.paper,
		},
	},
});

export const architectureCardDesc = style({
	fontSize: opsydynTokens.typography.fontSize.base,
	color: opsydynTokens.colors["text-secondary"],
	lineHeight: opsydynTokens.typography.lineHeight.relaxed,
	margin: 0,
});
