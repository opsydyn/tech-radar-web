// Styling domain for UbiquitousLanguageCloud
// Following CLAUDE.md standards: smart constructors, composition, no ternary hell

import { Match, Option } from "effect";

// ============================================================================
// Domain Types for Font Classification (Discriminated Union)
// ============================================================================

export type FontTier = 
  | { readonly type: 'Hero'; readonly size: number }
  | { readonly type: 'Primary'; readonly size: number }
  | { readonly type: 'Secondary'; readonly size: number }
  | { readonly type: 'Supporting'; readonly size: number }
  | { readonly type: 'Context'; readonly size: number };

export type WordStyle = {
  readonly fontWeight: string;
  readonly textShadow: string;
  readonly opacity: number;
};

export type MousePosition = {
  readonly x: number;
  readonly y: number;
};

// ============================================================================
// Smart Constructors for Font Tiers (Pure Functions)
// ============================================================================

export const createFontTier = (fontSize: number): FontTier => {
  return Match.value(fontSize).pipe(
    Match.when((size) => size >= 60, (size): FontTier => ({ type: 'Hero', size })),
    Match.when((size) => size >= 40, (size): FontTier => ({ type: 'Primary', size })),
    Match.when((size) => size >= 28, (size): FontTier => ({ type: 'Secondary', size })),
    Match.when((size) => size >= 20, (size): FontTier => ({ type: 'Supporting', size })),
    Match.orElse((size): FontTier => ({ type: 'Context', size }))
  );
};

// ============================================================================
// Pure Style Composition Functions (Replace Ternary Hell)
// ============================================================================

export const createFontWeight = (tier: FontTier): string =>
  Match.value(tier).pipe(
    Match.when({ type: 'Hero' }, () => 'bold'),
    Match.when({ type: 'Primary' }, () => '600'),
    Match.when({ type: 'Secondary' }, () => '500'),
    Match.when({ type: 'Supporting' }, () => '400'),
    Match.when({ type: 'Context' }, () => '300'),
    Match.exhaustive
  );

export const createTextShadow = (tier: FontTier): string =>
  Match.value(tier).pipe(
    Match.when({ type: 'Hero' }, () => '3px 3px 6px rgba(0,0,0,0.4)'),
    Match.when({ type: 'Primary' }, () => '2px 2px 4px rgba(0,0,0,0.3)'),
    Match.when({ type: 'Secondary' }, () => '1px 1px 3px rgba(0,0,0,0.25)'),
    Match.when({ type: 'Supporting' }, () => '1px 1px 2px rgba(0,0,0,0.2)'),
    Match.when({ type: 'Context' }, () => 'none'),
    Match.exhaustive
  );

export const createOpacity = (tier: FontTier): number =>
  Match.value(tier).pipe(
    Match.when({ type: 'Hero' }, () => 1.0),
    Match.when({ type: 'Primary' }, () => 1.0),
    Match.when({ type: 'Secondary' }, () => 0.95),
    Match.when({ type: 'Supporting' }, () => 0.85),
    Match.when({ type: 'Context' }, () => 0.75),
    Match.exhaustive
  );

// ============================================================================
// Composition Function (Combines All Styling Logic)
// ============================================================================

export const createWordStyle = (fontSize: number): WordStyle => {
  const tier = createFontTier(fontSize);
  
  return {
    fontWeight: createFontWeight(tier),
    textShadow: createTextShadow(tier),
    opacity: createOpacity(tier),
  };
};

// ============================================================================
// Mouse Position Smart Constructors (Eliminate Ternary Logic)
// ============================================================================

export const createMousePosition = (
  event: { clientX: number; clientY: number },
  containerRect: DOMRect | null
): MousePosition => {
  const fallbackPosition = { x: event.clientX + 10, y: event.clientY - 10 };
  
  return Option.match(
    Option.fromNullable(containerRect),
    {
      onSome: (rect) => ({
        x: event.clientX - rect.left + 10,
        y: event.clientY - rect.top - 10,
      }),
      onNone: () => fallbackPosition,
    }
  );
};

// ============================================================================
// Tooltip Style Composition
// ============================================================================

export const createTooltipStyle = () => ({
  backgroundColor: "rgba(0, 0, 0, 0.95)",
  color: "#ffffff",
  border: "1px solid #333",
  borderRadius: "8px",
  padding: "16px",
  fontSize: "14px",
  fontFamily: "IBM Plex Mono, Consolas, Monaco, monospace",
  lineHeight: "1.5",
  maxWidth: "350px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
});

// ============================================================================
// Base Word Style Composition
// ============================================================================

export const createBaseWordStyle = () => ({
  cursor: "pointer" as const,
});

// ============================================================================
// Complete Style Composition (Combines Everything)
// ============================================================================

export const createCompleteWordStyle = (fontSize: number) => {
  const wordStyle = createWordStyle(fontSize);
  const baseStyle = createBaseWordStyle();
  
  return {
    ...baseStyle,
    ...wordStyle,
  };
};

// ============================================================================
// Simple Click-Based Tooltip Positioning (KISS)
// ============================================================================

// ============================================================================
// Pure Bounds Validation Functions
// ============================================================================

export const createTooltipOffset = (basePosition: MousePosition): MousePosition => ({
  x: basePosition.x + 20, // Offset to right of click
  y: basePosition.y - 60, // Offset above click
});

export const constrainTooltipX = (x: number, containerWidth: number): number => {
  const minX = 10;
  const maxX = containerWidth - 200;
  return Math.max(minX, Math.min(x, maxX));
};

export const constrainTooltipY = (y: number, containerHeight: number): number => {
  const minY = 10;
  const maxY = containerHeight - 50;
  return Math.max(minY, Math.min(y, maxY));
};

export const createStaticTooltipPosition = (
  basePosition: MousePosition,
  containerDimensions: { width: number; height: number }
): MousePosition => {
  const { width, height } = containerDimensions;
  
  // Functional composition of positioning logic
  const offsetPosition = createTooltipOffset(basePosition);
  
  return {
    x: constrainTooltipX(offsetPosition.x, width),
    y: constrainTooltipY(offsetPosition.y, height),
  };
};