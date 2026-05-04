import vanillaExtract from "@antebudimir/eslint-plugin-vanilla-extract";
import tsParser from "@typescript-eslint/parser";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["src/**/*.css.ts"],
		ignores: ["src/**/theme-contract.css.ts"],
		languageOptions: {
			parser: tsParser,
			ecmaVersion: "latest",
			sourceType: "module",
		},
		extends: [vanillaExtract.configs.recommended],
		rules: {
			"vanilla-extract/concentric-order": "warn",
			"vanilla-extract/no-empty-style-blocks": "warn",
			"vanilla-extract/no-zero-unit": "warn",
		},
	},
]);
