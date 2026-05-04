import { globalStyle, keyframes, style } from "@vanilla-extract/css";

// Cyberpunk theme colors
const theme = {
	neonPink: "#ff2a6d",
	neonBlue: "#05d9e8",
	neonPurple: "#7700ff",
	neonGreen: "#39ff14",
	darkBg: "#1a1a1a",
	darkBgAlt: "#2d2d2d",
	glowPink: "0 0 10px #ff2a6d, 0 0 20px #ff2a6d",
	glowBlue: "0 0 10px #05d9e8, 0 0 20px #05d9e8",
	glowPurple: "0 0 10px #7700ff, 0 0 20px #7700ff",
	glowGreen: "0 0 10px #39ff14, 0 0 20px #39ff14",
};

// Animation for text glitch effect
const glitch = keyframes({
	"0%": { textShadow: theme.glowBlue },
	"33%": { textShadow: theme.glowPink },
	"66%": { textShadow: theme.glowPurple },
	"100%": { textShadow: theme.glowBlue },
});

// Animation for scanline effect
const scanline = keyframes({
	"0%": { transform: "translateY(-100%)" },
	"100%": { transform: "translateY(100%)" },
});

export const breakPoints = {
	mobile: "only screen and (max-width: 600px)",
	tablet: "only screen and (min-width: 601px) and (max-width: 900px)",
	desktop: "only screen and (min-width: 901px)",
};

export const radarWrapper = style({
	width: "280px",
	height: "100vh",
	maxWidth: "1200px",
	minHeight: "100vh",
	margin: "auto",
	background: theme.darkBg,
	display: "flex",
	flexDirection: "column",
	justifyContent: "space-between",
	padding: "1.5rem",
	// border: `1px solid ${theme.neonBlue}`,
	// boxShadow: theme.glowBlue,
	position: "relative",
	overflow: "hidden",
	"::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "100%",
		background:
			"linear-gradient(transparent 50%, rgba(5, 217, 232, 0.025) 50%)",
		backgroundSize: "100% 4px",
		animation: `${scanline} 4s linear infinite`,
		pointerEvents: "none",
	},
	"@media": {
		[breakPoints.mobile]: {
			flexDirection: "row",
			minHeight: "250px",
			height: "250px",
			width: "100%",
			padding: "1rem",
		},
	},
});

export const headingOne = style({
	fontSize: "2rem",
	fontWeight: "700",
	textTransform: "uppercase",
	letterSpacing: "3px",
	color: theme.neonBlue,
	textAlign: "center",
	marginBottom: "2rem",
	fontFamily: "monospace",
	animation: `${glitch} 3s infinite alternate`,
	"@media": {
		[breakPoints.mobile]: {
			fontSize: "1.5rem",
			marginBottom: "1rem",
		},
	},
});

export const quadrantsOverlay = style({
	flex: 1,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	gap: "1rem",
	"@media": {
		[breakPoints.mobile]: {
			flexDirection: "row",
			height: "150px",
			gap: "0.5rem",
		},
	},
});

export const quadrant = style({
	display: "flex",
	flexDirection: "column",
	cursor: "pointer",
	transition: "all 0.3s ease",
	padding: "1.5rem 2rem",
	background: theme.darkBgAlt,
	border: "1px solid transparent",
	borderRadius: "8px",
	minHeight: "80px",
	aspectRatio: "3/2",
	"@media": {
		[breakPoints.mobile]: {
			flex: "1",
			height: "150px",
			padding: "0.75rem",
			aspectRatio: "auto",
		},
	},
});

globalStyle(`${quadrant} h2`, {
	fontSize: "1.1rem",
	fontWeight: "600",
	letterSpacing: "1px",
	transition: "transform 0.3s ease",
	fontFamily: "monospace",
	"@media": {
		[breakPoints.mobile]: {
			fontSize: "0.9rem",
		},
	},
});

globalStyle(`${quadrant}:hover h2`, {
	transform: "translateX(10px)",
});

globalStyle(`${quadrant} a`, {
	textDecoration: "none",
	color: "inherit",
});

export const chevron = style({
	display: "inline-block",
	width: "8px",
	height: "8px",
	borderTop: `2px solid ${theme.neonBlue}`,
	borderRight: `2px solid ${theme.neonBlue}`,
	transform: "rotate(45deg)",
	margin: "0 0 3px 5px",
	transition: "border-color 0.3s ease",
});

export const topLeft = style({
	color: theme.neonPink,
	selectors: {
		"&:hover": {
			backgroundColor: `${theme.darkBgAlt}`,
			border: `1px solid ${theme.neonPink}`,
			boxShadow: theme.glowPink,
		},
	},
});

globalStyle(`${topLeft}:hover span`, {
	borderColor: theme.neonPink,
});

export const topRight = style({
	color: theme.neonPurple,
	selectors: {
		"&:hover": {
			backgroundColor: `${theme.darkBgAlt}`,
			border: `1px solid ${theme.neonPurple}`,
			boxShadow: theme.glowPurple,
		},
	},
});

globalStyle(`${topRight}:hover span`, {
	borderColor: theme.neonPurple,
});

export const bottomLeft = style({
	color: theme.neonBlue,
	selectors: {
		"&:hover": {
			backgroundColor: `${theme.darkBgAlt}`,
			border: `1px solid ${theme.neonBlue}`,
			boxShadow: theme.glowBlue,
		},
	},
});

globalStyle(`${bottomLeft}:hover span`, {
	borderColor: theme.neonBlue,
});

export const bottomRight = style({
	color: theme.neonGreen,
	selectors: {
		"&:hover": {
			backgroundColor: `${theme.darkBgAlt}`,
			border: `1px solid ${theme.neonGreen}`,
			boxShadow: theme.glowGreen,
		},
	},
});

globalStyle(`${bottomRight}:hover span`, {
	borderColor: theme.neonGreen,
});
