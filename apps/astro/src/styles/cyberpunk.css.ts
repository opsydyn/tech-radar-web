import {
	createGlobalTheme,
	globalStyle,
	keyframes,
} from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
	colors: {
		neonPink: "#ff2a6d",
		neonBlue: "#05d9e8",
		neonPurple: "#7700ff",
		neonGreen: "#39ff14",
		darkBg: "#1a1a1a",
		darkBgAlt: "#2d2d2d",
	},
	effects: {
		glowPink: "0 0 10px #ff2a6d, 0 0 20px #ff2a6d",
		glowBlue: "0 0 10px #05d9e8, 0 0 20px #05d9e8",
		glowPurple: "0 0 10px #7700ff, 0 0 20px #7700ff",
		glowGreen: "0 0 10px #39ff14, 0 0 20px #39ff14",
	},
	fonts: {
		mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
	},
	sizes: {
		maxWidth: "1200px",
	},
	space: {
		small: "0.5rem",
		medium: "1rem",
		large: "2rem",
	},
	mediaQueries: {
		mobile: "screen and (max-width: 600px)",
		tablet: "screen and (min-width: 601px) and (max-width: 900px)",
		desktop: "screen and (min-width: 901px)",
	},
});

const scanline = keyframes({
	"0%": { transform: "translateY(-100%)" },
	"100%": { transform: "translateY(100%)" },
});

globalStyle("body", {
	backgroundColor: vars.colors.darkBg,
	color: vars.colors.neonBlue,
	fontFamily: vars.fonts.mono,
	margin: 0,
	padding: 0,
	minHeight: "100vh",
	position: "relative",
	overflow: "hidden",
});

globalStyle("body::before", {
	content: '""',
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	height: "100%",
	background: "linear-gradient(transparent 50%, rgba(5, 217, 232, 0.025) 50%)",
	backgroundSize: "100% 4px",
	animation: `${scanline} 4s linear infinite`,
	animationPlayState: "paused",
	pointerEvents: "none",
	zIndex: 1,
});

// globalStyle('h1, h2, h3, h4, h5, h6', {
//   color: vars.colors.neonPink,
//   fontFamily: vars.fonts.mono,
//   textTransform: 'uppercase',
//   letterSpacing: '2px',
// });

// globalStyle('h1', {
//   animation: `${glitch} 3s infinite alternate`,
//   animationPlayState: 'paused',
// });

globalStyle("a", {
	textDecoration: "none",
	transition: "all 0.3s ease",
});

globalStyle("button", {
	backgroundColor: vars.colors.darkBgAlt,
	color: vars.colors.neonBlue,
	border: `1px solid ${vars.colors.neonBlue}`,
	padding: "0.5rem 1rem",
	fontFamily: vars.fonts.mono,
	cursor: "pointer",
	transition: "all 0.3s ease",
});

globalStyle("input, textarea, select", {
	backgroundColor: vars.colors.darkBgAlt,
	color: vars.colors.neonBlue,
	border: `1px solid ${vars.colors.neonBlue}`,
	padding: "0.5rem",
	fontFamily: vars.fonts.mono,
});

globalStyle("input:focus, textarea:focus, select:focus", {
	borderColor: vars.colors.neonPink,
	outline: "none",
	boxShadow: "none",
});

// Enable animations when the animations-enabled class is present
globalStyle("html.animations-enabled body::before", {
	animationPlayState: "running",
});

globalStyle("html.animations-enabled h1", {
	animationPlayState: "running",
});
