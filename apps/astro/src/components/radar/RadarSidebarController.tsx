import { useEffect } from "react";
import {
	getRadarSidebarOpenPreference,
	setRadarSidebarOpenPreference,
	subscribeRadarSidebarOpenPreference,
} from "./radarSidebarState";

const sidebarOpenStateSelector = "[data-radar-sidebar-open-state]";
const sidebarTriggerSelector = "[data-radar-sidebar-trigger]";
const sidebarCloseSelector = "[data-radar-sidebar-close]";
const sidebarSwipeAreaSelector = "[data-radar-sidebar-swipe-area]";

const applySidebarOpenState = (isOpen: boolean) => {
	const openStateElements = document.querySelectorAll<HTMLElement>(
		sidebarOpenStateSelector,
	);

	for (const element of openStateElements) {
		element.dataset.open = String(isOpen);
	}
};

export const RadarSidebarController = () => {
	useEffect(() => {
		const openSidebar = () => setRadarSidebarOpenPreference(true);
		const closeSidebar = () => setRadarSidebarOpenPreference(false);
		const toggleSidebar = () =>
			setRadarSidebarOpenPreference(!getRadarSidebarOpenPreference());
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				closeSidebar();
			}
		};

		const trigger = document.querySelector<HTMLElement>(sidebarTriggerSelector);
		const closeButton =
			document.querySelector<HTMLElement>(sidebarCloseSelector);
		const swipeArea = document.querySelector<HTMLElement>(
			sidebarSwipeAreaSelector,
		);
		const unsubscribe = subscribeRadarSidebarOpenPreference(
			applySidebarOpenState,
		);

		trigger?.addEventListener("click", openSidebar);
		closeButton?.addEventListener("click", closeSidebar);
		swipeArea?.addEventListener("click", toggleSidebar);
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			trigger?.removeEventListener("click", openSidebar);
			closeButton?.removeEventListener("click", closeSidebar);
			swipeArea?.removeEventListener("click", toggleSidebar);
			window.removeEventListener("keydown", handleKeyDown);
			unsubscribe();
		};
	}, []);

	return null;
};
