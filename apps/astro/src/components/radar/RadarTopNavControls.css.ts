import { style } from "@vanilla-extract/css";

export const controls = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	gap: "1.1rem",
	minWidth: 0,
	"@media": {
		"screen and (max-width: 960px)": {
			flexWrap: "wrap",
			columnGap: "1.1rem",
			rowGap: "0.75rem",
			justifyContent: "flex-end",
		},
	},
});

const topNavControlSurface = {
	background: "rgba(30, 30, 30, 0.85)",
	border: "1px solid rgba(100, 100, 255, 0.2)",
	boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
	backdropFilter: "blur(10px)",
} as const;

export const searchShell = style({
	position: "relative",
	minWidth: "18rem",
	width: "min(32rem, 100%)",
	"@media": {
		"screen and (max-width: 960px)": {
			minWidth: "14rem",
			width: "100%",
		},
	},
});

export const searchField = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	padding: "0.45rem 0.6rem",
	borderRadius: "8px",
	...topNavControlSurface,
	width: "100%",
	selectors: {
		"&:focus-within": {
			borderColor: "rgba(255, 255, 255, 0.24)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
		},
		'[data-theme="light"] &': {
			background: "rgba(255, 255, 255, 0.92)",
			borderColor: "rgba(0, 0, 0, 0.12)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
		},
		'[data-theme="light"] &:focus-within': {
			borderColor: "rgba(0, 0, 0, 0.22)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
		},
	},
});

export const filterField = style({
	display: "flex",
	alignItems: "center",
	gap: "0.5rem",
	padding: "0.45rem 0.6rem",
	borderRadius: "8px",
	minWidth: "9.5rem",
	...topNavControlSurface,
	selectors: {
		"&:focus-within": {
			borderColor: "rgba(255, 255, 255, 0.24)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
		},
		'[data-theme="light"] &': {
			background: "rgba(255, 255, 255, 0.92)",
			borderColor: "rgba(0, 0, 0, 0.12)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
		},
		'[data-theme="light"] &:focus-within': {
			borderColor: "rgba(0, 0, 0, 0.22)",
			boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
		},
	},
});

export const filterLabel = style({
	color: "rgba(255, 255, 255, 0.68)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.68rem",
	fontWeight: 700,
	letterSpacing: "0.08em",
	textTransform: "uppercase",
	selectors: {
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.58)",
		},
	},
});

export const filterSelect = style({
	appearance: "none",
	background: "transparent",
	border: "none",
	color: "rgba(255, 255, 255, 0.94)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.8rem",
	minWidth: 0,
	width: "100%",
	outline: "none",
	cursor: "pointer",
	selectors: {
		"&:focus": {
			outline: "none",
		},
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.84)",
		},
	},
});

export const searchIcon = style({
	width: "16px",
	height: "16px",
	flexShrink: 0,
	color: "rgba(255, 255, 255, 0.72)",
	selectors: {
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.58)",
		},
	},
});

export const searchInput = style({
	appearance: "none",
	background: "transparent",
	border: "none",
	color: "rgba(255, 255, 255, 0.94)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.875rem",
	minWidth: 0,
	width: "16rem",
	outline: "none",
	selectors: {
		"&:focus": {
			border: "none",
			boxShadow: "none",
			outline: "none",
		},
		"&::placeholder": {
			color: "rgba(255, 255, 255, 0.45)",
		},
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.84)",
		},
		'[data-theme="light"] &::placeholder': {
			color: "rgba(0, 0, 0, 0.4)",
		},
	},
	"@media": {
		"screen and (max-width: 960px)": {
			width: "100%",
		},
	},
});

export const clearButton = style({
	appearance: "none",
	border: "none",
	background: "rgba(255, 255, 255, 0.08)",
	borderRadius: "4px",
	color: "rgba(255, 255, 255, 0.82)",
	cursor: "pointer",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.75rem",
	padding: "0.28rem 0.5rem",
	transition: "background 140ms ease, color 140ms ease",
	selectors: {
		"&:hover": {
			background: "rgba(255, 255, 255, 0.16)",
			color: "#ffffff",
		},
		'[data-theme="light"] &': {
			background: "rgba(0, 0, 0, 0.06)",
			color: "rgba(0, 0, 0, 0.68)",
		},
		'[data-theme="light"] &:hover': {
			background: "rgba(0, 0, 0, 0.12)",
			color: "rgba(0, 0, 0, 0.9)",
		},
	},
});

export const suggestionsPanel = style({
	position: "absolute",
	top: "calc(100% + 0.4rem)",
	left: 0,
	right: 0,
	zIndex: 30,
	display: "grid",
	gap: "0.28rem",
	padding: "0.4rem",
	borderRadius: "10px",
	border: "1px solid rgba(255, 255, 255, 0.14)",
	background: "rgba(14, 17, 24, 0.96)",
	boxShadow: "0 12px 30px rgba(0, 0, 0, 0.34)",
	backdropFilter: "blur(12px)",
	selectors: {
		'[data-theme="light"] &': {
			borderColor: "rgba(0, 0, 0, 0.12)",
			background: "rgba(255, 255, 255, 0.98)",
			boxShadow: "0 12px 26px rgba(0, 0, 0, 0.12)",
		},
	},
});

export const suggestionItem = style({
	width: "100%",
	borderRadius: "8px",
	background: "transparent",
	display: "grid",
	gridTemplateColumns: "minmax(0, 1fr) auto",
	alignItems: "stretch",
	gap: "0.3rem",
	transition: "background 140ms ease, color 140ms ease",
	selectors: {
		'&:hover, &[data-active="true"]': {
			background: "rgba(255, 255, 255, 0.08)",
		},
		'[data-theme="light"] &:hover, [data-theme="light"] &[data-active="true"]':
			{
				background: "rgba(0, 0, 0, 0.06)",
			},
	},
});

export const suggestionAction = style({
	appearance: "none",
	minWidth: 0,
	border: "none",
	background: "transparent",
	padding: "0.55rem 0.25rem 0.55rem 0.65rem",
	textAlign: "left",
	cursor: "pointer",
	display: "grid",
	alignContent: "center",
	gap: "0.2rem",
	borderRadius: "8px",
});

export const suggestionTitle = style({
	color: "rgba(255, 255, 255, 0.96)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.82rem",
	fontWeight: 700,
	selectors: {
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.88)",
		},
	},
});

export const suggestionMeta = style({
	color: "rgba(255, 255, 255, 0.58)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.68rem",
	textTransform: "uppercase",
	letterSpacing: "0.06em",
	selectors: {
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.54)",
		},
	},
});

export const suggestionDescription = style({
	color: "rgba(255, 255, 255, 0.68)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.72rem",
	lineHeight: 1.45,
	selectors: {
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.6)",
		},
	},
});

export const suggestionLink = style({
	alignSelf: "center",
	display: "inline-flex",
	alignItems: "center",
	gap: "0.28rem",
	marginRight: "0.35rem",
	padding: "0.42rem 0.5rem",
	borderRadius: "6px",
	color: "rgba(255, 255, 255, 0.66)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.66rem",
	fontWeight: 700,
	letterSpacing: "0.04em",
	textDecoration: "none",
	textTransform: "uppercase",
	transition: "background 140ms ease, color 140ms ease",
	selectors: {
		"&:hover, &:focus-visible": {
			background: "rgba(255, 255, 255, 0.12)",
			color: "rgba(255, 255, 255, 0.96)",
			outline: "none",
		},
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.56)",
		},
		'[data-theme="light"] &:hover, [data-theme="light"] &:focus-visible': {
			background: "rgba(0, 0, 0, 0.08)",
			color: "rgba(0, 0, 0, 0.88)",
		},
	},
});

export const suggestionLinkText = style({
	lineHeight: 1,
});

export const suggestionLinkIcon = style({
	width: "14px",
	height: "14px",
	flexShrink: 0,
});

export const suggestionHighlight = style({
	background: "rgba(125, 110, 238, 0.18)",
	borderRadius: "3px",
	color: "inherit",
	padding: "0 0.08rem",
	selectors: {
		'[data-theme="light"] &': {
			background: "rgba(125, 110, 238, 0.14)",
		},
	},
});

export const suggestionDot = style({
	color: "rgba(255, 255, 255, 0.42)",
	selectors: {
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.34)",
		},
	},
});

export const emptyState = style({
	color: "rgba(255, 255, 255, 0.64)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.76rem",
	padding: "0.55rem 0.65rem",
	selectors: {
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.58)",
		},
	},
});
