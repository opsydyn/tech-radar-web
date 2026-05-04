import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import svgx from "@svgx/vite-plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import expressiveCode from "astro-expressive-code";
import tunnel from "astro-tunnel";
import { defineConfig, fontProviders } from "astro/config";
import rehypePresetMinify from "rehype-preset-minify";
import remarkToc from "remark-toc";

const site = "https://opsydyn.github.io";
const base = "/tech-radar-web";

const fonts = [
	{
		provider: fontProviders.google(),
		name: "Space Grotesk",
		cssVariable: "--font-space-grotesk",
	},
	{
		provider: fontProviders.google(),
		name: "IBM Plex Mono",
		cssVariable: "--font-ibm-plex-mono",
	},
];

// https://astro.build/config
const config = defineConfig({
	site,
	base,
	output: "static",
	// Keep the exported config type portable after Astro 6 font-provider inference.
	fonts: fonts as never,
	integrations: [
		tunnel(),
		expressiveCode({
			themes: ["github-dark", "github-light"],
			styleOverrides: {
				codeFontFamily: "IBM Plex Mono, Consolas, Monaco, monospace",
				borderRadius: "8px",
			},
			defaultProps: {
				wrap: true,
			},
		}),
		mdx({
			optimize: true,
			syntaxHighlight: false, // Disable Shiki since we're using Expressive Code
			remarkPlugins: [remarkToc],
			rehypePlugins: [rehypePresetMinify],
			remarkRehype: {
				footnoteLabel: "Footnotes",
			},
			gfm: false,
		}),
		react(),
	],

	vite: {
		plugins: [vanillaExtractPlugin(), svgx()],
	},
});

export default config;
