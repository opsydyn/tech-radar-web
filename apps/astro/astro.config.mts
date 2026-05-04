import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import react from "@astrojs/react";
import svgx from "@svgx/vite-plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import expressiveCode from "astro-expressive-code";
import lighthouse from "astro-lighthouse";
import tunnel from "astro-tunnel";
import { defineConfig, fontProviders } from "astro/config";
import rehypePresetMinify from "rehype-preset-minify";
import remarkToc from "remark-toc";

const TTL = 60 * 60 * 24;

// https://astro.build/config
export default defineConfig({
	output: "static",
	experimental: {
		fonts: [
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
		],
	},
	integrations: [
		lighthouse(),
		tunnel(),
		expressiveCode({
			themes: ["github-dark", "github-light"],
			styleOverrides: {
				codeFontFamily: "IBM Plex Mono, Consolas, Monaco, monospace",
				borderRadius: "8px",
			},
			defaultProps: {
				showLineNumbers: true,
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
