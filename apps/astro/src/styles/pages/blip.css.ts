import { createVar, globalStyle, style } from "@vanilla-extract/css";
import {
	typographyLevel1,
	typographyLevel2,
	typographyLevel3,
	typographyLevel4,
	typographyLevel5,
} from "../modular-scale.css";
import { darkThemeVars, hardEdgeRadius, lightThemeVars } from "../theme.css";
import {
	spacingLevel2,
	spacingLevel4,
	spacingLevel5,
} from "../vertical-rhythm.css";
import * as layers from "./blip-layers.css";

// Create CSS variables for dynamic quadrant colors
export const quadrantColor = createVar();
export const quadrantColorSolid = createVar();
export const quadrantColorDark = createVar();

export const twStyle = style(["text-[hsl(280,100%,70%)]"]);

// Base font sizes from modular scale
const fontSize2 = "1.25rem"; // MajorThird^1
const fontSize3 = "1.563rem"; // MajorThird^2
const fontSize4 = "1.953rem"; // MajorThird^3

// Vertical rhythm values
const rhythm1 = "1rem"; // Base rhythm
const rhythm2 = "1.5rem"; // 1.5x base
const rhythm3 = "2rem"; // 2x base
const rhythm4 = "3rem"; // 3x base
// --- TYPOGRAPHY SYSTEM ---
export const heading1 = style([
	typographyLevel1,
	{
		"@layer": {
			[layers.typography]: {
				fontFamily: "'Space Grotesk', sans-serif",
				fontWeight: "700",
				maxWidth: "90vw",
			},
		},
	},
]);

export const heading2 = style([
	typographyLevel2,
	{
		"@layer": {
			[layers.typography]: {
				fontFamily: "'Space Grotesk', sans-serif",
				fontWeight: "500",
				color: "var(--quadrant-color-solid)",
			},
		},
	},
]);

export const heading3 = style([
	typographyLevel3,
	{
		"@layer": {
			[layers.typography]: {
				fontFamily: "'Space Grotesk', sans-serif",
				fontWeight: "500",
				color: "var(--quadrant-color-solid)",
			},
		},
	},
]);

export const bodyText = style([
	typographyLevel4,
	{
		"@layer": {
			[layers.typography]: {
				fontFamily: "'IBM Plex Mono', monospace",
				color: "#ccc",
				maxWidth: "70ch",
			},
		},
	},
]);

export const metaText = style([
	typographyLevel5,
	{
		"@layer": {
			[layers.typography]: {
				fontFamily: "'IBM Plex Mono', monospace",
				fontWeight: "500",
				textTransform: "uppercase",
				letterSpacing: "0.05em",
				color: "#888",
			},
		},
	},
]);

// --- LAYOUT SYSTEM ---
export const container = style({
	"@layer": {
		[layers.layout]: {
			width: "100%",
			maxWidth: "1400px",
			minWidth: 0,
			boxSizing: "border-box",
			margin: "0 auto",
			padding: "0",
		},
	},
});

export const fullBleed = style({
	"@layer": {
		[layers.layout]: {
			width: "100vw",
			position: "relative",
			left: "50%",
			right: "50%",
			marginLeft: "-50vw",
			marginRight: "-50vw",
			backgroundColor: lightThemeVars.color.background,
			paddingTop: rhythm4,
			paddingBottom: rhythm4,
			transition: "background-color 0.3s ease",
		},
	},
});

// Dark theme styles for fullBleed
globalStyle(`html[data-theme="dark"] .${fullBleed}`, {
	backgroundColor: darkThemeVars.color.background,
});

// --- HERO SECTION ---
export const heroSection = style([
	{
		"@layer": {
			[layers.hero]: {
				background: "var(--quadrant-color-solid)",
				padding: "6rem 2rem 4rem",
				boxSizing: "border-box",
				width: "calc(100% - 4rem)",
				maxWidth: "100%",
			},
		},
		"@media": {
			"screen and (max-width: 768px)": {
				padding: "5rem 1rem 3rem",
				width: "calc(100% - 2rem)",
			},
		},
	},
]);

export const heroTitle = style([
	heading1,
	{
		"@layer": {
			[layers.hero]: {
				color: "#fff",
				textShadow: "0 2px 10px rgba(0,0,0,0.2)",
			},
		},
	},
]);

export const heroDate = style([
	metaText,
	{
		"@layer": {
			[layers.hero]: {
				color: "#fff",
				opacity: 0.9,
				marginTop: "1rem",
			},
		},
	},
]);

// --- NAVIGATION BAR ---
export const navContainer = style({
	"@layer": {
		[layers.navigation]: {
			width: "100%",
			position: "relative",
		},
	},
});

export const stickyNav = style({
	"@layer": {
		[layers.navigation]: {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			zIndex: 100,
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
		},
	},
});

export const navBar = style([
	{
		"@layer": {
			[layers.navigation]: {
				background: "#111",
				borderBottom: "1px solid #333",
				display: "flex",
				alignItems: "center",
				padding: "1rem 2rem",
				boxSizing: "border-box",
				gap: "2rem",
				width: "calc(100% - 4rem)",
				maxWidth: "100%",
				minWidth: 0,
			},
		},
		"@media": {
			"screen and (max-width: 768px)": {
				padding: "1rem",
				width: "calc(100% - 2rem)",
				flexWrap: "wrap",
				alignItems: "flex-start",
				gap: "1rem",
			},
		},
		selectors: {
			'html[data-theme="light"] &': {
				background: "rgba(255, 255, 255, 0.96)",
				borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
			},
			'html[data-theme="machine"] &': {
				borderBottom: "1px solid rgba(158, 255, 166, 0.16)",
			},
		},
	},
]);

export const navBack = style({
	"@layer": {
		[layers.navigation]: {
			color: "var(--quadrant-color-solid)",
			textDecoration: "none",
			fontWeight: "bold",
			fontFamily: "'IBM Plex Mono', monospace",
			fontSize: "1.1rem",
			transition: "color 0.2s",
			selectors: {
				"&:hover": { color: "#fff", textDecoration: "underline" },
				'html[data-theme="light"] &:hover': {
					color: "rgba(17, 24, 39, 0.92)",
					textDecoration: "underline",
				},
			},
		},
	},
});

export const navTabs = style({
	"@layer": {
		[layers.navigation]: {
			display: "flex",
			gap: "1.5rem",
			minWidth: 0,
			flexWrap: "wrap",
		},
	},
});

export const navTab = style({
	"@layer": {
		[layers.navigation]: {
			color: "#888",
			textDecoration: "none",
			fontFamily: "'IBM Plex Mono', monospace",
			fontSize: "0.9rem",
			fontWeight: 500,
			padding: "0.25rem 0.5rem",
			borderRadius: hardEdgeRadius,
			transition: "background 0.18s, color 0.18s",
			selectors: {
				'html[data-theme="light"] &': {
					color: "rgba(17, 24, 39, 0.56)",
				},
				"&:hover": {
					color: "#fff",
					background: "#333",
					textDecoration: "none",
				},
				'html[data-theme="light"] &:hover': {
					color: "rgba(17, 24, 39, 0.92)",
					background: "rgba(0, 0, 0, 0.06)",
					textDecoration: "none",
				},
				"&:active": {
					background: "var(--quadrant-color-solid)",
					color: "#fff",
				},
			},
		},
	},
});

// --- FLOATING NAVIGATION ---
export const floatingNav = style({
	position: "fixed",
	right: "2rem",
	top: "50%",
	transform: "translateY(-50%)",
	display: "flex",
	flexDirection: "column",
	gap: "1.5rem",
	zIndex: 100,
	opacity: 0,
	visibility: "hidden",
	transition: "opacity 0.3s ease, visibility 0.3s ease",
	selectors: {
		"&.visible": {
			opacity: 1,
			visibility: "visible",
		},
	},
});

export const floatingNavItem = style({
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	textDecoration: "none",
	padding: "0.5rem",
	transition: "all 0.2s ease",
	selectors: {
		"&:hover": {
			transform: "scale(1.2)",
		},
		"&:hover::before": {
			content: "attr(data-label)",
			position: "absolute",
			right: "2rem",
			background: "#111",
			color: "#fff",
			padding: "0.25rem 0.5rem",
			borderRadius: hardEdgeRadius,
			fontSize: "0.8rem",
			whiteSpace: "nowrap",
		},
		'html[data-theme="light"] &:hover::before': {
			background: "rgba(255, 255, 255, 0.98)",
			color: "rgba(17, 24, 39, 0.92)",
			boxShadow: "0 8px 20px rgba(15, 23, 42, 0.12)",
			border: "1px solid rgba(17, 24, 39, 0.1)",
		},
		"&.active": {
			transform: "scale(1.2)",
		},
	},
});

export const floatingNavDot = style({
	width: "12px",
	height: "12px",
	borderRadius: hardEdgeRadius,
	background: "#555",
	transition: "all 0.2s ease",
	border: "2px solid #333",
	selectors: {
		[`${floatingNavItem}.active &`]: {
			background: "var(--quadrant-color-solid)",
			transform: "scale(1.2)",
		},
	},
});

// --- DETAILS SECTION ---
export const detailsSection = style({
	padding: "4rem 2rem",
	boxSizing: "border-box",
	maxWidth: "calc(1000px - 4rem)",
	margin: "0 auto",
	width: "calc(100% - 4rem)",
	minWidth: 0,
	"@media": {
		"screen and (max-width: 768px)": {
			padding: "2.5rem 1rem",
			width: "calc(100% - 2rem)",
			maxWidth: "calc(100% - 2rem)",
		},
	},
});

export const detailsMeta = style({
	display: "flex",
	alignItems: "center",
	gap: "1.5rem",
	minWidth: 0,
	flexWrap: "wrap",
	marginBottom: "3rem",
});

export const detailsDate = style([
	metaText,
	{
		background: "#222",
		padding: "0.6rem 1rem",
		borderRadius: hardEdgeRadius,
		border: "1px solid #333",
		selectors: {
			'html[data-theme="light"] &': {
				background: "rgba(17, 24, 39, 0.06)",
				border: "1px solid rgba(17, 24, 39, 0.12)",
				color: "rgba(17, 24, 39, 0.72)",
			},
		},
	},
]);

export const detailsRing = style([
	heading3,
	{
		color: "var(--quadrant-color-solid)",
		margin: 0,
		position: "relative",
		display: "inline-flex",
		alignItems: "center",
	},
]);

export const detailsContent = style({
	backgroundColor: lightThemeVars.color.background,
	padding: "1.5rem",
	boxSizing: "border-box",
	width: "100%",
	maxWidth: "100%",
	minWidth: 0,
	borderRadius: hardEdgeRadius,
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
	marginBottom: rhythm3,
	transition: "background-color 0.3s ease, box-shadow 0.3s ease",
});

// Dark theme styles for details content
globalStyle(`html[data-theme="dark"] .${detailsContent}`, {
	backgroundColor: "#333333",
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
});

export const detailsDescription = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.95rem",
	lineHeight: "1.6",
	color: "#555",
	marginBottom: rhythm2,
	transition: "color 0.3s ease",
});

// Dark theme styles for details description
globalStyle(`html[data-theme="dark"] .${detailsDescription}`, {
	color: "#e0e0e0",
});

export const detailsLongText = style([
	bodyText,
	{
		color: "#aaa",
	},
]);

// --- RELATED BLIPS SECTION ---
export const relatedBlipsSection = style({
	"@layer": {
		[layers.relatedBlips]: {
			background: "#111",
			padding: "4rem 2rem",
			boxSizing: "border-box",
			width: "calc(100% - 4rem)",
			maxWidth: "100%",
			color: "var(--quadrant-color-solid)",
		},
	},
	"@media": {
		"screen and (max-width: 768px)": {
			padding: "2.5rem 1rem",
			width: "calc(100% - 2rem)",
		},
	},
	selectors: {
		'html[data-theme="light"] &': {
			background: "rgba(17, 24, 39, 0.04)",
			color: lightThemeVars.color.text,
		},
	},
});

export const relatedBlipsTitle = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: fontSize4,
	fontWeight: 700,
	textAlign: "center",
	marginBottom: rhythm3,
	color: lightThemeVars.color.text,
	transition: "color 0.3s ease",
});

// Dark theme styles for related blips title
globalStyle(`html[data-theme="dark"] .${relatedBlipsTitle}`, {
	color: darkThemeVars.color.text,
});

export const relatedBlipsGrid = style([
	spacingLevel4,
	{
		display: "grid",
		gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
		marginTop: "2rem",
	},
]);

export const relatedBlipCard = style([
	spacingLevel2,
	{
		background: "#333333",
		borderRadius: hardEdgeRadius,
		padding: "1.5rem",
		border: "1px solid #444444",
		transition: "transform 0.2s, border-color 0.2s, background-color 0.3s ease",
		selectors: {
			"&:hover": {
				transform: "translateY(-4px)",
				borderColor: "var(--quadrant-color-solid)",
				textDecoration: "none",
			},
			'html[data-theme="light"] &': {
				background: "rgba(255, 255, 255, 0.96)",
				border: "1px solid rgba(17, 24, 39, 0.12)",
				boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
			},
		},
		textDecoration: "none",
		display: "flex",
		flexDirection: "column",
		height: "100%",
	},
]);

export const relatedBlipTitleWrapper = style({
	flex: "1 1 auto",
	display: "flex",
	alignItems: "flex-start",
});

export const relatedBlipTitle = style([
	typographyLevel4,
	{
		fontFamily: "'Space Grotesk', sans-serif",
		fontWeight: "500",
		color: "#fff",
		margin: "0 0 0.5rem 0",
		selectors: {
			'html[data-theme="light"] &': {
				color: "rgba(17, 24, 39, 0.96)",
			},
		},
	},
]);

export const relatedBlipMeta = style([
	metaText,
	{
		display: "block",
		marginBottom: "0.5rem",
	},
]);

export const relatedBlipMetaUnderlined = style([
	metaText,
	{
		display: "inline-block",
		marginBottom: "0.5rem",
		borderBottom: "2px solid var(--quadrant-color-solid)",
		textDecoration: "none",
		textDecorationSkipInk: "auto",
		paddingBottom: "2px",
		marginTop: "auto",
		selectors: {
			'html[data-theme="light"] &': {
				color: "rgba(17, 24, 39, 0.62)",
			},
		},
	},
]);

export const relatedBlipsIntro = style({
	textAlign: "center",
	margin: "0 auto 3rem",
	maxWidth: "600px",
	color: "#ccc",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.9rem",
	lineHeight: 1.6,
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(17, 24, 39, 0.68)",
		},
	},
});

export const relatedBlipsIntroStrong = style({
	color: "#fff",
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(17, 24, 39, 0.94)",
		},
	},
});

export const relatedBlipContext = style({
	marginTop: "0.75rem",
	fontSize: "0.8rem",
	color: "#aaa",
	lineHeight: 1.4,
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(17, 24, 39, 0.66)",
		},
	},
});

export const relatedBlipContextItem = style({
	selectors: {
		"&:not(:last-child)": {
			marginBottom: "0.5rem",
		},
	},
});

export const relatedBlipsEmptyState = style({
	textAlign: "center",
	padding: "4rem 2rem",
	color: "#666",
	fontFamily: "'IBM Plex Mono', monospace",
	selectors: {
		'html[data-theme="light"] &': {
			color: "rgba(17, 24, 39, 0.58)",
		},
	},
});

// --- HISTORY SECTION ---
export const sectionTitle = style({
	fontFamily: "Space Grotesk, sans-serif",
	fontSize: fontSize3,
	fontWeight: 700,
	marginBottom: rhythm2,
	color: lightThemeVars.color.text,
	transition: "color 0.3s ease",
});

// Dark theme styles for section title
globalStyle(`html[data-theme="dark"] .${sectionTitle}`, {
	color: darkThemeVars.color.text,
});

export const historyChart = style({
	marginTop: rhythm2,
	marginBottom: rhythm4,
	width: "100%",
	height: "auto",
	borderRadius: hardEdgeRadius,
	overflow: "hidden",
});

// --- ADR SECTION ---
const adrSectionBase = style({
	marginTop: rhythm3,
	marginBottom: rhythm3,
	padding: rhythm2,
});

export const adrSection = style([
	adrSectionBase,
	{
		"@layer": {
			[layers.adr]: {
				borderLeft: "4px solid #4CAF50",
				backgroundColor: "rgba(76, 175, 80, 0.07)",
				transition: "background-color 0.3s ease",
			},
		},
	},
]);

// Dark theme styles for ADR section
globalStyle(`html[data-theme="dark"] .${adrSection}`, {
	backgroundColor: "rgba(76, 175, 80, 0.15)",
});

export const adrSectionNoAdr = style([
	adrSectionBase,
	{
		"@layer": {
			[layers.adr]: {
				borderLeft: "4px solid #e91e63",
				backgroundColor: "rgba(233, 30, 99, 0.05)",
				transition: "background-color 0.3s ease",
			},
		},
	},
]);

// Dark theme styles for ADR section with no ADR
globalStyle(`html[data-theme="dark"] .${adrSectionNoAdr}`, {
	backgroundColor: "rgba(233, 30, 99, 0.15)",
});

export const adrTitle = style({
	fontFamily: "Space Grotesk, sans-serif",
	fontSize: fontSize2,
	fontWeight: 700,
	marginBottom: rhythm1,
	color: lightThemeVars.color.text,
	transition: "color 0.3s ease",
});

// Dark theme styles for ADR title
globalStyle(`html[data-theme="dark"] .${adrTitle}`, {
	color: darkThemeVars.color.text,
});

export const adrMetaGrid = style({
	display: "grid",
	gap: rhythm1,
	marginBottom: rhythm2,
});

export const adrMetaItem = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.95rem",
	lineHeight: "1.7",
	color: lightThemeVars.color.text,
	margin: 0,
	transition: "color 0.3s ease",
});

globalStyle(`html[data-theme="dark"] .${adrMetaItem}`, {
	color: darkThemeVars.color.text,
});

export const adrMetaLabel = style({
	fontWeight: 700,
	color: "var(--quadrant-color-solid)",
});

export const adrStatusBadge = style({
	display: "inline-flex",
	alignItems: "center",
	padding: "0.2rem 0.5rem",
	borderRadius: hardEdgeRadius,
	border: "1px solid var(--quadrant-color-solid)",
	color: "var(--quadrant-color-solid)",
	fontSize: "0.85rem",
	fontWeight: 700,
	textTransform: "uppercase",
	letterSpacing: "0.04em",
	backgroundColor: "rgba(255, 255, 255, 0.02)",
	selectors: {
		'html[data-theme="light"] &': {
			backgroundColor: "rgba(99, 102, 241, 0.08)",
		},
	},
});

export const markdownContent = style({
	display: "grid",
	gap: rhythm2,
	color: lightThemeVars.color.text,
	transition: "color 0.3s ease",
});

globalStyle(`html[data-theme="dark"] .${markdownContent}`, {
	color: darkThemeVars.color.text,
});

globalStyle(`.${markdownContent} > :first-child`, {
	marginTop: 0,
});

globalStyle(`.${markdownContent} h2`, {
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: fontSize3,
	fontWeight: 700,
	margin: `${rhythm2} 0 ${rhythm1}`,
	color: "var(--quadrant-color-solid)",
});

globalStyle(`.${markdownContent} h3`, {
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: fontSize2,
	fontWeight: 700,
	margin: `${rhythm2} 0 ${rhythm1}`,
	color: lightThemeVars.color.text,
});

globalStyle(`html[data-theme="dark"] .${markdownContent} h3`, {
	color: darkThemeVars.color.text,
});

globalStyle(`.${markdownContent} p`, {
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.98rem",
	lineHeight: "1.8",
	margin: 0,
	maxWidth: "72ch",
});

globalStyle(`.${markdownContent} ul, .${markdownContent} ol`, {
	margin: 0,
	paddingLeft: "1.5rem",
	maxWidth: "72ch",
	fontFamily: "'IBM Plex Mono', monospace",
	lineHeight: "1.8",
});

globalStyle(`.${markdownContent} li + li`, {
	marginTop: "0.35rem",
});

globalStyle(`.${markdownContent} code`, {
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.9em",
	padding: "0.1rem 0.35rem",
	borderRadius: hardEdgeRadius,
	backgroundColor: "rgba(255, 255, 255, 0.06)",
});

globalStyle(`html[data-theme="light"] .${markdownContent} code`, {
	backgroundColor: "rgba(17, 24, 39, 0.08)",
	color: "rgba(17, 24, 39, 0.9)",
	border: "1px solid rgba(17, 24, 39, 0.08)",
});

globalStyle(`html[data-theme="dark"] .${markdownContent} code`, {
	backgroundColor: "rgba(255, 255, 255, 0.06)",
	color: "rgba(255, 255, 255, 0.92)",
});

// --- ADR LINK ---
export const adrLink = style([
	spacingLevel2,
	{
		display: "inline-block",
		textDecoration: "none",
		padding: "0.75rem 1.5rem",
		background: "#222",
		color: "#fff",
		fontFamily: "'IBM Plex Mono', monospace",
		fontSize: "0.9rem",
		fontWeight: "500",
		borderLeft: "4px solid var(--quadrant-color-solid)",
		transition: "all 0.2s ease",
		selectors: {
			"&:hover": {
				background: "#333",
				borderColor: "var(--quadrant-color-solid)",
				transform: "translateX(4px)",
			},
			'html[data-theme="light"] &': {
				background: "rgba(17, 24, 39, 0.06)",
				color: "rgba(17, 24, 39, 0.88)",
			},
			'html[data-theme="light"] &:hover': {
				background: "rgba(17, 24, 39, 0.1)",
				borderColor: "var(--quadrant-color-solid)",
				transform: "translateX(4px)",
			},
		},
	},
]);

export const adrPending = style([
	spacingLevel5,
	{
		display: "inline-block",
		marginTop: "2rem",
		padding: "0.75rem 1.5rem",
		background: "#222",
		color: "#fff",
		fontFamily: "'IBM Plex Mono', monospace",
		fontSize: "0.9rem",
		fontWeight: "500",
		textDecoration: "none",
		borderLeft: "4px solid var(--quadrant-color-solid)",
		cursor: "not-allowed",
		selectors: {
			'html[data-theme="light"] &': {
				background: "rgba(17, 24, 39, 0.06)",
				color: "rgba(17, 24, 39, 0.88)",
				borderTop: "1px solid rgba(17, 24, 39, 0.08)",
				borderRight: "1px solid rgba(17, 24, 39, 0.08)",
				borderBottom: "1px solid rgba(17, 24, 39, 0.08)",
			},
		},
	},
]);

export const tableMono = style({
	fontFamily: "'IBM Plex Mono', monospace",
});

export const monoText = style({
	fontFamily: "'IBM Plex Mono', monospace",
});
