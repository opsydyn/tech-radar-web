import { atom } from "nanostores";
import { theme, getEffectiveTheme } from "./theme-store";

type RadarConfig = {
	bg: string;
	width: number;
	height: number;
	centerX: number;
	centerY: number;
	rings: Array<string>;
	ringRadiusIncrement: number;
	radius: number;
	gutter: number;
	ringNames: Array<string>;
	numberOfRings: number;
	ringWidth: number;
	maxRadius: number;
};

const bgColors = {
	light: "#ffffff",
	dark: "#000000",
	machine: "#000000",
};

const getBackgroundColor = (): string => {
	if (typeof window === "undefined") return bgColors.dark;
	const currentTheme = getEffectiveTheme();
	return bgColors[currentTheme] || bgColors.dark;
};

const width = 1000;
const height = 1000;
const centerX = width / 2;
const centerY = height / 2;
const rings = ["Adopt", "Trial", "Assess", "Hold"];
const ringRadiusIncrement = Math.min(centerX, centerY) / (rings.length + 1);
const radius = Math.min(centerX, centerY);
const gutter = 0.002;
const ringNames = ["Adopt", "Trial", "Assess", "Hold"];
const numberOfRings = ringNames.length + 1;
const ringWidth = radius / numberOfRings + 10;
const maxRadius = Math.min(centerX, centerY);

// Create the radar config atom with initial values
export const radarConfig = atom<RadarConfig>({
	bg: typeof window !== "undefined" ? getBackgroundColor() : bgColors.dark,
	width,
	height,
	centerX,
	centerY,
	rings,
	ringRadiusIncrement,
	radius,
	gutter,
	ringNames,
	numberOfRings,
	ringWidth,
	maxRadius,
});

export const miniMapState = atom({
	showMiniMap: true,
});

export function toggleMiniMap() {
	miniMapState.set({
		showMiniMap: !miniMapState.get().showMiniMap,
	});
}

function updateRadarBackground() {
	const currentTheme = getEffectiveTheme();
	const newBg = bgColors[currentTheme] || bgColors.dark;

	const currentConfig = radarConfig.get();
	if (currentConfig.bg !== newBg) {
		radarConfig.set({
			...currentConfig,
			bg: newBg,
		});
	}
}

if (typeof window !== "undefined") {
	theme.listen(() => {
		updateRadarBackground();
	});

	updateRadarBackground();
}
