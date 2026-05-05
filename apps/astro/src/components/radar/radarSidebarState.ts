const sidebarPreferenceKey = "tech-radar.sidebar-open";
const sidebarPreferenceChangedEvent = "tech-radar:sidebar-open-changed";

type SidebarPreferenceChangedEvent = CustomEvent<{ isOpen: boolean }>;

const hasBrowserStorage = () => typeof window !== "undefined";

export const getRadarSidebarOpenPreference = (): boolean => {
	if (!hasBrowserStorage()) {
		return true;
	}

	return window.localStorage.getItem(sidebarPreferenceKey) !== "false";
};

const dispatchSidebarPreferenceChanged = (isOpen: boolean) => {
	window.dispatchEvent(
		new CustomEvent(sidebarPreferenceChangedEvent, {
			detail: { isOpen },
		}) satisfies SidebarPreferenceChangedEvent,
	);
};

export const subscribeRadarSidebarOpenPreference = (
	listener: (isOpen: boolean) => void,
): (() => void) => {
	if (!hasBrowserStorage()) {
		return () => undefined;
	}

	const handlePreferenceChanged = (event: Event) => {
		listener((event as SidebarPreferenceChangedEvent).detail.isOpen);
	};
	const handleStorageChanged = (event: StorageEvent) => {
		if (event.key === sidebarPreferenceKey) {
			listener(event.newValue !== "false");
		}
	};

	listener(getRadarSidebarOpenPreference());
	window.addEventListener(
		sidebarPreferenceChangedEvent,
		handlePreferenceChanged,
	);
	window.addEventListener("storage", handleStorageChanged);

	return () => {
		window.removeEventListener(
			sidebarPreferenceChangedEvent,
			handlePreferenceChanged,
		);
		window.removeEventListener("storage", handleStorageChanged);
	};
};

export const setRadarSidebarOpenPreference = (isOpen: boolean): void => {
	if (!hasBrowserStorage()) {
		return;
	}

	window.localStorage.setItem(sidebarPreferenceKey, String(isOpen));
	dispatchSidebarPreferenceChanged(isOpen);
};
