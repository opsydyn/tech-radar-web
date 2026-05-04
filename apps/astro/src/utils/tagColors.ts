// Define tag color mapping
const tagColors: Record<string, string> = {
	Database: "#2c5282", // Dark blue
	Frontend: "#805ad5", // Purple
	Backend: "#38a169", // Green
	Mobile: "#dd6b20", // Orange
	Cloud: "#3182ce", // Blue
	Qa: "#e53e3e", // Red
	default: "#718096", // Gray
};

/**
 * Get the color for a specific tag
 * @param tag The tag to get the color for
 * @returns The color for the tag
 */
export function getTagColor(tag: string): string {
	return tagColors[tag] || tagColors.default;
}
