import { useStore } from "@nanostores/react";
import { Circle } from "@visx/shape";
import { radarConfig } from "~stores/radar-store";
import { theme, getEffectiveTheme } from "~stores/theme-store";
import { useEffect, useState } from "react";

// Theme-dependent ring colors
const ringColors = {
  light: "rgba(0, 0, 0, 0.6)", // Dark color for light theme
  dark: "rgba(255, 255, 255, 0.6)", // Light color for dark theme
  machine: "rgba(255, 255, 255, 0.6)" // Default to dark theme style for machine theme
};

export const RadarRings = () => {
  const { rings, ringRadiusIncrement } = useStore(radarConfig);
  const currentTheme = useStore(theme);
  const [ringColor, setRingColor] = useState(ringColors.dark);
  
  // Update ring color based on theme
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    setRingColor(ringColors[effectiveTheme] || ringColors.dark);
  }, [currentTheme]);
  
  return (
    <>
      {rings.map((ring, i) => (
        <Circle
          key={`ring-${ring}-${i}`}
          r={(i + 1) * ringRadiusIncrement}
          fill="none"
          stroke={ringColor}
          strokeWidth={1.5}
          strokeOpacity={0.8}
        />
      ))}
    </>
  );
};
