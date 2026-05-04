const baseUrl = import.meta.env.BASE_URL ?? "/";
const trimmedBaseUrl = baseUrl === "/" ? "/" : baseUrl.replace(/\/$/, "");

const hasProtocol = (href: string): boolean =>
	/^[a-zA-Z][a-zA-Z\d+.-]*:/.test(href) || href.startsWith("//");

export const withBasePath = (path: `/${string}` | "/"): string => {
	if (trimmedBaseUrl === "/") {
		return path;
	}

	return path === "/" ? `${trimmedBaseUrl}/` : `${trimmedBaseUrl}${path}`;
};

export const withBaseHref = (href: string): string => {
	if (href.startsWith("#") || hasProtocol(href) || !href.startsWith("/")) {
		return href;
	}

	return withBasePath(href as `/${string}` | "/");
};
