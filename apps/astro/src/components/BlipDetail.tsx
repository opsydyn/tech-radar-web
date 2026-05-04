import { useEffect, useState } from "react";
import type { Blip } from "~types/radar-types";
import { getBlipPath } from "~utils/blipRouting";
import { formatDate } from "~utils/dateFormatter";

type BlipDetailProps = {
	blip: Blip | null;
	quadrantColor: string;
};

const getDescription = (desc: unknown) =>
	typeof desc === "string" ? desc.trim() : "awaiting description";

const normalizeMoveDate = (dateValue: Blip["move"][number][1]): string =>
	dateValue instanceof Date ? dateValue.toISOString() : dateValue;

const formatMoveDate = (dateValue: Blip["move"][number][1]): string =>
	formatDate(dateValue);

export const BlipDetail = ({ blip, quadrantColor }: BlipDetailProps) => {
	const [isDarkTheme, setIsDarkTheme] = useState(false);

	useEffect(() => {
		const checkTheme = () => {
			const theme = document.documentElement.getAttribute("data-theme");
			setIsDarkTheme(theme === "dark");
		};

		checkTheme();

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.attributeName === "data-theme") {
					checkTheme();
				}
			}
		});

		observer.observe(document.documentElement, { attributes: true });

		return () => observer.disconnect();
	}, []);

	const colors = {
		cardBg: isDarkTheme ? "#333333" : "#f0f0f0",
		headingText: isDarkTheme ? "#ffffff" : "#000000",
		bodyText: isDarkTheme ? "#e0e0e0" : "#000000",
		linkText: isDarkTheme ? "#a0d8ff" : "#000000",
		movementBg: isDarkTheme ? "#2a2a2a" : "#f0f0f0",
	};

	if (!blip) {
		return (
			<div
				style={{
					fontFamily: "'Space Grotesk', sans-serif",
					fontSize: "1rem",
					color: isDarkTheme ? "#aaaaaa" : "#aaaaaa",
				}}
			>
				Select a blip to see details
			</div>
		);
	}

	return (
		<div
			style={
				{
					"--quadrant-color": quadrantColor,
					"--quadrant-color-solid": quadrantColor,
					"--quadrant-color-dark": quadrantColor,
				} as React.CSSProperties
			}
		>
			<h1
				style={{
					fontFamily: "'Space Grotesk', sans-serif",
					fontSize: "1.8rem",
					fontWeight: 700,
					color: colors.headingText,
					marginBottom: "0.5rem",
					paddingBottom: "0.5rem",
					borderBottom: `3px solid ${quadrantColor}`,
				}}
			>
				{blip.name}
			</h1>

			<div
				style={{
					fontFamily: "'IBM Plex Mono', monospace",
					fontSize: "1rem",
					color: colors.bodyText,
					marginBottom: "1rem",
					paddingLeft: "0.5rem",
				}}
			>
				{getDescription(blip.description)}
			</div>

			<div
				style={{
					fontFamily: "'IBM Plex Mono', monospace",
					fontSize: "0.8rem",
					color: colors.bodyText,
				}}
			>
				<b>Ring:</b> {blip.ring}
			</div>

			<div
				style={{
					fontFamily: "'IBM Plex Mono', monospace",
					fontSize: "0.8rem",
					color: colors.bodyText,
					marginBottom: "1.5rem",
				}}
			>
				<b>Quadrant:</b> {blip.quadrant}
			</div>

			<p
				style={{
					fontFamily: "'IBM Plex Mono', monospace",
					fontSize: "0.9rem",
					lineHeight: "1.5",
					color: colors.bodyText,
					backgroundColor: colors.cardBg,
					padding: "0.75rem",
					borderRadius: "4px",
					marginBottom: "1rem",
					borderLeft: `4px solid ${quadrantColor}`,
				}}
			>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
				nunc vel tincidunt lacinia, nunc nisl aliquam nunc, eget aliquam nunc
				nisl eu nunc. Pellentesque habitant morbi tristique senectus et netus et
				malesuada fames ac turpis egestas.
			</p>

			<p
				style={{
					fontFamily: "'IBM Plex Mono', monospace",
					fontSize: "0.9rem",
					lineHeight: "1.5",
					color: colors.bodyText,
					backgroundColor: colors.cardBg,
					padding: "0.75rem",
					borderRadius: "4px",
					marginBottom: "1rem",
					borderLeft: `4px solid ${quadrantColor}`,
				}}
			>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod,
				nunc vel tincidunt lacinia, nunc nisl aliquam nunc, eget aliquam nunc
				nisl eu nunc. Pellentesque habitant morbi tristique senectus et netus et
				malesuada fames ac turpis egestas.
			</p>

			{blip.move && blip.move.length > 0 && (
				<div style={{ marginTop: "1.5rem", marginBottom: "1.5rem" }}>
					<h3
						style={{
							fontFamily: "'Space Grotesk', sans-serif",
							fontSize: "1.1rem",
							fontWeight: 600,
							color: colors.headingText,
							backgroundColor: colors.movementBg,
							padding: "0.5rem 0.75rem",
							borderRadius: "4px",
							marginBottom: "0.75rem",
							boxShadow: `2px 0 0 0 ${quadrantColor}40`,
						}}
					>
						Movement History
					</h3>
					<div
						style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
					>
						{blip.move.map(([type, date]) => (
							<div
								key={`${blip.id}-${type}-${normalizeMoveDate(date)}`}
								style={{
									display: "flex",
									alignItems: "center",
									gap: "0.5rem",
									fontFamily: "'IBM Plex Mono', monospace",
									fontSize: "0.75rem",
									backgroundColor: colors.cardBg,
									padding: "0.5rem 0.75rem",
									borderRadius: "4px",
									marginBottom: "0.25rem",
									borderLeft: `4px solid ${quadrantColor}`,
									boxShadow: `2px 0 0 0 ${quadrantColor}40`,
								}}
							>
								<span
									style={{
										color:
											type === "grow"
												? isDarkTheme
													? "#4CAF50"
													: "#006400"
												: type === "go"
													? isDarkTheme
														? "#FF5252"
														: "#8B0000"
													: isDarkTheme
														? "#2196F3"
														: "#000080",
										fontWeight: "bold",
									}}
								>
									{type.toUpperCase()}
								</span>
								<span style={{ color: colors.bodyText }}>
									{formatMoveDate(date)}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			<a
				href={getBlipPath(blip)}
				style={{
					display: "inline-block",
					fontFamily: "'IBM Plex Mono', monospace",
					fontSize: "0.85rem",
					fontWeight: 600,
					color: colors.linkText,
					textDecoration: "underline",
					marginTop: "1rem",
				}}
			>
				{blip.name} full details
			</a>
		</div>
	);
};
