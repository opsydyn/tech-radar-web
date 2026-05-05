import { style, styleVariants } from "@vanilla-extract/css";

export const sidebarDesktopWidth = "13.75rem";
export const sidebarLeftInset = "8px";
export const sidebarRadarGap = "2px";

export const collapsedTrigger = style({
	position: "fixed",
	zIndex: 980,
	top: "132px",
	left: "16px",
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	transition: "transform 180ms ease, opacity 180ms ease, box-shadow 180ms ease",
	backdropFilter: "blur(10px)",
	border: "1px solid rgba(255, 255, 255, 0.12)",
	borderRadius: "999px",
	boxShadow: "0 8px 18px rgba(0, 0, 0, 0.18)",
	cursor: "pointer",
	padding: 0,
	width: "42px",
	height: "42px",
	selectors: {
		'&[data-open="true"]': {
			transform: "translateX(-10px)",
			opacity: 0,
			pointerEvents: "none",
		},
		"&:hover": {
			transform: "translateY(-1px)",
			boxShadow: "0 10px 22px rgba(0, 0, 0, 0.22)",
		},
		'[data-theme="dark"] &': {
			background: "rgba(17, 18, 24, 0.76)",
			color: "#f8fafc",
		},
		'[data-theme="machine"] &': {
			background: "rgba(17, 18, 24, 0.76)",
			color: "#f8fafc",
		},
		'[data-theme="light"] &': {
			border: "1px solid rgba(17, 24, 39, 0.1)",
			background: "rgba(248, 250, 252, 0.88)",
			color: "#111827",
		},
	},
});

export const collapsedTriggerIcon = style({
	flexShrink: 0,
	width: "18px",
	height: "18px",
});

export const swipeArea = style({
	position: "fixed",
	zIndex: 970,
	top: "92px",
	bottom: "24px",
	left: 0,
	cursor: "pointer",
	width: "14px",
});

export const viewport = style({
	position: "fixed",
	zIndex: 990,
	inset: 0,
	display: "flex",
	alignItems: "flex-start",
	justifyContent: "flex-start",
	pointerEvents: "none",
	padding: `76px 0 24px ${sidebarLeftInset}`,
	selectors: {
		'&[data-open="false"]': {
			pointerEvents: "none",
		},
	},
});

export const popup = style({
	transform: "translateX(var(--drawer-swipe-movement-x))",
	transition:
		"transform 260ms cubic-bezier(0.32, 0.72, 0, 1), opacity 220ms ease",
	outline: "1px solid rgba(255, 255, 255, 0.12)",
	borderRadius: "18px",
	boxShadow: "0 18px 48px rgba(0, 0, 0, 0.32)",
	pointerEvents: "auto",
	width: `min(${sidebarDesktopWidth}, calc(100vw - 12px))`,
	height: "calc(100dvh - 108px)",
	overflow: "hidden",
	selectors: {
		"&[data-swiping]": {
			userSelect: "none",
		},
		'&[data-open="false"]': {
			transform: "translateX(calc(-100% - 24px))",
			opacity: 0,
			pointerEvents: "none",
		},
		"&[data-starting-style], &[data-ending-style]": {
			transform: "translateX(calc(-100% - 24px))",
			opacity: 0.9999,
		},
		'[data-theme="dark"] &': {
			background: "rgba(10, 12, 18, 0.94)",
			color: "#f8fafc",
		},
		'[data-theme="machine"] &': {
			background: "rgba(10, 12, 18, 0.94)",
			color: "#f8fafc",
		},
		'[data-theme="light"] &': {
			outline: "1px solid rgba(17, 24, 39, 0.12)",
			background: "rgba(249, 250, 251, 0.97)",
			color: "#111827",
		},
	},
});

export const surface = style({
	position: "relative",
	display: "flex",
	flexDirection: "column",
	padding: "34px 12px 18px",
	height: "100%",
});

export const description = style({
	opacity: 0.7,
	margin: 0,
	lineHeight: 1.6,
	fontSize: "0.92rem",
});

export const closeButton = style({
	position: "absolute",
	zIndex: 2,
	top: "10px",
	right: "16px",
	display: "inline-flex",
	flexShrink: 0,
	alignItems: "center",
	justifyContent: "center",
	transition:
		"transform 160ms ease, background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease, color 160ms ease",
	opacity: 1,
	border: "1px solid rgba(226, 232, 240, 0.64)",
	borderRadius: "999px",
	boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.26), 0 8px 18px rgba(0, 0, 0, 0.34)",
	background: "rgba(15, 23, 42, 0.96)",
	cursor: "pointer",
	pointerEvents: "auto",
	touchAction: "manipulation",
	padding: 0,
	width: "34px",
	height: "34px",
	color: "#f8fafc",
	WebkitTapHighlightColor: "transparent",
	selectors: {
		"&::before": {
			position: "absolute",
			inset: "-4px",
			borderRadius: "999px",
			content: '""',
		},
		"&:hover": {
			transform: "translateX(-1px)",
			borderColor: "rgba(255, 255, 255, 0.92)",
			boxShadow:
				"0 0 0 1px rgba(0, 0, 0, 0.28), 0 10px 22px rgba(0, 0, 0, 0.42)",
			backgroundColor: "rgba(30, 41, 59, 1)",
		},
		"&:active": {
			transform: "translateX(-1px) scale(0.96)",
		},
		"&:focus-visible": {
			outline: "2px solid rgba(96, 165, 250, 0.8)",
			outlineOffset: "2px",
		},
		'[data-theme="light"] &': {
			borderColor: "rgba(15, 23, 42, 0.55)",
			background: "rgba(255, 255, 255, 0.98)",
			color: "#0f172a",
		},
		'[data-theme="light"] &:hover': {
			borderColor: "rgba(15, 23, 42, 0.82)",
			backgroundColor: "rgba(241, 245, 249, 1)",
		},
	},
});

export const closeIcon = style({
	pointerEvents: "none",
	width: "18px",
	height: "18px",
});

export const content = style({
	display: "flex",
	flex: 1,
	flexDirection: "column",
	gap: "14px",
	paddingBottom: "max(30px, env(safe-area-inset-bottom, 0px))",
	minHeight: 0,
	overflowY: "auto",
	overscrollBehavior: "contain",
});

export const section = style({
	display: "grid",
	gap: "8px",
});

export const sidebarFilterField = style({
	display: "grid",
	gap: "0.4rem",
	marginTop: "0.25rem",
});

export const sidebarFilterLabel = style({
	color: "rgba(255, 255, 255, 0.68)",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.68rem",
	letterSpacing: "0.08em",
	fontWeight: 700,
	textTransform: "uppercase",
	selectors: {
		'[data-theme="light"] &': {
			color: "rgba(0, 0, 0, 0.58)",
		},
	},
});

export const sidebarFilterSelect = style({
	width: "100%",
	padding: "0.75rem 2.5rem 0.75rem 0.9rem",
	minHeight: "2.875rem",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.92rem",
	fontWeight: 700,
	border: "1px solid rgba(255, 255, 255, 0.14)",
	borderRadius: "0.9rem",
	backgroundColor: "rgba(3, 7, 18, 0.78)",
	color: "rgba(255, 255, 255, 0.96)",
	cursor: "pointer",
	transition:
		"border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease",
	outline: "none",
	appearance: "none",
	backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.8)' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
	backgroundRepeat: "no-repeat",
	backgroundPosition: "right 0.9rem center",
	selectors: {
		"&:hover": {
			borderColor: "rgba(255, 255, 255, 0.24)",
			backgroundColor: "rgba(3, 7, 18, 0.92)",
		},
		"&:focus": {
			outline: "none",
			borderColor: "rgba(125, 110, 238, 0.75)",
			boxShadow: "0 0 0 3px rgba(125, 110, 238, 0.18)",
		},
		'[data-theme="light"] &': {
			border: "1px solid rgba(17, 24, 39, 0.12)",
			backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(17,24,39,0.72)' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
			backgroundColor: "rgba(255, 255, 255, 0.92)",
			color: "#111827",
		},
	},
});

export const radarSection = style([
	section,
	{
		alignItems: "center",
		marginTop: "auto",
		paddingTop: "12px",
		paddingBottom: "16px",
	},
]);

export const sectionHeading = style({
	opacity: 0.82,
	textTransform: "uppercase",
	letterSpacing: "0.12em",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.72rem",
	fontWeight: 700,
});

export const searchField = style({
	position: "relative",
	display: "flex",
	alignItems: "center",
});

export const searchIcon = style({
	position: "absolute",
	left: "12px",
	opacity: 0.58,
	pointerEvents: "none",
	width: "18px",
	height: "18px",
});

export const searchInput = style({
	transition:
		"border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
	border: "1px solid rgba(148, 163, 184, 0.24)",
	borderRadius: "12px",
	background: "rgba(15, 23, 42, 0.24)",
	padding: "10px 12px 10px 40px",
	width: "100%",
	color: "inherit",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.92rem",
	selectors: {
		'[data-theme="light"] &': {
			background: "rgba(255, 255, 255, 0.82)",
		},
		"&:focus": {
			outline: "none",
			borderColor: "rgba(96, 165, 250, 0.72)",
			boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.16)",
		},
		"&::placeholder": {
			opacity: 0.56,
		},
	},
});

export const searchFooter = style({
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	gap: "12px",
	fontSize: "0.8rem",
});

export const resultsCount = style({
	opacity: 0.72,
});

export const clearButton = style({
	opacity: 0.82,
	border: 0,
	background: "transparent",
	cursor: "pointer",
	padding: 0,
	textDecoration: "underline",
	color: "inherit",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.8rem",
	fontWeight: 700,
	textUnderlineOffset: "0.2em",
	selectors: {
		"&:hover": {
			opacity: 1,
		},
		"&:focus-visible": {
			outline: "2px solid rgba(96, 165, 250, 0.8)",
			outlineOffset: "2px",
			borderRadius: "4px",
		},
	},
});

export const navList = style({
	display: "grid",
	gap: "7px",
});

export const navCard = style({
	position: "relative",
	display: "grid",
	gridTemplateColumns: "20px 1fr",
	alignItems: "center",
	gap: "9px",
	transition:
		"transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
	border: "1px solid rgba(255, 255, 255, 0.08)",
	borderRadius: "0.85rem",
	padding: "0.78rem 0.8rem",
	textDecoration: "none",
	color: "#ffffff",
	selectors: {
		'[data-theme="light"] &': {
			color: "#111827",
		},
		"&:hover": {
			transform: "translateY(-1px)",
			boxShadow: "0 12px 26px rgba(15, 23, 42, 0.28)",
		},
		"&:focus-visible": {
			outline: "2px solid rgba(96, 165, 250, 0.8)",
			outlineOffset: "2px",
		},
	},
});

export const navCardTone = styleVariants({
	platforms: {
		background: "rgb(125, 110, 238)",
	},
	languages: {
		background: "rgb(81, 245, 141)",
		color: "#0b1017",
	},
	tools: {
		background: "rgb(80, 197, 241)",
		color: "#0b1017",
	},
	techniques: {
		background: "rgb(255, 163, 71)",
		color: "#0b1017",
	},
});

export const navIconWrap = style({
	display: "inline-flex",
	alignItems: "center",
	justifyContent: "center",
	width: "20px",
	height: "20px",
	color: "inherit",
});

export const navIcon = style({
	width: "18px",
	height: "18px",
});

export const navCopy = style({
	display: "flex",
	alignItems: "center",
	minWidth: 0,
});

export const navTitle = style({
	letterSpacing: "0.01em",
	fontSize: "0.84rem",
	fontWeight: 700,
});

export const legendShell = style({
	display: "grid",
	gap: "8px",
});

export const radarToggleButton = style({
	transition:
		"transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease",
	border: "1px solid rgba(255, 255, 255, 0.18)",
	borderRadius: "10px",
	background: "rgba(55, 55, 55, 0.88)",
	cursor: "pointer",
	padding: "0.68rem 0.75rem",
	width: "100%",
	minWidth: 0,
	textAlign: "center",
	color: "#ffffff",
	fontFamily: "'IBM Plex Mono', monospace",
	fontSize: "0.76rem",
	fontWeight: 700,
	selectors: {
		"&:hover": {
			transform: "translateY(-1px)",
			boxShadow: "0 10px 20px rgba(0, 0, 0, 0.24)",
		},
		"&:focus-visible": {
			outline: "2px solid rgba(96, 165, 250, 0.8)",
			outlineOffset: "2px",
		},
		'[data-theme="light"] &': {
			border: "1px solid rgba(17, 24, 39, 0.12)",
			background: "rgba(229, 231, 235, 0.96)",
			color: "#111827",
		},
	},
});

export const visuallyHidden = style({
	position: "absolute",
	margin: "-1px",
	border: 0,
	padding: 0,
	width: "1px",
	height: "1px",
	overflow: "hidden",
	whiteSpace: "nowrap",
	clip: "rect(0 0 0 0)",
});
