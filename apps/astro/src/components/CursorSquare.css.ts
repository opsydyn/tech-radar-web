import { createVar, keyframes, style } from "@vanilla-extract/css";

export const cursorColor = createVar();
export const cursorSize = createVar();

const blinkAnimation = keyframes({
	"0%, 49%": { opacity: 1 },
	"50%, 100%": { opacity: 0 },
});

export const cursorSquare = style({
	width: cursorSize,
	height: cursorSize,
	backgroundColor: cursorColor,
	opacity: 0,
	transform: "translateX(1ch)",
	display: "inline-block",
	vars: {
		[cursorColor]: "currentColor",
		[cursorSize]: "2rem",
	},
});
export const cursorActive = style({
	animation: `${blinkAnimation} 1.2s infinite`,
	opacity: 1,
});
