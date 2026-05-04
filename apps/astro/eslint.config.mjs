import vanillaExtract from "@antebudimir/eslint-plugin-vanilla-extract";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.css.ts"],
		ignores: ["src/**/theme-contract.css.ts"],
		extends: [vanillaExtract.configs.recommended],
		rules: {
			"vanilla-extract/concentric-order": "error",
		},
	},
]);
