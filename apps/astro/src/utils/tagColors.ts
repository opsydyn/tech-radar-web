import type { TagType } from '../components/HeatMap';

// Define tag color mapping
const tagColors: Record<string, string> = {
  Database: '#2c5282', // Dark blue
  Frontend: '#805ad5', // Purple
  Backend: '#38a169', // Green
  Mobile: '#dd6b20', // Orange
  Cloud: '#3182ce', // Blue
  Qa: '#e53e3e', // Red
  default: '#718096', // Gray
};

/**
 * Get the color for a specific tag
 * @param tag The tag to get the color for
 * @returns The color for the tag
 */
export function getTagColor(tag: string): string {
  return tagColors[tag] || tagColors.default;
}

/**
 * Get the bright version of a tag color
 * @param tag The tag to get the bright color for
 * @returns The bright color for the tag
 */
export function getTagBrightColor(tag: string): string {
  // Create a brighter version of the tag color
  const baseColor = getTagColor(tag);
  
  // Simple brightening approach - you could use a more sophisticated color library
  // This is just a placeholder implementation
  return baseColor;
}

/**
 * Get the dark version of a tag color
 * @param tag The tag to get the dark color for
 * @returns The dark color for the tag
 */
export function getTagDarkColor(tag: string): string {
  // Create a darker version of the tag color
  const baseColor = getTagColor(tag);
  
  // Simple darkening approach - you could use a more sophisticated color library
  // This is just a placeholder implementation
  return baseColor;
}
