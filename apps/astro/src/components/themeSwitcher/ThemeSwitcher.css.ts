// ThemeSwitcherStyles.css.ts
import { style } from "@vanilla-extract/css";
import { hardEdgeRadius } from "../../styles/theme.css";

const breakpoint = "768px";

export const themeButtons = style({
	position: "static",
	zIndex: 200,
	display: "flex",
	alignItems: "center",
	gap: "0.8rem",
	backdropFilter: "blur(10px)",
	border: "1px solid rgba(100, 100, 255, 0.2)",
	borderRadius: hardEdgeRadius,
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
	background: "rgba(30, 30, 30, 0.85)",
	padding: "0.6rem 0.5rem",
	selectors: {
		'[data-theme="light"] &': {
			border: "1px solid rgba(0, 0, 0, 0.12)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
			background: "rgba(255, 255, 255, 0.92)",
		},
		'[data-theme="machine"] &': {
			border: "1px solid rgba(158, 255, 166, 0.22)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.28)",
			background: "rgba(14, 17, 24, 0.92)",
		},
	},
	"@media": {
		[`(max-width: ${breakpoint})`]: {
			marginLeft: "auto",
		},
	},
});

export const themeBtn = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "background 0.2s",
	border: "none",
	borderRadius: hardEdgeRadius,
	background: "none",
	cursor: "pointer",
	padding: "0.2rem",
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
	display: "block",
	pointerEvents: "none",
	width: "22px",
	height: "22px",
	fill: "#fff",
	stroke: "#fff",
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
	zIndex: 200,
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	justifyContent: "center",
	padding: "0",
	minWidth: 0,
	"@media": {
		[`(max-width: ${breakpoint})`]: {
			justifyContent: "flex-end",
			width: "100%",
		},
	},
});
