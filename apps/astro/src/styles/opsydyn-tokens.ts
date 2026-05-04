// Opsydyn Design Tokens (shared)
// Centralized palette and design tokens for use across all styles

export const opsydynTokens = {
	// Color Palette - WCAG AAA compliant
	colors: {
		opsInk: "#1A1A1A", // primary text, lines
		paper: "#F8F8F2", // background
		nodeGray: "#44475A", // secondary text, outlines
		pulseBlue: "#335681", // links, focus
		graphViolet: "#4F3AC4", // active nodes
		syntaxGreen: "#405B29", // success
		warnAmber: "#894029", // warning
		opsRed: "#91333C", // error
	},

	// Typography
	typography: {
		fontFamily: {
			mono: "'IBM Plex Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
			display: "'Space Grotesk', sans-serif",
		},
		fontSize: {
			xs: "0.75rem", // 12px
			sm: "0.875rem", // 14px
			base: "1rem", // 16px
			lg: "1.125rem", // 18px
			xl: "1.25rem", // 20px
			"2xl": "1.5rem", // 24px
			"3xl": "1.875rem", // 30px
			"4xl": "2.25rem", // 36px
			"5xl": "3rem", // 48px
		},
		fontWeight: {
			normal: "400",
			medium: "500",
			semibold: "600",
			bold: "700",
		},
		lineHeight: {
			tight: "1.25",
			normal: "1.5",
			relaxed: "1.75",
		},
	},

	// Spacing
	spacing: {
		xs: "0.25rem", // 4px
		sm: "0.5rem", // 8px
		md: "1rem", // 16px
		lg: "1.5rem", // 24px
		xl: "2rem", // 32px
		"2xl": "3rem", // 48px
		"3xl": "4rem", // 64px
		"4xl": "6rem", // 96px
		"5xl": "8rem", // 128px
	},

	// Layout
	layout: {
		maxWidth: {
			sm: "40rem", // 640px
			md: "48rem", // 768px
			lg: "64rem", // 1024px
			xl: "80rem", // 1280px
		},
		breakpoints: {
			sm: "640px",
			md: "768px",
			lg: "1024px",
			xl: "1280px",
		},
	},

	// Shadows
	shadows: {
		subtle: "0 1px 3px rgba(0, 0, 0, 0.1)",
		medium: "0 4px 12px rgba(0, 0, 0, 0.15)",
		strong: "0 8px 24px rgba(0, 0, 0, 0.2)",
	},

	// Border radius
	borderRadius: {
		sm: "0.125rem", // 2px
		md: "0.25rem", // 4px
		lg: "0.5rem", // 8px
		xl: "1rem", // 16px
	},

	// Transitions
	transition: {
		fast: "0.1s ease-in-out",
		normal: "0.2s ease-in-out",
		slow: "0.3s ease-in-out",
	},
} as const;
