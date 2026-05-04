// Domain-Driven Design types and smart constructors for WordCloud
// Following CLAUDE.md standards: Effect types, smart constructors, no boolean blindness

import { Effect, Data, pipe, Match } from 'effect';

// ============================================================================
// Effect-Based Functional Error Handling
// ============================================================================

// Using Effect for functional composition and error handling

// ============================================================================
// Domain Error Types (Values, not Exceptions)
// ============================================================================

// Using Effect Data for domain errors
export class ValidationError extends Data.TaggedError('ValidationError')<{
  readonly field: string;
  readonly message: string;
  readonly violation: string;
}> {}

export class LayoutError extends Data.TaggedError('LayoutError')<{
  readonly message: string;
  readonly constraints?: string[];
}> {}

// ============================================================================
// Branded Types (Eliminate Primitive Obsession)
// ============================================================================

export type WordText = string & { readonly __brand: 'WordText' };
export type ImportanceValue = number & { readonly __brand: 'ImportanceValue' };

// ============================================================================
// Domain Value Objects with Discriminated Unions (No Boolean Blindness)
// ============================================================================

export type WordCategory = 'strategic' | 'tactical' | 'mindset' | 'implementation';

export type Position = {
  readonly x: number;
  readonly y: number;
};

export type WordDimensions = {
  readonly width: number;
  readonly height: number;
  readonly fontSize: number;
};

export type WordData = {
  readonly text: WordText;
  readonly importance: ImportanceValue;
  readonly category: WordCategory;
};

export type PositionedWord = WordData & {
  readonly position: Position;
  readonly dimensions: WordDimensions;
};

export type LayoutConstraints = {
  readonly width: number;
  readonly height: number;
  readonly padding: number;
  readonly existingWords: readonly PositionedWord[];
};

// ============================================================================
// Discriminated Union for Placement Results (Replaces Boolean Blindness)
// ============================================================================

export type PlacementResult = 
  | { readonly type: 'Success'; readonly position: Position }
  | { readonly type: 'OutOfBounds'; readonly attempted: Position }
  | { readonly type: 'Overlap'; readonly conflictsWith: PositionedWord }
  | { readonly type: 'Failed'; readonly reason: string };

// ============================================================================
// Smart Constructors with Validation (Always Use for Domain Objects)
// ============================================================================

export const createWordText = (input: string): Effect.Effect<WordText, ValidationError> => {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return Effect.fail(new ValidationError({
      field: 'text',
      message: 'Word text cannot be empty',
      violation: 'empty_text'
    }));
  }
  return Effect.succeed(trimmed as WordText);
};

export const createImportanceValue = (input: number): Effect.Effect<ImportanceValue, ValidationError> => {
  if (!Number.isInteger(input)) {
    return Effect.fail(new ValidationError({
      field: 'importance',
      message: 'Importance must be an integer',
      violation: 'non_integer'
    }));
  }
  
  if (input < 1 || input > 100) {
    return Effect.fail(new ValidationError({
      field: 'importance',
      message: 'Importance must be between 1 and 100',
      violation: 'out_of_range'
    }));
  }
  
  return Effect.succeed(input as ImportanceValue);
};

export const createPosition = (x: number, y: number): Effect.Effect<Position, ValidationError> => {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return Effect.fail(new ValidationError({
      field: 'position',
      message: 'Position coordinates must be finite numbers',
      violation: 'non_finite'
    }));
  }
  
  if (x < 0 || y < 0) {
    return Effect.fail(new ValidationError({
      field: 'position',
      message: 'Position coordinates must be non-negative',
      violation: 'negative_coordinates'
    }));
  }
  
  return Effect.succeed({ x, y });
};

export const createWordData = (
  text: string,
  importance: number,
  category: WordCategory
): Effect.Effect<WordData, ValidationError> => {
  return pipe(
    Effect.all([
      createWordText(text),
      createImportanceValue(importance)
    ]),
    Effect.map(([validText, validImportance]) => ({
      text: validText,
      importance: validImportance,
      category
    }))
  );
};

// ============================================================================
// Pure Functions for Business Logic (Functional Core)
// ============================================================================

// ============================================================================
// Font Size Tier System (Discriminated Union - No Boolean Blindness)
// ============================================================================

export type FontSizeTier = 
  | { readonly type: 'Hero'; readonly baseSize: 48; readonly scale: 24; readonly min: 90 }
  | { readonly type: 'Primary'; readonly baseSize: 36; readonly scale: 12; readonly min: 80 }
  | { readonly type: 'Secondary'; readonly baseSize: 28; readonly scale: 8; readonly min: 70 }
  | { readonly type: 'Supporting'; readonly baseSize: 20; readonly scale: 8; readonly min: 60 }
  | { readonly type: 'Context'; readonly baseSize: 14; readonly scale: 6; readonly min: 50 };

// ============================================================================
// Pure Font Size Calculation Functions
// ============================================================================

export const classifyImportanceTier = (importance: ImportanceValue): FontSizeTier => {
  return Match.value(importance).pipe(
    Match.when((i) => i >= 90, (): FontSizeTier => ({ type: 'Hero', baseSize: 48, scale: 24, min: 90 })),
    Match.when((i) => i >= 80, (): FontSizeTier => ({ type: 'Primary', baseSize: 36, scale: 12, min: 80 })),
    Match.when((i) => i >= 70, (): FontSizeTier => ({ type: 'Secondary', baseSize: 28, scale: 8, min: 70 })),
    Match.when((i) => i >= 60, (): FontSizeTier => ({ type: 'Supporting', baseSize: 20, scale: 8, min: 60 })),
    Match.orElse((): FontSizeTier => ({ type: 'Context', baseSize: 14, scale: 6, min: 50 }))
  );
};

export const calculateFontSize = (importance: ImportanceValue, tier: FontSizeTier): number => {
  const progress = (importance - tier.min) / 10; // Normalize to 0-1 range
  const fontSize = tier.baseSize + (progress * tier.scale);
  return Math.round(fontSize); // Ensure integer font sizes for crisp rendering
};

export const calculateTextDimensions = (text: WordText, fontSize: number): { width: number; height: number } => {
  // Pure function: text width approximation optimized for monospace
  // IBM Plex Mono has different character width than default fonts
  const charWidthRatio = 0.55; // Monospace fonts are typically narrower
  const width = text.length * fontSize * charWidthRatio;
  const height = fontSize * 1.3; // Slightly more height for better readability
  
  return { width, height };
};

// ============================================================================
// Composed Word Dimensions Calculation (Pure Function)
// ============================================================================

export const calculateWordDimensions = (word: WordData): WordDimensions => {
  return pipe(
    word.importance,
    (importance) => {
      const tier = classifyImportanceTier(importance);
      const fontSize = calculateFontSize(importance, tier);
      const { width, height } = calculateTextDimensions(word.text, fontSize);
      
      return {
        width,
        height,
        fontSize,
      };
    }
  );
};

export const isWithinBounds = (
  position: Position,
  dimensions: WordDimensions,
  constraints: LayoutConstraints
): boolean => {
  const { x, y } = position;
  const { width, height } = dimensions;
  const { width: maxWidth, height: maxHeight, padding } = constraints;
  
  return (
    x - width / 2 >= padding &&
    x + width / 2 <= maxWidth - padding &&
    y - height / 2 >= padding &&
    y + height / 2 <= maxHeight - padding
  );
};

export const hasOverlapWith = (
  position: Position,
  dimensions: WordDimensions,
  existingWord: PositionedWord
): boolean => {
  const dx = Math.abs(position.x - existingWord.position.x);
  const dy = Math.abs(position.y - existingWord.position.y);
  
  const minDistanceX = (dimensions.width + existingWord.dimensions.width) / 2 + 20; // Increased padding
  const minDistanceY = (dimensions.height + existingWord.dimensions.height) / 2 + 15; // Increased padding
  
  return dx < minDistanceX && dy < minDistanceY;
};

// ============================================================================
// Placement Validation Functions (Pure - No Loops)
// ============================================================================

export const validateBounds = (
  position: Position,
  dimensions: WordDimensions,
  constraints: LayoutConstraints
): PlacementResult | null => {
  return isWithinBounds(position, dimensions, constraints) 
    ? null 
    : { type: 'OutOfBounds', attempted: position };
};

export const findOverlappingWord = (
  position: Position,
  dimensions: WordDimensions,
  existingWords: readonly PositionedWord[]
): PositionedWord | null => {
  return existingWords.find(word => 
    hasOverlapWith(position, dimensions, word)
  ) ?? null;
};

export const validateOverlaps = (
  position: Position,
  dimensions: WordDimensions,
  constraints: LayoutConstraints
): PlacementResult | null => {
  const overlappingWord = findOverlappingWord(position, dimensions, constraints.existingWords);
  return overlappingWord 
    ? { type: 'Overlap', conflictsWith: overlappingWord }
    : null;
};

// ============================================================================
// Composed Placement Validation (Functional Chain)
// ============================================================================

export const checkPlacement = (
  position: Position,
  dimensions: WordDimensions,
  constraints: LayoutConstraints
): PlacementResult => {
  return pipe(
    // Check bounds first (early return pattern)
    validateBounds(position, dimensions, constraints),
    (boundsResult) => boundsResult ? boundsResult : validateOverlaps(position, dimensions, constraints),
    (validationResult) => validationResult || { type: 'Success', position }
  );
};

// ============================================================================
// Functional Position Generation (Replaces Imperative Loops)
// ============================================================================

export const generateSpiralPositions = (
  centerX: number,
  centerY: number,
  maxAttempts = 200
): readonly Position[] => {
  return pipe(
    Array.from({ length: maxAttempts }, (_, attempt) => attempt),
    (attempts) => attempts.map((attempt) => {
      const angle = attempt * 0.618; // Golden ratio for better distribution
      const radius = Math.sqrt(attempt) * 12; // Increased radius spacing
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    })
  );
};

export const findValidPosition = (
  word: WordData,
  constraints: LayoutConstraints
): Effect.Effect<PlacementResult, LayoutError> => {
  const dimensions = calculateWordDimensions(word);
  const centerX = constraints.width / 2;
  const centerY = constraints.height / 2;
  
  // Functional approach: generate positions and find first valid one
  const positions = generateSpiralPositions(centerX, centerY);
  
  return pipe(
    Effect.succeed(positions),
    Effect.map((positions) => {
      const validPlacement = positions
        .map((position) => checkPlacement(position, dimensions, constraints))
        .find((result) => result.type === 'Success');
      
      return validPlacement || {
        type: 'Failed',
        reason: 'No valid position found within constraints'
      } as PlacementResult;
    })
  );
};

// ============================================================================
// Functional Word Placement (Eliminates Imperative Loop)
// ============================================================================

const createFallbackPosition = (
  word: WordData,
  constraints: LayoutConstraints,
  attemptIndex: number
): PositionedWord => {
  const fallbackAngle = attemptIndex * 0.618; // Golden ratio
  const fallbackRadius = 150 + (attemptIndex % 3) * 80; // Increased radius
  const fallbackX = constraints.width / 2 + Math.cos(fallbackAngle) * fallbackRadius;
  const fallbackY = constraints.height / 2 + Math.sin(fallbackAngle) * fallbackRadius;
  
  const dimensions = calculateWordDimensions(word);
  
  // Ensure fallback position is within bounds
  const boundedX = Math.max(dimensions.width / 2 + 20, Math.min(fallbackX, constraints.width - dimensions.width / 2 - 20));
  const boundedY = Math.max(dimensions.height / 2 + 20, Math.min(fallbackY, constraints.height - dimensions.height / 2 - 20));
  
  return {
    ...word,
    position: { x: boundedX, y: boundedY },
    dimensions
  };
};

const placeWord = (
  word: WordData,
  constraints: LayoutConstraints,
  attemptIndex: number
): Effect.Effect<PositionedWord, LayoutError> => {
  return pipe(
    findValidPosition(word, constraints),
    Effect.map((placementResult) => 
      Match.value(placementResult).pipe(
        Match.when({ type: 'Success' }, ({ position }) => {
          const dimensions = calculateWordDimensions(word);
          return {
            ...word,
            position,
            dimensions
          };
        }),
        Match.orElse(() => createFallbackPosition(word, constraints, attemptIndex))
      )
    )
  );
};

export const createWordCloud = (
  words: readonly WordData[],
  constraints: LayoutConstraints
): Effect.Effect<readonly PositionedWord[], LayoutError> => {
  // Sort by importance for better layout (higher importance words placed first)
  const sortedWords = [...words].sort((a, b) => b.importance - a.importance);
  
  return pipe(
    Effect.succeed([] as PositionedWord[]),
    Effect.flatMap((acc) => 
      Effect.reduce(
        sortedWords,
        acc,
        (positionedWords, word, index) => {
          const currentConstraints: LayoutConstraints = {
            ...constraints,
            existingWords: positionedWords
          };
          
          return pipe(
            placeWord(word, currentConstraints, index),
            Effect.map((positionedWord) => [...positionedWords, positionedWord])
          );
        }
      )
    )
  );
};

// ============================================================================
// Helper Functions for Validation (Not used in tests but required for completeness)
// ============================================================================

export const validatePlacement = (
  word: PositionedWord,
  constraints: LayoutConstraints
): Effect.Effect<PositionedWord, ValidationError> => {
  const placementResult = checkPlacement(word.position, word.dimensions, constraints);
  
  if (placementResult.type === 'Success') {
    return Effect.succeed(word);
  }
  
  return Effect.fail(new ValidationError({
    field: 'placement',
    message: `Word placement invalid: ${placementResult.type}`,
    violation: placementResult.type.toLowerCase()
  }));
};