import { useStore } from "@nanostores/react";
import { Group } from "@visx/group";
import { Text } from "@visx/text";
import { Fragment, memo, useEffect, useState } from "react";
import { radarConfig } from "~stores/radar-store";
import { getEffectiveTheme, theme } from "~stores/theme-store";

// Theme-dependent text colors for quadrants
const getQuadrantTextColors = (isDarkTheme: boolean) => ({
	Tools: isDarkTheme ? "#fff" : "#000",
	Techniques: isDarkTheme ? "#fff" : "#000",
	Platforms: isDarkTheme ? "#fff" : "#000",
	"languages-frameworks": isDarkTheme ? "#fff" : "#000",
});

type LabelTextProps = {
	name: string;
	labelRadius: number;
	color: string;
	position: "vertical" | "horizontal";
};

const textAnchorLookup = {
	vertical: {
		positive: "start",
		negative: "end",
	},
	horizontal: "middle",
} as const;

const LabelText = ({ name, labelRadius, color, position }: LabelTextProps) => {
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

	return <Text {...textProps}>{name}</Text>;
};

export const Labels = memo(function Labels() {
	const { width, height, centerX, centerY, ringNames, ringWidth } =
		useStore(radarConfig);
	const currentTheme = useStore(theme);
	const [textColors, setTextColors] = useState(getQuadrantTextColors(true));

	// Update text colors based on theme
	useEffect(() => {
		const effectiveTheme =
			currentTheme === "machine" ? getEffectiveTheme() : currentTheme;
		setTextColors(
			getQuadrantTextColors(
				effectiveTheme === "dark" || effectiveTheme === "machine",
			),
		);
	}, [currentTheme]);

	return (
		<svg width={width} height={height} aria-hidden="true" focusable="false">
			<Group top={centerY} left={centerX}>
				{ringNames.map((name, i) => {
					const labelRadius = ringWidth * (i + 1);
					return (
						<Fragment key={name}>
							<LabelText
								name={name}
								labelRadius={labelRadius}
								color={textColors.Tools}
								position="vertical"
							/>
							<LabelText
								name={name}
								labelRadius={-labelRadius}
								color={textColors.Platforms}
								position="vertical"
							/>
							<LabelText
								name={name}
								labelRadius={labelRadius}
								color={textColors["languages-frameworks"]}
								position="horizontal"
							/>
							<LabelText
								name={name}
								labelRadius={-labelRadius}
								color={textColors.Techniques}
								position="horizontal"
							/>
						</Fragment>
					);
				})}
			</Group>
		</svg>
	);
});
