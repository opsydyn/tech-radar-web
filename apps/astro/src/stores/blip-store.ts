import { atom } from 'nanostores';
import { getQuadrantColor, getQuadrantColorSolid, getQuadrantColorDark } from '../utils/quadrantColors';

// Simple interface focusing just on color state
export interface BlipColorState {
  quadrantColor: string;
  quadrantColorSolid: string;
  quadrantColorDark: string;
}

// Create a store with initial empty values
export const blipColors = atom<BlipColorState>({
  quadrantColor: '',
  quadrantColorSolid: '',
  quadrantColorDark: ''
});

// Helper function to set all colors at once
export function setBlipColors(colors: BlipColorState) {
  blipColors.set(colors);
}

// Helper to get CSS variable string for inline style attribute
export function getColorVariablesString(): string {
  const colors = blipColors.get();
  console.log('colors', colors);
  return `
    --quadrant-color: ${colors.quadrantColor};
    --quadrant-color-solid: ${colors.quadrantColorSolid};
    --quadrant-color-dark: ${colors.quadrantColorDark};
  `;
}

// Helper to apply colors directly to an element
export function applyColorsToElement(element: HTMLElement): void {
  const colors = blipColors.get();
  console.log('colors', colors);
  
  if (!element) return;
  
  // Apply each color as a separate CSS property
  element.style.setProperty('--quadrant-color', colors.quadrantColor);
  element.style.setProperty('--quadrant-color-solid', colors.quadrantColorSolid);
  element.style.setProperty('--quadrant-color-dark', colors.quadrantColorDark);
}

// Set colors based on quadrant name and update the store
export function setColorsFromQuadrant(quadrant: string): BlipColorState {
  const colors = {
    quadrantColor: getQuadrantColor(quadrant),
    quadrantColorSolid: getQuadrantColorSolid(quadrant),
    quadrantColorDark: getQuadrantColorDark(quadrant)
  };
  
  // Update the store
  setBlipColors(colors);
  
  return colors;
}