import { globalStyle, style } from "@vanilla-extract/css";
import { darkThemeVars, lightThemeVars } from "../styles/theme.css";

export const root = style({
	color: lightThemeVars.color.text,
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${root}`, {
	color: darkThemeVars.color.text,
});

export const emptyState = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1rem",
	color: "#aaaaaa",
});

export const title = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.8rem",
	fontWeight: 700,
	color: lightThemeVars.color.text,
	marginBottom: "0.5rem",
	paddingBottom: "0.5rem",
	borderBottom: "3px solid var(--quadrant-color)",
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${title}`, {
	color: darkThemeVars.color.text,
});

export const description = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "1rem",
	color: "#000000",
	marginBottom: "1rem",
	paddingLeft: "0.5rem",
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${description}`, {
	color: "#e0e0e0",
});

export const meta = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.8rem",
	color: "#000000",
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${meta}`, {
	color: "#e0e0e0",
});

export const metaWithSpacing = style({
	marginBottom: "1.5rem",
});

export const card = style({
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.9rem",
	lineHeight: "1.5",
	color: "#000000",
	backgroundColor: "#f0f0f0",
	padding: "0.75rem",
	borderRadius: "4px",
	marginBottom: "1rem",
	borderLeft: "4px solid var(--quadrant-color)",
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${card}`, {
	color: "#e0e0e0",
	backgroundColor: "#333333",
});

export const movementSection = style({
	marginTop: "1.5rem",
	marginBottom: "1.5rem",
});

export const movementHeading = style({
	fontFamily: "'Space Grotesk', sans-serif",
	fontSize: "1.1rem",
	fontWeight: 600,
	color: lightThemeVars.color.text,
	backgroundColor: "#f0f0f0",
	padding: "0.5rem 0.75rem",
	borderRadius: "4px",
	marginBottom: "0.75rem",
	boxShadow: "2px 0 0 0 var(--quadrant-color-shadow)",
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${movementHeading}`, {
	color: darkThemeVars.color.text,
	backgroundColor: "#2a2a2a",
});

export const movementList = style({
	display: "flex",
	flexDirection: "column",
	gap: "0.5rem",
});

export const movementItem = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	backgroundColor: "#f0f0f0",
	padding: "0.5rem 0.75rem",
	borderRadius: "4px",
	marginBottom: "0.25rem",
	borderLeft: "4px solid var(--quadrant-color)",
	boxShadow: "2px 0 0 0 var(--quadrant-color-shadow)",
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${movementItem}`, {
	backgroundColor: "#333333",
});

export const movementType = style({
	fontWeight: "bold",
});

export const movementGo = style({
	color: "#8B0000",
});

export const movementGrow = style({
	color: "#006400",
});

export const movementStay = style({
	color: "#000080",
});

globalStyle(`html[data-theme="dark"] .${movementGo}`, {
	color: "#FF5252",
});

globalStyle(`html[data-theme="dark"] .${movementGrow}`, {
	color: "#4CAF50",
});

globalStyle(`html[data-theme="dark"] .${movementStay}`, {
	color: "#2196F3",
});

export const movementDate = style({
	color: "#000000",
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${movementDate}`, {
	color: "#e0e0e0",
});

export const detailsLink = style({
	display: "inline-block",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.85rem",
	fontWeight: 600,
	color: "#000000",
	textDecoration: "underline",
	marginTop: "1rem",
	transition: "none",
});

globalStyle(`html[data-theme="dark"] .${detailsLink}`, {
	color: "#a0d8ff",
});
