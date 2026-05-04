import { globalStyle, keyframes, style } from "@vanilla-extract/css";
import { createVar } from "@vanilla-extract/css";
import {
	typographyLevel1,
	typographyLevel2,
	typographyLevel3,
	typographyLevel4,
	typographyLevel5,
} from "../styles/modular-scale.css";
import { darkThemeVars, lightThemeVars } from "../styles/theme.css";
import {
	spacingLevel1,
	spacingLevel2,
	spacingLevel3,
	spacingLevel4,
	spacingLevel5,
} from "../styles/vertical-rhythm.css";

// Define retro color variables for CRT effects
const retroColors = {
	terminal: {
		green: "#00FF41",
		amber: "#FFB000",
		white: "#F0F0F0",
	},
	roland808: {
		yellow: "#DDDA00",
		background: "#2F2E3E",
		panel: "#1A1924",
		border: "#5A5966",
		light: "#E6E8BF",
	},
	crt: {
		scanline: "rgba(0, 255, 65, 0.03)",
		glow: "rgba(0, 255, 65, 0.1)",
	},
};

// Create CSS layers for organization
const base = "tech-radar-ai-base";
const layout = "tech-radar-ai-layout";
const typography = "tech-radar-ai-typography";
const components = "tech-radar-ai-components";
const theme = "tech-radar-ai-theme";

// Animation keyframes
const spin = keyframes({
	"0%": { transform: "rotate(0deg)" },
	"100%": { transform: "rotate(360deg)" },
});

// Classic cursor blink animation
const cursorBlink = keyframes({
	"0%, 50%": { opacity: 1 },
	"51%, 100%": { opacity: 0 },
});

// Typing animation for terminal effect
const typewriter = keyframes({
	from: { width: "0" },
	to: { width: "100%" },
});

// Roland 808 yellow LED glow (authentic color)
const roland808Glow = keyframes({
	"0%, 100%": {
		textShadow: `0 0 5px ${retroColors.roland808.yellow}, 0 0 10px rgba(221, 218, 0, 0.3)`,
	},
	"50%": {
		textShadow: `0 0 8px ${retroColors.roland808.yellow}, 0 0 16px rgba(221, 218, 0, 0.5), 0 0 24px rgba(221, 218, 0, 0.2)`,
	},
});

// Scanline effect for authentic CRT feel
const scanlines = style({
	position: "relative",
	"::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: `linear-gradient(transparent 50%, ${retroColors.crt.scanline} 50%)`,
		backgroundSize: "100% 4px",
		pointerEvents: "none",
		zIndex: 1,
	},
});

// CRT screen curvature effect
export const crtScreen = style({
	borderRadius: "20px",
	boxShadow: "inset 0 0 50px rgba(0, 0, 0, 0.5)",
	position: "relative",
	overflow: "hidden",
	"::after": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: `
			radial-gradient(ellipse at center, transparent 60%, rgba(0, 0, 0, 0.1) 100%),
			linear-gradient(0deg, transparent 50%, rgba(255, 255, 255, 0.03) 50%)
		`,
		backgroundSize: "100% 100%, 100% 2px",
		pointerEvents: "none",
		zIndex: 2,
	},
});

// Retro monitor bezel
export const monitorBezel = style({
	background: "linear-gradient(145deg, #2a2a2a, #1a1a1a)",
	border: "8px solid #333",
	borderRadius: "15px",
	padding: "20px",
	boxShadow: `
		inset 0 0 0 2px #444,
		inset 0 0 0 4px #222,
		0 8px 20px rgba(0, 0, 0, 0.5)
	`,
});

// Blinking cursor utility class
export const blinkingCursor = style({
	"::after": {
		content: '"|"',
		animation: `${cursorBlink} 1s infinite`,
		color: retroColors.terminal.green,
	},
});

// Typewriter effect container
export const typewriterText = style({
	overflow: "hidden",
	borderRight: `2px solid ${retroColors.terminal.green}`,
	whiteSpace: "nowrap",
	animation: `${typewriter} 3s steps(40, end), ${cursorBlink} 1s step-end infinite`,
});

// Roland 808 glowing text utility class
export const roland808GlowingText = style({
	animation: `${roland808Glow} 2s ease-in-out infinite`,
	color: retroColors.roland808.yellow,
	fontWeight: "400",
});

// --- LAYOUT SYSTEM ---
export const container = style({
	"@layer": {
		[layout]: {
			maxWidth: "1200px",
			margin: "0 auto",
			padding: "2rem",
			fontFamily:
				"-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
		},
	},
});

// --- TYPOGRAPHY SYSTEM ---
export const headerTitle = style([
	typographyLevel1,
	{
		"@layer": {
			[typography]: {
				fontFamily: "'Space Grotesk', sans-serif",
				fontWeight: "700",
				textAlign: "center",
				marginBottom: "0.5rem",
				color: lightThemeVars.color.text,
				transition: "color 0.3s ease",
			},
		},
	},
]);

// Dark theme styles for header title
globalStyle(`html[data-theme="dark"] .${headerTitle}`, {
	color: darkThemeVars.color.text,
});

export const headerSubtitle = style([
	typographyLevel4,
	{
		"@layer": {
			[typography]: {
				fontFamily: "'IBM Plex Mono', monospace",
				color: lightThemeVars.color.text,
				textAlign: "center",
				fontSize: "1.1rem",
				transition: "color 0.3s ease",
				opacity: 0.8,
			},
		},
	},
]);

// Dark theme styles for header subtitle
globalStyle(`html[data-theme="dark"] .${headerSubtitle}`, {
	color: darkThemeVars.color.text,
});

export const sectionTitle = style([
	typographyLevel2,
	{
		"@layer": {
			[typography]: {
				fontFamily: "'Space Grotesk', sans-serif",
				fontWeight: "500",
				fontSize: "1.5rem",
				marginBottom: "0.5rem",
				color: lightThemeVars.color.text,
				transition: "color 0.3s ease",
			},
		},
	},
]);

// Dark theme styles for section title
globalStyle(`html[data-theme="dark"] .${sectionTitle}`, {
	color: darkThemeVars.color.text,
});

export const sectionDescription = style([
	typographyLevel5,
	{
		"@layer": {
			[typography]: {
				fontFamily: "'IBM Plex Mono', monospace",
				color: lightThemeVars.color.text,
				marginBottom: "1.5rem",
				transition: "color 0.3s ease",
				opacity: 0.8,
			},
		},
	},
]);

// Dark theme styles for section description
globalStyle(`html[data-theme="dark"] .${sectionDescription}`, {
	color: darkThemeVars.color.text,
});

// --- HEADER SECTION ---
export const testHeader = style([
	spacingLevel3,
	{
		"@layer": {
			[components]: {
				textAlign: "center",
				marginBottom: "2rem",
			},
		},
	},
]);

export const tabButtons = style([
	spacingLevel2,
	{
		"@layer": {
			[components]: {
				display: "flex",
				gap: "1rem",
				justifyContent: "center",
				marginTop: "2rem",
			},
		},
	},
]);

export const tabButton = style([
	spacingLevel1,
	{
		"@layer": {
			[components]: {
				padding: "0.75rem 1.5rem",
				border: "2px solid",
				borderColor: lightThemeVars.color.border,
				background: lightThemeVars.color.background,
				borderRadius: "0.5rem",
				cursor: "pointer",
				fontWeight: "500",
				fontFamily: "'IBM Plex Mono', monospace",
				transition: "all 0.2s ease",
				color: lightThemeVars.color.text,
				selectors: {
					"&:hover:not([data-active])": {
						borderColor: "#2563eb",
						color: "#2563eb",
					},
				},
			},
		},
	},
]);

export const tabButtonActive = style({
	background: "#2563eb !important",
	color: "white !important",
	borderColor: "#2563eb !important",
});

// Dark theme styles for tab button
globalStyle(`html[data-theme="dark"] .${tabButton}`, {
	borderColor: darkThemeVars.color.border,
	background: darkThemeVars.color.background,
	color: darkThemeVars.color.text,
});

// --- SECTIONS ---
export const chatSection = style([
	spacingLevel3,
	monitorBezel,
	{
		"@layer": {
			[components]: {
				marginTop: "2rem",
			},
		},
	},
]);

// CRT Chat Container - applies the retro effects to the chat interface
export const crtChatContainer = style([
	crtScreen,
	scanlines,
	{
		padding: "20px",
		minHeight: "600px",
		backgroundColor: "#001100",
		display: "flex",
		flexDirection: "column",
	},
]);

// System Ready Header for the chat interface
export const systemReadyHeader = style([
	roland808GlowingText,
	{
		textAlign: "center",
		marginBottom: "20px",
		padding: "20px",
	},
]);

export const actionsSection = style([
	spacingLevel3,
	monitorBezel,
	{
		"@layer": {
			[components]: {
				marginTop: "2rem",
			},
		},
	},
]);

// Retro Actions Container - applies the retro effects to the actions interface
export const retroActionsContainer = style([
	crtScreen,
	scanlines,
	{
		padding: "20px",
		minHeight: "400px",
		backgroundColor: "#001100",
		display: "flex",
		flexDirection: "column",
	},
]);

// --- FORM STYLES ---
export const testForm = style([
	spacingLevel4,
	{
		"@layer": {
			[components]: {
				background: "rgba(0, 17, 0, 0.9)",
				padding: "2rem",
				borderRadius: "0",
				border: `2px solid ${retroColors.terminal.green}`,
				marginBottom: "2rem",
				boxShadow: `0 0 20px ${retroColors.terminal.green}40`,
				fontFamily: "'IBM Plex Mono', monospace",
				position: "relative",
				"::before": {
					content: '""',
					position: "absolute",
					top: "0",
					left: "0",
					right: "0",
					bottom: "0",
					background:
						"linear-gradient(transparent 50%, rgba(0, 255, 65, 0.03) 50%)",
					backgroundSize: "100% 4px",
					pointerEvents: "none",
				},
			},
		},
	},
]);

// // Retro text glow effect
// export const textGlow = keyframes({
// 	"0%, 100%": {
// 		textShadow: `0 0 5px ${vars.color.terminal.green}`,
// 	},
// 	"50%": {
// 		textShadow: `0 0 10px ${vars.color.terminal.green}, 0 0 15px ${vars.color.terminal.green}`,
// 	},
// });

// System header for the form
export const systemFormHeader = style({
	"@layer": {
		[components]: {
			color: retroColors.terminal.green,
			fontFamily: "'IBM Plex Mono', monospace",
			fontSize: "1.2rem",
			fontWeight: "bold",
			marginBottom: "1.5rem",
			textTransform: "uppercase",
			letterSpacing: "2px",
			textShadow: `0 0 10px ${retroColors.terminal.green}`,
			// animation: `${textGlow} 2s ease-in-out infinite alternate`,
		},
	},
});

export const formGroup = style([
	spacingLevel2,
	{
		"@layer": {
			[components]: {
				marginBottom: "1.5rem",
			},
		},
	},
]);

export const formLabel = style([
	typographyLevel5,
	{
		"@layer": {
			[components]: {
				display: "block",
				fontWeight: "bold",
				marginBottom: "0.5rem",
				color: retroColors.terminal.green,
				fontFamily: "'IBM Plex Mono', monospace",
				textTransform: "uppercase",
				letterSpacing: "1px",
				fontSize: "0.9rem",
				textShadow: `0 0 5px ${retroColors.terminal.green}`,
			},
		},
	},
]);

export const formInput = style({
	"@layer": {
		[components]: {
			width: "100%",
			padding: "0.75rem",
			border: `1px solid ${retroColors.terminal.green}`,
			borderRadius: "0",
			fontSize: "1rem",
			fontFamily: "'IBM Plex Mono', monospace",
			background: "rgba(0, 0, 0, 0.8)",
			color: retroColors.terminal.green,
			boxShadow: `inset 0 0 10px rgba(0, 255, 65, 0.1)`,
			selectors: {
				"&:focus": {
					outline: "none",
					borderColor: retroColors.roland808.yellow,
					boxShadow: `0 0 15px ${retroColors.roland808.yellow}40, inset 0 0 10px rgba(0, 255, 65, 0.2)`,
					color: retroColors.roland808.yellow,
				},
				"&::placeholder": {
					color: "rgba(0, 255, 65, 0.5)",
				},
			},
		},
	},
});

export const submitButton = style([
	spacingLevel1,
	{
		"@layer": {
			[components]: {
				background: `linear-gradient(45deg, ${retroColors.roland808.panel}, ${retroColors.roland808.background})`,
				color: retroColors.roland808.yellow,
				padding: "0.75rem 2rem",
				border: `2px solid ${retroColors.roland808.yellow}`,
				borderRadius: "0",
				fontWeight: "bold",
				fontFamily: "'IBM Plex Mono', monospace",
				cursor: "pointer",
				textTransform: "uppercase",
				letterSpacing: "1px",
				boxShadow: `0 0 15px ${retroColors.roland808.yellow}40`,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: "0.5rem",
				selectors: {
					"&:hover:not(:disabled)": {
						boxShadow: `0 0 25px ${retroColors.roland808.yellow}60`,
						textShadow: `0 0 10px ${retroColors.roland808.yellow}`,
						transform: "scale(1.02)",
					},
					"&:disabled": {
						opacity: 0.6,
						cursor: "not-allowed",
						transform: "none",
					},
				},
			},
		},
	},
]);

export const spinner = style({
	"@layer": {
		[components]: {
			width: "16px",
			height: "16px",
			border: "2px solid transparent",
			borderTop: "2px solid white",
			borderRadius: "50%",
			animation: `${spin} 1s linear infinite`,
		},
	},
});

// --- MESSAGE STYLES ---
export const errorMessage = style([
	spacingLevel3,
	{
		"@layer": {
			[components]: {
				background: "rgba(139, 0, 0, 0.2)",
				border: `2px solid #8B0000`,
				padding: "1rem",
				borderRadius: "0",
				color: "#FF6B6B",
				marginTop: "1rem",
				fontFamily: "'IBM Plex Mono', monospace",
				textTransform: "uppercase",
				letterSpacing: "1px",
				boxShadow: "0 0 15px rgba(139, 0, 0, 0.4)",
				position: "relative",
				"::before": {
					content: '"ERROR: "',
					color: "#FF0000",
					fontWeight: "bold",
					textShadow: "0 0 10px #FF0000",
				},
			},
		},
	},
]);

// --- ANALYSIS RESULT STYLES ---
export const analysisResult = style([
	spacingLevel4,
	{
		"@layer": {
			[components]: {
				background: "rgba(0, 17, 0, 0.8)",
				border: `2px solid ${retroColors.terminal.green}`,
				padding: "2rem",
				borderRadius: "0",
				marginTop: "2rem",
				boxShadow: `0 0 20px ${retroColors.terminal.green}40`,
				position: "relative",
				"::before": {
					content: '""',
					position: "absolute",
					top: "0",
					left: "0",
					right: "0",
					bottom: "0",
					background:
						"linear-gradient(transparent 50%, rgba(0, 255, 65, 0.03) 50%)",
					backgroundSize: "100% 4px",
					pointerEvents: "none",
				},
			},
		},
	},
]);

export const analysisTitle = style([
	typographyLevel3,
	{
		"@layer": {
			[components]: {
				color: retroColors.terminal.green,
				marginBottom: "1.5rem",
				fontFamily: "'IBM Plex Mono', monospace",
				fontWeight: "bold",
				textTransform: "uppercase",
				letterSpacing: "2px",
				textShadow: `0 0 10px ${retroColors.terminal.green}`,
			},
		},
	},
]);

export const analysisCard = style([
	spacingLevel2,
	{
		"@layer": {
			[components]: {
				marginBottom: "1rem",
				padding: "0.75rem",
				background: lightThemeVars.color.background,
				borderRadius: "0.375rem",
				border: "1px solid #e0f2fe",
				transition: "background-color 0.3s ease, border-color 0.3s ease",
			},
		},
	},
]);

// Dark theme styles for analysis card
globalStyle(`html[data-theme="dark"] .${analysisCard}`, {
	background: darkThemeVars.color.surface,
	borderColor: "rgba(59, 130, 246, 0.2)",
});

export const placementInfo = style([
	spacingLevel1,
	{
		"@layer": {
			[components]: {
				fontSize: "1.125rem",
				fontWeight: "600",
				fontFamily: "'Space Grotesk', sans-serif",
			},
		},
	},
]);

export const quadrantBadge = style({
	"@layer": {
		[components]: {
			background: retroColors.roland808.background,
			color: retroColors.roland808.yellow,
			padding: "0.5rem 1rem",
			borderRadius: "0",
			border: `1px solid ${retroColors.roland808.yellow}`,
			fontFamily: "'IBM Plex Mono', monospace",
			fontSize: "0.9rem",
			fontWeight: "bold",
			textTransform: "uppercase",
			letterSpacing: "1px",
			boxShadow: `0 0 10px ${retroColors.roland808.yellow}40`,
			marginRight: "0.5rem",
		},
	},
});

export const ringBadge = style({
	"@layer": {
		[components]: {
			background: "rgba(0, 17, 0, 0.8)",
			color: retroColors.terminal.green,
			padding: "0.5rem 1rem",
			borderRadius: "0",
			border: `1px solid ${retroColors.terminal.green}`,
			fontFamily: "'IBM Plex Mono', monospace",
			fontSize: "0.9rem",
			fontWeight: "bold",
			textTransform: "uppercase",
			letterSpacing: "1px",
			boxShadow: `0 0 10px ${retroColors.terminal.green}40`,
		},
	},
});

export const analysisText = style([
	typographyLevel5,
	{
		"@layer": {
			[components]: {
				fontFamily: "'IBM Plex Mono', monospace",
				color: lightThemeVars.color.text,
				lineHeight: "1.6",
				transition: "color 0.3s ease",
			},
		},
	},
]);

// Dark theme styles for analysis text
globalStyle(`html[data-theme="dark"] .${analysisText}`, {
	color: darkThemeVars.color.text,
});

export const analysisList = style({
	"@layer": {
		[components]: {
			margin: "0.5rem 0 0 1.5rem",
			padding: "0",
		},
	},
});

export const analysisListItem = style([
	typographyLevel5,
	{
		"@layer": {
			[components]: {
				marginBottom: "0.25rem",
				fontFamily: "'IBM Plex Mono', monospace",
				color: lightThemeVars.color.text,
				transition: "color 0.3s ease",
			},
		},
	},
]);

// Dark theme styles for analysis list items
globalStyle(`html[data-theme="dark"] .${analysisListItem}`, {
	color: darkThemeVars.color.text,
});

export const rawResponse = style({
	"@layer": {
		[components]: {
			background: lightThemeVars.color.surface,
			padding: "1rem",
			borderRadius: "0.375rem",
			overflowX: "auto",
			whiteSpace: "pre-wrap",
			fontFamily: "'IBM Plex Mono', monospace",
			fontSize: "0.875rem",
			transition: "background-color 0.3s ease",
		},
	},
});

// Dark theme styles for raw response
globalStyle(`html[data-theme="dark"] .${rawResponse}`, {
	background: darkThemeVars.color.surface,
});

export const metadata = style([
	typographyLevel5,
	{
		"@layer": {
			[components]: {
				marginTop: "1rem",
				paddingTop: "1rem",
				borderTop: "1px solid #bae6fd",
				color: lightThemeVars.color.textSecondary,
				fontSize: "0.875rem",
				fontFamily: "'IBM Plex Mono', monospace",
				transition: "color 0.3s ease, border-color 0.3s ease",
			},
		},
	},
]);

// Dark theme styles for metadata
globalStyle(`html[data-theme="dark"] .${metadata}`, {
	color: darkThemeVars.color.textSecondary,
	borderColor: "rgba(59, 130, 246, 0.3)",
});

// --- COPILOT KIT RETRO OVERRIDES FOR CRT EFFECT ---
globalStyle(".copilot-container", {
	fontFamily: "'IBM Plex Mono', monospace !important",
	backgroundColor: "transparent !important",
});

globalStyle(".copilot-container .copilot-chat", {
	backgroundColor: "transparent !important",
	border: "none !important",
	fontFamily: "'IBM Plex Mono', monospace !important",
	height: "100% !important",
});

globalStyle(".copilot-container .copilot-chat-header", {
	backgroundColor: `${retroColors.roland808.background} !important`,
	borderBottom: `2px solid ${retroColors.roland808.yellow} !important`,
	color: `${retroColors.roland808.yellow} !important`,
	fontFamily: "'Space Grotesk', sans-serif !important",
	textTransform: "uppercase",
	letterSpacing: "0.1em",
	padding: "16px !important",
	boxShadow: `0 0 10px ${retroColors.roland808.yellow} !important`,
});

globalStyle(".copilot-container .copilot-chat-messages", {
	backgroundColor: "transparent !important",
	color: `${retroColors.terminal.green} !important`,
	padding: "16px !important",
	flex: "1 !important",
});

globalStyle(".copilot-container .copilot-message", {
	backgroundColor: `${retroColors.roland808.panel} !important`,
	border: `1px solid ${retroColors.roland808.border} !important`,
	borderRadius: "4px !important",
	margin: "8px 0 !important",
	padding: "12px !important",
	color: `${retroColors.roland808.light} !important`,
	fontFamily: "'IBM Plex Mono', monospace !important",
	fontSize: "0.9rem !important",
	lineHeight: "1.4 !important",
	boxShadow: `inset 0 1px 3px rgba(0,0,0,0.6) !important`,
});

globalStyle(".copilot-container .copilot-message.user", {
	backgroundColor: `${retroColors.roland808.background} !important`,
	borderColor: `${retroColors.roland808.yellow} !important`,
	color: `${retroColors.roland808.yellow} !important`,
	textAlign: "right !important",
	marginLeft: "40px !important",
	boxShadow: `0 0 8px ${retroColors.roland808.yellow} !important`,
});

globalStyle(".copilot-container .copilot-message.assistant", {
	backgroundColor: `${retroColors.roland808.panel} !important`,
	borderColor: `${retroColors.roland808.border} !important`,
	color: `${retroColors.roland808.light} !important`,
	marginRight: "40px !important",
});

globalStyle(".copilot-container .copilot-input-container", {
	backgroundColor: `${retroColors.roland808.background} !important`,
	border: `2px solid ${retroColors.roland808.border} !important`,
	borderRadius: "4px !important",
	padding: "8px !important",
	margin: "16px !important",
	boxShadow: `inset 0 2px 4px rgba(0,0,0,0.6) !important`,
});

globalStyle(".copilot-container .copilot-input", {
	backgroundColor: "transparent !important",
	border: "none !important",
	color: `${retroColors.roland808.yellow} !important`,
	fontFamily: "'IBM Plex Mono', monospace !important",
	fontSize: "0.9rem !important",
	outline: "none !important",
});

globalStyle(".copilot-container .copilot-input::placeholder", {
	color: `${retroColors.roland808.border} !important`,
	fontStyle: "italic",
});

globalStyle(".copilot-container .copilot-send-button", {
	backgroundColor: `${retroColors.roland808.border} !important`,
	border: `2px solid ${retroColors.roland808.yellow} !important`,
	borderRadius: "4px !important",
	color: `${retroColors.roland808.yellow} !important`,
	fontFamily: "'IBM Plex Mono', monospace !important",
	fontWeight: "600 !important",
	padding: "8px 16px !important",
	textTransform: "uppercase !important",
	letterSpacing: "0.05em !important",
	cursor: "pointer !important",
	transition: "all 0.1s ease !important",
});

globalStyle(".copilot-container .copilot-send-button:hover", {
	backgroundColor: `${retroColors.roland808.yellow} !important`,
	color: `${retroColors.roland808.background} !important`,
	boxShadow: `0 0 8px ${retroColors.roland808.yellow} !important`,
});

globalStyle(".copilot-container .copilot-powered-by", {
	color: `${retroColors.roland808.border} !important`,
	fontSize: "0.7rem !important",
	fontFamily: "'IBM Plex Mono', monospace !important",
	textAlign: "center !important",
	textTransform: "uppercase !important",
	letterSpacing: "0.1em !important",
	padding: "8px !important",
});
