// ThemeSwitcherStyles.css.ts
import { style } from "@vanilla-extract/css";
import { hardEdgeRadius } from "../../styles/theme.css";

const breakpoint = "768px";

export const themeButtons = style({
	position: "static",
	display: "flex",
	gap: "0.8rem",
	padding: "0.6rem 0.5rem",
	alignItems: "center",
	background: "rgba(30, 30, 30, 0.85)",
	borderRadius: hardEdgeRadius,
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
	border: "1px solid rgba(100, 100, 255, 0.2)",
	backdropFilter: "blur(10px)",
	zIndex: 200,
	selectors: {
		'[data-theme="light"] &': {
			background: "rgba(255, 255, 255, 0.92)",
			border: "1px solid rgba(0, 0, 0, 0.12)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
		},
		'[data-theme="machine"] &': {
			background: "rgba(14, 17, 24, 0.92)",
			border: "1px solid rgba(158, 255, 166, 0.22)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.28)",
		},
	},
});

export const themeBtn = style({
	background: "none",
	border: "none",
	cursor: "pointer",
	padding: "0.2rem",
	borderRadius: hardEdgeRadius,
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "background 0.2s",
	selectors: {
		"&:hover": {
			background: "rgba(255,255,255,0.08)",
		},
		"&:focus": {
			outline: "none",
		},
		"&:focus-visible": {
			outline: "1px solid rgba(255, 255, 255, 0.22)",
			outlineOffset: "1px",
		},
		'[data-theme="light"] &:hover': {
			background: "rgba(0, 0, 0, 0.06)",
		},
		'[data-theme="light"] &:focus-visible': {
			outline: "1px solid rgba(0, 0, 0, 0.22)",
			outlineOffset: "1px",
		},
		'[data-theme="machine"] &:hover': {
			background: "rgba(158, 255, 166, 0.1)",
		},
		'[data-theme="machine"] &:focus-visible': {
			outline: "1px solid rgba(158, 255, 166, 0.28)",
			outlineOffset: "1px",
		},
	},
});

export const themeIcon = style({
	width: "22px",
	height: "22px",
	fill: "#fff",
	stroke: "#fff",
	display: "block",
	pointerEvents: "none",
	selectors: {
		'[data-theme="light"] &': {
			fill: "rgba(0, 0, 0, 0.78)",
			stroke: "rgba(0, 0, 0, 0.78)",
		},
		'[data-theme="machine"] &': {
			fill: "#9effa6",
			stroke: "#9effa6",
		},
	},
});

export const desktopSwitchers = style({
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "center",
	padding: "0",
	zIndex: 200,
	"@media": {
		[`(max-width: ${breakpoint})`]: {
			display: "none",
		},
	},
});
