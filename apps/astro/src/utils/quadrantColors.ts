// Quadrant colors matching the radar visualization
export const quadrantColors = {
  Tools: "rgb(80, 197, 241, 0.9)",       // Blue
  Techniques: "rgb(255, 163, 71, 0.9)",  // Orange
  Platforms: "rgb(125, 110, 238, 0.9)",  // Purple
  "languages-frameworks": "rgb(81, 245, 141, 0.9)", // Green
} as const;

// Solid versions (without transparency) for UI elements
export const quadrantColorsSolid = {
  Tools: "rgb(80, 197, 241)",       // Blue
  Techniques: "rgb(255, 163, 71)",  // Orange
  Platforms: "rgb(125, 110, 238)",  // Purple
  "languages-frameworks": "rgb(81, 245, 141)", // Green
} as const;

// Darker versions for text and accents
export const quadrantColorsDark = {
  Tools: "rgb(40, 150, 190)",       // Darker Blue
  Techniques: "rgb(220, 130, 40)",  // Darker Orange
  Platforms: "rgb(100, 85, 200)",   // Darker Purple
  "languages-frameworks": "rgb(50, 190, 100)", // Darker Green
} as const;

// Helper function to get the color for a quadrant
export function getQuadrantColor(quadrant?: string): string {
  if (!quadrant) return "rgb(150, 150, 150)"; // Default gray
  
  const key = quadrant.toLowerCase() === "languages & frameworks" 
    ? "languages-frameworks" 
    : quadrant as keyof typeof quadrantColors;
    
  return quadrantColors[key] || "rgb(150, 150, 150)";
}

// Helper function to get the solid color for a quadrant
export function getQuadrantColorSolid(quadrant?: string): string {
  if (!quadrant) return "rgb(150, 150, 150)"; // Default gray
  
  const key = quadrant.toLowerCase() === "languages & frameworks" 
    ? "languages-frameworks" 
    : quadrant as keyof typeof quadrantColorsSolid;
    
  return quadrantColorsSolid[key] || "rgb(150, 150, 150)";
}

// Helper function to get the dark color for a quadrant
export function getQuadrantColorDark(quadrant?: string): string {
  if (!quadrant) return "rgb(100, 100, 100)"; // Default dark gray
  
  const key = quadrant.toLowerCase() === "languages & frameworks" 
    ? "languages-frameworks" 
    : quadrant as keyof typeof quadrantColorsDark;
    
  return quadrantColorsDark[key] || "rgb(100, 100, 100)";
}
