import React, { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { radarConfig } from "~stores/radar-store";
import { theme, getEffectiveTheme } from "~stores/theme-store";

// Define quadrant types for better type safety
type QuadrantType = 'Tools' | 'Techniques' | 'Platforms' | 'languages-frameworks';

// Theme-dependent text colors for quadrants
const getQuadrantTextColors = (isDarkTheme: boolean) => ({
  Tools: isDarkTheme ? "#fff" : "#000",
  Techniques: isDarkTheme ? "#fff" : "#000",
  Platforms: isDarkTheme ? "#fff" : "#000",
  "languages-frameworks": isDarkTheme ? "#fff" : "#000",
});

type LabelTextProps = {
  name: string;
  index: number;
  labelRadius: number;
  quadrant: QuadrantType;
  position: "vertical" | "horizontal";
};

const textAnchorLookup = {
  vertical: {
    positive: "start",
    negative: "end",
  },
  horizontal: "middle",
} as const;

const LabelText = ({
  name,
  index,
  labelRadius,
  quadrant,
  position,
}: LabelTextProps) => {
  const currentTheme = useStore(theme);
  const [textColors, setTextColors] = useState(getQuadrantTextColors(true));
  
  // Update text colors based on theme
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme();
    setTextColors(getQuadrantTextColors(effectiveTheme === 'dark' || effectiveTheme === 'machine'));
  }, [currentTheme]);
  
  const key = `ring-${name}-${String(quadrant)}-${index}`;
  const color = textColors[quadrant];
  const textAnchor =
    position === "horizontal"
      ? textAnchorLookup.horizontal
      : textAnchorLookup.vertical[labelRadius > 0 ? "positive" : "negative"];

  const textProps = {
    textAnchor,
    fill: color,
    fontSize: 16,
    fontWeight: 900,
    dy: ".3em",
    y: position === "vertical" ? labelRadius : 0,
    x: position === "horizontal" ? labelRadius : 0,
  };

  return <Text key={key} {...textProps}>{name}</Text>;
};

export const Labels = () => {
  const { width, height, centerX, centerY, ringNames, ringWidth } =
    useStore(radarConfig);

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        {ringNames.map((name, i) => {
          const labelRadius = ringWidth * (i + 1);
          return (
            <React.Fragment key={i}>
              <LabelText
                name={name}
                index={i}
                labelRadius={labelRadius}
                quadrant="Tools"
                position="vertical"
              />
              <LabelText
                name={name}
                index={i}
                labelRadius={-labelRadius}
                quadrant="Platforms"
                position="vertical"
              />
              <LabelText
                name={name}
                index={i}
                labelRadius={labelRadius}
                quadrant="languages-frameworks"
                position="horizontal"
              />
              <LabelText
                name={name}
                index={i}
                labelRadius={-labelRadius}
                quadrant="Techniques"
                position="horizontal"
              />
            </React.Fragment>
          );
        })}
      </Group>
    </svg>
  );
};
