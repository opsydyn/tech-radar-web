import { style, createVar, globalStyle } from "@vanilla-extract/css";
import { colors, darkThemeVars, lightThemeVars } from "../styles/theme.css";

// Create CSS variables for dynamic quadrant colors
export const quadrantColor = createVar();
export const quadrantColorSolid = createVar();
export const quadrantColorDark = createVar();

// Container styles
export const container = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "80vh",
  width: "100%",
  backgroundColor: lightThemeVars.color.background,
  color: lightThemeVars.color.text,
  vars: {
    [quadrantColor]: "inherit",
    [quadrantColorSolid]: "inherit",
    [quadrantColorDark]: "inherit"
  },
  transition: "background-color 0.3s ease, color 0.3s ease"
});

// Dark theme styles for container
globalStyle(`html[data-theme="dark"] .${container}`, {
  backgroundColor: darkThemeVars.color.background,
  color: darkThemeVars.color.text
});

// Header container styles
export const headerContainer = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  margin: "1rem 2rem 1.5rem 2rem",
  position: "relative"
});

// Main heading styles
export const mainHeading = style({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "3rem",
  fontWeight: 700,
  color: lightThemeVars.color.text,
  paddingBottom: "0.5rem",
  borderBottom: `4px solid ${quadrantColor}`,
  display: "inline-block",
  margin: 0,
  transition: "color 0.3s ease"
});

// Dark theme styles for main heading
globalStyle(`html[data-theme="dark"] .${mainHeading}`, {
  color: darkThemeVars.color.text
});

// Search container styles
export const searchContainer = style({
  display: "flex",
  flexDirection: "column",
  marginBottom: "0.5rem"
});

// Search footer styles
export const searchFooter = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginTop: "0.25rem",
  minHeight: "1.5rem"
});

// Search input styles
export const searchInput = style({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.9rem",
  padding: "0.5rem 0.75rem",
  border: `2px solid ${quadrantColor}40`,
  borderRadius: "4px",
  backgroundColor: "#f0f0f0",
  color: "#333",
  width: "200px",
  transition: "all 0.2s ease",
  ':focus': {
    outline: "none",
    borderColor: quadrantColor,
    boxShadow: `0 0 0 2px ${quadrantColor}20`
  }
});

// Dark theme styles for search input
globalStyle(`html[data-theme="dark"] .${searchInput}`, {
  backgroundColor: "#333",
  color: "#f0f0f0",
  border: `2px solid ${quadrantColor}70`
});

// Search clear button styles
export const searchClearButton = style({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.8rem",
  marginLeft: "0.5rem",
  padding: "0.25rem 0.5rem",
  backgroundColor: "transparent",
  border: "none",
  color: quadrantColor,
  cursor: "pointer",
  ':hover': {
    textDecoration: "underline"
  }
});

// Search results count styles
export const searchResultsCount = style({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.75rem",
  color: lightThemeVars.color.secondary,
  marginLeft: "0.5rem",
  transition: "color 0.3s ease"
});

// Dark theme styles for search results count
globalStyle(`html[data-theme="dark"] .${searchResultsCount}`, {
  color: darkThemeVars.color.secondary
});

// Home link styles
export const homeLink = style({
  position: "absolute",
  top: "1rem",
  left: "2rem",
  color: lightThemeVars.color.text,
  fontWeight: "bold",
  textDecoration: "none",
  fontSize: "1.1rem",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  transition: "color 0.3s ease"
});

// Dark theme styles for home link
globalStyle(`html[data-theme="dark"] .${homeLink}`, {
  color: darkThemeVars.color.text
});

// Arrow icon styles
export const arrowIcon = style({
  color: quadrantColor
});

// Content container styles
export const contentContainer = style({
  display: "flex",
  flex: 1
});

// Scroll panel styles
export const scrollPanel = style({
  flex: "0 0 38.2%",
  borderRight: `1px solid ${quadrantColor}`,
  padding: "2rem",
  height: "calc(80vh - 5rem)",
  overflowY: "auto",
  overflowX: "hidden",
  backgroundColor: lightThemeVars.color.background,
  transition: "background-color 0.3s ease",
  selectors: {
    '&::-webkit-scrollbar': {
      width: '8px',
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      background: `color-mix(in srgb, ${quadrantColor} 18%, transparent)`,
      borderRadius: '6px',
      transition: 'background 0.2s',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: `color-mix(in srgb, ${quadrantColor} 35%, transparent)`,
    },
  },
});

// Dark theme styles for scroll panel
globalStyle(`html[data-theme="dark"] .${scrollPanel}`, {
  backgroundColor: darkThemeVars.color.background,
  borderRight: `1px solid ${quadrantColor}80`
});

export const scrollPanelFirefox = style({
  scrollbarWidth: "thin",
  scrollbarColor: `color-mix(in srgb, ${quadrantColor} 18%, transparent) transparent`,
});

// Blip count styles
export const blipCount = style({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.8rem",
  color: lightThemeVars.color.secondary,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "1.5rem",
  transition: "color 0.3s ease"
});

// Dark theme styles for blip count
globalStyle(`html[data-theme="dark"] .${blipCount}`, {
  color: darkThemeVars.color.secondary
});

// Blip item styles
export const blipItem = style({
  cursor: "pointer",
  marginBottom: "1.5rem",
  fontWeight: 400,
  transition: "all 0.2s ease-in-out"
});

// Selected blip item styles
export const selectedBlipItem = style({
  fontWeight: 700,
  borderLeft: `3px solid ${quadrantColor}`,
  paddingLeft: "0.5rem"
});

// Blip name styles
export const blipName = style({
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "1.2rem",
  fontWeight: 500,
  margin: 0,
  color: lightThemeVars.color.text,
  transition: "color 0.3s ease"
});

// Dark theme styles for blip name
globalStyle(`html[data-theme="dark"] .${blipName}`, {
  color: darkThemeVars.color.text
});

// Blip ring styles
export const blipRing = style({
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.75rem",
  color: lightThemeVars.color.secondary,
  marginTop: "0.25rem",
  transition: "color 0.3s ease"
});

// Dark theme styles for blip ring
globalStyle(`html[data-theme="dark"] .${blipRing}`, {
  color: darkThemeVars.color.secondary
});

// Detail panel styles
export const detailPanel = style({
  flex: 1,
  padding: "2rem",
  backgroundColor: lightThemeVars.color.background,
  transition: "background-color 0.3s ease"
});

// Dark theme styles for detail panel
globalStyle(`html[data-theme="dark"] .${detailPanel}`, {
  backgroundColor: darkThemeVars.color.background
});
