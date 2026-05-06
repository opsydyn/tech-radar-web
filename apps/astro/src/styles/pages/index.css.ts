import { style } from "@vanilla-extract/css";
import { vars } from "../cyberpunk.css";
import { hardEdgeRadius } from "../theme.css";

export const flexContainer = style({
	display: "flex",
	flexDirection: "column",
	width: "100%",
	maxWidth: "100%",
	gap: vars.space.medium,
	padding: vars.space.medium,
	overflow: "hidden",
	height: "calc(100vh - 60px)", // Account for top nav height
});

export const chartSection = style({
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	width: "100%",
	height: "100%",
	overflow: "hidden",
});

export const tableSection = style({
	width: "100%",
	maxWidth: vars.sizes.maxWidth,
	overflow: "auto",
});

// Style for the ADRs button
export const adrButton = style({
	position: "absolute",
	bottom: "20px",
	padding: "10px 25px",
	backgroundColor: "rgba(10,10,10,0.8)",
	color: "#58d3ff",
	fontWeight: "bold",
	fontSize: "1.2rem",
	textDecoration: "none",
	borderRadius: hardEdgeRadius,
	border: "2px solid #58d3ff",
	boxShadow: "0 0 15px rgba(88, 211, 255, 0.5)",
	transition: "all 0.3s ease",
	zIndex: 10,
	textTransform: "uppercase",
	letterSpacing: "2px",
	selectors: {
		"&:hover": {
			backgroundColor: "#58d3ff",
			color: "#000",
			boxShadow: "0 0 20px rgba(88, 211, 255, 0.8)",
			transform: "translateY(-2px)",
		},
	},
});
