/**
 * EditionSwitcher Styles
 *
 * Functional composition for edition selector UI
 */

import { style } from "@vanilla-extract/css";
import { hardEdgeRadius } from "../../styles/theme.css";

export const container = style({
	width: "100%",
});

export const select = style({
	width: "100%",
	minHeight: "2.875rem",
	padding: "0.75rem 2.5rem 0.75rem 0.9rem",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.92rem",
	fontWeight: 700,
	border: "1px solid rgba(255, 255, 255, 0.14)",
	borderRadius: hardEdgeRadius,
	backgroundColor: "rgba(3, 7, 18, 0.78)",
	color: "rgba(255, 255, 255, 0.96)",
	cursor: "pointer",
	transition:
		"border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
	outline: "none",

	":hover": {
		borderColor: "rgba(255, 255, 255, 0.24)",
		backgroundColor: "rgba(3, 7, 18, 0.92)",
	},

	":focus": {
		borderColor: "rgba(125, 110, 238, 0.75)",
		boxShadow: "0 0 0 3px rgba(125, 110, 238, 0.18)",
	},

	backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.8)' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
	backgroundRepeat: "no-repeat",
	backgroundPosition: "right 0.9rem center",
	appearance: "none",
	selectors: {
		'[data-theme="light"] &': {
			border: "1px solid rgba(17, 24, 39, 0.12)",
			backgroundColor: "rgba(255, 255, 255, 0.92)",
			color: "#111827",
			backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(17,24,39,0.72)' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
		},
	},
});
