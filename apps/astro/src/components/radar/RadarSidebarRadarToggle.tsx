import { useStore } from "@nanostores/react";
import { useEffect } from "react";
import { animationEnabled } from "~stores/animation-store";
import * as styles from "./RadarSidebar.css";

export const RadarSidebarRadarToggle = () => {
	const isRadarEnabled = useStore(animationEnabled);

	useEffect(() => {
		const htmlElement = document.documentElement;

		if (isRadarEnabled) {
			htmlElement.classList.remove("animations-disabled");
			htmlElement.classList.add("animations-enabled");
			return;
		}

		htmlElement.classList.add("animations-disabled");
		htmlElement.classList.remove("animations-enabled");
	}, [isRadarEnabled]);

	const handleRadarToggle = () => {
		animationEnabled.set(!animationEnabled.get());
	};

	return (
		<button
			type="button"
			className={styles.radarToggleButton}
			onClick={handleRadarToggle}
			data-base-ui-swipe-ignore=""
		>
			Radar: {isRadarEnabled ? "ON" : "OFF"}
		</button>
	);
};
