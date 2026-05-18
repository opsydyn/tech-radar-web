import { atom } from "nanostores";
import type { Edition } from "~utils/editionHelpers";
import {
	findEditionByIdentity,
	getEditionIdentity,
	getLatestEdition,
} from "~utils/editionHelpers";

export const editionQueryParamKey = "edition";
export const selectedEditionStorageKey = "tech-radar.selected-edition";
export const selectedEdition = atom<Edition | null>(null);

const isBrowser = (): boolean => typeof window !== "undefined";

const readEditionIdentityFromUrl = (): string | null => {
	if (!isBrowser()) {
		return null;
	}

	return new URL(window.location.href).searchParams.get(editionQueryParamKey);
};

const readStoredEditionIdentity = (): string | null => {
	if (!isBrowser()) {
		return null;
	}

	return window.localStorage.getItem(selectedEditionStorageKey);
};

export const resolveInitialEditionSelection = (
	editions: readonly Edition[],
): Edition | null => {
	const requestedEditionIdentity =
		readEditionIdentityFromUrl() ?? readStoredEditionIdentity();
	const requestedEdition = requestedEditionIdentity
		? findEditionByIdentity(editions, requestedEditionIdentity)
		: undefined;

	return requestedEdition ?? getLatestEdition([...editions]);
};

export const persistEditionSelection = (edition: Edition): void => {
	if (!isBrowser()) {
		return;
	}

	const editionIdentity = getEditionIdentity(edition);
	window.localStorage.setItem(selectedEditionStorageKey, editionIdentity);

	const currentUrl = new URL(window.location.href);
	const currentQueryEdition = currentUrl.searchParams.get(editionQueryParamKey);

	if (currentQueryEdition === editionIdentity) {
		return;
	}

	currentUrl.searchParams.set(editionQueryParamKey, editionIdentity);
	window.history.replaceState(window.history.state, "", currentUrl.toString());
};
