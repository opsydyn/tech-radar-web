import { layer } from "@vanilla-extract/css";

// Base layers in cascade order
export const reset = layer("reset");
export const layout = layer("layout");
export const typography = layer("typography");
export const components = layer("components");

// Nested component layers for better organization
export const hero = layer({ parent: components }, "hero");
export const navigation = layer({ parent: components }, "navigation");
export const details = layer({ parent: components }, "details");
export const relatedBlips = layer({ parent: components }, "relatedBlips");
export const adr = layer({ parent: components }, "adr");

// Theme layer has highest specificity
export const theme = layer("theme");
