import { style } from "@vanilla-extract/css";

export const breakpoints = {
	small: "600px",
	medium: "800px",
	large: "1200px",
};

export const media = {
	small: `screen and (max-width: ${breakpoints.small})`,
	medium: `screen and (max-width: ${breakpoints.medium})`,
	large: `screen and (max-width: ${breakpoints.large})`,
};

export const flexRowWrapAlignCenter = style({
	display: "flex",
	flexDirection: "row",
	flexWrap: "wrap",
	alignItems: "center",
});

export const tableControls = style([
	flexRowWrapAlignCenter,
	{
		gap: "10px",
		padding: "10px",
		border: "1px solid #ccc",
		borderRadius: "5px",
		marginBottom: "20px",
		"@media": {
			[media.small]: {
				flexDirection: "column",
			},
		},
	},
]);

export const button = style({
	padding: "5px 10px",
	border: "1px solid #ccc",
	borderRadius: "5px",
	cursor: "pointer",
	backgroundColor: "white",
	selectors: {
		"&:disabled": {
			opacity: 0.5,
			cursor: "not-allowed",
		},
		"&:not(:disabled):hover": {
			backgroundColor: "#f0f0f0",
		},
	},
});

export const input = style({
	padding: "5px",
	border: "1px solid #ccc",
	borderRadius: "5px",
	// width: 'auto'
});

export const select = style({
	padding: "5px",
	border: "1px solid #ccc",
	borderRadius: "5px",
	backgroundColor: "white",
});

export const flexItemsCenterGap = style({
	display: "flex",
	alignItems: "center",
	gap: "10px",
});
