import { style } from "@vanilla-extract/css";
import { hardEdgeRadius } from "../styles/theme.css";

export const navIcon = style({
	width: "18px",
	height: "18px",
	filter: "brightness(0) invert(1)",
	flexShrink: 0,
});

export const navText = style({
	fontSize: "0.75rem",
	fontWeight: "600",
	letterSpacing: "0.5px",
	whiteSpace: "nowrap",
	color: "#ffffff",
});

export const cornerNavWrapper = style({
	position: "fixed",
	top: "146px",
	left: "4px",
	display: "flex",
	flexDirection: "column",
	gap: "8px",
	zIndex: 10,
	backgroundColor: "rgba(15, 15, 25, 0.95)",
	borderRadius: hardEdgeRadius,
	padding: "12px 10px",
	boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
	backdropFilter: "blur(12px)",
	border: "1px solid rgba(255, 255, 255, 0.15)",
});

export const cornerNavLink = style({
	padding: "6px 10px",
	borderRadius: hardEdgeRadius,
	color: "#ffffff",
	fontWeight: "600",
	textDecoration: "none",
	transition: "all 0.2s ease",
	display: "flex",
	alignItems: "center",
	gap: "6px",
	minWidth: "120px",
	height: "32px",
	fontSize: "0.7rem",
	textAlign: "left",
	":hover": {
		transform: "scale(1.02)",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
	},
});
