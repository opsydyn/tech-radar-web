import { createVar, globalStyle, style } from "@vanilla-extract/css";
import {
	typographyLevel1,
	typographyLevel2,
	typographyLevel3,
	typographyLevel4,
	typographyLevel5,
} from "../modular-scale.css";
import { darkThemeVars, lightThemeVars } from "../theme.css";
import {
	spacingLevel2,
	spacingLevel3,
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
	spacingLevel2,
	{
		"@layer": {
			[layers.hero]: {
				background: "var(--quadrant-color-solid)",
				padding: "6rem 2rem 4rem",
				width: "100%",
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
	spacingLevel5,
	{
		"@layer": {
			[layers.navigation]: {
				background: "#111",
				borderBottom: "1px solid #333",
				display: "flex",
				alignItems: "center",
				padding: "1rem 2rem",
				gap: "2rem",
				width: "100%",
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
			},
		},
	},
});

export const navTabs = style({
	"@layer": {
		[layers.navigation]: {
			display: "flex",
			gap: "1.5rem",
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
			borderRadius: "4px",
			transition: "background 0.18s, color 0.18s",
			selectors: {
				"&:hover": {
					color: "#fff",
					background: "#333",
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
			borderRadius: "4px",
			fontSize: "0.8rem",
			whiteSpace: "nowrap",
		},
		"&.active": {
			transform: "scale(1.2)",
		},
	},
});

export const floatingNavDot = style({
	width: "12px",
	height: "12px",
	borderRadius: "50%",
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
export const detailsSection = style([
	spacingLevel3,
	{
		padding: "4rem 2rem",
		maxWidth: "1000px",
		margin: "0 auto",
		width: "100%",
	},
]);

export const detailsMeta = style([
	spacingLevel5,
	{
		display: "flex",
		alignItems: "center",
		gap: "1.5rem",
		marginBottom: "3rem",
	},
]);

export const detailsDate = style([
	metaText,
	{
		background: "#222",
		padding: "0.6rem 1rem",
		borderRadius: "4px",
		border: "1px solid #333",
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
	borderRadius: "8px",
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
export const relatedBlipsSection = style([
	spacingLevel2,
	{
		"@layer": {
			[layers.relatedBlips]: {
				background: "#111",
				padding: "4rem 2rem",
				width: "100%",
				color: "var(--quadrant-color-solid)",
			},
		},
	},
]);

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
		borderRadius: "8px",
		padding: "1.5rem",
		border: "1px solid #444444",
		transition: "transform 0.2s, border-color 0.2s, background-color 0.3s ease",
		selectors: {
			"&:hover": {
				transform: "translateY(-4px)",
				borderColor: "var(--quadrant-color-solid)",
				textDecoration: "none",
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
	},
]);

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
	borderRadius: "8px",
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
	borderRadius: "999px",
	border: "1px solid var(--quadrant-color-solid)",
	color: "var(--quadrant-color-solid)",
	fontSize: "0.85rem",
	fontWeight: 700,
	textTransform: "uppercase",
	letterSpacing: "0.04em",
	backgroundColor: "rgba(255, 255, 255, 0.02)",
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
	borderRadius: "4px",
	backgroundColor: "rgba(255, 255, 255, 0.06)",
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
	},
]);

export const tableMono = style({
	fontFamily: "'IBM Plex Mono', monospace",
});

export const monoText = style({
	fontFamily: "'IBM Plex Mono', monospace",
});
