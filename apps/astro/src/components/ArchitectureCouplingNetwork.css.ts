import { style } from "@vanilla-extract/css";

export const nodeHoverClass = style({
	":hover": {
		filter: "brightness(1.2)",
	},
});

export const linkHoverClass = style({
	":hover": {
		strokeWidth: "3px",
		filter: "brightness(1.2)",
	},
});
