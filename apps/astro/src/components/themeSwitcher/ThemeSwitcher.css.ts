// ThemeSwitcherStyles.css.ts
import { style } from "@vanilla-extract/css";

const breakpoint = "768px";

export const themeButtons = style({
	position: "static",
	display: "flex",
	gap: "0.8rem",
	padding: "0.6rem 0.5rem",
	alignItems: "center",
	background: "rgba(30, 30, 30, 0.85)",
	borderRadius: "8px",
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
	border: "1px solid rgba(100, 100, 255, 0.2)",
	zIndex: 200,
});

export const themeBtn = style({
	background: "none",
	border: "none",
	cursor: "pointer",
	padding: "0.2rem",
	borderRadius: "0.4rem",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "background 0.2s",
	":hover": {
		background: "rgba(255,255,255,0.08)",
	},
	":focus": {
		outline: "2px solid #05d9e8",
	},
});

export const themeIcon = style({
	width: "22px",
	height: "22px",
	fill: "#fff",
	stroke: "#fff",
	display: "block",
	pointerEvents: "none",
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
