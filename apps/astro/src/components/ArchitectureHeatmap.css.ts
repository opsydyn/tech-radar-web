import { style } from "@vanilla-extract/css";

export const tooltipClass = style({
	position: "absolute",
	padding: "0.5rem",
	borderRadius: "4px",
	fontSize: "0.875rem",
	pointerEvents: "none",
	zIndex: 1000,
	backgroundColor: "rgba(0, 0, 0, 0.8)",
	color: "#ffffff",
	boxShadow:
		"0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
});

export const container = style({
	position: "relative",
});

export const legend = style({
	marginTop: "1rem",
	fontSize: "0.875rem",
});

export const metricsContainer = style({
	display: "flex",
	gap: "1rem",
	marginTop: "0.5rem",
});
