/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/actions.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
	// Neon DB Connection (server-side only)
	readonly NEON_DATABASE_URL: string;

	// Debug settings (server-side only)
	readonly DB_DEBUG: string;

	// Public environment variables (available in both server and client code)
	readonly PUBLIC_API_BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
