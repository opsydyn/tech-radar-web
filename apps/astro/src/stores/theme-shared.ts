export type Theme = "light" | "dark" | "machine";
export type ResolvedTheme = Exclude<Theme, "machine">;

export const THEME_LIGHT: ResolvedTheme = "light";
export const THEME_DARK: ResolvedTheme = "dark";
export const THEME_MACHINE: Theme = "machine";
export const THEME_MEDIA_QUERY = "(prefers-color-scheme: dark)";
export const THEME_STORAGE_KEY = "data-theme";
export const THEME_ATTRIBUTE = "data-theme";

const LIGHT_BACKGROUND = "#f5f5f5";
const LIGHT_TEXT = "#333333";
const DARK_BACKGROUND = "#0E1218";
const DARK_TEXT = "#ffffff";

export const resolveThemePreference = (
	storedTheme: Theme | null,
	prefersDark: boolean,
): ResolvedTheme => {
	if (storedTheme === THEME_DARK || storedTheme === THEME_LIGHT) {
		return storedTheme;
	}

	return prefersDark ? THEME_DARK : THEME_LIGHT;
};

export const themeHeadBootstrapScript = `(function(){
	try {
		var storedTheme = localStorage.getItem('${THEME_STORAGE_KEY}');
		var prefersDark = window.matchMedia('${THEME_MEDIA_QUERY}').matches;
		var resolvedTheme = storedTheme === '${THEME_DARK}'
			? '${THEME_DARK}'
			: storedTheme === '${THEME_LIGHT}'
				? '${THEME_LIGHT}'
				: (prefersDark ? '${THEME_DARK}' : '${THEME_LIGHT}');
		var root = document.documentElement;
		root.setAttribute('${THEME_ATTRIBUTE}', resolvedTheme);
		root.style.colorScheme = resolvedTheme;
	} catch (_) {}
})();`;

export const themeHeadCriticalStyles = `
	html {
		background: ${LIGHT_BACKGROUND};
		color: ${LIGHT_TEXT};
		color-scheme: light;
	}

	body {
		background: ${LIGHT_BACKGROUND};
		color: ${LIGHT_TEXT};
	}

	html[${THEME_ATTRIBUTE}='${THEME_LIGHT}'] {
		background: ${LIGHT_BACKGROUND};
		color: ${LIGHT_TEXT};
		color-scheme: light;
	}

	html[${THEME_ATTRIBUTE}='${THEME_LIGHT}'] body {
		background: ${LIGHT_BACKGROUND};
		color: ${LIGHT_TEXT};
	}

	html[${THEME_ATTRIBUTE}='${THEME_DARK}'] {
		background: ${DARK_BACKGROUND};
		color: ${DARK_TEXT};
		color-scheme: dark;
	}

	html[${THEME_ATTRIBUTE}='${THEME_DARK}'] body {
		background: ${DARK_BACKGROUND};
		color: ${DARK_TEXT};
	}
`;
