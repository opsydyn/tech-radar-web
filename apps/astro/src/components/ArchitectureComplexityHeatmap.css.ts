import { style } from "@vanilla-extract/css";

export const moduleHoverClass = style({
	":hover": {
		transform: "scale(1.1)",
	},
});
