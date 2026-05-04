import { LegendItem, LegendLabel } from "@visx/legend";
import { getEffectiveTheme } from "~stores/theme-store";

function LegendBase({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	const effectiveTheme = getEffectiveTheme();
	const isDarkTheme = effectiveTheme === "dark" || effectiveTheme === "machine";

	return (
		<div className={`legend ${isDarkTheme ? "dark" : "light"}`}>
			<div className="title">{title}</div>
			{children}
		</div>
	);
}

export const LegendMoveState = () => {
	const effectiveTheme = getEffectiveTheme();
	const textColor =
		effectiveTheme === "dark" || effectiveTheme === "machine"
			? "#fff"
			: "#333333";

	return (
		<LegendBase title="Movement">
			<LegendItem
				style={{ color: textColor, fontFamily: "IBM Plex Mono, monospace" }}
			>
				<svg width={24} height={24} style={{ verticalAlign: "middle" }}>
					<title>Moved in</title>
					<text
						x={12}
						y={16}
						fontSize={16}
						textAnchor="middle"
						fill={textColor}
						aria-label="Moved in"
					>
						▲
					</text>
				</svg>
				<LegendLabel
					align="left"
					margin="0 0 0 4px"
					style={{ color: textColor, fontFamily: "IBM Plex Mono, monospace" }}
				>
					Moved in
				</LegendLabel>
			</LegendItem>
			<LegendItem style={{ color: textColor }}>
				<svg width={24} height={24} style={{ verticalAlign: "middle" }}>
					<title>Moved out</title>
					<text
						x={12}
						y={16}
						fontSize={16}
						textAnchor="middle"
						fill={textColor}
						aria-label="Moved out"
					>
						▼
					</text>
				</svg>
				<LegendLabel
					align="left"
					margin="0 0 0 4px"
					style={{ color: textColor }}
				>
					Moved out
				</LegendLabel>
			</LegendItem>
		</LegendBase>
	);
};
